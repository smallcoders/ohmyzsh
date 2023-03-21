import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { history } from 'umi';
import SelfTable from '@/components/self_table';
import {
  Button,
  Space,
  Card,
  Form,
  Input,
  Select,
  Popconfirm,
  DatePicker,
  Modal,
  message,
  Breadcrumb,
  InputNumber,
  Radio,
} from 'antd';
import {
  saveMeeting,
  submitMeeting,
  detailMeetingForUserPage,
  queryConvertOrg,
  queryListSimple,
} from '@/services/baseline';
import { Link } from 'umi';
import FormEdit from '@/components/FormEdit';
import UploadFormFile from '@/components/upload_form/upload-form-more';
import { debounce } from 'lodash-es';
import DebounceSelect from '@/pages/service_config/diagnostic_tasks/components/DebounceSelect';
const sc = scopedClasses('baseline-conference-add');
export default () => {
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };
  const formConferenceLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const formUserLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 18 },
  };
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
  const [visibleUserInfo, setVisibleUserInfo] = useState<boolean>(false);
  const [visibleImport, setVisibleImport] = useState<boolean>(false);
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false);
  const [visibleEditObj, setVisibleEditObj] = useState<any>({});
  const [expandAttributes, setExpandAttributes] = useState<any>([]);
  const [expandAttributeObj, setExpandAttributeObj] = useState<any>({});
  const [userType, setUserType] = useState<any>([]);
  const [edit, setEdit] = useState<any>(false);
  const [numb, setNumb] = useState<any>(0);
  const [detail, setDetail] = useState<any>({});
  const [organizationSimples, setOrganizationSimples] = useState<any>([]);
  const [defaultOrgs, setDefaultOrgs] = useState<{ label: string; value: string }[]>([]);
  const [form] = Form.useForm();
  const [guestForm] = Form.useForm();
  const [importForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [materialsForm] = Form.useForm();
  const { TextArea } = Input;
  const columns = [
    {
      title: '字段ID',
      dataIndex: 'key',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '字段类型',
      dataIndex: 'type',
      isEllipsis: true,
      width: 200,
      render: (_: any, record: any) => {
        return (
          <>
            {record.type === 'TEXT' && <div>文本</div>}
            {record.type === 'RADIO' && <div>单选</div>}
            {record.type === 'CHECKBOX' && <div>多选</div>}
          </>
        );
      },
    },
    {
      title: '字段名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '字段值',
      dataIndex: 'optionKey',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <div className={sc('container-option')}>
            <Button
              type="link"
              onClick={() => {
                setUserType(record.type);
                const { options, ...rest } = record;
                const optionsArr = record?.options?.map((e: any) => {
                  return { name: e };
                });
                setEdit(false);
                setExpandAttributeObj({ options: optionsArr, ...rest });
                userForm.setFieldsValue({ options: optionsArr, ...rest });
                setVisibleUserInfo(true);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="删除后，用户填写的该字段内容也将删除，确定删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                const newArray = expandAttributes.filter((p: any) => {
                  return p.key !== record.key;
                });
                setExpandAttributes([...newArray]);
              }}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  //参会单位表头数据
  const columnsCovert = [
    {
      title: '序号',
      dataIndex: 'index',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '企业名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 200,
      // render: (_: any, record: any) => {
      //   return <>{/*<div>{JSON.parse(record.name).name}</div>*/}</>;
      // },
    },
    {
      title: '关联企业库',
      dataIndex: 'related',
      isEllipsis: true,
      width: 200,
      render: (_: any, record: any) => {
        return (
          <>
            {record.related ? (
              <div style={{ color: '#0068ff' }}>关联成功</div>
            ) : (
              <div style={{ color: 'red' }}>关联失败</div>
            )}
          </>
        );
      },
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <div className={sc('container-option')}>
            <Button
              type="link"
              onClick={() => {
                const newArray = organizationSimples.filter((p: any) => {
                  return p.index !== record.index;
                });
                newArray?.forEach((item: any, index: any) => {
                  item.index = index + 1;
                });
                setOrganizationSimples(newArray);
              }}
            >
              删除
            </Button>
            {!record.related && (
              <Button
                type="link"
                onClick={() => {
                  editForm.setFieldsValue({
                    name: record.name,
                    index: record.index,
                    related: record.related,
                  });
                  setVisibleEditObj({
                    name: record.name,
                    index: record.index,
                    related: record.related,
                  });
                  if (editForm.getFieldsValue()) setVisibleEdit(true);
                }}
              >
                修改
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  const { meetingId } = history.location.query as any;
  // 方法
  //获取会议详情
  const getMeetingByMeetingId = () => {
    detailMeetingForUserPage({ meetingId }).then((res) => {
      if (res.code === 0) {
        const newArr = res?.result.expandAttributes.map((p: any) => {
          p.key = p.id;
          p.optionKey = p?.options?.length ? p.options.map((e: any) => e).join('、') : '--';
          return p;
        });
        guestForm.setFieldsValue({ guests: res?.result.guests });
        res?.result.materials?.map((e: any) => {
          e.organizationInfo = {
            key: e.organizationId,
            label: e.organizationName,
            value: e.organizationId,
          };
          return e;
        });
        materialsForm.setFieldsValue({
          materials: res?.result.materials,
          materialOpen: res?.result.materialOpen,
        });
        setDetail(res?.result);
        setNumb(res?.result.expandIdBase);
        res?.result?.organizationSimples?.forEach((item: any, index: any) => {
          item.index = index + 1;
        });
        setOrganizationSimples(res?.result.organizationSimples);
        setExpandAttributes(newArr);
        const time = [moment(res?.result.startTime), moment(res?.result.endTime)];
        if (res?.result.startTime && res?.result.endTime) {
          form.setFieldsValue({ time, ...res?.result });
        } else {
          form.setFieldsValue({ ...res?.result });
        }
      }
    });
  };
  useEffect(() => {
    meetingId && getMeetingByMeetingId();
  }, []);
  // 搜索企业
  const onSearchOrg = async (name: string) => {
    return queryListSimple({ name, size: 10 }).then((body) =>
      body.result.map((p: any) => ({
        label: p.name,
        value: p.id,
      })),
    );
  };
  // 上架/暂存
  const addRecommend = async (submitFlag: boolean) => {
    if (submitFlag) {
      Promise.all([
        form.validateFields(),
        guestForm.validateFields(),
        materialsForm.validateFields(),
      ])
        .then(async (value) => {
          const startTime = moment(value[0].time[0]).format('YYYY-MM-DD HH:mm');
          const endTime = moment(value[0].time[1]).format('YYYY-MM-DD HH:mm');
          if (!value[0].weight) {
            value[0].weight = '1';
          }
          value[2]?.materials?.map((e: any) => {
            e.organizationId = e?.organizationInfo?.key;
            return e;
          });
          const timer = setTimeout(function () {
            message.warning('数据提交中，请耐心等待...');
          }, 2000);
          const submitRes = await submitMeeting({
            expandAttributes,
            startTime,
            endTime,
            ...value[0],
            ...value[1],
            ...value[2],
            id: meetingId,
            organizationSimples,
          });
          if (submitRes.code === 0) {
            clearTimeout(timer);
            message.success(submitFlag ? '上架成功' : '数据已暂存');
            history.goBack();
          } else {
            message.error(`${submitRes.message}`);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      const value = [
        form.getFieldsValue(),
        guestForm.getFieldsValue(),
        materialsForm.getFieldsValue(),
        userForm.getFieldsValue(),
      ];
      value[2]?.materials?.map((e: any) => {
        e.organizationId = e.organizationInfo.key;
        return e;
      });
      const startTime = value[0]?.time ? moment(value[0].time[0]).format('YYYY-MM-DD HH:mm') : '';
      const endTime = value[0]?.time ? moment(value[0].time[1]).format('YYYY-MM-DD HH:mm') : '';
      if (!value[0].weight) {
        value[0].weight = '1';
      }
      const submitRes = await saveMeeting({
        id: meetingId,
        expandAttributes,
        startTime,
        endTime,
        ...value[0],
        ...value[1],
        ...value[2],
        ...value[3],
        organizationSimples,
      });
      if (submitRes.code === 0) {
        history.goBack();
        message.success(submitFlag ? '上架成功' : '数据已暂存');
      } else {
        message.error(`${submitRes.message}`);
      }
    }
  };
  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: meetingId ? `编辑` : '新增',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline">基线管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/baseline/baseline-conference-manage">会议管理 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{meetingId ? `编辑` : '新增'}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        <>
          {detail?.state === 'ON_SHELF' && (
            <Button
              onClick={() => {
                Promise.all([
                  form.validateFields(),
                  guestForm.validateFields(),
                  materialsForm.validateFields(),
                ])
                  .then(async () => {
                    setVisibleAdd(true);
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }}
              type="primary"
            >
              保存并更新线上会议
            </Button>
          )}
          {detail?.state !== 'ON_SHELF' && (
            <>
              <Button
                onClick={() => {
                  Promise.all([form.validateFields(), guestForm.validateFields()])
                    .then(async () => {
                      setVisibleAdd(true);
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }}
                type="primary"
              >
                上架
              </Button>
              <Button
                onClick={() => {
                  addRecommend(false);
                }}
              >
                暂存
              </Button>
            </>
          )}
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
          </Button>
        </>,
      ]}
    >
      <div className={sc('container-table-body')}>
        {/*会议信息*/}
        <div>
          <div className={sc('container-table-body-title')}>会议信息</div>
          <Form
            form={form}
            {...formLayout}
            onValuesChange={() => {
              setFormIsChange(true);
            }}
          >
            <Form.Item
              name="title"
              label="页面标题"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 5 }}
                placeholder="请输入"
                maxLength={100}
              />
            </Form.Item>
            <Form.Item
              name="name"
              label="会议名称"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 5 }}
                placeholder="请输入"
                maxLength={100}
              />
            </Form.Item>
            <Form.Item name="theme" label="会议主题">
              <TextArea
                autoSize={{ minRows: 1, maxRows: 5 }}
                placeholder="请输入"
                maxLength={100}
              />
            </Form.Item>
            <Form.Item name="place" label="会议地点">
              <TextArea
                autoSize={{ minRows: 1, maxRows: 5 }}
                placeholder="请输入"
                maxLength={100}
              />
            </Form.Item>
            <Form.Item
              name="sponsor"
              label="主办方"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 5 }}
                placeholder="请输入"
                maxLength={100}
              />
            </Form.Item>
            <Form.Item name="organizer" label="承办方">
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={200}
              />
            </Form.Item>
            <Form.Item name="coOrganizer" label="协办方">
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={200}
              />
            </Form.Item>
            <Form.Item
              name="contact"
              label="会议联系方式"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 5 }}
                placeholder="请输入"
                maxLength={100}
              />
            </Form.Item>
            <Form.Item
              name="time"
              label="会议时间"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                allowClear
                showTime
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>

            <Form.Item name="weight" label="权重">
              <InputNumber
                min={1}
                max={100}
                placeholder="请输入1～100的整数，数字越大排名越靠前"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item name="agenda" label="会议日程">
              <FormEdit width={624} />
            </Form.Item>
          </Form>
        </div>
        {/*嘉宾信息*/}
        <div>
          <div className={sc('container-table-body-title')}>嘉宾信息</div>
          <div>
            <Space direction="vertical" size={16}>
              <Form
                form={guestForm}
                {...formLayout}
                onValuesChange={() => {
                  setFormIsChange(true);
                }}
              >
                <Form.List name="guests">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item>
                        <Button
                          style={{ margin: '10px 0' }}
                          type="primary"
                          disabled={fields.length >= 20}
                          key="addStyle1"
                          onClick={() => add()}
                        >
                          <PlusOutlined /> 新增
                        </Button>
                      </Form.Item>
                      {fields.map((field, index) => (
                        <Card
                          key={field.key}
                          title={`嘉宾${index + 1}`}
                          extra={
                            <a
                              key="del"
                              onClick={() => {
                                remove(field.name);
                              }}
                            >
                              删除
                            </a>
                          }
                          style={{ width: 600, marginBottom: '10px' }}
                        >
                          <Form.Item
                            {...field}
                            name={[field.name, 'name']}
                            label="姓名"
                            rules={[
                              {
                                required: true,
                                message: `必填`,
                              },
                            ]}
                          >
                            <TextArea
                              autoSize={{ minRows: 1, maxRows: 4 }}
                              placeholder="请输入"
                              maxLength={60}
                            />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'introduction']}
                            label="嘉宾介绍"
                            rules={[
                              {
                                required: true,
                                message: `必填`,
                              },
                            ]}
                          >
                            <TextArea
                              autoSize={{ minRows: 2, maxRows: 10 }}
                              placeholder="请输入"
                              maxLength={200}
                            />
                          </Form.Item>
                        </Card>
                      ))}
                    </>
                  )}
                </Form.List>
              </Form>
            </Space>
          </div>
        </div>
        <div>
          <div className={sc('container-table-body-title')}>
            参会单位（共{organizationSimples.length}个）
          </div>
          <Button
            style={{ margin: '10px 0' }}
            type="primary"
            disabled={organizationSimples.length >= 300}
            key="addStyle1"
            onClick={() => {
              setVisibleImport(true);
            }}
          >
            <PlusOutlined /> 导入
          </Button>
          <SelfTable
            bordered
            scroll={{ y: 700 }}
            columns={columnsCovert}
            dataSource={organizationSimples}
            pagination={null}
          />
        </div>
        {/*会议资料*/}
        <div>
          <div className={sc('container-table-body-title')}>会议资料</div>
          <Form
            form={materialsForm}
            onValuesChange={() => {
              setFormIsChange(true);
            }}
          >
            <Form.Item
              name="materialOpen"
              label="可见权限"
              initialValue={true}
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <Radio.Group>
                <Radio value={true}>所有人可见</Radio>
                <Radio value={false}>仅参会企业可见</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
          <div>
            <Space direction="vertical" size={16}>
              <Form
                form={materialsForm}
                {...formConferenceLayout}
                onValuesChange={() => {
                  setFormIsChange(true);
                }}
              >
                <Form.List name="materials">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item>
                        <Button
                          // style={{ margin: '10px 0' }}
                          type="primary"
                          disabled={fields.length >= 10}
                          key="addStyle3"
                          onClick={() => add()}
                        >
                          <PlusOutlined /> 新增
                        </Button>
                      </Form.Item>
                      {fields.map((field, index) => (
                        <Card
                          key={field.key}
                          title={`材料${index + 1}`}
                          extra={
                            <a
                              key="del"
                              onClick={() => {
                                remove(field.name);
                              }}
                            >
                              删除
                            </a>
                          }
                          style={{ width: 600, marginBottom: '10px' }}
                        >
                          <Form.Item
                            {...field}
                            name={[field.name, 'name']}
                            label="材料名称"
                            rules={[
                              {
                                required: true,
                                message: `必填`,
                              },
                            ]}
                          >
                            <TextArea
                              autoSize={{ minRows: 1, maxRows: 6 }}
                              placeholder="请输入"
                              maxLength={100}
                              style={{ width: 600 }}
                            />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'fileIds']}
                            label="会议材料"
                            rules={[
                              {
                                required: true,
                                message: `必填`,
                              },
                            ]}
                          >
                            <UploadFormFile
                              listType="picture-card"
                              className="avatar-uploader"
                              maxCount={30}
                              accept=".png,.jpeg,.jpg"
                              multiple
                              limit={30}
                              tooltip={
                                <span className={'tooltip'}>仅支持JPG、PNG、JPEG，最大30张图</span>
                              }
                            />
                          </Form.Item>
                          <Form.Item name={[field.name, 'organizationInfo']} label="来源企业">
                            <DebounceSelect
                              showSearch
                              placeholder={'请输入搜索内容'}
                              fetchOptions={onSearchOrg}
                              style={{ width: '100%' }}
                              defaultOptions={defaultOrgs}
                            />
                          </Form.Item>
                        </Card>
                      ))}
                    </>
                  )}
                </Form.List>
              </Form>
            </Space>
          </div>
        </div>
        {/*用户报名填写信息*/}
        <div>
          <div className={sc('container-table-body-title')}>用户报名填写信息</div>
          <Button
            style={{ margin: '10px 0' }}
            type="primary"
            disabled={expandAttributes.length >= 10}
            key="addStyle4"
            onClick={() => {
              setEdit(true);
              setVisibleUserInfo(true);
            }}
          >
            <PlusOutlined /> 新增
          </Button>
          <SelfTable bordered columns={columns} dataSource={expandAttributes} pagination={null} />
        </div>
      </div>
      {/*用户报名填写信息弹窗*/}
      <Modal
        visible={visibleUserInfo}
        title={edit ? '新增' : '编辑' + '用户报名字段'}
        okText="确定"
        onCancel={() => {
          userForm.resetFields();
          setVisibleUserInfo(false);
        }}
        onOk={() => {
          userForm.validateFields().then(async (value) => {
            if (edit) {
              setNumb(numb + 1);
              let newNumber;
              if (numb + 1 >= 0 && numb + 1 < 10) {
                newNumber = '00' + (numb + 1);
              } else if (numb + 1 >= 10) {
                newNumber = '0' + (numb + 1);
              } else {
                newNumber = '' + (numb + 1);
              }
              const { type, name, options } = value;
              const optionKey = value.options
                ? value.options.map((e: any) => e.name).join('、')
                : '--';
              expandAttributes.push({
                optionKey,
                key: newNumber,
                id: newNumber,
                type,
                name,
                options: options ? options.map((e: any) => e.name) : [],
              });
              setExpandAttributes([...expandAttributes]);
            } else {
              expandAttributes.map((e: any) => {
                if (e.key === expandAttributeObj.key) {
                  e.optionKey = value.options
                    ? value.options.map((val: any) => val.name).join('、')
                    : '-';
                  e.type = value.type;
                  e.name = value.name;
                  e.options = value?.options ? value?.options.map((val: any) => val.name) : null;
                }
              });
              setExpandAttributes([...expandAttributes]);
            }
            userForm.resetFields();
            setUserType('');
            setVisibleUserInfo(false);
          });
        }}
      >
        <Form
          form={userForm}
          {...formUserLayout}
          onValuesChange={() => {
            setFormIsChange(true);
          }}
        >
          <Form.Item
            name="type"
            label="字段类型"
            rules={[
              {
                required: true,
                message: `必填`,
              },
            ]}
          >
            <Radio.Group
              onChange={(e) => {
                setUserType(e.target.value);
              }}
            >
              <Radio value={'TEXT'}>文本</Radio>
              <Radio value={'RADIO'}>单选</Radio>
              <Radio value={'CHECKBOX'}>多选</Radio>
            </Radio.Group>
          </Form.Item>
          {userType === 'TEXT' && (
            <Form.Item
              name="name"
              label="字段标题"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                style={{ width: 300 }}
                maxLength={40}
                placeholder="请输入用户需填写的字段名称"
              />
            </Form.Item>
          )}
          {(userType === 'RADIO' || userType === 'CHECKBOX') && (
            <>
              <Form.Item
                name="name"
                label="字段标题"
                rules={[
                  {
                    required: true,
                    message: `必填`,
                  },
                ]}
              >
                <TextArea
                  autoSize={{ minRows: 1, maxRows: 10 }}
                  style={{ width: 300 }}
                  maxLength={40}
                  placeholder="请输入用户需填写的字段名称"
                />
              </Form.Item>
              <Form.List name="options">
                {(fields, { add, remove }) => (
                  <>
                    <Form.Item>
                      <Button
                        // style={{ margin: '10px 0' }}
                        type="primary"
                        disabled={fields.length >= 20}
                        key="addStyle5"
                        onClick={() => add()}
                      >
                        <PlusOutlined /> 新增选项
                      </Button>
                    </Form.Item>
                    {fields.map((field, index) => (
                      <div
                        key={field.key}
                        style={{ width: 600, marginBottom: '10px', display: 'flex' }}
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          label={`字段选项${index + 1}`}
                          rules={[
                            {
                              required: true,
                              message: `必填`,
                            },
                          ]}
                        >
                          <TextArea
                            autoSize={{ minRows: 1, maxRows: 4 }}
                            placeholder="请输入"
                            maxLength={200}
                          />
                        </Form.Item>
                        <a
                          key="del"
                          onClick={() => {
                            const userValue = userForm.getFieldsValue().options;
                            if (userValue.length > 1) {
                              remove(field.name);
                            }
                          }}
                        >
                          删除
                        </a>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
            </>
          )}
        </Form>
      </Modal>
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
            <Button key="submit" onClick={() => history.goBack()}>
              直接离开
            </Button>
            {detail?.state !== 'ON_SHELF' && (
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  addRecommend(false);
                }}
              >
                暂存并离开
              </Button>
            )}
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
              addRecommend(true);
            }}
          >
            {detail?.state === 'ON_SHELF' ? '确定' : '上架'}
          </Button>,
        ]}
      >
        {detail?.state === 'ON_SHELF' ? <p>确定覆盖当前会议内容？</p> : <p>确定上架当前内容？</p>}
      </Modal>
      <Modal
        visible={visibleEdit}
        title="修改"
        onCancel={() => {
          editForm.resetFields();
          setVisibleEdit(false);
        }}
        footer={[
          <Button key="back" onClick={() => setVisibleEdit(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              editForm.validateFields().then(async (value) => {
                queryConvertOrg({ name: value?.NewName?.label }).then((res) => {
                  organizationSimples?.forEach((item: any) => {
                    if (item.index === value.index) {
                      item.organizationId = res?.result?.[0].key;
                      item.name = res?.result?.[0].name;
                      item.related = res?.result?.[0].related;
                    }
                  });
                  [...organizationSimples, ...res?.result]?.forEach((item: any, index: any) => {
                    item.index = index + 1;
                  });
                  setOrganizationSimples([...organizationSimples]);
                  editForm.resetFields();
                  setVisibleEdit(false);
                  setDefaultOrgs([]);
                });
              });
            }}
          >
            确定
          </Button>,
        ]}
      >
        {editForm.getFieldsValue() && (
          <Form
            form={editForm}
            {...formUserLayout}
            onValuesChange={() => {
              setFormIsChange(true);
            }}
          >
            <Form.Item name="index" />
            <Form.Item name="name" label="企业原名称">
              {visibleEditObj.name}
            </Form.Item>
            <Form.Item
              name="NewName"
              label="企业名称"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <DebounceSelect
                showSearch
                placeholder={'请输入搜索内容'}
                fetchOptions={onSearchOrg}
                style={{ width: '100%' }}
                defaultOptions={defaultOrgs}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
      {/*参会单位的导入*/}
      <Modal
        visible={visibleImport}
        title="导入"
        onCancel={() => {
          setVisibleImport(false);
          importForm.resetFields();
        }}
        footer={[
          <Button key="back" onClick={() => setVisibleImport(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              importForm.validateFields().then(async (value) => {
                queryConvertOrg({ ...value }).then((res) => {
                  [...organizationSimples, ...res?.result]?.forEach((item: any, index: any) => {
                    item.index = index + 1;
                  });
                  const newArray =
                    [...organizationSimples, ...res?.result]?.length > 300
                      ? [...organizationSimples, ...res?.result].splice(0, 300)
                      : [...organizationSimples, ...res?.result];
                  setOrganizationSimples(newArray);
                  importForm.resetFields();
                  setVisibleImport(false);
                });
              });
            }}
          >
            确定
          </Button>,
        ]}
      >
        <Form
          form={importForm}
          {...formLayout}
          onValuesChange={() => {
            setFormIsChange(true);
          }}
        >
          <Form.Item
            name="name"
            label="企业名称"
            rules={[
              {
                required: true,
                message: `必填`,
              },
            ]}
          >
            <TextArea
              autoSize={{ minRows: 3, maxRows: 10 }}
              style={{ width: 400 }}
              showCount
              maxLength={6000}
              placeholder="请输入"
            />
          </Form.Item>
          <div>说明：通过换行或者符号“；”区分企业</div>
        </Form>
      </Modal>
    </PageContainer>
  );
};
