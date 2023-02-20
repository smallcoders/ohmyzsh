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
  InputNumber,
  Tag
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { routeName } from '../../../../config/routes';
import { Access, useAccess } from 'umi';
import {
  recommendForUserPage,
  addRecommendForUserPage,
  editRecommendForUserPage,
} from '@/services/baseline';
const sc = scopedClasses('science-technology-manage-creative-need');


export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const [searchContent, setSearChContent] = useState({

  })


    // 拿到当前角色的access权限兑现
    const access = useAccess()

  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });


  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const formLayout2 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await recommendForUserPage({
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

  const [editForm] = Form.useForm<{ keyword: any; keywordOther: string }>();

  const handleOk = () => {

  }

  const handleCancel = () => {

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
      title: '标题',
      dataIndex: 'title',
      width: 300,
    },
    {
      title: '发布状态',
      dataIndex: 'enable',
      render: (_: boolean) => _ ? '上架' : '下架',
      width: 100,
    },
    {
      title: '推荐范围',
      dataIndex: 'enable',
      render: (_: string[]) => _.map((item) => <Tag key={item}>{item}</Tag>),
      isEllipsis: true,
      width: 200,
    },
    {
      title: '权重',
      dataIndex: 'weight',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '推荐阅读量',
      dataIndex: 'readingCount',
      width: 100,
    },
    {
      title: '操作人',
      dataIndex: 'operatorUserId',
      width: 200,
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
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
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  window.open(routeName.BASELINE_TAG_MANAGE_DETAIL);
                }}
              >
                详情
              </Button>
              <Button type="link" >

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
              <Form.Item name="labelName" label="内容标题">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="areaCode" label="发布状态">
                <Select placeholder="请选择" allowClear>
                      <Select.Option key={0} value={0}>
                        下架
                      </Select.Option>
                      <Select.Option key={1} value={1}>
                        上架
                      </Select.Option>

                </Select>
              </Form.Item>
            </Col>
            <Col offset={6} span={6}>
              <div  style={{textAlign: 'right'}}>
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
                style={{ marginRight: 32 }}
                type="primary"
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  setSearChContent({});
                }}
              >
                重置
              </Button>
              </div>
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
          <Access accessible={access['P_SM_XQGL']}>
            <Button type="primary" onClick={() => { setModalVisible(true) }}>
              选择推荐内容
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
