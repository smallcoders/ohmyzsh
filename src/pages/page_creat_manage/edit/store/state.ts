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
    bgColor: '#F7F9FE',
    inputBgColor: "#F7F9FE",
    textColor: "#FFFFFF",
    inputTextColor: "#FFFFFF",
    btnBgColor: "#0068FF",
    inputBtnBgColor: '#0068FF',
    formStyle: 'split',
    showRegister: false,
    successTitle: '提交成功',
    successSubTitle: '工业互联网，价值在羚羊，快去羚羊平台逛逛吧！',
    successConfigType: '',
    pcImg: '',
    mobileImg: '',
    pcLink: '',
    mobileLink: '',
    pcImgHeight: 460,
    pcImgWidth: 344,
    mobileImgHeight: 460,
    mobileImgWidth: 344,
  },
  formConfig: {
    colon: true,
    labelAlign: 'right',
    layout: 'vertical',
  },
  id: '',
  webGlobalConfig: {
    pageName: '未命名网页',
    pageDesc: '',
    bgColor: '#F7F9FE',
    inputBgColor: '#F7F9FE'
  }
}

export interface State {
  selectWidgetItem?: Component
  widgetFormList: Component[]
  globalConfig: any
  formConfig: FormProps,
  [key: string]: any
}
