// import { PageContainer } from '@ant-design/pro-layout';
// import './service-config-diagnostic-tasks.less';
// import scopedClasses from '@/utils/scopedClasses';
// import React, { useState, useEffect } from 'react';
// import { history, useModel } from 'umi';
import TabMenu from '@/components/TabMenu';

// import Online from './components/Online';
// import Offline from './components/Offline';
// import Intention from './components/Intention';
// const sc = scopedClasses('service-config-diagnostic-tasks');
// const sc = scopedClasses('tab-menu');
export default () => {
  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState;
  // const [activeKey, setActiveKey] = useState<string>('M_DM_XSZD');
  // const [showTabList, setShowTabList] = useState<any>([
    
  // ]);

  // const { type } = history.location.query as any;
  // const tabListAuth = ['M_DM_XSZD', 'M_DM_XXZD', 'M_DM_ZDBM']
  // const tabMenu = [
  //   {
  //     tab: '线上诊断',
  //     key: 'M_DM_XSZD',
  //   },
  //   {
  //     tab: '线下诊断',
  //     key: 'M_DM_XXZD',
  //   },
  //   {
  //     tab: '意向报名',
  //     key: 'M_DM_ZDBM',
  //   }
  // ]

  // const prepare = async () => {
  //   if (type) {
  //     setActiveKey(type);
  //   }
  // };

  // useEffect(() => {
    // prepare();
    // console.log(currentUser, 'currentUser');
    // if(currentUser.menuShowMap) {
    //   let arr: any = [
    //     {name: 'M_DM_XXZD', value: true},
    //     {name: 'M_DM_XSZD', value: false},
    //     {name: 'M_DM_ZDBM', value: true}
    //   ]
    //   // Object.keys(currentUser.menuShowMap).forEach((item: any) => {
    //   //   // console.log(item, currentUser.menuShowMap[item]);
    //   //   if(tabListAuth.indexOf(item) > -1) {
    //   //     arr.push({
    //   //       name: item,
    //   //       value: currentUser.menuShowMap[item]
    //   //     })
    //   //   }
    //   // })
    //   // setShowTabList(arr)
    //   let arr2 = []
    //   for(let i=0; i<arr.length; i++) {
    //     for(let j=0; j<tabMenu.length; j++) {
    //       if(arr[i].name == tabMenu[j].key && arr[i].value) {
    //         arr2.push(tabMenu[j])
    //       }
    //     }
    //   }
    //   setShowTabList(arr2)
    //   setActiveKey(arr2[0].key)
    //   console.log(arr2)
    // }
  // }, []);

  return (
    <TabMenu tabs={['M_DM_XSZD', 'M_DM_XXZD', 'M_DM_ZDBM']} />
    // <PageContainer
    //   className={sc('container')}
    //   tabList={showTabList}
    //   // tabList={[
    //   //   {
    //   //     tab: '线上诊断',
    //   //     key: '1',
    //   //   },
    //   //   {
    //   //     tab: '线下诊断',
    //   //     key: '2',
    //   //   },
    //   //   {
    //   //     tab: '意向报名',
    //   //     key: '3',
    //   //   }
    //   // ]}
    //   tabActiveKey={activeKey}
    //   onTabChange={(key: string) => setActiveKey(key)}
    // >
    //   {activeKey === 'M_DM_XSZD' && <Online />}
    //   {activeKey === 'M_DM_XXZD' && <Offline />}
    //   {activeKey === 'M_DM_ZDBM' && <Intention />}
    // </PageContainer>
  );
};
