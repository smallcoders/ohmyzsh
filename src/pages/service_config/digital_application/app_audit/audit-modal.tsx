import './index.less';
import { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { message, Button, Form, Input, Select, Modal } from 'antd';

import ApplicationManager from '@/types/service-config-digital-applictaion.d';

export type AuditModalType = {
  show: boolean
  action?: '审核通过'|'审核拒绝',
  id?: number
  typeId?: number
}

import {
  getApplicationTypeList,
  handleApply
} from '@/services/digital-application';


export default (props: {
  children?: ReactNode;
  modal: AuditModalType,
  onCloseModal?: (action?: string) => void
}) => {

  const { modal: showAuditModal } = props

  // 应用分类
  const [applicationMarketList, setApplicationMarketList] = useState<ApplicationManager.MarketOption[]>([])

  const [loading, setLoading] = useState<boolean>(false)

  // 审核操作
  const [auditForm] = Form.useForm();

  const closeModal = (action?: string) => {
    props.onCloseModal && props.onCloseModal(action)
  }

  // 获取应用分类
  function getApplicationMarketOptions() {
    getApplicationTypeList().then(({ result }) => {
      setApplicationMarketList(result || [])
    })
  }

  useEffect(() => {
    getApplicationMarketOptions()
  }, [])

  useEffect(() => {
    if (showAuditModal.typeId) auditForm.setFieldsValue({ typeId: showAuditModal.typeId })
  }, [showAuditModal])

  return (
    <Modal
        title={showAuditModal.action === '审核通过' ? '通过申请前请确认当前应用分类' : '拒绝理由'}
        width="400px"
        visible={showAuditModal.show}
        maskClosable={false}
        onCancel={() => closeModal()}
        footer={
          [
            <Button key="back" onClick={() => {
              auditForm?.resetFields()
              closeModal()
            }}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={() => {
              auditForm?.validateFields().then(async ({ typeId, handleReason }) => {
                const params = showAuditModal.action === '审核通过' ? {
                  handleResult: 1,
                  id: showAuditModal.id,
                  typeId,
                } : {
                  handleResult: 0,
                  id: showAuditModal.id,
                  handleReason
                }
                setLoading(true)
                try {
                  const { code, message: msg } = await handleApply(params)
                  if (code === 0) {
                    message.success('处理成功');
                    closeModal(showAuditModal.action)
                  } else {
                    message.error(msg)
                    setLoading(false)
                  }
                } catch (error) {
                  setLoading(false)
                }
              })
            }}>
              { showAuditModal.action === '审核通过' ? '确定并通过审核' : '确定' }
            </Button>
          ]
        }
      >
        <Form form={auditForm} layout="horizontal">
          {
            showAuditModal.action === '审核通过' ? (
              <Form.Item
                style={{marginBottom: '20px'}}
                name="typeId"
                label="应用分类"
                rules={[{ required: true, message: '请确认应用分类' }]}
                >
                <Select placeholder="请选择">
                  {applicationMarketList.map((el: ApplicationManager.MarketOption) => {
                    return (
                      <Select.Option key={el.id} value={el.id}>
                        {el.name}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            ) : (
              <Form.Item
                style={{ marginBottom: '20px' }}
                rules={[{ required: true, message: '请填写应用审核不通过的原因' }]}
                name="handleReason"
                required
                >
                  <Input.TextArea
                    placeholder="请填写应用审核不通过的原因"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    maxLength={50}
                    showCount
                  />
              </Form.Item>
            )
          }
          </Form>
      </Modal>
  )
}