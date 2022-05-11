import { Button, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { pageQuery, setTop, unsetTop } from '@/services/solution';
import { getDictionaryTree } from '@/services/dictionary';
import { getAreaTree } from '@/services/area';
import type SolutionTypes from '@/types/solution';
import type { ProSchemaValueEnumObj } from '@ant-design/pro-utils';
import { routeName } from '@/../config/routes';

/**
 * 渲染服务类型
 * @param types
 */
export const renderSolutionType = (types: SolutionTypes.TreeNode[] | undefined) => {
  if (!types || types.length === 0) {
    return '-';
  }
  const concatChildren = (children: { name: string }[]) => children.map((e) => e.name).join('、');
  return types
    .map((e) =>
      e.children && e.children.length > 0 ? `${e.name}（${concatChildren(e.children)}）` : e.name,
    )
    .join('、');
};

const SolutionTable: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const paginationRef = useRef<any>();
  const [typeOptions, setTypeOptions] = useState<ProSchemaValueEnumObj>({});
  const [areaOptions, setAreaOptions] = useState<ProSchemaValueEnumObj>({});
  const [total, setTotal] = useState<number>(0);

  /**
   * 查询默认密码
   */
  useEffect(() => {
    // 查询服务类型选项
    getDictionaryTree('DEMAND_SOLUTION').then((data: { id: number; name: string }[]) => {
      const options = {};
      data.forEach(({ id, name }) => (options[id] = name));
      setTypeOptions(options);
    });

    getAreaTree({}).then((data: { children: any[] }) => {
      const options = {};
      data.children.forEach(({ code, name }) => (options[code] = name));
      setAreaOptions(options);
    });
  }, []);

  /**
   * 置顶处理
   * @param isTop
   * @param id
   */
  const handleSetTop = async (isTop: boolean, id: number) => {
    const result = isTop ? await unsetTop(id) : await setTop(id);
    if (result.code !== 0) {
      message.error(result.message);
    } else {
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<SolutionTypes.Solution>[] = [
    {
      title: '序号',
      hideInSearch: true,
      renderText: (text: any, record: any, index: number) =>
        (paginationRef.current.current - 1) * paginationRef.current.pageSize + index + 1,
    },
    {
      title: '服务名称',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '服务类型',
      dataIndex: 'typeId',
      hideInTable: true,
      valueEnum: typeOptions,
    },
    {
      title: '服务类型',
      dataIndex: 'types',
      hideInSearch: true,
      width: 400,
      renderText: (text: any, record) => renderSolutionType(record.types),
    },
    {
      title: '所属服务商',
      dataIndex: 'providerName',
      hideInTable: true,
      renderText: (text: any, record) => record.provider,
    },
    {
      title: '所属服务商',
      dataIndex: 'provider',
      hideInSearch: true,
      renderText: (text: any, record) => record.provider?.name,
    },
    {
      title: '服务区域',
      dataIndex: 'areaCode',
      hideInTable: true,
      valueEnum: areaOptions,
    },
    {
      title: '服务区域',
      dataIndex: 'areas',
      hideInSearch: true,
      renderText: (text: any, record) => record.areas?.map((e) => e.name).join('、'),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTimeSpan',
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '意向数量（次）',
      dataIndex: 'intentionCount',
      hideInSearch: true,
      valueType: 'textarea',
      render: (_, record) => (
        <Button
          size="small"
          type="link"
          onClick={() => history.push(`${routeName.SOLUTION_DETAIL}?id=${record.id}`)}
        >
          {record.intentionCount}
        </Button>
      ),
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_, record) => [
        <Button
          key="1"
          size="small"
          type="link"
          onClick={() => history.push(`${routeName.SOLUTION_DETAIL}?id=${record.id}`)}
        >
          详情
        </Button>,
        <Button
          key="2"
          size="small"
          type="link"
          onClick={() => handleSetTop(record.isTop, record.id)}
        >
          {record.isTop ? '取消置顶' : '置顶'}
        </Button>,
      ],
    },
  ];

  return (
    <ProTable
      headerTitle={`服务列表（共${total}个）`}
      options={false}
      rowKey="id"
      actionRef={actionRef}
      search={{
        span: 7,
        labelWidth: 80,
        defaultCollapsed: false,
        optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
      }}
      request={async (pagination) => {
        const result = await pageQuery(pagination);
        paginationRef.current = pagination;
        setTotal(result.total);
        return result;
      }}
      columns={columns}
      pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
    />
  );
};

export default SolutionTable;
