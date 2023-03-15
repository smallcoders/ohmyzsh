import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { Button, Radio, Switch } from 'antd';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import SelfTable from '@/components/self_table';
import './index.less';
const sc = scopedClasses('financial-notification-page');
export default () => {
  const history = useHistory();
  useEffect(() => {
  }, []);
  const list = [
    {
      index: 0,
      notificationPoint: '金融产品申请提交成功(贷款类租赁类)',
      notificationMethod: '邮件',
      notificationTime: '实时',
      notificationContent: '<span class="blue">【贷款/租赁订单待跟进】</span>您好，<span class="blue">某某公司某某联系人</span>已提交<span class="blue">某某产品</span>的<span class="blue">100.00万元</span>融资申请，业务编号为<span class="blue">某某金融机构</span>,请及时与产品所属的<span class="blue">XXXX</span>对接，请在1至3个工作日内向客户反馈授信审批结果。',
      operationalManager: '',
      serviceManager: true
    },
    {
      index: 1,
      notificationPoint: '金融产品申请提交成功(保险类)',
      notificationMethod: '邮件',
      notificationTime: '实时',
      notificationContent: '【保险订单跟进】您好，<span class="blue">某某公司某某联系人</span>已提交<span class="blue">某某产品</span>的保险申请，业务编号为<span class="blue">XXXX</span>，请及时与产品所属的<span class="blue">某某金融机构</span>对接，请在1至3个工作日内向客户反馈保险审批结果。',
      operationalManager: '',
      serviceManager: true
    },
    {
      index: 2,
      notificationPoint: '成功获得授信/承保金额',
      notificationMethod: '邮件',
      notificationTime: '实时',
      notificationContent: '【授信通过】<span class="blue">某某公司某某联系人</span>申请的<span class="blue">某某金融机构</span>的某某产品，成功获得<span class="blue">授信/承保100.00万元</span>。',
      operationalManager: '',
      serviceManager: true
    },
    {
      index: 3,
      notificationPoint: '在金融诊断过程中,发布融资需求',
      notificationMethod: '邮件',
      notificationTime: '实时',
      notificationContent: '【融资需求待跟进】您好，<span class="blue">某某公司</span>已发布<span class="blue">100.00万元</span>的融资需求，请及时跟进并在1至3个工作日内向客户反馈需求匹配结果。',
      operationalManager: '',
      serviceManager: true
    },
    {
      index: 4,
      notificationPoint: '产品申请订单超过10*N天未处理',
      notificationMethod: '邮件',
      notificationTime: '上午10:00',
      notificationContent: `【待授信订单跟进提醒】您好，截止<span class="blue">${dayjs().format('YYYY年MM月DD')}日</span>，已有累计ç个待授信订单超过<span class="blue">N天</span>未更新，<span class="blue">XX金融机构X个</span>、<span class="blue">XX金融机构X个</span>，请及时关注。`,
      operationalManager: '',
      serviceManager: true
    },
    {
      index: 5,
      notificationPoint: '已发布融资需求超过3*N天未处理',
      notificationMethod: '邮件',
      notificationTime: '上午10:00',
      notificationContent: `【融资需求跟进提醒】您好，截止<span class="blue">${dayjs().format('YYYY年MM月DD')}日</span>，已有累计<span class="blue">X</span>个融资需求超过<span class="blue">N</span>天未更新，请及时关注。`,
      operationalManager: '',
      serviceManager: true
    },

  ]
  const columns = [
    {
      title: '通知节点',
      width: 276,
      dataIndex: 'notificationPoint',
    },
    {
      title: '通知方式',
      dataIndex: 'notificationMethod',
    },
    {
      title: '通知时间',
      width: 100,
      dataIndex: 'notificationTime',
    },
    {
      title: '通知内容',
      dataIndex: 'notificationContent',
      render: (notificationContent: string) => {
        return <div dangerouslySetInnerHTML={{__html: notificationContent}} />
      }
    },
    {
      title: '通知运营人员',
      dataIndex: 'operationalManager',
      width: 220,
      render: (_: boolean, record: any) => {
        return (
          <div>
            <Radio>产品对应金融运营人员</Radio>
            {
              record.index === 2 && <Radio>所有金融运营人员</Radio>
            }
          </div>
        )
      }
    },
    {
      title: '通知业务经理',
      dataIndex: 'serviceManager',
      render: () => {
        return <Switch/>
      }
    },
  ]
  return (
    <PageContainer
      className={sc()}
      ghost
      header={{
        title: '金融待办通知',
        breadcrumb: {},
      }}
      footer={[
        <Button key="button" size="large" onClick={() => history.goBack()}>
          返回
        </Button>
      ]}
    >
      <div className="table-title">
        金融待办通知
      </div>
      <SelfTable
        bordered={false}
        columns={columns}
        dataSource={list}
        rowKey={'index'}
        pagination={false}
      />
    </PageContainer>
  );

};
