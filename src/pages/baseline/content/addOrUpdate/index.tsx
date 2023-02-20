import { message, Image, Button, Form, Select, Input, Breadcrumb } from 'antd';
import { history, Link } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getDemandDetail } from '@/services/creative-demand';
import FormEdit from '@/components/FormEdit';
import { addArticle, editArticle, getArticleDetail, getArticleTags, getArticleType } from '@/services/baseline';

const sc = scopedClasses('science-technology-manage-creative-detail');

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<any>([]);
  const [types, setTypes] = useState<any>([]);
  const id = history.location.query?.id as string;
  const prepare = async () => {
    if (id) {
      try {
        const res = await getArticleDetail(id);
        if (res.code === 0) {
          const detail = res?.result

          form.setFieldsValue({
            title: detail?.title,
            source: detail?.source,
            sourceUrl: detail?.sourceUrl,
            author: detail?.author,
            keywords: detail?.keywords,
            types: detail?.types?.length > 0 ? detail?.types?.map(p => p.id) : undefined,
            labels: detail?.labels?.length > 0 ? detail?.labels?.map(p => p.id) : undefined,
            content: detail?.content,
          })
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        message.error('服务器错误');
      } finally {
        setLoading(false);
      }
    }
    getDic()
  };

  const getDic = async () => {
    try {
      const res = await Promise.all([getArticleTags(), getArticleType()]);
      setTags(res[0].result || []);
      setTypes(res[1].result || []);
    } catch (error) {
      message.error('获取数据失败');
    }
  }

  useEffect(() => {
    prepare();
  }, []);

  const [form] = Form.useForm();
  const formLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 4 },
  };

  const onSubmit = async (status: number) => {
    try {
      if (status == 1) {
        await form.validateFields()
      }
      const data = form.getFieldsValue()
      const res = await (id ? editArticle({ id, ...data, status }) : addArticle({ ...data, status }))
      if (res?.code == 0) {
        message.success('操作成功')
      } else {
        message.error(res?.message || '操作失败')
      }
    } catch (error) {
      console.log(' error ', error)
    }
  }

  return (
    <PageContainer loading={loading}
    header={{
      title: id ? `内容编辑` : '添加内容',
      breadcrumb: (
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/baseline">基线管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/apply-manage/app-resource">内容管理 </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {id ? `内容编辑` : '添加内容'}
          </Breadcrumb.Item>
        </Breadcrumb>
      ),
    }}
      footer={[
        <Button type="primary" onClick={() => onSubmit(1)}>立即上架</Button>,
        <Button onClick={() => onSubmit(2)}>暂存</Button>,
        <Button onClick={() => history.push('/service-config/creative-need-manage')}>返回</Button>,
      ]}
    >
      <div className={sc('container')}>
        <Form
          form={form}
          name="basic"
          {...formLayout}
          validateTrigger={['onBlur']}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input maxLength={35} allowClear placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="来源"
            name="source"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input maxLength={35} placeholder="请输入" allowClear />
          </Form.Item>

          <Form.Item
            label="作者"
            name="author"

          >
            <Input maxLength={35} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            label="关键词"
            name="keywords"
          >
            <Input maxLength={35} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item
            label="内容类型"
            name="types"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Select mode="tags" placeholder="请选择" allowClear>
              {types?.map((item: any) => (
                <Select.Option key={item?.id} value={Number(item?.id)}>
                  {item?.typeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="标签"
            name="labels"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Select mode="tags" placeholder="请选择" allowClear >
              {tags?.map((item: any) => (
                <Select.Option key={item?.id} value={Number(item?.id)}>
                  {item?.labelName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入' }]}>
            <FormEdit width={624} />
          </Form.Item>
          <Form.Item
            label="文章原址"
            name="sourceUrl"
          >
            <Input maxLength={35} placeholder="请输入" allowClear />
          </Form.Item>
        </Form>
      </div>
    </PageContainer>
  );
};
