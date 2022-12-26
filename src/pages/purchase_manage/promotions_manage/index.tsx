import { getActivityManageList, changeActState } from '@/services/purchase';
import type DataCommodity from '@/types/data-commodity';
import type DataPromotions from '@/types/data-promotions';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Image, Popconfirm, message, Space } from 'antd';
import { useRef, useState } from 'react';
import { useHistory, Access, useAccess } from 'umi';

export default () => {
  const history = useHistory();

  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);

  const [pageIndex, setPageIndex] = useState<any>(1);

  // 更改活动状态
  const addOrUpdate = async (params: object) => {
    try {
      const removeRes = await changeActState({...params});
      if (removeRes.code === 0) {
        message.success(`操作成功`);
        if(actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(`操作失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ProColumns<DataPromotions.Promotions>[] = [
    {
      title: '序号',
      hideInSearch: true,
      render: (_: any, _record: any, index: number) =>
        10 * (pageIndex - 1) + index + 1,
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
      renderText: (_: string, _record: any) => _record.product ?  _record.product.length : 0
    },
    {
      title: '活动时间',
      dataIndex: 'time',
      hideInSearch: true,
      renderText: (_: string, _record: any) => _record?.startTime + '~' + _record?.endTime
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
        <Space>
          {record.actState === 0 && (// 未开始的可提前开始
            <Popconfirm
              title="确定提前开始么？"
              okText="提前开始"
              cancelText="取消"
              onConfirm={() => addOrUpdate({id: record.id, actState: 1})}
            >
              <a href="#">提前开始</a>
            </Popconfirm>
          )}
          {record.actState === 1 && (// 进行中的可提前结束
            <Access accessible={access['P_PM_HD']}>
              <Popconfirm
                title="确定提前结束么？"
                okText="提前结束"
                cancelText="取消"
                onConfirm={() => addOrUpdate({id: record.id, actState: 2})}
              >
                <a href="#">提前结束</a>
              </Popconfirm>
            </Access>
          )}

          {record.addedState == 0 && (
            <Access accessible={access['P_PM_HD']}>
              <Popconfirm
                title="确定下架么？"
                okText="下架"
                cancelText="取消"
                onConfirm={() => addOrUpdate({id: record.id, addedState: 1})}
              >
                <a href="#">下架</a>
              </Popconfirm>
            </Access>
          )}
          
          {(record.addedState != 0 && record.actState != 2) && ( // 上架及活动结束的都不能编辑
            <Button size="small" type="link" onClick={() => {
              history.push(`/purchase-manage/promotions-create?id=${record.id}`);
            }}>
              编辑
            </Button>
          )}

          <Button size="small" type="link" onClick={() => {
            window.open(`/purchase-manage/promotions-detail?id=${record.id}`);
          }}>
            详情
          </Button>
        </Space>
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
        dataIndex: 'salePricePart',
        valueType: 'textarea',
      },
      {
        title: '商品划线价',
        dataIndex: 'originPricePart'
      },
      {
        title: '销售状态',
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
        title: '权重',
        dataIndex: 'sortNo',
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
            <Button type="primary" key="addActivity" onClick={() => {
              history.push('/purchase-manage/promotions-create');
            }}>
              <PlusOutlined /> 新增活动
            </Button>,
          </Access>
        ]}
        request={async (pagination) => {
          const result = await getActivityManageList({
            ...pagination,
          });
          setPageIndex(pagination.current);
          setTotal(result.total);
          return result
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};
