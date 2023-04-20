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
import './index.less'
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../config/routes'

const sc = scopedClasses('baseline-user-posting');

const stateColumn = {
  'PREPARE': '待发布',
  'SHOPPED': '发布中',
  'UN_SHOP': '已下架',
}

export default () => {
  const access = useAccess()
  const [total, setTotal] = useState<number>(0);
  // pro需要用到的index
  const paginationRef = useRef<any>();
  const actionRef = useRef<ActionType>();

  // 下架
  const soldOut = async (id: string,state: any) => {
    try {
      const res = await cityPropaganda(id)
      if (res.code === 0) {
        message.success(state === 'SHOPPED' ? '下架成功' : '上架成功');
        actionRef.current?.reload(); // 让table// 刷新
      } else {
        message.error(`失败，原因:{${res.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 删除
  const remove = async (id: string) => {
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
      title: '城市名称',
      dataIndex: 'areaName',
      align: 'center',
      valueType: 'textarea', // 筛选的类别
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'state',
      width: 100,
      hideInSearch: true,
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateColumn, _) ? stateColumn[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '企业需求数量',
      align: 'center',
      dataIndex: 'demandCount',
      hideInSearch: true,
    },
    {
      title: '服务方案数量',
      align: 'center',
      dataIndex: 'solutionCount',
      hideInSearch: true,
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
                history.push(`${routeName.DETAIL_PROPAGANDA_CONFIG}?detail=${record?.id}`)
              }}
            >
              详情
            </Button>
            <Access accessible={access['P_OA_DSXCY']}>
              <Button
                key="2"
                size="small"
                type="link"
                onClick={() => {
                  history.push(`${routeName.ADD_PROPAGANDA_CONFIG}?edit=${record?.id}`)
                }}
              >
                编辑
              </Button>
              {
                record?.state === 'SHOPPED' &&
              <Popconfirm
                title="确定下架么？"
                okText="下架"
                cancelText="取消"
                onConfirm={() => soldOut(record?.id.toString(),record?.state)}
              >
                <a href="#">下架</a>
              </Popconfirm>
              }
            </Access>
            {
              (record?.state === 'UN_SHOP' || record?.state === 'PREPARE') &&
              <Popconfirm
                title="确定上架么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => soldOut(record?.id.toString(),record?.state)}
              >
                <a href="#">上架</a>
              </Popconfirm>
            }
            {
              record?.state !== 'SHOPPED' &&
              <Popconfirm
                title="确定删除么？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id.toString())}
              >
                <a href="#">删除</a>
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
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        request={async (pagination) => {
          // const result = await getPropagandaDataList(pagination); // 根据后端调整
          const result = {
            success: 0,
            total: 1,
            data: [
              {
                areaCode: "340200",
                areaName: "芜湖市",
                cityBannerId: 1658904288000001,
                cityBannerUrl: "https://oss.lingyangplat.com/iiep-dev/bda16f09e37d4b3ab5a12474d332610d.png",
                demandCount: 33,
                id: 9,
                solutionCount: 15,
                state: "UN_SHOP",
              }
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