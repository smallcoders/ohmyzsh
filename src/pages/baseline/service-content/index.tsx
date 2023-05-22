import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { Button, Col, message, Form, DatePicker, Input, Row, Space, Select, Modal } from 'antd';
import SelfTable from '@/components/self_table';
import { Access, useAccess } from 'umi';
import React, { useEffect, useState } from 'react';
const sc = scopedClasses('service-content-manage');
import moment from 'moment';
import './index.less';
import { routeName } from '../../../../config/routes';
import {
  queryServiceArticlePage,
  httpArticleAudit,
  httpArticleBatchAudit,
} from '@/services/baseline';
import type Common from '@/types/common';
import { disabled } from 'glamor';

const articleTypes = {
  PICTURE_TEXT: '图文',
  PICTURE: '图片',
  TEXT: '文字',
  VIDEO: '视频',
  AUDIO: '音频',
};
export default () => {
  const [loading, setLoading] = useState(false);
  const [searchContent, setSearChContent] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });
  const access: any = useAccess();
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    console.log('翻页', pageIndex, pageSize)
    setLoading(true);
    try {
      const [res1] = await Promise.all([
        queryServiceArticlePage({
          pageIndex,
          pageSize,
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
    getPage();
  }, [searchContent]);

  const handleAudit = (id: string, state: number) => {
    Modal.confirm({
      title: '提示',
      content: state === 2 ? '确定通过同步至产业圈？' : '确定拒绝同步至产业圈？',
      okText: state === 2 ? '通过' : '拒绝',
      onOk: () => {
        httpArticleAudit({ id, auditStatus: state }).then((res: any) => {
          if (res?.code == 0) {
            message.success(state === 2 ? '显示至推荐页面' : '未显示于推荐页面');
            setTimeout(() => {
              getPage();
            }, 500);
          } else {
            message.error(res?.message);
          }
        });
      },
    });
  };

  useEffect(() => {
    console.log('access', access['PU_BLM_FWHNRGL']);
  }, [access]);

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
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div>{_ || '--'}</div>
          {record?.repeatFlag && (
            <div
              style={{
                background: '#D7001A',
                color: '#FFF',
                padding: '0 2px',
                borderRadius: '2px',
                whiteSpace: 'nowrap',
              }}
            >
              内容重复
            </div>
          )}
          {/* {record?.riskInfo && <Tooltip title={record?.riskInfo}><div style={{ background: '#D7001A', color: '#FFF', padding: '0 2px', borderRadius: '2px', whiteSpace: 'nowrap' }}>风险</div></Tooltip>} */}
        </div>
      ),
      width: 200,
    },
    {
      title: '内容类型',
      dataIndex: 'articleType',
      render: (_: any) => {
        return (
          <div>
            {Object.prototype.hasOwnProperty.call(articleTypes, _) ? articleTypes[_] : '--'}
          </div>
        );
      },
      width: 50,
    },
    {
      title: '发布服务号',
      dataIndex: 'serviceAccountName',
      render: (_: any[]) => _ || '--',
      width: 110,
    },
    {
      title: '发布账号',
      dataIndex: 'publisherName',
      render: (_: any[]) => _ || '--',
      width: 110,
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      width: 50,
      render: (_: any[], record: any) => {
        return (
          <div>
            {record.auditStatus === 2 && record.status === 0 && <div>已下架</div>}
            {record.auditStatus === 2 && record.status === 1 && <div>通过</div>}
            {record.auditStatus === 3 && <div>拒绝</div>}
            {record.auditStatus === 1 && <div>待审核</div>}
            {!record.auditStatus && <div>--</div>}
          </div>
        );
      },
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      render: (_: string) => (_ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--'),
      width: 130,
    },
    access?.['PU_BLM_FWHNRGL'] && {
      title: '操作',
      width: 80,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space wrap>
            {record?.auditStatus == 1 && (
              <>
                <Access accessible={access['PU_BLM_FWHNRGL']}>
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    onClick={() => {
                      handleAudit(record?.id.toString(), 2);
                    }}
                  >
                    通过
                  </Button>
                </Access>
                <Access accessible={access['PU_BLM_FWHNRGL']}>
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    onClick={() => {
                      handleAudit(record?.id.toString(), 3);
                    }}
                  >
                    拒绝
                  </Button>
                </Access>
              </>
            )}
          </Space>
        );
      },
    },
  ].filter((p) => p);
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const addTypes = [
    {
      type: 'PICTURE_TEXT',
      name: '图文',
    },
    {
      type: 'PICTURE',
      name: '图片',
    },
    {
      type: 'TEXT',
      name: '文字',
    },
    {
      type: 'VIDEO',
      name: '视频',
    },
    {
      type: 'AUDIO',
      name: '音频',
    },
  ];
  const [searchForm] = Form.useForm();

  // 搜索模块
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="title" label="标题">
                <Input placeholder="请输入" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="serviceAccountName" label="服务号名称">
                <Input placeholder="请输入" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="publisherName" label="发布账号">
                {/* <Select placeholder="请选择" allowClear >
                  <Select.Option value={0}>下架</Select.Option>
                  <Select.Option value={1}>上架</Select.Option>
                </Select> */}
                <Input placeholder="请输入" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="时间范围">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="articleType" label="内容类型">
                <Select placeholder="请选择" allowClear>
                  {/* <Select.Option value={'PICTURE_TEXT'}>图文</Select.Option>
                <Select.Option value={'PICTURE'}>图片</Select.Option>
                <Select.Option value={'TEXT'}>文字</Select.Option>
                <Select.Option value={'VIDEO'}>视频</Select.Option>
                <Select.Option value={'AUDIO'}>音频</Select.Option> */}
                  {addTypes.map((item) => (
                    <Select.Option value={item.type}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4} offset={4}>
              <Button
                style={{ marginRight: '20px' }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.publishStartTime = moment(search.time[0]).valueOf();
                    search.publishEndTime = moment(search.time[1]).valueOf();
                    delete search.time;
                  }
                  // 清空复选框
                  setSelectedRowKeys([]);
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

  // 用户手动选择
  const handleOnSelect = (record: React.Key[], selected: any[]) => {
    console.log('用户手动选择单个record', record)
    console.log('用户手动选择单个selected', selected)
    let keys = [...selectedRowKeys]
    if (selected) {
      keys = [...selectedRowKeys, record?.id]
    } else {
      keys = selectedRowKeys.filter((item) => item !== record.id)
    }
    setSelectedRowKeys(keys)
  }
  // 用户手动选择所有回调
  const handleOnSelectAll = (selected: any, selectedRows: any[], changeRows: any) => {
    console.log('选择全部selected', selected)
    console.log('选择全部selectedRows', selectedRows)
    console.log('选择全部changeRows', changeRows)
    if (selected) {
      const addCheckedKeys = changeRows.map((item: any) => {
        return item?.id
      })
      setSelectedRowKeys([...selectedRowKeys, ...addCheckedKeys])
    } else {
      const subCheckedKeys = selectedRowKeys.filter((id) => {
        return !changeRows.some((item: any) => {
          return item.id === id
        })
      })
      setSelectedRowKeys(subCheckedKeys)
    }
  }

  // 批量按钮的状态
  const [batchState, setBatchState] = useState<boolean>(true);
  const handleBatchCheck = (status: number) => {
    Modal.confirm({
      title: '提示',
      content: status === 2 ? '确定批量通过同步至产业圈' : '确定批量拒绝同步至产业圈',
      okText: '确定',
      onOk: () => {
        httpArticleBatchAudit({
          articleIds: selectedRowKeys,
          auditStatus: status,
        }).then((res) => {
          if (res?.code === 0) {
            message.success(status === 2 ? '显示至推荐页面' : '未显示于推荐页面');
            setTimeout(() => {
              getPage();
            }, 500);
          } else {
            message.error(res?.message);
          }
        });
      },
    });
  };

  useEffect(() => {
    if (selectedRowKeys.length === 0) {
      setBatchState(true);
    } else {
      setBatchState(false);
    }
  }, [selectedRowKeys]);

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-body')}>
        <div className={sc('container-table-header')}>
          <div>
            <Access accessible={access['PU_BLM_FWHNRGL']}>
              <Button
                disabled={batchState}
                type="primary"
                key="pass"
                onClick={() => {
                  handleBatchCheck(2);
                }}
              >
                批量通过
              </Button>
            </Access>
            <Access accessible={access['PU_BLM_FWHNRGL']}>
              <Button
                disabled={batchState}
                style={{ marginLeft: '10px' }}
                type="primary"
                key="reject"
                onClick={() => {
                  handleBatchCheck(3);
                }}
              >
                批量拒绝
              </Button>
            </Access>
          </div>
        </div>
        <SelfTable
          loading={loading}
          bordered
          scroll={{ x: 1580 }}
          rowSelection={
            access?.['PU_BLM_FWHNRGL'] && {
              fixed: true,
              selectedRowKeys,
              onSelectAll: handleOnSelectAll,
              onSelect: handleOnSelect,
              getCheckboxProps: (record: any) => ({
                disabled: record.auditStatus !== 1
              })
            }
          }
          rowKey={'id'}
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
