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
	Tooltip,
	Divider,
	Table,
	Space,
	Breadcrumb,
	Popconfirm,
	Switch
} from 'antd';
const { Option } = Select;
import {
	CheckOutlined,
	EyeOutlined,
	PlusOutlined,
	PlusCircleOutlined,
	MinusCircleOutlined,
	ArrowUpOutlined,
	ArrowDownOutlined,
	DeleteOutlined,
	SoundOutlined
} from '@ant-design/icons'
const { Step } = Steps;
import { Link, history, Prompt } from 'umi';
import type { FormInstance } from 'antd/es/form';
import DataColumn from '@/types/data-column';
import {
	getOrgTypeList,
} from '@/services/org-type-manage';
import UploadForm from '@/components/upload_form';
import DiagnoseManage from '@/types/service-config-diagnose-manage';
import './index.less'
import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
const sc = scopedClasses('service-config-add-diagnose');
type DiagnoseResult = DiagnoseManage.Diagnose;
type Covers = DiagnoseManage.Covers;
export default () => {
	const [diagnoseTitle, setDiagnoseTitle] = useState<string>('')
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

	// 诊断结果变量
	const [dataSource, setDataSource] = useState<any>([]);

	// 左侧问卷题目展示
	const [leftForm] = Form.useForm();

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

	/**
	 * 切换3个tab
	 * @returns React.ReactNode
	 */
	 const [currentStep, setCurrentStep] = useState<number>(0)
	 const selectButton = (): React.ReactNode => {
		 const handleEdgeChange = (e) => {
			setCurrentStep(e.target.value);
		 };
		 return (
			 <Radio.Group value={currentStep} onChange={handleEdgeChange}>
				 <Radio.Button value={0}>诊断问卷</Radio.Button>
				 <Radio.Button value={1}>诊断结果</Radio.Button>
				 <Radio.Button value={2}>诊断封面</Radio.Button>
			 </Radio.Group>
		 );
	 };

	// 诊断结果列表
	const columns = [
		{
			title: '序号',
			width: 80,
			render: (text: any, record: any, index: number) =>
				index + 1,
		},
		{
			title: '报告名称',
			dataIndex: 'name',
			isEllipsis: true,
			width: 380,
			render: (text: any, record: any, index: number) =>
				<Tooltip placement="bottomLeft" title={'点击报告名称，可以预览配置的诊断结果效果'}>
					<a
						href="#!"
						onClick={(e) => {
							setResultObj(record);
							setPreviewVisible(true);
						}}
					>
						{text}
					</a>
				</Tooltip>
		}
	];
	const [resultObj, setResultObj] = useState<DiagnoseResult>({})
	// 结果预览
	const [previewVisible, setPreviewVisible] = useState<boolean>(false)
	const previewResultModal = (): React.ReactNode => {
		return (
			<Modal
				title={`「${resultObj.name}」结果预览`}
				width="800px"
				visible={previewVisible}
				maskClosable={false}
				closable={false}
				className="preview-modal"
				footer={[
					<Button key="submit" type="primary" style={{ width: 160 }} onClick={() => { setPreviewVisible(false) }}>
						关闭
					</Button>
				]}
			>
				<div className='preview-wrap'>
					<h3>诊断报告概述</h3>
					<p>{resultObj && resultObj.summary || ''}</p>
					<h3>诊断目标建议</h3>
					<p>{resultObj && resultObj.recommendations || ''}</p>
					<h3>特殊提醒</h3>
					<p>{resultObj && resultObj.remind || ''}</p>
					<h3>推荐服务商</h3>
					<p></p>
					<h3>推荐技术经理人</h3>
					<p>{resultObj && resultObj.relatedTechnicalManager && resultObj.relatedTechnicalManager.name || ''} {resultObj && resultObj.relatedTechnicalManager && resultObj.relatedTechnicalManager.phone || ''}</p>
					<h3>诊断结果关联问卷填写逻辑</h3>
					<p></p>
				</div>
			</Modal>
		)
	}
	const [covers, setCovers] = useState<Covers>({})

	return (
		<PageContainer
			className={sc('container')}
			header={{
				title: '历史版本查看',
				breadcrumb: (
					<Breadcrumb>
						<Breadcrumb.Item>
							<Link to="/service-config/diagnose">企业诊断管理</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>
							{'历史版本查看'}
						</Breadcrumb.Item>
					</Breadcrumb>
				)
			}}
		>
			{selectButton()}
			<div className={sc('container-content')}>
				{/* 第一步：诊断问卷 */}
				{currentStep == 0 && (
					<Row gutter={10}>
						<Col span={8}>
							<div className={sc('container-content-left')}>
								<div className={sc('container-content-left-header')}>
									<h3>问卷大纲</h3>
									<div>
										<Button icon={<EyeOutlined />} type="link">预览</Button>
									</div>
								</div>
								<div className={'diagnose-wrapper'}>
									<div>
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
													<div className={'padding-style'}>
														{// 单选
															item.type == 'radio' ? (
																<div>
																	<Form.Item
																		label={index + 1 + '.' + item.name}
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
																			{item.options.map((option: any, oi: number) => {
																				return (
																					<Row style={{
																						marginBottom: 10
																					}}>
																						<Radio value={option && option.label ? option.label : ('选项' + (oi + 1))} key={oi}>{option && option.label ? option.label : ('选项' + (oi + 1))}</Radio>
																					</Row>
																				)
																			})}
																		</Radio.Group>
																	</Form.Item>
																</div>
															) :
																// 多选
																item.type == 'checkbox' ? (
																	<div>
																		<Form.Item
																			label={index + 1 + '.' + item.name + '【多选题】'}
																			key={index}
																			rules={[{ required: item.isRequired }]}
																		>
																			<div className={'tooltip'}>{item.subTitle}</div>
																			<Checkbox.Group>
																				{item.options.map((option: any, oi: number) => {
																					return (
																						<Row style={{
																							marginBottom: 10
																						}}>
																							<Checkbox value={option && option.label ? option.label : ('选项' + (oi + 1))} key={oi}>{option && option.label ? option.label : ('选项' + (oi + 1))}</Checkbox>
																						</Row>
																					)
																				})}
																			</Checkbox.Group>
																		</Form.Item>
																	</div>
																) :
																	// 单项填空
																	item.type == 'input' ? (
																		<div>
																			<Form.Item
																				label={index + 1 + '.' + item.name}
																				key={index}
																				// extra={item.subTitle}
																				rules={[{ required: item.isRequired }]}
																			>
																				<div className={'tooltip'}>{item.subTitle}</div>
																				<Input placeholder="请输入" />
																			</Form.Item>
																		</div>
																	) :
																		// 级联选择
																		item.type == 'cascader' ? (
																			<div>
																				<Form.Item
																					label={index + 1 + '.' + item.name}
																					key={index}
																					rules={[{ required: item.isRequired }]}
																				>
																					<div className={'tooltip'}>{item.subTitle}</div>
																					<Cascader options={options} changeOnSelect />
																				</Form.Item>
																			</div>
																		) : ('')
														}
													</div>
												)
											})
										}
									</Form>
								</div>
							</div>
						</Col>
					</Row>
				)}
				{/* 第二步：诊断结果 */}
				{currentStep == 1 && (
					<div className='step-container-2'>
						<div className='table-header'>
							<h3>诊断结果列表</h3>
						</div>
						<div className='table-body'>
							<Table
								pagination={false}
								dataSource={dataSource}
								columns={columns}
								bordered
							/>
						</div>
					</div>
				)}
				{/* 第三步：诊断封面 */}
				{currentStep == 2 && (
					<div className='step-container-3'>
						<h3>诊断页面入口icon</h3>
						<img src={covers.inIcon || ''} />
						<Row>
							<Col span={6}>
								<h3>首页默认小icon</h3>
								<img src={covers.icon || ''} />
							</Col>
							<Col span={6}>
								<h3>首页3D图</h3>
								<img src={covers.coverUrl || ''} />
							</Col>
						</Row>
						<h3>诊断描述</h3>
						<ul>
							<li>{covers.diagnoseDescribe || ''}</li>
						</ul>
					</div>
				)}
			</div>
			{previewResultModal()}
		</PageContainer>
	)
}