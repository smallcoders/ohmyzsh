import { Button, Checkbox, Form, Input, InputNumber, message, Select, Switch, Tooltip } from 'antd';
import { useConfig } from '../hooks/hooks'
import dragIcon from '@/assets/page_creat_manage/drag-item.png';
import UploadForm from '../components/upload_form/upload-form';
import questionIcon from '@/assets/page_creat_manage/question_icon.png';
import { clone } from 'lodash-es';
import Sortable from 'sortablejs';
import DebounceSelect from '../components/DebounceSelect';
import { getProductDetails, getRecommendAppList } from '@/services/commodity';
import { useEffect, useState } from 'react';

const AppConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
  const { config } = selectWidgetItem || {}

  const [products, setProducts] = useState<{ label: string; value: string }[]>([]);

  /**
   * 搜索企业
   * @param name
   * @returns
   */
  const onSearchOrg = async (name: string) => {
    return getRecommendAppList(name).then((body) => {
      const products = body.result.map((p: any) => ({
        label: p.name,
        value: p.id,
      }))
      setProducts(products)
      return products
    }
    );
  };


  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);

  const getProductDetail = async (productId: string, productName: string) => {
    try {
      const res = await getProductDetails({ productId })
      const { userNumMap,
        expireTimeMap,
        countMap
      } = res?.result

      const specs = res?.result?.payProductSpecsListV2?.map(c => {
        Object.entries(userNumMap)?.map(u => c?.userNum == u[0])
        const type = c?.type;
        let label = c?.specsValue
        if (type === 1) {
          label += '/' + Object.entries(expireTimeMap)?.filter(p => p[0] == c?.userNum)?.[0]?.[1];
          label += '/' + Object.entries(expireTimeMap)?.filter(p => p[0] == c?.expireTime)?.[0]?.[1];
        } else if (type === 2) {
          label += '/' + Object.entries(countMap)?.filter(p => p[0] == c?.count)?.[0]?.[1];
          label += '/' + Object.entries(expireTimeMap)?.filter(p => p[0] == c?.expireTime)?.[0]?.[1];
        } else if (type === 3) {
          label += '/' + Object.entries(countMap)?.filter(p => p[0] == c?.count)?.[0]?.[1];
        }
        return {
          value: c?.id,
          label
        }
      })
      setSpecs(specs)
      handleChange({
        value: productId,
        name: productName,
        specs,
        products
      }, 'config.product')
    } catch { }
    //  handleChange(value, 'config.icon')
  }

  useEffect(() => {

    console.log('config', config)

  }, [config])

  return (
    <>

    
      <Form.Item label="上传图标">
        <DebounceSelect
          value={config?.product?.spec}
          showSearch
          placeholder={'请输入搜索内容'}
          fetchOptions={onSearchOrg}
          style={{ width: '100%' }}
          defaultOptions={config?.product?.products}
          onChange={({ value, label }) => {
            getProductDetail(value, label)
          }}
        />
      </Form.Item>
      <Form.Item label="上传图标">
        <UploadForm
          listType="picture-card"
          className="avatar-uploader"
          maxSize={10}
          action={'/antelope-common/common/file/upload/record'}
          showUploadList={false}
          style={{ width: '36px', height: '36px', marginBottom: 0 }}
          accept=".bmp,.gif,.png,.jpeg,.jpg"
          value={config!.icon}
          onChange={(value: any) => {
            handleChange(value, 'config.icon')
          }}
          noUploadText={true}
        />
      </Form.Item>
      <Form.Item label="商品简介" required>
        <Input.TextArea value={config?.desc} maxLength={300} onChange={(e: any) => {
          handleChange(e.target.value, 'config.desc')
        }} />
      </Form.Item>
      <Form.Item label="商品规格" required>
        <Select value={config?.specId} onChange={(value: any) => {
          handleChange(value, 'config.specId')
          const dic = (specs?.length > 0 ? specs : config?.product?.specs)
          handleChange(dic?.find(p => p?.value == value)?.label, 'config.specName')
        }}>
          {
            (specs?.length > 0 ? specs : config?.product?.specs).map((item) => {
              return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item label="使用期限" required>
        <Select value={config?.time} onChange={(value: any) => {
          handleChange(value, 'config.time')
        }}>
          {
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => {
              return <Select.Option key={item} value={item * 30}>{item * 30}天</Select.Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item label="参与活动数量" required>
        <InputNumber value={config?.num} onChange={(value: any) => {
          handleChange(value, 'config.num')
        }} min={1} step={1} precision={0} />
        <Checkbox value={config?.isLimit} onChange={(value: any) => {
          handleChange(value, 'config.isLimit')
        }}>无限制</Checkbox>
      </Form.Item>
    </>
  )
}

export default AppConfig
