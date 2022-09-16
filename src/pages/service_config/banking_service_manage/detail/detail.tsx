import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Anchor, Button, Form, Select, Modal, message as antdMessage } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'umi';
import VerifyStepsDetail from '@/components/verify_steps';
import CommonTitle from '@/components/verify_steps/common_title';

import { getDemandRecordList, updateVerityStatus } from '@/services/banking-service';

const { Link } = Anchor;

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
    label: '已提供金融解决方案',
    value: 5,
    disabled: false,
  },
];

export default () => {
  let detaildata = {};
  try {
    const detailJson: any = localStorage.getItem('banking_detail');
    detaildata = JSON.parse(detailJson);
  } catch (error) {}
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [list, setList] = useState<any>([]);
  const [detail, setDetail] = useState<any>(detaildata);
  const [updateSelStatus, setUpdateSelStatus] = useState<number | undefined>();
  /**
   * 新建窗口的弹窗
   *  */
  const [updateModalVisible, setModalVisible] = useState<boolean>(false);

  const hanldeGetDemandRecord = async () => {
    try {
      setLoading(true);
      const { id } = detail;
      const { code, message, result } = await getDemandRecordList({ demandId: id });
      setLoading(false);
      if (code === 0) {
        // 更新详情的 状态
        const lastVerityStatus = result[0].verityStatus;
        const updateDetail = {
          ...detail,
          verityStatus: lastVerityStatus,
        };
        localStorage.setItem('banking_detail', JSON.stringify(updateDetail));
        setDetail(updateDetail);
        setList(
          result.map(
            (item: {
              userName: string;
              createTime: string | undefined;
              verityStatusContent: string | undefined;
              verityStatus: number | undefined;
            }) => {
              return {
                title: (
                  <CommonTitle
                    title={item.userName}
                    detail={item.verityStatusContent}
                    time={item.createTime}
                    special={false}
                  />
                ),
                description: null,
                state: item.verityStatus,
              };
            },
          ),
        );
      } else {
        antdMessage.error(`获取审核状态列表失败，原因:{${message}}`);
      }
    } catch (error) {
      setLoading(false);
      antdMessage.error(`获取审核状态列表失败，原因:{${error}}`);
    }
  };
  const getUpdateOptions = () => {
    const { verityStatus } = detail;
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
    const { id } = detail;
    try {
      const { message, code } = await updateVerityStatus({
        id,
        verityStatus: updateSelStatus,
      });
      if (code === 0) {
        antdMessage.success('更新成功');
        setModalVisible(false);
        setUpdateSelStatus(undefined);
        hanldeGetDemandRecord();
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
          onChange={(val) => {
            setUpdateSelStatus(val);
          }}
        >
          {updateOptions.map((item) => (
            <Select.Option key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    );
  };
  useEffect(() => {
    hanldeGetDemandRecord();
  }, []);

  return (
    <PageContainer loading={loading} title={false}>
      <ProCard gutter={8} ghost>
        <ProCard direction="column" ghost gutter={[0, 8]}>
          <ProCard>
            <h2 id="anchor-base-info">金融需求信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="金融需求编号">{detail?.id}</Form.Item>
              <Form.Item label="需求提交日期">{detail?.createTime}</Form.Item>
              <Form.Item label="需求登记产品信息">{detail?.productName}</Form.Item>
              <Form.Item label="拟融资金额">{detail?.amount}</Form.Item>
              <Form.Item label="融资期限">{detail?.termContent}</Form.Item>
              <Form.Item label="融资用途">/</Form.Item>
              <Form.Item label="资金需求紧迫度">/</Form.Item>
              <Form.Item label="企业资产信息">/</Form.Item>
            </Form>
          </ProCard>
          <ProCard>
            <h2 id="anchor-specs">需求企业信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="申请">{detail?.name}</Form.Item>
              <Form.Item label="联系电话">{detail?.phone}</Form.Item>
              <Form.Item label="组织名称">{detail?.orgName}</Form.Item>
              <Form.Item label="统一社会信用代码">{detail?.creditCode}</Form.Item>
              <Form.Item label="企业所在地">{detail?.countyCode}</Form.Item>
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
