import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Modal } from 'antd';
import { useCallback, useState } from 'react';
import type { StepFormProps } from '../create';

export interface ParameterData {
  id: number;
  name: string;
  content: string;
}

export default (props: StepFormProps) => {
  const [data, setData] = useState<ParameterData[]>([{ id: 1, name: '内存', content: 'asdasda' }]);
  const [editId, setEditId] = useState<number>();
  const [addModalShow, setAddModalShow] = useState(false);

  const [form] = Form.useForm<{ name: string; content: string }>();

  const addHandle = useCallback(() => {
    setAddModalShow(true);
  }, []);

  const editHandle = useCallback(
    (record: ParameterData) => {
      form.setFieldsValue({ name: record.name, content: record.content });
      setEditId(record.id);
      setAddModalShow(true);
    },
    [form],
  );

  const delHandle = useCallback((record: { id: number }) => {
    setData((_data) => _data.filter((v) => v.id !== record.id));
  }, []);

  const modalCandel = useCallback(() => {
    form.resetFields();
    setAddModalShow(false);
    setEditId(undefined);
  }, [form]);

  const modalConfirm = useCallback(() => {
    const val = form.getFieldsValue();
    setData((_data) => {
      if (editId) {
        return _data.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: val.name,
                content: val.content,
              }
            : item,
        );
      }
      return [
        ..._data,
        {
          id: _data.length + 1,
          name: val.name,
          content: val.content,
        },
      ];
    });
    modalCandel();
  }, [form, editId, modalCandel]);

  const columns: ProColumns<ParameterData>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'text',
    },

    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'textarea',
    },

    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Button size="small" type="link" onClick={() => editHandle(record)}>
            编辑
          </Button>
          <Button size="small" type="link" onClick={() => delHandle(record)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  const onFinish = useCallback(async () => {
    props.currentChange(1);
  }, [props]);
  return (
    <div>
      <ProTable
        style={{ marginBottom: 20 }}
        rowKey="name"
        options={false}
        search={false}
        pagination={false}
        dataSource={data}
        columns={columns}
        toolBarRender={() => [
          <Button disabled={data.length >= 20} type="primary" key="primary" onClick={addHandle}>
            新增参数
          </Button>,
        ]}
      />
      <div className="form-footer">
        <Button onClick={() => props.currentChange(-1)}>上一步</Button>
        <Button type="primary" onClick={onFinish}>
          下一步
        </Button>
      </div>
      <Modal
        visible={addModalShow}
        maskClosable={false}
        title="新增参数"
        onOk={() => form.submit()}
        onCancel={modalCandel}
      >
        <Form form={form} labelCol={{ span: 4 }} onFinish={modalConfirm}>
          <ProFormText name="name" label="名称" placeholder="请输入" rules={[{ required: true }]} />
          <ProFormTextArea
            name="content"
            label="内容"
            placeholder="请输入"
            rules={[{ required: true }]}
          />
        </Form>
      </Modal>
    </div>
  );
};
