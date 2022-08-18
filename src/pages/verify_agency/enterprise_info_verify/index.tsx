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
import type EnterpriseInfoVerify from '@/types/verify/enterprise-info-verify';
import { httpPostEnterpriseInfoVerifyPage } from '@/services/verify/enterprise-info-verify'
import './index.less'

const sc = scopedClasses('enterprise-info-verify')
const stateObj = {
  AUDITING: '未审核',
  AUDIT_PASSED: '审核通过',
  AUDIT_REJECTED: '审核拒绝',
}

export default () => {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<EnterpriseInfoVerify.Content[]>([])
  const { pageInfo, setPageInfo, orgName, setOrgName, resetModel } = useModel('useEnterpriseInfoVerifyModel')

  useEffect(() => {
    form?.setFieldsValue({ orgName })
    getEnterpriseInfoVerifyPage(orgName, pageInfo.pageSize, pageInfo.pageIndex)
    const unlisten = history.listen((location) => {
      if (!location?.pathname.includes(routeName.ENTERPRISE_INFO_VERIFY)) {
        // resetModel()
        // unlisten()
        // console.log(unlisten,history.listen,333);
        
      }
    });
  }, [])

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: EnterpriseInfoVerify.Content, index: number) =>
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
      dataIndex: 'orgTypeName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '申请人姓名',
      dataIndex: 'username',
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
      dataIndex: 'auditState',
      width: 150,
      render: (state: string) => Object.prototype.hasOwnProperty.call(stateObj, state) ? stateObj[state] : '--',
    },
    {
      title: '最新操作时间',
      dataIndex: 'operationTime',
      width: 200,
      render: (_: string) => (_ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: EnterpriseInfoVerify.Content) => {
        return (
          <Button
            type="link"
            onClick={() => {
              history.push(`${routeName.ENTERPRISE_INFO_VERIFY_DETAIL}?id=${record.auditId}`)
            }}
          >
            {record?.auditState === 'AUDITING' ? '审核' : '详情'}
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
          rowKey="auditId"
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
