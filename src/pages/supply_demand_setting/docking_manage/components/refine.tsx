import { FormInstance, message, Modal } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { Cascader, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd'
import { listAllAreaCode } from '@/services/common'
import TwoLevelSelect from './two-level-select'

export enum SearchItemControlEnum {
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

export interface SearchItem {
    key: string
    label: string
    type: SearchItemControlEnum
    render?: any
    dictionary?: any[]
    props?: any,
    formProps?: any,
}

export const renderSearchItemControl = (searchItem: SearchItem, form: FormInstance) => {
    switch (searchItem.type) {
        case SearchItemControlEnum.INPUT:
            return <Input placeholder="请输入" allowClear {...(searchItem?.props || [])} />
        case SearchItemControlEnum.TEXTAREA:
            return <Input.TextArea placeholder="请输入" allowClear {...(searchItem?.props || [])} />
        case SearchItemControlEnum.SELECT: {
            return (
                <Select placeholder="请选择" allowClear {...(searchItem?.props || [])}>
                    {searchItem?.dictionary?.map((p) => (
                        <Select.Option key={p.id} value={p.enumName || p.id || p.code} >
                            {p.name}
                        </Select.Option>
                    ))}
                </Select>
            )
        }
        case SearchItemControlEnum.INPUTNUMBER:
            return <InputNumber placeholder="请输入" {...(searchItem?.props || [])} />
        case SearchItemControlEnum.CASCADER:
            return <Cascader placeholder="请选择"
                fieldNames={{ 'value': 'code', 'label': 'name', 'children': 'nodes' }}
                {...(searchItem?.props || [])}
            />
        case SearchItemControlEnum.CHECKBOX:
            return <Checkbox.Group {...(searchItem?.props || [])}>
                {searchItem?.dictionary?.map((p) => (
                    <Checkbox value="A">A</Checkbox>
                ))}
            </Checkbox.Group>
        case SearchItemControlEnum.RADIO:
            return <Radio.Group {...(searchItem?.props || [])}>
                {searchItem?.dictionary?.map((p) => (
                    <Radio value="A">A</Radio>
                ))}
            </Radio.Group>
        case SearchItemControlEnum.RANGEPICKER:
            return <DatePicker.RangePicker allowClear showTime {...(searchItem?.props || [])} />
        case SearchItemControlEnum.CUSTOM:
            return searchItem?.render?.(form)
        default:
            return null
    }
}

const RefineModal = (props) => {
    const { current, visible, setVisible } = props
    const [area, setArea] = useState<any[]>([]);
    const [selectOrgType, setSelectOrgType] = useState<any>()
    const [selectOrg, setSelectOrg] = useState<any>()
    const [saveData, setSaveData] = useState<any>({})
    const [typeSelected, setTypeSelected] = useState<string[] | null>(null)
    const [form] = Form.useForm()
    useEffect(() => {
        prepare()
    }, [])

    const [activeElse, setActiveElse] = useState<any>(false)
    const prepare = async () => {
        try {
            const areaRes = await listAllAreaCode()
            setArea(areaRes && areaRes.result || [])
        } catch (error) {
            message.error('获取省市区数据出错')
        }
    }
    const searchList = {
        1: [
            {
                key: 'orgName',
                label: `企业名称`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 35
                    },
                },
            },
            {
                key: 'registerAmount',
                label: `注册资金（元）`,
                type: SearchItemControlEnum.INPUTNUMBER,
                props: {
                    style: {
                        width: '100%',
                        precision: 2,
                        maxLength: 35
                    },
                },
            },
            {
                key: 'staffNum',
                label: `员工人数`,
                type: SearchItemControlEnum.INPUTNUMBER,
                props: {
                    style: {
                        width: '100%',
                        precision: 0,
                        maxLength: 35
                    },
                },
            },
            {
                key: 'turnover',
                label: `营业额（元）`,
                type: SearchItemControlEnum.INPUTNUMBER,
                props: {
                    style: {
                        width: '100%',
                        precision: 2,
                        maxLength: 35
                    },
                },
            },
            {
                key: 'purchaseAmount',
                label: `采购额（元）`,
                type: SearchItemControlEnum.INPUTNUMBER,
                props: {
                    style: {
                        width: '100%',
                        precision: 2,
                        maxLength: 35
                    },
                },
            },
            {
                key: 'mainProduct',
                label: `主营产品`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 1000
                    },
                },
            },
            {
                key: 'industry',
                label: `行业`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 1000
                    },
                },
            },
            {
                key: 'areaCode',
                label: `企业所在地市`,
                type: SearchItemControlEnum.CASCADER,
                props: {
                    style: {
                        width: '100%'
                    },
                    options: area
                },
            },
            {
                key: 'budget',
                label: `数字化应用预算（元）`,
                type: SearchItemControlEnum.INPUTNUMBER,
                props: {
                    style: {
                        width: '100%',
                        precision: 2,
                        maxLength: 35
                    },
                },
            },
            {
                key: 'appUserNum',
                label: `应用使用人数`,
                type: SearchItemControlEnum.INPUTNUMBER,
                props: {
                    style: {
                        width: '100%',
                        precision: 0,
                        maxLength: 35
                    },
                },
            },
            {
                key: 'relate',
                label: `是否需要与上下游系统关联`,
                type: SearchItemControlEnum.CUSTOM,
                render: (form) => {
                    const dict = [
                        { name: '是', value: true },
                        { name: '否', value: false },
                    ]
                    return <Radio.Group>
                        {
                            dict.map(p => {
                                return <Radio onClick={(e) => {
                                    if (
                                        form.getFieldValue('typeId') == e.target.value
                                    ) {
                                        form.setFieldsValue({ 'typeId': undefined })
                                    }
                                }} value={p.value}>{p.name}</Radio>
                            })
                        }

                    </Radio.Group>
                }
            },
        ],
        2: [
            {
                key: 'orgName',
                label: `企业名称`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 35
                    },
                },
            },
            {
                key: 'productName',
                label: `采购商品名称`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 100
                    },
                },
            },
            {
                key: 'productSpec',
                label: `采购商品规格`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 1000
                    },
                },
            },
            {
                key: 'productParam',
                label: `采购商品参数`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 1000
                    },
                },
            },
            {
                key: 'purchaseAmount',
                label: `采购商品数量`,
                type: SearchItemControlEnum.INPUTNUMBER,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 1000,
                        precision: 0,
                    },
                },
            },
            {
                key: 'areaCode',
                label: `企业所在地市`,
                type: SearchItemControlEnum.CASCADER,
                props: {
                    style: {
                        width: '100%'
                    },
                    options: area
                },
            },
            {
                key: 'areaDetail',
                label: `企业详细地址`,
                type: SearchItemControlEnum.TEXTAREA,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 100,
                    },
                },
            },
            {
                key: 'shopTime',
                label: `期望到货时间`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [
                    {
                        title: '3~7天',
                        value: 0
                    },
                    {
                        title: '7~15天',
                        value: 1
                    },
                    {
                        title: '15天以上',
                        value: 2
                    },
                ],
                props: {
                    style: {
                        width: '100%'
                    },
                },
            },
            {
                key: 'purchasePeriod',
                label: `以往采购周期`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [
                    {
                        title: '日常及时采购',
                        value: 0
                    },
                    {
                        title: '月度采购',
                        value: 1
                    },
                    {
                        title: '季度采购',
                        value: 2
                    },
                ],
                props: {
                    style: {
                        width: '100%'
                    },
                },
            },
            {
                key: 'productCase',
                label: `商品使用场景`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [],
                props: {
                    style: {
                        width: '100%'
                    },
                },
            },
        ],
        3: [
            {
                key: 'orgName',
                label: `企业名称`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 35,
                    },
                },
            },
            {
                key: 'areaCode',
                label: `企业所在地市`,
                type: SearchItemControlEnum.CASCADER,
                props: {
                    style: {
                        width: '100%'
                    },
                    options: area
                },
            },
            {
                key: 'personName',
                label: `联系人`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 35,
                    },
                },
            },
            {
                key: 'personPhone',
                label: `联系方式`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 16
                    },
                },
                formProps: {
                    rules: [
                        {
                            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                            message: '请输入正确格式的手机号码',
                        }
                    ],
                },
            },
            {
                key: 'demandSpName',
                label: `需求名称`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 35
                    },
                },
            },
            {
                key: 'demandSpType',
                label: `需求类型`,
                type: SearchItemControlEnum.CUSTOM,
                render: () => {
                    return <TwoLevelSelect dictionary={[]} />
                }
            },
            {
                key: 'demandSpIndustry',
                label: `所属行业`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 1000,
                    },
                },
            },
            {
                key: '',
                label: `所属产业`,
                type: SearchItemControlEnum.CUSTOM,
                render: () => {
                    return <>
                        <Form.Item
                            name="demandSpIndustry"
                            label="所属产业"
                            required
                            rules={[
                                () => ({
                                    validator(_, value) {
                                        if (!value || value.length === 0) {
                                            return Promise.reject(new Error('必选'))
                                        }
                                        if (value && value.length > 3) {
                                            return Promise.reject(new Error('最多选3个所属产业'))
                                        }
                                        return Promise.resolve()
                                    },
                                }),
                            ]}
                        >
                            <Checkbox.Group
                                options={
                                    (commonEnumList?.[CommonEnumDicTypes.ORG_INDUSTRY] || []).map((p) => {
                                        return {
                                            label: p.name,
                                            value: p.enumName,
                                        }
                                    }) || []
                                }
                                onChange={(checkedValues) => {
                                    if (checkedValues.includes('OTHER')) {
                                        setActiveElse(true)
                                    } else {
                                        setActiveElse(false)
                                    }
                                }}
                            />
                        </Form.Item>
                        {activeElse && (
                            <Form.Item
                                name="industryOther"
                                label=" "
                                colon={false}
                                rules={[
                                    () => ({
                                        validator(_, value) {
                                            if (!value || value.length === 0) {
                                                return Promise.reject(new Error('请输入'))
                                            }
                                            return Promise.resolve()
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    style={{ width: '300px' }}
                                    placeholder="请输入"
                                    autoComplete="off"
                                    allowClear
                                    maxLength={10}
                                />
                            </Form.Item>
                        )}
                    </>
                }
            },
            {
                key: 'demandSpTime', // demandSpStartTime, demandSpEndTime
                label: `需求时间`,
                type: SearchItemControlEnum.RANGEPICKER,
                props: {
                    style: {
                        width: '100%'
                    },
                },
            },
            {
                key: 'demandSpContent',
                label: `需求内容`,
                type: SearchItemControlEnum.TEXTAREA,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 1000,
                    },
                },
            },
            {
                key: 'demandSpBudget',
                label: `需求预算`,
                type: SearchItemControlEnum.INPUTNUMBER,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 35,
                        precision: 2,
                    },
                },
            },
        ],
        4: [
            {
                key: 'orgName',
                label: `企业名称`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 35
                    },
                },
            },
            {
                key: 'personName',
                label: `联系人`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 35
                    },
                },
            },
            {
                key: 'personPhone',
                label: `联系方式`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 16
                    },
                },
                formProps: {
                    rules: [
                        {
                            pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                            message: '请输入正确格式的手机号码',
                        }
                    ],
                },
            },
            {
                key: 'areaCode',
                label: `企业所在地市`,
                type: SearchItemControlEnum.CASCADER,
                props: {
                    style: {
                        width: '100%'
                    },
                    options: area
                },
            },
            {
                key: 'lastIncome',
                label: `上一年营业收入`,
                type: SearchItemControlEnum.INPUTNUMBER,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 35,
                        precision: 2,
                    },
                },
            },
            {
                key: 'orgStaffNum',
                label: `企业人数`,
                type: SearchItemControlEnum.INPUTNUMBER,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 35,
                        precision: 0,
                    },
                },
            },
            {
                key: 'orgType',
                label: `企业类型`,
                type: SearchItemControlEnum.CHECKBOX,
                dictionary: [
                    { title: '高新技术企业', value: 0 },
                    { title: '科技型中小企业', value: 1 },
                    { title: '民营科技企业', value: 2 },
                    { title: '专精特新企业', value: 3 },
                ],
                props: {
                    style: {
                        width: '100%'
                    },
                },
            },
            {
                key: 'financeType',
                label: `资金需求量`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [
                    { title: '500万以下', value: 0 },
                    { title: '500~1000万', value: 1 },
                    { title: '1000~3000万', value: 2 },
                    { title: '3000万以上', value: 3 },
                ],
                props: {
                    style: {
                        width: '100%'
                    },
                },
            },
            {
                key: 'financePeriod',
                label: `拟融资期限`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [
                    { title: '短期（一年内）', value: 0 },
                    { title: '中期（一至三年）', value: 1 },
                    { title: '长期（三年以上）', value: 2 },
                ],
                props: {
                    style: {
                        width: '100%'
                    },
                },
            },
            {
                key: 'financeUse',
                label: `拟融资用途`,
                type: SearchItemControlEnum.CUSTOM,
                render: (form: any) => {
                    //	融资用途 0-日常周转 1-设备采买 2-其他 financeUseMark
                    return <>
                        <Form.Item
                            name="demandSpIndustry"
                            label="所属产业"
                            required
                            rules={[
                                () => ({
                                    validator(_, value) {
                                        if (!value || value.length === 0) {
                                            return Promise.reject(new Error('必选'))
                                        }
                                        if (value && value.length > 3) {
                                            return Promise.reject(new Error('最多选3个所属产业'))
                                        }
                                        return Promise.resolve()
                                    },
                                }),
                            ]}
                        >
                            <Radio.Group>
                                <Radio value={0}>日常周转</Radio>
                                <Radio value={1}>设备采买</Radio>
                                <Radio value={2}>其他</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {activeElse && (
                            <Form.Item
                                name="financeUseMark"
                                label=" "
                                colon={false}
                                rules={[
                                    () => ({
                                        validator(_, value) {
                                            if (!value || value.length === 0) {
                                                return Promise.reject(new Error('请输入'))
                                            }
                                            return Promise.resolve()
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    style={{ width: '300px' }}
                                    placeholder="请输入"
                                    autoComplete="off"
                                    allowClear
                                    maxLength={10}
                                />
                            </Form.Item>
                        )}
                    </>
                }
            },
            {
                key: 'financeUrgency',
                label: `资金需求紧迫度`,
                type: SearchItemControlEnum.SELECT,
                dictionary: [
                    { title: '急需解决资金问题', value: 1 },
                    { title: '近期有融资计划，希望获得产品推介', value: 2 },
                    { title: '近期暂无融资计划，想了解合适产品', value: 3 },
                ],
                props: {
                    style: {
                        width: '100%'
                    },
                },
            },
            {
                key: 'settleBank',
                label: `主要结算银行`,
                type: SearchItemControlEnum.CHECKBOX,
                dictionary: [
                    { title: '国有大行', value: 0 },
                    { title: '全国股份制', value: 1 },
                    { title: '城商行', value: 2 },
                    { title: '农商行', value: 3 },
                ],
                props: {
                    style: {
                        width: '100%'
                    },
                },
            },
            {
                key: 'selfOwnedLand',
                label: `自有产权土地`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 1000,
                    },
                },
            },
            {
                key: 'selfOwnedHouse',
                label: `自有产权房产`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 1000,
                    },
                },
            },
            {
                key: 'selfOwnedDevice',
                label: `自有高价值设备`,
                type: SearchItemControlEnum.INPUT,
                props: {
                    style: {
                        width: '100%',
                        maxLength: 1000,
                    },
                },
            },
        ],
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
            bodyStyle={{ padding: '20px 40px', minWidth: 600 }}
        >

            <Form
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                form={form} name="advanced_search">
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

                {searchList[1]?.map((search) => (
                    <Form.Item {...search?.formProps || {}} name={search?.key} label={search?.label}>
                        {renderSearchItemControl(search, form)}
                    </Form.Item>
                ))}
            </Form>
        </Modal>
    )
}

export default RefineModal
