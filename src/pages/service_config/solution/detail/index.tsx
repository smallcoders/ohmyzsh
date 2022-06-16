import { message, Image } from 'antd';
import { history } from 'umi';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import ProDescriptions from '@ant-design/pro-descriptions';
import { getDetail, intentionPageQuery } from '@/services/solution';
import type SolutionTypes from '@/types/solution';
import scopedClasses from '@/utils/scopedClasses';
import { renderSolutionType } from '../solution';
import './index.less';

const sc = scopedClasses('service-config-solution');

const SolutionDetail: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [solutionDetail, setSolutionDetail] = useState<SolutionTypes.SolutionDetail>();

  /**
   * 查询默认密码
   */
  useEffect(() => {
    getDetail(history.location.query?.id).then((e) => {
      if (e.code !== 0) {
        message.error(e.message);
      } else {
        setSolutionDetail(e.result);
        setLoading(false);
      }
    });
  }, []);

  const columns: ProColumns<SolutionTypes.Solution>[] = [
    {
      title: '企业名称',
      dataIndex: 'orgName',
      valueType: 'textarea',
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '联系方式',
      dataIndex: 'mobilePhone',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '时间区间',
      dataIndex: 'intentionTimeSpan',
      hideInTable: true,
      valueType: 'dateTimeRange',
    },
  ];

  return (
    <PageContainer loading={loading}>
      <ProCard gutter={8}>
        <ProCard layout="center" className={sc('detail')}>
          <ProDescriptions column={1} title={solutionDetail?.name}>
            <ProDescriptions.Item label="方案类型">
              {renderSolutionType(solutionDetail?.types)}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="方案服务区域">
              {solutionDetail?.areas?.map((e) => e.name).join('、')}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="服务行业">
              {solutionDetail?.industry || '--'}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="方案内容">{solutionDetail?.content}</ProDescriptions.Item>
            <ProDescriptions.Item label="相关附件">
              {solutionDetail?.paths &&
                solutionDetail?.paths.map((p: any) => {
                  return (
                    <>
                      <a target="_blank" rel="noreferrer" style={{ marginRight: 20 }} href={p.path}>
                        {p.name}.{p.format}
                      </a>
                    </>
                  );
                })}
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProCard>
        <ProCard
          className={sc('detail-cover')}
          layout="center"
          bordered
          colSpan={{ xs: '50px', sm: '100px', md: '200px', lg: '300px', xl: '400px' }}
        >
          <Image src={solutionDetail?.coverUrl} />
        </ProCard>
      </ProCard>

      <ProCard style={{ marginTop: 8 }} gutter={8}>
        <ProDescriptions column={1} title={'服务商信息'}>
          <ProDescriptions.Item label="服务商名称">
            {solutionDetail?.provider.name}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="服务商所在地">
            {solutionDetail?.provider.name}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="公司简介">
            {solutionDetail?.provider.aboutUs}
          </ProDescriptions.Item>
          <ProDescriptions.Item className={sc('detail-attachment')} label="附件下载">
            {solutionDetail?.attachments?.length
              ? solutionDetail?.attachments.map((e) => (
                  <p key={e.id}>
                    <a
                      href={`/antelope-manage/common/download/${e.id}`}
                      download={e.name}
                    >{`${e.name}.${e.format}`}</a>
                  </p>
                ))
              : '（无）'}
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>

      <ProTable
        className={sc('intention-table')}
        headerTitle={
          <div className={sc('intention-table-title')}>
            <p>{`意向企业列表（共${total}个）`}</p>
          </div>
        }
        defaultSize={'small'}
        options={false}
        rowKey="id"
        actionRef={actionRef}
        search={{
          span: 8,
          labelWidth: 80,
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        request={async (pagination) => {
          const result = await intentionPageQuery({
            ...pagination,
            solutionId: history.location.query?.id,
          });
          setTotal(result.total);
          return result;
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};

export default SolutionDetail;
