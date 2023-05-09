import {
  Button,
  message,
  Space,
  Popconfirm,
  Image,
  Modal,
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
    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_ADD}?type=add`)
  }
  const handleDetail = (itemId: any) => {
    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_DETAIL}?id=${itemId}`)
  }

  const handleUpOrDown = (record: any) => {
    Modal.confirm({
      title: '提示',
      content: record.status === 1 ? '确定将内容下架？' : '确定将内容上架？',
      okText: record.status === 1 ? '下架' : '上架',
      onOk: () => {
        httpUpOrDownAds(record.id, record.status === 1 ? 3 : 1).then((res) => {
          if (res.code === 0){
            actionRef.current?.reload(); // 让table// 刷新
            message.success(record.status === 1 ? '下架成功' : `上架成功`);
          } else {
            message.error(res.message);
          }
        })
      },
    })
  }

  const handleDelete = (record: any) => {
    console.log(record)
    Modal.confirm({
      title: '删除数据',
      content: '删除该开屏广告后，系统将不再推荐该广告，确定删除？',
      okText: '删除',
      onOk: () => {
        httpUpOrDownAds(record.id, 2).then((res) => {
          if (res.code === 0){
            actionRef.current?.reload(); // 让table// 刷新
            message.success(`删除成功`);
          } else {
            message.error(res.message);
          }
        })
      },
    })
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
      width: 230,
      align: 'left',
      valueType: 'text', // 筛选的类别
      renderText: (advertiseName: any) => {
        return <div className={sc('container-table-advertiseName')}>{advertiseName || '--'}</div>
      }
    },
    {
      title: '图片',
      width: 150,
      dataIndex: 'advertiseOssRelationList',
      align: 'left',
      hideInSearch: true,
      renderText: (photoId: string) => {
        return (
          photoId?.length > 0 
          ? 
          <Image
            className={'table-img'}
            // src={`/antelope-common/common/file/download/${photoId[0]?.fileId}`} // 看给的值是什么, 是给的ID就用这个
            src={photoId[0]?.ossUrl} // 看给的值是什么, 是给的ID就用这个
            alt="图片损坏"
          />
          : '--'
        )
      },
    },
    {
      title: '倒计时时长',
      width: 80,
      dataIndex: 'countdown',
      align: 'left',
      hideInSearch: true,
    },
    {
      title: '启动频率',
      width: 100,
      dataIndex: 'displayFrequency',
      align: 'left',
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
      width: 200,
      align: 'left',
      hideInSearch: true,
      renderText: (_: string) => {
        return _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--'
      }
    },
    {
      title: '内容状态',
      dataIndex: 'status',
      align: 'left',
      width: 100,
      valueType: 'select',
      valueEnum: {
        1: {
          text: '上架'
        },
        2: {
          text: '下架'
        },
        3: {
          text: '暂存'
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
      align: 'left',
      width: 150,
      render: (_, record) => {
        return (
          <Space size="middle">
            {/* 需要调整的权限 */}
            {/* <Access accessible={access['PQ_BLAM_KPGG']}> */}
              {record?.status !== 0 && (
                <Button
                  size="small"
                  type="link"
                  onClick={handleDetail.bind(null,record?.id)}
                >
                  详情
                </Button>
              )}
            {/* </Access> */}
            <Access accessible={access['PU_BLAM_KPGG']}>
              {record?.status === 3 && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    handleUpOrDown(record)
                  }}
                >
                  上架
                </Button>
              )}
            </Access>
            <Access accessible={access['PU_BLAM_KPGG']}>
              {record?.status === 1 && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    handleUpOrDown(record)
                  }}
                >
                  下架
                </Button>
              )}
            </Access>
            <Access accessible={access['PU_BLAM_KPGG']}>
              {(record?.status === 3 || record?.status === 0) && (
                <Button
                  key="2"
                  size="small"
                  type="link"
                  onClick={() => {
                    window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_HOME_SCREEN_AD_ADD}?type=edit&id=${record?.id}`)
                  }}
                >
                  编辑
                </Button>
              )}
            </Access>
            <Access accessible={access['PD_BLAM_KPGG']}>
              {(record?.status === 3 || record?.status === 0) && (
                  // <Popconfirm
                  //   title={
                  //     <div>
                  //       <div>删除数据</div>
                  //       <div>确定删除该服务号？</div>
                  //     </div>
                  //   }
                  //   okText="确定"
                  //   cancelText="取消"
                  //   onConfirm={() => soldOut(record.id.toString(),2)}
                  // >
                  //   <a href="#">删除</a>
                  // </Popconfirm>
                  <Button
                    size="small"
                    type="link"
                    onClick={() => {
                      handleDelete(record)
                    }}
                  >
                    删除
                  </Button>
              )}
            </Access>
          </Space>
        );
      },
    },
  ];

  // 重置
  const handleReset = () => {
    actionRef.current.reset()
  }

  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: '开屏广告',
        breadcrumb: {},
      }}
    >
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
        onReset={handleReset}
        request={async (pagination) => {
          // 查询，重置搜集的值
          let status
          switch(pagination?.status) {
            case '2':
              status = '3';
              break;
            case '3':
              status = '0';
              break;
            default:
              status = '1';
              break;
          }
          const result = await httpAdvertiseList({
            ...pagination,
            status: pagination?.status
              ? status
              : undefined,
            advertiseType: 'SPLASH_ADS'
          });
          paginationRef.current = pagination;
          setTotal(result.total);
          return result;
        }}
        columns={columns}
        toolBarRender={() => [
          <Access accessible={access['PA_BLAM_KPGG']}>
            <Button
              key="button"
              icon={<PlusOutlined />}
              type="primary"
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
