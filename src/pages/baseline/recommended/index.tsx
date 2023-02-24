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
  Tag,
  Popconfirm
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState, useRef} from 'react';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { routeName } from '../../../../config/routes';
import { Access, useAccess } from 'umi';
import { isEmpty } from 'lodash';
import useLimit from '@/hooks/useLimit'
import {
  recommendForUserPage,
  addRecommendForUserPage,
  editRecommendForUserPage,
  getArticleTags
} from '@/services/baseline';
import ContentSelect from './contentSelect/index'
const sc = scopedClasses('recommends-manage-creative-need');
let  isEdit = false

function labelsDiffFormat(labels: any) {
  try {
    if (typeof labels?.[0] === 'object' ) {
      return labels.map((item: any) => item.id)
     }
     return labels
  } catch (error) {
    return []
  }
}

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [labels, setLabels] = useState([])
  const [contentModalVisible, setContentModalVisible] = useState(false)
  const [currentSelect, setCurrentSelect] = useState<any>({})
  const weightRef = useRef()



  const [searchContent, setSearChContent] = useState({
    title: '',
    enable: undefined
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

  const [editForm] = Form.useForm();

  const handleOk = async () => {
    const currentVal = await editForm.validateFields()

    console.log(currentSelect, currentVal)
    console.log('isEdit =>', isEdit)
    if (isEdit) {
      editRecommendForUserPage({
        uuid: currentSelect.uuid,
        id: currentSelect.id,
        weight: +currentVal.weight,
        labelIds: labelsDiffFormat(currentVal.labels),
        enable: 1
      }).then(({ code, message: msg }) => {
        if (code === 0) {
          message.success('上架成功')
          setModalVisible(false)
          getPage()
        }
        if (code === 1403) {
          message.error(msg)
        }
      }).catch((error) => {
        console.log('error =>', error)
      })
      return
    }
    addRecommendForUserPage({
      uuid: currentSelect.uuid,
      industrialArticleId: currentSelect.industrialArticleId || currentSelect.id,
      weight: +(currentVal.weight ?? 0),
      labelIds: labelsDiffFormat(currentVal.labels),
      enable: 1
    }).then(({ code, message: msg }) => {
      if (code === 0) {
        message.success('上架成功')
        setModalVisible(false)
        getPage()
      }
      if (code === 1403) {
        message.error(msg)
      }
    }).catch((error) => {
      console.log('error =>', error)
    })
  }

  const handleSave = async () => {
    const currentVal = await editForm.validateFields()
    console.log('currentContent =>', currentSelect)
    if (isEdit) {
      editRecommendForUserPage({
        uuid: currentSelect.uuid,
        id: currentSelect.id,
        weight: +currentVal.weight,
        labelIds: labelsDiffFormat(currentVal.labels),
        enable: 0
      }).then(({ code, message: msg }) => {
        if (code === 0) {
          message.success('保存成功')
          setModalVisible(false)
          getPage()
        }
        if (code === 1403) {
          message.error(msg)
        }
      }).catch((error) => {
        console.log('error =>', error)
      })
      return
    }
    addRecommendForUserPage({
      uuid: currentSelect.uuid,
      weight: +currentVal.weight,
      labelIds: labelsDiffFormat(currentVal.labels),
      industrialArticleId: isEdit ? currentSelect.industrialArticleId : currentSelect.id,
      enable: 0
    }).then(({ code, message: msg }) => {
      if (code === 0) {
        message.success('保存成功')
        setModalVisible(false)
        getPage()
      }
      if (code === 1403) {
        message.error(msg)
      }
    }).catch((error) => {
      console.log('error =>', error)
    })
  }

  const handleSelect = () => {
    setContentModalVisible(true)
    // setCurrentSelect()
  }

  const handleCancel = () => {
    setModalVisible(false)
  };

  // 上下架
  const editState = async (e: any, updatedState: number) => {
    try {
      const { id, weight, labels: labelIds } = e
      console.log('e =>', e)
      const tooltipMessage = updatedState === 0 ? '下架' : '上架';
      const updateStateResult = await editRecommendForUserPage({  id, weight, labelIds, enable: updatedState });
      if (updateStateResult.code === 0) {
        message.success(`${tooltipMessage}成功`);
        getPage();
      } else {
        message.error(`${tooltipMessage}失败，原因:{${updateStateResult.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('currentSelect?.weight => ', Number(currentSelect.weight), currentSelect.weight)
    editForm.setFieldsValue({
      title: currentSelect?.title,
      weight: currentSelect?.weight,
      labels: labelsDiffFormat(currentSelect?.labels)
    })
  }, [currentSelect])

  useEffect(() => {
    console.log('currentSelect =>', currentSelect)
    if (isEmpty(currentSelect)) return
    editForm.setFieldsValue({
      title: currentSelect?.title,
      weight: currentSelect?.weight,
      labels: labelsDiffFormat(currentSelect?.labels)
    })
  }, [currentSelect])




  const useModal = (): React.ReactNode => {
    if (labels.length === 0) {
      getArticleTags().then((res) => {
        console.log('res =>', res)
        setLabels(res.result)
      })
    }


    return (
      <Modal
        title={ isEdit ? '编辑推荐' : '新增推荐'}
        width="600px"
        visible={modalVisible}
        maskClosable={false}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="save" onClick={handleSave}>
            保存
          </Button>,
          <Button key="link" type="primary" onClick={handleOk}>
            上架
          </Button>
        ]}
      >
        <Form {...formLayout2} form={editForm}>
          <Form.Item
            name="title"
            label="内容"
            rules={[{ required: true, message: '请选择内容' }]}
          >
           <Input readOnly onClick={() => handleSelect()} />
          </Form.Item>
          <Form.Item
            name="weight"
            label="权重"
            rules={[{ required: true }]}
          >
            <Input ref={weightRef} style={{ width: '100%' }} placeholder='请输入1～100的整数，数字越大排名越小' onInput={useLimit(weightRef)} />
          </Form.Item>
          <Form.Item
            name="labels"
            label="推荐范围"
            rules={[{ required: true, message: '请选择推荐范围' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择"
              allowClear
              options={labels}
              fieldNames={{
                label: 'labelName',
                value: 'id'
              }}/>
          </Form.Item>
        </Form>
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
      title: '标题',
      dataIndex: 'title',
      width: 300,
    },
    {
      title: '发布状态',
      dataIndex: 'enable',
      render: (_: number) => _ ? '上架' : '下架',
      width: 100,
    },
    {
      title: '推荐范围',
      dataIndex: 'list',
      render: (_: string[]) => _?.length === 0 ? '/' :  _?.map((item: any) => <Tag key={item.id}>{item.labelName}</Tag>),
      isEllipsis: true,
      width: 280,
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
      width: 150
    },
    {
      title: '操作人',
      dataIndex: 'userName',
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
        return (

            <Space wrap>

              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  window.open(routeName.BASELINE_RECOMMENDED_MANAGE_DETAIL + `?id=${record.id}&industrialArticleId=${record.industrialArticleId}`);
                }}
              >
                详情
              </Button>

              <Access accessible={access['PU_BLM_TJWGL']}>
                { !record.enable ? <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => {
                      isEdit = true
                      setModalVisible(true)
                      // editForm.resetFields()
                        setCurrentSelect(record)
                  }}
                >
                  编辑
                </Button> : null}
              </Access>


              {record.enable ? (
              <Popconfirm
                title="确定下架么？"
                okText="下架"
                cancelText="取消"
                onConfirm={() => editState(record as any, 0)}
              >
                <Button type="link"
                  style={{ padding: 0 }}
                >下架</Button>
              </Popconfirm>
            )
            : (
              <Popconfirm
                title="确定上架么？"
                okText="上架"
                cancelText="取消"
                onConfirm={() => editState(record as any, 1)}
              >
                <Button type="link"
                  style={{ padding: 0 }}
                >上架</Button>
              </Popconfirm>
            )}
            </Space>
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
              <Form.Item name="title" label="内容标题">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="enable" label="发布状态">
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
          <Access accessible={access['PA_BLM_TJWGL']}>
            <Button type="primary" onClick={() => { isEdit = false; setModalVisible(true); setCurrentSelect({}); editForm.resetFields() }}>
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
      <ContentSelect visible={contentModalVisible} setContentModalVisible={setContentModalVisible} setCurrentSelect={setCurrentSelect} currentSelect={currentSelect} />
    </PageContainer>
  );
};
