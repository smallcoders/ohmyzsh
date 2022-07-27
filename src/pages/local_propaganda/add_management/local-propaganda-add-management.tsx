import React, { useState, useEffect } from 'react';
import { 
  Button,
  Form,
  message,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Col,
  Space,
  DatePicker,
  Select,
  Breadcrumb,
  Table,
} from 'antd'
import UploadForm from '@/components/upload_form';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import { 
  getCityPropagandaData,
  getEnterpriseDemandList,
  getCreativeDemandList,
  getPropagandaDemandList,
  getChangePropaganda,
  getAreaLabel,
  addExchange,
  deleteExchange,
} from "@/services/propaganda-config";
import SelfTable from '@/components/self_table';
import { history, Link } from 'umi'
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '@/../config/routes';
import './local-propaganda-add-management.less'
import { Prompt } from 'umi';
const sc = scopedClasses('add-management');

const TableList: React.FC = () => {

  const stateColumn = {
    'NOT_EXCHANGE': '未对接',
    'EXCHANGING': '对接中',
    'EXCHANGED': '已对接',
  }
  const [form] = Form.useForm();
  const [formModal] = Form.useForm();
  const [resultModal] = Form.useForm();
  // 城市活动可用城市label
  const [areaList,setAreaList] = useState<any>([])
  // 模态的info
  const [modalInfo, setModalInfo] = useState<{
    type: string,
    // visible: boolean,
    // typeName: string,
    detailIdList: string[],
  }>({
    type: '',
    // visible: false,
    // typeName: '',
    detailIdList: []
  });
  const [loading, setLoading] = useState(true);
  // 需求的添加列表数据
  const [enterpriseDataSource, setEnterpriseDataSource] = useState<any[]>([])
  const [innovateDemand, setInnovateDemand] = useState<any[]>([])
  const [solutionDataSource, setSolutionDataSource] = useState<any[]>([])
  const [resultDataSource, setResultDataSource] = useState<any[]>([])
  // 需求模态的table数据
  const [addDataSource, setAddDataSource] = useState<any[]>([]);
  const [searchContent, setSearchContent] = useState<any>({});  
  
  // 编辑的详情
  const [editDetail, setEditDetail] = useState<any>({})

  const [pageInfo, setPageInfo] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    pageTotal: 0,
    name: '',
  })
  /**
   * 添加或者修改 loading
   */
   const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);

  /**
   * 是否在编辑
   */

  const _getCityPropagandaData = async (id: string) => {
    try {
      const res = await getCityPropagandaData(id)
      if (res?.code === 0) {
        setEditDetail(res?.result || {})
        form.setFieldsValue({...res?.result})
        setEnterpriseDataSource(res?.result.enterpriseDemands || [])
        setInnovateDemand(res?.result.creativeDemands || [])
        setSolutionDataSource(res?.result.solutions || [])
        setResultDataSource(res?.result.exchangeDemands || [])
        // ⭐ 还缺一个对接成效
      } else {
        message.error(`获取详情失败，原因:{${res?.message}}`);
      }
    } catch (error) {
      console.log(error)
      message.error('获取初始数据失败');
    }
  }

  const _getAreaLabel = async () => {
    try {
      const res = await getAreaLabel()
      if (res?.code === 0) {
        setAreaList(res?.result || [])
      } else {
        throw new Error();
      }
    } catch (error) {
     console.log(error) 
    }
  }
  const [detail, setDetail] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  useEffect(()=>{
    _getAreaLabel()
    const { edit, detail } = history.location.query as any;
    if (edit) {
      // 如果是编辑进入，则获取详情
      setEditDetail({id: edit})
      setEdit(true)
      _getCityPropagandaData(edit)
    }
    if (detail) {
      setDetail(true)
      _getCityPropagandaData(detail)
    }
    // 感觉没必要有详情,和编辑重复了

  },[])

  // 统一的清除ModalInfo
  // motail的onCancel,  以及确定的结尾，
  const clearSelectInfo = () => {
    setLoading(true)
    formModal.resetFields() 
    setPageInfo({
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 0,
      name: '',
    })
    setSelectedRowKeys([]) // 复选
    setModalInfo({
      type: '',
      detailIdList: []
    })
    setAddDataSource([])
  }


  // 需求模态的状态
  const [demandModalState, setDemandModalState] = useState<boolean>(false);


  // 获取企业分页数据 点击的时候再获取
  const getEnterpriseDemand = async (type: string, name?: string, searchParams?: any) => {
    let res 
    switch (type) {
      case '企业需求':
        try {
          res = await getEnterpriseDemandList({
            areaCode: form.getFieldValue('areaCode'),
            ...pageInfo,
            name,
            ...searchParams,
          })
          if (res?.code === 0) {
            if (enterpriseDataSource.length != 0) {
              let newRes = res?.result || []
              res?.result?.forEach((item: any)=>{
                enterpriseDataSource.forEach((item2: any) => {
                  if (item.bizId === item2.bizId) {
                    newRes = newRes.filter(p => p.bizId != item.bizId)
                  }
                })
              })
              res.result = newRes
            }
            setPageInfo({...pageInfo,pageTotal: res?.totalCount,pageIndex: res?.pageIndex})
            setLoading(false)
          } else {
            throw new Error();
          }
        } catch (error) {
          console.log(error)
          setLoading(false)
        }
        break;
      case '创新需求':
        try {
          res = await getCreativeDemandList({
            areaCode: form.getFieldValue('areaCode'),
            ...pageInfo,
            name,
            ...searchParams,
          })
          if (res?.code === 0) {
            if (innovateDemand.length != 0) {
              let newRes = res?.result || []
              res?.result?.forEach((item: any)=>{
                innovateDemand.forEach((item2: any) => {
                  if (item.bizId === item2.bizId) {
                    newRes = newRes.filter(p => p.bizId != item.bizId)
                  }
                })
              })
              res.result = newRes
            }
            setPageInfo({...pageInfo,pageTotal: res?.totalCount,pageIndex: res?.pageIndex})
            setLoading(false)
          } else {
            throw new Error();
          }
        } catch (error) {
          console.log(error)
          setLoading(false)
        }
        break;
      case '解决方案':
        try {
          res = await getPropagandaDemandList({
            areaCode: form.getFieldValue('areaCode'),
            ...pageInfo,
            name,
            ...searchParams,
          })
          if (res?.code === 0) {
            if (solutionDataSource.length != 0) {
              let newRes = res?.result || []
              res?.result?.forEach((item: any)=>{
                solutionDataSource.forEach((item2: any) => {
                  if (item.bizId === item2.bizId) {
                    newRes = newRes.filter(p => p.bizId != item.bizId)
                  }
                })
              })
              res.result = newRes
            }
            setPageInfo({...pageInfo,pageTotal: res?.totalCount,pageIndex: res?.pageIndex})
            setLoading(false)
          } else {
            throw new Error();
          }
        } catch (error) {
          console.log(error)
          setLoading(false)
        }
        break;
      default:
        break;
    }
    if (res?.code === 0) {
      setAddDataSource(res?.result || [])
    }
  }

  // 选择企业需求btn
  const handleEnterpriseDemand = (type: string) => {
    // 校验是否选中了城市名称 
    if (!form.getFieldValue('areaCode')) {
      message.error('请在基本信息中选择城市名称')
      return
    }
    // 重置表单 - 清空modalInfo
    clearSelectInfo()
    // 获取表单数据
    getEnterpriseDemand(type)
    // 添加modalInfo
    setModalInfo({
      type,
      detailIdList: []
    })
    // 打开模态
    setDemandModalState(true)
  }

  // 企业需求删除
  const removeEnterpriseDemand = (id: string) => {
    setEnterpriseDataSource(p => {
      const rest = p.filter(item => item?.bizId !== id)
      return rest
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      width: 200,
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            window.open(`${routeName.REQUIREMENT_MANAGEMENT_DETAIL}?id=${_record.bizId}`);
          }}
        >
          {_}
        </a>
      ),
    },
    {
      title: '需求区域',
      dataIndex: 'areaName',
      width: 200,
    },
    {
      title: '需求类型',
      dataIndex: 'type',
      width: 200,
    },
    {
      title: '企业名称',
      dataIndex: 'enterprise',
      width: 200,
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      width: 200,
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space>
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => removeEnterpriseDemand(record.bizId as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  // 创新需求删除
  const removeInnovaDemand = (id: string) => {
    setInnovateDemand(p => {
      const rest = p.filter(item => item?.bizId !== id)
      return rest
    })
  }

  // 创新需求columns
  const innovateColumns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      width: 200,
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            window.open(`/service-config/creative-need-manage/detail?id=${_record.bizId}`);
          }}
        >
          {_}
        </a>
      ),
    },
    {
      title: '需求区域',
      dataIndex: 'areaName',
      width: 200,
    },
    {
      title: '需求类型',
      dataIndex: 'type',
      width: 200,
    },
    {
      title: '企业名称',
      dataIndex: 'enterprise',
      width: 200,
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      width: 200,
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space>
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => removeInnovaDemand(record.bizId as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  // 解决方案的删除
  const removeSolution = (id: string) => {
    setSolutionDataSource(p => {
      const rest = p.filter(item => item?.bizId !== id)
      return rest
    })
  }
  // 解决方案columns
  const solutionColumns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      width: 200,
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            window.open(`/service-config/creative-need-manage/detail?id=${_record.bizId}`);
          }}
        >
          {_}
        </a>
      ),
    },
    {
      title: '服务区域',
      dataIndex: 'areaName',
      width: 200,
    },
    {
      title: '需求类型',
      dataIndex: 'type',
      width: 200,
    },
    {
      title: '企业名称',
      dataIndex: 'enterprise',
      width: 200,
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      width: 200,
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space>
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => removeSolution(record.bizId as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]



  // 新增、编辑模态框
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 保留当前Item的值
  const [editingItem, setEditingItem] = useState<any>({});
  const clearForm = () => {
    resultModal.resetFields();
    setEditingItem({});
  };
  const addOrUpdata = () => {
    const tooltipMessage = editingItem.id ? '修改' : '添加';
    resultModal
      .validateFields()
      .then(async (value)=>{
        const {exchangeTime} = value
        let time = ''
        if (exchangeTime) {
          time = moment(exchangeTime.date[0]).format('yyyy-MM-DD HH:mm:ss');
        }
        const res = editingItem.id 
          ? await addExchange({ ...value, id: editingItem.id, exchangeTime: time })
          : await addExchange({...value,  exchangeTime: time })
        if (res?.code === 0) {
          setResultDataSource( p => {
            const item = [{...res?.result,bizId: res?.result.id}]
            return p.concat(item)
          }) 
          setModalVisible(false);
          message.success(`${tooltipMessage}成功`);
          clearForm();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${res.message}}`);
        }
      })
      .catch(()=>{
        console.log('失败')
      })
  }

  const removeDockingDemand = async (id: any) => {
    try {
      const res = await deleteExchange(id)
      if (res?.code === 0) {
        message.success(`删除成功`);
        setResultDataSource(p => {
          const rest = p.filter(item => item?.bizId !== id)
          return rest
        })
      } else {
        message.error(`删除失败，原因:{${res.message}}`);
      }
    } catch (error) {
      console.log(error)
    }
  }
  // 对接成效columns
  const dockingColumns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        index + 1,
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '发布人/发布单位',
      dataIndex: 'publishName',
      width: 200,
    },
    {
      title: '对接方',
      dataIndex: 'subscribeName',
      width: 200,
    },
    {
      title: '对接状态',
      dataIndex: 'state',
      width: 200,
      render: (_: any, record: any)=>{
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateColumn, _) ? stateColumn[_] : '--'}
          </div>
        );
      }
    },
    {
      title: '对接时间',
      dataIndex: 'exchangeTime',
      width: 200,
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        console.log('record',record)
        return (
          <Space>
            <a
              href="#"
              onClick={() => {
                setEditingItem(record);
                setModalVisible(true);
                resultModal.setFieldsValue({ ...record});
              }}
            >
              编辑{' '}
            </a>
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => removeDockingDemand(record.bizId as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  // 新增项目modal
  const getModal = () => {
    return (
      <Modal
        title={editingItem.id ? '修改地市活动' : '新增地市活动'}
        width="800px"
        visible={modalVisible}
        maskClosable={false}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        onOk={async () => {
          await addOrUpdata();
        }}
      >
        <Form {...formLayout} form={resultModal} layout="horizontal">
          <Form.Item 
            name="name" 
            label="项目名称"
            required
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Select>
              {
                areaList?.map((item: any) => {
                  return (
                    <React.Fragment key={item.name}>
                      <Select.Option value={item.name}>{item.name}</Select.Option>
                    </React.Fragment>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item 
            name="publishName" 
            label="发布人/发布单位"
            required
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Input placeholder="请输入" maxLength={35} />
          </Form.Item>
          <Form.Item 
            name="subscribeName" 
            label="对接方" 
            required
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Input placeholder="请输入" maxLength={35} />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            required
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Select placeholder="请选择">
              <Select.Option value={'DEMAND'}>需求</Select.Option>
              <Select.Option value={'SERVICE'}>服务</Select.Option>
              <Select.Option value={'ACHIEVEMENT'}>科技成果</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="state"
            label="对接状态"
            required
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Select placeholder="请选择">
              {/* ⭐ value的值还没有修改 */}
              <Select.Option value={'NOT_EXCHANGE'}>未对接</Select.Option>
              <Select.Option value={'EXCHANGING'}>对接中</Select.Option>
              <Select.Option value={'EXCHANGED'}>已对接</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="exchangeTime" label="对接时间">
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // 这是模态的查询和重置，模态的列表， 翻页
  const getOptions = (searchParams: any) => {
    getEnterpriseDemand(modalInfo.type,'',searchParams)
  }

  const getAutoContent = (type: string) => {
    let columns;
    let searchFormItems;
    switch (type) {
      case '企业需求':
        columns = [
          {
            title: '需求名称',
            dataIndex: 'name',
          },
          {
            title: '区域',
            dataIndex: 'areaName',
          },
          {
            title: '需求类型',
            dataIndex: 'type',
          },
          {
            title: '企业名称',
            dataIndex: 'enterprise',
          },
          {
            title: '发布时间',
            dataIndex: 'publishDate',
          },
        ];
        searchFormItems = [
          {
            label: '企业需求名称',
            name: 'enterpriseName',
            render: () => {
              return <Input placeholder="请输入" maxLength={35} />
            }
          },
        ];
        break;
      case '创新需求':
        columns = [
          {
            title: '创新需求名称',
            dataIndex: 'name',
          },
          {
            title: '需求详情',
            dataIndex: 'content',
          },
          {
            title: '需求类型',
            dataIndex: 'type',
          },
          {
            title: '企业名称',
            dataIndex: 'enterprise',
          },
          {
            title: '发布时间',
            dataIndex: 'publishDate',
          },
        ];
        searchFormItems = [
          {
            label: '创新需求名称',
            name: 'enterpriseName',
            render: () => {
              return <Input placeholder="请输入" maxLength={35} />
            }
          },
        ];
        break;
      case '解决方案':
        columns = [
          {
            title: '方案名称',
            dataIndex: 'name',
          },
          {
            title: '方案详情',
            dataIndex: 'name',
          },
          {
            title: '方案类型',
            dataIndex: 'type',
          },
          {
            title: '服务商名称',
            dataIndex: 'enterprise',
          },
          {
            title: '发布时间',
            dataIndex: 'publishDate',
          },
        ];
        searchFormItems = [
          {
            label: '科技成果名称',
            name: 'enterpriseName',
            render: () => {
              return <Input placeholder="请输入" maxLength={35} />
            }
          },
        ];
        break;
    }

    return [columns, searchFormItems];
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('onSelectChange',newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 选中select
  const onSelectItems = () => {
    if (selectedRowKeys?.length === 0) {
      message.warning('至少选择一项')
      return
    }
    switch (modalInfo.type) {
      case '企业需求':
        setEnterpriseDataSource( p => {
          const item = addDataSource.filter(f => selectedRowKeys?.includes(f.bizId))
          return p.concat(item)
        })
        setDemandModalState(false)
        break;
      case '创新需求':
        setInnovateDemand( p => {
          const item = addDataSource.filter(f => selectedRowKeys?.includes(f.bizId))
          return p.concat(item)
        })
        setDemandModalState(false)
        break;
      case '解决方案':
        setSolutionDataSource( p => {
          const item = addDataSource.filter(f => selectedRowKeys?.includes(f.bizId))
          return p.concat(item)
        })
        setDemandModalState(false)
        break;
    
      default:
        break;
    }

    clearSelectInfo()
  }
  // 需求的modal
  const demandModal = () => {
    const [demandColumns, searchFormItems] = getAutoContent(modalInfo.type)
    return (
      <Modal
        title={`选择${modalInfo.type}`}
        width="700px"
        visible={demandModalState}
        maskClosable={false}
        onCancel={() => {
          clearSelectInfo()
          setDemandModalState(false)
        }}
        onOk={() => {
          onSelectItems()
        }}
      >
        <Form labelCol={{span: 9}} form={formModal} layout="horizontal">
          <Row>
            {
              searchFormItems?.map(p =>
                <React.Fragment key={p.bizId}>
                  <Col span={10}>
                    <Form.Item
                      name={p.name}
                      label={p.label}
                    >
                      {p.render()}
                    </Form.Item>
                  </Col>
                </React.Fragment>
              )
            }
            <Col span={4}><Space size={20} style={{
              marginLeft: 20,
              marginBottom: 24
            }} >

              <Button type='primary' loading={addOrUpdateLoading} onClick={() => {
                const search = formModal.getFieldsValue()
                const {enterpriseName} = search
                getEnterpriseDemand(modalInfo.type,enterpriseName)
              }}>查询</Button>
              <Button onClick={() => {
                formModal.resetFields()
                setPageInfo({
                  pageIndex: 1,
                  pageSize: 10,
                  pageTotal: 0,
                  name: '',
                })
                getEnterpriseDemand(modalInfo.type)
              }}>重置</Button>
            </Space>
            </Col>
          </Row>
        </Form>
        <Table 
          size='small'
          scroll={{ y: 400 }}
          rowKey={'bizId'}
          loading={loading}
          pagination={{
            current: pageInfo.pageIndex,
            pageSize: pageInfo.pageSize,
            total: pageInfo.pageTotal,
            showQuickJumper: true
          }}
          rowSelection={rowSelection}
          columns={demandColumns}
          dataSource={addDataSource}
          onChange={(e) => {
            const page = {
              ...pageInfo,
              pageSize: e.pageSize,
              pageIndex: e.current,
            }
            getOptions({
              ...searchContent, ...page
            })
          }}
         />
      </Modal>
    )
  }

  /**
   * 保存
   */
   const saveEdit = async (id?: string,state?: any) => {
     form
      .validateFields()
      .then(async (value: any)=>{
        try {
          console.log('enterpriseDataSource', enterpriseDataSource.map((item)=>item.bizId))
          if (enterpriseDataSource.length === 0) {
            message.error(`请选择企业需求`);
            return
          }
          if (innovateDemand.length === 0) {
            message.error(`请选择创新需求`);
            return
          }
          if (solutionDataSource.length === 0) {
            message.error(`请选择解决方案`);
            return
          }
          console.log('enterpriseDataSource', enterpriseDataSource)
          const res = await getChangePropaganda({
            ...value,
            id,
            state,
            areaCode: value.areaCode.toString(),
            cityBannerId: value.cityBannerId * 1,
            enterpriseDemandIds: enterpriseDataSource.map(item =>item.bizId) || [],
            creativeDemandIds: innovateDemand.map(item =>item.bizId) || [],
            solutionIds: solutionDataSource.map(item =>item.bizId) || [],
            exchangeDemandIds: resultDataSource.map(item => item.id) || [],
          })
          if (res?.code === 0) {
            message.success('成功')
            history.push(routeName.PROPAGANDA_CONFIG);
          } else {
            message.error(`失败，原因:{${res?.message}}`);
          }
        } catch (error) {
          console.log(error)
        }
      })
      .catch(()=>{
        console.log('校验失败')
      })
  }

  return (
    <PageContainer 
      className={sc('container')}
      header={{
        title: edit ? `编辑地市宣传页` : detail ? '地市宣传页详情' : '新增地市宣传页' ,
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/local-propaganda/propaganda-config/index">地市宣传页管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {edit ? `编辑地市宣传页` : detail ? '地市宣传页详情' : '新增地市宣传页' }
              {/* {isEditing ? `编辑地市宣传页` : '新增地市宣传页'} */}
            </Breadcrumb.Item>
          </Breadcrumb>
        ),
        extra: (
          <>
          <Button type="primary" key="primary1" loading={addOrUpdateLoading} onClick={()=> { saveEdit(editDetail.id,'SHOPPED')}}>
            {/* 确定{isEditing ? '修改' : '新增'} */}
            保存并发布
          </Button>
          <Button type="primary" key="primary" loading={addOrUpdateLoading} onClick={()=>{saveEdit(editDetail.id)}}>
            保存
          </Button>
          </>
        )
    }}
    >
      <div className={sc('container-basic')}>
        基本信息
        <Form className={sc('container-basic-form')} form={form}>
          <Form.Item
            labelCol={ {span: 8} }
            wrapperCol= { {span: 10} }
            label="城市名称"
            name="areaCode"
            rules={[{ required: true, message: '请输入城市名称' }]}
          >
            <Select>
              {
                areaList?.map((item: any) => {
                  return (
                    <React.Fragment key={item.code}>
                      <Select.Option value={item.code}>{item.name}</Select.Option>
                    </React.Fragment>
                  )
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="企业需求数"
            labelCol={ {span: 8} }
            name="demandCount"
            rules={[{ required: true, message: '请输入企业需求数' }]}
          >
            <InputNumber  />
          </Form.Item>
          <Form.Item
            label="服务方案数"
            labelCol={ {span: 8} }
            name="solutionCount"
            rules={[{ required: true, message: '请输入服务方案数' }]}
          >
            <InputNumber  />
          </Form.Item>
          <Form.Item
            label="服务报名数"
            labelCol={ {span: 8} }
            name="solutionSignIn"
          >
            <InputNumber  />
          </Form.Item>
          <Form.Item
            label="上传banner"
            labelCol={ {span: 8} }
            name="cityBannerId"
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
              maxSize={1}
              showUploadList={false}
              accept=".bmp,.gif,.png,.jpeg,.jpg"
              tooltip={
                <span className={'tooltip'}>
                  建议大小在1M以下
                </span>
              }
            />
          </Form.Item>
        </Form>
      </div>
      <div className={sc('container-enterpriseDemand')}>
        企业需求
        <div className={sc('container-enterpriseDemand-top')}>
          <Button type="primary" onClick={() => {handleEnterpriseDemand('企业需求')}}>选择需求</Button>
          <span className={sc('container-enterpriseDemand-top-title')}>建议选择4个企业需求</span>
        </div>
        <div className={sc('container-enterpriseDemand-table')}>
          <SelfTable 
            bordered
            scroll={{ x: 1400 }}
            columns={columns}
            dataSource={enterpriseDataSource}
            pagination={false}
            />
        </div>
      </div>
      <div className={sc('container-innovateDemand')}>
        创新需求
        <div className={sc('container-innovateDemand-top')}>
          <Button type="primary" onClick={() => {handleEnterpriseDemand('创新需求')}}>选择创新需求</Button>
          <span className={sc('container-innovateDemand-top-title')}>建议选择6个创新需求</span>
        </div>
        <div className={sc('container-innovateDemand-table')}>
          <SelfTable 
            bordered
            scroll={{ x: 1400 }}
            columns={innovateColumns}
            dataSource={innovateDemand}
            pagination={false}
            />
        </div>
      </div>
      <div className={sc('container-solution')}>
        解决方案
        <div className={sc('container-solution-top')}>
          <Button type="primary" onClick={() => {handleEnterpriseDemand('解决方案')}}>选择解决方案</Button>
          <span className={sc('container-solution-top-title')}>建议选择4个解决方案</span>
        </div>
        <div className={sc('container-solution-table')}>
          <SelfTable 
            bordered
            scroll={{ x: 1400 }}
            columns={solutionColumns}
            dataSource={solutionDataSource}
            pagination={false}
            />
        </div>
      </div>
      <div className={sc('container-docking')}>
        对接成效
        <div className={sc('container-docking-top')}>
          <Button type="primary" onClick={() => {setModalVisible(true)}}>新增项目</Button>
          <span className={sc('container-docking-top-title')}>非必填</span>
        </div>
        <div className={sc('container-docking-table')}>
          <SelfTable 
            bordered
            scroll={{ x: 1400 }}
            columns={dockingColumns}
            dataSource={resultDataSource}
            pagination={false}
            />
        </div>
      </div>
      {getModal()}
      {demandModal()}
      <Prompt
        when={edit}
        message={'离开此页面，将不会保存当前编辑的内容，确认离开吗？'}
      />
    </PageContainer>
  )
}

export default TableList