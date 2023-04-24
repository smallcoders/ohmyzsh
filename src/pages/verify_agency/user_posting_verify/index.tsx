import {
  Button,
  Input,
  Form,
  message,
  Space,
  Tooltip,
  Popconfirm,
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type SolutionTypes from '@/types/solution';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../config/routes';
import { httpEnterpriseList, httpEnterpriseAudit, httpEnterprisePublishRecommend } from '@/services/user-posting';

const sc = scopedClasses('verify-user-posting');

// 审核状态
const auditStatus = {
  '0': '草稿',
  '1': '待审核',
  '2': '审核通过',
  '3': '审核不通过',
};
// 内容类型
const contentType = {
  '1': '供需简讯',
  '2': '企业动态',
  '3': '经验分享',
  '4': '供需简讯',
  '5': '供需简讯',
}
// export let visible = false; // 用于控制气泡

export default () => {
  const formLayout = {
    // labelCol: { span: 2 },
    wrapperCol: { span: 24 },
  };
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const access = useAccess();
  const [total, setTotal] = useState<number>(0);
  // pro需要用到的index
  const paginationRef = useRef<any>();
  const actionRef = useRef<ActionType>();

  // 审核
  const audit = async (id: string, state: any) => {
    if (state === 1) {
      // 多一个推荐
      try {
        const res = await httpEnterprisePublishRecommend({
          id: Number(id),
          recommend: true
        })
        if (res?.code === 0) {
          message.success('推荐成功');
        } else {
          message.success(`推荐失败: ${res?.message}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    try {
      const res = await httpEnterpriseAudit({
        id: Number(id),
        auditStatus: 2
      });
      if (res.code === 0) {
        message.success('审核通过');
        actionRef.current?.reload(); // 让table// 刷新
      } else {
        message.error(`失败，原因:{${res?.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 不通过
  const noPass = async (id: string, state: any) => {
    return new Promise((resolve, reject) => {
      form.validateFields().then(async (values: any) => {
        console.log('搜集的表单', values)
        try {
          const res = await httpEnterpriseAudit({
            id: Number(id),
            auditStatus: 3,
            auditReason: values?.auditReason
          });
          if (res.code === 0) {
            message.success('审核不通过完成');
            actionRef.current?.reload(); // 让table// 刷新
            resolve('成功');
          } else {
            message.error(`失败，原因:{${res.message}}`);
            resolve('失败');
          }
        } catch (error) {
          console.log(error);
          resolve('失败');
        }
      }).catch(() => {
        reject('失败')
      })
    });
  };


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
      valueType: 'text', // 筛选的类别
      // hideInSearch: true, // 本次 隐藏search
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
      valueType: 'select', // 筛选的类别
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
        return _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      align: 'center',
      // valueType: 'textarea', // 筛选的类别
      valueType: 'select', // 筛选的类别
      valueEnum: {
        1: {
          text: '待审核',
        },
        2: {
          text: '审核通过'
        },
        3: {
          text: '审核不通过'
        },
      },
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(auditStatus, _) ? auditStatus[_] : '--'}
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
            <Access accessible={access['PQ_AT_YHFBSH']}>
              <Button
                key="1"
                size="small"
                type="link"
                onClick={() => {
                  history.push(`${routeName.VERIFY_AGENCY_USER_POSTING_VERIFY_DETAIL}?id=${record?.id}`);
                }}
              >
                详情
              </Button>
            </Access>
            <Access accessible={access['P_AT_YHFBSH']}>
              {
                record?.auditStatus === 1 &&
                <Popconfirm
                  icon={null}
                  title={
                    <div className={sc('container-table-popconfirm')}>
                      <div className={sc('container-table-popconfirm-title')}>确定审核通过？</div>
                      <div className={sc('container-table-popconfirm-content')}>点击“通过并推荐”可将该内容上架到“推荐”页面</div>
                    </div>
                  }
                  okText="通过并推荐"
                  cancelText="通过"
                  // 根据接口改
                  onConfirm={() => audit(record?.id.toString(), 1)}
                  onCancel={() => audit(record?.id.toString(), 2)}
                >
                  <a href="#">通过</a>
                </Popconfirm>
              }
            </Access>
            <Access accessible={access['P_AT_YHFBSH']}>
              {
                record?.auditStatus === 1 &&
                <Popconfirm
                  icon={null}
                  // visible={visible}
                  title={
                    <React.Fragment>
                      <div style={{fontSize: '16px', fontWeight: 600}}>不通过</div>
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
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => noPass(record?.id.toString(), record?.state)}
                  // onCancel={() => visible= false}
                >
                  <a href="#" onClick={() => form.resetFields()}>不通过</a>
                </Popconfirm>
              }
            </Access>
          </Space>
        );
      },
    },
  ];

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
          optionRender: (searchConfig, formProps, dom) => {
            return [dom[1], dom[0]];
          },
        }}
        request={async (pagination) => {
          console.log('查询pagination', pagination);
          // 搜集的发布时间范围 是一个数组 publishTime
          const result = await httpEnterpriseList({
            ...pagination,
            publishStartTime: pagination?.publishTime 
              ? pagination?.publishTime[0]
              : undefined,
            publishEndTime: pagination?.publishTime 
              ? pagination?.publishTime[1]
              : undefined,
            queryType: 1,
            auditStatus: pagination?.auditStatus 
              ? [Number(pagination?.auditStatus)]
              : [1,2,3]
          });
          paginationRef.current = pagination;
          setTotal(result.total);
          return result;
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};
