import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
  Dropdown,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import type Common from '@/types/common';
import type BankingSerivce from '@/types/banking-service';

import moment from 'moment';
import SelfTable from '@/components/self_table';
import type LogoutVerify from '@/types/user-config-logout-verify';

import { routeName } from '@/../config/routes';
import {
  getBankingServicePage,
  getProductList,
  updateVerityStatus,
} from '@/services/banking-service';
const sc = scopedClasses('user-config-logout-verify');

const verityStatusOptions: { label: string; value: number; disabled: boolean }[] = [
  {
    label: '待平台处理',
    value: 1,
    disabled: false,
  },
  {
    label: '需求已确认',
    value: 2,
    disabled: false,
  },
  {
    label: '匹配金融机构产品服务中',
    value: 3,
    disabled: false,
  },
  {
    label: '已提供金融解决方案',
    value: 4,
    disabled: false,
  },
  {
    label: '暂无适宜的金融解决方案',
    value: 5,
    disabled: false,
  },
];
const serialize = function (obj: any): string {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p) && obj[p]) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

const downloadLink = (url: string): void => {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export default () => {
  const [dataSource, setDataSource] = useState<BankingSerivce.Content[]>([]);
  const [searchContent, setSearChContent] = useState<BankingSerivce.SearchContent>({});
  const history = useHistory();
  const [searchForm] = Form.useForm();
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const [productOptions, setProductOptions] = useState<any[]>([]);

  const getProductOptions = async () => {
    try {
      const { result, code, message } = await getProductList();
      if (code === 0) {
        setProductOptions(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getBankingServicePage({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: LogoutVerify.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '模板名称',
      dataIndex: 'pageName',
      width: 200,
    },
    {
      title: '描述信息',
      dataIndex: 'pageDesc',
      isEllipsis: true,
      width: 200,
      render: (_: number, record: any) => {
        if(record.type === 2){

          return '/'
        }
        return (_ / 100).toFixed(2)
      },
    },
    {
      title: '模板状态',
      dataIndex: 'status',
      width: 200,
    },

    {
      title: '最新操作时间',
      dataIndex: 'createTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <>
            <Button
              size="small"
              type="link"
              onClick={() => {
                history.push(`${routeName.PAGE_CREAT_MANAGE_PUBLISH}`);
              }}
            >
              查看链接
            </Button>
            <Button
              size="small"
              type="link"
              onClick={() => {
                history.push(`${routeName.PAGE_CREAT_MANAGE_PAGE_DATA}`);
              }}
            >
              数据管理
            </Button>
            {/*<Dropdown menu={{ items }}>*/}
            {/*  <a>*/}
            {/*    More <DownOutlined />*/}
            {/*  </a>*/}
            {/*</Dropdown>*/}
            <Button
              size="small"
              type="link"
              onClick={() => {
              }}
            >
              下架
            </Button>
            <Button
              size="small"
              type="link"
              onClick={() => {
                history.push(`${routeName.PAGE_CREAT_MANAGE_EDIT}`);
              }}
            >
              编辑
            </Button>
          </>
        )
      },
    },
  ];

  const getSearchQuery = (): {
    orgName?: string;
    productId?: number;
    verityStatus?: number;
    dateStart?: string;
    dateEnd?: string;
  } => {
    const search = searchForm.getFieldsValue();
    if (search.time) {
      search.dateStart = moment(search.time[0]).format('YYYY-MM-DDTHH:mm:ss');
      search.dateEnd = moment(search.time[1]).format('YYYY-MM-DDTHH:mm:ss');
    }
    delete search.time;
    return search;
  };
  useEffect(() => {
    getProductOptions();
  }, []);
  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="pageName" label="模板名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="模板状态">
                <Select placeholder="请选择" allowClear>
                  {productOptions.map((item) => (
                    <Select.Option value={item.productId}>{item.productName}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="updateTime" label="最新操作时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = getSearchQuery();
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
          <span>模版列表</span>
          <Button
            type="primary"
            onClick={() => {
              history.push(`${routeName.PAGE_CREAT_MANAGE_EDIT}`);
            }}
          >
            新建模版
          </Button>
        </div>
      </div>

      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey="id"
          bordered
          scroll={{ x: 1480 }}
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
