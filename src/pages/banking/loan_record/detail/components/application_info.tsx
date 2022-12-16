import { Row, Col, Button, Image, message, Spin } from 'antd';
import './application_info.less';
import VerifyStepsDetail from './verify-steps/verify-steps';
import CommonTitle from '@/components/verify_steps/common_title';
import { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { FooterToolbar } from '@ant-design/pro-components';
import { useHistory } from 'umi';
import type { Props } from './authorization_info';
import { getApplicationInfo } from '@/services/banking-loan';
import { regFenToYuan } from '@/utils/util';
import type BankingLoan from '@/types/banking-loan.d';
export default ({ id, left, loanType }: Props) => {
  const history = useHistory();
  const [list, setList] = useState<any>([]);
  const [detail, setDetail] = useState<BankingLoan.ApplicationInfoContent>({});
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const getInfo = async () => {
    try {
      setDetailLoading(true);
      const { result, code } = await getApplicationInfo({ id });
      setDetailLoading(false);
      if (code === 0) {
        const { handleRecords } = result;
        setDetail(result);
        setList(
          handleRecords.map((item: BankingLoan.handleRecords) => {
            return {
              title: (
                <CommonTitle
                  title={item.userName}
                  detail={item.flowDesc}
                  time={item.createTime}
                  special={true}
                  color={item.flowDesc?.includes('失败') ? '#FF4F17' : '#1E232A'}
                  reason={item.failReason}
                />
              ),
            };
          }),
        );
      } else {
        message.error(`请求数据失败`);
      }
    } catch (error) {
      setDetailLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getInfo();
  }, []);
  return (
    <Spin spinning={detailLoading}>
      <div className="application">
        <div className="application-contain">
          <div className="application-contain-img">
            <Image width={'120px'} height={'120px'} src={detail.path} />
          </div>
          <div className="application-contain-right">
            <div className="orgName-status">
              <div className="orgName">{detail.orgName}</div>
              <div
                className={`application-state ${
                  detail.applyStatus === '待授信'
                    ? 'huang'
                    : detail.applyStatus === '授信失败'
                    ? 'cheng'
                    : ''
                }`}
              >
                {detail.applyStatus || '--'}
              </div>
            </div>
            <div className="creditCode">{detail.creditCode}</div>
            <Row>
              <Col span={6}>
                <span>法定代表人：</span>
                <span>{detail.legalPersonName || '--'}</span>
              </Col>
              <Col span={9}>
                <span>注册地址：</span>
                <span>{detail.registerAddress || '--'}</span>
              </Col>
              <Col span={9}>
                <span>经营所在地：</span>
                <span>
                  {detail.manageAddress || '--'}
                  {/* {detail.address || '--'} */}
                </span>
              </Col>
            </Row>
          </div>
        </div>
        <div className="application-contain main">
          <h2>申请信息</h2>
          <Row>
            <Col span={8}>
              <span>业务申请编号：</span>
              <span>{detail.applyNo || '--'}</span>
            </Col>
            <Col span={8}>
              <span>申请时间：</span>
              <span>{detail.createTime || '--'}</span>
            </Col>
            {loanType === '5' && (
              <>
                <Col span={8}>
                  <span>保单拟生效时间：</span>
                  <span>{detail.effectiveDate || '--'}</span>
                </Col>
                <Col span={8}>
                  <span>承保过该类产品：</span>
                  <span>{detail.isAccept || '--'}</span>
                </Col>
              </>
            )}
            {loanType !== '5' && (
              <>
                <Col span={8}>
                  <span>申请金额：</span>
                  <span>{regFenToYuan(detail?.applyAmount)}万元</span>
                </Col>
                <Col span={8}>
                  <span>拟融资期限：</span>
                  <span>{detail.deadLine}</span>
                </Col>
              </>
            )}
            <Col span={8}>
              <span>联系人：</span>
              <span>{detail.name}</span>
            </Col>
            <Col span={8}>
              <span>联系电话：</span>
              <span>{detail.phone}</span>
            </Col>
            <Col span={8}>
              <span>产品名称：</span>
              <span>{detail.productName}</span>
            </Col>
            <Col span={8}>
              <span>金融机构：</span>
              <span>{detail.financialOrg}</span>
            </Col>
          </Row>
        </div>
        <div className="application-contain main">
          <h2>平台响应信息</h2>
          <VerifyStepsDetail list={list} />
        </div>
        {/* <ProCard layout="center">
        <Button onClick={() => history.goBack()}>返回</Button>
      </ProCard> */}
        <FooterToolbar
          style={{
            height: '88px',
            left: left + 'px',
            width: `calc(100% - ${left}px)`,
          }}
        >
          <Button size="large" onClick={() => history.goBack()}>
            返回
          </Button>
        </FooterToolbar>
      </div>
    </Spin>
  );
};
