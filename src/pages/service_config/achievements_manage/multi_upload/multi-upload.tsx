import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import { Button, Form, Select, message, Upload } from 'antd';
import type { UploadProps, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { downloadFile } from '@/services/common';
import { getUserListBySearch, postAchievementUpload } from '@/services/achievements-manage';
import IconSuccess from '@/assets/system/icon-success.png'
import IconFail from '@/assets/system/icon-error.png'
import scopedClasses from '@/utils/scopedClasses';
import './multi-upload.less';

const { Dragger } = Upload;
const sc = scopedClasses('achievements-multi-upload-page');
interface UserOption {
  id: string;
  name: string // name·phone
  phone: string
}

export default () => {
  const [searchLoading, setSearchLoading] = useState<boolean>(false) // 系统用户检索loading
  const [uploadLoading, setUploadLoading] = useState<boolean>(false) // 导入loading
  const [showResult, setShowResult] = useState<boolean>(false) // 是否显示导入结果
  const [userOptions, setUserOptions] = useState<UserOption[]>([]) // 系统用户选项列表
  const [fileList, setFileList] = useState<UploadFile[]>([]); // 已上传待导入的文件列表
  const [userId, setUserId] = useState<string>('') // 已选中的系统用户Id
  const [fileId, setFileId] = useState<string>('') // 已上传待导入的文件Id
  const [successNum, setSuccessNum] = useState<number>(0) // 导入成功的数据条数
  const [failNum, setFailNum] = useState<number>(0) // 导入失败的数据条数
  const [failDataFileId, setFailDataFileId] = useState<string>('') // 导入失败的数据文件Id

  useEffect(() => {
    handleUserSearch()
  }, [])

  // 系统用户检索
  const handleUserSearch = async (keyword = '') => {
    try {
      setSearchLoading(true)
      const res = await getUserListBySearch(keyword)
      if (res?.code === 0) {
        setUserOptions(res?.result.map((item: UserOption) => ({ id: item?.id, name: item?.name + ' ' + item?.phone })))
      } else {
        message.error(`检索失败:{${res.message}}`);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setSearchLoading(false)
    }
  }

  // 导入
  const handleConfirmUpload = async () => {
    if (!userId) {
      message.error('请选择系统用户');
      return
    }
    if (!fileId) {
      message.error('请上传导入文件');
      return
    }
    try {
      setUploadLoading(true)
      const res = await postAchievementUpload({ userId, fileId })
      if (res?.code === 0) {
        setShowResult(true)
        setSuccessNum(res?.result?.successNum || 0)
        setFailNum(res?.result?.failNum || 0)
        setFailDataFileId(res?.result?.fileId || '')
      } else {
        message.error(`批量导入失败:{${res.message}}`);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setUploadLoading(false)
    }
  }

  // 下载导入失败数据
  const handleDownloadFailData = () => {
    failDataFileId && downloadFile(failDataFileId)
  }

  const goBack = () => {
    history.push(`/service-config/achievements-manage/index`);
  }

  // 上传组件配置
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: '/antelope-manage/common/upload',
    fileList,
    onChange: info => {
      const { status, name, response } = info?.file || {};
      if (status === 'done') {
        setFileId(response?.result)
        setFileList(info?.fileList)
        message.success(`${name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${name} 上传失败`);
      }
    },
    beforeUpload: file => {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        message.error('只支持上传xlsx文件');
        return false;
      }
      if (file.size > 1024 * 1024 * 10) {
        message.error('文件大小不能超过10M');
        return false;
      }
      return true;
    },
  };

  // 拖拽上传组件
  const DraggerUpload: React.FC = () => (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">将文件拖拽到此处，或点击上传</p>
      <p className="ant-upload-hint">支持扩展名: xlsx，文件大小不超过10M</p>
    </Dragger>
  );

  return (
    <PageContainer>
      <div className={sc('container')}>
        {!showResult ? <>
          <Form name="user_search" className={sc('form')}>
            <Form.Item label="系统用户名和手机号" required>
              <Select
                getPopupContainer={(trigger: any) => trigger as HTMLElement}
                fieldNames={{ label: 'name', value: 'id' }}
                placeholder="请选择"
                options={userOptions}
                loading={searchLoading}
                onSearch={handleUserSearch}
                onSelect={(v: string) => { setUserId(v) }}
                showSearch
                allowClear
              />
            </Form.Item>
          </Form>
          <div className={sc('upload-container')}>
            <p>
              请先
              <Button
                type="link"
                style={{ padding: 0 }}
                href={`/antelope-manage/common/download/1663227912000001`}
              >
                下载导入模板
              </Button>
              ，按要求填写后上传
            </p>
            <DraggerUpload></DraggerUpload>
          </div>
          <div className={sc('btn-container')}>
            <Button className={sc('btn')} onClick={goBack}>取消</Button>
            <Button className={sc('btn')} type="primary" loading={uploadLoading} onClick={handleConfirmUpload}>导入</Button>
          </div>
        </> : <>
          <p className={sc('result-title')}>导入结果</p>
          <div className={sc('result-container')}>
            <img src={IconSuccess} alt="success" />
            导入成功{successNum}条成果，
            <img src={IconFail} alt="success" />
            导入失败{failNum}条成果
          </div>
          {failNum > 0 && <p className={sc('result-download-text')}>
            请
            <Button type="link" onClick={handleDownloadFailData}>
              下载导入失败科技成果列表
            </Button>
            ，修改后重新导入
          </p>}
          <div className={sc('btn-container')}>
            <Button className={sc('btn')} onClick={() => { setShowResult(false) }}>重新导入</Button>
            <Button className={sc('btn')} type="primary" onClick={goBack}>完成导入</Button>
          </div>
        </>
        }
      </div>
    </PageContainer>
  );
};
