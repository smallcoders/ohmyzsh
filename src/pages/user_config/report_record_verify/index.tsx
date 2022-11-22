import { useState, useEffect } from 'react';
import { Form, Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import Common from '@/types/common.d';
import moment from 'moment';
import { history, useModel, Access, useAccess } from 'umi';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import SearchBar from '@/components/search_bar';
import { getReportPage } from '@/services/report-record-verify';
import './index.less';

import ReportRecordVerify from '@/types/enterprise-admin-verify';
const sc = scopedClasses('report-record-audit');
enum Edge {
  HOME = 0,
}

export interface SearchInfo {
  reportType: string | null;
  reportLoginName: string;
  startCreateTime: string;
  endCreateTime: string;
  reportPhone: string;
  processed: boolean | null;
}

const stateObj = {
  true: '已处理',
  false: '未处理',
};

const module = {
  DEMAND: '企业需求',
  CREATIVE_ACHIEVEMENT: '科技成果',
  CREATIVE_DEMAND: '创新需求',
  SOLUTION: '解决方案',
  DEMAND_COMMENT: '需求留言',
  EXPERT_COMMENT: '专家留言'
}

const reportTypeText = {
  FALSE_INFORMATION: '不实信息',
  JUNK_ADVERTISING: '垃圾广告',
  INSULTS_ATTACKS: '辱骂、人身攻击等不友善行为',
  HARMFUL_INFORMATION: '有害信息',
  SUSPECTED_INFRINGEMENT: '涉嫌侵权',
  HARASS: '骚扰',
  CYBER_VIOLENCE: '网络暴力',
  OTHER: '其他',
};

const reportTypeValue = [
  {
    id: 'FALSE_INFORMATION',
    name: '不实信息',
  },
  {
    id: 'JUNK_ADVERTISING',
    name: '垃圾广告',
  },
  {
    id: 'INSULTS_ATTACKS',
    name: '辱骂、人身攻击等不友善行为',
  },
  {
    id: 'HARMFUL_INFORMATION',
    name: '有害信息',
  },
  {
    id: 'SUSPECTED_INFRINGEMENT',
    name: '涉嫌侵权',
  },
  {
    id: 'HARASS',
    name: '骚扰',
  },
  {
    id: 'CYBER_VIOLENCE',
    name: '网络暴力',
  },
  {
    id: 'OTHER',
    name: '其他',
  },
];

const processedValue = [
  {
    id: true,
    name: '已处理',
  },
  {
    id: false,
    name: '未处理',
  },
];

export default () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const { pageInfo, setPageInfo, searchInfo, setSearchInfo, resetModel } =
    useModel('useLeaveWordVerify');

  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_UM_JBJL', // 用户管理-举报记录
  }

  useEffect(() => {
    for (const key in permissions) {
      const permission = permissions[key]
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        setEdge(key as any)
        break
      }
    }
  },[])

  useEffect(() => {
    // 初始化searchInfo
    form?.setFieldsValue({ ...searchInfo });
    // 获取分页数据
    getReportRecordVerifyPage({ ...searchInfo }, pageInfo?.pageSize, pageInfo?.pageIndex);
    //
    console.log('@history', history);
  }, []);

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: ReportRecordVerify.Content, index: number) =>
        pageInfo?.pageSize * (pageInfo?.pageIndex - 1) + index + 1,
    },
    {
      title: '举报类型',
      dataIndex: 'reportType',
      isEllipsis: true,
      width: 300,
      render: (_: string) =>
        Object.prototype.hasOwnProperty.call(reportTypeText, _) ? reportTypeText[_] : '--',
    },
    {
      title: '举报详细描述',
      dataIndex: 'content',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '举报所属模块',
      dataIndex: 'module',
      isEllipsis: true,
      width: 300,
      render: (_: string) =>
        Object.prototype.hasOwnProperty.call(module, _) ? module[_] : '--',
    },
    {
      title: '举报人',
      dataIndex: 'reportLoginName', 
      isEllipsis: true,
      width: 300,
    },
    {
      title: '联系方式',
      dataIndex: 'reportPhone', 
      isEllipsis: true,
      width: 300,
    },
    {
      title: '举报时间',
      dataIndex: 'createTime', 
      isEllipsis: true,
      width: 300,
    },
    {
      title: '审核状态',
      dataIndex: 'processed', 
      width: 150,
      render: (_: string) =>
        Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
      render: (_: any, _record: ReportRecordVerify.Content) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return _record?.processed ? (
          <div>
            <Button
              type="link"
              onClick={() => {
                history.push(`${routeName.REPORT_RECORD_VERIFY_DETAIL}?id=${_record.id }&type=${_record.module}&bizId=${_record?.bizId}`);
              }}
            >
              {'详情'}
            </Button>
          </div>
        ) : (
          <div>
            <Access accessible={accessible}>
              <Button
                type="link"
                onClick={() => {
                  window.open(`${routeName.REPORT_RECORD_VERIFY_DETAIL}?id=${_record.id }&type=${_record.module}&bizId=${_record?.bizId}`);
                }}
              >
                {'处理'}
              </Button>
            </Access>
          </div>
        );
      },
    },
  ];

  const getReportRecordVerifyPage = async (
    searchInfo: SearchInfo,
    pageSize = 10,
    pageIndex = 1,
  ) => {
    try {
      setLoading(true);
      const { result, code, totalCount, pageTotal } = await getReportPage({
        ...searchInfo,
        pageIndex,
        pageSize,
      });
      if (code === 0) {
        setPageInfo({ ...pageInfo, totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const searchList = [
    {
      key: 'reportType',
      label: '举报类型',
      type: Common.SearchItemControlEnum.SELECT,
      options: reportTypeValue,
      allowClear: true,
    },
    {
      key: 'reportLoginName',
      label: '举报人',
      type: Common.SearchItemControlEnum.INPUT,
      initialValue: '',
      allowClear: true,
    },
    {
      key: 'time',
      label: '举报时间',
      type: Common.SearchItemControlEnum.RANGE_PICKER,
      allowClear: true,
    },
    {
      key: 'reportPhone',
      label: '联系电话',
      type: Common.SearchItemControlEnum.INPUT,
      initialValue: '',
      allowClear: true,
    },
    {
      key: 'processed',
      label: '处理状态',
      type: Common.SearchItemControlEnum.SELECT,
      options: processedValue,
      allowClear: true,
    },
  ];

  const onSearch = (info: any) => {
    console.log('onSearch', info);
    const { processed, reportLoginName, reportPhone, reportType } = info || {};
    setPageInfo({ ...pageInfo, pageIndex: 1 });
    setSearchInfo({ processed, reportLoginName, reportPhone, reportType });
    getReportRecordVerifyPage(
      {
        processed,
        reportLoginName,
        reportPhone,
        reportType,
        startCreateTime: info.time ? moment(info.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        endCreateTime: info.time ? moment(info.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      },
      pageInfo?.pageSize,
    );
  };

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('search-container')}>
        <SearchBar form={form} searchList={searchList} onSearch={onSearch} showTime />
      </div>
      <div className={sc('table-container')}>
        <SelfTable
          rowKey="id"
          bordered
          scroll={{ x: 1200 }}
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={{
            total: pageInfo?.totalCount,
            current: pageInfo?.pageIndex,
            pageSize: pageInfo?.pageSize,
            showTotal: (total: number) => (
              <div className="pagination-text">{`共${total}条记录 第${pageInfo?.pageIndex}/${
                pageInfo?.pageTotal || 1
              }页`}</div>
            ),
          }}
          onChange={(pagination: any) => {
            // ⭐ 也需要处理
            getReportRecordVerifyPage({ ...searchInfo }, pagination.pageSize, pagination.current);
          }}
        />
      </div>
    </PageContainer>
  );
};
