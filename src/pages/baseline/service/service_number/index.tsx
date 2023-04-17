import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Space,
  Popconfirm,
  Dropdown,
  Menu,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../../config/routes'
import { history } from 'umi';
import './index.less';
import ServiceItem from '../components/service-item'
import { httpServiceAccountOperationList, httpServiceAccountOffShelf } from '@/services/service-management'
const sc = scopedClasses('service-number');

export default () => {

  const [dataList, setDataList] = useState<any>()
  const perpaer = async () => {
    try {
      const res = await httpServiceAccountOperationList()
      if (res?.code === 0) {
        console.log('res', res)
        setDataList(res?.result)
      }else {
        throw new Error("");
      }
    } catch (error) {
      message.error(`获取服务号运营，原因:{${error}}`);
    }
  }
  useEffect(() => {
    perpaer()
  },[])

  // 下架
  const onOffShelves = async (id: any) => {
    try {
      const res = await httpServiceAccountOffShelf(id)
      if (res?.code === 0) {
        message.success(`下架成功`)
        perpaer()
      } else {
        throw new Error('')
      }
    } catch (error) {
      message.error(`下架失败，原因:{${error}}`)
    }
  }
  // 服务号管理
  const handleRouter = (id: any, name: string) => {
    // console.log('服务号管理url', id)
    history.push(`${routeName.BASELINE_SERVICE_NUMBER_MANAGEMENT}?id=${id}&name=${name}`);
  }
  return (
    <PageContainer className={sc('container')}>
      <div className={sc('container-card')}>
        {/* 下面的循环 */}
        {
          dataList && dataList?.map((item: any) => {
            return (
              <React.Fragment key={item.id}>
                <ServiceItem onOffShelves={onOffShelves} handleRouter={handleRouter} dataSoueceItem={item} />
              </React.Fragment>
            )
          })
        }
      </div>
    </PageContainer>
  );
};
