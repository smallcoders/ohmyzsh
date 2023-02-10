import { message, Upload } from 'antd';
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import type { ReactNode, RefAttributes } from 'react';
import { useEffect } from 'react';
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
          file.url = `/antelope-common/common/file/download/${file?.response?.result}`;
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
      return props.beforeUpload(file, files);
    }
    if (props.maxCount) {
      const index = files?.indexOf(file) + 1;

      if (index + (props?.value?.length || 0) > props.maxCount) {
        message.error(`上传文件数目不得超过${props.maxCount}个`);
        return false;
      }
    }
    if (props.maxSize) {
      const isLtLimit = file.size / 1024 / 1024 < props.maxSize;
      if (!isLtLimit) {
        message.error(`上传的文件大小不得超过${props.maxSize}M`);
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

  const isOpen = props?.maxCount ? (props.value?.length || 0) < props?.maxCount : true;
  return (
    <>
      {props.tooltip}
      <Upload
        {...props}
        fileList={props?.value || []}
        name="file"
        action="/antelope-common/common/file/upload"
        onChange={handleChange}
        beforeUpload={beforeUpload}
        onRemove={onRemove}
        openFileDialogOnClick={isOpen}
      >
        {props.children}
      </Upload>
    </>
  );
};
export default UploadForm;
