import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { ReactNode, RefAttributes, useState } from 'react';
import './upload-form.less';

const UploadForm = (
  props: JSX.IntrinsicAttributes &
    UploadProps<any> & { children?: ReactNode } & RefAttributes<any> & { tooltip?: ReactNode } & {
      value?: string;
      needName?: boolean;
      maxSize?: number;
    },
) => {
  const [fileId, setFileId] = useState<string | undefined>();
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  const reUpload = (
    <div className={'reupload'}>
      <img src={`/iiep-manage/common/download/${fileId || props.value}`} alt="图片损坏" />
      <div>重新上传</div>
    </div>
  );
  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'error') {
      setUploadLoading(false);
      return;
    }

    if (info.file.status === 'done') {
      const uploadResponse = info?.file?.response;
      if (uploadResponse?.code === 0 && uploadResponse.result) {
        setFileId(uploadResponse.result);
        const value: any = props.needName
          ? uploadResponse.result + '_+*%' + info?.file?.name
          : uploadResponse.result;
        props.onChange?.(value);
        setUploadLoading(false);
      } else {
        setUploadLoading(false);
        message.error(`上传失败，原因:{${uploadResponse.message}}`);
      }
    }
  };

  const beforeUpload = (file: RcFile, files: RcFile[]) => {
    if (props.beforeUpload) {
      props.beforeUpload(file, files);
      return;
    }
    if (props.maxSize) {
      const isLtLimit = file.size / 1024 / 1024 < props.maxSize;
      if (!isLtLimit) {
        message.error(`上传的图片大小不得超过${props.maxSize}M`);
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

  return (
    <>
      {props.tooltip}
      <Upload
        {...props}
        name="file"
        action="/iiep-manage/common/upload"
        onChange={handleChange}
        beforeUpload={beforeUpload}
      >
        {props.children ? (
          props.children
        ) : uploadLoading ? (
          <LoadingOutlined />
        ) : fileId || props.value ? (
          reUpload
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  );
};
export default UploadForm;
