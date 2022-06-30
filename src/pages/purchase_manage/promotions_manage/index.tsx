import { pageQuery as commodityPageQuery } from '@/services/commodity';
import { pageQuery } from '@/services/promotions';
import { getActivityManageList } from '@/services/purchase';
import type DataCommodity from '@/types/data-commodity';
import type DataPromotions from '@/types/data-promotions';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Image } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { useHistory } from 'umi';
import type Common from '@/types/common';
import { keyBy } from 'lodash';

export default () => {
  const history = useHistory();

  const actionRef = useRef<ActionType>();

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const paginationRef = useRef<{ pageIndex?: number; pageSize?: number }>({
    pageIndex: 1,
    pageSize: 20,
  });

  const pagination2Ref = useRef<{ pageIndex?: number; pageSize?: number }>({
    pageIndex: 0,
    pageSize: 0,
  });

  const columns: ProColumns<DataPromotions.Promotions>[] = [
    {
      title: '序号',
      hideInSearch: true,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '活动编码',
      dataIndex: 'actNo',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '活动名称',
      dataIndex: 'actName',
      valueType: 'textarea',
      hideInTable: true,
      order: 5,
    },
    {
      title: '商品数量',
      dataIndex: 'commoditys',
      hideInSearch: true,
      // valueType: 'textarea',
      // order: 4,
      render: (_: string, _record: any) => _record.product ?  _record.product.length : 0
    },
    {
      title: '活动时间',
      dataIndex: 'time',
      hideInSearch: true,
      render: (_: string, _record: any) => _record?.startTime + '~' + _record?.endTime
    },
    {
      title: '上架状态',
      dataIndex: 'addedState',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '上架',
        },
        1: {
          text: '下架',
        },
        2: {
          text: '暂存',
        },
      },
    },
    {
      title: '活动状态',
      dataIndex: 'actState',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '未开始',
        },
        1: {
          text: '进行中',
        },
        2: {
          text: '已结束',
        },
      },
      order: 5,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      valueType: 'textarea',
      hideInTable: true,
      order: 5,
    },
    {
      title: '活动权重',
      dataIndex: 'sortNo',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '最新操作时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
      order: 4,
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_, record) => (
        <>
          {record.status === 1 && (
            <Button size="small" type="link" onClick={() => {}}>
              提前开始
            </Button>
          )}

          {record.status === 2 && (
            <Button size="small" type="link" onClick={() => {}}>
              提前结束
            </Button>
          )}

          {record.listingStatus === 1 ? (
            <Button size="small" type="link" onClick={() => {}}>
              下架
            </Button>
          ) : (
            <Button size="small" type="link" onClick={() => {
              history.push(`/purchase-manage/promotions-create?id=${record.id}`);
            }}>
              编辑
            </Button>
          )}

          <Button size="small" type="link" onClick={() => {
            history.push(`/purchase-manage/promotions-create?id=${record.id}&isDetail=1`);
          }}>
            详情
          </Button>
        </>
      ),
    },
  ];

  const expandedRowRender = (record: any) => {
    const _columns: ProColumns<DataCommodity.Commodity>[] = [
      {
        title: '序号',
        hideInSearch: true, 
        renderText: (_, __, index: number) => index + 1,
      },
      {
        title: '商品订货编码',
        dataIndex: 'productNo',
        valueType: 'textarea',
      },
      {
        title: '商品图',
        dataIndex: 'productPic',
        render: (_: string, _record: any) => (
          <Image width={100} src={_} />
        ),
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        valueType: 'textarea',
      },
      {
        title: '商品型号',
        dataIndex: 'productModel',
        valueType: 'textarea',
      },
      {
        title: '商品原价',
        dataIndex: 'purchasePricePart',
        valueType: 'textarea',
      },
      {
        title: '商品售价',
        dataIndex: 'SalePricePart',
        valueType: 'textarea',
      },
      {
        title: '商品划线价',
        dataIndex: 'OriginPricePart'
      },
      {
        title: '销售状态',
        dataIndex: 'addedState',
        valueType: 'select',
        valueEnum: {
          1: {
            text: '上架',
          },
          0: {
            text: '下架',
          },
        },
      },

      {
        title: '权重',
        renderText: () => 1,
      },
    ];
    return (
      <ProTable
        columns={_columns}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={tableData[record.id]}
        pagination={false}
      />
    );
  };
  const [loadingObj, setLoadingObj] = useState<any>({});

  const [tableData, setTableData] = useState<any>([]);
  
  const queryExpandedData = async(record: any, key: any) => {
    try {
      const table = {...tableData};
      const loading = {...loadingObj};
      const data:any = record.product || [];
      table[key] = data;
      loading[key] = false;
      setTableData(table);
      setLoadingObj(loading);
    } catch(err) {
      console.log(err);
    }
  }

  const onExpand = (expanded: any, record: any) => {
    const key = record?.id;
    // console.log(expanded, record, 111);
    if (tableData[key]?.length) return;
    const loading = { ...loadingObj };
    loading[key] = true;
    setLoadingObj(loading);
    queryExpandedData(record, key);
  }

  return (
    <PageContainer>
      <ProTable
        options={false}
        rowKey="id"
        expandable = {{
          onExpand,
          expandedRowRender
        }}
        search={{
          span: 8,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => {
            history.push('/purchase-manage/promotions-create');
          }}>
            <PlusOutlined /> 新增活动
          </Button>,
        ]}
        request={async (filter) => {
          // console.log(filter)
          let params = {
            ...filter,
            pageIndex: filter.current,
            startDate: filter.updateTime?[0] : '',
            endDate: filter.updateTime?[1] : ''
          };
          const result = await getActivityManageList(params);
          // pageInfo.current = pagination;
          return Promise.resolve({
            data: result.result,
            success: true,
          });
        }}
        // request={async (pagination) => {
        //   const result = await pageQuery(pagination);
        //   paginationRef.current = pagination;
        //   return result;
        // }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};
