import React, { useEffect, useState } from 'react';
import VerifyStepsDetail from '@/components/verify_steps';
import CommonTitle from '@/components/verify_steps/common_title';
import Common from '@/types/common.d';
import { handleAudit, httpGetAuditList } from '@/services/audit';
import VerifyDescription from '../verify_steps/verify_description/verify-description';
import { Button, Form, message } from 'antd';
// import { httpGetAuditList } from '@/service/http_request'
// 审核详情列表状态文本
export const VerifyListText = {
  [Common.AuditStatus.AUDIT_PASSED]: '审核通过',
  [Common.AuditStatus.AUDIT_REJECTED]: '审核拒绝',
  [Common.AuditStatus.AUDIT_SUBMIT]: '审核提交',
};

export default (props: {
  auditId?: string;
  reset?: () => void;
  before?: (state: Common.AuditStatus) => React.ReactNode;
}) => {
  const { auditId = '', reset } = props || {};
  const [list, setList] = useState<any>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const hanldeGetAuditDetail = async () => {
    if (!auditId) return;
    try {
      const res = await httpGetAuditList({ auditId });
      if (res?.code === 0) {
        const result = res?.result;
        if (!result) return;
        setList(
          result.map(
            (item: {
              userName: string;
              state: string;
              operationTime: string | undefined;
              description: string | undefined;
            }) => {
              return {
                title: (
                  <CommonTitle
                    title={item.userName}
                    detail={VerifyListText[item.state] || ''}
                    time={item.operationTime}
                    special={
                      item.state === Common.AuditStatus.AUDIT_PASSED ||
                      item.state === Common.AuditStatus.AUDIT_REJECTED
                    }
                    reason={item.description}
                    color={item.state === Common.AuditStatus.AUDIT_REJECTED ? '#FF65B3' : ''}
                  />
                ),
                description:
                  item.state === Common.AuditStatus.AUDITING ? (
                    <VerifyDescription form={form} />
                  ) : null,
                state: item.state,
              };
            },
          ),
        );
      } else {
        console.log('获取审核信息列表失败');
      }
    } catch {
      console.log('获取审核信息列表失败');
    }
  };

  useEffect(() => {
    hanldeGetAuditDetail();
  }, [auditId]);

  const refresh = () => {
    reset?.();
    hanldeGetAuditDetail();
  };

  const onBack = () => {
    history.back();
  };

  // 提交
  const onSave = async () => {
    form
      .validateFields()
      .then(async (value) => {
        setLoading(true);
        const tooltipMessage = '提交';
        const submitRes = await handleAudit({
          auditId: auditId,
          ...value,
        });
        if (submitRes.code === 0) {
          message.success(`${tooltipMessage}成功`);
          form.resetFields();
          refresh();
          onBack();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${submitRes.message}}`);
        }
        setLoading(false);
      })
      .catch(() => {});
  };

  return (
    <div style={{ paddingLeft: 100 }}>
      {props.before && props.before(list && list.length > 0 && list[0].state)}
      <VerifyStepsDetail list={list} />
      {list && list.length > 0 && list[0].state === Common.AuditStatus.AUDITING && (
        <div style={{ display: 'flex', gap: 20, padding: 20 }}>
          <Button
            loading={loading}
            type="primary"
            className={'content-btns-save-btn'}
            onClick={onSave}
          >
            提交
          </Button>
          <Button className={'content-btns-back-btn'} onClick={onBack}>
            返回
          </Button>
        </div>
      )}
    </div>
  );
};
