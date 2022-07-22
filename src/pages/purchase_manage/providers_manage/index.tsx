import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Input, Form, message, Space, Popconfirm, Row, Col } from 'antd';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import SelfTable from '@/components/self_table';
import LiveTypesMaintain from '@/types/live-types-maintain.d';
import { getProviderPage, removeProvider, exportProvider } from '@/services/purchase';
import { routeName } from '@/../config/routes';
const sc = scopedClasses('user-config-admin-account-distributor');
export default () => {
  const [dataSource, setDataSource] = useState<LiveTypesMaintain.Content[]>([]);
  const [editingItem, setEditingItem] = useState<LiveTypesMaintain.Content>({});
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [searchContent, setSearChContent] = useState<{
    providerName?: string; // 供应商名称
  }>({});
  
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
      const { result, totalCount, pageTotal, code } = await getProviderPage({
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

  // 删除
  const remove = async (id: string) => {
    try {
      const removeRes = await removeProvider(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getPages();
      } else {
        message.error(`删除失败，原因:${removeRes.message}`);
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
      render: (_: any, _record: LiveTypesMaintain.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '供应商编号',
      dataIndex: 'providerId',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '供应商名称',
      dataIndex: 'providerName',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '供应商类型',
      dataIndex: 'providerTypeName',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '联系人',
      dataIndex: 'contactsName',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '联系人手机',
      dataIndex: 'phoneNum',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '座机号码',
      dataIndex: 'telNum',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: LiveTypesMaintain.Content) => {
        return (
          <Space size="middle">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault(); 
                history.push(`${routeName.PROVIDERS_MANAGE_ADD}?id=${record.id}&isDetail=1`)
              }}
            >
              详情
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault(); 
                history.push(`${routeName.PROVIDERS_MANAGE_ADD}?id=${record.id}`)
              }}
            >
              编辑
            </a>
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(record.id as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    getPages();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="providerName" label="供应商名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col offset={8} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary1"
                onClick={() => {
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
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>供应商列表(共{pageInfo.totalCount || 0}个)</span>
          <Space>
            <a
              key="primary3"
              className='export-btn'
              href={`/antelope-pay/mng/provider/download?providerName=${searchContent.providerName || ''}`}
            >
              导出
            </a>
            <Button
              type="primary"
              key="primary4"
              onClick={() => {
                history.push(`${routeName.PROVIDERS_MANAGE_ADD}`)
              }}
            >
              <PlusOutlined /> 新增供应商
            </Button>
          </Space>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          rowKey={'id'}
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
