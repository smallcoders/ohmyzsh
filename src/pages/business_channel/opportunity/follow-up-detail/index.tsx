import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import copyIcon from '../../imgs/copy-icon.png';
import playIcon from '../../imgs/play-icon.png';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { history } from '@@/core/history';
import {
  getAccessDetail,
  getAccessList
} from '@/services/business-channel';
import { message as antdMessage } from 'antd';

const sc = scopedClasses('follow-up-detail');

export default () => {
  const { chanceId,  accessId} = history.location.query as { chanceId: string | undefined, accessId: string | undefined  };
  const [detail, setDetail] = useState<any>({})
  const [list, setList] = useState<any>([])
  const [index, setIndex] = useState<number>(-1)
  const [soundRecords, setSoundRecords] = useState<any>([])
  const [recordIndex, setRecordIndex] = useState<number>(0)
  useEffect(() => {
    if (chanceId){
      getAccessList({chanceId}).then((res) => {
        const { result, code, message: resultMsg } = res || {};
        if (code === 0) {
          setList(result || [])
          const findIndex = result?.findIndex((item: any) => {
            return item.id === accessId
          }) || -1
          setIndex(findIndex)
        } else {
          antdMessage.error(`请求失败，原因:{${resultMsg}}`);
        }
      });
    }
    if (accessId){
      getAccessDetail({accessId}).then((res) => {
        const { result, code, message: resultMsg } = res || {};
        if (code === 0) {
          setDetail(result || {})
          setSoundRecords(result?.list || [])
        } else {
          antdMessage.error(`请求失败，原因:{${resultMsg}}`);
        }
      });
    }
  }, [])
  return (
    <PageContainer
      className={sc('container')}
    >
      <div className="content">
        <div className="top-content">
          <div className="top-left">
            <img src={detail?.accessImage} alt='' />
            <div className="top-main-info">
              <div>
                <span className="time">4月20 16:20</span>
                <span className="name">Admin</span>
              </div>
              <div className="location">定位:蚌塇高新反望江历路666号</div>
            </div>
          </div>
          {
            list.length > 1 &&
            <div className="top-right">
              <div
                className={index === 0 ? "pre-page disabled" : 'pre-page'}
                onClick={() => {
                  if (index > 0) {
                    getAccessDetail({accessId: list[index - 1]}).then((res) => {
                      const { result, code, message: resultMsg } = res || {};
                      if (code === 0) {
                        setDetail(result || {})
                        setSoundRecords(result?.list || [])
                        setIndex((pre) => {
                          return pre - 1
                        })
                        setRecordIndex(0)
                      } else {
                        antdMessage.error(`请求失败，原因:{${resultMsg}}`);
                      }
                    });
                  }
                }}
              >
                <div>
                  上一条记录
                  <span className="time">4月20 16:20</span>
                </div>
              </div>
              <div
                className={index === list.length - 1 ? "next-page disabled" : 'next-page'}
                onClick={() => {
                  if (index < list.length - 1) {
                    getAccessDetail({accessId: list[index - 1]}).then((res) => {
                      const { result, code, message: resultMsg } = res || {};
                      if (code === 0) {
                        setDetail(result || {})
                        setSoundRecords(result?.list || [])
                        setIndex((pre) => {
                          return pre + 1
                        })
                        setRecordIndex(0)
                      } else {
                        antdMessage.error(`请求失败，原因:{${resultMsg}}`);
                      }
                    });
                  }
                }}
              >
                <div>
                  下一条记录
                  <span className="time">4月20 16:20</span>
                </div>
              </div>
            </div>
          }
        </div>
        <div className="follow-up-content">
          <div className="title">跟进内容</div>
          <div className="info-list">
            <div className="info-list-item">
              <div className="label">对接人姓名</div>
              <div className="value">{detail.dockingName || '--'}</div>
            </div>
            <div className="info-list-item">
              <div className="label">对接人手机号</div>
              <div className="value">{detail.dockingPhone || '--'}</div>
            </div>
            <div className="info-list-item">
              <div className="label">对接人职务</div>
              <div className="value">{detail.dockingPosition || '--'}</div>
            </div>
            <div className="info-list-item">
              <div className="label">拟购买软件名称</div>
              <div className="value">{detail.appName || '--'}</div>
            </div>
            <div className="info-list-item">
              <div className="label">预计下单时间</div>
              <div className="value">{detail.orderTime || '--'}</div>
            </div>
            <div className="info-list-item">
              <div className="label">上级汇报进度</div>
              <div className="value">{detail.superiorReportProcess || '--'}</div>
            </div>
          </div>
          <div className="follow-up-desc">
            <div className="title">跟进描述</div>
            <div className="desc">
              {
                detail.accessDesc || '--'
              }
            </div>
          </div>
          <div className="sound-record">
            <div className="title">录音文件</div>
            <div className="record-content">
              <div className="record-left">
                <div className="record-text-box">
                  <div className="record-text">
                    {
                      soundRecords[recordIndex]?.videoText || '--'
                    }
                  </div>
                </div>
                <div className="sound-info">
                  <div className="record-name">录音文件{recordIndex + 1}</div>
                  <div className="sound-info-right">
                    <div className="record-duration">{soundRecords[recordIndex]?.videoTimeLength}</div>
                    <img src={playIcon} className="play-icon" alt='' />
                    <div className="copy-area">
                      <img src={copyIcon} className="copy-icon" alt='' />
                      <span className="copy-text">复制内容</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="record-right">
                {
                  soundRecords.length > 0 && soundRecords.map((item: any, id: number) => {
                    return (
                      <div
                        onClick={() => {
                          setRecordIndex(index)
                        }}
                        className={recordIndex === index ? "sound-list-item active" : "sound-list-item"}
                        key={id}
                      >
                        <div className="record-name">录音文件</div>
                        <div className="record-status">{{0: '未转写', 1: '转写成功'}[item.transState]}</div>
                        <div className="record-duration">{item.videoTimeLength}</div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
