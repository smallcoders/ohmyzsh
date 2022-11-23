import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, Select, Row, Col, message, Space, Popconfirm, DatePicker, Image } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import { history, Access, useAccess } from 'umi';
import { routeName } from '@/../config/routes';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import AdminAccountDistributor from '@/types/admin-account-distributor.d';
import {
  queryLiveVideoPage,
  getLiveTypesPage,
  updateLiveStatus,
  removeLive
} from '@/services/search-record';
const sc = scopedClasses('user-config-admin-account-distributor');
export default () => {
  const [dataSource, setDataSource] = useState<AdminAccountDistributor.Content[]>([]);
  const [editingItem, setEditingItem] = useState<AdminAccountDistributor.Content>({});
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 标题
    publishTime?: string; // 发布时间
    state?: number; // 状态：0发布中、1待发布、2已下架
  }>({});
  {/* 直播状态： 0:未开始，1:直播中，2:已结束 */}
  const stateObj = {
    0: '未开始',
    1: '直播中',
    2: '已结束'
  };
  const [options, setOptions] = useState<any>([]);

  const getDictionary = async () => {
    try {
      const res = await Promise.all([getLiveTypesPage(
        {
          pageIndex: 1,
          pageSize: 100,
        }
      )]);
      console.log(res[0]);
      setOptions(res[0]?.result || []);
    } catch (error) {
      message.error('服务器错误');
    }
  };
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const [form] = Form.useForm();

  const getPages = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await queryLiveVideoPage({
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

  const clearForm = () => {
    form.resetFields();
    setEditingItem({});
  };

  const remove = async (id: string) => {
    try {
      const removeRes = await removeLive(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getPages();
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 置顶状态修改
  const updateTopStatus = async (id: string, status: boolean) => {
    let params = {id, isTop: status};
    const tooltipMessage = status ? '置顶' : '取消置顶';
    const addorUpdateRes = await updateLiveStatus(params);
    if (addorUpdateRes.code === 0) {
      if (!editingItem.id) {
        message.success(`${tooltipMessage}成功！`);
      }
      getPages();
      clearForm();
    } else {
      message.error(`${tooltipMessage}失败，原因:${addorUpdateRes.message}`);
    }
  }
  // 下架/上架状态更新
  const updateOnlineStatus = async (id: string, status: boolean) => {
    let params = {id, lineStatus: status};
    const addorUpdateRes = await updateLiveStatus(params);
    if (addorUpdateRes.code === 0) {
      if (!editingItem.id) {
        message.success(`${status ? '上架' : '下架'}成功！`);
      }
      getPages();
      clearForm();
    } else {
      message.error(`${status ? '上架' : '下架'}失败，原因:{${addorUpdateRes.message}}`);
    }
  }

  const access = useAccess()

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: AdminAccountDistributor.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '直播间名称',
      dataIndex: 'title',
      isEllipsis: true,
      render: (_: string, _record: any) => (
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault(); 
            window.open(`${routeName.ANTELOPE_LIVE_MANAGEMENT_ADD}?id=${_record.id}&isDetail=1`);
          }}
        >
          {_}
        </a>
      ),
      width: 200,
    },
    {
      title: '封面',
      dataIndex: 'coverImagePath',
      isEllipsis: true,
      width: 120,
      render: (_: string, _record: any) => (
        <Image width={100} src={_} />
      ),
    },
    {
      title: '起止时间',
      dataIndex: 'startTime',
      width: 240,
      render: (_: string, _record: any) => (
        <div>开始：{_}<br></br>结束：{_record.endTime}</div>
      ),
    },
    {
      title: '主讲人',
      dataIndex: 'speakerName',
      width: 80,
    },
    {
      title: '类型',
      dataIndex: 'typeNames',
      isEllipsis: true,
      width: 280,
    },
    {
      title: '点击量',
      dataIndex: 'clickCount',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'videoStatus',
      width: 180,
      render: (_: number, record: any) => {
        return (
          <div className={`state${_}`}>
            直播状态：{Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--'}<br></br>
            上架状态：{record.lineStatus ? '线上' : '线下'}<br></br>
            置顶状态：{record.isTop ? '是' : '否'}
          </div>
        );
      },
    },
    access['P_LM_ZBGL'] && {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: AdminAccountDistributor.Content) => {
        return (
          <Space size="middle">
            {/* <Access accessible={access['P_LM_ZBGL']}> */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault(); 
                  history.push(`${routeName.ANTELOPE_LIVE_MANAGEMENT_ADD}?id=${record.id}`);
                }}
              >
                编辑
              </a>
              { 
                record.lineStatus ? (
                  <Popconfirm
                    title="确定下架么？"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => updateOnlineStatus(record.id as string, false)}
                  >
                    <a href="#">下架</a>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="确定上架么？"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => updateOnlineStatus(record.id as string, true)}
                  >
                    <a href="#">上架</a>
                  </Popconfirm>
                )
              }
              <Popconfirm
                title="确定删除么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id as string)}
              >
                <a href="#">删除</a>
              </Popconfirm>
              {
                record.isTop ? (
                  <Popconfirm
                    title={`确定取消置顶么？`}
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => updateTopStatus(record.id as string, false,)}
                  >
                    <a href="#">取消置顶</a>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title={`确定置顶么？`}
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => updateTopStatus(record.id as string, true,)}
                  >
                    <a href="#">置顶</a>
                  </Popconfirm>
                )
              }
            {/* </Access> */}
          </Space>
        );
      },
    },
  ].filter(p => p);

  useEffect(() => {
    getPages();
  }, [searchContent]);

  useEffect(() => {
    getDictionary();
  }, []);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="title" label="直播间名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="videoStatus" label="直播状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>未开始</Select.Option>
                  <Select.Option value={1}>直播中</Select.Option>
                  <Select.Option value={2}>已结束</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="typeIds" label="类型">
                <Select placeholder="请选择" allowClear mode="multiple">
                  {options?.map((item: any) => (
                    <Select.Option key={item?.id} value={item?.id}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4} offset={2}>
              <Button
                style={{ marginRight: 20 }}
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
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>直播列表(共{pageInfo.totalCount || 0}个)</span>
          <Access accessible={access['P_LM_ZBGL']}>
            <Button
              type="primary"
              key="pushRoute"
              onClick={() => {
                history.push(`${routeName.ANTELOPE_LIVE_MANAGEMENT_ADD}?isAdd=1`)
              }}
            >
              <PlusOutlined /> 新增直播
            </Button>
          </Access>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          rowKey="id"
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getPages,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
    </PageContainer>
  );
};
