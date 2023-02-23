import { useState, useEffect } from 'react';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Drawer, Select, Button, message, Image, Modal, Tooltip } from 'antd';

import SelfTable from '@/components/self_table';
import type { ProColumns } from '@ant-design/pro-table';

import type DataCommodity from '@/types/data-commodity';
import { getDiagnosisServiceDetail, getDiagnosisResult } from '@/services/diagnose-service';
// import patchDownloadFile from '@/utils/patch-download-file';
import { downloadFile } from '@/services/common';
import icon1 from '@/assets/system/empty.png';

type ReportDetailDrawerPropstype = {
  visible: boolean;
  diagnosisServiceDetail: any;
  onClose: () => void;
};

type ViewDiagnosisResultPropstype = {
  visible: boolean;
  diagnosisServiceInfo: DataCommodity.DiagnosisServiceDetailType | null;
  onHandleCloseModal: () => void;
};

type DiagnosisDoctype = {
  docName: string;
  fileId: string;
  path: string;
};

enum DiagnosisResultStatus {
  Undiagnosed, // 未诊断
  Diagnosed, //已诊断
}

// 诊断完成情况options
const optsOfDiagnosisCompletion = [
  { label: '已完成', value: DiagnosisResultStatus.Diagnosed },
  { label: '未完成', value: DiagnosisResultStatus.Undiagnosed },
];

function ViewDiagnosisResultModal(p: ViewDiagnosisResultPropstype) {
  const [diagnosisResultInfo, setDiagnosisResult] = useState<any>(null);
  const [isDownloadingAllFiles, setIsDownloadingAllFiles] = useState<boolean>(false);

  useEffect(() => {
    if (p?.diagnosisServiceInfo?.recordNo) {
      const handleGetDiagnosisResult = async () => {
        try {
          const res = await getDiagnosisResult(p?.diagnosisServiceInfo?.recordNo);
          if (res?.code === 0) {
            setDiagnosisResult(res?.result);
          } else {
            message.error(res?.message);
          }
        } catch (err) {
          console.log('err: ', err);
          message.error('查询诊断结果异常, 请稍候再试~');
        }
      };

      handleGetDiagnosisResult();
    }
  }, [p?.diagnosisServiceInfo]);

  function handleFileIsPDFOrImg(file: DiagnosisDoctype) {
    const enableViewType = ['pdf', 'jpg', 'jpeg', 'png', 'svg', 'gif'];
    const fileNameStrList = file?.docName?.split('.');
    const fileType = fileNameStrList?.[fileNameStrList.length - 1];
    return enableViewType.includes(fileType);
  }

  // 预览该文档，若文档不支持预览则直接下载该文档
  function handleDownloadOrViewFile(file: DiagnosisDoctype) {
    const isFilePDFOrImg = handleFileIsPDFOrImg(file);
    if (isFilePDFOrImg) {
      window.open(file?.path);
      return;
    }
    downloadFile(file?.fileId).then((res: any) => {
      FileSaver.saveAs(res, file?.docName);
    });
  }

  // 下载全部文件
  async function handleDownloadAllDocs() {
    setIsDownloadingAllFiles(true);
    const ZIP_FILE_NAME = '诊断结论';
    const zip = new JSZip();
    const imgsss: JSZip | null = zip.folder(ZIP_FILE_NAME);
    const promises: Promise<T>[] = [];
    const data: any[] = [];
    for (let key in diagnosisResultInfo) {
      const docs = diagnosisResultInfo[key];
      console.log('docs: ', docs);
      if (Array.isArray(docs)) {
        docs.forEach((doc) => {
          data.push(Object.assign({}, doc));
        });
      } else {
        (Object.keys(docs) ?? {}).length > 0 && data.push(Object.assign({}, docs));
      }
    }

    console.log('data: ', data);
    data.forEach((item: any) => {
      const promise = downloadFile(item.fileId).then((res: any) => {
        // 逐个添加文件
        imgsss?.file(item.docName, res, { binary: true });
      });
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      zip
        .generateAsync({ type: 'blob' })
        .then((content) => {
          // 生成二进制流,利用file-saver保存文件
          FileSaver.saveAs(content, ZIP_FILE_NAME);
          setIsDownloadingAllFiles(false);
          p?.onHandleCloseModal();
        })
        .catch(() => {
          // // 如果有资源文件下载失败，就直接用a链接下载
          // data.forEach((item) => {
          //   File.download({ url: item.download_url, fileName: item.name });
          // });
        });
    });
  }

  return (
    <Modal
      visible={p.visible}
      footer={null}
      width={480}
      title={<span className="modal-title">查看诊断结论</span>}
      className="diagnosis-result-report-modal"
      destroyOnClose
      onCancel={p?.onHandleCloseModal}
    >
      <>
        <ul>
          <li className="doc-item">
            <label>服务企业：</label>
            <div>{p?.diagnosisServiceInfo?.enterpriseName}</div>
          </li>
          <li>
            <label>诊断报告：</label>
            <div
              className="file-wrapper"
              onClick={handleDownloadOrViewFile.bind(null, diagnosisResultInfo?.diagnoseReportDoc)}
            >
              {diagnosisResultInfo?.diagnoseReportDoc?.docName}
            </div>
          </li>
          <li>
            <label>诊断过程材料：</label>
            <ul className="file-wrapper">
              {diagnosisResultInfo?.diagnoseProcessDocs?.map((doc: DiagnosisDoctype) => {
                const fileNameStrList = doc?.docName?.split('.');
                return (
                  <Tooltip title={doc?.docName}>
                    <li className="file-item" onClick={handleDownloadOrViewFile.bind(null, doc)}>
                      <span>
                        {[...fileNameStrList].splice(0, fileNameStrList.length - 1).join('')}
                      </span>
                      <span>.{[...fileNameStrList]?.[fileNameStrList.length - 1]}</span>
                    </li>
                  </Tooltip>
                );
              }) || '--'}
            </ul>
          </li>
        </ul>
        <Button
          type="primary"
          className="download-btn"
          disabled={
            !diagnosisResultInfo?.diagnoseReportDoc &&
            !diagnosisResultInfo?.diagnoseProcessDocs &&
            !(diagnosisResultInfo?.diagnoseProcessDocs ?? []).length
          }
          loading={isDownloadingAllFiles}
          onClick={handleDownloadAllDocs}
        >
          下载全部文件
        </Button>
      </>
    </Modal>
  );
}

