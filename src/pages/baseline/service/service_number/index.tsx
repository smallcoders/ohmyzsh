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
  Spin,
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
  const [spinState, setSpinState] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [dataList, setDataList] = useState<any>()
  const perpaer = async () => {
    setSpinState(true)
    try {
      const res = await httpServiceAccountOperationList()
      if (res?.code === 0) {
        console.log('res', res)
        setDataList(res?.result)
        setSpinState(false)
        setShow(true)
      }else {
        message.error(`获取服务号运营，原因:{${res?.message}}`);
      }
    } catch (error) {
      message.error(`获取服务号运营，原因:{${error}}`);
      setSpinState(false)
      setShow(true)
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
        message.error(`下架失败，原因:{${res?.message}}`)
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
      <Spin spinning={spinState}>
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
          {
            !dataList && show && (
              <div>暂无服务号，请联系运营平台管理员</div>
            )
          }
        </div>
      </Spin>
    </PageContainer>
  );
};
