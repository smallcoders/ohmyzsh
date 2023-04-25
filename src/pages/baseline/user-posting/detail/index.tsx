import { Button, message, Avatar, Space, Popconfirm, Form, Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import {
  httpEnterpriseDetail,
  httpEnterprisePublishRecommend,
  httpEnterprisePublishDown,
} from '@/services/user-posting';
import { UserOutlined } from '@ant-design/icons';

const sc = scopedClasses('baseline-user-posting-detail');

// 内容类型
const contentType = {
  '1': '供需简讯',
  '2': '企业动态',
  '3': '经验分享',
  '4': '供需简讯',
  '5': '供需简讯',
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
    labelCol: { span: 6 },
    wrapperCol: { span: 20 },
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
      }
    } catch (error) {
      message.error(`获取用户发布管理详情失败： ${error}`);
    }
  };
  useEffect(() => {
    perpaer();
    console.log('详情的路径参数', id);
  }, []);

  // 推荐/取消推荐
  const recommend = async (id: string, state: any) => {
    try {
      const removeRes = await httpEnterprisePublishRecommend({
        id: Number(id),
        recommend: state,
      });
      if (removeRes.code === 0) {
        message.success(`${state ? '推荐' : '取消推荐'}成功`);
        perpaer(); // 刷新
      } else {
        message.error(`推荐失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 上/下架
  const soldOut = async (id: string, state: any) => {
    // state 0 下架 1 上架
    // 区分一下上架还是下架
    return new Promise((resolve, reject) => {
      form
        .validateFields()
        .then(async (values: any) => {
          console.log('搜集的表单', values);
          try {
            const res = await httpEnterprisePublishDown({
              id: Number(id),
              status: state,
              auditReason: values?.auditReason
            });
            if (res.code === 0) {
              message.success(state === 0 ? '下架成功' : '上架成功');
              resolve('成功');
              perpaer(); // 刷新
            } else {
              message.error(`失败，原因:{${res.message}}`);
              reject('失败');
            }
          } catch (error) {
            console.log(error);
          }
        })
        .catch(() => {
          reject('失败');
        });
    });
  };

  return (
    <PageContainer
      className={sc('container')}
      footer={[
        // 下架 且 已推荐 取消推荐 上架  返回
        detail?.status === 0 && detail?.recommend && (
          <Space size="middle">
            <Access accessible={access['P_BLM_YHFBGL']}>
              <Popconfirm
                // icon={null}
                title="确定将内容取消推荐？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => recommend(id.toString(), false)}
              >
                <Button type="primary">取消推荐</Button>
              </Popconfirm>
            </Access>
            <Access accessible={access['P_BLM_YHFBGL']}>
              <Popconfirm
                // icon={null}
                title="确定上架么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => soldOut(id.toString(), 1)}
              >
                <Button type="primary">上架</Button>
              </Popconfirm>
            </Access>
            <Button
              style={{ marginRight: '40px' }}
              onClick={() => {
                history.goBack();
              }}
            >
              返回
            </Button>
          </Space>
        ),
        // 下架 且 未推荐
        detail?.status === 0 && !detail?.recommend && (
          <Space size="middle">
            <Access accessible={access['P_BLM_YHFBGL']}>
              <Popconfirm
                // icon={null}
                title="确定将内容在推荐列表中进行展示？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => recommend(id.toString(), true)}
              >
                <Button type="primary">推荐</Button>
              </Popconfirm>
            </Access>
            <Access accessible={access['P_BLM_YHFBGL']}>
              <Popconfirm
                // icon={null}
                title="确定上架么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => soldOut(id.toString(), 1)}
              >
                <Button type="primary">上架</Button>
              </Popconfirm>
            </Access>
            <Button
              style={{ marginRight: '40px' }}
              onClick={() => {
                history.goBack();
              }}
            >
              返回
            </Button>
          </Space>
        ),
        // 上架 且 已推荐
        detail?.status === 1 && detail?.recommend && (
          <Space size="middle">
            <Access accessible={access['P_BLM_YHFBGL']}>
              <Popconfirm
                // icon={null}
                title="确定将内容取消推荐？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => recommend(id.toString(), false)}
              >
                <Button type="primary">取消推荐</Button>
              </Popconfirm>
            </Access>
            <Access accessible={access['P_BLM_YHFBGL']}>
              <Popconfirm
                icon={null}
                title={
                  <React.Fragment>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>下架原因</div>
                    <Form form={form} {...formLayout} validateTrigger="onBlur">
                      <Form.Item name="原因" rules={[{ required: true, message: '请填写原因' }]}>
                        <TextArea placeholder="请输入原因(必填)" rows={3} maxLength={50} />
                      </Form.Item>
                    </Form>
                  </React.Fragment>
                }
                okText="下架"
                cancelText="取消"
                onConfirm={() => soldOut(id.toString(), 0)}
              >
                <Button type="primary" onClick={() => form.resetFields()}>
                  下架
                </Button>
              </Popconfirm>
            </Access>
            <Button
              style={{ marginRight: '40px' }}
              onClick={() => {
                history.goBack();
              }}
            >
              返回
            </Button>
          </Space>
        ),
        // 上架 且 未推荐
        detail?.status === 1 && !detail?.recommend && (
          <Space size="middle">
            <Access accessible={access['P_BLM_YHFBGL']}>
              <Popconfirm
                // icon={null}
                title="确定将内容在推荐列表中进行展示？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => recommend(id.toString(), true)}
              >
                <Button type="primary">推荐</Button>
              </Popconfirm>
            </Access>
            <Access accessible={access['P_BLM_YHFBGL']}>
              <Popconfirm
                icon={null}
                title={
                  <React.Fragment>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>下架原因</div>
                    <Form form={form} {...formLayout} validateTrigger="onBlur">
                      <Form.Item name="原因" rules={[{ required: true, message: '请填写原因' }]}>
                        <TextArea placeholder="请输入原因(必填)" rows={3} maxLength={50} />
                      </Form.Item>
                    </Form>
                  </React.Fragment>
                }
                okText="下架"
                cancelText="取消"
                onConfirm={() => soldOut(id.toString(), 0)}
              >
                <Button type="primary" onClick={() => form.resetFields()}>
                  下架
                </Button>
              </Popconfirm>
            </Access>
            <Button
              style={{ marginRight: '40px' }}
              onClick={() => {
                history.goBack();
              }}
            >
              返回
            </Button>
          </Space>
        ),
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
          {/* <span>{detail?.title || '--'}</span> */}
          <span>{'--'}</span>
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
          <span>上架状态：</span>
          <span>{detail?.status === 1 ? '上架' : '下架' || '--'}</span>
        </div>
        <div className={sc('container-content-desc')}>
          <span>推荐状态：</span>
          <span>{detail?.recommend ? '已推荐' : '未推荐' || '--'}</span>
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
            {associationLog.map((p: any) => {
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
