import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Space,
  Popconfirm,
  TreeSelect,
  Modal,
  Checkbox,
  InputNumber,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { Access, useAccess } from 'umi';
import {
  getCreativePage, //分页数据
  getKeywords, //关键词枚举
  getCreativeTypes, // 应用行业
  updateKeyword, // 关键词编辑
  updateConversion, // 完成转化
  updateSort,
} from '@/services/creative-demand';
import type Common from '@/types/common';
import type NeedVerify from '@/types/user-config-need-verify';
import { creativeDemandExport } from '@/services/export';
import { getAreaTree } from '@/services/area';
const sc = scopedClasses('science-technology-manage-creative-need');
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
  const [types, setTypes] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]); // 关键词数据
  const [searchContent, setSearChContent] = useState<{
    name?: string; // 标题
    createTimeStart?: string; // 提交开始时间
    state?: string; // 状态
    createTimeEnd?: string; // 提交结束时间
    typeId?: number; // 行业类型id 三级类型
    industryTypeId?: string; // 所属行业
  }>({});
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

  const [weightVisible, setWeightVistble] = useState(false);

  const [currentId, setCurrentId] = useState<string>('');

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

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

  const [areaOptions, setAreaOptions] = useState<any>([]);

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await getCreativePage({
        pageIndex,
        pageSize,
        ...searchContent,
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
    try {
      const res = await Promise.all([getKeywords(), getCreativeTypes(), getAreaTree({})]);
      setKeywords(res[0].result || []);
      setTypes(res[1].result || []);
      setAreaOptions(res[2].children || []);
    } catch (error) {
      message.error('获取数据失败');
    }
  };
  useEffect(() => {
    prepare();
  }, []);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editForm] = Form.useForm<{ keyword: any; keywordOther: string }>();
  const newKeywords = Form.useWatch('keyword', editForm);
  const handleOk = async () => {
    editForm
      .validateFields()
      .then(async (value) => {
        const submitRes = await updateKeyword({
          id: currentId,
          ...value,
        });
        if (submitRes.code === 0) {
          message.success(`所属行业编辑成功！`);
          setModalVisible(false);
          editForm.resetFields();
          getPage();
        } else {
          message.error(`所属行业编辑失败，原因:{${submitRes.message}}`);
        }
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={'所属产业编辑'}
        width="780px"
        visible={modalVisible}
        maskClosable={false}
        onOk={handleOk}
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
        <Form {...formLayout2} form={editForm}>
          <Form.Item
            name="keyword"
            label="所属产业"
            rules={[{ required: true }]}
            extra="多选（最多三个）"
          >
            <Checkbox.Group>
              <Row>
                {keywords?.map((i) => {
                  return i.enumName == 'OTHER' ? (
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
                      {newKeywords && newKeywords.indexOf('OTHER') > -1 && (
                        <Form.Item name="keywordOther" label="">
                          <Input placeholder="请输入" maxLength={10} />
                        </Form.Item>
                      )}
                    </Col>
                  ) : (
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
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          {/* <span>选中的关键词：{newKeywords} {newKeywords && 'K' in newKeywords}</span> */}
        </Form>
      </Modal>
    );
  };

  const editState = async (id: string) => {
    try {
      const updateStateResult = await updateConversion(id);
      if (updateStateResult.code === 0) {
        message.success(`设置成功`);
        getPage();
      } else {
        message.error(`操作失败，请重试`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '权重',
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      render: (_: string, _record: any) => (
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            window.open(`/service-config/creative-need-manage/detail?id=${_record.id}`);
          }}
        >
          {_}
        </a>
      ),
      width: 300,
    },
    {
      title: '所属行业',
      dataIndex: 'industryTypes',
      isEllipsis: true,
      render: (_: string[]) => (_ || []).join(','),
      width: 300,
    },
    {
      title: '所属产业',
      dataIndex: 'keywordShow',
      render: (_: string[]) => (_ || []).join(',') || '/',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '需求区域',
      dataIndex: 'areaName',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '提交时间',
      dataIndex: 'updateTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
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
      title: '操作',
      width: 180,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return (
          <Access accessible={accessible}>
            {
              record.state == 'RESOLVED' ? (
                <div style={{ textAlign: 'center' }}>
                  <Button
                    type="link"
                    onClick={() => {
                      setWeightVistble(true);
                      setCurrentId(record.id);
                      weightForm.setFieldsValue({ sort: record.sort || [] });
                    }}
                  >
                    权重
                  </Button>
                </div>
              ) : (
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
                    所属产业编辑
                  </Button>
                  <Popconfirm
                    icon={null}
                    title={'确定该需求已解决？'}
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => editState(record.id)}
                  >
                    <Button type="link" style={{ padding: 0 }}>
                      已解决
                    </Button>
                  </Popconfirm>
                  <Button
                    type="link"
                    onClick={() => {
                      setWeightVistble(true);
                      setCurrentId(record.id);
                      weightForm.setFieldsValue({ sort: record.sort || [] });
                    }}
                  >
                    权重
                  </Button>
                </Space>
              )
            }
          </Access>
        )
        

      },
    },
  ];

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const [searchForm] = Form.useForm();
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="name" label="需求名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="industryTypeId" label="所属行业">
                <TreeSelect
                  showSearch
                  treeNodeFilterProp="name"
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={types}
                  placeholder="请选择"
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="areaCode" label="所属区域">
                <Select placeholder="请选择" allowClear>
                  {areaOptions?.map((item: any) => (
                    <Select.Option key={item?.code} value={Number(item?.code)}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="state" label="状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'NOT_CONNECT'}>未对接</Select.Option>
                  <Select.Option value={'CONNECTING'}>对接中</Select.Option>
                  <Select.Option value={'CONVERTED'}>已转化</Select.Option>
                  <Select.Option value={'RESOLVED'}>已解决</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="提交时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col offset={4} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.createTimeStart = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.createTimeEnd = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
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

  const [weightForm] = Form.useForm();
  const handleWeightOk = async () => {
    try {
      weightForm.validateFields().then(async (value) => {
        const res = await updateSort({
          id: currentId,
          sort: value.sort,
        });
        if (res?.code === 0) {
          message.success(`权重设置成功！`);
          setWeightVistble(false);
          weightForm.resetFields();
          // 重新获取数据
          const search = searchForm.getFieldsValue();
          setSearChContent(search);
        } else {
          message.error(`权重设置失败，原因:{${res?.message}}`);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const weightModal = (): React.ReactNode => {
    return (
      <Modal
        title="请输入权重"
        width="780px"
        visible={weightVisible}
        onOk={handleWeightOk}
        onCancel={() => {
          setWeightVistble(false);
        }}
      >
        <Form form={weightForm}>
          <Form.Item name="sort" rules={[{ required: true, message: '必填' }]}>
            <InputNumber
              style={{ width: '100%' }}
              placeholder="数字越大排名越靠前"
              min={1}
              step={0.001}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // 导出列表
  const exportList = async () => {
    const { name, createTimeStart, state, createTimeEnd, industryTypeId, areaCode } = searchContent;
    try {
      const res = await creativeDemandExport({
        name,
        createTimeStart,
        state,
        createTimeEnd,
        industryTypeId,
        areaCode,
      });
      if (res?.data.size == 51) return message.warning('操作太过频繁，请稍后再试')
      const content = res?.data;
      const blob  = new Blob([content], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});
      const fileName = '创新需求.xlsx'
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
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>创新需求列表(共{pageInfo.totalCount || 0}个)</span>
          <Access accessible={access['P_SM_XQGL']}>
            <Button icon={<UploadOutlined />} onClick={exportList}>
              导出
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
      {weightModal()}
    </PageContainer>
  );
};
