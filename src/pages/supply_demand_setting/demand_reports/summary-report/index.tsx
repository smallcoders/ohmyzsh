import {
  Button,
} from 'antd';
import { Access, useAccess } from 'umi';
import { useEffect, useState } from 'react';
import { DownloadOutlined, SoundOutlined } from '@ant-design/icons'
import type Common from '@/types/common';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import SelfTable from '@/components/self_table';
const sc = scopedClasses('tab-menu-demand-report-summary');

export default () => {

  const [dataSource, setDataSource] = useState<any[]>([]);

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  /**
   * 获取数据列表
   * @param pageIndex
   * @param pageSize
   */
  const getDataList = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      // 模拟走接口
      const totalCount = 1, pageTotal = 1
      const result: any = []
      setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
      setDataSource(result);
      // 这样走接口
      // const { result, totalCount, pageTotal, code } = await getActivityList({
      //   pageIndex,
      //   pageSize,
      //   ...searchContent,
      // });
      // if (code === 0) {
      //   setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
      //   setDataSource(result);
      // } else {
      //   message.error(`请求分页数据失败`);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 100,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '活动编码',
      dataIndex: 'actNo',
      width: 200
    },
    {
      title: '操作',
      width: 120,
      dataIndex: 'option',
      render: () => {
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            查看详情
          </a>
        );
      },
    },
  ];

  useEffect(() => {
    getDataList()
  }, []);

  const access = useAccess()

  return (
    <>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>
            各地市需求对接情况
            <span className="sub"><SoundOutlined />以下关于各需求状态的统计，为截止目前处于各状态的数据量总和</span>
          </span>
          <Access accessible={access['PX_PM_TJ_HD']}>
             <Button
              icon={<DownloadOutlined />}
              onClick={() => {
              }}
            >
              导出数据
            </Button>
          </Access>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey={'id'}
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </div>
    </>
  );
};
