import {
  Button,
  message,
  Space,
  Popconfirm,
  Tooltip,
  Form,
  Input,
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type SolutionTypes from '@/types/solution';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less'
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../config/routes';
import { httpEnterpriseList, httpEnterpriseAudit, httpEnterprisePublishDown, httpEnterprisePublishRecommend } from '@/services/user-posting';
import dayjs from 'dayjs';

const sc = scopedClasses('baseline-user-posting');

// 上下架状态
const stateEnable = {
  '0': '未上架',
  '1': '已上架',
}
// 推荐状态
const recommendStatus = {
  'true': '已推荐',
  'false': '未推荐',
}
// 内容类型
const contentType = {
  '1': '供需简讯',
  '2': '企业动态',
  '3': '经验分享',
  '4': '供需简讯',
  '5': '供需简讯',
}

export default () => {
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 20 },
  };
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const access = useAccess()
  const [total, setTotal] = useState<number>(0);
  // pro需要用到的index
  const paginationRef = useRef<any>();
  const actionRef = useRef<ActionType>();

  // 上/下架
  const soldOut = async (id: string,state: any) => {
    // state 0 下架 1 上架
    // 区分一下上架还是下架
    return new Promise((resolve, reject) => {
      form.validateFields().then(async (values: any) => {
        console.log('搜集的表单', values)
        try {
          const res = await httpEnterprisePublishDown({
            id: Number(id),
            status: state,
            auditReason: values?.auditReason
          })
          if (res.code === 0) {
            message.success(state === 0 ? '下架成功' : '上架成功');
            actionRef.current?.reload(); // 让table// 刷新
            resolve('成功');
          } else {
            message.error(`失败，原因:{${res.message}}`);
            reject('失败')
          }
        } catch (error) {
          console.log(error);
        }
      }).catch(() => {
        reject('失败')
      })
    })
  }

  // 推荐/取消推荐
  const recommend = async (id: string, state: any) => {
    try {
      const removeRes = await httpEnterprisePublishRecommend({
        id: Number(id),
        recommend: state
      })
      if (removeRes.code === 0) {
        message.success(`${state ? '推荐' : '取消推荐' }成功`);
        actionRef.current?.reload(); // 让table// 刷新
      } else {
        message.error(`推荐失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const columns: ProColumns<SolutionTypes.Solution>[] = [
    {
      title: '序号',
      align: 'center',
      hideInSearch: true, // 隐藏筛选
      renderText: (text: any, record: any, index: number) =>
        (paginationRef.current.current - 1) * paginationRef.current.pageSize + index + 1,
    },
    {
      title: '内容信息',
      dataIndex: 'content',
      align: 'center',
      hideInSearch: true, // 隐藏search
      renderText: (_: any, record: any) => {
        return (
          <div className={sc('container-table-content')}>
            <div className={sc('container-table-content-value')}>
              {_ || '--'}
            </div>
            {
              record?.riskInfo && 
              <Tooltip title={record?.riskInfo}>
                <div className={sc('container-table-content-risky')}>
                  风险
                </div>
              </Tooltip>
            }
          </div>
        )
      }
    },
    {
      title: '内容标题',
      dataIndex: 'title',
      align: 'center',
      // valueType: 'textarea', // 筛选的类别
      valueType: 'text', // 筛选的类别
      renderText: (_: any, record: any) => {
        return (
          <div className={sc('container-table-content')}>
            <div className={sc('container-table-content-value')}>
              {_ || '--'}
            </div>
            {
              record?.riskInfo && 
              <Tooltip title={record?.riskInfo}>
                <div className={sc('container-table-content-risky')}>
                  风险
                </div>
              </Tooltip>
            }
          </div>
        )
      }
    },
    {
      title: '关联话题',
      dataIndex: 'topic',
      align: 'center',
      // valueType: 'textarea', // 筛选的类别
      valueType: 'text', // 筛选的类别
    },
    {
      title: '发布时间范围',
      dataIndex: 'publishTime',
      align: 'center',
      valueType: 'dateRange', // 筛选的类别
      hideInTable: true, // 在Form中不展示此列
    },
    {
      title: '内容类型',
      dataIndex: 'contentType',
      align: 'center',
      // valueType: 'textarea', // 筛选的类别
      valueType: 'select', // 筛选的类别
      // hideInSearch: true, // 隐藏search
      valueEnum: {
        1: {
          text: '供需简讯'
        },
        2: {
          text: '企业动态'
        },
        3: {
          text: '经验分享'
        },
      },
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(contentType, _) ? contentType[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      align: 'center',
      hideInSearch: true, // 隐藏search
      renderText: (_: string) => {
        return _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--'
      },
    },
    {
      title: '上架状态',
      dataIndex: 'status',
      align: 'center',
      valueType: 'select', // 筛选的类别
      valueEnum: {
        0: '未上架',
        1: '已上架',
      },
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateEnable, _) ? stateEnable[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '推荐状态',
      dataIndex: 'recommend', // 需要更新
      align: 'center',
      valueType: 'select', // 筛选的类别
      valueEnum: {
        1: '已推荐',
        2: '未推荐'
      },
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {/* 这里 true false */}
            {Object.prototype.hasOwnProperty.call(recommendStatus, _) ? recommendStatus[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '操作',
      hideInSearch: true, // 隐藏筛选
      align: 'center',
      width: 300,
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <Access accessible={access['PQ_BLM_YHFBGL']}>
              <Button
                key="1"
                size="small"
                type="link"
                onClick={() => {
                  window.open(`${routeName.BASELINE_USER_POSTING_MANAGE_DETAIL}?id=${record?.id}`)
                }}
              >
                详情
              </Button>
            </Access>
            <Access accessible={access['P_BLM_YHFBGL']}>
              {
                record?.recommend === true &&
                <Popconfirm
                  // icon={null}
                  title="确定将内容取消推荐？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => recommend(record?.id.toString(), false)}
                >
                  <a href="#">取消推荐</a>
                </Popconfirm>
              }
              {
                record?.recommend === false &&
                <Popconfirm
                  // icon={null}
                  title="确定将内容在推荐列表中进行展示？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => recommend(record?.id.toString(), true)}
                >
                  <a href="#">推荐</a>
                </Popconfirm>
              }
            </Access>
            <Access accessible={access['P_BLM_YHFBGL']}>
              {
                record?.status === 1 &&
                <Popconfirm
                  icon={null}
                  title={
                    <React.Fragment>
                      <div style={{fontSize: '16px', fontWeight: 600}}>下架原因</div>
                      <Form form={form} {...formLayout} validateTrigger="onBlur">
                        <Form.Item
                          name="auditReason"
                          rules={[{ required: true, message: '请填写原因' }]}
                        >
                          <TextArea placeholder='请输入原因(必填)' rows={3} maxLength={50} />
                        </Form.Item>
                      </Form>
                    </React.Fragment>
                  }
                  okText="下架"
                  cancelText="取消"
                  onConfirm={() => soldOut(record?.id.toString(), 0)}
                >
                  <a href="#" onClick={() => form.resetFields()}>下架</a>
                </Popconfirm>
              }
              {
                record?.status === 0 &&
                <Popconfirm
                  // icon={null}
                  title="确定上架么？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => soldOut(record?.id.toString(), 1)}
                >
                  <a href="#">上架</a>
                </Popconfirm>
              }
            </Access>
          </Space>
        )
      }
    }
  ]

  return (
    <PageContainer className={sc('container')}>
      <ProTable
        headerTitle={`用户发布管理列表（共${total}个）`}
        options={false}
        rowKey="id"
        actionRef={actionRef}
        search={{
          span: 8,
          labelWidth: 100,
          defaultCollapsed: false,
          collapseRender: () => false,
          optionRender: (searchConfig, formProps, dom) => {
            return[dom[1], dom[0]]
          },
        }}
        request={async (pagination) => {
          // 搜集的发布时间范围 是一个数组 publishTime
          const result = await httpEnterpriseList({
            ...pagination,
            recommendFlag: pagination?.recommend ? pagination?.recommend === '1' : undefined,
            recommend: pagination?.recommend ? undefined : undefined,

            publishStartTime: pagination?.publishTime 
              ? dayjs(pagination?.publishTime[0]).format('YYYY-MM-DD 00:00:00')
              : undefined,
            publishEndTime: pagination?.publishTime
              ? dayjs(pagination?.publishTime[1]).format('YYYY-MM-DD 23:59:59')
              : undefined,
            queryType: 2,
            auditStatus: [1,2,3],
            publishTime: undefined
          });
          paginationRef.current = pagination;
          setTotal(result.total);
          return result;
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  )
}