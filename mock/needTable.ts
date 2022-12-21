
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



export default {
  'POST /antelope-manage/needTable/totalNumber': totalNumber
}
