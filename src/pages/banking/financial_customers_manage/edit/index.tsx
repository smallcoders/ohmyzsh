import { Input, Form, Select, Cascader, Button, message, message as antdMessage } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import UploadForm from '@/components/upload_form';
import { getCustomersDetail, editCustomersDetail } from '@/services/financial_customers_manage';
import { listAllAreaCode } from '@/services/common';
import { customToFixed } from '@/utils/util';
import { history } from 'umi';
import {
  orgFormMap,
  legalQualificationMap,
  economyTypeMap,
  industryMap,
  scienceMarkMap,
  banksMap,
  regStatusMap,
  orgSizeMap,
} from '../constants';
import './index.less';
import { FooterToolbar } from '@ant-design/pro-components';

const options = [
  { label: '否', value: 0 },
  { label: '是', value: 1 },
];

const sc = scopedClasses('customers_manage_edit');
export default () => {
  const [form] = Form.useForm();
  const { id } = history.location.query as { id: string | undefined };
  const [areaCodeOptions, setAreaCodeOptions] = useState<any>([]);
  useEffect(() => {
    getCustomersDetail({ id }).then((res) => {
      const { result, code, message: resultMsg } = res || {};
      if (code === 0) {
        const {
          name,
          logoImageId,
          creditCode,
          formedDate,
          legalPersonName,
          regAddress,
          regStatus,
          detailAddress,
          actualCapital,
          regCapital,
          revenueLastYear,
          profitLastYear,
          totalAssets,
          scale,
          busRange,
          provinceCode,
          cityCode,
          countyCode,
          orgSize,
          orgForm,
          legalQualification,
          economyType,
          industry,
          phone,
          contacts,
          isKey,
          isListed,
          scienceMark,
          banks,
        } = result;
        form.setFieldsValue({
          name,
          logoImageId,
          creditCode,
          formedDate,
          legalPersonName,
          regAddress,
          detailAddress,
          actualCapital,
          regCapital,
          revenueLastYear:
            typeof revenueLastYear === 'number'
              ? customToFixed(`${revenueLastYear / 1000000}`)
              : '',
          profitLastYear:
            typeof revenueLastYear === 'number' ? customToFixed(`${profitLastYear / 1000000}`) : '',
          totalAssets:
            typeof revenueLastYear === 'number' ? customToFixed(`${totalAssets / 1000000}`) : '',
          regStatus,
          scale,
          busRange,
          orgSize,
          orgForm,
          legalQualification,
          address: [provinceCode, cityCode, countyCode],
          economyType,
          industry,
          phone,
          isKey,
          isListed,
          contacts,
          banks: banks?.split(',') || [],
          scienceMark,
        });
      } else {
        antdMessage.error(`请求失败，原因:{${resultMsg}}`);
      }
    });

    listAllAreaCode().then((res) => {
      const { result } = res;
      setAreaCodeOptions(result);
    });
  }, []);

  const getOptions = (map: any) => {
    const result = [];
    for (const key in map) {
      result.push({
        value: `${key}`,
        label: map[key],
      });
    }
    return result;
  };

  const handleSubmit = async () => {
    await form.validateFields();
    const valueList = form.getFieldsValue();
    valueList.actualCapital = valueList.actualCapital;
    valueList.regCapital = valueList.regCapital;
    valueList.revenueLastYear = valueList.revenueLastYear
      ? valueList.revenueLastYear * 1000000
      : valueList.revenueLastYear;
    valueList.profitLastYear = valueList.profitLastYear
      ? valueList.profitLastYear * 1000000
      : valueList.profitLastYear;
    valueList.totalAssets = valueList.totalAssets
      ? valueList.totalAssets * 1000000
      : valueList.totalAssets;
    valueList.provinceCode = valueList.address[0];
    valueList.cityCode = valueList.address[1];
    valueList.countyCode = valueList.address[2];
    valueList.banks = valueList.banks && valueList.banks.join(',');
    valueList.id = id;
    editCustomersDetail(valueList).then((res) => {
      if (res?.code === 0 && res?.result) {
        message.info('保存成功');
        history.goBack();
      }
    });
  };

  return (
    <PageContainer className={sc('container')}>
      <Form className={sc('container-form')} form={form}>
        <Form.Item label={<span className="title">基本信息</span>} colon={false} />
        <Form.Item name="name" label="企业名称" required>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="logoImageId"
          label="企业logo"
          required
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <UploadForm
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            maxSize={5}
            accept=".bmp,.gif,.png,.jpeg,.jpg"
          />
        </Form.Item>
        <Form.Item name="creditCode" label="统一社会信用代码" required>
          <Input disabled />
        </Form.Item>
        <Form.Item name="formedDate" label="成立时间" required>
          <Input disabled />
        </Form.Item>
        <Form.Item name="legalPersonName" label="法定代表人" required>
          <Input disabled />
        </Form.Item>
        <Form.Item name="regStatus" label="经营状态" required validateTrigger="onBlur">
          <Select options={getOptions(regStatusMap)} placeholder="请选择" disabled />
        </Form.Item>
        <Form.Item name="regCapital" label="注册资本" required>
          <Input disabled />
        </Form.Item>
        <Form.Item name="actualCapital" label="实缴资本" required>
          <Input disabled />
        </Form.Item>
        <Form.Item name="regAddress" label="注册地址" required>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="address"
          label="经营所在地"
          required
          rules={[
            {
              required: true,
              message: `必选`,
            },
          ]}
        >
          <Cascader
            placeholder="请选择"
            fieldNames={{ label: 'name', value: 'code', children: 'nodes' }}
            options={areaCodeOptions}
            getPopupContainer={(trigger) => trigger as HTMLElement}
          />
        </Form.Item>
        <Form.Item
          name="detailAddress"
          label="详细地址"
          required
          rules={[
            {
              required: true,
              message: `必选`,
            },
          ]}
          validateTrigger="onBlur"
        >
          <Input.TextArea placeholder="请输入" />
        </Form.Item>
        <Form.Item label={<span className="title">企业情况</span>} colon={false} />
        <Form.Item name="scale" label="企业规模">
          <Input />
        </Form.Item>
        <Form.Item name="revenueLastYear" label="上年营收" validateTrigger="onBlur">
          <Input suffix="万元" placeholder="请输入" />
        </Form.Item>
        <Form.Item name="profitLastYear" label="上年利润" validateTrigger="onBlur">
          <Input suffix="万元" placeholder="请输入" />
        </Form.Item>
        <Form.Item name="totalAssets" label="总资产" validateTrigger="onBlur">
          <Input placeholder="请输入" suffix="万元" />
        </Form.Item>
        <Form.Item name="orgSize" label="组织规模">
          <Select options={getOptions(orgSizeMap)} placeholder="请选择" />
        </Form.Item>
        <Form.Item name="orgForm" label="组织形式">
          <Select options={getOptions(orgFormMap)} placeholder="请选择" />
        </Form.Item>
        <Form.Item name="legalQualification" label="法人资格">
          <Select options={getOptions(legalQualificationMap)} placeholder="请选择" />
        </Form.Item>
        <Form.Item name="economyType" label="经营成分">
          <Select options={getOptions(economyTypeMap)} placeholder="请选择" />
        </Form.Item>
        <Form.Item name="industry" label="所属行业">
          <Select options={getOptions(industryMap)} placeholder="请选择" />
        </Form.Item>
        <Form.Item name="busRange" label="经营范围" required>
          <Input.TextArea rows={4} disabled />
        </Form.Item>
        <Form.Item label={<span className="title">经营范围</span>} colon={false} />
        <Form.Item name="isKey" label="安徽十大新兴产业重点企业">
          <Select options={options} placeholder="请选择" />
        </Form.Item>
        <Form.Item name="scienceMark" label="科技型企业标识">
          <Select options={getOptions(scienceMarkMap)} placeholder="请选择" />
        </Form.Item>
        <Form.Item name="isListed" label="上市公司标识">
          <Select options={options} placeholder="请选择" />
        </Form.Item>
        <Form.Item label={<span className="title">联系方式</span>} colon={false} />
        <Form.Item
          name="contacts"
          label="联系人"
          required
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
          validateTrigger="onBlur"
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="联系电话"
          required
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
          validateTrigger="onBlur"
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label={<span className="title">主要结算银行</span>} colon={false} />
        <Form.Item name="banks" label="主要结算银行" validateTrigger="onBlur">
          <Select options={getOptions(banksMap)} placeholder="请选择" mode="multiple" />
        </Form.Item>
      </Form>
      <FooterToolbar>
        <Button onClick={() => history.goBack()}>返回</Button>
        <Button type="primary" style={{ marginLeft: '20px' }} onClick={handleSubmit}>
          保存
        </Button>
      </FooterToolbar>
    </PageContainer>
  );
};
