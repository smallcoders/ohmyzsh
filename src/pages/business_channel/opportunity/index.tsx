import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import type { UploadProps } from 'antd';
import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Tooltip,
  Upload,
  Radio, DatePicker,
} from 'antd';
import SelfTable from '@/components/self_table';
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from '@@/core/history';
import { useAccess, Access } from '@@/plugin-access/access';
import type { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import moment from 'moment';
const sc = scopedClasses('baseline-association');

const tableOptions = [
  {
    label: '商机录入',
    value: 0,
  },
  {
    label: '商机审核',
    value: 1,
  },
  {
    label: '商机分发',
    value: 2,
  },
]

export default () => {
  // // 拿到当前角色的access权限兑现
  const access = useAccess();
  const [loading, setLoading] = useState<boolean>(false);
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0)
  const [searchForm] = Form.useForm()

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    if (search.updateTime) {
      search.updateTimeStart = moment(search.updateTime[0]).startOf('days').format('YYYY-MM-DD HH:mm:ss');
      search.updateTimeEnd = moment(search.updateTime[1]).endOf('days').format('YYYY-MM-DD HH:mm:ss');
    }
    if (search.state){
      search.state = search.state * 1
    }
    delete search.updateTime;
    return search;
  };

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item labelCol={{span: 8}} name="advertiseName" label="商机编号">
                <Input placeholder="请输入" maxLength={35} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item labelCol={{span: 8}} name="advertiseName" label="企业名称">
                <Input placeholder="请输入" maxLength={35} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item labelCol={{span: 8}} name="updateTime" label="发布时间">
                <DatePicker.RangePicker
                  allowClear
                  disabledDate={(current) => {
                    return current > moment().endOf('day');
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={5} offset={1}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = getSearchQuery();
                  console.log(search)
                }}
              >
                查询
              </Button>
              <Button
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  const errorColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: {
        showTitle: true,
      },
      width: 120,
      render: (name: any) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: ' 错误原因',
      dataIndex: 'message',
      ellipsis: {
        showTitle: true,
      },
      width: 300,
      render: (message: any) => (
        <Tooltip placement="topLeft" title={message}>
          {message}
        </Tooltip>
      ),
    },
  ];
  // 上传导入逻辑
  const [uploadNum, setUploadNum] = useState<any>(0);
  const [errorDataSource, setErrorDataSource] = useState<any>([]);
  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'error') return;
    if (info.file.status === 'done') {
      try {
        const { code } = info.file.response;
        if (code === 0) {
          setModalVisible(false);
          message.success(`导入成功`);
        } else {
          setErrorDataSource(info.file.response?.result);
        }
        setUploadNum(code);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const accept = '.xlsx';
  const handleBeforeUpload = (file: RcFile) => {
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error('上传的文件大小不得超过20M');
      return Upload.LIST_IGNORE;
    }
    try {
      const lastName = file.name.split('.');
      if (!accept.includes('.' + lastName[lastName.length - 1])) {
        message.error(`请上传以${accept}后缀名开头的文件`);
        return Upload.LIST_IGNORE;
      }
    } catch (error) {
      message.error('配置错误: ' + error);
      return Upload.LIST_IGNORE;
    }

    return true;
  };
  const { Dragger } = Upload;
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    accept: '.xlsx',
    action: '/antelope-channel/mng/importAndExport/importBusiness',
    maxCount: 1,
    onRemove: () => false,
    onChange: handleChange,
    beforeUpload: handleBeforeUpload,
    progress: {
      strokeColor: {
        '0%': 'rgba(26, 102, 255)',
        '100%': 'rgba(26, 102, 255)',
      },
      strokeWidth: 8,
      format: (percent: number | undefined) => percent && `${parseFloat(percent.toFixed(2))}%`,
      showInfo: true,
    },
    showUploadList: {
      showRemoveIcon: false,
    },
  };

  // 上传导入弹框
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title="导入商机"
        visible={createModalVisible}
        width={700}
        style={{ height: '500px' }}
        footer={false}
        maskClosable={false}
        destroyOnClose
        onCancel={() => {
          setModalVisible(false);
          setUploadNum(0);
        }}
      >
        {uploadNum === 0 ? (
          <div style={{ height: '300px' }}>
            <div style={{ height: '180px' }}>
              <Dragger {...props} className={uploadNum.progress === 'true' ? 'supplierStaus' : ''}>
                <p className="ant-upload-text">
                  <CloudUploadOutlined />
                  点击上传xls文件/拖拽到此区域
                </p>
                <p className="ant-upload-hint">请上传xls或xlsx文件，大小50M以内</p>
              </Dragger>
            </div>
          </div>
        ) : (
          <SelfTable
            bordered
            loading={loading}
            scroll={{ y: 480 }}
            columns={errorColumns}
            dataSource={errorDataSource}
            pagination={null}
          />
        )}
      </Modal>
    );
  };
  return (
    <PageContainer className={sc('container')}>
      <div className="table-box">
        <Radio.Group value={activeTab} options={tableOptions} optionType="button" buttonStyle="solid"/>
      </div>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <Access accessible={access['P_BLM_XHXXPZ']}>
          <div>
            <Button
              style={{ marginLeft: '10px' }}
              type="default"
              key="addStyle"
              onClick={() => {
                setModalVisible(true);
              }}
            >
              导入
            </Button>
          </div>
        </Access>
      </div>
      {useModal()}
    </PageContainer>
  );
};
