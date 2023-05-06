import {
  Button,
  Form,
  Select,
  Row,
  Col,
  message as antdMessage,
  Modal, Input,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { getGlobalFloatAds, updateAdsStatus, getGobleFloatAdsStatistics } from '@/services/baseline';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { routeName } from '../../../../config/routes';
const sc = scopedClasses('suspension-list');
const scopeMap = {
  'ALL_USER': '全部用户',
  'ALL_LOGIN_USE': '全部登陆用户',
  'ALL_NOT_LOGIN_USE': '全部未登录用户',
  'ALL_LOGIN_USER': '全部登陆用户',
  'ALL_NOT_LOGIN_USER': '全部未登录用户',
  'PORTION_USER': '部分用户'
}

const statusOptions = [
  {label: '上架', value: 1}, {label: '下架', value: 3}
]

const statusMap = {
  1: '上架',
  3: '下架',
  0: '暂存'
}

export default () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [searchContent, setSearChContent] = useState<any>({});
  const [totalInfo, setTotalInfo] = useState<any>({userCount: 0, onClickCount: 0})
  const [searchForm] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true)
    try {
      const { result, code, message } = await getGlobalFloatAds({
        pageIndex,
        pageSize,
        advertiseType: 'GLOBAL_FLOAT_ADS',
        ...searchContent,
      });
      setLoading(false)
      if (code === 0) {
        setPageInfo({ totalCount: result.total, pageTotal: Math.ceil(result.total / pageSize), pageIndex, pageSize });
        setDataSource(result.list || []);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      setLoading(false)
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  const handleDelete = (record: any) => {
    console.log(record)
    Modal.confirm({
      title: '删除数据',
      content: '删除该广告后，系统将不再推荐该广告，确定删除？',
      okText: '删除',
      onOk: () => {
        updateAdsStatus(record.id, 2).then((res) => {
          if (res.code === 0){
            const { totalCount, pageIndex, pageSize } = pageInfo
            const newTotal = totalCount - 1 || 1;
            const newPageTotal = Math.ceil(newTotal / pageSize) || 1
            getPage(pageIndex >  newPageTotal ? newPageTotal : pageIndex)
            antdMessage.success(`删除成功`);
          } else {
            antdMessage.error(res.message);
          }
        })
      },
    })
  }
  const handleUpOrDown = (record: any) => {
    Modal.confirm({
      title: '提示',
      content: record.status === 1 ? '确定将内容下架？' : '确定将内容上架？',
      okText: record.status === 1 ? '下架' : '上架',
      onOk: async () => {
        updateAdsStatus(record.id, record.status === 1 ? 3 : 1).then((res) => {
          if (res.code === 0){
            getPage(pageInfo.pageIndex)
            antdMessage.success(record.status === 1 ? '下架成功' : `上架成功`);
          } else {
            antdMessage.error(res.message);
          }
        })
      },
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
      title: '活动名称',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '图片',
      dataIndex: 'advertiseOssRelationList',
      isEllipsis: true,
      width: 200,
      render: (advertiseOssRelationList: any) => {
        return (
          <div className="img-tr">
            {
              advertiseOssRelationList.length ? advertiseOssRelationList?.map((item: any, index: number) => {
                return (
                  <div className="img-box">
                    <img src={item.ossUrl} key={index} alt='' />
                  </div>
                )
              }) : '--'
            }
          </div>
        )
      },
    },
    {
      title: '作用范围',
      dataIndex: 'scope',
      width: 100,
      render: (scope: string, record: any) => {
        return <span>
          {
            scope ? scope !== 'PORTION_USER' ? scopeMap[scope] :
              <div>
                {
                  record?.labels?.map((item: any) => {
                    return item.labelName
                  }).join('、') || '--'
                }
              </div> : '--'
          }
        </span>
      }
    },
    {
      title: '点击次数',
      dataIndex: 'onClickCount',
      width: 100,
      render: (onClickCount: number) => {
        return <span>{typeof onClickCount === 'number' ? onClickCount : '--'}</span>
      }
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      width: 100,
      render: (userCount: number) => {
        return <span>{typeof userCount === 'number' ? userCount : '--'}</span>
      }
    },
    {
      title: '内容状态',
      dataIndex: 'status',
      width: 200,
      render: (status: string) => {
        return (
          <>
            {statusMap[status] || '--'}
          </>
        )
      },
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      width: 200,
      render: (updateTime: string) => {
        return (
          <>
            {updateTime ? moment(updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
          </>
        )
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_: any, record: any) => {
        return (
          <>
            {
              record.status === 0 &&
              <Button
                size="small"
                type="link"
                onClick={() => {
                  window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD_ADD}?id=${record.id}`)
                }}
              >
                编辑
              </Button>
            }
            {
              record.status === 0 &&
              <Button
                size="small"
                type="link"
                onClick={() => {
                  handleDelete(record)
                }}
              >
                删除
              </Button>
            }
            {
              [1,3].indexOf(record.status) !== -1 &&
              <Button
                size="small"
                type="link"
                onClick={() => {
                  window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD_DETAIL}?id=${record.id}`)
                }}
              >
                详情
              </Button>
            }
            {
              record.status === 3 &&
              <Button
                size="small"
                type="link"
                onClick={() => {
                  handleUpOrDown(record)
                }}
              >
                上架
              </Button>
            }
            {
              record.status === 1 &&
              <Button
                size="small"
                type="link"
                onClick={() => {
                  handleUpOrDown(record)
                }}
              >
                下架
              </Button>
            }
          </>
        )
      },
    },
  ];

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    return search;
  };
  useEffect(() => {
    getPage();
  }, [searchContent]);
  useEffect(() => {
    getGobleFloatAdsStatistics().then((res) => {
      if (res.code === 0){
        setTotalInfo(res.result)
      }
    })
  }, [])

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row>
            <Col span={6} offset={1}>
              <Form.Item name="advertiseName" label="活动名称">
                <Input placeholder="请输入" maxLength={35} />
              </Form.Item>
            </Col>
            <Col span={6} offset={1}>
              <Form.Item name="status" label="内容状态">
                <Select
                  placeholder="请选择"
                  allowClear
                  options={statusOptions}
                />
              </Form.Item>
            </Col>
            <Col offset={1} span={5}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = getSearchQuery();
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
      <div className="total">
        <div className="click-amount">
          <div>
            点击总次数
          </div>
          {totalInfo.onClickCount}
        </div>
        <div className="user-amount">
          <div>
            总用户数
          </div>
          {totalInfo.userCount}
        </div>
      </div>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <Button
            type="primary"
            onClick={() => {
              window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_SUSPENSION_AD_ADD}`)
            }}
          >
            +新建
          </Button>
        </div>
      </div>

      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey="id"
          bordered
          columns={columns}
          loading={loading}
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
