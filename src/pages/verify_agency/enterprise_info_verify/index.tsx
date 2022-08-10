import { useState, useEffect } from 'react'
import { Form, Button, message } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import scopedClasses from '@/utils/scopedClasses'
import Common from '@/types/common.d'
import moment from 'moment'
import { history, useModel } from 'umi'
import { routeName } from '@/../config/routes'
import SelfTable from '@/components/self_table'
import SearchBar from '@/components/search_bar'
import { httpPostEnterpriseInfoVerifyPage } from '@/services/verify/enterprise-info-verify'
import './index.less'

const sc = scopedClasses('enterprise-info-verify')
interface EnterpriseInfo {
  id?: string // id
  orgName?: string // 组织名称
  accountType?: string // 组织类型  枚举备注: ENTERPRISE :企业 COLLEGE :高校 INSTITUTION :科研机构 OTHER :其他
  userName?: string // 申请人姓名
  phone?: string // 手机号
  state?: string // 状态
  updateTime?: string // 最新操作时间
}
const stateObj = {
  UN_CHECK: '未审核',
  CHECKED: '审核通过',
  UN_PASS: '审核拒绝',
}

export default () => {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<EnterpriseInfo[]>([])
  const { pageInfo, setPageInfo, orgName, setOrgName } = useModel('useEnterpriseInfoVerifyModel')

  useEffect(() => {
    form?.setFieldsValue({ orgName })
    getEnterpriseInfoVerifyPage(orgName, pageInfo.pageSize, pageInfo.pageIndex)
  }, [])

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '组织名称',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '组织类型',
      dataIndex: 'accountType',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '申请人姓名',
      dataIndex: 'userName',
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 150,
      render: (_: string) => {
        return (
          <div className={`state-${_}`}>
            {Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--'}
          </div>
        )
      },
    },
    {
      title: '最新操作时间',
      dataIndex: 'updateTime',
      width: 200,
      render: (_: string) => (_ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : ''),
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

  const getEnterpriseInfoVerifyPage = async (orgName = '', pageSize = 10, pageIndex = 1) => {
    try {
      const { result, totalCount, pageTotal, code } = await httpPostEnterpriseInfoVerifyPage({
        orgName,
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

  const searchList = [
    {
      key: 'orgName',
      label: '组织名称',
      type: Common.SearchItemControlEnum.INPUT,
      initialValue: '',
      allowClear: true,
    },
  ]

  const onSearch = (info: any) => {
    const { orgName } = info || {}
    setPageInfo({ ...pageInfo, pageIndex: 1 })
    setOrgName(orgName)
    getEnterpriseInfoVerifyPage(orgName, pageInfo.pageSize)
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
            getEnterpriseInfoVerifyPage(orgName, pagination.pageSize, pagination.current)
          }}
        />
      </div>
    </PageContainer>
  )
}
