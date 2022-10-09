import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message as antdMessage,
  Space,
  Popconfirm,
  Radio,
  Checkbox,
  Modal,
  InputNumber
} from 'antd';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import SelfTable from '@/components/self_table';
import { history } from 'umi';
import { getExpertResourcePage, updateKeyword, getExportSort } from '@/services/expert_manage/expert-resource';
import type ExpertResource from '@/types/expert_manage/expert-resource';
import { getAreaTree } from '@/services/area';
import { getDictionay } from '@/services/common';
import { routeName } from '../../../../../config/routes';
import { signCommissioner } from '@/services/service-commissioner-verify';
import { 
  getKeywords, //关键词枚举 
} from '@/services/creative-demand';
import { UploadOutlined } from '@ant-design/icons';
import { expertExport } from '@/services/export';
import SelfSelect from '@/components/self_select';
const sc = scopedClasses('user-config-logout-verify');

export default () => {
  const [dataSource, setDataSource] = useState<ExpertResource.Content[]>([]);
  const [searchContent, setSearChContent] = useState<ExpertResource.SearchBody>({});
  const [selectTypes, setSelectTypes] = useState<any>([]);
  const [keywords, setKeywords] = useState<any[]>([]);// 关键词数据
  const [weightVisible, setWeightVistble] = useState(false);
  const [currentId, setCurrentId] = useState<Number>(0);
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
  const [areaOptions, setAreaOptions] = useState<any>([]);

  const [expertTypes, setExpertType] = useState<any>([]);

  const [serviceTypes, setServiceType] = useState<any>([]);

  const [isCommissioner, setIsCommissioner] = useState<boolean>(false);

  useEffect(() => {
    try {
      getAreaTree({}).then((data) => {
        setAreaOptions(data?.children || []);
      });
      getDictionay('EXPERT_DICT').then((data) => {
        setExpertType(data.result || []);
      });
      getDictionay('COMMISSIONER_SERVICE_TYPE').then((data) => {
        setServiceType(data.result || []);
      });
      getKeywords().then(res => {
        setKeywords(res.result || [])
      })
    } catch (error) {
      antdMessage.error('数据初始化错误');
    }
  }, []);

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getExpertResourcePage({
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

  const [signForm] = Form.useForm();

  // 标记
  const sign = async (record: any) => {
    const tooltipMessage = '标记';
    try {
      const values = {
        commissioner: isCommissioner,
        ids: isCommissioner ? selectTypes : undefined,
      };
      const markResult = await signCommissioner({ expertShowId: record.id, ...values });
      if (markResult.code === 0) {
        antdMessage.success(`${tooltipMessage}成功`);
        signForm.resetFields();
        getPage();
      } else {
        throw new Error(markResult.message);
      }
    } catch (error) {
      antdMessage.error(`${tooltipMessage}失败，原因:{${error}}`);
    }
  };


  const formLayout2 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  };
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
          antdMessage.success(`所属行业编辑成功！`);
          setModalVisible(false);
          editForm.resetFields();
          getPage();
        } else {
          antdMessage.error(`所属行业编辑失败，原因:{${submitRes.message}}`);
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
        title={'所属行业编辑'}
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
          <Form.Item name="keyword" label="所属行业" rules={[{required: true}]} extra="多选（最多三个）">
            <Checkbox.Group>
              <Row>
                {keywords?.map((i) => {
                  return i.enumName == 'OTHER' ? (
                    <Col span={6} key={i.enumName}>
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

  const [weightForm] = Form.useForm();
  const handleWeightOk = async () => {
    try {
      weightForm
      .validateFields()
      .then(async (value)=>{
        const res = await getExportSort({
          id: String(currentId),
          sort: value.sort
        })
        if (res?.code === 0) {
          antdMessage.success(`权重设置成功！`);
          setWeightVistble(false);
          weightForm.resetFields();
          // 重新获取列表
          const search = searchForm.getFieldsValue();
          setSearChContent(search);
        } else {
          antdMessage.error(`权重设置失败，原因:{${res?.message}}`);
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const weightModal = (): React.ReactNode => {
    return (
      <Modal
        title="请输入权重"
        width="780px"
        visible={weightVisible}
        onOk={handleWeightOk}
        onCancel={()=>{
          setWeightVistble(false)
        }}
      >
        <Form form={weightForm}>
          <Form.Item name="sort" rules={[{required: true,message: '必填',}]}>
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder='请输入权重'                 
              min={1}
              step={0.001}
            />
          </Form.Item>
        </Form>
      </Modal>
    )
  }  

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
    },
    {
      title: '专家姓名',
      dataIndex: 'expertName',
      width: 150,
      isEllipsis: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '专家类型',
      dataIndex: 'typeNames',
      isEllipsis: true,
      render: (_: string[]) => (_ || []).join(','),
      width: 400,
    },
    {
      title: '所属行业',
      dataIndex: 'keywordShow',
      isEllipsis: true,
      render: (_: string[]) => (_ || []).join(','),
      width: 150,
    },
    {
      title: '所属区域',
      dataIndex: 'areaName',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '服务专员',
      dataIndex: 'commissioner',
      render: (_: boolean) => (_ ? '是' : '否'),
      width: 80,
    },
    {
      title: '操作',
      width: 400,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Space size={1}>
              <Button
                type="link"
                onClick={() => {
                  history.push(`${routeName.EXPERT_MANAGE_DETAIL}?id=${record.id}`);
                }}
              >
                详情
              </Button>
              <Button type="link" onClick={() => {
                setWeightVistble(true);
                setCurrentId(record.id)
                    // 重置 keyword: record.keyword  这里需要把权重选上
                weightForm.setFieldsValue({sort: record.sort || [],})
              }}>权重</Button>
              <Popconfirm
                icon={<span style={{ fontSize: 18 }}>服务专员标记</span>}
                title={
                  <Form layout="vertical" style={{ padding: 10, width: 400 }}>
                    <Form.Item label="服务专员">
                      <Radio.Group
                        value={isCommissioner}
                        onChange={(e) => {
                          setIsCommissioner(e.target.value);
                        }}
                      >
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {isCommissioner && (
                      <Form.Item label="请选择服务类型">
                        <SelfSelect
                          dictionary={serviceTypes}
                          fieldNames={{
                            label: 'name',
                            value: 'id',
                          }}
                          value={selectTypes}
                          onChange={(values) => {
                            setSelectTypes(values);
                          }}
                        />
                      </Form.Item>
                    )}
                  </Form>
                }
                okButtonProps={{
                  disabled: isCommissioner && selectTypes?.length === 0,
                }}
                okText="确定"
                cancelText="取消"
                onConfirm={() => sign(record)}
                onCancel={() => {
                  // signForm.resetFields();
                }}
              >
                <Button
                  type="link"
                  onClick={() => {
                    setIsCommissioner(!!record.commissioner);
                    setSelectTypes(record.serviceTypeIds || []);
                    // signForm.setFieldsValue({
                    //   ids: record.serviceTypeIds || [],
                    //   commissioner: record.commissioner,
                    // });
                  }}
                >
                  {' '}
                  服务专员标记
                </Button>
              </Popconfirm>
              <Button type="link" onClick={() => {
                setModalVisible(true);
                setCurrentId(record.id)
                editForm.setFieldsValue({keyword: record.keyword || [], keywordOther: record.keywordOther || ''})
              }}>
                所属行业编辑
              </Button>
            </Space>
          </div>
        );
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
              <Form.Item name="expertName" label="专家姓名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="expertType" label="专家类型">
                <Select placeholder="请选择" allowClear>
                  {(expertTypes || []).map((item: any) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
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
            <Col span={8}>
              <Form.Item name="commissioner" label="服务专员">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={false}>否</Select.Option>
                  <Select.Option value={true}>是</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary1"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
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

  const exportList = () => {
    console.log('专家资源', searchContent)
    const { expertName, expertType, areaCode, commissioner } = searchContent;
    expertExport({
      expertName,
      expertType,
      areaCode,
      commissioner,
    })
  }
  return (
    <>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>专家列表(共{pageInfo.totalCount || 0}个)</span>
          <Button
            icon={<UploadOutlined />}
            onClick={exportList}
          >
            导出
          </Button>
        </div>
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
      {useModal()}
      {weightModal()}
    </>
  );
};
