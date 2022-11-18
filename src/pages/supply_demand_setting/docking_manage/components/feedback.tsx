import { Button, Empty, message, Popconfirm, Upload, } from 'antd'
import React, { useEffect, useState } from 'react'
import { Form } from 'antd'
import { renderSearchItemControl, SearchItemControlEnum } from './refine'
import UploadFormFile from '@/components/upload_form/upload-form-file'
import { DeleteTwoTone, UploadOutlined } from '@ant-design/icons'
import { deleteFeedback, getFeedbackDetail, postFeedback } from '@/services/creative-demand'
import scopedClasses from '@/utils/scopedClasses';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout'
import { RcFile } from 'antd/lib/upload'
const sc = scopedClasses('user-config-logout-verify');

const FeedBackModal = () => {
    const [detail, setDetail] = useState<any>('')
    const id = history.location.query?.id as string;
    const name = history.location.query?.name as string;
    const [form] = Form.useForm()

    useEffect(() => {
        if (!id) return
        getInfo()
    }, [id])


    const getInfo = async () => {
        try {
            const res = await getFeedbackDetail(id)
            setDetail(res?.result || {})
        } catch (error) {
            message.error('服务器错误')
        }
    }

    const remove = async (feedbackId: string) => {
        try {
            const res = await deleteFeedback(feedbackId)
            if (res?.code == 0) {
                message.success('删除成功')
                getInfo()
            } else {
                message.error(res?.message || '删除失败')
            }
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
                return <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{name}</div>
            }
        },
        {
            key: 'content',
            label: `交付物内容描述`,
            type: SearchItemControlEnum.TEXTAREA,
            props: {
                style: {
                    width: '100%',

                },
                showCount: true,
                maxLength: 500,
            },
        },
        {
            key: 'fileIds',
            label: `交付物文件上传`,
            type: SearchItemControlEnum.CUSTOM,
            render: (form) => {
                return <UploadFormFile maxCount={3} multiple accept=".png,.jpg,.pdf,.xlsx,.xls" showUploadList={true} maxSize={30}>
                    <Button
                        onClick={() => {
                            const files = form.getFieldValue('fileIds')
                            if (files?.length >= 3) {
                                message.error('上传文件数目不得超3个')
                            }
                        }}
                        icon={<UploadOutlined />}>上传文件</Button>
                    <div style={{ fontSize: '12px' }}>支持上传以下格式文件：jpg、pdf、xlxs、xls、png，单个文件上传大小限制30M，最多上传三个文件</div>
                </UploadFormFile>
            }
        },
    ]


    const onSubmit = async () => {
        form
            .validateFields()
            .then(async (values) => {
                const { fileIds, ...rest } = values
                console.log(values)
                if (!values?.content && !fileIds) {
                    message.error('请上传交付物或者填写交付物内容描述')
                    return
                }
                const res = await postFeedback({
                    demandId: id,
                    fileIdList: fileIds ? fileIds?.map(p => {
                        return p?.response?.result || p?.uid
                    }) : undefined,
                    ...rest,
                });
                if (res?.code == 0) {
                    message.success('反馈成功')
                    form.resetFields();
                    getInfo()
                } else {
                    message.error(res?.message || '反馈失败')
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <PageContainer style={{ background: '#fff' }}>
            <Form
                style={{ width: '50%' }}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form}>
                {searchList?.map((search) => (
                    <Form.Item name={search?.key} label={search?.label}>
                        {renderSearchItemControl(search, form)}
                    </Form.Item>
                ))}

                <Button type="primary" onClick={() => {
                    onSubmit()
                }}>
                    提交
                </Button>
            </Form>
            <div style={{ margin: '10px 0', fontWeight: 'bolder', fontSize: '18px' }}>反馈记录</div>
            {detail?.feedbackList?.length > 0 ? detail?.feedbackList?.map((p) => {
                return <div className={sc('container')}>
                    <div className={sc('container-desc')}>
                        <div style={{ margin: '10px 0', fontWeight: 'bolder' }}>

                            <span style={{ marginRight: 20 }}>{p?.createTime}</span>
                            <DeleteTwoTone onClick={() => remove(p.id)}
                            />
                        </div>
                        <div style={{ padding: '20px 0' }}>{p?.content || '--'}</div>
                    </div>
                    <div className={sc('container-desc')}>
                        <div>
                            {p?.fileList &&
                                p?.fileList?.map((p: any) => {
                                    return (
                                        <div>
                                            <a target="_blank" rel="noreferrer"
                                                download={p.name + '.' + p.format} href={p.path}
                                            >
                                                {p.name + '.' + p.format}
                                            </a>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
            }) : <div style={{ height: 300 }}>
                <Empty description="暂无记录" />
            </div>}
        </PageContainer>
    )
}

export default FeedBackModal
