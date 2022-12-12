import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  StepsForm,
  ProFormTreeSelect,
  ProForm,
  ProFormList,
  ProFormDigitRange,
} from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { Radio, Tooltip, Select, Form, Row, Col, Button } from 'antd';
import FormEdit from '@/components/FormEdit';
import { QuestionCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { productTypeMap, guaranteeMethodMap } from '../constants';
import { areaLabel } from '@/services/propaganda-config';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
const sc = scopedClasses('product-management-create');
type FormValue = {
  baseInfo: {
    name: string;
  };
  syncTableInfo: {
    timeRange: [Dayjs, Dayjs];
    title: string;
  };
};
const formValue: FormValue = {
  baseInfo: {
    name: 'normal job',
  },
  syncTableInfo: {
    timeRange: [dayjs().subtract(1, 'm'), dayjs()],
    title: 'example table title',
  },
};
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(formValue);
    }, time);
  });
};
const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          {
            value: 'leaf1',
            title: 'leaf1',
          },
          {
            value: 'leaf2',
            title: 'leaf2',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'leaf3',
            title: <b style={{ color: '#08c' }}>leaf3</b>,
          },
        ],
      },
    ],
  },
];
const ProductInfoAddOrEdit = () => {
  const formMapRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);
  const [productType, setProductType] = useState<string>('');
  const [serviceTypes, setServiceType] = useState<any>([]);
  const [openAreas, setOpenAreas] = useState<any>([]);
  useEffect(() => {
    waitTime(1000).then(() => {
      // 编辑场景下需要使用formMapRef循环设置formData
      formMapRef?.current?.forEach((formInstanceRef) => {
        formInstanceRef?.current?.setFieldsValue(formValue);
      });
    });
  }, []);

  const _areaLabel = async () => {
    try {
      const res = await areaLabel();
      if (res?.code === 0) {
        let arr = [];
        arr =
          res?.result?.map((item: any) => {
            return {
              areaName: item.name,
              areaCode: item.code.toString(),
            };
          }) || [];
        setServiceType(arr);
      }
    } catch (error) {
      console.log('获取城市下拉error');
    }
  };
  useEffect(() => {
    // 城市名称安徽省16地市
    // 下拉选项为安徽省16地市，列表中存在的城市活动状态为非已结束，则选项中不存在；如果为已结束或未维护的城市，则选项中存在
    _areaLabel();
  }, []);
  return (
    <PageContainer
      className={sc('page')}
      ghost
      header={{
        title: '产品管理',
        // breadcrumb: {},
      }}
    >
      <StepsForm
        stepsProps={{
          className: sc('steps-form'),
        }}
        formMapRef={formMapRef}
        onFinish={(values) => {
          console.log(values);
          return Promise.resolve(true);
        }}
        formProps={{
          layout: 'horizontal',
          labelCol: { span: 4 },
          wrapperCol: { span: 16 },
        }}
        submitter={{
          render: (props) => {
            if (props.step === 0) {
              return [
                <Button key="pre" onClick={() => props.onPre?.()}>
                  返回
                </Button>,
                <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                  暂存
                </Button>,
                <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                  下一步
                </Button>,
              ];
            }

            return [
              <Button key="pre" onClick={() => props.onPre?.()}>
                返回
              </Button>,
              <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                暂存
              </Button>,
              <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                发布产品
              </Button>,
            ];
          },
        }}
      >
        <StepsForm.StepForm name="step1" title="基本信息">
          <div className="title">基本信息</div>
          <ProFormText
            label="产品名称"
            name={['baseInfo', 'name']}
            fieldProps={{ maxLength: 35 }}
          />
          <ProFormSelect
            label="产品类型"
            name={['baseInfo', 'type']}
            fieldProps={{
              onChange: (value) => {
                setProductType(value);
              },
            }}
            options={Object.entries(productTypeMap).map((p) => {
              return {
                value: p[0],
                label: p[1],
              };
            })}
          />
          <ProFormTreeSelect
            label="金融机构"
            name={['baseInfo', 'org']}
            fieldProps={{
              showSearch: true,
              treeData,
            }}
          />
          <ProFormSelect
            label="担保方式"
            name={['baseInfo', 'guaranteeMethod']}
            options={Object.entries(guaranteeMethodMap).map((p) => {
              return {
                value: p[0],
                label: p[1],
              };
            })}
          />
          <ProFormSelect
            label="面向对象"
            name={['baseInfo', 'guaranteeMethod']}
            options={[{ value: 1, label: '企业' }]}
          />
          {productType !== 'Insurance' && (
            <Form.Item name={['baseInfo', 'supportingRevolvingCredit']} label="支持循环贷">
              <Radio.Group>
                <Radio value={1}>
                  是
                  <Tooltip title="支持循环贷代表此产品过了授信截止时间后，可再次审批此产品">
                    <QuestionCircleOutlined style={{ marginLeft: '10px' }} />
                  </Tooltip>
                </Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          <Form.Item label="开放地区" name={['baseInfo', 'openArea']}>
            <Select
              mode={'multiple'}
              allowClear
              showArrow
              onChange={(values) => {
                console.log(values);
                setOpenAreas(values);
              }}
            >
              <Select.Option
                key={0}
                disabled={!openAreas.includes(0) && openAreas.length}
                value={0}
              >
                安徽省
              </Select.Option>
              {serviceTypes?.map((item: any) => {
                return (
                  <>
                    <Select.Option
                      key={item?.areaName}
                      disabled={openAreas.includes(0)}
                      value={item?.areaCode}
                    >
                      {item?.areaName}
                    </Select.Option>
                  </>
                );
              })}
            </Select>
          </Form.Item>
          <ProForm.Item noStyle labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <div className="LoanPurpose">
              <div className="LoanPurpose-select">
                {productType !== 'Insurance' && (
                  <div>
                    <span>贷款用途：</span>
                    <Form.Item name={['baseInfo', 'LoanPurpose']}>
                      <Radio.Group buttonStyle="outline">
                        <Radio.Button value={1}>经营周转</Radio.Button>
                        <Radio.Button value={2}>设备采买</Radio.Button>
                        <Radio.Button value={0}>+自定义用途</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                )}
              </div>
              <div className="LoanPurpose-input">
                <ProForm.Item noStyle shouldUpdate>
                  {(form) => {
                    return (
                      form.getFieldValue('baseInfo')?.LoanPurpose === 0 && (
                        <ProFormText name={['baseInfo', 'otherLoanPurpose']} />
                      )
                    );
                  }}
                </ProForm.Item>
              </div>
            </div>
          </ProForm.Item>
          <Form.Item
            name={['baseInfo', 'productIntroduction']}
            label="产品简介"
            rules={[{ required: true }]}
          >
            <FormEdit />
          </Form.Item>
          <Form.Item
            name={['baseInfo', 'productFeatures']}
            label="产品特点"
            rules={[{ required: true }]}
          >
            <FormEdit />
          </Form.Item>
          <Form.Item
            name={['baseInfo', 'applicationConditions']}
            label="申请条件"
            rules={[{ required: true }]}
          >
            <FormEdit />
          </Form.Item>
          <ProFormList
            name={['baseInfo', 'users']}
            label="申请流程"
            copyIconProps={false}
            deleteIconProps={{ Icon: MinusCircleOutlined }}
            creatorButtonProps={{
              creatorButtonText: '添加步骤',
            }}
            min={1}
            initialValue={[
              {
                value: '333',
              },
            ]}
          >
            {(f, index, action) => {
              console.log(f, index, action);
              return (
                <Row>
                  <Col span={6}>
                    <div>第{index + 1}步：</div>
                  </Col>
                  <Col span={18}>
                    <ProFormText name="value" fieldProps={{ maxLength: 35 }} />
                  </Col>
                </Row>
              );
            }}
          </ProFormList>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="step2" title={'额度/利率信息'}>
          <ProFormDigitRange
            label="额度"
            name={['syncTableInfo', 'money']}
            placeholder={['最低额度', '最高额度']}
            addonAfter="万元"
          />
          <ProFormText label="额度文案" name={['syncTableInfo', 'moneytext']} />
          <ProFormDateRangePicker label="时间区间" name={['syncTableInfo', 'timeRange']} />
          <ProFormText label="标题" name={['syncTableInfo', 'title']} />
        </StepsForm.StepForm>
      </StepsForm>
    </PageContainer>
  );
};
export default ProductInfoAddOrEdit;
