import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message,
  Space,
  DatePicker,
  Image,
  TreeSelect
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './index.less';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { Access, useAccess } from 'umi';
import { listAllAreaCode } from '@/services/common';
import {
  getRecordQueryPage, 
  exportRecordQueryPage
} from '@/services/diagnose-manage';
import type Common from '@/types/common';
import type NeedVerify from '@/types/user-config-need-verify';
import icon1 from '@/assets/system/empty.png';

const stateObj = {
  0: 'APP',
  1: 'WEB'
};
export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<NeedVerify.Content[]>([]);
  const [area, setArea] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<any[]>([]);
  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const [searchContent, setSearChContent] = useState<{
    orgName?: string; // 标题
    source?: number; // 状态：app、web
    areaLevel?: number;
    orgProvinceCode?: number;
    orgCityCode?: number;
    orgCountyCode?: number;
    diagnoseStartTime?: string;
    diagnoseEndTime?: string;
    questionnaireName?: string;
  }>({});
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
      const {orgName, source, areaLevel, orgProvinceCode, orgCityCode, orgCountyCode, diagnoseStartTime, diagnoseEndTime, questionnaireName} = searchContent
      const { result, totalCount, pageTotal, code } = await getRecordQueryPage({
        orgName,
        source,
        // areaLevel,
        orgProvinceCode, 
        orgCityCode, 
        orgCountyCode, 
        diagnoseStartTime, 
        diagnoseEndTime, 
        questionnaireName,
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

  useEffect(() => {
    getAreaData();
  }, []);
  useEffect(() => {
    getPage();
  }, [searchContent]);
  
  const getAreaData = async () => {
    try {
      const areaRes = await listAllAreaCode();
      setArea(areaRes && areaRes.result || [])
    } catch (error) {
      console.log(error);
      message.error('获取省市区数据出错');
    }
  };
  // 处理数据
  const flatTreeAndSetLevel = (tree:any) => {
    const list:any = []
    tree.forEach(item => {
      const o = JSON.parse(JSON.stringify(item))
      if(o.nodes) delete o.nodes
      list.push(o)
      if(item.nodes && item.nodes.length) {
        list.push(...flatTreeAndSetLevel(item.nodes))
      }
    })
    return list
  }
  const getParentAreas = (pid:number, list:any) => {
    const target = []
    const o = list.find(item => item.code == pid) || {}
    if(JSON.stringify(o) != '{}') {
      target.push(o)
    }
    if(o.parentCode) {
      target.push(...getParentAreas(o.parentCode, list))
    }
    return target
  }
  const selectArea = (value:any, node:any, exra:any) => {
    let arr = getParentAreas(value, flatTreeAndSetLevel(area))
    console.log(arr, '----->>>')
    setSelectedArea(arr)
  }
  
  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className='container-search'>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="orgName" label="所属企业">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="areaCode" label="企业所属区域">
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
            </Col>
            <Col span={6}>
              <Form.Item name="questionnaireName" label="问卷名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }} justify={'space-between'}>
            <Col span={18}>
              <Row>
                <Col span={8}>
                  <Form.Item name="time" label="诊断时间">
                    <DatePicker.RangePicker allowClear style={{width: '100%'}} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="source" label="诊断端">
                    <Select placeholder="请选择" allowClear>
                      {Object.entries(stateObj).map((p) => (
                        <Select.Option key={p[0] + p[1]} value={Number(p[0])}>
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
                    search.diagnoseStartTime = moment(search.time[0]).format('YYYY-MM-DD');
                    search.diagnoseEndTime = moment(search.time[1]).format('YYYY-MM-DD');
                  }
                  if (selectedArea && selectedArea.length > 0) {
                    selectedArea.map((item: any) => {
                      if (item.grade == 1) {
                        // search.areaLevel = 3
                        search.orgProvinceCode = item.code;
                      }
                      if (item.grade == 2) {
                        // search.areaLevel = 2
                        search.orgCityCode = item.code;
                      }
                      if (item.grade == 3) {
                        // search.areaLevel = 1
                        search.orgCountyCode = item.code;
                      }
                    });
                  }
                  console.log(search, '搜索条件');
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
                  setSelectedArea([])
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
      dataIndex: 'userName',
      width: 200,
    },
    {
      title: '所属企业',
      dataIndex: 'orgName',
      width: 200,
      render: (_: any, _record: any) => (_record.orgName ? _record.orgName : '--'),
    },
    {
      title: '企业所属区域',
      dataIndex: 'orgRegion',
      width: 200,
      render: (_: any, _record: any) => (_record.orgRegion ? _record.orgRegion : '--'),
    },
    {
      title: '问卷名称',
      dataIndex: 'questionnaireName',
      width: 200,
      render: (_: any, _record: any) => (_record.questionnaireName ? _record.questionnaireName : '--'),
    },
    {
      title: '诊断时间',
      dataIndex: 'diagnoseTime',
      width: 240,
      render: (_: string, _record: any) => moment(_record?.diagnoseTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '诊断提交时间',
      dataIndex: 'submitTime',
      width: 240,
      render: (_: string, _record: any) => _record?.submitTime ? moment(_record?.submitTime).format('YYYY-MM-DD HH:mm:ss') : '--',
    },
    {
      title: '是否发起对接',
      dataIndex: 'docking',
      width: 160,
    },
    {
      title: '是否发布需求',
      dataIndex: 'postDemand',
      isEllipsis: true,
      width: 160,
    },
    {
      title: '诊断端',
      dataIndex: 'source',
      isEllipsis: true,
      width: 160,
      render: (_: any, _record: any) => (_record.source ? _record.source : '--'),
    },
    {
      title: '操作',
      width: 180,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space wrap>
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => {
                window.open(`/diagnose-manage/diagnose-record-report/detail?id=${record.id}`)
              }}
            >
              详情
            </Button>
          </Space>
        );
      },
    },
  ].filter((p) => p);

  const exportList = async () => {
    const curTime = moment(new Date()).format('YYYYMMDD')
    const {orgName, source, areaLevel, orgProvinceCode, orgCityCode, orgCountyCode, diagnoseStartTime, diagnoseEndTime, questionnaireName} = searchContent
    try {
      const res = await exportRecordQueryPage({
        orgName,
        source,
        areaLevel,
        orgProvinceCode, 
        orgCityCode, 
        orgCountyCode, 
        diagnoseStartTime, 
        diagnoseEndTime, 
        questionnaireName,
        pageIndex: 1,
        pageSize: 1000
      });
      if (res?.data?.size == 51) return message.warning('操作太过频繁，请稍后再试')
      const content = res?.data;
      const blob  = new Blob([content], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});
      const fileName = `诊断记录报表-${curTime}.xlsx`
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url;
      link.setAttribute('download', fileName)
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="diagnose-service-package">
      <h3 className="title">诊断记录报表</h3>
      {useSearchNode()}
      <div className="content-wrapper">
        <div className="container-table-header">
          <h3>诊断记录列表（共{pageInfo.totalCount}条）</h3>
          <Access accessible={access['PX_DM_JLBB']}>
            <Button type='primary' icon={<UploadOutlined />} onClick={exportList}>
              导出数据
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
          </div>
        )}
      </div>
    </div>
  );
};
