import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, DatePicker, message as antdMessage, Modal } from 'antd';
import SelfTable from '@/components/self_table';
import UploadModal from './components/uploadModal';
import { getTradeList, deleteByIds } from '@/services/data-manage';
import AddBusinessModal from './components/addBusinessModal';
import { useAccess, Access } from '@@/plugin-access/access';
import moment from 'moment';
import type Common from '@/types/common';
const sc = scopedClasses('business-channel-manage');

export default () => {
  // 拿到当前角色的access权限兑现
  const access: any = useAccess();
  const [searchForm] = Form.useForm();
  const [params, setParams] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
  });
  const uploadModalRef = useRef<any>(null);
  const addBusinessModalRef = useRef<any>(null);
  const [dataSource, setDataSource] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    if (search.time) {
      search.orderDateStart = moment(search.time[0]).startOf('days').format('YYYY-MM-DD');
      search.orderDateEnd = moment(search.time[1]).endOf('days').format('YYYY-MM-DD');
    }
    delete search.time;
    return search;
  };

  const getPage = async (data: any) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code, message } = await getTradeList(data);
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

  const onDelete = async (ids: any) => {
    try {
      const res = await deleteByIds(ids);
      if (res.code === 0) {
        antdMessage.success(`删除成功`);
        const search = getSearchQuery();
        const newParams = {
          ...search,
          ...params
        };
        getPage(newParams)
      } else {
        antdMessage.error(res?.message || `操作失败，请重试`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '采购单号',
      dataIndex: 'orderNum',
      width: 150,
      render: (orderNum: string) => {
        return <span>{orderNum || '--'}</span>;
      },
    },
    {
      title: '供应商名称',
      dataIndex: 'providerName',
      width: 150,
      render: (providerName: string) => {
        return <span>{providerName || '--'}</span>;
      },
    },
    {
      title: '物料描述',
      dataIndex: 'materialDescription',
      width: 150,
      render: (materialDescription: string) => {
        return <span>{materialDescription || '--'}</span>;
      },
    },
    {
      title: '含税金额（元）',
      dataIndex: 'taxAmount',
      width: 150,
      render: (taxAmount: number) => {
        return <span>{taxAmount || '--'}</span>;
      },
    },
    {
      title: '订单日期',
      dataIndex: 'orderDate',
      width: 200,
      render: (orderDate: string) => {
        return <>{orderDate || '--'}</>;
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
            <Access accessible={access.PD_UM_YHFBBMD}>
              <Button
                type="link"
                style={{ padding: 0, color: 'red' }}
                onClick={() => {
                  Modal.confirm({
                    title: '删除数据',
                    content: '确定删除该数据么？',
                    onOk: () => {
                      onDelete([record?.id]);
                    },
                    okText: '删除',
                  });
                }}
              >
                删除
              </Button>
            </Access>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getPage(params);
  }, [params]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row>
            <Col span={5}>
              <Form.Item labelCol={{ span: 8 }} name="providerName" label="供应商名称">
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
                onClick={() => {
                  if (!selectedRowKeys.length) {
                    antdMessage.warning('请选择数据');
                    return;
                  }
                  Modal.confirm({
                    title: '删除数据',
                    content: '确定删除该数据么？',
                    onOk: () => {
                      onDelete(selectedRowKeys);
                    },
                    okText: '删除',
                  });
                }}
              >
                批量删除
              </Button>
            </Access>
          </div>
        </div>
        <SelfTable
          bordered
          loading={loading}
          columns={columns}
          rowSelection={{
            fixed: true,
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          dataSource={dataSource}
          rowKey={'id'}
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
    </PageContainer>
  );
};
