/* eslint-disable */
import { Button, Input, Table, Form, InputNumber, Typography, message, Select } from 'antd';
const { Option } = Select;
import '../service-config-diagnose-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { getDataColumnIntroduce, updateDataColumnIntroduce } from '@/services/data-column';
import DataColumn from '@/types/data-column';
import IntroduceModal from './introduce-modal';

const sc = scopedClasses('service-config-diagnose-manage');

const Introduce: React.FC = () => {
  /**
   * table 的源数据
   */
  const [data, setData] = useState<DataColumn.IntroduceContent[]>([]);

  /**
   * 正在编辑的key
   */
  const [editingItem, setEditingItem] = useState<any>();

  /**
   * 正在发布中
   */
  const [publishLoading, setPublishLoading] = useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);
  /**
   * 获取数据栏
   */
  const getDataColumns = async () => {
    try {
      const { result, code } = await getDataColumnIntroduce();
      if (code === 0) {
        setData(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 作为生命周期 开始时获取
  useEffect(() => {
    getDataColumns();
  }, []);

  /**
   * column
   */
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (item: any, _: any, index: number) => index + 1,
    },
    {
      title: '诊断名称',
      dataIndex: 'title',
      editable: true,
      width: 150,
    },
    {
      title: '下架时间',
      dataIndex: 'actualNumber',
      editable: true,
      width: 150,
    },
    {
      title: '最新版本号',
      dataIndex: 'manage',
      editable: true,
      width: 150,
      render: (flag: boolean) => (flag ? '是' : '否'),
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 140,
      render: (_: any, record: DataColumn.IntroduceContent) => {
        return (
          <Select defaultValue="查看历史版本" style={{ width: 120 }} bordered={false}>
            <Option value="v1.0">v1.0</Option>
            <Option value="v2.0">v2.0</Option>
            <Option value="v3.0">v3.0</Option>
          </Select>
        );
      },
    },
  ];

  return (
    <div className={sc('container')}>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>企业诊断列表</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <Table scroll={{ x: 1080 }} pagination={false} columns={columns} bordered dataSource={data} />
      </div>
    </div>
    // <div style={{ marginTop: 20, padding: 20, background: '#fff' }}>
    //   <Table scroll={{ x: 1080 }} pagination={false} columns={columns} bordered dataSource={data} />
    //   {visible && (
    //     <IntroduceModal
    //       visible={visible}
    //       setVisible={setVisible}
    //       detail={editingItem}
    //       publishLoading={publishLoading}
    //     />
    //   )}
    // </div>
  );
};

export default Introduce;
