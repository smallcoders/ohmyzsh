import React, { useCallback, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Avatar, Menu, message, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import type { MenuInfo } from 'rc-menu/lib/interface';
import type Common from '@/types/common';
import { logout } from '@/services/login';
import { updateMyNameAndPhone, updateMyPassword } from '@/services/manager';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await logout();
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [editAccountModalVisible, setEditAccountModalVisible] = useState<boolean>(false);
  const [editPasswordModalVisible, setEditPasswordModalVisible] = useState<boolean>(false);

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      } else if (key === 'modifyAccount') {
        setEditAccountModalVisible(true);
      } else if (key === 'modifyPwd') {
        setEditPasswordModalVisible(true);
      }
      //history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const handleModify = async (
    isModiifyAccount: boolean,
    params: {
      name?: string;
      phone?: string;
      oldPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    },
  ) => {
    try {
      const result: Common.ResultCode = isModiifyAccount
        ? await updateMyNameAndPhone(params)
        : await updateMyPassword(params);
      if (result.code === 0) {
        message.success(`${isModiifyAccount ? '修改账号信息' : '修改密码'}成功`);
        setEditAccountModalVisible(false);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error(`${isModiifyAccount ? '修改账号信息' : '修改密码'}失败，请重试！`);
    }
  };

  const renderEditAccountModal = () => {
    return (
      editAccountModalVisible && (
        <ModalForm
          title={'修改账号信息'}
          width="400px"
          visible={editAccountModalVisible}
          onVisibleChange={setEditAccountModalVisible}
          onFinish={async (value) => await handleModify(true, value)}
        >
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="md"
            name="name"
            label="姓名"
          />
          <ProFormText
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="md"
            name="phone"
            label="联系方式"
          />
        </ModalForm>
      )
    );
  };

  const renderEditPasswordModal = () => {
    return (
      editPasswordModalVisible && (
        <ModalForm
          title={'修改密码'}
          width="400px"
          visible={editPasswordModalVisible}
          onVisibleChange={setEditPasswordModalVisible}
          onFinish={async (value) => await handleModify(false, value)}
        >
          <ProFormText.Password
            rules={[{ required: true }, { type: 'string', max: 35 }]}
            width="md"
            name="oldPassword"
            placeholder="旧密码"
          />
          <ProFormText.Password
            rules={[{ required: true }, { type: 'string', min: 8 }, { type: 'string', max: 20 }]}
            width="md"
            name="newPassword"
            placeholder="新密码，8～20位密码，区分大小写"
          />
          <ProFormText.Password
            rules={[{ required: true }]}
            width="md"
            name="confirmPassword"
            placeholder="确认新密码"
          />
        </ModalForm>
      )
    );
  };

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="info">
        <div style={{ paddingTop: 5 }}>
          <p style={{ marginBottom: 5 }}>
            {currentUser.type === 'MANAGER' ? '运营' : '运营管理员'}
          </p>
          <p className={styles.user}>{currentUser.name}</p>
          <p className={styles.user}>{currentUser.phone}</p>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="modifyAccount">修改账号信息</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="modifyPwd">修改密码</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">退出登录</Menu.Item>
    </Menu>
  );
  return (
    <div>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="default" className={styles.avatar} icon={<UserOutlined />} alt="avatar" />
          <span className={`${styles.name} anticon`}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
      {renderEditAccountModal()}
      {renderEditPasswordModal()}
    </div>
  );
};

export default AvatarDropdown;
