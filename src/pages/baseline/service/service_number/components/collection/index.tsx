import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Button,
  Menu,
  Dropdown,
  Tabs,
  Breadcrumb,
  Form,
  Space,
  Popconfirm,
  message,
  Input,
  Affix,
  Radio,
  InputNumber,
  Spin,
  Modal
} from 'antd';
import { Link, history, Prompt, useAccess, Access } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { routeName } from '../../../../../../../config/routes';
import type SolutionTypes from '@/types/solution';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import scopedClasses from '@/utils/scopedClasses';
import {
  httpServiceAccountPublishPage,
} from '@/services/service-management';
import copy from 'copy-to-clipboard';
const sc = scopedClasses('service-number-management-collection');

type RouterParams = {
  appId?: string;
  type?: string;
  state?: string;
  id?: string;
  name?: string;
};
// 内容类型
const typeEnum = {
  PICTURE_TEXT: '图文',
  PICTURE: '图片',
  TEXT: '文本',
  VIDEO: '视频',
  AUDIO: '音频',
};
export default () => {
  // const { backid, backname } = props || {}
  const access = useAccess();
  // 手动触发table 的 reload等操作
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const paginationRef = useRef<any>();
  const {
    id,
    name,
  } = history.location.query as RouterParams;

  useEffect(() => {
    console.log('合集标签',  id, name)
  },[])

  // 删除
  const remove = async (id: string) => {
    console.log('删除', id);
    // try {
    //   const res = await httpServiceAccountArticleDel(id);
    //   if (res?.code === 0) {
    //     message.success(`删除成功`);
    //     if (total === 11) {
    //       actionRef.current?.reloadAndRest();
    //       return;
    //     }
    //     actionRef.current?.reload(); // 让table// 刷新
    //   } else {
    //     message.error(`删除失败，原因:{${res.message}}`);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  // 复制
  const handleCopy = (value: any) => {
    if (value)
    // 找唐超要链接
    copy(`https://www.lingyangplat.com/antelope-activity-h5/share-code/index.html`)
    message.success('链接复制成功');
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
      title: '类别',
      dataIndex: '类别',
      align: 'center',
      hideInSearch: true, // 隐藏筛选
      renderText: (_: string) => {
        return (
          <div className={sc(`title`)}>
            {_ || '--'}
          </div>
        );
      },
    },
    {
      title: '合集名称',
      dataIndex: 'title',
      align: 'center',
      valueType: 'text', // 筛选的类别
      renderText: (_: string) => {
        return (
          <div className={sc(`title`)}>
            {_ || '--'}
          </div>
        );
      },
    },
    {
      title: '文末连续阅读状态',
      dataIndex: 'type',
      align: 'center',
      hideInSearch: true,
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(typeEnum, _) ? typeEnum[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '当前内容数',
      dataIndex: 'serviceAccountName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '最后更新时间',
      dataIndex: 'publishTime',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '访问人数',
      dataIndex: 'clickRate',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作',
      hideInSearch: true, // 隐藏筛选
      align: 'center',
      width: 250,
      render: (_, record) => {
        return (
          <Space size="middle">
            {record?.state !== 'OFF_SHELF' && (
              <Button
                size="small"
                type="link"
                onClick={() => {
                  // 草稿的新新增页面
                  handleDetail(record.id.toString());
                }}
              >
                详情
              </Button>
            )}
            <Button
              type="link"
              onClick={() => {
                handleCopy(record.id)
              }}
            >
              复制
            </Button>
            {/* 需要调整的权限 */}
            {/* <Access accessible={access['P_OA_DSXCY']}> */}
            <Button
              size="small"
              type="link"
              onClick={() => {
                // 草稿的新新增页面
                handleEditBtn(record);
              }}
            >
              编辑
            </Button>
            {(
              <Popconfirm
                title={
                  <div>
                    <div>删除</div>
                    <div>确定删除集合？</div>
                  </div>
                }
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id.toString())}
              >
                <a href="#">删除</a>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  const handleAddBtn = () => {
    history.push(
      `${routeName.BASELINE_SERVICE_NUMBER_MANAGEMENT_COLLECTION_ADD}?backid=${id}&backname=${name}&activeTab=${'合集标签'}`,
    );
  };

  return (
    <div className={sc('container')}>
      <ProTable
        headerTitle={`合集标签列表（共${total}个）`}
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
          const result = await httpServiceAccountPublishPage({
            ...pagination,
            serviceAccountId: id && Number(id),
          });
          console.log('result', result);
          paginationRef.current = pagination;
          setTotal(result.total);
          return result;
        }}
        toolBarRender={() => [
          <Access accessible={access['P_BLM_FWHGL']}>
            <Button
              key="button"
              icon={<PlusOutlined />}
              type="primary"
              // disabled={total >= 16}
              onClick={() => {
                handleAddBtn();
              }}
            >
              新增
            </Button>
          </Access>,
        ]}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </div>
  )
}

