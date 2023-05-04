import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import SelfTable from '@/components/self_table';
const sc = scopedClasses('content-stream-ad-statistical-detail');

const staNumArr = [
  {
    title: '浏览总次数',
    num: 0,
  },
  {
    title: '被关闭总次数',
    num: 0,
  },
  {
    title: '曝光总量',
    num: 0,
  },
];
const title = history.location.query?.title as string;
// 统计卡片
const StaCard = () => {
  return (
    <div className={sc('card')}>
      {staNumArr.map((item) => {
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

export default () => {
  const [loading, setLoading] = useState<any>(false);
  const [pageInfo, setPageInfo] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const [dataSource, setDataSource] = useState<any>([]);
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
      dataIndex: 'title',
      width: 150,
      render: (title: string) => {
        return title || '--';
      },
    },
    {
      title: '浏览次数',
      dataIndex: 'newUrl',
      isEllipsis: true,
      width: 250,
      sorter: (a: any, b: any) => a.newUrl - b.newUrl,
      render: (newUrl: string) => {
        return newUrl || '--';
      },
    },
    {
      title: '被关闭次数',
      dataIndex: 'currentUrl',
      isEllipsis: true,
      width: 250,
      sorter: (a: any, b: any) => a.currentUrl - b.currentUrl,
      render: () => {
        return <div>123</div>;
      },
    },
    {
      title: '曝光量',
      dataIndex: 'crawered',
      width: 150,
      sorter: (a: any, b: any) => a.crawered - b.crawered,
      render: () => {
        return <div>123</div>;
      },
    },
  ];
  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: `${title}版块上线广告统计详情`,
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
