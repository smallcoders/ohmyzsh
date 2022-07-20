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
import type Common from '@/types/common';
import type News from '@/types/service-config-news';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { history } from 'umi';
import { 
  getCreativePage, // 分页数据
  getKeywords, // 关键词枚举 
  getCreativeTypes, // 应用行业
  updateKeyword, // 关键词编辑
  updateConversion // 完成转化
} from '@/services/achievements-manage';
const sc = scopedClasses('service-config-achievements-manage');
const stateObj = {
  NOT_CONNECT: '未对接',
  CONNECTING: '对接中',
  CONVERTED: '已转化'
};
export default () => {
  const [dataSource, setDataSource] = useState<News.Content[]>([]);
  const [types, setTypes] = useState<any[]>([]);// 应用行业数据
  const [keywords, setKeywords] = useState<any[]>([]);// 关键词数据
  const [searchContent, setSearChContent] = useState<{
    name?: string; // 标题
    startDate?: string; // 提交开始时间
    state?: string; // 状态： 3:通过 4:拒绝
    endDate?: string; // 提交结束时间
    typeId?: number; // 行业类型id 三级类型
  }>({});
  // 点击关键词编辑，记录当前编辑的id
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
      message.error('获取类型失败');
    }
  };
  useEffect(() => {
    prepare();
  }, []);

  const editState = async (id: string) => {
    try {
      const updateStateResult = await updateConversion(id);
      if (updateStateResult.code === 0) {
        message.success(`操作成功`);
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
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: News.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '成果名称',
      dataIndex: 'name',
      render: (_: string, _record: any) => (
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault(); 
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
      title: '所属行业',
      dataIndex: 'keywordShow',
      isEllipsis: true,
      render: (_: string[]) => (_ || []).join(',') || '/',
      width: 300,
    },
    {
      title: '发布时间',
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
            {Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '/'}
          </div>
        );
      },
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return record.state == 'CONVERTED' ? (<div style={{textAlign: 'center'}}>/</div>) : (
          <Space>
            <Button type="link" style={{padding: 0}} onClick={() => {
              setModalVisible(true);
              setCurrentId(record.id)
              editForm.setFieldsValue({keyword: record.keyword || [], keywordOther: record.keywordOther || ''})
            }}>
              所属行业编辑
            </Button>
            <Popconfirm
              title={
                '确定已完成转化吗？'
              }
              okText="确定"
              cancelText="取消"
              onConfirm={() => editState(record.id)}
            >
              <Button type="link" style={{padding: 0}}>完成转化</Button>
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
              <Form.Item name="typeId" label="应用行业">
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
                    search.startDate = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.endDate = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
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
        title={'所属行业编辑'}
        width="780px"
        visible={modalVisible}
        maskClosable={false}
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
          <Form.Item name="keyword" label="所属行业" rules={[{required: true}]} extra="多选（最多三个）">
            <Checkbox.Group>
              <Row>
                {keywords?.map((i) => {
                  return (
                    <React.Fragment key={i.name}>
                      <Col span={6}>
                        <Checkbox value={i.enumName} style={{ lineHeight: '32px' }} disabled={newKeywords&&newKeywords.length==3&&(!newKeywords.includes(i.enumName))}>
                          {i.name}
                        </Checkbox>
                        {i.enumName == 'OTHER' && newKeywords && (newKeywords.indexOf('OTHER') > -1) && (
                          <Form.Item name="keywordOther" label="">
                            <Input placeholder='请输入' maxLength={10}/>
                          </Form.Item>
                        )}
                      </Col>
                    </React.Fragment>
                  )
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>
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
