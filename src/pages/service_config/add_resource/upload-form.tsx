import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import { ReactNode, RefAttributes, useState } from 'react';
import './upload-form.less';

const UploadForm = (
  props: JSX.IntrinsicAttributes & UploadProps<any> & { children?: ReactNode } & RefAttributes<any>,
) => {
  const [fileId, setFileId] = useState<string | undefined>();
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   console.log(value);
  //   setFileId(value)
  // }, [value])

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
    if (info.file.status === 'done') {
      const uploadResponse = info?.file?.response;
      if (uploadResponse?.code === 0 && uploadResponse.result) {
        setFileId(uploadResponse.result);
        props.onChange?.(uploadResponse.result);
        setUploadLoading(false);
      } else {
        setUploadLoading(false);
        message.error(`上传失败，原因:{${uploadResponse.message}}`);
      }
    }
  };

  return (
    <>
      {props.tooltip}
      <Upload {...props} name="file" action="/iiep-manage/common/upload" onChange={handleChange}>
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
