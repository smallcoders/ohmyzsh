import React, { useState,useEffect } from 'react';
import { Button, Affix, Breadcrumb, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { Link, history} from 'umi';
import './index.less';
import {
  httpServiceAccountArticleDetail,
  httpServiceAccountArticleLogList
} from '@/services/service-management'
const sc = scopedClasses('service-number-management-detail');


interface dataDetailType {
  id?: number
  type?: string
  title?: string
  authorName?: string
  coverId?: string
  coverUrl?: string
  content?: string
  publishTime?: string
}
export default () => {
  const { id } = history.location.query as { id: string | undefined };
const [dataDetail, setDataDetail] = useState<dataDetailType[]>()
  const prepare = async (id?: string) => {
    if (!id) return
    try {
      const res = await httpServiceAccountArticleDetail(id)
      if (res?.code === 0) {
        console.log('获取的详情', res?.result)
        const detail = res?.result
        setDataDetail(detail)
        const infoList = [
          {
            label: '发布方式：',
            value: detail?.realTimePublishing ? '实时发布' : '预约发布'
          },
          {
            label: '发布服务号：',
            value: detail?.id
          },
          {
            label: '发布时间：',
            value: detail?.publishTime
          },
          {
            label: '是否同步到产业圈：',
            value: detail?.syncIndustrial ? '是' : '否'
          },
        ]
        setiInfoData(infoList)

      } else {
        message.error(`获取详情失败: ${res.error}`)
      }
    } catch (error) {
      message.error(`获取详情失败: ${error}`)
    }
  }

  const _httpServiceAccountArticleLogList = async () => {
    if (!id) return
    try {
      const res = await httpServiceAccountArticleLogList(id)
      if (res?.code === 0) {
        console.log('操作日志', res?.result)
        const arr = res?.result?.map((item: any) => {
          return {
            img: '图片',
            name: item.name,
            typeName: item.content,
            time: item.createTime
          }
        })
        console.log('处理之后', arr)
        setLogData(arr)
      } else {
        throw new Error("")
      }
    } catch (error) {
      message.error(`获取操作日志失败: ${error}`)
    }
  }
  useEffect(() => {
    console.log('详情id', id)
    prepare(id)
    _httpServiceAccountArticleLogList()
  },[])
  // 发布信息
  const [infoData, setiInfoData] = useState([
    {
      label: '发布方式：',
      value: '--'
    },
    {
      label: '发布服务号：',
      value: '--'
    },
    {
      label: '发布时间：',
      value: '--'
    },
    {
      label: '是否同步到产业圈：',
      value: '--'
    },
  ])

  // 操作日志
  const [logData, setLogData] = useState([])

  const onBack = () => {
    history.goBack();
// history.push(`${routeName.BASELINE_SERVICE_NUMBER_MANAGEMENT_DETAIL}?id=${id}`)
  };

  // 修改之后
  const [dataSource, SetDataSource] = useState<any[]>()
  useEffect(() => {
    if (!dataDetail) return
    const {  title, authorName, content,  coverId, coverUrl, attachmentIds, publishTime } = dataDetail
    const arr = [
      {
        label: '标题：',
        value: title || '--'
      },
      {
        label: '作者：',
        value: authorName || '--'
      },
      {
        label: '封面图：',
        value: coverUrl && <img className={sc('container-top-item-right-img')} src={coverUrl} /> || '--'
      },
      {
        label: '内容：',
        value: content || '--'
      },
      {
        label: '发布时间：',
        value: publishTime || '--'
      }
    ]
    SetDataSource(arr)
  },[dataDetail])

  return (
    <PageContainer 
      className={sc('container')}
      header={{
        title: '详情',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline/baseline-service-number">服务号管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>详情</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
    >
      <div className={sc('container-top')}>
        {
          dataSource && dataSource?.map((item: any) => {
            return (
              <div className={sc('container-top-item')}>
                <div className={sc('container-top-item-left')}>
                  {item.label}
                </div>
                <div className={sc('container-top-item-right')}>
                  {item.value}
                </div>
              </div>
            )
          })
        }
      </div>
      <div className={sc('container-center')}>
        <div className={sc('container-center-title')}>
          发布信息
        </div>
        <div className={sc('container-center-content')}>
          {
            infoData?.map((item: any) => {
              return (
                <div className={sc('container-center-content-item')} key={item.label}>
                  <div className={sc('container-center-content-item-left')}>
                    {item.label}
                  </div>
                  <div className={sc('container-center-content-item-right')}>
                    {item.value}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className={sc('container-bottom')}>
        <div className={sc('container-bottom-title')}>
          操作日志
        </div>
        <div className={sc('container-bottom-content')}>
          {
            logData?.map((item: any, index: any) => {
              return (
                <React.Fragment key={index}>
                  <div className={sc('container-bottom-content-item')}>
                    {/* <img className={sc('container-bottom-content-item-img')} src="" alt="" /> */}
                    <div className={sc('container-bottom-content-item-name')}>
                      {item.name}
                    </div>
                    <div className={sc('container-bottom-content-item-type')}>
                      {item.typeName}
                    </div>
                    <div className={sc('container-bottom-content-item-time')}>
                      {item.time}
                    </div>
                  </div>
                </React.Fragment>
              )
            })
          }
        </div>
      </div>
      <Affix offsetBottom={0}>
        <div className={sc('container-back')}>
          <Button onClick={onBack}>
            返回
          </Button>
        </div>
      </Affix>
    </PageContainer>
  )
}