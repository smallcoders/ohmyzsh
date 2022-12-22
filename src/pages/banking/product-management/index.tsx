import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  Popconfirm,
  Modal,
  message,
  Space,
  Switch,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import type BankingLoan from '@/types/banking-loan.d';
import { history } from 'umi';
import {
  getProductList,
  getProductType,
  addProduct,
  updateStateByIds,
  delProduct,
} from '@/services/banking-product';
import { statusMap, ObjectMap, guaranteeMethodMap, sortMap } from './constants';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
const sc = scopedClasses('product-management');

export default () => {
  const [dataSource, setDataSource] = useState<BankingLoan.Content[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchForm] = Form.useForm();
  const [searchContent, setSearChContent] = useState<{
    applyNo?: string; // 业务申请编号
    orgName?: string; // 企业名称
    applyTimeStart?: string; // 申请开始时间 yyyy-MM-dd
    applyTimeEnd?: string; // 申请截至时间 yyyy-MM-dd
    dataSource?: number; // 数据来源，0-人工录入，1-API获取，2-邮箱解析
    bank?: string; // 金融机构
    creditStatus?: number[]; // 授信状态，2-已授信 3-授信失败 6-待授信
    productName?: string; // 产品名称
    takeMoneyMin?: number; // 放款金额最小值
    takeMoneyMax?: number; // 放款金额最大值
    creditAmountMin?: number; // 授信金额最小值
    creditAmountMax?: number; // 授信金额最大值
  }>({});

  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  };

  /**
   * 新建窗口的弹窗
   *  */
  const [form] = Form.useForm();
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<BankingLoan.Content>({});
  const clearForm = () => {
    form.resetFields();
    if (editingItem.id) setEditingItem({});
  };
  const [tableParams, setTableParams] = useState<string>(null);
  const [productType, setProductType] = useState<any[]>([]);
  // const [isMore, setIsMore] = useState<boolean>(false);

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  // 参数存储
  const setParams = () => {
    localStorage.setItem('product_record_params', JSON.stringify(searchContent));
  };
  // 返回参数回填
  const backParamSet = () => {
    if (history.action === 'POP') {
      const SearChContentJson: any = localStorage.getItem('product_record_params');
      if (!SearChContentJson) return;
      const SearChContentJsonParse: any = JSON.parse(SearChContentJson);
      const {
        applyTimeStart,
        applyTimeEnd,
        takeMoneyMin,
        takeMoneyMax,
        creditAmountMin,
        creditAmountMax,
        ...rest
      } = SearChContentJsonParse;
      searchForm.setFieldsValue({
        ...rest,
        time:
          applyTimeStart && applyTimeEnd ? [moment(applyTimeStart), moment(applyTimeEnd)] : null,
      });
      setSearChContent(SearChContentJsonParse);
    }
  };
  const prepare = async () => {
    try {
      const data = await Promise.all([getProductType()]);
      setProductType(data?.[0]?.result || []);
    } catch (error) {
      message.error('数据初始化错误');
    }
  };
  useEffect(() => {
    prepare();
    setTimeout(() => {
      backParamSet();
    }, 1000);
  }, []);
  const getPage = async (pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getProductList({
        pageIndex,
        pageSize,
        ...searchContent,
        sort: tableParams ? sortMap[tableParams] : null,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * @zh-CN 热门产品修改
   */
  const addOrUpdataIsHot = async (record: any) => {
    try {
      const addorUpdateRes = await addProduct({ isHot: record.isHot ? 0 : 1, id: record.id });
      if (addorUpdateRes.code === 0) {
        setModalVisible(false);
        message.success(`${record.isHot ? '关闭' : '打开'}热门成功！`);
        getPage();
      } else {
        message.error(
          `${record.isHot ? '关闭' : '打开'}热门失败，原因:{${addorUpdateRes.message}}`,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * @zh-CN 产品修改-上下架
   */
  const addOrUpdataState = async (record: any) => {
    try {
      const addorUpdateRes = await addProduct({ state: record.state === 1 ? 2 : 1, id: record.id });
      if (addorUpdateRes.code === 0) {
        setModalVisible(false);
        message.success(`${record.state === 1 ? '上架' : '下架'}成功！`);
        getPage();
      } else {
        message.error(
          `${record.state === 1 ? '上架' : '下架'}失败，原因:{${addorUpdateRes.message}}`,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  /**
   * @zh-CN 产品删除
   */
  const remove = async (id: any) => {
    try {
      const addorUpdateRes = await delProduct({ id });
      if (addorUpdateRes.code === 0) {
        message.success(`删除成功！`);
        getPage();
      } else {
        message.error(`删除失败，原因:{${addorUpdateRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 50,
      render: (_: any, _record: BankingLoan.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '被申请次数',
      dataIndex: 'count',
      sorter: true,
      width: 100,
    },
    {
      title: '面向对象',
      dataIndex: 'object',
      render: (_: string) => {
        return <div>{ObjectMap[_] || '--'}</div>;
      },
      width: 80,
    },
    {
      title: '产品类型',
      dataIndex: 'typeName',
      width: 100,
    },
    {
      title: '担保方式',
      dataIndex: 'warrantType',
      width: 100,
      render: (_: string) => {
        return (
          <div>
            {_?.split(',')
              .map((i) => guaranteeMethodMap[i])
              .join('、') || '--'}
          </div>
        );
      },
    },
    {
      title: '发布状态',
      dataIndex: 'state',
      width: 100,
      render: (_: string) => {
        return <div>{statusMap[_] || '--'}</div>;
      },
    },
    {
      title: '显示热门',
      dataIndex: 'isHot',
      render: (_: number, record: any) => {
        return record.state === 2 ? (
          <Popconfirm
            title={`确定${!_ ? '打开' : '关闭'}热门么？`}
            okText="确定"
            cancelText="取消"
            onConfirm={() => addOrUpdataIsHot(record)}
          >
            <Switch checked={_} />
          </Popconfirm>
        ) : (
          <Switch disabled={false} checked={false} />
        );
      },
      width: 80,
    },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <Space>
            {record.state === 2 && (
              <Popconfirm
                title="确定下架么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => addOrUpdataState(record)}
              >
                <a href="#">下架</a>
              </Popconfirm>
            )}
            {record.state === 1 && (
              <Popconfirm
                title="确定上架么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => addOrUpdataState(record)}
              >
                <a href="#">上架</a>
              </Popconfirm>
            )}
            <Button
              size="small"
              type="link"
              onClick={async () => {
                setParams();
                history.push(`${routeName.PRODUCT_MANAGEMENT_UPDATE}?id=${record.id}`);
              }}
            >
              编辑
            </Button>
            <Button
              size="small"
              type="link"
              onClick={async () => {
                setParams();
                history.push(`${routeName.PRODUCT_MANAGEMENT_DETAIL}?id=${record.id}`);
              }}
            >
              详情
            </Button>
            {record.state !== 2 && (
              <Popconfirm
                title="确定删除么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id)}
              >
                <a href="#">删除</a>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    getPage();
  }, [searchContent, tableParams]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="name" label="产品名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="state" label="发布状态">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(statusMap).map((p) => {
                    return (
                      <Select.Option key={p[0]} value={p[0]}>
                        {p[1]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="typeId" label="产品类型">
                <Select placeholder="请选择" allowClear>
                  {productType.map((p: any) => {
                    return (
                      <Select.Option key={p.id} value={p.id}>
                        {p.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="warrantType" label="担保方式">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(guaranteeMethodMap).map((p) => {
                    return (
                      <Select.Option key={p[0]} value={p[0]}>
                        {p[1]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={sc('container-search-opereate')}>
          <Button
            style={{ marginRight: 16 }}
            type="primary"
            key="search"
            onClick={() => {
              setPageInfo({
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0,
                pageTotal: 0,
              });
              const search = searchForm.getFieldsValue();
              console.log('search', search);
              setSearChContent(search);
            }}
          >
            查询
          </Button>
          <Button
            style={{ marginRight: 0 }}
            type="primary"
            key="reset"
            onClick={() => {
              searchForm.resetFields();
              setSearChContent({});
            }}
          >
            重置
          </Button>
        </div>
      </div>
    );
  };
  /**
   * @zh-CN 产品修改-批量下架
   */
  const _updateStateByIds = async () => {
    if (!selectedRowKeys.length) {
      message.warning('请选择数据');
      return;
    }
    Modal.confirm({
      title: '确定要下架选中的产品吗?',
      icon: <ExclamationCircleOutlined />,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        updateStateByIds({ ids: selectedRowKeys.join(','), state: 'DOWN' }).then((res) => {
          if (res.code === 0) {
            getPage();
            setSelectedRowKeys([]);
            message.success(`批量下架成功！`);
          } else {
            message.error(`批量下架失败！`);
          }
        });
      },
    });
  };

  const handleTableChange = (
    pagination: any,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<any>,
  ) => {
    console.log(pagination, filters, sorter);
    setTableParams(sorter.order || null);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  return (
    <PageContainer
      className={sc('container')}
      ghost
      header={{
        title: '产品管理',
        breadcrumb: {},
      }}
    >
      {useSearchNode()}
      <div className={sc('container-table')}>
        <div className={sc('container-table-header')}>
          <div className="title">
            <Button
              type="primary"
              key="addNew"
              onClick={() => {
                history.push(routeName.PRODUCT_MANAGEMENT_CREATE);
              }}
              style={{
                marginRight: '16px',
              }}
            >
              <PlusOutlined /> 新增产品
            </Button>
            <Button onClick={_updateStateByIds}>下架</Button>
          </div>
        </div>
        <div className={sc('container-table-body')}>
          <SelfTable
            bordered
            // scroll={{ x: 1280 }}
            columns={columns}
            dataSource={dataSource}
            rowKey={'id'}
            rowSelection={{
              fixed: true,
              selectedRowKeys,
              getCheckboxProps: (record: any) => {
                return {
                  disabled: record.state !== 2, // Column configuration not to be checked
                  name: record.name + '111',
                };
              },
              onChange: onSelectChange,
            }}
            onChange={handleTableChange}
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
      </div>
    </PageContainer>
  );
};
