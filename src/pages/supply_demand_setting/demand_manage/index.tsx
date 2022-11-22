import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  Checkbox,
  Modal,
  message,
  Space,
  Popconfirm,
  InputNumber,
  TreeSelect,
} from 'antd';
import { CaretDownOutlined, CaretUpOutlined, InfoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import { getDictionayTree, getEnumByName } from '@/services/common';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { UploadOutlined } from '@ant-design/icons';
import { demandExport } from '@/services/export';
import { Access, useAccess } from 'umi';
import {
  getRequirementManagementList,
  demandEditType,
  demandIndestrialEditType,
  demandEditSort, //权重编辑
  demandUpper, //上架
  demandDown, //下架
  getManageTypeList,
} from '@/services/office-requirement-verify';
import TwoLevelSelect from '../docking_manage/components/two-level-select';
import { getClaimUsers } from '@/services/creative-demand';
import { getAreaTree } from '@/services/area';
const sc = scopedClasses('setting-demand-manage');
const stateObj = {
  //需求状态
  ON_SHELF: '上架',
  // FINISHED: '已结束',
  OFF_SHELF: '下架',
};
const stateObj3 = {
  //
  NEW_DEMAND: '新发布',
  CLAIMED: '已认领',
  DISTRIBUTE: '已分发',
  CONNECTING: '对接中',
  FEEDBACK: '已反馈',
  EVALUATED: '已评价',
  FINISHED: '已结束',
};
enum Edge {
  HOME = 0, // 新闻咨询首页
}

export default () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<{
    name?: string; // 标题
    publishStartTime?: string; // 发布开始时间
    operationState?: string; // 需求状态
    publisherName?: string; // 用户名
    publishEndTime?: string; // 发布结束时间
    type?: number; // 需求类型
    claimId?: number; // 需求认领人
    claimState?: string; // 需求状态
    areaCode?: number; // 需求地区
  }>({});
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_SD_XQ', // 需求管理-页面查询
  }

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  useEffect(() => {
    for (const key in permissions) {
      const permission = permissions[key]
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        setEdge(key as any)
        break
      }
    }
  },[])

  /**
   * 新建窗口的弹窗
   *  */
  const dialogFormLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<any>({});
  const clearForm = () => {
    form.resetFields();
    if (editingItem.photoId || editingItem.id) setEditingItem({});
  };

  const [demandTypes, setDemandTypes] = useState<any[]>([]);
  const [isMore, setIsMore] = useState<boolean>(false);

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  // 下架/上架状态更新
  const updateOnlineStatus = async (id: string, status: boolean) => {
    const params = { demandId: id };
    let addorUpdateRes = {};
    if (status) {
      //上架
      addorUpdateRes = await demandUpper(params);
    } else {
      addorUpdateRes = await demandDown(params);
    }
    if (addorUpdateRes.code === 0) {
      setModalVisible(false);
      if (!editingItem.id) {
        message.success(`${status ? '上架' : '下架'}成功！`);
      }
      getPage();
      clearForm();
    } else {
      message.error(`${status ? '上架' : '下架'}失败，原因:{${addorUpdateRes.message}}`);
    }
  };

  // 编辑权重
  const editSort = async (id: string, value: number) => {
    console.log(id, value);
    const editRes = await demandEditSort({
      id: id,
      sort: value,
    });
    if (editRes.code === 0) {
      message.success(`编辑权重成功！`);
      getPage();
      clearForm();
    } else {
      message.error(`编辑权重失败，原因:{${editRes.message}}`);
    }
  };

  // 需求类型
  const [form] = Form.useForm();

  const [industryTypes, setIndustryTypes] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [area, setArea] = useState<any>([]);
  const prepare = async () => {
    try {
      const data = await Promise.all([
        getEnumByName('ORG_INDUSTRY'),
        getClaimUsers(),
        getAreaTree({}),
        getDictionayTree('DEMAND_TYPE'),
      ]);
      setIndustryTypes(data?.[0]?.result || []);
      setUsers(data?.[1]?.result || []);
      setArea(data?.[2]?.children || []);
      setDemandTypes(data?.[3]?.result || []);
    } catch (error) {
      message.error('数据初始化错误');
    }
  };

  const newKeywords = Form.useWatch('industry', form);

  useEffect(() => {
    prepare();
  }, []);

  /**
   * @zh-CN 需求类型编辑
   */
  const addOrUpdata = () => {
    form
      .validateFields()
      .then(async (value) => {
        try {
          const addorUpdateRes = await demandEditType({ ...value, id: editingItem.id });
          if (addorUpdateRes.code === 0) {
            setModalVisible(false);
            message.success(`需求类型调整成功`);
            getPage();
            clearForm();
          } else {
            message.error(`需求类型调整失败，原因:{${addorUpdateRes.message}}`);
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => {
        message.error('服务器错误');
        console.log(err);
      });
  };
  const getModal = () => {
    return (
      <Modal
        title="需求类型编辑"
        width="720px"
        maskClosable={false}
        visible={createModalVisible}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        onOk={async () => {
          await addOrUpdata();
        }}
      >
        <Form {...dialogFormLayout} form={form} layout="horizontal">
          <Form.Item name="dealName" label="原类型">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="type"
            label="新类型"
            required
            rules={[
              {
                validator(rule, value) {
                  if (value.length > 5) {
                    return Promise.reject('最多选5个');
                  }
                  if (!value || value.length === 0) {
                    return Promise.reject('必填');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <TwoLevelSelect
              dictionary={demandTypes}
              fieldNames={{ label: 'name', value: 'id', children: 'nodes' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const [industrialModal, setIndustrialModal] = useState<boolean>(false);
  const [industrialItem, setIndustrialItem] = useState<any>({});
  const clearIndustrialForm = () => {
    // 未处理
    form.resetFields();
    if (industrialItem.id) setIndustrialItem({});
  };

  // 所属产业变价
  const addIndustrialUpdata = () => {
    form.validateFields().then(async (value) => {
      try {
        const res = await demandIndestrialEditType({
          id: industrialItem.id,
          ...value,
        });
        if (res?.code === 0) {
          message.success(`所属产业编辑成功！`);
          setIndustrialModal(false);
          getPage();
          clearIndustrialForm();
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const getIndustrialModal = () => {
    return (
      <Modal
        title={'所属行业编辑'}
        width="780px"
        visible={industrialModal}
        maskClosable={false}
        onOk={async () => {
          await addIndustrialUpdata();
        }}
        onCancel={() => {
          clearIndustrialForm();
          setIndustrialModal(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              clearIndustrialForm();
              setIndustrialModal(false);
            }}
          >
            取消
          </Button>,
          <Button
            key="link"
            type="primary"
            onClick={async () => {
              await addIndustrialUpdata();
            }}
          >
            确定
          </Button>,
        ]}
      >
        <Form labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} form={form}>
          <Form.Item
            name="industry"
            label="所属行业"
            rules={[{ required: true }]}
            extra="多选（最多三个）"
          >
            <Checkbox.Group>
              <Row>
                {industryTypes?.map((i: any) => {
                  return (
                    <React.Fragment key={i.name}>
                      <Col span={6}>
                        <Checkbox
                          value={i.enumName}
                          style={{ lineHeight: '32px' }}
                          disabled={
                            newKeywords &&
                            newKeywords.length == 3 &&
                            !newKeywords.includes(i.enumName)
                          }
                        >
                          {i.name}
                        </Checkbox>
                        {i.enumName == 'OTHER' && newKeywords && newKeywords.indexOf('OTHER') > -1 && (
                          <Form.Item name="industryOther" label="">
                            <Input placeholder="请输入" maxLength={10} />
                          </Form.Item>
                        )}
                      </Col>
                    </React.Fragment>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const getPage = async (pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getRequirementManagementList({
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
  const [weightForm] = Form.useForm();
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            window.open(`${routeName.DEMAND_MANAGEMENT_DETAIL}?id=${_record.id}&type=1`);
          }}
        >
          {_}
        </a>
      ),
      width: 300,
    },
    {
      title: '需求类型',
      dataIndex: 'typeNames',
      isEllipsis: true,
      render: (text: any, record: any) => record?.typeNames?.join('、'),
      width: 300,
    },
    {
      title: '所属产业',
      dataIndex: 'industryNames',
      isEllipsis: true,
      render: (text: any, record: any) => record.industryNames.join('、'),
      width: 300,
    },
    {
      title: '需求地区',
      dataIndex: 'areaNames',
      isEllipsis: true,
      render: (text: any, record: any) => record.areaNames.join('、'),
      width: 300,
    },

    {
      title: '需求时间范围',
      dataIndex: 'startDate',
      isEllipsis: true,
      render: (_: string, _record: any) =>
        _record.startDate ? _record.startDate + '至' + _record.endDate : '--',
      width: 300,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '是否隐藏',
      dataIndex: 'hide',
      isEllipsis: true,
      render: (_: string, _record: any) => (_record.hide ? '是' : '否'),
      width: 100,
    },
    {
      title: '权重',
      dataIndex: 'sort',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '用户需求',
      dataIndex: 'hide',
      isEllipsis: true,
      render: (_: string, _record: any) => (_record.hide ? '是' : '否'),
      width: 100,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      width: 200,
      render: (_: string) => _ || '--',
    },

    {
      title: '上架状态',
      dataIndex: 'operationState',
      width: 200,
      render: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '需求状态',
      dataIndex: 'claimState',
      width: 200,
      render: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateObj3, _) ? stateObj3[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '需求认领人',
      dataIndex: 'claimName',
      isEllipsis: true,
      render: (_: string) => _ || '--',
      width: 150,
    },
    {
      title: '需求跟进次数',
      dataIndex: 'demandConnectNum',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '操作',
      width: 300,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return (
          <Access accessible={accessible}>
            <Space>
              {record.claimState == 'FINISHED' ? (
                <Button type="link" disabled>
                  /
                </Button>
              ) : (
                <>
                  {record.operationState == 'ON_SHELF' && (
                    <>
                      {' '}
                      <Popconfirm
                        title="确定下架么？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => updateOnlineStatus(record.id as string, false)}
                      >
                        <a href="#">下架</a>
                      </Popconfirm>
                      {/* <Button
                        key="1"
                        size="small"
                        type="link"
                        onClick={() => {
                          window.open(
                            `${routeName.DEMAND_MANAGEMENT_DETAIL}?id=${record.id}&isEdit=1`,
                          );
                        }}
                      >
                        节点维护
                      </Button> */}
                      <Popconfirm
                        title={
                          <>
                            <Form form={weightForm}>
                              <Form.Item name={'weight'} label="权重设置">
                                <InputNumber min={1} max={100} />
                              </Form.Item>
                            </Form>
                          </>
                        }
                        icon={<InfoOutlined style={{ display: 'none' }} />}
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                          editSort(record.id, weightForm.getFieldValue('weight'));
                        }}
                      >
                        <Button
                          key="1"
                          size="small"
                          type="link"
                          onClick={() => {
                            weightForm.setFieldsValue({ weight: record.sort });
                          }}
                        >
                          权重
                        </Button>
                      </Popconfirm>
                    </>
                  )}
                  {record.operationState == 'OFF_SHELF' && (
                    <Popconfirm
                      title="确定上架么？"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={() => updateOnlineStatus(record.id as string, true)}
                    >
                      <a href="#">上架</a>
                    </Popconfirm>
                  )}
                  {record.operationState == 'FINISHED' ? (
                    '/'
                  ) : (
                    <Button
                      key="1"
                      size="small"
                      type="link"
                      onClick={() => {
                        setEditingItem(record);
                        setModalVisible(true);
                        form.setFieldsValue({
                          ...record,
                          dealName: record.typeNames?.map((e) => e).join('、') || '',
                        });
                      }}
                    >
                      需求类型编辑
                    </Button>
                  )}
                </>
              )}
            </Space>
          </Access>
        );
      },
    },
  ];

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="name" label="需求名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="areaCode" label="需求地区">
                <Select placeholder="请选择" allowClear>
                  {area?.map((item: any) => (
                    <Select.Option key={item?.code} value={Number(item?.code)}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="claimState" label="需求状态">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(stateObj3).map((p) => {
                    return (
                      <Select.Option key={p[0]} value={p[0]}>
                        {p[1]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

            {isMore && (
              <>
                <Col span={6}>
                  <Form.Item name="publisherName" label="发布人">
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="type" label="需求类型">
                    {/* <Select placeholder="请选择" allowClear>
                    {typeOptions?.map((p) => (
                      <Select.Option key={p.id} value={p.id}>
                        {p.name}
                      </Select.Option>
                    ))}
                  </Select> */}
                    <TreeSelect
                      treeNodeFilterProp={'name'}
                      showSearch
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择"
                      allowClear
                      treeDefaultExpandAll
                      treeData={demandTypes}
                      fieldNames={{ children: 'nodes', value: 'id', label: 'name' }}
                    />
                  </Form.Item>
                </Col>
                {/* <Col span={6}>
                <Form.Item name="userDemand" label="用户需求">
                  <Select placeholder="请选择" allowClear>
                    <Select.Option value={true}>
                      是
                    </Select.Option>
                    <Select.Option value={false}>
                      否
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col> */}
                <Col span={6}>
                  <Form.Item name="time" label="发布时间">
                    <DatePicker.RangePicker allowClear showTime />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="operationState" label="上架状态">
                    <Select placeholder="请选择" allowClear>
                      {Object.entries(stateObj).map((p) => {
                        return (
                          <Select.Option key={p[0]} value={p[0]}>
                            {p[1]}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="claimId" label="需求认领人">
                    <Select placeholder="请选择" allowClear>
                      {users?.map((p) => (
                        <Select.Option key={p.claimUserId} value={p.claimUserId}>
                          {p.claimName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </>
            )}

            <Col offset={isMore ? 19 : 1} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  setPageInfo({
                    pageIndex: 1,
                    pageSize: 20,
                    totalCount: 0,
                    pageTotal: 0,
                  });
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.publishStartTime = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.publishEndTime = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
                  }
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                style={{ marginRight: 10 }}
                type="primary"
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  setSearChContent({});
                }}
              >
                重置
              </Button>

              <Button
                style={{ marginRight: 10 }}
                type="link"
                onClick={() => {
                  setIsMore(!isMore);
                }}
              >
                {isMore ? '收起' : '高级'}
                {isMore ? <CaretUpOutlined /> : <CaretDownOutlined />}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  const exportList = async () => {
    const {
      name,
      type,
      publisherName,
      publishStartTime,
      publishEndTime,
      operationState,
      claimId,
      claimState,
      areaCode,
    } = searchContent;
    try {
      const res = await demandExport({
        name,
        type,
        publisherName,
        publishStartTime,
        publishEndTime,
        operationState,
        claimId,
        claimState,
        areaCode,
      });
      const content = res?.data;
      const blob = new Blob([content], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });
      const fileName = '企业需求.xlsx';
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>需求列表(共{pageInfo.totalCount || 0}个)</span>
          <Access accessible={access['PX_SD_XQ']}>
            <Button
              icon={<UploadOutlined />}
              onClick={exportList}
            >
              导出
            </Button>
          </Access>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 2830 }}
          columns={columns}
          dataSource={dataSource}
          rowKey={'id'}
          expandable={{
            expandedRowRender: (record: any) => <p style={{ margin: 0 }}>{record.content}</p>,
            // rowExpandable: () => true,
            expandIcon: () => <></>,
            defaultExpandAllRows: true,
            expandedRowKeys: dataSource.map((p) => p.id),
          }}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getPage,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
      {getModal()}
      {getIndustrialModal()}
    </PageContainer>
  );
};
