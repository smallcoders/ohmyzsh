import {
  Button,
  message,
  Space,
  Popconfirm,
  Tooltip,
  Select,
  Row,
  Col,
  Form,
  Input,
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type SolutionTypes from '@/types/solution';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import SelfTable from '@/components/self_table';
import { history, Access, useAccess } from 'umi';
import './index.less'
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../config/routes';

const sc = scopedClasses('content-stream-ad');

const staNumArr = [
  {
    title: '推荐上架总数',
    num: 0,
  },
  {
    title: '商机上架总数',
    num: 0,
  },
  {
    title: '政策上架总数',
    num: 0,
  },
  {
    title: '人工智能上架总数',
    num: 0
  },
  {
    title: '智能家电上架总数',
    num: 0
  },
  {
    title: '汽车上架总数',
    num: 0
  },
]

// 统计卡片
const StaCard = () => {
  return (
  <div className={sc('card')}>
    {staNumArr.map(((item) => {
      return (
        <div className="wrap" key={item.title}>
          <div className="title">{ item.title }</div>
          <div className="num">{ item.num }</div>
        </div>
      )
    }))}
  </div>
  )
}



const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}



// 搜索模块
const useSearchNode = (): React.ReactNode => {
  const [searchForm] = Form.useForm();
  const [searchContent, setSearChContent] = useState<any>({});
  return (
    <div className={sc('container-search')}>
      <Form {...formLayout} form={searchForm}>
        <Row>
          <Col span={6}>
            <Form.Item name="topic" label="内容标题">
              <Input placeholder="请输入" allowClear  autoComplete="off"/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="publicUserName" label="版面">
              <Select placeholder="请选择" allowClear >
                <Select.Option value={0}>下架</Select.Option>
                <Select.Option value={1}>上架</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="enable" label="状态">
              <Select placeholder="请选择" allowClear>
                <Select.Option value={0}>下架</Select.Option>
                <Select.Option value={1}>上架</Select.Option>
                <Select.Option value={2}>暂存</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button
              style={{ marginRight:'20px' }}
              type="primary"
              key="search"
              onClick={() => {
                const search = searchForm.getFieldsValue();
                setSearChContent(search);
              }}
            >
              查询
            </Button>
            <Button
              key="reset"
              onClick={() => {
                searchForm.resetFields();
                setSearChContent({});
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}




export default () => {

  const handleAdd = () => {
    // history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_ADD}`)
    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_ADD}`)
  }
  const handleDetail = () => {
    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_DETAIL}`)
  }
  const handleStatisticalDetail = () => {
    history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_STATISTICAL_DETAIL}`)
  }

  // 拿到当前角色的access权限兑现
  const access = useAccess()
  const [dataSource, setDataSource] = useState<any>([]);
  // const [searchContent, setSearChContent] = useState<any>({});
  const [visible, setVisible] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);

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
      title: '内容标题',
      dataIndex: 'title',
      width: 150,
      render: (title: string) => {
        return (title || '--')
      }
    },
    {
      title: '图片',
      dataIndex: 'newUrl',
      isEllipsis: true,
      width: 250,
      render: (newUrl: string) => {
        return (newUrl || '--')
      }
    },
    {
      title: '版面',
      dataIndex: 'currentUrl',
      isEllipsis: true,
      width: 250,
      render: () => {
        return <div>123</div>
      }
    },
    {
      title: '位置',
      dataIndex: 'crawered',
      width: 150,
      render: () => {
        return <div>123</div>
      }
    },
    {
      title: '作用范围',
      width: 150,
      dataIndex: 'sended',
      render: (sended: number) => {
        return <span>{sended === 1 ? '是' : '否'}</span>
      }
    },
    {
      title: '浏览次数',
      width: 200,
      dataIndex: 'createTime',
      render: (createTime: string) => {
        return <span>{createTime || '--'}</span>
      }
    },
    {
      title: '被关闭次数',
      dataIndex: 'createByName',
      width: 200,
      render: (createByName: string) => {
        return (createByName || '--')
      },
    },
    {
      title: '曝光量',
      dataIndex: 'createByName',
      width: 200,
      render: (createByName: string) => {
        return (createByName || '--')
      },
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      width: 200,
      render: (updateTime: string) => {
        return <span>{updateTime || '--'}</span>
      }
    },
    {
      title: '状态',
      dataIndex: 'createByName',
      width: 200,
      render: (createByName: string) => {
        return (createByName || '--')
      },
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (_: any, record: any) => {
        if (record.crawered === 0){
          return <span>--</span>
        }
        return (
          <div style={{whiteSpace: 'break-spaces'}}>
            <Access accessible={access['PD_BLM_SSRDGL']}>
              <Button
                size="small"
                type="link"
                onClick={() => {
                  // handleDelete(record)
                }}
              >
                删除
              </Button>
            </Access>
          </div>
        )
      },
    },
  ];


  return (
    <PageContainer className={sc('container')}>
      <StaCard />
      {useSearchNode()}
      <div className={sc('container-table-body')}>
        <Access accessible={access['PA_BLM_SSRDGL']}>
          <Button
            type="primary"
            style={{marginBottom: '10px'}}
            onClick={() => {
              // modalForm.resetFields()
              // setVisible(true)
            }}
          >
            新增
          </Button>
        </Access>
        <SelfTable
          rowKey="id"
          loading={loading}
          bordered
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1000 }}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                onChange: getPage,
                total: pageInfo.totalCount,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total: number) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
              }
          }
        />
      </div>
    </PageContainer>
  )
}
