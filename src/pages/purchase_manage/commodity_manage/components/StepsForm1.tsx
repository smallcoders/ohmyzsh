import { addSpecs } from '@/services/commodity';
import { ProFormText } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Modal } from 'antd';
import { useCallback, useState } from 'react';
import type { StepFormProps } from '../create';

export interface SpecData {
  id: number;
  specsName: string;
  specsValue: string;
}

export default (props: StepFormProps) => {
  const { id, changeLoading, currentChange } = props;
  const [data, setData] = useState<SpecData[]>([]);
  const [editRecord, setEditRecord] = useState<SpecData>();
  const [addModalShow, setAddModalShow] = useState(false);

  const [form] = Form.useForm<{ specsName: string; specsValue: string }>();

  const showAdd = useCallback(() => {
    setAddModalShow(true);
  }, []);

  const editHandle = useCallback(
    (record: SpecData) => {
      form.setFieldsValue({ specsName: record.specsName, specsValue: record.specsValue });
      setEditRecord(record);
      setAddModalShow(true);
    },
    [form],
  );

  const delHandle = useCallback((index: number) => {
    setData((_data) => _data.filter((_, i) => i !== index));
  }, []);

  const modalCandel = useCallback(() => {
    form.resetFields();
    setAddModalShow(false);
    setEditRecord(undefined);
  }, [form]);

  const modalConfirm = useCallback(async () => {
    const val = form.getFieldsValue();
    const _data = editRecord ? { ...editRecord, ...val } : val;
    const res = await addSpecs({ ..._data, productId: id });
    if (!res.code) return;
    if (!editRecord) {
      setData((oldVal) => [...oldVal, { ...val, id: res.result }]);
    } else {
      setData((oldVal) =>
        oldVal.map((item) => (item.id === editRecord.id ? { ...val, id: res.result } : item)),
      );
    }
    modalCandel();
  }, [form, editRecord, id, modalCandel]);

  const columns: ProColumns<SpecData>[] = [
    {
      title: '序号',
      render: (_, __, index) => index + 1,
    },

    {
      title: '规格名',
      dataIndex: 'specsName',
      valueType: 'text',
    },
    {
      title: '规格值',
      dataIndex: 'specsValue',
      valueType: 'text',
    },

    {
      title: '操作',
      valueType: 'option',
      render: (_, record, index) => (
        <>
          <Button size="small" type="link" onClick={() => editHandle(record, index)}>
            编辑
          </Button>
          <Button size="small" type="link" onClick={() => delHandle(index)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  const onFinish = useCallback(async () => {
    currentChange(2);
  }, [currentChange]);
  return (
    <div>
      <ProTable
        style={{ marginBottom: 20 }}
        rowKey="id"
        options={false}
        search={false}
        pagination={false}
        dataSource={data}
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={showAdd}>
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
            name="specsName"
            label="规格名称"
            placeholder="请输入"
            rules={[{ required: true }]}
          />
          <ProFormText
            name="specsValue"
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
