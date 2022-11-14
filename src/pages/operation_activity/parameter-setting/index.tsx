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
import './index.less';
import Activity from "@/types/operation-activity";
import {
  getChannelByName, getSceneByName,
  postAddChannel,
  postAddScene, postDeleteChannel,
  postDeleteScene, postQueryChannelByPage, postQuerySceneByPage,
  postUpdateChannel,
  postUpdateScene
} from "@/services/opration-activity";

const sc = scopedClasses('operation-activity-param-setting');
const Tablist: React.FC = () => {
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<Activity.Content[]>([]);
  const [editingItem, setEditingItem] = useState<Activity.Content>({});
  const [btnType, setBtnType] = useState({});
  const [edge, setEdge] = useState<Activity.Edge>(Activity.Edge.CHANNEL);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  });
  const { TextArea } = Input;
  const [form] = Form.useForm();

  //获取渠道/场景值列表
  const getOperationActivity = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, code } =edge==0
        ? await postQueryChannelByPage({
          pageIndex,
          pageSize,
        })
        :await postQuerySceneByPage({
          pageIndex,
          pageSize,
        })
     const {total}=result
      if (code === 0) {
        setPageInfo({ total, pageIndex, pageSize });
        setDataSource(result.list);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOperationActivity();
  }, [edge]);

  const clearForm = () => {
    form.resetFields();
    if (editingItem.channelName
      || editingItem.description) setEditingItem({});
  };
  //新增和修改渠道值的确认按钮
  const onFinish = async () => {
    form
      .validateFields()
      .then(async (value) => {
        let addorUpdateRes;
        if(btnType=='新增'){
          addorUpdateRes = edge == 0
            ? await postAddChannel({ channelName:value.channelName,description:value.description})
            : await postAddScene({ sceneName:value.sceneName,description:value.description });
        }else{
          addorUpdateRes = edge == 0
            ? await postUpdateChannel({id:editingItem.id, channelName:value.channelName,description:value.description})
            : await postUpdateScene({ id:editingItem.id, sceneName:value.sceneName,description:value.description });
        }
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          message.success(`${btnType}成功`);
          await getOperationActivity()
          clearForm();
        } else {
          message.error(`${btnType}失败，原因:{${addorUpdateRes.message}}`);
        }
      })
      .catch((err)=>{
        console.log(err)
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
        }}
        onOk={ async () => {
          await onFinish();
        }}
      >
        <Form
          form={form}
          layout="horizontal"
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
        {edge == 0&&
          <Form.Item
            label={'渠道值名称'}
            name="channelName"
            rules={[{ required: true, message: '请输入渠道值名称！' },
              {
                validator(rule,value, callback) {
                  try{
                    console.log(typeof value)
                    if(value.length>0){
                      getChannelByName(value).then(res=> {
                        if (res?.code == 0) {
                          if(res.result.exist){
                            form.setFields([
                              { name: 'channelName', value:'', errors: ['该渠道值名称已存在'] },
                            ]);
                          }else{
                            callback()
                          }
                        }
                      })}
                  }catch (e){
                    console.log(e,'err')
                  }
                },
                validateTrigger: 'onBlur',
              },
              {
                validator(rule,value, callback) {
                  if (value==undefined) {
                    form.setFields([
                      // { name: '表单字段name', value: '需要设置的值', errors: ['错误信息'] }, 当 errors 为非空数组时，表单项呈现红色，
                      {name: 'channelName', value: '', errors: ['请输入渠道值名称']},
                    ]);
                  }else{
                    callback()
                  }
                },
                validateTrigger: 'onBlur',
              },]}
          >
            <Input placeholder="请输入" maxLength={10}/>
          </Form.Item>}

          {edge == 1&&
          <Form.Item
            label={'场景值名称'}
            name="sceneName"
            rules={[{ required: true, message: '请输入场景值名称！' },
              {
                validator(rule,value, callback) {
                  try{
                    console.log(value)
                    if(value.length>0){
                      getSceneByName(value).then(res=> {
                        if (res?.code == 0) {
                          if(res.result.exist){
                            form.setFields([
                              { name: 'sceneName', value:'', errors: ['该场景值名称已存在'] },
                            ]);
                          }else{
                            callback()
                          }
                        }
                      })}
                  }catch (e){
                    console.log(e,'err')
                  }
                },
                validateTrigger: 'onBlur',
              },
              {
                validator(rule,value, callback) {
                  if (value==undefined) {
                    form.setFields([
                      // { name: '表单字段name', value: '需要设置的值', errors: ['错误信息'] }, 当 errors 为非空数组时，表单项呈现红色，
                      {name: 'sceneName', value: '', errors: ['请输入场景值名称']},
                    ]);
                  }else{
                    callback()
                  }
                },
                validateTrigger: 'onBlur',
              },
            ]}
          >
            <Input placeholder="请输入" maxLength={10}/>
          </Form.Item>}

          <Form.Item
            label={edge == 0? '渠道值描述' : '场景值描述'}
            name="description"
          >
            <TextArea rows={4} maxLength={200}/>
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

  //是否启用的switch按钮
  const onChange = (started: boolean) => {
    console.log(`switch to ${started}`);
    // if (!checked) {
    //   setOpen(!checked);
    //   return;
    // }
  };
  //是否启用的的确认按钮
  const confirm = async(record: any) => {
    try {
      const data={id:record.id,isActive:!record.started}
      const res = edge==0
        ?await postUpdateChannel(data)
        : await postUpdateScene(data)
      if (res.code === 0) {
        setModalVisible(false);
        if(!record.started){
          message.success(`启用成功`);
        }else{
          message.success(`停用成功`);
        }
        setDataSource([])
        clearForm();
        await getOperationActivity();
      } else {
        message.error(`启用失败，原因:{${res.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const cancel= async (record: any)=>{
    console.log(record)
    // setDataSource([])
    // await getOperationActivity();
  }
  //删除渠道/场景值的按钮
  const remove = async (id: string) =>{
    try {
    const res = edge==0
      ?await postDeleteChannel(id)
      : await postDeleteScene(id)
    if (res.code === 0) {
      setModalVisible(false);
      message.success(`删除成功`);
      clearForm();
     await getOperationActivity();
    } else {
      message.error(`删除失败，原因:{${res.message}}`);
    }
  } catch (error) {
    console.log(error);
  }
  }


  //定义行
  const columns: ColumnsType<Activity.Content> = [
    {
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
      width:80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: edge == 0? '渠道值名称' : '场景值名称',
      dataIndex:  edge == 0? 'channelName' : 'sceneName',
      key:  edge == 0? 'channelName' : 'sceneName',
      width:200,
    },
    {
      title: edge == 0? '渠道值描述' : '场景值描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width:500,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '是否启用',
      key: 'started',
      dataIndex: 'started',
      width:100,
      render: (started: boolean, record: Activity.Content) => (
        <>
          <Popconfirm
            title={
              (started&&
              <div className="className">
                <div>提示</div>
                <div>停用后，新配置{edge == 0? '渠道值' : '场景值'}时不可
                  <br/>再选择此项内容</div>
              </div>)||  (!started&&
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
           <Switch  style={{ marginRight: 20 }} checked={started}  />
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
              console.log(record)
              form.setFieldsValue({ ...record });
              setEditingItem(record);
              setBtnType('编辑')
              setModalVisible(true);
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
  return(
    <PageContainer className={sc('container')} >
      <>
        <div style={{ backgroundColor: '#fff', padding: 20 }}>
          <div className={sc('container-header')}>
            {selectButton()}
            <Button
              type="primary"
              key="newAdd"
              onClick={() => {
                setBtnType('新增')
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 新增
            </Button>
          </div>
          <div className={sc('container-body')}>
          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            rowKey={'id'}
            pagination={
              pageInfo.total === 0
                ? false
                : {
                  onChange: getOperationActivity,
                  total: pageInfo.total,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${Math.ceil(pageInfo.total / pageInfo.pageSize) || 1}页`,
                }
            }
          />
          </div>
        </div>
      </>
      {getModal()}
    </PageContainer>
  )
};
export default Tablist;



