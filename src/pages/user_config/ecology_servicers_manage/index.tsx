import { getActivityManageList } from '@/services/purchase';
import type DataCommodity from '@/types/data-commodity';
import type DataPromotions from '@/types/data-promotions';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { Access, useAccess } from 'umi';

export default () => {
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);

  const columns: ProColumns<DataPromotions.Promotions>[] = [
    {
      title: '企业名称',
      dataIndex: 'actNo',
      valueType: 'textarea',
    },
    {
      title: '管理员名称',
      dataIndex: 'name',
      valueType: 'textarea'
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      valueType: 'textarea',
      hideInTable: true
    },
    {
      title: '管理员电话',
      dataIndex: 'actName',
      valueType: 'textarea',
      hideInSearch: true,
      order: 5,
    },
    {
      title: '服务行业',
      dataIndex: 'commoditys',
      valueType: 'textarea',
      // order: 4,
      renderText: (_: string, _record: any) => _record.product ?  _record.product.length : 0
    },
    {
      title: '企业规模',
      dataIndex: 'productName',
      valueType: 'textarea'
    },
    {
      title: '服务案例',
      dataIndex: 'sortNo',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '服务企业数量（家）',
      dataIndex: 'productName',
      valueType: 'textarea',
      hideInSearch: true,
      order: 5,
    },
    {
      title: '累计客户数量（人）',
      dataIndex: 'sortNo',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '入驻时间',
      dataIndex: 'time',
      valueType: 'dateRange',
      renderText: (_: string, _record: any) => _record?.startTime + '~' + _record?.endTime
    },
    {
      title: '已合作平台',
      dataIndex: 'time',
      hideInSearch: true,
      renderText: (_: string, _record: any) => _record?.startTime + '~' + _record?.endTime
    }
  ];

  const expandedRowRender = (record: any) => {
    const _columns: ProColumns<DataCommodity.Commodity>[] = [
      {
        title: '商品名称',
        dataIndex: 'productName',
        valueType: 'textarea',
      },
      {
        title: '商品适用端',
        dataIndex: 'productModel',
        valueType: 'textarea',
      },
      {
        title: '接入应用名称',
        dataIndex: 'purchasePricePart',
        valueType: 'textarea',
      },
      {
        title: '商品状态',
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
      }
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
    if (tableData[key]?.length) return;
    const loading = { ...loadingObj };
    loading[key] = true;
    setLoadingObj(loading);
    queryExpandedData(record, key);
  }

  const access = useAccess()

  return (
    <PageContainer>
      <ProTable
        headerTitle={
          <div>
            <p>{`活动列表（共${total}个）`}</p>
          </div>
        }
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
          <Access accessible={access['P_PM_HD']}>
            <Button type="primary" key="addActivity">
              导出
            </Button>
          </Access>
        ]}
        request={async (pagination) => {
          const result = await getActivityManageList({
            ...pagination,
          });
          setTotal(result.total);
          return result
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};
