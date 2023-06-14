import React, { useState, useMemo, useEffect } from 'react'
import {
    ProFormSelect,
    ProFormText,
    QueryFilter,
} from '@ant-design/pro-components';
import type { PaginationProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Button, Space, Dropdown, Table, Pagination, message, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history } from 'umi';
import { routeName } from '@/../config/routes';
import {
    getActiveData
} from '@/services/monthlyActive';

import { exportFile } from '@/services/monthlyActive';
import ImportComponent from './components/importData'

import style from './index.less'



interface DataType {
    scUserId?: number;
    userName?: string;
    userType: number;
    orgName: string;
    creditCode: number;
    phone: number;
    lyStaff?: string;
    createTime: string;
    [propName: string]: any;
}

// interface IUploadNum {
//     successNum: number | undefined;
//     failNum: number | undefined;
//     filePath: string;
//     progress?: string;
// }

type SearchParams = Pick<DataType, "scUserId" | "userName" | "lyStaff">




const userInfoToMonthlyActive: React.FC<{}> = () => {
    const [dataSource, setDataSource] = useState<DataType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [total, setTotal] = useState<number>(0)
    const [current, setCurrent] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [importModalVisible, setImportModalVisible] = useState<boolean>(false)
    const [searchContent, setSearchContent] = useState<SearchParams>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);


    const handleSearch = async (values: any) => {
        const searchParams = {}
        for (let key in values) {
            searchParams[key] = key !== 'lyStaff' ? values[key] : Boolean(Number(values[key]))
        }
        setSearchContent(searchParams)
        setCurrent(1)
    }

    const handleMenuClick = async (selectType: string) => {
        if (selectType === 'SELECT' && selectedRowKeys.length === 0) {
            message.warning('请选择数据');
            return;
        }
        try {
            let data = {};
            if (selectType === 'SELECT') {
                data = { userIds: [...selectedRowKeys] };
            } else {
                data = { ...searchContent };
            }
            const content = await exportFile({ ...data });
            const blob = new Blob([content], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
            });
            const time = moment().format('YYYY-MM-DD HH时mm分ss秒')
            const fileName = `羚羊金融月活数据${time}.xlsx`;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            link.click();
            window.URL.revokeObjectURL(url);
            link.remove()
            setTimeout(() => {
                message.success(`导出成功`);
            }, 1000);
        } catch (error) {
            console.log(error);
            message.error(`导出失败`);
        }
    };

    const handlePageChange: PaginationProps['onChange'] = (page, pageSize) => {
        setCurrent(page)
        setPageSize(pageSize)
        getPages(page, pageSize)
    }

    const queryDetail = (id: any) => {
        history.push(`${routeName.FINANCIAL_CUSTOMERS_MANAGE_DETAIL}?scUserId=${id}`);
    }

    const columns: ColumnsType<DataType> = useMemo(() => {
        return [
            {
                title: '神策用户ID',
                dataIndex: 'scUserId',
                key: 'scUserId',
                width: 140,
                align: 'center'
            },
            {
                title: '用户名称',
                dataIndex: 'userName',
                key: 'userName',
                width: 96,
                align: 'center',
                render: v => {
                    return v || '--'
                }
            },
            {
                title: '用户类型',
                dataIndex: 'userType',
                key: 'userType',
                width: 74,
                align: 'center',
                render: (type) => {
                    return type === 2 ? '企业' : type === 3 ? '个人' : type === 4 ? '其他' : '--'
                }
            },
            {
                title: '企业名称',
                key: 'orgName',
                dataIndex: 'orgName',
                width: 210,
                align: 'center',
                ellipsis: true,
                render: v => {
                    return v || '--'
                }
            },
            {
                title: '统一社会信用代码',
                key: 'creditCode',
                dataIndex: 'creditCode',
                width: 163,
                align: 'center',
                render: v => {
                    return v || '--'
                }
            },
            {
                title: '手机号',
                key: 'phone',
                dataIndex: 'phone',
                width: 117,
                align: 'center',
                render: v => {
                    return v || '--'
                }
            },
            {
                title: '是否为羚羊员工',
                key: 'lyStaff',
                dataIndex: 'lyStaff',
                width: 130,
                align: 'center',
                render: isLY => {
                    return isLY ? '是' : '否'
                }
            },
            {
                title: '导入时间',
                key: 'createTime',
                dataIndex: 'createTime',
                width: 153,
                align: 'center'
            },
            {
                title: '操作',
                key: 'action',
                fixed: 'right',
                align: 'center',
                width: 80,
                render: (_, record) => (
                    <Space size="middle">
                        {(record.userType === 2 || record.userType === 4) ? <a onClick={() => {
                            queryDetail(record.scUserId);
                        }}>详情</a> : '--'}
                    </Space>
                ),
            },
        ];
    }, [])

    // 请求列表
    const getPages = async (current?: number, pageSize?: number) => {
        try {
            setLoading(true)
            const { result, totalCount, code, message } = await getActiveData({
                pageIndex: current || 1,
                pageSize: pageSize || 10,
                ...searchContent,
            })
            if (code === 0) {
                setDataSource(result);
                setTotal(totalCount);
                setSelectedRowKeys([])
            } else {
                throw new Error(message);
            }
            setLoading(false)
        } catch (error) {
            message.error(`请求失败，原因:{${error}}`);
            setLoading(false)
        }
    };

    // 关闭导入弹窗
    const importCancel = () => {
        setImportModalVisible(false)
        getPages(1, pageSize)
    }

    useEffect(() => {
        getPages()
    }, [searchContent])


    const menuProps = (
        <Menu>
            <Menu.Item onClick={() => handleMenuClick('ALL')}>
                导出筛选结果
            </Menu.Item>
            <Menu.Item onClick={() => handleMenuClick('SELECT')}>
                导出选中数据
            </Menu.Item>
        </Menu>
    );
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys)
        }
    };
    return (
        <div className={style.pagelayout}>
            <div className={style.pageHeader}>
                <span>月活用户信息</span>
            </div>
            <div className={style.content}>
                <QueryFilter autoFocusFirstInput={false} className={style.queryForm} labelWidth="auto" collapsed={false} onFinish={handleSearch} submitter={{
                    render: (props) => {
                        return [
                            <Button
                                type="primary"
                                key="submit"
                                onClick={() => props.form?.submit?.()}
                            >
                                查询
                            </Button>,
                            <Button
                                type="default"
                                key="rest"
                                style={{ marginRight: -16 }}
                                onClick={() => { props.form?.resetFields(); setSearchContent({}) }}
                            >
                                重置
                            </Button>
                        ]
                    }
                }}
                    collapseRender={() => null}>
                    <ProFormText name="scUserId" label="神策用户ID" />
                    <ProFormText name="userName" label="用户名称" />
                    <ProFormSelect valueEnum={{
                        1: '是',
                        0: '否',
                    }} name="lyStaff" label="是否为羚羊员工" />
                </QueryFilter>
                <div className={style.tableWrapper}>
                    <Space className={style.operate}>
                        <Button onClick={() => { setImportModalVisible(true) }}>导入</Button>
                        <Dropdown overlay={menuProps}>
                            <Button>
                                <Space>
                                    导出
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </Space>
                    <Table
                        bordered
                        size='small'
                        rowSelection={{
                            ...rowSelection,
                        }}
                        rowKey='scUserId'
                        columns={columns}
                        dataSource={dataSource}
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                        pagination={false}
                    />
                    <Pagination
                        total={total}
                        current={current}
                        pageSize={pageSize}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total) => `共 ${total} 条记录 第${current}/${Math.ceil(total / pageSize) || 1}页`}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
            <ImportComponent visible={importModalVisible} handleCancel={importCancel} />
        </div>
    )
}


export default userInfoToMonthlyActive
