namespace DataPromotions {
  export enum Status {
    unStart = 1,
    processing = 2,
    over = 3,
  }

  export type Promotions = {
    id: number;
    code: string;
    name: string;
    commoditys: number;
    time: number;
    listingStatus: number;
    status: Status;
    order: number;
    updateDate: number;
  };
}
export default DataPromotions;
