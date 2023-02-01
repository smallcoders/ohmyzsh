import SelfTable from '@/components/self_table';
import Common from '@/types/common.d';
import { PageContainer } from '@ant-design/pro-layout';
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    message as antdMessage,
    Popconfirm,
    Row,
    Select,
    Statistic,
} from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import AuthenticationInfo from '@/types/authentication-info.d';
import Upload from './upload';
import { Access, useAccess } from 'umi';
import { deleteLoanOrder, getLoanOrderCount, getLoanOrderList } from '@/services/app-financial-service-manage';
import { getTemplateFile } from '@/services/supplier';
import { getFileInfo } from '@/services/common';
const sc = scopedClasses('operate-data-manage');
export default () => {
    const [dataSource, setDataSource] = useState<AuthenticationInfo.Content[]>([]);

    const [counts, setCounts] = useState<{
        orgCount?: number; // 合作金融机构
        productCount?: number; // 羚羊金融产品（款）
        applyCount?: number; // 企业申请数（笔）
        creditAmount?: number; // 总授信金额（万元）
    }>({});
    const access = useAccess()
    const prepare = async () => {
        try {
            const res = await getLoanOrderCount()
            setCounts(res.result)
        } catch (error) {

        }
    }

    useEffect(() => {
        prepare()
    }, [])


    const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageTotal: 0,
    });


    const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
        try {
            const { result, totalCount, pageTotal, code, message } = await getLoanOrderList({
                pageIndex,
                pageSize,
                applyTimeStart: timer?.applyTimeStart,
                applyTimeEnd: timer?.applyTimeEnd,
            });
            if (code === 0) {
                setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
                setDataSource(result);
            } else {
                throw new Error(message);
            }
        } catch (error) {
            antdMessage.error(`请求失败，原因:{${error}}`);
        }
    };

    const onDelete = async (record: any) => {
        try {
            console.log('record', record)
            const { code, message } = await deleteLoanOrder(record?.applyNo);
            if (code === 0) {
                antdMessage.success(`删除成功`);
                getPage()
                prepare()
            } else {
                antdMessage.error(message || `删除失败`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: '序号',
            dataIndex: 'sort',
            width: 80,
            render: (_: any, _record: AuthenticationInfo.Content, index: number) =>
                pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
        },
        {
            title: '业务申请编号',
            dataIndex: 'applyNo',
            width: 200,
            isEllipsis: true,
            render: (item: string) => item || '--'
        },
        {
            title: '业务类型',
            dataIndex: 'workType',
            isEllipsis: true,
            width: 150,
            render: (item: string) => item || '--'
        },
        {
            title: '企业名称',
            dataIndex: 'orgName',
            isEllipsis: true,
            width: 200,
            render: (item: string) => item || '--'
        },
        {
            title: '联系人',
            dataIndex: 'name',
            isEllipsis: true,
            width: 150,
            render: (item: string) => item || '--'
        },
        {
            title: '产品名称',
            dataIndex: 'product',
            isEllipsis: true,
            width: 150,
            render: (item: string) => item || '--'
        },
        {
            title: '金融机构',
            dataIndex: 'bankName',
            isEllipsis: true,
            width: 250,
            render: (item: string) => item || '--'
        },

        {
            title: '授信状态',
            dataIndex: 'workStatus',
            isEllipsis: true,
            width: 150,
            render: (item: string) => item || '--'
        },
        {
            title: '授信/承担保金额（万元）',
            dataIndex: 'creditAmount',
            width: 150,
            isEllipsis: true,
            render: (item: number) => (item || 0) / 1000000
        },
        {
            title: '申请时间',
            dataIndex: 'time',
            isEllipsis: true,
            width: 300,
            render: (item: string) => item || '--'
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: 100,
            render: (_: any, record: any) => (
                <Access accessible={access['P_OD_JRDD']}>
                    <Popconfirm
                        title="确定删除么？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => onDelete(record)}
                    >
                        <Button
                            type='link'
                        >删除</Button>
                    </Popconfirm>
                </Access>
            ),
        },

    ];


    const useHeader = (): React.ReactNode => {
        return (
            <div className={sc('container-search')}>
                <Statistic title="合作金融机构（家）" value={counts?.orgCount || 0} />
                <Statistic title="羚羊金融产品（款）" value={counts?.productCount || 0} />
                <Statistic title="企业申请数（笔）" value={counts?.applyCount || 0} />
                <Statistic title="总授信金额（万元）" value={(counts?.creditAmount || 0) / 1000000} precision={2} />
            </div>
        );
    };

    const [timer, setTimer] = useState({
        applyTimeStart: undefined,
        applyTimeEnd: undefined
    });
    useEffect(() => {
        getPage();
    }, [timer]);

    const [importVisible, setImportVisible] = useState(false);

    const [path, setPath] = useState(false);

    const getTemplate = async () => {
        try {
            const res = await getTemplateFile('jrdd')
            const fileRes = await getFileInfo(res?.result)
            setPath(fileRes?.result?.[0]?.path)
        } catch (error) {

        }

    }

    return (
        <PageContainer
        >
            {useHeader()}
            <div className={sc('container-table-header')}>
                <div className="title">
                    <span>金融订单列表</span>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Access accessible={access['P_OD_JRDD']}> <Button
                            onClick={() => {
                                setImportVisible(true)
                                getTemplate()
                            }}>导入</Button>
                        </Access>
                        <Upload path={path} visible={importVisible}
                            setVisible={(e, isFresh = false) => {
                                setImportVisible(e)
                                if (isFresh) {
                                    getPage()
                                    prepare()
                                }
                            }}
                        ></Upload>
                        <DatePicker.RangePicker allowClear onChange={(e) => {
                            console.log('eeee', e)
                            setTimer({
                                applyTimeStart: e?.[0] ? e[0].format('YYYY-MM-DD') : undefined,
                                applyTimeEnd: e?.[1] ? e[1].format('YYYY-MM-DD') : undefined
                            })
                        }} />
                    </div>
                </div>
            </div>
            <div className={sc('container-table-body')}>
                <SelfTable
                    bordered
                    scroll={{ x: 1880 }}
                    columns={columns}
                    rowKey={'id'}
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
                                    `第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                            }
                    }
                />
            </div>
        </PageContainer>
    );
};
