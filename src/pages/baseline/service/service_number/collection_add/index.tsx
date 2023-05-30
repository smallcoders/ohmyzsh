import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Button,
  Input,
  Form,
  Select,
  Breadcrumb,
  Radio,
  DatePicker,
  Image,
  Space,
  Popconfirm,
  Modal,
  message,
  Switch,
  Row,
  Col,
} from 'antd';
import FormEdit from '@/components/FormEdit';
import SelfTable from '@/components/self_table';
import UploadFormFile from '@/components/upload_form/upload-form-file';
// import UploadFormFile from '@/pages/page_creat_manage/edit/components/upload_form/upload-form-file'
import { useConfig } from '@/pages/page_creat_manage/edit/hooks/hooks';
import UploadFormAvatar from '@/components/upload_form/upload-form-avatar';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UploadForm from '@/components/upload_form';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../../../config/routes';
import { history, Link, useAccess, Access, Prompt } from 'umi';
import './index.less';
import ServiceItem from '../components/service-item';
import { PlusOutlined } from '@ant-design/icons';
import {
  httpServiceAccountPictureTextSubmit,
  httpServiceAccountPictureSubmit,
  httpServiceAccountTextSubmit,
  httpServiceAccountVideoSubmit,
  httpServiceAccountAudioSubmit,
  httpArticlePictureTextSave,
  httpServiceAccountPictureSave,
  httpServiceAccountTextSave,
  httpServiceAccountVideoSave,
  httpServiceAccountAudioSave,
  httpServiceAccountArticleDetail,
  httpServiceAccountOperationDetail,
} from '@/services/service-management';
import {
  queryServiceArticlePage,
  httpArticleAudit,
  httpArticleBatchAudit,
  httpGetArtcleDetailId,
} from '@/services/baseline';
import debounce from 'lodash/debounce';
import removeImg from '@/assets/banking_loan/remove.png';
import type Common from '@/types/common';
const sc = scopedClasses('service-number-collection-add');

