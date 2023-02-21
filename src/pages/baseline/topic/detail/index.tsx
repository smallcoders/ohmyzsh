import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, {useEffect, useState} from "react";
import {Button, Col, message, Popconfirm, Row} from "antd";
import SelfTable from "@/components/self_table";
import type LogoutVerify from "@/types/user-config-logout-verify";
import type Common from "@/types/common";
import {deleteRelation, getHotRecommendDetail} from "@/services/topic";
import {history} from "@@/core/history";

export default () => {
  const sc = scopedClasses('baseline-topic-detail');
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 1,
    pageTotal: 0,
  });
  const [dataSource, setDataSource] = useState<any>([]);
  const [hotRecommendDetail,setHotRecommendDetail] = useState<any>({});
  const { recommendId } = history.location.query as any;
  const getHotRecommendDetailById = (pageIndex: number = 1, pageSize = pageInfo.pageSize) =>{
    getHotRecommendDetail({id:recommendId, pageIndex,
      pageSize,}).then(res=>{
      if (res.code === 0){
        setHotRecommendDetail(res?.result || {})
        setDataSource(res?.result.list)
        setPageInfo(
          {
            pageIndex: res?.result.pageIndex,
            pageSize: res?.result.pageSize,
            totalCount: res?.result.contentCount,
            pageTotal: 0,
          }
        )
      }
    })
  }
  useEffect(() => {
    getHotRecommendDetailById();
  }, []);
  const remove = async (id: number) => {
    try {
      const removeRes = await deleteRelation(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getHotRecommendDetailById();
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: LogoutVerify.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '阅读量（总阅读量）',
      dataIndex: 'totalReadingCount',
      width: 200,
    },
    {
      title: '转发量（总转发量）',
      dataIndex: 'totalForwardCount',
      width: 200,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <div className={sc('container-option')}>
            <Button type="link" onClick={() => {
              window.open(`/baseline/baseline-topic-manage/detail?type=2`)
            }}>
              详情
            </Button>
            {/*<Popconfirm*/}
            {/*  title="确定删除么？"*/}
            {/*  okText="确定"*/}
            {/*  cancelText="取消"*/}
            {/*  onConfirm={() => remove(record?.articleId as number)}*/}
            {/*>*/}
            {/*  <Button type="link" >*/}
            {/*    删除*/}
            {/*  </Button>*/}
            {/*</Popconfirm>*/}
          </div>
        )
      },
    },
  ];


  return (
    <PageContainer className={sc('container')}>
      <div className='topic-detail'>
        <Row className={'title'}>
          <Col span={4}>
            <div className='info-label'>话题：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.topic}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className='info-label'>权重：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.weight}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className='info-label'>关联内容数：</div>
          </Col>
          <Col span={16}>
            <span>{hotRecommendDetail?.contentCount}</span>
          </Col>
        </Row>
        <Row className={'title'}>
          <Col span={4}>
            <div className='info-label'>关联内容：</div>
          </Col>
          <Col span={20}>
            <SelfTable
              bordered
              // scroll={{ x: 1480 }}
              columns={columns}
              dataSource={dataSource}
              pagination={
                pageInfo.totalCount === 0
                  ? false
                  : {
                    onChange:getHotRecommendDetailById,
                    total: pageInfo.totalCount,
                    current: pageInfo.pageIndex,
                    pageSize: pageInfo.pageSize,
                    showTotal: (total: number) =>
                      `共${total}条记录 第${pageInfo.pageIndex}/${Math.ceil(pageInfo.totalCount / pageInfo.pageSize) || 1}页`,
                  }
              }
            />
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};
