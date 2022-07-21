import Upload from '@/components/upload_form';
import { CloseCircleOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Image, Space } from 'antd';
import classnames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import './UploadImageFormItem.less';

interface UploadImageFormItemProps {
  value?: string;
  onChange?: (val: string) => void;
}

export default function (
  props: UploadImageFormItemProps & Omit<UploadProps, 'value' | 'onChange'>,
) {
  const { value, onChange, ...uploadProps } = props;
  const [loading, setLoading] = useState(false);

  const single = useMemo(() => {
    return uploadProps.maxCount === 1;
  }, [uploadProps]);

  const fileList = useMemo(() => {
    if (!value || single) {
      return [];
    }

    return value
      .split(',')
      .filter((item) => item.trim())
      .map((item) => {
        return item.trim();
      });
  }, [value, single]);

  const disable = useMemo(() => {
    return !single && uploadProps.maxCount && fileList.length >= uploadProps.maxCount;
  }, [single, uploadProps, fileList]);

  const uploadButton = useMemo(() => {
    if (loading) {
      return <LoadingOutlined />;
    }
    if (value && single) {
      return (
        <div className={'reupload'}>
          <img src={value} alt="图片损坏" />
          <div>重新上传</div>
        </div>
      );
    }

    return (
      <div className={classnames({ uploadDisable: disable })}>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>上传</div>
      </div>
    );
  }, [loading, value, single, disable]);

  const onFileChange = useCallback(
    (info) => {
      if (onChange) {
        if (value && !single) {
          onChange([value, info.path].join(','));
        } else {
          onChange(info.path);
        }
      }
    },
    [onChange, value, single],
  );

  const onRemove = useCallback(
    (url: string) => {
      const val = fileList.filter((item) => item !== url).join(',');
      if (onChange) {
        onChange(val);
      }
    },
    [fileList, onChange],
  );

  return (
    <Space>
      <Upload
        {...uploadProps}
        disabled={disable}
        className="upload-image"
        action="/antelope-manage/common/upload/record"
        showUploadList={false}
        onChange={onFileChange}
        changeLoading={setLoading}
      >
        {uploadButton}
      </Upload>

      <Image.PreviewGroup>
        <Space>
          {fileList.map((url) => {
            return (
              <div className="image-content" key={url}>
                <Image style={{ maxWidth: 102, maxHeight: 102 }} src={url} alt="图片加载失败" />
                <span className="close" onClick={() => onRemove(url)}>
                  <CloseCircleOutlined />
                </span>
              </div>
            );
          })}
        </Space>
      </Image.PreviewGroup>
    </Space>
  );
}
