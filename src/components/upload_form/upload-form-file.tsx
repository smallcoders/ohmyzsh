import Common from '@/types/common';
import { message, Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { ReactNode, RefAttributes, useState } from 'react';
import './upload-form.less';

const UploadForm = (
  props: JSX.IntrinsicAttributes &
    UploadProps<any> & { children?: ReactNode } & RefAttributes<any> & { tooltip?: ReactNode } & {
      value?: any;
      needName?: boolean;
      maxSize?: number;
    },
) => {
  const [fileList, setFileList] = useState<Common.CommonFile[]>([]);

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'error') {
      return;
    }

    if (info.file.status === 'done') {
      const uploadResponse = info?.file?.response;
      if (uploadResponse?.code === 0 && uploadResponse.result) {
        let files = [...fileList, { id: uploadResponse.result, fileName: info.file.fileName }];
        if (props.maxCount === 1) {
          files = [files[files.length - 1]];
        }
        setFileList(files);
        props.onChange?.(files as any);
        message.success('上传成功');
      } else {
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
  const onRemove = (file: UploadFile) => {
    const list = fileList.filter((p) => p.id !== file.uid);
    setFileList(list);
    props.onChange?.(list as any);
  };

  return (
    <>
      {props.tooltip}
      <Upload
        {...props}
        defaultFileList={props?.value?.map((p: any) => {
          return {
            uid: p.id,
            name: p.fileName + '.' + p.fileFormat,
            status: 'done',
          } as any;
        })}
        name="file"
        action="/iiep-manage/common/upload"
        onChange={handleChange}
        beforeUpload={beforeUpload}
        onRemove={onRemove}
      >
        {props.children}
      </Upload>
    </>
  );
};
export default UploadForm;
