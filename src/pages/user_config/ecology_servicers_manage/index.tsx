import type EcologyProviders from '@/types/ecology-providers'
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message as antdMessage } from 'antd';
import { useRef, useState } from 'react';
import { Access, useAccess } from 'umi';
import {
  getEnterpriseSizeList,
  getIndustryList,
  getEcoProviderPage
} from '@/services/commissioner-service'
import './index.less';
const appTypeObj = {
  0: '移动端',
  1: 'Web端',
  3: 'Web端、移动端'
};
export default () => {
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const [industryList, setIndustryList] = useState<any>([]);

  const getServiceList = async () => {
    try {
      const res = await getEnterpriseSizeList()
      if (res?.code === 0) {
        const list = res?.result?.map((item: any) => {
          return {
            label: item?.desc,
            value: item?.code,
          }
        })
        return list
      } else {
        throw new Error("");
      }
    } catch (error) {
      antdMessage.error('获取企业规模失败，请重试')
    }
  }

  const getIndustry = async () => {
    try {
      const res = await getIndustryList()
      if (res?.code === 0) {
        const list = res?.result?.map((item: any) => {
          return {
            label: item?.desc,
            value: item?.code,
          }
        })
        setIndustryList(list)
        return list
      } else {
        throw new Error("");
      }
    } catch (error) {
      antdMessage.error('获取服务行业失败，请重试')
    }
  }

  const handleIndustry = (industry: string) => {
    const arr = industryList.filter(item => industry.indexOf(item.value.toString()) > -1)
    return arr.map(item => item.label).join(',')
  }

  const columns: ProColumns<EcologyProviders.ProductInfo>[] = [
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      valueType: 'textarea',
    },
    {
      title: '管理员名称',
      dataIndex: 'adminName',
      valueType: 'textarea',
      hideInSearch: true
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      valueType: 'textarea',
      hideInTable: true
    },
    {
      title: '管理员电话',
      dataIndex: 'adminPhone',
      valueType: 'textarea',
      hideInSearch: true,
      order: 5,
    },
    {
      title: '服务行业',
      dataIndex: 'industryType',
      valueType: 'select',
      request: async () => getIndustry(),
      hideInTable: true
    },
    {
      title: '服务行业',
      dataIndex: 'serviceIndustry',
      valueType: 'textarea',
      renderText: (text: any, record: any) => record.serviceIndustry && handleIndustry(record.serviceIndustry) || '-',
      hideInSearch: true
    },
    {
      title: '企业规模',
      dataIndex: 'enterpriseSize',
      valueType: 'select',
      width: 120,
      request: async () => getServiceList()
    },
    {
      title: '服务案例',
      dataIndex: 'caseName',
      valueType: 'textarea',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '服务企业数量（家）',
      dataIndex: 'serviceCompaniesNumber',
      valueType: 'textarea',
      hideInSearch: true,
      order: 5,
    },
    {
      title: '累计客户数量（人）',
      dataIndex: 'customerCount',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '入驻时间',
      dataIndex: 'createTime',
      valueType: 'textarea',
      hideInSearch: true
    },
    {
      title: '入驻时间',
      dataIndex: 'time',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: '已合作平台',
      dataIndex: 'partneredPlatforms',
      hideInSearch: true
    }
  ];

  const expandedRowRender = (record: any) => {
    const _columns: ProColumns<EcologyProviders.SpecInfo>[] = [
      {
        title: '商品名称',
        dataIndex: 'productName',
        valueType: 'textarea',
      },
      {
        title: '商品适用端',
        dataIndex: 'appType',
        valueType: 'textarea',
        renderText: (_, record) => _ !== null && appTypeObj[_]
      },
      {
        title: '接入应用名称',
        dataIndex: 'appName',
        valueType: 'textarea',
      },
      {
        title: '商品状态',
        dataIndex: 'saleStatus',
        valueType: 'select',
        valueEnum: {
          0: {
            text: '未发布',
          },
          1: {
            text: '发布中',
          }
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
      const data:any = record.products || [];
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
        className="ecology-provider-info"
        headerTitle={
          <div>
            <p>{`生态服务商列表（共${total}家）`}</p>
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
          defaultCollapsed: false, // 默认是否收起
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
          const result = await getEcoProviderPage({
            ...pagination
          });
          setTotal(result.total || 0);
          return result
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};
