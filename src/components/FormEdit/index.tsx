// @ts-nocheck
import { uploadFile } from '@/services/common';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { message } from 'antd';
import { useState } from 'react';
import './index.less';
export default (props: {
  value?: string;
  width?: number | string;
  onChange?: (value: string) => void;
  selfToolbar?: any
}) => {
  const [contentHtml, setContentHtml] = useState<string | undefined>();

  const [editor, setEditor] = useState<any>(null);
  const CKEditorConfig = {
    placeholder: '请输入',
    language: 'zh-cn',
    toolbar: props.selfToolbar
    ? props.selfToolbar
    : [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'uploadImage',
      'undo',
      'redo',
      '|',
      'blockQuote',
      'insertTable',
    ],
  };

  // 富文本框上传图片加载器
  const MyCustomUploadAdapterPlugin = (_editor) => {
    _editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return (function () {
        const upload = () => {
          return loader.file.then(
            (file) =>
              new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('file', file);
                uploadFile(formData).then((res) => {
                  if (res?.code === 0) {
                    resolve({
                      default: res.result.path,
                    });
                    message.success('上传成功');
                    return;
                  }
                  reject(message.error('上传失败'));
                });
              }),
          );
        };

        const abort = () => {
          console.log('赞不支持取消上传');
        };

        return {
          upload,
          abort,
        };
      })();
    };
  };

  const handleEditorChange = () => {
    const _contentHtml = editor?.getData();
    if (_contentHtml === undefined) return; // 默认第一次undefined会调用

    // const contentText = viewToPlainText(editor?.editing?.view?.document?.getRoot())
    setContentHtml(_contentHtml);
    props.onChange?.(_contentHtml);
  };

  return (
    <div style={{ width: props.width || 600 }}>
      <CKEditor
        editor={ClassicEditor}
        data={props.value || contentHtml || ''}
        onReady={(_editor) => {
          setEditor(_editor);
        }}
        onChange={() => {
          handleEditorChange();
        }}
        config={{
          extraPlugins: [MyCustomUploadAdapterPlugin],
          link: { addTargetToExternalLinks: true },
          ...CKEditorConfig,
        }}
      />
    </div>
  );
};
