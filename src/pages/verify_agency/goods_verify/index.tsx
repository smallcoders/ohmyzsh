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
  Popconfirm,
  TreeSelect,
  Image,
  Tooltip,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { history } from 'umi';
import { getDemandPage } from '@/services/kc-verify';
import { getGoodsVerifyPage } from '@/services/goods-verify';
import { getDictionaryTree } from '@/services/dictionary';
import type Common from '@/types/common';
import type NeedVerify from '@/types/user-config-need-verify';
import { handleAudit } from '@/services/audit';
// import { getDictionaryTree } from '@/services/dictionary';
const sc = scopedClasses('verify_agency_goods_verify');
const stateObj = {
  0: '待审核',
  1: '未通过',
  2: '已通过',
};

const GoodsMessage = (props: { _: any; row: any }) => (
  <div className={sc('container-goods-message')}>
    <Image className={'goods-img'} src={props?.row.productPic} alt="图片损坏" />
    <div className="info">
      <Tooltip title={props?.row.productName}>
        <span
          onClick={() => {
            history.push(
              `${routeName.GOODS_VERIFY_DETAIL}?productId=${props?.row.productId}&id=${props?.row.id}`,
            );
          }}
        >
          {props?.row.productName}
        </span>
      </Tooltip>
      <Tooltip title={props?.row.productDesc} placement="right">
        <span>{props?.row.productDesc}</span>
      </Tooltip>
    </div>
  </div>
);
export default () => {
  const [dataSource, setDataSource] = useState<NeedVerify.Content[]>([]);

  const [searchForm] = Form.useForm();

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
    const search = searchForm.getFieldsValue();
    if (search.time) {
      search.startTime = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
      search.endTime = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    try {
      const params = {
        pageIndex,
        pageSize,
        ...search,
      };
      if (params.handleResult === -1) {
        // 未处理
        delete params.handleResult;
        params.isHandle = 0;
      } else if ([0, 1].some((item) => item === params.handleResult)) {
        params.isHandle = 1;
      }
      const { result, totalCount, pageTotal, code } = await getGoodsVerifyPage(params);
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

  const columns = [
    {
      title: '商品',
      dataIndex: 'productName',
      render: (_: string, _record: any) => <GoodsMessage _={_} row={_record} />,
      width: 300,
    },
    {
      title: '商品来源',
      dataIndex: 'productSource',
      isEllipsis: true,
      render: (_: number) => <span>{_ === 1 ? '应用管理库' : '其他'}</span>,
      width: 300,
    },
    {
      title: '申请组织',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '申请人',
      dataIndex: 'userName',
      isEllipsis: true,
      width: 300,
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '审核状态',
      dataIndex: 'status',
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
      title: '审核',
      width: 200,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Button
            type="link"
            onClick={() => {
              history.push(
                `${routeName.GOODS_VERIFY_DETAIL}?productId=${record.productId}&id=${record.id}`,
              );
            }}
          >
            {record?.status === 0 ? '审核' : '详情'}
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    getPage();
  }, []);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="productName" label="商品名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="userName" label="申请人">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="申请时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="productSource" label="商品来源">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={1}>应用管理库</Select.Option>
                  <Select.Option value={2}>其他</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="handleResult" label="审核状态" initialValue={-1}>
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={-1}>待审核</Select.Option>
                  <Select.Option value={0}>拒绝</Select.Option>
                  <Select.Option value={1}>通过</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  getPage();
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  getPage();
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
          <span>需求列表(共{pageInfo.totalCount || 0}个)</span>
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
