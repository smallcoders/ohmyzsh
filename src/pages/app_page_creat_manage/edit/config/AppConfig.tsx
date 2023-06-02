import { Button, Checkbox, Form, Input, InputNumber, message, Modal, Select, Switch, Tabs, Tooltip } from 'antd';
import { useConfig } from '../hooks/hooks'
import UploadForm from '../components/upload_form/upload-form';
import DebounceSelect from '../components/DebounceSelect';
import { getProductDetails, getRecommendAppList } from '@/services/commodity';
import { useEffect, useRef, useState } from 'react';

const AppConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
  const { config } = selectWidgetItem || {}

  const [products, setProducts] = useState<{ label: string; value: string, appId: string, type: string }[]>([]);

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
        appId: p.appId,
        type: p.appType
      }))
      setProducts(products)
      return products
    }
    );
  };

  const getProductDetail = async (productId: string, productName: string, key: string) => {
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
          label += '/' + Object.entries(userNumMap)?.filter(p => p[0] == c?.userNum)?.[0]?.[1];
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
      // handleChange({
      //   value: productId,
      //   name: productName,
      //   specs,
      //   products
      // }, 'config.product')

      const app = products?.find(p => p.value === productId)

      handleChangeProduct({
        value: productId,
        name: productName,
        specs,
        appId: app?.appId,
        type: app?.type,
        products
      }, 'product', key)

    } catch { }
    //  handleChange(value, 'config.icon')
  }

  const onChange = (newActiveKey: string) => {
    console.log('newActiveKey', newActiveKey)
    handleChange(newActiveKey, 'config.index')
  };

  const requiredJudge = () => {
    const lastConfig = config?.productList[config?.productList?.length - 1]

    if (!lastConfig?.product?.value) {
      message.error('请选择应用商品')
      return false
    }
    if (!lastConfig?.icon) {
      message.error('请上传图标')
      return false
    }
    if (!lastConfig?.desc) {
      message.error('请输入商品简介')
      return false
    }
    if (!lastConfig?.specId) {
      message.error('请选择商品规格')
      return false
    }
    if (!lastConfig?.time) {
      message.error('请选择使用期限')
      return false
    }
    if ((!lastConfig?.num) && (!lastConfig?.isLimit)) {
      message.error('请输入活动数量或者勾选无限制')
      return false
    }

    return true
  }

  const add = () => {
    if (!requiredJudge()) {
      return
    }
    const productList = [...config?.productList];

    const newKey = `${config?.productList?.length + 1}`
    productList.push(
      {
        key: newKey,
        icon: '',
        product: {
          specs: [],
          products: [],
          value: '',
          name: '',
          appId: ''
        },
        desc: '',
        specId: '',
        specName: '',
        time: '',
        num: '',
        isLimit: false
      }
    );

    handleChange(newKey, 'config.index')

    handleChange(productList, 'config.productList')
  };

  const remove = (targetKey: string) => {
    let newActiveKey = config?.index;

    const productList = [...config?.productList.filter(item => item.key !== targetKey)];

    productList.forEach((item, i) => {
      if (Number(item.key) > Number(targetKey)) {
        item.key = `${item.key - 1}`
      }
    });

    if (newActiveKey == targetKey) {
      newActiveKey = Number(targetKey) != 1 ? `${Number(targetKey) - 1}` : `${Number(targetKey) + 1}`
    }

    handleChange(productList, 'config.productList')
    handleChange(newActiveKey, 'config.index')
  };

  const onEdit = (targetKey: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {

      if (config?.productList?.length === 1) {
        message.error('至少存在一个应用商品')
        return
      }

      Modal.confirm({
        title: '删除提示',
        content: '确定移除么？',
        onOk: () => {
          remove(targetKey);
        }
      })
    }
  };

  useEffect(() => {

    console.log('config', config)

  }, [])

  const handleChangeProduct = (value: any, field: string, key: string) => {

    const product = config?.productList?.find(p => p?.key == key)



    config?.productList.splice(Number(key) - 1, 1, {
      ...product, [field]: value
    });

    console.log('product', product, config?.productList, key, value, field,)

    handleChange(config?.productList, 'config.productList')

  }


  const render = (config: any, key: string) => {
    return <>
      <Form.Item label="输入选择应用商品" required>
        <DebounceSelect
          value={config?.product?.value}
          showSearch
          placeholder={'请输入搜索内容'}
          fetchOptions={onSearchOrg}
          style={{ width: '100%' }}
          defaultOptions={config?.product?.products}
          onChange={({ value, label, appId }) => {
            getProductDetail(value, label, key)
          }}
        />
      </Form.Item>
      <Form.Item label="上传图标" required>
        <UploadForm
          listType="picture-card"
          className="avatar-uploader"
          maxSize={10}
          action={'/antelope-common/common/file/upload/record'}
          showUploadList={false}
          style={{ width: '56px', height: '56px', marginBottom: 0 }}
          accept=".bmp,.gif,.png,.jpeg,.jpg"
          value={config!.icon}
          onChange={(value: any) => {
            handleChangeProduct(value?.path || value || '', 'icon', key)
          }}
          noUploadText={true}
        />
      </Form.Item>
      <Form.Item label="商品简介" required>
        <Input.TextArea value={config?.desc} maxLength={300} onChange={(e: any) => {
          handleChangeProduct(e.target.value, 'desc', key)
        }} />
      </Form.Item>
      <Form.Item label="商品规格" required>
        <Select value={config?.specId} onChange={(value: any) => {
          handleChangeProduct(value, 'specId', key)
          const dic = config?.product?.specs
          handleChangeProduct(dic?.find(p => p?.value == value)?.label, 'specName', key)
        }}>
          {
            config?.product?.specs?.map((item) => {
              return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item label="使用期限" required>
        <Select value={config?.time} onChange={(value: any) => {
          handleChangeProduct(value, 'time', key)
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
          handleChangeProduct(value, 'num', key)
          if (value) handleChangeProduct(false, 'isLimit', key)
        }} min={1} step={1} precision={0} />
        <Checkbox checked={config?.isLimit} onChange={(e: any) => {
          handleChangeProduct(e.target.checked, 'isLimit', key)
          if (e.target.checked) handleChangeProduct('', 'num', key)
        }}>无限制</Checkbox>
      </Form.Item>
    </>
  }

  return (
    <>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={config?.index}
        onEdit={onEdit}
      // items={
      //   [
      //     { label: 'Tab 1', children: 'Content of Tab 1', key: '1' },
      //     { label: 'Tab 2', children: 'Content of Tab 2', key: '2' },
      //     {
      //       label: 'Tab 3',
      //       children: 'Content of Tab 3',
      //       key: '3',
      //     },
      //   ]
      // }
      >
        {config?.productList?.map(p => {
          return <Tabs.TabPane tab={p?.product?.name || ('未命名' + p?.key)} key={p.key} >
            {render(p, p.key)}
          </Tabs.TabPane>
        })}
      </Tabs>
      <Form.Item label="移动端下边距">
        <InputNumber
          disabled
          value={config?.appConfig?.marginBottom || 0}
          min={0}
          onChange={(value) => {
            handleChange(value, 'config.appConfig.marginBottom')
          }}
        />
      </Form.Item>
      <Form.Item label="下边距">
        <InputNumber
          disabled
          value={config?.marginBottom}
          min={0}
          onChange={(value) => {
            handleChange(value, 'config.marginBottom')
          }}
        />
      </Form.Item>
    </>
  )
}

export default AppConfig
