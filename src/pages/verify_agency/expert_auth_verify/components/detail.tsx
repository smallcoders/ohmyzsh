import { useState } from 'react';
import { history } from 'umi';
import { Descriptions, Image, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import SelfTable from '@/components/self_table'
import type ExpertAuthVerify from '@/types/verify/expert-auth-verity';
import scopedClasses, { labelStyle, contentStyle } from '@/utils/scopedClasses';
import './detail.less';

const sc = scopedClasses('user-config-kechuang');
export const previewType = ['png', 'jpg', 'jpeg', 'jpeg2000', 'pdf'] // 可预览的格式

export default () => {
  const id = history.location.query?.id as string;
  const [detail, setDetail] = useState<ExpertAuthVerify.Detail | null>(null);

  const {
    personalPhoto,
    expertName,
    areaName,
    typeName,
    industryList,
    phone,
    workUnit,
    duty,
    email,
    expertIntroduction,
    workExperience,
    expertSkills,
    projectExperience,
    skilledField,
    fileList = [],
  } = detail || {}

  const basicContent1 = [
    {
      label: '个人照片',
      value: personalPhoto ? (
        <Image className="img-photo" src={personalPhoto} alt="个人照片" />
      ) : (
        ''
      ),
    },
    { label: '专家姓名', value: expertName },
    { label: '所属区域', value: areaName },
    { label: '专家类型', value: typeName?.replace(/,/g, '、') || '' },
    { label: '产业方向', value: industryList?.replace(/,/g, '、') || '' },
  ]

  const basicContent2 = [
    { label: '联系电话', value: phone },
    { label: '工作单位', value: workUnit },
    { label: '职务', value: duty },
    { label: '邮箱', value: email },
  ]

  const basicContent3 = [
    { label: '个人简介', value: expertIntroduction },
    { label: '工作经验', value: workExperience },
    { label: '专家技能', value: expertSkills },
    { label: '项目经验', value: projectExperience },
    { label: '擅长领域', value: skilledField },
  ]

  const infoAuthContent = [
    { title: '专家基本信息', content: basicContent1 },
    { title: '联系信息', content: basicContent2 },
    { title: '专家介绍', content: basicContent3 },
  ]

  const fileColumns = [
    {
      title: '文件名称',
      dataKey: 'name',
      width: '25%',
    },
    {
      title: '文件格式',
      dataKey: 'format',
      width: '25%',
    },
    {
      title: '文件上传时间',
      dataKey: 'createTime',
      width: '25%',
    },
    {
      title: '操作',
      dataKey: 'action',
      fixed: 'right',
      width: '25%',
      render(text: string, record: any) {
        return (
          <div>
            {previewType.includes(record?.format) && (
              <Button
                type="link"
                style={{ padding: 0, height: 'auto' }}
                onClick={() => {
                  window.open(record?.path)
                }}
              >
                预览
              </Button>
            )}
            <Button
              type="link"
              style={{ marginLeft: '8px', padding: 0, height: 'auto' }}
              onClick={() => {
                handleDownloadFile(record?.id)
              }}
            >
              下载
            </Button>
          </div>
        )
      },
    },
  ]

  // 下载附件
  const handleDownloadFile = (id: string) => {
    // exportUtil(httpDownloadAttachments, { fileId: id }, '下载失败，请重试')
  }

  return (
    <PageContainer className={sc('container')}>
      {infoAuthContent?.map((item, index) => {
        return (
          <div key={index}>
            <div className={sc('header')}>{item?.title}</div>
            <Descriptions column={1} labelStyle={labelStyle} contentStyle={contentStyle}>
              {item?.content?.map((item, index: number) => {
                return (
                  <Descriptions.Item key={item?.label || index} label={item?.label || null}>
                    {item?.value || '--'}
                  </Descriptions.Item>
                )
              })}
            </Descriptions>
          </div>
        )
      })}
      {fileList?.length > 0 && (
        <div className={sc('content')} style={{ paddingLeft: 160 }}>
          <SelfTable
            columns={fileColumns}
            rowKey="id"
            dataSource={fileList || []}
            pagination={false}
          />
        </div>
      )}
    </PageContainer>
  );
};
