import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, DatePicker, message as antdMessage, Tooltip } from 'antd';
import SelfTable from '@/components/self_table';
import UploadModal from './components/uploadModal';
import { getBusinessList } from '@/services/business-channel';
import AddBusinessModal from './components/addBusinessModal';
import AuditModal from './components/auditModal';
import { useAccess, Access } from '@@/plugin-access/access';
import moment from 'moment';
import type Common from '@/types/common';
const sc = scopedClasses('business-channel-manage');

const chanceTypeMap = {
  1: '研发设计',
  2: '生产制造',
  3: '仓储物流',
  4: '管理数字化',
  5: '其他',
};

const statusMap = {
  0: '跟进中',
  1: '已释放',
  2: '待审核',
  3: '待分发',
  4: '已驳回',
  5: '已完成',
};

const statusColorMap = {
  0: {
    color: '#0FEA97',
    background: 'rgba(15, 234, 151, 0.1)',
  },
  1: {
    color: '#526275',
    background: 'rgba(82,98, 117, 0.1)',
  },
  2: {
    color: '#1CD8ED',
    background: 'rgba(28, 216, 237, 0.1)',
  },
  3: {
    color: '#0FEA97',
    background: 'rgba(15, 234, 151, 0.1)',
  },
  4: {
    color: '#FFD902',
    background: 'rgba(255, 217, 2, 0.1)',
  },
  5: {
    color: '#526275',
    background: 'rgba(82,98, 117, 0.1)',
  },
};

export default () => {
  // 拿到当前角色的access权限兑现
  const access: any = useAccess();
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchForm] = Form.useForm();
  const [params, setParams] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    queryType: 'ALL',
  });
  const uploadModalRef = useRef<any>(null);
  const addBusinessModalRef = useRef<any>(null);
  const auditModalRef = useRef<any>(null);
  const [dataSource, setDataSource] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const recordColumns = [
    {
      title: '商机编号',
      dataIndex: 'chanceNo',
      width: 150,
      render: (chanceNo: string, record: any) => {
        return (
          <span
            style={chanceNo ? { color: '#0068ff', cursor: 'pointer' } : {}}
            onClick={() => {
              auditModalRef.current.openModal(record, 'detail');
            }}
          >
            {chanceNo || '--'}
          </span>
        );
      },
    },
    {
      title: '商机名称',
      dataIndex: 'chanceName',
      width: 150,
      render: (chanceName: string) => {
        return <span>{chanceName || '--'}</span>;
      },
    },
    {
      title: '商机类型',
      dataIndex: 'chanceType',
      width: 150,
      render: (chanceType: number) => {
        return <span>{chanceTypeMap[chanceType] || '--'}</span>;
      },
    },
    {
      title: '商机状态',
      dataIndex: 'status',
      width: 150,
      render: (status: number, record: any) => {
        return status === 4 && record.auditTxt ? (
          <Tooltip placement="top" title={`驳回事由:${record.auditTxt}`}>
            <span style={statusColorMap[status]} className="status">
              {statusMap[status] || '--'}
            </span>
          </Tooltip>
        ) : (
          <span style={statusColorMap[status]} className="status">
            {statusMap[status] || '--'}
          </span>
        );
      },
    },
    {
      title: '关联企业',
      dataIndex: 'orgName',
      width: 150,
      render: (orgName: string) => {
        return <span>{orgName || '--'}</span>;
      },
    },
    {
      title: '企业所属地区',
      dataIndex: 'areaName',
      width: 150,
      render: (areaName: string, record: any) => {
        return (
          <span>
            {record.cityName || areaName
              ? `${record.cityName || ''}${record.cityName && areaName ? '/' : ''}${areaName || ''}`
              : '--'}
          </span>
        );
      },
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      width: 200,
      render: (createTime: string) => {
        return <>{createTime || '--'}</>;
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 100,
      render: (_: any, record: any) => {
        return (
          <>
            <Access accessible={access.PU_SJ_DR}>
              <Button
                size="small"
                type="link"
                onClick={() => {
                  console.log(record);
                  addBusinessModalRef.current.openModal(record);
                }}
              >
                编辑
              </Button>
            </Access>
            <Button
              size="small"
              type="link"
              onClick={() => {
                auditModalRef.current.openModal(record, 'detail');
              }}
            >
              查看
            </Button>
          </>
        );
      },
    },
  ];

  const getPage = async (data: any) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code, message } = await getBusinessList(data);
      setLoading(false);
      if (code === 0) {
        setPageInfo({ ...pageInfo, totalCount, pageTotal, pageIndex: data.pageIndex });
        setDataSource(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      setLoading(false);
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  useEffect(() => {
    getPage(params);
  }, [params]);

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    if (search.time) {
      search.startDate = moment(search.time[0]).startOf('days').format('YYYY-MM-DD HH:mm:ss');
      search.endDate = moment(search.time[1]).endOf('days').format('YYYY-MM-DD HH:mm:ss');
    }
    delete search.time;
    if (search.area) {
      search.orgArea = search.area[1];
    }
    delete search.area;
    return search;
  };

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row>
            <Col span={5}>
              <Form.Item labelCol={{ span: 8 }} name="chanceNo" label="商机编号">
                <Input placeholder="请输入" maxLength={35} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item labelCol={{ span: 6 }} name="time" label="发布时间">
                <DatePicker.RangePicker
                  allowClear
                  disabledDate={(current) => {
                    return current > moment().endOf('day');
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={5} offset={1}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = getSearchQuery();
                  const newParams = {
                    ...search,
                    pageIndex: 1,
                    pageSize: 10,
                    queryType: activeTab,
                  };
                  setParams(newParams);
                }}
              >
                查询
              </Button>
              <Button
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  setParams({
                    pageIndex: 1,
                    pageSize: 10,
                    queryType: activeTab,
                  });
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className="main-content">
        <div className="top-area">
          <div className="button-box">
            <Access accessible={access.PU_SJ_DR}>
              <Button
                style={{ marginRight: '20px' }}
                type="default"
                key="addStyle"
                onClick={() => {
                  uploadModalRef.current.openModal();
                }}
              >
                导入
              </Button>
            </Access>
            <Access accessible={access.PU_SJ_DR}>
              <Button
                style={{ marginLeft: '10px' }}
                type="primary"
                key="addStyle"
                onClick={() => {
                  addBusinessModalRef.current.openModal();
                }}
              >
                +新增
              </Button>
            </Access>
          </div>
        </div>
        <SelfTable
          bordered
          loading={loading}
          columns={recordColumns}
          dataSource={dataSource}
          key="id"
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: (current: number) => {
                    setParams({ ...params, pageIndex: current });
                  },
                  total: pageInfo.totalCount,
                  showSizeChanger: false,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
      <UploadModal ref={uploadModalRef} />
      <AddBusinessModal
        successCallBack={() => {
          getPage(params);
        }}
        ref={addBusinessModalRef}
      />
      <AuditModal
        activeTab={activeTab}
        ref={auditModalRef}
        successCallBack={() => {
          const { totalCount, pageIndex, pageSize } = pageInfo;
          const newTotal = totalCount - 1 || 1;
          const newPageTotal = Math.ceil(newTotal / pageSize) || 1;
          setParams({ ...params, pageIndex: pageIndex > newPageTotal ? newPageTotal : pageIndex });
        }}
      />
    </PageContainer>
  );
};
