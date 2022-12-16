// 发布状态
export const statusMap = {
  1: '待发布',
  2: '已发布',
  0: '暂存中',
};

// 产品类型
export const productTypeMap = {
  loan: '贷款',
  lease: '租赁',
  Insurance: '保险',
};
// 担保方式
export const guaranteeMethodMap = {
  1: '信用',
  2: '抵押',
  3: '质押',
  4: '保证',
};
// 面向对象
export const ObjectMap = {
  BUSINESS: '企业',
};
// 面向对象
export const IsCirculationLoanMap = {
  0: '否',
  1: '是',
};

// 排序
export const sortMap = {
  ascend: 0,
  descend: 1,
};

// 开放地区
export enum city {
  '合肥市',
  '芜湖市',
  '蚌埠市',
  '马鞍山市',
  '滁州市',
  '安庆市',
  '六安市',
  '阜阳市',
  '宣城市',
  '黄山市',
  '淮南市',
  '宿州市',
  '铜陵市',
  '淮北市',
  '亳州市',
  '池州市',
}
