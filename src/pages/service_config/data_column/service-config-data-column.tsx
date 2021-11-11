/* eslint-disable */
import { Button, Input, Table, Form, InputNumber, Typography, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-data-column.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { addDataColumn, getDataColumnPage } from '@/services/data-column';
import DataColumn from '@/types/data-column';

const sc = scopedClasses('service-config-data-column');

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: DataColumn.Content;
  index: number;
  children: React.ReactNode;
}
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === 'number' ? (
      <InputNumber
        style={{ width: '100%' }}
        placeholder="请输入"
        step={1}
        min={1}
        max={99999999}
        precision={0}
      />
    ) : (
      <Input maxLength={8} minLength={1} />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `必填!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
// type EditableTableProps = Parameters<typeof Table>[0];

// type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const TableList: React.FC = () => {
  const [form] = Form.useForm();
  /**
   * 记录下一行是第几行
   *  */
  const [count, setCount] = useState<number>(1);
  /**
   * table 的源数据
   */
  const [data, setData] = useState<DataColumn.Content[]>([]);

  /**
   * 正在编辑的key
   */
  const [editingKey, setEditingKey] = useState<number>(0);

  /**
   * 正在发布中
   */
  const [publishLoading, setPublishLoading] = useState<boolean>(false);
  /**
   * 判断当前行是否正在编辑
   * @param record
   * @returns
   */
  const isEditing = (sort: number) => sort == editingKey;

  /**
   * 获取数据栏
   */
  const getDataColumns = async () => {
    const { result, code } = await getDataColumnPage();
    if (code === 0) {
      setData(result);
      setCount(result.length + 1);
    } else {
      message.error(`请求分页数据失败`);
    }
  };

  /**
   * 删除某一行
   */
  const onDelete = async (sort: number) => {
    const newData = [...data.filter((item) => item.sort !== sort)].map((p, index) => {
      p.sort = index + 1;
      return p;
    });
    if (editingKey) {
      // 由于删除一个 得将editingKey变化
      if (sort === editingKey) setEditingKey(0);
      if (sort < editingKey) setEditingKey(editingKey - 1);
    }
    setData(newData);
    setCount(newData.length + 1);
  };

  // 作为生命周期 开始时获取
  useEffect(() => {
    getDataColumns();
  }, []);

  // 保存到表格数据中
  const onSave = async (sort: number, callback?: (items: DataColumn.Content[]) => void) => {
    const row = await form.validateFields();
    const newData = [...data];
    const index = newData.findIndex((item) => sort === item.sort);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
    } else {
      newData.push(row);
    }
    setEditingKey(0);
    callback && callback(newData);
  };

  /**
   * column
   */
  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: '10%',
    },
    {
      title: '数据标题',
      dataIndex: 'title',
      editable: true,
      width: '40%',
    },
    {
      title: '数据数量',
      dataIndex: 'amount',
      editable: true,
      width: '40%',
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: '10%',
      render: (_: any, record: DataColumn.Content) => {
        return (
          <a href="#" onClick={() => onDelete(record.sort)}>
            删除
          </a>
        );
      },
    },
  ];

  /**
   * 添加一行新数据
   */
  const onAddRow = async () => {
    let datas = [...data];
    try {
      // 保存上一行数据
      if (editingKey && count != 1) {
        await onSave(editingKey, (items: DataColumn.Content[]) => {
          datas = items;
        });
      }
    } catch (error) {
      throw error;
    }
    const newData: DataColumn.Content = {
      title: '',
      amount: 1,
      sort: count,
    };
    form.setFieldsValue({ ...newData });
    // 中间会有上一行保存数据，并且设置当前新建行为编辑状态 需要setEditingKey 两次,在同一个范围内setstate 会合并 感觉这边会有隐患
    setTimeout(() => {
      setEditingKey(count);
    }, 0);

    setCount(count + 1);
    setData([...datas, newData]);
  };

  /**
   * 编辑一行数据
   * @param record
   */
  const onEditRow = async (record: DataColumn.Content) => {
    let datas = [...data];
    try {
      // 保存上一行数据
      if (editingKey && count != 1) {
        await onSave(editingKey, (items: DataColumn.Content[]) => {
          datas = items;
        });
      }
    } catch (error) {
      throw error;
    }
    form.setFieldsValue({ ...record });
    // 中间会有上一行保存数据，并且设置当前新建行为编辑状态 需要setEditingKey 两次,在同一个范围内setstate 会合并 感觉这边会有隐患
    setTimeout(() => {
      setEditingKey(record.sort);
    }, 0);
    setData([...datas]);
  };

  const submit = async (body: DataColumn.Content[] = data) => {
    const tooltipMessage = '发布';
    const hide = message.loading(`正在${tooltipMessage}`);
    setPublishLoading(true);
    const addorUpdateRes = await addDataColumn(body);
    hide();
    if (addorUpdateRes.code === 0) {
      message.success(`${tooltipMessage}成功`);
      getDataColumns();
    } else {
      message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
    }
    setPublishLoading(false);
  };

  // 发布
  const publish = async () => {
    if (editingKey) {
      onSave(editingKey as number, submit);
    } else submit();
  };

  /**
   * antd 编辑行的属性
   */
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataColumn.Content) => ({
        record,
        inputType: col.dataIndex === 'title' ? 'text' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record.sort),
      }),
    };
  });

  return (
    <PageContainer
      className={sc('container')}
      header={{
        extra: (
          <Button type="primary" key="primary" loading={publishLoading} onClick={publish}>
            保存并发布
          </Button>
        ),
      }}
    >
      <Form form={form} component={false}>
        <Table
          pagination={false}
          onRow={(record: DataColumn.Content) => {
            return {
              onDoubleClick: () => {
                onEditRow(record);
              }, // 点击行
            };
          }}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowClassName={() => 'editable-row'}
          bordered
          columns={mergedColumns}
          dataSource={data}
        />
        <div
          style={
            data.length < 8
              ? { cursor: 'pointer' }
              : { cursor: 'no-drop', backgroundColor: 'rgb(214,214,214)' }
          }
          onClick={data.length < 8 ? onAddRow : () => {}}
          className={sc('container-add-button')}
        >
          + 添加数据
        </div>
      </Form>
    </PageContainer>
  );
};

export default TableList;
