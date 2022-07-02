import { Upload, Modal, message, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
// import axios, { CancelTokenSource } from 'axios';
import { request } from 'umi';
import { UploadFileInfo } from '@/components/self_upload';
import { httpUploadWithDetail } from '@/services/common';
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const SIZE_LIMIT_FILE = 30;

// const CancelToken = axios.CancelToken;

// interface TokenData extends CancelTokenSource {
//   uid: string;
// }

export default (
  props: JSX.IntrinsicAttributes &
    UploadProps<any> & { children?: ReactNode } & {
      value?: any;
      multiple?: boolean;
      onChange?: (files: UploadFileInfo[]) => void;
      beforeUploadFile?: (file: any) => void;
      accept?: string;
    },
) => {
  const { multiple = false, onChange, accept } = props || {};
  const [fileList, setFileList] = useState<any>([]);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [previewObj, setPreviewObj] = useState<{
    previewImage?: string;
    previewVisible?: boolean;
    previewTitle?: string;
  }>({});
  const [reqTokens, setReqTokens] = useState<Array<any>>([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewObj({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  const beforeUploadFile = (file: any) => {
    const isLtLimit = file.size / 1024 / 1024 < SIZE_LIMIT_FILE;
    if (!isLtLimit) {
      message.error(`文件尺寸需小于${SIZE_LIMIT_FILE}M`);
    }
    return isLtLimit;
  };

  useEffect(() => {
    if (props.value && props.value.length > 0) {
      console.log('props.value', props.value);
      setFileList(props.value);
    }
  }, [props.value]);
  // 文件上传处理
  const handleSetFile = (data: UploadFileInfo) => {
    const { uid } = data || {};
    setFileList((preValues) => {
      if (!multiple) {
        const preValue = preValues[0];
        const file = [
          {
            ...preValue,
            ...data,
          },
        ];
        onChange && onChange(file);
        return file;
      }
      // 多文件
      const values = [...preValues];
      const existValueIndex = values?.findIndex((item) => uid && item.uid === uid);
      if (existValueIndex >= 0) {
        values[existValueIndex] = { ...values[existValueIndex], ...data };
        onChange && onChange(values);
        return values;
      }
      const files = [...preValues, data];
      onChange && onChange(files);
      return files;
    });
  };
  // 删除请求token
  const handleRemoveToken = (uid: string) => {
    setReqTokens((preValues) => {
      return preValues.filter((item) => uid && item?.uid !== uid);
    });
  };

  useEffect(() => {
    console.log('fileList', fileList);
  }, [fileList]);
  // 取消所有请求
  // const handleCancelUploadAllFiles = () => {
  //   const uploadingFiles = files
  //     ?.filter((item) => item.status === 'uploading')
  //     ?.map((item) => item?.uid)
  //   uploadingFiles?.forEach((uid) => {
  //     reqTokens?.find((item) => item?.uid === uid)?.cancel()
  //     handleRemoveToken(uid)
  //   })
  // }

  // 文件删除处理，默认文件的uid会自动生成
  const handleRemoveFile = (uid: string, status: string) => {
    // 取消请求
    if (status === 'uploading') {
      reqTokens?.find((item) => uid && item?.uid === uid)?.cancel();
    }
    setFileList((preValues) => {
      const files = preValues.filter((item) => uid && item?.uid !== uid);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChange && onChange(files);
      return files;
    });
  };
  // 上传文件配置
  const uploadFileOptions = useMemo(() => {
    return {
      multiple,
      showUploadList: true,
      accept: accept,
      fileList: [...fileList],
      beforeUpload: props.beforeUploadFile || beforeUploadFile,
      customRequest: async ({ file }) => {
        setUploadLoading(true);
        const { name, uid } = file || {};
        // 设置请求token列表
        // const source = CancelToken.source();
        // setReqTokens((preValues) => [...preValues, { ...source, uid }]);
        const formData = new FormData();
        formData.append('file', file);
        let percent = 0;
        try {
          const res = await httpUploadWithDetail(
            formData,
            ({ total, loaded }) => {
              percent = (loaded / total) * 100;
              handleSetFile({
                uid,
                name,
                percent: percent === 100 ? 99 : percent,
                status: 'uploading',
              });
            },
          );
          if (res?.code === 0) {
            const { result } = res || {};
            handleSetFile({
              resData: result,
              uid,
              name,
              percent: 100,
              status: 'success',
              url: result?.path, //res?.result,
            });
            message.success('文件上传成功');
            return;
          }
          throw new Error('文件上传失败');
        } catch (err) {
          message.warning('文件上传失败');
          // if (axios.isCancel(err)) {
          // message.warning('文件中断上传');
          // } else {
          //   handleSetFile({
          //     uid,
          //     name,
          //     percent,
          //     status: 'error',
          //   });
          //   message.error('文件上传失败');
          // }
        } finally {
          setUploadLoading(false);
          // 删除请求token
          handleRemoveToken(file?.uid);
        }
      },
      onRemove: (file) => {
        const { uid, status } = file || {};
        handleRemoveFile(uid, status);
      },
    };
  }, [fileList]);

  const uploadButton = uploadLoading ? (
    <LoadingOutlined />
  ) : (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  // jpg、png、doc、.docx .pdf
  return (
    <>
      <Upload listType="picture-card" onPreview={handlePreview} {...uploadFileOptions}>
        {props.multiple && fileList.length >= props.maxCount ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewObj.previewVisible}
        // title={previewObj.previewTitle}
        footer={null}
        onCancel={() => {
          setPreviewObj({ previewVisible: false });
        }}
      >
        <img alt="example" style={{ width: '100%' }} src={previewObj.previewImage} />
      </Modal>
    </>
  );
};
