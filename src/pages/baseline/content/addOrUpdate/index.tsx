import {
  message,
  Image,
  Button,
  Form,
  Select,
  Input,
  Breadcrumb,
  Modal,
  DatePicker,
  Card,
} from 'antd';
import { Access, history, Link, Prompt, useAccess } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import FormEdit from '@/components/FormEdit';
import {
  addArticle,
  auditArticle,
  editArticle,
  getArticleDetail,
  getArticleTags,
  getArticleType,
} from '@/services/baseline';
import { routeName } from '../../../../../config/routes';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';

const sc = scopedClasses('science-technology-manage-creative-detail');

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<any>([]);
  const [types, setTypes] = useState<any>([]);
  const id = history.location.query?.id as string;
  const { TextArea } = Input;
  const access = useAccess();
  const prepare = async () => {
    if (id) {
      try {
        const res = await getArticleDetail(id);
        if (res.code === 0) {
          const detail = res?.result;

          form.setFieldsValue({
            title: detail?.title,
            source: detail?.source,
            sourceUrl: detail?.sourceUrl,
            author: detail?.author,
            keywords: detail?.keywords,
            types: detail?.types?.length > 0 ? detail?.types?.map((p) => p.id) : undefined,
            labels: detail?.labels?.length > 0 ? detail?.labels?.map((p) => p.id) : undefined,
            content: detail?.content,
            publishTime: detail?.publishTime ? moment(detail?.publishTime) : undefined,
          });
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        message.error('服务器错误');
      } finally {
        setLoading(false);
      }
    }
    getDic();
  };

  const getDic = async () => {
    try {
      const res = await Promise.all([getArticleTags(), getArticleType()]);
      setTags(res[0].result || []);
      setTypes(res[1].result || []);
    } catch (error) {
      message.error('获取数据失败');
    }
  };
  const listener = (e: any) => {
    e.preventDefault();
    e.returnValue = '离开当前页后，所编辑的数据将不可恢复';
  };

  useEffect(() => {
    prepare();
    window.addEventListener('beforeunload', listener);
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, []);

  const [form] = Form.useForm();
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };

  const onSubmit = async (status: number) => {
    try {
      const data = form.getFieldsValue();
      if (data.publishTime) {
        data.publishTime = moment(data.publishTime).valueOf();
      }

      const cb = async () => {
        setLoading(true);
        const res = await (id
          ? editArticle({ id, ...data, status })
          : addArticle({ ...data, status }));
        if (res?.code == 0) {
          message.success('操作成功');
          setIsClosejumpTooltip(false);
          status == 1 && history.push(routeName.BASELINE_CONTENT_MANAGE);
        } else {
          message.error(res?.message || '操作失败');
        }
        setLoading(false);
      };

      if (status == 1) {
        await form.validateFields();
        Modal.confirm({
          title: '提示',
          content: '确定将内容上架？',
          onOk: async () => {
            beforeUp(data.content, cb);
          },
          onCancel: () => {
            return;
          },
          okText: '上架',
        });
      } else {
        cb();
      }
    } catch (error) {
      setLoading(false);
      console.log(' error ', error);
    }
  };

  const beforeUp = async (content: string, cb: () => void) => {
    try {
      const res = await auditArticle(content);
      if (res?.result) {
        Modal.confirm({
          title: '风险提示',
          content: res?.result,
          onOk: async () => {
            cb();
          },
          onCancel: () => {},
          okText: '继续上架',
          cancelText: '返回更改',
        });
      } else {
        cb();
      }
    } catch (error) {
      console.log(' error ', error);
    }
  };
  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(true);
  return (
    <PageContainer
      loading={loading}
      header={{
        title: id ? `内容编辑` : '添加内容',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline">基线管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/baseline">内容管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? `内容编辑` : '添加内容'}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        <Access accessible={access.PA_BLM_NRGL}>
          {' '}
          <Button type="primary" onClick={() => onSubmit(1)}>
            立即上架
          </Button>
        </Access>,
        <Access accessible={access.PA_BLM_NRGL}>
          <Button onClick={() => onSubmit(2)}>暂存</Button>
        </Access>,
        <Button onClick={() => history.push(routeName.BASELINE_CONTENT_MANAGE)}>返回</Button>,
      ]}
    >
      <Prompt
        when={isClosejumpTooltip}
        message={'离开此页面，将不会保存当前编辑的内容，确认离开吗？'}
      />
      <div className={sc('container')}>
        <Form form={form} name="basic" {...formLayout} validateTrigger={['onBlur']}>
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入' }]}>
            <Input.TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
              maxLength={200}
            />
          </Form.Item>
          <Form.Item label="来源" name="source" rules={[{ required: true, message: '请输入' }]}>
            <Input maxLength={35} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="作者" name="author">
            <Input maxLength={35} placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="关键词" name="keywords">
            <Input
              maxLength={35}
              placeholder="请输入,多个关键词之间请使用英文逗号分隔"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="内容发布时间"
            name="publishTime"
            rules={[{ required: true, message: '请选择' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="内容类型" name="types" rules={[{ required: true, message: '请输入' }]}>
            <Select mode="multiple" placeholder="请选择" allowClear>
              {types?.map((item: any) => (
                <Select.Option key={item?.id} value={Number(item?.id)}>
                  {item?.typeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="标签" name="labels" rules={[{ required: true, message: '请输入' }]}>
            <Select mode="multiple" placeholder="请选择" allowClear>
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
          <Form.Item label="文章原址" name="sourceUrl">
            <Input maxLength={35} placeholder="请输入" allowClear />
          </Form.Item>
          <div style={{ marginLeft: '100px' }}>
            <span style={{ fontSize: '20px', fontWeight: 500 }}>链接</span>
            <Form.List name="links">
              {(fields, { add, remove }) => (
                <>
                  <Form.Item>
                    <Button
                      style={{ margin: '10px 0' }}
                      type="primary"
                      disabled={fields.length >= 5}
                      key="addStyle1"
                      onClick={() => add()}
                    >
                      <PlusOutlined /> 新增
                    </Button>
                  </Form.Item>
                  {fields.map((field, index) => (
                    <Card
                      key={field.key}
                      title={`链接${index + 1}`}
                      extra={
                        <a
                          key="del"
                          onClick={() => {
                            remove(field.name);
                          }}
                        >
                          删除
                        </a>
                      }
                      style={{ width: 600, marginBottom: '10px' }}
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, 'title']}
                        label="链接标题"
                        rules={[
                          {
                            required: true,
                            message: `必填`,
                          },
                        ]}
                      >
                        <TextArea
                          autoSize={{ minRows: 1, maxRows: 4 }}
                          placeholder="请输入"
                          maxLength={10}
                        />
                      </Form.Item>
                      <Form.Item name={[field.name, 'introduction']} label="链接简介">
                        <TextArea autoSize={{ minRows: 2, maxRows: 10 }} placeholder="请输入" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'address']}
                        label="链接地址"
                        rules={[
                          {
                            required: true,
                            message: `必填`,
                          },
                        ]}
                      >
                        <TextArea
                          autoSize={{ minRows: 2, maxRows: 10 }}
                          placeholder="请输入"
                          maxLength={50}
                        />
                      </Form.Item>
                    </Card>
                  ))}
                </>
              )}
            </Form.List>
          </div>
        </Form>
      </div>
    </PageContainer>
  );
};
