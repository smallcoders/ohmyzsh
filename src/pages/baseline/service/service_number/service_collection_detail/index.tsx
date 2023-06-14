import React, { useState, useEffect } from 'react';
import { Button, Affix, Breadcrumb, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { Link, history } from 'umi';
import PhoneHeader from '@/assets/service/phone-header.png';
import './index.less';
import {
  httpCollectionDetail,
  httpCollectionListArticle,
  httpServiceAccountCollectionLog,
} from '@/services/service-management';
import { routeName } from '../../../../../../config/routes';
import SelfTable from '@/components/self_table';
import moment from 'moment';
import type Common from '@/types/common';

const sc = scopedClasses('service-collection-detail');

type RouterParams = {
  appId?: string;
  type?: string;
  state?: string;
  id?: string;
  name?: string;
};
// 状态
const stateColumn = {
  NOT_SUBMITTED: '暂存',
  ON_SHELF: '已发布',
  OFF_SHELF: '已下架',
  APPOINTMENT_ON_SHELF: '预约发布',
};

export default () => {
  // 根据路由获取参数
  const {
    type,
    state = 'tuwen',
    id,
    name = '',
    backid,
    backname,
    activeTab,
  } = history.location.query as RouterParams;

  // 操作日志
  const [logData, setLogData] = useState([]);

  // 获取的合集详情 - 文章列表
  const [detail, setDetail] = useState([
    {
      label: '合集名称：',
      value: '--',
    },
    {
      label: '合集类别：',
      value: '图文合集',
    },
    {
      label: '文章连续阅读状态：',
      value: '--',
    },
  ]);
  const _httpCollectionDetail = async () => {
    try {
      const res = await httpCollectionDetail({
        serviceAccountCollectionId: id,
      });
      if (res?.code === 0) {
        console.log('合集表单的详情', res?.result);
        const { name, continuousRead } = res?.result || {};
        const infoList = [
          {
            label: '合集名称：',
            value: name,
          },
          {
            label: '合集类别：',
            value: '图文合集',
          },
          {
            label: '文章连续阅读状态：',
            value: continuousRead ? '连续阅读' : '不连续阅读',
          },
        ];
        setDetail(infoList);
      } else {
        message.error(`合集详情获取失败, 原因：${res?.message}`);
      }
    } catch (error) {
      message.error(`合集详情获取失败: ${error}`);
    }
  };
  const [selectedRowList, setSelectedRowList] = useState<any[]>([]);
  const _httpCollectionListArticle = async () => {
    try {
      const res = await httpCollectionListArticle({
        serviceAccountCollectionId: id,
      });
      if (res?.code === 0) {
        console.log('查看详情', res?.result);
        setSelectedRowList(res?.result);
      } else {
        message.error(`合集详情-文章列表获取失败, 原因：${res?.message}`);
      }
    } catch (error) {
      message.error(`合集详情-文章列表获取失败: ${error}`);
    }
  };
  const _httpServiceAccountArticleLogList = async () => {
    if (!id) return;
    try {
      const res = await httpServiceAccountCollectionLog({
        serviceAccountCollectionId: id,
      });
      if (res?.code === 0) {
        console.log('操作日志', res?.result);
        const arr = res?.result?.map((item: any) => {
          return {
            img: '图片',
            name: item.name,
            typeName: item.content,
            time: item.createTime,
          };
        });
        // console.log('处理之后', arr)
        setLogData(arr);
      } else {
        throw new Error('');
      }
    } catch (error) {
      message.error(`获取操作日志失败: ${error}`);
    }
  };

  useEffect(() => {
    if (id) {
      Promise.all([
        _httpCollectionListArticle(),
        _httpCollectionDetail(),
        _httpServiceAccountArticleLogList(),
      ]);
    }
  }, []);

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      align: 'center',
      width: 35,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (_: any, record: any) => <div className={sc(`title`)}>{_ || '--'}</div>,
      width: 200,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      render: (_: string) => {
        // const newDate = new Date()
        return _ ? (
          <div style={{ color: moment(_).diff(new Date(), 'minute') > 0 ? 'orange' : 'black' }}>
            {moment(_).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ) : (
          '--'
        );
      },
      width: 130,
    },
    {
      title: '文章状态',
      dataIndex: 'state',
      render: (_: any) => {
        return (
          <div>{Object.prototype.hasOwnProperty.call(stateColumn, _) ? stateColumn[_] : '--'}</div>
        );
      },
      width: 130,
    },
  ].filter((p) => p);

  // 合集标签路径
  const collectionUrl = `/baseline/baseline-service-number/management?id=${backid}&name=${backname}&activeTabValue=${'合集标签'}`

  // 返回
  const handleGoBack = () => {
    history.push(collectionUrl)
  }

  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: '详情',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline/baseline-service-number">服务号管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link
                to={`/baseline/baseline-service-number/management?id=${backid}&name=${backname}&activeTabValue=${'合集标签'}`}
              >
                合集标签
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>详情</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        <Button onClick={handleGoBack.bind(null,null)}>返回</Button>
      ]}
    >
      <div className={sc('container-top')}>
        {detail?.map((item: any) => {
          return (
            <div className={sc('container-top-item')} key={item.label}>
              <div className={sc('container-top-item-left')}>{item.label}</div>
              <div className={sc('container-top-item-right')}>{item.value}</div>
            </div>
          );
        })}
        <div className={sc('container-top-collection')}>
          <div className={sc('container-top-collection-title')}>合集文章</div>
          <div className={sc('container-top-collection-table')}>
            <SelfTable
              size="small"
              bordered
              columns={columns}
              dataSource={selectedRowList}
              pagination={null}
            />
          </div>
        </div>
      </div>
      <div className={sc('container-bottom')}>
        <div className={sc('container-bottom-title')}>操作日志</div>
        <div className={sc('container-bottom-content')}>
          {logData?.map((item: any, index: any) => {
            return (
              <React.Fragment key={index}>
                <div className={sc('container-bottom-content-item')}>
                  {/* <img className={sc('container-bottom-content-item-img')} src="" alt="" /> */}
                  <div className={sc('container-bottom-content-item-name')}>{item.name}</div>
                  <div className={sc('container-bottom-content-item-type')}>{item.typeName}</div>
                  <div className={sc('container-bottom-content-item-time')}>{item.time}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};
