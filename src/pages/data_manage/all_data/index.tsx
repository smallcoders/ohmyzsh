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
      render: (total: number) => {
        return <span>{total || '--'}</span>;
      },
    },
    {
      title: '近12个月数据',
      dataIndex: 'withDetailData',
      width: 150,
      render: (withDetailData: string) => {
        return <span>{withDetailData || '--'}</span>;
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 100,
      render: (_: any, record: any) => {
        return (
          <>
            <Access accessible={access.PU_SJ_DR}>
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
    getPage()
  }, [])

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
