import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { Button, DatePicker, Form, Input, InputNumber, message, Radio, Table, Tag, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { queryDiagnoseDetail } from '@/services/financial-diagnostic-record';
import type DiagnosticRecord from '@/types/financial-diagnostic-record';
import './index.less';
import UploadFormFile from '@/components/upload_form/upload-form-file';
import { UploadOutlined } from '@ant-design/icons';
const sc = scopedClasses('demand-page');
export default () => {
  const history = useHistory();
  const { id } = (history.location as any)?.query;
  const [form] = Form.useForm();
  const [status, setStatus] = useState<number>(0)
  const [recordResult1, setRecordResult1] = useState<DiagnosticRecord.DiagnoseRecord>({});
  const [recordResult2, setRecordResult2] = useState<DiagnosticRecord.OrgAssets[]>([]);
  const getDiagnoseDetailInfo = async () => {
    try {
      const { code, result } = await queryDiagnoseDetail(id);
      if (code === 0) {
        const { diagnoseRecord, orgAssets } = result;
        setRecordResult1(diagnoseRecord || {});
        setRecordResult2(orgAssets || []);
      } else {
        message.error('诊断详情获取失败');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDiagnoseDetailInfo();
    form.setFieldsValue({
      fileIds: [
        {
          uid: '1678763736000001',
          name: 'xxx.png',
          status: 'done',
          url: `/antelope-common/common/file/download/1678763736000001`,
        },
        {
          uid: '1678763771000001',
          name: 'yyy.png',
          status: 'done',
          url: `/antelope-common/common/file/download/1678763771000001`,
        },
      ]
    })
  }, []);
  const column1 = [
    {
      title: '资产类型',
      dataIndex: 'typeContent',
      key: 'typeContent',
      width: 240,
    },
    {
      title: '购置成本(万元)',
      dataIndex: 'cost',
      key: 'cost',
      width: 240,
      render: (cost: number) => {
        return cost ? (cost / 1000000).toFixed(2) : '--';
      },
    },
    {
      title: '购置时间',
      dataIndex: 'buyTime',
      key: 'buyTime',
      width: 240,
    },
    {
      title: '贷款是否结清',
      dataIndex: 'clear',
      key: 'clear',
      width: 240,
      render: (clear: boolean) => {
        return clear ? '已结清' : '未结清';
      },
    },
  ];
  const quality = [
    { value: '1', name: '规上企业' },
    { value: '2', name: ' 高新技术企业 ' },
    { value: '3', name: '科技型中小企业' },
    { value: '4', name: '民营科技企业' },
    { value: '5', name: ' 专精特新企业' },
  ];
  return (
    <PageContainer
      className={sc()}
      ghost
      footer={[
        <Button size="large" onClick={() => history.goBack()}>
          返回
        </Button>,
        <Button type="primary" size="large" onClick={() => history.goBack()}>
          保存
        </Button>,
      ]}
    >
      <div className={sc('content')}>
        <div className={sc('content-item')}>
          <div className={sc('content-item-title')}>企业融资需求</div>
          <div className={sc('content-item-body')}>
            <div className={sc('content-item-body-item')}>
              <div className={sc('content-item-body-item-label')}>拟融资金额：</div>
              <div className={sc('content-item-body-item-wrap')}>
                {recordResult1?.amount
                  ? (recordResult1?.amount / 1000000).toFixed(2) + '万元'
                  : '--'}
              </div>
            </div>
            <div className={sc('content-item-body-item')}>
              <div className={sc('content-item-body-item-label')}>拟融资期限：</div>
              <div className={sc('content-item-body-item-wrap')}>
                {recordResult1?.term ? recordResult1.term + '个月' : '--'}
              </div>
            </div>
            {
              recordResult1?.type !== 1 &&
              <>
                <div className={sc('content-item-body-item')}>
                  <div className={sc('content-item-body-item-label')}>融资用途：</div>
                  <div className={sc('content-item-body-item-wrap')}>
                    {recordResult1?.purpose && recordResult1?.purpose !== 1000000
                      ? recordResult1?.purposeContent + `${recordResult1?.purposeRemark ? '_' + recordResult1?.purposeRemark : ''}`
                      : recordResult1?.purposeContent || '--'}
                  </div>
                </div>
                <div className={sc('content-item-body-item')}>
                  <div className={sc('content-item-body-item-label')}>资金需求紧迫度：</div>
                  <div className={sc('content-item-body-item-wrap')}>
                    {recordResult1?.urgency && {1: '急需解决资金问题/近期有融资计划', 2: '希望获得产品推介/近期无融资计划'}[recordResult1?.urgency] || '--'}
                  </div>
                </div>
                <div className={sc('content-item-body-item')}>
                  <div className={sc('content-item-body-item-label')}>期望资金到账时间：</div>
                  <div className={sc('content-item-body-item-wrap')}>
                    {recordResult1?.urgencyRemark || '--'}
                  </div>
                </div>
                <div className={sc('content-item-body-item')}>
                  <div className={sc('content-item-body-item-label')}>企业上一年营收规模：</div>
                  <div className={sc('content-item-body-item-wrap')}>
                    {recordResult1?.revenueContent || '--'}
                  </div>
                </div>
                <div className={sc('content-item-body-item')}>
                  <div className={sc('content-item-body-item-label')}>企业资质：</div>
                  <div className={sc('content-item-body-item-wrap')}>
                    {recordResult1?.qualification
                      ? recordResult1.qualification.split(',').map((item) => {
                        return (
                          <Tag key={item} color="default">
                            {quality[Number(item) - 1].name}
                          </Tag>
                        );
                      })
                      : '--'}
                  </div>
                </div>
                <div className={sc('content-item-body-item')}>
                  <div className={sc('content-item-body-item-label')}>企业资产信息：</div>
                </div>
                <div className={sc('content-item-body-item')}>
                  <div className={sc('content-item-body-item-table')}>
                    <Table dataSource={recordResult2} columns={column1} pagination={false} />
                  </div>
                </div>
              </>
            }
          </div>
        </div>
        <div className={sc('content-item')}>
          <div className={sc('content-item-title')}>需求跟进信息</div>
          <div className={sc('content-item-body')}>
            <Form
              size="large"
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 8 }}
              form={form}
            >
              <Form.Item
                name="busiStatus"
                label="授信状态"
                initialValue={0}
                rules={[{ required: true, message: '请选择授信状态' }]}
              >
                <Radio.Group
                  onChange={(e) => {
                    setStatus(e.target.value)
                  }}
                  style={{whiteSpace: 'nowrap'}}
                  value={status}
                  options={[
                    {
                      value: 0,
                      label: '待跟进',
                    }, {
                      value: 1,
                      label: '已反馈至金融机构',
                    }, {
                      value: 2,
                      label: '已授信',
                    }, {
                      value: 3,
                      label: '授信失败',
                    }
                  ]}
                >
                </Radio.Group>
              </Form.Item>
              {
                (status === 1 || status === 2) &&
                <Form.Item
                  label="金融机构"
                  name="bank"
                  rules={[{ required: true, message: '请选择金融机构' }]}
                >
                  <Select placeholder='请选择金融机构' options={[]} />
                </Form.Item>
              }
              {
                status === 2 &&
                <Form.Item
                  label="金融产品"
                  name="product"
                  rules={[{ required: true, message: '请选择金融产品' }]}
                >
                  <Select placeholder='请选择金融产品' options={[]} />
                </Form.Item>
              }
              {status === 2 && (
                <>
                  <Form.Item
                    label="授信金额"
                    name="creditAmount"
                    rules={[{ required: true, message: '请输入授信金额' }]}
                  >
                    <InputNumber
                      placeholder="请输入"
                      addonAfter="万元"
                      precision={2}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="授信有效期"
                    name="creditTime"
                    rules={[{ required: true, message: '请选择授信有效期' }]}
                  >
                    <DatePicker.RangePicker allowClear style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="contractNo" label="合同编号">
                    <Input placeholder="请输入授信环节合同编号" />
                  </Form.Item>
                  <Form.Item
                    name="rate"
                    label="参考年利率"
                    rules={[
                      {
                        pattern: /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/,
                        message: '仅支持输入2位小数',
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="请输入"
                      addonAfter="%"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </>
              )}
              {status === 3 && (
                <>
                  <Form.Item name="refuseReason" label="失败原因">
                    <Input.TextArea rows={4} placeholder="请输入" showCount maxLength={300} />
                  </Form.Item>
                </>
              )}
              {
                (status === 3 || status === 2) &&
                <Form.Item
                  name="fileIds"
                  label="业务凭证"
                  rules={[{ required: true, message: '请上传业务凭证' }]}
                >
                  <UploadFormFile
                    multiple
                    accept=".png,.jpg,.pdf,.xlsx,.xls,.doc"
                    showUploadList={true}
                    maxSize={30}
                    onChange={(values) => {
                      console.log(values)
                    }}
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
                </Form.Item>
              }
            </Form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
