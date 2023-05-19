import { useState, useImperativeHandle, forwardRef } from 'react';
import { message as antdMessage, Modal, Tooltip, Upload, UploadProps } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { CloudUploadOutlined } from '@ant-design/icons';
import SelfTable from '@/components/self_table';


const UploadModal = forwardRef((props: any, ref: any) => {
  // 上传导入逻辑
  const [uploadNum, setUploadNum] = useState<any>(0);
  const [loading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [errorDataSource, setErrorDataSource] = useState<any>([]);
  const accept = '.xlsx';
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
  useImperativeHandle(ref, () => ({
    openModal: () => {
      setModalVisible(true)
    }
  }))
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
          antdMessage.success(`导入成功`);
        } else {
          setErrorDataSource(info.file.response?.result);
        }
        setUploadNum(code);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleBeforeUpload = (file: RcFile) => {
    const isLimit = file.size / 1024 / 1024 < 50;
    if (!isLimit) {
      antdMessage.error('上传的文件大小不得超过50M');
      return Upload.LIST_IGNORE;
    }
    try {
      const lastName = file.name.split('.');
      if (!accept.includes('.' + lastName[lastName.length - 1])) {
        antdMessage.error(`请上传以${accept}后缀名开头的文件`);
        return Upload.LIST_IGNORE;
      }
    } catch (error) {
      antdMessage.error('配置错误: ' + error);
      return Upload.LIST_IGNORE;
    }

    return true;
  };
  const { Dragger } = Upload;
  const uploadProps: UploadProps = {
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
  return (
    <Modal
      title="导入商机"
      visible={modalVisible}
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
            <Dragger {...uploadProps} className={uploadNum.progress === 'true' ? 'supplierStaus' : ''}>
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
  )
})

export default UploadModal
