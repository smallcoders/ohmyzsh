import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Anchor, Button, Form, Select, Modal, message as antdMessage } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'umi';
import VerifyStepsDetail from '@/components/verify_steps';
import CommonTitle from '@/components/verify_steps/common_title';
import { customToFixed } from '@/utils/util';
import {
  getDemandRecordList,
  updateVerityStatus,
  getDetailAddress,
} from '@/services/banking-service';
import './detail.less'

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
    label: '暂无适宜的金融解决方案',
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
  const [address, setAddress] = useState<string>('');
  const [updateSelStatus, setUpdateSelStatus] = useState<number | undefined>();
  /**
   * 新建窗口的弹窗
   *
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
          verityStatusContent: result[0].verityStatusContent,
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
  const hanldeGetAddress = async () => {
    try {
      const { countyCode } = detail;
      const { code, message, result } = await getDetailAddress({ code: countyCode });

      if (code === 0) {
        // 更新详情的 状态
        setAddress(result);
      } else {
        antdMessage.error(`获取地址失败，原因:{${message}}`);
      }
    } catch (error) {
      setLoading(false);
      antdMessage.error(`获取地址失败，原因:{${error}}`);
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
    hanldeGetAddress();
  }, []);
  return (
    <PageContainer loading={loading} title={false}>
      <ProCard gutter={8} ghost>
        <ProCard direction="column" ghost gutter={[0, 8]}>
          <ProCard>
            <div className="anchor-base-info">
              <div className="legend">金融需求信息</div>
              <div className={`status status${detail?.verityStatus}`}>{detail?.verityStatusContent}</div>
            </div>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="金融需求编号">{detail?.id}</Form.Item>
              <Form.Item label="需求提交日期">{detail?.createTime}</Form.Item>
              <Form.Item label="需求登记产品信息">
                {detail?.productName}
              </Form.Item>
              {
                detail?.bank && <Form.Item label="合作机构">
                  {detail.bank}
                </Form.Item>
              }
              {
                detail.type !== 2 && <Form.Item label="拟融资金额">{customToFixed(`${detail.amount / 1000000}`)}万元</Form.Item>
              }
              {
                detail.type !== 2 && <Form.Item label="融资期限">{detail?.termContent}</Form.Item>
              }
              {
                detail.type !== 2 && <Form.Item label="融资用途">/</Form.Item>
              }
              {
                detail.type !== 2 && <Form.Item label="资金需求紧迫度">/</Form.Item>
              }
              {
                detail.type !== 2 && <Form.Item label="企业资产信息">/</Form.Item>
              }
              {
                detail.type === 2 && <Form.Item label="保单拟生效时间">{detail?.effectiveDate}</Form.Item>
              }
              {
                detail.type === 2 && <Form.Item label="承保过该类产品">{detail?.acceptInsurance === 1 ? '是' : '否'}</Form.Item>
              }
              {
                detail.type === 2 && <Form.Item label="申请人">{detail?.name}</Form.Item>
              }
            </Form>
          </ProCard>
          <ProCard>
            <h2 id="anchor-specs">需求企业信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="申请人">{detail?.name}</Form.Item>
              <Form.Item label="联系电话">{detail?.phone}</Form.Item>
              <Form.Item label="组织名称">{detail?.orgName}</Form.Item>
              <Form.Item label="统一社会信用代码">{detail?.creditCode}</Form.Item>
              <Form.Item label="企业所在地">{address}</Form.Item>
            </Form>
          </ProCard>

          <ProCard>
            <h2 id="anchor-details">平台响应信息</h2>
            <VerifyStepsDetail list={list} />
          </ProCard>

          <ProCard layout="center">
            {detail?.verityStatus !== 4 && detail?.verityStatus !== 5 && (
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={() => setModalVisible(true)}
              >
                更新处理状态
              </Button>
            )}

            <Button onClick={() => history.goBack()}>返回</Button>
          </ProCard>
        </ProCard>
        <ProCard colSpan="200px" />
      </ProCard>
      <div style={{ width: 200, position: 'fixed', right: 10, top: 100 }}>
        <Anchor offsetTop={150} showInkInFixed={true} affix={false}>
          <Link href="#anchor-base-info" title="金融需求信息" />
          <Link href="#anchor-specs" title="需求企业信息" />
          <Link href="#anchor-details" title="平台响应信息" />
        </Anchor>
      </div>
      {getUpdateModal()}
    </PageContainer>
  );
};
