import { joinOrg as httpJoinOrg, beOrgManage as httpBeAdmin } from '@/service/http_request'
import { message, Modal } from '@gyzn/linglong-ui'
import React, { useEffect, useState } from 'react'
import Choose from './components/choose'
import Join from './components/join'
import BeAdmin from './components/be-admin'
import Upload from './components/upload'
import { Cascader, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd'

enum SearchItemControlEnum {
    INPUT = 'input',
    INPUTNUMBER = 'inputNumber',
    SELECT = 'select',
    CASCADER = 'cascader',
    RADIO = 'radio',
    TEXTAREA = 'textarea',
    CUSTOM = 'custom',
    RANGEPICKER = 'rangepicker',
    CHECKBOX = 'checkbox'
}

interface SearchItem {
    key: string
    label: string
    type: SearchItemControlEnum
    render?: any
    dictionary?: any[]
}

const SignModal = (props) => {
    const { current, visible, setVisible } = props

    const [selectOrgType, setSelectOrgType] = useState<any>()
    const [selectOrg, setSelectOrg] = useState<any>()
    const [saveData, setSaveData] = useState<any>({})
    const [form] = Form.useForm()

    const searchList = {
        1: [
            {
                key: 'name',
                label: `企业名称`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `注册资金（元）`,
                type: SearchItemControlEnum.INPUTNUMBER,
            },
            {
                key: 'name',
                label: `员工人数`,
                type: SearchItemControlEnum.INPUTNUMBER,
            },
            {
                key: 'name',
                label: `营业额（元）`,
                type: SearchItemControlEnum.INPUTNUMBER,
            },
            {
                key: 'name',
                label: `采购额（元）`,
                type: SearchItemControlEnum.INPUTNUMBER,
            },
            {
                key: 'name',
                label: `主营产品`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `行业`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `企业所在地市`,
                type: SearchItemControlEnum.CASCADER,
            },
            {
                key: 'name',
                label: `数字化应用预算（元）`,
                type: SearchItemControlEnum.INPUTNUMBER,
            },
            {
                key: 'name',
                label: `应用使用人数`,
                type: SearchItemControlEnum.INPUTNUMBER,
            },
            {
                key: 'typeId',
                label: `是否需要与上下游系统关联`,
                type: SearchItemControlEnum.RADIO,
                dictionary: [],
            },
        ],
        2: [
            {
                key: 'name',
                label: `企业名称`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `采购商品名称`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `采购商品规格`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `采购商品参数`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `采购商品数量`,
                type: SearchItemControlEnum.INPUTNUMBER,
            },
            {
                key: 'name',
                label: `企业所在地市`,
                type: SearchItemControlEnum.CASCADER,
            },
            {
                key: 'name',
                label: `企业详细地址`,
                type: SearchItemControlEnum.TEXTAREA,
            },
            {
                key: 'name',
                label: `期望到货时间`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [],
            },
            {
                key: 'name',
                label: `以往采购周期`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [],
            },
            {
                key: 'name',
                label: `商品使用场景`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [],
            },
        ],
        3: [
            {
                key: 'name',
                label: `企业名称`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `企业所在地市`,
                type: SearchItemControlEnum.CASCADER,
            },
            {
                key: 'name',
                label: `联系人`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `联系方式`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `需求名称`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `需求类型`,
                type: SearchItemControlEnum.SELECT,
            },
            {
                key: 'name',
                label: `所属行业`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `所属产业`,
                type: SearchItemControlEnum.CUSTOM,
                render: () => {
                    return <div></div>
                }
            },
            {
                key: 'name',
                label: `需求时间`,
                type: SearchItemControlEnum.RANGEPICKER,
            },
            {
                key: 'name',
                label: `需求内容`,
                type: SearchItemControlEnum.TEXTAREA,
            },
            {
                key: 'name',
                label: `需求预算`,
                type: SearchItemControlEnum.INPUTNUMBER,
            },
        ],
        4: [
            {
                key: 'name',
                label: `企业名称`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `联系人`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `联系方式`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `企业所在地市`,
                type: SearchItemControlEnum.CASCADER,
            },
            {
                key: 'name',
                label: `需求名称`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `需求类型`,
                type: SearchItemControlEnum.SELECT,
            },
            {
                key: 'name',
                label: `所属行业`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `上一年营业收入`,
                type: SearchItemControlEnum.INPUTNUMBER,
            },
            {
                key: 'name',
                label: `企业人数`,
                type: SearchItemControlEnum.INPUTNUMBER,
            },
            {
                key: 'name',
                label: `企业类型`,
                type: SearchItemControlEnum.CHECKBOX,
                dictionary: [],
            },
            {
                key: 'name',
                label: `所属产业`,
                type: SearchItemControlEnum.CUSTOM,
                render: () => {
                    return <div></div>
                }
            },
            {
                key: 'name',
                label: `资金需求量`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [],
            },
            {
                key: 'name',
                label: `拟融资期限`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [],
            },
            {
                key: 'name',
                label: `拟融资用途`,
                type: SearchItemControlEnum.CUSTOM,
                render: () => {
                    return <div></div>
                }
            },
            {
                key: 'name',
                label: `资金需求紧迫度`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [],
            },
            {
                key: 'name',
                label: `主要结算银行`,
                type: SearchItemControlEnum.CHECKBOX,
                dictionary: [],
            },
            {
                key: 'name',
                label: `自有产权土地`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `自有产权房产`,
                type: SearchItemControlEnum.INPUT,
            },
            {
                key: 'name',
                label: `自有高价值设备`,
                type: SearchItemControlEnum.INPUT,
            },
        ],
    }

    const renderSearchItemControl = (searchItem: SearchItem) => {
        switch (searchItem.type) {
            case SearchItemControlEnum.INPUT:
                return <Input placeholder="请输入" allowClear />
            case SearchItemControlEnum.TEXTAREA:
                return <Input.TextArea placeholder="请输入" allowClear />
            case SearchItemControlEnum.SELECT: {
                return (
                    <Select placeholder="请选择" allowClear>
                        {searchItem?.dictionary?.map((p) => (
                            <Select.Option key={p.id} value={p.enumName || p.id || p.code}>
                                {p.name}
                            </Select.Option>
                        ))}
                    </Select>
                )
            }
            case SearchItemControlEnum.INPUTNUMBER:
                return <InputNumber placeholder="请输入" />
            case SearchItemControlEnum.CASCADER:
                return <Cascader placeholder="请输入" />
            case SearchItemControlEnum.CHECKBOX:
                return <Checkbox.Group>
                    {searchItem?.dictionary?.map((p) => (
                        <Checkbox value="A">A</Checkbox>
                    ))}

                </Checkbox.Group>
            case SearchItemControlEnum.RADIO:
                return <Radio.Group>
                    {searchItem?.dictionary?.map((p) => (
                        <Radio value="A">A</Radio>
                    ))}
                </Radio.Group>
            case SearchItemControlEnum.RANGEPICKER:
                return <DatePicker.RangePicker allowClear showTime />
            case SearchItemControlEnum.CUSTOM:
                return searchItem?.render?.()
            default:
                return null
        }
    }

    return (
        <Modal
            title={'需求细化'}
            visible={visible}
            onCancel={() => {
                setVisible(false)
            }}
            width={600}
            centered
            maskClosable={false}
            okText="确定"
            cancelText="取消"
            destroyOnClose={true}
            footer={null}
            bodyStyle={{ padding: 0, minWidth: 600 }}
        >

            <Form form={form} name="advanced_search">
                <Form.Item label={'需求名称'}>
                    企业数字化改造服务
                </Form.Item>
                <Form.Item label={'选择需求预指派业务组'}>
                    <Select placeholder="请选择" allowClear>
                        {[]?.map((p) => (
                            <Select.Option key={p.id} value={p.enumName || p.id || p.code}>
                                {p.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {searchList?.map((search) => (
                    <Form.Item name={search?.key} label={search?.label}>
                        {renderSearchItemControl(search)}
                    </Form.Item>
                ))}
            </Form>
        </Modal>
    )
}

export default SignModal
