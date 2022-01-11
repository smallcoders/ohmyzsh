import React, { useEffect, useState } from 'react';
// import PDF from 'react-pdf-js';
import scopedClasses from '@/utils/scopedClasses';
import './service-config-diagnostic-tasks-report.less';
import { Button, message } from 'antd';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
// import { downloadFile } from '@/services/common';
import { routeName } from '../../../../config/routes';
const sc = scopedClasses('service-config-diagnostic-tasks-report');
// import { Document, Page, pdfjs } from 'react-pdf'
// import PDF from "./PDF";
import { downloadFile } from '@/services/common';

export default () => {
  const { fileId } = history.location.query as { fileId: string | undefined };
  const [isExist, setIsExist] = useState<boolean>(false);
  const [file, setFile] = useState();
  // 将返回的流数据转换为url
  const getObjectURL = (data: any) => {
    let url = null;
    if (window.webkitURL !== undefined) {
      // webkit or chrome
      try {
        url = window.webkitURL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      } catch (err) {
        console.log(err);
      }
    } else if (window.URL !== undefined) {
      // mozilla(firefox)
      try {
        url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      } catch (err) {
        console.log(err);
      }
    }
    return url;
  };
  const prepare = async () => {
    try {
      const res = await downloadFile(fileId as string);
      if (!res.code) {
        // 目前只有报错的时候才会有code
        setIsExist(true);
        setFile(getObjectURL(res) as any);
      } else {
        throw new Error();
      }
    } catch (error) {
      message.error('服务器报错或者文件不存在');
    }
  };

  useEffect(() => {
    prepare();
  }, [fileId]);

  return (
    <PageContainer className={sc()}>
      <div className={sc('header')}>
        <div className={sc('header-btns')}>
          {isExist && (
            <Button
              type="primary"
              href={`/iiep-manage/common/download/${fileId}`}
              download={`/iiep-manage/common/download/${fileId}`}
            >
              下载报告
            </Button>
          )}
          <Button onClick={() => history.push(`${routeName.DIAGNOSTIC_TASKS}`)}>返回</Button>
        </div>
      </div>
      <div className={sc('body')}>
        <div className="pdf-preview-container">{/* <PDF src={`${fileId}`} scale={1.2} /> */}</div>
        {/* <Document
          //文件路径,
          file={`/iiep-manage/common/download/${fileId}`}
          //加载成功调用 
          onLoadSuccess={(total: any) => {
            console.log(total, total)
            if (total)
              setPdfPageInfo({
                page: 1,
                total,
              });
          }}
          //加载失败调用 
          // onLoadError={onDocumentLoadFail}
          //加载提示 
          loading={<div>Please wait!</div>}>
          <Page pageNumber={pdfPageInfo.page} />
        </Document> */}
        {/* {isExist && ( */}
        {/* <PDF
          file={`/iiep-manage/common/download/${fileId}`}
          scale={1}
          onDocumentComplete={(total) => {
            console.log(total, total)
            if (total)
              setPdfPageInfo({
                page: 1,
                total,
              });
          }}
          page={pdfPageInfo.page}
        /> */}
        {/* )} */}
        {/* <embed type="application/pdf"  src={file} width="100%" height="800px"></embed> */}
        {isExist && (
          <iframe title="AAAA" src={file + '#toolbar=0'} width="100%" height="650px"></iframe>
        )}
        {/* <Pagination
          onChange={(page) => {
            setPdfPageInfo({
              ...pdfPageInfo,
              page,
            });
          }}
          total={pdfPageInfo.total}
          current={pdfPageInfo.page}
          pageSize={1}
        /> */}
      </div>
    </PageContainer>
  );
};