type RouterParams = {
  appId?: string;
  type?: string;
  state?: string;
  id?: string;
  name?: string;
};
export default () => {
  const access: any = useAccess();
  // const { backid, backname } = props || {}
  /**
   * 当前的新增还是编辑
   */
  const [activeTitle, setActiveTitle] = useState<any>('新增');
  const [loading, setLoading] = useState<boolean>(false);
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  // 发布信息form
  const [formMessage] = Form.useForm();
  // 发布信息的改变
  const [formPostMessageChange, setFormPostMessageChange] = useState<boolean>(false);
  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(false);
  // 发布中
  const [isExporting, setIsExporting] = useState<boolean>(false);
  //连续阅读
  const [isHOt, setIsHot] = useState<boolean>(true);
  // 根据路由获取参数
  const {
    type,
    state = 'tuwen',
    id,
    name = '',
    backid,
    backname,
    activeTab,
  } = history.location.query as RouterParams;

  useEffect(() => {
    console.log('合集标签ADD', type, id, backid, backname)
    setActiveTitle(type === 'add' ? '新增' : '编辑');


    // 给文末连续阅读默认值
    formMessage.setFieldsValue({'文末连续阅读': true})
    // 如果是编辑
    // formMessage.setFieldsValue({'文末连续阅读': true})
    // setIsHot(false)
  },[type])

  useEffect(() => {
    if (formPostMessageChange) {
      setIsClosejumpTooltip(true);
    }
  },[formPostMessageChange])

  const onSubmit = () => {
    Promise.all([formMessage.validateFields()]).then(
      ([formMessageValues]) => {
        console.log('收集的内容信息', formMessageValues)
      }
    )
  }

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const handleAdd = () => {
    console.log('新增')
    setModalOpen(true)

  }
  const handleAddCancel = () => {
    console.log('点击了取消')
    setModalOpen(false)
  }
  const handleAddOk = () => {
    console.log('点击了确定选中的key', selectedRowKeys)
    console.log('点击了确定选中的list', selectedRow)
  }
  // 复选框的值
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const [searchForm] = Form.useForm();
  const [searchContent, setSearChContent] = useState<any>({});
  // 搜索模块
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={12}>
              <Form.Item name="title" label="标题">
                <Input placeholder="请输入" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6} offset={6}>
              <Button
                style={{ marginRight: '20px' }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  // 清空复选框
                  setSelectedRowKeys([]);
                  setSelectedRow([]);
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  // 清空复选框
                  setSelectedRowKeys([]);
                  setSelectedRow([]);
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
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const [res1] = await Promise.all([
        queryServiceArticlePage({
          pageIndex,
          pageSize,
          ...searchContent,
        }),
      ]);
      const { result, totalCount, pageTotal, code } = res1;

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
  }
  useEffect(() => {
    getPage();
  },[searchContent])

  // 用户手动选择
  const handleOnSelect = (record: React.Key[], selected: any[]) => {
    console.log('用户手动选择单个record', record)
    console.log('用户手动选择单个selected', selected)
    let keys = [...selectedRowKeys]
    let list = [...selectedRow]
    if (selected) {
      keys = [...selectedRowKeys, record?.id]
      list = [...selectedRow, record]
    } else {
      keys = selectedRowKeys.filter((item) => item !== record.id)
      list = selectedRow.filter((item) => item.id !== record.id)
    }
    setSelectedRowKeys(keys)
    setSelectedRow(list)
  }

  // 用户手动选择所有回调
  const handleOnSelectAll = (selected: any, selectedRows: any[], changeRows: any) => {
    console.log('选择全部selected', selected)
    console.log('选择全部selectedRows', selectedRows)
    console.log('选择全部changeRows', changeRows)
    if (selected) {
      const addCheckedKeys = changeRows.map((item: any) => {
        return item?.id
      })
      setSelectedRowKeys([...selectedRowKeys, ...addCheckedKeys])
      setSelectedRow([...selectedRow, ...changeRows])
    } else {
      const subCheckedKeys = selectedRowKeys.filter((id) => {
        return !changeRows.some((item: any) => {
          return item.id === id
        })
      })
      const subCheckedSelectedRow = selectedRow.filter((item) => {
        return !changeRows.some((item2: any) => {
          return item.id === item2.id
        })
      })
      setSelectedRowKeys(subCheckedKeys)
      setSelectedRow(subCheckedSelectedRow)
    }
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      align: 'center',
      width: 35,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (_: any, record: any) => (
        <div className={sc(`title`)}>
          {_ || '--'}
        </div>
      ),
      width: 200,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      render: (_: string) => {
        // const newDate = new Date()
        return (_ ? <div style={{color: moment(_).diff(new Date(), 'minute') > 0 ? 'orange' : 'black'}}>{moment(_).format('YYYY-MM-DD HH:mm:ss')}</div> : '--')
      },
      width: 130,
    },
    // access?.['PU_BLM_FWHNRGL'] && {
    {
      title: '操作',
      width: 80,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space wrap>
            <Button
              style={{ padding: 0 }}
              type="link"
              onClick={() => {
                handleDetail(record?.id.toString());
              }}
            >
              详情
            </Button>
            {record?.auditStatus == 1 && (
              <>
                <Access accessible={access['PU_BLM_FWHNRGL']}>
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    onClick={() => {
                      handleAudit(record?.id.toString(), 2);
                    }}
                  >
                    通过
                  </Button>
                </Access>
                <Access accessible={access['PU_BLM_FWHNRGL']}>
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    onClick={() => {
                      handleAudit(record?.id.toString(), 3);
                    }}
                  >
                    拒绝
                  </Button>
                </Access>
              </>
            )}
          </Space>
        );
      },
    },
  ].filter((p) => p);

  const AddModal = (
    <Modal
      width={769}
      visible={modalOpen}
      title={'文章选择'}
      onCancel={() => handleAddCancel()}
      onOk={() => handleAddOk()}
    >
      <div className={sc('container-modal')}>
        {useSearchNode()}
        <div className={sc('container-modal-count')}>已选{0}</div>
        <div className={sc('container-modal-table')}>
        <SelfTable
          loading={loading}
          bordered
          // scroll={{ x: 1580 }}
          rowSelection={
            // access?.['PU_BLM_FWHNRGL'] && {
           {
              fixed: true,
              selectedRowKeys,
              onSelectAll: handleOnSelectAll,
              onSelect: handleOnSelect,
              // getCheckboxProps: (record: any) => ({
              //   disabled: record.auditStatus !== 1
              // })
            }
          }
          rowKey={'id'}
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
      </div>
    </Modal>
  )


  return (
    <PageContainer
      header={{
        title: activeTitle,
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline/baseline-service-number">服务号管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/baseline/baseline-service-number/management?id=${backid}&name=${backname}&activeTab=${'合集标签'}`} >标签合集</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{activeTitle}</Breadcrumb.Item>
          </Breadcrumb>
        ),

      }}
      footer={
        [
          <Button disabled={isExporting} type="primary" onClick={() => onSubmit()}>
            确定
          </Button>
        ]
      }
    >
      <Prompt
        when={isClosejumpTooltip}
        message={'离开此页面，将不会保存当前编辑的内容，确认离开吗？'}
      />
      <div className={sc('container')}>
        <div className={sc('container-content')}>
          <div className={sc('container-content-title')}>内容信息</div>
          <Form
            form={formMessage}
            {...formLayout}
            validateTrigger={['onBlur']}
            onValuesChange={() => {
              setFormPostMessageChange(true);
            }}
          >
            <Form.Item
              label="合集名称" 
              name="合集名称"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <Input maxLength={20} placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              label="文末连续阅读" 
              name="文末连续阅读"
              rules={[
                {
                  required: true,
                  message: `必填`,
                },
              ]}
            >
              <Switch
                checked={isHOt}
                onChange={(e) => {
                  setIsHot(e);
                }}
              />
            </Form.Item>
          </Form>
        </div>
        <div className={sc('container-collection')}>
          <div className={sc('container-collection-title')}>合集文章</div>
          <Button style={{marginLeft: '30px'}} type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>新增</Button>
        </div>
      </div>
      {/* 新增文章选中 */}
      {AddModal}
    </PageContainer>
  )
}