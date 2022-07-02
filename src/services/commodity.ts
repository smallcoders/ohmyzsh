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
  >(`/antelope-pay/product/queryProductDetail/${id}`);
}

export async function queryProduct(id: string | number) {
  return request<Common.ResultCode & { result: DataCommodity.ProductInfo }>(
    `/antelope-pay/product/queryProduct/${id}`,
  );
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

export async function deleteSpecs(data: any) {
  return request<Common.ResultCode & { result: DataCommodity.SpecInfo[] }>(
    `/antelope-pay/mng/product/deleteSpecs`,
    {
      method: 'POST',
      data,
    },
  );
}

export async function goToSpecsPrice(data: any) {
  return request<Common.ResultCode & { result: DataCommodity.PriceInfo[] }>(
    `/antelope-pay/mng/product/goToSpecsPrice`,
    {
      method: 'POST',
      data,
    },
  );
}

export async function addSpecsPrice(data: any) {
  return request<
    Common.ResultCode & {
      result: any;
    }
  >('/antelope-pay/mng/product/addSpecsPrice', {
    method: 'POST',
    data,
  });
}
export async function queryParam(productId: number | string) {
  return request<Common.ResultCode & { result: DataCommodity.ParamInfo[] }>(
    `/antelope-pay/product/queryParam/${productId}`,
  );
}

export async function addParam(data: any) {
  return request<
    Common.ResultCode & {
      result: number;
    }
  >('/antelope-pay/mng/product/addParam', {
    method: 'POST',
    data,
  });
}

export async function deleteParam(data: any) {
  return request<Common.ResultCode & { result: DataCommodity.SpecInfo[] }>(
    `/antelope-pay/mng/product/deleteParam`,
    {
      method: 'POST',
      data,
    },
  );
}

export async function addProductDetail(data: any) {
  return request<
    Common.ResultCode & {
      result: number;
    }
  >('/antelope-pay/mng/product/addProductDetail', {
    method: 'POST',
    data,
  });
}

export async function queryLabel(data: any) {
  return request<Common.ResultCode & Common.ResultPage & { result: DataCommodity.Label[] }>(
    '/antelope-pay/mng/label/query',
    {
      method: 'POST',
      data: { ...data },
    },
  );
}

export async function queryProviderAll() {
  return request<Common.ResultCode & { result: DataCommodity.Provider[] }>(
    '/antelope-pay/provider/search',
    {
      method: 'POST',
      data: {
        pageIndex: 1,
        pageSize: 30,
      },
    },
  );
}
