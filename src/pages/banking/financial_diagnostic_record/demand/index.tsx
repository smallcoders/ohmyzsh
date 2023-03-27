import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { Button, DatePicker, Form, Input, InputNumber, message, Radio, Table, Tag, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { customToFixed } from '@/utils/util';
import { queryDemandDetail, setDemandCredit } from '@/services/financial-diagnostic-record';
import {
  queryBank,
  getProduct,
} from '@/services/financial_data_overview';
import type DiagnosticRecord from '@/types/financial-diagnostic-record';
import './index.less';
import UploadFormFile from '@/components/upload_form/upload-form-file';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
const sc = scopedClasses('demand-page');
export default () => {
  const history = useHistory();
  const { id } = (history.location as any)?.query;
  const [form] = Form.useForm();
  const [bankList, setBankList]= useState<any[]>([])
  const cacheProductOptionsMap = useRef<any>({})
  const [productOptionsMap, setProductOptionsMap] = useState<any>({})
  const [status, setStatus] = useState<number>(1)
  const [recordResult1, setRecordResult1] = useState<DiagnosticRecord.DiagnoseRecord>({});
  const [recordResult2, setRecordResult2] = useState<DiagnosticRecord.OrgAssets[]>([]);
  const getProductList = (bankId: number) => {
    if (productOptionsMap[id]?.length){
      return
    }
    getProduct(bankId).then((res) => {
      if (res.code === 0 && res.result){
        const newProductOptionsMap = {...cacheProductOptionsMap.current}
        newProductOptionsMap[bankId] = res.result.map((item: any) => {
          return {value: item.id, label: item.name}
        })
        cacheProductOptionsMap.current = newProductOptionsMap
        setProductOptionsMap(newProductOptionsMap)
      }
      if (res.code !== 0){
        message.error(res.message)
      }
    })
  }

  const getDemandDetailInfo = async () => {
    try {
      const { code, result } = await queryDemandDetail(id);
      if (code === 0) {
        const { diagnoseRecord, orgAssets, creditInfo, workProve } = result;
        setRecordResult1(diagnoseRecord || {});
        setRecordResult2(orgAssets || []);
        setStatus(diagnoseRecord?.demandState || 1)
        if(diagnoseRecord?.recommendBankId){
          getProductList(diagnoseRecord?.recommendBankId)
        }
        const formValues = {
          demandState: diagnoseRecord?.demandState,
          bank: diagnoseRecord?.recommendBankId,
          product: creditInfo?.productId,
          creditTime: creditInfo?.startDate && creditInfo?.endDate ? [moment(creditInfo?.startDate), moment(creditInfo?.endDate)] : [],
          creditAmount: typeof creditInfo?.creditAmount === 'number' && creditInfo?.creditAmount > 0 ? customToFixed(`${(creditInfo?.creditAmount || 0) / 1000000}`) : '',
          startDate: creditInfo?.startDate,
          endDate: creditInfo?.endDate,
          rate: creditInfo?.rate?.replace('%', '') || '',
          refuseReason: creditInfo?.refuseReason,
          contractNo: creditInfo?.contractNo,
          workProve: workProve?.length ? workProve?.map((item: any) => {
            return {
              uid: item.id,
              name: item.fileName,
              status: 'done',
              url: `/antelope-common/common/file/download/${item.id}`
            }
          }) : creditInfo?.workProve?.split(',')?.map((item: string) => {
            return {
              uid: item,
              name: item,
              status: 'done',
              url: `/antelope-common/common/file/download/${item}`
            }
          })
        }
        form.setFieldsValue(formValues)
      } else {
        message.error('需求详情获取失败');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDemandDetailInfo();
    queryBank().then((res) => {
      if (res.code === 0 && res.result?.bank){
        setBankList(res.result.bank.map((item: any) => {
          return {value: item.id, label: item.name}
        }))
      }
    })
  }, []);

  const column1 = [
    {
      title: '资产类目',
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
  const handleSave = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    const { demandState, creditTime, creditAmount, rate, refuseReason, contractNo, workProve, bank, product} = values;
    const data: any = { diagnoseId: id, busiStatus: demandState };
    if (demandState === 2) {
      data.bankId = bank
      data.bankName = bankList.find(item => item.value === bank)?.label
    }
    if (demandState === 3){
      data.bankId = bank
      data.bankName = bankList.find(item => item.value === bank)?.label
      if (creditTime) {
        data.startDate = creditTime[0].format('YYYY-MM-DD');
        data.endDate = creditTime[1].format('YYYY-MM-DD');
      }
      data.workProve = workProve?.map((p: any) => p?.uid).join(',')
      data.productId = product
      data.creditAmount = creditAmount * 1000000
      data.contractNo = contractNo
      data.rate = rate ? `${rate}%` : ''
    }
    if (demandState === 4){
      data.workProve = workProve?.map((p: any) => p?.uid).join(',')
      data.refuseReason = refuseReason
    }
    setDemandCredit(data).then((res) => {
      if (res.code === 0){
        message.success('保存成功')
        getDemandDetailInfo();
      } else {
        message.error(res.message)
      }
    })
  }
  return (
    <PageContainer
      className={sc()}
      ghost
      footer={[
        <Button key="large" size="large" onClick={() => history.goBack()}>
          返回
        </Button>,
        <Button key="primary" type="primary" size="large" onClick={handleSave}>
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
                  <div className={sc('content-item-body-item-label')}>拟融资用途：</div>
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
                {
                  recordResult1?.urgency === 1 &&
                  <div className={sc('content-item-body-item')}>
                    <div className={sc('content-item-body-item-label')}>期望资金到账时间：</div>
                    <div className={sc('content-item-body-item-wrap')}>
                      {recordResult1?.urgencyRemark || '--'}
                    </div>
                  </div>
                }
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
              validateTrigger="onBlur"
            >
              <Form.Item
                name="demandState"
                label="授信状态"
                rules={[{ required: true, message: '请选择授信状态' }]}
              >
                <Radio.Group
                  onChange={(e) => {
                    setStatus(e.target.value)
                  }}
                  style={{whiteSpace: 'nowrap'}}
                  value={status}
                >
                  {
                    [{ value: 1, label: '待跟进', }, { value: 2, label: '已反馈至金融机构', }, { value: 3, label: '已授信', },
                      { value: 4, label: '授信失败', }].map((item, index) => {
                      return (
                        <Radio disabled={recordResult1?.demandState === 3 ? item.value !== 3  : item.value < (recordResult1?.demandState || 1)} value={item.value} key={index}>{item.label}</Radio>
                      )
                    })
                  }
                </Radio.Group>
              </Form.Item>
              {
                (status === 2 || status === 3) &&
                <Form.Item
                  label="金融机构"
                  name="bank"
                  rules={[{ required: true, message: '请选择金融机构' }]}
                >
                  <Select
                    placeholder='请选择金融机构'
                    options={bankList}
                    onChange={(value) => {
                      form.resetFields([`product`])
                      getProductList(value)
                    }}
                  />
                </Form.Item>
              }
              {
                status === 3 &&
                <Form.Item
                  label="金融产品"
                  name="product"
                  rules={[{ required: true, message: '请选择金融产品' }]}
                >
                  <Select
                    optionFilterProp="label"
                    showSearch
                    placeholder='请选择金融产品'
                    notFoundContent={form.getFieldValue(`bank`) ? "暂无数据" : '请先选择金融机构'}
                    options={productOptionsMap[form.getFieldValue(`bank`)] || []}
                  />
                </Form.Item>
              }
              {status === 3 && (
                <>
                  <Form.Item
                    label="授信金额"
                    name="creditAmount"
                    required
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
                    required
                    validateTrigger="onBlur"
                    rules={[{ required: true, message: '请选择授信有效期' }]}
                  >
                    <DatePicker.RangePicker allowClear style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    rules={[{ required: true, message: '请输入授信环节合同编号' }]}
                    required
                    name="contractNo"
                    label="合同编号"
                  >
                    <Input placeholder="请输入授信环节合同编号" />
                  </Form.Item>
                  <Form.Item
                    name="rate"
                    label="参考年利率"
                    required
                    rules={[
                      { required: true, message: '请输入参考年利率' },
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
              {status === 4 && (
                <>
                  <Form.Item name="refuseReason" label="失败原因">
                    <Input.TextArea rows={4} placeholder="请输入" showCount maxLength={300} />
                  </Form.Item>
                </>
              )}
              {
                (status === 4 || status === 3) &&
                <Form.Item
                  name="workProve"
                  label="业务凭证"
                  required
                  rules={[{ required: true, message: '请上传业务凭证' }]}
                >
                  <UploadFormFile
                    multiple
                    accept=".png,.jpg,.pdf,.xlsx,.xls,.doc,.docx,.jpeg"
                    showUploadList={true}
                    maxSize={30}
                    onChange={() => {
                      form.validateFields(['workProve'])
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
