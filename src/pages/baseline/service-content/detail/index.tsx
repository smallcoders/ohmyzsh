import React, { useState, useEffect } from 'react';
import { Button, Affix, Breadcrumb, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { Link, history } from 'umi';
import PhoneHeader from '@/assets/service/phone-header.png';
import './index.less';
import {
  httpServiceAccountArticleDetail,
  httpServiceAccountArticleLogList,
} from '@/services/service-management';
import {routeName} from '../../../../../config/routes'
import SelfTable from '@/components/self_table';
const sc = scopedClasses('service-content-manage-detail');

interface dataDetailType {
  id?: number;
  type?: string;
  title?: string;
  authorName?: string;
  coverId?: string;
  coverUrl?: string;
  content?: string;
  publishTime?: string;
}
export default () => {
  const { id } = history.location.query as { id: string | undefined };
  const [dataDetail, setDataDetail] = useState<dataDetailType[]>();
  const prepare = async (id?: string) => {
    if (!id) return;
    try {
      const res = await httpServiceAccountArticleDetail(id);
      if (res?.code === 0) {
        console.log('获取的详情', res?.result);
        const detail = res?.result;
        setDataDetail(detail);
        const infoList = [
          {
            label: '发布方式：',
            value: detail?.realTimePublishing ? '实时发布' : '预约发布',
          },
          {
            label: '发布服务号：',
            value: detail?.serviceAccountName,
          },
          {
            label: '发布时间：',
            value: detail?.publishTime,
          },
          {
            label: '是否同步到产业圈：',
            value: detail?.syncIndustrial ? '是' : '否',
          },
        ];
        setiInfoData(infoList);
        if (detail?.type === 'PICTURE_TEXT') {
          const container = document.querySelector('#rich-text-container');
          container.innerHTML = detail?.content;
        }
      } else {
        message.error(`获取详情失败: ${res.error}`);
      }
    } catch (error) {
      message.error(`获取详情失败: ${error}`);
    }
  };

  const _httpServiceAccountArticleLogList = async () => {
    if (!id) return;
    try {
      const res = await httpServiceAccountArticleLogList(id);
      if (res?.code === 0) {
        console.log('操作日志', res?.result);
        const arr = res?.result?.map((item: any) => {
          return {
            img: '图片',
            name: item.name,
            typeName: item.content,
            time: item.createTime,
          };
        });
        // console.log('处理之后', arr)
        setLogData(arr);
      } else {
        throw new Error('');
      }
    } catch (error) {
      message.error(`获取操作日志失败: ${error}`);
    }
  };
  useEffect(() => {
    console.log('详情id', id);
    prepare(id);
    _httpServiceAccountArticleLogList();
  }, []);
  // 发布信息
  const [infoData, setiInfoData] = useState([
    {
      label: '发布方式：',
      value: '--',
    },
    {
      label: '发布服务号：',
      value: '--',
    },
    {
      label: '发布时间：',
      value: '--',
    },
    {
      label: '是否同步到产业圈：',
      value: '--',
    },
  ]);

  // 操作日志
  const [logData, setLogData] = useState([]);

  const onBack = () => {
    history.push(`${routeName.BASELINE_SERVICE_CONTENT_MANAGE}`);
  };

  const [showControls, setShowControls] = useState<boolean>(false);

  const handleTitle = (value: any) => {
    if (!value?.address.startsWith('/')) {
      window.open(value?.address)
    } else if (value?.address.startsWith('/')) {
      window.open('http://' + window.location.hostname + '/antelope-baseline' + value?.address)
    }
  }

  // table
  const columns = [
    {
      title: '链接标题',
      dataIndex: 'title',
      align: 'center',
      width: 200,
      render: (version: string, record: any) => {
        return (
          <span style={{cursor: 'pointer', color: '#6680FF'}} onClick={handleTitle.bind(null, record)}>{version || '--'}</span>
        )
      },
    },
    {
      title: '链接简介',
      dataIndex: 'introduction',
      align: 'center',
      render: (content: string) => {
        return (
          <div className={sc('container-table-content')}>{content || '--'}</div>
        )
      },
    },
  ];
  
  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: '详情',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline/baseline-service-content-manage">服务号内容管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>详情</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
    >
      <div className={sc('container-top')}>
        <div className={sc('container-top-content')}>
          <img className={sc('container-top-content-header')} src={PhoneHeader} />
          {
            // 图文， 图片 ， 视频 音频
            ['PICTURE_TEXT', 'PICTURE', 'VIDEO', 'AUDIO'].includes(dataDetail?.type) && (
              <div className={sc('container-top-content-title')}>{dataDetail?.title || '标题'}</div>
            )
          }
          <div className={sc('container-top-content-label')}>
            <div className={sc('container-top-content-label-name')}>
              {dataDetail?.serviceAccountName || '羚羊**小助手'}
            </div>
            <div className={sc('container-top-content-label-time')}>
              {dataDetail?.publishTime || '--'}
            </div>
          </div>
          <div className={sc('container-top-content-cover')}>
            <img className={sc('container-top-content-cover-img')} src={dataDetail?.coverUrl} />
          </div>
          {
            // 图文是富文本
            ['PICTURE_TEXT'].includes(dataDetail?.type) && (
              <div className={sc('container-top-content-text')}>
                <div id="rich-text-container"></div>
              </div>
            )
          }
          {
            // 非图文正常展示
            !['PICTURE_TEXT'].includes(dataDetail?.type) && (
              <div className={sc('container-top-content-text')}>{dataDetail?.content || '------'}</div>
            )
          }
          {
            // 视频
            ['VIDEO'].includes(dataDetail?.type) && (
              <div className={sc('container-top-content-video')}>
                <video
                  src={dataDetail?.attachmentList[0].path}
                  preload="true"
                  width="100%"
                  height="100%"
                  muted
                  loop={false}
                  controls={showControls}
                  onMouseEnter={() => {
                    setShowControls(true);
                  }}
                  onMouseLeave={() => {
                    setShowControls(false);
                  }}
                  // 隐藏下载按钮
                  controlsList="nodownload"
                  // 此属性在android设备播放视频时,导致自动全屏播放
                  // x5-video-player-type="h5-page"
                  /**
                   * ios系统
                   * 内联播放
                   */
                  playsInline
                  /* eslint-disable-next-line react/no-unknown-property */
                  webkit-playsinline="true"
                  /**
                   * 同层h5播放器
                   * 网页内部同层播放
                   * 视频上方显示html元素
                   *  */
                  /* eslint-disable-next-line react/no-unknown-property */
                  x5-playsinline="true"
                ></video>
              </div>
            )
          }
          {
            // 音频
            ['AUDIO'].includes(dataDetail?.type) && (
              <div className={sc('container-top-content-video')}>
                <audio controls={true} src={dataDetail?.attachmentList[0].path} />
              </div>
            )
          }
        </div>
        {/* 链接 和 合集标签 */}
        {
          dataDetail?.collectionList?.length > 0 &&
          <div className={sc('container-top-collection')}>
            <div className={sc('container-top-collection-title')}>归属合集</div>
            <div className={sc('container-top-collection-content')}>
              {dataDetail?.collectionList?.length > 0
              ? dataDetail?.collectionList?.map((item: any) => {
                return (
                  <div key={item.id} className={sc('container-top-collection-content-item')}>
                    {'#' + item.name}
                  </div>
                );
              })
              : ''
            }
            </div>
          </div>
        }
        {
          dataDetail?.links?.length > 0 &&
          <div className={sc('container-top-link')}>
            <div className={sc('container-top-link-title')}>链接</div>
            <div className={sc('container-top-link-content')}>
            <SelfTable
              rowKey="id"
              bordered
              columns={columns}
              dataSource={dataDetail?.links}
              pagination={
                false
              }
            />
            </div>
          </div>
        }
      </div>
      <div className={sc('container-center')}>
        <div className={sc('container-center-title')}>发布信息</div>
        <div className={sc('container-center-content')}>
          {infoData?.map((item: any) => {
            return (
              <div className={sc('container-center-content-item')} key={item.label}>
                <div className={sc('container-center-content-item-left')}>{item.label}</div>
                <div className={sc('container-center-content-item-right')}>{item.value}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={sc('container-bottom')}>
        <div className={sc('container-bottom-title')}>操作日志</div>
        <div className={sc('container-bottom-content')}>
          {logData?.map((item: any, index: any) => {
            return (
              <React.Fragment key={index}>
                <div className={sc('container-bottom-content-item')}>
                  {/* <img className={sc('container-bottom-content-item-img')} src="" alt="" /> */}
                  <div className={sc('container-bottom-content-item-name')}>{item.name}</div>
                  <div className={sc('container-bottom-content-item-type')}>{item.typeName}</div>
                  <div className={sc('container-bottom-content-item-time')}>{item.time}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <Affix offsetBottom={0}>
        <div className={sc('container-back')}>
          <Button onClick={onBack}>返回</Button>
        </div>
      </Affix>
    </PageContainer>
  );
};
