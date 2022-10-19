import { Col, message, Modal, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Cascader, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd'
import SelfTable from '@/components/self_table'
import Common from '@/types/common'

const AssignModal = (props) => {
    const { visible, setVisible } = props
    const [dataSource, setDataSource] = useState([
        {
            name: 'aaa', age: 'bbb'
        }
    ])
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
            const { result, totalCount, pageTotal, code, message } = await getExpertResourcePage({
                pageIndex,
                pageSize,
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
            dataIndex: 'name',
        },
        {
            title: '标注类型',
            dataIndex: 'age',
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };

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
        >
            <Form form={form} name="advanced_search">
                <div>需求名称</div>
                <div>企业数字化改造服务</div>
                <span style={{ marginBottom: 20 }}>标注服务商列表：</span>

                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item label={'服务商名称'}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={'标注类型'}>
                            <Select placeholder="请选择" allowClear>
                                {[]?.map((p) => (
                                    <Select.Option key={p.id} value={p.enumName || p.id || p.code}>
                                        {p.name}
                                    </Select.Option>
                                ))}
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
