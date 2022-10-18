import { message } from 'antd'

export default async (
  httpUrl: (data: any) => Promise<any>,
  params: { [props: string]: any },
  errMsg = '导出失败，请重试',
) => {
  try {
    const res = await httpUrl({
      ...params,
    })
    console.log('@@',res)
    const { data, headers } = res
    const fileName = headers['content-disposition']
      .split(';')
      .filter((item: string) => item.indexOf('filename=') >= 0)[0]
      ?.split('=')[1]
    if (data) {
      // 下载
      const blob = new Blob([data])
      if (window.navigator?.msSaveOrOpenBlob) {
        window.navigator?.msSaveOrOpenBlob(blob, fileName)
      } else {
        // 生成a标签，模拟点击事件
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        document.body.appendChild(a)
        a.style.display = 'none'
        a.href = downloadUrl
        a.download = decodeURIComponent(fileName)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(downloadUrl)
      }
    }
  } catch {
    message.error(errMsg)
  }
}
