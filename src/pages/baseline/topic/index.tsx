import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, message, Popconfirm, Row, Select} from "antd";
import SelfTable from "@/components/self_table";
import moment from "moment/moment";
import type Common from "@/types/common";
import {deleteHotRecommend, editHotRecommend, queryHotRecommend} from "@/services/topic";
import {InfoOutlined} from "@ant-design/icons";
import {history} from "@@/core/history";
import {useAccess,Access} from "@@/plugin-access/access";

export default () => {
  // // 拿到当前角色的access权限兑现
  const access = useAccess()
  const sc = scopedClasses('baseline-topic');
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const [weightForm] = Form.useForm();
  const [searchContent, setSearChContent] = useState<any>({});
  // 搜索模块
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="topic" label="话题名称">
                <Input placeholder="请输入" allowClear  autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="publicUserName" label="发布人">
                <Input placeholder="请输入" allowClear  autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="enable" label="发布状态">
                <Select placeholder="请选择" allowClear style={{ width: '200px'}}>
                  <Select.Option value={0}>下架</Select.Option>
                  <Select.Option value={1}>上架</Select.Option>
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
    );
  };
  // 获取分页数据
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await queryHotRecommend({
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

  //删除
  const remove = async (id: string) => {
    try {
      const removeRes = await deleteHotRecommend(id);
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
  // 上下架
  const editState = async (e: any, updatedState: number) => {
    try {
      const {id,topic,weight} = e
      const tooltipMessage = updatedState === 0 ? '下架' : '上架';
      const updateStateResult = await editHotRecommend({  id, topic, weight, enable: updatedState });
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
  const editSort = async (e: any, value: number) => {
    try {
      const {id, topic,enable } = e
      const editRes = await editHotRecommend({
        id,
        topic,
        weight:value,
        enable,
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
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '话题名称',
      dataIndex: 'topic',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '发布状态',
      dataIndex: 'enable',
      width: 100,
      render: (_: any, _record: any) =>
        _record.enable ? '上架':'下架'
    },
    {
      title: '关联内容数',
      dataIndex: 'contentCount',
      width: 120,
    },
    {
      title: '权重',
      dataIndex: 'weight',
      width: 80,
    },
    {
      title: '发布人',
      dataIndex: 'publishUserName',
      width: 100,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      width: 190,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <div className={sc('container-option')}>
              <Button type="link" onClick={() => {
                history.push(`/baseline/baseline-topic-manage/detail?recommendId=${record?.id}`)
              }}>
                详情
              </Button>
            <Access accessible={access['PU_BLM_HTGL']}>
            {!record.enable && (
              <Button type="link" onClick={() => {
                history.push(`/baseline/baseline-topic-manage/add?id=${record?.id}&contentCount=${record?.contentCount}`)
              }}>
                编辑
              </Button>
            )}
            {record.enable ? (
              <Popconfirm
                title="确定下架么？"
                okText="下架"
                cancelText="取消"
                onConfirm={() => editState(record as any, 0)}
              >
                <Button type="link">下架</Button>
              </Popconfirm>
            )
            : (
              <Popconfirm
                title="确定上架么？"
                okText="上架"
                cancelText="取消"
                onConfirm={() => editState(record as any, 1)}
              >
                <Button type="link" >上架</Button>
              </Popconfirm>
            )}
            <Popconfirm
              placement="topRight"
              title={
                <>
                  <Form form={weightForm} {...formLayout} style={{width:'300px'}}>
                    <Form.Item
                      style={{flexFlow:'column'}}
                      name={'weight'}
                      label="权重设置">
                      <InputNumber
                      step={1}
                      style={{width:'280px'}}
                      precision={0}
                      placeholder={'请输入1~100的整数，数字越大排名越靠前'} min={1} max={100} />
                    </Form.Item>
                  </Form>
                </>
              }
              icon={<InfoOutlined style={{ display: 'none' }} />}
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                editSort(record, weightForm.getFieldValue('weight'))
              }}
            >
              <Button
                type="link"
                onClick={() => {
                  weightForm.setFieldsValue({ weight: record.sort })
                }}
              >
                权重设置
              </Button>
            </Popconfirm>
            </Access>
            <Access accessible={access['PD_BLM_HTGL']}>
            {!record.enable && (
              <Popconfirm
                title="确定删除么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id as string)}
              >
              <Button type="link" >
                删除
              </Button>
              </Popconfirm>
              )}
            </Access>
          </div>
        )
      },
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
            history.push(`/baseline/baseline-topic-manage/add`)
          }}
        >
          新增话题
        </Button>
        </Access>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          // scroll={{ x: 1480 }}
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
