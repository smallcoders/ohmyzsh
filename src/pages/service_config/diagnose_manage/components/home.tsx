/* eslint-disable */
import { Button, Input, Table, Form, InputNumber, Typography, message, Space, Modal, Popconfirm, Select } from 'antd';
const { Option } = Select;
import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import '../service-config-diagnose-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { addDataColumn, getDataColumnPage } from '@/services/data-column';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import DataColumn from '@/types/data-column';
import OrgTypeManage from '@/types/org-type-manage';
import { Link, history, Prompt } from 'umi';
import {
  getOrgTypeList,
  sortOrgType,
  removeOrgType
} from '@/services/diagnose-manage';
import { arrayMoveImmutable } from 'array-move';
import moment from 'moment';

const sc = scopedClasses('service-config-diagnose-manage');

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

const TableList: React.FC = () => {
  const [form] = Form.useForm();
  /**
   * table 的源数据
   */
  const [dataSource, setDataSource] = useState<DataColumn.Content[]>([]);

  /**
   * 正在发布中
   */
  const sort = async (list: string[]) => {
    try {
      const tooltipMessage = '排序';
      const updateStateResult = await sortOrgType(list);
      if (updateStateResult.code === 0) {
        message.success(`${tooltipMessage}成功`);
        getPages();
      } else {
        message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el) => !!el,
      );
      sort(newData.map((p:any, index: number) => p.questionnaireNo));
    }
  };
  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    const index = dataSource.findIndex((x) => x.sort === restProps['data-row-key']);
    return <SortableItem className='' index={index} {...restProps} />;
  };

  /**
   * 获取数据栏
   */
  const getPages = async () => {
    try {
      const { result, code } = await getOrgTypeList({state: 1, pageIndex: 1, pageSize: 1000});
      if (code === 0) {
        setDataSource(
          result.map((p, index) => {
            return { sort: index, ...p };
          }),
        );
      } else {
        message.error(`请求列表数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 作为生命周期 开始时获取
  useEffect(() => {
    getPages();
  }, []);

  // const setRowClassName = (record:any) => {
  //   console.log(111, record, record.id == '1626229857397111' ? 'rowBackground' : '')
  //   return record.id == '1626229857397111' ? 'rowBackground' : ''
  // }
  const remove = async (record: any) => {
    let deleteRes = await removeOrgType({firstQuestionnaireNo: record.firstQuestionnaireNo, status: 0})
    if(deleteRes && deleteRes.code == 0) {
      message.success('下架成功！')
      getPages()
    }else {
      message.error(`下架失败，原因:{${deleteRes.message}}`);
    }
  }

  const toVersion = async (value: any, record: any) => {
    console.log(record, 'record');
    console.log(value, 'value');
    history.push((`/service-config/diagnose/history?version=${value}&firstQuestionnaireNo=${record?.firstQuestionnaireNo}`))
  }

  /**
   * column
   */
  const columns = [
    {
      title: '排序',
      dataIndex: 'id',
      width: 80,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: '诊断名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 180,
    },
    {
      title: '专属产业',
      dataIndex: 'industries',
      isEllipsis: true,
      width: 180,
      render: (_: any, record: any) => {
        return (
          <p className='industry-cell' title={_}>{_}</p>
        )
      }
      // render: (_: string) => '111222333gjaowijfjawoirfjawoirfjawifjawoirjgfaeovnaowrgfnaowrjgfnvajrgaworjlfgnajwrignvaowrjgnaowrjgnvaoejrnaejngojfnoawrghnaow',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '是否允许放在首页',
      dataIndex: 'homePage',
      isEllipsis: true,
      width: 300,
      render: (_: string) => _ ? '是' : '否',
    },
    {
      title: '当前版本号',
      dataIndex: 'latestVersion',
      width: 200,
    },
    {
      title: '操作',
      width: 280,
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <a
              href="#"
              onClick={() => {
                history.push(`/service-config/diagnose/add?id=${record?.id}&version=${record?.latestVersion}&firstQuestionnaireNo=${record?.firstQuestionnaireNo}`)
              }}
            >
              迭代{' '}
            </a>
            <Popconfirm
              title={
                <>
                  <h3>确定下架？</h3>
                  <p>诊断下架后将不再发布在羚羊平台，<br></br>只能通过重新创建诊断上架</p>
                </>
              }
              okText="下架"
              cancelText="取消"
              onConfirm={() => remove(record)}
            >
              <a href="#">下架</a>
            </Popconfirm>
            <Select 
              defaultValue="查看历史版本" style={{ width: 120 }} bordered={false} 
              onChange={(e) => toVersion(e, record)}
            >
              {record.allVersion && record.allVersion.map(item => {
                return (
                  <Option value={item}>{item}</Option>
                )
              })}
            </Select>
          </Space>
        );
      },
    },
  ];

  return (
    <div className={sc('container')}>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>企业诊断列表</span>
          <Button
            type="primary"
            key="addStyle"
            onClick={() => {
              history.push('/service-config/diagnose/add')
            }}
          >
            <PlusOutlined /> 新建诊断
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <Table
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          bordered
          // rowClassName={() => 'rowBackground'}
          // rowClassName={styleCross ? ((record, index) => index % 2 === 0 ? 'rowBackground' : '') : undefined}
          // rowClassName={(record: any) => {
          //   let className = 'rowBackground';
          //   return (record.id == '1626229857397111' ? className : '')
          // }}
          // rowClassName={setRowClassName}
          rowKey="sort"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </div>
    </div>
  );
};

export default TableList;
