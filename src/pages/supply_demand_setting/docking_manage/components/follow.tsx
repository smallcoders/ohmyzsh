import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message as antdMessage,
  Space,
} from 'antd';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import SelfTable from '@/components/self_table';
import type ExpertResource from '@/types/expert_manage/expert-resource';
import { history } from 'umi';
import { routeName } from '@/../config/routes';
import {
  cancelAppoint,
  getDemandPage,
} from '@/services/creative-demand';
import RefineModal from './refine';
import AssignModal from './assign';
import FeedBackModal from './feedback';
import DockingManage from '@/types/docking-manage.d';
const sc = scopedClasses('user-config-logout-verify');



export default (props: { gid: any; }) => {
  const { gid } = props
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<any>({});
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
  const [feedbackVisible, setFeedbackVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>({})
  const useModal = (): React.ReactNode => {
    return (<>
      <RefineModal record={record} visible={refineVisible} setVisible={(b, isRefresh) => {
        setRefineVisible(b)
        setRecord({})
        isRefresh&&getPage()
      }} />
      <AssignModal record={record} visible={assignVisible}
        setVisible={(b, isRefresh) => {
          setAssignVisible(b)
          setRecord({})
          isRefresh && getPage()
        }}
      />
      <FeedBackModal record={record} visible={feedbackVisible} setVisible={(b, isRefresh) => {
        setFeedbackVisible(b)
        setRecord({})
        isRefresh&&getPage()
      }} />
    </>
    );
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
    feedback: async (record: any) => {
      setRecord(record)
      setFeedbackVisible(true)
    },
    editFeedback: async (record: any) => {
      setRecord(record)
      setFeedbackVisible(true)
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
      title: '需求状态',
      dataIndex: 'claimState',
      render: (_: string) => DockingManage.demandType[_] || '--',
      width: 150,
    },
    {
      title: '指派情况',
      dataIndex: 'appointOrgName',
      render: (appointOrgName: string) => appointOrgName || '--',

      width: 80,
    },
    {
      title: '操作',
      width: 400,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <div>
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
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    gid && getPage();
  }, [searchContent, gid]);

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
              <Form.Item name="appointOrgName" label="需求指派情况">
                <Input placeholder="请输入" />
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
          scroll={{ x: 1480 }}
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
