import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, {useEffect, useState,useRef} from "react";
import {Button, Col, Form, Popconfirm, Input, message, Row} from "antd";
import SelfTable from "@/components/self_table";
import type Common from "@/types/common";
import {getMeetingPage,deleteMeeting,onShelfMeeting,offShelfMeeting,weightMeeting} from "@/services/baseline";
import {history} from "@@/core/history";
import {useAccess,Access} from "@@/plugin-access/access";
import {InfoOutlined} from "@ant-design/icons";
import useLimit from '@/hooks/useLimit'

export default () => {
  // // 拿到当前角色的access权限兑现
  const access = useAccess()
  const sc = scopedClasses('conference-apply');
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const weightRef = useRef()
  const [weightForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const [searchContent, setSearChContent] = useState<any>({});
  // 搜索模块
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="name" label="会议名称">
                <Input placeholder="请输入" allowClear  autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="theme" label="会议主题">
              <Input placeholder="请输入" allowClear  autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="contact" label="会议联系方式">
              <Input placeholder="请输入" allowClear  autoComplete="off"/>
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
    );
  };
  // 上下架
  const editState = async (meetingId: any, updatedState: number) => {
      try {
        const tooltipMessage = updatedState === 0 ? '下架' : '上架';
        const updateStateResult = updatedState === 0? await offShelfMeeting({meetingId}):await onShelfMeeting({meetingId})
        if (updateStateResult.code === 0) {
          message.success(`${tooltipMessage}成功`);
          getPage();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
        }
      } catch (error) {
        console.log(error);
      }
  };
  // 编辑权重
  const editSort = async (id: any, value: string) => {
      try {
        const editRes = await weightMeeting({
          id,
          weight:parseInt(value),
        })
        if (editRes.code === 0) {
          message.success(`编辑权重成功！`);
          getPage();
        } else {
          message.error(`编辑权重失败，原因:{${editRes.message}}`);
        }
      }catch (err) {
        console.log(err)
      }
  }
    //删除
  const remove = async (meetingId: string) => {
    try {
      const removeRes = await deleteMeeting(meetingId);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getPage();
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 获取分页数据
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getMeetingPage({
        pageIndex,
        pageSize,
        ...searchContent,
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
  useEffect(() => {
    getPage();
  }, [searchContent]);
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '会议页面名称',
      dataIndex: 'title',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '会议名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '会议主题',
      dataIndex: 'theme',
      width: 120,
    },
    {
      title: '会议联系方式',
      dataIndex: 'contact',
      width: 120,
    },
    {
      title: '会议时间',
      dataIndex: 'time',
      width: 120,
    },
    {
      title: '权重',
      dataIndex: 'weight',
      width: 120,
    },
    {
      title: '报名人数',
      dataIndex: 'enrollNum',
      width: 120,
      render:(_: any, record: any)=>{
        return(
          <>
           <div>{record.enrollNum?record.enrollNum:'/'}</div>
          </>
        )
      }
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      width: 200,
    },
    {
      title: '内容状态',
      dataIndex: 'state',
      width: 120,
      render:(_: any, record: any)=>{
        return(
          <>
          {record.state === 'ON_SHELF' && <div>上架</div>}
          {record.state === 'OFF_SHELF' && <div>下架</div>}
          {record.state === 'NOT_SUBMITTED' && <div>暂存</div>}
          </>
        )
      }
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <div className={sc('container-option')}>
             {record.state !== 'NOT_SUBMITTED' &&
              <Button type="link" onClick={() => {
                history.push(`/baseline/baseline-conference-manage/detail?meetingId=${record.id}`)
              }}>
                详情
              </Button>}
              {record.state !== 'ON_SHELF' &&
              <Button type="link" onClick={() => {
                history.push(`/baseline/baseline-conference-manage/edit?meetingId=${record?.id}`)
              }}>
                编辑
              </Button>
              }
              {record.state==='ON_SHELF' &&
              <Popconfirm
                title="确定将内容下架？"
                okText="下架"
                cancelText="取消"
                onConfirm={() => editState(record.id as any, 0)}
              >
                <Button type="link">下架</Button>
              </Popconfirm>
            
            }
            {record.state==='OFF_SHELF' &&
              <Popconfirm
                title="确定将内容上架？"
                okText="上架"
                cancelText="取消"
                onConfirm={() => editState(record.id as any, 1)}
              >
                <Button type="link" >上架</Button>
              </Popconfirm>
            }
            {record.state !== 'NOT_SUBMITTED' &&
            <Popconfirm
              placement="topRight"
              title={
                <>
                  <Form form={weightForm} {...formLayout} style={{width:'300px'}}>
                    <Form.Item
                      style={{flexFlow:'column'}}
                      name={'weight'}
                      label="权重设置">
                      <Input ref={weightRef} style={{ width: '300px' }} placeholder='请输入1～100的整数，数字越大排名越靠前' onInput={useLimit(weightRef)} />
                    </Form.Item>
                  </Form>
                </>
              }
              icon={<InfoOutlined style={{ display: 'none' }} />}
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                if(!weightForm.getFieldValue('weight')) return
                editSort(record.id, weightForm.getFieldValue('weight'))
              }}
            >
              <Button
                type="link"
                onClick={() => {
                  weightForm.setFieldsValue({ weight: record.sort })
                }}
              >
                权重
              </Button>
            </Popconfirm>
      }
      {(record.state == 'NOT_SUBMITTED') &&
              <Popconfirm
                title="确定删除该会议内容？"
                okText="删除"
                cancelText="取消"
                onConfirm={() => remove(record.id as string)}
              >
              <Button type="link" >
                删除
              </Button>
              </Popconfirm>}
              </div>
        )
      }
    },
  ];
  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <Access accessible={access['PA_BLM_HTGL']}>
        <Button
          type="primary"
          key="addStyle"
          onClick={()=>{
            history.push(`/baseline/baseline-conference-manage/edit`)
          }}
        >
          新增
        </Button>
        </Access>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1480 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                onChange: getPage,
                showSizeChanger: true,
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
  );
};
