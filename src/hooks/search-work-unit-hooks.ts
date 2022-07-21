// import { httpGetWorkUnitList } from '@/service/http_request'

import { getWorkUnit } from '@/services/authentication-info';

export default () => {
  // 搜索工作单位
  const handleSearchWorkUnit = async (value: string) => {
    if (value.length < 3) return;
    try {
      const res = await getWorkUnit(value);
      if (res?.code === 0) {
        return Promise.resolve(
          res?.result?.map((item) => ({
            value: item.name,
          })),
        );
      }
      throw new Error();
    } catch {
      return Promise.reject([]);
    }
  };
  return handleSearchWorkUnit;
};
