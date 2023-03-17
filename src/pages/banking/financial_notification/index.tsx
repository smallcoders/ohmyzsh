import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { Button, Radio, Switch, message } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  queryNotice,
  upDateNotice
} from '@/services/financial-notification';
import SelfTable from '@/components/self_table';
import './index.less';
const sc = scopedClasses('financial-notification-page');
const contentList = [
  {
    content: '<span class="blue">【贷款/租赁订单待跟进】</span>您好，<span class="blue">某某公司某某联系人</span>已提交<span class="blue">某某产品</span>的<span class="blue">100.00万元</span>融资申请，业务编号为<span class="blue">某某金融机构</span>,请及时与产品所属的<span class="blue">XXXX</span>对接，请在1至3个工作日内向客户反馈授信审批结果。',
  },
  {
    content: '【保险订单跟进】您好，<span class="blue">某某公司某某联系人</span>已提交<span class="blue">某某产品</span>的保险申请，业务编号为<span class="blue">XXXX</span>，请及时与产品所属的<span class="blue">某某金融机构</span>对接，请在1至3个工作日内向客户反馈保险审批结果。',
  },
  {
    content: '【授信通过】<span class="blue">某某公司某某联系人</span>申请的<span class="blue">某某金融机构</span>的某某产品，成功获得<span class="blue">授信/承保100.00万元</span>。',
  },
  {
    content: '【融资需求待跟进】您好，<span class="blue">某某公司</span>已发布<span class="blue">100.00万元</span>的融资需求，请及时跟进并在1至3个工作日内向客户反馈需求匹配结果。',
  },
  {
    content: `【待授信订单跟进提醒】您好，截止<span class="blue">${dayjs().format('YYYY年MM月DD')}日</span>，已有累计ç个待授信订单超过<span class="blue">N天</span>未更新，<span class="blue">XX金融机构X个</span>、<span class="blue">XX金融机构X个</span>，请及时关注。`,
  },
  {
    content: `【融资需求跟进提醒】您好，截止<span class="blue">${dayjs().format('YYYY年MM月DD')}日</span>，已有累计<span class="blue">X</span>个融资需求超过<span class="blue">N</span>天未更新，请及时关注。`,
  },
]
export default () => {
  const history = useHistory();
  const [list, setList] = useState<any>([])
  useEffect(() => {
    queryNotice().then((res) => {
      if (res.code === 0){
        setList(res.result.map((item: any, index: number) => {
          return {
            ...item,
            content: contentList[index].content
          }
        }))
      } else {
        message.error(res.message)
      }
    })
  }, []);

  const updateNoticeItem = (params: any, key: string) => {
    upDateNotice(params).then((res) => {
      if (res.code === 0){
        setList(list.map((item: any) => {
          const newItem = {
            ...item,
          }
          newItem[key] = item.id === params.id ? params[key] : item[key]
          return newItem
        }))
      } else {
        message.error(res.message)
      }
    })
  }
  const columns = [
    {
      title: '通知节点',
      width: 276,
      dataIndex: 'event',
    },
    {
      title: '通知方式',
      dataIndex: 'type',
    },
    {
      title: '通知时间',
      width: 100,
      dataIndex: 'time',
    },
    {
      title: '通知内容',
      dataIndex: 'content',
      render: (content: string) => {
        return <div dangerouslySetInnerHTML={{__html: content}} />
      }
    },
    {
      title: '通知运营人员',
      dataIndex: 'operPerson',
      width: 220,
      render: (operPerson: number, record: any, index: number) => {
        return (
          <div>
            <Radio.Group value={operPerson}>
              <Radio
                onClick={() => {
                  const value = operPerson === 1 ? 0 : 1
                  const params = {id: record.id, operPerson: value}
                  updateNoticeItem(params, 'operPerson')
                }}
                value={1}
              >
                产品对应金融运营人员
              </Radio>
              {
                index === 2 &&
                <Radio
                  onClick={() => {
                    const value = operPerson === 2 ? 0 : 2
                    const params = {id: record.id, operPerson: value}
                    updateNoticeItem(params, 'operPerson')
                  }}
                  value={2}
                >
                  所有金融运营人员
                </Radio>
              }
            </Radio.Group>
          </div>
        )
      }
    },
    {
      title: '通知业务经理',
      dataIndex: 'busiPerson',
      render: (busiPerson: boolean, record: any) => {
        return <Switch onChange={(checked) => {
          const params = {
            id: record.id,
            busiPerson: checked
          }
          updateNoticeItem(params, 'busiPerson')
        }} checked={busiPerson}/>
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
        rowKey={'id'}
        pagination={false}
      />
    </PageContainer>
  );

};
