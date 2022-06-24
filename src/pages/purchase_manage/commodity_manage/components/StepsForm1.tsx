import { ProFormText } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Modal } from 'antd';
import { useCallback, useState } from 'react';
import type { StepFormProps } from '../create';

export interface SpecData {
  id: number;
  name: string;
  value: string[];
}

interface Props {
  onConfirm: (data: SpecData[]) => void;
}
export default (props: Props & StepFormProps) => {
  const [data, setData] = useState<SpecData[]>([
    { id: 1, value: ['8G', '16G'], name: '内存' },
    { id: 2, value: ['128G', '256G'], name: '硬盘' },
  ]);
  const [editId, setEditId] = useState<number>();
  const [addModalShow, setAddModalShow] = useState(false);

  const [form] = Form.useForm<{ name: string; value: string }>();

  const addHandle = useCallback(() => {
    setAddModalShow(true);
  }, []);

  const editHandle = useCallback(
    (record: SpecData) => {
      form.setFieldsValue({ name: record.name, value: record.value.join(',') });
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
                value: val.value
                  .split(',')
                  .map((v) => v.trim())
                  .filter((v) => v),
              }
            : item,
        );
      }
      return [
        ..._data,
        {
          id: _data.length + 1,
          name: val.name,
          value: val.value
            .split(',')
            .map((v) => v.trim())
            .filter((v) => v),
        },
      ];
    });
    modalCandel();
  }, [form, editId, modalCandel]);

  const columns: ProColumns<SpecData>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'text',
    },

    {
      title: '规格名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '规格值',
      dataIndex: 'value',
      valueType: 'text',
      renderText: (_, record) => record.value.join(', '),
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
    props.onConfirm(data);
    props.currentChange(1);
  }, [props, data]);
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
          <Button type="primary" key="primary" onClick={addHandle}>
            新增规格
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
        title="新增规格"
        onOk={() => form.submit()}
        onCancel={modalCandel}
      >
        <Form form={form} labelCol={{ span: 4 }} onFinish={modalConfirm}>
          <ProFormText
            name="name"
            label="规格名称"
            placeholder="请输入"
            rules={[{ required: true }]}
          />
          <ProFormText
            name="value"
            label="规格值"
            placeholder='使用", "隔开多个规格值'
            rules={[
              { required: true },
              {
                validator: (_, value: string) =>
                  value?.split(',').length <= 20
                    ? Promise.resolve()
                    : Promise.reject(new Error('规格值不能超过20个')),
              },
              {
                validator: (_, value: string) =>
                  value.trim() === '' && value !== ''
                    ? Promise.reject(new Error('请输入规格值'))
                    : Promise.resolve(),
              },
            ]}
          />
        </Form>
      </Modal>
    </div>
  );
};
