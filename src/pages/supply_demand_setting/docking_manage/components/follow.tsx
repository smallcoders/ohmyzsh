import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message as antdMessage,
  Space,
  TreeSelect,
} from 'antd';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState, useMemo } from 'react';
import type Common from '@/types/common';
import SelfTable from '@/components/self_table';
import type ExpertResource from '@/types/expert_manage/expert-resource';
import { Access, useAccess } from 'umi';
import { routeName } from '@/../config/routes';
import {
  cancelAppoint,
  getClaimFollow,
  getDemandPage,
} from '@/services/creative-demand';
import RefineModal from './refine';
import AssignModal from './assign';
import DockingManage from '@/types/docking-manage.d';
const sc = scopedClasses('user-config-logout-verify');



export default (props: { gid: any; demandTypes: any[], area: any[] }) => {
  const { gid, demandTypes, area } = props
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  // 拿到当前角色的access权限兑现
  const access = useAccess();

  // 操作按钮权限
  const tabState =  useMemo(() => {
    const activePower = {
      1: 'P_SD_XQGJ_SZH', // 数字化应用业务中
      2: 'P_SD_XQGJ_CG', // 工品采购业务组
      3: 'P_SD_XQGJ_KC', // 科产业务中
      4: 'P_SD_XQGJ_JR', // 羚羊金融业务组
      5: 'P_SD_XQGJ_JLR', // 技术经理人
    }[gid]
    return access[activePower]
  },[gid, access])

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getDemandPage({
        pageIndex,
        pageSize,
        ...searchContent,
        specifyType: gid,
        tabType: 2
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


  const [refineVisible, setRefineVisible] = useState<boolean>(false);
  const [assignVisible, setAssignVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>({})
  const useModal = (): React.ReactNode => {
    return (<>
      <RefineModal record={record} visible={refineVisible} setVisible={(b, isRefresh) => {
        setRefineVisible(b)
        setRecord({})
        isRefresh && getPage()
      }} />
      <AssignModal record={record} visible={assignVisible}
        setVisible={(b, isRefresh) => {
          setAssignVisible(b)
          setRecord({})
          isRefresh && getPage()
        }}
      />
    </>
    );
  };

  const methodObj = {
    follow: (record: any) => {
      window.open(
        `${routeName.DEMAND_MANAGEMENT_DETAIL}?id=${record.id}&isEdit=1`,
      );
    },
    refine: async (record: any) => {
      setRefineVisible(true)
      setRecord({ ...record, editType: 'add' })
    },
    editRefine: async (record: any) => {
      setRefineVisible(true)
      setRecord({ ...record, editType: 'edit' })
    },
    feedback: async (record: any) => {
      window.open(`${routeName.DEMAND_MANAGEMENT_FEEDBACK}?id=${record.id}&name=${record.name}`);
    },
    editFeedback: async (record: any) => {
      window.open(`${routeName.DEMAND_MANAGEMENT_FEEDBACK}?id=${record.id}&name=${record.name}`);
    },
    assign: async (record: any) => {
      setRecord(record)
      setAssignVisible(true)
    },
    cancelAssign: async (record: any) => {
      const tooltipMessage = '取消分发';
      try {
        const markResult = await cancelAppoint(record.id);
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
      render: (_: any, _record: ExpertResource.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      width: 150,
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
      width: 150,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      isEllipsis: true,
      width: 200,
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
      width: 150,
    },
    {
      title: '需求状态',
      dataIndex: 'claimState',
      render: (item: string) => DockingManage.demandType[item] || '--',
      width: 150,
    },
    {
      title: '需求认领人',
      dataIndex: 'claimName',
      isEllipsis: true,
      width: 150,
    },

    {
      title: '指派情况',
      dataIndex: 'appointOrgName',
      render: (appointOrgName: string) => appointOrgName || '--',

      width: 180,
    },
    {
      title: '跟进次数',
      dataIndex: 'demandConnectNum',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '最近跟进时间',
      dataIndex: 'demandConnectTime',
      render: (item: string) => item || '--',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '操作',
      width: 400,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <div>
            <Access accessible={tabState}>
              <Space size={1}>
                {record?.btnList?.map(p => <Button
                  type="link"
                  onClick={() => {
                    // setRemark(record.remark || '');
                    DockingManage.btnList[p]?.method && methodObj?.[DockingManage.btnList[p]?.method](record)
                  }}
                >
                  {DockingManage.btnList[p]?.text}
                </Button>)}
              </Space>
            </Access>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (gid) {
      getPage()
      getClaimUser()
    }
  }, [searchContent, gid]);

  const [users, setUsers] = useState<any[]>([])

  const getClaimUser = async () => {
    try {
      const res = await getClaimFollow(gid)
      if (res?.code === 0) {
        setUsers(res?.result);
      } else {
        throw new Error(res?.message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }

  }

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
                    Object.entries(DockingManage.demandType).filter(p => (p[0] != '1' && p[0] != '3')).map(p => {
                      return <Select.Option value={p[0]}>{p[1]}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="需求类型">
                <TreeSelect
                  treeNodeFilterProp={'name'}
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择"
                  allowClear
                  treeDefaultExpandAll
                  treeData={demandTypes}
                  fieldNames={{ children: 'nodes', value: 'id', label: 'name' }}
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
              <Form.Item name="appointOrgName" label="需求指派情况">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>


            <Col span={8}>
              <Form.Item name="claimId" label="需求认领人">
                <Select placeholder="请选择" allowClear>
                  {
                    users?.map(p => {
                      return <Select.Option value={p?.claimUserId}>{p?.claimName}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col offset={4} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary1"
                onClick={() => {
                  setPageInfo({
                    pageIndex: 1,
                    pageSize: 10,
                    totalCount: 0,
                    pageTotal: 0
                  });
                  const search = searchForm.getFieldsValue();
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary2"
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
          scroll={{ x: 2510 }}
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
      {useModal()}
    </>
  );
};
