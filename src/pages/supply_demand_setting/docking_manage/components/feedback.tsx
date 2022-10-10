import { Button, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { Cascader, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd'
import { renderSearchItemControl, SearchItem, SearchItemControlEnum } from './refine'
import UploadFormFile from '@/components/upload_form/upload-form-file'
import { UploadOutlined } from '@ant-design/icons'

const FeedBackModal = (props) => {
    const { current, visible, setVisible } = props

    const [form] = Form.useForm()

    const searchList = [
        {
            key: 'name',
            label: `需求名称`,
            type: SearchItemControlEnum.CUSTOM,
            render: () => {
                return '企业数字化改造服务'
            }
        },
        {
            key: 'name',
            label: `交付物内容描述`,
            type: SearchItemControlEnum.TEXTAREA,
        },
        {
            key: 'name',
            label: `交付物文件上传`,
            type: SearchItemControlEnum.CUSTOM,
            render: () => {
                return <UploadFormFile multiple isSkip={true} showUploadList={true} maxCount={10} maxSize={30}>
                    <Button icon={<UploadOutlined />}>上传文件</Button>
                    <div style={{fontSize: '12px'}}>支持上传以下格式文件：excel、pdf、jpg、png，单个文件上传大小限制30M</div>

                </UploadFormFile>
            }
        },
    ]

    return (
        <Modal
            title={'需求反馈'}
            visible={visible}
            onCancel={() => {
                setVisible(false)
            }}
            width={600}
            centered
            maskClosable={false}
            okText="确定"
            cancelText="取消"
            destroyOnClose={true}
            bodyStyle={{ padding: 20, minWidth: 600 }}
        >

            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}>
                {searchList?.map((search) => (
                    <Form.Item name={search?.key} label={search?.label}>
                        {renderSearchItemControl(search)}
                    </Form.Item>
                ))}
            </Form>
        </Modal >
    )
}

export default FeedBackModal
