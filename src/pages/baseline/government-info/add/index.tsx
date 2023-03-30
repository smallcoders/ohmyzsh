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
import { PlusOutlined } from '@ant-design/icons';
const sc = scopedClasses('baseline-government-add');

export default () => {
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [types, setTypes] = useState<any[]>([]);
  const [isHOt, setIsHot] = useState<boolean>(false);
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
              <Link to="/baseline/baseline-government-manage">政府信息配置 </Link>
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
      <div className={sc('container-table-body')}>
        <Form
          {...formLayout}
          form={form}
          onValuesChange={() => {
            setFormIsChange(true);
          }}
        >
          <Form.Item
            name="name"
            label="政府服务部门名称"
            rules={[
              {
                required: true,
                message: `必填`,
              },
            ]}
          >
            <TextArea autoSize={{ minRows: 1, maxRows: 10 }} placeholder="请输入" maxLength={100} />
          </Form.Item>
          <Form.Item
            name="nameShort"
            label="服务部门简称"
            rules={[
              {
                required: true,
                message: `必填`,
              },
            ]}
          >
            <TextArea autoSize={{ minRows: 1, maxRows: 10 }} placeholder="请输入" maxLength={60} />
          </Form.Item>
          <Form.Item name="govId" label="id">
            <TextArea autoSize={{ minRows: 1, maxRows: 10 }} placeholder="请输入" maxLength={20} />
          </Form.Item>
          <Form.Item name="govUuid" label="uuid">
            <TextArea autoSize={{ minRows: 1, maxRows: 10 }} placeholder="请输入" maxLength={20} />
          </Form.Item>
          <Form.Item
            name="districtCodeType"
            label="级别"
            rules={[
              {
                required: true,
                message: `必填`,
              },
            ]}
          >
            <Select placeholder="请选择" allowClear style={{ width: '100%' }}>
              <Select.Option value={0}>未知</Select.Option>
              <Select.Option value={1}>省级</Select.Option>
              <Select.Option value={2}>市级</Select.Option>
              <Select.Option value={3}>区县级</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="areaCode"
            label="所在区域"
            rules={[
              {
                required: true,
                message: `必填`,
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="aboutUs" label="部门介绍">
            <TextArea autoSize={{ minRows: 1, maxRows: 30 }} placeholder="请输入" maxLength={500} />
          </Form.Item>
          <Form.Item
            name="serviceUrl"
            label="在线办理h5地址"
            rules={[
              {
                required: true,
                message: `必填`,
              },
            ]}
          >
            <TextArea autoSize={{ minRows: 1, maxRows: 10 }} placeholder="请输入" maxLength={20} />
          </Form.Item>
          <Form.Item
            name="hot"
            label="是否热门"
            rules={[
              {
                required: true,
                message: `必填`,
              },
            ]}
          >
            <Switch
              checkedChildren="热门"
              unCheckedChildren="否"
              style={{ marginRight: 20 }}
              onChange={(e) => {
                console.log(e);
                setIsHot(true);
              }}
            />
          </Form.Item>
          {isHOt && (
            <>
              <Form.Item name="weight" label="热门部门权重">
                <InputNumber
                  min={1}
                  max={100}
                  placeholder="请输入1～100的整数，数字越大排名越靠前"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.List name="hotService">
                {(fields, { add, remove }) => (
                  <>
                    <Form.Item name="top" label="热门服务">
                      <Button
                        style={{ margin: '10px 0' }}
                        type="primary"
                        disabled={fields.length >= 20}
                        key="addStyle1"
                        onClick={() => add()}
                      >
                        <PlusOutlined /> 新增
                      </Button>
                    </Form.Item>
                    {fields.map((field, index) => (
                      <Card
                        key={field.key}
                        title={`服务${index + 1}`}
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
                          name={[field.name, 'name']}
                          label="服务名称"
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
                            maxLength={20}
                          />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'serviceUrl']}
                          label="服务h5地址"
                          rules={[
                            {
                              required: true,
                              message: `必填`,
                            },
                          ]}
                        >
                          <TextArea autoSize={{ minRows: 2, maxRows: 10 }} placeholder="请输入" />
                        </Form.Item>
                        <Form.Item name={[field.name, 'weight']} label="服务权重">
                          <InputNumber
                            min={1}
                            max={100}
                            placeholder="请输入1～100的整数，数字越大排名越靠前"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Card>
                    ))}
                  </>
                )}
              </Form.List>
            </>
          )}
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
            {/*{detail?.state !== 'ON_SHELF' && (*/}
            {/*  <Button*/}
            {/*    key="submit"*/}
            {/*    type="primary"*/}
            {/*    onClick={() => {*/}
            {/*      addRecommend(false);*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    暂存并离开*/}
            {/*  </Button>*/}
            {/*)}*/}
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
