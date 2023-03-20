import {  PlusOutlined } from '@ant-design/icons';
import { message, Upload, Modal } from 'antd';
import type { RcFile,  UploadProps } from 'antd/lib/upload/interface';
import type { ReactNode, RefAttributes } from 'react';
import { useState, useEffect, useRef } from 'react';

import './upload-form.less';


const UploadForm = (
  props: JSX.IntrinsicAttributes &
    UploadProps<any> & { children?: ReactNode } & RefAttributes<any> & { tooltip?: ReactNode } & {
      value?: any;
      needName?: boolean;
      maxSize?: number;
      changeLoading?: (loading: boolean) => void;
      maxSizeKb?: number;
      limit?: number;
    },
) => {

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<any>([])

  const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });


  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );


  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (Array.isArray(props.value)) {
        setFileList(props.value.map(item => ({
          id: item,
          name: 'image.jpg',
          status: 'done',
          url: `/antelope-common/common/file/download/${item}`
        })))
      }
      return;
    }
  }, [props.value]);

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleCancel = () => setPreviewOpen(false);

  const beforeUpload = (file: RcFile, files: RcFile[]) => {
    if (props.beforeUpload) {
      props.beforeUpload(file, files);
      return;
    }
    if (props.maxSize) {
      const isLtLimit = file.size / 1024 / 1024 < props.maxSize;
      if (!isLtLimit) {
        message.error(`上传的文件大小不得超过${props.maxSize}M`);
        return Upload.LIST_IGNORE;
      }
    }
    if (props.maxSizeKb) {
      const isLtLimit = file.size / 1024 < props.maxSizeKb;
      if (!isLtLimit) {
        message.error(`上传的文件大小不得超过${props.maxSizeKb}KB`);
        return Upload.LIST_IGNORE;
      }
    }
    if (props.accept) {
      try {
        const lastName = file.name.split('.');
        const accepts = props.accept.split(',');
        if (!accepts.includes('.' + lastName[lastName.length - 1])) {
          message.error(`请上传以${props.accept}后缀名开头的文件`);
          return Upload.LIST_IGNORE;
        }
      } catch (error) {
        message.error('配置错误：' + error);
        return Upload.LIST_IGNORE;
      }
    }
    return true;
  };

  const handleChange = ({ fileList: newFileList}) => {
    setFileList(newFileList)
    if (newFileList.filter((item: any) => item.status !== 'done' || item.status === null).length === 0) {
      const arr = newFileList.map((item: any) => {
        return item?.id ? item?.id : item?.response?.result
      })
      props?.onChange?.(arr)
      return
    }
  }


  return (
    <>
      {props.tooltip}
      <Upload
        {...props}
        fileList={fileList}
        name="file"
        action={props.action || '/antelope-common/common/file/upload'}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={handlePreview}
        >
          {fileList.length >= props.limit ? null : uploadButton}
        </Upload>
        <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};
export default UploadForm;
