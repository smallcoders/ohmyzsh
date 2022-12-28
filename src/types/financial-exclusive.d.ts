import type Common from './common';

namespace FinancialExclusive {
  export interface ExcCustomerInfo extends Common.ResultCode {
    result: ExcCustomer;
  }
  export type ExcCustomer = {
    id?: number;
    amount?: number; //融资金额
    name?: string; //顾问昵称
    wetChatImage?: number | string ;
    path?: string;
  };
}

export default FinancialExclusive;
