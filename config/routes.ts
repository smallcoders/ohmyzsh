export const routeName = {
  DATA_COLUMN: '/service-config/data-column', // 数据栏
  APP_RESOURCE: '/service-config/app-resource/index', // 应用资源
  DATA_ANALYSIS: '/service-config/app-resource/data-analysis', // 综合采购数据分析
  ADD_APP_RESOURCE: '/service-config/app-resource/add-resource', // 新增应用资源
  NEWS: '/service-config/news', // 新闻
  ACCOUNT: '/system-config/account', // 账号管理
};

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/service-config',
    name: '服务配置',
    icon: 'unordered-list',
    access: 'SERVICE_CONFIG',
    routes: [
      {
        path: '/service-config',
        redirect: '/service-config/banner',
      },
      {
        path: '/service-config/banner',
        name: 'banner',
        component: './service_config/banner',
      },
      {
        path: routeName.DATA_COLUMN,
        name: '数据栏',
        component: './service_config/data_column',
      },
      {
        path: '/service-config/app-resource',
        name: '应用资源',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/service-config/app-resource',
            redirect: '/service-config/app-resource/index',
          },
          {
            path: routeName.APP_RESOURCE,
            hideInBreadcrumb: true,
            name: '应用资源',
            component: './service_config/app_resource',
          },
          {
            path: routeName.DATA_ANALYSIS,
            name: '综合采购数据分析',
            component: './service_config/data_analysis',
          },
          {
            path: routeName.ADD_APP_RESOURCE,
            name: '新增应用',
            component: './service_config/add_resource',
          },
        ],
      },
      {
        path: routeName.NEWS,
        name: '新闻资讯',
        component: './service_config/news',
      },
    ],
  },
  {
    path: '/system-config',
    name: '系统管理',
    icon: 'setting',
    access: 'SYSTEM_CONFIG',
    routes: [
      {
        path: '/system-config',
        redirect: '/system-config/account',
      },
      {
        path: '/system-config/account',
        name: '账号管理',
        component: './account',
      },
    ],
  },
  {
    path: '/',
    redirect: '/service-config/banner',
  },
  {
    component: './404',
  },
];
