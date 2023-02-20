import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, Row, Modal, Select, message} from "antd";
import type LogoutVerify from "@/types/user-config-logout-verify";
import SelfTable from "@/components/self_table";
import type Common from "@/types/common";
import {history} from "@@/core/history";
import moment from "moment/moment";
import {routeName} from "../../../../../config/routes";
import {deleteArticle, getArticlePage, getArticleTags, getArticleType} from "@/services/baseline";
import type NeedVerify from "@/types/user-config-need-verify";
const sc = scopedClasses('baseline-topic-add');
const statusObj = {
  0: '下架',
  1: '上架',
  2: '暂存',
};
export default () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [types, setTypes] = useState<any[]>([]);
  const [contentSelectDataSource, setContentSelectDataSource] = useState<NeedVerify.Content[]>([]);
  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };
  const [searchForm] = Form.useForm();
  const [selectKey, setSelectKey] = useState<any>({})
  const [dataSource, setDataSource] = useState<any>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [pageSelectInfo, setPageSelectInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
    pageTotal: 0,
  });
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
    pageTotal: 0,
  });

  const prepare = async () => {
    try {
      const res = await getArticleType();
      setTypes(res.result || []);
    } catch (error) {
      message.error('获取数据失败');
    }
  };
  useEffect(() => {
    prepare();
  }, []);
  // 获取选择管理内容详情页
  const getPage = async (pageIndex: number = 1, pageSize = pageSelectInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await getArticlePage({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageSelectInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setContentSelectDataSource(result);
        setLoading(false);
      } else {
        message.error(`请求分页数据失败`);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getPage();
  }, [searchContent]);

  const reMove = (record: any) => {
    const newDataSource=dataSource.map((item: any)=>{
      if (item.id !== record.id){
        return item
      }
    })
    // const newDataSource = dataSource.filter((item: any)=>{
    //   return item.id.match(record.id)
    // })
    setDataSource(newDataSource)
  }
  const onDelete = async (id: string) => {
    try {
      const updateStateResult = await deleteArticle(id);
      if (updateStateResult.code === 0) {
        message.success(`删除成功`);
        getPage();
      } else {
        message.error(`操作失败，请重试`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: LogoutVerify.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      isEllipsis: true,
      width: 200,
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
              window.open(routeName.BASELINE_CONTENT_MANAGE_DETAIL + `?id=${record?.id}`);
            }}>
              详情
            </Button>
        <Button type="link" onClick={() => {
          reMove(record.id as string)
        }}>
          删除
        </Button>
          </div>
        )
      },
    },
  ];
  const contentSelectColumns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageSelectInfo.pageSize * (pageSelectInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '来源',
      dataIndex: 'source',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '作者',
      dataIndex: 'author',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '关键词',
      dataIndex: 'keywords',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '内容类型',
      dataIndex: 'types',
      render: (_: any[]) => _?.length > 0 ? _?.map(p => p.typeName).join(',') : '--',
      width: 200,
    },
    {
      title: '标签',
      dataIndex: 'labels',
      render: (_: any[]) => _?.length > 0 ? _?.map(p => p.labelName).join(',') : '--',
      width: 200,
    },

    {
      title: '内容状态',
      dataIndex: 'status',
      isEllipsis: true,
      render: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(statusObj, _) ? statusObj[_] : '--'}
          </div>
        );
      },
      width: 150,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      isEllipsis: true,
      render: (_: string) => _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--',
      width: 250,
    },
    {
      title: '上架时间',
      dataIndex: 'createTime',
      isEllipsis: true,
      render: (_: string) => _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--',
      width: 250,
    },
    {
      title: '审核备注',
      dataIndex: 'auditCommon',
      isEllipsis: true,
      width: 200,
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
              window.open(routeName.BASELINE_CONTENT_MANAGE_DETAIL + `?id=${record?.id}`);
            }}>
              详情
            </Button>
            <Button type="link" onClick={() => {
              Modal.confirm({
                title: '删除数据',
                content: '删除该内容后，系统将不再推荐该内容，确定删除？',
                onOk: () => { onDelete(record?.id) },
                okText: '删除'
              })
            }}>
              删除
            </Button>
          </div>
        )
      },
    },
  ];
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="title" label="标题">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="publishState" label="类型选择">
                <Select placeholder="请选择" allowClear style={{ width: '200px'}}>
                  {types?.map((item: any) => (
                    <Select.Option key={item?.id} value={Number(item?.id)}>
                      {item?.typeName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="publisher" label="标签">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button
                style={{ margin:'0 20px' }}
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
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectKey(selectedRows)
    },
    getCheckboxProps: (record: any) => (
      {
      name: record.name,
    }),
  };
  return (
    <PageContainer className={sc('container')} footer={[
                     <Button type="primary">上架</Button>,
                     <Button>暂存</Button>,
                     <Button onClick={() => {
                       history.push(`/baseline/baseline-topic-manage`);
                     }}>返回</Button>
                   ]}>
      <div className={sc('container-table-body')}>
        <Form>
        <Row className={'title'}>
          <Col span={10}>
              <Form.Item name="topicName" label="话题"
                         rules={[
                           {
                             required: true,
                             message: `必填`,
                           },
                         ]}>
                <Input placeholder="请输入" />
              </Form.Item>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={10}>
            <Form.Item name="weight" label="权重" rules={[
              {
                required: true,
                message: `必填`,
              },
            ]}>
              <Input placeholder="请输入1~100的整数，数字越大排名越小" />
            </Form.Item>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={24}>
            <Form.Item name="content" label="关联内容" rules={[
            ]}>
              <Button
                type="primary"
                key="addStyle"
                style={{marginBottom:'16px'}}
                onClick={()=>{
                  setModalVisible(true);
                }}
              >
                选择
              </Button>
              <SelfTable
                bordered
                // scroll={{ x: 1480 }}
                columns={columns}
                dataSource={dataSource}
                pagination={
                  pageInfo.totalCount === 0
                    ? false
                    : {
                      total: pageInfo.totalCount,
                      current: pageInfo.pageIndex,
                      pageSize: pageInfo.pageSize,
                      showTotal: (total: number) =>
                        `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                    }
                }
              />
            </Form.Item>

          </Col>
        </Row>
        </Form>
        <Modal
          title={'内容选择'}
          visible={modalVisible}
          maskClosable={false}
          width={1200}
          onCancel={() => {
            setModalVisible(false);
          }}
          centered
          destroyOnClose
          onOk={async () => {
            const newDataSource = [...dataSource,...selectKey]
            setDataSource(newDataSource)
            setModalVisible(false);
          }}
        >
          {useSearchNode()}
          <SelfTable
            loading={loading}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            scroll={{ x: 1480 }}
            rowKey={'id'}
            pagination={
              pageSelectInfo.totalCount === 0
                ? false
                : {
                  onChange: getPage,
                  total: pageSelectInfo.totalCount,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  current: pageSelectInfo.pageIndex,
                  pageSize: pageSelectInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageSelectInfo.pageIndex}/${pageSelectInfo.pageTotal || 1}页`,
                }
            }
            columns={contentSelectColumns}
            dataSource={contentSelectDataSource}
          />
        </Modal>
      </div>
    </PageContainer>
  );
};
