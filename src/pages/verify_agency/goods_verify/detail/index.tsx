import { message as AntdMessage, Image, Select, Row, Col, Form, Anchor, Button, Table, Cascader } from 'antd';
import ProCard from '@ant-design/pro-card';
import { history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { getOpenInsideToken, getOpenInsideTokenV2, getTryToken } from '@/services/digital-application';
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

const filterNames = ['交付方式', '商品付费方式'];

const deliveryTypes = ['本地部署', 'SaaS服务'];

enum PayMethodAppEnum {
  YEAR = 1,
  SET,
  TIME,
}

const commodityPaymentTypes = [
  { value: PayMethodAppEnum.YEAR, content: '元/年' },
  { value: PayMethodAppEnum.SET, content: '元/套' },
  { value: PayMethodAppEnum.TIME, content: '元/次' },
];

enum ExpireTimeEnum {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

const yearMap = {
  [ExpireTimeEnum.ONE]: '一',
  [ExpireTimeEnum.TWO]: '二',
  [ExpireTimeEnum.THREE]: '三',
  [ExpireTimeEnum.FOUR]: '四',
  [ExpireTimeEnum.FIVE]: '五',
};

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<any>({});
  const [list, setList] = useState<any>([]);
  const [applicationTypeList, setApplicationTypeList] = useState<any>([]);
  const [appTypeId, setAppTypeId] = useState<any[string | number]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    console.log('getTypeIdArray(result?.payProduct?.appTypeId)', detail?.payProduct?.appTypeId, getTypeIdArray(detail?.payProduct?.appTypeId), applicationTypeList)
    setAppTypeId(getTypeIdArray(detail?.payProduct?.appTypeId));
  }, [detail, applicationTypeList])

  const prepare = async () => {
    const productId = history.location.query?.productId as string;
    if (productId) {
      try {

        const { code, result, message } = await getDetail({ productId });
        if (code === 0) {
          setDetail(result);

          const payProductApply = result?.payProductApply;
          const list = [];
          if (payProductApply) {
            // 已审核的展示审核人
            if (payProductApply.isHandle === 1) {
              list.push({
                title: (
                  <CommonTitle
                    title={payProductApply.handleUserName}
                    detail={payProductApply.handleResult === 1 ? '审核通过' : '拒绝'}
                    time={payProductApply.handleTime}
                    reason={payProductApply.handleReason}
                    special={true}
                    color={payProductApply.handleResult === 1 ? '#25d48f' : '#e94d4d'}
                  />
                ),
                description: null,
                state: null,
              });
            }

            // 系统审核
            list.push({
              title: (
                <CommonTitle
                  title="系统审核"
                  detail={payProductApply.auditResult === 1 ? '审核通过' : '拒绝'}
                  time={payProductApply.auditTime}
                  reason={payProductApply.systemAudit}
                  special={true}
                  color={payProductApply.auditResult === 1 ? '#25d48f' : '#e94d4d'}
                />
              ),
              description: null,
              state: null,
            });
            // 提交人
            list.push({
              title: (
                <CommonTitle
                  title={payProductApply.userName}
                  detail="提交审核"
                  time={payProductApply.createTime}
                  reason=""
                  special={true}
                  color="rgba(0, 0, 0, 0.65)"
                />
              ),
              description: null,
              state: null,
            });
          }
          setList(list);
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
          appTypeId: appTypeId?.[appTypeId?.length - 1],
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
      .catch(() => { });
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

  function handleJumpTryLink(url: string) {
    getTryToken(detail?.payProduct?.appId).then(({ result, code, message: msg }) => {
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
    handleGetApplicationTypeList()
  }, []);

  const getTypeIdArray = (id: any) => {
    const arr: any[] = []
    const loop = (tree: any[]) => {
      tree.map((item) => {
        const pid = item?.pid || [item?.id]
        arr.push(item)
        if (item?.children && item?.children?.length > 0) {
          loop(item?.children?.map(p => {
            p.pid = [...pid]
            return p
          }))
        }
      })
    }
    loop(applicationTypeList)
    const selectItem = arr.find(p => p.id == id)
    console.log('applicationTypeList', applicationTypeList, selectItem)
    return [...(selectItem?.pid || []), selectItem?.id]
  }

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
                    <>
                      <div>
                        <span>H5应用：</span>
                        <span>{detail?.payProduct?.appHomeUrl || '--'} </span>
                        <a onClick={() => handleJumpLink(detail?.payProduct?.appHomeUrl)}>查看</a>
                      </div>
                    </>
                  ) : detail?.payProduct?.appType === 1 ? (
                    <><div>
                      <span>WEB应用:</span>
                      <span>{detail?.payProduct?.pcHomeUrl || '--'} </span>
                      <a onClick={() => handleJumpLink(detail?.payProduct?.pcHomeUrl)}>查看</a>
                    </div>
                    </>
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
                <Form.Item key="appType" label="商品体验地址">
                  {detail?.payProduct?.appType === 0 ? (
                    <>
                      <div>
                        <span>H5体验应用：</span>
                        <span>{detail?.payProduct?.appDemoUrl || '--'} </span>
                        <a onClick={() => handleJumpTryLink(detail?.payProduct?.appDemoUrl)}>查看</a>
                      </div>
                    </>
                  ) : detail?.payProduct?.appType === 1 ? (
                    <>
                      <div>
                        <span>WEB体验应用</span>
                        <span>{detail?.payProduct?.pcDemoUrl || '--'} </span>
                        <a onClick={() => handleJumpTryLink(detail?.payProduct?.pcDemoUrl)}>查看</a>
                      </div>
                    </>
                  ) : detail?.payProduct?.appType === 3 ? (
                    [

                      <div>
                        <span>H5体验应用：</span>
                        <span>{detail?.payProduct?.appDemoUrl || '--'} </span>
                        <a onClick={() => handleJumpTryLink(detail?.payProduct?.appDemoUrl)}>查看</a>
                      </div>,
                      <div>
                        <span>WEB体验应用</span>
                        <span>{detail?.payProduct?.pcDemoUrl || '--'} </span>
                        <a onClick={() => handleJumpTryLink(detail?.payProduct?.pcDemoUrl)}>查看</a>
                      </div>,
                    ]
                  ) : (
                    '/'
                  )}
                </Form.Item>,
              ]}

              <Form.Item label="商品类型">
                {detail?.payProductApply?.isHandle === 1 ? detail?.payProduct?.typeName : (
                  <Cascader
                    onChange={(val) => {
                      setAppTypeId(val);
                    }}
                    value={appTypeId}
                    style={{ width: '300px' }}
                    fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                    options={applicationTypeList}
                    placeholder="请选择"
                  />
                  // <Select
                  //   placeholder="请选择"
                  //   value={appTypeId}
                  //   onChange={(val) => {
                  //     setAppTypeId(val);
                  //   }}
                  //   allowClear
                  //   disabled={detail?.payProductApply?.isHandle === 1}
                  //   style={{ width: '200px' }}
                  // >
                  //   {applicationTypeList.map((item: any) => (
                  //     <Option key={item.id} value={item.id}>
                  //       {item.name}
                  //     </Option>
                  //   ))}
                  // </Select>
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
              <Form.Item label="交付方式">
                {deliveryTypes[detail?.payProduct?.deliverMethodApp] || '--'}
              </Form.Item>
              <Form.Item label="付费方式">
                {commodityPaymentTypes.find(
                  (type) => type?.value === detail?.payProduct?.payMethodApp,
                )?.content || '--'}
              </Form.Item>
              {detail?.payProduct?.productSource === 1 && (
                <Form.Item label="免费试用">
                  {detail?.payProduct?.freeDayAppStr ? `${detail?.payProduct?.freeDayAppStr}` : '--'}
                </Form.Item>
              )}
            </Form>
          </ProCard>

          <ProCard>
            <h2 id="goods-specs">商品规格信息</h2>
            <Table
              rowKey="id"
              bordered
              dataSource={detail?.payProductSpecsListV2 || []}
              pagination={false}
              style={{ width: 400 }}
            >
              <Column title="规格" dataIndex="specsValue" />
              <Column
                title="规格信息"
                dataIndex="type"
                render={(text, record: any) => {
                  switch (text) {
                    case PayMethodAppEnum.YEAR:
                      return `用户数：${record?.userNum > 0 ? `${record?.userNum}人` : '无限制'
                        }；有效时间：${record?.expireTime > 0 ? `${yearMap[record?.expireTime]}年` : '无限制'
                        }`;
                    case PayMethodAppEnum.SET:
                      return `使用次数：${record?.count > 0 ? `${record?.count}次` : '无限制'
                        }；有效时间：${record?.expireTime > 0 ? `${yearMap[record?.expireTime]}年` : '无限制'
                        }`;
                    case PayMethodAppEnum.TIME:
                      return `使用次数：${record?.count > 0 ? `${record?.count}次` : '无限制'}`;
                    default:
                      return '--';
                  }
                }}
              />
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
              dataSource={(detail?.payProductParamList || [])?.filter(
                (item: Record<string, string | number>) => !filterNames.includes(`${item?.name}`),
              )}
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
            {detail?.payProductApply?.isHandle === 1 ? (
              <VerifyStepsDetail list={list} />
            ) : (
              <div>
                <VerifyDescription form={form} mustFillIn />
                <VerifyStepsDetail list={list} />
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              {detail?.payProductApply?.isHandle === 0 && (
                <Button type="primary" style={{ marginRight: '10px' }} onClick={onSave}>
                  提交
                </Button>
              )}

              {/* <Button onClick={gobackList}>返回</Button> */}
            </div>
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
