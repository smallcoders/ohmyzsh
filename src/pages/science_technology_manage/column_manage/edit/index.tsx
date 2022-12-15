import {PageContainer} from "@ant-design/pro-layout";

import './index.less';
import scopedClasses from "@/utils/scopedClasses";
import ProCard from "@ant-design/pro-card";
import {Button, Form, Input} from "antd";
import {history} from "@@/core/history";
import UploadForm from "@/components/upload_form";
const sc = scopedClasses('column-manage-edit');
export default () => {
  const [form] = Form.useForm();
  return(
    <PageContainer className={sc('container')}>
      <Form className={sc('container-form')} form={form}>
        <Form.Item name="name" label="专栏名称" required>
          <Input  />
        </Form.Item>
        <Form.Item
          name="logoImageId"
          label="专栏介绍"
          required
        >
          <Input.TextArea showCount maxLength={300}  />
        </Form.Item>
        <Form.Item
          name="logoImageId"
          label="上传图片"
          required
          className={'pics'}
        >
·          <Form.Item name="actualCapital" label="Web端图片" required className={'pic'}>
            <UploadForm
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              maxSize={5}
              accept=".bmp,.gif,.png,.jpeg,.jpg"
            />
          </Form.Item>
          <div style={{marginBottom:'20px'}}>限定一张图片，不超过5M，尺寸（以实际效果图为准），格式支持png、jpg</div>
          <Form.Item name="actualCapital" label="App端图片" className={'pic'}>
            <UploadForm
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              maxSize={5}
              accept=".bmp,.gif,.png,.jpeg,.jpg"
            />
          </Form.Item>
          <div style={{marginBottom:'20px'}}>限定一张图片，不超过5M，尺寸（以实际效果图为准），格式支持png、jpg</div>
        </Form.Item>
        <Form.Item  name="regCapital" label="链接地址" required>
          <Form.Item name="actualCapital" label="Web端" required className={'link'}>
            <Input  />
          </Form.Item>
          <Form.Item name="actualCapital" label="App端" className={'link'}>
            <Input  />
          </Form.Item>
        </Form.Item>
        <Form.Item name="actualCapital" label="展示顺序" >
          <Input  />
        </Form.Item>
        <Form.Item
          name="logoImageId"
          label="备注"
        >
          <Input.TextArea showCount maxLength={300}  />
        </Form.Item>
      </Form>
      <ProCard layout="center">
        <Button style={{marginRight:'40px'}} onClick={() => history.goBack()}>返回</Button>
        <Button type={"primary"} onClick={() => history.goBack()}>发布</Button>
      </ProCard>
    </PageContainer>
  )
}
