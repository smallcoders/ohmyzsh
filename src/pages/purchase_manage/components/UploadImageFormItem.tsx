import Upload from '@/components/upload_form';
import { CloseCircleOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Image, Space } from 'antd';
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
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>上传</div>
      </div>
    );
  }, [value, single, loading]);

  const fileList = useMemo(() => {
    if (!value || single) {
      return [];
    }

    return value.split(',').map((item) => {
      return item.trim();
    });
  }, [value, single]);

  const onFileChange = useCallback(
    (info) => {
      if (onChange) {
        const val = [value, info.path].join(',');

        onChange(val);
      }
    },
    [onChange, value],
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
