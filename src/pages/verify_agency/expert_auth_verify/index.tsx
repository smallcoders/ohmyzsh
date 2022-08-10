import { useState, useEffect, useMemo } from 'react'
import { Form, Button, message } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import scopedClasses from '@/utils/scopedClasses'
import Common from '@/types/common.d'
import { history, useModel } from 'umi'
import { routeName } from '@/../config/routes'
import SelfTable from '@/components/self_table'
import SearchBar from '@/components/search_bar'
import { httpPostExpertAuthVerifyPage } from '@/services/verify/expert-auth-verify'
import { ExpertAuthVerifySearchInfo } from '@/models/useExpertAuthVerifyModel'
import './index.less'

const sc = scopedClasses('enterprise-info-verify')
interface EXpertInfo {
  id?: string // id
  expertName?: string // 专家名称
  phone?: string // 联系电话
  expertType?: string // 专家类型
  area?: string
  accountType?: string // 组织类型  枚举备注: ENTERPRISE :企业 COLLEGE :高校 INSTITUTION :科研机构 OTHER :其他
  state?: string // 状态
}
const stateObj = {
  UN_CHECK: '未审核',
  CHECKED: '审核通过',
  UN_PASS: '审核拒绝',
}

export default () => {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<EXpertInfo[]>([])
  const { pageInfo, setPageInfo, searchInfo, setSearchInfo } = useModel('useExpertAuthVerifyModel')

  useEffect(() => {
    form?.setFieldsValue({ ...searchInfo })
    getExpertTypeOptions()
    getAreaListOptions()
    getExpertAuthVerifyPage(searchInfo, pageInfo.pageSize, pageInfo.pageIndex)
  }, [])

  const getExpertTypeOptions = () => {

  }

  const getAreaListOptions = () => {

  }

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '专家名称',
      dataIndex: 'expertName',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '专家类型',
      dataIndex: 'expertType',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '所属区域',
      dataIndex: 'area',
      width: 200,
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 150,
      render: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--'}
          </div>
        )
      },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <Button
            type="link"
            onClick={() => {
              history.push(`${routeName.ENTERPRISE_INFO_VERIFY_DETAIL}?id=${record.id}`)
            }}
          >
            {record?.state === 'UN_CHECK' ? '审核' : '详情'}
          </Button>
        )
      },
    },
  ]

  const getExpertAuthVerifyPage = async (searchInfo: ExpertAuthVerifySearchInfo, pageSize = 10, pageIndex = 1) => {
    try {
      const { result, totalCount, pageTotal, code } = await httpPostExpertAuthVerifyPage({
        ...searchInfo,
        pageIndex,
        pageSize,
      })
      if (code === 0) {
        setPageInfo({ ...pageInfo, totalCount, pageTotal, pageIndex, pageSize })
        setDataSource(result)
      } else {
        message.error(`请求分页数据失败`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const searchList = useMemo(() => {
    return [
      {
        key: 'expertName',
        label: '专家名称',
        type: Common.SearchItemControlEnum.INPUT,
        initialValue: '',
        allowClear: true,
      },
      {
        key: 'expertType',
        label: '专家类型',
        type: Common.SearchItemControlEnum.SELECT,
        initialValue: '',
        allowClear: true,
      },
      {
        key: 'area',
        label: '所属区域',
        type: Common.SearchItemControlEnum.SELECT,
        initialValue: '',
        allowClear: true,
      },
    ]
  }, [])

  const onSearch = (info: any) => {
    const { expertName, expertType, area } = info || {}
    setPageInfo({ ...pageInfo, pageIndex: 1 })
    setSearchInfo({ expertName, expertType, area })
    getExpertAuthVerifyPage(info, pageInfo.pageSize)
  }

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('search-container')}>
        <SearchBar form={form} searchList={searchList} onSearch={onSearch} />
      </div>
      <div className={sc('table-container')}>
        <div className="title">
          <span>列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
        <SelfTable
          bordered
          scroll={{ x: 1200 }}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            total: pageInfo.totalCount,
            current: pageInfo?.pageIndex,
            pageSize: pageInfo?.pageSize,
            showTotal: (total: number) =>
              <div className="pagination-text">{`共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`}</div>,
          }}
          onChange={(pagination: any) => {
            getExpertAuthVerifyPage(searchInfo, pagination.pageSize, pagination.current)
          }}
        />
      </div>
    </PageContainer>
  )
}
