import { PlusOutlined, SendOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Form,
  Row,
  Col,
  Space,
  message,
  Tooltip,
  DatePicker,
  Popconfirm,
  Modal,
  Pagination,
  Drawer,
  Spin,
  Transfer,
  Radio
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { TransferDirection, TransferListProps } from 'antd/es/transfer';

import moment from 'moment';

import SelfTable from '@/components/self_table';

const { confirm } = Modal;

import type { ColumnsType } from 'antd/es/table';

import { history } from 'umi';

import { routeName } from '../../../../../config/routes';

import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import ApplicationManager from '@/types/service-config-digital-applictaion';
import UploadForm from '@/components/upload_form';
import UploadFormFile from '@/components/upload_form/upload-form-file';

import _ from 'lodash'

import {
  getApplicationList,
  getOrgList,
  addApplication,
  updateApplication,
  deleteApplication,
  pushApplication
} from '@/services/digital-application';

import { getFileInfo } from '@/services/common'

const sc = scopedClasses('service-config-digital-app-config');

export default () => {

  const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
  };

  const [searchContent, setSearchContent] = useState<{
    appName?: string; // 标题
  }>({});

  const [transferSearchContent, setTransferSearchContent] = useState<{
    orgName?: string; // 标题
  }>({});


  const [dataSource, setDataSource] = useState<ApplicationManager.Content[]>([]);

  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const [editingItem, setEditingItem] = useState<ApplicationManager.Content>({});

  const [pushType, setPushType] = useState<number>(0);

  const [createModalVisible, setModalVisible] = useState<boolean>(false);

  const [createDrawerVisible, setDrawerVisible] = useState<boolean>(false);

  const [companySelectModalVisible, setCompanySelectModalVisible] = useState<boolean>(false);

  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);

  const [pushSubmitLodaing, setPushSubmitLoading] = useState<boolean>(false);

  // 选中推送的数据
  const [selectedPushKeys, setSelectedPushKeys] = useState<React.Key[]>([]);

  const [companyTransferData, setCompanyTransferData] = useState<ApplicationManager.RecordType[]>([]);

  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [companySelectedData, setCompanySelectedData] = useState<ApplicationManager.RecordType[]>([]);

  const [transferModalSelectedData, setTransferModalSelectedData] = useState<ApplicationManager.RecordType[]>([]);

  const [transferSearchLoading, setTransferSearchLoading] = useState<boolean>(false);
  
  // 应用from
  const [appForm] = Form.useForm();

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

  /**
   * 准备数据等
   */
  const getAppList = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      setTableLoading(true)
      const { result, totalCount, pageTotal, code } = await getApplicationList({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
        setSelectedPushKeys([]);
      } else {
        message.error(`请求分页数据失败`);
      }
      setTableLoading(false)
    } catch (error) {
      setTableLoading(false)
      console.log(error);
    }
  };

  // 新增/编辑 应用
  const addOrUpdateApp = async () => {
    const tooltipMessage = editingItem.id ? '修改' : '添加';
    appForm
      .validateFields()
      .then(async (value) => {
        if (value.path && value.path.length) {
          value.path = value.path[0].uid
        } else {
          value.path = ''
        }
        console.log(value, '<---value');
        setAddOrUpdateLoading(true);
        const addorUpdateRes = await (editingItem.id
          ? updateApplication({
              ...value,
              id: editingItem.id,
            })
          : addApplication({ ...value }));
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          message.success(`${tooltipMessage}成功`);
          clearForm();
          getAppList()
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch(() => {
        setAddOrUpdateLoading(false);
      });
  }

  const getCompanyList = async (pageIndex: number = 1, pageSize = transferPageInfo.pageSize) => {
    try {
      console.log('searched ', transferSearchContent.orgName);
      setTransferSearchLoading(true)
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
        const mixinList = _.uniqBy(list.concat(transferModalSelectedData), 'key')
        setCompanyTransferData(mixinList)
      } else {
        message.error(`请求公司列表数据失败`);
      }
      setTransferSearchLoading(false)
    } catch (error) {
      console.log(error)
      setTransferSearchLoading(false)
    }
  }

  useEffect(() => {
    getAppList();
  }, [searchContent]);


  useEffect(() => {
    getCompanyList();
  }, [transferSearchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
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

  // 应用弹窗
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? (editingItem.isDetail ? '应用详情' : '修改应用') : '新增应用'}
        width="600px"
        visible={createModalVisible}
        maskClosable={false}
        onCancel={() => setModalVisible(false)}
        footer={
          !editingItem.isDetail ? (
            [
              <Button key="back" onClick={() => {
                clearForm();
                setModalVisible(false);
              }}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={addOrUpdateLoading} onClick={addOrUpdateApp}>
                确定
              </Button>
            ]
          ) : null
        }
      >
        {
          editingItem.isDetail ? (
            <Form {...formLayout} form={appForm} layout="horizontal">
              <Form.Item style={{marginBottom: '20px'}} label="应用名称">
                {editingItem.appName}
              </Form.Item>
              <Form.Item style={{marginBottom: '20px'}} label="应用详情">{editingItem.content}</Form.Item>
              <Form.Item style={{marginBottom: '20px'}} label="应用图标">
                <div className='app-icon'>
                  <img src={`/antelope-manage/common/download/${editingItem.logoImageId}`} alt="图片损坏" />
                </div>
              </Form.Item>
              <Form.Item label="操作手册">
                {
                  editingItem.path && editingItem.path[0]?.uid ? (
                    <Button
                      type="link"
                      disabled={!editingItem.path}
                      href={`/antelope-manage/common/download/${editingItem.path[0].uid}`}
                      download={`/antelope-manage/common/download/${editingItem.path[0].uid}`}
                    >
                      {editingItem.path[0].name}
                    </Button>
                  ) : (
                    <div className='upload-tip'>未上传</div>
                  )
                }
                
              </Form.Item>
            </Form>
          ) : (
            <Form {...formLayout} form={appForm} layout="horizontal">
              <Form.Item
                style={{marginBottom: '20px'}}
                rules={[
                  {
                    validator: async (_, value: string) => {
                      if (!value) {
                        return Promise.reject(new Error('请输入应用名称；'));
                      } else if (value.length < 2 || value.length > 20) {
                        return Promise.reject(new Error('应用名称长度为2-20个字符；'));
                      }
                      return
                    },
                  },
                ]}
                name="appName"
                label="应用名称"
                required
              >
                <Input placeholder="请输入2-20个字符" maxLength={20} />
              </Form.Item>
              <Form.Item
              style={{marginBottom: '20px'}}
              rules={[
                  {
                    validator: async (_, value: string) => {
                      if (!value) {
                        return Promise.reject(new Error('请输入应用描述；'));
                      } else if (value.length > 200) {
                        return Promise.reject(new Error('应用描述不能超过200个字符；'));
                      }
                      return
                    },
                  },
                ]}
                name="content"
                label="应用描述"
                required
                >
                  <Input.TextArea
                    placeholder="请输入"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    maxLength={200}
                    showCount
                  />
              </Form.Item>
              <Form.Item
                name="logoImageId"
                label="应用图标"
                style={{marginBottom: '20px'}}
                rules={[
                  {
                    required: true,
                    validator: () => {
                      if (
                        appForm.getFieldValue('logoImageId')
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('请上传'));
                    },
                  },
                ]}
              >
                <UploadForm
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    maxSize={2}
                    tooltip={
                      <span className="upload-tip"> 请上传JPG/PNG格式、240*240px以上、1:1 、2MB 以内的无圆角图标</span>
                    }
                    accept=".png,.jpeg,.jpg"
                  />
              </Form.Item>

              <Form.Item name="path" label="操作手册">
                <UploadFormFile isSkip={true} accept=".pdf" showUploadList={true} maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传文件</Button>
                </UploadFormFile>
              </Form.Item>
            </Form>
          )
        }
      </Modal>
    );
  };

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
          const form = _.cloneDeep(value)
          if (form.pushTime) form.pushTime = moment(form.pushTime).format('YYYY-MM-DD HH:mm:ss')
          if (Array.isArray(form.timeRange)) {
            form.startTime = moment(form.timeRange[0]).format('YYYY-MM-DD HH:mm:ss')
            form.endTime = moment(form.timeRange[1]).format('YYYY-MM-DD HH:mm:ss')
            delete form.timeRange
          }
          form.orgIds = companySelectedData.map((e: ApplicationManager.RecordType) => Number(e.key))
          form.apiIds = [...selectedPushKeys]
          pushApplication(form).then((res) => {
            if (res.code === 0) {
              message.success('推送成功')
              setSelectedPushKeys([])
              pushForm.resetFields()
              setDrawerVisible(false)
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
  
      const handleOnSearch = _.debounce((dir: TransferDirection, value: string) => {
        console.log('search:', dir, value);
        if (dir === 'left') {
          setTransferPageInfo({
            ...transferPageInfo,
            pageIndex: 1
          })
          setTransferSearchContent({
            orgName: value
          })
        }
      }, 1000, { leading: false, trailing: true })
  
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
            titles={[(
              <Spin spinning={transferSearchLoading}></Spin>
            ), (
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

  // 清除form数据
  const clearForm = () => {
    appForm.resetFields();
    setEditingItem({});
  };

  const rowSelection = {
    selectedRowKeys: selectedPushKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: ApplicationManager.Content[]) => {
      setSelectedPushKeys(selectedRowKeys)
    }
  };

  // 删除应用
  const remove = async (apiId: number) => {
    try {
      const removeRes = await deleteApplication({ apiId });
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getAppList()
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showEditOrDetail = (row: ApplicationManager.Content, isDetail?: boolean) => {
    const item: ApplicationManager.Content = { ...row }
    if (row.path) {
      let reportFileId: any = ''
      getFileInfo(row.path).then((res) => {
        if (res?.code === 0 && res?.result) {
          if (res.result[0]) reportFileId = res.result[0]
        }
      }).finally(() => {
        item.path = reportFileId ? [
          {
            uid: reportFileId.id,
            name: reportFileId.name  + '.' + reportFileId.format,
            status: 'done',
          }
        ] : undefined
        setEditingItem({ ...item, isDetail: Boolean(isDetail) })
        setModalVisible(true)
        appForm.setFieldsValue(item)
      })
    } else {
      item.path = undefined
      setEditingItem({ ...item, isDetail: Boolean(isDetail) })
      setModalVisible(true)
      appForm.setFieldsValue(item)
    }
  }
  
  const columns: ColumnsType<ApplicationManager.Content> = [
    {
      title: '应用',
      dataIndex: 'title',
      render: (_: any, row: ApplicationManager.Content) => (
        <div className="table-app-row">
          <img src={`/antelope-manage/common/download/${row.logoImageId}`} alt="图片损坏" />
          <div className='info'>
            <Tooltip title={row.appName}>
              <span onClick={() => {
                history.push(`${routeName.DIGITAL_APPLICATION_DETAIL}?id=${row.id}`)
              }}>{ row.appName }</span>
            </Tooltip>
            <Tooltip title={row.content} placement="right">
              <span>{ row.content }</span>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      width: 130,
      dataIndex: 'option',
      render: (_: any, row: ApplicationManager.Content) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => showEditOrDetail(row, true)}
            >
              查看
            </Button>
            <Button
              type="link"
              onClick={() => showEditOrDetail(row, false)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(row.id!)}
            >
              <Button type="link">
                删除
              </Button>
            </Popconfirm>
            <Button
              type="link"
              disabled={!row.path}
              href={`/antelope-manage/common/download/${row.path}`}
              download={`/antelope-manage/common/download/${row.path}`}
              onClick={() => message.success(`下载成功，请查阅`) }
            >
              下载手册
            </Button>
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
          <span>应用推送列表(共{pageInfo.totalCount || 0}个)</span>
          <div className={'action'}>
            <Button
              type="primary"
              disabled={!selectedPushKeys.length}
              onClick={() => {
                setCompanySelectedData([])
                clearForm()
                pushForm.setFieldsValue({
                  type: 0
                })
                setDrawerVisible(true)
              }}
            >
              <SendOutlined /> 推送应用
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setEditingItem({})
                setModalVisible(true)
              }}
            >
              <PlusOutlined /> 新增应用
            </Button>
          </div>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <Spin spinning={tableLoading}>
          <SelfTable
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            
            rowKey={'id'}
            pagination={
              pageInfo.totalCount === 0
                ? false
                : {
                    onChange: getAppList,
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
        <div className='select-app-count'>{selectedPushKeys.length ? `已选${selectedPushKeys.length}个应用` : ''}</div>
      </div>
      
      {useModal()}
      {useDrawer()}
    </div>
  );
};
