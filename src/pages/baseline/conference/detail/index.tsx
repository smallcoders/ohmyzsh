import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import SelfTable from "@/components/self_table";
import scopedClasses from '@/utils/scopedClasses';
import {Button, message as antdMessage,} from "antd";
import  {useEffect, useState} from "react";
import moment from 'moment';
import {history} from "@@/core/history";
import {exportData} from '@/services/page-creat-manage'
const sc = scopedClasses('conference-detail');
export default () => {
  const [activeKey, setActiveKey] = useState<any>(
    '1'
  );
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any>([]);
  const [detail, setDetail] = useState<any>({});
  const [pageInfo, setPageInfo] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
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
      dataIndex: 'topic',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '会议名称',
      dataIndex: 'topic',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '联系方式',
      dataIndex: 'contentCount',
      width: 120,
    },
    {
      title: '填报时间',
      dataIndex: 'weight',
      width: 80,
    },
    {
      title: '自定义值',
      dataIndex: 'weight',
      width: 80,
    },
  ];
  const currentTime = moment().format("YYYYMMDDHH:mm:ss");
  //方法
  const exportDataClick = () => {
    if (isExporting){
      return
    }
    setIsExporting(true)
    exportData({tmpId:11,}).then((res) => {
      setIsExporting(false)
      if (res?.data.size == 51) return antdMessage.warning('操作太过频繁，请稍后再试')
      const content = res?.data;
      const blob  = new Blob([content], {type: "application/vnd.ms-excel;charset=utf-8"});
      const fileName = `${detail?.name+'_'+currentTime}.xlsx`
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url;
      link.setAttribute('download', fileName)
      document.body.appendChild(link);
      link.click();
      return res
    }).catch(() => {
      setIsExporting(false)
    })
  }

  return (
    <PageContainer
    tabList={[
      {
        tab: '会议详情',
        key: '1',
      },
      {
        tab: '报名数据',
        key: '2',
      },
    ]}
    tabActiveKey={activeKey}
    onTabChange={(key: string) => setActiveKey(key)}
    footer={[
      <Button onClick={() => history.goBack()}>返回</Button>,
    ]}
    >
      {
          activeKey === '1' && <>
            <div className={sc('container')} >
              <div className={sc('container-desc')}>
                <span>页面标题：</span>
                <span>{detail?.title || '--'}</span>
               </div>
              <div className={sc('container-desc')}>
                <span>会议名称：</span>
                <span>{detail?.author || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>会议主题：</span>
                <span>{detail?.keywords || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>会议地点：</span>
                <span>{detail?.local || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>会议联系方式：</span>
                <span>{detail?.labels || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>会议时间：</span>
                <span>{detail?.source || '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>发布时间：</span>
                <span>{detail?.publishTime ? moment(detail?.publishTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>权重：</span>
                <span>{detail?.sourceUrl ? <a href={detail?.sourceUrl} target="_blank">{detail?.sourceUrl}</a> : '--'}</span>
              </div>
              <div className={sc('container-desc')}>
                <span>会议日程：</span>
                <div
                  dangerouslySetInnerHTML={{
                    __html: detail?.content || '--',
                  }}
                />
              </div>
          </div>
      </>}
      {
          activeKey === '2' && <>
        <div className={sc('container')} >
          <Button type="primary" onClick={exportDataClick}>
                导出
          </Button>
          <div className={sc('container-table')}>
          <SelfTable
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                showSizeChanger: true,
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
      </>}
    </PageContainer>
  );
};
