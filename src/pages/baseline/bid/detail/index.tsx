import { message, Button, Avatar } from 'antd';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import SelfTable from '@/components/self_table';
import { UserOutlined } from '@ant-design/icons';
import { getBidDetail } from '@/services/baseline';

const sc = scopedClasses('science-technology-manage-creative-detail');

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});

  const prepare = async () => {
    const id = history.location.query?.id as string;
    if (id) {
      try {
        const res = await getBidDetail({ id });
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
  const [activeKey, setActiveKey] = useState<any>(
    '1'
  );

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await getCreativePage({
        pageIndex,
        pageSize,
      });
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
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: '用户id',
      dataIndex: 'areaName',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '用户停留时间',
      dataIndex: 'areaName',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '用户标签',
      dataIndex: 'areaName',
      isEllipsis: true,
      width: 150,
    },
  ];
  const [dataSource, setDataSource] = useState<any[]>([]);

  return (
    <PageContainer loading={loading}
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
        <Button onClick={() => history.push('/service-config/creative-need-manage')}>返回</Button>,
      ]}
    >
      <div className='content'>
        {
          activeKey === '1' && <>
            <div className={sc('container')}>
              <div className={sc('container-title')}>内容详情</div>
              <div className={sc('container-desc')}>
                <span>公告标题：</span>
                <span>{detail?.title || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>公告类型：</span>
                <span>{detail?.subType || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>省份：</span>
                <span>{detail?.area || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>城市：</span>
                <span>{detail?.city || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>行业：</span>
                <span>{detail?.buyerClass || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>产业链：</span>
                <span>{detail?.startDate || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>发布时间：</span>
                <span>{detail?.publishTime || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>项目编号：</span>
                <span>{detail?.projectCode || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>项目名称：</span>
                <span>{detail?.projectName || '--'}</span>
              </div>

              <div className={sc('container-desc')}>
                <span>项目范围：</span>
                <span>{detail?.projectScope || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>开标时间：</span>
                <span>{detail?.bidOpenTime || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>预算金额（万元）：</span>
                <span>{detail?.budget && detail?.budget !== 0 ? detail?.budget / 10000 : '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>中标金额（万元）：</span>
                <span>{detail?.bidAmount && detail?.bidAmount !== 0 ? detail?.bidAmount / 10000 : '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>公告地址：</span>
                <span>{detail?.href || '--'}</span>
              </div>

              <div className={sc('container-title')}>采购单位信息</div>
              <div className={sc('container-desc')}>
                <span>采购单位名称：</span>
                <span>{detail?.buyer || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>采购单位联系人：</span>
                <span>{detail?.buyerPerson || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>采购单位联系电话：</span>
                <span>{detail?.buyerTel || '--'}</span>
              </div>
              <div className={sc('container-title')}>代理单位信息</div>
              <div className={sc('container-desc')}>
                <span>代理单位名称：</span>
                <span>{detail?.agency || '--'}</span>
              </div>
              <div className={sc('container-title')}>中标单位信息</div>
              <div className={sc('container-desc')}>
                <span>中标单位名称：</span>
                <span>{detail?.winner || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>中标单位联系人：</span>
                <span>{detail?.winnerPerson || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>中标单位联系电话：</span>
                <span>{detail?.companyPhone || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>中标单位电子邮箱：</span>
                <span>{detail?.companyEmail || '--'}</span>
              </div>
            </div>
            <div>
              <div className={sc('container-title')}>公告详情</div>
              <div>
                {detail?.details || '--'}
              </div>
            </div>
          </>
        }
        {
          activeKey === '2' && <>
            <div style={{ display: 'flex', gap: 50, fontWeight: 'bold', padding: 10 }}>
              <span style={{ fontSize: '20px' }}>
                详情浏览总次数
              </span>
              <span style={{ fontSize: '16px' }}>
                2123123
              </span>
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
        }
        {
          activeKey === '3' && <>
            {[1, 2, 3].map(p => {
              return <div style={{ display: 'flex', gap: 50, marginBottom: 20, alignItems: 'center' }}>
                <div>
                  <Avatar icon={<UserOutlined />} />
                  <span style={{ marginLeft: 10 }}>运营人员</span>
                </div>

                <span>上架</span>
                <span>2022-02-02 05:23</span>
              </div>
            })
            }
          </>
        }
      </div>
    </PageContainer>
  );
};
