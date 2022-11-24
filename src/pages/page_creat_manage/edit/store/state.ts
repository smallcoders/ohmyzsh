import type { FormProps } from 'antd/lib/form'
import type { Component } from '../config'

export const initState: State = {
  selectWidgetItem: undefined,
  widgetFormList: [],
  globalConfig: {
    pageName: "未命名表单",
    pageDesc: "",
    pageBg: '1669095307000001',
    showPageName: true,
    showDesc: true,
    btnText: "提交",
    paramsList: [],
  },
  formConfig: {
    colon: true,
    labelAlign: 'right',
    layout: 'vertical',
  },
  id: '',
}

export interface State {
  selectWidgetItem?: Component
  widgetFormList: Component[]
  iconSrc?: string
  globalConfig: any
  formConfig: FormProps,
  [key: string]: any
}
