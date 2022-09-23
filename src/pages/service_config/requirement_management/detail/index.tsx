import { message, Image, Timeline, Form, Button, DatePicker, Input, Space, Table } from 'antd';
import { MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { history } from 'umi';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { routeName } from '../../../../../config/routes';
import {
  getOfficeRequirementVerifyDetail,
  addConnectRecord,
  getConnectRecord,
  deleteConnectRecord, // 对接记录列表
} from '@/services/office-requirement-verify';
const { Column } = Table;
const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});
  const [timeLineData, setTimeLineData] = useState<any>([]);

  // 判断是否从节点维护点击来的
  const isEdit = history.location.query?.isEdit ? true : false;

  const connectAdd = async () => {
    const id = history.location.query?.id as string;
    const connectRes = await getConnectRecord(id);
    if (connectRes.code == 0) {
      setTimeLineData(connectRes.result);
    }
  };

  const prepare = async () => {
    const id = history.location.query?.id as string;

    if (id) {
      try {
        const detailAbut = await Promise.all([getOfficeRequirementVerifyDetail(id)]);
        setDetail(detailAbut[0].result);
      } catch (error) {
        message.error('服务器错误');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    prepare();
    connectAdd();
  }, []);

  const clearForm = () => {
    createConnectForm.resetFields();
  };

  // 新增对接记录
  const handleAddConnect = async () => {
    const id = history.location.query?.id as string;
    const dataArr: any = [];
    createConnectForm
      .validateFields()
      .then(async (value) => {
        setLoading(true);
        value.datas.map((item: any) => {
          dataArr.push({
            demandId: id,
            content: item.content,
            connectTime: moment(item.connectTime).format('YYYY-MM-DD HH:mm:ss'),
          });
        });
        const addorUpdateRes = await addConnectRecord(dataArr);
        if (addorUpdateRes.code === 0) {
          message.success('新增对接记录成功');
          connectAdd();
          clearForm();
        } else {
          message.error(`新增对接记录失败，原因:${addorUpdateRes.message}`);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // 删除对接记录
  const handleRemove = async (id: string) => {
    setLoading(true);
    const deleteRes = await deleteConnectRecord(id);
    if (deleteRes.code === 0) {
      message.success('删除对接记录成功');
      connectAdd();
    } else {
      message.error(`删除对接记录失败，原因:${deleteRes.message}`);
    }
    setLoading(false);
  };

  const [createConnectForm] = Form.useForm();

  return (
    <PageContainer
      loading={loading}
      footer={[
        isEdit ? (
          <Button
            type="primary"
            onClick={() => {
              handleAddConnect();
            }}
          >
            提交
          </Button>
        ) : (
          ''
        ),
        <Button
          onClick={() => {
            history.push(routeName.REQUIREMENT_MANAGEMENT);
          }}
        >
          返回
        </Button>,
      ]}
    >
      <div className={sc('container')}>
        <div className={sc('container-title')}>企业需求信息</div>
        <div className={sc('container-desc')}>
          <div className="cover-img">
            <Image.PreviewGroup>
              {detail.coverUrl ? <Image height={200} width={300} src={detail.coverUrl} /> : ''}
            </Image.PreviewGroup>
          </div>
        </div>
        <div className={sc('container-desc')}>
          <span>需求名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求类型：</span>
          <span>{detail?.typeNames?.join('、') || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求区域：</span>
          <span>{detail.areaNames?.join('、') || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求时间范围：</span>
          <span>{detail?.startDate + '至' + detail?.endDate || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>需求内容：</span>
          <div dangerouslySetInnerHTML={{ __html: detail?.content || '--' }} />
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>企业基础信息</div>
        <div className={sc('container-desc')}>
          <span>组织信息展示：</span>
          <span>{detail?.hide ? '隐藏' : '公开'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>企业名称：</span>
          <span>{detail?.orgName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>企业所在地：</span>
          <span>{detail?.orgAreaName}</span>
        </div>
        {/* 字段不对 */}
        <div className={sc('container-desc')}>
          <span>所属产业：</span>
          <span>{detail?.orgIndustryName || '--'}</span>
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>更多信息</div>
        <div className={sc('container-desc')}>
          <span>企业规模：</span>
          <span>{detail?.orgScaleName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>企业痛点：</span>
          <span>{detail?.orgDifficultyList?.map((e: any) => e.name).join('、') || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>在用信息系统：</span>
          <span>{detail?.orgUsingSystemList?.map((e: any) => e.name).join('、') || '--'}</span>
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>联系信息</div>
        <div className={sc('container-desc')}>
          <span>联系人：</span>
          <span>{detail?.contact || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>联系电话：</span>
          <span>{detail?.phone}</span>
        </div>
      </div>
      <div className={sc('container')} style={{ marginTop: 20 }}>
        <div className={sc('container-title')}>对接记录</div>
        <div style={{ padding: 20, position: 'relative' }}>
          <Timeline>
            {isEdit && (
              <>
                <Form
                  form={createConnectForm}
                  name="dynamic_form_nest_item"
                  autoComplete="off"
                  initialValues={{
                    datas: [
                      {
                        connectTime: null,
                        content: '',
                      },
                    ],
                  }}
                >
                  <Form.List name="datas">
                    {(fields, { add, remove }) => (
                      <>
                        <Timeline.Item color="gray" key={0}>
                          <Button onClick={() => add()}>新增对接记录</Button>
                        </Timeline.Item>
                        {fields.map((field) => (
                          <Timeline.Item color="gray" key={1}>
                            <Space key={field.key} align="baseline">
                              <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, curValues) =>
                                  prevValues.datas !== curValues.datas
                                }
                              >
                                {() => (
                                  <Form.Item
                                    {...field}
                                    label="对接时间"
                                    name={[field.name, 'connectTime']}
                                    rules={[{ required: true, message: '请选择对接时间' }]}
                                  >
                                    <DatePicker
                                      allowClear
                                      showTime={{
                                        format: 'HH:mm',
                                      }}
                                      format="YYYY-MM-DD HH:mm"
                                    />
                                  </Form.Item>
                                )}
                              </Form.Item>
                              <Form.Item
                                {...field}
                                label="对接内容"
                                name={[field.name, 'content']}
                                rules={[{ required: true, message: '请输入对接内容' }]}
                              >
                                <Input.TextArea
                                  autoSize={false}
                                  className="message-modal-textarea"
                                  maxLength={200}
                                  showCount={true}
                                />
                              </Form.Item>
                              <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Space>
                          </Timeline.Item>
                        ))}
                      </>
                    )}
                  </Form.List>
                </Form>
              </>
            )}
            {timeLineData.map((i: any, index: number) => {
              return (
                <Timeline.Item color="gray" key={index}>
                  <p>
                    对接时间：{i.connectTime}
                    {i.ableDelete && (
                      <DeleteOutlined
                        style={{ fontSize: '16px', color: '#08c', marginLeft: 20 }}
                        onClick={() => {
                          handleRemove(i.id as string);
                        }}
                      />
                    )}
                  </p>
                  <p>对接内容：{i.content}</p>
                </Timeline.Item>
              );
            })}
          </Timeline>
          {/* <Space style={{marginLeft: -65, position: 'fixed', bottom: 140, left: '50%'}}>
            <Button type="primary" onClick={() => {
              handleAddConnect();
            }}>
              提交
            </Button>
            <Button onClick={() => {
              history.push(routeName.REQUIREMENT_MANAGEMENT);
            }}>
              返回
            </Button>
          </Space> */}
        </div>
      </div>
      <div className={sc('container')}>
        <div className={sc('container-title')}>推荐位管理</div>
        <Table rowKey="id" dataSource={[]} pagination={false}>
          <Column title="结果位顺序" render={(_, __, i) => i + 1} />
          <Column title="名称" dataIndex="name" />
          <Column title="简介" dataIndex="desc" />
          <Column title="相关性评价" dataIndex="recomend" />
          <Column title="操作记录" dataIndex="recode" />
        </Table>
      </div>
    </PageContainer>
  );
};
