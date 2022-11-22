import { observer } from 'mobx-react'
import { Form, Cascader } from 'antd'
import shouldUpdate from './should-update'
import { listAllAreaCode } from '@/services/common';
import React, { useEffect, useState } from 'react';

export default observer(
  (props: {
    topicList: any[]
    topicInfo: any
    index: number
    onChange?: (record: any, value: any, index: number) => void
  }) => {
    const [provinceList, setProvinceList] = useState<any>([])
    const prepare = async () => {
      let areaRes = await listAllAreaCode()
			console.log(areaRes, 'areaRes');
			setProvinceList(areaRes && areaRes.result || [] )
    }
    useEffect(() => {
      prepare();
    }, []);
    const { topicList, topicInfo, index, onChange } = props || {}
    const { id, name, required, subTitle, assignedProvince, related, relations, relatedRelation } = topicInfo

    const dealOption = () => {
      if(assignedProvince) {
        let arr = provinceList.filter(item => item.code == assignedProvince)[0]?.nodes || []
        return arr
      }else {
        return provinceList
      }
    }

    const formItem = (
      <Form.Item label={`${index + 1}. ${name}`} required={required}>
        {subTitle && <div style={{ marginTop: '-20px', paddingBottom: '20px' }}>{subTitle}</div>}
        <Form.Item
          name={id}
          noStyle
          rules={[
            {
              required: required,
              message: '请输入',
            },
          ]}
        >
          <Cascader
            fieldNames={{ label: 'name', value: 'code', children: 'nodes' }}
            options={dealOption()}
            onChange={(e) => {
              onChange && onChange(topicInfo, e, index)
            }}
            getPopupContainer={(triggerNode) => triggerNode}
            placeholder="请选择"
          />
        </Form.Item>
      </Form.Item>
    )
    return relations?.length > 0 ? (
      <Form.Item shouldUpdate noStyle>
        {(form) => {
          const isTruth = shouldUpdate({
            formInstance: form,
            topicList: topicList || [],
            relations: relations || [],
            relatedRelation: relatedRelation || '',
          })
          return isTruth ? formItem : null
        }}
      </Form.Item>
    ) : (
      formItem
    )
  },
)
