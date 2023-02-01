import { message, Upload, Modal, Progress, Button } from 'antd';
import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { uploadMaterial } from '@/services/material-library';
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { useState, useRef, useEffect } from 'react';
import scopedClasses from '@/utils/scopedClasses';
const sc = scopedClasses('material-library');

const UploadImg = (props: any) => {
  const [uploadMaterials, setUploadMaterials] = useState<any>([]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [percent, setPercent] = useState(0);
  const [failNum, setFailNum] = useState(0);
  const [doneNum, setDoneNum] = useState(0);
  const [fileListLen, setFileListLen] = useState(0);
  const doneNumRef = useRef(doneNum);
  doneNumRef.current = doneNum;
  const failNumRef = useRef(failNum);
  failNumRef.current = failNum;
  const uploadMaterialsRef = useRef(uploadMaterials);
  uploadMaterialsRef.current = uploadMaterials;

  const percentRef = useRef(percent);
  percentRef.current = percent;
  useEffect(() => {
    console.log(props.groupsId);
  }, [props.groupsId]);

  const finishReset = () => {
    setPercent(0);
    setDoneNum(0);
    setFailNum(0);
    setUploadMaterials([]);
    doneNumRef.current = 0;
    failNumRef.current = 0;
    uploadMaterialsRef.current = [];
    setFileListLen(0);
    props.finish();
    setUploadVisible(false);
  };

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setUploadVisible(true);
      return;
    }
    if (info.file.status === 'error') {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setFailNum((failNum) => failNum + 1);
      return;
    }
    if (info.file.status === 'done') {
      const uploadResponse = info?.file?.response;
      if (uploadResponse?.code === 0 && uploadResponse.result) {
        const img = new Image();
        img.src = uploadResponse.result.path;
        img.onload = async () => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          setDoneNum((doneNum) => doneNum + 1);
          setUploadMaterials((current: any) => [
            ...current,
            {
              groupsId: props.groupsId,
              photoWidth: img.width,
              photoHeight: img.height,
              originalName: uploadResponse.result.name,
              fileId: uploadResponse.result.id,
              photoUrl: uploadResponse.result.path,
            },
          ]);
          setPercent(() =>
            Number((((doneNumRef.current + failNumRef.current) / fileListLen) * 100).toFixed(2)),
          );
          setTimeout(() => {
            console.log(
              doneNumRef.current,
              failNumRef.current,
              uploadMaterialsRef.current,
              fileListLen,
              percentRef.current,
            );
            if (doneNumRef.current + failNumRef.current === fileListLen) {
              uploadMaterial(uploadMaterialsRef.current).then((res) => {
                console.log(res);
              });
            }
          }, 0);
        };
      }
    }
  };

  // 上传前
  const beforeUpload = (file: RcFile, files: RcFile[]) => {
    setFileListLen(files.length);
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

  const useModal = (): React.ReactNode => {
    return (
      <Modal
        className={sc('upload-modal')}
        title="图片上传"
        visible={uploadVisible}
        width={600}
        footer={false}
        maskClosable={false}
        destroyOnClose
        onCancel={() => {
          finishReset();
        }}
      >
        {percent === 100.0 && failNum === 0 ? (
          <div className="resultSuccess">
            <div className="icon">
              <CheckCircleFilled />
            </div>
            <div className="text1">上传成功,共{doneNum}条</div>
            <div>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  finishReset();
                }}
              >
                完成
              </Button>
            </div>
          </div>
        ) : percent === 100 && failNum !== 0 ? (
          <div className="resultFail">
            <div className="icon">
              <ExclamationCircleFilled />
            </div>
            <div className="text1">
              共上传<span style={{ color: '#0068FF' }}>{doneNum}</span>条，成功
              <span style={{ color: '#0068FF' }}>{doneNum - failNum}</span>条，失败
              <span style={{ color: '#ff4f17' }}>{failNum}</span>条
            </div>
            <div className="text2">图片大小不能超过10M</div>
            <div>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  finishReset();
                }}
              >
                完成
              </Button>
            </div>
          </div>
        ) : (
          <Progress strokeColor="#0068FF" percent={percentRef.current} />
        )}
      </Modal>
    );
  };
  return (
    <div>
      <Upload
        {...props}
        name="file"
        action="/antelope-manage/common/upload/record"
        onChange={handleChange}
        beforeUpload={beforeUpload}
        showUploadList={false}
      >
        {props.children}
      </Upload>
      {useModal()}
    </div>
  );
};
export default UploadImg;
