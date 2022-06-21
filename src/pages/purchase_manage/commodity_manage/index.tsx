import { pageQuery } from '@/services/commodity';
import type DataCommodity from '@/types/data-commodity';
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

  const columns: ProColumns<DataCommodity.Commodity>[] = [
    {
      title: '序号',
      hideInSearch: true,
      renderText: (_, __, index: number) =>
        (paginationRef.current.current ?? 0 - 1) * (paginationRef.current.pageSize ?? 0) +
        index +
        1,
    },
    {
      title: '商品订货编码',
      dataIndex: 'barcode',
      valueType: 'textarea',
      order: 4,
    },
    {
      title: '商品图',
      dataIndex: 'thumbnail',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      valueType: 'textarea',
      order: 5,
    },
    {
      title: '商品型号',
      dataIndex: 'unemarque',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '商品采购价格',
      dataIndex: 'price',
      valueType: 'textarea',
      hideInSearch: true,
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
      title: '供应商',
      dataIndex: 'supplier',
      valueType: 'textarea',
      order: 4,
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
          <Button key="2" size="small" type="link" onClick={() => {}}>
            详情
          </Button>

          {record.status === 0 && (
            <Button key="2" size="small" type="link" onClick={() => {}}>
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
          <Button type="primary" key="primary" onClick={() => setCreateModalVisible(true)}>
            <PlusOutlined /> 新增商品
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
