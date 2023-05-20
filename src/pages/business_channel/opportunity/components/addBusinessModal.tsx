import { useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, Form, Input, Select, message} from 'antd';
import { saveBusiness, getOrgList } from '@/services/business-channel';

const channelTypeOptions = [
  {
    label: '研发设计',
    value: 1
  },
  {
    label: '生产制造',
    value: 2
  },
  {
    label: '仓储物流',
    value: 3
  },
  {
    label: '管理数字化',
    value: 4
  },
  {
    label: '其他',
    value: 5
  },
]


const UploadModal = forwardRef((props: any, ref: any) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>({})
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [pageInfo, setPageInfo] = useState<any>({pageIndex: 1, pageSize: 10, pageTotal: 1})
  const [orgList, setOrgList]= useState<any>([])
  const [orgName, setOrgName] = useState('')
  const [form] = Form.useForm()
  const getList = (data: any) => {
    getOrgList(data).then((res) => {
      if (res.code === 0){
        setPageInfo({...pageInfo, pageTotal: res.pageTotal})
        const newList = res?.result.map((item: any) => {
          return {
            label: item.orgName,
            value: item.id
          }
        }) || []
        setOrgList(newList)
      }
    })
  }
  useImperativeHandle(ref, () => ({
    openModal: (data: any) => {
      if (data){
        setIsEdit(true)
        setRecord(data)
        form.setFieldsValue({
          chanceName: data.chanceName,
          chanceType: data.chanceType,
          orgId: data.orgId,
          chanceDesc: data.chanceDesc
        })
        if (data.orgName) {
          setOrgName(data.orgName)
          getList({...pageInfo, orgName: data.orgName})
        }
      }
      setModalVisible(true)
    }
  }))

  const handleCancel = () => {
    setRecord({})
    setIsEdit(false)
    setModalVisible(false);
    setOrgName('')
    setPageInfo({pageIndex: 1, pageSize: 10, pageTotal: 1})
    setOrgList([])
    form.resetFields()
  }

  const handleSubmit = async () => {
    await form.validateFields()
    const {chanceName, chanceType, orgId, chanceDesc} = form.getFieldsValue()
    const data: any = {
      chanceName, chanceType, orgName, chanceDesc,
      orgId
    }
    if (record.id){
      data.id = record.id
    }
    if (record.chanceNo) {
      data.chanceNo = record.chanceNo
    }
    saveBusiness(data).then((res) => {
      if (res.code === 0){
        message.success('发布成功')
        handleCancel()
        if (props.successCallBack) {
          props.successCallBack()
        }
      } else {
        message.error(res.message)
      }
    })
  }
  return (
    <Modal
      title={isEdit ? '编辑商机' : '新增商机'}
      visible={modalVisible}
      width={700}
      style={{ height: '500px' }}
      maskClosable={false}
      destroyOnClose
      okText={isEdit ? '重新发布' : '发布'}
      wrapClassName="add-modal"
      onOk={() => {
        handleSubmit()
      }}
      onCancel={() => {
        handleCancel()
      }}
    >
      {record.status === 4 && <div className="audit-text">驳回事由: {record.auditTxt}</div>}
      <Form form={form}>
        {
          record?.chanceNo && <div className="chanceNo"><div className="label">商机编号：</div><div className="value">{record?.chanceNo}</div></div>
        }
        <Form.Item
          name="chanceName"
          label="商机名称"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          validateTrigger="onBlur"
          required
          rules={[{ required: true, message: '请输入商机名称' }]}
        >
          <Input placeholder="请输入" maxLength={15}></Input>
        </Form.Item>
        <Form.Item
          name="chanceType"
          label="商机类型"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          validateTrigger="onBlur"
          required
          rules={[{ required: true, message: '请选择商机类型' }]}
        >
          <Select placeholder="请选择" options={channelTypeOptions} />
        </Form.Item>
        <Form.Item
          name="orgId"
          label="关联企业名称"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          validateTrigger="onBlur"
          required
          rules={[{ required: true, message: '请选择关联企业名称' }]}
        >
          <Select
            showSearch
            onSearch={(value) => {
              if (value) {
                const requestParams = {
                  ...pageInfo,
                  pageIndex: 1,
                  orgName: value
                }
                setPageInfo({pageIndex: 1, pageTotal: 0, pageSize: 10})
                getList(requestParams)
              }
            }}
            onChange={(value, option) => {
              setOrgName(option.label)
            }}
            filterOption={false}
            placeholder="请选择"
            options={[...orgList]}
            onPopupScroll={() => {
              if (pageInfo.pageTotal > pageInfo.pageIndex) {
                const pageIndex = pageInfo.pageIndex + 1
                setPageInfo({...pageInfo, pageIndex})
                getList({...pageInfo, pageIndex, orgName})
              }
            }}
          />
        </Form.Item>
        <Form.Item
          name="chanceDesc"
          label="商机描述"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          validateTrigger="onBlur"
          required
          rules={[{ required: true, message: '请输入商机描述' }]}
        >
          <Input.TextArea maxLength={500} placeholder="请输入" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
})



export default UploadModal
