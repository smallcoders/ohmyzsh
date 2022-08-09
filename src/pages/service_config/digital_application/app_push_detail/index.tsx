import './app_push_detail.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';

import {
  Button,
  Input,
  Form,
  Row,
  Col,
  message,
  Tooltip
} from 'antd';

import useQuery from '@/hooks/useQuery';

import SelfTable from '@/components/self_table';
import type { ColumnsType } from 'antd/es/table';

import {
  getApplicationPushList,
  getPushDetail
} from '@/services/digital-application';

import ApplicationManager from '@/types/service-config-digital-applictaion';
import Common from '@/types/common';

const sc = scopedClasses('service-config-digital-app-push-detail');
export default () => {

  const query = useQuery();

  const [searchContent, setSearchContent] = useState<{
    orgName?: string // 组织名称
    appName?: string; // 应用名称
  }>({});

  const [pushDetail, setPushDetail] = useState<ApplicationManager.PushDetail[]>([]);

  const [dataSource, setDataSource] = useState<ApplicationManager.PushDetail[]>([]);

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const [searchForm] = Form.useForm();

  useEffect(() => {
    if (query.id) {
      getDetailInfo(query.id);
    }
  }, [query]);

  useEffect(() => {
    getPushList()
  }, [searchContent]);

  const getDetailInfo = async (bagId: string) => {
    const { result, code } = await getPushDetail({ bagId })
    if (code === 0) {
      setPushDetail(result)
    } else {
      message.error(`请求分页数据失败`);
    }
  }

  const getPushList = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getApplicationPushList({
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


  const basePushInfoNode = (): React.ReactNode => {
    return (
      <div className={sc('container-base-info')}>
        <div className='title'>基本信息</div>
        <div className='info'>
          <div className='row'>
            <span className='label'>推送时间：</span>
            <span className='content'>2022-07-31 15:30:00</span>
            <span className='label pl50'>领用有效时间：</span>
            <span className='content'>2022-07-31 15:30:00 - 2022-08-31 15:30:00</span>
          </div>
          <div className='row'>
            <span className='label'>推送应用：</span>
            <Tooltip title="prompt text">
              <span className='content'>应用名称1、应用名称2、应用名称3、应用名称4、应用名称4、应用名称4、应用名称4、应用名称4、应用名称1、应用名称2、应用名称3、应用名称4、应用名称4、应用名称4、应用名称4、应用名称4、应用名称1、应用名称2、应用名称3、应用名称4、应用名称4、应用名称4、应用名称4、应用名称4、应应用名称1、应用名称</span>
            </Tooltip>
          </div>
          <div className='row'>
            <span className='label'>推送企业：</span>
            <Tooltip title="prompt text">
              <span className='content'>上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公司、上海XX能源科技有限公</span>
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }


  const useSearchNode = (): React.ReactNode => {
    
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row justify="space-between">
            <Row>
              <Col>
                <Form.Item name="appName" label="应用名称">
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col style={{ marginLeft: '20px' }}>
                <Form.Item name="orgName" label="领用企业">
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
            </Row>
            <Col>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  setSearchContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  searchForm.resetFields();
                  setSearchContent({});
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

  const columns: ColumnsType<ApplicationManager.Content> = [
    { title: '序号', dataIndex: 'sort', width: 60, render: (_: any, _record: any, index: number) => index + 1 },
    { title: '应用名称', dataIndex: 'appName', width: 200 },
    { title: '领用企业', dataIndex: 'orgNames', render: (_: any, row: any) => {
        return (
          <Tooltip title={row.orgNames}>
            {
              row.orgNames ? <span className='textoverflow2'>{row.orgNames}</span> : <span style={{ color: '#999' }}>暂无</span>
            }
          </Tooltip>
        )
      }
    },
  ]

  return (
    <PageContainer
      title="推送详情"
      className={sc('container')}
    >
      {basePushInfoNode()}
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>可推送应用列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey={'id'}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getApplicationPushList,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    </PageContainer>
  );
};
