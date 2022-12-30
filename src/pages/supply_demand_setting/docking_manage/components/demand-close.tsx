import { Col, message, Modal, Row } from 'antd'
import React, { useState } from 'react'
import { Form, Input, } from 'antd'
import { postDemandFinish } from '@/services/creative-demand'

const DemandCloseModal = (props: { visible: any; setVisible: (b: boolean, isRefresh?: boolean) => void; record: any }) => {
    const { visible, setVisible, record } = props

    const [form] = Form.useForm()

    const onSubmit = async () => {
        const {finishComment} = form.getFieldsValue()
        console.log(form.getFieldsValue())
        if(!finishComment){
            message.info('请填写关闭需求的原因')
            return
        }
        try {
            const res = await postDemandFinish({id: record.id, finishComment: finishComment});
            if (res.code === 0) {
                message.success(`操作成功，该需求已关闭`);
                form.resetFields()
                setVisible(false, true)
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            message.error(`需求关闭失败，原因:{${error}}`);
        }
    }

    return (
        <Modal
            title={'需求关闭'}
            visible={visible}
            onCancel={() => {
                form.resetFields()
                setVisible(false)
            }}
            width={600}
            centered
            maskClosable={false}
            okText="确定"
            cancelText="取消"
            destroyOnClose={true}
            bodyStyle={{ padding: 20, minWidth: 600 }}
            onOk={onSubmit}
        >
            <Form form={form} name="advanced_search">
                <div style={{ marginBottom: 10 }}>请填写关闭需求的原因</div>

                <Row>
                    <Col span={24}>
                        <Form.Item label={''} name="finishComment">
                            <Input.TextArea rows={3} placeholder="请输入" showCount maxLength={35}/>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </Modal>
    )
}

export default DemandCloseModal
