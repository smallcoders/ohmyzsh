import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  StepsForm,
  ProFormTreeSelect,
  ProFormRadio,
} from '@ant-design/pro-components';
import { Radio, Tooltip, Form } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import { productTypeMap, guaranteeMethodMap } from '../constants';
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
  const type = Form.useWatch('type', formMapRef);
  useEffect(() => {
    waitTime(1000).then(() => {
      // 编辑场景下需要使用formMapRef循环设置formData
      formMapRef?.current?.forEach((formInstanceRef) => {
        formInstanceRef?.current?.setFieldsValue(formValue);
      });
    });
  }, []);

  return (
    <PageContainer>
      <StepsForm
        formMapRef={formMapRef}
        onFinish={(values) => {
          console.log(values);
          return Promise.resolve(true);
        }}
      >
        <StepsForm.StepForm name="step1" title="基本信息">
          <ProFormText
            label="产品名称"
            name={['baseInfo', 'name']}
            fieldProps={{ maxLength: 35 }}
          />
          <ProFormSelect
            label="产品类型"
            name={['baseInfo', 'type']}
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
          {type}
          {type !== 'Insurance' && (
            <ProFormRadio.Group name={['baseInfo', 'supportingRevolvingCredit']} label="支持循环贷">
              <Radio value={1}>
                是
                <Tooltip title="支持循环贷代表此产品过了授信截止时间后，可再次审批此产品">
                  <QuestionCircleOutlined style={{ marginLeft: '10px' }} />
                </Tooltip>
              </Radio>
              <Radio value={0}>否</Radio>
            </ProFormRadio.Group>
          )}
        </StepsForm.StepForm>
        <StepsForm.StepForm name="step2" title={'额度/利率信息'}>
          <ProFormDateRangePicker label="时间区间" name={['syncTableInfo', 'timeRange']} />
          <ProFormText label="标题" name={['syncTableInfo', 'title']} />
        </StepsForm.StepForm>
      </StepsForm>
    </PageContainer>
  );
};
export default ProductInfoAddOrEdit;
