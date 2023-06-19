import { useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, Form, Input, message, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import { updateOverviewData } from '@/services/data-manage';
import moment from 'moment';

const EditDataModal = forwardRef((props: any, ref: any) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>({});
  const [orgName, setOrgName] = useState('');
  const [dates, setDates] = useState<any>(null);
  const [form] = Form.useForm();

  //   {
  //     "configKey": "REGISTERED_USER_COUNT",
  //     "name": "注册用户数",
  //     "total": "434",
  //     "withDetailData": true,
  //     "monthDataList": [
  //         {
  //             "month": "2023.01",
  //             "data": "1"
  //         }
  //     ]
  // }

  useImperativeHandle(ref, () => ({
    openModal: (data: any) => {
      if (data) {
        const dateArr = data.withDetailData ? [moment(data.monthDataList[0].month, 'YYYY-MM'), moment(data.monthDataList[data.monthDataList.length - 1].month, 'YYYY-MM')] : []
        setDates(dateArr)
        console.log('2333333333', dateArr);
        
        setRecord(data);
        form.setFieldsValue({
          name: data.name,
          total: data.total,
          monthList: dateArr
        });
        if (data.orgName) {
          setOrgName(data.orgName);
        }
      }
      setModalVisible(true);
    },
  }));

  const handleCancel = () => {
    setRecord({});
    setModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    await form.validateFields();
    const { total } = form.getFieldsValue();

    console.log('11111111111', form.getFieldsValue());
    
    // const data: any = {
    //   ...record,
    //   total,
    // };
    // updateOverviewData(data).then((res) => {
    //   if (res.code === 0) {
    //     message.success('编辑成功');
    //     handleCancel();
    //     if (props.successCallBack) {
    //       props.successCallBack();
    //     }
    //   } else {
    //     message.error(res.message);
    //   }
    // });
  };

  // 限制时间选择器的开始和结束时间
  // const handleDisabledDate = (current: any) => {
  //   return current && current > moment().endOf('month');
  // }

  const handleDisabledDate = (current: any) => {
    return current < moment().subtract(12, 'month') || current > moment().endOf('month');

    // if (!dates) {
    //   return false;
    // }
    // const tooLate = dates[0] && current.diff(dates[0], 'month') > 12;
    // const tooEarly = dates[1] && dates[1].diff(current, 'month') > 12;
    // return !!tooEarly || !!tooLate || current > moment().endOf('month');
  };

  return (
    <Modal
      title={record.name}
      visible={modalVisible}
      width={700}
      style={{ height: '500px' }}
      maskClosable={false}
      destroyOnClose
      wrapClassName="add-modal"
      onOk={() => {
        handleSubmit();
      }}
      onCancel={() => {
        handleCancel();
      }}
    >
      <Form form={form}>
        <Form.Item
          name="total"
          label="当前累计数据"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          validateTrigger="onBlur"
          required
          rules={[{ required: true, message: '请输入当前累计数据' }]}
        >
          <Input
            placeholder="请输入"
            maxLength={15}
            suffix={
              record.configKey === 'SERVICE_COUNT' || record.configKey === 'ORDER_COUNT'
                ? '万'
                : record.configKey === 'TRADE_AMOUNT'
                ? '亿'
                : ''
            }
          />
        </Form.Item>
        {record.withDetailData && (
          <>
            <Form.Item
              name="monthList"
              label="近12个月数据"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 17 }}
              validateTrigger="onBlur"
              required
              rules={[{ required: true, message: '请选择月份' }]}
            >
              <RangePicker
                style={{width: '100%'}}
                picker="month"
                value={dates}
                // disabledDate={handleDisabledDate}
                // onCalendarChange={(val) => setDates(val)}
              />
            </Form.Item>
            <div style={{width: '90%', margin: '0 auto'}}>
              {record.monthDataList.map((item: any, index: number) => {
                return (
                  <div key={index} style={{display: 'inline-block', marginRight: '20px', marginTop: '10px'}}>
                    <span style={{display: 'flex'}}>
                      <span style={{marginRight: '10px'}}>{item.month}</span>
                      <Input
                        placeholder="请输入"
                        value={item.data}
                        maxLength={15}
                        suffix={
                          record.configKey === 'SERVICE_COUNT' || record.configKey === 'ORDER_COUNT'
                            ? '万'
                            : record.configKey === 'TRADE_AMOUNT'
                            ? '亿'
                            : ''
                        }
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
});

export default EditDataModal;
