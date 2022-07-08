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
import moment from 'moment';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { history } from 'umi';
import { 
  getCreativePage,//分页数据
  getKeywords, //关键词枚举 
  getCreativeTypes,// 应用行业
  updateKeyword, // 关键词编辑
  updateConversion // 完成转化
} from '@/services/creative-demand';
import Common from '@/types/common';
import NeedVerify from '@/types/user-config-need-verify';
// import { getDictionaryTree } from '@/services/dictionary';
const sc = scopedClasses('service-config-app-news');
const stateObj = {
  NOT_CONNECT: '未对接',
  CONNECTING: '对接中',
  CONVERTED: '已转化',
  RESOLVED: '已解决'
};
export default () => {
  const [dataSource, setDataSource] = useState<NeedVerify.Content[]>([]);
  const [refuseContent, setRefuseContent] = useState<string>('');
  const [types, setTypes] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);// 关键词数据
  const [searchContent, setSearChContent] = useState<{
    name?: string; // 标题
    createTimeStart?: string; // 提交开始时间
    state?: number; // 状态： 3:通过 4:拒绝
    userName?: string; // 用户名
    createTimeEnd?: string; // 提交结束时间
    typeId?: number; // 行业类型id 三级类型
  }>({});

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
      const res = await Promise.all([
        getKeywords(),
        getCreativeTypes()
      ]);
      setKeywords(res[0].result || [])
      setTypes(res[1].result || []);
    } catch (error) {
      message.error('获取行业类型失败');
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
        console.log(value)
        // setLoading(true);
        const submitRes = await updateKeyword({
          id: currentId,
          ...value,
        });
        if (submitRes.code === 0) {
          message.success(`关键词编辑成功！`);
          setModalVisible(false);
          editForm.resetFields();
          getPage();
        } else {
          message.error(`关键词编辑失败，原因:{${submitRes.message}}`);
        }
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
          <Form.Item name="keyword" label="关键词" rules={[{required: true}]} extra="多选（最多三个）">
            <Checkbox.Group>
              <Row>
                {keywords?.map((i) => {
                  return i.enumName == 'OTHER' ? (
                    <Col span={6}>
                      <Checkbox value={i.enumName} style={{ lineHeight: '32px' }} disabled={newKeywords&&newKeywords.length==3&&(!newKeywords.includes(i.enumName))}>
                        {i.name}
                      </Checkbox>
                      {newKeywords && (newKeywords.indexOf('OTHER') > -1) && (
                        <Form.Item name="keywordOther" label="">
                          <Input placeholder='请输入' maxLength={10}/>
                        </Form.Item>
                      )}
                    </Col>
                  ) : (
                    <Col span={6}>
                      <Checkbox value={i.enumName} style={{ lineHeight: '32px' }} disabled={newKeywords&&newKeywords.length==3&&(!newKeywords.includes(i.enumName))}>
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
        message.success(`操作成功`);
        getPage();
      } else {
        message.error(`成功失败，原因:{${updateStateResult.message}}`);
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
      render: (_: any, _record: NeedVerify.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      render: (_: string, _record: any) => (
        <a
          href="#!"
          onClick={() => {
            history.push(`/service-config/creative-need-manage/detail?id=${_record.id}`);
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
      title: '关键词',
      dataIndex: 'keywordShow',
      render: (_: string[]) => (_ || []).join(',') || '/',
      isEllipsis: true,
      width: 300,
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
      width: 220,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return record.state == 'RESOLVED' ? ('/') : (
          <Space>
            <Button type="link" onClick={() => {
              setModalVisible(true);
              setCurrentId(record.id)
              editForm.setFieldsValue({keyword: record.keyword || [], keywordOther: record.keywordOther || ''})
            }}>
              关键词编辑
            </Button>
            <Popconfirm
              icon={null}
              title={
                '确定该需求已解决？'
              }
              okText="确定"
              cancelText="取消"
              onConfirm={() => editState(record.id)}
            >
              <Button type="link">已解决</Button>
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
              <Form.Item name="state" label="状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'NOT_CONNECT'}>未对接</Select.Option>
                  <Select.Option value={'CONNECTING'}>对接中</Select.Option>
                  <Select.Option value={'CONVERTED'}>已转化</Select.Option>
                  <Select.Option value={'RESOLVED'}>已解决</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="time" label="提交时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
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
                key="primary"
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

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>创新需求列表(共{pageInfo.totalCount || 0}个)</span>
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
