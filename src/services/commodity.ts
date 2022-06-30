import type Common from '@/types/common';
import type DataCommodity from '@/types/data-commodity';
import { request } from 'umi';

/**
 * 分页查询
 * @param params
 */
export async function pageQuery(data: any) {
  return request<Common.ResultCode & Common.ResultPage & { result: DataCommodity.Commodity[] }>(
    '/antelope-pay/product/queryProductList',
    {
      method: 'POST',
      data: { ...data, pageIndex: data.current },
    },
  );
}

export async function queryProduct(id: string | number) {
  return request<Common.ResultCode & { result: DataCommodity.ProductInfo }>(
    `/antelope-pay/product/queryProduct/${id}`,
  );
}

export async function queryProductDetail(id: string | number) {
  return request<
    Common.ResultCode & {
      result: {
        payProduct: DataCommodity.ProductInfo;
        payProductSpecsList: DataCommodity.SpecInfo[];
        payProductSpecsPriceList: DataCommodity.PriceInfo[];
        payProductParamList: DataCommodity.ParamInfo[];
      };
    }
  >(`/antelope-pay/product/queryProduct/${id}`);
}

export async function addProduct(data: any) {
  return request<
    Common.ResultCode & {
      result: {
        id: number;
      };
    }
  >('/antelope-pay/mng/product/addProduct', {
    method: 'POST',
    data,
  });
}

export async function addSpecs(data: any) {
  return request<
    Common.ResultCode & {
      result: number;
    }
  >('/antelope-pay/mng/product/addSpecs', {
    method: 'POST',
    data,
  });
}

export async function querySpecs(productId: number | string) {
  return request<Common.ResultCode & { result: DataCommodity.SpecInfo[] }>(
    `/antelope-pay/product/querySpecs/${productId}`,
  );
}
