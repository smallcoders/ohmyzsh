import { addParam, deleteParam, queryParam } from '@/services/commodity';
import type DataCommodity from '@/types/data-commodity';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Modal, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import type { StepFormProps } from '../create';

type ParameterData = Omit<
  DataCommodity.ParamInfo,
  'productId' | 'state' | 'createTime' | 'updateTime'
>;
export default (props: StepFormProps) => {
  const { id, currentChange } = props;
  const [params, setParams] = useState<ParameterData[]>([]);
  const [editRecord, setEditRecord] = useState<ParameterData>();
  const [addModalShow, setAddModalShow] = useState(false);

  const [form] = Form.useForm<{ name: string; content: string }>();

  const addHandle = useCallback(() => {
    setAddModalShow(true);
  }, []);

  const editHandle = useCallback(
    (record: ParameterData) => {
      form.setFieldsValue({ name: record.name, content: record.content });
      setEditRecord(record);
      setAddModalShow(true);
    },
    [form],
  );

  const delHandle = useCallback(
    async (record: ParameterData) => {
      const res = await deleteParam({ productId: id, ids: JSON.stringify([record.id]) });
      if (!res.code) {
        setParams((oldVal) => oldVal.filter((item) => item.id !== record.id));
      }
    },
    [id],
  );

  const modalCandel = useCallback(() => {
    form.resetFields();
    setAddModalShow(false);
    setEditRecord(undefined);
  }, [form]);

  const modalConfirm = useCallback(async () => {
    const val = form.getFieldsValue();
    let data: { productId?: number | string; id?: number; name: string; content: string };
    if (editRecord) {
      data = { productId: id, id: editRecord.id, ...val };
    } else {
      data = { productId: id, ...val };
    }
    const res = await addParam(data);

    if (editRecord) {
      setParams((oldVal) =>
        oldVal.map((item) => {
          return item.id === editRecord.id ? { ...data, id: res.result } : item;
        }),
      );
    } else {
      setParams((oldVal) => [...oldVal, { ...data, id: res.result }]);
    }
    modalCandel();
  }, [form, id, editRecord, modalCandel]);

  const columns: ProColumns<ParameterData>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (_, __, i) => i + 1,
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
    currentChange(1);
  }, [currentChange]);

  useEffect(() => {
    if (id) {
      queryParam(id).then((res) => {
        setParams(res.result);
      });
    }
  }, [id]);
  return (
    <div>
      <ProTable
        style={{ marginBottom: 20 }}
        rowKey="id"
        options={false}
        search={false}
        pagination={false}
        dataSource={params}
        columns={columns}
        toolBarRender={() => [
          <Button disabled={params.length >= 20} type="primary" key="primary" onClick={addHandle}>
            新增参数
          </Button>,
        ]}
      />
      <div className="form-footer">
        <Space>
          <Button onClick={() => props.currentChange(-1)}>上一步</Button>
          <Button type="primary" onClick={onFinish}>
            下一步
          </Button>
        </Space>
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
