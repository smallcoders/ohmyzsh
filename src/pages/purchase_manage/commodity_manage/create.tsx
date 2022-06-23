import { PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormSelect, ProFormText, ProFormUploadButton } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { Button, Input, Steps, Tag } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './create.less';

const { Step } = Steps;

enum eStep {
  CommodityBase = 0,
  CommoditySpec = 1,
  CommodityPrice = 2,
  CommodityIntroduce = 3,
  CommodityDetails = 4,
}

const StepsTitle = ['商品基础信息', '商品规格信息', '商品价格信息', '商品参数介绍', '商品详情'];

export default () => {
  const [currentStep, setCurrentStep] = useState(eStep.CommoditySpec);
  const [stepsForm, setStepsForm] = useState({
    [eStep.CommodityBase]: {
      defualtValue: null,
      components: CommodityBaseForm,
    },
    [eStep.CommoditySpec]: {
      defualtValue: null,
      components: CommoditySpecForm,
    },
    [eStep.CommodityPrice]: {
      defualtValue: null,
      components: CommodityBaseForm,
    },
    [eStep.CommodityIntroduce]: {
      defualtValue: null,
      components: CommodityBaseForm,
    },
    [eStep.CommodityDetails]: {
      defualtValue: null,
      components: CommodityBaseForm,
    },
  });

  const parsePrice = useCallback((data: SpecData[]) => {
    const specs = data.filter((item) => item.select);
    let result: { label: string; value: string }[][] = [];
    // 枚举
    specs.forEach((spec) => {
      if (!spec.value || !spec.value.length) {
        return;
      }

      if (result.length === 0) {
        result = spec.value.map((item) => [{ label: spec.name, value: item }]);
        return;
      }

      const res = [];

      for (let i = 0; i < result.length; i++) {
        const temp = result[i];
        for (let j = 0; j < spec.value.length; j++) {
          res.push([...temp, { label: spec.name, value: spec.value[j] }]);
        }
      }
    });

    return { enumSpecs: result };
  }, []);

  const changeStepHandle = useCallback((isNext: boolean, data) => {
    setCurrentStep((val) => {
      setStepsForm((forms) => {
        forms[val].defualtValue = data;
        return { ...forms };
      });
      return isNext ? val + 1 : val - 1;
    });
  }, []);

  const nextStepHandle = useCallback(
    (data) => {
      changeStepHandle(true, data);
    },
    [changeStepHandle],
  );

  const preStepHandle = useCallback(
    (data) => {
      changeStepHandle(false, data);
    },
    [changeStepHandle],
  );

  const form = useMemo(() => {
    const defualtValue = stepsForm[currentStep].defualtValue;
    const Com = stepsForm[currentStep].components;

    return <Com defualtValue={defualtValue} onNext={nextStepHandle} onPre={preStepHandle} />;
  }, [currentStep, stepsForm, nextStepHandle, preStepHandle]);

  return (
    <PageContainer title={false} className="commodity-create">
      <ProCard style={{ marginTop: 8 }} gutter={8} ghost>
        <ProCard style={{ height: '100%' }} bordered layout="center">
          {form}
        </ProCard>
        <ProCard style={{ height: '100%' }} colSpan="300px" bordered>
          <Steps direction="vertical" current={currentStep}>
            {StepsTitle.map((title) => {
              return <Step title={title} key={title} />;
            })}
          </Steps>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

interface CommodityFormProps<T> {
  defualtValue: T;
  onNext: (data: T) => void;
  onPre: (data: T) => void;
}

function CommodityBaseForm(props: CommodityFormProps<any>) {
  const { defualtValue, onNext } = props;
  const onFinish = useCallback(
    async (values) => {
      onNext(values);
    },
    [onNext],
  );
  return (
    <ProForm
      className="create-form"
      layout="horizontal"
      labelCol={{ span: 6 }}
      initialValues={defualtValue}
      submitter={{
        searchConfig: { submitText: '下一步' },
        resetButtonProps: { style: { display: 'none' } },
      }}
      style={{ width: 500 }}
      onFinish={onFinish}
    >
      <ProFormText
        name="name"
        label="商品名称"
        placeholder="名称可包含商品中英品牌、名称等等信息"
        rules={[{ required: true }]}
      />
      <ProFormText name="type" label="商品型号" placeholder="请输入" rules={[{ required: true }]} />
      <ProFormText name="code" label="订货编码" placeholder="请输入" rules={[{ required: true }]} />
      <ProFormSelect name="label" label="商品促销标签" placeholder="请输入" />
      <ProFormSelect name="label2" label="服务标签" placeholder="请输入" />
      <ProFormText name="unit" label="商品单位" placeholder="请输入" rules={[{ required: true }]} />
      <ProFormUploadButton
        name="thumbnail"
        label="商品封面图"
        max={1}
        listType="picture-card"
        extra="图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下"
        rules={[{ required: true }]}
      />
      <ProFormUploadButton
        name="thumbnails"
        label="商品轮播图"
        max={10}
        listType="picture-card"
        extra="图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下，最大支持10张图片"
        rules={[{ required: true }]}
      />
    </ProForm>
  );
}

interface SpecData {
  id: number;
  name: string;
  value: string[];
  select: 0 | 1;
}

function CommoditySpecForm(props: CommodityFormProps<SpecData[] | null>) {
  const { defualtValue, onNext, onPre } = props;
  const [data, setData] = useState<SpecData[]>([]);
  const actionRef = useRef<ActionType>();

  const delHandle = useCallback(
    (record) => {
      setData(data.filter((item) => item.id !== record.id));
    },
    [data],
  );

  const columns: ProColumns<SpecData>[] = [
    {
      title: '序号',
      editable: false,
      renderText: (_, __, index: number) => index + 1,
    },

    {
      title: '规格名',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '规格值',
      dataIndex: 'value',
      valueType: 'text',
      renderText: (_, record) => record.value.join(', '),
      renderFormItem: () => <SpecValus />,
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '支持价格配置',
      dataIndex: 'setting',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '否',
        },
        1: {
          text: '是',
        },
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '操作',
      valueType: 'option',

      render: (_, record, __, action) => (
        <>
          <Button
            size="small"
            type="link"
            onClick={() => {
              action?.startEditable(record.id);
            }}
          >
            编辑
          </Button>
          <Button size="small" type="link" onClick={() => delHandle(record)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  const addHandle = useCallback(() => {
    actionRef.current?.addEditRecord({
      id: data.length + 1,
      name: '',
      value: [],
      setting: '0',
    });
  }, [data]);

  const nextHandle = useCallback(() => {
    onNext(data);
  }, [onNext, data]);

  const preHandle = useCallback(() => {
    onPre(data);
  }, [onPre, data]);

  useEffect(() => {
    if (defualtValue) {
      setData(defualtValue);
    }
  }, [defualtValue]);

  return (
    <ProCard direction="column" ghost gutter={[0, 0]}>
      <ProCard colSpan={24} layout="center">
        <EditableProTable
          headerTitle="商品规格信息"
          options={false}
          actionRef={actionRef}
          rowKey="id"
          search={false}
          toolBarRender={() => [
            <Button type="primary" key="primary" onClick={addHandle}>
              新增规格
            </Button>,
          ]}
          columns={columns}
          value={data}
          recordCreatorProps={false}
          onChange={setData}
        />
      </ProCard>
      <ProCard colSpan={24} layout="center">
        <Button style={{ marginRight: 20 }} onClick={preHandle}>
          上一步
        </Button>
        <Button type="primary" onClick={nextHandle}>
          下一步
        </Button>
      </ProCard>
    </ProCard>
  );
}

interface SpecValusProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}
function SpecValus(props: SpecValusProps) {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { value, onChange } = props;

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && value?.indexOf(inputValue) === -1 && onChange) {
      onChange([...value, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div>
      {(value || []).map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Tag closable={true} key={index}>
          {item}
        </Tag>
      ))}

      {inputVisible && (
        <Input
          type="text"
          size="small"
          style={{ width: 78 }}
          autoFocus={true}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag onClick={showInput} className="site-tag-plus">
          <PlusOutlined /> 新增
        </Tag>
      )}
    </div>
  );
}

function CommodityPriceForm(props: CommodityFormProps<any[] | null>) {
  return (
    <ProCard direction="column" ghost gutter={[0, 0]}>
      <ProCard colSpan={24} layout="center">
        <EditableProTable
          headerTitle="商品规格信息"
          options={false}
          rowKey="id"
          search={false}
          columns={columns}
          value={data}
          recordCreatorProps={false}
          onChange={setData}
        />
      </ProCard>
      <ProCard colSpan={24} layout="center">
        <Button style={{ marginRight: 20 }} onClick={preHandle}>
          上一步
        </Button>
        <Button type="primary" onClick={nextHandle}>
          下一步
        </Button>
      </ProCard>
    </ProCard>
  );
}
