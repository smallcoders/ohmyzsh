import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
  Space,
  Popconfirm,
  message,
  TreeSelect,
} from 'antd';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import OrgManage from '@/types/org-manage.d';
import {
  getUserFeedbackPage,
} from '@/services/user-feedback';
import { listAllAreaCode } from '@/services/common';
import { PageContainer } from '@ant-design/pro-layout';
import { getOrgManagePage, signOrgTag, httpOrgExport } from '@/services/org-type-manage';
import { Access, useAccess,history } from 'umi';
import {routeName} from "../../../../config/routes";
import { UploadOutlined } from '@ant-design/icons';
const sc = scopedClasses('user-config-org-manage');
enum Edge {
  HOME = 0,
}

const { RangePicker } = DatePicker

export default () => {
  const [searchForm] = Form.useForm();
  const { type } = history.location.query as any;
  const [dataSource, setDataSource] = useState<OrgManage.Content[]>([]);
  const [searchContent, setSearChContent] = useState<OrgManage.searchContent>({});
  const [activeTags, setActiveTags] = useState<OrgManage.OrgManageTypeEnum[]>([]);
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_UM_ZZGL', // 用户管理-组织管理
  }

  useEffect(() => {
    if (type) {
      searchForm.setFieldsValue({
        orgTypeId: type
      })
      const search = searchForm.getFieldsValue();
      setSearChContent(search)
    }
    for (const key in permissions) {
      const permission = permissions[key]
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        setEdge(key as any)
        break
      }
    }
  },[])

  const [area, setArea] = useState<any[]>([]);
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getOrgManagePage({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  const tag = async (id: string) => {
    try {
      const res = await signOrgTag({
        id,
        orgSigns: activeTags,
      });
      if (res?.code === 0) {
        message.success('标记成功')
        getPage()
      } else {
        throw new Error(res?.message);
      }
    } catch (error) {
      message.error(`请求失败，原因:{${error}}`);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: OrgManage.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '组织名称',
      dataIndex: 'orgName',
      width: 200,
    },
    {
      title: '组织类型',
      dataIndex: 'orgTypeName',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '组织注册区域',
      dataIndex: 'areaName',
      isEllipsis: true,
      width: 250,
    },
    {
      title: '组织管理员',
      dataIndex: 'adminName',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '认证时间',
      dataIndex: 'auditTime',
      isEllipsis: true,
      width: 250,
    },
    {
      title: '管理员注册时间',
      dataIndex: 'registerTime',
      isEllipsis: true,
      width: 250,
    },
    {
      title: '标注情况',
      dataIndex: 'orgSignName',
      isEllipsis: true,
      width: 450,
    },
    access['P_UM_ZZGL'] && {
      title: '操作',
      width: 240,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: OrgManage.Content) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return <Access accessible={accessible}>
          <Space size={10}>
            <Button
              type="link"
              onClick={() => {
                history.push(`${routeName.ORG_MANAGE_NEW_DETAIL}?id=${record.id}`);
              }}
            >
              详情
            </Button>
            <Popconfirm
              icon={null}
              title={
                <>
                  <span>
                    请选择将要给该组织标注的标签
                  </span>
                  <div>
                    {Object.entries(OrgManage.orgManageTypeJson).map(p => {
                      const [value, title] = p
                      const isExist = activeTags.includes(value as OrgManage.OrgManageTypeEnum)
                      return <div onClick={() => {
                        setActiveTags((pre) => {
                          if (isExist) {
                            return pre.filter(i => i != value);
                          }
                          else {
                            return [...pre, value]
                          }
                        })
                      }} style={{ padding: '5px 30px', cursor: 'pointer', marginTop: 10, borderRadius: '4px', textAlign: 'center', backgroundColor: isExist ? '#C0E3FA' : '#E6E6E6' }}>
                        {title}
                      </div>
                    })}
                  </div>
                </>
              }
              onConfirm={() => {
                tag(record?.id)
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                onClick={() => {
                  setActiveTags(record?.orgSignEnumList || [])
                }}
              >
                标注
              </Button>
            </Popconfirm>
            <Button
              type="link"
              onClick={() => {
                window.open(`${routeName.ORG_MANAGE_DETAIL}?id=${record.id}`);
              }}
            >
              成员信息
            </Button>
          </Space>
        </Access>
      },
    },
  ].filter(p => p);

  useEffect(() => {
    prepare()
  }, [])

  const prepare = async () => {
    try {
      const areaRes = await listAllAreaCode()
      setArea(areaRes && areaRes.result || [])
    } catch (error) {
      message.error('获取省市区数据出错')
    }
  }

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="orgName" label="组织名称">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="orgTypeId" label="组织类型">
                <Select placeholder="请选择" allowClear>
                  {
                    Object.entries(OrgManage.orgTypeJson)?.map(p => {
                      return <Select.Option key={p[0]} value={p[0]}>{p[1]}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="areaCode" label="组织注册区域">
                <TreeSelect
                  placeholder="请选择"
                  allowClear
                  fieldNames={{ 'value': 'code', 'label': 'name', 'children': 'nodes' }}
                  treeData={area}
                ></TreeSelect>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="orgSign" label="标注情况">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(OrgManage.orgManageTypeJson).map(p => {
                    return <Select.Option value={p[0]}>{p[1]}</Select.Option>
                  })}
                  <Select.Option value={999}>未标注</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="认证时间">
                <RangePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
             <Col span={8}>
              <Form.Item name="industryCategoryName" label="组织标签">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col offset={18} span={4}>
              <Button
                style={{ marginRight: 20, marginBottom: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search?.orgSign && search?.orgSign == 999) {
                    search.signed = false
                    search.orgSign = undefined
                  }
                  search.startTime = search?.time &&  moment(search?.time[0]).format('YYYY-MM-DD HH:mm:ss'),
                  search.endTime = search?.time &&  moment(search?.time[1]).format('YYYY-MM-DD HH:mm:ss'),
                  delete search.time;
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

  const exportList = async () => {
    const {
      orgName,
      orgTypeId,
      areaCode,
      orgSign,
      industryCategoryName,
      startTime,
      endTime,
    } = searchContent;
    console.log('startTime', startTime)
    console.log('@searchContent', searchContent);

    try {
      const res = await httpOrgExport({
        orgName,
        orgTypeId: Number(orgTypeId),
        areaCode,
        orgSign,
        startTime,
        endTime,
        industryCategoryName,
      });
      if (res?.data.size == 67 || res?.data.type == 'application/json')
        return message.warning('操作太过频繁，请稍后再试');
      const content = res?.data;
      const blob = new Blob([content], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });
      const fileName = '组织管理.xlsx';
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
          <span>组织列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
        <Access accessible={access.PX_UM_ZZGL}>
          <Button icon={<UploadOutlined />} onClick={exportList}>
            导出
          </Button>
        </Access>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1480 }}
          columns={columns}
          rowKey={'id'}
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
    </PageContainer>
  );
};
