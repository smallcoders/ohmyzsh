import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Anchor, Button, Form, Image, Space, Table } from 'antd';
import { useEffect, useState } from 'react';

const { Column } = Table;
const { Link } = Anchor;
export default () => {
  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined);
  const baseInfo = {
    name: '科大讯飞录音笔白色32G内存',
    type: 'A3421',
    label: '正品保障',
    label2: '满200减10',
    unit: '台',
    thumbnail:
      'https://qxbfile.iflytek.com:7000/group1/M00/10/EF/CgAZoWKzv3yANOX7AAFPQaPC-hg291.jpg',
    thumbnails: [
      'https://qxbfile.iflytek.com:7000/group1/M00/10/EF/CgAZoWKzv3yANOX7AAFPQaPC-hg291.jpg',
      'https://qxbfile.iflytek.com:7000/group1/M00/10/C8/CgAZoWKv0SqAEPooAAHq8sJxOJ8648.png',
      'https://qxbfile.iflytek.com:7000/group1/M00/10/D9/CgAZoWKxMR-AOZ-zAACjGLQu1cI494.jpg',
    ],
    supplier: '供应商',
  };

  const specs = [
    { name: '内存', value: '8G、16G' },
    { name: '颜色', value: '白、黑' },
    { name: '硬盘', value: '256G、512G' },
  ];

  const price = [
    { spec1: '8G', spec2: '256G', code: '123', purchasePrice: '100.00', sellingPrice: '200.00' },
    { spec1: '8G', spec2: '512G', code: '124', purchasePrice: '200.00', sellingPrice: '300.00' },
    { spec1: '16G', spec2: '256G', code: '125', purchasePrice: '300.00', sellingPrice: '400.00' },
    { spec1: '16G', spec2: '512G', code: '126', purchasePrice: '400.00', sellingPrice: '500.00' },
  ];

  const parameters = [
    { name: '品牌', content: '西门子/SIEMENS' },
    { name: '颜色', content: '白、黑' },
    { name: '硬盘', content: '256G、512G' },
  ];

  const details = {
    content: 'asdas',
    parameter: 'asdas',
    detail: 'asdas',
    application: 'asdas',
  };

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  return (
    <PageContainer title={false}>
      <ProCard gutter={8} ghost>
        <ProCard direction="column" ghost gutter={[0, 8]}>
          <ProCard>
            <h2 id="anchor-base-info">商品基础信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="商品名称">{baseInfo.name}</Form.Item>
              <Form.Item label="商品型号">{baseInfo.type}</Form.Item>
              <Form.Item label="商品促销标签">{baseInfo.label}</Form.Item>
              <Form.Item label="服务标签">{baseInfo.label2}</Form.Item>
              <Form.Item label="商品单位">{baseInfo.unit}</Form.Item>
              <Form.Item label="商品封面图">
                <Image width={100} src={baseInfo.thumbnail} />
              </Form.Item>
              <Form.Item label="商品轮播图">
                <Image.PreviewGroup>
                  <Space>
                    {baseInfo.thumbnails.map((url) => {
                      return <Image width={100} src={url} />;
                    })}
                  </Space>
                </Image.PreviewGroup>
              </Form.Item>
              <Form.Item label="供应商">{baseInfo.supplier}</Form.Item>
            </Form>
          </ProCard>
          <ProCard>
            <h2 id="anchor-specs">商品基础信息</h2>
            <Table dataSource={specs} pagination={false}>
              <Column title="序号" render={(_, __, i) => i + 1} />
              <Column title="规格名" dataIndex="name" />
              <Column title="规格值" dataIndex="value" />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="anchor-price">商品价格信息</h2>
            <Table dataSource={price} pagination={false}>
              <Column title="序号" render={(_, __, i) => i + 1} />
              <Column title="规格（内存" dataIndex="spec1" />
              <Column title="规格（硬盘）" dataIndex="spec2" />
              <Column title="订货编码" dataIndex="code" />
              <Column title="商品采购价格（元）" dataIndex="purchasePrice" />
              <Column title="商品销售价格（元）" dataIndex="sellingPrice" />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="anchor-parameters">商品参数信息</h2>
            <Table dataSource={parameters} pagination={false}>
              <Column title="序号" render={(_, __, i) => i + 1} />
              <Column title="名称" dataIndex="name" />
              <Column title="内容" dataIndex="content" />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="anchor-details">商品详情</h2>
            <Form layout="vertical" labelCol={{ span: 4 }}>
              <Form.Item label="商品介绍">{details.content}</Form.Item>
              <Form.Item label="商品参数">{details.parameter}</Form.Item>
              <Form.Item label="商品细节">{details.detail}</Form.Item>
              <Form.Item label="商品应用">{details.application}</Form.Item>
            </Form>
          </ProCard>

          <ProCard>
            <Button>返回</Button>
          </ProCard>
        </ProCard>
        <ProCard colSpan="200px" />
      </ProCard>
      <div style={{ width: 200, position: 'fixed', right: 10, top: 100 }}>
        <Anchor offsetTop={150} showInkInFixed={true} affix={false}>
          <Link href="#anchor-base-info" title="商品基础信息" />
          <Link href="#anchor-specs" title="商品基础信息" />
          <Link href="#anchor-price" title="商品价格信息" />
          <Link href="#anchor-parameters" title="商品参数信息" />
          <Link href="#anchor-details" title="商品详情" />
        </Anchor>
      </div>
    </PageContainer>
  );
};
