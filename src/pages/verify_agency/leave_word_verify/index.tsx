import { useState, useEffect } from 'react';
import { Form, Button, message, Modal, Image } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import Common from '@/types/common.d';
import { routeName } from '@/../config/routes';
import { history, useModel, Access, useAccess } from 'umi';
import SelfTable from '@/components/self_table';
import SearchBar from '@/components/search_bar';
import moment from 'moment';
import { getCommentPage } from '@/services/leave-word-verify'

import './index.less'
import LeaveWordVerify from '@/types/leave-word-verify';
const sc = scopedClasses('leave-word-audit');

const stateObj = {
  AUDITING: '待审核',
  AUDIT_SUCCESS: '已通过',
  AUDIT_FAIL: '已拒绝',
};
const module = {
  DEMAND: '企业需求',
  EXPERT : '专家资源',
  CREATIVE_DEMAND: '创新需求',
}
const statusTypeValue = [
  {
    id: 'AUDITING',
    name: '审核中',
  },
  {
    id: 'AUDIT_SUCCESS',
    name: '已发布',
  },
  {
    id: 'AUDIT_FAIL',
    name: '审核退回',
  },
]
const tabTypeValue = [
  {
    id: 'DEMAND',
    name: '企业需求',
  },
  {
    id: 'EXPERT',
    name: '专家资源留言',
  },
  {
    id: 'CREATIVE_DEMAND',
    name: '创新需求',
  },
]

export interface SearchInfo {
  name: string;
  content: string;
  startDateTime: string;
  endDateTime: string;
  tabEnum: string | null;
  status: boolean | null;
}

enum Edge {
  HOME = 0, // 新闻咨询首页
}

export default () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<LeaveWordVerify.Content[]>([]);
  const { pageInfo, setPageInfo, searchInfo, setSearchInfo, resetModel } = useModel(
    'useReportRecordVerify',
  );
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_AT_LY', // 留言审核-页面查询
  }


  useEffect(()=>{
    // 初始化searchInfo
    form?.setFieldsValue({ ...searchInfo })
    // 获取分页数据
    getLeaveWordVerifyPage({...searchInfo}, pageInfo?.pageSize, pageInfo?.pageIndex)
    // 获取页面权限
    for (const key in permissions) {
      const permission = permissions[key]
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        setEdge(key as any)
        break
      }
    }
    const unlisten = history.listen((location) => {
      if (!location.pathname.includes('/verify-agency/leave_word_verify')) {
        resetModel?.()
        unlisten()
      }
    })
  },[])

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: LeaveWordVerify.Content, index: number) =>
        pageInfo?.pageSize * (pageInfo?.pageIndex - 1) + index + 1,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '留言内容',
      dataIndex: 'content',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '留言时间',
      dataIndex: 'createTime',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '所属板块',
      dataIndex: 'tab',
      isEllipsis: true,
      width: 300,
      render: (_: string) =>
        Object.prototype.hasOwnProperty.call(module, _) ? module[_] : '--',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      width: 150,
      render: (_: string) => 
      Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
      render: (_: any, _record: LeaveWordVerify.Content) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return _record?.status === 'AUDITING' ? (
          <Access accessible={accessible}>
            <Button 
              type="link"
              onClick={() => {
                history.push(`${routeName.LEAVE_WORD_VERIFY_DETAIL}?auditId=${_record.auditId}&commentId=${_record.commentId}&tab=${_record.tab}&detailId=${_record.detailId}`);
              }}
            >
              {'审核'} 
            </Button>
          </Access>
        ) : (
          <Button 
            type="link"
            onClick={() => {
              window.open(`${routeName.LEAVE_WORD_VERIFY_DETAIL}?auditId=${_record.auditId}&commentId=${_record.commentId}&tab=${_record.tab}&detailId=${_record.detailId}`);
            }}
          >
            {'详情'} 
          </Button>
        )
      }
    }
  ].filter(p => p); // 过滤处理, 如果你给整个操作添加了 access['P_LM_JBLX'] && { title: '操作' } 可以过滤跳当前table列

  const getLeaveWordVerifyPage = async ( searchInfo: SearchInfo, pageSize = 10, pageIndex = 1) => {
    try {
      setLoading(true)
      const { result, code, totalCount, pageTotal } = await getCommentPage({
        ...searchInfo,
        pageIndex,
        pageSize,
      })
      if (code === 0) {
        setPageInfo({ ...pageInfo, totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  const searchList = [
    {
      key: 'name', 
      label: '用户名',
      type: Common.SearchItemControlEnum.INPUT,
      initialValue: '',
      allowClear: true,
    },
    {
      key: 'content', 
      label: '留言内容',
      type: Common.SearchItemControlEnum.INPUT,
      initialValue: '',
      allowClear: true,
    },
    {
      key: 'createTime', 
      label: '留言时间',
      type: Common.SearchItemControlEnum.RANGE_PICKER,
      allowClear: true,
    },
    {
      key: 'status', 
      label: '审核状态',
      type: Common.SearchItemControlEnum.SELECT,
      options: statusTypeValue,
      allowClear: true,
    },
    {
      key: 'tab', 
      label: '所属板块',
      type: Common.SearchItemControlEnum.SELECT,
      options: tabTypeValue,
      allowClear: true,
      initialValue: 'DEMAND'
    },
  ];

  const onSearch = (info: any) => {
    const { name, content, createTime, tab, status } = info || {};
    setPageInfo({ ...pageInfo, pageIndex: 1 });
    setSearchInfo({name, content, createTime, tab, status});
    getLeaveWordVerifyPage(
      {
        name,
        content,
        startDateTime: createTime ? moment(createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        endDateTime: createTime ? moment(createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        tabEnum: tab,
        status
      }, pageInfo?.pageSize);
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
              <div className="pagination-text">{`共${total}条记录 第${pageInfo?.pageIndex}/${pageInfo?.pageTotal || 1
                }页`}</div>
            ),
          }}
          onChange={(pagination: any) => {
            console.log('分页onChange', pagination)
            // ⭐ 也需要处理
            getLeaveWordVerifyPage({...searchInfo}, pagination.pageSize, pagination.current);
          }}
        />
      </div>
    </PageContainer>
  )
}