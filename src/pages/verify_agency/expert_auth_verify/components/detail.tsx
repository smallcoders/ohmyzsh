import { useState, useEffect } from 'react';
import { history } from 'umi';
import { Descriptions, Image, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import SelfTable from '@/components/self_table'
import Common from '@/types/common.d'
import type ExpertAuthVerify from '@/types/verify/expert-auth-verity';
import VerifyInfoDetail from '@/components/verify_info_detail';
import { httpGetExpertAuthVerifyDetail } from '@/services/verify/expert-auth-verify'
import scopedClasses, { labelStyle, contentStyle } from '@/utils/scopedClasses';
import './detail.less';

const sc = scopedClasses('expert-auth-verify-detail');
export const previewType = ['png', 'jpg', 'jpeg', 'jpeg2000', 'pdf'] // 可预览的格式

export default () => {
  const id = history.location.query?.id as string;
  const [detail, setDetail] = useState<ExpertAuthVerify.Detail | null>(null);

  const {
    personalPhoto,
    expertName,
    cityName,
    typeList,
    industryNameList,
    phone,
    workUnit,
    duty,
    email,
    expertIntroduction,
    workExp,
    expertSkill,
    projectExp,
    skilledField,
    fileList = [],
  } = detail || {}

  useEffect(() => {
    getExpertAuthVerifyDetail(id)
  }, [])

  const getExpertAuthVerifyDetail = async (id: string) => {
    try {
      const { code, result, message } = await httpGetExpertAuthVerifyDetail(id)
      if (code === 0) {
        setDetail(result)
      } else {
        throw new Error(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

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
    { label: '所属区域', value: cityName },
    { label: '专家类型', value: typeList?.map(item => item?.name)?.join('、') || '' },
    { label: '产业方向', value: industryNameList?.join('、') || '' },
  ]

  const basicContent2 = [
    { label: '联系电话', value: phone },
    { label: '工作单位', value: workUnit },
    { label: '职务', value: duty },
    { label: '邮箱', value: email },
  ]

  const basicContent3 = [
    { label: '个人简介', value: expertIntroduction },
    { label: '工作经验', value: workExp },
    { label: '专家技能', value: expertSkill },
    { label: '项目经验', value: projectExp },
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
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: '文件格式',
      dataIndex: 'format',
      width: '25%',
    },
    {
      title: '文件上传时间',
      dataIndex: 'createTime',
      width: '25%',
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: '25%',
      render(text: string, record: Common.FileInfo) {
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
              href={`/antelope-manage/common/download/${record?.id}`}
            >
              下载
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('detail-container')}>
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
          <div className={sc('content')} style={{ paddingLeft: 100 }}>
            <SelfTable
              rowKey="id"
              columns={fileColumns}
              dataSource={fileList || []}
              pagination={false}
            />
          </div>
        )}
      </div>
      <div className={sc('verify-container')}>
        <VerifyInfoDetail auditId={id} />
      </div>
    </PageContainer>
  );
};
