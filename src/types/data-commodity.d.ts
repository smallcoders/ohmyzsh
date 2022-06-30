namespace DataCommodity {
  export type Commodity = {
    id: number;
    productName: string;
    productModel: string;
    providerName: string;
    timeStart: string;
    timeEnd: string;
    saleStatus: 0 | 1;
    productPic: string;
    updateTime: string;
    finishStatus: 0 | 1;
    purchasePricePart: string;
  };

  export type ProductInfo = {
    id: number;
    productName: string;
    productBrandCn: string;
    productBrandEn: string;
    spreadWord: string;
    productModel: string;
    supplier: string;
    supplierName: string;
    productOrg: string;
    productPic: string;
    sortNo: number;
    productContent: string;
    productArgs: string;
    productDetail: string;
    state: 0 | 1;
    createTime: string;
    updateTime: string;
    productApp: string;
    saleIds: string;
    saleContent: {
      id: number;
      label: string;
      labelContent: string;
      labelType: number;
      state: number;
    };
    serverIds: string;
    serverContent: {
      id: number;
      label: string;
      labelContent: string;
      labelType: number;
      state: number;
    };
    banner: string;
    finishStatus: 0 | 1;
    salePricePart: string;
    originMax: string;
  };

  export type SpecInfo = {
    id: number;
    productId: number;
    specsName: string;
    specsValue: string;
    state: 0 | 1;
    createTime: string;
    updateTime: string;
  };

  export type PriceInfo = {
    id: number;
    productId: number;
    productNo: string;
    specsTitle: string;
    specs: string;
    actId: number;
    purchasePrice: number;
    originPrice: number;
    salePrice: number;
    createTime: string;
    updateTime: string;
    state: number;
    transportFee: number;
  };

  export type ParamInfo = {
    id: number;
    productId: number;
    name: string;
    content: string;
    state: number;
    createTime: string;
    updateTime: string;
  };

  export type DetailInfo = {};
}
export default DataCommodity;
