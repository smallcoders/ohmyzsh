namespace EcologyProviders {

  export type ProductInfo = {
    id: number;
    adminName: string;
    adminPhone: string;
    createTime: string;
    customerCount: number;
    enterpriseName: string;
    enterpriseSize: number;
    orgId: number;
    partneredPlatforms: string;
    serviceCompaniesNumber: number;
    serviceIndustry: string;
    serviceIndustryName: string;
    products: {
      appId: number;
      appName: string;
      productName: string;
      appType: number;
      saleStatus: number;
    }[];
  };

  export type SpecInfo = {
    appId: number;
    appName: string;
    productName: string;
    appType: number;
    saleStatus: number;
  };
}
export default EcologyProviders;
