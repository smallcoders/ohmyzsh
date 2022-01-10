import React, { useEffect, useState } from 'react';
import PDF from 'react-pdf-js';
import scopedClasses from '@/utils/scopedClasses';
import './service-config-diagnostic-tasks-report.less';
import { Button, message, Pagination } from 'antd';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { downloadFile } from '@/services/common';
const sc = scopedClasses('service-config-diagnostic-tasks-report');

export default () => {
  const { fileId } = history.location.query as { fileId: string | undefined };
  const [isExist, setIsExist] = useState<boolean>(false);
  const [pdfPageInfo, setPdfPageInfo] = useState<{
    total: number;
    page: number;
  }>({
    total: 1,
    page: 1,
  });

  const prepare = async () => {
    try {
      const res = await downloadFile(fileId as string);
      if (!res.code) {
        // 目前只有报错的时候才会有code
        setIsExist(true);
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
          <Button onClick={() => history.go(-2)}>返回</Button>
        </div>
      </div>
      <div className={sc('body')}>
        {isExist && (
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
        )}
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
