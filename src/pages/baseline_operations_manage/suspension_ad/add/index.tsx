import { Input, Form, Select, Button, message, message as antdMessage, Radio } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect } from 'react';
import UploaImageV2 from '@/components/upload_form/upload-image-v2';
import { getCustomersDetail, editCustomersDetail } from '@/services/financial_customers_manage';
import { customToFixed } from '@/utils/util';
import { history } from 'umi';
import './index.less';
import { UploadOutlined } from '@ant-design/icons';

const sc = scopedClasses('suspension-add');
export default () => {
  const [form] = Form.useForm();
  const { id } = history.location.query as { id: string | undefined };
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
          legalCard,
        } = result;
        console.log(legalCard);

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
          banks: banks ? banks?.split(',') : [],
          scienceMark,
          legalCard: legalCard?.replace(/^(.{4})(?:\d+)(.{4})$/, '$1******$2'),
        });
      } else {
        antdMessage.error(`请求失败，原因:{${resultMsg}}`);
      }
    });
  }, []);

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
    <PageContainer
      className={sc('page')}
      ghost
      footer={[
        <>
          <Button type="primary" onClick={handleSubmit}>
            立即上架
          </Button>
          <Button onClick={handleSubmit}>
            暂存
          </Button>
          <Button onClick={() => history.goBack()}>返回</Button>
        </>,
      ]}
    >
      <Form className={sc('container-form')} form={form}>
        <div className="title">全局悬浮窗广告信息</div>
        <Form.Item labelCol={{span: 4}} name="name" label="名称" required>
          <Input placeholder="请输入" maxLength={35} />
        </Form.Item>
        <Form.Item
          name="logoImageId"
          label="图片"
          required
          extra="图片格式仅支持JPG、PNG、JPEG、GIF"
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <UploaImageV2 multiple={true} accept=".png,.jpeg,.jpg,.gif" maxCount={3}>
            <Button icon={<UploadOutlined />}>上传</Button>
          </UploaImageV2>
        </Form.Item>
        <Form.Item labelCol={{span: 4}}  name="name" label="站内链接配置" required>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item labelCol={{span: 4}}  name="name" label="作用范围" required>
          <Radio.Group>
            <Radio value={1}>全部用户</Radio>
            <Radio value={2}>部分用户</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item wrapperCol={{offset: 4}} name="regStatus" required validateTrigger="onBlur">
          <Select options={[]} placeholder="请选择" />
        </Form.Item>
      </Form>
    </PageContainer>
  );
};
