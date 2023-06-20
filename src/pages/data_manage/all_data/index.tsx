import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useRef, useState } from 'react';
import { Button, message as antdMessage } from 'antd';
import SelfTable from '@/components/self_table';
import { getListAllOverviewData } from '@/services/data-manage';
import EditDataModal from './components/editDataModal';
import { useAccess, Access } from '@@/plugin-access/access';
const sc = scopedClasses('all-data');

export default () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // 拿到当前角色的access权限兑现
  const access: any = useAccess();
  const editDataModalRef = useRef<any>(null);

  const columns = [
    {
      title: '数据名称',
      dataIndex: 'name',
      width: 150,
      render: (name: string) => {
        return <span>{name || '--'}</span>;
      },
    },
    {
      title: '当前累计数据',
      dataIndex: 'total',
      width: 150,
      render: (total: number, record: any) => {
        return (
          <span>
            {record.configKey === 'SERVICE_COUNT' || record.configKey === 'ORDER_COUNT'
              ? `${total}万`
              : record.configKey === 'TRADE_AMOUNT'
              ? `${total}亿`
              : total}
          </span>
        );
      },
    },
    {
      title: '近12个月数据',
      dataIndex: 'withDetailData',
      width: 150,
      render: (withDetailData: boolean, record: any) => {
        return withDetailData
          ? record?.monthDataList.map((item: any, index: number) => (
              <span key={index}>
                {record.configKey === 'TRADE_AMOUNT'
                  ? `${item.month}: ${item.data || 0}亿`
                  : record.configKey === 'SERVICE_COUNT' || record.configKey === 'ORDER_COUNT'
                  ? `${item.month}: ${item.data || 0}万`
                  : `${item.month}: ${item.data || 0}`}
                &nbsp;&nbsp;&nbsp;
              </span>
            ))
          : '--';
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 100,
      render: (_: any, record: any) => {
        return (
          <>
            <Access accessible={access.P_BSDM_ZLSJ}>
              <Button
                size="small"
                type="link"
                onClick={() => {
                  console.log(record);
                  editDataModalRef.current.openModal(record);
                }}
              >
                编辑
              </Button>
            </Access>
          </>
        );
      },
    },
  ];

  const getPage = async () => {
    setLoading(true);
    try {
      const { result, code, message } = await getListAllOverviewData();
      setLoading(false);
      if (code === 0) {
        setDataSource(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      setLoading(false);
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  useEffect(() => {
    getPage();
  }, []);

  return (
    <PageContainer className={sc('container')}>
      <div className="main-content">
        <div className="top-area">
          <div className="left-title">总览数据</div>
        </div>
        <SelfTable
          bordered
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          key="configKey"
          pagination={false}
        />
      </div>
      <EditDataModal
        successCallBack={() => {
          getPage();
        }}
        ref={editDataModalRef}
      />
    </PageContainer>
  );
};
