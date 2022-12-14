import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message,
  Space,
  Modal,
  DatePicker,
  Checkbox,
  TreeSelect,
  List,
  Image,
} from 'antd';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import './index.less';
import React, { useEffect, useState } from 'react';
import VirtualList from 'rc-virtual-list';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { Access, useAccess } from 'umi';
import { queryOrgList } from '@/services/digital-application';
import { listAllAreaCode } from '@/services/common';
import {
  getServiceQueryPage, //服务包list
} from '@/services/diagnose-service';
import type Common from '@/types/common';
import type NeedVerify from '@/types/user-config-need-verify';
import icon1 from '@/assets/system/empty.png';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

const ContainerHeight = 240;
const ContainerHeight2 = 190;
const stateObj = {
  1: '待诊断',
  2: '诊断中',
  3: '已完成',
  4: '已延期',
};
export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<NeedVerify.Content[]>([]);
  // 拿到当前角色的access权限兑现
  const access = useAccess();

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await getServiceQueryPage({
        pageIndex,
        pageSize,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
        setLoading(false);
      } else {
        message.error(`请求分页数据失败`);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const prepare = async () => {
    getPage();
  };
  useEffect(() => {
    prepare();
  }, []);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<any>({});
  const [editForm] = Form.useForm();
  /*
   * 选择服务商
   */
  const closeSelectServers = () => {
    setModalVisible(false);
    servicersForm.resetFields();
    setOrgList([]);
    setCurrentPage(0);
    setServerCheckboxValue([]);
  };
  const handleOk = async () => {
    const showSelectedOrg: string[] = [];
    if (selectedOrgList && selectedOrgList.length > 0) {
      selectedOrgList.map((item: any) => {
        showSelectedOrg.push(item.serviceProviderName);
      });
    }
    closeSelectServers();
    editForm.setFieldsValue({
      ...editItem,
      diagnoseServicers: showSelectedOrg,
    });
  };
  const [orgList, setOrgList] = useState<any>([]);
  const [serverCheckboxValue, setServerCheckboxValue] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<any>(0);
  const [selectedOrgList, setSelectedOrgList] = useState<any>([]); //选中的服务商
  const [servicersForm] = Form.useForm();
  const appendData = async () => {
    const orgName = enterpriseModal
      ? enterpriseForm.getFieldValue('keyword')
      : servicersForm.getFieldValue('keyword');
    const res = await queryOrgList({
      pageIndex: currentPage,
      pageSize: 20,
      orgName,
    });
    setCurrentPage(currentPage + 1);
    setOrgList(orgList.concat(res.result));
  };
  useEffect(() => {
    if (currentPage == 1) {
      appendData();
    }
  }, [currentPage]);
  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
      appendData();
    }
  };
  const onChangeCheckbox = (e: CheckboxChangeEvent) => {
    // 改变左侧checkbox选中状态
    // debugger
    const arr1 = [...serverCheckboxValue];
    const inIndex1 = arr1.indexOf(e.target.value);
    if (inIndex1 > -1) {
      arr1.splice(inIndex1, 1);
    } else {
      arr1.push(e.target.value);
    }
    setServerCheckboxValue(arr1);

    const arr2 = [...selectedOrgList];
    const arr3:any = []
    arr2.map((item) => {
      arr3.push({
        serviceProviderName: item.serviceProviderName,
        serviceProviderId: item.serviceProviderId,
      })
    })
    const inIndex2 = JSON.stringify(arr3).indexOf(e.target.value.split('-')[1]);
    if (inIndex2 > -1) {
      arr2.splice(inIndex1, 1);
    } else {
      arr2.push({
        serviceProviderName: e.target.value.split('-')[1],
        serviceProviderId: e.target.value.split('-')[0],
      });
    }
    setSelectedOrgList(arr2);
  };
  const changeServicersForm = (changedValues: any, allValues: any) => {
    if (
      (changedValues.keyword && changedValues.keyword.length >= 2) ||
      changedValues.keyword == ''
    ) {
      setCurrentPage(1);
      setOrgList([]);
    }
  };
  // 表单中删除已选择服务商
  const handleServersChange = (value: string[]) => {
    console.log(`selected ${value}`, selectedOrgList);
    let arr = [];
    arr = selectedOrgList.filter(
      (item: { serviceProviderName: string }) => value.indexOf(item.serviceProviderName) > -1,
    );
    setSelectedOrgList(arr);
    const arr2: string[] = [];
    arr.map((item: any) => {
      arr2.push(item.serviceProviderId + '-' + item.serviceProviderName);
    });
    setServerCheckboxValue(arr2);
  };
  const cancelSelect = (idLabel: string) => {
    console.log(idLabel);
    // 右侧已选择服务商删除
    const id = idLabel.split('-')[0];
    const arr = [...selectedOrgList];
    const arr2 = arr.filter((item) => item.serviceProviderId != id);
    setSelectedOrgList(arr2);
    // 左侧checkbox删除已选中选项
    const arr3: string[] = [];
    arr2.map((item) => {
      arr3.push(item.serviceProviderId + '-' + item.serviceProviderName);
    });
    setServerCheckboxValue(arr3);
  };
  const emptySelectedServers = () => {
    setServerCheckboxValue([]);
    setSelectedOrgList([]);
  };
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={'诊断服务商'}
        width="640px"
        visible={modalVisible}
        maskClosable={false}
        onOk={handleOk}
        className="servicers-modal"
        onCancel={closeSelectServers}
        footer={[
          <Button key="back" onClick={closeSelectServers}>
            取消
          </Button>,
          <Button key="link" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <Row>
          <Col span={12}>
            <div className="left-content-wrapper">
              <div className="checkbox-wrapper">
                <Form
                  form={servicersForm}
                  onValuesChange={(newEventName, allValues) => {
                    changeServicersForm(newEventName, allValues);
                  }}
                >
                  <Form.Item name="keyword" label="">
                    <Input placeholder='请输入搜索内容' suffix={<SearchOutlined />} />
                  </Form.Item>
                </Form>
                <List>
                  <VirtualList
                    data={orgList}
                    height={ContainerHeight}
                    itemHeight={40}
                    itemKey="id"
                    onScroll={onScroll}
                  >
                    {(item: any) => (
                      <List.Item key={item.id}>
                        <Checkbox
                          checked={serverCheckboxValue.indexOf(item.id + '-' + item.orgName) > -1}
                          value={item.id + '-' + item.orgName}
                          key={item.id}
                          onChange={onChangeCheckbox}
                        >
                          {item.orgName}
                        </Checkbox>
                      </List.Item>
                    )}
                  </VirtualList>
                </List>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="right-content-wrapper">
              <div className="selected-servers-length">
                已选择诊断服务商（{selectedOrgList.length}）
                <Button
                  type="text"
                  disabled={selectedOrgList.length == 0}
                  onClick={emptySelectedServers}
                >
                  清空
                </Button>
              </div>
              <div className="selected-servers-wrap">
                {selectedOrgList &&
                  selectedOrgList.map(
                    (item: {
                      serviceProviderId: React.Key | null | undefined;
                      serviceProviderName: {} | null | undefined;
                    }) => {
                      return (
                        <p key={item.serviceProviderId}>
                          <span>{item.serviceProviderName}</span>
                          <CloseCircleOutlined
                            onClick={() => {
                              cancelSelect(item.serviceProviderId + '-' + item.serviceProviderName);
                            }}
                          />
                        </p>
                      );
                    },
                  )}
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    );
  };

  /*
   * 选择服务企业
   */
  const [editServiceEnterprise, setEditServiceEnterprise] = useState<any>({});
  const [area, setArea] = useState<any[]>([]);
  const [arealevelList, setArealevelList] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<any[]>([]);
  const [enterpriseModal, setEnterpriseModal] = useState<boolean>(false);
  const [inputEnterpriseForm] = Form.useForm(); //手动输入服务企业信息
  const [enterpriseCheckboxValue, setEnterpriseCheckboxValue] = useState<any>([]);
  const [selectedEnterprise, setSelectedEnterprise] = useState<any>([]); //选中的服务企业
  const [enterpriseForm] = Form.useForm();
  const [inputAble, setInputAble] = useState(true);
  // 关闭选择服务企业弹框的数据处理
  const closeSelectEnterprise = () => {
    setEnterpriseModal(false);
    setOrgList([]);
    setEditServiceEnterprise({})
    enterpriseForm.resetFields()
    inputEnterpriseForm.resetFields()
    setCurrentPage(0);
    setSelectedEnterprise([])
    setEnterpriseCheckboxValue([]);
  };
  // 手动输入监听
  const onValuesChange = (changedValues: any, allValues: any) => {
    if (allValues.enterpriseName && allValues.areaCode) {
      setInputAble(false);
    } else {
      setInputAble(true);
    }
  };
  const changeEnterpriseForm = (changedValues: any, allValues: any) => {
    if (
      (changedValues.keyword && changedValues.keyword.length >= 2) ||
      changedValues.keyword == ''
    ) {
      setCurrentPage(1);
      setOrgList([]);
    }
  };
  const onScroll2 = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight2) {
      appendData();
    }
  };
  const onChangeEnterprise = (e: CheckboxChangeEvent) => {
    // 改变左侧checkbox选中状态
    const arr1 = [...enterpriseCheckboxValue];
    const inIndex1 = arr1.indexOf(e.target.value);
    if (inIndex1 > -1) {
      arr1.splice(inIndex1, 1);
    } else {
      arr1.push(e.target.value);
    }
    setEnterpriseCheckboxValue(arr1);

    const arr2 = [...selectedEnterprise];
    const inIndex2 = JSON.stringify(arr2).indexOf(JSON.parse(e.target.value).id);
    if (inIndex2 > -1) {
      arr2.splice(inIndex1, 1);
    } else {
      arr2.push({
        ...JSON.parse(e.target.value),
        enterpriseName: JSON.parse(e.target.value).orgName,
        enterpriseId: JSON.parse(e.target.value).id,
      });
    }
    setSelectedEnterprise(arr2);
  };
  const cancelSelectEnterprise = (idLabel: string) => {
    console.log(idLabel);
    // 右侧已选择服务商删除
    const id = JSON.parse(idLabel).enterpriseId;
    const arr = [...selectedEnterprise];
    const arr2 = arr.filter((item) => item.enterpriseId != id);
    console.log(arr2);
    setSelectedEnterprise(arr2);
    // 左侧checkbox删除已选中选项
    const arr3: string[] = [];
    arr2.map((item) => {
      arr3.push(JSON.stringify(item));
    });
    setEnterpriseCheckboxValue(arr3);
  };
  const emptySelectedEnterprise = () => {
    setEnterpriseCheckboxValue([]);
    setSelectedEnterprise([]);
  };
  const showSelectEnterprise = (item: any) => {
    console.log(item, 'showSelectEnterprise');
    setEnterpriseModal(true);
    setEditServiceEnterprise(item);
    getAreaData();
    setCurrentPage(1);
    // 需要对已选择的服务企业做回显操作。。。
    if (item.listEnter && item.listEnter.length > 0) {
      const arr: any = [...item.listEnter];
      const arr2: any = [];
      setSelectedEnterprise(arr);
      arr.map((item: { [x: string]: any; enterpriseName: any; enterpriseId: any }) => {
        arr2.push(JSON.stringify(item));
      });
      console.log(arr2, 'arr2')
      setEnterpriseCheckboxValue(arr2);
    }
  };
  const getAreaTreeDate = (list: any[], arealevelLists: any[] | undefined) => {
    return list?.map((item: { nodes: string | any[] }) => {
      const o = { ...item };
      delete o.nodes;
      let code = o.code;
      const num = arealevelLists?.filter((it) => it.pcode === o.code);
      if (num?.length > 0) {
        code = code + '-' + num?.length;
        console.log('code', code, o.code);
      }
      arealevelLists?.push({ ...o, code, pcode: o.code });
      return {
        ...item,
        code,
        selectable: !item.nodes?.length,
        nodes: getAreaTreeDate(item.nodes, arealevelLists),
      };
    });
  };
  const getAreaData = async () => {
    try {
      const areaRes = await listAllAreaCode();
      const arealevelLists:any = [];
      setArea(getAreaTreeDate(areaRes && areaRes.result, arealevelLists) || []);
      setArealevelList(arealevelLists);
    } catch (error) {
      console.log(error);
      message.error('获取省市区数据出错');
    }
  };


  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 标题
    publishTime?: string; // 发布时间
    state?: number; // 状态：0发布中、1待发布、2已下架
  }>({});
  const [institutions, setinstitutions] = useState([])
  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="name" label="所属企业">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="orgName" label="企业所属区域">
                <Select placeholder="请选择" allowClear>
                  {institutions.map((p:any) => (
                    <Select.Option key={p.id + p.name} value={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="expertName" label="问卷名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }} justify={'space-between'}>
            <Col span={18}>
              <Row>
                <Col span={8}>
                  <Form.Item name="time" label="诊断时间">
                    <DatePicker.RangePicker allowClear />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="state" label="诊断端">
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
            <Col span={4}>
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

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '用户姓名',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '所属企业',
      dataIndex: 'projectName',
      width: 200,
      render: (_: any, _record: any) => (_record.projectName ? _record.projectName : '--'),
    },
    {
      title: '企业所属区域',
      dataIndex: 'projectName',
      width: 200,
      render: (_: any, _record: any) => (_record.projectName ? _record.projectName : '--'),
    },
    {
      title: '问卷名称',
      dataIndex: 'projectName',
      width: 200,
      render: (_: any, _record: any) => (_record.projectName ? _record.projectName : '--'),
    },
    {
      title: '诊断时间',
      dataIndex: 'updateTime',
      width: 240,
      render: (_: string, _record: any) =>
        moment(_record?.startTime).format('YYYY-MM-DD') +
        '~' +
        moment(_record?.endTime).format('YYYY-MM-DD'),
    },
    {
      title: '诊断提交时间',
      dataIndex: 'updateTime',
      width: 240,
      render: (_: string, _record: any) =>
        moment(_record?.startTime).format('YYYY-MM-DD') +
        '~' +
        moment(_record?.endTime).format('YYYY-MM-DD'),
    },
    {
      title: '是否发起对接',
      dataIndex: 'serviceProviderNum',
      width: 160,
    },
    {
      title: '是否发布需求',
      dataIndex: 'enterpriseNum',
      isEllipsis: true,
      width: 160,
    },
    {
      title: '诊断端',
      dataIndex: 'enterpriseNum',
      isEllipsis: true,
      width: 160,
    },
    access.P_SM_XQGL && {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          // <Access accessible={accessible}>
          <Space wrap>
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => {
              }}
            >
              详情
            </Button>
          </Space>
          // </Access>
        );
      },
    },
  ].filter((p) => p);

  return (
    <div className="diagnose-service-package">
      <h3 className="title">诊断记录报表</h3>
      {useSearchNode()}
      <div className="content-wrapper">
        <div className="container-table-header">
          <h3>诊断记录列表（共X条）</h3>
        </div>
        {dataSource && dataSource.length > 0 && (
          <div className="container-table-body">
            <SelfTable
              loading={loading}
              bordered
              scroll={{ x: 1400 }}
              columns={columns}
              dataSource={dataSource}
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
        )}
        {dataSource && dataSource.length == 0 && (
          <div className="empty-status">
            <Image src={icon1} width={160} />
          </div>
        )}
      </div>
    </div>
  );
};
