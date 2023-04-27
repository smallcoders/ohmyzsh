import {
  Button,
  message,
  Space,
  Popconfirm,
  Tooltip,
  Form,
  Input,
  Image,
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type SolutionTypes from '@/types/solution';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history, Access, useAccess } from 'umi';
import './index.less'
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../config/routes';
import dayjs from 'dayjs';

const sc = scopedClasses('home-screen-ad');

const stateColumn = {
  NOT_SUBMITTED: '暂存', // 暂存
  ON_SHELF: '上架', // 上架中
  OFF_SHELF: '下架', // 已下架
};
export default () => {
  // 手动触发table 的 reload等操作
  const actionRef = useRef<ActionType>();
  // current pageSize
  const paginationRef = useRef<any>();
  const [total, setTotal] = useState<number>(0);

  const handleAddBtn = () => {
    // history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_ADD}`)
    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_ADD}?type=add`)
  }
  const handleDetail = (itemId: any) => {
    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_DETAIL}?id=${itemId}`)
  }

  const columns: ProColumns<SolutionTypes.Solution>[] = [
    {
      title: '序号',
      hideInSearch: true,
      align: 'center',
      width: 50,
      renderText: (text: any, record: any, index: number) =>
        (paginationRef.current.current - 1) * paginationRef.current.pageSize + index + 1,
    },
    {
      title: '活动名称',
      dataIndex: 'innerName',
      align: 'center',
      valueType: 'text', // 筛选的类别
    },
    {
      title: '图片',
      dataIndex: 'photoId',
      align: 'center',
      hideInSearch: true,
      renderText: (photoId: string) => (
        <Image
          className={'table-img'}
          src={`/antelope-common/common/file/download/${photoId}`} // 看给的值是什么, 是给的ID就用这个
          alt="图片损坏"
        />
      ),
    },
    {
      title: '倒计时时长',
      dataIndex: 'updateTime',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '启动频次',
      dataIndex: 'updateTime',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '内容状态',
      dataIndex: 'state',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        1: {
          text: '暂存'
        },
        2: {
          text: '上架'
        },
        3: {
          text: '下架'
        },
      },
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateColumn, _) ? stateColumn[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '操作',
      hideInSearch: true, // 隐藏筛选
      align: 'center',
      width: 300,
      render: (_, record) => {
        return (
          <Space size="middle">
            {/* 需要调整的权限 */}
            {/* <Access accessible={access['P_BLM_FWHGL']}> */}
            {record?.status && (
              <Button
                key="2"
                size="small"
                type="link"
                onClick={() => {
                  // setEditId(record.id);
                  // handleEditBtn(record);
                }}
              >
                编辑
              </Button>
            )}
            {/* </Access> */}
            {/* <Access accessible={access['P_BLM_FWHGL']}> */}
            {record?.status && (
                <Popconfirm
                  title={
                    <div>
                      <div>删除数据</div>
                      <div>确定删除该服务号？</div>
                    </div>
                  }
                  okText="确定"
                  cancelText="取消"
                  // onConfirm={() => remove(record.id.toString())}
                >
                  <a href="#">删除</a>
                </Popconfirm>
            )}
            {/* </Access> */}
            {/* <Access accessible={access['P_BLM_FWHGL']}> */}
            {record?.status && (
              <a href="#" onClick={handleDetail.bind(null,2)}>详情</a>
            )}
            {/* </Access> */}
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer className={sc('container')}>
      <ProTable
        headerTitle={`服务号设置管理列表（共${total}个）`}
        options={false} // 工具栏隐藏
        actionRef={actionRef} // 用来自定义触发
        rowKey="id"
        search={{
          span: 8,
          labelWidth: 100,
          defaultCollapsed: false, // 默认是否收起
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        request={async (pagination) => {
          // 查询，重置搜集的值
          console.log('pagination', pagination);
          // const result = await httpServiceAccountMannagePage({
          //   ...pagination,
          // });
          const result = {
            success: 0,
            total: 0,
            data: [
              {
                id: 1,
                name: '123',
                state: 'ON_SHELF',
                status: 1,
              }
            ],
          }
          console.log('结果', result);
          paginationRef.current = pagination;
          setTotal(result.total);
          return result;
        }}
        columns={columns}
        toolBarRender={() => [
          // <Access accessible={access['P_BLM_FWHGL']}>
            <Button
              key="button"
              icon={<PlusOutlined />}
              type="primary"
              // disabled={total >= 16}
              onClick={handleAddBtn.bind(null)}
            >
              新增
            </Button>
          // </Access>,
        ]}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  )
}