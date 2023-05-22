import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Modal, Radio, Input, Form, Cascader, Row, Col, Button, message, Select } from 'antd';
import {
  getAreaCode,
  auditChannel,
  dispathChannel,
  getHistoryChannel,
  getChannelByArea,
  getChannelByName,
  getAccessList
} from '@/services/business-channel';
import moment from 'moment';
import { routeName } from '../../../../../config/routes';
const chanceTypeMap = {
  1: '研发设计',
  2: '生产制造',
  3: '仓储物流',
  4: '管理数字化',
  5: '其他'
}

const UploadModal = forwardRef((props: any, ref: any) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [auditStatus, setAuditStatus] = useState<number>(1)
  const [areaOptions, setAreaOptions] = useState<any>([])
  const [currentRecord, setCurrentRecord] = useState<any>({})
  const [modalType, setModalType] = useState<string>('audit')
  const [activeTab, setActiveTab] = useState<number>(0)
  const [infoList, setInfoList] = useState<any>([])
  const [pageInfo, setPageInfo] = useState<any>({
    pageIndex: 1,
    pageTotal: 0,
    pageSize: 10
  })
  const [historyChannel, setHistoryChannel] = useState<any>([])
  const [channelName, setChannelName] = useState<string>('')
  const [channelList, setChannelList] = useState<any>([])
  const [area, setArea] = useState<any>(0)
  const [accessList, setAccessList] = useState<any>([])
  const [form] = Form.useForm()
  useImperativeHandle(ref, () => ({
    openModal: async (record: any, type: string) => {
      const list = [
        {
          label: '商机编码',
          value: record.chanceNo
        },
        {
          label: '商机来源',
          value: record.creatorOrgType === 1 ? '渠道商' : record.creatorOrgType === 0 ? '羚羊平台' : '--'
        },
        {
          label: '商机名称',
          value: record.chanceName
        },
        {
          label: '关联企业',
          value: record.orgName
        },
        {
          label: '商机类型',
          value: chanceTypeMap[record.chanceType] || '--'
        },
        {
          label: '请求类型',
          value: {1: '商机发布', 2: '商机释放', 3: '更换渠道商'}[record.auditType] || '--',
        },
        {
          label: '商机描述',
          value: record.chanceDesc,
          isOneLine: true
        },
      ]
      if (type === 'distribute') {
        list.splice(5, 1, {
          label: '企业所属地',
          value: record.cityName || record.areaName ? `${record.cityName}${record.cityName && record.areaName ? '/' : ''}${record.areaName}` : '--'
        })
      }
      if (record.auditType === 3 && type === 'audit') {
        list.splice(5, 1)
        list.push({
          label: '当前渠道商',
          value: 'channelName',
          isOneLine: true
        })
        list.push({
          label: '更换事由',
          value: record.applyReason,
          isOneLine: true
        })
      }
      if (record.auditType === 2 && type === 'audit') {
        list.splice(5, 1)
        list.push({
          label: '渠道商',
          value: 'channelName',
          isOneLine: true
        })
        list.push({
          label: '释放事由',
          value: record.applyReason,
          isOneLine: true
        })
      }
      if(record.cityCode && record.orgArea) {
        form.setFieldsValue({
          area: [record.cityCode, record.orgArea]
        })
      }
      getHistoryChannel({chanceId: record.id}).then((res) => {
        if(res.code === 0){
          setHistoryChannel(res.result)
        }
        if (record.orgArea){
          setArea(record.orgArea)
          getChannelByArea({
            areaCode: record.orgArea,
            pageIndex: 1,
            pageSize: 10,
          }).then((result) => {
            if (result.code === 0) {
              setChannelList(result.result?.map((item: any) => {
                return {
                  label: historyChannel.indexOf(item.id) !== -1 ? `${item.channelName}    历史渠道商` : item.channelName,
                  value: item.id,
                  disabled: historyChannel.indexOf(item.id) !== -1,
                  areaCode: item.areaCode,
                  cityCode: item.cityCode
                }
              }) || [])
              setPageInfo({
                ...pageInfo,
                pageTotal: result.pageTotal
              })
            }
            console.log(result)
          })
        }
      })
      getAccessList({chanceId: record.id}).then((res) => {
        if(res.code === 0){
          console.log(res)
          setAccessList(res.result)
        }
      })
      setInfoList(list)
      setModalType(type)
      setCurrentRecord(record)
      setModalVisible(true)
    }
  }))
  useEffect(() => {
    getAreaCode({parentCode: 340000}).then((res: any) => {
      if (res.code === 0){
        setAreaOptions(res.result)
      }
    })
  }, [])

  const onCancel = () => {
    form.resetFields()
    setModalVisible(false);
    setInfoList([])
    setActiveTab(0)
    setAuditStatus(1)
    setModalType('audit')
    setCurrentRecord({})
    setHistoryChannel([])
    setChannelName('')
    setChannelList([])
    setArea(0)
    setAccessList([])
    setPageInfo({
      pageIndex: 1,
      pageTotal: 0,
      pageSize: 10
    })
  }

  const handleSubmit = async () => {
    await form.validateFields()
    const { channelId, auditTxt } = form.getFieldsValue()
    const params: any = {
      chanceId: currentRecord.id
    }
    if (modalType === 'audit') {
      params.result = auditStatus
      params.auditTxt = auditTxt
    } else {
      params.channelId = channelId
      params.status = 0
    }
    if (modalType === 'audit') {
      auditChannel(params).then((res) => {
        if (res.code === 0){
          message.success('审核成功')
          onCancel()
          if (props.successCallBack) {
            props.successCallBack()
          }
        } else {
          message.error(res.message)
        }
      })
    } else {
      dispathChannel(params).then((res) => {
        if (res.code === 0){
          message.success('分发成功')
          onCancel()
          if (props.successCallBack) {
            props.successCallBack()
          }
        } else {
          message.error(res.message)
        }
      })
    }

  }

  const renderFooter = () => {
    if (modalType === 'detail') {
      return (
        <div className="custom-footer flex-end">
          <div className="button-box">
            <Button
              type="primary"
              onClick={() => {
                onCancel()
              }}
            >
              关闭
            </Button>
          </div>
        </div>
      )
    }
    return (
      <div className="custom-footer flex-end">
        <div className="button-box">
          <Button
            onClick={() => {
              onCancel()
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            onClick={() => {
              handleSubmit()
            }}
          >
            {modalType === 'audit' ? '提交' : '分发'}
          </Button>
        </div>
      </div>
    )
  }
  console.log(modalType, 'tmpList')
  return (
    <Modal
      title={
        modalType === 'audit' ?
          `${{1: '商机发布', 2: '商机释放', 3: '更换渠道商'}[currentRecord.auditType]}-审核` :
          modalType === 'distribute' ? '商机分发' : '商机信息'
      }
      visible={modalVisible}
      width={700}
      style={{ height: '500px' }}
      maskClosable={false}
      destroyOnClose
      footer={renderFooter()}
      wrapClassName="audit-modal"
      okText="发布"
      onCancel={onCancel}
    >
      <div className="table-box">
        <div
          onClick={() => {
            if (activeTab === 0) {
              return
            }
            setActiveTab(0)
          }}
          className={activeTab === 0 ? "table-item active" : 'table-item'}
        >
          商机信息
        </div>
        {
          accessList.length > 0 &&
          <div
            onClick={() => {
              if (activeTab === 1) {
                return
              }
              setActiveTab(1)
            }}
            className={activeTab === 1 ? "table-item active" : 'table-item'}
          >
            跟进记录
          </div>
        }
      </div>
      {
        activeTab === 0 ?
          <div className="content">
            {
              infoList.map((item: any, index: number) => {
                return (
                  <div className={item.isOneLine ? "info-item one-line" : 'info-item'} key={index}>
                    <div className="label">
                      {item.label}
                    </div>
                    <div className="value">
                      {item.value}
                    </div>
                  </div>
                )
              })
            }
          </div> :
          <div className="content follow-up-list">
            {
              accessList.map((item: any, index: number) => {
                return (
                  <div className="follow-up-list-item" key={index}>
                    <div className="list-item-left">
                      <div className="time">
                        { item.updateTime ? moment(item.updateTime).format('MM-DD HH:mm') : '--'}
                      </div>
                      <div className="name">
                        {
                          item.dockingName || '--'
                        }
                      </div>
                      <div className="location">
                        定位：{item.accessLocation}
                      </div>
                    </div>
                    <div
                      className="detail-btn"
                      onClick={() => {
                        window.open(`${routeName.BUSINESS_CHANNEL_FOLLOW_UP_DETAIL}?chanceId=${currentRecord.id}&accessId=${item.id}`)
                      }}
                    >
                      查看详情
                    </div>
                  </div>
                )
              })
            }
          </div>
      }
      {
       modalType === 'audit' && <div className="audit-operation-area">
          <Form form={form}>
            <Form.Item initialValue={1} name="auditStatus">
              <Radio.Group
                onChange={(e) => {
                  setAuditStatus(e.target.value)
                }}
                options={[{label: '通过', value: 1},{label: '驳回', value: 0}]}
              />
            </Form.Item>
            <Form.Item
              name="auditTxt"
              required={auditStatus !== 1}
              rules={
                auditStatus === 1 ?
                  [{}] :
                  [
                    {required: true, message: '为方便业务修改，请简要描述驳回事由'},
                    {validator: (rule, value) => {
                      if (value.length < 10) {
                        return Promise.reject('字数不得小于10字')
                      }
                      return Promise.resolve()
                    }}
                  ]
              }
            >
              <Input.TextArea maxLength={300} placeholder={auditStatus === 1 ? "备注信息" : "请简要描述驱回事由，字数不少于10字。"} />
            </Form.Item>
          </Form>
        </div>
      }
      {
        modalType === 'distribute' &&
        <div className="distribute-operation-area">
          <Form form={form}>
            <Form.Item label="渠道商名称">
              <Row>
                <Col span={8}>
                  <Form.Item
                    name="area"
                  >
                    <Cascader
                      allowClear
                      fieldNames={{ label: 'name', value: 'code', children: 'childList' }}
                      placeholder="请选择所属区域" options={areaOptions}
                      onChange={(value) => {
                        if (value[1]) {
                          form.resetFields(['channelId'])
                          setChannelName('')
                          setPageInfo({
                            pageIndex: 1,
                            pageSize: 10,
                            pageTotal: 0
                          })
                          setArea(value[1])
                          getChannelByArea({
                            areaCode: value[1],
                            pageIndex: 1,
                            pageSize: 10,
                          }).then((res) => {
                            if (res.code === 0) {
                              setChannelList(res.result?.map((item: any) => {
                                return {
                                  label: historyChannel.indexOf(item.id) !== -1 ? `${item.channelName}    历史渠道商` : item.channelName,
                                  value: item.id,
                                  disabled: historyChannel.indexOf(item.id) !== -1,
                                  areaCode: item.areaCode,
                                  cityCode: item.cityCode
                                }
                              }) || [])
                              setPageInfo({
                                ...pageInfo,
                                pageTotal: res.pageTotal
                              })
                            }
                            console.log(res)
                          })
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} offset={1}>
                  <Form.Item
                    name="channelId"
                  >
                    <Select
                      showSearch
                      onSearch={(value) => {
                        if (value) {
                          form.resetFields(['area'])
                          setArea('')
                          setPageInfo({pageIndex: 1, pageTotal: 0, pageSize: 10})
                          getChannelByName({
                            pageIndex: 1,
                            pageSize: 10,
                            channelName: value
                          }).then((res) => {
                            if (res.code === 0) {
                              setChannelList(res.result?.map((item: any) => {
                                return {
                                  label: historyChannel.indexOf(item.id) !== -1 ? `${item.channelName}    历史渠道商` : item.channelName,
                                  value: item.id,
                                  disabled: historyChannel.indexOf(item.id) !== -1 ? true : false,
                                  areaCode: item.areaCode,
                                  cityCode: item.cityCode
                                }
                              }) || [])
                              setPageInfo({
                                ...pageInfo,
                                pageTotal: res.pageTotal
                              })
                            }
                          })
                        }
                      }}
                      onChange={(value, option) => {
                        setChannelName(option.label)
                        if(option.cityCode && option.areaCode) {
                          form.setFieldsValue({
                            area: [option.cityCode, option.areaCode]
                          })
                        }
                      }}
                      filterOption={false}
                      placeholder="请选择渠道商"
                      options={[...channelList]}
                      onPopupScroll={() => {
                        if (pageInfo.pageTotal > pageInfo.pageIndex) {
                          const pageIndex = pageInfo.pageIndex + 1
                          setPageInfo({...pageInfo, pageIndex})
                          if (area) {
                            getChannelByArea({...pageInfo, pageIndex, areaCode: area}).then((res) => {
                              if (res.code === 0) {
                                setChannelList(channelList.concat(
                                  res.result?.map((item: any) => {
                                    return {
                                      label: historyChannel.indexOf(item.id) !== -1 ? `${item.channelName}    历史渠道商` : item.channelName,
                                      value: item.id,
                                      disabled: historyChannel.indexOf(item.id) !== -1
                                    }
                                  }) || []
                                ))
                                setPageInfo({
                                  ...pageInfo,
                                  pageTotal: res.pageTotal
                                })
                              }
                            })
                          }
                          if (channelName) {
                            getChannelByName({
                              ...pageInfo,
                              pageIndex,
                              channelName: channelName
                            }).then((res) => {
                              if (res.code === 0) {
                                setChannelList(channelList.concat(
                                  res.result?.map((item: any) => {
                                    return {
                                      label: historyChannel.indexOf(item.id) !== -1 ? `${item.channelName}    历史渠道商` : item.channelName,
                                      value: item.id,
                                      disabled: historyChannel.indexOf(item.id) !== -1,
                                      areaCode: item.areaCode,
                                      cityCode: item.cityCode
                                    }
                                  }) || []
                                ))
                                setPageInfo({
                                  ...pageInfo,
                                  pageTotal: res.pageTotal
                                })
                              }
                            })
                          }
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      }
      {
        (currentRecord.status === 2 || currentRecord.status === 3) && modalType === 'detail' &&
        <div
          className="other-btn"
          onClick={() => {
            setModalType(currentRecord.status === 2 ? 'audit' : 'distribute')
            const tmpList = infoList
            if (currentRecord.auditType === 3 && currentRecord.status === 2) {
              tmpList.splice(5, 1)
              tmpList.push({
                label: '当前渠道商',
                value: 'channelName',
                isOneLine: true
              })
              tmpList.push({
                label: '更换事由',
                value: currentRecord.applyReason,
                isOneLine: true
              })
            }
            if (currentRecord.auditType === 2 && currentRecord.status === 2) {
              tmpList.splice(5, 1)
              tmpList.push({
                label: '渠道商',
                value: 'channelName',
                isOneLine: true
              })
              tmpList.push({
                label: '释放事由',
                value: currentRecord.applyReason,
                isOneLine: true
              })
            }
            if (currentRecord.status === 3){
              tmpList.splice(5, 1, {
                label: '企业所属地',
                value: currentRecord.cityName || currentRecord.areaName ? `${currentRecord.cityName}${currentRecord.cityName && currentRecord.areaName ? '/' : ''}${currentRecord.areaName}` : '--'
              })
            }
            setInfoList(tmpList)
          }}
        >
          {currentRecord.status === 2 ? '审核商机' : '分发至渠道'}
        </div>
      }
    </Modal>
  )
})


export default UploadModal
