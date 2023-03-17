import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { history } from 'umi';
import SelfTable from '@/components/self_table';
import { Button, Form, Input, Popconfirm, DatePicker, Modal, message, Breadcrumb } from 'antd';
import { saveMeeting, submitMeeting, detailMeetingForUserPage } from '@/services/baseline';
import useLimit from '@/hooks/useLimit';
import { Link } from 'umi';
import FormEdit from '@/components/FormEdit';
const sc = scopedClasses('baseline-conference-add');
export default () => {
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };
  const weightRef = useRef<any>();
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
  const [expandAttributes, setExpandAttributes] = useState<any>([]);
  const [numb, setNumb] = useState<any>(0);
  const [form] = Form.useForm();
  const columns = [
    {
      title: '字段ID',
      dataIndex: 'key',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '字段名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 400,
      render: (_: any, record: any) => {
        return (
          <div className={sc('container-option')}>
            <Input
              defaultValue={record.name}
              onChange={(e: any) => {
                record.name = e.target.value;
              }}
              placeholder="请输入用户需填写的字段"
              style={{ width: '300px', marginTop: '10px' }}
              maxLength={40}
            />
          </div>
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
  const { meetingId } = history.location.query as any;
  // 方法
  //获取会议详情
  const getMeetingByMeetingId = () => {
    detailMeetingForUserPage({ meetingId }).then((res) => {
      if (res.code === 0) {
        const newArr = res?.result.expandAttributes.map((p: any) => {
          p.key = p.id;
          return p;
        });
        console.log(newArr);
        setNumb(res?.result.expandIdBase);
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
  // 上架/暂存
  const addRecommend = async (submitFlag: boolean) => {
    if (submitFlag) {
      form
        .validateFields()
        .then(async (value) => {
          const startTime = moment(value.time[0]).format('YYYY-MM-DD HH:mm');
          const endTime = moment(value.time[1]).format('YYYY-MM-DD HH:mm');
          if (!value.weight) {
            value.weight = '1';
          }
          const submitRes = submitFlag
            ? await submitMeeting({
                submitFlag,
                expandAttributes,
                startTime,
                endTime,
                ...value,
                id: meetingId,
              })
            : await saveMeeting({
                id: meetingId,
                submitFlag,
                expandAttributes,
                startTime,
                endTime,
                ...value,
              });
          if (submitRes.code === 0) {
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
      const value = form.getFieldsValue();
      const startTime = value.time ? moment(value.time[0]).format('YYYY-MM-DD HH:mm') : '';
      const endTime = value.time ? moment(value.time[1]).format('YYYY-MM-DD HH:mm') : '';
      if (!value.weight) {
        value.weight = '1';
      }
      const submitRes = submitFlag
        ? await submitMeeting({
            submitFlag,
            expandAttributes,
            startTime,
            endTime,
            ...value,
            id: meetingId,
          })
        : await saveMeeting({
            id: meetingId,
            submitFlag,
            expandAttributes,
            startTime,
            endTime,
            ...value,
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
        <Button
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
          type="primary"
        >
          上架
        </Button>,
        <Button
          onClick={() => {
            addRecommend(false);
          }}
        >
          暂存
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
      <div className={sc('container-table-body')}>
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
            <Input placeholder="请输入" maxLength={100} />
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
            <Input placeholder="请输入" maxLength={100} />
          </Form.Item>

          <Form.Item name="theme" label="会议主题">
            <Input placeholder="请输入" maxLength={100} />
          </Form.Item>

          <Form.Item name="place" label="会议地点">
            <Input placeholder="请输入" maxLength={100} />
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
            <Input placeholder="请输入" maxLength={100} />
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
            <Input placeholder="请输入" maxLength={100} />
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
            <Input
              ref={weightRef}
              placeholder="请输入1～100的整数，数字越大排名越靠前"
              onInput={useLimit(weightRef)}
            />
          </Form.Item>

          <Form.Item name="agenda" label="会议日程">
            <FormEdit width={624} />
          </Form.Item>
        </Form>
        <div className={sc('container-table-body-title')}>用户报名填写信息</div>
        <div>说明：最多可新增5个字段</div>
        <Button
          style={{ margin: '10px 0' }}
          type="primary"
          disabled={expandAttributes.length >= 5}
          key="addStyle"
          onClick={() => {
            setNumb(numb + 1);
            let newNumber;
            if (numb + 1 >= 0 && numb + 1 < 10) {
              newNumber = '00' + (numb + 1);
            } else if (numb + 1 >= 10) {
              newNumber = '0' + (numb + 1);
            } else {
              newNumber = '' + (numb + 1);
            }
            expandAttributes.push({ key: newNumber, id: newNumber, name: '' });
            setExpandAttributes([...expandAttributes]);
          }}
        >
          <PlusOutlined /> 新增
        </Button>
        <SelfTable bordered columns={columns} dataSource={expandAttributes} pagination={null} />
      </div>
      <Modal
        visible={visible}
        title="提示"
        onCancel={() => {
          setVisible(false);
        }}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" onClick={() => history.goBack()}>
            直接离开
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              addRecommend(false);
              history.goBack();
            }}
          >
            暂存并离开
          </Button>,
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
            上架
          </Button>,
        ]}
      >
        <p>确定上架当前内容？</p>
      </Modal>
    </PageContainer>
  );
};
