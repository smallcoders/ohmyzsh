import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Modal, Row, Col, Button, Space, message } from 'antd'
import scopedClasses from '@/utils/scopedClasses'
import { CloseOutlined } from '@ant-design/icons'
import './two-level-select.less'

const sc = scopedClasses('two-level-select')

interface Props {
  dictionary?: {
    children?: {
      [prop: string]: any
    }[]
    [prop: string]: any
  }[]
  value?: string[]
  fieldNames?: { label: string; value: string; children: string }
  onChange?: (values: string[]) => void
  max?: number
}

export default observer(
  ({
    onChange,
    dictionary,
    value,
    fieldNames = {
      label: 'title',
      value: 'value',
      children: 'children',
    },
    max = 5,
  }: Props) => {
    const label = fieldNames.label
    const value_field = fieldNames.value
    const children = fieldNames.children
    const [selected, setSelected] = useState<string[]>([])
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const handleOk = () => {
      onChange?.(selected)
      setIsModalVisible(false)
    }

    const handleCancel = () => {
      setIsModalVisible(false)
      setSelected(value || []) // 还原成默认值
    }

    const [dictionaryObj, setDictionaryObj] = useState<{
      [prop: string]: any
    }>([])

    useEffect(() => {
      // 初始化
      value && setSelected(value)
    }, [value])

    useEffect(() => {
      // 将可选的最后一层数据存储
      const dictionaryObj = {}
      dictionary?.map((p) => {
        p?.[children]?.map((i: any) => {
          i?.[children].map((c: any) => {
            dictionaryObj[c[value_field]] = c
          })
        })
      })
      setDictionaryObj(dictionaryObj)
    }, [dictionary])

    const onClick = (value: string) => {
      setSelected((pre) => {
        const exist = pre.filter((p) => p !== value)
        if (exist.length === pre.length) {
          if (pre.length === max) {
            message.info(`最多选择${max}个`)
            return pre
          }
          return [...pre, value]
        }
        return [...exist]
      })
    }

    return (
      <div className={sc()}>
        <div
          className={sc('input')}
          onClick={() => {
            setIsModalVisible(true)
          }}
        >
          <div className={sc('footer-left')}>
            {!value || value.length === 0 ? (
              <span className={sc('footer-left-placeholder')}>最多可选五种类型</span>
            ) : (
              value?.map((p) => (
                <div key={`selected-tag-${p}`} style={{ width: 88 }}>
                  <span title={dictionaryObj?.[p]?.[label]}>{dictionaryObj?.[p]?.[label]}</span>
                </div>
              ))
            )}
          </div>
        </div>
        <Modal
          title="请选择需求类型"
          width={850}
          bodyStyle={{
            height: 405,
            overflowY: 'auto',
          }}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
          maskClosable={false}
          footer={
            <div className={sc('footer')}>
              <div className={sc('footer-left')}>
                {selected.length === 0 ? (
                  <span className={sc('footer-left-placeholder')}>最多可选五种类型</span>
                ) : (
                  selected.map((p) => (
                    <div key={`selected-tag-${p}`}>
                      <span title={dictionaryObj?.[p]?.[label]}>{dictionaryObj?.[p]?.[label]}</span>
                      <CloseOutlined
                        onClick={() => {
                          setSelected((pre) => {
                            const exist = pre.filter((i) => i !== p)
                            return [...exist]
                          })
                        }}
                        style={{ cursor: 'pointer', flex: '0 0 12px' }}
                      />
                    </div>
                  ))
                )}
              </div>
              <Space>
                <Button key="back" onClick={handleCancel}>
                  取消
                </Button>
                <Button key="submit" type="primary" onClick={handleOk}>
                  确定
                </Button>
              </Space>
            </div>
          }
        >
          {dictionary?.map((a) => (
            <> <div style={{ borderBottom: '1px solid #ccc', fontWeight: 'bold'}}>{a?.[label]}</div>
              {
                a?.[children]?.map((p: any) => {
                  return (
                    <div key={p[value_field]} className={sc('item')}>
                      <div className={sc('item-title')}>{p[label]}:</div>
                      <div className={sc('item-values')}>
                        <Row gutter={10}>
                          {p[children].map((i) => {
                            const isSelected = selected.includes(i[value_field])
                            return (
                              <Col
                                onClick={() => onClick(i[value_field])}
                                span={6}
                                className={sc(
                                  isSelected ? 'item-values-tag-selected' : 'item-values-tag',
                                )}
                                key={i[value_field]}
                              >
                                {i[label]}
                              </Col>
                            )
                          })}
                        </Row>
                      </div>
                    </div>
                  )
                })
              }
            </>
          ))}
        </Modal>
      </div>
    )
  },
)
