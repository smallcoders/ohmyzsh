import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import { encryptWithBase64, decryptWithBase64 } from '@/utils/crypto';
import Footer from '@/components/Footer';
import { getTicket, login } from '@/services/login';
import type Login from '@/types/login';
import styles from './index.less';

const localStorageKey = 'login.remember.account';
const defaultLoginStatus = { success: true, message: '' };

const LoginFC: React.FC = () => {
  const [userLoginState, setUserLoginState] =
    useState<{ success: boolean; message?: string }>(defaultLoginStatus);
  const { initialState, setInitialState } = useModel('@@initialState');
  const storedAccountRef = useRef<Login.LoginParam>(
    JSON.parse(localStorage.getItem(localStorageKey) || '{}'),
  );

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: Login.LoginParam) => {
    setUserLoginState(defaultLoginStatus);
    const { loginNameOrPhone = '', password = '', storeAccount } = values;

    // 获取登录ticket
    const ticketRes = await getTicket({ loginNameOrPhone, password: encryptWithBase64(password) });
    if (ticketRes.code !== 0) {
      setUserLoginState({ success: false, message: ticketRes.message });
      return;
    }
    try {
      // 登录
      const loginParam: Login.LoginParam = {
        ticket: ticketRes.result.ticket,
        storeAccount,
      };
      const loginResult = await login(loginParam);
      if (loginResult.code === 0) {
        // message.success('登录成功！');
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        // 记录账号
        if (storeAccount) {
          localStorage.setItem(
            localStorageKey,
            JSON.stringify({
              storeAccount: true,
              loginNameOrPhone: loginParam.loginNameOrPhone,
            }),
          );
        } else {
          localStorage.removeItem(localStorageKey);
        }
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState({ success: false, message: loginResult.message });
    } catch (error) {
      console.log(error);
      message.error('登录失败，请重试！');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          title="羚羊管理运营平台"
          initialValues={{
            ...storedAccountRef.current,
            password: decryptWithBase64(storedAccountRef.current.password || ''),
          }}
          onChange={() => setUserLoginState(defaultLoginStatus)}
          onFinish={async (values) => {
            await handleSubmit(values as Login.LoginParam);
          }}
        >
          {/*站位坑*/}
          <div style={{ position: 'absolute', top: -10000 }}>
            <input id="loginNameOrPhone" name="loginNameOrPhone" />
            <input id="password" name="password" type="password" />
          </div>

          <div style={{ marginBottom: 50 }} />
          <ProFormText
            name="loginNameOrPhone"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder={'账号'}
            rules={[
              {
                required: true,
                message: '请输入账号',
              },
            ]}
          />
          <div style={{ position: 'relative' }}>
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            {!userLoginState.success && (
              <p style={{ position: 'absolute', top: 40, color: '#ff4d4f' }}>
                {userLoginState.message}
              </p>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginTop: 30,
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="storeAccount">
              记住账号
            </ProFormCheckbox>
            <Tooltip title="请联系运营管理员/相关工作人员找回">{'忘记账号/密码'}</Tooltip>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default LoginFC;
