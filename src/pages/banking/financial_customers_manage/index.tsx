import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
  Modal,
} from 'antd';
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
  const [selectRow, setSelectRow] = useState<BankingSerivce.Content>({});
  const [updateSelStatus, setUpdateSelStatus] = useState<number | undefined>();
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

  /**
   * 新建窗口的弹窗
   *  */
  const [updateModalVisible, setModalVisible] = useState<boolean>(false);
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
      title: '申请人姓名',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '申请金额（元）',
      dataIndex: 'amount',
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
      title: '拟融资期限',
      dataIndex: 'termContent',
      isEllipsis: true,
      width: 200,
      render: (_: any, record: any) => {
        if(record.type === 2){

          return '/'
        }
        return _
      },
    },
    {
      title: '申请金融产品',
      dataIndex: 'productName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '组织名称',
      dataIndex: 'orgName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'verityStatusContent',
      isEllipsis: true,
      width: 200,
    },

    {
      title: '申请时间',
      dataIndex: 'createTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      fixed: 'right',
      render: (_: any, record: any) => (
        <>
          <Button
            size="small"
            type="link"
            onClick={() => {
              localStorage.setItem('banking_detail', JSON.stringify(record));
              window.open(`${routeName.BANKING_SERVICE_DETAIL}`);
            }}
          >
            详情
          </Button>
          {record.verityStatus !== 4 && record.verityStatus !== 5 && (
            <Button
              size="small"
              type="link"
              onClick={() => {
                setSelectRow(record);
                setModalVisible(true);
              }}
            >
              更新处理状态
            </Button>
          )}
        </>
      ),
    },
  ];
  const getUpdateOptions = () => {
    const { verityStatus = null } = selectRow;
    return verityStatusOptions.map((item) => {
      item.disabled = true;
      if (verityStatus === 1 && item.value === 2) {
        item.disabled = false;
      }
      if (verityStatus === 2 && item.value === 3) {
        item.disabled = false;
      }
      if (verityStatus === 3 && (item.value === 4 || item.value === 5)) {
        item.disabled = false;
      }
      return item;
    });
  };
  const updateStatus = async () => {
    const { id } = selectRow;
    if (!updateSelStatus) {
      antdMessage.warn(`请选择`);
      return;
    }
    try {
      const { message, code } = await updateVerityStatus({
        id,
        verityStatus: updateSelStatus,
      });
      if (code === 0) {
        antdMessage.success('更新成功');
        setModalVisible(false);
        setUpdateSelStatus(undefined);
        getPage();
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  const getUpdateModal = () => {
    const updateOptions = getUpdateOptions();
    return (
      <Modal
        title={'更新处理状态'}
        width="400px"
        visible={updateModalVisible}
        maskClosable={false}
        onCancel={() => {
          setModalVisible(false);
        }}
        onOk={async () => {
          await updateStatus();
        }}
      >
        <Select
          placeholder="请选择"
          style={{ width: '100%' }}
          value={updateSelStatus}
          onChange={(val) => {
            setUpdateSelStatus(val);
          }}
        >
          {updateOptions.map((item) => {
            return (
              <Select.Option key={item.value} value={item.value} disabled={item.disabled}>
                {item.label}
              </Select.Option>
            );
          })}
        </Select>
      </Modal>
    );
  };

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
  const getExportUrl = (): string => {
    const search = getSearchQuery();
    return `/antelope-finance/demand/mng/exportDemandList?${serialize(search)}`;
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
              <Form.Item name="orgName" label="组织名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="productId" label="产品名称">
                <Select placeholder="请选择" allowClear>
                  {productOptions.map((item) => (
                    <Select.Option value={item.productId}>{item.productName}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="提交时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="verityStatus" label="状态">
                <Select placeholder="请选择" allowClear>
                  {verityStatusOptions.map((item) => (
                    <Select.Option value={item.value}>{item.label}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

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
          <span>金融需求列表(共{pageInfo.totalCount || 0}个)</span>
          <Button
            type="primary"
            onClick={() => {
              downloadLink(getExportUrl());
            }}
          >
            导出
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
      {getUpdateModal()}
    </PageContainer>
  );
};
