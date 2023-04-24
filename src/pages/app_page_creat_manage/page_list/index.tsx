import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
  Dropdown,
  Menu,
  Modal,
  Radio,
  Popover,
  message
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  getPageList,
  modifyTemplateState,
  getTemplateData,
  getTemplateOperationList,
  addOperationLog,
} from '@/services/page-creat-manage'
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { routeName } from '@/../config/routes';
import PreviewModal from '../edit/components/PreviewModal';
import { listAllAreaCode } from '@/services/common';
import { getOrderNum } from '@/services/order/order-manage';
const sc = scopedClasses('page-creat-list');
const statusMap = {
  0: '未发布',
  1: '已发布'
}
const statusOptions = [
  {
    label: '未发布',
    value: '0'
  },
  {
    label: '已发布',
    value: '1'
  }
]

interface record {
  tmpId: string;
  tmpName: string;
  tmpDesc: string;
  state: string | number,
  updateTime: string,
  tmpJson: string,
  tmpType: number,
}


export default () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const [openMenuId, setMenuOpen] = useState<any>('')
  const [areaCodeOptions, setAreaCodeOptions] = useState<any>({ county: [], city: [], province: [] })
  const [templateJson, setTemplateJson] = useState<any>({})
  const [previewVisible, setPreviewVisible] = useState(false)
  const [menuData, setMenuData] = useState<any>([])
  const [tmpType, setTmpType] = useState<any>(0)
  const history = useHistory();
  const [searchForm] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize, templateType: number = tmpType) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getPageList({
        pageIndex,
        pageSize,
        tmpType: 2,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };


  const handlePublish = (record: record) => {
    addOperationLog({
      tmpId: record.tmpId,
      type: 2,
    })
    modifyTemplateState({
      tmpId: record.tmpId,
      state: 1,
    }).then((res) => {
      if (res.code === 0) {
        antdMessage.success(`发布成功`);
        history.push(`${routeName.APP_PAGE_CREAT_MANAGE_PUBLISH}?id=${record.tmpId}&type=${record.tmpType || ''}`);
      } else {
        antdMessage.error(`${res.message}`);
      }
    })
  }
  const checkLink = (record: record) => {
    window.open(`${routeName.APP_PAGE_CREAT_MANAGE_PUBLISH}?id=${record.tmpId}&type=1`);
  }
  const checkData = (record: record) => {
    getTemplateData({
      pageSize: 1,
      pageIndex: 1,
      tmpId: record.tmpId
    }).then((res) => {
      const { result } = res
      if (res.code === 0) {
        if (!result.data) {
          Modal.info({
            title: '提示',
            content: '此表单暂时还没有答卷',
            okText: '我知道了',
          })
        } else {
          history.push(`${routeName.PAGE_CREAT_MANAGE_PAGE_DATA}?tmpName=${encodeURIComponent(record.tmpName)}&id=${record.tmpId}`);
        }
      } else {
        antdMessage.error(`${res.message}`);
      }
    })
  }

  const handleDelete = (record: record) => {
    Modal.confirm({
      title: '提示',
      content: '删除后用户将不能访问，但不会影响已有数据，确认删除？',
      okText: '删除',
      onOk: () => {
        modifyTemplateState({
          tmpId: record.tmpId,
          state: 2,
        }).then((res) => {
          if (res.code === 0) {
            antdMessage.success(`删除成功`);
            const { totalCount, pageIndex, pageSize } = pageInfo
            const newTotal = totalCount - 1 || 1;
            const newPageTotal = Math.ceil(newTotal / pageSize) || 1
            getPage(pageIndex > newPageTotal ? newPageTotal : pageIndex, pageSize, tmpType)
          } else {
            antdMessage.error(`${res.message}`);
          }
        })
      },
    })
  }

  const handleEdit = (record: record) => {
    addOperationLog({
      tmpId: record.tmpId,
      type: 0,
    }).then(() => {
      history.push(`${routeName.APP_PAGE_CREAT_MANAGE_EDIT}?id=${record.tmpId}&type=${1 || ''}`);
    })
  }

  const handleDrop = (record: record) => {
    Modal.confirm({
      title: '提示',
      content: '下架后用户将不能访问，确认下架？若重新发布，之前的分享链接还可继续使用？',
      okText: '下架',
      onOk: () => {
        addOperationLog({
          tmpId: record.tmpId,
          type: 1,
        })
        modifyTemplateState({
          tmpId: record.tmpId,
          state: 0,
        }).then((res) => {
          if (res.code === 0) {
            antdMessage.success(`下架成功`);
            getPage(pageInfo.pageIndex, pageInfo.pageSize, tmpType)
          } else {
            antdMessage.error(`${res.message}`);
          }
        })
      },
    })
  }

  const buttonClick = (type: string, record: record) => {
    if (type === 'drop') {
      handleDrop(record)
    }
    if (type === 'delete') {
      handleDelete(record)
    }
    if (type === 'edit') {
      handleEdit(record)
    }
    if (type === 'publish') {
      handlePublish(record)
    }
    if (type === 'link') {
      checkLink(record)
    }
    if (type === 'data_manage') {
      checkData(record)
    }
    if (type === 'order') {
      toOrder(record)
    }
  }

  const toOrder = async (record: record) => {
    try {

      const res = await getOrderNum(record.tmpId)

      if (res?.result?.num > 0) {
        history.push(`${routeName.ORDER_MESSAGE_INDEX}?source=ZDY_${record.tmpName}`);
      } else {
        Modal.info({
          title: '提示',
          content: `此数字化活动暂时还没有订单`,
          okText: '知道了',
        })
      }
      console.log('record', record)
    } catch { }
  }

  const getButtonList = (record: record) => {
    let buttonTypeList = [];
    // if (tmpType === 1) {
    //   buttonTypeList = record.state === 0 ?
    //     [{ type: 'publish', text: '发布' }, { text: '编辑', type: 'edit' }, { type: 'delete', text: '删除' }]
    //     : [{ type: 'link', text: '查看链接' }, { type: 'drop', text: '下架' }, { text: '删除', type: 'delete' }]
    // } else {
    buttonTypeList = record.state === 0 ?
      [{ type: 'publish', text: '发布' }, { type: 'more', children: [{ type: 'order', text: '查看订单' }, { type: 'delete', text: '删除' }, { text: '编辑', type: 'edit' }] }]
      : [{ type: 'link', text: '查看链接' }, { type: 'order', text: '查看订单' }, { type: 'drop', text: '下架' }]
    // }
    return buttonTypeList.map((item: any) => {
      if (item.type === 'more') {
        const { children } = item
        const menu = (
          <Menu>
            {
              children.map((child: { type: string, text: string }) => {
                return (
                  <Menu.Item
                    onClick={() => {
                      buttonClick(child.type, record)
                    }}
                  >
                    {child.text}
                  </Menu.Item>
                )
              })
            }
          </Menu>
        )
        return (
          <Dropdown overlay={menu}>
            <a>
              更多 <DownOutlined />
            </a>
          </Dropdown>
        )
      } else {
        return (
          <Button
            size="small"
            type="link"
            onClick={() => {
              buttonClick(item.type, record)
            }}
          >
            {item.text}
          </Button>
        )
      }
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
      title: '模版名称',
      dataIndex: 'tmpName',
      width: 150,
      render: (tmpName: string, record: record) => {
        // return <span onClick={() => {
        //   if (record.tmpJson && record.tmpType !== 1) {
        //     setTemplateJson(JSON.parse(record.tmpJson || '{}'))
        //     setPreviewVisible(true)
        //   } else {
        //     window.open(`${routeName.PAGE_CREAT_MANAGE_WEB_PREVIEW}?id=${record.tmpId || ''}&type=${record.tmpType || ''}`);
        //   }
        // }} style={{ cursor: 'pointer', color: '#6680FF' }}>{tmpName}</span>

        return <Popover content={
          <div style={{ display: 'grid', gap: 10 }}>
            <Button onClick={() => {
                window.open(`${routeName.APP_PAGE_CREAT_MANAGE_WEB_PREVIEW}?id=${record.tmpId || ''}`);
              }}
                type="primary"
              >pc</Button>
              <Button type="primary"
                onClick={() => {
                  window.open(`${routeName.APP_PAGE_CREAT_MANAGE_APP_PREVIEW}?id=${record.tmpId || ''}`);
                }}
              >
                app
              </Button>
          </div>
        }>
          <span style={{ cursor: 'pointer', color: '#6680FF' }}>{tmpName}</span>
        </Popover>
      }
    },
    {
      title: '描述信息',
      dataIndex: 'tmpDesc',
      isEllipsis: true,
      width: 250,
    },
    {
      title: 'pv',
      dataIndex: 'pv',
      render: (pv: string) => {
        return <span>{pv || '--'}</span>
      }
    },
    {
      title: 'uv',
      dataIndex: 'uv',
      render: (uv: string) => {
        return <span>{uv || '--'}</span>
      }
    },
    {
      title: '模板状态',
      dataIndex: 'state',
      width: 100,
      render: (status: string) => {
        return <span>{statusMap[status]}</span>
      }
    },

    {
      title: '最新操作时间',
      dataIndex: 'updateTime',
      width: 200,
      render: (creatTime: string, record: record) => {
        return (
          <>
            {moment(creatTime).format('YYYY-MM-DD HH:mm:ss')}
            <Dropdown
              visible={record.tmpId === openMenuId}
              overlayClassName="operation-list-drop-menu"
              onVisibleChange={(visible) => {
                if (visible) {
                  getTemplateOperationList({ tmpId: record.tmpId }).then((res) => {
                    if (res.code === 0) {
                      setMenuData(res?.result || [])
                      setMenuOpen(record.tmpId)
                    } else {
                      antdMessage.error(`获取操作记录失败`);
                    }
                  })
                } else {
                  setMenuOpen('')
                  setMenuData([])
                }
              }}
              trigger={['click']} overlay={() => {
                return (
                  <Menu>
                    {
                      menuData.map((item: { opTypeDesc: string, opTime: string, opUserName: string }, index: number) => {
                        return (
                          <Menu.Item key={index}>
                            <div className="operation-list">
                              <div className="title">{item.opTypeDesc}</div>
                              <div className="menu-right">
                                <div className='operation-time'>{item.opTime}</div>
                                <div>操作人：{item.opUserName}</div>
                              </div>
                            </div>
                          </Menu.Item>
                        )
                      })
                    }
                  </Menu>
                )
              }}>
              <a className="drop-menu">
                <DownOutlined />
              </a>
            </Dropdown>
          </>
        )
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_: any, record: any) => {
        return getButtonList(record)
      },
    },
  ];

  const [newWinUrl, setNewWinUrl] = useState<any>(null)

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    if (search.updateTime) {
      search.updateTimeStart = moment(search.updateTime[0]).startOf('days').format('YYYY-MM-DD HH:mm:ss');
      search.updateTimeEnd = moment(search.updateTime[1]).endOf('days').format('YYYY-MM-DD HH:mm:ss');
    }
    if (search.state) {
      search.state = search.state * 1
    }
    delete search.updateTime;
    return search;
  };
  useEffect(() => {
    listAllAreaCode().then((res) => {
      if (res?.result) {
        const { result } = res
        const city: any = []
        const province: any = []
        result.forEach((item: any) => {
          city.push({
            ...item,
            nodes: item.nodes?.map((node: any) => {
              const { nodes, ...reset } = node
              return reset
            })
          })
          const { nodes, ...reset } = item
          province.push(reset)
        })
        setAreaCodeOptions({
          county: result,
          city,
          province
        })
      }
    })
  }, [])
  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row>
            <Col span={4} offset={1}>
              <Form.Item name="tmpName" label="模板名称">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item name="state" label="模板状态">
                <Select
                  placeholder="请选择"
                  allowClear
                  options={statusOptions}
                />
              </Form.Item>
            </Col>
            <Col span={7} offset={1}>
              <Form.Item name="updateTime" label="最新操作时间">
                <DatePicker.RangePicker
                  allowClear
                  disabledDate={(current) => {
                    return current > moment().endOf('day');
                  }}
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
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          模版列表
          <Button
            type="primary"
            onClick={() => {
              window.open(`${routeName.APP_PAGE_CREAT_MANAGE_EDIT}?type=1`);
            }}
          >
            新建模版
          </Button>
        </div>
      </div>

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
        <PreviewModal
          title="预览"
          footer={null}
          visible={previewVisible}
          json={templateJson}
          onCancel={() => {
            setPreviewVisible(false)
          }}
          areaCodeOptions={areaCodeOptions}
        />
      </div>
    </PageContainer>
  );
};
