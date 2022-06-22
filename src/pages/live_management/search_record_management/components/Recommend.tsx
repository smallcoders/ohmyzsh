import { DeleteOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Form,
  Modal,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Space,
  Popconfirm,
} from 'antd';
import '../index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import {
  getRecommendPage,
  addRecommend,
  changeRecommendStatus,
  // getDiagnosisInstitutions,
} from '@/services/search-record';
import moment from 'moment';
import DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import DebounceSelect from './DebounceSelect';
import { Link } from 'umi';
import { routeName } from '../../../../../config/routes';
import SelfTable from '@/components/self_table';
const sc = scopedClasses('service-config-diagnostic-tasks');
const stateObj = {
  1: '待诊断',
  2: '诊断中',
  3: '已完成',
  4: '已延期',
};
export default () => {
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DiagnosticTasks.Content[]>([]);
  const [editingItem, setEditingItem] = useState<DiagnosticTasks.Content>({});
  const [selectExperts, setSelectExperts] = useState<
    { label: string; value: string; expertPhone: string }[]
  >([]);
  const [defaultOrgs, setDefaultOrgs] = useState<{ label: string; value: string }[]>([]);
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const [searchContent] = useState<{}>({});

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const [institutions, setInstitutions] = useState<
    {
      id: string;
      name: string;
      bag: string;
    }[]
  >([]);

  const [form] = Form.useForm();

  /**
   * 获取诊断任务
   * @param pageIndex
   * @param pageSize
   */
  const getDiagnosticTasks = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getRecommendPage({
        pageIndex,
        pageSize
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

  /**
   * 副作用清除
   */
  const clearForm = () => {
    form.resetFields();
    setDefaultOrgs([]);
    setSelectExperts([]);
    setEditingItem({});
  };

  /**
   * 添加推荐
   */
  const addOrUpdate = async () => {
    const tooltipMessage = '上架推荐';
    const hide = message.loading(`正在${tooltipMessage}`);
    form
      .validateFields()
      .then(async (value) => {
        setAddOrUpdateLoading(true);
        const params = {
          ...value
        };
        const addorUpdateRes = await (addRecommend({
            ...params,
          }));
        hide();
        if (addorUpdateRes.code === 0) {
          setModalVisible(false);
          message.success(`${tooltipMessage}成功`);
          getDiagnosticTasks();
          clearForm();
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch(() => {
        hide();
      });
  };

  /**
   * 删除
   * @param id
   */
  const remove = async (id: string, status: any) => {
    try {
      const removeRes = await changeRecommendStatus({
        id: id,
        status: status
      });
      if (removeRes.code === 0) {
        message.success(`${status == 2 ? '下架' : '删除' }成功`);
        getDiagnosticTasks();
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      render: (_: any, _record: DiagnosticTasks.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '推荐内容',
      dataIndex: 'content',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '操作人',
      dataIndex: 'addedUserName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '上架时间',
      dataIndex: 'addedTime',
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 200,
      render: (_: any, record: any) => {
        return record.status == 1 ? (
          <div style={{ textAlign: 'center' }}>
            <Space size={"middle"}>
            <Popconfirm
              title="确定下架么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(record.id as string, 2)}
            >
              <a href="#">下架</a>
            </Popconfirm>
            </Space>
          </div>
        ) : (
          <div style={{ display: 'grid', justifyItems: 'center' }}>
            <span>
              {record.operateTime ? record.operateTime : '--'}
            </span>
            <span>操作人：{record.operateUserName}</span>
          </div>
        );
      },
    },
  ];

  const prepare = async () => {
    try {
      // const { result, code } = await getDiagnosisInstitutions();
      // if (code === 0) {
      //   setInstitutions(result);
      // } else {
      //   throw new Error();
      // }
    } catch (error) {
      message.error('获取初始数据失败');
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  useEffect(() => {
    getDiagnosticTasks();
  }, []);

  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={'上架推荐'}
        width="600px"
        visible={createModalVisible}
        onCancel={() => {
          clearForm();
          setModalVisible(false);
        }}
        destroyOnClose
        okButtonProps={{ loading: addOrUpdateLoading }}
        onOk={async () => {
          addOrUpdate();
        }}
      >
        <Form {...formLayout} form={form} layout="horizontal">
          <Form.Item
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            name="content"
            label="推荐内容"
          >
            <Input placeholder="请输入" maxLength={35} />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>搜索推荐列表(共{pageInfo.totalCount || 0}个)</span>
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            上架推荐
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1600 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getDiagnosticTasks,
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
    </>
  );
};
