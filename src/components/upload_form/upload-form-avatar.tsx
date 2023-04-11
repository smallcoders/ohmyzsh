import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Modal } from 'antd';
import type { RcFile, UploadProps } from 'antd/lib/upload/interface';
import type { ReactNode, RefAttributes } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import ImgCrop from 'antd-img-crop';

import './upload-form.less';

const UploadForm = (
  props: JSX.IntrinsicAttributes &
    UploadProps<any> & { children?: ReactNode } & RefAttributes<any> & { tooltip?: ReactNode } & {
      value?: any;
      shape?: any;
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
  const [fileList, setFileList] = useState<any>([]);
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  const reUpload = (
    <>
      <div className={'reupload'}>
        <img src={props.value} alt="图片损坏" />
        <div>重新上传</div>
      </div>
    </>
  );
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      if (props.value) {
        isFirstRender.current = false;
        setFileList([
          {
            id: props.value,
            name: 'image.jpg',
            status: 'done',
            url: props.value,
          },
        ]);
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

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(newFileList);
    if (
      newFileList.filter((item: any) => item.status !== 'done' || item.status === null).length === 0
    ) {
      const arr = newFileList.map((item: any) => {
        return item?.id ? item?.id : item?.response?.result.path;
      });
      props?.onChange?.(arr.length === 1 ? arr[0] : arr);
      if (newFileList.length > 0) message.success('上传成功');
      return;
    }
  };
  const handleRemove = (file: any) => {
    console.log(file);
  };
  return (
    <>
      <ImgCrop shape={props?.shape} width={300} height={300}>
        <Upload
          action={props.action || '/antelope-common/common/file/upload'}
          listType="picture-card"
          maxCount={1}
          fileList={fileList}
          name="file"
          accept=".png,.jpeg,.jpg"
          onChange={handleChange}
          onPreview={handlePreview}
          beforeUpload={beforeUpload}
          onRemove={handleRemove}
        >
          {fileList.length >= 1 ? reUpload : uploadButton}
        </Upload>
      </ImgCrop>
      <Modal
        visible={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};
export default UploadForm;
