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
} from 'antd';
import SelfTable from '@/components/self_table';
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from '@@/core/history';
import { useAccess, Access } from '@@/plugin-access/access';
import type { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';

export default () => {
  // // 拿到当前角色的access权限兑现
  const access = useAccess();
  const sc = scopedClasses('baseline-association');
  const [loading, setLoading] = useState<boolean>(false);
  const [createModalVisible, setModalVisible] = useState<boolean>(false);

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
              {/* <div className={uploadNum.progress === 'true' ? 'supplierStaus' : ''}>
                <div style={{ marginBottom: '24px' }}>
                  请先下载
                  <span
                    style={{ color: 'rgba(143, 165, 255)', cursor: 'pointer' }}
                    onClick={async () => {
                      const { code, result } = await getAllianceImportTemplate();
                      if (code === 0) {
                        const res = await getFileInfo(result);
                        debugger;
                        if (res.code === 0) {
                          window.location.href = res?.result[0].path;
                        } else {
                          message.error('下载失败');
                        }
                      } else {
                        message.error('下载失败');
                      }
                    }}
                  >
                    导入模版
                  </span>
                  ，按要求填写后上传
                </div>
              </div> */}
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
