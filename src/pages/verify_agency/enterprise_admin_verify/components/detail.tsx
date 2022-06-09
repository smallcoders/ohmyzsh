import { message, Image, Button, Form, Space } from 'antd';

import React, { useState, useEffect } from 'react';

import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { history } from 'umi';
import VerifyInfoDetail, { VerifyListText } from './verify_info_detail/verify-info-detail';
import CommonTitle from './verify_steps/common_title/common-title';
import VerifyDescription from './verify_steps/verify_description/verify-description';
import Common from '@/types/common.d';
import type EnterpriseAdminVerify from '@/types/enterprise-admin-verify.d';
import {
  getEnterpriseAdminVerifyDetail,
  handleAuditEnterpriseAdminVerify,
} from '@/services/enterprise-admin-verify';
import { PageContainer } from '@ant-design/pro-layout';
import { accountTypeObj } from '..';

const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [detail, setDetail] = useState<EnterpriseAdminVerify.Detail>({});
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<any>([]);
  const id = history.location.query?.id as string;
  // const getDictionary = async () => {
  //   try {
  //     const enumsRes = await Promise.all([
  //       getEnumByName('CREATIVE_ACHIEVEMENT_CATEGORY_ENUM'), // 成果类别
  //       getEnumByName('CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM'), // 属性
  //       getEnumByName('CREATIVE_MATURITY_ENUM'), // 成熟度
  //       getEnumByName('CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM'), // 技术领域
  //       getEnumByName('TRANSFER_TYPE_ENUM'), // 技术转换
  //     ]);
  //     setEnums({
  //       CREATIVE_ACHIEVEMENT_CATEGORY_ENUM: enumsRes[0].result,
  //       CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM: enumsRes[1].result,
  //       CREATIVE_MATURITY_ENUM: enumsRes[2].result,
  //       CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM: enumsRes[3].result,
  //       TRANSFER_TYPE_ENUM: enumsRes[4].result,
  //     });
  //   } catch (error) {
  //     message.error('服务器错误');
  //   }
  // };

  const prepare = async () => {
    if (id) {
      try {
        const res = await getEnterpriseAdminVerifyDetail(id);
        if (res.code === 0) {
          setDetail(res.result);
          setLoading(false);

          setList(
            res?.result?.auditList?.map(
              (item: {
                auditor: string;
                stateEnum: string;
                auditTime: string | undefined;
                reason: string | undefined;
              }) => {
                return {
                  title: (
                    <CommonTitle
                      title={item.auditor}
                      detail={VerifyListText[item.stateEnum] || ''}
                      time={item.auditTime}
                      special={
                        item.stateEnum === Common.AuditStatus.AUDIT_PASSED ||
                        item.stateEnum === Common.AuditStatus.AUDIT_REJECTED
                      }
                      reason={item.reason}
                      color={item.stateEnum === Common.AuditStatus.AUDIT_REJECTED ? '#FF65B3' : ''}
                    />
                  ),
                  description:
                    item.stateEnum === Common.AuditStatus.AUDITING ? (
                      <VerifyDescription form={form} />
                    ) : null,
                  state: item.stateEnum,
                };
              },
            ),
          );
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        message.error('服务器错误');
      }
    }
  };

  useEffect(() => {
    prepare();
  }, [id]);

  // 提交
  const onSave = async () => {
    form
      .validateFields()
      .then(async (value) => {
        const tooltipMessage = '提交';
        const submitRes = await handleAuditEnterpriseAdminVerify({
          id,
          ...value,
        });
        if (submitRes.code === 0) {
          message.success(`${tooltipMessage}成功`);
          form.resetFields();
          prepare();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${submitRes.message}}`);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    // <Drawer
    //   width={800}
    //   title="详情"
    //   placement="right"
    //   visible={visible}
    //   onClose={() => setVisible(false)}
    // >
    <PageContainer loading={loading}>
      <div className={sc('container')}>
        <div className={sc('container-title')}>申请信息</div>
        <div className={sc('container-desc')}>
          <span>申请人姓名：</span>
          <span>{detail?.userName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>手机号：</span>
          <span>{detail?.phone || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>组织类型：</span>
          <span>
            {Object.prototype.hasOwnProperty.call(accountTypeObj, detail?.accountType || '')
              ? accountTypeObj[detail?.accountType || '']
              : '--'}
          </span>
        </div>
        <div className={sc('container-desc')}>
          <span>组织名称：</span>
          <span>{detail?.orgName || '--'}</span>
        </div>
        {detail?.accountType === Common.OrgType.ENTERPRISE && (
          <>
            <div className={sc('container-desc')}>
              <span>法人姓名：</span>
              <span>{detail?.legalName || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span>法人身份证号：</span>
              <span>{detail?.legalCardNumber || '--'}</span>
            </div>
          </>
        )}
        <div className={sc('container-desc')}>
          <span>企业注册区域：</span>
          <span>{detail?.orgAddress || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>企业营业执照：</span>
          <div>
            {detail?.licenseUrl ? (
              <Image height={200} width={300} src={detail?.licenseUrl} />
            ) : (
              '--'
            )}
          </div>
        </div>
        {detail?.auditList?.length !== 0 && (
          <div className={sc('container-desc')}>
            <span>认证公函：</span>
            <div>
              {detail?.officialLetter ? (
                <Image height={200} width={300} src={detail?.officialLetter} />
              ) : (
                '--'
              )}
            </div>
          </div>
        )}
      </div>
      <div style={{ background: '#fff', margin: '20px 0', paddingTop: 20 }}>
        <VerifyInfoDetail list={list || []} form={form} reset={prepare} />
        <Space size={20} style={{ margin: '0 0 20px 100px' }}>
          {detail?.auditList?.[0]?.stateEnum == Common.AuditStatus.AUDITING && (
            <Button type="primary" className={'content-btns-save-btn'} onClick={onSave}>
              提交
            </Button>
          )}
          <Button
            className={'content-btns-back-btn'}
            onClick={() => {
              history.goBack();
            }}
          >
            返回
          </Button>
        </Space>
      </div>
    </PageContainer>
  );
};
