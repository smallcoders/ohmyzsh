import useQuery from '@/hooks/useQuery';
import { queryProductDetail } from '@/services/commodity';
import type DataCommodity from '@/types/data-commodity';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Anchor, Button, Form, Image, Space, Table, Tag } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'umi';
import { numdiv } from '@/utils/util';
const { Column } = Table;
const { Link } = Anchor;
// 商品来源字典
const productSourceType = {
  0:'采购商品', 
  1:'应用商品', 
  2:'其他商品'
}
enum PayMethodAppEnum {
  YEAR = 1,
  SET,
  TIME,
}

const filterNames = ['交付方式', '商品付费方式'];

const commodityPaymentTypes = [
  { value: PayMethodAppEnum.YEAR, content: '元/年' },
  { value: PayMethodAppEnum.SET, content: '元/套' },
  { value: PayMethodAppEnum.TIME, content: '元/次' },
];
enum ExpireTimeEnum {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}
const yearMap = {
  [ExpireTimeEnum.ONE]: '一',
  [ExpireTimeEnum.TWO]: '二',
  [ExpireTimeEnum.THREE]: '三',
  [ExpireTimeEnum.FOUR]: '四',
  [ExpireTimeEnum.FIVE]: '五',
};
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
              <Form.Item label="商品来源">{commodity && commodity.payProduct.productSource && productSourceType[commodity.payProduct.productSource]}</Form.Item> 
              <Form.Item label="数字化应用">{commodity?.payProduct.appName}</Form.Item>
              <Form.Item label="商品服务端">
                {(commodity?.payProduct.appType == 1 || commodity?.payProduct.appType == 3) && (
                  <div>
                    Web端：{commodity?.payProduct.pcHomeUrl}  
                    <a href='#' onClick={() => {
                      window.open(commodity?.payProduct.pcHomeUrl)
                    }}>查看</a>
                  </div>
                )}
                {(commodity?.payProduct.appType == 0 || commodity?.payProduct.appType == 3) && (
                  <div>
                    App端：{commodity?.payProduct.appHomeUrl}  
                    <a href='#' onClick={() => {
                      window.open(commodity?.payProduct.appHomeUrl)
                    }}>查看</a>
                  </div>
                )}
              </Form.Item>
              <Form.Item label="商品体验地址">
                {(commodity?.payProduct.appType == 1 || commodity?.payProduct.appType == 3) && (
                  <div>
                    Web端：{commodity?.payProduct.pcDemoUrl}  
                    <a href='#' onClick={() => {
                      window.open(commodity?.payProduct.pcDemoUrl)
                    }}>查看</a>
                  </div>
                )}
                {(commodity?.payProduct.appType == 0 || commodity?.payProduct.appType == 3) && (
                  <div>
                    App端：{commodity?.payProduct.appDemoUrl}  
                    <a href='#' onClick={() => {
                      window.open(commodity?.payProduct.appDemoUrl)
                    }}>查看</a>
                  </div>
                )}
              </Form.Item>
              <Form.Item label="商品类型">{commodity?.payProduct.typeName}</Form.Item>
              <Form.Item label="商品名称">{commodity?.payProduct.productName}</Form.Item>
              <Form.Item label="商品型号">{commodity?.payProduct.productModel}</Form.Item>
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
              <Form.Item label="免费试用">{commodity && commodity.payProduct.isFree ? '是' : '否'}</Form.Item>
            </Form>
          </ProCard>
          <ProCard>
            <h2 id="anchor-specs">商品规格信息</h2>
            {/* <Table rowKey="id" dataSource={commodity?.payProductSpecsList} pagination={false}>
              <Column title="序号" render={(_, __, i) => i + 1} />
              <Column title="规格名" dataIndex="specsName" />
              <Column title="规格值" dataIndex="specsValue" />
            </Table> */}
            <Table
              rowKey="id"
              bordered
              dataSource={commodity?.payProductSpecsList || []}
              pagination={false}
              style={{ width: 400 }}
            >
              <Column title="规格" dataIndex="specsValue" />
              <Column
                title="规格信息"
                dataIndex="type"
                render={(text, record: any) => {
                  switch (text) {
                    case PayMethodAppEnum.YEAR:
                      return `用户数：${record?.userNum > 0 ? `${record?.userNum}人` : '无限制'
                        }；有效时间：${record?.expireTime > 0 ? `${yearMap[record?.expireTime]}年` : '无限制'
                        }`;
                    case PayMethodAppEnum.SET:
                      return `使用次数：${record?.count > 0 ? `${record?.count}次` : '无限制'
                        }；有效时间：${record?.expireTime > 0 ? `${yearMap[record?.expireTime]}年` : '无限制'
                        }`;
                    case PayMethodAppEnum.TIME:
                      return `使用次数：${record?.count > 0 ? `${record?.count}次` : '无限制'}`;
                    default:
                      return '--';
                  }
                }}
              />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="anchor-price">商品价格信息</h2>
            <Table
              rowKey="id"
              bordered
              dataSource={commodity?.payProductSpecsPriceList || []}
              pagination={false}
            >
              <Column title="规格" dataIndex={'specs'} />
              <Column title="订货编号" dataIndex="productNo" />
              <Column
                title="商品原价（元)"
                dataIndex="originPrice"
                render={(_) => numdiv(_, 100)}
              />
              <Column
                title="商品促销价（元)"
                dataIndex="salePrice"
                render={(_) => numdiv(_, 100)}
              />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="anchor-parameters">商品参数信息</h2>
            <Table
              rowKey="id"
              dataSource={(commodity?.payProductParamList || [])?.filter(
                (item: Record<string, string | number>) => !filterNames.includes(`${item?.name}`),
              )}
              bordered
              pagination={false}
            >
              <Column title="名称" dataIndex={'name'} />
              <Column
                title="内容"
                dataIndex="content"
                render={(text: string, record: any) => {
                  if (record?.name === '可售范围') {
                    const areas = (text ?? '')
                      .split?.(';')
                      .map?.((code: string) =>
                        code.split('-').map?.((item) => item.split(':')?.[1]),
                      )
                      .map?.((area) => area.join('-'));
                    return (
                      <>
                        {(areas ?? []).map((area) => (
                          <div key={area}>{area}</div>
                        ))}
                      </>
                    );
                  }
                  return text;
                }}
              />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="anchor-details">商品详情</h2>
            <Form layout="vertical" labelCol={{ span: 4 }}>
              <Form.Item label="商品介绍">
                <div
                  dangerouslySetInnerHTML={{
                    __html: commodity?.payProduct?.productContent || '/',
                  }}
                />
              </Form.Item>
              <Form.Item label="商品价值">
                <div
                  dangerouslySetInnerHTML={{
                    __html: commodity?.payProduct?.productWorth || '/',
                  }}
                />
              </Form.Item>
              <Form.Item label="商品应用场景">
                <div
                  dangerouslySetInnerHTML={{
                    __html: commodity?.payProduct?.productScene || '/',
                  }}
                />
              </Form.Item>
            </Form>
          </ProCard>

          {/* <ProCard layout="center">
            <Button onClick={() => history.goBack()}>返回</Button>
          </ProCard> */}
        </ProCard>
        <ProCard colSpan="200px" />
      </ProCard>
      <div style={{ width: 200, background: '#fff', position: 'fixed', right: 10, top: 100 }}>
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
