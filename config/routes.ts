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
            path: '/service-config/app-resource/add-resource/:id',
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
    path: '/manage',
    name: '系统管理',
    icon: 'setting',
    routes: [
      {
        path: '/manage',
        redirect: '/manage/account',
      },
      {
        path: '/manage/account',
        name: '账号管理',
        component: './manager',
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
