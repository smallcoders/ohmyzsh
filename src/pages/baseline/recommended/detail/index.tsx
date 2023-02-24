import { message, Button, Tag, Breadcrumb} from 'antd';
import { history, Link } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import moment from "moment/moment";
import { detailRecommendForUserPage, getArticleDetail, getUserDetailBrowse } from '@/services/baseline';
import SelfTable from '@/components/self_table';
import Common from '@/types/common';
import { routeName } from '@/../config/routes'
import { jsonTransform } from '@/utils/util'

const sc = scopedClasses('science-technology-manage-creative-detail');

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});
  const [dataSource, setDataSource] = useState<any[]>([]);

  const prepare = async () => {
    const id = history.location.query?.id as string;
    const industrialArticleId = history.location.query?.industrialArticleId as string
    if (id) {
      try {
        const [res1, res2] = await Promise.all([detailRecommendForUserPage({id}), getArticleDetail(industrialArticleId)]);
        if (res1.code === 0 && res2.code === 0) {
          setDetail(Object.assign(res1.result, res2.result));
        } else {
          throw new Error(res1.message);
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
    const id = history.location.query?.id as string;
    try {
      const { result, totalCount, pageTotal, code } = await getUserDetailBrowse({
        pageIndex,
        pageSize,
        id
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
      render: (_: any, _record: any, index: number) =>
      pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
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
      dataIndex: 'browseTime',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '用户标签',
      dataIndex: 'labelList',
      isEllipsis: true,
      width: 150,
      render: (_: any[]) => _?.length === 0 ? '/' :  _?.map((item: any) => <Tag key={item.id}>{item.labelName}</Tag>),
    },
  ];



  return (
    <PageContainer loading={loading}
    header={{
      breadcrumb: (
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={routeName.BASELINE}>基线管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={routeName.BASELINE_RECOMMENDED_MANAGE}>推荐位管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={routeName.BASELINE_RECOMMENDED_MANAGE_DETAIL}>详情</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      ),
    }}
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
          <span>{detail?.author || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>关键词：</span>
          <span>{jsonTransform(detail?.keywords)}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>内容类型：</span>
          <span>{detail?.types?.map((item: any) => item.typeName)?.join('、') || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>标签：</span>
          <span>{detail?.labels?.length > 0 ? detail?.labels?.map((item: any) => <Tag key={item.id}>{item.labelName}</Tag>) : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>来源：</span>
          <span>{detail?.source || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>发布时间：</span>
          <span>{detail?.publishTime? moment(detail?.publishTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>内容详情：</span>
          <span dangerouslySetInnerHTML={{__html: detail.content}}></span>
        </div>
        <div className={sc('container-desc')}>
          <span>网页原址：</span>
          <span>{detail?.sourceUrl || '--'}</span>
        </div>
        <div className={sc('container-title')}>推荐阅读信息</div>
        <div className={sc('container-desc')}>
          <span>推荐范围：</span>
          <span>{ detail?.labelList?.length > 0 ? detail?.labelList?.map((item: any) => <Tag key={item.id}>{item.labelName}</Tag>) : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>推荐阅读量：</span>
          <span>{ detail.browseCount || 0}（总阅读量{ detail.totalBrowseCount || 0 }）</span>
        </div>
        <div className={sc('container-desc')}>
          <span>推荐转发量：</span>
          <span>{ detail?.forWardCount || 0 }（总转发量{ detail.totalForWardCount || 0 }）</span>
        </div>
        <div className={sc('container-title')} style={{ marginBottom: '20px'}}>用户浏览详情</div>
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
