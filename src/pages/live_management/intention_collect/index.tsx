import { Button, message } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  getIntentionList,
  intentionSign
} from '@/services/search-record';

const IntentionTable: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const paginationRef = useRef<any>();

  const postIntentionSign = async (id: string) => {
    try {
      const result = await intentionSign(id)
      if (result.code === 0) {
        message.success(`标记成功`);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error(`标记失败，请重试！`);
    }
  }

  const columns: ProColumns[] = [
    {
      title: '序号',
      hideInSearch: true,
      renderText: (text: any, record: any, index: number) =>
        (paginationRef.current.current - 1) * paginationRef.current.pageSize + index + 1,
    },
    {
      title: '主讲人姓名',
      dataIndex: 'speakerName',
      valueType: 'textarea',
    },
    {
      title: '所属企业',
      dataIndex: 'enterprise',
      valueType: 'textarea',
    },
    {
      title: '分享主题',
      hideInSearch: true,
      renderText: (text: any, record: any) => record.theme,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      valueType: 'textarea',
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '沟通情况',
      hideInSearch: true,
      width: 200,
      render: (_, record) => [
        record.status ? 
        (<div>
          <p>{ record.operationTime }</p>
            <p>操作人: { record.operationUserName }</p>
        </div> ) : (<Button
          key="2"
          size="small"
          type="link"
          onClick={() => {
            postIntentionSign(record.id)
          }}
        >
          标记为已沟通
        </Button>)
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle={'账号列表'}
        options={false}
        rowKey="id"
        actionRef={actionRef}
        search={false}
        toolBarRender={false}
        request={async (pagination) => {
          const res = await getIntentionList(pagination);
          paginationRef.current = pagination;
          return res;
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};

export default IntentionTable;
