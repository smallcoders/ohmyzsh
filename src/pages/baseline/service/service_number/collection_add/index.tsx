import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Button,
  Input,
  Form,
  Select,
  Breadcrumb,
  Radio,
  DatePicker,
  Image,
  Space,
  Popconfirm,
  Modal,
  message,
  Switch,
  Row,
  Col,
} from 'antd';
import SelfTable from '@/components/self_table';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../../../config/routes';
import { history, Link, useAccess, Access, Prompt } from 'umi';
import './index.less';
import { PlusOutlined } from '@ant-design/icons';
import {
  httpCollectionListArticle,
  httpCollectionListArticleByParam,
  httpCollectionDetail,
  httpCollectionPageCollectionArticleSearch,
  httpServiceAccountCollectionSave,
} from '@/services/service-management';
import type Common from '@/types/common';
const sc = scopedClasses('service-number-collection-add');

type RouterParams = {
  appId?: string;
  type?: string;
  state?: string;
  id?: string;
  name?: string;
};
// 状态
const stateColumn = {
  NOT_SUBMITTED: '暂存',
  ON_SHELF: '已发布',
  OFF_SHELF: '已下架',
  APPOINTMENT_ON_SHELF: '预约发布',
};
export default () => {
  const access: any = useAccess();
  // const { backid, backname } = props || {}
  /**
   * 当前的新增还是编辑
   */
  const [activeTitle, setActiveTitle] = useState<any>('新增');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCurrent, setLoadingCurrent] = useState<boolean>(false);
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  // 发布信息form
  const [formMessage] = Form.useForm();
  // 发布信息的改变
  const [formPostMessageChange, setFormPostMessageChange] = useState<boolean>(false);
  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(false);
  // 发布中
  const [isExporting, setIsExporting] = useState<boolean>(false);
  //连续阅读
  const [isHOt, setIsHot] = useState<boolean>(true);
  // 根据路由获取参数
  const {
    type,
    state = 'tuwen',
    id,
    name = '',
    backid,
    backname,
    activeTab,
  } = history.location.query as RouterParams;
  // 合集标签路径
  const collectionUrl = `/baseline/baseline-service-number/management?id=${backid}&name=${backname}&activeTabValue=${'合集标签'}`;

  useEffect(() => {
    console.log('合集标签ADD', type, id, backid, backname);
    setActiveTitle(type === 'add' ? '新增' : '编辑');
    if (id) {
      Promise.all([_httpCollectionListArticle(), _httpCollectionDetail()]);
    } else {
      // 给文末连续阅读默认值
      formMessage.setFieldsValue({ continuousRead: true });
    }

    // 如果是编辑
    // formMessage.setFieldsValue({'文末连续阅读': true})
    // setIsHot(false)
  }, [type]);

  useEffect(() => {
    if (formPostMessageChange) {
      setIsClosejumpTooltip(true);
    }
  }, [formPostMessageChange]);

  const onSubmit = () => {
    Promise.all([formMessage.validateFields()]).then(async ([formMessageValues]) => {
      console.log('收集的内容信息', formMessageValues);
      const { name, continuousRead } = formMessageValues;
      console.log('收集的文章', selectedRowList);
      if (selectedRowList?.length === 0) return message.warning(`合集文章不能为空`);
      let articleList = selectedRowList?.map((item: any) => {
        return {
          id: item.articleId,
          top: item.top,
        };
      });
      setIsExporting(true);
      try {
        const res = await httpServiceAccountCollectionSave({
          serviceAccountId: backid,
          id: type === 'add' ? undefined : Number(id),
          name,
          continuousRead,
          articleList,
        });
        if (res?.code === 0) {
          message.success(`合集保存成功`);
          setIsClosejumpTooltip(false);
          setIsExporting(false);
          history.push(collectionUrl);
        } else {
          message.error(`合集保存失败,原因：${res?.message}`);
          setIsExporting(false);
        }
      } catch (error) {
        message.error(`合集保存失败,原因:${error}`);
        setIsExporting(false);
      }
    });
  };

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // 通过新增按钮，配合useEffect，避免首次的调用
  const [pageIsClosing, setPageIsClosing] = useState<boolean>(false);
  const handleAdd = () => {
    console.log('新增');
    if (pageIsClosing) {
      // 第二次开启新增
      getPage();
    }
    setPageIsClosing(true);
    setModalOpen(true);
  };
  const handleAddCancel = () => {
    console.log('点击了取消');
    setSelectedRowKeys([]);
    setSelectedRow([]);
    setModalOpen(false);
  };
  const handleAddOk = () => {
    console.log('点击了确定选中的key', selectedRowKeys);
    console.log('点击了确定选中的list', selectedRow);
    if (selectedRowKeys?.length === 0) {
      return handleAddCancel();
    }
    // 先处理参数，再调用编辑 - 文章列表
    let newList = [...selectedRowKeys, ...listArticle];
    // setSelectedRowList(selectedRowList);
    console.log('确定新增前的文章', listArticle);
    console.log('确定新增后的文章', newList);
    console.log('topServiceAccountArticleIdList', topServiceAccountArticleIdList);
    setListArticle(newList);
    _httpCollectionListArticleByParam(newList, topServiceAccountArticleIdList);
    handleAddCancel();
  };
  // 复选框的值
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [selectedRowList, setSelectedRowList] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const [searchForm] = Form.useForm();
  const [searchContent, setSearChContent] = useState<any>({});
  // 搜索模块
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={12}>
              <Form.Item name="title" label="标题">
                <Input placeholder="请输入" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6} offset={6}>
              <Button
                style={{ marginRight: '20px' }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  // 清空复选框
                  setSelectedRowKeys([]);
                  setSelectedRow([]);
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  // 清空复选框
                  setSelectedRowKeys([]);
                  setSelectedRow([]);
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
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const [res1] = await Promise.all([
        httpCollectionPageCollectionArticleSearch({
          pageIndex,
          pageSize,
          serviceAccountId: backid,
          serviceAccountArticleIdList: listArticle?.length > 0 ? listArticle : undefined,
          ...searchContent,
        }),
      ]);
      const { result, totalCount, pageTotal, code } = res1;

      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
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
    if (pageIsClosing) {
      getPage();
    }
  }, [searchContent, pageIsClosing]);

  // 用户手动选择
  const handleOnSelect = (record: React.Key[], selected: any[]) => {
    console.log('用户手动选择单个record', record);
    console.log('用户手动选择单个selected', selected);
    let keys = [...selectedRowKeys];
    let list = [...selectedRow];
    if (selected) {
      keys = [...selectedRowKeys, record?.articleId];
      list = [...selectedRow, record];
    } else {
      keys = selectedRowKeys.filter((item) => item !== record.articleId);
      list = selectedRow.filter((item) => item.articleId !== record.articleId);
    }
    setSelectedRowKeys(keys);
    setSelectedRow(list);
  };

  // 用户手动选择所有回调
  const handleOnSelectAll = (selected: any, selectedRows: any[], changeRows: any) => {
    console.log('选择全部selected', selected);
    console.log('选择全部selectedRows', selectedRows);
    console.log('选择全部changeRows', changeRows);
    if (selected) {
      const addCheckedKeys = changeRows.map((item: any) => {
        return item?.articleId;
      });
      setSelectedRowKeys([...selectedRowKeys, ...addCheckedKeys]);
      setSelectedRow([...selectedRow, ...changeRows]);
    } else {
      const subCheckedKeys = selectedRowKeys.filter((articleId) => {
        return !changeRows.some((item: any) => {
          return item.articleId === articleId;
        });
      });
      const subCheckedSelectedRow = selectedRow.filter((item) => {
        return !changeRows.some((item2: any) => {
          return item.articleId === item2.articleId;
        });
      });
      setSelectedRowKeys(subCheckedKeys);
      setSelectedRow(subCheckedSelectedRow);
    }
  };

  // 文章详情
  const handleDetail = (detailId: any) => {
    window.open(
      `${
        routeName.BASELINE_SERVICE_NUMBER_MANAGEMENT_DETAIL
      }?id=${detailId}&backid=${backid}&backname=${backname}&activeTab=${'合集标签'}`,
    );
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      align: 'center',
      width: 35,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (_: any, record: any) => <div className={sc(`title`)}>{_ || '--'}</div>,
      width: 200,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      render: (_: string) => {
        // const newDate = new Date()
        return _ ? (
          <div style={{ color: moment(_).diff(new Date(), 'minute') > 0 ? 'orange' : 'black' }}>
            {moment(_).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ) : (
          '--'
        );
      },
      width: 130,
    },
    // access?.['PU_BLM_FWHNRGL'] && {
    {
      title: '操作',
      width: 80,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space wrap>
            <Button
              style={{ padding: 0 }}
              type="link"
              onClick={() => {
                handleDetail(record?.articleId.toString());
              }}
            >
              详情
            </Button>
          </Space>
        );
      },
    },
  ].filter((p) => p);

  const AddModal = (
    <Modal
      width={769}
      visible={modalOpen}
      title={'文章选择'}
      onCancel={() => handleAddCancel()}
      onOk={() => handleAddOk()}
    >
      <div className={sc('container-modal')}>
        {useSearchNode()}
        <div className={sc('container-modal-count')}>已选{selectedRowKeys.length}</div>
        <div className={sc('container-modal-table')}>
          <SelfTable
            size="small"
            loading={loading}
            bordered
            // scroll={{ x: 1580 }}
            rowSelection={
              // access?.['PU_BLM_FWHNRGL'] && {
              {
                fixed: true,
                selectedRowKeys,
                onSelectAll: handleOnSelectAll,
                onSelect: handleOnSelect,
                // getCheckboxProps: (record: any) => ({
                //   disabled: record.auditStatus !== 1
                // })
              }
            }
            rowKey={'articleId'}
            columns={columns}
            dataSource={dataSource}
            pagination={
              pageInfo.totalCount === 0
                ? false
                : {
                    onChange: getPage,
                    total: pageInfo.totalCount,
                    current: pageInfo.pageIndex,
                    pageSize: pageInfo.pageSize,
                    showTotal: (total: number) =>
                      `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                  }
            }
          />
        </div>
      </div>
    </Modal>
  );

  // 置顶
  const handleTop = (articleId: any, top: boolean) => {
    console.log('当前文章列表', listArticle);
    console.log('当前文章置顶列表', topServiceAccountArticleIdList);
    console.log('置顶操作', articleId, top);
    // 创建用来存放参数的数组
    let newList = [...topServiceAccountArticleIdList];
    // 整理置顶参数
    if (top) {
      // 置顶
      newList.push(articleId);
    } else {
      // 取消置顶
      newList = newList?.filter((item: any) => item !== articleId);
    }
    console.log('置顶处理后的值', newList);
    setTopServiceAccountArticleIdList(newList);
    _httpCollectionListArticleByParam(listArticle, newList);
  };

  // 删除
  const handleAudit = (articleId: any) => {
    let newListArticle = listArticle?.filter((item: any) => item !== Number(articleId));
    setListArticle(newListArticle);
    let newTopServiceAccountArticleIdList = topServiceAccountArticleIdList?.filter(
      (item: any) => item !== articleId,
    );
    setTopServiceAccountArticleIdList(newTopServiceAccountArticleIdList);
    _httpCollectionListArticleByParam(newListArticle, newTopServiceAccountArticleIdList);
  };

  const currentColumns = [
    {
      title: '序号',
      dataIndex: 'sort',
      align: 'center',
      width: 35,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (_: any, record: any) => {
        return (
          <div className={sc(`title`)}>
            <div className={sc(`title-text`)}>{_ || '--'}</div>
            {record?.top && <span className={sc(`title-top`)}>置顶</span>}
          </div>
        );
      },
      width: 200,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      render: (_: string) => {
        // const newDate = new Date()
        return _ ? (
          <div style={{ color: moment(_).diff(new Date(), 'minute') > 0 ? 'orange' : 'black' }}>
            {moment(_).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ) : (
          '--'
        );
      },
      width: 130,
    },
    {
      title: '文章状态',
      dataIndex: 'state',
      render: (_: any) => {
        return (
          <div>{Object.prototype.hasOwnProperty.call(stateColumn, _) ? stateColumn[_] : '--'}</div>
        );
      },
      width: 130,
    },
    // access?.['PU_BLM_FWHNRGL'] && {
    {
      title: '操作',
      width: 150,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space wrap>
            <Button
              style={{ padding: 0 }}
              type="link"
              onClick={() => {
                handleDetail(record?.articleId.toString());
              }}
            >
              详情
            </Button>
            <Access accessible={access['PU_BLM_FWHNRGL']}>
              {record?.top ? (
                <Popconfirm
                  title={
                    <div>
                      <div>取消置顶文章</div>
                      <div>确定取消置顶该文章？</div>
                    </div>
                  }
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => handleTop(record?.articleId.toString(), false)}
                >
                  <Button style={{ padding: 0 }} type="link">
                    取消置顶
                  </Button>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title={
                    <div>
                      <div>置顶文章</div>
                      <div>确定置顶该文章？</div>
                    </div>
                  }
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => handleTop(record?.articleId.toString(), true)}
                >
                  <Button style={{ padding: 0 }} type="link">
                    置顶
                  </Button>
                </Popconfirm>
              )}
            </Access>
            <Access accessible={access['PU_BLM_FWHNRGL']}>
              <Button
                style={{ padding: 0 }}
                type="link"
                onClick={() => {
                  handleAudit(record?.articleId.toString());
                }}
              >
                删除
              </Button>
            </Access>
          </Space>
        );
      },
    },
  ].filter((p) => p);

  // 获取的合集详情 - 文章列表
  const [detail, setDetail] = useState();
  // 通过文章列表 - 整理出的serviceAccountArticleIdList.  用来调用合集编辑 - 文章列表
  const [listArticle, setListArticle] = useState<any[]>([]);
  // 通过文章列表 - 整理出 topServiceAccountArticleIdList 置顶文章id列表
  const [topServiceAccountArticleIdList, setTopServiceAccountArticleIdList] = useState<any[]>([]);

  const _httpCollectionListArticle = async () => {
    try {
      const res = await httpCollectionListArticle({
        serviceAccountCollectionId: id,
      });
      if (res?.code === 0) {
        console.log('查看详情', res?.result);
        let listId = res?.result?.map((item: any) => item?.articleId);
        setListArticle(listId);
        // setSelectedRowList(res?.result);
        // 整理出置顶文章id列表
        let topListId = [] as any[];
        res?.result?.forEach((item: any) => {
          if (item?.top) {
            topListId.push(item?.id);
          }
        });
        console.log('检查指定文章列表', topListId);
        setTopServiceAccountArticleIdList(topListId);
        // 拿到详情的合集列表之后，调用编辑-文章列表
        _httpCollectionListArticleByParam(listId, topListId);
      } else {
        message.error(`合集详情-文章列表获取失败, 原因：${res?.message}`);
      }
    } catch (error) {
      message.error(`合集详情-文章列表获取失败: ${error}`);
    }
  };

  // 编辑 - 文章列表
  const _httpCollectionListArticleByParam = async (listArticleId: any, topListArticleId: any) => {
    setLoadingCurrent(true);
    try {
      const res = await httpCollectionListArticleByParam({
        serviceAccountId: backid,
        serviceAccountArticleIdList: listArticleId,
        topServiceAccountArticleIdList: topListArticleId?.length > 0 ? topListArticleId : undefined,
      });
      if (res?.code === 0) {
        console.log('编辑 - 文章列表', res?.result);
        // setListArticle(res?.result);
        setSelectedRowList(res?.result);
        setLoadingCurrent(false);
        // 整理出置顶文章id列表
        // let a = [] as any[]
        // res?.result?.forEach((item: any) => {
        //   if (item?.top) {
        //     a.push(item?.id)
        //   }
        // })
        // console.log('检查指定文章列表', a)
        // setTopServiceAccountArticleIdList(a)
      } else {
        message.error(`合集详情-文章列表获取失败, 原因：${res?.message}`);
        setLoadingCurrent(false);
      }
    } catch (error) {
      message.error(`合集详情-文章列表获取失败: ${error}`);
      setLoadingCurrent(false);
    }
  };

  const _httpCollectionDetail = async () => {
    try {
      const res = await httpCollectionDetail({
        serviceAccountCollectionId: id,
      });
      if (res?.code === 0) {
        console.log('合集表单的详情', res?.result);
        setDetail(res?.result);
        formMessage.setFieldsValue({
          ...res?.result,
          continuousRead: res?.result.continuousRead,
        });
      } else {
        message.error(`合集详情获取失败, 原因：${res?.message}`);
      }
    } catch (error) {
      message.error(`合集详情获取失败: ${error}`);
    }
  };
  return (
    <PageContainer
      header={{
        title: activeTitle,
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline/baseline-service-number">服务号管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={collectionUrl}>合集标签</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{activeTitle}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        <Button disabled={isExporting} type="primary" onClick={() => onSubmit()}>
          确定
        </Button>,
        <Button onClick={() => history.push(collectionUrl)}>返回</Button>,
      ]}
    >
      <Prompt
        when={isClosejumpTooltip}
        message={'离开此页面，将不会保存当前编辑的内容，确认离开吗？'}
      />
      <div className={sc('container')}>
        <div className={sc('container-content')}>
          <div className={sc('container-content-title')}>内容信息</div>
          <Form
            form={formMessage}
            {...formLayout}
            validateTrigger={['onBlur']}
            onValuesChange={() => {
              setFormPostMessageChange(true);
            }}
          >
            <Form.Item
              label="合集名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <Input maxLength={20} placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              label="文末连续阅读"
              name="continuousRead"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <Switch
                checked={isHOt}
                onChange={(e) => {
                  setIsHot(e);
                }}
              />
            </Form.Item>
          </Form>
        </div>
        <div className={sc('container-collection')}>
          <div className={sc('container-collection-title')}>合集文章</div>
          <Button
            style={{ marginLeft: '30px', marginBottom: '30px' }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAdd()}
          >
            新增
          </Button>
        </div>
        {/* 新增文章选中 */}
        {selectedRowList.length > 0 && (
          <div className={sc('container-table')}>
            <SelfTable
              size="middle"
              loading={loadingCurrent}
              bordered
              rowKey={'id'}
              columns={currentColumns}
              dataSource={selectedRowList}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30'],
              }}
            />
          </div>
        )}
      </div>
      {AddModal}
    </PageContainer>
  );
};
