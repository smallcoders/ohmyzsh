import './app-push-record.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Form,
  Row,
  Col,
  Space,
  message,
  DatePicker,
  Select,
  Modal,
  Pagination,
  Drawer,
  Spin,
  Transfer,
  Radio,
  Tooltip
} from 'antd';

import { history } from 'umi';

import { routeName } from '../../../../../config/routes';

import SelfTable from '@/components/self_table';
import type { ColumnsType } from 'antd/es/table';

import {
  getPushRecordList,
  updatePushApplication,
  getOrgList
} from '@/services/digital-application';

import type { RadioChangeEvent } from 'antd';
import type { TransferDirection, TransferListProps } from 'antd/es/transfer';

import moment from 'moment';

import cloneDeep from 'lodash/cloneDeep'
import uniqBy from 'lodash/uniqBy'

import ApplicationManager from '@/types/service-config-digital-applictaion';
import Common from '@/types/common';

const { confirm } = Modal

const sc = scopedClasses('service-config-digital-app-push-record');
export default () => {

  const [searchContent, setSearchContent] = useState<{
    orgName?: string // 组织名称
    appName?: string; // 应用名称
    status?: 0|1, // 推送状态 0:未完成，1：已完成
    timeRange?: Array<any> // 领取有效时间范围
    startTime?: string
    endTime?: string
  }>({});

  const [transferSearchContent, setTransferSearchContent] = useState<{
    orgName?: string; // 标题
  }>({});

  const [dataSource, setDataSource] = useState<ApplicationManager.PushDetail[]>([]);

  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const [createDrawerVisible, setDrawerVisible] = useState<boolean>(false);

  const [companySelectModalVisible, setCompanySelectModalVisible] = useState<boolean>(false);

  const [pushSubmitLodaing, setPushSubmitLoading] = useState<boolean>(false);

  const [pushType, setPushType] = useState<number>(0);

  const [editingId, setEditingId] = useState<number|string>(0);

  // 选中推送的数据
  const [selectedPushKeys, setSelectedPushKeys] = useState<React.Key[]>([]);

  const [companyTransferData, setCompanyTransferData] = useState<ApplicationManager.RecordType[]>([]);

  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [companySelectedData, setCompanySelectedData] = useState<ApplicationManager.RecordType[]>([]);

  const [transferModalSelectedData, setTransferModalSelectedData] = useState<ApplicationManager.RecordType[]>([]);

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const [transferPageInfo, setTransferPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const [searchForm] = Form.useForm();

  useEffect(() => {
    getPushList();
  }, [searchContent]);

  useEffect(() => {
    getCompanyList();
  }, [transferSearchContent, editingId]);

   /**
   * 准备数据等
   */
  const getPushList = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      setTableLoading(true)
      const searchForm = cloneDeep(searchContent)
      if (Array.isArray(searchForm.timeRange)) {
        searchForm.startTime = moment(searchForm.timeRange[0]).format('YYYY-MM-DD HH:mm:ss')
        searchForm.endTime = moment(searchForm.timeRange[1]).format('YYYY-MM-DD HH:mm:ss')
        delete searchForm.timeRange
      }
      const { result, totalCount, pageTotal, code } = await getPushRecordList({
        pageIndex,
        pageSize,
        ...searchForm,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
      setTableLoading(false)
    } catch (error) {
      setTableLoading(false)
      console.log(error);
    }
  };

  const getCompanyList = async (pageIndex: number = 1, pageSize = transferPageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getOrgList({
        pageIndex,
        pageSize,
        ...transferSearchContent
      });
      if (code === 0) {
        setTransferPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        const list: Array<ApplicationManager.RecordType> =  result.map((e: any) => {
          return {
            key: e.id.toString(),
            title: e.orgName
          }
        })
        const mixinList = uniqBy(list.concat(transferModalSelectedData), 'key')
        setCompanyTransferData(mixinList)
      } else {
        message.error(`请求公司列表数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 推送form
  const [pushForm] = Form.useForm();

  // 推送弹窗
  const useDrawer = (): React.ReactNode => {

    // 提交推送
    const handlePushSubmit = () => {
      pushForm
        .validateFields()
        .then(async (value) => {
          console.log(value, '<---value');
          setPushSubmitLoading(true);
          const form = cloneDeep(value)
          form.id = editingId
          if (form.pushTime) form.pushTime = moment(form.pushTime).format('YYYY-MM-DD HH:mm:ss')
          if (Array.isArray(form.timeRange)) {
            form.startTime = moment(form.timeRange[0]).format('YYYY-MM-DD HH:mm:ss')
            form.endTime = moment(form.timeRange[1]).format('YYYY-MM-DD HH:mm:ss')
            delete form.timeRange
          }
          form.orgIds = companySelectedData.map((e: ApplicationManager.RecordType) => Number(e.key))
          form.apiIds = [...selectedPushKeys]
          updatePushApplication(form).then((res) => {
            if (res.code === 0) {
              message.success('编辑成功')
              pushForm.resetFields()
              setDrawerVisible(false)
              getPushList()
            } else {
              message.error(`推送成功失败，原因:{${res.message}}`)
            }
          }).finally(() => {
            setPushSubmitLoading(false);
          })
        })
    }

    // 企业选择弹窗
    const companySelectModal = (): React.ReactNode => {

      const handleChange = (
        newTargetKeys: string[]
      ) => {
        setTargetKeys(newTargetKeys);
        setTransferModalSelectedData(companyTransferData.filter((e) => {
          return !!~newTargetKeys.indexOf(e.key)
        }))
      };
    
      const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
        const resKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
        setSelectedKeys(resKeys);
      };
  
      const handleOnSearch = (dir: TransferDirection, value: string) => {
        if (dir === 'left') {
          setTransferPageInfo({
            ...transferPageInfo,
            pageIndex: 1
          })
          setTransferSearchContent({
            orgName: value
          })
        }
      }
  
      const renderFooter: any = (
        _: TransferListProps<any>,
        {
          direction,
        }: {
          direction: TransferDirection;
        },
      ) => {
        if (direction === 'left') {
          return (
            <Pagination 
              style={{padding: '10px 0'}}
              size="small"
              current={transferPageInfo.pageIndex} 
              onChange={getCompanyList} 
              total={transferPageInfo.totalCount}
              pageSize={transferPageInfo.pageSize}
              pageSizeOptions={[10, 20, 30]}
          />
          );
        }
        return
      };
    
      
      return (
        <Modal
          title="请选择推送企业"
          width="900px"
          visible={companySelectModalVisible}
          maskClosable={false}
          onCancel={() => {
            setCompanySelectModalVisible(false);
          }}
          onOk={() => {
            pushForm.validateFields(['orgIds'])
            setCompanySelectedData(transferModalSelectedData)
            setCompanySelectModalVisible(false)
          }}
        >
          <Transfer
            showSearch
            titles={['', (
              targetKeys.length ? (
                <div className='transfer-header-right'>
                  <div className='title'>
                    { `已选：${targetKeys.length}家企业` }
                  </div>
                  <div className='action'>
                    <Button
                        type="link"
                        size='small'
                        onClick={() => setTargetKeys([])}
                      >
                      清空
                    </Button>
                  </div>
                </div>
              ) : ''
            )]}
            dataSource={companyTransferData}
            targetKeys={targetKeys}
            listStyle={{
              width: 400,
              height: 400
            }}
            selectedKeys={selectedKeys}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            onSearch={handleOnSearch}
            oneWay
            render={item => item.title}
            footer={renderFooter}
          />
        </Modal>
      )
    }

    const beforeCloseDrawer = () => {
      confirm({
        title: '确认关闭弹窗?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          pushForm.resetFields()
          setDrawerVisible(false);
        }
      })
    }

    return (
      <Drawer title="推送应用" width={600} placement="right" onClose={beforeCloseDrawer} visible={createDrawerVisible}
        extra={
          <Space>
            <Button onClick={beforeCloseDrawer}>取消</Button>
            <Button onClick={handlePushSubmit} loading={pushSubmitLodaing} type="primary">
              确定
            </Button>
          </Space>
        }>
        <Form form={pushForm} layout="horizontal">
          <Form.Item
            label="推送企业"
            name="orgIds"
            required
            className='company-form-content'
            rules={[
              {
                validator: async (_, value: number) => {
                  if (companySelectedData.length) return Promise.resolve();
                  return Promise.reject(new Error('请选择至少一个推送企业'))
                },
              },
            ]}
          >
            <div className='push-company-container'>
              <div className='company-list'>
              {
                companySelectedData.length ? companySelectedData.map((e: ApplicationManager.RecordType, index: number) => (
                  <div className='list-item' key={index} title={e.title}>{ e.title }</div>
                )) : <div className='empty'>请添加推送企业</div>
              }
              </div>
              <Button
                className='edit-button'
                type="link"
                onClick={() => {
                  setTransferModalSelectedData(companySelectedData)
                  setTargetKeys(companySelectedData.map(e => e.key))
                  setSelectedKeys([])
                  setCompanySelectModalVisible(true)
                }}
              >
                {companySelectedData.length ? '编辑' : '添加'}
              </Button>
            </div>
          </Form.Item>
          <Form.Item
            name="type"
            label="推送方式"
            required
            rules={[
              {
                validator: async (_, value: number) => {
                  if (value === 0 || value === 1) return Promise.resolve();
                  return Promise.reject(new Error('请选择推送方式'))
                },
              },
            ]}
          >
            <Radio.Group onChange={(e: RadioChangeEvent) => setPushType(e.target.value)}>
              <Radio value={0}>即时推送</Radio>
              <Radio value={1}>定时推送</Radio>
            </Radio.Group>
          </Form.Item>
          {pushType === 1 &&
            (
              <Form.Item
              name="pushTime"
              label="推送时间"
              required
              rules={[
                {
                  validator: async (_, value: number) => {
                    if (value) {
                      const timeRange = pushForm.getFieldValue('timeRange')
                      if (timeRange && timeRange.length === 2) {
                        // 若选取了领取有效时间 ，则判定 领用有效结束时间要大于推送时间
                        const diff: number = moment(value).diff(moment(timeRange[1]))
                        const res = Number((diff / 1000).toFixed(0))
                        if (res > 0) {
                          return Promise.reject(new Error('推送时间应小于最迟领取有效时间'))
                        } else if (res > -60) {
                          return Promise.reject(new Error('推送时间与最迟领取有效时间过于接近'))
                        }
                      }
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('请选择推送时间'))
                  },
                },
              ]}
              >
                <DatePicker format="YYYY-MM-DD HH:mm:ss" allowClear showTime />
              </Form.Item>
            )
          }
          <Form.Item
            name="timeRange"
            label="领取有效时间"
            required
            rules={[
              {
                validator: async (_, value: Array<number>) => {
                  if (value && value.length === 2) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('请选择领取有效时间'))
                },
              },
            ]}>
            <DatePicker.RangePicker allowClear showTime />
          </Form.Item>
        </Form>
        {companySelectModal()}
      </Drawer>
    );
  };


  const useSearchNode = (): React.ReactNode => {
    
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row justify="space-between">
            <Col>
              <Form.Item name="appName" label="应用名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="orgName" label="推送企业">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="timeRange" label="领取有效时间">
              <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="status" label="推送状态">
                <Select style={{ width: 120 }} placeholder="全部" allowClear>
                  <Select.Option value={0}>待推送</Select.Option>
                  <Select.Option value={1}>已完成</Select.Option>
                </Select>
              </Form.Item>
            </Col>
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

  const columns: ColumnsType<ApplicationManager.PushDetail> = [
    { title: '序号', dataIndex: 'sort', width: 60, render: (_: any, _record: any, index: number) => index + 1 },
    { title: 'ID', dataIndex: 'id'  },
    { title: '推送时间', dataIndex: 'pushTime'  },
    { title: '应用名称', dataIndex: 'appNames', render: (_: any, row: any) => {
        return (
          <Tooltip title={row.appNames}>
            <div className='textoverflow2'>{row.appNames}</div>
          </Tooltip>
        )
      }
    },
    { title: '推送企业', dataIndex: 'orgNames', render: (_: any, row: any) => {
        return (
          <Tooltip title={row.orgNames}>
            <div className='textoverflow2'>{row.orgNames}</div>
          </Tooltip>
        )
      }
    },
    {
      title: '领取有效时间',
      dataIndex: 'timeRange',
      width: 200,
      render: (_: any, row: any) => row.startTime + ' - ' + row.endTime
    },
    { title: '推送状态', dataIndex: 'status', width: 100, render: (_: any, row: ApplicationManager.PushDetail) => row.status === 1 ? '已完成' : '待推送' },
    {
      title: '操作',
      width: 150,
      dataIndex: 'option',
      render: (_: any, row: ApplicationManager.PushDetail) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                history.push(`${routeName.DIGITAL_APPLICATION_PUSH_DETAIL}?id=${row.id}`);
              }}
            >
              查看
            </Button>
            {
              row.status === 0 ? (
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedPushKeys((row.app as any).map((e: any) => e.id))
                    const selectedCompany = (row.org as any).map((e: any) => {
                      return {
                        key: e.id.toString(),
                        title: e.orgName
                      }
                    })
                    setCompanySelectedData(selectedCompany)
                    setTransferModalSelectedData(selectedCompany)
                    setTargetKeys(selectedCompany.map((e: any) => e.key))
                    setPushType(row.type as number)
                    setEditingId(row.id!)
                    pushForm.setFieldsValue({
                      type: row.type,
                      pushTime: row.type && row.pushTime && moment(row.pushTime, 'YYYY-MM-DD HH:mm:ss'),
                      timeRange: [moment(row.startTime, 'YYYY-MM-DD HH:mm:ss'), moment(row.endTime, 'YYYY-MM-DD HH:mm:ss')],
                    })
                    setTransferPageInfo({
                      ...transferPageInfo,
                      pageIndex: 1
                    })
                    setDrawerVisible(true)
                  }}
                >
                  编辑
                </Button>
              ) : null
            }
          </Space>
        );
      },
    },
  ]

  return (
    <div
      className={sc('container')}
    >
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>推送记录列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <Spin spinning={tableLoading}>
          <SelfTable
            rowKey={'id'}
            pagination={
              pageInfo.totalCount === 0
                ? false
                : {
                    onChange: getPushList,
                    total: pageInfo.totalCount,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    current: pageInfo.pageIndex,
                    pageSize: pageInfo.pageSize,
                    showTotal: (total: number) =>
                      `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                  }
            }
            columns={columns}
            dataSource={dataSource}
          />
        </Spin>
      </div>
      {useDrawer()}
    </div>
  );
};
