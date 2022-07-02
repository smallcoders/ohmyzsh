import useQuery from '@/hooks/useQuery';
import { queryProductDetail } from '@/services/commodity';
import type DataCommodity from '@/types/data-commodity';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Anchor, Button, Form, Image, Space, Table, Tag } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'umi';
const { Column } = Table;
const { Link } = Anchor;
export default () => {
  const history = useHistory();
  const query = useQuery();
  const [loading, setLoading] = useState(true);
  const [commodity, setCommodity] = useState<{
    payProduct: DataCommodity.ProductInfo;
    payProductSpecsList: DataCommodity.SpecInfo[];
    payProductSpecsPriceList: DataCommodity.PriceInfo[];
    payProductParamList: DataCommodity.ParamInfo[];
  }>();

  const init = useCallback(async () => {
    const commodityRes = await queryProductDetail(query.id).finally(() => setLoading(false));
    setLoading(false);
    if (!commodityRes.code) {
      setCommodity(commodityRes.result);
    }
  }, [query]);

  const price = useMemo(() => {
    return commodity?.payProductSpecsPriceList.map((item) => {
      const specs = item.specs.split(',').filter((v) => v.trim());
      const specsData: Record<string, string> = {};
      specs.forEach((spec, index) => {
        specsData[`specs${index}`] = spec;
      });

      if (specs.length === 0) {
        specsData.specs0 = '/';
      }
      return {
        ...item,
        ...specsData,
      };
    });
  }, [commodity]);

  const specsTitle = useMemo(() => {
    const titles = (commodity?.payProductSpecsPriceList[0]?.specsTitle || '')
      .split(',')
      .filter((item) => item.trim());

    if (titles?.length) {
      return titles.map((item, index) => {
        return <Column title={`规格(${item})`} dataIndex={`specs${index}`} key={item} />;
      });
    }

    return <Column title="规格(无)" dataIndex="specs0" />;
  }, [commodity]);

  const renderHtml = useCallback((html) => {
    return {
      __html: html,
    };
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <PageContainer loading={loading} title={false}>
      <ProCard gutter={8} ghost>
        <ProCard direction="column" ghost gutter={[0, 8]}>
          <ProCard>
            <h2 id="anchor-base-info">商品基础信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="商品名称">{commodity?.payProduct.productName}</Form.Item>
              <Form.Item label="商品型号">{commodity?.payProduct.productModel}</Form.Item>
              <Form.Item label="商品促销标签">
                {commodity?.payProduct.saleContent?.map((item) => {
                  return <Tag key={item.id}>{item.label}</Tag>;
                })}
              </Form.Item>
              <Form.Item label="服务标签">
                {commodity?.payProduct.serverContent?.map((item) => {
                  return <Tag key={item.id}>{item.label}</Tag>;
                })}
              </Form.Item>
              <Form.Item label="商品单位">{commodity?.payProduct.productOrg}</Form.Item>
              <Form.Item label="商品封面图">
                <Image width={100} src={commodity?.payProduct.productPic} />
              </Form.Item>
              <Form.Item label="商品轮播图">
                <Image.PreviewGroup>
                  <Space>
                    {commodity?.payProduct.banner?.split(',').map((url) => {
                      return <Image width={100} src={url} key={url} />;
                    })}
                  </Space>
                </Image.PreviewGroup>
              </Form.Item>
              <Form.Item label="供应商">{commodity?.payProduct?.supplierName}</Form.Item>
            </Form>
          </ProCard>
          <ProCard>
            <h2 id="anchor-specs">商品规格信息</h2>
            <Table rowKey="id" dataSource={commodity?.payProductSpecsList} pagination={false}>
              <Column title="序号" render={(_, __, i) => i + 1} />
              <Column title="规格名" dataIndex="specsName" />
              <Column title="规格值" dataIndex="specsValue" />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="anchor-price">商品价格信息</h2>
            <Table dataSource={price} pagination={false}>
              <Column title="序号" render={(_, __, i) => i + 1} />
              {specsTitle}
              <Column title="订货编码" dataIndex="productNo" />
              <Column title="商品采购价格（元）" dataIndex="purchasePrice"  render={(_, __) => _/100}/>
              <Column title="商品销售价格（元）" dataIndex="salePrice"   render={(_, __) => _/100}/>
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="anchor-parameters">商品参数信息</h2>
            <Table rowKey="id" dataSource={commodity?.payProductParamList} pagination={false}>
              <Column title="序号" render={(_, __, i) => i + 1} />
              <Column title="名称" dataIndex="name" />
              <Column title="内容" dataIndex="content" />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="anchor-details">商品详情</h2>
            <Form layout="vertical" labelCol={{ span: 4 }}>
              <Form.Item label="商品介绍">
                <div dangerouslySetInnerHTML={renderHtml(commodity?.payProduct.productContent)} />
              </Form.Item>
              <Form.Item label="商品参数">
                <div dangerouslySetInnerHTML={renderHtml(commodity?.payProduct.productArgs)} />
              </Form.Item>
              <Form.Item label="商品细节">
                <div dangerouslySetInnerHTML={renderHtml(commodity?.payProduct.productDetail)} />
              </Form.Item>
              <Form.Item label="商品应用">
                <div dangerouslySetInnerHTML={renderHtml(commodity?.payProduct.productApp)} />
              </Form.Item>
            </Form>
          </ProCard>

          <ProCard layout="center">
            <Button onClick={() => history.goBack()}>返回</Button>
          </ProCard>
        </ProCard>
        <ProCard colSpan="200px" />
      </ProCard>
      <div style={{ width: 200, position: 'fixed', right: 10, top: 100 }}>
        <Anchor offsetTop={150} showInkInFixed={true} affix={false}>
          <Link href="#anchor-base-info" title="商品基础信息" />
          <Link href="#anchor-specs" title="商品规格信息" />
          <Link href="#anchor-price" title="商品价格信息" />
          <Link href="#anchor-parameters" title="商品参数信息" />
          <Link href="#anchor-details" title="商品详情" />
        </Anchor>
      </div>
    </PageContainer>
  );
};
