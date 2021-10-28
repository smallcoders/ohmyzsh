import { Button, Table, Row, Col, Form, Input, DatePicker, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-data-analysis.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { getDataAnalyseIndexs, getDataAnalysePage } from '@/services/app-resource';
import { history } from 'umi';
import Common from '@/types/common';
import AppResource from '@/types/app-resource';
import moment from 'moment';
const sc = scopedClasses('service-config-data-analysis');

export default () => {
  const columns = [
    {
      title: '企业名称',
      dataIndex: 'orgName',
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
    },
    {
      title: '联系方式',
      dataIndex: 'contactNumber',
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  /**
   * table 数据源
   */
  const [dataSource, setDataSource] = useState<AppResource.DataAnalyseContent[]>([]);
  /**
   * 数据分析指标
   */
  const [dataAnalysisIndex, setDataAnalysisIndex] = useState<{
    clickCount: number; //点击次数
    collectCount: number; //收藏次数
    tryCount: number; //试用次数
  }>();
  /**
   * 分页信息
   */
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });
  /**
   * 搜索表单
   */
  const [searchContent, setSearChContent] = useState<AppResource.SearchBody>();
  /**
   * 搜索表单 form
   */
  const [searchForm] = Form.useForm();
  const prepare = async () => {
    try {
      const { appId, type } = history.location.query;

      if (appId && type) {
        const indexsRs = await getDataAnalyseIndexs(appId);
        if (indexsRs.code === 0) {
          setSearChContent({ ...setSearChContent, appId: appId as string, type: parseInt(type) });
          setDataAnalysisIndex(indexsRs.result);
        } else {
          message.error(`获取数据分析指标数据失败，原因:{${indexsRs.message}}`);
        }
      } else {
        history.push('/service-config/app-resource');
      }
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    const { result, totalCount, pageTotal, code } = await getDataAnalysePage({
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
  };

  const onTableChange = (page: number, pageSize?: number | undefined) => {
    getPage(page, pageSize);
  };

  useEffect(() => {
    prepare();
  }, []);

  useEffect(() => {
    if (searchContent?.appId && (searchContent?.type || searchContent?.type === 0)) {
      getPage();
    }
  }, [searchContent]);

  const getIndexs = (): React.ReactNode => {
    return (
      <div className={sc('container-indexs')}>
        <span className={'title'}>当前关键指标</span>
        <div>
          <div>
            <span>点击(次)</span>
            <span>{dataAnalysisIndex?.clickCount || 0}</span>{' '}
          </div>
          <div>
            <span>收藏(次)</span>
            <span>{dataAnalysisIndex?.collectCount || 0}</span>{' '}
          </div>
          <div>
            <span>试用申请(次)</span>
            <span>{dataAnalysisIndex?.tryCount || 0}</span>{' '}
          </div>
        </div>
      </div>
    );
  };

  const getSelfTags = (
    options: { title: string; value?: number }[],
    selected: undefined | number,
    onChange: React.Dispatch<React.SetStateAction<undefined | number>>,
  ): React.ReactNode =>
    options.map((p) => (
      <span
        onClick={() => onChange(p.value)}
        className={p.value === selected ? 'tag tag-selected' : 'tag'}
      >
        {p.title}
      </span>
    ));

  return (
    <PageContainer className={sc('container')}>
      {getIndexs()}
      <div className={sc('container-table-header')}>
        <div className="title">数据指标分析</div>
        <div style={{ padding: '20px 5px' }}>
          {' '}
          <span className={'tag'} style={{ marginRight: 0 }}>
            数据指标：
          </span>{' '}
          {getSelfTags(
            [
              { title: '点击', value: 0 },
              { title: '收藏', value: 1 },
              { title: '试用申请', value: 2 },
            ],
            searchContent?.type,
            (type: any) => {
              setSearChContent({ ...searchContent, type } as AppResource.SearchBody);
            },
          )}
        </div>
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} form={searchForm}>
          <Row>
            <Col span={5}>
              <Form.Item name="orgName" label="企业名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="operateTime" label="时间区间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.operateTime) {
                    search.beginOperateTime = moment(search.operateTime[0]).format(
                      'YYYY-MM-DDTHH:mm:ss',
                    );
                    search.endOperateTime = moment(search.operateTime[1]).format(
                      'YYYY-MM-DDTHH:mm:ss',
                    );
                  }
                  setSearChContent({ ...searchContent, ...search });
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  const { appId, type } = history.location.query;
                  setSearChContent({ appId: appId as string, type: parseInt(type) });
                  searchForm.resetFields();
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className={sc('container-table-body')}>
        <Table
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: onTableChange,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
          bordered
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    </PageContainer>
  );
};
