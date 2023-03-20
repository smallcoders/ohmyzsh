import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import SelfTable from '@/components/self_table';
import scopedClasses from '@/utils/scopedClasses';
import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import {
  detailMeetingForUserPage,
  exportMeetingData,
  queryMeetingPageList,
  queryEnrollTableHead,
} from '@/services/baseline';
import { history } from '@@/core/history';
const sc = scopedClasses('conference-detail');
export default () => {
  const [activeKey, setActiveKey] = useState<any>('1');
  const { meetingId } = history.location.query as any;
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [organizationSimples, setOrganizationSimples] = useState<any>([]);
  const [tableHeader, setTableHeader] = useState<any[]>([]);
  const [tableItems, setTableItems] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>({});
  const [pageInfo, setPageInfo] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const columnsCovert = [
    {
      title: '序号',
      dataIndex: 'index',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '企业名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 200,
      // render: (_: any, record: any) => {
      //   return <>{/*<div>{JSON.parse(record.name).name}</div>*/}</>;
      // },
    },
    {
      title: '关联企业库',
      dataIndex: 'related',
      isEllipsis: true,
      width: 200,
      render: (_: any, record: any) => {
        return (
          <>
            {record.related ? (
              <div style={{ color: '#0068ff' }}>关联成功</div>
            ) : (
              <div style={{ color: 'red' }}>关联失败</div>
            )}
          </>
        );
      },
    },
  ];
  const currentTime = moment(new Date()).format('YYYYMMDD');
  //方法
  //获取会议详情
  const getMeetingByMeetingId = () => {
    detailMeetingForUserPage({ meetingId }).then((res) => {
      if (res.code === 0) {
        setDetail(res?.result || {});
        res?.result?.organizationSimples?.forEach((item: any, index: any) => {
          item.index = index + 1;
        });
        console.log(res?.result?.organizationSimples);
        setOrganizationSimples(res?.result.organizationSimples);
      } else {
        throw new Error(res?.message);
      }
    });
  };
  //获取会议管理-报名列表-表头
  const getEnrollTableHead = () => {
    queryEnrollTableHead({ meetingId }).then((res) => {
      if (res.code === 0) {
        formatHeader(res?.result);
      } else {
        throw new Error(res?.message);
      }
    });
  };
  //获取会议管理-报名列表
  const getMeetingList = (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    queryMeetingPageList({ meetingId, pageIndex, pageSize }).then((res) => {
      if (res.code === 0) {
        setTableItems(res.result);
        setPageInfo({ totalCount: res.totalCount, pageTotal: res.pageTotal, pageIndex, pageSize });
      } else {
        throw new Error(res.message);
      }
    });
  };
  useEffect(() => {
    getEnrollTableHead();
    getMeetingByMeetingId();
    getMeetingList();
  }, []);
  // 表头处理
  function formatHeader(tableHeaders: any[]) {
    // 插入序号, 合并序号列的单元格
    tableHeaders.splice(0, 0, {
      title: '序号',
      dataIndex: 'sort',
      fixed: 'left',
      width: 65,
      render: (_: any, _record: any, index: number) => Math.floor(index / 3) + 1,
    });
    // 动态表头处理
    for (let i = 1, l = tableHeaders.length; i < l; i++) {
      const item = tableHeaders[i];
      item.title = item.name;
      item.dataIndex = item.id;
    }
    setTableHeader(tableHeaders);
  }
  //导出
  const exportDataClick = () => {
    if (isExporting) {
      return;
    }
    setIsExporting(true);
    exportMeetingData({ meetingId })
      .then((res) => {
        if (res?.data?.size == 51) return message.warning('操作太过频繁，请稍后再试');
        setIsExporting(false);
        const content = res.data;
        const blob = new Blob([content], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        });
        const fileName = `${detail?.name + '_' + currentTime}.xlsx`;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        console.log(url);
        console.log(blob);
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        return res;
      })
      .catch(() => {
        setIsExporting(false);
      });
  };

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
      footer={[<Button onClick={() => history.goBack()}>返回</Button>]}
    >
      {activeKey === '1' && (
        <>
          <div className={sc('container')}>
            <div className={sc('container-title')}>会议基础信息</div>
            <div className={sc('container-desc')}>
              <span>页面标题：</span>
              <span>{detail?.title || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span>会议名称：</span>
              <span>{detail?.name || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span>会议主题：</span>
              <span>{detail?.theme || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span>会议地点：</span>
              <span>{detail?.place || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span>主办方：</span>
              <span>{detail?.sponsor || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span>承办方：</span>
              <span>{detail?.organizer || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span>协办方：</span>
              <span>{detail?.coOrganizer || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span>会议联系方式：</span>
              <span>{detail?.contact || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span>会议时间：</span>
              <span>
                {detail?.startTime ? detail?.startTime + ' ~' : '--'} {detail?.endTime}
              </span>
            </div>
            <div className={sc('container-desc')}>
              <span>权重：</span>
              <span>{detail?.weight || '--'}</span>
            </div>
            <div className={sc('container-desc')}>
              <span>会议日程：</span>
              <div
                style={{ width: '400px', overflow: 'hidden' }}
                dangerouslySetInnerHTML={{
                  __html: detail?.agenda || '--',
                }}
              />
            </div>
          </div>
          <div className={sc('container')}>
            <div className={sc('container-title')}>嘉宾信息</div>
            {detail?.guests?.map((e: any) => {
              return (
                <>
                  <div className={sc('container-desc')}>
                    <span>嘉宾姓名：</span>
                    <span>{e?.name || '--'}</span>
                  </div>
                  <div className={sc('container-desc')}>
                    <span>嘉宾介绍：</span>
                    <span>{e?.introduction || '--'}</span>
                  </div>
                </>
              );
            })}
          </div>
          <div className={sc('container')}>
            <div className={sc('container-title')}>参会单位</div>
            <SelfTable
              bordered
              scroll={{ y: 600 }}
              columns={columnsCovert}
              dataSource={organizationSimples}
              pagination={null}
            />
          </div>
          <div className={sc('container')}>
            <div className={sc('container-title')}>会议资料</div>
            <div className={sc('container-desc')}>
              <span>可见权限：</span>
              <span>{detail.materialOpen ? '所有人可见' : '仅参会企业可见'}</span>
            </div>
            {detail?.materials?.map((e: any) => {
              return (
                <>
                  <div className={sc('container-desc')}>
                    <span>材料名称：</span>
                    <span>{e?.name || '--'}</span>
                  </div>
                  <div className={sc('container-desc')}>
                    <span>材料内容：</span>
                    <div>
                      {!e?.fileIds && <span>--</span>}
                      {e?.fileIds?.map((id: any) => {
                        return (
                          <img
                            style={{ width: 200, height: 200 }}
                            src={`/antelope-common/common/file/download/${id}`}
                            alt="图片损坏"
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className={sc('container-desc')}>
                    <span>来源企业：</span>
                    <span>{e?.organizationName || '--'}</span>
                  </div>
                </>
              );
            })}
          </div>
        </>
      )}
      {activeKey === '2' && (
        <>
          <div className={sc('container')}>
            <Button type="primary" onClick={exportDataClick}>
              导出
            </Button>
            <div className={sc('container-table')}>
              <SelfTable
                scroll={{ x: 1480 }}
                bordered
                columns={tableHeader}
                dataSource={tableItems}
                pagination={
                  pageInfo.totalCount === 0
                    ? false
                    : {
                        onChange: getMeetingList,
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
        </>
      )}
    </PageContainer>
  );
};
