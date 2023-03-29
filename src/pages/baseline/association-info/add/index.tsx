import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  message,
  Breadcrumb,
  Switch,
  InputNumber,
  Card,
  Select,
} from 'antd';
import { history } from '@@/core/history';
import { getArticleType } from '@/services/baseline';
import { getHotRecommendDetail, queryByIds } from '@/services/topic';
import { Link } from 'umi';
import { phoneVerifyReg } from '@/utils/regex-util';
import UploadForm from '@/components/upload_form';
const sc = scopedClasses('baseline-association-add');

export default () => {
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [types, setTypes] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 10 },
  };
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [selectRowKeys, setSelectRowKeys] = useState<any>([]);
  const [selectRows, setSelectRows] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<any>(false);
  // 方法
  //获取文章类型
  const prepare = async () => {
    try {
      const res = await getArticleType();
      setTypes(res.result || []);
    } catch (error) {
      message.error('获取数据失败');
    }
  };
  //获取热门话题详情
  const { query } = history.location as any;
  const getHotRecommendDetailById = (pageIndex: number = 1, pageSize = query?.contentCount) => {
    getHotRecommendDetail({ id: query?.id, pageIndex, pageSize }).then((res) => {
      if (res.code === 0) {
        form.setFieldsValue(res?.result);

        setSelectRows(res?.result.list);
        const newArray: any = [];
        res?.result.list.forEach((item: any) => {
          newArray.push(item.articleId);
        });
        setSelectRowKeys([...newArray]);
        queryByIds([...newArray]).then((result) => {
          if (result.code === 0) {
          }
        });
      }
    });
  };

  useEffect(() => {
    getHotRecommendDetailById();
    prepare();
  }, []);

  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: query?.id ? `编辑` : '新增',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline">基线管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/baseline/baseline-association-manage">协会信息配置 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{query?.id ? `编辑` : '新增'}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        <Button
          type="primary"
          onClick={() => {
            form
              .validateFields()
              .then(async () => {
                setVisibleAdd(true);
              })
              .catch((e) => {
                console.log(e);
              });
          }}
        >
          保存
        </Button>,
        <Button
          style={{ marginRight: '40px' }}
          onClick={() => {
            if (formIsChange) {
              setVisible(true);
            } else {
              history.goBack();
            }
          }}
        >
          返回
        </Button>,
      ]}
    >
      <div>
        <Form
          {...formLayout}
          form={form}
          onValuesChange={() => {
            setFormIsChange(true);
          }}
        >
          <div className={sc('container-table-body')}>
            <div className={sc('container-table-body-title')}>协会基础信息</div>
            <Form.Item
              name="topic"
              label="协会名称"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={100}
              />
            </Form.Item>
            <Form.Item
              name="weight"
              label="所属产业"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={60}
              />
            </Form.Item>
            <Form.Item
              name="weight"
              label="协会级别"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <Select placeholder="请选择" allowClear style={{ width: '200px' }}>
                <Select.Option value={0}>省级</Select.Option>
                <Select.Option value={1}>市级</Select.Option>
                <Select.Option value={1}>区县级</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="weight"
              label="所在区域"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={20}
              />
            </Form.Item>
            <Form.Item name="weight" label="协会介绍">
              <TextArea
                autoSize={{ minRows: 1, maxRows: 20 }}
                placeholder="请输入"
                maxLength={500}
              />
            </Form.Item>
            <Form.Item
              name="weight"
              label="官方logo"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <UploadForm
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                maxSize={5}
                accept=".png,.jpeg,.jpg"
                tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG</span>}
              />
            </Form.Item>
            <Form.Item name="weight" label="官方协会二维码">
              <UploadForm
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                maxSize={5}
                accept=".png,.jpeg,.jpg"
                tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG</span>}
              />
            </Form.Item>
            <Form.Item name="weight" label="爱企查对应地址">
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={20}
              />
            </Form.Item>
            <Form.Item name="weight" label="协会权重">
              <InputNumber
                min={1}
                max={100}
                placeholder="请输入1～100的整数，数字越大排名越靠前"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>
          <div className={sc('container-table-body')}>
            <div className={sc('container-table-body-title')}>联系信息</div>
            <Form.Item name="weight" label="联系人">
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={20}
              />
            </Form.Item>
            <Form.Item
              name="phone"
              label={`联系电话`}
              rules={[
                { required: true, message: '请输入' },
                {
                  pattern: phoneVerifyReg,
                  message: '请输入正确手机号',
                  validateTrigger: 'onBlur',
                },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                placeholder="请输入"
                autoComplete="off"
                allowClear
                maxLength={35}
              />
            </Form.Item>
            <Form.Item name="weight" label="联系地址">
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={100}
              />
            </Form.Item>
          </div>
        </Form>
        <Modal
          title={'内容选择'}
          visible={modalVisible}
          maskClosable={false}
          width={1200}
          onCancel={(e) => {
            console.log(e);
            setModalVisible(e);
          }}
          bodyStyle={{
            height: '500px',
            overflow: 'auto',
          }}
          centered
          destroyOnClose
          onOk={() => {
            if ([...selectRows].length === 0) {
              message.error(`至少勾选一个内容`);
            } else {
              queryByIds([...selectRowKeys]).then((res) => {
                if (res.code === 0) {
                }
              });
              setModalVisible(false);
            }
          }}
        />
      </div>
      <Modal
        visible={visible}
        title="提示"
        onCancel={() => {
          setVisible(false);
        }}
        footer={[
          <>
            <Button key="back" onClick={() => setVisible(false)}>
              取消
            </Button>
            <Button type={'primary'} key="submit" onClick={() => history.goBack()}>
              直接离开
            </Button>
          </>,
        ]}
      >
        <p>数据未保存，是否仍要离开当前页面？</p>
      </Modal>
      <Modal
        visible={visibleAdd}
        title="提示"
        onCancel={() => {
          setVisibleAdd(false);
        }}
        footer={[
          <Button key="back" onClick={() => setVisibleAdd(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {}}>
            保存
          </Button>,
        ]}
      >
        <p>确定当前内容更新到前台</p>
      </Modal>
    </PageContainer>
  );
};
