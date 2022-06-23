import { pageQuery as commodityPageQuery } from '@/services/commodity';
import { pageQuery } from '@/services/promotions';
import type DataCommodity from '@/types/data-commodity';
import type DataPromotions from '@/types/data-promotions';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { useRef, useState } from 'react';

export default () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const actionRef = useRef<ActionType>();
  const paginationRef = useRef<{ current?: number; pageSize?: number }>({
    current: 0,
    pageSize: 0,
  });

  const pagination2Ref = useRef<{ current?: number; pageSize?: number }>({
    current: 0,
    pageSize: 0,
  });

  const columns: ProColumns<DataPromotions.Promotions>[] = [
    {
      title: '序号',
      hideInSearch: true,
      renderText: (_, __, index: number) =>
        ((paginationRef.current.current ?? 1) - 1) * (paginationRef.current.pageSize ?? 0) +
        index +
        1,
    },
    {
      title: '活动编码',
      dataIndex: 'code',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      valueType: 'textarea',
      order: 5,
    },
    {
      title: '商品数量',
      dataIndex: 'commoditys',
      valueType: 'textarea',
      order: 4,
    },
    {
      title: '活动时间',
      dataIndex: 'time',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '上架状态',
      dataIndex: 'listingStatus',
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
      title: '活动状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: {
          text: '未开始',
        },
        2: {
          text: '进行中',
        },
        3: {
          text: '已结束',
        },
      },
      order: 5,
    },
    {
      title: '活动权重',
      dataIndex: 'order',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '最新操作时间',
      dataIndex: 'updateDate',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '最新操作时间',
      dataIndex: 'updateDate',
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
            <Button size="small" type="link" onClick={() => {}}>
              编辑
            </Button>
          )}

          <Button size="small" type="link" onClick={() => {}}>
            详情
          </Button>
        </>
      ),
    },
  ];

  const expandedRowRender = (data: DataPromotions.Promotions) => {
    const _columns: ProColumns<DataCommodity.Commodity>[] = [
      {
        title: '序号',
        hideInSearch: true,
        renderText: (_, __, index: number) =>
          (pagination2Ref.current.current ?? 0 - 1) * (pagination2Ref.current.pageSize ?? 0) +
          index +
          1,
      },
      {
        title: '商品订货编码',
        dataIndex: 'barcode',
        valueType: 'textarea',
      },
      {
        title: '商品图',
        dataIndex: 'thumbnail',
        valueType: 'textarea',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        valueType: 'textarea',
      },
      {
        title: '商品型号',
        dataIndex: 'unemarque',
        valueType: 'textarea',
      },
      {
        title: '商品原价',
        dataIndex: 'price',
        valueType: 'textarea',
      },
      {
        title: '商品售价',
        dataIndex: 'price',
        valueType: 'textarea',
      },
      {
        title: '商品划线价',
        renderText: () => '/',
      },
      {
        title: '销售状态',
        dataIndex: 'status',
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
        request={async (pagination) => {
          const result = await commodityPageQuery({ ...pagination, pageSize: data.commoditys });
          pagination2Ref.current = pagination;
          return result;
        }}
        pagination={false}
      />
    );
  };
  return (
    <PageContainer>
      <ProTable
        options={false}
        rowKey="id"
        expandable={{ expandedRowRender }}
        search={{
          span: 8,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => setCreateModalVisible(true)}>
            <PlusOutlined /> 新增活动
          </Button>,
        ]}
        request={async (pagination) => {
          const result = await pageQuery(pagination);
          paginationRef.current = pagination;
          return result;
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};
