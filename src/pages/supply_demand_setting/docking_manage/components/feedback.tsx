import { Button, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { Cascader, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd'
import { renderSearchItemControl, SearchItem, SearchItemControlEnum } from './refine'
import UploadFormFile from '@/components/upload_form/upload-form-file'
import { UploadOutlined } from '@ant-design/icons'
import { getFeedbackDetail, postFeedback } from '@/services/creative-demand'

const FeedBackModal = (props: { record: any; visible: any; setVisible: (b: boolean, isRefresh?: boolean) => void }) => {
    const { record, visible, setVisible } = props

    const [form] = Form.useForm()

    useEffect(() => {
        if (!record?.id) return
        getInfo()
    }, [record])


    const getInfo = async () => {

        try {
            const res = await getFeedbackDetail(record?.id)

            const { fileInfo, ...rest } = res?.result || {}

            form.setFieldsValue({
                fileIds: fileInfo
                    ? fileInfo?.map((p) => {
                        return {
                            uid: p.fileId,
                            name: p.fileName,
                            status: 'done',
                            url: p?.path
                        };
                    })
                    : [],
                ...rest
            })

        } catch (error) {
            message.error('服务器错误')
        }
    }


    const searchList = [
        {
            key: 'name',
            label: `需求名称`,
            type: SearchItemControlEnum.CUSTOM,
            render: () => {
                return record?.name
            }
        },
        {
            key: 'content',
            label: `交付物内容描述`,
            type: SearchItemControlEnum.TEXTAREA,
        },
        {
            key: 'fileIds',
            label: `交付物文件上传`,
            type: SearchItemControlEnum.CUSTOM,
            render: () => {
                return <UploadFormFile multiple accept=".png,.jpg,.pdf,.xlsx,.xls" showUploadList={true} maxSize={30}>
                    <Button icon={<UploadOutlined />}>上传文件</Button>
                    <div style={{ fontSize: '12px' }}>支持上传以下格式文件：jpg、pdf、xlxs、xls、png，单个文件上传大小限制30M</div>
                </UploadFormFile>
            }
        },
    ]

    const onSubmit = async () => {
        form
            .validateFields()
            .then(async (values) => {
                const { fileIds, ...rest } = values
                console.log('fileIdsfileIdsfileIdsfileIds', fileIds)
                const res = await postFeedback({
                    demandId: record?.id,
                    list: fileIds ? fileIds?.map(p => {
                        return {
                            fileName: p?.name,
                            fileId: p?.response?.result || p?.uid
                        }
                    }) : undefined,
                    ...rest,
                    type: 0,
                });
                if (res?.code == 0) {
                    message.success('反馈成功')
                    form.resetFields();
                    setVisible(false, true)
                } else {
                    message.error(res?.message || '反馈失败')
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

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
            onOk={onSubmit}
        >

            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}>
                {searchList?.map((search) => (
                    <Form.Item name={search?.key} label={search?.label}>
                        {renderSearchItemControl(search, form)}
                    </Form.Item>
                ))}
            </Form>
        </Modal >
    )
}

export default FeedBackModal
