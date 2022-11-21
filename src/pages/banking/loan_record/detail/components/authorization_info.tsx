import './authorization_info.less';
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
} from 'antd';
import { UploadOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import UploadFormFile from '@/components/upload_form/upload-form-file';
import React, { useState, useEffect } from 'react';
import { routeName } from '@/../config/routes';
import { history } from 'umi';
import { getCreditDetail, updateCreditInfo } from '@/services/banking-loan';
import { regFenToYuan, regYuanToFen } from '@/utils/util';
import patchDownloadFile from '@/utils/patch-download-file';
import moment from 'moment';
export type Props = {
  isDetail?: boolean; //详情展示
  type?: number; // 数据来源
  id?: string; // 贷款记录id
  step?: string; //跳转页面
  toTab?: any; //跳转的tab函数
};
const { confirm } = Modal;
export default ({ isDetail, type, step, id, toTab }: Props) => {
  const previewType = ['png', 'jpg', 'jpeg', 'jpeg2000', 'pdf'];
  const [form] = Form.useForm();
  const busiStatus = Form.useWatch('busiStatus', form);
  const [detail, setDetail] = useState<any>(null);
  const onCancel = () => {
    history.goBack();
  };
  const toCreditApply = () => {
    history.push(`${routeName.LOAN_RECORD_ENTER}?id=${id}&type=${type}&step=${step}`);
  };
  const onOk = async () => {
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

        const res = await updateCreditInfo(data);
        if (res?.code == 0) {
          if (busiStatus === 2) {
            confirm({
              closable: true,
              title: '保存成功',
              icon: <CheckCircleTwoTone />,
              content: '授信信息录入成功。是否继续录入放款信息？',
              okText: '录入放款信息',
              cancelText: '返回列表',
              onOk() {
                toTab('3');
                // history.push(`${routeName.LOAN_RECORD_ENTER}?id=${id}&type=${type}&step=3`);
              },
              onCancel() {
                history.push(`${routeName.LOAN_RECORD}`);
              },
              afterClose() {
                console.log('afterClose');
              },
            });
          } else {
            history.push(`${routeName.LOAN_RECORD}`);
          }
        } else {
          message.error(res?.message || '授权信息保存失败');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getDetail = async () => {
    try {
      const { result, code } = await getCreditDetail({ id });
      if (code === 0) {
        if (result) {
          setDetail(result);
          if (!isDetail) {
            const { startDate, endDate, creditAmount, contractNo, rate, workProves, ...rest } =
              result;
            const creditTime = [moment(startDate), moment(endDate)];
            form.setFieldsValue({
              fileIds: workProves?.map((item: any) => {
                return {
                  name: item.name + '.' + item.format,
                  path: item.path,
                  uid: item.id,
                  format: item.format,
                };
              }),
              busiStatus: rest.busiStatus,
              rate,
              creditTime,
              creditAmount: Number(regFenToYuan(creditAmount)),
              contractNo,
            });
          }
        }
      } else {
        message.error(`获取授信信息失败`);
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
    return detail?.workProves?.map((file: any) => {
      console.log('file', file);
      return (
        <div key={file.uid} className="file-show">
          <span>
            {file.name}.{file.format}
          </span>
          {previewType.includes(file?.format) && (
            <Button
              type="link"
              style={{ padding: 0, height: 'auto' }}
              onClick={() => {
                window.open(file?.path);
              }}
            >
              预览
            </Button>
          )}
        </div>
      );
    });
  };
  const renderFooter: any = () => {
    if (!isDetail) {
      return (
        <div className="authorization-footer">
          <Space size={'middle'}>
            <Button key="cancel" onClick={onCancel}>
              返回
            </Button>
            <Button key="ensure" type="primary" onClick={onOk}>
              保存
            </Button>
          </Space>
        </div>
      );
    }
    return (
      <div className="authorization-footer">
        <Button key="cancel" onClick={onCancel}>
          返回
        </Button>
      </div>
    );
  };
  return isDetail && !detail ? (
    <div className="empty">
      <Empty description="暂无数据" />
      {type === 1 && (
        <Button className="empty-button" type="primary" onClick={toCreditApply}>
          去录入授信信息
        </Button>
      )}
    </div>
  ) : (
    <div className="authorization">
      <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} form={form}>
        <Form.Item
          name="busiStatus"
          label="授信状态"
          initialValue={2}
          rules={[{ required: !isDetail, message: '请选择授信状态' }]}
        >
          {isDetail ? (
            <span>{detail?.busiStatus || '--'}</span>
          ) : (
            <Radio.Group>
              <Radio value={2}>已授信</Radio>
              <Radio value={3} disabled={detail?.busiStatus === 2}>
                授信失败
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {busiStatus === 2 && (
          <>
            <Form.Item
              label="授信金额"
              name="creditAmount"
              rules={[{ required: !isDetail, message: '请输入授信金额' }]}
            >
              {isDetail ? (
                <span>{regFenToYuan(detail?.creditAmount) || '--'}万元</span>
              ) : (
                <InputNumber
                  placeholder="请输入"
                  addonAfter="万元"
                  precision={2}
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
            <Form.Item
              label="授信有效期"
              name="creditTime"
              rules={[{ required: !isDetail, message: '请选择授信有效期' }]}
            >
              {isDetail ? (
                <span>
                  {detail?.startDate} 至 {detail?.endDate}
                </span>
              ) : (
                <DatePicker.RangePicker allowClear style={{ width: '100%' }} />
              )}
            </Form.Item>
            <Form.Item name="contractNo" label="合同编号">
              {isDetail ? (
                <span>{detail?.contractNo || '--'}</span>
              ) : (
                <Input placeholder="请输入授信环节合同编号" />
              )}
            </Form.Item>
            <Form.Item name="rate" label="参考年利率">
              {isDetail ? (
                <span>{detail?.rate || '--'}%</span>
              ) : (
                <InputNumber
                  placeholder="请输入"
                  precision={2}
                  addonAfter="%"
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </>
        )}
        {busiStatus === 3 && (
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
        {/* 人工录入有业务凭证 */}
        {type === 1 && (
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
                  style={{ padding: 0, height: '32px' }}
                  onClick={() => {
                    patchDownloadFile(
                      detail.workProves,
                      `授信信息凭证${moment().format('YYYYMMDD')}`,
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
                <div style={{ fontSize: '12px' }}>
                  上传金融机构授信反馈，支持30M以内的图片、word、Excel或pdf文件
                </div>
              </UploadFormFile>
            )}
          </Form.Item>
        )}
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
      {renderFooter()}
    </div>
  );
};
