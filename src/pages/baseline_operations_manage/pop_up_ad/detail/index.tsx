import { Button, message as antdMessage } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { getGlobalFloatAdDetail } from '@/services/baseline';
import './index.less';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import scopedClasses from '@/utils/scopedClasses';

const sc = scopedClasses('pop-up-ad-detail');
const triggerTypeObj = {
  'PAGE_START': '页面启动',
  'PAGE_CLOSE': '页面离开',
}
const scopeMap = {
  'ALL_USER': '全部用户',
  'ALL_LOGIN_USE': '全部登陆用户',
  'ALL_NOT_LOGIN_USE': '全部未登录用户',
  'ALL_LOGIN_USER': '全部登陆用户',
  'ALL_NOT_LOGIN_USER': '全部未登录用户',
}

export default () => {
  const { id } = history.location.query as { id: string | undefined };
  const [detail, setDetail] = useState<any>({})
  useEffect(() => {
    if (id){
      getGlobalFloatAdDetail(id).then((res) => {
        const { result, code, message: resultMsg } = res || {};
        if (code === 0) {
          console.log(result)
          setDetail(result)
        } else {
          antdMessage.error(`请求失败，原因:{${resultMsg}}`);
        }
      });
    }
  }, [])
  return (
    <PageContainer
      className={sc('container')}
      footer={[
        <Button onClick={() => history.push(routeName.BASELINE_OPERATIONS_MANAGEMENT_POPUP_AD)}>返回</Button>
      ]}
    >
      <div className="content">
        <div className="content-title">弹窗广告信息</div>
        <div className="item">
          <div className="label">活动名称:</div>
          <div className="value">{detail.advertiseName || '--'}</div>
        </div>
        <div className="item">
          <div className="label">图片:</div>
          <div className="value">
            {
              detail?.ossUrls ? detail?.ossUrls?.map((item: any, index: number) => {
                return (
                  <div className="img-box">
                    <img src={item} key={index} alt='' />
                  </div>
                )
              }) : '--'
            }
          </div>
        </div>
        <div className="item">
          <div className="label">站内链接配置:</div>
          <div className="value">{detail.siteLink || '--'}</div>
        </div>
        <div className="item">
          <div className="label">触发机制:</div>
          <div className="values">
            {triggerTypeObj[detail.triggerMechanism] || '--'}
            <p>{detail.triggerAddress || ''}</p>
          </div>
        </div>
        <div className="item">
          <div className="label">作用范围:</div>
          <div className="value">
            {
              detail?.scope ? detail.scope !== 'PORTION_USER' ? scopeMap[detail.scope] :
                <div>{
                  detail.labels.map((item: any, index: number) => {
                    return <span key={index}>{item.labelName}</span>
                  })
                }</div>
                : ''
            }
          </div>
        </div>
        <div className="item">
          <div className="label">开启时间段:</div>
          <div className="value">
            {
              detail.periodType === 'ALL_TIME' ? (
                <div>全部时间</div>
              ) : (
                <div>{detail.periodStartTime ? (moment(detail.periodStartTime).format('YYYY-MM-DD') + '至' + moment(detail.periodEndTime).format('YYYY-MM-DD')) : '--'}</div>
              )
            }
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
