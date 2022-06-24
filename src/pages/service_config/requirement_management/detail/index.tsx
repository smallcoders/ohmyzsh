import { message, Image, Timeline, Form, Button, DatePicker, Input, Space, Row, AutoComplete, } from 'antd';
import { HddFilled, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { 
  getOfficeRequirementVerifyDetail,
  addConnectRecord,
  getConnectRecord,
  deleteConnectRecord // 对接记录列表
} from '@/services/office-requirement-verify';
import { getEnumByName } from '@/services/common';

const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<any>({});
  const [timeLineData, setTimeLineData] = useState<any>([]);
  const [enums, setEnums] = useState<any>({});

  // 判断是否从节点维护点击来的
  const isEdit = history.location.query?.isEdit ? true : false;

  const getDictionary = async () => {
    try {
      const enumsRes = await Promise.all([
        getEnumByName('CREATIVE_ACHIEVEMENT_CATEGORY_ENUM'), // 成果类别
        getEnumByName('CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM'), // 属性
        getEnumByName('CREATIVE_MATURITY_ENUM'), // 成熟度
        getEnumByName('CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM'), // 技术领域
        getEnumByName('TRANSFER_TYPE_ENUM'), // 技术转换
      ]);
      setEnums({
        CREATIVE_ACHIEVEMENT_CATEGORY_ENUM: enumsRes[0].result,
        CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM: enumsRes[1].result,
        CREATIVE_MATURITY_ENUM: enumsRes[2].result,
        CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM: enumsRes[3].result,
        TRANSFER_TYPE_ENUM: enumsRes[4].result,
      });
    } catch (error) {
      message.error('服务器错误');
    }
  };

  const prepare = async () => {
    const id = history.location.query?.id as string;

    if (id) {
      try {
        const detailAbut = await Promise.all([
          getOfficeRequirementVerifyDetail(id),
          getConnectRecord(id)
        ]);
        getDictionary();
        setDetail(detailAbut[0].result);
        setTimeLineData(detailAbut[1].result)
        console.log(detailAbut[1], '对接列表');
      } catch (error) {
        message.error('服务器错误');
      } finally {
        // setLoading(false);
      }
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  const handleAddConnect = async() => {
    const id = history.location.query?.id as string;
    console.log(createConnectForm.getFieldsValue(), id);
  }

  const [createConnectForm] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  return (
    <PageContainer>
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
          <span>{detail?.startDate + '至' + detail?.endDate  || '--'}</span>
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
          <span>{detail?.orgDifficultyList?.map((e:any) => e.name).join('、') || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>在用信息系统：</span>
          <span>{detail?.orgUsingSystemList?.map((e:any) => e.name).join('、') || '--'}</span>
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
      <div className={sc('container')} style={{marginTop: 20}}>
        <div className={sc('container-title')}>对接记录</div>
        <div style={{padding: 20}}>
          <Timeline>
            {
              isEdit && (
                <>
                  <Form 
                    form={createConnectForm} 
                    name="dynamic_form_nest_item" 
                    onFinish={onFinish} autoComplete="off"
                    initialValues={{"datas": [{
                      connectTime: null,
                      content: ''
                    }]}}
                  >
                    <Form.List name="datas">
                      {(fields, { add, remove }) => (
                        <>
                          <Timeline.Item color="gray">
                            <Button onClick={() => add()}>新增对接记录</Button>
                          </Timeline.Item>
                          {fields.map(field => (
                            <Timeline.Item color="gray">
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
            {timeLineData.map((i: any) => {
              return (
                <Timeline.Item color="gray">
                  <p>对接时间：{i.connectTime}</p>
                  <p>对接内容：{i.content}</p>
                </Timeline.Item>
              )
            })}
          </Timeline>
          <Space style={{marginLeft: 180}}>
            <Button type="primary" onClick={() => {
              handleAddConnect();
            }}>
              提交
            </Button>
            <Button>
              返回
            </Button>
          </Space>
        </div>
      </div>
    </PageContainer>
  );
};
