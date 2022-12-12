import { useState, useEffect, useMemo } from 'react';
import { useModel, Access, useAccess } from 'umi'
import {
  Button,
  message,
  Form,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import SearchBar from '@/components/search_bar'
import Common from '@/types/common.d'
import { routeName } from '@/../config/routes';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import LeaveWordVerify from '@/types/leave-word-verify';
import './solution-properties-message.less';
import { 
  getCommentsManagePage, 
  getCommentsManageOnshelf, 
  getCommentsManageOffShelf 
} from '@/services/leave-word-verify'
import { MessageSearchInfo } from '@/models/useMessageManagement';
const sc = scopedClasses('solution-properties-message');
enum Edge {
  HOME = 0, // 新闻咨询首页
}

const stateObj = {
  // 根据接口调整key
  ON_SHELF: '上架中',
  OFF_SHELF: '已下架',
  DELETED: '已删除',
};

const module = {
  DEMAND: '企业需求',
  EXPERT : '专家资源',
  CREATIVE_DEMAND: '创新需求',
}

const messageType = [
  {
    id: 'DEMAND',
    name: '企业需求'
  },
  {
    id: 'EXPERT',
    name: '专家资源'
  },
  {
    id: 'CREATIVE_DEMAND',
    name: '创新需求'
  }
]

const messageState = [
  {
    id: 'ON_SHELF',
    name: '上架中'
  },
  {
    id: 'OFF_SHELF',
    name: '已下架'
  },
  {
    id: 'DELETED',
    name: '已删除'
  }
]

export default () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const { pageInfo, setPageInfo, searchInfo, setSearchInfo, resetModel } = useModel('useMessageManagement')
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_PC_LYGL', // 平台设置-留言管理
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
    // 根据存储的页面，search获取对应页
    form?.setFieldsValue({ ...searchInfo })
    // 获取所属板块
    // 获取留言状态
    // 获取列表
    // 需要调整参数
    getMessageList({...searchInfo}, pageInfo?.pageSize, pageInfo?.pageIndex )
  },[])

  const confirm = async (record: any) => {
    const state = record && record.operationStatus === 'ON_SHELF'
    try {
      const res = state 
        ? await getCommentsManageOffShelf({id: record?.commentId})
        : await getCommentsManageOnshelf({id: record?.commentId})
      if (res?.code === 0) {
        // 重新获取数据
        getMessageList({...searchInfo}, pageInfo?.pageSize, pageInfo?.pageIndex )
        message.success(`${state ? '下架' : '上架'}成功`);
      } else {
        throw new Error("");
      }
    } catch (error) {
      console.log(error)
    }
  }

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
      width: 100,
    },
    {
      title: '留言内容',
      dataIndex: 'content',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '留言时间',
      dataIndex: 'publishTime',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '所属板块',
      dataIndex: 'tab',
      isEllipsis: true,
      width: 100,
      render: (_: string) =>
        Object.prototype.hasOwnProperty.call(module, _) ? module[_] : '--',
    },
    {
      title: '审核状态',
      dataIndex: 'operationStatus',
      width: 150,
      render: (_: string) => 
      Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--',
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      dataIndex: 'option', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
      render: (_: any, _record: LeaveWordVerify.Content) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return _record?.operationStatus === 'ON_SHELF' || _record?.operationStatus === 'OFF_SHELF'  ? (
          <>
            <Access accessible={accessible}>
              <Popconfirm
                title={ _record?.operationStatus === 'ON_SHELF' ? '确定下架？' : '确定上架？'}
                onConfirm={() => {confirm(_record)}}
                okText={_record?.operationStatus === 'ON_SHELF' ? '下架' : '上架'}
                cancelText="取消"
              >
                <Button 
                  type="link"
                >
                  {_record?.operationStatus === 'ON_SHELF' ? '下架' : '上架'} 
                </Button>
              </Popconfirm>
            </Access>
            <Button 
              type="link"
              onClick={() => {
                window.open(`/solution-properties/message-management/detail?auditId=${_record.auditId}&commentId=${_record.commentId}&tab=${_record.tab}&detailId=${_record.detailId}`);
              }}
            >
              {'详情'} 
            </Button>
          </>
        ) : (<></>)
      }
    }
  ].filter(p => p);

  const getMessageList = async (searchInfo: MessageSearchInfo, pageSize = 10, pageIndex = 1) => {
    try {
      setLoading(true)
      const {
        code,
        result,
        pageTotal,
        totalCount,
      } = await getCommentsManagePage({
        ...searchInfo,
        pageIndex,
        pageSize,
      })
      if (code === 0) {
        // 储存的分页, 实现详情返回保留原分页
        setPageInfo({...pageInfo, totalCount, pageTotal, pageIndex, pageSize})
        setDataSource(result)
      } else {
        message.error(`请求分页数据失败`)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const searchList = useMemo(() => {
    // 所有key的值需要根据接口调整
    return [
      {
        key: 'name',
        label: '用户名',
        type: Common.SearchItemControlEnum.INPUT,
        initialValue: '',
        allowClear: true,
      },
      {
        key: 'time',
        label: '留言发布时间',
        type: Common.SearchItemControlEnum.RANGE_PICKER,
        allowClear: true,
      },
      {
        key: 'tabEnum',
        label: '所属板块',
        type: Common.SearchItemControlEnum.SELECT,
        options: messageType,
        allowClear: true,
      },
      {
        key: 'status',
        label: '留言状态',
        type: Common.SearchItemControlEnum.SELECT,
        options: messageState,
        allowClear: true,
      },
    ]
  }, [messageType, messageState])

  const onSearch = (info: any) => {
    // 所有key的值需要根据接口调整
    const { name, time, status, tabEnum,  ...rest } = info || {}
    setPageInfo({ ...pageInfo, pageIndex: 1 })
    setSearchInfo({ 
      name, 
      status, 
      tabEnum,
      startDateTime: time ? moment(time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      endDateTime: time ? moment(time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    })
    getMessageList({
      name, 
      status, 
      tabEnum,
      startDateTime: time ? moment(time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      endDateTime: time ? moment(time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
    }, pageInfo?.pageSize)
  }

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('search-container')}>
        <SearchBar form={form} searchList={searchList} onSearch={onSearch} />
      </div>
      <div className={sc('table-container')}>
        <div className="title">
          <span>留言列表(共{pageInfo?.totalCount || 0}个)</span>
        </div>
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
            getMessageList({...searchInfo},pagination.pageSize, pagination.current);
          }}
        />
      </div>
    </PageContainer>
  )
}