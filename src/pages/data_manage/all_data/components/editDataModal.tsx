import { useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, Form, Input, message, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import { updateOverviewData } from '@/services/data-manage';
import moment from 'moment';

const EditDataModal = forwardRef((props: any, ref: any) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>({});
  const [initMonthData, setInitMonthData] = useState([])
  const [monthData, setMonthData] = useState([])
  const [rangeDate, setRangeDate] = useState([])
  const [editForm] = Form.useForm();

  useImperativeHandle(ref, () => ({
    openModal: (data: any) => {
      if (data) {
        const dateArr = data.withDetailData ? [moment(data.monthDataList[0].month, 'YYYY-MM'), moment(data.monthDataList[data.monthDataList.length - 1].month, 'YYYY-MM')] : []
        setRecord(data);
        setMonthData(data.monthDataList)
        setInitMonthData(data.monthDataList)
        editForm.setFieldsValue({
          name: data.name,
          total: data.total,
          monthList: dateArr
        });
      }
      setModalVisible(true);
    },
  }));

  const handleCancel = () => {
    setRecord({});
    setModalVisible(false);
    editForm.resetFields();
  };

  const handleSubmit = async () => {
    if (record.withDetailData && monthData?.length !== 12) {
      return message.error('选择范围必须为12个月');
    }
    const res = editForm.getFieldsValue();

    const data: any = {
      ...record,
      ...res,
      monthDataList: monthData
    };
    updateOverviewData(data).then(({code}) => {
      if (code === 0) {
        message.success('编辑成功');
        handleCancel();
        if (props.successCallBack) {
          props.successCallBack();
        }
      } else {
        message.error(res.message);
      }
    });
  };

  // const disabledDate = (current: any) => {
  //   if (!rangeDate[0] || !rangeDate[1]) {
  //     return false;
  //   }
  //   const startMonth = moment(rangeDate[0]).startOf('month');
  //   const endMonth = moment(rangeDate[1]).endOf('month');
  //   const months = endMonth.diff(startMonth, 'months') + 1;
  //   return months > 12 || current.isBefore(startMonth) || current.isAfter(endMonth);
  // }

  const handleChange = (dates: any) => {
    setRangeDate(dates)
    const arr: any = []
    const startMonth = moment(dates[0]).startOf('month');
    const endMonth = moment(dates[1]).endOf('month');
    const months = [];
    const currentMonth = startMonth;
    while (currentMonth.isSameOrBefore(endMonth)) {
      months.push(currentMonth.format('YYYY.MM'));
      currentMonth.add(1, 'month');
    }
    for (let i = 0; i < months.length; i++) {
      arr.push({month: months[i], data: ''})
    }
    if (arr?.length !== 12) {
      message.error('选择范围必须为12个月');
    }
    // const result = arr.map((item1: any) => {
    //   const item2: any = initMonthData.find((item: any) => item.month === item1.month);
    //   return item2 ? item2 : item1;
    // });
    setMonthData(arr)
  }

  const handleInputChange = (index: number, value: any) => {
    const arr = JSON.parse(JSON.stringify(monthData))
    arr[index].data = value
    setMonthData(arr)
  }

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
      <Form form={editForm}>
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
            suffix={record.configKey === 'ORDER_COUNT'
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
                // disabledDate={disabledDate}
                onCalendarChange={handleChange}
              />
            </Form.Item>
            <div style={{width: '90%', margin: '0 auto'}}>
              {monthData.map((item: any, index: number) => {
                return (
                  <div key={index} style={{display: 'inline-block', marginRight: '20px', marginTop: '10px', width: '45%'}}>
                    <span style={{display: 'flex'}}>
                      <span style={{width: '50%', paddingTop: '5px'}}>{item.month}</span>
                      <Input
                        style={{width: '100%'}}
                        key={index}
                        placeholder="请输入"
                        value={item.data}
                        onChange={(e) => handleInputChange(index, e.target.value)}
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
