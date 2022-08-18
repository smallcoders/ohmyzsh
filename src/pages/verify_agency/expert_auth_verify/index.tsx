import { useState, useEffect, useMemo } from 'react'
import { history, useModel } from 'umi'
import { Form, Button, message } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import Common from '@/types/common.d'
import { routeName } from '@/../config/routes'
import SelfTable from '@/components/self_table'
import SearchBar from '@/components/search_bar'
import { getDictionay } from '@/services/common'
import { getWholeAreaTree } from '@/services/area'
import type ExpertAuthVerify from '@/types/verify/expert-auth-verity';
import { httpPostExpertAuthVerifyPage } from '@/services/verify/expert-auth-verify'
import { ExpertAuthVerifySearchInfo } from '@/models/useExpertAuthVerifyModel'
import scopedClasses from '@/utils/scopedClasses'
import './index.less'

const sc = scopedClasses('expert-auth-verify')
const stateObj = {
  AUDITING: '未审核',
  AUDIT_PASSED: '审核通过',
  AUDIT_REJECTED: '审核拒绝',
}

export default () => {
  const [form] = Form.useForm()
  const [expertTypeOptions, setExpertTypeOptions] = useState<any>([])
  const [areaOptions, setAreaOptions] = useState<any>([])
  const [dataSource, setDataSource] = useState<ExpertAuthVerify.Content[]>([])
  const { pageInfo, setPageInfo, searchInfo, setSearchInfo } = useModel('useExpertAuthVerifyModel')

  useEffect(() => {
    form?.setFieldsValue({ ...searchInfo })
    // 获取专家类型下拉 
    getDictionay('EXPERT_DICT').then((data) => {
      setExpertTypeOptions(data?.result || [])
    })
    // 获取区域省+市下拉
    getWholeAreaTree({}).then((data) => {
      setAreaOptions(data || []);
    });
    getExpertAuthVerifyPage(searchInfo, pageInfo.pageSize, pageInfo.pageIndex)
  }, [])

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: ExpertAuthVerify.Content, index: number) =>
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
      dataIndex: 'typeNames',
      isEllipsis: true,
      width: 200,
      render: (typeNames: string[]) => typeNames.join(('、')),
    },
    {
      title: '所属区域',
      dataIndex: 'cityName',
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
      dataIndex: 'auditState',
      width: 150,
      render: (state: string) => Object.prototype.hasOwnProperty.call(stateObj, state) ? stateObj[state] : '--',
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: ExpertAuthVerify.Content) => {
        return (
          <Button
            type="link"
            onClick={() => {
              history.push(`${routeName.EXPERT_AUTH_VERIFY_DETAIL}?id=${record?.auditId}`)
            }}
          >
            {record?.auditState === 'AUDITING' ? '审核' : '详情'}
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
        options: expertTypeOptions,
        allowClear: true,
      },
      {
        key: 'cityCode',
        label: '所属区域',
        type: Common.SearchItemControlEnum.CASCADER,
        treeData: areaOptions,
        allowClear: true,
      },
    ]
  }, [expertTypeOptions, areaOptions])

  const onSearch = (info: any) => {
    const { expertName, expertType, cityCode } = info || {}
    setPageInfo({ ...pageInfo, pageIndex: 1 })
    setSearchInfo({ expertName, expertType, cityCode })
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
            getExpertAuthVerifyPage(searchInfo, pagination.pageSize, pagination.current)
          }}
        />
      </div>
    </PageContainer>
  )
}
