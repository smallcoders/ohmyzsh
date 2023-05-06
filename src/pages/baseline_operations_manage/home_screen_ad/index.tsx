import {
  Button,
  message,
  Space,
  Popconfirm,
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
import { httpAdvertiseList, httpUpOrDownAds } from '@/services/home-screen-ad';

const sc = scopedClasses('home-screen-ad');

const stateColumn = {
  0: '暂存', // 暂存
  1: '上架', // 上架中
  3: '下架', // 已下架
};
const displayFrequencyEnum = {
  EVERY_TIME: '每次',
  INTERVAL_ONE_TIME: '间隔一次',
  DAY_THREE_TIMES: '每天最多显示3次',
};
export default () => {
  const access = useAccess();
  // 手动触发table 的 reload等操作
  const actionRef = useRef<ActionType>();
  // current pageSize
  const paginationRef = useRef<any>();
  const [total, setTotal] = useState<number>(0);

  const handleAddBtn = () => {
    // history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_ADD}?type=add`)
    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_ADD}?type=add`)
  }
  const handleDetail = (itemId: any) => {
    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_DETAIL}?id=${itemId}`)
  }

  // 上/下架/删除
  const soldOut = async (id: string,state: any) => {
    try {
      const res = await httpUpOrDownAds({
        id,
        status: state
      })
      if (res?.code === 0) {
        message.success(
          state === 3 
          ? '下架成功' 
          : state === 2 
            ? '删除成功'
            : '上架成功');
        if (total === 11) {
          actionRef.current?.reloadAndRest();
          return;
        }
        actionRef.current?.reload(); // 让table// 刷新
      } else {
        message.error(`失败，原因:{${res.message}}`);
      }
    } catch (error) {
      message.error(`上下架失败, 原因: ${error}`)
    }
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
      dataIndex: 'advertiseName',
      align: 'center',
      valueType: 'text', // 筛选的类别
    },
    {
      title: '图片',
      dataIndex: 'advertiseOssRelationList',
      align: 'center',
      hideInSearch: true,
      renderText: (photoId: string) => {
        return <Image
          className={'table-img'}
          src={`/antelope-common/common/file/download/${photoId[0]?.fileId}`} // 看给的值是什么, 是给的ID就用这个
          alt="图片损坏"
        />
      },
    },
    {
      title: '倒计时时长',
      dataIndex: 'countdown',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '启动频次',
      dataIndex: 'displayFrequency',
      align: 'center',
      hideInSearch: true,
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(displayFrequencyEnum, _) ? displayFrequencyEnum[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      align: 'center',
      hideInSearch: true,
      renderText: (_: string) => {
        return _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--'
      }
    },
    {
      title: '内容状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '暂存'
        },
        1: {
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
            {record?.status !== 0 && (
              <a href="#" onClick={handleDetail.bind(null,record?.id)}>详情</a>
            )}
            <Access accessible={access['PU_BLM_YYWGL']}>
              {record?.status === 3 && (
                <Popconfirm
                  // icon={null}
                  title="确定上架么？"
                  okText="上架"
                  cancelText="取消"
                  onConfirm={() => soldOut(record?.id.toString(), 1)}
                >
                  <a href="#">上架</a>
                </Popconfirm>
              )}
            </Access>
            <Access accessible={access['PU_BLM_YYWGL']}>
              {record?.status === 1 && (
                <Popconfirm
                  // icon={null}
                  title="确定下架么？"
                  okText="下架"
                  cancelText="取消"
                  onConfirm={() => soldOut(record?.id.toString(), 3)}
                >
                  <a href="#">下架</a>
                </Popconfirm>
              )}
            </Access>
            <Access accessible={access['PA_BLM_YYWGL']}>
              {(record?.status === 3 || record?.status === 0) && (
                <Button
                  key="2"
                  size="small"
                  type="link"
                  onClick={() => {
                    history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_ADD}?type=edit&id=${record?.id}`)
                  }}
                >
                  编辑
                </Button>
              )}
            </Access>
            <Access accessible={access['PD_BLM_YYWGL']}>
              {(record?.status === 3 || record?.status === 0) && (
                  <Popconfirm
                    title={
                      <div>
                        <div>删除数据</div>
                        <div>确定删除该服务号？</div>
                      </div>
                    }
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => soldOut(record.id.toString(),2)}
                  >
                    <a href="#">删除</a>
                  </Popconfirm>
              )}
            </Access>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer className={sc('container')}>
      <ProTable
        headerTitle={`开屏广告管理列表（共${total}个）`}
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
          const result = await httpAdvertiseList({
            ...pagination,
            advertiseType: 'SPLASH_ADS'
          });
          console.log('结果', result);
          paginationRef.current = pagination;
          setTotal(result.total);
          return result;
        }}
        columns={columns}
        toolBarRender={() => [
          <Access accessible={access['PA_BLM_YYWGL']}>
            <Button
              key="button"
              icon={<PlusOutlined />}
              type="primary"
              // disabled={total >= 16}
              onClick={handleAddBtn.bind(null)}
            >
              新增
            </Button>
          </Access>,
        ]}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  )
}