import {PageContainer} from "@ant-design/pro-layout";

import './index.less';
import scopedClasses from "@/utils/scopedClasses";
import ProCard from "@ant-design/pro-card";
import {Button} from "antd";
import {history} from "@@/core/history";
import {getColumnDetailById} from "@/services/column-manage";
import {useEffect, useState} from "react";

const sc = scopedClasses('column-manage-detail');
export default () => {
  const creativeColumnId = history.location.query?.id as string;
  const [columnDetail,setColumnDetail]=useState<any>('');
  const getColumnDetail = async () =>{
    try {
      const res = await getColumnDetailById(creativeColumnId)
      if(res.code==0){
        console.log(res)
        setColumnDetail(res?.result)
      }
    }catch (e){
      console.log(e)
    }
  }
  useEffect(() => {
    getColumnDetail()
  }, []);
  return(
    <PageContainer className={sc('container')}>
      <div className="detail" >
        <div className="detail-item">
          <div className="detail-item-label">专栏名称：</div>
          <div className="detail-item-word">{columnDetail?.name}</div>
        </div>
        <div className="detail-item">
          <div className="detail-item-label">专栏介绍：</div>
          <div className="detail-item-word">{columnDetail?.content}</div>
        </div>
        <div className="detail-item">
          <div className="detail-item-label">上传图片：</div>
          <div className="detail-item-pics">
            <img className="detail-item-pics-item" src={columnDetail?.webPhotoUrl}></img>
            <div className="detail-item-pics-word">Web端图片</div>
            { columnDetail?.appPhotoUrl &&  <img className="detail-item-pics-item" src={columnDetail?.appPhotoUrl}></img>}
            { columnDetail?.appPhotoUrl &&  <div className="detail-item-pics-word">App端图片</div>}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-item-label">链接地址：</div>
          <div className="detail-item-link">
            <div className="detail-item-link-item">
              Web端：<span className="detail-item-link-item-word">{columnDetail?.webLink}</span>
            </div>
            { columnDetail?.appLink && <div className="detail-item-link-item">
             App端：<span className="detail-item-link-item-word">{columnDetail?.appLink}</span>
            </div>}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-item-label">备注：</div>
          <div className="detail-item-word">{columnDetail?.remark || '-'}</div>
        </div>
        { columnDetail?.publisherName&&<>
        <div className="detail-item">
          <div className="detail-item-label">发布人：</div>
          <div className="detail-item-word">{columnDetail?.publisherName || '-'}</div>
        </div>
        <div className="detail-item">
          <div className="detail-item-label">发布时间：</div>
          <div className="detail-item-word">{columnDetail?.publishTime || '-'}</div>
        </div></>}
      </div>
      <ProCard layout="center">
        <Button style={{marginRight:'40px'}} onClick={() => history.goBack()}>返回</Button>
        {/*<Button type={"primary"} onClick={() => history.goBack()}>发布</Button>*/}
      </ProCard>
    </PageContainer>
  )
}
