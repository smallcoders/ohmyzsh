import {
  Button,
  message,
  Avatar,
  Space,
  Popconfirm,
  Form,
  Input,
  message as antdMessage,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { getGlobalFloatAdDetail } from '@/services/baseline';

const sc = scopedClasses('content-stream-ad-detail');

export default () => {
  const id = history.location.query?.id as string;
  const [detail, setDetail] = useState<any>({});
  useEffect(() => {
    if (id) {
      getGlobalFloatAdDetail(id).then((res) => {
        const { result, code, message: resultMsg } = res || {};
        if (code === 0) {
          console.log(result);
          setDetail(result);
        } else {
          antdMessage.error(`请求失败，原因:{${resultMsg}}`);
        }
      });
    }
  }, []);
  return (
    <PageContainer
      className={sc('container')}
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
            <div className={sc('container-body-detail-item-value')}>
              {' '}
              {detail?.advertiseName || '--'}
            </div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>站内链接配置：</div>
            <div className={sc('container-body-detail-item-value')}>{detail?.siteLink || '--'}</div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>版面：</div>
            <div className={sc('container-body-detail-item-value')}>
              {' '}
              {detail?.advertiseName || '--'}
            </div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>位置：</div>
            <div className={sc('container-body-detail-item-value')}>
              {' '}
              {detail?.displayOrder || '--'}
            </div>
          </div>
          <div className={sc('container-body-detail-item')}>
            <div className={sc('container-body-detail-item-label')}>作用范围：</div>
            <div className={sc('container-body-detail-item-value')}>
              {detail?.scope === 'ALL_USER' && <span>全部用户</span>}
              {detail?.scope === 'ALL_LOGIN_USER' && <span>全部登陆用户</span>}
              {detail?.scope === 'ALL_NOT_LOGIN_USER' && <span>全部未登录用户</span>}
              {detail?.scope === 'PORTION_USER' && <span>部分用户</span>}
              {!detail?.scope && <span>__</span>}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
