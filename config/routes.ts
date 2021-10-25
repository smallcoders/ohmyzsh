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
    icon: 'crown',
    routes: [
      {
        path: '/service-config/banner',
        name: 'banner',
        component: './service_config/banner',
      },
      {
        path: '/service-config/data-column',
        name: '数据栏',
        component: './service_config/data_column',
      },
      {
        path: '/service-config/app-resource',
        name: '应用资源',
        icon: 'crown',
        component: './service_config/app_resource',
        routes: [
          {
            path: '/service-config/app-resource/data-analysis',
            name: '综合采购数据分析',
            hideInMenu: true,
            component: './service_config/data_analysis',
          },
          {
            path: '/service-config/app-resource/add-resource/:id',
            name: '新增应用',
            hideInMenu: true,
            component: './service_config/add_resource',
          },
        ],
      },
      {
        path: '/service-config/news',
        name: '新闻资讯',
        component: './service_config/news',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '列表',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/service-config/banner',
  },
  {
    component: './404',
  },
];
