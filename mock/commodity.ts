import { Request, Response } from 'express';

function pageQuery(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const current = Number(req.query.current || 1);
  const pageSize = Number(req.query.pageSize || 10);
  const start = (current - 1) * pageSize;

  function buildBarcode(num: number) {
    const str = num.toString();

    return (
      Array(6 - str.length)
        .fill(0)
        .join('') + str
    );
  }

  const dataSource = Array(pageSize)
    .fill(0)
    .map((_, index) => {
      const id = start + index;
      return {
        id,
        barcode: buildBarcode(id),
        thumbnail: '',
        name: `商品${id}`,
        unemarque: `A33${id}`,
        price: `3000.00-4000.00`,
        status: id % 2,
        supplier: '科大讯飞',
        updateDate: 1655782830888,
      };
    });

  const result = {
    data: dataSource,
    total: 100,
    success: true,
    pageSize,
    current: current || 1,
  };
  return res.json(result);
}

export default {
  '/api/commodity/pageQuery': pageQuery,
};
