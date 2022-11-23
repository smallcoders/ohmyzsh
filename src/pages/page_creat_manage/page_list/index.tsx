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
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {getPageList} from '@/services/page-creat-manage'
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { routeName } from '@/../config/routes';
const sc = scopedClasses('page-creat-list');
const statusMap = {
  0: '未发布',
  1:  '已发布'
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
  id: number;
  pageName: string;
  pageDesc: string;
  status: string | number,
  updateTime: string
}


export default () => {
  const [dataSource, setDataSource] = useState<any>([{
    pageName: '问卷调查',
    pageDesc: '个人信息调查表',
    status: '1',
    updateTime: '2022-11-22 09:24:23'
  }]);
  const [searchContent, setSearChContent] = useState<any>({});
  const history = useHistory();
  const [searchForm] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getPageList({
        pageIndex,
        pageSize,
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
    // todo 发布接口
    history.push(`${routeName.PAGE_CREAT_MANAGE_PUBLISH}?id=${record.id}`);
  }
  const checkLink = (record: any) => {
    history.push(`${routeName.PAGE_CREAT_MANAGE_PUBLISH}?id=${record.id}`);
  }
  const checkData = (record: any) => {
    history.push(`${routeName.PAGE_CREAT_MANAGE_PUBLISH}?id=${record.id}`);
  }

  const handleDelete = (record: record) => {
    Modal.confirm({
      title: '提示',
      content: '删除后用户将不能填写，表单及其数据也将无法恢复，确认删除？',
      okText: '删除',
      onOk: () => {
        // todo 删除接口
        console.log(record)
      },
    })
  }

  const handleEdit = (record: record) => {
    // todo 编辑的记录接口
    history.push(`${routeName.PAGE_CREAT_MANAGE_EDIT}?id=${record.id}`);
  }

  const handleDrop = (record: record) => {
    Modal.confirm({
      title: '提示',
      content: '下架后用户将不能填写，确认下架？若重新发布，之前的分享链接还可继续使用？',
      okText: '下架',
      onOk: () => {
        // todo 下架接口
        console.log(record)
      },
    })
  }


  const menuItemClick = (type: string, record: record) => {
    if (type === '下架'){
      handleDrop(record)
    }
    if (type === '删除'){
      handleDelete(record)
    }
    if (type === '编辑'){
      handleEdit(record)
    }
  }

  const getButtonList = (record: record) => {
    const buttonTypeList = record.status === 0 ?
      [{type: 'publish'},{type: 'data_manage'}, {type: 'more', children: [{type: 'delete', text: '删除'}, {text: '编辑', type: 'edit'}]}]
      :[{type: 'link'},{type: 'data_manage'}, {type: 'more', children: [{type: 'drop', text: '下架'}, {text: '删除', type: 'delete'}]}]
    return buttonTypeList.map((item: any) => {
      if (item.type === 'publish'){
        return (
          <Button
            size="small"
            type="link"
            onClick={() => {
              handlePublish(record)
            }}
          >
            发布
          </Button>
        )
      }
      if (item.type === 'link'){
        return (
          <Button
            size="small"
            type="link"
            onClick={() => {
              checkLink(record)
            }}
          >
            查看链接
          </Button>
        )
      }
      if (item.type === 'data_manage'){
        return (
          <Button
            size="small"
            type="link"
            onClick={() => {
              // todo 判断是否有数据
              Modal.info({
                title: '提示',
                content: '此表单暂时还没有答卷',
                okText: '我知道了',
              })
              checkData(record)
            }}
          >
            数据管理
          </Button>
        )
      }
      if (item.type === 'more'){
        const { children } = item
        const menu = (
          <Menu>
            {
              children.map((child: {type: string, text: string}) => {
                return (
                  <Menu.Item
                    onClick={() => {
                      menuItemClick(child.type, record)
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
      }
      return null
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
      title: '模板名称',
      dataIndex: 'pageName',
      width: 150,
    },
    {
      title: '描述信息',
      dataIndex: 'pageDesc',
      isEllipsis: true,
      width: 250,
    },
    {
      title: '模板状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        return <span>{statusMap[status]}</span>
      }
    },

    {
      title: '最新操作时间',
      dataIndex: 'createTime',
      width: 200,
      render: (creatTime: string) => {
        return (
          <>
            {moment(creatTime).format('YYYY-MM-DD HH:mm:ss')}
            <Dropdown overlay={() => {
              return (
                <Menu>
                  {
                    [1,2,3,4].map(() => {
                      return (
                        <Menu.Item>
                           <div className="operation-list">
                             <div className="title">编辑菜单</div>
                             <div className="menu-right">
                               <div className='operation-time'>2022-06-14  12:32:23</div>
                               <div>操作人：顾小满</div>
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

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    if (search.updateTime) {
      search.startTime = moment(search.time[0]).format('YYYY-MM-DD');
      search.endTime = moment(search.time[1]).format('YYYY-MM-DD');
    }
    delete search.updateTime;
    return search;
  };
  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row>
            <Col span={4} offset={1}>
              <Form.Item name="pageName" label="模板名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item name="status" label="模板状态">
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
          <span>模版列表</span>
          <Button
            type="primary"
            onClick={() => {
              history.push(`${routeName.PAGE_CREAT_MANAGE_EDIT}`);
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
          // scroll={{ x: 1480 }}
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
