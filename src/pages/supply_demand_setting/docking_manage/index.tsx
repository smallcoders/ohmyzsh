import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useMemo } from 'react';
import Follow from './components/follow';
import ClaimMy from './components/claim-my';
import Claim from './components/claim';
import { message, Select } from 'antd';
import './index.less'
import { getBizGroup } from '@/services/creative-demand';
import TabMenu from '@/components/TabMenu';
import { Access, useAccess, useHistory } from 'umi';
import { getDictionayTree } from '@/services/common';
import { getAhArea } from '@/services/area';



export default () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [activeGroup, setActiveGroup] = useState<number>();
  const [group, setGroup] = useState<any[]>([])
  const [dataKey, setDataKey] = useState<number>(1)
  const history = useHistory()
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 页面权限
  const permissions = [
    {
      gid: 1,
      name: '数字化应用业务组',
      power: 'PQ_SD_XQGJ_SZH',
      twoPower: 'M_SD_XQGJ_SZH',
      state: access?.['PQ_SD_XQGJ_SZH'],
    },
    {
      gid: 2,
      name: '工品采购业务组',
      power: 'PQ_SD_XQGJ_CG',
      twoPower: 'M_SD_XQGJ_CG',
      state: access?.['PQ_SD_XQGJ_CG'],
    },
    {
      gid: 3,
      name: '科产业务组',
      power: 'PQ_SD_XQGJ_KC',
      twoPower: 'M_SD_XQGJ_KC',
      state: access?.['PQ_SD_XQGJ_KC'],
    },
    {
      gid: 4,
      name: '羚羊金融业务组',
      power: 'PQ_SD_XQGJ_JR',
      twoPower: 'M_SD_XQGJ_JR',
      state: access?.['PQ_SD_XQGJ_JR'],
    },
    {
      gid: 5,
      name: '技术经理人',
      power: 'PQ_SD_XQGJ_JLR',
      twoPower: 'M_SD_XQGJ_JLR',
      state: access?.['PQ_SD_XQGJ_JLR'],
    },
  ]

  const [demandTypes, setDemandTypes] = useState<any[]>([])
  const [area, setArea] = useState<any[]>([])
  useEffect(() => {
    prepare()

    if (sessionStorage.activeKey) {
      setActiveKey(sessionStorage.activeKey)
    }
    if (sessionStorage.activeGroup) {
      setActiveGroup(+sessionStorage.activeGroup)
    }
  }, [])

  history.listen(() => {
    sessionStorage.removeItem('activeKey')
    sessionStorage.removeItem('activeGroup')
  })

  useEffect(() => {
    if (activeKey) {
      sessionStorage.setItem('activeKey', activeKey)
    }
    sessionStorage.setItem('activeGroup', String(activeGroup))
  }, [activeKey])

  useEffect(() => {
    if (activeGroup) {
      sessionStorage.setItem('activeGroup', String(activeGroup))
    }
  }, [activeGroup])

  const prepare = async () => {
    try {
      const res = await Promise.all([getDictionayTree('DEMAND_TYPE'), getBizGroup(), getAhArea()])
      setDemandTypes(res?.[0]?.result)
      setGroup(res[1]?.result?.filter((p: { gid: number; }) => p.gid < 6))
      setActiveGroup(+sessionStorage.activeGroup || res[1]?.result?.[0]?.gid)
      console.log('res===>', res)
      setArea(res?.[2])
    } catch (error) {
      message.error('服务器错误')
    }
    // 初始化tab
    let activeIndex = 0
    let textIndex = 0
    for (let index = 0; index < permissions.length; index++) {
      if (permissions[index]?.state) {
        activeIndex = permissions[index]?.gid
        textIndex = index
        break
      }
    }
    setActiveGroup(+sessionStorage.activeGroup || activeIndex)

    // 初始化key
    if (!access) return
    // 需求根据的tab状态
    let state = false
    // 存在属性
    let State = ['PQ_SD_XQGJ_SZH', 'PQ_SD_XQGJ_CG', 'PQ_SD_XQGJ_KC', 'PQ_SD_XQGJ_JR', 'PQ_SD_XQGJ_JLR']
    Object.keys(access).forEach((item: any) => {
      if (State.indexOf(item) > -1) {
        state = true
      }
    })
    // 认领和跟进都有权限
    if (access['PQ_SD_XQRL'] && state) {
      setDataKey(1)
    }
    // 认领有权限， 跟进无权限
    if (access['PQ_SD_XQRL'] && !state) {
      setDataKey(2)
    }
    // 认领无权限，跟进有权限
    if (!access['PQ_SD_XQRL'] && state) {
      setActiveKey('3')
      setDataKey(3)
    }
  }

  const dataList = {
    1: [
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
            // value={placeholder}
            value={activeGroup}
            onChange={(e) => {
              setActiveGroup(e)
            }}
            bordered={false}>
            {permissions?.map((p) => {
              const accessible = access?.[p.power]
              if (!accessible) return
              return <Select.Option value={p?.gid}>{p?.name}</Select.Option>
            })}
          </Select>
        </>,
        key: '3',
      },
    ],
    2: [
      {
        tab: '需求认领',
        key: '1',
      },
      {
        tab: '我的认领',
        key: '2',
      },
    ],
    3: [
      {
        tab: <>需求跟进-
          <Select
            style={{ paddingLeft: 0, width: 160 }}
            value={activeGroup}
            onChange={(e) => {
              setActiveGroup(e)
            }}
            bordered={false}>
            {permissions?.map((p) => {
              const accessible = access?.[p.power]
              if (!accessible) return
              return <Select.Option value={p?.gid}>{p?.name}</Select.Option>
            })}
          </Select>
        </>,
        key: '3',
      },
    ],
  }[dataKey]

  return (
    <PageContainer
      className='docking-manage-container'
      tabList={dataList}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {activeKey === '1' && access['M_SD_XQRL'] && <Claim demandTypes={demandTypes} area={area}/>}
      {activeKey === '2' && access['M_SD_XQRL'] && <ClaimMy demandTypes={demandTypes} area={area}/>}
      {activeKey === '3' && access['M_SD_GXDJ'] && <Follow gid={activeGroup} demandTypes={demandTypes} area={area}/>}
    </PageContainer>
  );
};
