// 显示权限内的tab菜单
import { history, useModel } from 'umi';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';

// 诊断管理-诊断通tab页
import Online from '@/pages/diagnose_manage/diagnostic_tasks/components/Online';
import Offline from '@/pages/diagnose_manage/diagnostic_tasks/components/Offline';
import Intention from '@/pages/diagnose_manage/diagnostic_tasks/components/Intention';

// 采购管理-销售数据统计tab页
import Activity from '@/pages/purchase_manage/sales_statistics/components/Activity';
import Goods from '@/pages/purchase_manage/sales_statistics/components/Goods';

// 直播管理-搜索记录tab页
import Record from '@/pages/live_management/search_record_management/components/Record';
import Recommend from '@/pages/live_management/search_record_management/components/Recommend';

import scopedClasses from '@/utils/scopedClasses';
import './index.less';
const sc = scopedClasses('tab-menu');
export default (props: { tabs?: string[]; }) => {
  const [contentHtml, setContentHtml] = useState<string | undefined>();
  const [activeKey, setActiveKey] = useState<string>('M_DM_XSZD');
  const [showTabList, setShowTabList] = useState<any>([]);

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const tabMenu = [
    // 诊断管理-诊断通tab页
    {
      tab: '线上诊断',
      key: 'M_DM_XSZD',
    },
    {
      tab: '线下诊断',
      key: 'M_DM_XXZD',
    },
    {
      tab: '意向报名',
      key: 'M_DM_ZDBM',
    },
    // 采购管理-销售数据统计tab页
    {
      tab: '活动数据',
      key: 'M_PM_TJ_HD'
    },
    {
      tab: '商品数据',
      key: 'M_PM_TJ_SP'
    },
    // 直播管理-搜索记录tab页
    {
      tab: '搜索推荐',
      key: 'M_LM_SSTJ'
    },
    {
      tab: '搜索记录',
      key: 'M_LM_SSJL'
    }
  ]
  
  const { type } = history.location.query as any;
  const prepare = async () => {
    if (type) {
      setActiveKey(type);
    }
  };

  useEffect(() => {
    // console.log(currentUser, 'currentUser');
    // console.log(props.tabs, 'props.tabs');
    if(currentUser.menuShowMap) {
      let arr: any = [
        // {name: 'M_DM_XXZD', value: true},
        // {name: 'M_DM_XSZD', value: false},
        // {name: 'M_DM_ZDBM', value: true}
      ]
      Object.keys(currentUser.menuShowMap).forEach((item: any) => {
        // console.log(item, currentUser.menuShowMap[item]);
        if(props.tabs.indexOf(item) > -1) {
          arr.push({
            name: item,
            value: currentUser.menuShowMap[item]
          })
        }
      })
      let arr2 = []
      for(let i=0; i<arr.length; i++) {
        for(let j=0; j<tabMenu.length; j++) {
          if(arr[i].name == tabMenu[j].key && arr[i].value) {
            arr2.push(tabMenu[j])
          }
        }
      }
      setShowTabList(arr2)
      setActiveKey(arr2[0].key)
      console.log(arr2)
    }
  }, [props.tabs]);

  useEffect(() => {
    prepare();
  }, []); 

  return (
    <PageContainer
      className={sc('container')}
      tabList={showTabList}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => setActiveKey(key)}
    >
      {activeKey === 'M_DM_XSZD' && <Online />}
      {activeKey === 'M_DM_XXZD' && <Offline />}
      {activeKey === 'M_DM_ZDBM' && <Intention />}
      
      {activeKey === 'M_PM_TJ_HD' && <Activity />}
      {activeKey === 'M_PM_TJ_SP' && <Goods />}

      {activeKey === 'M_LM_SSJL' && <Record />}
      {activeKey === 'M_LM_SSTJ' && <Recommend />}
    </PageContainer>
  );
};
