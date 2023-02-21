import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, Row, Modal, Select, message, InputNumber, Breadcrumb} from "antd";
import SelfTable from "@/components/self_table";
import type Common from "@/types/common";
import {history} from "@@/core/history";
import moment from "moment/moment";
import {routeName} from "../../../../../config/routes";
import type { PaginationProps } from 'antd';
import { getArticlePage, getArticleType} from "@/services/baseline";
import {addHotRecommend, getHotRecommendDetail, queryByIds} from "@/services/topic";
import {Link} from "umi";
const sc = scopedClasses('baseline-topic-add');
const statusObj = {
  0: '下架',
  1: '上架',
};
export default () => {
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [types, setTypes] = useState<any[]>([]);
  const [contentSelectDataSource, setContentSelectDataSource] = useState<any>([]);
  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };
  const [searchForm] = Form.useForm();
  const [form] = Form.useForm();
  const [selectRowKeys, setselectRowKeys] = useState<any>([])
  const [selectRows, setSelectRows] = useState<any>([])
  const [dataSource, setDataSource] = useState<any>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [pageSelectInfo, setPageSelectInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
    pageTotal: 0,
  });
  const [pageInfo, setPageInfo] = useState<any>({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
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

  const { query } = history.location as any;
  const getHotRecommendDetailById = (pageIndex: number = 1, pageSize = query?.contentCount) =>{
    getHotRecommendDetail({id:query?.id, pageIndex,
      pageSize,}).then(res=>{
      if (res.code === 0){
        form.setFieldsValue(res?.result)
        // setDataSource(res?.result.list)

        setSelectRows(res?.result.list)
        const newArray: any = []
           res?.result.list.forEach((item: any)=>{newArray.push(item.articleId)})
        setselectRowKeys([...newArray])
        queryByIds([...newArray]).then(result=>{
          if (result.code === 0){
            setDataSource(result?.result)
          }
        })
        setPageInfo({
          pageIndex: res?.result.pageIndex,
          pageSize: 5,
          totalCount: res?.result.contentCount,
          pageTotal: 0,
        })
      }
    })
  }

  useEffect(() => {
    getHotRecommendDetailById();
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
        setContentSelectDataSource([...result]);
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

  // 上架
  const addRecommend = async (state: number) => {
    form
      .validateFields()
      .then(async (value) => {
        const {topic,weight}=value
        const submitRes = await addHotRecommend({
          topic,
          weight,
          enable:1,
          id:query?.id,
          articleIds:selectRowKeys
        });
        if (submitRes.code === 0) {
          history.goBack()
          message.success(state==1?'上架成功':'暂存成功')
        } else {
          message.error(`${submitRes.message}`);
        }
      })
      .catch((e) => {
        console.log(e)
      });
  };

  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    setPageInfo({
      pageIndex: pageNumber,
      pageSize: 5,
      totalCount: dataSource.length || 0,
    })
  };
  const reMove = (record: any) => {
      const newRowKeys = selectRowKeys.filter((item: any) =>{ return item !== record})
      const newDataSource = dataSource.filter((item: any) =>{ return item.id !== record})
      setselectRowKeys(newRowKeys)
      setDataSource(newDataSource)
    setPageInfo({
      pageIndex: 1,
      pageSize: 5,
      totalCount: newDataSource.length || 0,
    })
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
              window.open(routeName.BASELINE_CONTENT_MANAGE_DETAIL + `?id=${query?.id ?record.articleId:record?.id}`);
            }}>
              详情
            </Button>
        <Button type="link" onClick={() => {
            reMove( record.id as string)
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
  const onSelectChange = (newSelectedRowKeys: React.Key[],selectedRows: any[]) => {
      setselectRowKeys(newSelectedRowKeys);
      setSelectRows(selectedRows)
       setPageInfo({
            pageIndex: 1,
            pageSize: 5,
            totalCount:selectedRows.length || 0,
          })
  };

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys:selectRowKeys,
    onChange: onSelectChange,
  };
  return (
    <PageContainer className={sc('container')}
                   header={{
                     title: query?.id ? `编辑` : '新增',
                     breadcrumb: (
                       <Breadcrumb>
                         <Breadcrumb.Item>
                           <Link to="/baseline">基线管理</Link>
                         </Breadcrumb.Item>
                         <Breadcrumb.Item>
                           <Link to="/baseline/baseline-topic-manage">话题管理 </Link>
                         </Breadcrumb.Item>
                         <Breadcrumb.Item>
                           {query?.id ? `编辑` : '新增'}
                         </Breadcrumb.Item>
                       </Breadcrumb>
                     ),
                   }}
                   footer={[
                     <Button type="primary" onClick={() => {
                       addRecommend(1)
                     }}>上架</Button>,
      <Button style={{marginRight:'40px'}} onClick={() =>{
        if(formIsChange ){
          Modal.confirm({
            title: '提示',
            content: '之前填写的信息还未上架，确定离开吗？',
            okText: '确定离开',
            onOk: () => {
              history.goBack()
            },
            cancelText: '取消',
          }) }else{  history.goBack()}
      }
      }>返回</Button>
                   ]}>
      <div className={sc('container-table-body')}>
        <Form form={form}  onValuesChange={() => {
          setFormIsChange(true);
        }}>
        <Row className={'title'}>
          <Col span={10}>
              <Form.Item name="topic" label="话题"
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
              <InputNumber style={{width:'100%'}} placeholder="请输入1~100的整数，数字越大排名越小" min={1} max={100}/>
            </Form.Item>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={24}>
            <Form.Item name="title" required label="关联内容"
                       rules={[
              {
                required: true,
                message: '必填',
                validator: () => {
                  if (
                    dataSource.length!==0
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('必填'));
                },
              },
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
                columns={columns}
                dataSource={dataSource}
                pagination={
                  pageInfo.totalCount === 0
                    ? false
                    : {
                      onChange: onChange,
                      total: pageInfo.totalCount,
                      current: pageInfo.pageIndex,
                      pageSize: pageInfo.pageSize,
                      showTotal: (total: number) =>
                        `共${total}条记录 第${pageInfo.pageIndex}/${Math.ceil(pageInfo.totalCount / pageInfo.pageSize) || 1}页`,
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
          onOk={() => {
              setPageInfo({
                pageIndex: 1,
                pageSize: 5,
                totalCount: [...selectRows].length || 0,
              })
            queryByIds([...selectRowKeys]).then(res=>{
              if (res.code === 0){
                setDataSource(res?.result)
              }
            })
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
                  onChange: getPage ,
                  total: pageSelectInfo.totalCount,
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
