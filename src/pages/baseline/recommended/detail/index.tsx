import { message, Image, Button, Table, Steps, Avatar, Tabs } from 'antd';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { detailRecommendForUserPage } from '@/services/baseline';
import SelfTable from '@/components/self_table';
import { getTagContentPage, getTagDetail, getTagUserPage } from '@/services/baseline';
import { routeName } from '../../../../../config/routes';
import Common from '@/types/common';

const sc = scopedClasses('science-technology-manage-creative-detail');

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});
  const [dataSource, setDataSource] = useState<any[]>([]);

  const prepare = async () => {
    const id = history.location.query?.id as string;
    if (id) {
      try {
        const res = await detailRecommendForUserPage(id);
        if (res.code === 0) {
          setDetail(res.result);
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        message.error('服务器错误');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    prepare();
  }, []);


  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });



  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await getTagUserPage({
        pageIndex,
        pageSize
      })
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
        setLoading(false);
      } else {
        message.error(`请求分页数据失败`);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPage(1, 10);
  }, []);

  const userColumns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      width: 300,
    },
    {
      title: '用户id',
      dataIndex: 'userId',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '用户停留时长',
      dataIndex: 'registrationTime',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '用户标签',
      dataIndex: 'labels',
      isEllipsis: true,
      width: 150,
    },
  ];



  return (
    <PageContainer loading={loading}
      footer={[
        <Button key="back" onClick={() => history.push('/service-config/creative-need-manage')}>返回</Button>,
      ]}
    >
      <div className={sc('container')}>
        <div className={sc('container-title')}>内容详情</div>
        <div className={sc('container-desc')}>
          <span>内容标题：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>作者：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>关键词：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>内容类型：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>标签：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>来源：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>发布时间：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>内容详情：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>网页原址：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-title')}>推荐阅读信息</div>
        <div className={sc('container-desc')}>
          <span>推荐范围：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>推荐阅读量：</span>
          <span>1024（总阅读量2022）</span>
        </div>
        <div className={sc('container-desc')}>
          <span>推荐转发量：</span>
          <span>12（总转发量20）</span>
        </div>
        <div className={sc('container-title')}>用户浏览详情</div>
        <SelfTable
            loading={loading}
            bordered
            scroll={{ x: 1400 }}
            columns={userColumns}
            dataSource={dataSource}
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
