import { Button, Select, Row, Tag, Col, Form, Input, message as antdMessage, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import SelfTable from '@/components/self_table';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../config/routes';
import {
  getAdvertiseDiffTypeNum,
  getAdvertiseList,
  getAllLayout,
  updateAdsStatus,
} from '@/services/baseline';
import type Common from '@/types/common';
import moment from 'moment/moment';

const sc = scopedClasses('content-stream-ad');
export default () => {
  const [staNumArr, setStaNumArr] = useState<any>([]);

  const handleAdd = (item: any) => {
    if (item) {
      history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_ADD}?id=${item}`);
    } else {
      history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_ADD}`);
    }
  };
  const userTypeObj = {
    ALL_USER: '全部用户',
    ALL_LOGIN_USE: '全部登陆用户',
    ALL_NOT_LOGIN_USE: '全部未登录用户',
    PORTION_USER: '部分用户',
  };

  const handleDetail = (item: any) => {
    history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_DETAIL}?id=${item}`);
  };
  const handleStatisticalDetail = (item: any) => {
    history.push(
      `${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_STATISTICAL_DETAIL}?articleTypeId=${item?.articleTypeId}&typeName=${item?.typeName}`,
    );
  };
  // 统计卡片
  const StaCard = () => {
    return (
      <div className={sc('card')}>
        {staNumArr.map((item: any) => {
          return (
            <div className="wrap" key={item.title} onClick={() => handleStatisticalDetail(item)}>
              <div className="title">{item.typeName + ' >'}</div>
              <div className="num">{item.number}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const [layType, setLayType] = useState<any>([]);
  const statusMap = {
    1: '上架',
    3: '下架',
    0: '暂存',
  };
  // 拿到当前角色的access权限兑现
  const access: any = useAccess();
  const [dataSource, setDataSource] = useState<any>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const [loading, setLoading] = useState<any>(false);
  const [searchForm] = Form.useForm();

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code, message } = await getAdvertiseList({
        pageIndex,
        pageSize,
        advertiseType: 'CONTENT_STREAM_ADS',
        ...searchContent,
      });
      setLoading(false);
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result?.list);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      setLoading(false);
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  // 删除
  const remove = async (record: any) => {
    Modal.confirm({
      title: '删除数据',
      content: '删除该内容流广告后，系统将不再推荐该广告，确定删除？',
      okText: '删除',
      onOk: () => {
        updateAdsStatus(record.id, 2).then((res) => {
          if (res.code === 0) {
            const { totalCount, pageIndex, pageSize } = pageInfo;
            const newTotal = totalCount - 1 || 1;
            const newPageTotal = Math.ceil(newTotal / pageSize) || 1;
            getPage(pageIndex > newPageTotal ? newPageTotal : pageIndex);
            antdMessage.success(`删除成功`);
          } else {
            antdMessage.error(res.message);
          }
        });
      },
    });
  };
  const handleUpOrDown = (record: any) => {
    Modal.confirm({
      title: '提示',
      content: record.status === 1 ? '确定将内容下架？' : '确定将内容上架？',
      okText: record.status === 1 ? '下架' : '上架',
      onOk: async () => {
        updateAdsStatus(record.id, record.status === 1 ? 3 : 1).then((res) => {
          if (res.code === 0) {
            getPage(pageInfo.pageIndex);
            antdMessage.success(record.status === 1 ? '下架成功' : `上架成功`);
          } else {
            antdMessage.error(res.message);
          }
        });
      },
    });
  };
  useEffect(() => {
    getAllLayout().then((res) => {
      if (res.code === 0 && res.result) {
        const labelArr = res.result.map((item: any) => {
          return {
            value: item.id,
            label: item.typeName,
          };
        });
        setLayType(labelArr);
      }
    });
    getAdvertiseDiffTypeNum().then((res) => {
      if (res.code === 0 && res.result) {
        setStaNumArr(res.result);
      }
    });
  }, []);
  useEffect(() => {
    getPage();
  }, [searchContent]);
  // 搜索模块
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="advertiseName" label="内容标题">
                <Input placeholder="请输入" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="articleTypeId" label="版面">
                <Select options={layType} mode={'multiple'} placeholder="请选择" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>暂存</Select.Option>
                  <Select.Option value={1}>上架</Select.Option>
                  <Select.Option value={3}>下架</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                style={{ marginRight: '20px' }}
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
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '内容标题',
      dataIndex: 'advertiseName',
      width: 150,
      render: (title: string) => {
        return title || '--';
      },
    },
    {
      title: '图片',
      dataIndex: 'advertiseOssRelationList',
      isEllipsis: true,
      width: 200,
      render: (advertiseOssRelationList: any) => {
        return (
          <div className="img-tr">
            {advertiseOssRelationList.length
              ? advertiseOssRelationList?.map((item: any, index: number) => {
                  return (
                    <div className="img-box">
                      <img src={item.ossUrl} key={index} alt="" />
                    </div>
                  );
                })
              : '--'}
          </div>
        );
      },
    },
    {
      title: '版面',
      dataIndex: 'advertiseArticleTypeRelationList',
      isEllipsis: true,
      width: 250,
      render: (advertiseArticleTypeRelationList: any) => {
        const arr = layType.filter((aItem: any) =>
          advertiseArticleTypeRelationList.some(
            (bItem: any) => aItem.value === bItem.articleTypeId,
          ),
        );
        return (
          <div className="typeBox">
            {arr && arr.length
              ? arr.map((item: any) => {
                  return (
                    <div>
                      <Tag color="#0068ff">{item.label}</Tag>
                    </div>
                  );
                })
              : '--'}
          </div>
        );
      },
    },
    {
      title: '位置',
      dataIndex: 'displayOrder',
      width: 150,
      render: (displayOrder: any) => {
        return <span>{displayOrder || '--'}</span>;
      },
    },
    {
      title: '作用范围',
      width: 150,
      dataIndex: 'scope',
      render: (scope: string, _record: any) => {
        let str: string = '';
        if (_record.labels && _record.labels.length > 0) {
          str = _record.labels
            .map((item: any, index: number) => {
              if (index === _record.labels.length - 1) {
                return item.labelName;
              }
              return item.labelName + '、';
            })
            .join('');
        }
        return scope == 'PORTION_USER' ? (
          <div>{_record.labels ? str : <span>{userTypeObj[scope] || '--'}</span>}</div>
        ) : (
          <span>{userTypeObj[scope] || '--'}</span>
        );
      },
    },
    {
      title: '浏览次数',
      width: 200,
      dataIndex: 'browsedCount',
      sorter: (a: any, b: any) => a.browsedCount - b.browsedCount,
      render: (browsedCount: any) => {
        return <span>{browsedCount}</span>;
      },
    },
    {
      title: '被关闭次数',
      dataIndex: 'closeCount',
      width: 200,
      sorter: (a: any, b: any) => a.closeCount - b.closeCount,
      render: (closeCount: string) => {
        return <span>{closeCount || 0}</span>;
      },
    },
    {
      title: '曝光量',
      dataIndex: 'exposureCount',
      width: 200,
      sorter: (a: any, b: any) => a.exposureCount - b.exposureCount,
      render: (exposureCount: string) => {
        return <span>{exposureCount || 0}</span>;
      },
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      width: 200,
      render: (updateTime: string) => {
        return <>{updateTime ? moment(updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 200,
      render: (status: string) => {
        return <>{statusMap[status] || '--'}</>;
      },
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (_: any, record: any) => {
        if (record.crawered === 0) {
          return <span>--</span>;
        }
        return (
          <div style={{ whiteSpace: 'break-spaces' }}>
            {[1, 3].indexOf(record.status) !== -1 && (
              <Button
                size="small"
                type="link"
                onClick={() => {
                  handleDetail(record.id);
                }}
              >
                详情
              </Button>
            )}
            <Access accessible={access.PD_BLM_YYWGL}>
              {[0, 3].indexOf(record.status) !== -1 && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    remove(record);
                  }}
                >
                  删除
                </Button>
              )}
            </Access>
            <Access accessible={access.PU_BLM_YYWGL}>
              {[0, 3].indexOf(record.status) !== -1 && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    handleAdd(record.id);
                  }}
                >
                  编辑
                </Button>
              )}
              {record.status === 1 && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    handleUpOrDown(record);
                  }}
                >
                  下架
                </Button>
              )}
              {record.status === 3 && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    handleUpOrDown(record);
                  }}
                >
                  上架
                </Button>
              )}
            </Access>
          </div>
        );
      },
    },
  ];
  return (
    <PageContainer className={sc('container')}>
      <StaCard />
      {useSearchNode()}
      <div className={sc('container-table-body')}>
        <Access accessible={access.PA_BLM_YYWGL}>
          <Button
            type="primary"
            style={{ marginBottom: '10px' }}
            onClick={() => {
              history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_ADD}`);
            }}
          >
            新增
          </Button>
        </Access>
        <SelfTable
          rowKey="id"
          loading={loading}
          bordered
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1000 }}
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
