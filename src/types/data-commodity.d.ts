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
    productSource: number;
    productName: string;
    productBrandCn: string;
    productBrandEn: string;
    spreadWord: string;
    appType: number;
    appName: string;
    typeName: string;
    isFree: number;
    pcHomeUrl: string;
    pcDemoUrl: string;
    appDemoUrl: string;
    appHomeUrl: string;
    productModel: string;
    supplier: number;
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
    }[];
    serverIds: string;
    serverContent: {
      id: number;
      label: string;
      labelContent: string;
      labelType: number;
      state: number;
    }[];
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

  export type Label = {
    id: number;
    label: string;
    labelContent: string;
    labelType: 0 | 1;
    state: 0 | 1;
    updateTime: string;
    createTime: string;
  };

  export type Provider = {
    id: number;
    providerTypeName: string;
    providerName: string;
    weight: number;
    createTime: string;
    operateUser: string;
  };

  export type DiagnosisServiceDetailType = {
    enterpriseId: string;
    enterpriseName: string;
    serviceStartTime: string;
    serviceEndTime: string;
    recordNo: string;
    diagnosed: string;
  };
}
export default DataCommodity;
