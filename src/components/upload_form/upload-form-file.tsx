import { message, Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { ReactNode, RefAttributes, useEffect } from 'react';
import './upload-form.less';

const UploadForm = (
  props: JSX.IntrinsicAttributes &
    UploadProps<any> & { children?: ReactNode } & RefAttributes<any> & { tooltip?: ReactNode } & {
      value?: any;
      needName?: boolean;
      maxSize?: number;
      isSkip?: boolean;
    },
) => {
  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    let newFileList = [...info.fileList] as any;

    // 2. Read from response and show file link
    newFileList = newFileList?.map((file: any) => {
      if (file.response) {
        if (props.isSkip) {
          file.url = `/antelope-manage/common/download/${file?.response?.result}`;
        }
        file.uid = file?.response?.result;
      }
      return file;
    });
    props.onChange?.([...newFileList] as any);
  };

  useEffect(() => {
    console.log(props.value);
  }, [props.value]);

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
    const list = props?.value?.filter((p: any) => p.uid !== file.uid);

    props.onChange?.(list as any);
  };

  return (
    <>
      {props.tooltip}
      <Upload
        {...props}
        fileList={props?.value || []}
        name="file"
        action="/antelope-manage/common/upload"
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
