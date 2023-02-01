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
  FooterToolbar,
} from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Radio,
  Tooltip,
  Select,
  Form,
  Row,
  Col,
  Button,
  message,
  Input,
  Modal,
  Cascader,
  List,
} from 'antd';
import FormEdit from '@/components/FormEdit';
import { QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { productTypeMap, guaranteeMethodMap, city } from '../constants';
import { areaLabel } from '@/services/propaganda-config';
import scopedClasses from '@/utils/scopedClasses';
import { getProductType, addProduct, queryBank, getProductInfo } from '@/services/banking-product';
import { Prompt, history } from 'umi';
import './index.less';
import LoanUse from './loan-use/index';
import { routeName } from '@/../config/routes';
import { getOrgTypeList } from '@/services/org-type-manage';
import { any } from 'glamor';
const sc = scopedClasses('product-management-create');
type FormValue = {
  // baseInfo: {
  //   name: string;
  // };
  // syncTableInfo: {
  //   timeRange: [Dayjs, Dayjs];
  //   title: string;
  // };
  id: number; // 主键
  name: string; // 产品姓名
  content: string; // 产品简介
  bankName: string; // 所属金融机构
  minAmount: number; // 最低额度
  maxAmount: number; // 最高额度
  amountDesc: string; // 额度文案
  minTerm: number; // 最低期限（单位月）
  maxTerm: number; //最高期限（单位月）
  termDesc: string; // 期限文案
  minRate: string; // 最低利率
  maxRate: string; // 最高利率
  rateDesc: string; // 利率文案
  applyCondition: string; // 申请条件
  openArea: string; // 开放地区
  productFeature: string; // 产品特点
  warrantType: string; // 担保方式 1-信用 ，2-抵押，3-质押，4-保证，多个逗号分隔
  object: string; // 面向对象
  isCirculationLoan: number; // 是否支持循环贷 0:否，1:是
  isHot: number; // 是否热门 0:否，1:是
  loanIds: string; // 贷款用途id
  productProcessInfoList: ProductProcessInfoList; // 面向对象
};
type ProductProcessInfoList = {
  id: number; // 主键
  name: string; // 流程名称
  step: number; // 步骤
};
const formValue: FormValue = {
  // baseInfo: {
  //   name: 'normal job',
  // },
  // syncTableInfo: {
  //   timeRange: [dayjs().subtract(1, 'm'), dayjs()],
  //   title: 'example table title',
  // },
};
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(formValue);
    }, time);
  });
};
const ProductInfoAddOrEdit = () => {
  const { id } = history.location.query as any;
  const formMapRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [currentId, setCurrentId] = useState<number>(id);
  const [productType, setProductType] = useState<string>('');
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [openAreas, setOpenAreas] = useState<any>([]);
  const [productTypeList, setProductTypeList] = useState<any[]>([]);
  const [bankList, setBankList] = useState<any[]>([]);
  // const onCancel = (cb: any) => {
  //   if (formIsChange) {
  //     Modal.confirm({
  //       title: '要在离开之前对填写的信息进行保存吗?',
  //       icon: <ExclamationCircleOutlined />,
  //       cancelText: '放弃修改并离开',
  //       okText: '保存',
  //       onCancel() {
  //         if (cb) {
  //           cb();
  //         } else {
  //           history.goBack();
  //         }
  //       },
  //       onOk() {
  //         const values = formMapRef.current[current]?.current?.getFieldsFormatValue?.();
  //         saveProduct(values, 0, cb);
  //       },
  //     });
  //   } else {
  //     history.goBack();
  //   }
  // };
  useEffect(() => {
    getProductInfo({ id: currentId }).then((res) => {
      if (res.code === 0) {
        const {
          warrantType,
          openArea,
          productProcessInfoList,
          minAmount,
          maxAmount,
          minRate,
          maxRate,
          minTerm,
          maxTerm,
          typeName,
          typeId,
          typeDetailId,
          ...rest
        } = res.result;
        const Amount = minAmount ? [minAmount / 1000000, maxAmount / 1000000] : null;
        const Rate = minRate ? [minRate, maxRate] : null;
        const Term = minTerm ? [minTerm, maxTerm] : null;
        const typeIds = typeId ? [typeId, typeDetailId] : [];
        productProcessInfoList?.sort((a, b) => a.step - b.step);
        console.log('warrantType?.split(', ') || []', warrantType?.split(',') || []);
        // 编辑场景下需要使用formMapRef循环设置formData
        formMapRef?.current?.forEach((formInstanceRef) => {
          formInstanceRef?.current?.setFieldsValue({
            ...rest,
            openArea: (openArea && openArea?.split(',')) || [],
            warrantType: (warrantType && warrantType.split(',')) || [],
            productProcessInfoList,
            Amount,
            Rate,
            Term,
            typeIds,
          });
        });
        setFormIsChange(false);
        setProductType(typeName);
      }
    });
  }, []);
  const getproTypeList = (list: any) => {
    return list?.map((it: any) => {
      return {
        value: it.id,
        label: it.name,
        children: getproTypeList(it.details || null),
      };
    });
  };
  const prepare = async () => {
    try {
      const data = await Promise.all([getProductType(), queryBank()]);
      setProductTypeList(getproTypeList(data?.[0]?.result || []));
      setBankList(data?.[1]?.result?.bank || []);
    } catch (error) {
      message.error('数据初始化错误');
    }
  };

  // 保存产品信息 flag 0:暂存 1:下一步
  const saveProduct = (values: any, flag: number, cb: any) => {
    const value = { ...values };
    if (values.hasOwnProperty('warrantType')) {
      value.warrantType = values.warrantType?.join(',');
    }
    if (values.hasOwnProperty('openArea')) {
      value.openArea = values.openArea?.join(',');
    }
    if (values.hasOwnProperty('productProcessInfoList')) {
      value.productProcessInfoList = values.productProcessInfoList?.map(
        (item: any, index: number) => {
          return { ...item, step: index + 1 };
        },
      );
    }
    if (values.hasOwnProperty('Amount')) {
      value.minAmount = values.Amount[0] * 1000000;
      value.maxAmount = values.Amount[1] * 1000000;
    }
    if (values.hasOwnProperty('Term')) {
      value.minTerm = values.Term[0];
      value.maxTerm = values.Term[1];
    }
    if (values.hasOwnProperty('Rate')) {
      value.minRate = values.Rate[0];
      value.maxRate = values.Rate[1];
    }
    if (values.hasOwnProperty('typeIds')) {
      value.typeId = values.typeIds[0];
      value.typeDetailId = values.typeIds[1];
    }

    addProduct({ ...value, id: currentId || '', state: flag }).then((res) => {
      if (res.code === 0) {
        setFormIsChange(false);
        message.success('保存成功');
        setCurrentId(res.result);
        // 下一步
        if (flag === 1 && current === 0) {
          setCurrent(1);
        } else {
          if (cb) {
            cb();
          } else {
            history.push(routeName.PRODUCT_MANAGEMENT);
          }
        }
      } else {
        message.error('保存失败！');
      }
    });
  };
  useEffect(() => {
    prepare();
  }, []);
  const formProps2 = {
    wrapperCol: { span: 18 },
  };
  const formProps3 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  return (
    // <Spin>
    <>
      <PageContainer
        className={sc('page')}
        ghost
        footer={[
          <Button
            key="pre"
            onClick={() => {
              history.goBack();
            }}
          >
            返回
          </Button>,
          <Button
            key="goToTree2"
            onClick={() => {
              const values = formMapRef.current[current]?.current?.getFieldsFormatValue?.();
              saveProduct(values, 0, null);
            }}
          >
            暂存
          </Button>,
          <Button
            type="primary"
            key="goToTree"
            onClick={() => {
              formMapRef.current[current]?.current
                ?.validateFieldsReturnFormatValue?.()
                .then((values) => {
                  console.log('values', values);
                  saveProduct(values, 1, null);
                });
            }}
          >
            {current === 1 ? '完成' : '下一步'}
          </Button>,
        ]}
      >
        <StepsForm
          stepsProps={{
            className: sc('steps-form'),
          }}
          current={current}
          onCurrentChange={(cur) => setCurrent(cur)}
          formMapRef={formMapRef}
          onFinish={(values) => {
            console.log(values);
            return Promise.resolve(true);
          }}
          formProps={{
            size: 'large',
            layout: 'horizontal',
            labelCol: { span: 4 },
            wrapperCol: { span: 10 },
            style: { width: '100%' },
            onValuesChange: () => {
              console.log('onValuesChange');
              setFormIsChange(true);
            },
          }}
          submitter={false}
        >
          <StepsForm.StepForm name="step1" title="基本信息">
            <div className="title">基本信息</div>
            <ProFormText
              rules={[{ required: true }]}
              label="产品名称"
              name="name"
              fieldProps={{ maxLength: 35 }}
            />
            <Form.Item rules={[{ required: true }]} name="typeIds" label="产品类型">
              <Cascader
                options={productTypeList}
                onChange={(value, selectedOptions) => {
                  const labels = selectedOptions && selectedOptions[0];
                  setProductType(labels?.label);
                  console.log(value, selectedOptions);
                }}
              />
            </Form.Item>
            {/* <ProFormSelect
              rules={[{ required: true }]}
              label="产品类型"
              name="typeId"
              fieldProps={{
                onChange: (value) => {
                  productTypeList.forEach((item) => {
                    if (item.id === value) {
                      setProductType(item.name);
                    }
                  });
                },
              }}
              options={productTypeList.map((p) => {
                return {
                  value: p.id,
                  label: p.name,
                };
              })}
            /> */}
            <ProFormSelect
              rules={[{ required: true }]}
              label="金融机构"
              name="bankId"
              fieldProps={{
                showSearch: true,
              }}
              options={bankList.map((p) => {
                return {
                  value: p.id,
                  label: p.name,
                };
              })}
            />
            <ProFormSelect
              rules={[{ required: !productType?.includes('保险') }]}
              label="担保方式"
              name="warrantType"
              fieldProps={{
                mode: 'multiple',
              }}
              options={Object.entries(guaranteeMethodMap).map((p) => {
                return {
                  value: p[0],
                  label: p[1],
                };
              })}
            />
            <ProFormSelect
              rules={[{ required: true }]}
              label="面向对象"
              name="object"
              options={[{ value: 'BUSINESS', label: '企业' }]}
            />
            {!productType?.includes('保险') && (
              <Form.Item rules={[{ required: true }]} name="isCirculationLoan" label="支持循环贷">
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
            <Form.Item rules={[{ required: true }]} label="开放地区" name="openArea">
              <Select
                mode="multiple"
                allowClear
                showArrow
                onChange={(values) => {
                  console.log(values);
                  setOpenAreas(values);
                }}
              >
                <Select.Option
                  key={0}
                  disabled={!openAreas.includes('安徽省') && openAreas.length}
                  value={'安徽省'}
                >
                  安徽省
                </Select.Option>
                {Object.entries(city)?.map((item: any) => {
                  return (
                    <>
                      <Select.Option
                        key={item[1]}
                        disabled={openAreas.includes('安徽省')}
                        value={item[1]}
                      >
                        {item[1]}
                      </Select.Option>
                    </>
                  );
                })}
              </Select>
            </Form.Item>
            {!productType?.includes('保险') && (
              <Form.Item
                rules={[{ required: true, message: '请选择贷款用途' }]}
                {...formProps2}
                name="loanIds"
                label="贷款用途"
              >
                <LoanUse />
              </Form.Item>
            )}
            <Form.Item {...formProps2} rules={[{ required: true }]} name="content" label="产品简介">
              <FormEdit />
            </Form.Item>
            <Form.Item
              {...formProps2}
              name="productFeature"
              label="产品特点"
              rules={[{ required: true }]}
            >
              <FormEdit />
            </Form.Item>
            <Form.Item
              {...formProps2}
              name="applyCondition"
              label="申请条件"
              rules={[{ required: true }]}
            >
              <FormEdit />
            </Form.Item>
            <ProFormList
              name="productProcessInfoList"
              required
              label="申请流程"
              copyIconProps={false}
              deleteIconProps={false}
              creatorButtonProps={{
                creatorButtonText: '添加步骤',
              }}
              rules={[
                {
                  validator(rule, value) {
                    console.log(rule, value);
                    if (value?.length) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('至少有一条数据');
                    }
                  },
                },
              ]}
              creatorRecord={() => {
                return {
                  name: '',
                  productId: currentId,
                };
              }}
              min={1}
            >
              {(f, index, action) => {
                console.log(f, index, action);
                return (
                  <div className={sc('form-step')}>
                    <div className={sc('form-step-label')}>第{index + 1}步：</div>
                    <ProFormText
                      rules={[{ required: true }]}
                      className={sc('form-step-wrap')}
                      name="name"
                      fieldProps={{ maxLength: 35, size: 'large' }}
                    />
                    {!!index && (
                      <div className={sc('form-step-delete')}>
                        <img
                          src={require('@/assets/banking_loan/remove.png')}
                          className={sc('form-step-delete-img')}
                          onClick={() => {
                            action.remove?.(index);
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              }}
            </ProFormList>
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step2" title={'额度/利率信息'} className={sc('form-input')}>
            <div className="title">额度/利率信息</div>
            <ProFormDigitRange
              rules={[
                { required: true },
                {
                  validator(rule, value) {
                    console.log(rule, value);
                    if (value[0] && value[1]) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('请填写完整');
                    }
                  },
                },
              ]}
              {...formProps3}
              label={productType?.includes('保险') ? '保险额度' : '额度'}
              name="Amount"
              placeholder={[
                `最低${productType?.includes('保险') ? '保险' : ''}额度`,
                `最高${productType?.includes('保险') ? '保险' : ''}额度`,
              ]}
              addonAfter={<div style={{ width: '30px', whiteSpace: 'nowrap' }}>万元</div>}
            />
            <Form.Item
              {...formProps3}
              label={`${productType?.includes('保险') ? '保险' : ''}额度文案`}
              name="amountDesc"
              extra={
                <div className={sc('form-input-tips')}>
                  将在门户的金融产品{productType?.includes('保险') ? '保险' : ''}额度位置展示。
                  <Tooltip
                    style={{ maxWidth: '800px' }}
                    color="#fff"
                    title={
                      <img
                        src={
                          productType?.includes('保险')
                            ? require('@/assets/banking_loan/amount-insurance.png')
                            : require('@/assets/banking_loan/amountDesc.png')
                        }
                        className={sc('form-input-tips-img')}
                      />
                    }
                  >
                    <span className={sc('form-input-tips-show')}>查看示例</span>
                  </Tooltip>
                </div>
              }
            >
              <Input maxLength={35} placeholder="请输入" />
            </Form.Item>
            <ProFormDigitRange
              rules={[
                { required: true },
                {
                  validator(rule, value) {
                    console.log(rule, value);
                    if (value[0] && value[1]) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('请填写完整');
                    }
                  },
                },
              ]}
              {...formProps3}
              label={productType?.includes('保险') ? '参考费率' : '年化利率'}
              name="Rate"
              placeholder={[
                `最低${productType?.includes('保险') ? '费率' : '利率'}`,
                `最高${productType?.includes('保险') ? '费率' : '利率'}`,
              ]}
              addonAfter={<div style={{ width: '30px', whiteSpace: 'nowrap' }}>%</div>}
            />
            <Form.Item
              {...formProps3}
              label={`${productType?.includes('保险') ? '参考费率' : '年化利率'}文案`}
              name="rateDesc"
              extra={
                <div className={sc('form-input-tips')}>
                  将在门户的金融产品{productType?.includes('保险') ? '费率' : '年化利率'}位置展示。
                  <Tooltip
                    color="#fff"
                    title={
                      <img
                        src={
                          productType?.includes('保险')
                            ? require('@/assets/banking_loan/rate-insurance.png')
                            : require('@/assets/banking_loan/termDesc.png')
                        }
                        className={sc('form-input-tips-img')}
                      />
                    }
                  >
                    <span className={sc('form-input-tips-show')}>查看示例</span>
                  </Tooltip>
                </div>
              }
            >
              <Input maxLength={35} placeholder="请输入" />
            </Form.Item>
            <ProFormDigitRange
              rules={[
                { required: true },
                {
                  validator(rule, value) {
                    console.log(rule, value);
                    if (value[0] && value[1]) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('请填写完整');
                    }
                  },
                },
              ]}
              {...formProps3}
              label="期限"
              name="Term"
              placeholder={['最低期限', '最高期限']}
              addonAfter={<div style={{ width: '30px', whiteSpace: 'nowrap' }}>个月</div>}
            />
            <Form.Item
              {...formProps3}
              label="期限文案"
              name="termDesc"
              extra={
                <div className={sc('form-input-tips')}>
                  将在门户的金融产品额度位置展示。
                  <Tooltip
                    color="#fff"
                    title={
                      <img
                        src={
                          productType?.includes('保险')
                            ? require('@/assets/banking_loan/term-insurance.png')
                            : require('@/assets/banking_loan/rateDesc.png')
                        }
                        className={sc('form-input-tips-img')}
                      />
                    }
                  >
                    <span className={sc('form-input-tips-show')}>查看示例</span>
                  </Tooltip>
                </div>
              }
            >
              <Input maxLength={35} placeholder="请输入" />
            </Form.Item>
          </StepsForm.StepForm>
        </StepsForm>
      </PageContainer>
      <Prompt
        when={formIsChange}
        // when={isClosejumpTooltip && topApps.length > 0}
        message={(location: any) => {
          Modal.confirm({
            title: '要在离开之前对填写的信息进行保存吗?',
            icon: <ExclamationCircleOutlined />,
            cancelText: '放弃修改并离开',
            okText: '保存',
            onCancel() {
              console.log(location);
              setFormIsChange(false);
              setTimeout(() => {
                history.push(location.pathname);
              }, 1000);
            },
            onOk() {
              const values = formMapRef.current[current]?.current?.getFieldsFormatValue?.();
              saveProduct(values, 0, () => {
                setTimeout(() => {
                  history.push(location.pathname);
                }, 1000);
              });
            },
          });
          return false;
        }}
      />

      {/* </Spin> */}
    </>
  );
};
export default ProductInfoAddOrEdit;
