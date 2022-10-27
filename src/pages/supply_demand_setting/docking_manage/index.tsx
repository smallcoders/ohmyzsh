import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import Follow from './components/follow';
import ClaimMy from './components/claim-my';
import Claim from './components/claim';
import { message, Select } from 'antd';
import './index.less'
import { getBizGroup } from '@/services/creative-demand';



export default () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [activeGroup, setActiveGroup] = useState<string>();
  const [group, setGroup] = useState<any[]>([])

  useEffect(() => {
    prepare()
  }, [])

  const prepare = async () => {
    try {
      const res = await getBizGroup()
      setGroup(res?.result?.filter((p: { gid: number; }) => p.gid < 6))
      setActiveGroup(res?.result?.[0]?.gid)
    } catch (error) {
      message.error('服务器错误')
    }
  }

  return (
    <PageContainer
      className='docking-manage-container'
      tabList={[
        {
          tab: '需求认领',
          key: '1',
        },
        {
          tab: '我的认领',
          key: '2',
        },
        {
          tab: <>需求跟进-
            <Select
              style={{ paddingLeft: 0, width: 160 }}
              value={activeGroup}
              onChange={(e) => {
                setActiveGroup(e)
              }}
              bordered={false}>
              {group?.map((p) => {
                return <Select.Option value={p?.gid}>{p?.name}</Select.Option>
              })}
            </Select>
          </>,
          key: '3',
        },
      ]}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {activeKey === '1' && <Claim />}
      {activeKey === '2' && <ClaimMy/>}
      {activeKey === '3' && <Follow gid={activeGroup}/>}
    </PageContainer>
  );
};
