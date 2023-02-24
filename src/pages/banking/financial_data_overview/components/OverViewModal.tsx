import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Select, Input, DatePicker } from 'antd';
import { queryBank, getProduct, getProjectContract, getShareProfit } from '@/services/financial_data_overview';
import moment from 'moment';

export default forwardRef((props: any, ref: any) => {
  const [shareAmountForm] = Form.useForm()
  const [contractAmountForm] = Form.useForm()

  const [activeTab, setActiveTab] = useState<number>(1)
  const [visible, setVisible] = useState<boolean>(false)
  const [bankList, setBankList]= useState<any[]>([])


  useImperativeHandle(ref, () => ({
    openModal: async () => {
      queryBank().then((res) => {
        if (res.code === 0 && res.result?.bank){
          setBankList(res.result.bank.map((item: any) => {
            return {value: item.id, label: item.name}
          }))
        }
      })
      getProjectContract().then((res) => {
        console.log(res)
      })
      getShareProfit().then((res) => {
        console.log(res)
      })
      setVisible(true)
    },
  }))



  const renderTitle = () => {
    return (
      <div className="title-table-box">
        <div
          className={activeTab === 1 ? "share-amount active" : 'share-amount'}
          onClick={() => {
            setActiveTab(1)
          }}
        >
          分润金额
        </div>
        <div
          className={activeTab === 2 ? "contract-amount active" : 'contract-amount'}
          onClick={() => {
            setActiveTab(2)
          }}
        >
          项目合同额
        </div>
      </div>
    )
  }
  return (
    <Modal
      title={renderTitle()}
      visible={visible}
      onOk={() => {
      }}
      onCancel={() => {
      }}
      width={800}
      wrapClassName="data-over-view-modal"
    >
      <div className="over-modal-content">
        <div className="form-box">
          <div className="form-box-title">
            <div className="title-item"><span>*</span>{activeTab === 1 ? '金融机构' : '项目名称'}</div>
            <div className="title-item"><span>*</span>{activeTab === 1 ? '金融产品' : '合同签订时间'}</div>
            <div className="title-item"><span>*</span>{activeTab === 1 ? '分润金额' : '项目合同额'}</div>
            <div className="operation"><span>*</span>操作</div>
          </div>
          <Form name="share-amount-form" form={shareAmountForm} style={{display: activeTab === 1 ? 'block': 'none'}}>
              {
                [1,2, 4,5,6,7].map((item: any, index: number) => {
                  return (
                    <div className="form-item-box" key={index}>
                      <div className="form-item">
                        <Form.Item
                          name="bank"
                          validateTrigger="onBlur"
                          required
                          rules={[{ required: true, message: '金融机构必选' }]}
                        >
                          <Select
                            options={bankList}
                            placeholder="请选择"
                          />
                        </Form.Item>
                      </div>
                      <div className="form-item">
                        <Form.Item
                          name="product"
                          validateTrigger="onBlur"
                          required
                          rules={[{ required: true, message: '金融产品必选' }]}
                        >
                          <Select
                            options={[]}
                            placeholder="请选择"
                          />
                        </Form.Item>
                      </div>
                      <div className="form-item">
                        <Form.Item
                          name="amount"
                          validateTrigger="onBlur"
                          required
                          rules={[{ required: true, message: '分润金额必填' }]}
                        >
                          <Input placeholder="请输入" suffix="万元" maxLength={11} />
                        </Form.Item>
                      </div>
                      <div className="delete-btn disabled">删除</div>
                    </div>
                  )
                })
              }
            </Form>
          <Form name="contract-amount-form" form={contractAmountForm} style={{display: activeTab === 2 ? 'block': 'none'}}>
            {
              [1,2, 4,5,6,7].map((item: any, index: number) => {
                return (
                  <div className="form-item-box" key={index}>
                    <div className="form-item">
                      <Form.Item
                        name="name"
                        validateTrigger="onBlur"
                        required
                        rules={[{ required: true, message: '金融机构必选' }]}
                      >
                        <Input placeholder="请输入" maxLength={100} />
                      </Form.Item>
                    </div>
                    <div className="form-item">
                      <Form.Item
                        name="time"
                        validateTrigger="onBlur"
                        required
                        rules={[{ required: true, message: '合同签订时间必选' }]}
                      >
                        <DatePicker
                          dropdownClassName="financial-overview-time"
                          disabledDate={(current) =>
                            current && current > moment().subtract(0, 'day')
                          }
                        />
                      </Form.Item>
                    </div>
                    <div className="form-item">
                      <Form.Item
                        name="amount"
                        validateTrigger="onBlur"
                        required
                        rules={[{ required: true, message: '分润金额必填' }]}
                      >
                        <Input placeholder="请输入" suffix="万元" maxLength={11} />
                      </Form.Item>
                    </div>
                    <div className="delete-btn disabled">删除</div>
                  </div>
                )
              })
            }
          </Form>
        </div>
      </div>
      <div
        className="add-btn bottom"
        onClick={() => {
        }}
      >
        +添加一行
      </div>
    </Modal>
  )
})
