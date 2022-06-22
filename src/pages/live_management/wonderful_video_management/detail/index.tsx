import { message, Image, Tooltip, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getDetail } from '@/services/search-record';
import { getEnumByName } from '@/services/common';
import VerifyInfoDetail from '@/components/verify_info_detail/verify-info-detail';

const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<any>({});
  const [enums, setEnums] = useState<any>({});

  const getDictionary = async () => {
    try {
      const enumsRes = await Promise.all([
        getEnumByName('CREATIVE_ACHIEVEMENT_CATEGORY_ENUM'), // 成果类别
        getEnumByName('CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM'), // 属性
        getEnumByName('CREATIVE_MATURITY_ENUM'), // 成熟度
        getEnumByName('CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM'), // 技术领域
        getEnumByName('TRANSFER_TYPE_ENUM'), // 技术转换
      ]);
      setEnums({
        CREATIVE_ACHIEVEMENT_CATEGORY_ENUM: enumsRes[0].result,
        CREATIVE_ACHIEVEMENT_ATTRIBUTE_ENUM: enumsRes[1].result,
        CREATIVE_MATURITY_ENUM: enumsRes[2].result,
        CREATIVE_ACHIEVEMENT_TECHNICAL_FIELD_ENUM: enumsRes[3].result,
        TRANSFER_TYPE_ENUM: enumsRes[4].result,
      });
    } catch (error) {
      message.error('服务器错误');
    }
  };

  const prepare = async () => {
    const id = history.location.query?.id as string;

    if (id) {
      try {
        const res = await getDetail(id);
        getDictionary();
        if (res.code === 0) {
          console.log(res);
          setDetail(res.result);
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        message.error('服务器错误');
      } finally {
        setLoading(false);
      }
    }
  };

  const getEnum = (enumType: string, enumName: string) => {
    try {
      return enums[enumType]?.filter((p: any) => p.enumName === enumName)[0].name;
    } catch (error) {
      return '--';
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  return (
    <PageContainer loading={loading}>
      <div className={sc('container')}>
        <div className={sc('container-desc')}>
          <span>视频名称：</span>
          <span>{detail?.title || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>状态：</span>
          <span>
            <Tag>{detail?.lineStatus? '线上' : '线下'}</Tag> 
            <Tag>{detail?.isTop? '置顶' : '未置顶'}</Tag>
          </span>
        </div>
        <div className={'video-image'}>
          <span>视频：</span>
          <div>
            <Image.PreviewGroup>
              {detail?.videoPath &&
                (
                  // <Image height={200} width={300} src={detail?.videoPath} />
                  <video controls="controls" height={200} src={detail?.videoPath}></video>
                )
              }
            </Image.PreviewGroup>
          </div>
          <span>封面：</span>
          <div>
            <Image.PreviewGroup>
              {detail?.coverImagePath &&
                (
                  <Image height={200} width={300} src={detail?.coverImagePath} />
                )
              }
            </Image.PreviewGroup>
          </div>
        </div>
        <div className={sc('container-desc')}>
          <span>类型：</span>
          <span>{detail?.typeNames || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>内容概况：</span>
          <span>{detail?.content || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>点击量：</span>
          <span>{detail?.clickCount}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>
            分享量
            <Tooltip placement="top" title="分享量=用户实际埋点数据+虚拟数据。括号中为虚拟数据">
              <QuestionCircleOutlined />
            </Tooltip>：
          </span>
          <span>{detail?.shareCount}（{detail?.shareVirtualCount}）</span>
        </div>
        <div className={sc('container-desc')}>
          <span>
            点赞量
            <Tooltip placement="top" title="点赞量=用户实际埋点s数据+虚拟数据。括号中为虚拟数据">
              <QuestionCircleOutlined />
            </Tooltip>：</span>
          <span>{detail?.goodCount}（{detail?.goodVirtualCount}）</span>
        </div>
        <div className={sc('container-desc')}>
          <span>上次上架人：</span>
          <span>{detail?.lineAccountName || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>上次上架时间：</span>
          <span>{detail?.lineTime || '--'}</span>
        </div>
        <div className={sc('container-desc')}>
          <span>创建人：</span>
          <span>
            {detail?.releaseAccountName || '--'}
          </span>
        </div>
        <div className={sc('container-desc')}>
          <span>创建时间：</span>
          <span>
            {detail?.createTime || '--'}
          </span>
        </div>
      </div>
    </PageContainer>
  );
};
