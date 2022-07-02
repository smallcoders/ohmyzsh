import {
  Button,
  Input,
  Form,
  Row,
  Col,
  Image,
  message,
} from 'antd';
import '../index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import {
  getProductList
} from '@/services/purchase';
import moment from 'moment';
import DiagnosticTasks from '@/types/service-config-diagnostic-tasks';
import SelfTable from '@/components/self_table';
const sc = scopedClasses('service-config-diagnostic-tasks');
export default () => {
  const [dataSource, setDataSource] = useState<DiagnosticTasks.Content[]>([]);
  const [searchContent, setSearChContent] = useState<{
    productNo?: string;
  }>({});

  const formLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const [form] = Form.useForm();

  /**
   * 获取商品列表
   * @param pageIndex
   * @param pageSize
   */
  const getDiagnosticTasks = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getProductList({
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

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 100,
      render: (_: any, _record: DiagnosticTasks.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '商品订货编码',
      dataIndex: 'productNo',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '商品图',
      dataIndex: 'productPic',
      isEllipsis: true,
      width: 200,
      render: (_: string, _record: any) => (
        <Image width={100} src={_} />
      ),
    },
    {
      title: '商品销售价格',
      dataIndex: 'salePrice',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '销售状态',
      dataIndex: 'addedState',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '所属活动编码',
      dataIndex: 'actNo',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '所属活动名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '累计销售量',
      dataIndex: 'amount',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '累计销售金额',
      dataIndex: 'totalPrice',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200
    }
  ];

  useEffect(() => {
    getDiagnosticTasks();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
          <Col span={6}>
              <Form.Item name="content" label="商品订货编码">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={4} offset={14}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  const { date, ...rest } = search;
                  if (date) {
                    rest.startDate = moment(search.date[0]).format('YYYY-MM-DD');
                    rest.endDate = moment(search.date[1]).format('YYYY-MM-DD');
                  }
                  setSearChContent(rest);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary2"
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
    <>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>商品列表(共{pageInfo.totalCount || 0}个)</span>
          <a
            key="primary3"
            className='export-btn'
            href={`/antelope-pay/statistics/product/download?productNo=${searchContent.productNo || ''}`}
          >
            导出
          </a>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1600 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getDiagnosticTasks,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
    </>
  );
};
