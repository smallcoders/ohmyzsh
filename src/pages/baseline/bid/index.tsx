import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Space,
  Modal,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import SelfTable from '@/components/self_table';
import { Access, useAccess } from 'umi';
import type Common from '@/types/common';
import type NeedVerify from '@/types/user-config-need-verify';
import { routeName } from '../../../../config/routes';
import { deleteBid, getBidPage, onOffShelvesById } from '@/services/baseline';
import moment from 'moment';
const sc = scopedClasses('science-technology-manage-creative-need');
const sourceObj = {
  TENDERING_SOURCE1: '剑鱼标讯'
};

const industryData = {
  INDUATRIAL_1: '新能源汽车', INDUATRIAL_2: '新一代信息技术', 'INDUATRIAL_3': '人工智能', INDUATRIAL_4: '数字创意', INDUATRIAL_5: '高端装备制造', INDUATRIAL_6: '新材料', INDUATRIAL_7: '新能源', INDUATRIAL_8: '节能环保', INDUATRIAL_9: '智能家电', INDUATRIAL_10: '生命健康', INDUATRIAL_11: '绿色食品'
}

const subTypeObj = { TENDERING_1: '拟建', TENDERING_2: '采购意向', TENDERING_3: '预告', TENDERING_4: '预审', TENDERING_5: '预审结果', TENDERING_6: '论证意见', TENDERING_7: '需求公示', TENDERING_8: '变更', TENDERING_9: '邀标', TENDERING_10: '询价', TENDERING_11: '竞谈', TENDERING_12: '单一', TENDERING_13: '竞价', TENDERING_14: '招标', TENDERING_15: '废标', TENDERING_16: '流标', TENDERING_17: '结果变更', TENDERING_18: '中标', TENDERING_19: '成交', TENDERING_20: '合同', TENDERING_21: '验收', TENDERING_22: '违规', TENDERING_23: '其它' }

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<NeedVerify.Content[]>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  // 拿到当前角色的access权限兑现
  const access = useAccess()

  useEffect(() => {
  }, [])


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


  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await getBidPage({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
        setLoading(false);
      } else {
        message.error(`请求分页数据失败`);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      const updateStateResult = await deleteBid({ id });
      if (updateStateResult.code === 0) {
        message.success(`操作成功`);
        getPage();
      } else {
        message.error(`操作失败，请重试`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onOffShelves = async (id: string, isShelves: boolean) => {
    const tooleMessage = isShelves ? "上架" : "下架"
    try {
      const updateStateResult = await onOffShelvesById({ id, isShelves });
      if (updateStateResult.code === 0) {
        message.success(`${tooleMessage}成功`);
        getPage();
      } else {
        message.error(`操作失败，请重试`);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '公告标题',
      dataIndex: 'title',
      isEllipsis: true,
      width: 400,
    },
    {
      title: '来源',
      dataIndex: 'biddingSource',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '公告类别',
      dataIndex: 'subTypeEnum',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '项目编号',
      dataIndex: 'projectCode',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '采购单位名称',
      dataIndex: 'buyer',
      isEllipsis: true,
      width: 300,
    },

    {
      title: '行业',
      dataIndex: 'buyerClass',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '产业链',
      dataIndex: 'industrial',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '标签',
      dataIndex: 'label',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '内容状态',
      dataIndex: 'status',
      isEllipsis: true,
      render: (_: number) => _ === 0 ? '下架' : '上架',
      width: 150,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      render: (_: string) => _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--',
      isEllipsis: true,
      width: 250,
    },
    {
      title: '上架时间',
      dataIndex: 'updateTime',
      render: (_: string) => _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--',
      isEllipsis: true,
      width: 250,
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        // const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return (
          // <Access accessible={accessible}>
          <Space wrap>
            <Access accessible={access['PD_BLM_ZTBGL']}>
            <Button type="link" style={{ padding: 0 }} onClick={() => {
              Modal.confirm({
                title: '删除数据',
                content: '删除后，系统将不再推荐该内容，确定删除？',
                onOk: () => { onDelete(record?.id) },
                okText: '删除'
              })
            }}>
              删除
            </Button>
            </Access>
            <Button
              style={{ padding: 0 }}
              type="link"
              onClick={() => {
                window.open(routeName.BASELINE_BID_MANAGE_DETAIL + `?id=${record?.id}`);
              }}
            >
              详情
            </Button>
            <Access accessible={access['PU_BLM_ZTBGL']}>
            {record?.status === 1 ? <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  content: '确定将内容下架？',
                  onOk: () => { onOffShelves(record.id, false) },
                  okText: '下架'
                })
              }}
            >
              下架
            </Button> : <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  content: '确定将内容上架？',
                  onOk: () => { onOffShelves(record.id, true) },
                  okText: '上架'
                })
              }}
            >
              上架
            </Button>}
            </Access>
          </Space>
        )
      },
    },
  ].filter(p => p);

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const [searchForm] = Form.useForm();
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="name" label="标题">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="内容状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={true}>
                    已上架
                  </Select.Option>
                  <Select.Option value={false}>
                    已下架
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="subTypeEnum" label="公告类别">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(subTypeObj).map((p) => (
                    <Select.Option key={p[0] + p[1]} value={Number(p[0])}>
                      {p[1]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="biddingSource" label="来源">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(sourceObj).map((p) => (
                    <Select.Option key={p[0] + p[1]} value={Number(p[0])}>
                      {p[1]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item name="industrial" label="产业链">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(industryData).map((p) => (
                    <Select.Option key={p[0] + p[1]} value={Number(p[0])}>
                      {p[1]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="buyer" label="采购单位名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="projectCode" label="项目编号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col offset={2} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
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
          {/* <span>风险列表(共{pageInfo.totalCount || 0}条)</span> */}
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          loading={loading}
          bordered
          scroll={{ x: 3030 }}
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