export default function ReportDetailDrawer(p: ReportDetailDrawerPropstype) {
  const [diagnosisCompletionStatus, setDiagnosisCompletionStatus] =
    useState<DiagnosisResultStatus | null>(null);
  const [dataSource, setDataSource] = useState<DataCommodity.DiagnosisServiceDetailType[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [totalPageInfo, setTotalPageInfo] = useState({
    totalCount: 0,
    pageTotal: 0,
  });

  const [isResultModalShow, setIsResultModalShow] = useState(false);
  const [diagnosisServiceInfo, setDiagnosisServiceInfo] =
    useState<DataCommodity.DiagnosisServiceDetailType | null>(null);

  useEffect(() => {
    const handleFetchDiagnosisServiceDetail = async () => {
      try {
        setLoading(true);
        const res = await getDiagnosisServiceDetail({
          pageIndex: pageInfo?.pageIndex,
          pageSize: pageInfo?.pageSize,
          packageNo: p?.diagnosisServiceDetail?.packageNo,
          providerId: p?.diagnosisServiceDetail?.providerId,
          diagnosed: diagnosisCompletionStatus,
        });
        if (res?.code === 0) {
          setTotalPageInfo({ totalCount: res?.totalCount, pageTotal: res?.pageTotal });
          setDataSource(res?.result);
          setLoading(false);
        } else {
          message.error(`请求分页数据失败`);
          setLoading(false);
        }
      } catch (_) {
        setLoading(false);
      }
    };

    p?.diagnosisServiceDetail && handleFetchDiagnosisServiceDetail();
  }, [p?.diagnosisServiceDetail, pageInfo, diagnosisCompletionStatus]);

  function handleSelectChange(value: DiagnosisResultStatus) {
    console.log('value: ', value);
    setDiagnosisCompletionStatus(value);
  }

  // 查看诊断结论
  function handleViewDiagnosisResult(info: DataCommodity.DiagnosisServiceDetailType) {
    console.log('info: ', info);
    setDiagnosisServiceInfo(info);
    setIsResultModalShow(true);
  }

  // 关闭诊断结果弹窗
  function handleCloseResultModal() {
    setIsResultModalShow(false);
  }

  function handlePageChange(pageIndex: number = 1, pageSize = pageInfo.pageSize) {
    setPageInfo((prevState) => ({ ...prevState, pageIndex, pageSize }));
  }

  const columns: ProColumns<DataCommodity.DiagnosisServiceDetailType>[] = [
    {
      title: '服务企业',
      dataIndex: 'enterpriseName',
      valueType: 'textarea',
    },
    {
      title: '实际服务时间',
      valueType: 'textarea',
      render: (_, record) => (
        <>{`${
          !record?.['diagnosed']
            ? '暂无'
            : `${record?.serviceStartTime ?? '--'}~${record?.serviceEndTime ?? '--'}`
        }`}</>
      ),
    },
    {
      title: '查看诊断结论',
      render: (_, record) =>
        !record?.['diagnosed'] ? (
          '--'
        ) : (
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={handleViewDiagnosisResult.bind(null, record)}
          >
            查看
          </Button>
        ),
    },
  ];

  return (
    <Drawer
      visible={p.visible}
      width={800}
      title={<span>{p?.diagnosisServiceDetail?.providerName}-诊断服务详情</span>}
      className="diagnosis-server-detail-drawer"
      onClose={p?.onClose}
    >
      <>
        <div className="diagnosis-status-header">
          诊断完成情况：
          <Select
            allowClear
            style={{ width: 320 }}
            showArrow={true}
            placeholder="请选择"
            options={optsOfDiagnosisCompletion}
            onChange={handleSelectChange}
          />
        </div>
        {dataSource &&
          (dataSource?.length > 0 ? (
            <SelfTable
              loading={loading}
              columns={columns}
              dataSource={dataSource}
              pagination={{
                onChange: handlePageChange,
                total: totalPageInfo.totalCount,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total: number) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${totalPageInfo.pageTotal || 1}页`,
              }}
            />
          ) : (
            <div className="empty-status">
              <Image src={icon1} width={160} />
              <p>暂无数据</p>
            </div>
          ))}
        <ViewDiagnosisResultModal
          visible={isResultModalShow}
          diagnosisServiceInfo={diagnosisServiceInfo}
          onHandleCloseModal={handleCloseResultModal}
        />
      </>
    </Drawer>
  );
}
