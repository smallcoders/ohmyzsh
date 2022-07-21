import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Form, Modal, message, Space, Popconfirm, Table, DatePicker, Col, Row } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import '../index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { arrayMoveImmutable } from 'array-move';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import OrgTypeManage from '@/types/org-type-manage';
import IndustryTable from './industry-table';
import { addIndustryTopic, getIndustryTopicData, saveIndustryTopic } from '@/services/industry-topic';
import { getEnumByNameByScience } from '@/services/common';
import { Prompt } from 'umi';
const sc = scopedClasses('service-config-app-news');

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

export default (props: { currentTab: any; }) => {

  const { currentTab } = props
  const [modalInfo, setModalInfo] = useState<{
    type: string,
    visible: boolean,
    typeName: string,
    detailIdList: string[],
  }>({
    type: '',
    visible: false,
    typeName: '',
    detailIdList: []
  });
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [addDataSource, setAddDataSource] = useState<any[]>([]);
  const [searchContent, setSearchContent] = useState<any>({});
  const [pagination, setPagination] = useState<any>({
    pageIndex: 10,
    pageSize: 10,
    total: 0,
  });

  const [editingItem, setEditingItem] = useState<OrgTypeManage.Content>({});
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [enumObj, setEnumObj] = useState<any>({});

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [form] = Form.useForm();
  const rootRef = useRef({})

  const prepare = async () => {
    try {
      const res = await
        getEnumByNameByScience('INDUSTRY_DATA_TYPE')
      let enumObj = {};
      res?.result?.map(
        p => {
          enumObj[p.enumName] = p.name
        }
      )
      setEnumObj(enumObj)

    } catch (error) {
      message.error('获取行业类型失败');
    }
  };
  useEffect(() => {
    prepare();
  }, []);

  const getPages = async () => {
    try {
      const { result, code } = await getIndustryTopicData(currentTab.enumName);
      if (code === 0) {
        setDataSource(
          result
        );
      } else {
        message.error(`请求列表数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSameData = (type: string, data: any[]) => {
    setDataSource(p => {
      const item = p.find(x => x.dataType === type)
      item.dataList = [...data]
      return p
    })
  }

  const addOrUpdate = async () => {
    const callback = () => {

      const tooltipMessage = '发布';
      form
        .validateFields()
        .then(async (value) => {
          setAddOrUpdateLoading(true);

          let dataList = [];
          for (const key in rootRef.current) {
            if (Object.prototype.hasOwnProperty.call(rootRef.current, key)) {
              const element = rootRef.current[key];
              dataList.push({
                dataType: key,
                detailIdList: element?.data?.map(p => p.detailId)
              })
            }
          }

          const addorUpdateRes = await saveIndustryTopic({
            industry: currentTab.enumName,
            dataList,
          });
          if (addorUpdateRes.code === 0) {
            message.success(`${tooltipMessage}成功`);
            getPages();
            clearSelectInfo();
            onEdit()
          } else {
            message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
          }
          setAddOrUpdateLoading(false);
        })
        .catch(() => {
          setAddOrUpdateLoading(false);
        });
    }

    Modal.confirm({
      title: '提示',
      content: '确认发布当前产业专题的配置吗？',
      okText: '发布',
      okButtonProps: { loading: addOrUpdateLoading },
      onOk: () => {
        callback();
      }
    })
  };

  const clearSelectInfo = () => {
    form.resetFields();
    setSelectedRowKeys([])
    setAddDataSource([])
    setModalInfo({
      visible: false,
      type: '',
      typeName: '',
      detailIdList: []
    })
  }

  const onSelectItems = () => {

    if (selectedRowKeys?.length === 0) {
      message.warning('至少选择一项')
      return
    }

    setDataSource(p => {
      const item = p.find(x => x.dataType === modalInfo.type)
      item.dataList = [...item.dataList, ...addDataSource.filter(f => selectedRowKeys?.includes(f.detailId))]
      return p
    })

    clearSelectInfo()
  }

  useEffect(() => {
    if (currentTab?.enumName) {
      getPages();
    }
  }, [currentTab]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getOptions = async (searchParams: any) => {
    try {
      const { result, code, totalCount } = await addIndustryTopic({
        industry: currentTab.enumName,
        dataType: searchParams.dataType || modalInfo.type,
        ...searchParams,
      });
      if (code === 0) {
        setAddDataSource(
          result
        );
        setPagination({
          pageSize: searchParams.pageSize, pageIndex: searchParams.pageIndex, total: totalCount
        })
      } else {
        message.error(`请求列表数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  }



  const useModal = (): React.ReactNode => {

    let [columns, searchFormItems] = getAutoContent(modalInfo.type)

    return (
      <Modal
        title={`添加数据-${modalInfo.typeName}（${currentTab.name}）`}
        width="1200px"
        visible={modalInfo.visible}
        maskClosable={false}
        onCancel={clearSelectInfo}
        footer={
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              当前已选：{selectedRowKeys.length}项<Button type='link' onClick={() => {
                setSelectedRowKeys([])
              }}>清空</Button>
            </div>
            <Space size={20}>
              <Button onClick={() => {
                clearSelectInfo()
              }}>取消</Button>
              <Button type='primary' loading={addOrUpdateLoading} onClick={() => {
                onSelectItems()
              }}>确定</Button>
            </Space>
          </div>
        }
      >
        <Form {...formLayout} form={form} layout="horizontal">
          <Row>
            {
              searchFormItems?.map(p =>
                <Col span={10}>
                  <Form.Item
                    name={p.name}
                    label={p.label}
                  >
                    {p.render()}
                  </Form.Item></Col>)
            }
            <Col span={4}><Space size={20} style={{
              marginBottom: 24
            }} >

              <Button type='primary' loading={addOrUpdateLoading} onClick={() => {
                const search = form.getFieldsValue()
                const { time, ...rest } = search;
                if (time) {
                  rest.startPublishTime = moment(time[0]).format('YYYY-MM-DD HH:mm:ss');
                  rest.endPublishTime = moment(time[1]).format('YYYY-MM-DD HH:mm:ss');
                }
                setSearchContent(rest);
                getOptions({ ...rest, ...pagination, pageIndex: 1, detailIdList: modalInfo.detailIdList ||[] })
              }}>查询</Button>
              <Button onClick={() => {
                form.resetFields()
                setSearchContent({});
                getOptions({ ...pagination, pageIndex: 1, detailIdList: modalInfo.detailIdList ||[] })
              }}>重置</Button>
            </Space>
            </Col>
          </Row>
        </Form>

        <Table
          size='small'
          scroll={{ y: 500 }}
          rowKey={'detailId'}
          pagination={{
            current: pagination.pageIndex,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showQuickJumper: true
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={addDataSource}
          onChange={(e) => {
            const page = {
              ...pagination,
              pageSize: e.pageSize,
              pageIndex: e.current,
            }
            setSearchContent({
              ...searchContent, ...page
            })
            getOptions({
              ...searchContent, ...page
            })
          }}
        />

      </Modal >
    );
  };

  const getAutoContent = (type: string) => {
    let columns;
    let searchFormItems;
    switch (type) {
      case 'DEMAND':
        columns = [
          {
            title: '企业需求名称',
            dataIndex: 'name',
          },
          {
            title: '需求内容',
            dataIndex: 'content',
          },
          {
            title: '发布时间',
            dataIndex: 'publishTime',
          },
        ];
        searchFormItems = [
          {
            label: '企业需求名称',
            name: 'name',
            render: () => {
              return <Input placeholder="请输入" maxLength={35} />
            }
          },
          {
            label: '时间区间',
            name: 'time',
            render: () => {
              return <DatePicker.RangePicker allowClear showTime />
            }
          },
        ];
        break;
      case 'CREATIVE_DEMAND':
        columns = [
          {
            title: '创新需求名称',
            dataIndex: 'name',
          },
          {
            title: '需求内容',
            dataIndex: 'content',
          },
          {
            title: '发布时间',
            dataIndex: 'publishTime',
          },
        ];
        searchFormItems = [
          {
            label: '创新需求名称',
            name: 'name',
            render: () => {
              return <Input placeholder="请输入" maxLength={35} />
            }
          },
          {
            label: '时间区间',
            name: 'time',
            render: () => {
              return <DatePicker.RangePicker allowClear showTime />
            }
          },
        ];
        break;
      case 'CREATIVE_ACHIEVEMENT':
        columns = [
          {
            title: '科技成果名称',
            dataIndex: 'name',
          },
          {
            title: '发布时间',
            dataIndex: 'publishTime',
          },
        ];
        searchFormItems = [
          {
            label: '科技成果名称',
            name: 'name',
            render: () => {
              return <Input placeholder="请输入" maxLength={35} />
            }
          },
          {
            label: '时间区间',
            name: 'time',
            render: () => {
              return <DatePicker.RangePicker allowClear showTime />
            }
          },
        ];
        break;
      case 'EXPERT':
        columns = [
          {
            title: '专家姓名',
            dataIndex: 'name',
          },
          {
            title: '手机号',
            dataIndex: 'phone',
          },
        ];
        searchFormItems = [
          {
            label: '专家姓名',
            name: 'name',
            render: () => {
              return <Input placeholder="请输入" maxLength={35} />
            }
          },
          {
            label: '手机号',
            name: 'phone',
            render: () => {
              return <Input placeholder="请输入" maxLength={35} />
            }
          },
        ];
        break;
      case 'NEWS':
        columns = [
          {
            title: '新闻标题',
            dataIndex: 'name',
          },
          {
            title: '发布时间',
            dataIndex: 'publishTime',
          },
        ];
        searchFormItems = [
          {
            label: '新闻标题',
            name: 'name',
            render: () => {
              return <Input placeholder="请输入" maxLength={35} />
            }
          },
          {
            label: '时间区间',
            name: 'time',
            render: () => {
              return <DatePicker.RangePicker allowClear showTime />
            }
          },
        ];
        break;
    }

    return [columns, searchFormItems];
  }

  const onEdit = (editing = false) => {
    for (const key in rootRef.current) {
      if (Object.prototype.hasOwnProperty.call(rootRef.current, key)) {
        const element = rootRef.current[key];
        editing ? element.onEdit() : element.cancelEdit()
      }
    }
    setEditing(editing)
  }

  return (
    <>
      <div className={sc('container-table-header')}>
        <div className="title">
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              editing ? addOrUpdate() : onEdit(true)
            }}
          >
            {editing ? '保存并发布' : '编辑'}
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        {dataSource.map((p, index) => {
          return <>
            <div style={{ margin: '20px 0' }}>{enumObj[p.dataType]}</div>
            <IndustryTable ref={ref => rootRef.current[p.dataType] = ref}
              handleSameData={(list) => handleSameData(p.dataType, list)}
              autoColumns={getAutoContent(p.dataType)[0]} data={p.dataList}></IndustryTable>
            {editing && <div
              style={
                { cursor: 'pointer' }
              }
              onClick={() => {
                const detailIdList = p?.dataList?.map(d => d.detailId)
                setModalInfo({
                  type: p.dataType,
                  visible: true,
                  typeName: enumObj[p.dataType],
                  detailIdList
                })
                setSearchContent({})
                getOptions({ detailIdList, dataType: p.dataType, ...pagination, pageIndex: 1 })
              }}
              className={sc('add-button')}
            >
              + 添加数据
            </div>}
          </>
        })}
      </div>
      {useModal()}
      <Prompt
        when={editing}
        message={'离开此页面，将不会保存当前编辑的内容，确认离开吗？'}
      />
    </>
  );
};
