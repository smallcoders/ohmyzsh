import { useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, Form, Input, Select} from 'antd';


const UploadModal = forwardRef((props: any, ref: any) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm()
  useImperativeHandle(ref, () => ({
    openModal: () => {
      setModalVisible(true)
    }
  }))
  return (
    <Modal
      title="新增商机"
      visible={modalVisible}
      width={700}
      style={{ height: '500px' }}
      maskClosable={false}
      destroyOnClose
      okText="发布"
      onCancel={() => {
        setModalVisible(false);
      }}
    >
      <Form form={form}>
        <Form.Item
          name="name"
          label="商机名称"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          validateTrigger="onBlur"
          required
          rules={[{ required: true, message: '请输入商机名称' }]}
          // getValueFromEvent={(e) => {
          //   let newValue = e.target.value
          //   newValue = newValue?.replace(/[^\d+]/g, '')
          //   form.setFieldsValue({ term: newValue })
          //   return newValue
          // }}
        >
          <Input placeholder="请输入" maxLength={15}></Input>
        </Form.Item>
        <Form.Item
          name="type"
          label="商机类型"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          validateTrigger="onBlur"
          required
          rules={[{ required: true, message: '请选择商机类型' }]}
        >
          <Select placeholder="请选择" options={[]} />
        </Form.Item>
        <Form.Item
          name="org"
          label="关联企业名称"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          validateTrigger="onBlur"
          required
          rules={[{ required: true, message: '请选择关联企业名称' }]}
        >
          <Select placeholder="请选择" options={[]} />
        </Form.Item>
        <Form.Item
          name="desc"
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
