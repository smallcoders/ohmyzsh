import { Row, Col, Button, Image, message, Spin } from 'antd';
import './application_info.less';
import VerifyStepsDetail from '@/components/verify_steps';
import CommonTitle from '@/components/verify_steps/common_title';
import { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { FooterToolbar } from '@ant-design/pro-components';
import { useHistory } from 'umi';
import type { Props } from './authorization_info';
import { getApplicationInfo } from '@/services/banking-loan';
import { regFenToYuan } from '@/utils/util';
import type BankingLoan from '@/types/banking-loan.d';
export default ({ id }: Props) => {
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
        <Row className="application-contain">
          <Col span={3}>
            <Image width={100} src={detail.path} />
          </Col>
          <Col span={21}>
            <Row className="orgName">{detail.orgName}</Row>
            <Row className="creditCode">{detail.creditCode}</Row>
            <Row>
              <Col span={6}>
                <span>法定代表人:{detail.legalPersonName || '--'}</span>
              </Col>
              <Col span={8}>
                <span>注册地址：{detail.registerAddress || '--'}</span>
              </Col>
              <Col span={10}>
                <span>
                  经营所在地：{detail.manageAddress || '--'}
                  {/* {detail.address || '--'} */}
                </span>
              </Col>
            </Row>
            <span className="application-state">{detail.applyStatus || '--'}</span>
          </Col>
        </Row>
        <div className="application-contain">
          <h2>申请信息</h2>
          <Row>
            <Col span={8}>
              <span>业务申请编号：{detail.applyNo || '--'}</span>
            </Col>
            <Col span={8}>
              <span>申请时间：{detail.createTime || '--'}</span>
            </Col>
            {detail.effectiveDate !== null && (
              <>
                <Col span={8}>
                  <span>保单拟生效时间：{detail.effectiveDate || '--'}</span>
                </Col>
                <Col span={8}>
                  <span>承保过该类产品：{detail.isAccept || '--'}</span>
                </Col>
              </>
            )}
            {detail.deadLine !== null && (
              <>
                <Col span={8}>
                  <span>申请金额：{regFenToYuan(detail?.applyAmount)}万元</span>
                </Col>
                <Col span={8}>
                  <span>拟融资期限：{detail.deadLine}</span>
                </Col>
              </>
            )}
            <Col span={8}>
              <span>联系人：{detail.name}</span>
            </Col>
            <Col span={8}>
              <span>联系电话：{detail.phone}</span>
            </Col>
            <Col span={8}>
              <span>产品名称：{detail.productName}</span>
            </Col>
            <Col span={8}>
              <span>金融机构：{detail.financialOrg}</span>
            </Col>
          </Row>
        </div>
        <div className="application-contain">
          <h2>平台响应信息</h2>
          <VerifyStepsDetail list={list} />
        </div>
        {/* <ProCard layout="center">
        <Button onClick={() => history.goBack()}>返回</Button>
      </ProCard> */}
        <FooterToolbar>
          <Button onClick={() => history.goBack()}>返回</Button>
        </FooterToolbar>
      </div>
    </Spin>
  );
};
