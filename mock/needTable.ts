
import { Request, Response } from 'express';
import mockjs from 'mockjs';

function resultFn(content: object, code: number = 0, message: string = 'success') {
  return Object.assign({code, message}, content);
}


const totalNumber = (req: Request, res: Response) => {
  res.json(resultFn(mockjs.mock({
    'result|17': [{
        area: '@county',
        'xqs|1-10000': 100,
        'gjcs|1-10000': 100,
        'wdj|1-10000': 100,
        'xfb|1-10000': 100,
        'yrl|1-10000': 100,
        'djz|1-10000': 100,
        'yfk|1-10000': 100,
        'ypj|1-10000': 100,
        'yjs|1-10000': 100,
      }]
  })))
}

let header = mockjs.mock({
  'header|1-5': [
    {
      'title|+1': ['需求跟进1', '需求跟进2', '需求跟进3', '需求跟进4', '需求跟进5'],
      'field|+1': ['field1', 'field2', 'field3', 'field4', 'field5']
    }
  ]
}).header

header = [{title: '需求名称', field: 'name'}, {title: '需求地区', field: 'area'}, {title: '需求状态', field: 'status'}, {title: '用户提交时间', field: 'userSubmitTime'}, {title: '审核发布时间', field: 'reportTime'}, {title: '认领时间', field: 'claimsTime'}, {title: '分发时间', field: 'awayTime'}, ...header]
header.push({title: '反馈时间', field: 'feedbackTime'}, {title: '评价时间', field: 'appraiseTime'}, {title: '关闭时间', field: 'closeTime'})

const detailTable = (req: Request, res: Response) => {

  res.json(resultFn({
    result: {
      header,
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 1000,
      totalCount: 83,
      data: mockjs.mock({
        'data|1-30': [{
          name: '@cword(1,50)',
          area: '@city',
          'status|1':['已评价', '新发布', '已结束', '已分发', '对接中', '已认领'],
          userSubmitTime: '@datetime',
          reportTime: '@datetime',
          claimsTime: '@datetime',
          awayTime: '@datetime',
          field1: '@cword(1,100)',
          field2: '@cword(1,100)',
          field3: '@cword(1,100)',
          field4: '@cword(1,100)',
          field5: '@cword(1,100)',
          feedbackTime: '@datetime',
          appraiseTime: '@datetime',
          closeTime: '@datetime',
        }]
      }).data
    }
  }))
}



export default {
  'POST /antelope-manage/needTable/totalNumber': totalNumber,
  'POST /antelope-manage/needTable/detailTable': detailTable
}
