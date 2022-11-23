import { Button, Input, Form, Select, Row, Col, DatePicker, message, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import CommissionerService from '@/types/commissioner-service.d';
import { routeName } from '../../../../config/routes';
import { history, Access, useAccess } from 'umi';
import {
  getCommissionerServicePage,
  removeCommissionerService,
} from '@/services/commissioner-service';
const sc = scopedClasses('user-config-commissioner-service');
enum Edge {
  HOME = 0,
}
export default () => {
  const [dataSource, setDataSource] = useState<CommissionerService.Content[]>([]);
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 标题
    publishTime?: string; // 发布时间
    state?: number; // 状态：0发布中、1待发布、2已下架
  }>({});
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_UM_FWZY', // 用户管理-用户信息
  }

  useEffect(() => {
    for (const key in permissions) {
      const permission = permissions[key]
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        setEdge(key as any)
        break
      }
    }
  },[])

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

  const getNews = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getCommissionerServicePage({
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

  const remove = async (id: string) => {
    try {
      const removeRes = await removeCommissionerService(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getNews();
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, record: CommissionerService.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '服务专员',
      dataIndex: 'expertName',
      render: (_: string, record: CommissionerService.Content) => {
        return (
          <a
            href="#!"
            onClick={(e) => {
              e.preventDefault(); 
              history.push(`${routeName.EXPERT_MANAGE_DETAIL}?id=${record?.expertId}`);
            }}
          >
            {_}
          </a>
        );
      },
      width: 300,
    },
    {
      title: '服务企业',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '打卡时间',
      dataIndex: 'createTime',
      width: 200,
      render: (_: string) => (_ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '评分',
      dataIndex: 'gradeDescription',
      width: 120,
    },
    {
      title: '评语',
      dataIndex: 'evaluation',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '评价时间',
      dataIndex: 'evaluationTime',
      width: 200,
      render: (_: string) => (_ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--'),
    },
    {
      title: '服务记录文档',
      dataIndex: 'wordUrl',
      render: (_: string) =>
        _ ? (
          <a target="_blank" rel="noreferrer" style={{ marginRight: 20 }} href={_}>
            查看文档
          </a>
        ) : (
          <span style={{ color: '#cbc5c5' }}>查看文档</span>
        ),
      width: 150,
    },
    access['PD_UM_FWZY'] && {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: CommissionerService.Content) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "D")]
        return (
          <Access accessible={accessible}>
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(record.id as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Access>
        );
      },
    },
  ].filter(p => p);

  useEffect(() => {
    getNews();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="expertName" label="服务专员">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="orgName" label="服务企业">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="createTime" label="打卡时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="level" label="评价情况">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={CommissionerService.EvaluationType.GOOD}>
                    好评
                  </Select.Option>
                  <Select.Option value={CommissionerService.EvaluationType.MIDDLE}>
                    中评
                  </Select.Option>
                  <Select.Option value={CommissionerService.EvaluationType.BAD}>差评</Select.Option>
                  <Select.Option value={CommissionerService.EvaluationType.NONE}>
                    待评价
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="evaluationTime" label="评价时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={4} offset={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.createTime) {
                    search.startCreateTime = moment(search.createTime[0]).format(
                      'YYYY-MM-DD HH:mm:ss',
                    );
                    search.endCreateTime = moment(search.createTime[1]).format(
                      'YYYY-MM-DD HH:mm:ss',
                    );
                  }
                  if (search.evaluationTime) {
                    search.startEvaluationTime = moment(search.evaluationTime[0]).format(
                      'YYYY-MM-DD HH:mm:ss',
                    );
                    search.endEvaluationTime = moment(search.evaluationTime[1]).format(
                      'YYYY-MM-DD HH:mm:ss',
                    );
                  }
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
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
          <span>专员服务记录列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1850 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getNews,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
    </PageContainer>
  );
};
