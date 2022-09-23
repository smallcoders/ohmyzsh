import { message, Image, Select, Row, Col, Form, Anchor, Button, Table } from 'antd';
import ProCard from '@ant-design/pro-card';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getDemandDetail } from '@/services/kc-verify';
import VerifyInfoDetail from '@/components/verify_info_detail/verify-info-detail';

const { Link } = Anchor;
const { Column } = Table;
const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<any>({});

  const prepare = async () => {
    const id = history.location.query?.id as string;
    if (id) {
      try {
        const res = await getDemandDetail(id);
        if (res.code === 0) {
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

  useEffect(() => {
    prepare();
  }, []);
  return (
    <PageContainer loading={loading} title={false}>
      <ProCard gutter={8} ghost>
        <ProCard direction="column" ghost gutter={[0, 8]}>
          <ProCard>
            <h2 id="goods-base-info">商品基础信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="商品类目">{detail?.id}</Form.Item>
              <Form.Item label="数字化应用">{detail?.createTime}</Form.Item>
              <Form.Item label="商品服务端">
                <div>
                  <span>App端：</span>
                  <span>https://antelopetest.iflysec.com/antelope-other/ </span>
                  <a href="">查看</a>
                </div>
              </Form.Item>
              <Form.Item label="商品类型">
                <Select placeholder="请选择" allowClear style={{ width: '200px' }}>
                  <Select.Option value={'AUDITING'}>待审核</Select.Option>
                  <Select.Option value={'AUDIT_PASSED'}>通过</Select.Option>
                  <Select.Option value={'AUDIT_REJECTED'}>拒绝</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="商品名称">商品名称商品名称</Form.Item>
              <Form.Item label="商品型号">A1233</Form.Item>
              <Form.Item label="商品简介">商品简介商品简</Form.Item>
              <Form.Item label="商品封面图">
                <Image width={100} src={detail?.cover} alt="图片损坏" />
              </Form.Item>
              <Form.Item label="商品轮播图">
                <Row gutter={[12, 12]}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                    <Col key={item}>
                      <Image width={100} src={detail?.cover} alt="图片损坏" />
                    </Col>
                  ))}
                </Row>
              </Form.Item>
              <Form.Item label="免费试用">是</Form.Item>
            </Form>
          </ProCard>

          <ProCard>
            <h2 id="goods-specs">商品规格信息</h2>
            <Table rowKey="id" dataSource={[]} pagination={false}>
              <Column title="规格" dataIndex="specsName" />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="goods-price">商品价格信息</h2>
            <Table rowKey="id" dataSource={[]} pagination={false}>
              <Column title="规格" render={(_, __, i) => i + 1} />
              <Column title="订货编号" dataIndex="specsName" />
              <Column title="商品原价（元)" dataIndex="specsValue" />
              <Column title="商品促销价（元)" dataIndex="specsValue" />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="goods-argument">商品参数信息</h2>
            <Table dataSource={[]} pagination={false}>
              <Column title="名称" render={(_, __, i) => i + 1} />
              <Column title="内容" dataIndex="productNo" />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="goods-detail">商品详情</h2>
            <Form labelCol={{ span: 4 }} layout={'vertical'}>
              <Form.Item label="商品介绍">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      '<p>1<img src="https://oss-beijing-m8b.openstorage.cn/iiep-dev/aa229bc4e11c4bb6ac03c48c29d30d52.png"></p><p>&nbsp;</p><h2>123123123</h2><ol><li>23232323</li><li>3</li><li>2</li><li>2</li><li>2</li></ol><ul><li>22</li><li>2</li></ul><p>22</p><p><strong>333333</strong></p>' ||
                      '/',
                  }}
                />
              </Form.Item>
              <Form.Item label="商品价值" />
              <Form.Item label="商品价值" />
            </Form>
          </ProCard>

          {/* <ProCard>
            <h2 id="anchor-details">平台响应信息</h2>
            <VerifyStepsDetail list={list} />
          </ProCard> */}
          <div style={{ background: '#fff', marginTop: 20, paddingTop: 20 }}>
            <VerifyInfoDetail auditId={detail?.auditId} reset={prepare} />
          </div>
          {/* <ProCard layout="center">
            {detail?.verityStatus !== 4 && detail?.verityStatus !== 5 && (
              <Button type="primary" style={{ marginRight: '10px' }} onClick={() => {}}>
                提交
              </Button>
            )}

            <Button onClick={() => history.goBack()}>返回</Button>
          </ProCard> */}
        </ProCard>
      </ProCard>
      <div style={{ width: 200, position: 'fixed', right: 10, top: 100 }}>
        <Anchor offsetTop={150} showInkInFixed={true} affix={false}>
          <Link href="#goods-base-info" title="商品基础信息" />
          <Link href="#goods-specs" title="商品规格信息" />
          <Link href="#goods-price" title="商品价格信息" />
          <Link href="#goods-argument" title="商品参数信息" />
          <Link href="#goods-detail" title="商品详情" />
        </Anchor>
      </div>
    </PageContainer>
  );
};
