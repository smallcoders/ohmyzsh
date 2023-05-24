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
import iconDefault from '@/assets/service/default.png';
const sc = scopedClasses('service-item');

const stateType = {
  NOT_SUBMITTED: '暂存',
  ON_SHELF: '已上架',
  OFF_SHELF: '未上架'
}
export default (props: {
  dataSoueceList?: any
  onOffShelves?: any
  handleRouter?: any
  dataSoueceItem?: any
}) => {
  const { onOffShelves, handleRouter, dataSoueceItem } = props
  // 当前数组项
  const { id, name, state, logoUrl } = dataSoueceItem
  const access = useAccess();

  // 服务号管理
  const handleManagement = () => {
    handleRouter(id, name)
  }

  // 下架
  const remove = () => {
    onOffShelves(id)
  }

  return (
    <div className={sc('container-card-item')}>
      <div className={sc('container-card-item-title')}>
        <div className={sc('container-card-item-title-left')}>
          <img className={sc('container-card-item-title-left-img')} src={logoUrl || iconDefault} alt="" />
          <div className={sc('container-card-item-title-left-text')}>
            {name || '--'}
          </div>
        </div>
        <div className={sc('container-card-item-title-right')}>
          <span className={sc('container-card-item-title-right-span')} style={{ backgroundColor: state === 'ON_SHELF' ? '#52c41a' : '#d7d7d7'}}>{stateType[state]}</span>
        </div>
      </div>
      <div className={sc('container-card-item-divider')}></div>
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