import {
	Button,
	Input,
	Form,
	Select,
	Row,
	Col,
	Radio,
	RadioChangeEvent,
	Checkbox,
	Cascader,
	message,
	Modal,
	Steps,
	Tooltip,
	Table,
	Breadcrumb,
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
import QuestionnaireTopicList from '../components/questionnaire-topic-list'
import DataColumn from '@/types/data-column';
import {
	getOrgTypeList,
} from '@/services/org-type-manage';
import { listAllAreaCode } from '@/services/common';
import {
	addOrgType,
	diagnoseDetail,
} from '@/services/diagnose-manage';
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
	const [provinceList, setProvinceList] = useState<any>([])
	const [diagnoseTitle, setDiagnoseTitle] = useState<string>('')
	const [diagnoseList, setDiagnoseList] = useState<any>([]);
	const [dataSource, setDataSource] = useState<any>([]);
	const [leftForm] = Form.useForm();
	/**
   * 准备数据和路由获取参数等
   */
	const prepare = async () => {
		try {
			const { firstQuestionnaireNo,version } = history.location.query as { firstQuestionnaireNo: string | undefined, version: string | undefined };
			// 获取详情 塞入表单
			const detailRs = await diagnoseDetail({
				firstQuestionnaireNo,
				version
			});
			const {covers, diagnose, questionnaireObject} = detailRs.result
			setCovers(covers)
			setDataSource(diagnose)
			setDiagnoseTitle(questionnaireObject.title || '')
			setDiagnoseList(questionnaireObject.problems)
			let areaRes = await listAllAreaCode()
			setProvinceList(areaRes && areaRes.result || [] )
		} catch (error) {
		  console.log('error', error);
		  message.error('获取初始数据失败');
		}
	};
	useEffect(() => {
		prepare();
	}, []);
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

	// 问卷预览
	const [edgeFront, setEdgeFront] = useState<number>(1)
	const selectFrontButton = (): React.ReactNode => {
		const handleEdgeChange = (e: RadioChangeEvent) => {
			setEdgeFront(e.target.value);
		};
		return (
			<Radio.Group value={edgeFront} onChange={handleEdgeChange}>
				<Radio.Button value={1}>web端预览</Radio.Button>
				<Radio.Button value={2}>移动端预览</Radio.Button>
			</Radio.Group>
		);
	};
	const [previewQuestionsVisible, setPreviewQuestionsVisible] = useState<boolean>(false)
	const [questionsForm] = Form.useForm()
	const previewQuestionsModal = (): React.ReactNode => {
		return (
			<Modal
				title={`问卷预览`}
				width="1000px"
				visible={previewQuestionsVisible}
				maskClosable={false}
				onCancel={() => {setPreviewQuestionsVisible(false)}}
				className="questions-modal"
				footer={null}
			>
				<div className='preview-wrap'>
					{selectFrontButton()}
					<div className={edgeFront==1? 'web-preview':'h5-preview'}>
						<QuestionnaireTopicList topicTitle={diagnoseTitle||'111'} topicList={diagnoseList} form={questionsForm} />
					</div>
				</div>
			</Modal>
		)
	}

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
										<Button icon={<EyeOutlined />} type="link" onClick={() => {setPreviewQuestionsVisible(true)}}>预览</Button>
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
						<img src={`/antelope-manage/common/download/${covers.inIcon}`} alt="图片损坏" style={{width: 160}} />
						{covers.showInHomePage && (
							<>
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
							</>
						)}
						
					</div>
				)}
			</div>
			{previewResultModal()}
			{previewQuestionsModal()}
		</PageContainer>
	)
}