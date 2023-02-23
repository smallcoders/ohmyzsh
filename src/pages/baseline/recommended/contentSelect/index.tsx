import React, {useEffect, useState} from "react";
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import moment from "moment/moment";
import type Common from "@/types/common";
import { getArticlePage, getArticleType } from "@/services/baseline";
import {routeName} from "../../../../../config/routes";
import { isEmpty } from "lodash";
import { jsonTransform } from '@/utils/util'

import {Button, Col, Form, Input, Row, Modal, Select, message, Tag} from "antd";
import SelfTable from "@/components/self_table";

export default (props: any) => {
  const [modalVisible, setModalVisible] = useState(props.visible)
  const [loading, setLoading] = useState<boolean>(false);
  const [searchContent, setSearChContent] = useState<any>({});
  const sc = scopedClasses('baseline-topic-add');
  const [types, setTypes] = useState<any[]>([]);
  const [contentSelectDataSource, setContentSelectDataSource] = useState<any>([]);
  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };
  const [pageSelectInfo, setPageSelectInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
    pageTotal: 0,
  });
  const [searchForm] = Form.useForm();
  const [selectRowKeys, setSelectRowKeys] = useState<any>([])
  const [selectRows, setSelectRows] = useState<any>([])

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



  useEffect(() => {
    setSelectRowKeys([props.currentSelect.id])
    setSelectRows(isEmpty(props.currentSelect) ? [] : [props.currentSelect])
  }, [props.currentSelect])

  const onSelectChange = (newSelectedRowKeys: React.Key[],selectedRows: any[]) => {
    console.log(newSelectedRowKeys, selectedRows)
    setSelectRowKeys(newSelectedRowKeys);
      setSelectRows(selectedRows)
  };

  const rowSelection = {
    preserveSelectedRowKeys: true,
    selectedRowKeys:selectRowKeys,
    onChange: onSelectChange,
  };



    // 获取选择管理内容详情页
    const getPage = async (pageIndex: number = 1, pageSize = pageSelectInfo.pageSize) => {
      setLoading(true);
      try {
        const { result, totalCount, pageTotal, code } = await getArticlePage({
          pageIndex,
          pageSize,
          ...searchContent,
          status: '1'
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
      setPageSelectInfo({
        ...pageSelectInfo,
        pageIndex: 1,
      })
      setModalVisible(props.visible)
      searchForm.resetFields()
      setSelectRowKeys(props.currentSelect.id ? [props.currentSelect.id] : [])
      setSelectRows(props.currentSelect)
      setSearChContent({});
    }, [props.visible])

    useEffect(() => {
      getPage();
    }, [searchContent]);


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
        render: (_: any) => _ || '/'
      },
      {
        title: '来源',
        dataIndex: 'source',
        isEllipsis: true,
        width: 300,
        render: (_: any) => _ || '/'
      },
      {
        title: '作者',
        dataIndex: 'author',
        isEllipsis: true,
        width: 150,
        render: (_: any) => _ || '/'
      },
      {
        title: '关键词',
        dataIndex: 'keywords',
        isEllipsis: true,
        width: 300,
        render: (val: string) => jsonTransform(val)
      },
      {
        title: '内容类型',
        dataIndex: 'types',
        render: (_: any[]) => _?.length > 0 ? _?.map(p => p.typeName).join('、') : '/',
        width: 200,
      },
      {
        title: '标签',
        dataIndex: 'labels',
        render: (_: any[]) => _?.length === 0 ? '/' :  _?.map((item: any) => <Tag key={item.id}>{item.labelName}</Tag>),
        width: 300,
      },
      {
        title: '发布时间',
        dataIndex: 'publishTime',
        isEllipsis: true,
        render: (_: string) => _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '/',
        width: 250,
      },
      {
        title: '上架时间',
        dataIndex: 'createTime',
        isEllipsis: true,
        render: (_: string) => _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '/',
        width: 250,
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
              <Form.Item name="type" label="类型选择">
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
              <Form.Item name="labels" label="标签">
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


  return (<Modal
    title={'内容选择'}
    visible={modalVisible}
    maskClosable={false}
    width={1200}
    onCancel={() => {
      props.setContentModalVisible(false);
    }}
    bodyStyle={{
      height: '600px',
      overflow: 'auto'
    }}
    centered
    destroyOnClose
    onOk={() => {
      if (isEmpty(selectRows)) {
        message.error('请选择数据')
        return
      }
      props.setCurrentSelect(selectRows[0])
      props.setContentModalVisible(false);
    }}
  >
    {useSearchNode()}
    <SelfTable
      loading={loading}
      rowSelection={{
        type: 'radio',
        ...rowSelection,
      }}
      style={{maxHeight: '500px'}}
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
  </Modal>)
}
