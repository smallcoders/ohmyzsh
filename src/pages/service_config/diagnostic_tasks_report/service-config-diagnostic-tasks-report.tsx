import React, { useState } from 'react';
import PDF from 'react-pdf-js';
import scopedClasses from '@/utils/scopedClasses';
import './service-config-diagnostic-tasks-report.less';
import { Button, Pagination } from 'antd';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
const sc = scopedClasses('service-config-diagnostic-tasks-report');

export default () => {
  const { fileId } = history.location.query as { fileId: string | undefined };
  const [pdfPageInfo, setPdfPageInfo] = useState<{
    total: number;
    page: number;
  }>({
    total: 1,
    page: 1,
  });
  return (
    <PageContainer className={sc()}>
      <div className={sc('header')}>
        <div className={sc('header-btns')}>
          <Button
            type="primary"
            href={`/iiep-manage/common/download/${fileId}`}
            download={`/iiep-manage/common/download/${fileId}`}
          >
            下载报告
          </Button>
          <Button onClick={() => history.go(-2)}>返回</Button>
        </div>
      </div>
      <div className={sc('body')}>
        <PDF
          file={`/iiep-manage/common/download/${fileId}`}
          scale={1}
          onDocumentComplete={(total) => {
            if (total)
              setPdfPageInfo({
                page: 1,
                total,
              });
          }}
          page={pdfPageInfo.page}
        />
        {/* <embed type="application/pdf"  src={`/iiep-manage/common/download/${fileId}`} width="100%" height="100%"></embed> */}
        {/* <iframe src={`/iiep-manage/common/download/${fileId}`} width="100%" height="100%"></iframe> */}
        <Pagination
          onChange={(page) => {
            setPdfPageInfo({
              ...pdfPageInfo,
              page,
            });
          }}
          total={pdfPageInfo.total}
          current={pdfPageInfo.page}
          pageSize={1}
        />
      </div>
    </PageContainer>
  );
};
