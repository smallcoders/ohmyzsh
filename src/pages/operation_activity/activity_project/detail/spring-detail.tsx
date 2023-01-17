import { getNewYearAssistListe } from '@/services/activity-project';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Form, Table } from 'antd';
import { useEffect, useState } from 'react';
import { registerSourceEnum } from '../spring';
export default () => {
  const [isMore, setIsMore] = useState<boolean>(false);
  const [assistList, setAssistList] = useState([]);
  const [detail, setDetail] = useState<any>({});
  const prepare = async () => {
    try {
      const detailJson: any = localStorage.getItem('spring_detail');
      const d = JSON.parse(detailJson) || {}
      setDetail(d)
      const { result } = await getNewYearAssistListe(d.id)
      setAssistList(result || [])
    } catch (error) { }

  }
  useEffect(() => {
    prepare()
  }, [])


  return (
    <PageContainer title={false}>
      <ProCard gutter={8} ghost>
        <ProCard direction="column" ghost gutter={[0, 8]}>
          <ProCard>
            <h2>基本信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="姓名">{detail?.name || '--'}</Form.Item>
              <Form.Item label="用户ID">{detail?.userId || '--'}</Form.Item>
              <Form.Item label="手机号">{detail?.phone || '--'}</Form.Item>
              <Form.Item label="注册时间">{detail?.registerTime || '--'}</Form.Item>
              <Form.Item label="注册端">{registerSourceEnum?.[detail?.registerSource] || '--'}</Form.Item>
              <Form.Item label="身份">{detail?.role || '--'}</Form.Item>
              <Form.Item label="所属组织">{detail?.orgName || '--'}</Form.Item>
              <Form.Item label="邀请人数">{detail?.assistCount || '--'} 人      <Button
                style={{ marginRight: 10 }}
                type="link"
                onClick={() => {
                  setIsMore(!isMore);
                }}
              >
                {isMore ? '收起邀请记录' : '查看邀请记录'}
                {isMore ? <CaretUpOutlined /> : <CaretDownOutlined />}
              </Button></Form.Item>
              {isMore && <Table columns={[
                {
                  title: '应用名称',
                  dataIndex: 'appName',
                  width: 100,
                },
                {
                  title: '助力好友',
                  dataIndex: 'phoneList',
                  width: 1000,
                  render: (p) => { return p?.join('，') }
                },
              ]}
                pagination={false}
                dataSource={assistList}></Table>}
              <Form.Item label="完成状态">{detail?.completed ? '已完成' : '未完成'}</Form.Item>
              <Form.Item label="完成时间">{detail?.completeTime || '--'}</Form.Item>
              <Form.Item label="应用">{detail?.appNames || '--'}</Form.Item>

            </Form>
          </ProCard>
          <ProCard>
            <h2>标注信息</h2>
            <Form labelCol={{ span: 4 }}>
              <Form.Item label="奖品兑换">{detail?.sign ? '已兑换' : '未兑换'}</Form.Item>
              <Form.Item label="备注">{detail?.remark || '--'}</Form.Item>
              <Form.Item label="操作时间">{detail?.operationTime || '--'}</Form.Item>
              <Form.Item label="操作人">{detail?.operatorName || '--'}</Form.Item>
            </Form>
          </ProCard>

          {/* <ProCard layout="center">
            <Button onClick={() => history.goBack()}>返回</Button>
          </ProCard> */}
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
