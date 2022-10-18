import { message, Image, Button, Descriptions, Radio, Row, Col, Empty } from 'antd';
import { history } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses, { labelStyle, contentStyle } from '@/utils/scopedClasses';
import './index.less';
import { getExpertAuthDetail, getOrgInfoAuthDetail, getUserDetail } from '@/services/user';
import SelfTable from '@/components/self_table';
const sc = scopedClasses('user-config-user-detail');
const scaleText = { 1: '0~50人', 2: '50~100人', 3: '100~200人', 4: '200~500人', 5: '500人以上' }
const businessTypeText = { 1: '国营', 2: '民营', 3: '三资', 4: '其他（事业单位、科研院所等）' }
export const previewType = ['png', 'jpg', 'jpeg', 'jpeg2000', 'pdf'] // 可预览的格式
export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [orgDetail, setOrgDetail] = useState<any>({});
  const [expertDetail, setExpertDetail] = useState<any>({});
  const [detail, setDetail] = useState<any>({});

  const [contentType, setContentType] = useState<number>(1)
  const {
    businessLicenseFile,
    orgTypeName,
    orgName,
    creditCode,
    formedDate,
    scale = 1,
    phone,
    provinceName, // 所属区域-省名称
    cityName, // 所属区域-市名称
    countyName, // 所属区域-县名称
    address,
    registeredCapital,
    aboutUs,
    ability,
    coverFile,
    businessType = 1,
    legalName,
    totalAssets,
    revenueLastYear,
    profitLastYear,
    creditRating,
    businessScope,
  } = orgDetail || {};
  const {
    personalPhotoFile,
    expertName,
    provinceName: personProvince,
    cityName: personCity,
    typeList,
    industryNameList,
    phone: personPhone,
    workUnit,
    duty,
    email,
    expertIntroduction,
    workExp,
    expertSkill,
    projectExp,
    skilledField,
    fileList = [],
  } = expertDetail || {};

  const prepare = async () => {
    const id = history.location.query?.id as string;

    if (id) {
      try {
        const userRes = await getUserDetail(id)
        setDetail(userRes?.result)

        if (userRes?.result?.expertId) {
          getExpertAuthVerifyDetail(userRes?.result?.expertId)
          setContentType(2)
        }
        if (userRes?.result?.orgId) {
          getEnterpriseInfoVerifyDetail(userRes?.result?.orgId)
          setContentType(1)
        }
        if (!userRes?.result?.expertId && !userRes?.result?.orgId) {
          setContentType(-1)
        }
      } catch (error) {
        message.error('服务器错误');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    prepare()
  }, [])

  const getExpertAuthVerifyDetail = async (id: string) => {
    try {
      const { code, result, message } = await getExpertAuthDetail(id)
      if (code === 0) {
        setExpertDetail(result)
      } else {
        throw new Error(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getEnterpriseInfoVerifyDetail = async (id: string) => {
    try {
      const { code, result, message } = await getOrgInfoAuthDetail(id)
      if (code === 0) {
        setOrgDetail(result)
      } else {
        throw new Error(message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const basicContent1 = [
    {
      label: '营业执照',
      value: businessLicenseFile ? (
        <Image className="img-photo" src={businessLicenseFile?.path} alt="营业执照" />
      ) : (
        ''
      ),
    },
    { label: '组织类型', value: orgTypeName },
    { label: '组织名称', value: orgName },
    { label: '统一社会信用代码', value: creditCode },
    { label: '成立时间', value: formedDate },
    { label: '企业规模', value: scaleText[scale] },
    { label: '联系电话', value: phone },
    { label: '注册区域', value: (provinceName || '') + (cityName || '') + (countyName || '') },
    { label: '详细地址', value: address },
    { label: '注册资本', value: registeredCapital || registeredCapital === 0 ? registeredCapital + '万元' : '--' },
    { label: '组织简介', value: aboutUs },
    { label: '组织核心能力', value: ability },
  ];

  const basicContent2 = [
    {
      label: '组织logo',
      value: coverFile ? (
        <Image className="img-photo" src={coverFile?.path} alt="组织logo" />
      ) : (
        ''
      ),
    },
    { label: '单位性质', value: businessTypeText[businessType] },
    { label: '法人姓名', value: legalName },
    { label: '总资产', value: totalAssets || totalAssets === 0 ? totalAssets + '万元' : '--' },
    { label: '上年营收', value: revenueLastYear || revenueLastYear === 0 ? revenueLastYear + '万元' : '--' },
    { label: '上年利润', value: profitLastYear || profitLastYear === 0 ? profitLastYear + '万元' : '--' },
    { label: '信用等级', value: creditRating },
    { label: '经营范围', value: businessScope },
  ];

  const basicExpertContent1 = [
    {
      label: '个人照片',
      value: personalPhotoFile ? (
        <Image className="img-photo" src={personalPhotoFile?.path} alt="个人照片" />
      ) : (
        ''
      ),
    },
    { label: '专家姓名', value: expertName },
    { label: '所属区域', value: (personProvince || '') + (personCity || '') },
    { label: '专家类型', value: typeList?.map(item => item?.name)?.join('、') || '' },
    { label: '产业方向', value: industryNameList?.join('、') || '' },
  ]

  const basicExpertContent2 = [
    { label: '联系电话', value: personPhone },
    { label: '工作单位', value: workUnit },
    { label: '职务', value: duty },
    { label: '邮箱', value: email },
  ]

  const basicExpertContent3 = [
    { label: '个人简介', value: expertIntroduction },
    { label: '工作经验', value: workExp },
    { label: '专家技能', value: expertSkill },
    { label: '项目经验', value: projectExp },
    { label: '擅长领域', value: skilledField },
  ]

  const expertInfoAuthContent = [
    { title: '专家基本信息', content: basicExpertContent1 },
    { title: '联系信息', content: basicExpertContent2 },
    { title: '专家介绍', content: basicExpertContent3 },
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
  const infoAuthContent = [
    { title: '组织基本信息', content: basicContent1 },
    { title: '其他信息', content: basicContent2 },
  ];
  return (
    <PageContainer
      loading={loading}
      footer={[
        <Button
          onClick={() => {
            history.goBack();
          }}
        >
          返回
        </Button>,
      ]}
    >

      <div className='user-content' >
        <Row>
          <Col span={6}>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{detail?.name}</span>
          </Col>
          <Col span={6}>
            <span style={{ fontWeight: 'bold' }}>注册端：</span>
            <span >{detail?.registerSource?.desc}</span>
          </Col>
          <Col span={6}></Col>
          <Col span={6}></Col>
          <Col span={6}>
            <span>{detail?.phone}</span>
          </Col>
          <Col span={6}>
            <span style={{ fontWeight: 'bold' }}>注册时间：</span>
            <span>{detail?.createTime}</span>
          </Col>
          <Col span={6}></Col>
          <Col span={6}></Col>
          <div style={{ display: 'flex', gap: 10 }}>{detail?.userIdentities?.map(p => {
            return <span style={{ color: '#F59A23', background: 'rgba(254, 246, 241, 1)', padding: '0 5px', height: 20 }}>
              {p?.desc}</span>
          })
          }</div>
        </Row>
      </div>

      <Radio.Group style={{ margin: '20px 0' }} value={contentType} onChange={(e) => setContentType(e.target.value)}>
        {detail?.orgId && <Radio.Button value={1}>组织信息</Radio.Button>}
        {detail?.expertId && <Radio.Button value={2}>专家信息</Radio.Button>}
      </Radio.Group>
      {contentType == 1 && (orgDetail?.auditState == 3 ? <div className={sc('detail-container')}>
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
      </div> : <Empty description={'当前用户暂未完成组织信息认证'} />)}
      {contentType == 2 && (expertDetail?.auditState == 3 ?
        <div className={sc('detail-container')}>
          {expertInfoAuthContent?.map((item, index) => {
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
        </div> : <Empty description={'当前用户暂未完成专家认证'} />)
      }
    </PageContainer>
  );
};
