import { message as AntdMessage, Image, Select, Row, Col, Form, Anchor, Button, Table } from 'antd';
import ProCard from '@ant-design/pro-card';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getOpenInsideToken, getOpenInsideTokenV2 } from '@/services/digital-application';
import VerifyStepsDetail from '@/components/verify_steps';
import VerifyDescription from '@/components/verify_steps/verify_description/verify-description';
import CommonTitle from '@/components/verify_steps/common_title';
import { getDetail, updateVerityStatus } from '@/services/goods-verify';
import { getApplicationTypeList } from '@/services/digital-application';
import { routeName } from '../../../../../config/routes';
import { numdiv } from '@/utils/util';
import { get } from 'lodash';
const { Link } = Anchor;
const { Column } = Table;
const { Option } = Select;
const sc = scopedClasses('user-config-kechuang');

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<any>({});
  const [list, setList] = useState<any>([]);
  const [applicationTypeList, setApplicationTypeList] = useState<any>([]);
  const [appTypeId, setAppTypeId] = useState<string | number>('');

  const [form] = Form.useForm();
  const prepare = async () => {
    const productId = history.location.query?.productId as string;
    if (productId) {
      try {
        const { code, result, message } = await getDetail({ productId });
        if (code === 0) {
          setDetail(result);
          setAppTypeId(result?.payProduct?.appTypeId);
          const payProductApply = result?.payProductApply;
          payProductApply.reverse();
          const List = payProductApply.map((item: any) => ({
            title: (
              <CommonTitle
                title={item.handleUserName}
                detail={
                  item.handleType == 1 ? '提交审核' : item.handleResult === 1 ? '审核通过' : '拒绝'
                }
                time={item.applyTime}
                reason={item.handleReason}
                special={true}
                color={
                  item.handleType == 1 || item.handleResult === 1
                    ? 'rgba(0, 0, 0, 0.65)'
                    : 'rgb(255, 101, 179)'
                }
              />
            ),
            description: null,
            state: null,
          }));
          setList(List);
        } else {
          throw new Error(message);
        }
      } catch (error) {
        AntdMessage.error('服务器错误');
      } finally {
        setLoading(false);
      }
    }
  };
  const handleGetApplicationTypeList = () => {
    getApplicationTypeList().then(({ result }) => {
      setApplicationTypeList(result || []);
    });
  };
  const gobackList = () => {
    history.replace(routeName.GOODS_VERIFY);
  };
  const onSave = async () => {
    const id = history.location.query?.id as string;
    form
      .validateFields()
      .then(async ({ reason, result }) => {
        setLoading(true);
        const tooltipMessage = '提交';
        const params = {
          id,
          handleResult: result ? 1 : 0,
          handleReason: reason,
          // 修改商品类型
          productId: detail?.payProduct?.id,
          appId: detail?.payProduct?.appId,
          appTypeId: appTypeId,
        };
        const submitRes = await updateVerityStatus(params);
        if (submitRes.code === 0) {
          AntdMessage.success(`${tooltipMessage}成功`);
          form.resetFields();
          gobackList();
        } else {
          AntdMessage.error(`${tooltipMessage}失败，原因:{${submitRes.message}}`);
        }
        setLoading(false);
      })
      .catch(() => {});
  };
  function handleJumpLink(url: string) {
    getOpenInsideTokenV2(detail?.payProduct?.appId).then(({ result, code, message: msg }) => {
      if (code === 0) {
        if (!url) return;
        const token = url.indexOf('?') >= 0 ? `&token=${result}` : `?token=${result}`;

        window.open(url + token);
      } else {
        AntdMessage.error(msg);
      }
    });
  }
  useEffect(() => {
    prepare();
    handleGetApplicationTypeList();
  }, []);
  return (
    <PageContainer loading={loading} title={false}>
      <ProCard gutter={8} ghost>
        <ProCard direction="column" ghost gutter={[0, 8]}>
          <ProCard>
            <h2 id="goods-base-info">商品基础信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="商品来源">
                {detail?.payProduct?.productSource === 1 ? '应用管理库' : '其他'}
              </Form.Item>
              {detail?.payProduct?.productSource === 1 && [
                <Form.Item key="appName" label="数字化应用">
                  {detail?.payProduct?.appName}
                </Form.Item>,
                <Form.Item key="appType" label="商品服务端">
                  {detail?.payProduct?.appType === 0 ? (
                    <div>
                      <span>H5应用：</span>
                      <span>{detail?.payProduct?.appHomeUrl || '--'} </span>
                      <a onClick={() => handleJumpLink(detail?.payProduct?.appHomeUrl)}>查看</a>
                    </div>
                  ) : detail?.payProduct?.appType === 1 ? (
                    <div>
                      <span>WEB应用:</span>
                      <span>{detail?.payProduct?.pcHomeUrl || '--'} </span>
                      <a onClick={() => handleJumpLink(detail?.payProduct?.pcHomeUrl)}>查看</a>
                    </div>
                  ) : detail?.payProduct?.appType === 3 ? (
                    [
                      <div key="h5">
                        <span>H5应用：</span>
                        <span>{detail?.payProduct?.appHomeUrl || '--'} </span>
                        <a onClick={() => handleJumpLink(detail?.payProduct?.appHomeUrl)}>查看</a>
                      </div>,
                      <div key="pc">
                        <span>WEB应用:</span>
                        <span>{detail?.payProduct?.pcHomeUrl || '--'} </span>
                        <a onClick={() => handleJumpLink(detail?.payProduct?.pcHomeUrl)}>查看</a>
                      </div>,
                    ]
                  ) : (
                    '/'
                  )}
                </Form.Item>,
              ]}

              <Form.Item label="商品类型">
                {detail?.payProductApply?.isHandle === 1 ? (
                  get(
                    applicationTypeList.find((item: any) => appTypeId === item.id),
                    'name',
                    '--',
                  )
                ) : (
                  <Select
                    placeholder="请选择"
                    value={appTypeId}
                    onChange={(val) => {
                      setAppTypeId(val);
                    }}
                    allowClear
                    disabled={detail?.payProductApply?.isHandle === 1}
                    style={{ width: '200px' }}
                  >
                    {applicationTypeList.map((item: any) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="商品名称">{detail?.payProduct?.productName}</Form.Item>
              <Form.Item label="商品型号">{detail?.payProduct?.productModel}</Form.Item>
              <Form.Item label="商品简介">{detail?.payProduct?.productDesc}</Form.Item>
              <Form.Item label="商品封面图">
                <Image width={100} src={detail?.payProduct?.productPic} alt="图片损坏" />
              </Form.Item>
              <Form.Item label="商品轮播图">
                <Row gutter={[12, 12]}>
                  {detail?.payProduct?.banner.split(',').map((item: string) => (
                    <Col key={item}>
                      <Image width={100} src={item} alt="图片损坏" />
                    </Col>
                  ))}
                </Row>
              </Form.Item>
              <Form.Item label="免费试用">
                {detail?.payProduct?.isFree === 1 ? '是' : '否'}
              </Form.Item>
            </Form>
          </ProCard>

          <ProCard>
            <h2 id="goods-specs">商品规格信息</h2>
            <Table
              rowKey="id"
              bordered
              dataSource={detail?.payProductSpecsList || []}
              pagination={false}
              style={{ width: 400 }}
            >
              <Column title="规格" dataIndex="specsValue" />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="goods-price">商品价格信息</h2>
            <Table
              rowKey="id"
              bordered
              dataSource={detail?.payProductSpecsPriceList || []}
              pagination={false}
            >
              <Column title="规格" dataIndex={'specs'} />
              <Column title="订货编号" dataIndex="productNo" />
              <Column
                title="商品原价（元)"
                dataIndex="originPrice"
                render={(_) => numdiv(_, 100)}
              />
              <Column
                title="商品促销价（元)"
                dataIndex="salePrice"
                render={(_) => numdiv(_, 100)}
              />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="goods-argument">商品参数信息</h2>
            <Table
              rowKey="id"
              dataSource={detail?.payProductParamList || []}
              bordered
              pagination={false}
            >
              <Column title="名称" dataIndex={'name'} />
              <Column
                title="内容"
                dataIndex="content"
                render={(text: string, record: any) => {
                  if (record?.name === '可售范围') {
                    const areas = (text ?? '')
                      .split?.(';')
                      .map?.((code: string) =>
                        code.split('-').map?.((item) => item.split(':')?.[1]),
                      )
                      .map?.((area) => area.join('-'));
                    return (
                      <>
                        {(areas ?? []).map((area) => (
                          <div key={area}>{area}</div>
                        ))}
                      </>
                    );
                  }
                  return text;
                }}
              />
            </Table>
          </ProCard>
          <ProCard>
            <h2 id="goods-detail">商品详情</h2>
            <Form labelCol={{ span: 4 }} layout={'vertical'}>
              <Form.Item label="商品介绍">
                <div
                  dangerouslySetInnerHTML={{
                    __html: detail?.payProduct?.productContent || '/',
                  }}
                />
              </Form.Item>
              <Form.Item label="商品价值">
                <div
                  dangerouslySetInnerHTML={{
                    __html: detail?.payProduct?.productWorth || '/',
                  }}
                />
              </Form.Item>
              <Form.Item label="商品应用场景">
                <div
                  dangerouslySetInnerHTML={{
                    __html: detail?.payProduct?.productScene || '/',
                  }}
                />
              </Form.Item>
            </Form>
          </ProCard>
          <ProCard>
            <h2 id="anchor-details">审核</h2>
            {detail?.payProduct?.isExamine === 2 ? (
              <VerifyStepsDetail list={list} />
            ) : (
              <VerifyDescription form={form} mustFillIn />
            )}

            {detail?.payProduct?.isExamine === 1 && (
              <Button type="primary" style={{ marginRight: '10px' }} onClick={onSave}>
                提交
              </Button>
            )}

            <Button onClick={gobackList}>返回</Button>
          </ProCard>

          {/* <ProCard layout="center">
            {detail?.verityStatus !== 4 && detail?.verityStatus !== 5 && (
              <Button type="primary" style={{ marginRight: '10px' }} onClick={() => {}}>
                提交
              </Button>
            )}

            <Button onClick={() => history.goBack()}>返回</Button>
          </ProCard> */}
        </ProCard>
      </ProCard>
      <div style={{ width: 200, position: 'fixed', right: 10, top: 100 }}>
        <Anchor offsetTop={150} showInkInFixed={true} affix={false}>
          <Link href="#goods-base-info" title="商品基础信息" />
          <Link href="#goods-specs" title="商品规格信息" />
          <Link href="#goods-price" title="商品价格信息" />
          <Link href="#goods-argument" title="商品参数信息" />
          <Link href="#goods-detail" title="商品详情" />
        </Anchor>
      </div>
    </PageContainer>
  );
};
