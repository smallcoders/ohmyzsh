import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, Select, Input, DatePicker, message} from 'antd';
import {
  queryBank,
  getProduct,
  getProjectContract,
  getShareProfit,
  addOrUpdateShareProfit,
  addOrUpdateProjectContract
} from '@/services/financial_data_overview';
import moment from 'moment';
import { customToFixed } from '@/utils/util';

const decimalsVerifyReg = /^(([1-9]{1}\d{0,5})|(0{1}))(\.\d{1,4})?$/

export default forwardRef((props: any, ref: any) => {
  const [form] = Form.useForm()

  const [activeTab, setActiveTab] = useState<number>(1)
  const [visible, setVisible] = useState<boolean>(false)
  const [bankList, setBankList]= useState<any[]>([])
  const [idMap, setIdMap]= useState<any>({})
  const [productOptionsMap, setProductOptionsMap] = useState<any>({})
  const [formItemList, setFormItemList]= useState<number[]>([1])

  const reset = () => {
    setVisible(false)
    setFormItemList([1])
    setIdMap({})
    setProductOptionsMap([])
    setBankList([])
    setActiveTab(1)
    form.resetFields()
  }

  const handleAdd = () => {
    const newOrgAssets = [...formItemList, (formItemList[formItemList.length - 1] || 0) + 1]
    setFormItemList(newOrgAssets)
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
    openModal: async (tabIndex: number) => {
      setActiveTab(tabIndex || 1)
      if (tabIndex === 1){
        queryBank().then((res) => {
          if (res.code === 0 && res.result?.bank){
            setBankList(res.result.bank.map((item: any) => {
              return {value: item.id, label: item.name}
            }))
          }
        })
        getShareProfit().then((res) => {
          if (res.code === 0 && res.result?.length){
            const formObj = {}
            const newShareProfitIdMap = {}
            setFormItemList(
              res.result.map((item: any, index: number) => {
                formObj[`bankId_${index+ 1}`] = item.bankId
                formObj[`productId_${index+ 1}`] = item.productId
                formObj[`amount_${index+ 1}`] = customToFixed(`${item.amount / 1000000} || '`)
                newShareProfitIdMap[`id_${index+1}`] = item.id
                getProductList(item.bankId)
                return index + 1
              })
            )
            setIdMap(newShareProfitIdMap)
            form.setFieldsValue({...formObj})
          }
        })
      } else {
        getProjectContract().then((res) => {
          const formObj = {}
          const newProjectContractIdMap = {}
          setFormItemList(
            res.result.map((item: any, index: number) => {
              formObj[`projectName_${index+ 1}`] = item.projectName
              formObj[`signDate_${index+ 1}`] = moment(item.signDate)
              formObj[`amount_${index+ 1}`] = customToFixed(`${item.amount / 1000000} || '`)
              newProjectContractIdMap[`id_${index+1}`] = item.id
              getProductList(item.bankId)
              return index + 1
            })
          )
          setIdMap(newProjectContractIdMap)
          form.setFieldsValue({...formObj})
        })
      }
      setVisible(true)
    },
  }))



  const renderTitle = () => {
    return (
      <div className="title-table-box">
        {
          activeTab === 1 ?
            <div
              className="share-amount"
              onClick={() => {
                setActiveTab(1)
              }}
            >
              分润金额
            </div> :
            <div
              className="contract-amount"
              onClick={() => {
                setActiveTab(2)
              }}
            >
              项目合同额
            </div>
        }
      </div>
    )
  }

  const handleSubmit = () => {
    if (activeTab === 1){
      form.validateFields().then(async (values) => {
        const shareAmountInfoList = []
        const indexList = []
        for (const key in values) {
          if (key.indexOf('bankId') !== -1) {
            shareAmountInfoList.push({})
            indexList.push(Number(key.replace('bankId_', '')))
          }
        }
        indexList.sort((a, b) => {
          return a - b
        })
        for (const key in values) {
          if (key.indexOf('bankId') !== -1) {
            const keyIndex = Number(key.replace('bankId_', ''))
            const findIndex = indexList.findIndex((item) => item === keyIndex)
            if (idMap[`id_${keyIndex}`]) {
              shareAmountInfoList[findIndex]['id'] = idMap[`id_${keyIndex}`]
            }
            shareAmountInfoList[findIndex]['bankId'] = values[key]
          }
          if (key.indexOf('productId') !== -1) {
            const keyIndex = Number(key.replace('productId_', ''))
            const findIndex = indexList.findIndex((item) => item === keyIndex)
            shareAmountInfoList[findIndex]['productId'] = values[key]
          }
          if (key.indexOf('amount') !== -1) {
            const keyIndex = Number(key.replace('amount_', ''))
            const findIndex = indexList.findIndex((item) => item === keyIndex)
            shareAmountInfoList[findIndex]['amount'] = Math.ceil(Number(`${values[key]}`.replace(/,/g, '')) * 1000000)
          }
        }
        addOrUpdateShareProfit(shareAmountInfoList).then((res) => {
          if (res.code == 0) {
            message.success('设置成功')
            if (props.successCallBack) {
              props.successCallBack()
            }
            reset()
          } else {
            message.error(res.message)
          }
        })
          .catch(() => {
            message.error('系统异常,请重试')
          })
      })

    } else {
      form.validateFields().then(async (values) => {
        const projectContractInfoList = []
        const indexList = []
        for (const key in values) {
          if (key.indexOf('projectName') !== -1) {
            projectContractInfoList.push({})
            indexList.push(Number(key.replace('projectName_', '')))
          }
        }
        indexList.sort((a, b) => {
          return a - b
        })
        for (const key in values) {
          if (key.indexOf('projectName') !== -1) {
            const keyIndex = Number(key.replace('projectName_', ''))
            const findIndex = indexList.findIndex((item) => item === keyIndex)
            if (idMap[`id_${keyIndex}`]) {
              projectContractInfoList[findIndex]['id'] = idMap[`id_${keyIndex}`]
            }
            projectContractInfoList[findIndex]['projectName'] = values[key]
          }
          if (key.indexOf('signDate') !== -1) {
            const keyIndex = Number(key.replace('signDate_', ''))
            const findIndex = indexList.findIndex((item) => item === keyIndex)
            projectContractInfoList[findIndex]['signDate'] = moment(values[key]).format('YYYY-MM-DD')
          }
          if (key.indexOf('amount') !== -1) {
            const keyIndex = Number(key.replace('amount_', ''))
            const findIndex = indexList.findIndex((item) => item === keyIndex)
            projectContractInfoList[findIndex]['amount'] = Math.ceil(Number(`${values[key]}`.replace(/,/g, '')) * 1000000)
          }
        }

        addOrUpdateProjectContract(projectContractInfoList).then((res) => {
          if (res.code == 0) {
            message.success('设置成功')
            if (props.successCallBack) {
              props.successCallBack()
            }
            reset()
          } else {
            message.error(res.message)
          }
        })
          .catch(() => {
            message.error('系统异常,请重试')
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
          <Form name="share-amount-form" form={form}>
              {
                activeTab === 1 ?
                formItemList.map((item: any, index: number) => {
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
                            dropdownClassName="bank-list-select-drop"
                            onChange={(value) => {
                              form.resetFields([`productId_${item}`])
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
                            options={productOptionsMap[form.getFieldValue(`bankId_${item}`)] || []}
                            placeholder="请选择"
                          />
                        </Form.Item>
                      </div>
                      <div className="form-item">
                        <Form.Item
                          name={`amount_${item}`}
                          validateTrigger="onBlur"
                          rules={[
                            {
                              validator(rule, value) {
                                if (!value) {
                                  return Promise.reject('分润金额必填')
                                } else if (!Number(value.replace(/,/g, ''))) {
                                  return Promise.reject('分润金额必须大于0')
                                } else if (!decimalsVerifyReg.test(value.replace(/,/g, ''))) {
                                  return Promise.reject('整数至多6位数字，小数点后至多4位数字')
                                }
                                return Promise.resolve()
                              },
                            },
                          ]}
                          required
                        >
                          <Input placeholder="请输入" suffix="万元" maxLength={11} />
                        </Form.Item>
                      </div>
                      <div onClick={() => {
                        if (formItemList.length > 1){
                          formItemList.splice(index, 1)
                          setFormItemList([...formItemList])
                        }
                      }} className={`delete-btn ${formItemList.length === 1 ? 'disabled' : ''}`}>删除</div>
                    </div>
                  )
                }) : formItemList.map((item: any, index: number) => {
                    return (
                      <div className="form-item-box" key={index}>
                        <div className="form-item">
                          <Form.Item
                            name={`projectName_${item}`}
                            validateTrigger="onBlur"
                            required
                            rules={[{ required: true, message: '项目名称' }]}
                          >
                            <Input placeholder="请输入" maxLength={100} />
                          </Form.Item>
                        </div>
                        <div className="form-item">
                          <Form.Item
                            name={`signDate_${item}`}
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
                            name={`amount_${item}`}
                            validateTrigger="onBlur"
                            required
                            rules={[
                              {
                                validator(rule, value) {
                                  if (!value) {
                                    return Promise.reject('合同金额必填')
                                  } else if (!Number(value.replace(/,/g, ''))) {
                                    return Promise.reject('合同金额必须大于0')
                                  } else if (!decimalsVerifyReg.test(value.replace(/,/g, ''))) {
                                    return Promise.reject('整数至多6位数字，小数点后至多4位数字')
                                  }
                                  return Promise.resolve()
                                },
                              },
                            ]}
                          >
                            <Input placeholder="请输入" suffix="万元" maxLength={11} />
                          </Form.Item>
                        </div>
                        <div onClick={() => {
                          if (formItemList.length > 1){
                            formItemList.splice(index, 1)
                            setFormItemList([...formItemList])
                          }
                        }} className={`delete-btn ${formItemList.length === 1 ? 'disabled' : ''}`}>删除</div>
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
