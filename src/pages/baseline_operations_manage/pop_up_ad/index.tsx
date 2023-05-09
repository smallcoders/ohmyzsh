import {
  Button,
  message as antdMessage,
  Form,
  Row,
  Col,
  Select,
  Input,
  Modal,
  Image
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import SelfTable from '@/components/self_table';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less'
import type Common from '@/types/common';
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../config/routes';
import {
  getAdvertiseList,
  updateAdsStatus
} from '@/services/baseline'

const sc = scopedClasses('pop-up-ad');
const statusObj = {
  0: '暂存',
  1: '上架',
  3: '下架'
};
const userTypeObj = {
  'ALL_USER': '全部用户',
  'ALL_LOGIN_USER': '全部登录用户',
  'ALL_NOT_LOGIN_USER': '全部未登录用户',
  'PORTION_USER': '部分用户',
};
const triggerTypeObj = {
  'PAGE_START': '页面启动',
  'PAGE_CLOSE': '页面离开',
}

export default () => {
  const access = useAccess();
  const [dataSource, setDataSource] = useState<any>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const [searchForm] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getAdvertiseList({
        pageIndex,
        pageSize,
        advertiseType: 'POP_UP_ADS',
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result?.list);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      // antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  const handleDelete = (record: any) => {
    console.log(record)
    Modal.confirm({
      title: '删除数据',
      content: '删除该弹窗广告后，系统将不再推荐该广告，确定删除？',
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
      onOk: () => {
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
      render: (tmpName: string, record: any) => {
        return <span>{tmpName || '--'}</span>
      }
    },
    {
      title: '图片',
      dataIndex: 'advertiseOssRelationList',
      isEllipsis: true,
      width: 120,
      render: (_: any) => {
        return (
          <div className="img-tr">
            {
              _.length ? _?.map((item: any, index: number) => {
                return (
                  <div className="img-box">
                    <Image
                      key={index}
                      className={'banner-img'}
                      src={item.ossUrl}
                      alt="图片损坏"
                    />
                  </div>
                )
              }) : '--'
            }
          </div>
        )
      },
    },
    {
      title: '触发机制',
      width: 120,
      dataIndex: 'triggerMechanism',
      render: (_: string) => {
        return <div className={`state${_}`}>{triggerTypeObj[_] || '--'}</div>;
      }
    },
    {
      title: '作用范围',
      dataIndex: 'scope',
      width: 200,
      render: (scope: string, _record: any) => {
        let str:string = ''
        if(_record.labels && _record.labels.length > 0) {
          str = _record.labels.map((item: any, index: number) => {
            if (index === _record.labels.length - 1) {
              return item.labelName;
            }
            return item.labelName + '、';
          }).join('');
        }
        return scope == 'PORTION_USER' ? (
          <div>{
            _record.labels ? str : (<span>{userTypeObj[scope] || '--'}</span>)
          }</div>
        ) : (<span>{userTypeObj[scope] || '--'}</span>)
      }
    },
    {
      title: '开启时间段',
      dataIndex: 'periodType',
      width: 240,
      render: (_: string, _record: any) => {
        return (
          _ === 'ALL_TIME' ? (
            <div>全部时间</div>
          ) : (
            <div>{_record.periodStartTime ? (moment(_record.periodStartTime).format('YYYY-MM-DD') + '至' + moment(_record.periodEndTime).format('YYYY-MM-DD')) : '--'}</div>
          )
        )
      }
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      width: 200,
      render: (updateTime: string) => {
        return (
          <>
            {moment(updateTime).format('YYYY-MM-DD HH:mm:ss')}
          </>
        )
      },
    },
    {
      title: '内容状态',
      dataIndex: 'status',
      width: 100,
      render: (_: number) => {
        return <div className={`state${_}`}>{statusObj[_] || '--'}</div>;
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
              [1,3].indexOf(record.status) !== -1 &&
              <Button
                size="small"
                type="link"
                onClick={() => {
                  window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_POPUP_AD_DETAIL}?id=${record.id}`)
                }}
              >
                详情
              </Button>
            }
            <Access accessible={access['PU_BLAM_TKGG']}>
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
            {
              (record.status === 0 || record.status === 3) &&
              <Button
                size="small"
                type="link"
                onClick={() => {
                  window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_POPUP_AD_ADD}?id=${record.id}`)
                }}
              >
                编辑
              </Button>
            }
            </Access>
            <Access accessible={access['PD_BLAM_TKGG']}>
            {
              (record.status === 0 || record.status === 3) &&
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
            </Access>
          </>
        )
      },
    },
  ];

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    return search;
  };

  const useSearchNode = (): React.ReactNode => {
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm} {...formLayout}>
          <Row>
            <Col span={6}>
              <Form.Item name="advertiseName" label="活动名称">
                <Input placeholder='请输入' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="内容状态">
                <Select
                  placeholder="请选择"
                  allowClear
                  options={[{label: '上架', value: 1}, {label: '下架', value: 3}, {label: '暂存', value: 0}]}
                />
              </Form.Item>
            </Col>
            <Col offset={8} span={4} className={sc('container-search-operate')}>
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

  useEffect(() => {
    getPage();
  }, [searchContent]);

  return (
    <PageContainer className={sc('container')}
      header={{
        title: '',
        breadcrumb: {},
      }}
    >
      <h3 className={sc('container-title')}>弹窗广告</h3>
      {useSearchNode()}
      <Access accessible={access['PA_BLAM_TKGG']}>
      <div className={sc('container-table-header')}>
        <div className="title">
          <Button
            type="primary"
            onClick={() => {
              window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_POPUP_AD_ADD}`);
            }}
          >
            +新增
          </Button>
        </div>
      </div>
      </Access>
      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey="id"
          bordered
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
  )
}
