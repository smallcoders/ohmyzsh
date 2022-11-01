import { PlusOutlined } from '@ant-design/icons';
import type {
  RadioChangeEvent} from 'antd';
import {
  Switch,
  Space,
  Modal,
  Table,
  Radio,
  Form,
  Input,
  Button,
  Popconfirm, message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from "@/types/common";
import Activity from "@/types/operation-activity";
import {
  postAddChannel,
  postAddScene, postDeleteChannel,
  postDeleteScene, postQueryChannelByPage, postQuerySceneByPage,
  postUpdateChannel,
  postUpdateScene
} from "@/services/opration-activity";

const sc = scopedClasses('operation-activity-param-setting');
const Tablist: React.FC = () => {
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  // const [dataSource, setDataSource] = useState<Activity.Content[]>([]);
  const [editingItem, setEditingItem] = useState<Activity.Content>({});
  const [btnType, setBtnType] = useState({});
  const [open, setOpen] = useState<boolean>(false);
  const [edge, setEdge] = useState<Activity.Edge>(Activity.Edge.CHANNEL);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const clearForm = () => {
    form.resetFields();
    if (editingItem.name || editingItem.description) setEditingItem({});
  };
  //新增和修改渠道值的确认按钮
  const onFinish = async () => {
    const hide = message.loading(`正在${btnType}`);
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        let addorUpdateRes;
        if(btnType=='新增'){
          addorUpdateRes = edge == 0
            ? await postAddChannel({ channelName:value.name,description:value.description})
            : await postAddScene({ sceneName:value.name,description:value.description });
        }else{
          addorUpdateRes = edge == 0
            ? await postUpdateChannel({ channelName:value.name,description:value.description})
            : await postUpdateScene({ sceneName:value.name,description:value.description });
        }
        hide();
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          message.success(`${btnType}成功`);
          clearForm();
        } else {
          message.error(`${btnType}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch((err)=>{
        hide()
        console.log(err)
      })
      .finally(()=>{
        setAddOrUpdateLoading(true);
      })
  };
  //新增和修改渠道/场景值弹窗
  const getModal = () => {
    return (
      <Modal
        title={edge == 0? `${btnType}渠道值` :  `${btnType}场景值`}
        width="400px"
        maskClosable={false}
        visible={createModalVisible}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
          setAddOrUpdateLoading(false);
        }}
        onOk={ async () => {
          await onFinish();
        }}
      >
        <Form
          form={form}
          layout="horizontal"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label={edge == 0? '渠道值名称' : '场景值名称'}
            name="name"
            rules={[{ required: true, message: '请输入渠道值名称！' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label={edge == 0? '渠道值名描述' : '场景值名描述'}
            name="description"
          >
            <TextArea rows={4} />
          </Form.Item>

        </Form>
      </Modal>
    );
  };
  //选择渠道/场景值
  const selectButton = (): React.ReactNode => {
    const handleEdgeChange = (e: RadioChangeEvent) => {
      setEdge(e.target.value);
    };
    return (
      <Radio.Group value={edge} onChange={handleEdgeChange}>
        <Radio.Button value={Activity.Edge.CHANNEL}>渠道值</Radio.Button>
        <Radio.Button value={Activity.Edge.SCENE}>场景值</Radio.Button>
      </Radio.Group>
    );
  };
  //获取渠道/场景值列表
  const getOperationActivity = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } =edge==0
        ? await postQueryChannelByPage({
          pageIndex,
          pageSize,
          belong: edge,
        })
        :await postQuerySceneByPage({
          pageIndex,
          pageSize,
          belong: edge,
        })
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        // setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //是否启用的switch按钮
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
    if (!checked) {
      setOpen(!checked);
      return;
    }
  };
  //是否启用的的确认按钮
  const confirm = async(record: any) => {
    try {
      const data={id:record.id,isActive:record.checked}
      const res = edge==0
        ?await postUpdateChannel(data)
        : await postUpdateScene(data)
      if (res.code === 0) {
        setModalVisible(false);
        message.success(`${btnType}成功`);
        clearForm();
        await getOperationActivity();
      } else {
        message.error(`${btnType}失败，原因:{${res.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const cancel= async (record: any)=>{
    console.log(record)
    await getOperationActivity();
  }
  //阐述渠道/场景值的按钮
  const remove = async (id: string) =>{
    try {
    const res = edge==0
      ?await postDeleteChannel(id)
      : await postDeleteScene(id)
    if (res.code === 0) {
      setModalVisible(false);
      message.success(`${btnType}成功`);
      clearForm();
     await getOperationActivity();
    } else {
      message.error(`${btnType}失败，原因:{${res.message}}`);
    }
  } catch (error) {
    console.log(error);
  }
  }

  // useEffect(() => {
  //   getOperationActivity();
  // }, [edge]);
  //定义行
  const columns: ColumnsType<Activity.Content> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: edge == 0? '渠道值名称' : '场景值名称',
      dataIndex: 'name',
      key: 'nme',
    },
    {
      title: edge == 0? '渠道值描述' : '场景值描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '是否启用',
      key: 'checked',
      dataIndex: 'checked',
      render: (checked: boolean, record: Activity.Content) => (
        <>
          <Popconfirm
            title={
              (checked&&
              <div className="className">
                <div>提示</div>
                <div>停用后，新配置{edge == 0? '渠道值' : '场景值'}时不可
                  <br/>再选择此项内容</div>
              </div>)||  (!checked&&
                <div className="className">
                  <div>提示</div>
                  <div>启用的数据，在进行活动配置时，
                    <br/>可以作为{edge == 0? '渠道值' : '场景值'}被选择</div>
                </div>)
            }
            okText="确定"
            cancelText="取消"
            onConfirm={()=>confirm(record as any)}
            onCancel={()=>cancel(record as any)}
          >
            <Switch defaultChecked={checked}  onChange={onChange} />
          </Popconfirm>
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Activity.Content) => (
        <Space size="middle">
          <a
            href="#"
            onClick={() => {
              setEditingItem(record);
              setBtnType('编辑')
              setModalVisible(true);
              form.setFieldsValue({ ...record });
            }}
          >编辑</a>
          <Popconfirm
            title="确定删除？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => remove(record.id as string)}
          >
            <a href="#">删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const dataSource: Activity.Content[] = [
    {
      id: '1',
      index: 'John Brown',
      name: 32,
      description: 'New York No. 1 Lake Park',
      checked: true,
      createTime:'2022-05-09  13:32:23',
    },
    {
      id: '2',
      index: 'Jim Green',
      name: 42,
      description: 'London No. 1 Lake Park',
      checked: false,
      createTime:'2022-05-09  13:32:23',
    },
    {
      id: '3',
      index: 'Joe Black',
      name: 32,
      description: 'Sidney No. 1 Lake Park',
      checked: false,
      createTime:'2022-05-09  13:32:23',
    },
  ];
  return(
    <PageContainer className={sc('container')} >
      <>
        <div style={{ backgroundColor: '#fff', padding: 20 }}>
          <div className={sc('container-header')}>
            {selectButton()}
            <Button
              type="primary"
              key="newAdd"
              loading={addOrUpdateLoading}
              onClick={() => {
                setBtnType('新增')
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新增
            </Button>
          </div>
          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            rowKey={'id'}
            pagination={
              pageInfo.totalCount === 0
                ? false
                : {
                  // onChange: getOperationActivity,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
            }
          />
        </div>
      </>
      {getModal()}
    </PageContainer>
  )
};
export default Tablist;



