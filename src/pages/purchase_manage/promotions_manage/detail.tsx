import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table, message, Breadcrumb, Image, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import SelfTable from '@/components/self_table';
import {
  getActivityDetail, // 活动详情
} from '@/services/purchase';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Link, history } from 'umi';
import './detail.less';

const { Column } = Table;

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  isEllipsis: boolean
}

export default () => {
  const [editingItem, setEditingItem] = useState<any>({});

  const prepare = async () => {
    try {
      const { id } = history.location.query as { id: string | undefined };
      if (id) {
        // 获取详情 塞入表单
        const detailRs = await getActivityDetail(id);
        let editItem = { ...detailRs.result };
        console.log(editItem, 'editItem');
        if (detailRs.code === 0) {
          let actImgs:any = [];
          // 已选商品数据回显
          if(editItem.product) {
            setChoosedProducts(editItem.product);
          }
          // if(editItem.otherPic) {
          //   editItem.otherPic.map((i: any) => {
          //     actImgs.push(
          //       {
          //         uid: i.picId,
          //         name: 'image.png',  
          //         status: 'done',
          //         url: i.banner
          //       }
          //     )
          //   }) 
          // }
          setEditingItem({
            ...editItem, 
            // time: [moment(editItem.startTime), moment(editItem.endTime)],
            // firstPic: [{uid: editItem.firstPic?.picId,name: 'image.png',  status: 'done',url: editItem.firstPic?.banner}],
            // otherPic: actImgs
          });
        } else {
          message.error(`获取详情失败，原因:{${detailRs.message}}`);
        }
      }
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };
  
  useEffect(() => {
    prepare();
  }, []);
  
  const [choosedProducts, setChoosedProducts] = useState<any>([]); //已选商品数据
  
  const chooseColumns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 60,
      render: (_: any, _record: any, index: number) => index + 1,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      isEllipsis: true,
      width: 120,
    },
    {
      title: '商品图',
      dataIndex: 'productPic',
      render: (_: string, _record: any) => (
        <Image width={100} src={_} />
      ),
      width: 120
    },
    {
      title: '商品型号',
      dataIndex: 'productModel',
      width: 120
    },
    {
      title: '商品采购价',
      dataIndex: 'purchasePricePart',
      width: 80,
    },
    {
      title: '商品销售价',
      dataIndex: 'salePricePart',
      width: 100,
    },
    {
      title: '商品划线价',
      dataIndex: 'originPricePart',
      width: 100
    },
    {
      title: '权重',
      dataIndex: 'sortNo',
      width: 80
    }
  ];

  return (
    <PageContainer 
      title={false}
      header={{
        title: '活动详情',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/purchase-manage/promotions-manage">活动管理 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              活动详情
            </Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
    >
      <h1>活动基础信息</h1>
      <div className='promotion-basic-info'>
        <Row>
          <Col span={4}>
            <div className='info-label'>活动编码：</div>
          </Col>
          <Col span={16}>
            <span>{editingItem?.actNo || '/'}</span>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <div className='info-label'>活动名称：</div>
          </Col>
          <Col span={16}>
            <span>{editingItem?.name || '/'}</span>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <div className='info-label'>活动时间：</div>
          </Col>
          <Col span={16}>
            <span>{editingItem?.startTime + '~' + editingItem?.endTime || '/'}</span>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <div className='info-label'>活动权重：</div>
          </Col>
          <Col span={16}>
            <span>{editingItem?.sortNo || '/'}</span>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <div className='info-label'>活动促销词：</div>
          </Col>
          <Col span={16}>
            <span>{editingItem?.actSpreadWord || '/'}</span>
          </Col>
        </Row>
        <Row style={{margin: '10px 0'}}>
          <Col span={4}>
            <div className='info-label'>首页采购图：</div>
          </Col>
          <Col span={16}>
            {editingItem.firstPic ? (
              <Image height={200} width={300} src={editingItem.firstPic?.banner} />
            ) : ('/')}
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <div className='info-label'>活动图：</div>
          </Col>
          <Col span={16}>
            <Image.PreviewGroup>
              {editingItem?.otherPic &&
                editingItem?.otherPic.map((p: any) => (
                  <Image key={p?.picId} height={200} width={300} src={p?.banner} />
                ))}
            </Image.PreviewGroup>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <div className='info-label'>活动说明：</div>
          </Col>
          <Col span={16}>
            <span>{editingItem?.content || '/'}</span>
          </Col>
        </Row>
      </div>
      <h1>活动商品</h1>
      <div className={'container-table-body'} style={{marginTop: 10}}>
        <SelfTable
          bordered
          scroll={{ x: 1400 }}
          columns={chooseColumns}
          rowKey={'id'}
          dataSource={choosedProducts}
          pagination={false}
        />
      </div>
      <div className='operation-footer'>
        <Button onClick={() => {history.push(`/purchase-manage/promotions-manage`);}}>返回</Button>
      </div>
    </PageContainer>
  );
};
