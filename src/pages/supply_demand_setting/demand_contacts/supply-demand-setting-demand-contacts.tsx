import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Form,
  Modal,
  message,
  Space,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import SelfTable from '@/components/self_table';
import { getDemandContacts, getDemandContactUpdate } from '@/services/demand-contacts';
import scopedClasses from '@/utils/scopedClasses';
import './supply-demand-setting-demand-contacts.less';

const sc = scopedClasses('service-config-demand-contacts');

export default () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [form] = Form.useForm();
  // 编辑的模态框-状态
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // 当前的值
  const [currentData, setCurrentData] = useState<any>({})

  const getDemandContactList = async () => {
    try {
      const res = await getDemandContacts()
      if (res?.code === 0) {
        setDataSource(res?.result || [])
      } else {
        throw new Error("");
      }
    } catch (error) {
      message.error('获取查询列表失败，请重试')
    }
  }

  useEffect(()=>{
    getDemandContactList()
  },[])

  const columns = [
    {
      title: '管辖区域',
      dataIndex: 'cityName',
      width: 300,
      align: 'center'
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      width: 300,
      align: 'center'
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      width: 300,
      align: 'center'
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <a
              href="#"
              onClick={() => {
                setCurrentData(record);
                setEditModalVisible(true);
                form.setFieldsValue({ contactName: record.contactName || '', phone: record.phone || ''  });
              }}
            >
              编辑
            </a>
          </Space>
        );
      },
    },
  ];

  const handleOk = () => {
    form
      .validateFields()
      .then(async (value) => {
        const { contactName, phone } = value || {}
        setLoading(true);
        const tooltipMessage = '编辑';
        const res = await getDemandContactUpdate({
          id: currentData?.id,
          contactName,
          phone,
        })
        if (res?.code === 0) {
          console.log('res',res?.result)
          message.success(`${tooltipMessage}成功`);
          setLoading(false);
          getDemandContactList()
          handleCancel();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${res.message}}`);
          setLoading(false);
        }
      })
      .catch(()=>{setLoading(false);});
  };

  const handleCancel = () => {
    form.resetFields()
    setEditModalVisible(false);
  };
  // 编辑模态框
  const useModal = () => {
    return (
      <Modal
        visible={editModalVisible}
        title={ "编辑联系人•"+ `${currentData?.cityName || '--'}`}
        width="780px"
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            确定
          </Button>,
        ]}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name='contactName'
            label="联系人" 
            required 
            rules={[{ required: true, message: '请输入联系人姓名' }]}
          >
            <Input placeholder='请输入' maxLength={35} />
          </Form.Item>
          <Form.Item 
            name='phone'
            label="联系方式" 
            required 
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error('必填'));
                  }
                  if (
                    !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
                      value,
                    )
                  ) {
                    return Promise.reject(new Error('输入正确的手机号码'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            getValueFromEvent={(event) => event.target.value.replace(/\D/g, '')}  
          >
            <Input placeholder='请输入' size='large' maxLength={16} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('container-table-body')}>
        <SelfTable 
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </div>
      {useModal()}
    </PageContainer>
  )
}
