import useQuery from '@/hooks/useQuery';
import { queryProductDetail } from '@/services/commodity';
import type DataCommodity from '@/types/data-commodity';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Anchor, Button, Form, Image, Space, Table, Tag, Select, Modal } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'umi';
import VerifyStepsDetail from '@/components/verify_steps';
import CommonTitle from '@/components/verify_steps/common_title';
import Common from '@/types/common.d';
import { handleAudit, httpGetAuditList } from '@/services/audit';
import VerifyDescription from '../verify_steps/verify_description/verify-description';
const { Column } = Table;
const { Link } = Anchor;

const updateOptions = [
  {
    label: '需求已确认',
    value: 1,
  },
  {
    label: '匹配金融机构产品服务中',
    value: 2,
  },
  {
    label: '已提供金融解决方案',
    value: 3,
  },
  {
    label: '已提供金融解决方案',
    value: 4,
  },
];

export default () => {
  const history = useHistory();
  const query = useQuery();
  const [loading, setLoading] = useState(true);
  const [commodity, setCommodity] = useState<{
    payProduct: DataCommodity.ProductInfo;
    payProductSpecsList: DataCommodity.SpecInfo[];
    payProductSpecsPriceList: DataCommodity.PriceInfo[];
    payProductParamList: DataCommodity.ParamInfo[];
  }>();
  const [list, setList] = useState<any>([]);
  /**
   * 新建窗口的弹窗
   *  */
  const [updateModalVisible, setModalVisible] = useState<boolean>(false);
  const init = useCallback(async () => {
    const commodityRes = await queryProductDetail(query.id).finally(() => setLoading(false));
    setLoading(false);
    if (!commodityRes.code) {
      setCommodity(commodityRes.result);
    }
  }, [query]);

  const price = useMemo(() => {
    return commodity?.payProductSpecsPriceList.map((item) => {
      const specs = item.specs.split(',').filter((v) => v.trim());
      const specsData: Record<string, string> = {};
      specs.forEach((spec, index) => {
        specsData[`specs${index}`] = spec;
      });

      if (specs.length === 0) {
        specsData.specs0 = '/';
      }
      return {
        ...item,
        ...specsData,
      };
    });
  }, [commodity]);

  const specsTitle = useMemo(() => {
    const titles = (commodity?.payProductSpecsPriceList[0]?.specsTitle || '')
      .split(',')
      .filter((item) => item.trim());

    if (titles?.length) {
      return titles.map((item, index) => {
        return <Column title={`规格(${item})`} dataIndex={`specs${index}`} key={item} />;
      });
    }

    return <Column title="规格(无)" dataIndex="specs0" />;
  }, [commodity]);

  const renderHtml = useCallback((html) => {
    return {
      __html: html,
    };
  }, []);

  const hanldeGetAuditDetail = async () => {
    try {
      // const res = await httpGetAuditList({ auditId });
      // if (res?.code === 0) {
      //   const result = res?.result;
      //   if (!result) return;
      setList(
        [
          {
            userName: '112',
            state: '112',
            operationTime: '112',
            description: '112',
          },
          {
            userName: '34',
            state: '11122',
            operationTime: '112',
            description: '112',
          },
        ].map(
          (item: {
            userName: string;
            state: string;
            operationTime: string | undefined;
            description: string | undefined;
          }) => {
            return {
              title: (
                <CommonTitle
                  title={item.userName}
                  detail={'fasfs'}
                  time={item.operationTime}
                  special={false}
                  reason={item.description}
                  color={item.state === Common.AuditStatus.AUDIT_REJECTED ? '#FF65B3' : ''}
                />
              ),
              description: null,
              state: item.state,
            };
          },
        ),
      );
      // } else {
      //   console.log('获取审核信息列表失败');
      // }
    } catch {
      console.log('获取审核信息列表失败');
    }
  };
  const updateStatus = () => {};
  const getUpdateModal = () => {
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
        <Select placeholder="请选择" style={{ width: '100%' }}>
          {updateOptions.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    );
  };
  useEffect(() => {
    init();
    hanldeGetAuditDetail();
  }, [init]);

  return (
    <PageContainer loading={loading} title={false}>
      <ProCard gutter={8} ghost>
        <ProCard direction="column" ghost gutter={[0, 8]}>
          <ProCard>
            <h2 id="anchor-base-info">金融需求信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="金融需求编号">{commodity?.payProduct.productName}</Form.Item>
              <Form.Item label="需求提交日期">{commodity?.payProduct.productModel}</Form.Item>
              <Form.Item label="需求登记产品信息">
                {commodity?.payProduct.saleContent?.map((item) => {
                  return <Tag key={item.id}>{item.label}</Tag>;
                })}
              </Form.Item>
              <Form.Item label="拟融资金额">
                {commodity?.payProduct.serverContent?.map((item) => {
                  return <Tag key={item.id}>{item.label}</Tag>;
                })}
              </Form.Item>
              <Form.Item label="融资期限">{commodity?.payProduct.productOrg}</Form.Item>
              <Form.Item label="融资用途">
                <Image width={100} src={commodity?.payProduct.productPic} />
              </Form.Item>
              <Form.Item label="资金需求紧迫度">
                <Image.PreviewGroup>
                  <Space>
                    {commodity?.payProduct.banner?.split(',').map((url) => {
                      return <Image width={100} src={url} key={url} />;
                    })}
                  </Space>
                </Image.PreviewGroup>
              </Form.Item>
              <Form.Item label="企业资产信息">{commodity?.payProduct?.supplierName}</Form.Item>
            </Form>
          </ProCard>
          <ProCard>
            <h2 id="anchor-specs">需求企业信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="申请">{commodity?.payProduct.productName}</Form.Item>
              <Form.Item label="联系电话">{commodity?.payProduct.productModel}</Form.Item>
              <Form.Item label="组织名称">
                {commodity?.payProduct.saleContent?.map((item) => {
                  return <Tag key={item.id}>{item.label}</Tag>;
                })}
              </Form.Item>
              <Form.Item label="统一社会信用代码">
                {commodity?.payProduct.serverContent?.map((item) => {
                  return <Tag key={item.id}>{item.label}</Tag>;
                })}
              </Form.Item>
              <Form.Item label="企业所在地">{commodity?.payProduct.productOrg}</Form.Item>
            </Form>
          </ProCard>

          <ProCard>
            <h2 id="anchor-details">平台响应信息</h2>
            <VerifyStepsDetail list={list} />
          </ProCard>

          <ProCard layout="center">
            <Button
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={() => setModalVisible(true)}
            >
              更新处理状态
            </Button>
            <Button onClick={() => history.goBack()}>返回</Button>
          </ProCard>
        </ProCard>
        <ProCard colSpan="200px" />
      </ProCard>
      <div style={{ width: 200, position: 'fixed', right: 10, top: 100 }}>
        <Anchor offsetTop={150} showInkInFixed={true} affix={false}>
          <Link href="#anchor-base-info" title="商品基础信息" />
          <Link href="#anchor-specs" title="商品规格信息" />
          <Link href="#anchor-details" title="平台响应信息" />
        </Anchor>
      </div>
      {getUpdateModal()}
    </PageContainer>
  );
};
