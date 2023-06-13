import { message, Button, Avatar, Tooltip, Space, Modal } from 'antd';
import { Access, history, useAccess } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import SelfTable from '@/components/self_table';
import { UserOutlined } from '@ant-design/icons';
import { getArticleDetail, getArticleStatisticPage } from '@/services/baseline';
import type Common from '@/types/common';
import moment from 'moment';
import { routeName } from '../../../../../config/routes';

const hostMap = {
  'http://172.30.33.222:10086': 'http://172.30.33.222',
  'http://172.30.33.212:10086': 'http://172.30.33.212',
  'http://10.103.142.216': 'https://preprod.lingyangplat.com',
  'http://10.103.142.222': 'https://greenenv.lingyangplat.com',
  'http://manage.lingyangplat.com': 'https://www.lingyangplat.com',
  'https://manage.lingyangplat.com': 'https://www.lingyangplat.com',
  'http://localhost:8000': 'http://172.30.33.222',
};

const sc = scopedClasses('science-technology-manage-creative-detail');
const operaObj = {
  ADD: '新增',
  MODIFY: '修改',
  DOWN: '下架',
  UP: '上架',
  DELETE: '删除',
  TOPPING: '置顶',
  CANCEL_TOPPING: '取消置顶',
  AUDIT: '自动审核',
  STAGING: '暂存',
};
export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});
  const id = history.location.query?.id as string;
  const prepare = async () => {
    if (id) {
      try {
        const res = await getArticleDetail(id);
        if (res.code === 0) {
          setDetail(res?.result);
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
    getPage();
  }, []);
  const [activeKey, setActiveKey] = useState<any>('1');

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });
  const [total, setTotal] = useState<number>(0);

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await getArticleStatisticPage({
        pageIndex,
        pageSize,
        targetType: 'ARTICLE',
        articleId: id,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result?.statistics || []);
        setTotal(result?.totalBrowseCount || 0);
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
  const columns = [
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
      dataIndex: 'loginName',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '用户停留时间',
      dataIndex: 'browseDuration',
      isEllipsis: true,
      render: (_: number) => _ + 's',
      width: 150,
    },
    {
      title: '用户标签',
      dataIndex: 'labels',
      render: (_: any[]) => (_?.length > 0 ? _?.map((p) => p.labelName).join(',') : '--'),
      isEllipsis: true,
      width: 150,
    },
  ];
  const [dataSource, setDataSource] = useState<any[]>([]);
  const access = useAccess();
  const columns1 = [
    {
      title: '链接标题',
      dataIndex: 'title',
      render: (_: any[], record: any) => (
        <a
          href={`${hostMap[location.origin] || 'http://172.30.33.222'}/antelope-baseline${
            record.address
          }`}
          target="_blank"
          rel="noreferrer"
        >
          {record.title}
        </a>
      ),
      width: 300,
    },
    {
      title: '链接简介',
      dataIndex: 'introduction',
      isEllipsis: true,
      render: (_: any[]) => _ || '--',
      width: 300,
    },
  ].filter((p) => p);
  return (
    <PageContainer
      loading={loading}
      tabList={[
        {
          tab: '基础信息',
          key: '1',
        },
        {
          tab: '浏览信息',
          key: '2',
        },
        {
          tab: '操作日志',
          key: '3',
        },
      ]}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
      footer={[
        <Button onClick={() => history.push(routeName.BASELINE_CONTENT_MANAGE)}>返回</Button>,
        <Access
          accessible={
            access.P_BLM_NRGL &&
            (detail?.status == 2 || (!detail?.auditCommon && detail?.status == 0))
          }
        >
          <Button
            type="default"
            onClick={() => {
              window.open(routeName.BASELINE_CONTENT_MANAGE_ADDORUPDATE + `?id=${id}`);
            }}
          >
            编辑
          </Button>
        </Access>,
      ]}
    >
      <div className="content">
        {activeKey === '1' && (
          <>
            <div className={sc('container')}>
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
                <span>{detail?.keywords || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>内容类型：</span>
                <span>
                  {detail?.types?.length > 0
                    ? detail?.types?.map((p) => p.typeName)?.join('，')
                    : '--'}
                </span>
              </div>
              <div className={sc('container-desc')}>
                <span>标签：</span>
                <span>
                  {detail?.labels?.length > 0
                    ? detail?.labels?.map((p) => p.labelName)?.join('，')
                    : '--'}
                </span>
              </div>
              <div className={sc('container-desc')}>
                <span>来源：</span>
                <span>{detail?.source || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>发布时间：</span>
                <span>
                  {detail?.publishTime
                    ? moment(detail?.publishTime).format('YYYY-MM-DD HH:mm:ss')
                    : '--'}
                </span>
              </div>
              <div className={sc('container-desc')}>
                <span>内容详情：</span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: detail?.content || '--',
                  }}
                />
              </div>
              <div className={sc('container-desc')}>
                <span>内容原址：</span>
                <span>
                  {detail?.sourceUrl ? (
                    <a href={detail?.sourceUrl} target="_blank" rel="noreferrer">
                      {detail?.sourceUrl}
                    </a>
                  ) : (
                    '--'
                  )}
                </span>
              </div>
              {detail.status === 1 && detail.id && (
                <div className={sc('container-desc')}>
                  <span>平台内地址：</span>
                  <span>
                    <a
                      href={`${
                        hostMap[location.origin] || 'http://172.30.33.222'
                      }/antelope-baseline/industry-moments/#/detail?id=${detail.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {`${
                        hostMap[location.origin] || 'http://172.30.33.222'
                      }/antelope-baseline/industry-moments/#/detail?id=${detail.id}`}
                    </a>
                  </span>
                </div>
              )}
              {detail.links && detail.links.length > 0 && (
                <SelfTable
                  bordered
                  rowKey={'id'}
                  columns={columns1}
                  dataSource={detail.links}
                  pagination={null}
                />
              )}
            </div>
          </>
        )}
        {activeKey === '2' && (
          <>
            <div
              style={{
                display: 'flex',
                gap: 50,
                fontWeight: 'bold',
                padding: 10,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '20px' }}>详情浏览总次数</span>
              <span style={{ fontSize: '16px' }}>{total}</span>
            </div>
            <div style={{ padding: 10 }}>
              <span style={{ fontWeight: 'bold', fontSize: '20px' }}>用户浏览详情</span>
              <SelfTable
                loading={loading}
                bordered
                scroll={{ x: 1400 }}
                columns={columns}
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
          </>
        )}
        {activeKey === '3' && (
          <>
            {detail?.operationRecords?.map((p) => {
              return (
                <div style={{ display: 'flex', gap: 50, marginBottom: 20, alignItems: 'center' }}>
                  <div>
                    <Avatar icon={<UserOutlined />} />
                    <span style={{ marginLeft: 10 }}>{p?.userName}</span>
                  </div>

                  <div style={{ display: 'grid' }}>
                    <span style={{ color: p?.autoAuditResult ? 'red' : 'initial' }}>
                      {operaObj[p?.operation] || '--'}
                    </span>
                    {p?.autoAuditResult && (
                      <span style={{ color: 'red' }}>{p?.autoAuditResult}</span>
                    )}
                  </div>

                  <span>
                    {p?.createTime ? moment(p?.createTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </PageContainer>
  );
};
