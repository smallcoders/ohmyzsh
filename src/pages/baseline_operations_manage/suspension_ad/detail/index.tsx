import { Button, message as antdMessage } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { getGlobalFloatAdDetail } from '@/services/baseline';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';

const sc = scopedClasses('suspension-ad-detail');

// todo user or use
const scopeMap = {
  'ALL_USER': '全部用户',
  'ALL_LOGIN_USE': '全部登陆用户',
  'ALL_NOT_LOGIN_USE': '全部未登录用户'
}

export default () => {
  const { id } = history.location.query as { id: string | undefined };
  const [detail, setDetail] = useState<any>({})
  useEffect(() => {
    if (id){
      getGlobalFloatAdDetail({ id }).then((res) => {
        const { result, code, message: resultMsg } = res || {};
        if (code === 0) {
          console.log(result)
          setDetail(result)
        } else {
          antdMessage.error(`请求失败，原因:{${resultMsg}}`);
        }
      });
    }
  })
  return (
    <PageContainer
      className={sc('container')}
      footer={[
        <Button size="large" onClick={() => history.goBack()}>
          返回
        </Button>,
      ]}
    >
      <div className="content">
        <div className="content-title">全局悬浮窗广告详情</div>
        <div className="item">
          <div className="label">活动名称:</div>
          <div className="value">{detail.advertiseName || '--'}</div>
        </div>
        <div className="item">
          <div className="label">图片:</div>
          <div className="value">
            {
              // todo 图片取值问题
              detail?.imgs?.map((item: any, index: number) => {
                return (
                  <div className="img-box">
                    <img src={item} key={index} alt='' />
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="item">
          <div className="label">站内链接配置:</div>
          <div className="value">{detail.siteLink || '--'}</div>
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
      </div>
    </PageContainer>
  )
}
