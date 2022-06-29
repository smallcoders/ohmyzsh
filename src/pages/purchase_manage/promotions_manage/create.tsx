import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, DatePicker, Form, Input, Table, Upload } from 'antd';
import moment from 'moment';
import { useState } from 'react';

const { Column } = Table;

interface Pic {
  id: number;
  picId: string;
  banner: string;
}

enum AddedState {
  OnShelf = 0, // 上架
  DownShelf = 1, // 下架
  Temporary = 2, // 暂存
}

interface Spec {
  specsId?: string;
  salePrice?: number; // 活动售价
  markPrice?: number; // 划线价
}

interface Product {
  productId: number;
  specs: number;
}
interface CreateActData {
  id?: number;
  actNo?: string; // 活动编码
  name?: string;
  startTime?: string; // YYYY_MM_DD HH:mm:ss
  endTime?: string;
  sortNo?: number; // 排序权重
  firstPic?: Pic; // 首页图
  otherPic?: Pic[]; // 活动图
  content?: string; // 活动介绍
  actSpreadWord?: string; // 促销词
  addedState?: AddedState;
  product?: AddedState;
}

export default () => {
  const [dateNow] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <PageContainer title={false}>
      <Form title="活动基础信息" labelCol={{ span: 4 }}>
        <Form.Item label="活动编码" name="code" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="活动名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="活动开始时间" name="startTime" rules={[{ required: true }]}>
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={(currentDate: moment.Moment) => currentDate.isBefore(dateNow)}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          />
        </Form.Item>
        <Form.Item label="活动结束时间" name="endTime" rules={[{ required: true }]}>
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={(currentDate: moment.Moment) => currentDate.isBefore(dateNow)}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          />
        </Form.Item>
        <Form.Item label="活动权重" name="orde" rules={[{ required: true }]}>
          <Input placeholder="请输入1~100的整数，数字越大排名越靠前" type="number" />
        </Form.Item>
        <Form.Item label="活动促销词" name="ci" rules={[{ required: true }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="首页采购图"
          name="thumbnail"
          extra="图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下"
        >
          <Upload name="thumbnail" maxCount={1} listType="picture-card">
            {uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item
          label="活动图"
          name="thumbnails"
          extra="图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下，支持3张图片"
          rules={[{ required: true }]}
        >
          <Upload name="thumbnails" maxCount={3} listType="picture-card">
            {uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="活动说明" name="detail">
          <Input.TextArea placeholder="请输入" />
        </Form.Item>
      </Form>

      <div>
        <Button type="primary">上架</Button>
        <Button>暂存</Button>
        <Button>返回</Button>
      </div>
    </PageContainer>
  );
};
