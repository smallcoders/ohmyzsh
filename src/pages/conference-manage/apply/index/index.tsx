import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, message, Row, Select} from "antd";
import SelfTable from "@/components/self_table";
import type Common from "@/types/common";
import {queryHotRecommend} from "@/services/topic";
import {history} from "@@/core/history";
import {useAccess,Access} from "@@/plugin-access/access";


export default () => {
  // // 拿到当前角色的access权限兑现
  const access = useAccess()
  const sc = scopedClasses('conference-apply');
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
  const [searchContent, setSearChContent] = useState<any>({});
  // 搜索模块
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="topic" label="会议名称">
                <Input placeholder="请输入" allowClear  autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="publicUserName" label="会议主题">
                <Input placeholder="请输入" allowClear  autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="enable" label="会议联系人">
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


  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '会议名称',
      dataIndex: 'topic',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '会议主题',
      dataIndex: 'contentCount',
      width: 120,
    },
    {
      title: '报名人数',
      dataIndex: 'weight',
      width: 80,
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <div className={sc('container-option')}>
              {/* <Button type="link" onClick={() => {
                history.push(`/baseline/baseline-topic-manage/detail?recommendId=${record?.id}`)
              }}>
                详情
              </Button> */}
              <Button type="link" onClick={() => {
                history.push(`/conference-manage/apply/detail?id=${record.id}`)
              }}>
                查看
              </Button>
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
            history.push(`/baseline/baseline-topic-manage/add`)
          }}
        >
          新增会议报名
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
