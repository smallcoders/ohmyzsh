import React, { useState, useEffect } from 'react';
import {
  Breadcrumb,
  Form,
  message,
  Image,
} from 'antd'
import {
  getCityPropagandaData,
} from '@/services/propaganda-config';
import SelfTable from '@/components/self_table';
import { routeName } from '@/../config/routes';
import { PageContainer } from '@ant-design/pro-layout';
import { history, Link } from 'umi'
import scopedClasses from '@/utils/scopedClasses';
import './local-propaganda-detail-management.less'
const sc = scopedClasses('detail-management');

const TableList: React.FC = () => {
  const stateColumn = {
    'NOT_EXCHANGE': '未对接',
    'EXCHANGING': '对接中',
    'EXCHANGED': '已对接',
  }
  const [form] = Form.useForm();

  // 编辑的详情
  const [editDetail, setEditDetail] = useState<any>({})
  const [enterpriseDataSource, setEnterpriseDataSource] = useState<any[]>([])
  const [innovateDemand, setInnovateDemand] = useState<any[]>([])
  const [solutionDataSource, setSolutionDataSource] = useState<any[]>([])
  const [resultDataSource, setResultDataSource] = useState<any[]>([])

  const _getCityPropagandaData = async (id: string) => {
    try {
      const res = await getCityPropagandaData(id)
      if (res?.code === 0) {
        setEditDetail(res?.result || {})
        form.setFieldsValue({...res?.result})
        setEnterpriseDataSource(res?.result.enterpriseDemands || [])
        setInnovateDemand(res?.result.creativeDemands || [])
        setSolutionDataSource(res?.result.solutions || [])
        setResultDataSource(res?.result.exchangeDemands || [])
        // ⭐ 还缺一个对接成效
      } else {
        message.error(`获取详情失败，原因:{${res?.message}}`);
      }
    } catch (error) {
      console.log(error)
      message.error('获取初始数据失败');
    }
  }

  useEffect(()=>{
    const { detail } = history.location.query as any;
    if (detail) {
      _getCityPropagandaData(detail)
    }
  },[])

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      width: 200,
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            window.open(`${routeName.REQUIREMENT_MANAGEMENT_DETAIL}?id=${_record.bizId}`);
          }}
        >
          {_}
        </a>
      ),
    },
    {
      title: '需求区域',
      dataIndex: 'areaName',
      width: 200,
    },
    {
      title: '需求类型',
      dataIndex: 'type',
      width: 200,
    },
    {
      title: '企业名称',
      dataIndex: 'enterprise',
      width: 200,
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      width: 200,
    }
  ]
  // 创新需求columns
  const innovateColumns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      width: 200,
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            window.open(`/service-config/creative-need-manage/detail?id=${_record.bizId}`);
          }}
        >
          {_}
        </a>
      ),
    },
    {
      title: '需求区域',
      dataIndex: 'areaName',
      width: 200,
    },
    {
      title: '需求类型',
      dataIndex: 'type',
      width: 200,
    },
    {
      title: '企业名称',
      dataIndex: 'enterprise',
      width: 200,
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      width: 200,
    }
  ]
  // 解决方案columns
  const solutionColumns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      width: 200,
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            window.open(`/service-config/creative-need-manage/detail?id=${_record.bizId}`);
          }}
        >
          {_}
        </a>
      ),
    },
    {
      title: '服务区域',
      dataIndex: 'areaName',
      width: 200,
    },
    {
      title: '需求类型',
      dataIndex: 'type',
      width: 200,
    },
    {
      title: '企业名称',
      dataIndex: 'enterprise',
      width: 200,
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      width: 200,
    }
  ]
  // 对接成效columns
  const dockingColumns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        index + 1,
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '发布人/发布单位',
      dataIndex: 'publishName',
      width: 200,
    },
    {
      title: '对接方',
      dataIndex: 'subscribeName',
      width: 200,
    },
    {
      title: '对接状态',
      dataIndex: 'state',
      width: 200,
      render: (_: any, record: any)=>{
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateColumn, _) ? stateColumn[_] : '--'}
          </div>
        );
      }
    },
    {
      title: '对接时间',
      dataIndex: 'exchangeTime',
      width: 200,
    }
  ]

  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: '地市宣传页详情',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/operation-activity/local-propaganda/propaganda-config/index">地市宣传页管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {'地市宣传页详情'}
            </Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
    >
      <div className={sc('container-basic')}>
        基本信息
        <Form className={sc('container-basic-form')} form={form}>
          <Form.Item
            labelCol={ {span: 8} }
            wrapperCol= { {span: 10} }
            label="城市名称"
            name="areaCode"
            rules={[{ required: true, message: '请输入城市名称' }]}
          >
            {editDetail.areaName || '--'}
          </Form.Item>
          <Form.Item
            label="企业需求数"
            labelCol={ {span: 8} }
            name="demandCount"
            rules={[{ required: true, message: '请输入企业需求数' }]}
          >
            {editDetail.demandCount || '0'}
          </Form.Item>
          <Form.Item
            label="服务方案数"
            labelCol={ {span: 8} }
            name="solutionCount"
            rules={[{ required: true, message: '请输入服务方案数' }]}
          >
            {editDetail.solutionCount || '0'}
          </Form.Item>
          <Form.Item
            label="服务报名数"
            labelCol={ {span: 8} }
            name="solutionSignIn"
          >
            {editDetail.solutionSignIn || '0'}
          </Form.Item>
          <Form.Item
            label="上传banner"
            labelCol={ {span: 8} }
            name="cityBannerId"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Image width={200} src={editDetail.cityBannerUrl} />
          </Form.Item>
        </Form>
      </div>
      <div className={sc('container-enterpriseDemand')}>
        企业需求
        <div className={sc('container-enterpriseDemand-table')}>
          <SelfTable 
            bordered
            scroll={{ x: 1400 }}
            columns={columns}
            dataSource={enterpriseDataSource}
            pagination={false}
            />
        </div>
      </div>
      <div className={sc('container-innovateDemand')}>
        创新需求
        <div className={sc('container-innovateDemand-table')}>
          <SelfTable 
            bordered
            scroll={{ x: 1400 }}
            columns={innovateColumns}
            dataSource={innovateDemand}
            pagination={false}
            />
        </div>
      </div>
      <div className={sc('container-solution')}>
        解决方案
        <div className={sc('container-solution-table')}>
          <SelfTable 
            bordered
            scroll={{ x: 1400 }}
            columns={solutionColumns}
            dataSource={solutionDataSource}
            pagination={false}
            />
        </div>
      </div>
      <div className={sc('container-docking')}>
        对接成效
        <div className={sc('container-docking-table')}>
          <SelfTable 
            bordered
            scroll={{ x: 1400 }}
            columns={dockingColumns}
            dataSource={resultDataSource}
            pagination={false}
            />
        </div>
      </div>
    </PageContainer>
  )
} 

export default TableList