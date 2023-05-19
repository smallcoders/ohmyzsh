import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import copyIcon from '../../imgs/copy-icon.png';
import playIcon from '../../imgs/play-icon.png';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';

const sc = scopedClasses('follow-up-detail');

export default () => {
  const [soundRecords, setSoundRecords] = useState<any>([1,2,3,4,4,5,65,6])
  return (
    <PageContainer
      className={sc('container')}
    >
      <div className="content">
        <div className="top-content">
          <div className="top-left">
            <img src='https://www.lingyangplat.com/web-portal-front/8937d7de50cb73ed2ac3f0abf106412a.png' alt='' />
            <div className="top-main-info">
              <div>
                <span className="time">4月20 16:20</span>
                <span className="name">Admin</span>
              </div>
              <div className="location">定位:蚌塇高新反望江历路666号</div>
            </div>
          </div>
        </div>
        <div className="follow-up-content">
          <div className="title">跟进内容</div>
          <div className="info-list">
            <div className="info-list-item">
              <div className="label">对接人姓名</div>
              <div className="value">对接人姓名</div>
            </div>
            <div className="info-list-item">
              <div className="label">对接人手机号</div>
              <div className="value">对接人姓名</div>
            </div>
            <div className="info-list-item">
              <div className="label">对接人职务</div>
              <div className="value">对接人姓名</div>
            </div>
            <div className="info-list-item">
              <div className="label">拟购买软件名称</div>
              <div className="value">对接人姓名</div>
            </div>
            <div className="info-list-item">
              <div className="label">预计下单时间</div>
              <div className="value">对接人姓名</div>
            </div>
            <div className="info-list-item">
              <div className="label">上级汇报进度</div>
              <div className="value">对接人姓名</div>
            </div>
          </div>
          <div className="follow-up-desc">
            <div className="title">跟进描述</div>
            <div className="desc">
              跟进中的这个状态定义也要明确一下：首次 拍照打卡并提交跟进内容字段后，
              一直到订单支付提交前或申请释放商机提交前吗？拍照打卡与跟进内容须在
              一个表单里，
              与需求文档22.1.4中第3和第5条描述有冲突，跟讲中的这个状态定义也要明确一下：首次
              拍照打卡并提交跟讲内容字段后
            </div>
          </div>
          <div className="sound-record">
            <div className="title">录音文件</div>
            <div className="record-content">
              <div className="record-left">
                <div className="record-text-box">
                  <div className="record-text">
                    跟进中的这个状态定义也要明确一下：首次拍照打卡并提交跟进内容字段后．一直到订单支付提
                    不首义件技与元成
                    公可甲道松於燃机保公凸，想品：卡与派计内公价什一八去半生与黑水档 14年书
                    和第5条描述有冲突。
                    2、每次跟迸中的录音转写功能是辅助功能吧？即可选用也可不用
                    不会是为防止“假跟进”或漏信
                    录音文件2 转写中
                    录音文件3 转写失败
                    𩂈𦉫冷汁𢯎魚源切国，
                    3、多人回题：三前跟进是不限人员的，
                    、跟进了几次后，超时末跟进的．与从未跟进过目超时未跟进的一样处理吗？自动退回重新分
                  </div>
                </div>
                <div className="sound-info">
                  <div className="record-name">录音文件1</div>
                  <div className="sound-info-right">
                    <div className="record-duration">00:20:01</div>
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
                  soundRecords.length > 0 && soundRecords.map((item: any, index: number) => {
                    return (
                      <div className="sound-list-item" key={index}>
                        <div className="record-name">录音文件</div>
                        <div className="record-status">状态</div>
                        <div className="record-duration">00:20:01</div>
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
