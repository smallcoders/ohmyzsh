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
import { PlusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
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
import { getAreaTree } from '@/services/area';
import { routeName } from '../../../../config/routes';
import { addTag, deleteTag, editTag } from '@/services/baseline';
const sc = scopedClasses('science-technology-manage-creative-need');
const sourceEnum = {
  SYSTEM: '系统提取', MANUAL: '人工提取', OTHER: '其他来源'
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
  }, [])

  const [weightVisible, setWeightVistble] = useState(false);

  const [currentId, setCurrentId] = useState<string>('');

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const formLayout2 = {
    labelCol: { span: 4 },
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
        const submitRes = await (currentId ? editTag({
          id: currentId,
          ...value,
        }) : addTag({
          ...value,
        }));
        if (submitRes.code === 0) {
          message.success(`操作成功！`);
          setModalVisible(false);
          editForm.resetFields();
          getPage();
        } else {
          message.error(`操作失败，原因:{${submitRes.message}}`);
        }
      })
      .catch(() => { });
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={'新增/编辑标签'}
        width="600px"
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
            name="labelName"
            label="标签名称"
            rules={[{ required: true }]}
          >
            <Input placeholder='请输入' maxLength={10} />
          </Form.Item>
          <Form.Item
            name="weight"
            label="标签权重"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder='请输入1～100的整数，数字越大排名越小' max={100} min={1} />
          </Form.Item>
          <Form.Item
            name="isColdStart"
            label="是否兴趣标签"
            rules={[{ required: true }]}
          >
            <Select placeholder="请选择" allowClear>
              <Select.Option value={true}>是</Select.Option>
              <Select.Option value={false}>否</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const onDelete = async (id: string) => {
    try {
      const updateStateResult = await deleteTag(id);
      if (updateStateResult.code === 0) {
        message.success(`删除成功`);
        getPage();
      } else {
        message.error(`删除失败，请重试`);
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
    },
    {
      title: '标签名称',
      dataIndex: 'labelName',
      width: 300,
    },
    {
      title: '来源',
      dataIndex: 'source',
      isEllipsis: true,
      render: (_: string[]) => (_ || []).join(','),
      width: 300,
    },
    {
      title: '是否兴趣标签',
      dataIndex: 'coldStartSelect',
      render: (_: string[]) => (_ || []).join(',') || '/',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '标签权重',
      dataIndex: 'weight',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '关联内容数',
      dataIndex: 'LinkedCount',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建时间',
      dataIndex: 'state',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
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
            <Space wrap>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  window.open(routeName.BASELINE_CONTENT_MANAGE_ADDORUPDATE);
                }}
              >
                编辑
              </Button>

              <Button type="link" style={{ padding: 0 }} onClick={() => {
                Modal.confirm({
                  title: '删除标签',
                  content: '删除该标签后，与该标签绑定的关系全部解散，确定删除？',
                  onOk: () => { onDelete(record) },
                  okText: '删除'
                })
              }}>
                删除
              </Button>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  window.open(routeName.BASELINE_TAG_MANAGE_DETAIL);
                }}
              >
                详情
              </Button>
            </Space>
          </Access>
        )


      },
    },
  ].filter(p => p);

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const [searchForm] = Form.useForm();
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="labelName" label="标签名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="operatorUserName" label="操作人">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="areaCode" label="来源">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(sourceEnum).map((p) => {
                    return (
                      <Select.Option key={p[0]} value={p[0]}>
                        {p[1]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item name="weight" label="权重">
                <InputNumber placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col offset={14} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
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


  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>标签列表(共{pageInfo.totalCount || 0}条)</span>
          <Access accessible={access['P_SM_XQGL']}>
            <Button type='primary' icon={<PlusOutlined />} onClick={() => { setModalVisible(true) }}>
              新增
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
    </PageContainer>
  );
};
