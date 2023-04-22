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
import { routeName } from '../../../../config/routes'

const sc = scopedClasses('baseline-user-posting');

// 上下架状态
const stateEnable = {
  '1': '已上架',
  '2': '未上架',
}
// 推荐状态
const recommendStatus = {
  '1': '已推荐',
  '2': '微推荐',
}

export default () => {
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
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
    // try {
    //   const res = await cityPropaganda(id)
    //   if (res.code === 0) {
    //     message.success(state === 'SHOPPED' ? '下架成功' : '上架成功');
    //     actionRef.current?.reload(); // 让table// 刷新
    //   } else {
    //     message.error(`失败，原因:{${res.message}}`);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    // 区分一下上架还是下架
    return new Promise((resolve, reject) => {
      form.validateFields().then((values: any) => {
        console.log('搜集的表单', values)
        resolve('成功')
      }).catch(() => {
        reject('失败')
      })
    })
  }

  // 推荐/取消推荐
  const recommend = async (id: string, state: any) => {
    try {
      const removeRes = await removePropaganda(id)
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        actionRef.current?.reload(); // 让table// 刷新
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
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
      // valueType: 'textarea', // 筛选的类别
      // valueType: 'text', // 筛选的类别
      hideInSearch: true, // 隐藏search
      renderText: (_: any, record: any) => {
        return (
          <div className={sc('container-table-content')}>
            <div className={sc('container-table-content-value')}>
              {_ || '--'}
            </div>
            {
              record?.risky && 
              <Tooltip title={record?.riskyContent}>
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
              record?.risky && 
              <Tooltip title={record?.riskyContent}>
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
      dataIndex: 'type',
      align: 'center',
      // valueType: 'textarea', // 筛选的类别
      valueType: 'text', // 筛选的类别
      // hideInSearch: true, // 隐藏search
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
    // {
    //   title: '审核状态',
    //   dataIndex: 'auditStatus',
    //   align: 'center',
    //   // valueType: 'textarea', // 筛选的类别
    //   valueType: 'select', // 筛选的类别
    //   renderText: (_: string) => {
    //     return (
    //       <div className={`state${_}`}>
    //         {Object.prototype.hasOwnProperty.call(auditStatus, _) ? auditStatus[_] : '--'}
    //       </div>
    //     );
    //   },
    // },
    {
      title: '上架状态',
      dataIndex: 'enable',
      align: 'center',
      // valueType: 'textarea', // 筛选的类别
      valueType: 'select', // 筛选的类别
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {/* 这里 true false */}
            {Object.prototype.hasOwnProperty.call(stateEnable, _) ? stateEnable[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '推荐状态',
      dataIndex: 'tuijian', // 需要更新
      align: 'center',
      // valueType: 'textarea', // 筛选的类别
      valueType: 'select', // 筛选的类别
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
      render: (_,record) => {
        return (
          <Space size="middle">
            <Button
              key="1"
              size="small"
              type="link"
              onClick={() => {
                history.push(`${routeName.BASELINE_USER_POSTING_MANAGE_DETAIL}?id=${record?.id}`)
              }}
            >
              详情
            </Button>
            {/* <Access accessible={access['P_OA_DSXCY']}> */}
            {/* </Access> */}
            {
              // record?.state === 'SHOPPED' &&
              <Popconfirm
                icon={null}
                title="确定下架么？"
                okText="下架"
                cancelText="取消"
                onConfirm={() => recommend(record?.id.toString(),record?.state)}
              >
                <a href="#">推荐</a>
              </Popconfirm>
            }
            {
              // (record?.state === 'UN_SHOP' || record?.state === 'PREPARE') &&
              <Popconfirm
                icon={null}
                title="确定上架么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => recommend(record?.id.toString(),record?.state)}
              >
                <a href="#">取消推荐</a>
              </Popconfirm>
            }
            {
              // record?.state === 'SHOPPED' &&
              <Popconfirm
                icon={null}
                title={
                  <React.Fragment>
                    <div style={{fontSize: '16px', fontWeight: 600}}>下架原因</div>
                    <Form form={form} {...formLayout} validateTrigger="onBlur">
                      <Form.Item
                        name="原因"
                        rules={[{ required: true, message: '请填写原因' }]}
                      >
                        <TextArea placeholder='请输入原因(必填)' rows={3} maxLength={50} />
                      </Form.Item>
                    </Form>
                  </React.Fragment>
                }
                okText="下架"
                cancelText="取消"
                onConfirm={() => soldOut(record?.id.toString(),record?.state)}
              >
                <a href="#" onClick={() => form.resetFields()}>下架</a>
              </Popconfirm>
            }
            {
              // (record?.state === 'UN_SHOP' || record?.state === 'PREPARE') &&
              <Popconfirm
                icon={null}
                title="确定上架么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => soldOut(record?.id.toString(),record?.state)}
              >
                <a href="#">上架</a>
              </Popconfirm>
            }
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
          optionRender: (searchConfig, formProps, dom) => {
            return[dom[1], dom[0]]
          },
        }}
        request={async (pagination) => {
          console.log('查询pagination', pagination)
          // 搜集的发布时间范围 是一个数组 publishTime
          // 目前可以选同一天
          // publishTime.length > 0
          // publishTime[0], publishTime[1]
          // const result = await getPropagandaDataList(pagination); // 根据后端调整
          const result = {
            success: 0,
            total: 1,
            data: [
              {
                content: '芜湖市内容信息',
                title: '一贫如洗',
                topic: '一人之下',
                type: '玄幻',
                publishTime: "2023-04-20 16:45:02",
                enable: '1',
                tuijian: '1',
                id: 9,
                risky: false,
              },
              {
                content: '芜湖市内容信息芜湖市内容信息芜湖市内容信息芜湖市内容信息芜湖市内容信息芜湖市内容信息芜湖市内容信息芜湖市内容信息芜湖市内容信息芜湖市内容信息芜湖市内容信息芜湖市内容信息',
                title: '一贫如洗',
                topic: '一人之下',
                type: '玄幻',
                publishTime: "2023-04-20 16:45:02",
                enable: '1',
                tuijian: '1',
                id: 9,
                risky: true,
                riskyContent: '风险内容风险内容风险内容'
              },
              {
                content: '芜湖市内容信息',
                title: '一贫如洗',
                topic: '一人之下',
                type: '玄幻',
                publishTime: "2023-04-20 16:45:02",
                enable: '1',
                tuijian: '1',
                id: 9,
                risky: true,
                riskyContent: '风险内容风险内容'
              },

            ]
          }
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