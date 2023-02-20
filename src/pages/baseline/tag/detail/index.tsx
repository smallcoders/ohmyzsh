import { message, Image, Button, Table, Steps, Avatar, Tabs } from 'antd';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getDemandDetail } from '@/services/creative-demand';
import SelfTable from '@/components/self_table';
import { UserOutlined } from '@ant-design/icons';
import { getTagContentPage, getTagDetail, getTagUserPage } from '@/services/baseline';
import { routeName } from '../../../../../config/routes';
import Common from '@/types/common';

const sc = scopedClasses('science-technology-manage-creative-detail');

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>({});

  const prepare = async () => {
    const id = history.location.query?.id as string;
    if (id) {
      try {
        const res = await getTagDetail(id);
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
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  useEffect(() => {
    getPage(1, 10);
  }, [activeKey]);

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await (activeKey == 1 ? getTagUserPage({
        pageIndex,
        pageSize
      }) : getTagContentPage({
        pageIndex,
        pageSize,
      }));
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
      title: '注册时间',
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
  const contentColumns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 300,
    },
    {
      title: '浏览量',
      dataIndex: 'browseCount',
      width: 300,
    },
    {
      title: '资讯标签',
      dataIndex: 'labels',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              window.open(routeName.BASELINE_CONTENT_MANAGE_ADDORUPDATE);
            }}
          >
            内容详情
          </Button>
        )
      },
    },
  ];
  const [dataSource, setDataSource] = useState<any[]>([]);

  return (
    <PageContainer loading={loading}
      footer={[
        <Button onClick={() => history.push('/service-config/creative-need-manage')}>返回</Button>,
      ]}
    >
      <div className={sc('container')}>
        <div className={sc('container-desc')}>
          <span>标签名称：</span>
          <span>{detail?.name || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>来源：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>用途：</span>
          <span>{detail?.industryTypeNames ? detail?.industryTypeNames.join('，') : '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>标签权重：</span>
          <span>{detail?.typeName || '--'}</span>
        </div>
      </div>

      <Tabs activeKey={activeKey} onChange={(key: string) => setActiveKey(key)}>
        <Tabs.TabPane tab="关联用户" key="1">
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
        </Tabs.TabPane>
        <Tabs.TabPane tab="关联内容" key="2">
          <SelfTable
            loading={loading}
            bordered
            scroll={{ x: 1400 }}
            columns={contentColumns}
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
        </Tabs.TabPane>
      </Tabs>
    </PageContainer>
  );
};
