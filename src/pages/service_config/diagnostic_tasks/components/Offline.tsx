import { DeleteOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Form,
  Modal,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Space,
  Popconfirm,
} from 'antd';
import '../service-config-diagnostic-tasks.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import {
  getDiagnosticTasksPage,
  addDiagnosticTasks,
  searchOrgInfo,
  searchExpert,
  removeDiagnosisTasks,
  updateDiagnosticTasks,
  getDiagnosisInstitutions,
} from '@/services/diagnostic-tasks';
import moment from 'moment';
import DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import DebounceSelect from './DebounceSelect';
import { Link } from 'umi';
import { routeName } from '../../../../../config/routes';
import SelfTable from '@/components/self_table';
const sc = scopedClasses('service-config-diagnostic-tasks');
const stateObj = {
  1: '待诊断',
  2: '诊断中',
  3: '已完成',
  4: '已延期',
};
export default () => {
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DiagnosticTasks.Content[]>([]);
  const [editingItem, setEditingItem] = useState<DiagnosticTasks.Content>({});
  const [selectExperts, setSelectExperts] = useState<
    { label: string; value: string; expertPhone: string }[]
  >([]);
  const [defaultOrgs, setDefaultOrgs] = useState<{ label: string; value: string }[]>([]);
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 标题
    publishTime?: string; // 发布时间
    state?: number; // 状态：0发布中、1待发布、2已下架
  }>({});

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const [institutions, setInstitutions] = useState<
    {
      id: string;
      name: string;
      bag: string;
    }[]
  >([]);

  const [form] = Form.useForm();

  /**
   * 获取诊断任务
   * @param pageIndex
   * @param pageSize
   */
  const getDiagnosticTasks = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getDiagnosticTasksPage({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 副作用清除
   */
  const clearForm = () => {
    form.resetFields();
    setDefaultOrgs([]);
    setSelectExperts([]);
    setEditingItem({});
  };

  /**
   * 添加或者修改
   */
  const addOrUpdate = async () => {
    const tooltipMessage = editingItem.id ? '修改' : '添加';
    const hide = message.loading(`正在${tooltipMessage}`);
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        const params = {
          ...value,
          startDate: moment(value.time[0]).format('YYYY-MM-DD'),
          endDate: moment(value.time[1]).format('YYYY-MM-DD'),
          orgShowId: value.orgShowId.value,
          expertShowIds: value.expertShowIds.map((p: { value: string }) => p.value).join(','),
        };
        const addorUpdateRes = await (editingItem.id
          ? updateDiagnosticTasks({
              ...params,
              id: editingItem.id,
            })
          : addDiagnosticTasks({
              ...params,
            }));
        hide();
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          message.success(`${tooltipMessage}成功`);
          getDiagnosticTasks();
          clearForm();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch(() => {
        hide();
      });
  };

  /**
   * 删除
   * @param id
   */
  const remove = async (id: string) => {
    try {
      const removeRes = await removeDiagnosisTasks(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getDiagnosticTasks();
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 列表数据 转换表单数据
   * @param record
   */
  // const edit = (record: DiagnosticTasks.Content) => {
  //   const content = { ...record } as DiagnosticTasks.Content & {
  //     expertShowIds: { value: string }[];
  //     orgId: string;
  //     time: moment.Moment[];
  //     orgShowId: { value: string };
  //     institutionId?: string;
  //   };
  //   setEditingItem(record);
  //   setModalVisible(true);
  //   // 修改设置表单初始数据
  //   if (content.experts && content.experts.length > 0) {
  //     setSelectExperts(
  //       content.experts.map((p: { expertName: string; id: string; expertPhone: string }) => {
  //         return {
  //           label: p.expertName + `（${p.expertPhone ? p.expertPhone : '无联系方式'}）`,
  //           value: p.id,
  //           expertPhone: p.expertPhone,
  //         };
  //       }),
  //     );
  //     content.expertShowIds = content.experts.map((p: { id: string }) => {
  //       return { value: p.id };
  //     });
  //   }
  //   if (content.orgId) {
  //     setDefaultOrgs([
  //       {
  //         label: content.orgName as string,
  //         value: content.orgId,
  //       },
  //     ]);
  //   }
  //   if (content.startDate && record.endDate) {
  //     content.time = [moment(record.startDate), moment(record.endDate)];
  //   }
  //   content.institutionId = record?.diagnosisInstitution?.id;
  //   content.orgShowId = { value: content.orgId };
  //   form.setFieldsValue({ ...content });
  // };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      render: (_: any, _record: DiagnosticTasks.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '诊断名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '诊断企业',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '诊断专家',
      dataIndex: 'experts',
      isEllipsis: true,
      width: 300,
      render: (item: { expertName: string }[] = []) => {
        const name = item.map((p) => p.expertName).join('，');
        return name;
      },
    },
    {
      title: '所属机构',
      dataIndex: 'diagnosisInstitution',
      width: 200,
      isEllipsis: true,
      render: (item: any) => item.name || '--',
    },
    {
      title: '诊断时间',
      dataIndex: 'time',
      width: 200,
      render: (_: string, record: DiagnosticTasks.Content) => (
        <div style={{ display: 'grid' }}>
          <span>起：{record.startDate}</span>
          <span>止：{record.endDate}</span>
        </div>
      ),
    },
    {
      title: '诊断状态',
      dataIndex: 'state',
      width: 200,
      render: (_: number) => {
        return <div className={`state${_}`}>{stateObj[_] || '--'}</div>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      // width: 200,
      render: (_: any, record: DiagnosticTasks.Content) => {
        return (
          /**
           * 待诊断可编辑
           * 待诊断时延期 可编辑
           */
          <Space size="middle">
            {/* {(record.state === 1 || (record.originState === 1 && record.state === 4)) && (
              <a href="#" onClick={() => edit(record)}>
                编辑{' '}
              </a>
            )} */}
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(record.id as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>
            {/**
             * 待诊断无诊断记录
             * 待诊断时延期无诊断记录
             */}
            {!(record.state === 1 || (record.originState === 1 && record.state === 4)) && (
              <Link
                style={{ marginRight: 20 }}
                to={`${routeName.DIAGNOSTIC_TASKS_DETAIL}?detailId=${record.id}`}
              >
                诊断记录
              </Link>
            )}
          </Space>
        );
      },
    },
  ];

  const prepare = async () => {
    try {
      const { result, code } = await getDiagnosisInstitutions();
      if (code === 0) {
        setInstitutions(result);
      } else {
        throw new Error();
      }
    } catch (error) {
      message.error('获取初始数据失败');
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  useEffect(() => {
    getDiagnosticTasks();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={5}>
              <Form.Item name="name" label="诊断名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="orgName" label="诊断企业">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="expertName" label="诊断专家">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }} justify={'space-between'}>
            <Col span={15}>
              <Row>
                <Col span={8}>
                  <Form.Item name="institutionId" label="诊断机构">
                    <Select placeholder="请选择" allowClear>
                      {institutions.map((p) => (
                        <Select.Option key={p.id + p.name} value={p.id}>
                          {p.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="time" label="诊断时间">
                    <DatePicker.RangePicker allowClear />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="state" label="诊断状态">
                    <Select placeholder="请选择" allowClear>
                      {Object.entries(stateObj).map((p) => (
                        <Select.Option key={p[0] + p[1]} value={p[0]}>
                          {p[1]}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={3}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.startDate = moment(search.time[0]).format('YYYY-MM-DD');
                    search.endDate = moment(search.time[1]).format('YYYY-MM-DD');
                  }
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  setSearChContent({});
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  /**
   * 搜索企业
   * @param name
   * @returns
   */
  const onSearchOrg = async (name: string) => {
    return searchOrgInfo(name).then((body) =>
      body.result.map((p) => ({
        label: p.orgName,
        value: p.id,
      })),
    );
  };

  /**
   * 搜索专家
   * @param name
   * @returns
   */
  const onSearchExpert = async (name: string) => {
    return searchExpert(name).then((body) => {
      return body.result.map((p) => ({
        label: p.expertName + `（${p.expertPhone ? p.expertPhone : '无联系方式'}）`,
        value: p.id,
        expertPhone: p.expertPhone,
      }));
    });
  };

  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={editingItem.id ? '编辑任务' : '新增任务'}
        width="600px"
        visible={createModalVisible}
        maskClosable={false}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        destroyOnClose
        okButtonProps={{ loading: addOrUpdateLoading }}
        onOk={async () => {
          addOrUpdate();
        }}
      >
        <Form {...formLayout} form={form} layout="horizontal">
          <Form.Item
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            name="name"
            label="诊断名称"
          >
            <Input placeholder="请输入" maxLength={35} />
          </Form.Item>
          <Form.Item
            name="orgShowId"
            label="选择诊断企业"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <DebounceSelect
              showSearch
              placeholder={'请输入搜索内容'}
              fetchOptions={onSearchOrg}
              style={{ width: '100%' }}
              defaultOptions={defaultOrgs}
            />
          </Form.Item>
          <Form.Item
            name="expertShowIds"
            label="选择诊断专家"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <DebounceSelect
              mode="multiple"
              placeholder={'请输入搜索内容'}
              fetchOptions={onSearchExpert}
              maxTagCount={1}
              onSelect={(option: any) => {
                setSelectExperts((preState) => {
                  return [...preState, option];
                });
              }}
              onDeselect={(option: any) => {
                setSelectExperts((preState) => {
                  return preState.filter((p) => p.value !== option.value);
                });
                console.log('options', option);
              }}
              defaultOptions={selectExperts}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label=" "
            colon={false}
            style={{ padding: 5, maxHeight: 260, overflowX: 'auto' }}
          >
            <div style={{ backgroundColor: 'rgb(245,245,245)', padding: 5, borderRadius: 5 }}>
              已选诊断专家：{selectExperts.length}人
            </div>
            {selectExperts.map((p) => (
              <div
                key={p.value + p.label}
                style={{ display: 'flex', justifyContent: 'space-between', padding: 5 }}
              >
                <span>{p.label}</span>
                <DeleteOutlined
                  onClick={() => {
                    const selectExperts_copy = [...selectExperts];
                    const deleteIndex = selectExperts_copy.findIndex((s) => p.value === s.value);
                    if (deleteIndex > -1) {
                      selectExperts_copy.splice(deleteIndex, 1);
                      setSelectExperts(selectExperts_copy);
                      form.setFieldsValue({ expertShowIds: [...selectExperts_copy] });
                    }
                  }}
                />
              </div>
            ))}
          </Form.Item>
          <Form.Item
            name="institutionId"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            label="所属机构"
          >
            <Select placeholder="请选择" allowClear>
              {institutions.map((p) => (
                <Select.Option key={p.id + p.name} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="time"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            label="诊断时间"
          >
            <DatePicker.RangePicker
              disabledDate={(current) => current && current < moment().endOf('day').add(-1, 'days')}
            />
          </Form.Item>
          <Form.Item
            name="remark" // state 	状态0发布中1待发布2已下架
            label="诊断说明"
          >
            <Input.TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>诊断任务列表(共{pageInfo.totalCount || 0}个)</span>
          {/* <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建任务
          </Button> */}
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1600 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getDiagnosticTasks,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
      {useModal()}
    </>
  );
};
