import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message,
  Space,
  Drawer,
  Modal,
  DatePicker,
  Checkbox,
  TreeSelect,
  List,
  Image,
  Table,
} from 'antd';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
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
  getServiceDetail, //服务包详情
  saveServicePackage, // 新增、编辑诊断包
} from '@/services/diagnose-service';
import type Common from '@/types/common';
import type NeedVerify from '@/types/user-config-need-verify';
import icon1 from '@/assets/system/empty.png';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

const ContainerHeight = 240;
const ContainerHeight2 = 190;
export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<NeedVerify.Content[]>([]);
  // 拿到当前角色的access权限兑现
  const access = useAccess();

  // 新建/编辑诊断服务包
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setEditItem({});
    editForm.resetFields();
    setSelectedOrgList([]);
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  // 诊断服务包详情
  const [openDetail, setOpenDetail] = useState(false);
  const showDetailDrawer = () => {
    setOpenDetail(true);
  };
  const onCloseDetail = () => {
    setOpenDetail(false);
  };

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
    const arr1 = [...serverCheckboxValue];
    const inIndex1 = arr1.indexOf(e.target.value);
    if (inIndex1 > -1) {
      arr1.splice(inIndex1, 1);
    } else {
      arr1.push(e.target.value);
    }
    setServerCheckboxValue(arr1);

    const arr2 = [...selectedOrgList];
    const inIndex2 = JSON.stringify(arr2).indexOf(e.target.value.split('-')[1]);
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
                    <Input suffix={<SearchOutlined />} />
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
    setCurrentPage(0);
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
    // 右侧已选择服务商删除
    // const id = JSON.parse(idLabel).id
    // let arr = [...selectedEnterprise]
    // let arr2 = arr.filter(item => item.id != id)
    // setSelectedEnterprise(arr2)
    // // 左侧checkbox删除已选中选项
    // let formArr = enterpriseForm.getFieldsValue().servicers
    // let arr3 = formArr.filter(item => item.indexOf(JSON.parse(idLabel).id) < 0)
    // enterpriseForm.setFieldsValue({servicers: arr3})
    console.log(idLabel);
    // 右侧已选择服务商删除
    const id = JSON.parse(idLabel).id;
    const arr = [...selectedEnterprise];
    const arr2 = arr.filter((item) => item.id != id);
    console.log(arr2);
    setSelectedEnterprise(arr2, 'arr2');
    // 左侧checkbox删除已选中选项
    const arr3: string[] = [];
    arr2.map((item) => {
      const { enterpriseName, enterpriseId, ...obj } = item;
      arr3.push(JSON.stringify(obj));
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
      const arr2: string[] = [];
      setSelectedEnterprise(arr);
      arr.map((item: { [x: string]: any; enterpriseName: any; enterpriseId: any }) => {
        const { enterpriseName, enterpriseId, ...obj } = item;
        arr2.push(JSON.stringify(obj));
      });
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
      const arealevelLists = [];
      setArea(getAreaTreeDate(areaRes && areaRes.result, arealevelLists) || []);
      setArealevelList(arealevelLists);
    } catch (error) {
      console.log(error);
      message.error('获取省市区数据出错');
    }
  };

  // // 处理数据
  // const flatTreeAndSetLevel = (tree: any) => {
  //   const list = [];
  //   tree.forEach((item) => {
  //     const o = JSON.parse(JSON.stringify(item));
  //     if (o.nodes) delete o.nodes;
  //     // o.level = level
  //     list.push(o);
  //     if (item.nodes && item.nodes.length) {
  //       list.push(...flatTreeAndSetLevel(item.nodes));
  //     }
  //   });
  //   return list;
  // };
  const getParentAreas = (pid: number, list: any) => {
    console.log('list', list);
    const target = [];
    const o = list.find((item: { code: number }) => item.pcode == pid) || {};
    console.log('o-getParentAreas', o);
    if (JSON.stringify(o) != '{}') {
      target.push({ ...o, code: o.pcode });
    }
    if (o.parentCode) {
      target.push(...getParentAreas(o.parentCode, list));
    }
    return target;
  };
  ensureInput;
  const selectArea = (value: any, node: any, exra: any) => {
    console.log('arealevelList1', arealevelList);
    const arr = getParentAreas(value, arealevelList);
    setSelectedArea(arr);
  };
  const ensureInput = () => {
    console.log(selectedEnterprise, '选中的服务企业');
    const params: any = {};
    if (inputEnterpriseForm.getFieldValue('enterpriseName')) {
      params.enterpriseName = inputEnterpriseForm.getFieldValue('enterpriseName');
    } else {
      message.error('请输入企业名称');
      return;
    }
    if (selectedArea && selectedArea.length > 0) {
      params.handInput = 0;
      selectedArea.map((item: any) => {
        if (item.grade == 1) {
          params.provinceName = item.name;
          params.provinceCode = item.code;
        }
        if (item.grade == 2) {
          params.cityName = item.name;
          params.cityCode = item.code;
        }
        if (item.grade == 3) {
          params.countyName = item.name;
          params.countyCode = item.code;
        }
      });
    }
    console.log(params, '手动录入数据params');
    setSelectedEnterprise([params, ...selectedEnterprise]);
    setInputAble(true);
    inputEnterpriseForm.resetFields();
  };
  // 获取选择的服务企业
  const handleEnterpriseOk = async () => {
    console.log(editServiceEnterprise, '正在编辑的服务商');
    const showSelectedEnterprise: string[] = [];
    if (selectedEnterprise && selectedEnterprise.length > 0) {
      selectedEnterprise.map((item: any) => {
        showSelectedEnterprise.push(item.enterpriseName);
      });
    }
    console.log(selectedEnterprise, '选择的服务企业');
    setEditServiceEnterprise({
      serviceProviderName: editServiceEnterprise.serviceProviderName,
      serviceProviderId: editServiceEnterprise.serviceProviderId,
      listEnter: selectedEnterprise,
    });
    console.log(selectedOrgList, '所选服务商合集');
    const newData = [...selectedOrgList];
    const index = newData.findIndex(
      (item) => editServiceEnterprise.serviceProviderId === item.serviceProviderId,
    );
    const item = newData[index];
    newData.splice(index, 1, { ...item, listEnter: selectedEnterprise });
    console.log(newData, 'handleSave后的数据');
    setSelectedOrgList(newData);
    closeSelectEnterprise();
  };
  // 分配服务企业弹框
  const useEnterpriseModal = (): React.ReactNode => {
    return (
      <Modal
        title={'服务企业-' + editServiceEnterprise.serviceProviderName}
        width="800px"
        visible={enterpriseModal}
        maskClosable={false}
        onOk={handleEnterpriseOk}
        className="enterprise-modal"
        onCancel={closeSelectEnterprise}
        footer={[
          <Button key="back" onClick={closeSelectEnterprise}>
            取消
          </Button>,
          <Button key="link" type="primary" onClick={handleEnterpriseOk}>
            确定
          </Button>,
        ]}
      >
        <Row>
          <Col span={12}>
            <div className="left-content-wrapper">
              <div className="checkbox-wrapper">
                <Form
                  form={enterpriseForm}
                  onValuesChange={(newEventName, allValues) => {
                    changeEnterpriseForm(newEventName, allValues);
                  }}
                >
                  <Form.Item name="keyword" label="">
                    <Input suffix={<SearchOutlined />} />
                  </Form.Item>
                  {/* <Form.Item
                    name="servicers"
                    label=""
                  >
                    <Checkbox.Group style={{ width: '100%' }} onChange={onChangeEnterprise}>
                      <Row>
                        {orgList && orgList.map(item => {
                          return (
                            <Col span={20} style={{marginTop: '8px'}}>
                              <Checkbox value={JSON.stringify(item)} key={item.id}>
                                {item.orgName}
                                {
                                  item.provinceName ? `（${item.provinceName}${item.cityName?'/'+item.cityName:''}${item.countyName?'/'+item.countyName:''}）` : ''
                                }
                              </Checkbox>
                            </Col>
                          )
                        })}
                      </Row>
                    </Checkbox.Group>
                  </Form.Item> */}
                </Form>
                <List>
                  <VirtualList
                    data={orgList}
                    height={ContainerHeight2}
                    itemHeight={40}
                    itemKey="id"
                    onScroll={onScroll2}
                  >
                    {(item: any) => (
                      <List.Item key={item.id}>
                        <Checkbox
                          checked={enterpriseCheckboxValue.indexOf(JSON.stringify(item)) > -1}
                          value={JSON.stringify(item)}
                          key={item.id}
                          onChange={onChangeEnterprise}
                        >
                          {item.orgName}
                          {item.provinceName
                            ? `（${item.provinceName}${item.cityName ? '/' + item.cityName : ''}${
                                item.countyName ? '/' + item.countyName : ''
                              }）`
                            : ''}
                        </Checkbox>
                      </List.Item>
                    )}
                  </VirtualList>
                </List>
              </div>
              <p className="not-find-title">未找到企业？可选择手动录入</p>
              <Form
                form={inputEnterpriseForm}
                hideRequiredMark
                layout="vertical"
                onValuesChange={(newEventName, allValues) => {
                  onValuesChange(newEventName, allValues);
                }}
              >
                <Form.Item name="enterpriseName" label="企业名称">
                  <Input placeholder="请输入" maxLength={35} />
                </Form.Item>
                <Form.Item name="areaCode" label="企业所在地">
                  <TreeSelect
                    placeholder="请选择"
                    allowClear
                    showCheckedStrategy="SHOW_ALL"
                    onChange={(value: any, node: any, exra: any) => {
                      selectArea(value, node, exra);
                    }}
                    fieldNames={{ value: 'code', label: 'name', children: 'nodes' }}
                    treeData={area}
                  />
                </Form.Item>
              </Form>
              <Button onClick={ensureInput} disabled={inputAble} type="primary">
                录入
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div className="right-content-wrapper">
              <div className="selected-servers-length">
                已选择服务企业（{selectedEnterprise.length}）
                <Button
                  type="text"
                  disabled={selectedEnterprise.length == 0}
                  onClick={emptySelectedEnterprise}
                >
                  清空
                </Button>
              </div>
              <div className="selected-servers-wrap">
                {selectedEnterprise &&
                  selectedEnterprise.map(
                    (item: {
                      enterpriseId: React.Key | null | undefined;
                      enterpriseName:
                        | boolean
                        | React.ReactChild
                        | React.ReactFragment
                        | React.ReactPortal
                        | null
                        | undefined;
                      provinceName: any;
                      cityName: string;
                      countyName: string;
                    }) => {
                      return (
                        <p key={item.enterpriseId}>
                          <span>
                            {item.enterpriseName}
                            {item.provinceName
                              ? `（${item.provinceName}${item.cityName ? '/' + item.cityName : ''}${
                                  item.countyName ? '/' + item.countyName : ''
                                }）`
                              : ''}
                          </span>
                          <CloseCircleOutlined
                            onClick={() => {
                              cancelSelectEnterprise(JSON.stringify(item));
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
  const editService = async (record: any) => {
    console.log(record, '编辑record');
    const detailRes = await getServiceDetail(record.packageNo);
    if (detailRes.code === 0) {
      const serviceArr = detailRes.result.list || [];
      // setDetailItem(detailRes.result)
      const showServiceArr: any = [];
      const showCheckboxServer: string[] = [];
      if (serviceArr && serviceArr.length > 0) {
        serviceArr.map((item: any) => {
          showServiceArr.push(item.serviceProviderName);
          showCheckboxServer.push(item.serviceProviderId + '-' + item.serviceProviderName);
        });
      }
      setOpen(true);
      setSelectedOrgList(serviceArr);
      setServerCheckboxValue(showCheckboxServer);
      setEditItem({ ...record, ...detailRes.result });
      editForm.setFieldsValue({
        ...record,
        serviceTimeSpan: [moment(record.startTime), moment(record.endTime)],
        diagnoseServicers: showServiceArr,
      });
    } else {
      message.error(detailRes.message);
    }
  };
  // 确定新建
  const ensureAddOrEdit = () => {
    console.log(selectedOrgList, '服务商信息');
    editForm
      .validateFields()
      .then(async (value) => {
        // debugger
        const params: any = {};
        console.log(value);
        if (value.serviceTimeSpan) {
          params.startTime = moment(value.serviceTimeSpan[0]).format('YYYY-MM-DD');
          params.endTime = moment(value.serviceTimeSpan[1]).format('YYYY-MM-DD');
        }
        params.name = value.name;
        if (value.projectName) {
          params.projectName = value.projectName;
        }
        params.list = selectedOrgList;
        console.log(editItem, 'editItem');
        if (editItem && editItem.packageNo) {
          params.packageNo = editItem.packageNo;
        }
        const submitRes = await saveServicePackage(params);
        if (submitRes.code === 0) {
          message.success(
            editItem && editItem.id ? '诊断服务包编辑成功！' : `诊断服务包新建成功！`,
          );
          setOpen(false);
          editForm.resetFields();
          setSelectedOrgList([]);
          getPage();
        } else {
          message.error(`所属行业编辑失败，原因:{${submitRes.message}}`);
        }
      })
      .catch(() => {});
  };
  // 诊断详情获取
  const [detailItem, setDetailItem] = useState<any>({});
  const detailColumns = [
    {
      title: '诊断服务商',
      dataIndex: 'serviceProviderName',
    },
    {
      title: '服务企业',
      dataIndex: 'list',
      render: (_: any, record: any) => {
        return record.listEnter.map((item: any) => {
          return (
            <div>
              {item.enterpriseName}
              {item.provinceName
                ? `（${item.provinceName}${item.cityName ? '/' + item.cityName : ''}${
                    item.countyName ? '/' + item.countyName : ''
                  }）`
                : ''}
            </div>
          );
        });
      },
    },
  ];
  const getServicePackageDetail = async (record: any) => {
    const detailRes = await getServiceDetail(record.packageNo);
    if (detailRes.code === 0) {
      setDetailItem(detailRes.result);
      showDetailDrawer();
    } else {
      message.error(detailRes.message);
    }
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
      title: '服务包名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width: 200,
      render: (_: any, _record: any) => (_record.projectName ? _record.projectName : '--'),
    },
    {
      title: '服务时间',
      dataIndex: 'updateTime',
      width: 240,
      render: (_: string, _record: any) =>
        moment(_record?.startTime).format('YYYY-MM-DD') +
        '~' +
        moment(_record?.endTime).format('YYYY-MM-DD'),
    },
    {
      title: '诊断服务商数',
      dataIndex: 'serviceProviderNum',
      width: 160,
    },
    {
      title: '服务企业数',
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
                getServicePackageDetail(record);
              }}
            >
              详情
            </Button>
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => {
                editService(record);
              }}
            >
              编辑
            </Button>
          </Space>
          // </Access>
        );
      },
    },
  ].filter((p) => p);

  return (
    <div className="diagnose-service-package">
      <h3 className="title">诊断项目管理</h3>
      <div className="content-wrapper">
        <div className="container-table-header">
          <h3>诊断服务包</h3>
          <Access accessible={access.P_SM_XQGL}>
            <Button type="primary" onClick={showDrawer}>
              新增诊断服务包
            </Button>
          </Access>
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
            <p>点击右上角，添加诊断服务包</p>
          </div>
        )}
        {useModal()}
        {useEnterpriseModal()}
        {/* 新增、编辑服务包 */}
        <Drawer
          title={editItem && editItem.id ? '编辑诊断服务包' : '新建诊断服务包'}
          onClose={onClose}
          size={'large'}
          className="detail-drawer"
          visible={open}
          footer={[
            <Button key="cancel" onClick={onClose}>
              取消
            </Button>,
            <Button
              key="ensure"
              type="primary"
              onClick={() => {
                ensureAddOrEdit();
              }}
            >
              确定
            </Button>,
          ]}
          closable={false}
          bodyStyle={{
            paddingBottom: 80,
          }}
        >
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} form={editForm}>
            <div className="container-form-group">基础信息</div>
            <Form.Item
              name="name"
              label="服务包名称"
              rules={[
                {
                  required: true,
                  message: '请输入服务包名称',
                },
              ]}
            >
              <Input placeholder="请输入" maxLength={35} />
            </Form.Item>
            <Form.Item name="projectName" label="项目名称">
              <Input placeholder="请输入" maxLength={35} />
            </Form.Item>
            <Form.Item
              name="serviceTimeSpan"
              label="服务时间"
              rules={[
                {
                  required: true,
                  message: '请选择服务时间',
                },
              ]}
            >
              <DatePicker.RangePicker allowClear />
            </Form.Item>
            <Form.Item
              name="diagnoseServicers"
              label="诊断服务商"
              rules={[
                {
                  required: true,
                  message: '请选择服务商',
                },
              ]}
            >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择"
                options={[]}
                maxTagCount="responsive"
                onClick={() => {
                  setOrgList([]);
                  setModalVisible(true);
                  setCurrentPage(1);
                }}
                onChange={handleServersChange}
              />
            </Form.Item>
          </Form>
          <div className="container-form-group">分配诊断任务</div>
          <div className="container-service-enterprise">
            <ul>
              {selectedOrgList &&
                selectedOrgList.map((item: any) => {
                  return (
                    <li key={item.serviceProviderId}>
                      <div className="org-fenpei">
                        <span>{item.serviceProviderName}</span>
                        <Button
                          type="text"
                          onClick={() => {
                            showSelectEnterprise(item);
                          }}
                        >
                          分配服务企业
                        </Button>
                      </div>
                      <p>
                        {item.listEnter &&
                          item.listEnter.length > 0 &&
                          item.listEnter.map((enter: any) => {
                            return (
                              <span>
                                {enter.enterpriseName}
                                {enter.provinceName
                                  ? `（${enter.provinceName}${
                                      enter.cityName ? '/' + enter.cityName : ''
                                    }${enter.countyName ? '/' + enter.countyName : ''}）`
                                  : ''}
                                、
                              </span>
                            );
                          })}
                      </p>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div>
            <Button />
          </div>
        </Drawer>
        {/* 服务包详情 */}
        <Drawer
          title="诊断详情"
          onClose={onCloseDetail}
          size={'large'}
          className="detail-drawer"
          visible={openDetail}
          bodyStyle={{
            paddingBottom: 80,
          }}
        >
          <div className="container-form-group">服务包名称</div>
          <h3>{detailItem.name}</h3>
          <div className="container-form-group">诊断任务</div>
          <Table columns={detailColumns} dataSource={detailItem.list} pagination={false} />
        </Drawer>
      </div>
    </div>
  );
};
