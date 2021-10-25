import { Button, Input, Table, Form, InputNumber, Popconfirm, Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-data-column.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState } from 'react';

const sc = scopedClasses('service-config-data-column');

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

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
type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  title: string;
  amount: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const TableList: React.FC = () => {
  const [form] = Form.useForm();
  /**
   * 记录下一行是第几行
   *  */
  const [count, setCount] = useState<number>(1);
  /**
   * table 的源数据
   */
  const [data, setData] = useState<any[]>([]);

  /**
   * 正在编辑的key
   */
  const [editingKey, setEditingKey] = useState<string | number>('');

  /**
   * 判断当前行是否正在编辑
   * @param record
   * @returns
   */
  const isEditing = (record: Item) => record.key === editingKey;

  /**
   * 取消保存
   */
  const onCancel = () => {
    setEditingKey('');
  };

  /**
   * 删除某一行
   */
  const onDelete = () => {};
  const onSave = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '数据标题',
      dataIndex: 'title',
      editable: true,
    },
    {
      title: '数据数量',
      dataIndex: 'amount',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a href="javascript:;" onClick={() => onSave(record.key)} style={{ marginRight: 8 }}>
              保存
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={onCancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => onDelete(record)}>
            删除
          </Typography.Link>
        );
      },
    },
  ];

  /**
   * 添加一行新数据
   */
  const onAddRow = () => {
    const newData: DataType = {
      key: count,
      title: '',
      amount: '',
    };
    form.setFieldsValue({ ...newData });
    setEditingKey(count);
    setCount(count + 1);
    setData([...data, newData]);
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
      onCell: (record: Item) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <PageContainer
      className={sc('container')}
      header={{
        extra: (
          <Button type="primary" key="primary" onClick={() => {}}>
            保存并发布
          </Button>
        ),
      }}
    >
      <Form form={form} component={false}>
        <Table
          pagination={false}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowClassName={() => 'editable-row'}
          bordered
          columns={mergedColumns as ColumnTypes}
          dataSource={data}
        />
        <div onClick={onAddRow} className={sc('container-add-button')}>
          + 添加数据
        </div>
      </Form>
    </PageContainer>
  );
};

export default TableList;
