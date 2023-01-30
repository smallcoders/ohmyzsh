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
import { getAreaTree } from '@/services/area';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import moment from 'moment';
import AuthenticationInfo from '@/types/authentication-info.d';
import { getAuthenticationInfoPage } from '@/services/data-manage';
import Upload from './upload';
import { Access, useAccess } from 'umi';
import { getGMVTotal, getGVMPage, removeGMVItem } from '@/services/purchase';
const sc = scopedClasses('operate-data-manage');
export default () => {
    const [dataSource, setDataSource] = useState<AuthenticationInfo.Content[]>([]);
    const [counts, setCounts] = useState<{
        total?: number; // 合作金融机构
    }>({});

    const prepare = async () => {
        try {
            const res = await getGMVTotal()
            setCounts({ total: res?.data || 0 })
        } catch (error) {

        }
    }
    const access = useAccess()
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
            const { result, totalCount, pageTotal, code, message } = await getGVMPage({
                pageIndex,
                pageSize,
                beginDate: timer?.applyTimeStart,
                endDate: timer?.applyTimeEnd,
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
            const { code, message } = await removeGMVItem(record?.id);
            if (code === 0) {
                antdMessage.success(`删除成功`);
                getPage()
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
            title: '合同/订单归档时间',
            dataIndex: 'archiveTime',
            width: 150,
            isEllipsis: true,
            render: (item: string)=> item || '--'
        },
        {
            title: '采购单号',
            dataIndex: 'orderNo',
            isEllipsis: true,
            width: 150,
            render: (item: string)=> item || '--'
        },
        {
            title: '物资大类',
            dataIndex: 'goodsCtBig',
            isEllipsis: true,
            width: 200,
            render: (item: string)=> item || '--'
        },
        {
            title: '物资小类',
            dataIndex: 'goodsCtSmall',
            isEllipsis: true,
            width: 150,
            render: (item: string)=> item || '--'
        },
        {
            title: '物料编码',
            dataIndex: 'goodsCode',
            isEllipsis: true,
            width: 150,
            render: (item: string)=> item || '--'
        },
        {
            title: '物料描述',
            dataIndex: 'goodsDesc',
            isEllipsis: true,
            width: 150,
            render: (item: string)=> item || '--'
        },

        {
            title: '长文本描述',
            dataIndex: 'bigText',
            isEllipsis: true,
            width: 150,
            render: (item: string)=> item || '--'
        },
        {
            title: '数量',
            dataIndex: 'num',
            width: 150,
            isEllipsis: true,
            render: (item: string)=> item || '--'
        },
        {
            title: '单位',
            dataIndex: 'unitName',
            isEllipsis: true,
            width: 150,
            render: (item: string)=> item || '--'
        },
        {
            title: '价格单位',
            dataIndex: 'priceUnitName',
            isEllipsis: true,
            width: 150,
            render: (item: string)=> item || '--'
        },
        {
            title: '含税单价',
            dataIndex: 'singlePrice',
            isEllipsis: true,
            width: 150,
            render: (item: string)=> item || '--'
        },
        {
            title: '税率',
            dataIndex: 'taxRate',
            isEllipsis: true,
            width: 150,
            render: (item: string)=> item || '--'
        }, {
            title: '币种',
            dataIndex: 'currencyName',
            width: 150,
            isEllipsis: true,
            render: (item: string)=> item || '--'
        },
        {
            title: '汇率',
            dataIndex: 'exchangeRate',
            isEllipsis: true,
            width: 150,
            render: (item: string)=> item || '--'
        },
        {
            title: '含税金额（人民币：元）',
            dataIndex: 'totalPrice',
            isEllipsis: true,
            width: 200,
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (_: any, record: any) => (
                <Access accessible={access['P_OD_GMV']}>
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

    useEffect(() => {
        getPage();
    }, [timer]);
    const [timer, setTimer] = useState({
        applyTimeStart: undefined,
        applyTimeEnd: undefined
    });
    const [importVisible, setImportVisible] = useState(false);

    const useHeader = (): React.ReactNode => {
        return (
            <div className={sc('container-search')}>
                <span>羚羊平台GMV总额（万元）：</span>

                <Statistic value={(counts.total || 0) / 10000} precision={2} />
            </div>
        );
    };

    return (
        <PageContainer
        >
            {useHeader()}
            <div className={sc('container-table-header')}>
                <div className="title">
                    <span>供应链流水列表</span>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Access accessible={access['P_OD_GMV']}><Button
                            onClick={() => {
                                setImportVisible(true)
                            }}>导入</Button></Access>
                        <Upload visible={importVisible} setVisible={(e) => {
                            setImportVisible(e)
                            getPage()
                        }}></Upload>
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
                    scroll={{ x: 1480 }}
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
