import { pageQuery } from '@/services/commodity';
import type DataCommodity from '@/types/data-commodity';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Access, useAccess } from 'umi';
import { Button } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import {routeName} from '@/../con'

export default () => {
  const history = useHistory();
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState(0);
  const paginationRef = useRef<{ current?: number; pageSize?: number }>({
    current: 0,
    pageSize: 0,
  });

  const goEdit = useCallback(
    (record: { id: number }) => {
      history.push(`/purchase-manage/commodity-create?id=${record.id}`);
    },
    [history],
  );

  const goDetail = useCallback(
    (record: { id: number }) => {
      window.open(`/purchase-manage/commodity-detail?id=${record.id}`);
    },
    [history],
  );

  const columns: ProColumns<DataCommodity.Commodity>[] = [
    {
      title: '权重',
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
      title: '商品来源',
      dataIndex: 'productName',
      valueType: 'textarea',
      order: 5,
    },
    {
      title: '商品类型',
      dataIndex: 'productModel',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '所属组织',
      dataIndex: 'productModel',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '价格区间',
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
      title: '所属标签',
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
      title: '商品服务端',
      dataIndex: 'providerName',
      valueType: 'textarea',
      order: 4,
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_, record) => (
        <>
          <Button size="small" type="link" onClick={() => goDetail(record)}>
            详情
          </Button>

          {record.saleStatus === 0 && (
            <Access accessible={access['P_PM_SP']}>
              <Button size="small" type="link" onClick={() => goEdit(record)}>
                权重
              </Button>
            </Access>
          )}
        </>
      ),
    },
  ];
  const access = useAccess()
  return (
    <PageContainer>
      <ProTable
        headerTitle={`商品列表（共${total}个）`}
        options={false}
        rowKey="id"
        search={{
          span: 8,
          labelWidth: 100,
          defaultCollapsed: false,
          collapseRender: () => false,
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        actionRef={actionRef}
        request={async (pagination) => {
          const timer = pagination.updateTime
            ? {
                timeStart: pagination.updateTime[0],
                timeEnd: pagination.updateTime[1],
              }
            : {};
          const result = await pageQuery({ ...pagination, ...timer });
          paginationRef.current = pagination;
          setTotal(result.totalCount);
          return { total: result.totalCount, success: true, data: result.result };
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};
