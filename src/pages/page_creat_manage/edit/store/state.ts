import type { FormProps } from 'antd/lib/form'
import type { Component } from '../config'

export const initState: State = {
  selectWidgetItem: undefined,
  widgetFormList: [],
  iconSrc: undefined,
  globalConfig: {
    pageName: "未命名表单",
    pageDesc: "",
    pageBg: '',
    showPageName: true,
    showDesc: true,
    btnText: "提交",
  },
  formConfig: {
    colon: true,
    labelAlign: 'right',
    layout: 'vertical',
  },
}

export interface State {
  selectWidgetItem?: Component
  widgetFormList: Component[]
  iconSrc?: string
  globalConfig: any
  formConfig: FormProps
  [key: string]: any
}
