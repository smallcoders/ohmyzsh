import {PageContainer} from "@ant-design/pro-layout";

import './index.less';
import scopedClasses from "@/utils/scopedClasses";
import ProCard from "@ant-design/pro-card";
import {Button} from "antd";
import {history} from "@@/core/history";

const sc = scopedClasses('column-manage-detail');
export default () => {
  return(
    <PageContainer className={sc('container')}>
      <div className="detail" >
        <div className="detail-item">
          <div className="detail-item-label">专栏名称：</div>
          <div className="detail-item-word">专栏名称专栏名称专栏名称</div>
        </div>
        <div className="detail-item">
          <div className="detail-item-label">专栏介绍：</div>
          <div className="detail-item-word">专栏介绍专栏介绍内容专栏介专栏介绍内容专栏介专栏介绍内容专栏介专栏介绍内容专栏介专栏介绍内容专栏介内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容</div>
        </div>
        <div className="detail-item">
          <div className="detail-item-label">上传图片：</div>
          <div className="detail-item-pics">
            <img className="detail-item-pics-item" src={'@/assets/system/icon-img.png'}></img>
            <div className="detail-item-pics-word">Web端图片</div>
            <img className="detail-item-pics-item" src={'@/assets/system/icon-img.png'}></img>
            <div className="detail-item-pics-word">App端图片</div>
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-item-label">链接地址：</div>
          <div className="detail-item-link">
            <div className="detail-item-link-item">
              Web端：<span className="detail-item-link-item-word">https://antelopetest.iflysec.com/antelope-other/ </span>
            </div>
            <div className="detail-item-link-item">
             App端：<span className="detail-item-link-item-word"> https://antelopetest.iflysec.com/antelope-other/</span>
            </div>
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-item-label">备注：</div>
          <div className="detail-item-word">专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容</div>
        </div>
        <div className="detail-item">
          <div className="detail-item-label">发布人：</div>
          <div className="detail-item-word">专栏介绍内容专栏</div>
        </div>
        <div className="detail-item">
          <div className="detail-item-label">发布时间：</div>
          <div className="detail-item-word">专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容专栏介绍内容</div>
        </div>
      </div>
      <ProCard layout="center">
        <Button style={{marginRight:'40px'}} onClick={() => history.goBack()}>返回</Button>
        <Button type={"primary"} onClick={() => history.goBack()}>发布</Button>
      </ProCard>
    </PageContainer>
  )
}
