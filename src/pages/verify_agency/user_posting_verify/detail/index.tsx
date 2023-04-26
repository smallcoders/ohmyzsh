import { Button, message, Avatar, Space, Popconfirm, Form, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { UserOutlined } from '@ant-design/icons';
import {
  httpEnterpriseDetail,
  httpEnterpriseAudit,
  httpEnterprisePublishRecommend,
} from '@/services/user-posting';
import { routeName } from '../../../../../config/routes';

const sc = scopedClasses('verify-user-posting-detail');
// 内容类型
const contentType = {
  '1': '供需简讯',
  '2': '企业动态',
  '3': '经验分享',
  '4': '供需简讯',
  '5': '供需简讯',
};
// 审核状态
const auditStatus = {
  '0': '草稿',
  '1': '待审核',
  '2': '审核通过',
  '3': '审核不通过',
};
const operaObj = {
  ADD: '新增',
  MODIFY: '修改',
  DOWN: '下架',
  UP: '上架',
  DELETE: '删除',
  TOPPING: '置顶',
  CANCEL_TOPPING: '取消置顶',
  AUDIT: '自动审核',
  STAGING: '暂存',
  AUDIT_PASS: '审核通过',
  AUDIT_NOT_PASS: '审核不通过',
  RECOMMEND: '推荐',
  CANCEL_RECOMMEND: '取消推荐',
};
export default () => {
  const formLayout = {
    // labelCol: { span: 2 },
    wrapperCol: { span: 24 },
  };
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { id } = history.location.query as any;
  const access = useAccess();
  const [detail, setDetail] = useState<any>();
  // 操作日志
  const [associationLog, setAssociationLog] = useState<any>([]);
  // 初始化
  const perpaer = async () => {
    if (!id) return;
    try {
      const res = await httpEnterpriseDetail(id);
      if (res?.code === 0) {
        setDetail(res?.result);
        setAssociationLog(res?.result?.operationRecords);
      } else {
        message.error(`获取详情失败:${res?.message}`);
      }
    } catch (error) {
      message.error(`获取详情失败 ${error}`);
    }
  };
  useEffect(() => {
    perpaer();
    console.log('详情的路径参数', id);
  }, []);

  // 不通过
  const noPass = async (id: string) => {
    return new Promise((resolve, reject) => {
      form
        .validateFields()
        .then(async (values: any) => {
          console.log('搜集的表单', values);
          try {
            const res = await httpEnterpriseAudit({
              id: Number(id),
              auditStatus: 3,
              auditReason: values?.auditReason,
            });
            if (res.code === 0) {
              message.success('审核不通过完成');
              perpaer();
              resolve('成功');
            } else {
              message.error(`失败，原因:{${res.message}}`);
              resolve('失败');
            }
          } catch (error) {
            console.log(error);
            resolve('失败');
          }
        })
        .catch(() => {
          reject('失败');
        });
    });
  };

  // 审核
  const audit = async (id: string, state: any) => {
    if (state === 1) {
      // 多一个推荐
      try {
        const res = await httpEnterprisePublishRecommend({
          id: Number(id),
          recommend: true,
        });
        if (res?.code === 0) {
          message.success('推荐成功');
        } else {
          message.success(`推荐失败: ${res?.message}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    try {
      const res = await httpEnterpriseAudit({
        id: Number(id),
        auditStatus: 2,
      });
      if (res.code === 0) {
        message.success('审核通过');
        perpaer();
      } else {
        message.error(`失败，原因:{${res?.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageContainer
      className={sc('container')}
      footer={[
        // 待审核 通过 不通过 返回
        detail?.auditStatus === 1 && (
          <Space size="middle">
            <Access accessible={access['P_AT_YHFBSH']}>
              <Popconfirm
                icon={null}
                title={
                  <div className={sc('container-table-popconfirm')}>
                    <div className={sc('container-table-popconfirm-title')}>确定审核通过？</div>
                    <div className={sc('container-table-popconfirm-content')}>
                      点击“通过并推荐”可将该内容上架到“推荐”页面
                    </div>
                  </div>
                }
                okText="通过并推荐"
                cancelText="通过"
                // 根据接口改
                onConfirm={() => audit(id.toString(), 1)}
                onCancel={() => audit(id.toString(), 2)}
              >
                <Button type="primary">通过</Button>
              </Popconfirm>
            </Access>
            <Access accessible={access['P_AT_YHFBSH']}>
              <Popconfirm
                icon={null}
                // visible={visible}
                title={
                  <React.Fragment>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>不通过</div>
                    <Form form={form} {...formLayout} validateTrigger="onBlur">
                      <Form.Item
                        name="auditReason"
                        rules={[{ required: true, message: '请填写原因' }]}
                      >
                        <TextArea placeholder="请输入原因(必填)" rows={3} maxLength={50} />
                      </Form.Item>
                    </Form>
                  </React.Fragment>
                }
                okText="确定"
                cancelText="取消"
                onConfirm={() => noPass(id.toString())}
                // onCancel={() => visible= false}
              >
                <Button type="primary" onClick={() => form.resetFields()}>
                  不通过
                </Button>
              </Popconfirm>
            </Access>
            <Button
              onClick={() => {
                // history.goBack();
                history.push(`${routeName.VERIFY_AGENCY_USER_POSTING_VERIFY_INDEX}`)
              }}
            >
              返回
            </Button>
          </Space>
        ),
        // 审核通过 和 审核 不通过 
        (detail?.auditStatus === 2 || detail?.auditStatus === 3) && (
          <Space size="middle">
            <Button
              onClick={() => {
                // history.goBack();
                history.push(`${routeName.VERIFY_AGENCY_USER_POSTING_VERIFY_INDEX}`)
              }}
            >
              返回
            </Button>
          </Space>
        )
      ]}
    >
      <div className={sc('container-content')}>
        <div className={sc('container-content-title')}>发布内容</div>
        <div className={sc('container-content-desc')}>
          <span>内容：</span>
          <span>{detail?.content || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>标题：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>关联话题：</span>
          <span>{detail?.topic || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>内容类型：</span>
          <span>{(detail?.publishType && contentType[detail?.publishType]) || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>链接：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>发布时间：</span>
          <span>{moment(detail?.publishTime).format('YYYY-MM-DD HH:mm') || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>图片：</span>
          <div>
            {/* 根据后端接口调整 */}
            {!detail?.fileIds && <span>--</span>}
            {detail?.fileIds &&
              detail?.fileIds?.map((id: any, index: any) => {
                return (
                  <img
                    style={{ width: 200, height: 200, marginRight: '5px' }}
                    src={`/antelope-common/common/file/download/${id}`}
                    alt="图片损坏"
                    key={index}
                  />
                );
              })}
          </div>
        </div>
        <div className={sc('container-content-desc')}>
          <span>审核状态：</span>
          <span>{(detail?.auditStatus && auditStatus[detail?.auditStatus]) || '--'}</span>
        </div>
      </div>
      <div className={sc('container-publisher')}>
        <div className={sc('container-publisher-title')}>发布人信息</div>
        <div className={sc('container-publisher-desc')}>
          <span>发布用户：</span>
          <span>{detail?.userInfo?.userName || '--'}</span>
        </div>
        <div className={sc('container-publisher-desc')}>
          <span>所属组织：</span>
          <span>{detail?.userInfo?.orgName || '--'}</span>
        </div>
        <div className={sc('container-publisher-desc')}>
          <span>联系方式：</span>
          <span>{detail?.userInfo?.phone || '--'}</span>
        </div>
      </div>
      {associationLog && (
        <div className={sc('container-topic')}>
          <div className={sc('container-topic-title')}>操作日志</div>
          <div className="operation-log">
            {associationLog?.map((p: any) => {
              return (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '150px 150px 150px',
                    gap: 50,
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <Avatar icon={<UserOutlined />} />
                    <span style={{ marginLeft: 10 }}>{p?.userName}</span>
                  </div>

                  <div style={{ display: 'grid' }}>
                    <span style={{ color: p?.autoAuditResult ? 'red' : 'initial' }}>
                      {operaObj[p?.operation] || '--'}
                    </span>
                    {p?.autoAuditResult && (
                      <span style={{ color: 'red' }}>{p?.autoAuditResult}</span>
                    )}
                  </div>

                  <span>
                    {p?.createTime ? moment(p?.createTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PageContainer>
  );
};
