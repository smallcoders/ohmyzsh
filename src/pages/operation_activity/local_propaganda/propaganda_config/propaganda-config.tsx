import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { 
  Button, 
  Space, 
  Popconfirm, 
  message, 
  Image,
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { 
  getPropagandaDataList, 
  removePropaganda,
  cityPropaganda,
} from '@/services/propaganda-config';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { history, Access, useAccess } from 'umi';
import { routeName } from '@/../config/routes';
import type SolutionTypes from '@/types/solution';
import './propaganda-config.less';
import scopedClasses from '@/utils/scopedClasses';
const sc = scopedClasses('propaganda-config');

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const paginationRef = useRef<any>();
  const [total, setTotal] = useState<number>(0);
  
  // 保留当前Item的值
  // const [editingItem, setEditingItem] = useState<any>({});

  // ⭐  状态不对，
  const stateColumn = {
    'PREPARE': '待发布',
    'SHOPPED': '发布中',
    'UN_SHOP': '已下架',
  }

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
      title: 'banner',
      hideInSearch: true, 
      align: 'center',
      dataIndex: 'cityBannerId',
      width: 200,
      render: (cityBannerId: string) => (
        <Image
          className={'banner-img'}
          src={`/antelope-manage/common/download/${cityBannerId}`}
          alt="图片损坏"
        />
        // </div>
      ),
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

  const access = useAccess()

  return (
    <PageContainer className={sc('container')}>
      <ProTable 
        headerTitle={`地市宣传页列表（共${total}个）`}
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
          const result = await getPropagandaDataList(pagination);
          paginationRef.current = pagination;
          setTotal(result.total);
          return result;
        }}
        columns={columns}
        toolBarRender={()=>[
          <Access accessible={access['P_OA_DSXCY']}>
            <Button 
              key="button" 
              icon={<PlusOutlined /> } 
              type="primary" 
              disabled={total >= 16}
              onClick={()=>{
                history.push(`${routeName.ADD_PROPAGANDA_CONFIG}`)
              }}
            >
              新增地市宣传页
            </Button>
          </Access>
        ]}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  )
}

export default TableList