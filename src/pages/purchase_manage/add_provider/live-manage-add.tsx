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
  DatePicker
} from 'antd';
const { RangePicker } = DatePicker;
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import './live-manage-add.less';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import {
  getVideoDetail,
  addLive,
  updateLive,
  getLiveTypesPage
} from '@/services/search-record';
import { getProviderDetails } from '@/services/purchase';
import UploadForm from '@/components/upload_form';
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
  const [appTypes, setAppTypes] = useState<{ id: string; name: string }[]>([]);
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
  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(true);
  /**
   * 是否在编辑
   */
  const isEditing = Boolean(editingItem.id && !isDetail);
  console.log(isEditing, 'isEditing');

  const [form] = Form.useForm();

  const [formParams, setFormParams] = useState<object>({});

  // 新增直播时，直播时间选择不能选择今日今时之前的时间
  const range = (start, end) => {
    const result = [];
  
    for (let i = start; i < end; i++) {
      result.push(i);
    }
  
    return result;
  };
  const disabledDate = (current) => {
    // Can not select days before today
    return current < moment().endOf('day');
  };
  const disabledRangeTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
  
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
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
      const prepareResultArray = await Promise.all([getLiveTypesPage({
        pageIndex: 1,
        pageSize: 100,
      })]);
      setAppTypes(prepareResultArray[0].result || []);

      const { id, isDetail } = history.location.query as { id: string | undefined, isDetail: string | undefined };

      if (id) {
        // 获取详情 塞入表单
        const detailRs = await getProviderDetails({id});
        let editItem = { ...detailRs.result };
        console.log(editItem, '---editItem')
        if (detailRs.code === 0) {
          editItem.isSkip = detailRs.result.url ? 1 : 0;
          setIsSkip(editItem.isSkip);
          console.log(editItem, 'res---editItem');
          setEditingItem({...editItem});
        } else {
          message.error(`获取详情失败，原因:{${detailRs.message}}`);
        }
      }
      if(isDetail == '1') {
        setIsDetail(true);
      }
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  useEffect(() => {
    prepare();
    window.addEventListener('beforeunload', listener);
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, []);


  /**
   * 新增/编辑
   */
  const addOrUpdate = (lineStatus: boolean) => {
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
          addorUpdateRes = await updateLive({
            ...value,
            startTime: moment(value.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(value.time[1]).format('YYYY-MM-DD HH:mm:ss'),
            closeReplay: value.extended?.indexOf('replay') > -1 ? 0 : 1,
            closeKf: value.extended?.indexOf('kf') > -1 ? 0 : 1,
            closeLike: value.extended?.indexOf('like') > -1 ? 0 : 1,
            closeGoods: value.extended?.indexOf('goods') > -1 ? 0 : 1,
            closeComment: value.extended?.indexOf('comment') > -1 ? 0 : 1,
            closeShare: value.extended?.indexOf('share') > -1 ? 0 : 1,
            id: editingItem.id
          });
          hide()
        }else {
          addorUpdateRes = await addLive({
            ...value,
            startTime: moment(value.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(value.time[1]).format('YYYY-MM-DD HH:mm:ss'),
            lineStatus: lineStatus,
            closeReplay: value.extended?.indexOf('replay') > -1 ? 0 : 1,
            closeKf: value.extended?.indexOf('kf') > -1 ? 0 : 1,
            closeLike: value.extended?.indexOf('like') > -1 ? 0 : 1,
            closeGoods: value.extended?.indexOf('goods') > -1 ? 0 : 1,
            closeComment: value.extended?.indexOf('comment') > -1 ? 0 : 1,
            closeShare: value.extended?.indexOf('share') > -1 ? 0 : 1
          });
          hide();
        }
        if (addorUpdateRes.code === 0) {
          message.success(`${tooltipMessage}成功`);
          setIsClosejumpTooltip(false);
          history.push(routeName.ANTELOPE_LIVE_MANAGEMENT_INDEX);
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

  // 额外的副作用 用来解决表单的设置
  useEffect(() => {
    form.setFieldsValue({ ...editingItem });
  }, [editingItem]);

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const listener = (e: any) => {
    e.preventDefault();
    e.returnValue = '离开当前页后，所编辑的数据将不可恢复';
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
              <Button key="primary" loading={addOrUpdateLoading} onClick={() => {history.push(routeName.ANTELOPE_LIVE_MANAGEMENT_INDEX)}}>
                取消
              </Button>
            )}
            {!isDetail && (
              <Button type="primary" key="primary3" loading={addOrUpdateLoading} onClick={() => {addOrUpdate(false)}}>
                保存
              </Button>
            )}
            {isDetail && (
              <Button key="primary4" loading={addOrUpdateLoading} onClick={addOrUpdate}>
                返回
              </Button>
            )}
          </div>
        ),
      }}
    >
      <Prompt
        when={isClosejumpTooltip}
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
              name="typeIds"
              label="类型"
              rules={[
                {
                  required: !isDetail,
                  message: '必填',
                },
              ]}
            >
              {isDetail ? (
                <span>{editingItem?.typeNames || '--'}</span>
              ) : (
                <Select placeholder="请选择" mode="multiple">
                  {appTypes.map((p) => (
                    <Select.Option key={'type' + p.id} value={p.id}>
                      {p.name}
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
              name="eMail"
              label="邮箱"
            >
              {isDetail ? (
                <span>{editingItem?.eMail || '--'}</span>
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
              name="district"
              label="所属地区"
            >
              {isDetail ? (
                <span>{editingItem?.district || '--'}</span>
              ) : (
                <Select placeholder="请选择">
                  {appTypes.map((p) => (
                    <Select.Option key={'type' + p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
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
              name="title"
              label="开户银行"
            > 
              {isDetail ? (
                <span>{editingItem?.title || '--'}</span>
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
                <span>{editingItem?.lineAccountName || '--'}</span>
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
