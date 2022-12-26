import '../authorization_info.less';
import {
  Button,
  Space,
  Form,
  Radio,
  InputNumber,
  DatePicker,
  Input,
  Empty,
  message,
  Modal,
  Spin,
} from 'antd';
import { UploadOutlined, CheckCircleTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import { FooterToolbar } from '@ant-design/pro-components';
import UploadFormFile from '@/components/upload_form/upload-form-file';
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { routeName } from '@/../config/routes';
import { history, Prompt } from 'umi';
import { getCreditDetail, updateInsurance, getTakeMoneyDetail } from '@/services/banking-loan';
import { regFenToYuan, regYuanToFen, customToFixed } from '@/utils/util';
import patchDownloadFile from '@/utils/patch-download-file';
import type BankingLoan from '@/types/banking-loan.d';
import moment from 'moment';
export type Props = {
  isDetail?: boolean; //详情展示
  type?: number; // 数据来源
  id?: string; // 贷款记录id
  step?: string; //跳转页面
  toTab?: any; //跳转的tab函数
  left?: number; //距离左侧距离
  loanType?: string; // 贷款类型 1-贷款，3-租赁，5-保险
};
const { confirm } = Modal;
export default forwardRef((props: Props, ref) => {
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [hasSuccessLoad, setHasSuccessLoad] = useState<boolean>(false);
  const { isDetail, type, step, id, toTab, left, loanType } = props;
  const previewType = ['png', 'jpg', 'jpeg', 'jpeg2000', 'pdf'];
  const [form] = Form.useForm();
  const busiStatus = Form.useWatch('busiStatus', form);
  const [detail, setDetail] = useState<BankingLoan.CreditInfoContent>();
  const [formIsChange, setFormIsChange] = useState<boolean>(false);
  const [afterSaveVisible, setAfterSaveVisible] = useState<boolean>(false);
  const toCreditApply = () => {
    history.push(
      `${routeName.INSURANCE_RECORD_ENTER}?id=${id}&type=${type}&step=${step}&loanType=${loanType}`,
    );
  };
  const onOk = async (cb: any) => {
    form
      .validateFields()
      .then(async (values) => {
        const { fileIds, creditTime, creditAmount, ...rest } = values;
        const data = {
          id,
          workProve: fileIds?.map((p: any) => p?.uid).join(','),
          ...rest,
          creditAmount: regYuanToFen(creditAmount),
        };
        if (creditTime) {
          data.startDate = creditTime[0].format('YYYY-MM-DD');
          data.endDate = creditTime[1].format('YYYY-MM-DD');
        }

        const res = await updateInsurance(data);
        if (res?.code == 0) {
          setFormIsChange(false);
          if (cb) {
            message.success({
              content: `保存成功`,
              duration: 1,
              onClose: () => {
                cb();
              },
            });
          } else {
            if (busiStatus === 9) {
              setAfterSaveVisible(true);
            } else {
              message.success({
                content: `保存成功`,
                duration: 2,
                onClose: () => {
                  history.push(`${routeName.INSURANCE_RECORD}`);
                },
              });
            }
          }
        } else {
          message.error(res?.message || '授信信息保存失败');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onCancel = (cb: any) => {
    if (formIsChange) {
      confirm({
        title: '要在离开之前对填写的信息进行保存吗?',
        icon: <ExclamationCircleOutlined />,
        cancelText: '放弃修改并离开',
        okText: '保存',
        onCancel() {
          if (cb) {
            cb();
          } else {
            history.goBack();
          }
        },
        onOk() {
          onOk(cb);
        },
      });
    } else {
      history.goBack();
    }
  };
  useImperativeHandle(ref, () => ({
    formIsChange: formIsChange,
    cancelEdit: onCancel,
  }));
  const afterSaveModel = () => {
    return (
      <Modal
        visible={afterSaveVisible}
        title={
          <>
            <CheckCircleTwoTone style={{ marginRight: '10px' }} />
            保存成功
          </>
        }
        onCancel={() => setAfterSaveVisible(false)}
        // icon={<CheckCircleTwoTone />}
        footer={[
          <Button key="back" onClick={() => history.push(`${routeName.INSURANCE_RECORD}`)}>
            返回列表
          </Button>,
          <Button key="submit" type="primary" onClick={() => toTab('6')}>
            录入对接信息
          </Button>,
        ]}
      >
        <p>授信信息录入成功。是否继续录入对接信息？</p>
      </Modal>
    );
  };
  const getDetail = async () => {
    try {
      setDetailLoading(true);
      const { result, code } = await getCreditDetail({ id });
      if (code === 0) {
        setDetail(result);
        if (result) {
          if (!isDetail) {
            const {
              startDate,
              endDate,
              creditAmount,
              contractNo,
              rate,
              checkProves,
              refuseReason,
              ...rest
            } = result;
            const creditTime = startDate ? [moment(startDate), moment(endDate)] : [];
            form.setFieldsValue({
              fileIds: checkProves?.map((item: BankingLoan.workProves) => {
                return {
                  name: item.name + '.' + item.format,
                  path: item.path,
                  uid: item.id,
                  format: item.format,
                };
              }),
              busiStatus: rest.busiStatus !== 8 && rest.busiStatus !== 7 ? 9 : rest.busiStatus,
              rate,
              creditTime,
              creditAmount: creditAmount === null ? null : Number(regFenToYuan(creditAmount)),
              contractNo,
              refuseReason,
            });
            // // 获取放款成功信息
            // getLoanInfo();
          } else {
            form.setFieldsValue({
              busiStatus: result.busiStatus,
            });
          }
        }
      } else {
        message.error(`获取审核信息失败`);
      }
      setDetailLoading(false);
    } catch (error) {
      console.log(error);
      setDetailLoading(false);
    }
  };
  const getLoanInfo = async () => {
    try {
      const { result, code } = await getTakeMoneyDetail({
        pageIndex: 1,
        pageSize: 10,
        creditId: id,
      });
      if (code === 0) {
        if (
          result?.takeMoneyInfo?.some(
            (item: BankingLoan.TakeMoneyInfoContent) => item.status == '放款成功',
          )
        ) {
          setHasSuccessLoad(true);
        } else {
          setHasSuccessLoad(false);
        }
      } else {
        message.error(`放款判断失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // prepare();
    getDetail();
  }, []);
  const showfile = () => {
    const imgList = detail?.checkProves?.filter(
      (item) => previewType.includes(item.format) && item.format !== 'pdf',
    );
    const fileList = detail?.checkProves?.filter(
      (item) => !(previewType.includes(item.format) && item.format !== 'pdf'),
    );
    return (
      <>
        {!!imgList?.length && (
          <div className="file-img">
            {imgList?.map((file: BankingLoan.workProves) => {
              return (
                <div className="file-img-item">
                  <img width={30} src={file?.path} className="file-img-item-img" />
                  <div className="file-img-item-name">
                    {file.name}.{file.format}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {fileList?.map((file: BankingLoan.workProves) => {
          return (
            <div key={file.uid} className="file-show">
              {file?.format === 'pdf' ? (
                <Button
                  type="link"
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => {
                    window.open(file?.path);
                  }}
                >
                  {file.name}.{file.format}
                </Button>
              ) : (
                <span>
                  {file.name}.{file.format}
                </span>
              )}
            </div>
          );
        })}
      </>
    );
  };
  const renderFooter = () => {
    if (!isDetail) {
      return (
        <Space size={'large'}>
          <Button key="cancel" onClick={() => onCancel(null)}>
            返回
          </Button>
          <Button key="ensure" type="primary" onClick={() => onOk()}>
            保存
          </Button>
        </Space>
      );
    }
    return (
      <Button key="cancel" onClick={() => onCancel(null)}>
        返回
      </Button>
    );
  };
  return isDetail && (!detail || detail.busiStatus === 7) ? (
    <Spin spinning={detailLoading}>
      <div className="empty">
        <Empty description="暂无数据" />
        <Button className="empty-button" type="primary" onClick={toCreditApply}>
          去录入审核信息
        </Button>
      </div>
    </Spin>
  ) : (
    <Spin spinning={detailLoading}>
      <div className={`authorization ${isDetail ? 'detail' : ''}`}>
        <Form
          size="large"
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          form={form}
          onValuesChange={() => {
            console.log('onValuesChange');
            setFormIsChange(true);
          }}
        >
          <Form.Item
            name="busiStatus"
            label="审核状态"
            initialValue={9}
            rules={[{ required: !isDetail, message: '请选择审核状态' }]}
          >
            {isDetail ? (
              <span>{detail?.busiStatus === 8 ? '审核失败' : '审核成功'}</span>
            ) : (
              <Radio.Group>
                <Radio value={9}>审核成功</Radio>
                <Radio value={8} disabled={hasSuccessLoad}>
                  审核失败
                </Radio>
              </Radio.Group>
            )}
          </Form.Item>
          {busiStatus === 8 && (
            <>
              <Form.Item name="refuseReason" label="失败原因">
                {isDetail ? (
                  <span>{detail?.refuseReason || '--'}</span>
                ) : (
                  <Input.TextArea rows={4} placeholder="请输入" showCount maxLength={300} />
                )}
              </Form.Item>
            </>
          )}
          <Form.Item
            name="fileIds"
            label="业务凭证"
            rules={[{ required: !isDetail, message: '请上传业务凭证' }]}
            // extra="上传金融机构授信反馈，支持30M以内的图片、word、Excel或pdf文件"
          >
            {isDetail ? (
              <>
                <Button
                  type="link"
                  style={{ padding: 0, height: '24px', marginBottom: '16px' }}
                  onClick={() => {
                    patchDownloadFile(
                      detail?.checkProves,
                      `审核信息凭证${moment().format('YYYYMMDD')}`,
                    );
                  }}
                >
                  下载凭证
                </Button>
                {showfile()}
              </>
            ) : (
              <UploadFormFile
                multiple
                accept=".png,.jpg,.pdf,.xlsx,.xls,.doc"
                showUploadList={true}
                maxSize={30}
              >
                <Button icon={<UploadOutlined />}>上传文件</Button>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#8290A6',
                    marginTop: '12px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  上传金融机构授信反馈，支持30M以内的图片、word、Excel或pdf文件
                </div>
              </UploadFormFile>
            )}
          </Form.Item>
          {isDetail && (
            <Form.Item
              name="bisDataSource"
              label="数据来源"
              // extra="上传金融机构授信反馈，支持30M以内的图片、word、Excel或pdf文件"
            >
              <span>{detail?.bisDataSource}</span>
            </Form.Item>
          )}
        </Form>
        <FooterToolbar
          style={{
            height: '88px',
            left: left + 'px',
            width: `calc(100% - ${left}px)`,
          }}
        >
          {renderFooter()}
        </FooterToolbar>
        {/* <div className="loan-footer">{renderFooter()}</div> */}
        {afterSaveModel()}
        <Prompt
          when={formIsChange}
          // when={isClosejumpTooltip && topApps.length > 0}
          message={(location) => {
            confirm({
              title: '要在离开之前对填写的信息进行保存吗?',
              icon: <ExclamationCircleOutlined />,
              cancelText: '放弃修改并离开',
              okText: '保存',
              onCancel() {
                console.log(location);
                setFormIsChange(false);
                setTimeout(() => {
                  history.push(location.pathname);
                }, 1000);
              },
              onOk() {
                onOk(() => {
                  setFormIsChange(false);
                  setTimeout(() => {
                    history.push(location.pathname);
                  }, 1000);
                });
              },
            });
            return false;
          }}
        />
      </div>
    </Spin>
  );
});
