import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Form, Image, Space, Table } from 'antd';
import moment from 'moment';

const { Column } = Table;

export default () => {
  const data = {
    code: '11asd',
    name: `618`,
    startTime: 1655781830888,
    endTime: 1655784830888,
    order: 1,
    ci: '',
    thumbnail:
      'https://qxbfile.iflytek.com:7000/group1/M00/10/EF/CgAZoWKzv3yANOX7AAFPQaPC-hg291.jpg',
    thumbnails: [
      'https://qxbfile.iflytek.com:7000/group1/M00/10/EF/CgAZoWKzv3yANOX7AAFPQaPC-hg291.jpg',
      'https://qxbfile.iflytek.com:7000/group1/M00/10/C8/CgAZoWKv0SqAEPooAAHq8sJxOJ8648.png',
      'https://qxbfile.iflytek.com:7000/group1/M00/10/D9/CgAZoWKxMR-AOZ-zAACjGLQu1cI494.jpg',
    ],
    detail: '',
  };

  const commoditys = [
    {
      name: '内存',
      thumbnail:
        'https://qxbfile.iflytek.com:7000/group1/M00/10/EF/CgAZoWKzv3yANOX7AAFPQaPC-hg291.jpg',
      type: 'a110',
      purchasePrice: '1000-2000',
      sellingPrice: '1500-2500',
      linePrice: '/',
      order: 1,
    },
  ];

  return (
    <PageContainer title={false}>
      <ProCard direction="column" ghost gutter={[0, 8]}>
        <ProCard>
          <h2 id="anchor-base-info">商品基础信息</h2>
          <Form labelCol={{ span: 4 }}>
            <Form.Item label="活动编码">{data.code}</Form.Item>
            <Form.Item label="活动名称">{data.name}</Form.Item>
            <Form.Item label="活动开始时间">
              {moment(data.startTime).format('YYYY-MM-DD HH:mm')}
            </Form.Item>
            <Form.Item label="活动结束时间">
              {moment(data.endTime).format('YYYY-MM-DD HH:mm')}
            </Form.Item>
            <Form.Item label="活动权重">{data.order}</Form.Item>
            <Form.Item label="活动促销词">{data.ci || '/'}</Form.Item>
            <Form.Item label="首页采购图">
              <Image width={100} src={data.thumbnail} />
            </Form.Item>
            <Form.Item label="商品轮播图">
              <Image.PreviewGroup>
                <Space>
                  {data.thumbnails.map((url) => {
                    return <Image width={100} src={url} />;
                  })}
                </Space>
              </Image.PreviewGroup>
            </Form.Item>
            <Form.Item label="活动说明">{data.detail || '/'}</Form.Item>
          </Form>
        </ProCard>
        <ProCard>
          <h2 id="anchor-specs">活动商品</h2>
          <Table<{ thumbnail: string }> dataSource={commoditys} pagination={false}>
            <Column title="序号" render={(_, __, i) => i + 1} />
            <Column title="商品名称" dataIndex="name" />
            <Column
              title="商品图"
              render={(_, record) => <Image width={100} src={record.thumbnail} />}
            />
            <Column title="商品型号" dataIndex="type" />
            <Column title="商品采购价" dataIndex="type" />
            <Column title="商品销售价" dataIndex="purchasePrice" />
            <Column title="商品划线价" dataIndex="linePrice" />
            <Column title="权重" dataIndex="order" />
          </Table>
        </ProCard>

        <ProCard>
          <Button>返回</Button>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
