import { useState, useImperativeHandle, forwardRef } from 'react';
import type { UploadProps } from 'antd';
import { message as antdMessage, Modal, Upload } from 'antd';
import type { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { CloudUploadOutlined } from '@ant-design/icons';
import { downloadFile } from '@/services/common';
import { FileExclamationOutlined } from '@ant-design/icons';

const UploadModal = forwardRef((props: any, ref: any) => {
  const [uploadNum, setUploadNum] = useState<any>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [fileId, setFileId] = useState<string>('');
  const [errorbj, setErrorObj] = useState<any>({});
  const accept = '.xlsx';
  
  useImperativeHandle(ref, () => ({
    openModal: () => {
      setModalVisible(true);
    },
  }));

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'error') return;
    if (info.file.status === 'done') {
      try {
        const { code, result } = info.file.response;
        if (code === 0) {
          if (!result?.fileId) {
            setModalVisible(false);
            antdMessage.success(`导入成功`);
            setUploadNum(code);
          } else {
            setUploadNum(1);
            setFileId(result?.fileId);
          setErrorObj(result)
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClick = async () => {
    const res = await downloadFile(fileId);
    const blob = new Blob([res], {
      type: 'application/vnd.ms-excel;charset=utf-8',
    });
    const fileName = `失败数据.xlsx`;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  };

  const handleBeforeUpload = (file: RcFile) => {
    const isLimit = file.size / 1024 / 1024 < 10;
    if (!isLimit) {
      antdMessage.error('上传的文件大小不得超过10M');
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
    action: '/antelope-report/mng/trade/import',
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
      title="导入"
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
          <div style={{ marginBottom: '24px' }}>
            请先下载
            <span style={{ color: 'rgba(143, 165, 255)', cursor: 'pointer' }}>
              <a
                href={
                  'https://oss-hefei-a2a.openstorage.cn/iiep-prod/1dc8ae183a184308ae6df5cd86af5170.xlsx'
                }
                download={'导入模版'}
              >
                导入模版
              </a>
            </span>
            ，按要求填写后上传
          </div>
          <div style={{ height: '180px' }}>
            <Dragger
              {...uploadProps}
              className={uploadNum.progress === 'true' ? 'supplierStaus' : ''}
            >
              <p className="ant-upload-text">
                <CloudUploadOutlined />
                将文件拖拽到此处，或<span style={{ color: 'rgba(143, 165, 255)' }}>点击上传</span>
              </p>
              <p className="ant-upload-hint">支持 xlsx 格式，限10M以内</p>
            </Dragger>
          </div>
        </div>
      ) : (
        <div className="resultFail">
          <div className="icon">
            <FileExclamationOutlined />
          </div>
          <div className="text1">
            共导入
            {errorbj.successNum !== undefined && errorbj.failNum + errorbj.successNum}
            条，成功 {errorbj.successNum}
            条，失败 {errorbj.failNum} 条
          </div>
          <div className="text2">
            <span>您可以下载失败数据，修改后重新导入</span>
            <a onClick={handleClick}>下载失败数据</a>
          </div>
        </div>
      )}
    </Modal>
  );
});

export default UploadModal;
