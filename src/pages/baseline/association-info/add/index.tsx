import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Breadcrumb,
  InputNumber,
  Select,
  message,
  Cascader,
} from 'antd';
import { history } from '@@/core/history';
import { Link } from 'umi';
import { phoneVerifyReg } from '@/utils/regex-util';
import UploadFormFile from '@/components/upload_form/upload-form';
import { queryAllianceDetail, saveAlliance } from '@/services/baseline-info';
import { getWholeAreaTree } from '@/services/area';
const sc = scopedClasses('baseline-association-add');
import UploadFormAvatar from '@/components/upload_form/upload-form-avatar';
export default () => {
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
  };
  const { TextArea } = Input;
  const [areaOptions, setAreaOptions] = useState<any>([]);
  const [form] = Form.useForm();
  // 方法

  useEffect(() => {
    // 获取区域省+市下拉
    getWholeAreaTree({ endLevel: 'COUNTY' }).then((data) => {
      setAreaOptions(data || []);
    });
  }, []);
  //获取热门话题详情
  const { organizationId } = history.location.query as any;
  const getGovDetailById = () => {
    queryAllianceDetail({ organizationId }).then((res) => {
      if (res.code === 0) {
        const areaCode = [res?.result.provinceCode, res?.result.cityCode, res?.result.countyCode];
        form.setFieldsValue({ ...res?.result, areaCode });
      }
    });
  };
  useEffect(() => {
    getGovDetailById();
  }, []);

  // 上架/暂存
  const addAssociation = async () => {
    const value = form.getFieldsValue();
    const [provinceCode, cityCode, countyCode] = value.areaCode;
    const submitRes = organizationId
      ? await saveAlliance({
          organizationId,
          ...value,
          countyCode,
          cityCode,
          provinceCode,
        })
      : await saveAlliance({
          ...value,
          countyCode,
          cityCode,
          provinceCode,
        });
    if (submitRes.code === 0) {
      message.success('保存成功');
      history.goBack();
    } else {
      message.error(`${submitRes.message}`);
    }
  };
  // @ts-ignore
  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: organizationId ? `编辑` : '新增',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline">基线管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/baseline/baseline-association-manage">协会信息配置 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{organizationId ? `编辑` : '新增'}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        <Button
          type="primary"
          onClick={() => {
            form
              .validateFields()
              .then(async () => {
                setVisibleAdd(true);
              })
              .catch((e) => {
                console.log(e);
              });
          }}
        >
          保存
        </Button>,
        <Button
          style={{ marginRight: '40px' }}
          onClick={() => {
            if (formIsChange) {
              setVisible(true);
            } else {
              history.goBack();
            }
          }}
        >
          返回
        </Button>,
      ]}
    >
      <div>
        <Form
          {...formLayout}
          form={form}
          onValuesChange={() => {
            setFormIsChange(true);
          }}
        >
          <div className={sc('container-table-body')}>
            <div className={sc('container-table-body-title')}>协会基础信息</div>
            <Form.Item
              name="name"
              label="协会名称"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={100}
              />
            </Form.Item>
            <Form.Item
              name="industryCategoryId"
              label="所属产业"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={60}
              />
            </Form.Item>
            <Form.Item
              name="districtCodeType"
              label="协会级别"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <Select placeholder="请选择" allowClear style={{ width: '100%' }}>
                <Select.Option value={1}>省级</Select.Option>
                <Select.Option value={2}>市级</Select.Option>
                <Select.Option value={3}>区县级</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="areaCode"
              label="所在区域"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <Cascader
                fieldNames={{ label: 'name', value: 'code', children: 'nodes' }}
                options={areaOptions}
                getPopupContainer={(triggerNode) => triggerNode}
                placeholder="请选择"
              />
            </Form.Item>
            <Form.Item name="aboutUs" label="协会介绍">
              <TextArea
                autoSize={{ minRows: 1, maxRows: 20 }}
                placeholder="请输入"
                maxLength={500}
              />
            </Form.Item>
            <Form.Item
              name="logoUrl"
              label="官方logo"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <UploadFormAvatar
                action={'/antelope-common/common/file/upload/record/withAuthCheck'}
                listType="picture-card"
                className="avatar-uploader"
                maxCount={1}
                accept=".png,.jpeg,.jpg"
                shape={'round'}
              />
            </Form.Item>
            <Form.Item name="qrcodeFileId" label="官方协会二维码">
              <UploadFormFile
                listType="picture-card"
                className="avatar-uploader"
                maxCount={1}
                accept=".png,.jpeg,.jpg"
                tooltip={<span className={'tooltip'}>仅支持JPG、PNG、JPEG</span>}
              />
            </Form.Item>
            <Form.Item name="aqcUrl" label="爱企查对应地址">
              <TextArea autoSize={{ minRows: 1, maxRows: 10 }} placeholder="请输入" />
            </Form.Item>
            <Form.Item name="weight" label="协会权重">
              <InputNumber
                min={1}
                max={100}
                placeholder="请输入1～100的整数，数字越大排名越靠前"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>
          <div className={sc('container-table-body')}>
            <div className={sc('container-table-body-title')}>联系信息</div>
            <Form.Item
              name="contactName"
              label="联系人"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={20}
              />
            </Form.Item>
            <Form.Item
              name="contactPhone"
              label={`联系电话`}
              rules={[
                { required: true, message: '请输入' },
                {
                  pattern: phoneVerifyReg,
                  message: '请输入正确手机号',
                  validateTrigger: 'onBlur',
                },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                placeholder="请输入"
                autoComplete="off"
                allowClear
                maxLength={35}
              />
            </Form.Item>
            <Form.Item
              name="contactAddress"
              label="联系地址"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={100}
              />
            </Form.Item>
          </div>
        </Form>
      </div>
      <Modal
        visible={visible}
        title="提示"
        onCancel={() => {
          setVisible(false);
        }}
        footer={[
          <>
            <Button key="back" onClick={() => setVisible(false)}>
              取消
            </Button>
            <Button type={'primary'} key="submit" onClick={() => history.goBack()}>
              直接离开
            </Button>
          </>,
        ]}
      >
        <p>数据未保存，是否仍要离开当前页面？</p>
      </Modal>
      <Modal
        visible={visibleAdd}
        title="提示"
        onCancel={() => {
          setVisibleAdd(false);
        }}
        footer={[
          <Button key="back" onClick={() => setVisibleAdd(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              addAssociation();
            }}
          >
            保存
          </Button>,
        ]}
      >
        <p>确定当前内容更新到前台</p>
      </Modal>
    </PageContainer>
  );
};
