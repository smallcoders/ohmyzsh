import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Popover, Modal, Pagination, Checkbox } from 'antd';
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload/interface';
import type { ReactNode, RefAttributes } from 'react';
import { useState } from 'react';
import './upload-form.less';

const UploadForm = (
  props: JSX.IntrinsicAttributes &
    UploadProps<any> & { children?: ReactNode } & RefAttributes<any> & { tooltip?: ReactNode } & {
      value?: string;
      needName?: boolean;
      maxSize?: number;
      changeLoading?: (loaidng: boolean) => void;
      maxSizeKb?: number;
    },
) => {
  const [fileId, setFileId] = useState<string | undefined | any>();
  const [pageInfo, setPageInfo] = useState<any>({pageSize: 10, pageIndex: 1});
  const [selectImage, setSelectImage] = useState<any>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
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
        props.onChange?.(value);
        setLoading(false);
        message.success('上传成功');
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
  const imgSrc = fileId?.path ? fileId?.path :
    fileId ? `/antelope-manage/common/download/${fileId}` : `${props?.value || ''}`?.indexOf('http') !== -1 ?
      props.value : `/antelope-manage/common/download/${props.value}`
  const reUpload = (
    <div className={'reupload'}>
      <img src={imgSrc} alt="图片损坏" />
      <div>重新上传</div>
    </div>
  );
  const p = {...props}
  delete p.value
  return (
    <>
      {props.tooltip}
      <Popover
        placement="bottomLeft"
        overlayClassName="upload-btn-popover"
        content={
          <>
            <div
              className="material-btn"
              onClick={() => {setIsModalOpen(true)}}
            >
              从素材库选择
            </div>
            <Upload
              {...p}
              name="file"
              action={'/antelope-common/common/file/upload/record'}
              onChange={handleChange}
              beforeUpload={beforeUpload}
            >
              从本地上传
            </Upload>
          </>
        }
        trigger="hover"
      >
        <div
          className="upload-area"
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
        </div>
      </Popover>
      <Modal
        width={700}
        title="选择图片"
        visible={isModalOpen}
        onOk={() => {
          if (props.onChange && selectImage){
            props.onChange(selectImage);
          }
          setIsModalOpen(false)
        }}
        onCancel={() => {
          setIsModalOpen(false)
        }} >
        <div className="material-modal">
          <div className="material-group-name">
            {
              [1,2,3,4,4,5,6,6,2,3,4,4,5,6,6,2,3,4,4,5,6,6].map((item, index) => {
                return (
                  <div className="group-name-item" key={index}>
                    素材库分组1(32)
                  </div>
                )
              })
            }
          </div>
          <div className="img-list">
            {
              [1,2,3,4,5,6,67,8,9,10].map((item, index) => {
                return (
                  <div
                    className="img-item"
                    key={index}
                    onClick={() => {
                      setSelectImage(item)
                    }}
                  >
                    <div className="img-box">
                      <img src='https://oss-hefei-a2a.openstorage.cn/iiep-prod/3f4cee6126274db580cb94d9fcea93ae.jpg' alt='' />
                    </div>
                    {
                      selectImage === item && <Checkbox checked />
                    }
                    <div className="img-name">tupianmingcheng</div>
                    <div className="image-size">700 * 360</div>
                  </div>
                )
              })
            }
            <Pagination
              {...{
                pageSize: pageInfo.pageSize,
                showSizeChanger: false,
                hideOnSinglePage: false,
                total: 100,
                simple: false,
                current: pageInfo.pageIndex,
                showTotal(total: number) {
                  const currentPage = pageInfo.pageIndex
                  const totalPage = Math.ceil(total / 10)
                  return `共 ${total} 条     第 ${currentPage}/${totalPage} 页`
                },
                size: "small",
                onChange: (current: number) => {
                  setPageInfo({pageSize: pageInfo.pageSize, pageIndex: current})
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UploadForm;
