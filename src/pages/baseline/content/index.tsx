import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message,
  Space,
  Modal,
  Tooltip,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { Access, useAccess } from 'umi';
import type Common from '@/types/common';
import type NeedVerify from '@/types/user-config-need-verify';
import { routeName } from '../../../../config/routes';
import { stubFalse } from 'lodash';
import { deleteArticle, getArticlePage, getArticleRiskCount, getArticleTags, getArticleType, isTopArticle, onOffShelvesArticle } from '@/services/baseline';
const sc = scopedClasses('science-technology-manage-creative-need');
const statusObj = {
  0: '下架',
  1: '上架',
  2: '暂存',
};

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<NeedVerify.Content[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // // 当前页面的对应权限key
  // useEffect(() => {
  //   for (const key in permissions) {
  //     const permission = permissions[key]
  //     if (Object.prototype.hasOwnProperty.call(access, permission)) {
  //       setEdge(key as any)
  //       break
  //     }
  //   }
  // }, [])



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

  const [tags, setTags] = useState<any>([]);
  const [riskCount, setRiskCount] = useState<number>(0);
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const [res1, res2] = await Promise.all([getArticlePage({
        pageIndex,
        pageSize,
        ...searchContent,
      }), getArticleRiskCount(searchContent)])
      const { result, totalCount, pageTotal, code } = res1

      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
        setRiskCount(res2?.result || 0)
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

  const prepare = async () => {
    try {
      const res = await Promise.all([getArticleTags(), getArticleType()]);
      setTags(res[0].result || []);
      setTypes(res[1].result || []);
    } catch (error) {
      message.error('获取数据失败');
    }
  };
  useEffect(() => {
    prepare();
  }, []);

  const onDelete = async (id: string) => {
    try {
      const updateStateResult = await deleteArticle(id);
      if (updateStateResult.code === 0) {
        message.success(`删除成功`);
        getPage();
      } else {
        message.error(updateStateResult?.message || `操作失败，请重试`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isTop = async (id: string, isTopping: boolean) => {
    const tooleMessage = isTopping ? "置顶" : "取消置顶"
    try {
      const updateStateResult = await isTopArticle({ id, isTopping });
      if (updateStateResult.code === 0) {
        message.success(`${tooleMessage}成功`);
        getPage();
      } else {
        message.error(updateStateResult?.message || `操作失败，请重试`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onOffShelves = async (id: string, isShelves: number) => {
    const tooleMessage = isShelves ? "上架" : "下架"
    try {
      const updateStateResult = await onOffShelvesArticle(id, isShelves);
      if (updateStateResult.code === 0) {
        message.success(`${tooleMessage}成功`);
        getPage();
      } else {
        message.error(updateStateResult?.message || `操作失败，请重试`);
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
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (_: any, record: any) => <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span>
          {_}
        </span>
        {record?.isTop && <div style={{ background: '#169BD5', color: '#FFF', padding: '0 2px', borderRadius: '2px', whiteSpace: 'nowrap' }}>已置顶</div>}
        {record?.riskInfo && <Tooltip title={record?.riskInfo}><div style={{ background: '#D7001A', color: '#FFF', padding: '0 2px', borderRadius: '2px', whiteSpace: 'nowrap' }}>风险</div></Tooltip>}
      </div>,
      width: 300,
    },
    {
      title: '来源',
      dataIndex: 'source',
      isEllipsis: true,
      render: (_: any[]) => _ || '--',
      width: 300,
    },
    {
      title: '作者',
      dataIndex: 'author',
      isEllipsis: true,
      render: (_: any[]) => _ || '--',
      width: 150,
    },
    {
      title: '关键词',
      dataIndex: 'keywords',
      isEllipsis: true,
      width: 300,
      render: (_: any[]) => _ || '--',
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
      dataIndex: 'updateTime',
      isEllipsis: true,
      render: (_: string, record: any) => record?.status == 1 && _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--',
      width: 250,
    },
    {
      title: '审核备注',
      dataIndex: 'auditCommon',
      isEllipsis: true,
      render: (_: boolean) => _ ? '审核通过' : '审核不通过',
      width: 200,
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        // const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return (
          <Space wrap>
            {record?.status == 2 &&
              <>
                <Access accessible={access['P_BLM_NRGL']}>
                  <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => {
                      window.open(routeName.BASELINE_CONTENT_MANAGE_ADDORUPDATE + `?id=${record?.id}`);
                    }}
                  >
                    编辑
                  </Button>
                </Access>
                <Access accessible={access['PD_BLM_NRGL']}>
                  <Button type="link" style={{ padding: 0 }} onClick={() => {
                    Modal.confirm({
                      title: '删除数据',
                      content: '删除该内容后，系统将不再推荐该内容，确定删除？',
                      onOk: () => { onDelete(record?.id) },
                      okText: '删除'
                    })
                  }}>
                    删除
                  </Button>
                </Access>
              </>
            }
            {record?.status == 1 &&
              <>
                <Button
                  style={{ padding: 0 }}
                  type="link"
                  onClick={() => {
                    window.open(routeName.BASELINE_CONTENT_MANAGE_DETAIL + `?id=${record?.id}`);
                  }}
                >
                  详情
                </Button>
                <Access accessible={access['P_BLM_NRGL']}>
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    onClick={() => {
                      Modal.confirm({
                        title: '提示',
                        content: '确定将内容下架？',
                        onOk: () => { onOffShelves(record.id, 0) },
                        okText: '下架'
                      })
                    }}
                  >
                    下架
                  </Button>
                </Access>
                <Access accessible={access['P_BLM_NRGL']}>
                  {record?.isTop ? <Button
                    style={{ padding: 0 }}
                    type="link"
                    onClick={() => {
                      isTop(record.id, false)
                    }}
                  >
                    取消置顶
                  </Button> : <Button
                    style={{ padding: 0 }}
                    type="link"
                    onClick={() => {
                      isTop(record.id, true)
                    }}
                  >
                    置顶
                  </Button>}
                </Access>
              </>
            }

            {record?.status == 0 &&
              <>
                <Button
                  style={{ padding: 0 }}
                  type="link"
                  onClick={() => {
                    window.open(routeName.BASELINE_CONTENT_MANAGE_DETAIL + `?id=${record?.id}`);
                  }}
                >
                  详情
                </Button>

                {record?.auditCommon ? <Access accessible={access['P_BLM_NRGL']}><Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => {
                    Modal.confirm({
                      title: '提示',
                      content: '确定将内容上架？',
                      onOk: () => { onOffShelves(record.id, 1) },
                      okText: '上架'
                    })
                  }}
                >
                  上架
                </Button></Access> : <>
                  <Access accessible={access['P_BLM_NRGL']}> <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => {
                      window.open(routeName.BASELINE_CONTENT_MANAGE_ADDORUPDATE + `?id=${record?.id}`);
                    }}
                  >
                    编辑
                  </Button>
                  </Access>
                  <Access accessible={access['PD_BLM_NRGL']}><Button type="link" style={{ padding: 0 }} onClick={() => {
                    Modal.confirm({
                      title: '删除数据',
                      content: '删除该内容后，系统将不再推荐该内容，确定删除？',
                      onOk: () => { onDelete(record?.id) },
                      okText: '删除'
                    })
                  }}>
                    删除
                  </Button></Access>
                </>
                }
              </>
            }



          </Space>
          // </Access>
        )


      },
    },
  ].filter(p => p);

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const [searchForm] = Form.useForm();
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
              <Form.Item name="status" label="内容状态">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(statusObj).map((p) => {
                    return (
                      <Select.Option key={p[0]} value={p[0]}>
                        {p[1]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="type" label="内容类型">
                <Select placeholder="请选择" allowClear>
                  {types?.map((item: any) => (
                    <Select.Option key={item?.id} value={Number(item?.id)}>
                      {item?.typeName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item name="source" label="来源">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="labels" label="标签">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="riskInfo" label="风险标识">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={true}>有</Select.Option>
                  <Select.Option value={false}>没有</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col offset={2} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.createTimeStart = moment(search.time[0]).format('YYYY-MM-DD 00:00:00');
                    search.createTimeEnd = moment(search.time[1]).format('YYYY-MM-DD 23:59:59');
                  }
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
          <span>风险资讯(<span style={{ color: 'red' }}>{riskCount >= 10000 ? '10000+' : riskCount || 0}</span>条)</span>
          <Access accessible={access['PA_BLM_NRGL']}>
            <Button type='primary' icon={<PlusOutlined />} onClick={() => { window.open(routeName.BASELINE_CONTENT_MANAGE_ADDORUPDATE); }}>
              新增
            </Button>
          </Access>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          loading={loading}
          bordered
          scroll={{ x: 2580 }}
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
    </PageContainer>
  );
};
