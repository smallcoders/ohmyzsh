import { message, Image, Timeline, Form, Button, DatePicker, Input, Space, Rate, Breadcrumb, Empty, Modal } from 'antd';
import { MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { history, Link } from 'umi';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import {
  getOfficeRequirementVerifyDetail,
  addConnectRecord,
  getConnectRecord,
  deleteConnectRecord // 对接记录列表
} from '@/services/office-requirement-verify';

const sc = scopedClasses('setting-demand-detail');


const contentObj = {
  APP_GROUP: 1, PURCHASE_GROUP: 2, SCIENCE_GROUP: 3, FINANCE_GROUP: 4
}

const contentObj2 = {
  APP_GROUP: 'demandSpecifyApp', FINANCE_GROUP: 'demandSpecifyFinance', PURCHASE_GROUP: 'demandSpecifyPurchase', SCIENCE_GROUP: 'demandSpecifyScience'
}

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});
  const [timeLineData, setTimeLineData] = useState<any>([]);
  const type = history.location.query?.type || '0';
  // 判断是否从节点维护点击来的
  const isEdit = history.location.query?.isEdit ? true : false;

  const connectAdd = async () => {
    const id = history.location.query?.id as string;
    const connectRes = await getConnectRecord(id);
    if (connectRes.code == 0) {
      setTimeLineData(connectRes.result);
    }
  }

  const prepare = async () => {
    const id = history.location.query?.id as string;

    if (id) {
      try {
        const detailAbut = await Promise.all([
          getOfficeRequirementVerifyDetail(id)
        ]);
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
    let dataArr: any = [];
    createConnectForm.validateFields()
      .then(async (value) => {
        setLoading(true);
        value.datas.map((item: any) => {
          dataArr.push(
            {
              demandId: id,
              content: item.content,
              connectTime: moment(item.connectTime).format('YYYY-MM-DD HH:mm:ss')
            }
          )
        })
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
  }

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
  }

  const [createConnectForm] = Form.useForm();

  const contentList = {
    1: [
      {
        key: 'orgName',
        label: `企业名称`,
      },
      {
        key: 'registerAmount',
        label: `注册资金（元）`,
      },
      {
        key: 'staffNum',
        label: `员工人数`,
      },
      {
        key: 'turnover',
        label: `营业额（元）`,
      },
      {
        key: 'purchaseAmount',
        label: `采购额（元）`,
      },
      {
        key: 'mainProduct',
        label: `主营产品`,
      },
      {
        key: 'industry',
        label: `行业`,

      },
      {
        key: 'areaCode',
        label: `企业所在地市`,

      },
      {
        key: 'budget',
        label: `数字化应用预算（元）`,

      },
      {
        key: 'appUserNum',
        label: `应用使用人数`,

      },
      {
        key: 'relate',
        label: `是否需要与上下游系统关联`,
        render: (v: any) => v ? '是' : '否'
      },
    ],
    2: [
      {
        key: 'orgName',
        label: `企业名称`,

      },
      {
        key: 'productName',
        label: `采购商品名称`,

      },
      {
        key: 'productSpec',
        label: `采购商品规格`,

      },
      {
        key: 'productParam',
        label: `采购商品参数`,

      },
      {
        key: 'purchaseAmount',
        label: `采购商品数量`,

      },
      {
        key: 'areaCode',
        label: `企业所在地市`,

      },
      {
        key: 'areaDetail',
        label: `企业详细地址`,

      },
      {
        key: 'shopTime',
        label: `期望到货时间`,
        render: (i: any) => {
          return [
            {
              title: '3~7天',
              value: 0
            },
            {
              title: '7~15天',
              value: 1
            },
            {
              title: '15天以上',
              value: 2
            },
          ].filter(p => p.value == i)?.[0]?.title
        },

      },
      {
        key: 'purchasePeriod',
        label: `以往采购周期`,
        render: (i: any) => {
          return [
            {
              title: '日常及时采购',
              value: 0
            },
            {
              title: '月度采购',
              value: 1
            },
            {
              title: '季度采购',
              value: 2
            },
          ].filter(p => p.value == i)?.[0]?.title
        },

      },
      {
        key: 'productCase',
        label: `商品使用场景`,
        render: (i: any) => {
          return [{
            title: '工厂车间',
            value: 0
          },
          {
            title: '办公劳保',
            value: 1
          },
          {
            title: '市场营销',
            value: 2
          }, {
            title: '员工福利',
            value: 3
          },
          {
            title: '其他',
            value: 4
          },
          ].filter(p => p.value == i)?.[0]?.title
        },

      },
    ],
    3: [
      {
        key: 'orgName',
        label: `企业名称`,
      },
      {
        key: 'areaCode',
        label: `企业所在地市`,

      },
      {
        key: 'personName',
        label: `联系人`,

      },
      {
        key: 'personPhone',
        label: `联系方式`,

      },
      {
        key: 'demandSpName',
        label: `需求名称`,

      },
      {
        key: 'demandSpType',
        label: `需求类型`,
      },
      {
        key: 'demandSpSector',
        label: `所属行业`,
      },
      {
        key: '',
        label: ``,
      },
      {
        key: 'demandSpTime', // demandSpStartTime, demandSpEndTime
        label: `需求时间`,
      },
      {
        key: 'demandSpContent',
        label: `需求内容`,
      },
      {
        key: 'demandSpBudget',
        label: `需求预算`,
      },
    ],
    4: [
      {
        key: 'orgName',
        label: `企业名称`,

      },
      {
        key: 'personName',
        label: `联系人`,

      },
      {
        key: 'personPhone',
        label: `联系方式`,
      },
      {
        key: 'areaCode',
        label: `企业所在地市`,

      },
      {
        key: 'lastIncome',
        label: `上一年营业收入`,
      },
      {
        key: 'orgStaffNum',
        label: `企业人数`,
      },
      {
        key: 'orgType',
        label: `企业类型`,
        render: (i: any) => {
          return [
            { title: '高新技术企业', value: 0 },
            { title: '科技型中小企业', value: 1 },
            { title: '民营科技企业', value: 2 },
            { title: '专精特新企业', value: 3 },
          ].filter(p => p.value == i)?.[0]?.title
        },

      },
      {
        key: 'financeType',
        label: `资金需求量`,
        render: (i: any) => {
          return [
            { title: '500万以下', value: 0 },
            { title: '500~1000万', value: 1 },
            { title: '1000~3000万', value: 2 },
            { title: '3000万以上', value: 3 },
          ].filter(p => p.value == i)?.[0]?.title
        },

        props: {
          style: {
            width: '100%'
          },
        },
      },
      {
        key: 'financePeriod',
        label: `拟融资期限`,
        render: (i: any) => {
          return [
            { title: '短期（一年内）', value: 0 },
            { title: '中期（一至三年）', value: 1 },
            { title: '长期（三年以上）', value: 2 },
          ].filter(p => p.value == i)?.[0]?.title
        },

      },
      {
        key: 'financeUse', //financeUseMark
        label: `拟融资用途`,
      },
      {
        key: 'financeUrgency',
        label: `资金需求紧迫度`,
        render: (i: any) => {
          return [
            { title: '急需解决资金问题', value: 1 },
            { title: '近期有融资计划，希望获得产品推介', value: 2 },
            { title: '近期暂无融资计划，想了解合适产品', value: 3 },
          ].filter(p => p.value == i)?.[0]?.title
        },


      },
      {
        key: 'settleBank',
        label: `主要结算银行`,
        render: (i: any) => {
          return [
            { title: '国有大行', value: 0 },
            { title: '全国股份制', value: 1 },
            { title: '城商行', value: 2 },
            { title: '农商行', value: 3 },
          ].filter(p => p.value == i)?.[0]?.title
        },
      },
      {
        key: 'selfOwnedLand',
        label: `自有产权土地`,
      },
      {
        key: 'selfOwnedHouse',
        label: `自有产权房产`,
      },
      {
        key: 'selfOwnedDevice',
        label: `自有高价值设备`,
      },
    ],
  }

  const [visible, setVisible] = useState<boolean>(false)

  return (
    <PageContainer
      header={{
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              {type == '1' ? <Link to="/supply-demand-setting/demand-manage/index">需求管理</Link>
                :
                <Link to="/supply-demand-setting/docking-manage/index">供需对接</Link>
              }
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {'需求详情'}
            </Breadcrumb.Item>
          </Breadcrumb>
        )
      }}
      loading={loading}
      footer={[
        isEdit ?
          <Button type="primary" onClick={() => {
            handleAddConnect();
          }}>
            提交
          </Button> : '',
        <Button onClick={() => {
          history.goBack();
        }}>
          返回
        </Button>
      ]}
    >
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1, padding: 20, background: '#fff' }}>
          <span style={{ fontWeight: 'bold', marginBottom: 20 }}>原始需求信息</span>
          <div className={sc('container')}>
            <div className={sc('container-title')}>企业需求信息</div>
            <div className={sc('container-desc')}>
              <div className="cover-img">
                <Image.PreviewGroup>
                  {detail?.coverUrl ? <Image height={200} width={300} src={detail?.coverUrl} /> : ''}
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
              <span>{detail?.areaNames?.join('、') || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span>需求时间范围：</span>
              <span>{detail?.startDate ? (detail?.startDate + '至' + detail?.endDate) : '--'}</span>
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
        </div>
        <div style={{ flex: 1, padding: 20, background: '#fff' }}>
          <span style={{ fontWeight: 'bold', marginBottom: 20 }}>供需对接情况</span>
          <div className={sc('container')}>
            <div className={sc('container-title')}>需求细化</div>
            {contentList?.[contentObj?.[detail?.type]] ? contentList?.[contentObj?.[detail?.type]]?.map(p => {

              const value = detail?.[contentObj2[detail?.type]]?.[p?.key]
              return (value == undefined || value == null) ? '' : <div className={sc('container-desc')}>
                <span>{p.label}</span>
                <span>{p?.render ? p?.render(value) : value}</span>
              </div>
            }) : <Empty description="暂无数据" />}

          </div>

          <div className={sc('container')}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}> <div className={sc('container-title')}>需求反馈</div>
              {detail?.demandFeedback && <div className={sc('container-title')}>反馈来自：{detail?.demandFeedback?.feedbackPerson || '--'}</div>}
            </div>
            {detail?.demandFeedback?.feedbackList?.length > 0 ? <div style={{ padding: '10px 20px' }}>

              <div>
                <span>交付物内容描述：</span>
                <div>{detail?.demandFeedback?.feedbackList?.[0]?.content || '--'}</div>
              </div>
              <div>
                <span>交付物文件：</span>
                <div>
                  {detail?.demandFeedback?.feedbackList?.[0]?.fileList &&
                    detail?.demandFeedback?.feedbackList?.[0]?.fileList?.map((p: any) => {
                      return (
                        <div>
                          <a target="_blank" rel="noreferrer" href={p.path}>
                            {p.name + '.' + p.format}
                          </a>
                        </div>
                      );
                    })}
                </div>
              </div>
              {detail?.demandFeedback?.feedbackList?.length > 2 && <div style={{ textAlign: 'center' }}>
                <Button type='link' onClick={() => {
                  setVisible(true)
                }}>查看完整反馈记录{'>'}</Button>
              </div>}
            </div> : <Empty description="未到当前步骤" />}
          </div>
          <div className={sc('container')}>
            <div className={sc('container-title')}>企业评价</div>
            {detail?.demandEvaluate ? <>
              {detail?.demandEvaluate?.efficiency && <div className={sc('container-desc')}>
                <span>需求响应效率</span>
                <span> <Rate disabled defaultValue={detail?.demandEvaluate?.efficiency} /></span>
              </div>}
              {detail?.demandEvaluate?.attitude && <div className={sc('container-desc')}>
                <span>需求服务态度</span>
                <span> <Rate disabled defaultValue={detail?.demandEvaluate?.attitude} /></span>
              </div>}
              {detail?.demandEvaluate?.quality && <div className={sc('container-desc')}>
                <span>需求反馈质量</span>
                <span> <Rate disabled defaultValue={detail?.demandEvaluate?.quality} /></span>
              </div>}
              <div className={sc('container-desc')}>
                <span>总体评价：</span>
                <span>{detail?.demandEvaluate?.comments || '--'}</span>
              </div>
            </> : <Empty description="未到当前步骤" />}
          </div>
        </div>
      </div>
      <div className={sc('container')} style={{ marginTop: 20 }}>
        <div className={sc('container-title')}>对接记录</div>
        <div style={{ padding: 20, position: 'relative' }}>
          <Timeline>
            {
              isEdit && (
                <>
                  <Form
                    form={createConnectForm}
                    name="dynamic_form_nest_item"
                    autoComplete="off"
                    initialValues={{
                      "datas": [{
                        connectTime: null,
                        content: ''
                      }]
                    }}
                  >
                    <Form.List name="datas">
                      {(fields, { add, remove }) => (
                        <>
                          <Timeline.Item color="gray" key={0}>
                            <Button onClick={() => add()}>新增对接记录</Button>
                          </Timeline.Item>
                          {fields.map(field => (
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
                                      <DatePicker allowClear
                                        showTime={{
                                          format: 'HH:mm',
                                        }}
                                        format="YYYY-MM-DD HH:mm" />
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
              )
            }
            {timeLineData.map((i: any, index: number) => {
              return (
                <Timeline.Item color="gray" key={index}>
                  <p>
                    对接时间：{i.connectTime}
                    {i.ableDelete && (
                      <DeleteOutlined style={{ fontSize: '16px', color: '#08c', marginLeft: 20 }} onClick={() => {
                        handleRemove(i.id as string)
                      }} />
                    )}
                  </p>
                  <p>对接内容：{i.content}</p>
                </Timeline.Item>
              )
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

      <Modal
        title={'反馈记录'}
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        width={800}
        centered
        maskClosable={false}
        destroyOnClose={true}
        footer={null}
      >
        {detail?.demandFeedback?.feedbackList?.map((p) => {
          return <div className={sc('container')}>
            <div className={sc('container-desc')}>
              <span></span>
              <span>{p?.createTime || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span></span>
              <span>{p?.content || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span></span>
              <div>
                {p?.fileList &&
                  p?.fileList?.map((f: any) => {
                    return (
                      <div>
                        <a target="_blank" rel="noreferrer" href={f.path}>
                          {f.name + '.' + f.format}
                        </a>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div>
            </div>
          </div>
        })}
      </Modal>
    </PageContainer>
  );
};
