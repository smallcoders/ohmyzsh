import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';

import { Button, message, Tooltip } from 'antd';
import { history } from 'umi';

import { routeName } from '../../../../../config/routes';

import SelfTable from '@/components/self_table';
import type Common from '@/types/common';

const sc = scopedClasses('service-config-digital-app-audit');

import type ApplicationManager from '@/types/service-config-digital-applictaion';

import { getApplicationList } from '@/services/digital-application';

export default () => {
  // 列表
  const [dataSource, setDataSource] = useState<ApplicationManager.Content[]>([]);

  // loading
  const [loading, setLoading] = useState<boolean>(false);

  // 分页信息
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  useEffect(() => {
    getPageList();
  }, []);

  // 审核失败列表
  async function getPageList(pageIndex: number = 1, pageSize = pageInfo.pageSize) {
    try {
      setLoading(true);
      const { result, totalCount, pageTotal, code } = await getApplicationList({
        pageIndex,
        pageSize,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  const columns = [
    {
      title: '应用',
      dataIndex: 'title',
      width: 500,
      render: (_: unknown, row: ApplicationManager.Content) => (
        <div className="table-app-row">
          <img src={row.logoImagePath} alt="图片损坏" />
          <div className="info">
            <Tooltip title={row.appName}>
              <span
                onClick={() => {
                  if (row.isDelete) return message.warning('该应用已不存在，无法查看详情');
                  history.push(`${routeName.DIGITAL_APPLICATION_DETAIL}?id=${row.id}`);
                }}
              >
                {row.appName}
              </span>
            </Tooltip>
            <Tooltip title={row.content} placement="right">
              <span>{row.content}</span>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: unknown, row: ApplicationManager.Content) => (
        <Button
          type="link"
          onClick={() => {
            if (row.isDelete) return message.warning('该应用已不存在，无法查看详情');
            history.push(`${routeName.DIGITAL_APPLICATION_DETAIL}?id=${row.id}`);
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div className={sc('container')}>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>应用列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getPageList,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
    </div>
  );
};
