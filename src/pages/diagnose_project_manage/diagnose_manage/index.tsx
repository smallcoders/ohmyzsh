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
  TreeSelect
} from 'antd';
const { Search } = Input;
const { Option } = Select;
import { UserOutlined, AudioOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { Access, useAccess } from 'umi';
import {
	getOrgList
} from '@/services/digital-application';
import { listAllAreaCode } from '@/services/common';
import {
  getServiceQueryPage
} from '@/services/diagnose-service';
import type Common from '@/types/common';
import type NeedVerify from '@/types/user-config-need-verify';
const sc = scopedClasses('diagnose-project-service');
const stateObj = {
  NOT_CONNECT: '未对接',
  CONNECTING: '对接中',
  CONVERTED: '已转化',
  RESOLVED: '已解决',
};
enum Edge {
  HOME = 0, // 新闻咨询首页
}
export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<NeedVerify.Content[]>([]);
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_SM_XQGL', // 科产管理-创新需求管理页面查询
  }
  useEffect(() => {
    for (const key in permissions) {
      const permission = permissions[key]
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        setEdge(key as any)
        break
      }
    }
  },[])

  // 新建/编辑诊断服务包
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [currentId, setCurrentId] = useState<string>('');

  const formLayout2 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  };

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
    // try {
    //   const res = await Promise.all([getKeywords()]);
    //   setKeywords(res[0].result || []);
    // } catch (error) {
    //   message.error('获取数据失败');
    // }
    getPage()
  };
  useEffect(() => {
    prepare();
  }, []);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<any>({});
  const [editForm] = Form.useForm();
  // const newKeywords = Form.useWatch('keyword', editForm);
  const handleOk = async () => {
    console.log(selectedOrgList, 'selectedOrgList');
    let showSelectedOrg: string[] = []
    if(selectedOrgList && selectedOrgList.length > 0) {
      selectedOrgList.map((item: any) => {
        showSelectedOrg.push(item.orgName)
      })
    }
    setModalVisible(false);
    editForm.setFieldsValue(
      {
        ...editItem,
        diagnoseServicers: showSelectedOrg
      }
    )
    // editForm
    //   .validateFields()
    //   .then(async (value) => {
    //     const submitRes = await updateKeyword({
    //       id: currentId,
    //       ...value,
    //     });
    //     if (submitRes.code === 0) {
    //       message.success(`所属行业编辑成功！`);
    //       setModalVisible(false);
    //       editForm.resetFields();
    //       getPage();
    //     } else {
    //       message.error(`所属行业编辑失败，原因:{${submitRes.message}}`);
    //     }
    //   })
    //   .catch(() => {});
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const [orgList, setOrgList] = useState<any>([])
	const [selectedOrgList, setSelectedOrgList] = useState<any>([])
  const [servicersForm] = Form.useForm();
  const onSearch = async (value: string) => {
		const { result, code } = await getOrgList({
			pageIndex: 1,
			pageSize: 20,
			orgName: value
		});
		if (code === 0 && result.length>0) {
			setOrgList(result)
		} else {
			message.error(`请求公司列表数据失败`);
		}
	};
  const onChange = (checkedValues: CheckboxValueType[]) => {
    let arr: any = []
    if(checkedValues && checkedValues.length > 0) {
      checkedValues.map((item: any) => {
        arr.push({ orgName: item.split('-')[1], id: item.split('-')[0] })
      })
    }
    setSelectedOrgList(arr)
  };
  const cancelSelect = (idLabel: string) => {
    console.log(idLabel)
    // 右侧已选择服务商删除
    const id = idLabel.split('-')[0]
    let arr = [...selectedOrgList]
    let arr2 = arr.filter(item => item.id != id)
    setSelectedOrgList(arr2)
    // 左侧checkbox删除已选中选项
    let formArr = servicersForm.getFieldsValue().servicers
    console.log(formArr)
    let arr3 = formArr.filter(item => item != idLabel)
    servicersForm.setFieldsValue({servicers: arr3})
  }
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={'诊断服务商'}
        width="640px"
        visible={modalVisible}
        maskClosable={false}
        onOk={handleOk}
        className="servicers-modal"
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="link" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <Row>
          <Col span={12}>
            <div className='left-content-wrapper'>
              <Search 
                placeholder="请输入搜索内容" 
                onSearch={onSearch}
                suffix={<AudioOutlined />} 
              />
              <div className='checkbox-wrapper'>
                <Form form={servicersForm}>
                  <Form.Item
                    name="servicers"
                    label=""
                  >
                    <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                      <Row>
                        {orgList && orgList.map(item => {
                          return (
                            <Col span={20} style={{marginTop: '8px'}}>
                              <Checkbox value={item.id + '-' + item.orgName} key={item.id}>{item.orgName}</Checkbox>
                            </Col>
                          )
                        })}
                      </Row>
                    </Checkbox.Group>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className='right-content-wrapper'>
              <div className='selected-servers-length'>
                已选择诊断服务商（{selectedOrgList.length}）
                <Button type='text' disabled={selectedOrgList.length==0}>清空</Button>
              </div>
              <div className='selected-servers-wrap'>
                {selectedOrgList && selectedOrgList.map(item => {
                  return (
                    <p key={item.id}>
                      <span>{item.orgName}</span>
                      <CloseCircleOutlined onClick={() => {
                        cancelSelect(item.id + '-' + item.orgName)
                      }} />
                    </p>
                  )
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    );
  };

  // 选择服务企业
  const [editServiceEnterprise, setEditServiceEnterprise] = useState<any>({})
  const [area, setArea] = useState<any[]>([]);
  const [enterpriseModal, setEnterpriseModal] = useState<boolean>(false);
  const [inputEnterpriseForm] = Form.useForm()
  const getAreaData = async() => {
    try {
      const areaRes = await listAllAreaCode()
      setArea(areaRes && areaRes.result || [])
    } catch (error) {
      message.error('获取省市区数据出错')
    }
  }
  const handleEnterpriseCancel = () => {
    setEnterpriseModal(false);
  };
  // 分配服务企业弹框
  const useEnterpriseModal = (): React.ReactNode => {
    return (
      <Modal
        title={'服务企业-'+editServiceEnterprise.orgName}
        width="640px"
        visible={enterpriseModal}
        maskClosable={false}
        onOk={handleOk}
        className="enterprise-modal"
        onCancel={handleEnterpriseCancel}
        footer={[
          <Button key="back" onClick={handleEnterpriseCancel}>
            取消
          </Button>,
          <Button key="link" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <Row>
          <Col span={12}>
            <div className='left-content-wrapper'>
              <Search 
                placeholder="请输入搜索内容" 
                onSearch={onSearch}
                suffix={<AudioOutlined />} 
              />
              <div className='checkbox-wrapper'>
                <Form form={servicersForm}>
                  <Form.Item
                    name="servicers"
                    label=""
                  >
                    <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                      <Row>
                        {orgList && orgList.map(item => {
                          return (
                            <Col span={20} style={{marginTop: '8px'}}>
                              <Checkbox value={item.id + '-' + item.orgName} key={item.id}>{item.orgName}</Checkbox>
                            </Col>
                          )
                        })}
                      </Row>
                    </Checkbox.Group>
                  </Form.Item>
                </Form>
              </div>
              <p className='not-find-title'>未找到企业？可选择手动录入</p>
              <Form 
                form={inputEnterpriseForm} 
                hideRequiredMark
                layout="vertical"
              >
                <Form.Item
                  name="enterpriseName"
                  label="企业名称"
                  rules={[
                    {
                      required: true,
                      message: '请输入企业名称',
                    },
                  ]}
                >
                  <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item 
                  name="areaCode" 
                  label="企业所在地"
                  rules={[
                    {
                      required: true,
                      message: '请选择企业所在地',
                    },
                  ]}
                >
                  <TreeSelect
                    placeholder="请选择"
                    allowClear
                    fieldNames={{ 'value': 'code', 'label': 'name', 'children': 'nodes' }}
                    treeData={area}
                  ></TreeSelect>
                </Form.Item>
              </Form>
              <Button>录入</Button>
            </div>
          </Col>
          <Col span={12}>
            <div className='right-content-wrapper'>
              <div className='selected-servers-length'>
                已选择服务企业（{selectedOrgList.length}）
                <Button type='text' disabled={selectedOrgList.length==0}>清空</Button>
              </div>
              <div className='selected-servers-wrap'>
                {selectedOrgList && selectedOrgList.map(item => {
                  return (
                    <p key={item.id}>
                      <span>{item.orgName}</span>
                      <CloseCircleOutlined onClick={() => {
                        cancelSelect(item.id + '-' + item.orgName)
                      }} />
                    </p>
                  )
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
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
      title: '服务包名称',
      dataIndex: 'sort',
      width: 300,
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      render: (_: string, _record: any) => (
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            window.open(`/science-technology-manage/creative-need-manage/detail?id=${_record.id}`);
          }}
        >
          {_}
        </a>
      ),
      width: 300,
    },
    {
      title: '服务时间',
      dataIndex: 'updateTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '诊断服务商数',
      dataIndex: 'state',
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
      title: '服务企业数',
      dataIndex: 'areaName',
      isEllipsis: true,
      width: 150,
    },
    access['P_SM_XQGL'] && {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return (
          <Access accessible={accessible}>
            <Space wrap>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  setModalVisible(true);
                  setCurrentId(record.id);
                  editForm.setFieldsValue({
                    keyword: record.keyword || [],
                    keywordOther: record.keywordOther || '',
                  });
                }}
              >
                编辑
              </Button>
            </Space>
          </Access>
        )
        

      },
    },
  ].filter(p => p);

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>创新需求列表(共{pageInfo.totalCount || 0}个)</span>
          <Access accessible={access['P_SM_XQGL']}>
            <Button type='primary'  onClick={showDrawer}>
              新增诊断服务包
            </Button>
          </Access>
        </div>
      </div>
      <div className={sc('container-table-body')}>
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
      
      {useModal()}
      {useEnterpriseModal()}
      <Drawer
        title="新建诊断服务包"
        onClose={onClose}
        size={'large'}
        visible={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          form={editForm}
        >
          <div className={sc('container-form-group')}>基础信息</div>
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
          <Form.Item
            name="projectName"
            label="项目名称"
          >
            <Input placeholder="请输入" />
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
            <DatePicker.RangePicker allowClear showTime />
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
              maxTagCount='responsive'
              onClick={() => {
                setModalVisible(true);
                onSearch('')
              }}
            />
          </Form.Item>
        </Form>
        <div className={sc('container-form-group')}>分配诊断任务</div>
        <div className={sc('container-service-enterprise')}>
          <ul>
            {selectedOrgList && selectedOrgList.map((item: any) => {
              return (
                <li key={item.id}>
                  <div>
                    <span>{item.orgName}</span>
                    <Button type='text' onClick={() => {
                      setEnterpriseModal(true)
                      setEditServiceEnterprise(item)
                      getAreaData()
                    }}>分配服务企业</Button>
                  </div>
                  <p>展示已分配的服务企业。。。</p>
                </li>
              )
            })}
          </ul>
        </div>
      </Drawer>
    </PageContainer>
  );
};
