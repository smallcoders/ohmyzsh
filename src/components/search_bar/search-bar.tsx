import { useMemo } from 'react'
import Common from '@/types/common.d';
import { Form, Row, Col, Button, Input, Select, TreeSelect, Cascader, DatePicker } from 'antd'
import scopedClasses from '@/utils/scopedClasses'
import './search-bar.less'

const { RangePicker } = DatePicker

const sc = scopedClasses('work-table-search-bar')
const defActionList: Common.ActionItem[] = [
  {
    key: 'search',
    text: '查询',
    type: 'primary',
  },
  {
    key: 'reset',
    text: '重置',
    type: 'default',
  },
]
interface SearchBarProps {
  form: any
  className?: string
  colNum?: number
  searchList?: Common.SearchItem[]
  actionList?: Common.ActionItem[]
  onSearch?: ((info: any) => void) | null
  showTime?: boolean
}

const SearchBar = ({
  form = null,
  className = '',
  colNum = 3,
  searchList = [],
  actionList = defActionList,
  onSearch = null,
  showTime = false,
}: SearchBarProps) => {

  const searchListPro = useMemo(() => {
    const proList = []
    for (let i = 0; i < searchList?.length; i += colNum) {
      proList.push(searchList.slice(i, i + colNum))
    }
    return proList
  }, [searchList])

  const renderSearchItemControl = (searchItem: Common.SearchItem) => {
    const {
      key,
      label,
      type,
      options,
      treeData,
      fieldNames,
      initialValue,
      placeholder,
      allowClear,
      disabledDate,
      loading,
      showSearch,
      onChange,
    } = searchItem || {}
    switch (type) {
      case Common.SearchItemControlEnum.INPUT:
        return (
          <Form.Item name={key} label={label} initialValue={initialValue}>
            <Input placeholder={placeholder || "请输入"} allowClear={allowClear} />
          </Form.Item>
        )
      case Common.SearchItemControlEnum.SELECT:
        return (
          <Form.Item name={key} label={label} initialValue={initialValue}>
            <Select
              getPopupContainer={(trigger: any) => trigger as HTMLElement}
              placeholder={placeholder || "请选择"}
              allowClear={allowClear}
              showSearch={showSearch}
              loading={loading}
              options={options}
              fieldNames={fieldNames || { label: 'name', value: 'id' }}
              onChange={onChange}
              onSearch={onChange}
            />
          </Form.Item>
        )
      case Common.SearchItemControlEnum.TREE_SELECT:
        return (
          <Form.Item name={key} label={label} initialValue={initialValue}>
            <TreeSelect
              getPopupContainer={(trigger: any) => trigger as HTMLElement}
              style={{ width: '100%' }}
              placeholder={placeholder || "请选择"}
              allowClear={allowClear}
              loading={loading}
              treeData={treeData}
              fieldNames={fieldNames || { label: 'name', value: 'code', children: 'nodes' }}
              onChange={onChange}
            />
          </Form.Item>
        )
      case Common.SearchItemControlEnum.CASCADER:
        return (
          <Form.Item name={key} label={label} initialValue={initialValue}>
            <Cascader
              getPopupContainer={(trigger) => trigger as HTMLElement}
              placeholder={placeholder || "请选择"}
              allowClear={allowClear}
              loading={loading}
              options={treeData}
              fieldNames={fieldNames || { label: 'name', value: 'code', children: 'nodes' }}
              onChange={onChange}
            />
          </Form.Item>
        )
      case Common.SearchItemControlEnum.DATE_MONTH:
        return (
          <Form.Item name={key} label={label} initialValue={initialValue}>
            <DatePicker picker="month" style={{ width: '100%' }} disabledDate={disabledDate} />
          </Form.Item>
        )
      case Common.SearchItemControlEnum.RANGE_PICKER:
        return (
          <Form.Item name={key} label={label} initialValue={initialValue}>
            <RangePicker showTime={showTime}  style={{ width: '100%' }} disabledDate={disabledDate} />
          </Form.Item>
        )
      default:
        return null
    }
  }

  const onSearchAction = (action: Common.ActionItem) => {
    if (action.key === 'reset') {
      form.resetFields()
    }
    const info = form?.getFieldsValue() || {}
    onSearch?.(info)
  }

  return (
    <div className={sc(`search ${className}`)}>
      <Form form={form} name="advanced_search" className={sc('search-form')}>
        {searchListPro?.map((rowItems, index) => (
          <Row gutter={40} key={index}>
            {rowItems?.map((searchItem) => (
              <Col span={24 / colNum} key={searchItem?.key}>
                {renderSearchItemControl(searchItem)}
              </Col>
            ))}
          </Row>
        ))}
      </Form>
      <div className={sc('search-action')}>
        <div className={sc('search-action-item')}>
          {actionList.map((action) => (
            <Button
              className={sc('search-action-btn')}
              key={action?.key}
              type={action?.type}
              onClick={onSearchAction.bind(null, action)}
            >
              {action?.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchBar;
