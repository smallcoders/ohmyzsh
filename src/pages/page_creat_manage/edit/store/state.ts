import type { FormProps } from 'antd/lib/form'
import type { Component } from '../config'

export const initState: State = {
  selectWidgetItem: undefined,
  widgetFormList: [],
  globalConfig: {
    pageName: "未命名表单",
    pageDesc: "",
    pageBg: 'https://oss.lingyangplat.com/iiep-dev/3e056c6745534b06a782283756666126.png',
    showPageName: true,
    showDesc: true,
    btnText: "提交",
    paramsList: [],
    bgColor: '#f7f9fe',
    inputBgColor: "#f7f9fe",
    textColor: "#ffffff",
    inputTextColor: "#ffffff",
    btnBgColor: "#0068ff",
    inputBtnBgColor: '#0068ff',
    formStyle: 'split',
    showRegister: false,
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
