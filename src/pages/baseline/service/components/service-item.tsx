import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Dropdown,
  Menu,
  Button,
  Popconfirm,
} from 'antd';
import PhoneHeader from '@/assets/service/phone-header.png';
import scopedClasses from '@/utils/scopedClasses';
import LeftIcon from '@/assets/service/icon_left.png';
import { history, Access, useAccess, useModel } from 'umi';
import './service-item.less'
const sc = scopedClasses('service-item');

const stateType = {
  NOT_SUBMITTED: '暂存',
  ON_SHELF: '上架中',
  OFF_SHELF: '已下架'
}
export default (props: {
  dataSoueceList?: any
  onOffShelves?: any
  handleRouter?: any
  dataSoueceItem?: any
}) => {
  const { onOffShelves, handleRouter, dataSoueceItem } = props
  // 当前数组项
  const { id, innerName, menuNameList, name, state } = dataSoueceItem
  const [loading, setLoading] = useState<boolean>(false);
  const access = useAccess();

  // 菜单项
  // const dataSoueceList = [
  //   {
  //     id: '0',
  //     name:  menuNameList && menuNameList[0],
  //     chilrden: (
  //       <Menu>
  //         <Menu.Item>导出筛选结果</Menu.Item>
  //         <Menu.Item>导出选中数据</Menu.Item>
  //         <Menu.Item>导出选中数据</Menu.Item>
  //         <Menu.Item>导出选中数据</Menu.Item>
  //       </Menu>
  //     ),
  //   },
  //   {
  //     id: '1',
  //     name: '菜单二',
  //     chilrden: (
  //       <Menu>
  //         <Menu.Item>导出筛选结果</Menu.Item>
  //         <Menu.Item>导出选中数据</Menu.Item>
  //       </Menu>
  //     ),
  //   },
  //   {
  //     id: '2',
  //     name: '菜单三',
  //     chilrden: (
  //       <Menu>
  //         <Menu.Item>导出筛选结果</Menu.Item>
  //         <Menu.Item>导出选中数据</Menu.Item>
  //       </Menu>
  //     ),
  //   },
  //   {
  //     id: '3',
  //     name: '菜单四',
  //     chilrden: (
  //       <Menu>
  //         <Menu.Item>导出筛选结果</Menu.Item>
  //         <Menu.Item>导出选中数据</Menu.Item>
  //       </Menu>
  //     ),
  //   },
  // ];
  // 根据menuNameList配置菜单项
  const [dataList, setDataList] = useState<any>([])
  const dataSoueceList = [
    {
      id: '0',
      name:  menuNameList && menuNameList[0],
      chilrden: (
        <Menu>
          <Menu.Item>导出筛选结果</Menu.Item>
          <Menu.Item>导出选中数据</Menu.Item>
          <Menu.Item>导出选中数据</Menu.Item>
          <Menu.Item>导出选中数据</Menu.Item>
        </Menu>
      ),
    }
  ];

  useEffect(() => {
    if (menuNameList && menuNameList.length > 0) {
      const newList = menuNameList?.map((item: any) => {
        return {
          id: id,
          name:  item,
          // chilrden: (
          //   <Menu>
          //     <Menu.Item>导出筛选结果</Menu.Item>
          //     <Menu.Item>导出选中数据</Menu.Item>
          //     <Menu.Item>导出选中数据</Menu.Item>
          //     <Menu.Item>导出选中数据</Menu.Item>
          //   </Menu>
          // ),
        }
      })
      setDataList(newList)

    }
  },[menuNameList])

  // 服务号管理
  const handleManagement = () => {
    handleRouter(id, name)
  }

  // 下架
  const remove = () => {
    onOffShelves(id)
  }

  useEffect(() => {
    console.log('获取的参数', dataSoueceItem)
  },[])

  return (
    <div className={sc('container-card-item')}>
      <div className={sc('container-card-item-title')}>
        {name || '--'}
        <span className={sc('container-card-item-title-span')}>{stateType[state]}</span>
      </div>
      <div className={sc('container-card-item-preview')}>
        <div className={sc('container-card-item-preview-header')}>
          {/* 放张图 */}
          <img className={sc('container-card-item-preview-header-img')} src={PhoneHeader} />
          <div className={sc('container-card-item-preview-header-content')}>
            <div className={sc('container-card-item-preview-header-content-left')}>
              <img
                className={sc('container-card-item-preview-header-content-left-img')}
                src={LeftIcon}
              />
            </div>
            <div className={sc('container-card-item-preview-header-content-center')}>{innerName || '--'}</div>
            <div className={sc('container-card-item-preview-header-content-right')}>主页</div>
          </div>
        </div>
        <div className={sc('container-card-item-preview-content')}></div>
        <div className={sc('container-card-item-preview-menu')}>
          {/* 根据item 中的菜单menu获取值 */}
          {/* { true && 
            <div className={sc('container-card-item-preview-menu-nodata')}>
              {'暂无菜单'}
            </div>
          } */}
          {true && (
            <div className={sc('container-card-item-preview-menu-list')}>
              {dataList && dataList.map((item: any) => {
                return (
                  <React.Fragment key={item.id}>
                    <div className={sc('container-card-item-preview-menu-list-item')}>
                      {
                        item.chilrden && (
                          <Dropdown overlay={item.chilrden} placement="top" arrow>
                            <span
                              className={sc('container-card-item-preview-menu-list-item-text')}
                            >
                              {item.name}
                            </span>
                          </Dropdown>
                        )
                      }
                      {
                        !item.chilrden && (
                          <span
                            className={sc('container-card-item-preview-menu-list-item-text')}
                          >
                            {item.name}
                          </span>
                        )
                      }
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className={sc('container-card-item-bottom')}>
        {
          state === 'ON_SHELF' &&
          <div className={sc('container-card-item-bottom-left')}>
            <Popconfirm
              title="确定下架么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove()}
            >
              <Button>
                下架
              </Button>
            </Popconfirm>
          </div>
        }
        <div className={sc('container-card-item-bottom-right')}>
          <Access accessible={access['P_BLM_FWHYY']}>
            <Button type="primary" onClick={() => handleManagement()} block>
              服务号管理
            </Button>
          </Access>
        </div>
      </div>
    </div>
  )
}