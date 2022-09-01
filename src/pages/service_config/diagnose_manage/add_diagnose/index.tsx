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
type EditType = DiagnoseManage.Content;
type DiagnoseResult = DiagnoseManage.Diagnose;
type Covers = DiagnoseManage.Covers;
export default () => {
	/**
   * 准备数据和路由获取参数等
   */
	const prepare = () => {
		// try {
		const { id } = history.location.query as { id: string | undefined };
	
		if (id) {
			console.log(id, 'id');
			// 获取详情 塞入表单
			// const detailRs = await getVideoDetail(id);
			// let editItem = { ...detailRs.result };
			// editItem.typeIds = editItem.typeIds?.split(',').map(Number);//返回的类型为字符串，需转为数组
			// console.log(editItem, '---editItem')
			// if (detailRs.code === 0) {
			//   editItem.isSkip = detailRs.result.url ? 1 : 0;
			//   setIsSkip(editItem.isSkip);
			//   // setIsBeginTopAndEditing(Boolean(editItem.isTopApp));
			//   console.log(editItem, 'res---editItem');
			//   let extended = [];//扩展功能数据获取
			//   if(!editItem.closeReplay) {
			// 	extended.push('replay');
			//   }
			//   if(!editItem.closeKf) {
			// 	extended.push('kf');
			//   }
			//   let liveFunctions = [];//直播间功能数据获取
			//   if(!editItem.closeLike) {
			// 	liveFunctions.push('like');
			//   }
			//   if(!editItem.closeGoods) {
			// 	liveFunctions.push('goods');
			//   }
			//   if(!editItem.closeComment) {
			// 	liveFunctions.push('comment');
			//   }
			//   if(!editItem.closeShare) {
			// 	liveFunctions.push('share');
			//   }
			//   setEditingItem({...editItem, liveFunctions, extended, time: [moment(editItem.startTime), moment(editItem.endTime)]});
			// } else {
			//   message.error(`获取详情失败，原因:${detailRs.message}`);
			// }
		}
		// } catch (error) {
		//   console.log('error', error);
		//   message.error('获取初始数据失败');
		// }
	};
	
	useEffect(() => {
		prepare();
	}, []);

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
	const [relationList, setRelationList] = useState<any>([])

	const [currentStep, setCurrentStep] = useState<number>(0)

	// 诊断结果变量
	const [dataSource, setDataSource] = useState<any>([]);

	interface UserType {
		name: string;
		age: string;
	}

	interface ModalFormProps {
		visible: boolean;
		onCancel: () => void;
	}

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

	// 添加题目
	const addProblem = (type: string) => {
		let arr = type.split('-');
		let sameObj: any = {
			name: '题目标题',
			type: type,
			isRequired: [1],
			subTitle: '',
			// related: {
			relations: [],
			relatedRelation: '',
			// }
		}
		if (arr.length > 1) {
			sameObj.type = 'input'
			if (arr[1] == '1') {//手机号
				sameObj.validate = 1
			} else {//金融数据
				sameObj.validate = 2
			}
		} else {
			if (type == 'radio') {//单选
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
			} else if (type == 'checkbox') {//多选
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
			} else if (type == 'cascader') {//省市区
				sameObj.assignedProvince = 0
			} else if (type == 'input') {//单项填空
				sameObj.validate = 0
			}
		}
		let lastArr: any = [...diagnoseList]
		console.log(sameObj, 'sameObj');
		setCurrentEditObj(sameObj)
		rightForm.setFieldsValue({ ...sameObj });
		lastArr.push(sameObj)
		setCurrentAddIndex(lastArr.length - 1)
		setDiagnoseList(lastArr)
		setAddModalVisible(false)
	}

	// 点击下一步
	const toNext = () => {
		if(currentStep == 0) {
			if(diagnoseList && diagnoseList.length > 0) {
				setCurrentStep(currentStep+1)
			}else {
				message.error('您还未添加题目！')
				return false
			}
		}
		setCurrentStep(currentStep+1)
	}
	// 点击上一步toPrev
	const toPrev = () => {
		setCurrentStep(currentStep-1)
	}

	// 点击左侧题目，更新右侧表单
	const clickLeftProblem = (index: number) => {
		setCurrentAddIndex(index)
		console.log({...diagnoseList[index]})
		setCurrentEditObj({...diagnoseList[index]})
		rightForm.setFieldsValue({...diagnoseList[index]});
	}

	// 删除问卷中的题目
	//点击「删除」，若当前题目没有关联逻辑，则可直接删除，无需二次确认；若当前题目有关联逻辑，则出现提示，继续删除将自动移除配置的关联逻辑
	const deleteInfo = (index: number) => {
		Modal.confirm({
			title: '提示',
			content: (
				<div>
					<p>当前题目有设置逻辑，删除操作会自动清空关联，确认删除吗？</p>
				</div>
			),
			onOk() {
				console.log(index, 666);
			},
			onCancel() {}
		});
	};
	const deleteDiagnose = (index: number) => {
		let arr = [...diagnoseList]
		console.log(arr, 'deleteDiagnose');
		arr.map((item) => {
			item.relations.map((j: any) => {
				if(j.dependIndex == index) {
					deleteInfo(index)
				}else {
					setCurrentAddIndex(index-1)
					arr.splice(index, 1)
					setDiagnoseList(arr)
				}
			})
		})
	
	}
	const swapItems = (arr:any, index1:number, index2:number) => {
		arr[index1] = arr.splice(index2, 1, arr[index1])[0]
		return arr
	}
	// 上移问卷中的题目
	const upData = (index: number) => {
		let arr = [...diagnoseList]
		if(arr.length > 1 && index != 0) {
			let newArr = swapItems(arr, index, index-1)
			setDiagnoseList(newArr)
		}
	}
	const downData = (index: number) => {
		let arr = [...diagnoseList]
		if(arr.length > 1 && index != (arr.length - 1)) {
			let newArr = swapItems(arr, index, index+1)
			setDiagnoseList(newArr)
		}
	}

	// 诊断问卷-表单更新
	const onValuesChange = (changedValues: any, allValues: any) => {
		console.log(changedValues, 999, allValues);
		if(currentAddIndex == -1) {
			setDiagnoseTitle(changedValues.title)
		}else {
			const list = [...diagnoseList]
			list.splice(currentAddIndex, 1, {
				...list[currentAddIndex],
				...changedValues,
				...allValues,
			} as EditType);
			console.log(list, 'list');
			setDiagnoseList(list)
		}
	}

	const deal = () => {
		let arr = [...diagnoseList]
		let arr2 = arr.map((item, index) => {
			const rtn = {...item}
			if((item.type == 'radio' || item.type == 'checkbox') && index < currentAddIndex) {
				rtn.dependIndex = index
			}
			return rtn
		}).filter((item:any, index) => (item.type == 'radio' || item.type == 'checkbox') && index < currentAddIndex)
		console.log(arr2, 'arr2')
		return arr2
	}
	// 
	useEffect(() => {
		setTotalAbelRelated([...deal()])
		setAbleSelectRelated([...deal()])
	}, [diagnoseList]);

	// 关联题目
	const relateTo = () => {
		if (currentAddIndex == 0) {
			message.error('第1题不能设置题目关联逻辑')
			return false
		}
		if (!ableSelectRelated || ableSelectRelated.length == 0) {
			message.error('此题前面没有单选题和多选题，无法设置题目关联逻辑')
			return false
		}
		showUserModal()
	}

	// 添加题目弹框，选择题型
	const useModal = (): React.ReactNode => {
		return (
			<Modal
				title={'题型选择'}
				width="500px"
				visible={addModalVisible}
				maskClosable={false}
				okButtonProps={{ loading: addLoading }}
				onCancel={() => { setAddModalVisible(false) }}
				footer={null}
			>
				<div className={sc('container-modal')}>
					<h3>选择题</h3>
					<Button type='link' onClick={() => { addProblem('radio') }}>单选</Button>
					<Button type='link' onClick={() => { addProblem('checkbox') }}>多选</Button>
					<h3 style={{ marginTop: 16 }}>填空题</h3>
					<Button type='link' onClick={() => { addProblem('input') }}>单项填空</Button>
					<h3 style={{ marginTop: 16 }}>信息录入</h3>
					<Button type='link' onClick={() => { addProblem('input-1') }}>手机号</Button>
					<Button type='link' onClick={() => { addProblem('cascader') }}>省市区</Button>
					<Button type='link' onClick={() => { addProblem('input-2') }}>金融数据</Button>
				</div>
			</Modal>
		)
	}

	const useResetFormOnCloseModal = ({ form, visible }: { form: FormInstance; visible: boolean }) => {
		const prevVisibleRef = useRef<boolean>();
		useEffect(() => {
			prevVisibleRef.current = visible;
		}, [visible]);
		const prevVisible = prevVisibleRef.current;

		useEffect(() => {
			if (!visible && prevVisible) {
				form.resetFields();
			}
		}, [form, prevVisible, visible]);
	};

	const ModalForm: React.FC<ModalFormProps> = ({ visible, onCancel }) => {
		const [form] = Form.useForm();

		useResetFormOnCloseModal({
			form,
			visible,
		});

		const onOk = () => {
			form.submit();
		};

		return (
			<Modal title="题目关联" visible={visible} onOk={onOk} onCancel={onCancel}>
				<Form 
					form={form} 
					layout="vertical" 
					name="relatedForm"
					initialValues={{
						currentTitle: currentAddIndex>-1 && diagnoseList && diagnoseList.length > 0 && (
							`${currentAddIndex + 1}.${diagnoseList[currentAddIndex].name}`
						)
					}}
				>
					<Form.Item label={'当前题目'} name="currentTitle">
						<Input disabled/>
					</Form.Item>
					<Form.List name="relations">
						{(fields, { add, remove }) => (
							<>
								{fields.map((field, fieldIndex) => (
									<Row>
										<Col span={17}>
											<Form.Item
												{...field}
												name={[field.name, 'dependIndex']}
												label={'关联题目' + (fieldIndex + 1)}
											>
												<Select>
													{ableSelectRelated && ableSelectRelated.map((item: any) =>
														// <Option value={(item.dependIndex+1)+'.'+item.name} key={(item.dependIndex+1)+item.name}>{item.dependIndex+1}.{item.name}</Option>
														<Option value={item.dependIndex} key={(item.dependIndex+1)+item.name}>{item.dependIndex+1}.{item.name}</Option>
													)}
												</Select>
											</Form.Item>
										</Col>
										<Col span={17}>
											<Form.Item
												{...field}
												name={[field.name, 'dependValue']}
												label={`当「关联题目${fieldIndex + 1}」选择下方选项：`}
											>
												<Checkbox.Group>
													{diagnoseList && diagnoseList.length>0 && diagnoseList[0].options.map((o: any) =>
														<Checkbox value={o.label} key={o.label}>{o.label}</Checkbox>
													)}
												</Checkbox.Group>
											</Form.Item>
										</Col>
										<Col span={17}>
											中任意一个时，「当前题目」才出现
										</Col>
										<Col span={3}>
											<MinusCircleOutlined style={{ marginLeft: 8 }} onClick={() => remove(field.name)} />
										</Col>
									</Row>
								))}
								<Form.Item>
									<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
										添加关联题目
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
				</Form>
			</Modal>
		);
	};

	const [visible, setVisible] = useState(false);
	const showUserModal = () => {
		setVisible(true);
	};
	const hideUserModal = () => {
		setVisible(false);
	};

	/**
   * 编辑或返回上一步时获取诊断结果数据
   */
	//  const getPages = async () => {
  //   try {
  //     const { result, code } = await getOrgTypeList();
  //     if (code === 0) {
  //       setDataSource(
	// 				result
  //         // result.map((p, index) => {
  //         //   return { sort: index, ...p };
  //         // }),
  //       );
  //     } else {
  //       message.error(`请求列表数据失败`);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // 作为生命周期 开始时获取
  // useEffect(() => {
  //   getPages();
  // }, []);
	const [addReultVisible, setAddResultVisible] = useState<boolean>(false)

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
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      render: (_: any, record: any, index: number) => {
        return (
					<Space>
						<a
							href="#"
							onClick={() => {
								setEditResultIndex(index)
								setResultObj(record);
								setAddResultVisible(true);
								resultForm.setFieldsValue({...record})
							}}
						>
							编辑{' '}
						</a>
            <Popconfirm
              title={
                <>
                  <h3>确定删除？</h3>
                </>
              }
              okText="确定"
              cancelText="取消"
              onConfirm={() => removeResult(index)}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
	const [resultObj, setResultObj] = useState<DiagnoseResult>({})
	const [editResultIndex, setEditResultIndex] = useState<number>(-1)//编辑诊断结果列表的index
	// const [curResultIndex, setCurResultIndex] = useState<number>(0)
	// 诊断结果-表单更新
	const onValuesChange2 = (changedValues: any, allValues: any) => {
		console.log(changedValues, '诊断结果', allValues);
		setResultObj({...resultObj, ...allValues})
	}
	/**
   * 切换诊断结果3个tab
   * @returns React.ReactNode
   */
	const [edge, setEdge] = useState<number>(1)
	const [resultForm] = Form.useForm()
	const selectButton = (): React.ReactNode => {
    const handleEdgeChange = (e) => {
      setEdge(e.target.value);
    };
    return (
      <Radio.Group value={edge} onChange={handleEdgeChange}>
        <Radio.Button value={1}>诊断报告</Radio.Button>
        <Radio.Button value={2}>关联题关联</Radio.Button>
        <Radio.Button value={3}>资源关联</Radio.Button>
      </Radio.Group>
    );
  };
	const removeResult = (index: number) => {
		let arr = [...dataSource]
		arr.splice(index, 1)
		setDataSource(arr)
	}
	const info = () => {
		Modal.info({
			title: '提示',
			content: (
				<div>
					<p>请检查「诊断报告名称」和「诊断报告概述」是否填写</p>
				</div>
			),
			onOk() {},
		});
	};
	// 添加诊断结果
	const addReultOk = () => {
		resultForm
      .validateFields()
      .then(async (value) => {
				console.log(value);
				if(!value.name || !value.summary) {
					info()
					return false
				}
				if(editResultIndex > -1) {// 编辑
					const list = [...dataSource]
					list.splice(editResultIndex, 1, {
						...list[editResultIndex],
						...resultObj
					} as DiagnoseResult);
					setDataSource(list)
					resultForm.setFieldsValue({})
				}else {// 新增
					let arr = [...dataSource]
					arr.push(resultObj)
					setDataSource(arr)
				}
				setEdge(1)
				setAddResultVisible(false)
      })
      .catch(() => {
        info()
      });
	}
	const onSearch = (value: string) => {
		console.log('search:', value);
	};
	// 添加题目弹框，选择题型
	const useResultAddModal = (): React.ReactNode => {
		return (
			<Modal
				title={editResultIndex>-1 ? '编辑诊断结果' : '新建诊断结果'}
				width="600px"
				visible={addReultVisible}
				maskClosable={false}
				onOk={addReultOk}
				onCancel={() => { setAddResultVisible(false) }}
			>
				<div className='result-add-wrap'>
					{selectButton()}
					<div className='result-add-form'>
						<Form layout={'vertical'} form={resultForm}
							onValuesChange={(newEventName, allValues) => { onValuesChange2(newEventName, allValues) }}
						>
							{edge == 1 && (
								<>
									<Form.Item name={'name'} label="诊断报告名称" rules={[
										{
											required: true,
											message: '必填',
										}
									]}>
										<Input placeholder='请输入' maxLength={35} />
									</Form.Item>
									<Form.Item name={'summary'} label="诊断报告概述" rules={[
										{
											required: true,
											message: '必填',
										}
									]}>
										<Input.TextArea
											autoSize={false}
											placeholder='请输入'
											maxLength={2000}
											showCount={false}
											rows={3}
										/>
									</Form.Item>
									<Form.Item name={'recommendations'} label="诊断目标建议">
										<Input.TextArea
											autoSize={false}
											placeholder='请输入'
											maxLength={2000}
											showCount={false}
											rows={3}
										/>
									</Form.Item>
									<Form.Item name={'remind'} label="特殊提醒">
										<Input.TextArea
											autoSize={false}
											placeholder='请输入'
											maxLength={2000}
											showCount={false}
											rows={3}
										/>
									</Form.Item>
								</>
							)}
							{edge == 2 && (
								<>
									<div className='header-tip'>
										<SoundOutlined style={{fontSize: 20, marginRight: 8}}/>
										<p>根据问卷中设置的关键题进行诊断结果关联，满足设置的关联条件，就会展示此诊断结果<br/>将当前诊断结果设置为默认诊断结果时，将不可再配置关键题关联条件</p>
									</div>
									<Form.Item label="设为默认诊断结果" tooltip="关键题关联之外的其他问卷填写情况，均展示此结果" name={'defaultDiagnoseResult'} valuePropName="checked">
										<Switch checkedChildren="开" unCheckedChildren="关" />
									</Form.Item>
									<Form.List name="relations">
										{(fields, { add, remove }) => (
											<>
												{fields.map((field, fieldIndex) => (
													<Row>
														<Col span={17}>
															<Form.Item
																{...field}
																name={[field.name, 'label']}
																label={'关联关键题目' + (fieldIndex + 1)}
															>
																<Select>
																	{ableSelectRelated && ableSelectRelated.map((item: any) =>
																		<Option value={(item.dependIndex+1)+'.'+item.name} key={(item.dependIndex+1)+item.name}>{item.dependIndex+1}.{item.name}</Option>
																	)}
																</Select>
															</Form.Item>
														</Col>
														<Col span={17}>
															<Form.Item
																{...field}
																name={[field.name, 'dependValue']}
																label={`当「关联关键题目${fieldIndex + 1}」选择下方选项：`}
															>
																<Checkbox.Group>
																	{diagnoseList && diagnoseList.length>0 && diagnoseList[0].options.map((o: any) =>
																		<Checkbox value={o.label} key={o.label}>{o.label}</Checkbox>
																	)}
																</Checkbox.Group>
															</Form.Item>
														</Col>
														<Col span={17}>
															中任意一个时，「当前题目」才出现
														</Col>
														<Col span={3}>
															<MinusCircleOutlined style={{ marginLeft: 8 }} onClick={() => remove(field.name)} />
														</Col>
													</Row>
												))}
												<Form.Item>
													<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
														添加关联关键题目
													</Button>
												</Form.Item>
											</>
										)}
									</Form.List>
									<Form.Item label="多题关联时，题目之间的关联关系为" name='relatedRelation'>
										<Radio.Group>
											<Radio value={'and'}>为“且”的关系</Radio>
											<Radio value={'or'}>为“或”的关系</Radio>
										</Radio.Group>
									</Form.Item>
								</>
							)}
							{edge == 3 && (
								<>
									<Form.Item label="关联服务商" name={'relatedServers'}>
										<Select
											showSearch
											// mode='multiple'
											placeholder="Select a person"
											optionFilterProp="children"
											// onSearch={onSearch}
											filterOption={(input, option) =>
												(option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
											}
										>
											<Option value="jack">Jack</Option>
											<Option value="lucy">Lucy</Option>
											<Option value="tom">Tom</Option>
										</Select>
										<div>已选服务商：0</div>
									</Form.Item>
									<Form.Item label="关联技术经理人" name={['relatedTechnicalManager', 'name']}>
										<Input placeholder='请输入技术经理人姓名' maxLength={35} />
									</Form.Item>
									<Form.Item 
										name={['relatedTechnicalManager', 'phone']}
										rules={[
											{
												validator(_, value) {
													if (!value) {
														return Promise.resolve();
													}
													if (
														!/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
															value,
														)
													) {
														return Promise.reject(new Error('输入正确的手机号码'));
													}
													return Promise.resolve();
												},
											},
										]}
									>
										<Input placeholder='请输入技术经理人手机号' maxLength={11} />
									</Form.Item>
								</>
							)}
						</Form>
					</div>
				</div>
			</Modal>
		)
	}
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
          <Button key="submit" type="primary" style={{width: 160}} onClick={() => {setPreviewVisible(false)}}>
            关闭
          </Button>
        ]}
			>
				<div className='preview-wrap'>
					<h3>诊断报告概述</h3>
					<p>{resultObj&&resultObj.summary || ''}</p>
					<h3>诊断目标建议</h3>
					<p>{resultObj&&resultObj.recommendations || ''}</p>
					<h3>特殊提醒</h3>
					<p>{resultObj&&resultObj.remind || ''}</p>
					<h3>推荐服务商</h3>
					<p></p>
					<h3>推荐技术经理人</h3>
					<p>{resultObj&&resultObj.relatedTechnicalManager&&resultObj.relatedTechnicalManager.name || ''} {resultObj&&resultObj.relatedTechnicalManager&&resultObj.relatedTechnicalManager.phone || ''}</p>
					<h3>诊断结果关联问卷填写逻辑</h3>
					<p></p>
				</div>
			</Modal>
		)
	}

	const [coverForm] = Form.useForm()
	const [covers, setCovers] = useState<Covers>({})
	// 诊断结果-表单更新
	const onValuesChange3 = (changedValues: any, allValues: any) => {
		console.log(changedValues, '诊断封面', allValues);
		setCovers({...covers, ...allValues})
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
				<Steps progressDot current={currentStep}>
					<Step title="诊断问卷" description="配置问卷题目" />
					<Step title="诊断结果" description="配置诊断报告、报告关联问卷、关联平台资源" />
					<Step title="诊断封面" description="配置该诊断在羚羊平台的展示效果" />
				</Steps>
			</div>
			<div className={sc('container-content')}>
				{/* 第一步：诊断问卷 */}
				{currentStep == 0 && (
					<Row gutter={10}>
						<Col span={8}>
							<div className={sc('container-content-left')}>
								<div className={sc('container-content-left-header')}>
									<h3>问卷大纲</h3>
									<div>
										<Button icon={<CheckOutlined />} type="link" onClick={() => {toNext()}}>下一步</Button>
										<Button icon={<EyeOutlined />} type="link">预览</Button>
										<Button icon={<PlusOutlined />} type="link" onClick={() => {
											setAddModalVisible(true)
										}}>添加题目</Button>
									</div>
								</div>
								<div className={'diagnose-wrapper'}>
									<div className={currentAddIndex == -1 ? 'active' : ''} onClick={() => { clickLeftProblem(-1) }}>
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
													<div className={currentAddIndex == index ? 'active' : 'padding-style'}>
														{// 单选
															item.type == 'radio' ? (
																<div onClick={() => { clickLeftProblem(index) }}>
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
																<div onClick={() => { clickLeftProblem(index) }}>
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
																<div onClick={() => { clickLeftProblem(index) }}>
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
																<div onClick={() => { clickLeftProblem(index) }}>
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
														<div style={{textAlign: 'right', display: currentAddIndex == index ? 'block' : 'none', marginTop: -16}}>
															<Button type='link' icon={<DeleteOutlined />} onClick={() => {deleteDiagnose(currentAddIndex)}}>删除</Button>
															<Button type='link' icon={<ArrowUpOutlined />} onClick={() => {upData(currentAddIndex)}}>上移</Button>
															<Button type='link' icon={<ArrowDownOutlined />} onClick={() => {downData(currentAddIndex)}}>下移</Button>
														</div>
													</div>	
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
									<Form.Provider
										//题目关联弹框完成选择后更新相关变量 
										onFormFinish={(name, { values, forms }) => {
											console.log(name, values, 'onFormFinish');
											let indexRelate = values.currentTitle.split('.')[0]*1 -1
											console.log(indexRelate, 'indexRelate');
											const list = [...diagnoseList]
											list.splice(indexRelate, 1, {
												...list[indexRelate],
												...{relations: values.relations}
											} as EditType);
											console.log(list, 'list');
											setDiagnoseList(list)
											if (name === 'relatedForm') {
												const relations = rightForm.getFieldValue('relations') || [];
												rightForm.setFieldsValue({ relations: [...relations, values] });
												setVisible(false);
											}
										}}
									>
										{currentAddIndex == -1 && (
											<Form
												layout={'vertical'}
												form={rightForm}
												onValuesChange={(newEventName, allValues) => { onValuesChange(newEventName, allValues) }}
											>
												<Form.Item label="问卷标题" name='title'>
													<Input placeholder='请输入' />
												</Form.Item>
												<p className='tip'>提示：问卷标题将作为诊断标题使用</p>
											</Form>
										)}
										{currentEditObj && (currentEditObj.type == 'radio' || currentEditObj.type == 'checkbox') && (
											<Form
												layout={'vertical'}
												form={rightForm}
												onValuesChange={(newEventName, allValues) => { onValuesChange(newEventName, allValues) }}
											>
												<Form.Item label="标题" name='name'>
													<Input placeholder='请输入' />
												</Form.Item>
												<Row>
													<Col span={4}>
														<Form.Item name="isRequired" valuePropName="checked">
															<Checkbox value={1}>必答</Checkbox>
														</Form.Item>
													</Col>
													<Col span={4}>
														<Form.Item name="isKey" valuePropName="checked">
															<Checkbox>设为关键题</Checkbox>
														</Form.Item>
													</Col>
												</Row>
												<Form.Item label="填写提示" name={'subTitle'}>
													<Input placeholder='输入填写提示可以作为题目副标题' />
												</Form.Item>
												<Row style={{ marginBottom: 8 }}>
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
																			<Input placeholder='请输入' />
																		</Form.Item>
																	</Col>
																	<Col span={3}>
																		<PlusCircleOutlined style={{ marginLeft: 8 }} onClick={() => add()} />
																		<MinusCircleOutlined style={{ marginLeft: 8 }} onClick={() => remove(field.name)} />
																	</Col>
																	<Col span={6}>
																		<Row>
																			<Col span={6}>
																				<Form.Item
																					{...field}
																					name={[field.name, 'allowInput']}
																					valuePropName="checked"
																				>
																					
																					<Checkbox></Checkbox>
																				</Form.Item>
																			</Col>
																			<Col span={14}>
																				<Form.Item
																					{...field}
																					name={[field.name, 'inputIsRequired']}
																					valuePropName="checked"
																				>	
																					<Checkbox>必填</Checkbox>
																				</Form.Item>
																			</Col>
																		</Row>
																	</Col>
																	<Col span={4}>
																		<ArrowUpOutlined style={{ marginLeft: 8 }} onClick={() => move(fieldIndex, fieldIndex - 1)} />
																		<ArrowDownOutlined style={{ marginLeft: 8 }} onClick={() => move(fieldIndex, fieldIndex + 1)} />
																	</Col>
																</Row>
															))}
														</>
													)}
												</Form.List>
												<h3>逻辑设置</h3>
												<Tooltip placement="bottomLeft" title={'当前面题目选中某些选项时才出现此题'}>
													<Button type="link" onClick={() => { relateTo() }}>题目关联</Button>
												</Tooltip>
											</Form>
										)}
										{currentEditObj && currentEditObj.type == 'input' && (
											<Form
												layout={'vertical'}
												form={rightForm}
												onValuesChange={(newEventName, allValues) => { onValuesChange(newEventName, allValues) }}
											>
												<Form.Item label="标题" name='name'>
													<Input placeholder='请输入' />
												</Form.Item>
												<Row>
													<Col span={4}>
														<Form.Item name="isRequired" valuePropName="checked">
															<Checkbox>必答</Checkbox>
														</Form.Item>
													</Col>
												</Row>
												<Form.Item label="填写提示" name='subTitle'>
													<Input placeholder='输入填写提示可以作为题目副标题' />
												</Form.Item>
												<Form.Item label="内容校验" name={'validate'}>
													<Radio.Group>
														<Radio value={0}>不校验</Radio>
														<Radio value={1}>手机号</Radio>
														<Radio value={2}>金融数据</Radio>
													</Radio.Group>
												</Form.Item>
												{currentEditObj.validate == 0 && (
													<Form.Item label="输入框属性">
														<Input.Group compact>
															<Form.Item
																name={'type'}
																noStyle
															>
																<Select>
																	<Option value="input">单行文本</Option>
																	<Option value="textarea">多行文本</Option>
																</Select>
																{/* <Radio.Group>
																	<Radio value={'input'}>单行文本</Radio>
																	<Radio value={'textarea'}>多行文本</Radio>
																</Radio.Group> */}
															</Form.Item>
															<Form.Item
																name={'maxlength'}
																style={{ marginLeft: 10 }}
															>
																最大字数 <Input style={{ width: 100 }} />
															</Form.Item>
														</Input.Group>
													</Form.Item>
												)}
												<h3>逻辑设置</h3>
												<Tooltip placement="bottomLeft" title={'当前面题目选中某些选项时才出现此题'}>
													<Button type="link" onClick={() => { relateTo() }}>题目关联</Button>
												</Tooltip>
											</Form>
										)}
										{currentEditObj && (currentEditObj.type == 'cascader') && (
											<Form
												layout={'vertical'}
												form={rightForm}
												onValuesChange={(newEventName, allValues) => { onValuesChange(newEventName, allValues) }}
											>
												<Form.Item label="标题" name='name'>
													<Input placeholder='请输入' />
												</Form.Item>
												<Row>
													<Col span={4}>
														<Form.Item name="isRequired" valuePropName="checked">
															<Checkbox>必答</Checkbox>
														</Form.Item>
													</Col>
													<Col span={4}>
														<Form.Item name="isKey" valuePropName="checked">
															<Checkbox value={1}>指定省份</Checkbox>
														</Form.Item>
													</Col>
													{/* 省份数据单选 */}
													{/* <Col span={4}>
														<Form.Item name="isKey">
															<Select>
																<Option value={1}>安徽省</Option>
															</Select>
														</Form.Item>
													</Col> */}
												</Row>
												<Form.Item label="填写提示" name={'subTitle'}>
													<Input placeholder='输入填写提示可以作为题目副标题' />
												</Form.Item>
												<h3>逻辑设置</h3>
												<Tooltip placement="bottomLeft" title={'当前面题目选中某些选项时才出现此题'}>
													<Button type="link" onClick={() => { relateTo() }}>题目关联</Button>
												</Tooltip>
											</Form>
										)}
										<ModalForm visible={visible} onCancel={hideUserModal} />
									</Form.Provider>
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
							<Button
								type="primary"
								key="add"
								onClick={() => {
									setEditResultIndex(-1)
									setAddResultVisible(true)
								}}
							>
								<PlusOutlined />新建诊断结果
							</Button>
						</div>
						<div className='table-body'>
							<Table
								pagination={false}
								dataSource={dataSource} 
								columns={columns}
								bordered
							/>
						</div>
						<div className='bottom-buttons'>
							<Button
								type="primary"
								key="next"
								onClick={() => {toNext()}}
							>
								下一步
							</Button>
							<Button
								key="prev"
								onClick={() => {toPrev()}}
							>
								上一步
							</Button>
						</div>
					</div>
				)}
				{/* 第三步：诊断封面 */}
				{currentStep == 2 && (
					<div className='step-container-3'>
						<Form 
							form={coverForm}
							layout="vertical"
							onValuesChange={(newEventName, allValues) => { onValuesChange3(newEventName, allValues) }}
						>
							<Form.Item
								name="inIcon"
								label="诊断页面入口icon"
								rules={[
									{
										required: true,
										message: '必填',
									},
								]}
							>
								<UploadForm
									listType="picture-card"
									className="avatar-uploader"
									showUploadList={false}
									maxSize={5}
									accept=".png,.jpeg,.jpg"
									tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG,且不超过5M</span>}
								/>
							</Form.Item>
							<Form.Item label="是否允许放在平台首页" name={'showInHomePage'} valuePropName="checked">
								<Switch checkedChildren="是" unCheckedChildren="否" />
							</Form.Item>
							<Row>
								<Col span={6}>
									<Form.Item
										name="icon"
										label="首页默认小icon"
										rules={[
											{
												required: true,
												message: '必填',
											},
										]}
									>
										<UploadForm
											listType="picture-card"
											className="avatar-uploader"
											showUploadList={false}
											maxSize={5}
											accept=".png,.jpeg,.jpg"
											tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG,且不超过5M</span>}
										/>
									</Form.Item>
								</Col>
								<Col span={6}>
									<Form.Item
										name="coverUrl"
										label="首页3D图"
										rules={[
											{
												required: true,
												message: '必填',
											},
										]}
									>
										<UploadForm
											listType="picture-card"
											className="avatar-uploader"
											showUploadList={false}
											maxSize={5}
											accept=".png,.jpeg,.jpg"
											tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG,且不超过5M</span>}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Form.Item name={'diagnoseDescribe'} label="诊断描述" 
								rules={[
									{
										required: true,
										message: '必填',
									}
								]}
								style={{width: 600}}
							>
								<Input.TextArea
									autoSize={false}
									placeholder='请输入'
									maxLength={2000}
									showCount={false}
									rows={3}
								/>
							</Form.Item>
						</Form>
						<div className='bottom-buttons'>
							<Button
								type="primary"
								key="next"
								onClick={() => {toNext()}}
							>
								发布诊断 / 完成迭代
							</Button>
							<Button
								key="prev"
								onClick={() => {toPrev()}}
							>
								上一步
							</Button>
						</div>
					</div>
				)}
			</div>
			{useModal()}
			{useResultAddModal()}
			{previewResultModal()}
		</PageContainer>
	)
}