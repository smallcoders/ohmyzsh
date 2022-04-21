/* eslint-disable */
import { Button, Input, Table, Form, InputNumber, Typography, message } from 'antd';
import '../service-config-data-column.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { getDataColumnIntroduce, updateDataColumnIntroduce } from '@/services/data-column';
import DataColumn from '@/types/data-column';
import IntroduceModal from './introduce-modal';

const sc = scopedClasses('service-config-data-column');

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
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (item: any, _: any, index: number) => index + 1,
    },
    {
      title: '数据标题',
      dataIndex: 'title',
      editable: true,
      width: 150,
    },
    {
      title: '平台实际数量',
      dataIndex: 'actualNumber',
      editable: true,
      width: 150,
    },
    {
      title: '是否由运营平台控制',
      dataIndex: 'manage',
      editable: true,
      width: 150,
      render: (flag: boolean) => (flag ? '是' : '否'),
    },
    {
      title: '运营控制数量',
      dataIndex: 'mockNumber',
      editable: true,
      width: 150,
    },
    {
      title: '数据构成',
      dataIndex: 'construction',
      editable: true,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 100,
      render: (_: any, record: DataColumn.IntroduceContent) => {
        return (
          <a
            href="#"
            onClick={() => {
              setVisible(true);
              setEditingItem(record);
            }}
          >
            编辑
          </a>
        );
      },
    },
  ];

  const submit = async (body: DataColumn.IntroduceContent) => {
    const tooltipMessage = '修改';
    setPublishLoading(true);
    const addorUpdateRes = await updateDataColumnIntroduce(body);
    if (addorUpdateRes.code === 0) {
      message.success(`${tooltipMessage}成功`);
      getDataColumns();
      setVisible(false);
    } else {
      message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
    }
    setPublishLoading(false);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <Table pagination={false} columns={columns} bordered dataSource={data} />
      {visible && (
        <IntroduceModal
          visible={visible}
          setVisible={setVisible}
          submit={submit}
          detail={editingItem}
        />
      )}
    </div>
  );
};

export default Introduce;
