/* eslint-disable */
import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message,
  Breadcrumb,
  DatePicker,
  Cascader
} from 'antd';
const { RangePicker } = DatePicker;
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import './live-manage-add.less';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import { listAllAreaCode } from '@/services/common';
import { 
  getProviderDetails, 
  addProvider, 
  getAllProviderTypes,
  updateProvider
} from '@/services/purchase';
import AppResource from '@/types/app-resource';
import { Link, history, Prompt } from 'umi';
import { routeName } from '../../../../config/routes';

const sc = scopedClasses('service-config-add-resource');
export default () => {
  /**
   * 是否跳转连接 1 跳转 0 不跳
   */
  const [isSkip, setIsSkip] = useState<string | number>(1);
  /**
   * 直播类型
   */
  const [appTypes, setAppTypes] = useState<any>([]);
  /**
   * 正在编辑的一行记录
   */
  const [editingItem, setEditingItem] = useState<AppResource.Content>({});

  /**
   * 详情记录
   */
   const [isDetail, setIsDetail] = useState<boolean>(false);

  /**
   * 添加或者修改 loading
   */
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  /**
   * 关闭提醒 主要是 添加或者修改成功后 不需要弹出
   */
  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(false);
  /**
   * 是否在编辑
   */
  const isEditing = Boolean(editingItem.id && !isDetail);

  const [form] = Form.useForm();

  const [formParams, setFormParams] = useState<object>({});

  // const cascaderOptions = [
  //   {
  //     value: 'zhejiang',
  //     label: 'Zhejiang',
  //     children: [
  //       {
  //         value: 'hangzhou',
  //         label: 'Hangzhou',
  //         children: [
  //           {
  //             value: 'xihu',
  //             label: 'West Lake',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     value: 'jiangsu',
  //     label: 'Jiangsu',
  //     children: [
  //       {
  //         value: 'nanjing',
  //         label: 'Nanjing',
  //         children: [
  //           {
  //             value: 'zhonghuamen',
  //             label: 'Zhong Hua Men',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];
  const [cascaderOptions, setCascaderOptions] = useState<object>([]);

  const onChange = (value) => {
    console.log(value);
  }; 

  // 新增直播时，直播时间选择不能选择今日今时之前的时间
  const range = (start, end) => {
    const result = [];
  
    for (let i = start; i < end; i++) {
      result.push(i);
    }
  
    return result;
  };

  /**
   * 清楚表单
   */
  // const clearForm = () => {
  //   isEditing && setEditingItem({});
  //   // form.resetFields()
  // };

  /**
   * 准备数据和路由获取参数等
   */
  const prepare = async () => {
    try {
      const { id, isDetail } = history.location.query as { id: string | undefined, isDetail: string | undefined };

      if (id) {
        // 获取详情 塞入表单
        const detailRs = await getProviderDetails({id});
        if (detailRs.code === 0) {
          let editItem = { ...detailRs.result };
          if(editItem.province) {
            editItem.pcds = [editItem.province, editItem.city, editItem.district, editItem.street || ''];
          }
          console.log(editItem, '---editItem');
          // editItem.isSkip = detailRs.result.url ? 1 : 0;
          // setIsSkip(0);
          setEditingItem({...editItem});
          form.setFieldsValue({ ...editItem });
        } else {
          message.error(`获取详情失败，原因:{${detailRs.message}}`);
        }
      }
      if(isDetail == '1') {
        setIsDetail(true);
        setIsClosejumpTooltip(false);
      }else {
        setIsClosejumpTooltip(true);
      }
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  // 获取省、市、区/县数据及所有供应商类型
  const getDictionary = async () => {
    try {
      const res = await Promise.all([
        listAllAreaCode(),
        getAllProviderTypes()
      ]);
      console.log(res[1]);
      setCascaderOptions(res[0]?.result || [])
      setAppTypes(res[1]?.result || []);
    } catch (error) {
      message.error('服务器错误');
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  useEffect(() => {
    getDictionary();
  }, []);
  /**
   * 新增/编辑
   */
  const addOrUpdate = () => {
    form
      .validateFields()
      .then(async (value: AppResource.Detail) => {
        const tooltipMessage = editingItem.id ? '编辑' : '新增';
        console.log(value, '<---value');
        const hide = message.loading(`正在${tooltipMessage}`);
        setAddOrUpdateLoading(true);
        // // 编辑
        let addorUpdateRes = {};
        if(editingItem.id) {
          addorUpdateRes = await updateProvider({
            ...value,
            province: value.pcds ? value.pcds[0] : '',
            city: value.pcds ? value.pcds[1] : '',
            district: value.pcds ? value.pcds[2] : '',
            street: value.pcds ? value.pcds[3] : '',
            id: editingItem.id
          });
          hide()
        }else {
          console.log({...value}, '新增供应商参数');
          addorUpdateRes = await addProvider({
            ...value,
            province: value.pcds? value.pcds[0] : '',
            city: value.pcds? value.pcds[1] : '',
            district: value.pcds? value.pcds[2] : '',
            street: value.pcds? value.pcds[3] : '',
          });
          hide();
        }
        if (addorUpdateRes.code === 0) {
          message.success(`${tooltipMessage}成功`);
          setIsClosejumpTooltip(false);
          history.push(routeName.PROVIDERS_MANAGE);
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch((err) => {
        // message.error('服务器错误，请稍后重试');
        console.log(err);
      });
  };

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: isEditing ? `编辑供应商` : isDetail ? '供应商详情' : '新增供应商',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/live-manage/antelope_live_management">羚羊直播管理 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {isEditing ? `编辑供应商` : isDetail ? '供应商详情' : '新增供应商'}
            </Breadcrumb.Item>
          </Breadcrumb>
        ),

        extra: (
          <div className="operate-btn">
            {!isDetail && (
              <Button key="primary" loading={addOrUpdateLoading} onClick={() => {history.push(routeName.PROVIDERS_MANAGE)}}>
                取消
              </Button>
            )}
            {!isDetail && (
              <Button type="primary" key="primary3" loading={addOrUpdateLoading} onClick={() => {addOrUpdate()}}>
                保存
              </Button>
            )}
            {isDetail && (
              <Button key="primary4" loading={addOrUpdateLoading} onClick={() => {history.push(routeName.PROVIDERS_MANAGE)}}>
                返回
              </Button>
            )}
          </div>
        ),
      }}
    >
      <Prompt
        when={isClosejumpTooltip && !isDetail}
        message={'离开当前页后，所编辑的数据将不可恢复'}
      />
      <Form className={sc('container-form')} {...formLayout} form={form} labelWrap>
        <div className='group-tit'>基本信息</div>
        <Row>
          <Col span={10} offset={2}>
            <Form.Item
              name="providerId"
              label="供应商编号"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            > 
              {isDetail ? (
                <span>{editingItem?.providerId || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={30} />
              )}
            </Form.Item>
            <Form.Item
              name="providerTypeId"
              label="类型"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            >
              {isDetail ? (
                <span>{editingItem?.providerTypeName || '--'}</span>
              ) : (
                <Select placeholder="请选择">
                  {appTypes.map((p: any) => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.providerTypeName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              name="phoneNum"
              label="手机"
            >
              {isDetail ? (
                <span>{editingItem?.phoneNum || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={30} />
              )}
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
            >
              {isDetail ? (
                <span>{editingItem?.email || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={30} />
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
          <Form.Item
              name="providerName"
              label="供应商名称"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            > 
              {isDetail ? (
                <span>{editingItem?.providerName || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={30} />
              )}
            </Form.Item>
            <Form.Item
              name="contactsName"
              label="联系人"
            >
              {isDetail ? (
                <span>{editingItem?.contactsName || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={30} />
              )}
            </Form.Item>
            <Form.Item
              name="telNum"
              label="座机"
            >
              {isDetail ? (
                <span>{editingItem?.telNum || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={30} />
              )}
            </Form.Item>
            <Form.Item
              name="pcds"
              label="所属地区"
            >
              {isDetail ? (
                <span>{
                  editingItem.province ?
                  editingItem.province + ' / ' + editingItem.city + ' / ' + editingItem.district+ ' / ' + editingItem.street||''
                  : '--'}</span>
              ) : (
                <Cascader
                  fieldNames={{ label: 'name', value: 'name', children: 'nodes' }}
                  options={cascaderOptions}
                  expandTrigger="hover"
                  onChange={onChange}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Form.Item
              name="address"
              label="详细地址"
            >
              {isDetail ? (
                <span>{editingItem?.address || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={100} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10} offset={2}>
            <Form.Item
              name="bankAccount"
              label="银行账号"
            > 
              {isDetail ? (
                <span>{editingItem?.bankAccount || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={100} />
              )}
            </Form.Item>
            <Form.Item
              name="bankCardPersonName"
              label="持卡人姓名"
            > 
              {isDetail ? (
                <span>{editingItem?.bankCardPersonName || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={30} />
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="bankName"
              label="开户银行"
            > 
              {isDetail ? (
                <span>{editingItem?.bankName || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={100} />
              )}
            </Form.Item>
            <Form.Item
              name="licensedTaxNum"
              label="税务登记号"
            > 
              {isDetail ? (
                <span>{editingItem?.licensedTaxNum || '--'}</span>
              ) : (
                <Input placeholder="请输入" maxLength={30} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <div className='group-tit'>收款信息</div>
        <Row>
          <Col span={10} offset={2}>
            <Form.Item 
              name="payCompanyName" 
              label="公司名称"
            >
              {isDetail ? (
                <span>{editingItem?.payCompanyName || '--'}</span>
              ) : (
                <Input />
              )}
            </Form.Item>
            <Form.Item 
              name="payBankDepositName" 
              label="开户行"
            >
              {isDetail ? (
                <span>{editingItem?.payBankDepositName || '--'}</span>
              ) : (
                <Input />
              )}
            </Form.Item>
            <Form.Item 
              name="payTaxNum" 
              label="税号"
            >
              {isDetail ? (
                <span>{editingItem?.payTaxNum || '--'}</span>
              ) : (
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item 
              name="payBankAccount" 
              label="银行账户"
            >
              {isDetail ? (
                <span>{editingItem?.payBankAccount || '--'}</span>
              ) : (
                <Input />
              )}
            </Form.Item>
            <Form.Item 
              name="payUnionpay" 
              label="银联号"
            >
              {isDetail ? (
                <span>{editingItem?.payUnionpay || '--'}</span>
              ) : (
                <Input />
              )}
            </Form.Item>
            <Form.Item 
              name="payPhoneNum" 
              label="电话"
            >
              {isDetail ? (
                <span>{editingItem?.payPhoneNum || '--'}</span>
              ) : (
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Form.Item 
              name="payAddress" 
              label="地址"
            >
              {isDetail ? (
                <span>{editingItem?.payAddress || '--'}</span>
              ) : (
                <Input />
              )}
            </Form.Item>
            </Col>
        </Row>
        {isDetail && (
          <Row>
            <Col span={10} offset={2}>
              <Form.Item 
                name="start" 
                label="创建人">
                <span>{editingItem?.createUser || '--'}</span>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item 
                name="start" 
                label="创建时间">
                <span>{editingItem?.createTime || '--'}</span>
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
      <div></div>
    </PageContainer>
  );
};
