import { useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, Radio, Input, Form } from 'antd';


const UploadModal = forwardRef((props: any, ref: any) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [auditStatus, setAuditStatus] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [infoList, setInfoList] = useState<any>([])
  const [form] = Form.useForm()
  useImperativeHandle(ref, () => ({
    openModal: () => {
      setModalVisible(true)
      const list = [
        {
          label: '商机编码',
          value: '202023123231'
        },
        {
          label: '商机来源',
          value: '202023123231'
        },
        {
          label: '商机名称',
          value: '202023123231'
        },
        {
          label: '关联企业',
          value: '202023123231'
        },
        {
          label: '商机类型',
          value: '202023123231'
        },
        {
          label: '企业所属地',
          value: '企业所属地',
        },
        {
          label: '商机描述',
          value: '商机描述',
          isOneLine: true
        },
      ]
      setInfoList(list)
    }
  }))
  const handleSubmit = async () => {
    await form.validateFields()
  }
  return (
    <Modal
      title="新增商机-审核"
      visible={modalVisible}
      width={700}
      style={{ height: '500px' }}
      maskClosable={false}
      destroyOnClose
      wrapClassName="audit-modal"
      okText="发布"
      onOk={handleSubmit}
      onCancel={() => {
        setModalVisible(false);
      }}
    >
      <div className="table-box">
        <div
          onClick={() => {
            if (activeTab === 0) {
              return
            }
            setActiveTab(0)
          }}
          className={activeTab === 0 ? "table-item active" : 'table-item'}
        >
          商机信息
        </div>
        <div
          onClick={() => {
            if (activeTab === 1) {
              return
            }
            setActiveTab(1)
          }}
          className={activeTab === 1 ? "table-item active" : 'table-item'}
        >
          跟进记录
        </div>
      </div>
      {
        activeTab === 0 ?
          <div className="content">
            {
              infoList.map((item: any, index: number) => {
                return (
                  <div className={item.isOneLine ? "info-item one-line" : 'info-item'} key={index}>
                    <div className="label">
                      {item.label}
                    </div>
                    <div className="value">
                      {item.value}
                    </div>
                  </div>
                )
              })
            }
          </div> :
          <div className="content follow-up-list">
            {
              [1,2,3,4,5,6].map(() => {
                return (
                  <div className="follow-up-list-item">
                    <div className="time">
                      4月10日 16:20
                    </div>
                    <div className="name">
                      Admin
                    </div>
                    <div className="location">
                      定位：蚌埠高新区望江西路666号
                    </div>
                    <div className="detail-btn">查看详情</div>
                  </div>
                )
              })
            }
          </div>
      }
      <div className="operation-area">
        <Form form={form}>
          <Form.Item initialValue={0} name="auditStatus">
            <Radio.Group
              onChange={(e) => {
                setAuditStatus(e.target.value)
              }}
              options={[{label: '通过', value: 0},{label: '驳回', value: 1}]}
            />
          </Form.Item>
          <Form.Item
            name="desc"
            required={auditStatus !== 0}
            rules={
              auditStatus === 0 ? [{}] : [{required: true, message: '为方便业务修改，请简要描述驳回事由'}]
            }
          >
            <Input.TextArea maxLength={300} placeholder={auditStatus === 0 ? "备注信息" : "请简要描述驱回事由，字数不少于10字。"} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
})

export default UploadModal
