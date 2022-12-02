import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { downloadFile } from '@/services/common';
export default async (data: any, zipFileName: string) => {
  const zip = new JSZip();
  const imgsss: JSZip | null = zip.folder(zipFileName);
  const promises: Promise<T>[] = [];
  if (data.length > 1) {
    data.forEach((item: any) => {
      const promise = downloadFile(item.id).then((res: any) => {
        // 下载文件, 文件名必须带有文件类型后缀
        const file_name = `${item.name}.${item.format}`;
        // 逐个添加文件
        imgsss?.file(file_name, res, { binary: true });
      });
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      zip
        .generateAsync({ type: 'blob' })
        .then((content) => {
          // 生成二进制流,利用file-saver保存文件
          FileSaver.saveAs(content, zipFileName);
        })
        .catch(() => {
          // // 如果有资源文件下载失败，就直接用a链接下载
          // data.forEach((item) => {
          //   File.download({ url: item.download_url, fileName: item.name });
          // });
        });
    });
  } else {
    const file = data[0];
    const file_name = `${file.name}.${file.format}`;
    if (file.id) {
      downloadFile(file.id).then((res: any) => {
        FileSaver.saveAs(res, file_name);
      });
    }
  }
};
