import { useState } from 'react'
import { Modal, Form, Select, Input } from 'antd';
export default (props: any) => {

  const [activeTab, setActiveTab] = useState<number>(1)



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
      visible={true}
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
              <div className="title-item"><span>*</span>金融机构</div>
              <div className="title-item"><span>*</span>金融产品</div>
              <div className="title-item"><span>*</span>分润金额</div>
              <div className="operation"><span>*</span>操作</div>
            </div>
            <Form name="share-amount-form">
              {
                [1,2].map((item: any, index: number) => {
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
                            options={[]}
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
                      <div className="delete-btn">删除</div>
                    </div>
                  )
                })
              }
            </Form>
          </div>
        <div
          className="add-btn bottom"
          onClick={() => {
          }}
        >
          +添加一行
        </div>
      </div>
    </Modal>
  )
}
