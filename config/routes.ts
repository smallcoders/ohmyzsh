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
    icon: 'edit',
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
        path: '/service-config/data-column',
        name: '数据栏',
        component: './service_config/data_column',
      },
      {
        path: '/service-config/app-resource',
        name: '应用资源',
        icon: 'crown',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/service-config/app-resource',
            redirect: '/service-config/app-resource/index',
          },
          {
            path: '/service-config/app-resource/index',
            hideInBreadcrumb: true,
            name: '应用资源',
            component: './service_config/app_resource',
          },
          {
            path: '/service-config/app-resource/data-analysis',
            name: '综合采购数据分析',
            component: './service_config/data_analysis',
          },
          {
            path: '/service-config/app-resource/add-resource',
            name: '新增应用',
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
