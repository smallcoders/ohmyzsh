import { message, Image, Form, Input, Select, DatePicker, InputNumber, Button, Space } from 'antd';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getCreativeDetail } from '@/services/kc-verify';
import { getEnumByName } from '@/services/common';
import VerifyInfoDetail from '@/components/verify_info_detail/verify-info-detail';
import { getAreaTree } from '@/services/area';
import UploadForm from '@/components/upload_form';
import UploadFormFile from '@/components/upload_form/upload-form-file';
import { UploadOutlined } from '@ant-design/icons';

const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});
  const [enums, setEnums] = useState<any>({});
  const [areaOptions, setAreaOptions] = useState<any>([]);
  const getDictionary = async () => {
    try {
      const res = await Promise.all([getAreaTree({})]);
      setAreaOptions(res[0].children);
    } catch (error) {
      message.error('服务器错误');
    }
  };

  // const prepare = async () => {
  //   const id = history.location.query?.id as string;

  //   if (id) {
  //     try {
  //       const res = await getCreativeDetail(id);
  //       getDictionary();
  //       if (res.code === 0) {
  //         console.log(res);
  //         setDetail(res.result);
  //       } else {
  //         throw new Error(res.message);
  //       }
  //     } catch (error) {
  //       message.error('服务器错误');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  // const getEnum = (enumType: string, enumName: string) => {
  //   try {
  //     return enums[enumType]?.filter((p: any) => p.enumName === enumName)[0].name;
  //   } catch (error) {
  //     return '--';
  //   }
  // };

  useEffect(() => {
    // prepare();
  }, []);

  const getContractInfo = () => {
    return (
      <>
        <div className={sc('container-title')}>联系信息</div>
        <Form.Item
          name="contactName"
          label={'企业名称'}
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
        >
          <Input
            style={{ width: '300px' }}
            placeholder="请输入"
            autoComplete="off"
            allowClear
            maxLength={35}
          />
        </Form.Item>

        <Form.Item
          name="contactPhone"
          label={'联系电话'}
          rules={[
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject(new Error('必填'));
                }
                if (
                  !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
                    value, // todo : 抽出
                  )
                ) {
                  return Promise.reject(new Error('输入正确的手机号码'));
                }
                return Promise.resolve();
              },
            }),
          ]}
          required
        >
          <Input
            style={{ width: '300px' }}
            placeholder="请输入"
            autoComplete="off"
            allowClear
            maxLength={35}
          />
        </Form.Item>
        <Form.Item
          name="areaCode"
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
          label={`所属区域`}
        >
          <Select placeholder="请选择" allowClear style={{ width: '300px' }}>
            {areaOptions?.map((item: any) => (
              <Select.Option key={item?.code} value={Number(item?.code)}>
                {item?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="contactPhone"
          label={'详细地址'}
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
        >
          <Input
            style={{ width: '300px' }}
            placeholder="请输入"
            autoComplete="off"
            allowClear
            maxLength={50}
          />
        </Form.Item>
      </>
    );
  };

  const getOrgInfo = () => {
    return (
      <>
        <div className={sc('container-title')}>企业基本信息</div>
        {
          <Form.Item
            name="areaCode"
            rules={[
              {
                required: true,
                message: `必填`,
              },
            ]}
            label={`机构类型`}
          >
            <Select placeholder="请选择" allowClear style={{ width: '300px' }}>
              {areaOptions?.map((item: any) => (
                <Select.Option key={item?.code} value={Number(item?.code)}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        }
        <Form.Item
          name="coverId"
          label="营业执照"
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
            accept=".png,.jpeg,.jpg"
            tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG,且不超过5M</span>}
          />
        </Form.Item>
        <Form.Item
          name="contactName"
          label={'统一社会信用代码'} // todo: 工业企业账号中，统一信用代码需做唯一性校验
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
        >
          <Input
            style={{ width: '300px' }}
            placeholder="请输入"
            autoComplete="off"
            allowClear
            maxLength={35}
          />
        </Form.Item>
        <Form.Item
          name="areaCode"
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
          label={`成立时间`}
        >
          <DatePicker.RangePicker allowClear style={{ width: '300px' }}/>
        </Form.Item>
        <Form.Item
          name="contactPhone"
          label={'注册资本'}
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
        >
          <InputNumber
          style={{ width: '300px' }}
            min={0}
            max={99999999999}
            addonAfter={<div style={{ color: '#fff' }}>万元</div>}
          />
        </Form.Item>
        <Form.Item
          name="areaCode"
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
          label={`企业规模`}
        >
          <Select placeholder="请选择" allowClear style={{ width: '300px' }}>
            {areaOptions?.map((item: any) => (
              <Select.Option key={item?.code} value={Number(item?.code)}>
                {item?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </>
    );
  };
  const getOrgIntroduce = () => {
    return (
      <>
        <div className={sc('container-title')}>企业介绍</div>

        <Form.Item
          name="coverId"
          label="公司封面"
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
            accept=".png,.jpeg,.jpg"
            tooltip={
              <span className={'tooltip'}>
                公司实景图，用作网站公司介绍主图，建议尺寸235*170，图片格式仅支持JPG、PNG、JPEG,大小在5M以下
              </span>
            }
          />
        </Form.Item>
        <Form.Item
          name="contactName"
          label={'企业简介'} // todo: 工业企业账号中，统一信用代码需做唯一性校验
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
        >
          <Input.TextArea
            style={{ width: '300px' }}
            placeholder="请输入"
            autoComplete="off"
            showCount
            rows={3}
            maxLength={400}
          />
        </Form.Item>
        <Form.Item
          name="contactName"
          label={'企业核心能力'} // todo: 工业企业账号中，统一信用代码需做唯一性校验
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
        >
          <Input.TextArea
            style={{ width: '300px' }}
            placeholder="请输入"
            autoComplete="off"
            showCount
            rows={3}
            maxLength={500}
          />
        </Form.Item>
      </>
    );
  };

  const getExpertInfo = () => {
    return (
      <>
        <div className={sc('container-title')}>专家基本信息</div>
        <Form.Item
          name="coverId"
          label="个人照片"
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
            accept=".png,.jpeg,.jpg"
            tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG,且不超过5M</span>}
          />
        </Form.Item>
        <Form.Item
          name="contactName"
          label={'姓名'} // todo: 工业企业账号中，统一信用代码需做唯一性校验
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
        >
          <Input
            style={{ width: '300px' }}
            placeholder="请输入"
            autoComplete="off"
            allowClear
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          name="contactPhone"
          label={'联系电话'}
          rules={[
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject(new Error('必填'));
                }
                if (
                  !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
                    value, // todo : 抽出
                  )
                ) {
                  return Promise.reject(new Error('输入正确的手机号码'));
                }
                return Promise.resolve();
              },
            }),
          ]}
          required
        >
          <Input
            style={{ width: '300px' }}
            placeholder="请输入"
            autoComplete="off"
            allowClear
            maxLength={35}
          />
        </Form.Item>

        <Form.Item
          name="contactName"
          label={'工作单位'}
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
        >
          <Input
            style={{ width: '300px' }}
            placeholder="请输入"
            autoComplete="off"
            allowClear
            maxLength={50}
          />
        </Form.Item>
        <Form.Item
          name="contactName"
          label={'职位'}
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
        >
          <Input
            style={{ width: '300px' }}
            placeholder="请输入"
            autoComplete="off"
            allowClear
            maxLength={50}
          />
        </Form.Item>
        <Form.Item
          name="areaCode"
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
          label={`所属区域`}
        >
          <Select placeholder="请选择" allowClear style={{ width: '300px' }}>
            {areaOptions?.map((item: any) => (
              <Select.Option key={item?.code} value={Number(item?.code)}>
                {item?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="areaCode"
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
          label={`专家类型`}
        >
          <Select placeholder="请选择" allowClear style={{ width: '300px' }}>
            {areaOptions?.map((item: any) => (
              <Select.Option key={item?.code} value={Number(item?.code)}>
                {item?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </>
    );
  };

  const getExpertIntroduce = () => {
    return (
      <>
        <div className={sc('container-title')}>专家介绍</div>

        <Form.Item
          name="contactName"
          label={'个人简介'} // todo: 工业企业账号中，统一信用代码需做唯一性校验
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
        >
          <Input.TextArea
            style={{ width: '300px' }}
            placeholder="请输入"
            autoComplete="off"
            showCount
            rows={3}
            maxLength={400}
          />
        </Form.Item>
        <Form.Item
          name="reportFileId" // state 	状态0发布中1待发布2已下架
          label="相关附件"
        >
          <UploadFormFile showUploadList={true} maxCount={1}>
            <div>可上传资质证书、荣誉证明等,支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </UploadFormFile>
        </Form.Item>
      </>
    );
  };
  const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 14 },
  };

  const [form] =  Form.useForm()
  return (
    <PageContainer loading={loading}
     footer={
      [<Button type="primary">保存</Button>,
      <Button>返回</Button>]
    }>
      <div className={sc('container')}>
        <Form {...formLayout} form={form}>
          {getContractInfo()}
          {getOrgInfo()}
          {getOrgIntroduce()}
          {getExpertInfo()}
          {getExpertIntroduce()}
          </Form>
          <div className={sc('container-footer')}>
            {/* loading={loading}  */}
       
          </div>
    
      </div>
    </PageContainer>
  );
};
