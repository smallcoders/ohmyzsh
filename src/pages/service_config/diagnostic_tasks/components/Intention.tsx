import { message } from 'antd';
import '../service-config-diagnostic-tasks.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import {
  getIntentionList,
  getXTYSkipUrl,
} from '@/services/diagnostic-tasks';
import SelfTable from '@/components/self_table';
import type DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
const sc = scopedClasses('service-config-diagnostic-tasks');
export default () => {
  const [dataSource, setDataSource] = useState<DiagnosticTasks.OnlineRecord[]>([]);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  /**
   * 获取意向报名
   * @param pageIndex
   * @param pageSize
   */
  const getDiagnosticTasks = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getIntentionList({
        pageIndex,
        pageSize
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const open = async (id: string) => {
    try {
      const { result } = await getXTYSkipUrl(id);
      window.open(result);
    } catch (error) {
      message.error('服务器报错');
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 100,
      render: (_: any, _record: DiagnosticTasks.OnlineRecord, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '企业名称',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      ellipsis: true,
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      width: 200,
    }
  ];

  useEffect(() => {
    getDiagnosticTasks();
  }, []);

  return (
    <>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>意向报名记录(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey={'id'}
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getDiagnosticTasks,
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
  );
};
