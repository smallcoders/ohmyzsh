import {
  Button,
  message as antdMessage
} from 'antd';
import { Access, useAccess } from 'umi';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { DownloadOutlined, SoundOutlined } from '@ant-design/icons'
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import SelfTable from '@/components/self_table';
import { getDemandReportsTotalList, exportTotalTable } from '@/services/demand-reports';
const sc = scopedClasses('tab-menu-demand-report-summary');

export default () => {

  // 表格数据
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 是否在下载中
  const [downloading, setDownloading] = useState<boolean>(false);

  // 请求列表数据
  const getDataList = async () => {
    try {
      const { result, code, message } = await getDemandReportsTotalList()
      if (code === 0) {
        setDataSource(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  // 表头
  const columns = [
    {
      title: '序号',
      width: 100,
      render: (_: any, _record: any, index: number) => index + 1
    },
    {
      title: '需求地区',
      dataIndex: 'area',
    },
    {
      title: '需求数',
      dataIndex: 'xqs',
    },
    {
      title: '跟进次数',
      dataIndex: 'gjcs',
    },
    {
      title: '未对接',
      dataIndex: 'wdj',
    },
    {
      title: '新发布',
      dataIndex: 'xfb',
    },
    {
      title: '已认领',
      dataIndex: 'yrl',
    },
    {
      title: '对接中',
      dataIndex: 'djz',
    },
    {
      title: '已反馈',
      dataIndex: 'yfk',
    },
    {
      title: '已评价',
      dataIndex: 'ypj',
    },
    {
      title: '已结束',
      dataIndex: 'yjs',
    }
  ];

  useEffect(() => {
    getDataList()
  }, []);

  const access = useAccess()

  const exportList = async () => {
    if (downloading) {
      antdMessage.warning('正在导出数据，请勿频繁操作');
    }
    setDownloading(true)
    try {
      const res = await exportTotalTable();
      if (res?.data.size == 51) return antdMessage.warning('操作太过频繁，请稍后再试')
      const content = res?.data;
      const blob  = new Blob([content], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});
      const fileName = `供需对接总表-${moment().format('YYYYMMDD')}.xlsx`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    } finally {
      setDownloading(false)
    }
  };

  return (
    <>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>
            各地市需求对接情况
            <span className="sub"><SoundOutlined />以下关于各需求状态的统计，为截止目前处于各状态的数据量总和</span>
          </span>
          <Access accessible={access.PX_PM_TJ_HD}>
             <Button
              icon={<DownloadOutlined />}
              onClick={exportList}
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
