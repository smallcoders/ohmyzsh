import { useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, Form, Input, message, DatePicker} from 'antd';
const { RangePicker } = DatePicker;
import { saveBusiness } from '@/services/business-channel';
import moment from 'moment';

const EditDataModal = forwardRef((props: any, ref: any) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>({})
  const [orgName, setOrgName] = useState('')
  const [dates, setDates] = useState<any>(null);
  const [form] = Form.useForm()

  useImperativeHandle(ref, () => ({
    openModal: (data: any) => {
      if (data){
        setRecord(data)
        form.setFieldsValue({
          chanceName: data.chanceName,
          chanceType: data.chanceType,
          orgId: data.orgId,
          chanceDesc: data.chanceDesc
        })
        if (data.orgName) {
          setOrgName(data.orgName)
        }
      }
      setModalVisible(true)
    }
  }))

  const handleCancel = () => {
    setRecord({})
    setModalVisible(false);
    setOrgName('')
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

  // 限制时间选择器的开始和结束时间
  // const handleDisabledDate = (current: any) => {
  //   return current && current > moment().endOf('month');
  // }

  const handleDisabledDate = (current: any) => {
    return (
      current < moment().subtract(12, 'month') ||
      current > moment().endOf('month')
    );

    // if (!dates) {
    //   return false;
    // }
    // const tooLate = dates[0] && current.diff(dates[0], 'month') > 12;
    // const tooEarly = dates[1] && dates[1].diff(current, 'month') > 12;
    // return !!tooEarly || !!tooLate || current > moment().endOf('month');
  };
  
  return (
    <Modal
      title={record.chanceName}
      visible={modalVisible}
      width={700}
      style={{ height: '500px' }}
      maskClosable={false}
      destroyOnClose
      wrapClassName="add-modal"
      onOk={() => {
        handleSubmit()
      }}
      onCancel={() => {
        handleCancel()
      }}
    >
      <Form form={form}>
        <Form.Item
          name="chanceName"
          label="当前累计数据"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          validateTrigger="onBlur"
          required
          rules={[{ required: true, message: '请输入当前累计数据' }]}
        >
          <Input placeholder="请输入" maxLength={15} />
        </Form.Item>
        <Form.Item
          name="chanceType"
          label="近12个月数据"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          validateTrigger="onBlur"
          required
          rules={[{ required: true, message: '请选择月份' }]}
        >
          <RangePicker picker="month" disabledDate={handleDisabledDate} onCalendarChange={val => setDates(val)} />
        </Form.Item>
      </Form>
    </Modal>
  )
})



export default EditDataModal
