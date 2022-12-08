import { getActivityManageList } from '@/services/diagnose-service';
import {
  Image
} from 'antd';
import type DataCommodity from '@/types/data-commodity';
import type DataPromotions from '@/types/data-promotions';
import './index.less';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useRef, useState } from 'react';
import icon1 from '@/assets/system/empty.png'

export default () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<DataPromotions.Promotions>[] = [
    {
      title: '服务包名称',
      dataIndex: 'name',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '服务时间',
      dataIndex: 'time',
      hideInSearch: true,
      renderText: (_: string, _record: any) => _record?.startTime + '~' + _record?.endTime,
    },
    {
      title: '服务商数量',
      dataIndex: 'providerNum',
      hideInSearch: true,
    },
    {
      title: '服务企业数',
      dataIndex: 'diagnoseEnterpriseNum',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '诊断报告上传数',
      dataIndex: 'diagnoseReportNum',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '诊断报告完成率',
      dataIndex: 'diagnoseFinishRate',
      valueType: 'textarea',
      hideInSearch: true,
    },
  ];

  const [loadingObj, setLoadingObj] = useState<any>({});

  const [tableData, setTableData] = useState<any>([]);

  const queryExpandedData = async (record: any, key: any) => {
    try {
      const table = {...tableData};
      const loading = {...loadingObj};
      const data:any = record.list || [];
      table[key] = data;
      loading[key] = false;
      setTableData(table);
      setLoadingObj(loading);
    } catch(err) {
      console.log(err);
    }
  };

  const onExpand = (expanded: any, record: any) => {
    const key = record?.packageNo;
    if (tableData[key]?.length) return;
    const loading = { ...loadingObj };
    loading[key] = true;
    setLoadingObj(loading);
    queryExpandedData(record, key);
  };
  const [showTable, setShowTable] = useState(true)
  const expandedRowRender = (record: any) => {
    const _columns: ProColumns<DataCommodity.Commodity>[] = [
      {
        title: '服务商名称',
        dataIndex: 'providerName',
        valueType: 'textarea',
      },
      {
        title: '服务企业数量',
        dataIndex: 'enterpriseNum',
        valueType: 'textarea',
      },
      {
        title: '诊断报告上传数',
        dataIndex: 'reportNum',
        valueType: 'textarea',
      },
      {
        title: '诊断完成率',
        dataIndex: 'finishRate',
      }
    ];
    return (
      <ProTable
        columns={_columns}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={tableData[record.packageNo]}
        pagination={false}
      />
    );
  };
  return (
    <div className='diagnose-service-report'>
      <h3 className='title'>诊断项目管理</h3>
      <div className='content-wrapper'>
        <h3>诊断服务报表</h3>
        {showTable && (
          <ProTable
            options={false}
            rowKey="packageNo"
            search={false}
            expandable={{
              onExpand,
              expandedRowRender,
            }}
            actionRef={actionRef}
            request={async (pagination) => {
              const result = await getActivityManageList({
                ...pagination
              });
              if(result && result.data && result.data.length > 0) {
                setShowTable(true)
              }else {
                setShowTable(false)
              }
              return result;
            }}
            columns={columns}
            pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
          />
        )}
        {!showTable && (
          <div className='empty-status'>
            <Image src={icon1} width={160}/>
            <p>点击右上角，添加诊断服务包</p>
          </div>
        )}
      </div>
      
    </div>
  );
};
