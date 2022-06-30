import { pageQuery } from '@/services/commodity';
import type DataCommodity from '@/types/data-commodity';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';

export default () => {
  const history = useHistory();
  const actionRef = useRef<ActionType>();
  const paginationRef = useRef<{ current?: number; pageSize?: number }>({
    current: 0,
    pageSize: 0,
  });

  const goCreate = useCallback(() => {
    history.push('/purchase-manage/commodity-create');
  }, [history]);

  const goEdit = useCallback(
    (record: { id: number }) => {
      history.push(`/purchase-manage/commodity-create?id=${record.id}`);
    },
    [history],
  );

  const goDetail = useCallback(() => {
    history.push('/purchase-manage/commodity-detail');
  }, [history]);

  const columns: ProColumns<DataCommodity.Commodity>[] = [
    {
      title: '序号',
      hideInSearch: true,
      renderText: (_, __, index: number) =>
        ((paginationRef.current.current ?? 0) - 1) * (paginationRef.current.pageSize ?? 10) +
        index +
        1,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      valueType: 'textarea',
      order: 5,
    },
    {
      title: '商品图',
      dataIndex: 'productPic',
      valueType: 'image',
      hideInSearch: true,
    },

    {
      title: '商品型号',
      dataIndex: 'productModel',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '商品采购价格',
      dataIndex: 'purchasePricePart',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '商品状态',
      dataIndex: 'finishStatus',
      valueType: 'select',
      valueEnum: {
        1: {
          text: '已完成',
        },
        0: {
          text: '未完成',
        },
      },
    },
    {
      title: '销售状态',
      dataIndex: 'saleStatus',
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
      title: '供应商',
      dataIndex: 'providerName',
      valueType: 'textarea',
      order: 4,
    },
    {
      title: '最新操作时间',
      dataIndex: 'updateTime',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '最新操作时间',
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
          <Button size="small" type="link" onClick={goDetail}>
            详情
          </Button>

          {record.saleStatus === 0 && (
            <Button size="small" type="link" onClick={() => goEdit(record)}>
              编辑
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        options={false}
        rowKey="id"
        search={{
          span: 8,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={goCreate}>
            <PlusOutlined /> 新增商品
          </Button>,
        ]}
        request={async (pagination) => {
          const result = await pageQuery(pagination);
          paginationRef.current = pagination;
          return { total: result.totalCount, success: true, data: result.result };
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};
