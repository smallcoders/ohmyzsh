import {
	Button,
	Input,
	Form,
	Select,
	InputNumber,
	Row,
	Col,
	Radio,
	Checkbox,
	Cascader,
	message,
	Modal,
	Steps,
	Divider,
	Breadcrumb,
} from 'antd';
import {CheckOutlined, EyeOutlined, PlusOutlined, PlusCircleOutlined, MinusCircleOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons'
const { Step } = Steps;
import { Link, history, Prompt } from 'umi';
import DiagnoseManage from '@/types/service-config-diagnose-manage';
import './index.less'
import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
const sc = scopedClasses('service-config-add-diagnose');
type EditType = DiagnoseManage.Content;
export default () => {

	// 当前正在编辑的索引，-1表示问卷标题，其他索引为所编辑的题目索引
	const [currentAddIndex, setCurrentAddIndex] = useState<number>(-1)
	// 当前正在编辑的对象内容，回显右侧编辑项
	const [currentEditObj, setCurrentEditObj] = useState<any>({})

	const [diagnoseTitle, setDiagnoseTitle] = useState<string>('')

	const [addModalVisible, setAddModalVisible] = useState<boolean>(false)
	const [addLoading, setAddLoading] = useState<boolean>(false)
	// 左侧问卷题目
	const [diagnoseList, setDiagnoseList] = useState<any>([
		// {
		// 	name: '', //题目标题
		// 	type: '', //题目类型 单选-radio 多选-checkbox 单行文本-input 多行文本-textarea 级联选择-cascader
		// 	isRequired: 1, //是否必答 是-1 否-2
		// 	isKey: 1, //是否为关键题 是-1 否-2
		// 	subTitle: '', //副标题
		// 	options: [ // 单选/多选选项
		// 		{
		// 			label: '', //选项文字
		// 			allowInput: 1, //允许填空
		// 			inputIsRequired: 1, //填空是否为必填
		// 		}
		// 	],
		// 	related: {//关联题目
		// 		relations: [
		// 			{
		// 				dependIndex: 1, //依赖的题目索引值
		// 				dependValue: [], //依赖的选项数据集
		// 				conditionType: '', //依赖的类型 one-其中一个 all-全部选项
		// 			}
		// 		],
		// 		relatedRelation: '', //关联关系 and-且 or-或
		// 	},
		// 	validate: 1, // 填空题内容校验：不校验-0/手机号-1/金融数据-2）
		// 	maxLength: 1, // 填空最大字数
		// 	assignedProvince: 1, // 指定省份
		// }
	]);

	// 当前总的关联题目题库
	const [totalAbleRelated, setTotalAbelRelated] = useState<any>([])
	// 当前可选择的关联题目题库
	const [ableSelectRelated, setAbleSelectRelated] = useState<any>([])

	// 左侧问卷题目展示
	const [leftForm] = Form.useForm();
	// 右侧表单填写
	const [rightForm] = Form.useForm();

	interface Option {
		value: string;
		label: string;
		children?: Option[];
	}
	
	const options: Option[] = [
		{
			value: 'zhejiang',
			label: 'Zhejiang',
			children: [
				{
					value: 'hangzhou',
					label: 'Hanzhou',
					children: [
						{
							value: 'xihu',
							label: 'West Lake',
						},
					],
				},
			],
		},
		{
			value: 'jiangsu',
			label: 'Jiangsu',
			children: [
				{
					value: 'nanjing',
					label: 'Nanjing',
					children: [
						{
							value: 'zhonghuamen',
							label: 'Zhong Hua Men',
						},
					],
				},
			],
		},
	];

	// 输入标题
	const inputTitle = (value: any) => {
		setDiagnoseTitle(value.target.value)
	}

	// 添加题目
	const addProblem = (type: string) => {
		let arr = type.split('-');
		let sameObj:any = {
			name: '题目标题',
			type: type,
			isRequired: [1],
			subTitle: '',
			related: {
				relations: [],
				relatedRelation: '',
			}
		}
		if(arr.length >1) {
			sameObj.type = 'input'
			if(arr[1] == '1') {//手机号
				sameObj.validate = 1
			}else {//金融数据
				sameObj.validate = 2
			}
		}else {
			if(type == 'radio') {//单选
				sameObj.isKey = []
				sameObj.options = [
					{
						label: '',
						allowInput: 0,
						inputIsRequired: 0,
					},
					{
						label: '',
						allowInput: 0,
						inputIsRequired: 0,
					}
				]
			}else if(type == 'checkbox') {//多选
				sameObj.isKey = []
				sameObj.options = [
					{
						label: '',
						allowInput: 0,
						inputIsRequired: 0,
					},
					{
						label: '',
						allowInput: 0,
						inputIsRequired: 0,
					},
					{
						label: '',
						allowInput: 0,
						inputIsRequired: 0,
					}
				]
			}else if(type == 'cascader') {//省市区
				sameObj.assignedProvince = 0
			}else if(type == 'input') {//单项填空
				sameObj.validate = 0
			}
		}
		let lastArr:any = [...diagnoseList]
		console.log(sameObj, 'sameObj');
		setCurrentEditObj(sameObj)
		rightForm.setFieldsValue({ ...sameObj });
		lastArr.push(sameObj)
		// console.log(lastArr, 'lastArr');
		setCurrentAddIndex(lastArr.length-1)
		setDiagnoseList(lastArr)
		setAddModalVisible(false)
	}

	// 表单更新
	const onValuesChange = (changedValues: any, allValues: any) => {
		console.log(changedValues,999,allValues);
		const list = [...diagnoseList]
		list.splice(currentAddIndex, 1, {
			...list[currentAddIndex],
			...allValues,
			...changedValues,		
		} as EditType);
		// console.log(list, 'list');
		setDiagnoseList(list)
	}

	const deal = () => {
		let arr = [...diagnoseList]
		console.log(
			arr.filter((item, index) => (item.type == 'radio' || item.type == 'checkbox') && index<currentAddIndex
			), 888
		)
		return arr.filter((item) => {
			item.type == 'radio' || item.type == 'checkbox'
		})
	}
	// 
	useEffect(() => {
    setTotalAbelRelated(deal())
  }, [diagnoseList]);

	// 关联题目
	const relateTo = () => {
		if(currentAddIndex == 0) {
			message.error('第1题不能设置题目关联逻辑')
		}
	}

	const useModal = (): React.ReactNode => {
		return (
			<Modal
        title={'题目选择'}
        width="500px"
        visible={addModalVisible}
        maskClosable={false}
        okButtonProps={{ loading: addLoading }}
        onCancel={() => {setAddModalVisible(false)}}
        footer={null}
      >
				<div className={sc('container-modal')}>
					<h3>选择题</h3>
					<Button type='link' onClick={() => {addProblem('radio')}}>单选</Button>
					<Button type='link' onClick={() => {addProblem('checkbox')}}>多选</Button>
					<h3 style={{marginTop: 16}}>填空题</h3>
					<Button type='link' onClick={() => {addProblem('input')}}>单项填空</Button>
					<h3 style={{marginTop: 16}}>信息录入</h3>
					<Button type='link' onClick={() => {addProblem('input-1')}}>手机号</Button>
					<Button type='link' onClick={() => {addProblem('cascader')}}>省市区</Button>
					<Button type='link' onClick={() => {addProblem('input-2')}}>金融数据</Button>
				</div>
			</Modal>
		)
	}

	return (
		<PageContainer
      className={sc('container')}
      header={{
        title: '新建诊断',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/service-config/diagnose">企业诊断管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {'新建诊断'}
            </Breadcrumb.Item>
          </Breadcrumb>
        )
      }}
    >
			<div className={sc('container-header')}>
				<Steps progressDot current={0}>
					<Step title="诊断问卷" description="配置问卷题目" />
					<Step title="诊断结果" description="配置诊断报告、报告关联问卷、关联平台资源" />
					<Step title="诊断封面" description="配置该诊断在羚羊平台的展示效果" />
				</Steps>
			</div>
			<div className={sc('container-content')}>
				<Row gutter={10}>
					<Col span={8}>
						<div className={sc('container-content-left')}>
							<div className={sc('container-content-left-header')}>
								<h3>问卷大纲</h3>
								<div>
									<Button icon={<CheckOutlined />} type="link">下一步</Button>
									<Button icon={<EyeOutlined />} type="link">预览</Button>
									<Button icon={<PlusOutlined />} type="link" onClick={() => {
										setAddModalVisible(true)
									}}>添加题目</Button>
								</div>
							</div>
							<div className={'diagnose-wrapper'}>
								<div className={currentAddIndex == -1 ? 'active' : ''} onClick={() => {setCurrentAddIndex(-1)}}>
									<h3>问卷标题</h3>
									<p>{diagnoseTitle}</p>
								</div>
								<Form
									layout={'vertical'}
									form={leftForm}
								>
									{
										diagnoseList && diagnoseList.map((item: any, index: number) => {
											return (
												// 单选
												item.type == 'radio' ? (
													<div className={currentAddIndex == index ? 'active' : 'padding-style'} onClick={() => {setCurrentAddIndex(index)}}>
														<Form.Item 
															label={index+1 + '.' + item.name}
															key={index}
															rules={[
																{ 
																	required: item.isRequired,
																	message: '必填',
																}
															]}
														>
															<div className={'tooltip'}>{item.subTitle}</div>
															<Radio.Group>
																{item.options.map((option:any, oi: number) => {
																	return (
																		<Row style={{
																			marginBottom: 10
																		}}>
																			<Radio value={option&&option.label?option.label:('选项'+(oi+1))} key={oi}>{option&&option.label?option.label:('选项'+(oi+1))}</Radio>
																		</Row>
																	)
																})}
															</Radio.Group>
														</Form.Item>
													</div>	
												) :
												// 多选
												item.type == 'checkbox' ? (
													<div className={currentAddIndex == index ? 'active' : 'padding-style'} onClick={() => {setCurrentAddIndex(index)}}>
														<Form.Item 
															label={index+1 + '.' + item.name + '【多选题】'}
															key={index}
															rules={[{ required: item.isRequired }]}
														>
															<Checkbox.Group>
																{item.options.map((option:any, oi: number) => {
																	return (
																		<Row style={{
																			marginBottom: 10
																		}}>
																			<Checkbox value={option&&option.label?option.label:('选项'+(oi+1))} key={oi}>{option&&option.label?option.label:('选项'+(oi+1))}</Checkbox>
																		</Row>
																	)
																})}
															</Checkbox.Group>
														</Form.Item>
													</div>	
												) :
												// 单项填空
												item.type == 'input' ? (	
													<div className={currentAddIndex == index ? 'active' : 'padding-style'} onClick={() => {setCurrentAddIndex(index)}}>
														<Form.Item 
															label={index+1 + '.' + item.name}
															rules={[{ required: item.isRequired }]}
														>
															<Input placeholder="请输入" />
														</Form.Item>
													</div>
												) : 
												// 级联选择
												item.type == 'cascader' ? (	
													<div className={currentAddIndex == index ? 'active' : 'padding-style'} onClick={() => {setCurrentAddIndex(index)}}>
														<Form.Item 
															label={index+1 + '.' + item.name}
															rules={[{ required: item.isRequired }]}
														>
															<Cascader options={options} changeOnSelect />
														</Form.Item>
													</div>
												) : ('')
											)
										})
									}
								</Form>
							</div>
						</div>
					</Col>
					<Col span={16}>
						<div className={sc('container-content-right')}>
							<div className={sc('container-content-right-header')}>
								<h3>问卷编辑</h3>
							</div>
							<div className={'diagnose-edit-wrapper'}>
								{currentAddIndex == -1 && (
									<>
										<h3>问卷标题</h3>
										<Input placeholder='请输入' onInput={inputTitle} />
										<p className='tip'>提示：问卷标题将作为诊断标题使用</p>
									</>
								)}
								{currentEditObj && (currentEditObj.type == 'radio' || currentEditObj.type == 'checkbox') && (
									<Form
										layout={'vertical'}
										form={rightForm}
										initialValues={{"options": [{
                      label: '',
                      allowInput: []
                    }]}}
										onValuesChange={(newEventName, allValues) => {onValuesChange(newEventName, allValues)}}
									>
										<Form.Item label="标题" name='name'>
											<Input placeholder='请输入' />
										</Form.Item>
										<Row>
											<Col span={4}>
												<Form.Item name="isRequired">
													<Checkbox.Group>
														<Checkbox value={1}>必答</Checkbox>
													</Checkbox.Group>
												</Form.Item>
											</Col>
											<Col span={4}>
												<Form.Item name="isKey">
													<Checkbox.Group>
														<Checkbox value={1}>设为关键题</Checkbox>
													</Checkbox.Group>
												</Form.Item>
											</Col>
										</Row>
										<Form.Item label="填写提示" name={'subTitle'}>
											<Input placeholder='输入填写提示可以作为题目副标题' />
										</Form.Item>
										<Row style={{marginBottom: 8}}>
											<Col span={14}>
												<div>选项文字</div>
											</Col>
											<Col span={6}>
												<div>允许填空</div>
											</Col>
											<Col span={4}>
												<div>上移下移</div>
											</Col>
										</Row>
										<Form.List name="options">
											{(fields, { add, remove, move }) => (
												<>
													{fields.map((field, fieldIndex) => (
														<Row>
															<Col span={11}>
																<Form.Item
																	{...field}
																	name={[field.name, 'label']}
																>
																	<Input placeholder='请输入'/>
																</Form.Item>
															</Col>
															<Col span={3}>
																<PlusCircleOutlined style={{marginLeft: 8}} onClick={() => add()}/>
																<MinusCircleOutlined style={{marginLeft: 8}} onClick={() => remove(field.name)} />
															</Col>
															<Col span={6}>
																<Row>
																	<Col span={6}>
																		<Form.Item
																			{...field}
																			name={[field.name, 'allowInput']}
																		>
																			<Checkbox.Group>
																				<Checkbox value={1}></Checkbox>
																			</Checkbox.Group>
																		</Form.Item>
																	</Col>
																	{/* <Col span={1} style={{textAlign: 'center'}}>
																		<Divider type="vertical" />
																	</Col> */}
																	<Col span={14}>
																		<Form.Item
																			{...field}
																			name={[field.name, 'inputIsRequired']}
																		>
																			<Checkbox.Group>
																				<Checkbox value={1}>必填</Checkbox>
																			</Checkbox.Group>
																		</Form.Item>
																	</Col>
																</Row>
															</Col>
															<Col span={4}>
																<ArrowUpOutlined style={{marginLeft: 8}} onClick={() => move(fieldIndex, fieldIndex-1)}/>
																<ArrowDownOutlined style={{marginLeft: 8}} onClick={() => move(fieldIndex, fieldIndex+1)} />
															</Col>
														</Row>
													))}
												</>
											)}
										</Form.List>
										<h3>逻辑设置</h3>
										<Button type="link" onClick={() => {relateTo()}}>题目关联</Button>
									</Form>
								)}
								{currentEditObj && currentEditObj.type == 'input' && (
									<Form
										layout={'vertical'}
										form={rightForm}
									>
										<Form.Item label="标题" name='name'>
											<Input placeholder='请输入' onInput={inputTitle} />
										</Form.Item>
										<Row>
											<Col span={4}>
												<Form.Item name="isRequired">
													<Checkbox.Group>
														<Checkbox value={1}>必答</Checkbox>
													</Checkbox.Group>
												</Form.Item>
											</Col>
										</Row>
										<Form.Item label="填写提示">
											<Input placeholder='输入填写提示可以作为题目副标题' />
										</Form.Item>
										<Form.Item label="内容校验">
											<Radio.Group>
												<Radio value={0}>不校验</Radio>
												<Radio value={1}>手机号</Radio>
												<Radio value={2}>金融数据</Radio>
											</Radio.Group>
										</Form.Item>
										{currentEditObj.validate == 0 && (
											<Form.Item label="输入框属性" name={'type'}>
												<Radio.Group>
													<Radio value={'input'}>单行文本</Radio><Form.Item label="最大字数"><Input style={{width: 100}} /></Form.Item>
													<Radio value={'textarea'}>多行文本</Radio><Form.Item label="最大字数"><Input style={{width: 100}} /></Form.Item>
												</Radio.Group>
											</Form.Item>
										)}
										<h3>逻辑设置</h3>
										<Button type="link">题目关联</Button>
									</Form>
								)}
								{currentEditObj && (currentEditObj.type == 'cascader') && (
									<Form
										layout={'vertical'}
										form={rightForm}
									>
										<Form.Item label="标题" name='name'>
											<Input placeholder='请输入' onInput={inputTitle} />
										</Form.Item>
										<Row>
											<Col span={4}>
												<Form.Item name="isRequired">
													<Checkbox.Group>
														<Checkbox value={1}>必答</Checkbox>
													</Checkbox.Group>
												</Form.Item>
											</Col>
											<Col span={4}>
												<Form.Item name="isKey">
													<Checkbox.Group>
														<Checkbox value={1}>指定省份</Checkbox>
													</Checkbox.Group>
												</Form.Item>
											</Col>
										</Row>
										<Form.Item label="填写提示">
											<Input placeholder='输入填写提示可以作为题目副标题' />
										</Form.Item>
										<h3>逻辑设置</h3>
										<Button type="link">题目关联</Button>
									</Form>
								)}
							</div>
						</div>
					</Col>
				</Row>
			</div>
			{useModal()}
		</PageContainer>
	)
}