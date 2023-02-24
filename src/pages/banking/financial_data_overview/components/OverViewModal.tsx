import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Select, Input, DatePicker } from 'antd';
import { queryBank, getProduct, getProjectContract, getShareProfit } from '@/services/financial_data_overview';
import moment from 'moment';
import { customToFixed } from '@/utils/util';
import { disabled } from 'glamor';

export default forwardRef((props: any, ref: any) => {
  const [shareAmountForm] = Form.useForm()
  const [contractAmountForm] = Form.useForm()

  const [activeTab, setActiveTab] = useState<number>(1)
  const [visible, setVisible] = useState<boolean>(false)
  const [bankList, setBankList]= useState<any[]>([])
  const [productOptionsMap, setProductOptionsMap] = useState<any>({})
  const [shareFormItemList, setShareFormItemList]= useState<number[]>([1])

  const reset = () => {
    setVisible(false)
    setShareFormItemList([1])
    setProductOptionsMap([])
    setBankList([])
    setActiveTab(1)
    shareAmountForm.resetFields()
    contractAmountForm.resetFields()
  }

  const handleAdd = () => {
    if (activeTab === 1){
      const newOrgAssets = [...shareFormItemList, (shareFormItemList[shareFormItemList.length - 1] || 0) + 1]
      setShareFormItemList(newOrgAssets)
    }
  }


  const getProductList = (id: number) => {
    if (productOptionsMap[id]?.length){
      return
    }
    getProduct(id).then((res) => {
      if (res.code === 0 && res.result){
        const newProductOptionsMap = {...productOptionsMap}
        newProductOptionsMap[id] = res.result.map((item: any) => {
          return {value: item.id, label: item.name}
        })
        setProductOptionsMap(newProductOptionsMap)
      }
    })
  }


  useImperativeHandle(ref, () => ({
    openModal: async () => {
      queryBank().then((res) => {
        if (res.code === 0 && res.result?.bank){
          setBankList(res.result.bank.map((item: any) => {
            return {value: item.id, label: item.name}
          }))
        }
      })
      getProjectContract().then((res) => {
        if (res.code === 0 && res.result?.length){
          const shareFormObj = {}
          setShareFormItemList(
            res.result.map((item: any, index: number) => {
              shareFormObj[`bankId_${index+ 1}`] = item.bankId
              shareFormObj[`productId_${index+ 1}`] = item.productId
              shareFormObj[`amount_${index+ 1}`] = item.amount
              getProductList(item.bankId)
              return index + 1
            })
          )
          shareAmountForm.setFieldsValue({...shareFormObj})
        }
      })
      getShareProfit().then((res) => {
        console.log(res)
      })
      setVisible(true)
    },
  }))



  const renderTitle = () => {
    return (
      <div className="title-table-box">
        <div
          className={activeTab === 1 ? "share-amount active" : 'share-amount'}
          onClick={() => {
            setActiveTab(1)
          }}
        >
          分润金额
        </div>
        <div
          className={activeTab === 2 ? "contract-amount active" : 'contract-amount'}
          onClick={() => {
            setActiveTab(2)
          }}
        >
          项目合同额
        </div>
      </div>
    )
  }

  const handleSubmit = () => {
    if (activeTab === 1){
      shareAmountForm.validateFields().then(async (values) => {
        // todo
        const {
          urgencyRemark,
          amount,
          term,
          purpose,
          purposeRemark,
          urgency,
          revenue,
          qualification,
        } = values
        const orgAssetsDTO = []
        const indexList = []
        for (const key in values) {
          if (key.indexOf('type') !== -1) {
            orgAssetsDTO.push({})
            indexList.push(Number(key.replace('type_', '')))
          }
        }
        indexList.sort((a, b) => {
          return a - b
        })
        for (const key in values) {
          if (key.indexOf('type') !== -1) {
            const keyIndex = Number(key.replace('type_', ''))
            const findIndex = indexList.findIndex((item) => item === keyIndex)
            orgAssetsDTO[findIndex]['type'] = values[key]
          }
          if (key.indexOf('cost') !== -1) {
            const keyIndex = Number(key.replace('cost_', ''))
            const findIndex = indexList.findIndex((item) => item === keyIndex)
            orgAssetsDTO[findIndex]['cost'] = Math.ceil(values[key].replace(/,/g, '') * 1000000)
          }
          if (key.indexOf('buyTime') !== -1) {
            const keyIndex = Number(key.replace('buyTime_', ''))
            const findIndex = indexList.findIndex((item) => item === keyIndex)
            orgAssetsDTO[findIndex]['buyTime'] = dayjs(values[key]).format('YYYY-MM-DD')
          }
          if (key.indexOf('clear') !== -1) {
            const keyIndex = Number(key.replace('clear_', ''))
            const findIndex = indexList.findIndex((item) => item === keyIndex)
            orgAssetsDTO[findIndex]['clear'] = values[key]
          }
        }
        const params = {
          urgencyRemark: dayjs(urgencyRemark).format('YYYY-MM-DD'),
          urgency,
          term,
          purpose,
          purposeRemark,
          orgAssetsDTO,
          revenue,
          qualification: qualification?.length ? qualification.join(',') : '',
          amount: Math.ceil(amount.replace(/,/g, '') * 1000000),
        }
        httpExactDiagnose(params)
          .then((res) => {
            if (res.code == 0) {
              if (props.callBack) {
                props.callBack(res.result)
              }
              onCancel()
            } else {
              message.warn(res.message)
            }
          })
          .catch(() => {
            message.warn('系统异常,请重试')
          })
      })

    }
  }

  return (
    <Modal
      title={renderTitle()}
      visible={visible}
      onOk={() => {
        handleSubmit()
      }}
      onCancel={() => {
        reset()
      }}
      width={800}
      wrapClassName="data-over-view-modal"
    >
      <div className="over-modal-content">
        <div className="form-box">
          <div className="form-box-title">
            <div className="title-item"><span>*</span>{activeTab === 1 ? '金融机构' : '项目名称'}</div>
            <div className="title-item"><span>*</span>{activeTab === 1 ? '金融产品' : '合同签订时间'}</div>
            <div className="title-item"><span>*</span>{activeTab === 1 ? '分润金额' : '项目合同额'}</div>
            <div className="operation"><span>*</span>操作</div>
          </div>
          <Form name="share-amount-form" form={shareAmountForm} style={{display: activeTab === 1 ? 'block': 'none'}}>
              {
                shareFormItemList.map((item: any, index: number) => {
                  return (
                    <div className="form-item-box" key={index}>
                      <div className="form-item">
                        <Form.Item
                          name={`bankId_${item}`}
                          validateTrigger="onBlur"
                          required
                          rules={[{ required: true, message: '金融机构必选' }]}
                        >
                          <Select
                            options={bankList}
                            placeholder="请选择"
                            onChange={(value) => {
                              shareAmountForm.resetFields([`productId_${item}`])
                              getProductList(value)
                            }}
                          />
                        </Form.Item>
                      </div>
                      <div className="form-item">
                        <Form.Item
                          name={`productId_${item}`}
                          validateTrigger="onBlur"
                          required
                          rules={[{ required: true, message: '金融产品必选' }]}
                        >
                          <Select
                            options={productOptionsMap[shareAmountForm.getFieldValue(`bankId_${item}`)] || []}
                            placeholder="请选择"
                          />
                        </Form.Item>
                      </div>
                      <div className="form-item">
                        <Form.Item
                          name={`amount_${item}`}
                          validateTrigger="onBlur"
                          required
                          rules={[{ required: true, message: '分润金额必填' }]}
                        >
                          <Input placeholder="请输入" suffix="万元" maxLength={11} />
                        </Form.Item>
                      </div>
                      <div onClick={() => {
                        if (shareFormItemList.length > 1){
                          shareFormItemList.splice(index, 1)
                          setShareFormItemList([...shareFormItemList])
                        }
                      }} className={`delete-btn ${shareFormItemList.length === 1 ? 'disabled' : ''}`}>删除</div>
                    </div>
                  )
                })
              }
            </Form>
          <Form name="contract-amount-form" form={contractAmountForm} style={{display: activeTab === 2 ? 'block': 'none'}}>
            {
              [1,2, 4,5,6,7].map((item: any, index: number) => {
                return (
                  <div className="form-item-box" key={index}>
                    <div className="form-item">
                      <Form.Item
                        name="name"
                        validateTrigger="onBlur"
                        required
                        rules={[{ required: true, message: '金融机构必选' }]}
                      >
                        <Input placeholder="请输入" maxLength={100} />
                      </Form.Item>
                    </div>
                    <div className="form-item">
                      <Form.Item
                        name="time"
                        validateTrigger="onBlur"
                        required
                        rules={[{ required: true, message: '合同签订时间必选' }]}
                      >
                        <DatePicker
                          dropdownClassName="financial-overview-time"
                          disabledDate={(current) =>
                            current && current > moment().subtract(0, 'day')
                          }
                        />
                      </Form.Item>
                    </div>
                    <div className="form-item">
                      <Form.Item
                        name="amount"
                        validateTrigger="onBlur"
                        required
                        rules={[{ required: true, message: '分润金额必填' }]}
                      >
                        <Input placeholder="请输入" suffix="万元" maxLength={11} />
                      </Form.Item>
                    </div>
                    <div className="delete-btn disabled">删除</div>
                  </div>
                )
              })
            }
          </Form>
        </div>
      </div>
      <div
        className="add-btn bottom"
        onClick={handleAdd}
      >
        +添加一行
      </div>
    </Modal>
  )
})
