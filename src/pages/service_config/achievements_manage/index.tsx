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
  Checkbox
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import News from '@/types/service-config-news';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { history } from 'umi';
import { getCreativePage } from '@/services/kc-verify';
import { getDictionaryTree } from '@/services/dictionary';
import { handleAudit } from '@/services/audit';
const sc = scopedClasses('service-config-app-news');
const stateObj = {
  AUDITING: '待审核',
  AUDIT_PASSED: '已通过',
  AUDIT_REJECTED: '已拒绝',
};
export default () => {
  const [dataSource, setDataSource] = useState<News.Content[]>([]);
  const [refuseContent, setRefuseContent] = useState<string>('');
  const [types, setTypes] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<{
    name?: string; // 标题
    startDateTime?: string; // 提交开始时间
    auditState?: number; // 状态： 3:通过 4:拒绝
    userName?: string; // 用户名
    endDateTime?: string; // 提交结束时间
    typeId?: number; // 行业类型id 三级类型
  }>({});

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

  // const [form] = Form.useForm();

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getCreativePage({
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

  const prepare = async () => {
    try {
      const res = await getDictionaryTree('CREATIVE_TYPE');
      setTypes(res);
    } catch (error) {
      message.error('获取行业类型失败');
    }
  };
  useEffect(() => {
    prepare();
  }, []);

  const editState = async (record: any, { ...rest }) => {
    try {
      const tooltipMessage = rest.result ? '审核通过' : '审核拒绝';
      const updateStateResult = await handleAudit({
        auditId: record.auditId,
        ...rest,
      });
      if (updateStateResult.code === 0) {
        message.success(`${tooltipMessage}成功`);
        getPage();
        if (!rest.result) setRefuseContent('');
      } else {
        message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: News.Content, index: number) =>
        _record.state === 2 ? '' : pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '成果名称',
      dataIndex: 'name',
      render: (_: string, _record: any) => (
        <a
          href="#!"
          onClick={() => {
            history.push(`/service-config/achievements-manage/detail?id=${_record.id}`);
          }}
        >
          {_}
        </a>
      ),
      width: 300,
    },
    {
      title: '应用行业',
      dataIndex: 'type',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '关键词',
      dataIndex: 'userName',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '发布时间',
      dataIndex: 'submitDateTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'auditState',
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
      width: 220,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <Space>
            <Button type="link" onClick={() => editState(record, { result: true })}>
              关键词编辑
            </Button>
            <Popconfirm
              icon={null}
              title={
                '确定已完成转化吗？'
              }
              okText="确定"
              cancelText="取消"
              onConfirm={() => editState(record, { result: false, reason: refuseContent })}
            >
              <Button type="link">完成转化</Button>
            </Popconfirm>
          </Space>
        )
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
            <Col span={8}>
              <Form.Item name="name" label="成果名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="应用行业">
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
            {/* <Col span={8}>
              <Form.Item name="userName" label="用户名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col> */}
            <Col span={8}>
              <Form.Item name="auditState" label="状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'AUDITING'}>待审核</Select.Option>
                  <Select.Option value={'AUDIT_PASSED'}>通过</Select.Option>
                  <Select.Option value={'AUDIT_REJECTED'}>拒绝</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="time" label="发布时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary1"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.startDateTime = moment(search.time[0]).format('YYYY-MM-DDTHH:mm:ss');
                    search.endDateTime = moment(search.time[1]).format('YYYY-MM-DDTHH:mm:ss');
                  }
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary2"
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


  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const [editForm] = Form.useForm<{ keywords: any; other: string }>();
  const newKeywords = Form.useWatch('keywords', editForm);
  const handleOk = async () => {
    editForm
      .validateFields()
      .then(async (value) => {
        console.log(value, 111);
        // setLoading(true);
        // const tooltipMessage = '提交';
        // const submitRes = await handleAudit({
        //   auditId: auditId,
        //   ...value,
        // });
        // if (submitRes.code === 0) {
        //   message.success(`${tooltipMessage}成功`);
        //   form.resetFields();
        //   refresh();
        //   onBack();
        // } else {
        //   message.error(`${tooltipMessage}失败，原因:{${submitRes.message}}`);
        // }
        // setLoading(false);
      })
      .catch(() => {});
    };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={'关键词编辑'}
        width="780px"
        visible={modalVisible}
        // okButtonProps={{ loading: addOrUpdateLoading }}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="link"
            type="primary"
            onClick={handleOk}
          >
            确定
          </Button>,
        ]}
      >
        <Form {...formLayout2} form={editForm}>
          <Form.Item name="keywords" label="关键词" rules={[{required: true}]}>
            <Checkbox.Group>
              <Row>
                <Col span={6}>
                  <Checkbox value="A" style={{ lineHeight: '32px' }}>
                    新一代信息技术
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="B" style={{ lineHeight: '32px' }}>
                    人工智能
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="C" style={{ lineHeight: '32px' }}>
                    新材料
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="D" style={{ lineHeight: '32px' }}>
                    新能源和节能环保
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="E" style={{ lineHeight: '32px' }}>
                    智能汽车
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="F" style={{ lineHeight: '32px' }}>
                    高端装备制造
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="G" style={{ lineHeight: '32px' }}>
                    智能家电
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="H" style={{ lineHeight: '32px' }}>
                    生命健康
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="I" style={{ lineHeight: '32px' }}>
                    绿色食品
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="J" style={{ lineHeight: '32px' }}>
                    数字创意
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="K" style={{ lineHeight: '32px' }}>
                    其他 
                  </Checkbox>
                  {newKeywords && (newKeywords.indexOf('K') > -1) && (
                    <Form.Item name="other" label="">
                      <Input placeholder='请输入'/>
                    </Form.Item>
                  )}
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          {/* <span>选中的关键词：{newKeywords} {newKeywords && 'K' in newKeywords}</span> */}
        </Form>
      </Modal>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>科技成果列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
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
    </PageContainer>
  );
};
