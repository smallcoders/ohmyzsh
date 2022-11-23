import { Row, Col, message, Anchor, Button, Form, Image, Space, Table, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './withdrawAndLoan.less';
import scopedClasses from '@/utils/scopedClasses';
const sc = scopedClasses('withdraw-loan-info');
import React, { useEffect, useState } from 'react';
import SelfTable from '@/components/self_table';
import type BankingLoan from '@/types/banking-loan.d';
import { getTakeDetail } from '@/services/banking-loan';
import { history } from 'umi';
import { regFenToYuan, priceUppercase } from '@/utils/util';
import patchDownloadFile from '@/utils/patch-download-file';
export default () => {
  const { id } = history.location.query as any;
  const [dataSource, setDataSource] = useState<BankingLoan.LoanContent[]>([]);
  const [detail, setDetail] = useState<any>({});
  const getDetail = async () => {
    try {
      const { result, code } = await getTakeDetail({ id });
      if (code === 0) {
        setDetail(result);
      } else {
        message.error(`请数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDetail();
  }, []);
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: BankingLoan.LoanContent, index: number) => index + 1,
    },
    {
      title: '发票审核状态',
      dataIndex: 'checkStatus',
      width: 120,
      render: (_: number) => {
        return <div>{_ === 0 ? '通过' : '不通过'}</div>;
      },
    },
    {
      title: '文件名称',
      dataIndex: 'realName',
      width: 110,
      isEllipsis: true,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '校验不通过原因',
      dataIndex: 'errorReason',
      isEllipsis: true,
      width: 130,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '发票类型',
      dataIndex: 'type',
      width: 100,
      render: (_: number) => {
        return <div>{_ === 1 ? '发票' : '--'}</div>;
      },
    },
    {
      title: '开票日期',
      dataIndex: 'billingDate',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '发票代码',
      dataIndex: 'invoiceCode',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '价税合计金额(元)',
      dataIndex: 'amount',
      width: 130,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '不含税金额(元)',
      dataIndex: 'totalAmount',
      width: 130,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '税额(元)',
      dataIndex: 'tax',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '购方名称',
      dataIndex: 'companyName',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '购房税号',
      dataIndex: 'taxNumber',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 75,
      fixed: 'right',
      render: (_: any, item: any) => (
        <Button
          size="small"
          type="link"
          onClick={() => {
            window.open(item.jysFile);
          }}
        >
          预览
        </Button>
      ),
    },
  ];
  return (
    <PageContainer
      footer={[<Button onClick={() => history.goBack()}>返回</Button>]}
      header={{ title: '' }}
    >
      <div className={sc('contain')} key="detail">
        <div>
          <p className={sc('contain-title')}>企业提款申请信息</p>
          <Row>
            <Col span={8}>
              <label className={sc('contain-label')}>提款申请编号：</label>
              <div className={sc('contain-wrap')}>{detail?.loanBatchNo || '--'}</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>提款申请状态：</label>
              <div className={sc('contain-wrap')}>{detail?.busiStatusContent}</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>融资天数：</label>
              <div className={sc('contain-wrap')}>{detail?.duration}天</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>提款金额：</label>
              <div className={sc('contain-wrap')}>{regFenToYuan(detail?.takeMoney)}万元</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>提款金额（大写）：</label>
              <div className={sc('contain-wrap')}>
                {priceUppercase(regFenToYuan(detail?.takeMoney, 1))}
              </div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>执行年利率：</label>
              <div className={sc('contain-wrap')}>{detail?.rate}%</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>股东会决议：</label>
              <div className={sc('contain-wrap')}>
                <Image width={30} src={detail?.jysFile} />
                {/* <Button
                  className={sc('contain-wrap-button')}
                  type="primary"
                  onClick={() => {
                  }}
                  ghost
                  size="small"
                >
                  下载
                </Button> */}
              </div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>应收账款合同：</label>
              <div className={sc('contain-wrap')}>
                <Image width={30} src={detail?.contractFile} />
                {/* <Button
                  className={sc('contain-wrap-button')}
                  type="primary"
                  onClick={() => {
                    window.open(detail?.contractFile);
                  }}
                  ghost
                  size="small"
                >
                  下载
                </Button> */}
              </div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>联系电话：</label>
              <div className={sc('contain-wrap')}>{detail?.phone}</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>电子邮箱：</label>
              <div className={sc('contain-wrap')}>{detail?.email}</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>邮编：</label>
              <div className={sc('contain-wrap')}>{detail?.postal || '--'}</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>地址：</label>
              <div className={sc('contain-wrap')}>{detail?.detailAddress}</div>
            </Col>
            <div className={sc('contain-table')}>
              <label className={sc('contain-label')}>应收账款发票：</label>
              <div className={sc('contain-table-body')}>
                <SelfTable
                  bordered
                  scroll={{ x: 1600 }}
                  columns={columns}
                  rowKey={'id'}
                  dataSource={detail?.receiptInvoice || []}
                  pagination={false}
                />
              </div>
            </div>
          </Row>
        </div>
        <div>
          <p className={sc('contain-title')}>金融机构放款信息</p>
          <Row>
            <Col span={8}>
              <label className={sc('contain-label')}>借据编号：</label>
              <div className={sc('contain-wrap')}>{detail?.debitNo || '暂无'}</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>实际放款日期：</label>
              <div className={sc('contain-wrap')}>{detail?.borrowStartDate || '--'}</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>放款金额：</label>
              <div className={sc('contain-wrap')}>{regFenToYuan(detail?.takeMoney)}万元</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>执行年利率：</label>
              <div className={sc('contain-wrap')}>{detail?.rate}%</div>
            </Col>
          </Row>
        </div>
      </div>
    </PageContainer>
  );
};
