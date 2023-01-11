import { Button, Input, Form, Modal, message, Radio } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import SelfTable from '@/components/self_table';
import type AppFinancialMng from '@/types/app-financial-service-manage';
import { getAuditInfoMngList, addOrUpdateAudit } from '@/services/app-financial-service-manage';
const sc = scopedClasses('app-financial-service-manage');
const channels = [
  {
    name: '小米应用市场',
    value: 1,
  },
  {
    name: '华为应用市场',
    value: 2,
  },
  {
    name: 'oppo应用市场',
    value: 3,
  },
  {
    name: 'vivo应用市场',
    value: 4,
  },
];
export default () => {
  const [dataSource, setDataSource] = useState<AppFinancialMng.Content[]>([]);
  const [form] = Form.useForm();
  const [auditItem, setAuditItem] = useState<AppFinancialMng.Content>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);

  const getPage = async () => {
    try {
      const { result, code } = await getAuditInfoMngList();
      if (code === 0) {
        setDataSource(result);
      } else {
        message.error(`请求数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPage();
  }, []);

  const clearForm = () => {
    form.resetFields();
    setAuditItem({});
    setModalVisible(false);
  };
  // 弹窗确定
  const onFinsh = async () => {
    const values = await form.validateFields();
    try {
      setAddOrUpdateLoading(true);
      const { code, message: resultMsg } = await addOrUpdateAudit({
        ...values,
        version: values.version.slice(1),
        id: auditItem.id,
        channel: auditItem.channel,
      });
      if (code === 0) {
        message.success(`修改成功！`);
        getPage();
        clearForm();
      } else {
        message.error(`备注失败，原因:{${resultMsg}}`);
      }
      setAddOrUpdateLoading(false);
    } catch (error) {
      message.error(`备注失败，原因:{${error}}`);
    }
    setAddOrUpdateLoading(false);
  };
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title="修改"
        width="800px"
        visible={modalVisible}
        maskClosable={false}
        className={sc('container-modal')}
        okButtonProps={{ loading: addOrUpdateLoading }}
        okText="确定"
        onOk={() => {
          onFinsh();
        }}
        onCancel={() => {
          clearForm();
        }}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          className={sc('modal-form')}
          validateTrigger="onBlur"
        >
          <Form.Item
            name="version"
            label="App版本号"
            rules={[{ required: true, message: '请填写App版本号' }]}
          >
            <Input maxLength={20} />
          </Form.Item>
          <Form.Item
            label="华为应用市场"
            name="audit"
            initialValue={true}
            extra="仅当APP在此应用市场上架成功后，才可开启金融服务入口"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Radio.Group style={{ marginTop: 5 }}>
              <Radio value={true}>关闭入口</Radio>
              <Radio value={false}>开启入口</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 60,
      render: (_: any, _record: any, index: number) => index + 1,
    },
    {
      title: 'App版本号',
      dataIndex: 'version',
      render: (version: string) => {
        return `V${version}`;
      },
      width: 100,
    },
    {
      title: '渠道名称',
      dataIndex: 'channel',
      isEllipsis: true,
      render: (channel: number) => {
        const channelName = channels.find((item) => item.value === channel);
        return channelName?.name;
      },
      width: 140,
    },
    {
      title: '入口状态',
      dataIndex: 'audit',
      render: (audit: boolean) => {
        return audit ? '关闭' : '开启';
      },
      width: 80,
    },
    {
      title: '操作人',
      dataIndex: 'userName',
      width: 100,
    },
    {
      title: '数据更新时间',
      dataIndex: 'updateTime',
      width: 120,
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'option',
      width: 80,
      render: (_: any, record: AppFinancialMng.Content) => {
        return (
          <Button
            size="small"
            type="link"
            onClick={() => {
              setAuditItem(record);
              form.setFieldsValue({
                ...record,
                version: `V${record.version}`,
              });
              setModalVisible(true);
            }}
          >
            修改
          </Button>
        );
      },
    },
  ];
  return (
    <PageContainer
      className={sc('container')}
      ghost
      header={{
        title: 'App金融服务管理',
        breadcrumb: {},
      }}
    >
      <div className={sc('container-table')}>
        <div className={sc('container-table-body')}>
          <SelfTable
            bordered
            scroll={{ x: 1200 }}
            columns={columns}
            dataSource={dataSource}
            rowKey={'id'}
            pagination={false}
          />
        </div>
      </div>
      {useModal()}
    </PageContainer>
  );
};
