import { Button, Input, Form, Row, Col, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { history } from 'umi';
import type EnterpriseAdminVerify from '@/types/enterprise-admin-verify.d';
import { getEnterpriseAdminVerifyPage } from '@/services/enterprise-admin-verify';
const sc = scopedClasses('service-config-app-news');
const stateObj = {
  UN_CHECK: '未审核',
  UN_COMMIT: '未提交',
  CHECKED: '审核通过',
  UN_PASS: '审核不通过',
  INVALID: '未提交已失效',
};

export default () => {
  const [dataSource, setDataSource] = useState<EnterpriseAdminVerify.Content[]>([]);
  // const [types, setTypes] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<{
    orgName?: string; // 标题
  }>({});

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  // const [form] = Form.useForm();

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getEnterpriseAdminVerifyPage({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const prepare = async () => {
  //   try {
  //     const res = await getDictionaryTree('CREATIVE_TYPE');
  //     setTypes(res);
  //   } catch (error) {
  //     message.error('获取行业类型失败');
  //   }
  // };
  // useEffect(() => {
  //   prepare();
  // }, []);

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: EnterpriseAdminVerify.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '申请人姓名',
      dataIndex: 'userName',
      width: 300,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '组织类型',
      dataIndex: 'accountType',
      isEllipsis: true,
      width: 300,
      // render: (_: string) => {
      //   return (
      //     <div className={`account-type${_}`}>
      //       {Object.prototype.hasOwnProperty.call(accountTypeObj, _) ? accountTypeObj[_] : '--'}
      //     </div>
      //   );
      // },
    },
    {
      title: '组织名称',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 300,
    },

    {
      title: '状态',
      dataIndex: 'state',
      width: 200,
      render: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '最新操作时间',
      dataIndex: 'updateTime',
      width: 200,
      render: (_: string) => (_ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <Button
            type="link"
            onClick={() => {
              history.push(`${routeName.ENTERPRISE_ADMIN_VERIFY_DETAIL}?id=${record.id}`);
            }}
          >
            {record?.state === 'UN_CHECK' ? '审核' : '详情'}
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="orgName" label="组织名称">
                <Input placeholder="企业/服务机构/专家名称" />
              </Form.Item>
            </Col>
            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  searchForm.resetFields();
                  setSearChContent({});
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getPage,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
    </PageContainer>
  );
};
