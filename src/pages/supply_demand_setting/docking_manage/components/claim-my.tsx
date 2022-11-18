import {
  Button,
  Form,
  Select,
  Row,
  Col,
  message as antdMessage,
  Space,
  Popconfirm,
  TreeSelect,
} from 'antd';
import './index.less';
import { history } from 'umi';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { routeName } from '@/../config/routes';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import type ConsultRecord from '@/types/expert_manage/consult-record';
import { cancelDistributeDemand, distributeDemand, getDemandPage } from '@/services/creative-demand';
import RefineModal from './refine';
import DockingManage from '@/types/docking-manage.d';
const sc = scopedClasses('user-config-logout-verify');

const group = Object.entries(DockingManage.specifyType)?.filter(p => p[0] != '6')

export default ({ demandTypes, area }: { demandTypes: any[], area: any[] }) => {
  const [dataSource, setDataSource] = useState<ConsultRecord.Content[]>([]);
  const [searchContent, setSearChContent] = useState<ConsultRecord.SearchBody>({});
  const [refineVisible, setRefineVisible] = useState<boolean>(false);
  const [activeTag, setActiveTag] = useState<string>('');
  const [popVisible, setPopVisible] = useState<{
    visible: boolean, id: string
  }>({
    visible: false, id: ''
  });

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const [record, setRecord] = useState<any>({})
  const getPage = async (pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getDemandPage({
        pageIndex,
        pageSize,
        ...searchContent,
        tabType: 1
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  const methodObj = {
    refine: async (record: any) => {
      setRefineVisible(true)
      setRecord({ ...record, editType: 'add' })
    },
    editRefine: async (record: any) => {
      setRefineVisible(true)
      setRecord({ ...record, editType: 'edit' })
    },
    distribute: async (record: any, value: string) => {
      const tooltipMessage = '分发';
      try {
        const markResult = await distributeDemand(record.id, value);
        if (markResult.code === 0) {
          antdMessage.success(`${tooltipMessage}成功`);
          getPage();
          setPopVisible({
            visible: false, id: ''
          })
        } else {
          throw new Error(markResult.message);
        }
      } catch (error) {
        antdMessage.error(`${tooltipMessage}失败，原因:{${error}}`);
      }
    },
    cancelDistribute: async (record: any) => {
      const tooltipMessage = '取消分发';
      try {
        const markResult = await cancelDistributeDemand(record.id);
        if (markResult.code === 0) {
          antdMessage.success(`${tooltipMessage}成功`);
          getPage();
        } else {
          throw new Error(markResult.message);
        }
      } catch (error) {
        antdMessage.error(`${tooltipMessage}失败，原因:{${error}}`);
      }
    },
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: ConsultRecord.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      width: 200,
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            window.open(`${routeName.DEMAND_MANAGEMENT_DETAIL}?id=${_record.id}`);
          }}
        >
          {_}
        </a>
      ),
      isEllipsis: true,
    },
    {
      title: '需求类型',
      dataIndex: 'typeNameList',
      isEllipsis: true,
      render: (item?: string[]) => item ? item.join('、') : '--',
      width: 300,
    },
    {
      title: '所属企业',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '需求地区',
      dataIndex: 'areaNameList',
      isEllipsis: true,
      render: (item?: string[]) => item ? item.join('、') : '--',
      width: 200,
    },
    {
      title: '需求状态',
      dataIndex: 'claimState',
      isEllipsis: true,
      render: (_: string) => DockingManage.demandType[_] || '--',
      width: 150,
    },
    {
      title: '需求认领人',
      dataIndex: 'claimName',
      isEllipsis: true,
      width: 150,
    },  

    {
      title: '分发情况',
      dataIndex: 'specifyType',
      isEllipsis: true,
      render: (_: string) => DockingManage.specifyType[_] || '--',
      width: 150,
    },
    {
      title: '操作',
      width: 300,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return <div style={{ textAlign: 'center' }}>
          <Space size={20}>
            {record?.btnList?.map(p => DockingManage.btnList?.[p]?.render ? <Popconfirm
              visible={popVisible.visible && record?.id == popVisible?.id}
              icon={null}
              title={
                <>
                  <span>
                    请选择此条需求要分发的业务组：
                  </span>
                  <div>
                    {group?.map(p => {
                      const [value, title] = p
                      return <div
                        onClick={() => {
                          activeTag != value && methodObj.distribute(record, value)
                        }}
                        style={{ textAlign: 'center', padding: '5px 30px', cursor: 'pointer', marginTop: 10, borderRadius: '4px', backgroundColor: '#E6E6E6' }}>
                        {title}
                      </div>
                    })}
                  </div>
                </>
              }
              onCancel={() => {
                setPopVisible({
                  visible: false, id: ''
                })
              }}
              okButtonProps={{ style: { display: 'none' } }}
            >
              <Button
                type="link"
                onClick={() => {
                  setActiveTag(record?.specifyType || '')
                  setPopVisible({
                    visible: true,
                    id: record?.id
                  })
                }}
              >
                分发
              </Button>
            </Popconfirm> : DockingManage.btnList[p]?.method ?
              <Button
                type="link"
                onClick={() => {
                  methodObj?.[DockingManage.btnList[p]?.method](record)
                }}
              >
                {DockingManage.btnList[p]?.text}
              </Button> : DockingManage.btnList[p]?.text)}
          </Space>
        </div>
      },
    },
  ];

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="claimState" label="需求状态">
                <Select placeholder="请选择" allowClear>
                  {
                    Object.entries(DockingManage.demandType)?.filter(p => p[0] != '3').map(p => {
                      return <Select.Option value={p[0]}>{p[1]}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="需求类型">
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={demandTypes}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  showSearch
                  treeNodeFilterProp="name"
                  fieldNames={{ label: 'name', value: 'id', children: 'nodes' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="areaCode" label="需求地区">
                <TreeSelect
                  treeNodeFilterProp={'name'}
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择"
                  allowClear
                  treeDefaultExpandAll
                  treeData={area}
                  fieldNames={{ children: 'nodes', value: 'code', label: 'name' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="specifyType" label="需求分发情况">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={6}>待分发</Select.Option>
                  {
                    group?.map(p => {
                      return <Select.Option value={p[0]}>{p[1]}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>

          


            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  setPageInfo({
                    pageIndex: 1,
                    pageSize: 10,
                    totalCount: 0,
                    pageTotal: 0
                  });
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.startCreateTime = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.endCreateTime = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
                  }
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
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
    );
  };

  return (
    <>
      {useSearchNode()}
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 2030 }}
          columns={columns}
          rowKey={'id'}
          dataSource={dataSource}
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

      <RefineModal record={record} visible={refineVisible} setVisible={(b: boolean, isRefresh) => {
        setRefineVisible(b)
        setRecord({})
        isRefresh && getPage()
      }} />
    </>
  );
};
