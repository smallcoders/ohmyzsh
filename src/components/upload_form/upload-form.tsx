import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import type { ReactNode, RefAttributes } from 'react';
import { useState } from 'react';
import './upload-form.less';

const UploadForm = (
  props: JSX.IntrinsicAttributes &
    UploadProps<any> & { children?: ReactNode } & RefAttributes<any> & { tooltip?: ReactNode } & {
      value?: any;
      needName?: boolean;
      maxSize?: number;
      changeLoading?: (loaidng: boolean) => void;
      maxSizeKb?: number;
      isMore?: boolean;
      setValue?: (value: any) => void;
      setValueId?: (value: any) => void;
    },
) => {
  const [fileId, setFileId] = useState<string | undefined | any>();
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  console.log(props?.value);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  const imgSrc = fileId?.path
    ? fileId?.path
    : fileId
    ? `/antelope-common/common/file/download/${fileId}`
    : `${props?.value || ''}`?.indexOf('http') !== -1
    ? props.value
    : `/antelope-common/common/file/download/${props.value}`;

  const reUpload = (
    <>
      <div className={'reupload'}>
        <img src={imgSrc} alt="图片损坏" />
        <div>重新上传</div>
      </div>
    </>
  );

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const setLoading = (loading: boolean) => {
      if (props.changeLoading) {
        props.changeLoading(loading);
      }
      setUploadLoading(loading);
    };
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'error') {
      if (props.changeLoading) {
        props.changeLoading(false);
      }
      setLoading(false);
      return;
    }

    if (info.file.status === 'done') {
      const uploadResponse = info?.file?.response;
      if (uploadResponse?.code === 0 && uploadResponse.result) {
        setFileId(uploadResponse.result);
        const value: any = props.needName
          ? uploadResponse.result + '_+*%' + info?.file?.name
          : uploadResponse.result;
        props.onChange?.(
          props.isMore ? (info.fileList as any)?.map((item: any) => item.response?.result) : value,
        );
        setLoading(false);
        message.success('上传成功');
        console.log('uploadResponse.result', uploadResponse.result)
        props.setValue && props.setValue(`/antelope-common/common/file/download/${uploadResponse.result}`)
        props.setValueId && props.setValueId(uploadResponse.result)
      } else {
        setLoading(false);
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
  const p = { ...props };
  delete p.value;
  return (
    <>
      {props.tooltip}
      <Upload
        {...p}
        name="file"
        action={props.action || '/antelope-common/common/file/upload'}
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
