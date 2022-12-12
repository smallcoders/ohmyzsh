export interface Action {
  type: ActionType
  payload: any
}

export enum ActionType {
  SET_GLOBAL = 'SET_GLOBAL',
  SET_SELECT_WIDGET_ITEM = 'SET_SELECT_WIDGET_ITEM',
  SET_WIDGET_FORM_LIST = 'SET_WIDGET_FORM_LIST',
  SET_ICON_SRC = 'SET_ICON_SRC',
  SET_GLOBAL_CONFIG = 'SET_GLOBAL_CONFIG',
  SET_FORM_CONFIG = 'SET_FORM_CONFIG'
}
