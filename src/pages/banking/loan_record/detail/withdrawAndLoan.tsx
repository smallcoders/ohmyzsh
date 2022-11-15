import { Row, Col, Anchor, Button, Form, Image, Space, Table, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './withdrawAndLoan.less';
import scopedClasses from '@/utils/scopedClasses';
const sc = scopedClasses('withdraw-loan-info');
import React, { useEffect, useState } from 'react';
import SelfTable from '@/components/self_table';
import type BankingLoan from '@/types/banking-loan.d';
import { history } from 'umi';
export default () => {
  const [dataSource, setDataSource] = useState<BankingLoan.LoanContent[]>([]);
  const getPages = async () => {
    try {
      const result = [{}, {}];
      setDataSource(result);
      // const { result, code } = await getProviderTypesPage({});
      // if (code === 0) {
      //   setDataSource(result);
      // } else {
      //   message.error(`请求分页数据失败`);
      // }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPages();
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
      dataIndex: 'status',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '文件名称',
      dataIndex: 'filename',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '校验不通过原因',
      dataIndex: 'reason',
      width: 110,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '发票类型',
      dataIndex: 'type',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '开票日期',
      dataIndex: 'time',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '发票代码',
      dataIndex: 'code',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '价税合计金额(元)',
      dataIndex: 'money',
      width: 110,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '不含税金额(元)',
      dataIndex: 'money2',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '税额(元)',
      dataIndex: 'money3',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '购方名称',
      dataIndex: 'name',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
    {
      title: '购房税号',
      dataIndex: 'no',
      width: 100,
      render: (_: string) => {
        return <div>{_ || '--'}</div>;
      },
    },
  ];
  return (
    <PageContainer
      footer={[<Button onClick={() => history.goBack()}>返回</Button>]}
      header={{ title: '' }}
    >
      <div className={sc('contain')}>
        <div>
          <p className={sc('contain-title')}>企业提款申请信息</p>
          <Row>
            <Col span={8}>
              <label className={sc('contain-label')}>提款申请编号：</label>
              <div className={sc('contain-wrap')}>系统自动生成</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>提款申请状态：</label>
              <div className={sc('contain-wrap')}>已放款</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>融资天数：</label>
              <div className={sc('contain-wrap')}>60天</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>提款金额：</label>
              <div className={sc('contain-wrap')}>10.00万元</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>提款金额（大写）：</label>
              <div className={sc('contain-wrap')}>壹拾万元整</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>执行年利率：</label>
              <div className={sc('contain-wrap')}>3.56%</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>股东会决议：</label>
              <div className={sc('contain-wrap')}>
                <Image
                  width={30}
                  src={
                    'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg'
                  }
                />
                <Button className={sc('contain-wrap-button')} type="primary" ghost size="small">
                  下载
                </Button>
              </div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>应收账款合同：</label>
              <div className={sc('contain-wrap')}>
                <Image
                  width={30}
                  src={
                    'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg'
                  }
                />
                <Button className={sc('contain-wrap-button')} type="primary" ghost size="small">
                  下载
                </Button>
              </div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>联系电话：</label>
              <div className={sc('contain-wrap')}>13267678989</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>电子邮箱：</label>
              <div className={sc('contain-wrap')}>13267678989@qq.com</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>邮编：</label>
              <div className={sc('contain-wrap')}>342987</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>地址：</label>
              <div className={sc('contain-wrap')}>安徽省-合肥市-蜀山区 1号街道</div>
            </Col>
            <div className={sc('contain-table')}>
              <label className={sc('contain-label')}>应收账款发票：</label>
              <div className={sc('contain-table-body')}>
                <SelfTable
                  bordered
                  scroll={{ x: 1500 }}
                  columns={columns}
                  rowKey={'id'}
                  dataSource={dataSource}
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
              <div className={sc('contain-wrap')}>银行返回，没有展示暂无</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>实际放款日期：</label>
              <div className={sc('contain-wrap')}>2022-10-11</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>放款金额：</label>
              <div className={sc('contain-wrap')}>10万元</div>
            </Col>
            <Col span={8}>
              <label className={sc('contain-label')}>执行年利率：</label>
              <div className={sc('contain-wrap')}>3.65%</div>
            </Col>
          </Row>
        </div>
      </div>
    </PageContainer>
  );
};
