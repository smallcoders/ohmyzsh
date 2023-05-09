import {
  Breadcrumb,
  Button,
  Form,
  Input,
  message as antdMessage,
  Modal,
  Radio,
  Select,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { history, Link } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { UploadOutlined } from '@ant-design/icons';
import { routeName } from '../../../../../config/routes';
import {
  addContentStreamAd,
  auditImgs,
  getAdvertiseAudit,
  getAllLayout,
  getGlobalFloatAdDetail,
  getPartLabels,
} from '@/services/baseline';
import UploaImageV2 from '@/components/upload_form/upload-image-v2';

const sc = scopedClasses('content-stream-ad-add');
const { TextArea } = Input;
const allLabels = [
  {
    label: '全部用户',
    value: 'ALL_USER',
  },
  {
    label: '全部登录用户',
    value: 'ALL_LOGIN_USER',
  },
  {
    label: '全部未登录用户',
    value: 'ALL_NOT_LOGIN_USER',
  },
];
export default () => {
  const [loading, setLoading] = useState<any>(false);
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { id } = history.location.query as { id: string | undefined };
  const [partLabels, setPartLabels] = useState<any>([]);
  const [userType, setUserType] = useState<any>('all');
  const [layType, setLayType] = useState<any>([]);

  const [pageInfo, setPageInfo] = useState<any>({ pageSize: 10, pageIndex: 1, pageTotal: 0 });
  useEffect(() => {
    if (id) {
      setLoading(true);
      getGlobalFloatAdDetail(id)
        .then((res) => {
          const { result, code, message: resultMsg } = res || {};
          if (code === 0) {
            setUserType(result.scope !== 'PORTION_USER' ? 'all' : 'part');
            form.setFieldsValue({
              advertiseName: result.advertiseName,
              displayOrder: result?.displayOrder,
              labelIds: result.scope === 'PORTION_USER' ? result.labelIds : result.scope,
              siteLink: result.siteLink,
              userType: result.scope !== 'PORTION_USER' ? 'all' : 'part',
              imgs: result.imgRelations?.length
                ? result.imgRelations?.map((item: any) => {
                    return {
                      uid: `${item.fileId}`,
                      name: item.ossUrl,
                      status: 'done',
                      url: item.ossUrl,
                    };
                  })
                : [],
              disPlayTaps: result.articleTypes?.length
                ? result.articleTypes?.map((item: any) => {
                    return {
                      value: item.id,
                      label: item.typeName,
                    };
                  })
                : [],
            });
          } else {
            antdMessage.error(`请求失败，原因:{${resultMsg}}`);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      form.setFieldsValue({ userType: 'all' });
    }
    getPartLabels({ ...pageInfo }).then((res) => {
      if (res.code === 0 && res.result) {
        const labelArr = res.result.map((item: any) => {
          return {
            value: item.id,
            label: item.labelName,
          };
        });
        setPageInfo({
          ...pageInfo,
          pageTotal: Math.ceil(res.totalCount / pageInfo.pageSize),
        });
        setPartLabels(labelArr);
      }
    });
    getAllLayout().then((res) => {
      if (res.code === 0 && res.result) {
        const labelArr = res.result.map((item: any) => {
          return {
            value: item.id,
            label: item.typeName,
          };
        });
        setLayType(labelArr);
      }
    });
  }, []);

  const handleSubmit = async (status: any) => {
    if (status === 1) await form.validateFields();
    const { advertiseName, imgs, siteLink, labelIds, displayOrder, disPlayTaps } =
      form.getFieldsValue();
    console.log(disPlayTaps, 'disPlayTaps');

    const params: any = {
      displayOrder,
      advertiseName,
      siteLink,
      imgs:
        imgs && imgs?.length
          ? imgs.map((item: any) => {
              return { path: item.url, id: item.resData?.id || item.uid };
            })
          : imgs,
      disPlayTaps:
        disPlayTaps && disPlayTaps[0]?.value
          ? disPlayTaps.map((item: any) => {
              return item.value;
            })
          : disPlayTaps,
      scope: userType === 'all' ? labelIds : 'PORTION_USER',
      labelIds: userType === 'all' ? [] : [...labelIds],
      advertiseType: 'CONTENT_STREAM_ADS',
      status,
    };
    if (id) {
      params.id = parseInt(id);
    }
    if (status === 1) {
      Modal.confirm({
        title: '提示',
        content: '确定上架当前内容？',
        okText: '上架',
        onOk: () => {
          setLoading(true);
          getAdvertiseAudit({ content: params.advertiseName }).then((res: any) => {
            if (res.result) {
              Modal.confirm({
                title: '风险提示',
                content: res.result,
                okText: '继续上架',
                onOk: () => {
                  addContentStreamAd(params)
                    .then((res1) => {
                      if (res.code === 0) {
                        setFormIsChange(false);
                        history.push(
                          `${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD}`,
                        );
                        antdMessage.success('上架成功');
                      } else {
                        antdMessage.error(res1.message);
                      }
                      setLoading(false);
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                },
              });
            } else {
              if (params.imgs) {
                auditImgs({
                  ossUrls: params.imgs.map((item: any) => {
                    return item.path;
                  }),
                })
                  .then((result) => {
                    if (result.code === 0) {
                      addContentStreamAd(params)
                        .then((res) => {
                          if (res.code === 0) {
                            setFormIsChange(false);
                            history.push(
                              `${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD}`,
                            );
                            antdMessage.success('上架成功');
                          } else {
                            console.log(43214312);
                            antdMessage.error(res.message);
                          }
                          setLoading(false);
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    } else {
                      Modal.confirm({
                        title: '风险提示',
                        content: result.message,
                        okText: '继续上架',
                        onOk: () => {
                          addContentStreamAd(params)
                            .then((res) => {
                              if (res.code === 0) {
                                setFormIsChange(false);
                                history.push(
                                  `${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD}`,
                                );
                                antdMessage.success('上架成功');
                              } else {
                                antdMessage.error(res.message);
                              }
                              setLoading(false);
                            })
                            .finally(() => {
                              setLoading(false);
                            });
                        },
                      });
                    }
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              } else {
                addContentStreamAd(params).then((res) => {
                  if (res.code === 0) {
                    setFormIsChange(false);
                    setLoading(false);
                    history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD}`);
                    antdMessage.success('上架成功');
                  } else {
                    antdMessage.error(res.message);
                  }
                });
              }
            }
          });
        },
      });
    } else {
      addContentStreamAd(params)
        .then((res) => {
          if (res.code === 0) {
            setFormIsChange(false);
            antdMessage.success('暂存成功');
            history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD}`);
          } else {
            antdMessage.error(res.message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getLabels = (pageIndex: number) => {
    getPartLabels({ pageIndex, pageSize: pageInfo.pageSize })
      .then((res) => {
        if (res.code === 0 && res.result) {
          const labelArr = res.result.map((item: any) => {
            return {
              value: item.id,
              label: item.labelName,
            };
          });
          setPageInfo({
            ...pageInfo,
            pageTotal: Math.ceil(res.result.totalCount / pageInfo.pageSize),
          });
          setPartLabels(partLabels.concat(labelArr));
        } else {
          setPageInfo({
            ...pageInfo,
            pageIndex: pageInfo.pageIndex - 1,
          });
        }
      })
      .catch(() => {
        setPageInfo({
          ...pageInfo,
          pageIndex: pageInfo.pageIndex - 1,
        });
      });
  };

  return (
    <PageContainer
      className={sc('page')}
      ghost
      header={{
        title: id ? `编辑` : '新增',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline-operations-management">基线运营位管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/baseline-operations-management/content-stream-ad/index">
                内容流广告管理
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? `编辑` : '新增'}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        <>
          <Button
            type="primary"
            onClick={() => {
              handleSubmit(1);
            }}
          >
            立即上架
          </Button>
          <Button
            onClick={() => {
              handleSubmit(0);
            }}
          >
            暂存
          </Button>
          <Button
            onClick={() => {
              if (formIsChange) {
                setVisible(true);
              } else {
                history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD}`);
              }
            }}
          >
            返回
          </Button>
        </>,
      ]}
    >
      <Form
        className={sc('container-form')}
        form={form}
        onValuesChange={() => {
          setFormIsChange(true);
        }}
      >
        <div className="title">内容流广告信息</div>
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          name="advertiseName"
          label="内容标题"
          required
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <TextArea autoSize={{ minRows: 1, maxRows: 10 }} placeholder="请输入" maxLength={100} />
        </Form.Item>
        <Form.Item
          name="imgs"
          label="图片"
          extra="图片格式仅支持JPG、PNG、JPEG，图片尺寸312*234"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          <UploaImageV2 multiple={true} accept=".png,.jpeg,.jpg" maxCount={3}>
            <Button icon={<UploadOutlined />}>上传</Button>
          </UploaImageV2>
        </Form.Item>
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          name="siteLink"
          label="站内链接配置"
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          name="disPlayTaps"
          label="版面"
          required
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <Select options={layType} mode={'multiple'} placeholder="请选择" />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          name="displayOrder"
          label="位置"
          required
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <Input type="number" placeholder="请输入" />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          name="userType"
          label="作用范围"
          required
          rules={[
            {
              required: true,
              message: '必选',
            },
          ]}
        >
          <Radio.Group
            onChange={(e) => {
              form.setFieldsValue(
                e.target.value === 'all' ? { labelIds: undefined } : { labelIds: [] },
              );
              setUserType(e.target.value);
            }}
            options={[
              { label: '全部用户', value: 'all' },
              { label: '部分用户', value: 'part' },
            ]}
          />
        </Form.Item>
        {form.getFieldValue('userType') === 'part' && (
          <Form.Item
            wrapperCol={{ offset: 4, span: 12 }}
            name="labelIds"
            required
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: '必选',
              },
            ]}
          >
            <Select
              options={partLabels}
              mode={'multiple'}
              placeholder="请选择"
              onPopupScroll={() => {
                if (pageInfo.pageTotal > pageInfo.pageIndex) {
                  const pageIndex = pageInfo.pageIndex + 1;
                  setPageInfo({ ...pageInfo, pageIndex });
                  getLabels(pageIndex);
                }
              }}
            />
          </Form.Item>
        )}
        {form.getFieldValue('userType') === 'all' && (
          <Form.Item
            wrapperCol={{ offset: 4, span: 12 }}
            name="labelIds"
            required
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: '必选',
              },
            ]}
          >
            <Select options={allLabels} placeholder="请选择" />
          </Form.Item>
        )}
      </Form>
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
            <Button
              type={'default'}
              key="submit"
              onClick={() =>
                history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD}`)
              }
            >
              直接离开
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                handleSubmit(0);
              }}
            >
              暂存并离开
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
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              handleSubmit(1);
            }}
          >
            上架
          </Button>,
        ]}
      >
        <p>确定上架当前内容？</p>
      </Modal>
    </PageContainer>
  );
};
