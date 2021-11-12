/**
 * 用于仅分页的table
 */
import { message, Table } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import Common from '@/types/common';
import SelfCard from '@/components/self-card';

export default <T,>(props: {
  title: string | ReactNode;
  // className?: string
  columns: any[];
  rowKey: string;
  onChange: (pageInfo: {
    pageIndex: number;
    pageSize: number;
  }) => Promise<Common.ResultCode & Common.ResultPage & { result: T[] }>;
  [x: string]: any;
}): any => {
  const {
    title,
    rowKey = 'id',
    // className = '',
    columns = [],
    onChange,
    ...rest
  } = props || {};

  const [dataSource, setDataSource] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
    pageTotal: 0,
  });

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await onChange({
        pageIndex,
        pageSize,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPage();
  }, []);

  return (
    <SelfCard title={title}>
      <Table
        size={'small'}
        scroll={{ y: 181 }}
        rowKey={rowKey}
        columns={columns}
        dataSource={dataSource as any[]}
        pagination={{
          size: 'small',
          pageSize: pageInfo.pageSize,
          showQuickJumper: true,
          showSizeChanger: false,
          total: pageInfo.totalCount,
          current: pageInfo.pageIndex,
          showTotal() {
            return `共 ${pageInfo.totalCount} 条     第 ${pageInfo.pageIndex}/${pageInfo.pageTotal} 页`;
          },
          onChange: getPage,
        }}
        loading={loading}
        {...rest}
      />
    </SelfCard>
  );
};
