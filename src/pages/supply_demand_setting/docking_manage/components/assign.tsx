import { Col, message, Modal, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Cascader, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd'
import SelfTable from '@/components/self_table'
import Common from '@/types/common'
import { getOrgManagePage } from '@/services/org-type-manage'
import OrgManage from '@/types/org-manage.d'
import { appoint } from '@/services/creative-demand'

const AssignModal = (props: { visible: any; setVisible: (b: boolean, isRefresh?: boolean)=> void; record: any }) => {
    const { visible, setVisible, record } = props
    const [dataSource, setDataSource] = useState([])
    const [selectKey, setSelectKey] = useState<any>({})

    const [form] = Form.useForm()
    const [searchContent, setSearChContent] = useState<any>({});

    const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageTotal: 0,
    });

    useEffect(() => {
        getPage();
    }, [searchContent]);

    const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
        try {
            const { result, totalCount, pageTotal, code, message } = await getOrgManagePage({
                pageIndex,
                pageSize,
                signed: true,
                ...searchContent,
            });
            if (code === 0) {
                setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
                setDataSource(result);
            } else {
                throw new Error(message);
            }
        } catch (error) {
            message.error(`请求失败，原因:{${error}}`);
        }
    };
    const columns = [
        {
            title: '服务商名称',
            dataIndex: 'orgName',
        },
        {
            title: '标注类型',
            dataIndex: 'orgSignName',
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelectKey(selectedRows?.[0])
        },
        getCheckboxProps: (record: any) => ({
            name: record.name,
        }),
    };

    const onSubmit = async () => {
        if(!selectKey?.id){
        message.info('请选择服务商')
        return
        }
        const tooltipMessage = '指派';
        try {
            const markResult = await appoint(record.id, selectKey?.id, selectKey?.orgName);
            if (markResult.code === 0) {
                message.success(`${tooltipMessage}成功`);
                setVisible(false, true)
            } else {
                throw new Error(markResult.message);
            }
        } catch (error) {
            message.error(`${tooltipMessage}失败，原因:{${error}}`);
        }
    }

    return (
        <Modal
            title={'指派服务商'}
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
            <Form form={form} name="advanced_search">
                <div style={{ marginBottom: 10 }}>需求名称</div>
                <div style={{ marginBottom: 20, fontWeight: 'bold' }}>{record?.name}</div>
                <div style={{ marginBottom: 10 }}>标注服务商列表：</div>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item label={'服务商名称'}>
                            <Input onChange={(e) => {
                                setSearChContent({ ...searchContent, orgName: e.target.value })
                            }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'标注类型'}>
                            <Select placeholder="请选择"
                                onChange={(e) => {
                                    setSearChContent({ ...searchContent, orgSign: e })
                                }}
                                allowClear>
                                {Object.entries(OrgManage.orgManageTypeJson).map(p => {
                                    return <Select.Option value={p[0]}>{p[1]}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
            <SelfTable
                rowSelection={{
                    type: 'radio',
                    ...rowSelection,
                }}
                rowKey='id'
                size={'small'}
                columns={columns}
                dataSource={dataSource}
                pagination={
                    pageInfo.totalCount === 0
                        ? false
                        : {
                            onChange: getPage,
                            total: pageInfo.totalCount,
                            current: pageInfo.pageIndex,
                            pageSize: pageInfo.pageSize,
                            showTotal: (total: number) =>
                                `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                        }
                }
            />
        </Modal>
    )
}

export default AssignModal
