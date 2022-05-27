import { message, Form, Input, Select, DatePicker, InputNumber, Button, Cascader } from 'antd';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { routeName } from '../../../../../config/routes';
import { getAreaTree } from '@/services/area';
import UploadForm from '@/components/upload_form';
import UploadFormFile from '@/components/upload_form/upload-form-file';
import { UploadOutlined } from '@ant-design/icons';
import AuthenticationInfo from '@/types/authentication-info.d';
import {
  getEnterpriseDetail,
  getExpertDetail,
  getInstitutionDetail,
  updateEnterprise,
  updateExpert,
  updateInstitution,
} from '@/services/authentication-info';
import moment from 'moment';
import { getOrgTypeOptions } from '@/services/org-type-manage';
import { getDictionaryTree } from '@/services/dictionary';

const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<
    AuthenticationInfo.EnterpriseDetail &
      AuthenticationInfo.InstitutionDetail &
      AuthenticationInfo.ExpertDetail
  >({});
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [orgTypeOptions, setOrgTypeOptions] = useState<any>([]);
  const [areaOptions, setAreaOptions] = useState<any>([]);
  const [areaArr, setAreaArray] = useState<any>([]);
  const [expertTypeOptions, setExpertTypeOptions] = useState<any>([]);
  const [form] = Form.useForm();

  const getDictionary = async () => {
    try {
      const res = await Promise.all([
        getAreaTree({}),
        getAreaTree({ endLevel: 'COUNTY' }),
        getOrgTypeOptions(),
        getDictionaryTree('EXPERT'),
      ]);
      setAreaArray(res[0].children || []);
      setAreaOptions(res[1].children || []);
      setOrgTypeOptions(res[2].result || []);
      setExpertTypeOptions(res[3] || []);
    } catch (error) {
      message.error('服务器错误');
    }
  };
  const { id, type } = history.location.query as any;

  const prepare = async () => {
    if (id) {
      try {
        let res;
        switch (type) {
          case AuthenticationInfo.AuthenticationType.ENTERPRISE:
            res = await getEnterpriseDetail(id);
            break;
          case AuthenticationInfo.AuthenticationType.SERVICE_PROVIDER:
            res = await getInstitutionDetail(id);
            break;
          case AuthenticationInfo.AuthenticationType.EXPERT:
            res = await getExpertDetail(id);
            break;
          default:
          case AuthenticationInfo.AuthenticationType.ENTERPRISE:
            res = await getEnterpriseDetail(id);
            break;
        }
        getDictionary();
        if (res.code === 0) {
          const { formedDate, areaCode, countyCode, fileIds, fileList, expertType, ...rest } =
            res.result;

          setDetail(res.result);

          const formData = {
            formedDate: formedDate ? moment(formedDate) : undefined,
            area: [areaCode, countyCode],
            fileIds: fileList
              ? fileList?.map((p) => {
                  return {
                    // id: p.id,
                    // fileName: p.name,
                    // path: p.path,
                    // fileFormat: p.format,
                    uid: p.id,
                    name: p.name + '.' + p.format,
                    status: 'done',
                    url: p.path,
                  };
                })
              : [],
            expertType: expertType ? Number(expertType) : undefined,
            areaCode,
            ...rest,
          };
          form.setFieldsValue({ ...formData });
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        console.log('error', error);
        message.error('服务器错误');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    prepare();
  }, [id]);

  const getContractInfo = () => {
    return (
      <>
        <div className={sc('container-title')}>联系信息</div>
        <Form.Item
          name="orgName"
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
          name="phone"
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
          name="area"
          label="所属区域"
          required
          rules={[{ required: true, message: '必选' }]}
        >
          <Cascader
            style={{ width: '300px' }}
            fieldNames={{ label: 'name', value: 'code', children: 'children' }}
            options={areaOptions}
            placeholder="请选择"
            getPopupContainer={(trigger) => trigger as HTMLElement}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="address"
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
        {type === AuthenticationInfo.AuthenticationType.SERVICE_PROVIDER && (
          <Form.Item
            name="orgTypeId"
            rules={[
              {
                required: true,
                message: `必填`,
              },
            ]}
            label={`机构类型`}
          >
            <Select placeholder="请选择" allowClear style={{ width: '300px' }}>
              {orgTypeOptions?.map((item: any) => (
                <Select.Option key={item?.id} value={Number(item?.id)}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item
          name="businessLicenseId"
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
          name="creditCode"
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
          name="formedDate"
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
          label={`成立时间`}
        >
          <DatePicker allowClear style={{ width: '300px' }} />
        </Form.Item>
        <Form.Item
          name="registeredCapital"
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
            addonAfter={<div>万元</div>}
          />
        </Form.Item>
        <Form.Item
          name="scale"
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
          label={`企业规模`}
        >
          <Select placeholder="请选择" allowClear style={{ width: '300px' }}>
            <Select.Option value={1}>0～50人</Select.Option>
            <Select.Option value={2}>50～100人</Select.Option>
            <Select.Option value={3}>100～200人</Select.Option>
            <Select.Option value={4}>200～500人</Select.Option>
            <Select.Option value={5}>500人以上</Select.Option>
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
          name="aboutUs"
          label={'企业简介'}
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
          name="ability"
          label={'企业核心能力'}
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
          name="personalPhotoId"
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
          name="expertName"
          label={'姓名'}
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
          name="phone"
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
          name="workUnit"
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
          name="duty"
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
            {areaArr?.map((item: any) => (
              <Select.Option key={item?.code} value={Number(item?.code)}>
                {item?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="expertType"
          rules={[
            {
              required: true,
              message: `必填`,
            },
          ]}
          label={`专家类型`}
        >
          <Select placeholder="请选择" allowClear style={{ width: '300px' }}>
            {expertTypeOptions?.map((item: any) => (
              <Select.Option key={item?.id} value={item?.id}>
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
          name="expertIntroduction"
          label={'个人简介'}
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
        <Form.Item name="fileIds" label="相关附件">
          <UploadFormFile multiple isSkip={true} showUploadList={true} maxCount={10} maxSize={20}>
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

  const transformOrg = (values: any) => {
    const { area, formedDate, ...rest } = values;
    return {
      id,
      areaCode: area?.[0],
      countyCode: area?.[1],
      formedDate: formedDate ? formedDate.format('YYYY-MM-DD') : undefined,
      ...rest,
    };
  };

  const transformOrgInstitution = (values: any) => {
    const { area, formedDate, ...rest } = values;
    return {
      id,
      areaCode: area?.[0],
      countyCode: area?.[1],
      formedDate: formedDate ? formedDate.format('YYYY-MM-DD') : undefined,
      ...rest,
    };
  };

  const transformExpert = (values: any) => {
    const { fileIds, ...rest } = values;
    console.log('values', values);
    return {
      id,
      fileIds: fileIds?.map((p) => p.uid).join(','),
      ...rest,
    };
  };

  /**
   * 添加或者修改
   */
  const update = () => {
    form
      .validateFields()
      .then(async (value) => {
        const tooltipMessage = '修改';
        setUpdateLoading(true);
        let updateRes;
        switch (type) {
          case AuthenticationInfo.AuthenticationType.ENTERPRISE:
            updateRes = await updateEnterprise(transformOrg(value));
            break;
          case AuthenticationInfo.AuthenticationType.SERVICE_PROVIDER:
            updateRes = await updateInstitution(transformOrgInstitution(value));
            break;
          case AuthenticationInfo.AuthenticationType.EXPERT:
            updateRes = await updateExpert(transformExpert(value));
            break;
          default:
          case AuthenticationInfo.AuthenticationType.ENTERPRISE:
            updateRes = await updateEnterprise(transformOrg(value));
            break;
        }
        if (updateRes.code === 0) {
          if (!updateRes.result) {
            message.error('服务器错误');
            return;
          }
          history.push(routeName.AUTHENTICATION_INFO);
          message.success(`${tooltipMessage}成功`);
        } else {
          message.error(`${tooltipMessage}失败，原因:{${updateRes.message}}`);
        }
        setUpdateLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <PageContainer
      loading={loading}
      title={(detail?.orgName || detail?.expertName || '--') + '认证信息详情'}
      footer={[
        <Button type="primary" loading={updateLoading} onClick={() => update()}>
          保存
        </Button>,
        <Button onClick={() => history.goBack()}>返回</Button>,
      ]}
    >
      <div className={sc('container')}>
        <Form {...formLayout} form={form}>
          {(type === AuthenticationInfo.AuthenticationType.ENTERPRISE ||
            type === AuthenticationInfo.AuthenticationType.SERVICE_PROVIDER) &&
            getContractInfo()}
          {(type === AuthenticationInfo.AuthenticationType.ENTERPRISE ||
            type === AuthenticationInfo.AuthenticationType.SERVICE_PROVIDER) &&
            getOrgInfo()}
          {(type === AuthenticationInfo.AuthenticationType.ENTERPRISE ||
            type === AuthenticationInfo.AuthenticationType.SERVICE_PROVIDER) &&
            getOrgIntroduce()}
          {type === AuthenticationInfo.AuthenticationType.EXPERT && getExpertInfo()}
          {type === AuthenticationInfo.AuthenticationType.EXPERT && getExpertIntroduce()}
        </Form>
        <div className={sc('container-footer')}>{/* loading={loading}  */}</div>
      </div>
    </PageContainer>
  );
};
