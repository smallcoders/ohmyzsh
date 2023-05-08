import { Button, Tag, message as antdMessage } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { getGlobalFloatAdDetail } from '@/services/baseline';

const sc = scopedClasses('content-stream-ad-detail');

export default () => {
  const id = history.location.query?.id as string;
  const [detail, setDetail] = useState<any>({});
  const [loading, setLoading] = useState<any>(false);
  const scopeMap = {
    ALL_USER: '全部用户',
    ALL_LOGIN_USE: '全部登陆用户',
    ALL_NOT_LOGIN_USE: '全部未登录用户',
    ALL_LOGIN_USER: '全部登陆用户',
    ALL_NOT_LOGIN_USER: '全部未登录用户',
    PORTION_USER: '部分用户',
  };
  useEffect(() => {
    if (id) {
      setLoading(true);
      getGlobalFloatAdDetail(id)
        .then((res) => {
          const { result, code, message: resultMsg } = res || {};
          if (code === 0) {
            console.log(result);
            setDetail(result);
          } else {
            antdMessage.error(`请求失败，原因:{${resultMsg}}`);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <PageContainer
      className={sc('container')}
      loading={loading}
      ghost
      footer={[
        <Button size="large" onClick={() => history.goBack()}>
          返回
        </Button>,
      ]}
    >
      <div className={sc('container-body')}>
        <p className={sc('container-body-title')}>弹窗广告信息</p>
        <div className={sc('container-body-detail')}>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>标题：</div>
            <div className={sc('container-body-detail-item-value')}>
              {detail?.advertiseName || '--'}
            </div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>图片：</div>
            <div>
              <div style={{ display: 'flex' }}>
                {detail?.imgRelations?.length
                  ? detail?.imgRelations?.map((item: any, index: number) => {
                      return (
                        <div style={{ width: '150px', height: '150px' }} className="img-box">
                          <img
                            style={{ width: '150px', height: '150px' }}
                            src={item.ossUrl}
                            key={index}
                            alt=""
                          />
                        </div>
                      );
                    })
                  : '--'}
              </div>
            </div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>站内链接配置：</div>
            <div className={sc('container-body-detail-item-value')}>{detail?.siteLink || '--'}</div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>版面：</div>
            <div className={sc('container-body-detail-item-value')}>
              <div style={{ display: 'flex' }}>
                {detail?.articleTypes?.length
                  ? detail?.articleTypes?.map((item: any) => {
                      return <Tag color="#0068ff">{item.typeName}</Tag>;
                    })
                  : '--'}
              </div>
            </div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>位置：</div>
            <div className={sc('container-body-detail-item-value')}>
              {detail?.displayOrder || '--'}
            </div>
          </div>
          {detail?.scope === 'PORTION_USER' && (
            <div className={sc('container-body-detail-item')}>
              <div className={sc('container-body-detail-item-label')}>作用范围：</div>
              <div className={sc('container-body-detail-item-value')}>
                <div className="scopeTag">
                  {detail.labels.length
                    ? detail.labels?.map((item: any) => {
                        return <Tag color="#0068ff">{item.labelName}</Tag>;
                      })
                    : '--'}
                </div>
              </div>
            </div>
          )}
          {detail?.scope !== 'PORTION_USER' && (
            <div className={sc('container-body-detail-item')}>
              <div className={sc('container-body-detail-item-label')}>作用范围：</div>
              <div className={sc('container-body-detail-item-value')}>
                <span>{scopeMap[detail.scope] || '--'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
