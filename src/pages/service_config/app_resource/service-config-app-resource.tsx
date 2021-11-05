// @ts-ignore
/* eslint-disable */
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Table, Form, Select, Row, Col, message, Space, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-app-resource.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { history, Link } from 'umi';
import {
  getAppSourcePage,
  getAppTypes,
  offShelf,
  removeAppSource,
  topApp,
} from '@/services/app-resource';
import Common from '@/types/common';
import AppResource from '@/types/app-resource.d';
import { routeName } from '../../../../config/routes';
const sc = scopedClasses('service-config-app-resource');

export default () => {
  /**
   * 应用类型
   */
  const [appTypes, setAppTypes] = useState<{ id: string; name: string }[]>([]);
  /**
   * table数据源
   */
  const [dataSource, setDataSource] = useState<AppResource.Content[]>([]);
  /**
   * 分页
   */
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });
  /**
   * 搜索表单以及tags
   */
  const [searchContent, setSearChContent] = useState<{
    name?: string; // 应用名称
    orgName?: string; // 所属厂商
    isTopApp?: string; // 尖刀应用，0否，1是
    releaseStatus?: string; //状态，1发布中、0已下架
    label?: string; // 标签
    type?: string; // 类型
  }>({});

  /**
   * 获取分页数据
   * @param pageIndex
   * @param pageSize
   */
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    const { result, totalCount, pageTotal, code } = await getAppSourcePage({
      pageIndex,
      pageSize,
      ...searchContent,
    } as Common.ResultPage & { label?: string; type?: string });
    if (code === 0) {
      setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
      setDataSource(result);
    } else {
      message.error(`请求分页数据失败`);
    }
  };

  /**
   * 搜索表单变化 副作用
   */
  useEffect(() => {
    getPage();
  }, [searchContent]);

  /**
   * 准备字典 应用类型
   */
  const prepare = async () => {
    try {
      const prepareResultArray = await getAppTypes(); //Promise.all([getAppTypes(), getTopApps()])
      setAppTypes(prepareResultArray.result);
      // setTopApps(prepareResultArray[1].result)
    } catch (error) {
      message.error('获取初始数据失败');
    }
  };

  /**
   * 准备数据
   */
  useEffect(() => {
    prepare();
  }, []);

  /**
   * 下架
   * @param id
   */
  const off = async (id: string) => {
    const tooltipMessage = '下架';
    const hide = message.loading(`正在${tooltipMessage}`);
    const updateStateResult = await offShelf(id);
    hide();
    if (updateStateResult.code === 0) {
      message.success(`${tooltipMessage}成功`);
      await getPage();
    } else {
      message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
    }
  };

  /**
   * 置顶
   * @param id
   */
  const top = async (id: string) => {
    const tooltipMessage = '置顶';
    const hide = message.loading(`正在${tooltipMessage}`);
    const updateStateResult = await topApp(id);
    hide();
    if (updateStateResult.code === 0) {
      message.success(`${tooltipMessage}成功`);
      await getPage();
    } else {
      message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
    }
  };

  /**
   * 删除
   * @param id
   */
  const remove = async (id: string) => {
    const hide = message.loading(`正在删除`);
    const removeRes = await removeAppSource(id);
    hide();
    if (removeRes.code === 0) {
      message.success(`删除成功`);
      getPage();
    } else {
      message.error(`删除失败，原因:{${removeRes.message}}`);
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'priority',
    },
    {
      title: '应用名称',
      dataIndex: 'name',
    },
    {
      title: '应用类型',
      dataIndex: 'typeName',
    },
    {
      title: '应用标签',
      dataIndex: 'label',
    },
    {
      title: '所属厂商',
      dataIndex: 'orgName',
    },
    {
      title: '尖刀应用',
      dataIndex: 'isTopApp',
      render: (_: number) => (_ === 0 ? '否' : '是'),
    },
    {
      title: '状态',
      dataIndex: 'releaseStatus',
      render: (_: number) => {
        return _ === 0 ? (
          <div className={`state${_}`}>已下架</div>
        ) : (
          <div className={`state${_}`}>发布中</div>
        );
      },
    },
    {
      title: '数据分析(次)',
      dataIndex: 'dataAnalyseKeyQuotaVO',
      render: (
        item: { clickCount: number; collectCount: number; tryCount: number },
        record: AppResource.Content,
      ) => {
        return (
          <div>
            点击：
            <Link
              style={{ marginRight: 20 }} // todo 变量名
              to={`/service-config/app-resource/data-analysis?appId=${record.id}&type=0`}
            >
              {item?.clickCount || 0}
            </Link>
            收藏：
            <Link
              style={{ marginRight: 20 }}
              to={`/service-config/app-resource/data-analysis?appId=${record.id}&type=1`}
            >
              {item?.collectCount || 0}
            </Link>
            试用申请：
            <Link
              style={{ marginRight: 20 }}
              to={`/service-config/app-resource/data-analysis?appId=${record.id}&type=2`}
            >
              {item?.tryCount || 0}
            </Link>
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_: any, record: AppResource.Content) => {
        return (
          <Space size="middle">
            <a
              href="#"
              onClick={() => {
                history.push(`${routeName.ADD_APP_RESOURCE}?id=${record.id}`);
              }}
            >
              编辑
            </a>
            {record.isTopApp === 0 && (
              <Popconfirm
                title="确定删除么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id as string)}
              >
                <a href="#">删除</a>
              </Popconfirm>
            )}
            {record.isTopApp === 0 && record.releaseStatus === 1 && (
              <Popconfirm
                title="确定下架么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => off(record.id as string)}
              >
                <a href="#">下架</a>
              </Popconfirm>
            )}
            {record.releaseStatus === 1 && (
              <a href="#" onClick={() => top(record.id as string)}>
                置顶
              </a>
            )}
          </Space>
        );
      },
    },
  ];

  /**
   * 搜索表单
   * @returns
   */
  const GetSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={5}>
              <Form.Item name="name" label="应用名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="orgName" label="所属厂商">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="isTopApp" label="尖刀应用">
                <Select placeholder="请选择">
                  <Select.Option value={0}>否</Select.Option>
                  <Select.Option value={1}>是</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="releaseStatus" label="当前状态">
                <Select placeholder="请选择">
                  <Select.Option value={0}>已下架</Select.Option>
                  <Select.Option value={1}>发布中</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary"
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

  /** // todo 拿出来
   * 自定义tags
   */
  const getSelfTags = (
    options: { id?: string | number; name?: string }[],
    selected: string | undefined,
    onChange: { (type: any): void; (label: any): void; (arg0: string): void },
  ): React.ReactNode =>
    options.map((p) => (
      <span
        key={p.id || '' + p.name}
        onClick={() => onChange(p.id as string)}
        className={p.id === selected ? 'tag tag-selected' : 'tag'}
      >
        {p.name}
      </span>
    ));

  return (
    <PageContainer className={sc('container')}>
      {GetSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>应用列表(共{pageInfo.totalCount}个)</span>
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push(routeName.ADD_APP_RESOURCE);
            }}
          >
            <PlusOutlined /> 新增
          </Button>
        </div>
        <Row style={{ padding: '5px 0' }}>
          {' '}
          <span className={'tag'} style={{ marginRight: 0 }}>
            类型：
          </span>{' '}
          {getSelfTags(
            [{ name: '全部', id: undefined }, ...appTypes],
            searchContent.type,
            (type: any) => {
              setSearChContent({ ...searchContent, type });
            },
          )}
        </Row>
        <Row style={{ padding: '5px 0' }}>
          {' '}
          <span className={'tag'} style={{ marginRight: 0 }}>
            标签：
          </span>{' '}
          {getSelfTags(
            [
              { name: '全部', id: undefined },
              { name: '支持试用', id: 0 },
              { name: '平台精选', id: 1 },
              { name: '其他', id: 2 },
            ],
            searchContent.label,
            (label: any) => {
              setSearChContent({ ...searchContent, label });
            },
          )}
        </Row>
      </div>
      <div className={sc('container-table-body')}>
        <Table
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getPage,
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
