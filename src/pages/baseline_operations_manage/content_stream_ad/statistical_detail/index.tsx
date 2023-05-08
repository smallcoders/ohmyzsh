import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import SelfTable from '@/components/self_table';
import { getAdvertiseList, getAdvertiseNumByType } from '@/services/baseline';
const sc = scopedClasses('content-stream-ad-statistical-detail');

const typeName = history.location.query?.typeName as string;
const articleTypeId = Number(history.location.query?.articleTypeId) as number;
// 统计卡片

export default () => {
  const [staNumArr, setStaNumArr] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [pageInfo, setPageInfo] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const [dataSource, setDataSource] = useState<any>([]);
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code, message } = await getAdvertiseList({
        pageIndex,
        articleTypeId: [articleTypeId],
        pageSize,
        advertiseType: 'CONTENT_STREAM_ADS',
      });
      setLoading(false);
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result?.list);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      setLoading(false);
      // antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  useEffect(() => {
    getAdvertiseNumByType(articleTypeId).then((res: any) => {
      if (res.code === 0 && res.result) {
        const newArray = [
          {
            title: '浏览总次数',
            num: res.result?.browsed || 0,
          },
          {
            title: '被关闭总次数',
            num: res.result?.closed || 0,
          },
          {
            title: '曝光量',
            num: res.result?.exposureCount || 0,
          },
        ];
        setStaNumArr(newArray);
      }
    });
    getPage();
  }, []);
  const StaCard = () => {
    return (
      <div className={sc('card')}>
        {staNumArr.map((item: any) => {
          return (
            <div className="wrap" key={item.title}>
              <div className="title">{item.title}</div>
              <div className="num">{item.num}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'advertiseName',
      width: 150,
      render: (title: string) => {
        return title || '--';
      },
    },
    {
      title: '浏览次数',
      dataIndex: 'browsedCount',
      isEllipsis: true,
      width: 250,
      sorter: (a: any, b: any) => a.browsedCount - b.browsedCount,
      render: (browsedCount: any) => {
        return browsedCount || 0;
      },
    },
    {
      title: '被关闭次数',
      dataIndex: 'closeCount',
      isEllipsis: true,
      width: 250,
      sorter: (a: any, b: any) => a.closeCount - b.closeCount,
      render: (closeCount: any) => {
        return closeCount || 0;
      },
    },
    {
      title: '曝光量',
      dataIndex: 'exposureCount',
      width: 150,
      sorter: (a: any, b: any) => a.exposureCount - b.exposureCount,
      render: (exposureCount: any) => {
        return exposureCount || 0;
      },
    },
  ];
  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: `${typeName}版块上线广告统计详情`,
      }}
    >
      <StaCard />
      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey="id"
          loading={loading}
          bordered
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1000 }}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getPage,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
    </PageContainer>
  );
};
