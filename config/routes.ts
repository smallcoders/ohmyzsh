export const routeName = {
  DATA_COLUMN: '/service-config/data-column', // 数据栏
  DIAGNOSTIC_TASKS: '/service-config/diagnostic-tasks/index', // 诊断任务
  DIAGNOSTIC_TASKS_DETAIL: '/service-config/diagnostic-tasks/detail', // 诊断记录
  DIAGNOSTIC_TASKS_REPORT: '/service-config/diagnostic-tasks/report', // 诊断报告
  COURSE_MANAGE: '/service-config/course-manage/index', // 课程管理
  ADD_COURSE: '/service-config/course-manage/add', // 新增或编辑课程
  APP_RESOURCE: '/service-config/app-resource/index', // 应用资源
  DATA_ANALYSIS: '/service-config/app-resource/data-analysis', // 综合采购数据分析
  ADD_APP_RESOURCE: '/service-config/app-resource/add-resource', // 新增应用资源
  SOLUTION: '/service-config/solution', // 服务方案
  SOLUTION_INDEX: '/service-config/solution/index', // 服务方案
  SOLUTION_DETAIL: '/service-config/solution/detail', // 服务方案详情
  NEWS: '/service-config/news', // 新闻
  ACCOUNT: '/system-config/account', // 账号管理
  KECHUANGVERIFY: '/user-config/KeChuangVerify', // 科创成果审核
  LOGOUTVERIFY: '/user-config/logoutVerify', // 科创成果审核
  KECHUANGVERIFY_INDEX: '/user-config/KeChuangVerify/index', // 科创成果审核
  KECHUANGVERIFY_DETAIL: '/user-config/KeChuangVerify/detail', // 科创成果详情
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
        path: '/service-config/diagnostic-tasks',
        name: '诊断通',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/service-config/diagnostic-tasks',
            redirect: routeName.DIAGNOSTIC_TASKS,
          },
          {
            path: routeName.DIAGNOSTIC_TASKS,
            hideInBreadcrumb: true,
            name: '诊断通',
            component: './service_config/diagnostic_tasks',
          },
          {
            path: routeName.DIAGNOSTIC_TASKS_DETAIL,
            name: '诊断记录',
            component: './service_config/diagnostic_tasks_detail',
          },
          {
            path: routeName.DIAGNOSTIC_TASKS_REPORT,
            name: '诊断报告',
            component: './service_config/diagnostic_tasks_report',
          },
        ],
      },
      {
        path: '/service-config/course-manage',
        name: '课程管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/service-config/course-manage',
            redirect: routeName.COURSE_MANAGE,
          },
          {
            path: routeName.COURSE_MANAGE,
            hideInBreadcrumb: true,
            name: '课程管理',
            component: './service_config/course_manage',
          },
          {
            path: routeName.ADD_COURSE,
            name: '课程操作',
            component: './service_config/add_course',
          },
        ],
      },
      {
        path: '/service-config/app-resource',
        name: '应用资源',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/service-config/app-resource',
            redirect: routeName.APP_RESOURCE,
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
        path: routeName.SOLUTION,
        name: '服务方案',
        hideChildrenInMenu: true,
        routes: [
          {
            path: routeName.SOLUTION,
            redirect: routeName.SOLUTION_INDEX,
          },
          {
            path: routeName.SOLUTION_INDEX,
            name: '服务方案',
            hideInBreadcrumb: true,
            component: './service_config/solution',
          },
          {
            path: routeName.SOLUTION_DETAIL,
            name: '服务详情',
            component: './service_config/solution/detail',
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
    path: '/operate-data',
    name: '运营数据',
    icon: 'desktop',
    access: 'SERVICE_CONFIG',
    routes: [
      {
        path: '/operate-data',
        redirect: '/operate-data/data-display',
      },
      {
        path: '/operate-data/data-display',
        name: '数据展示',
        component: './operate_data/data_display',
      },
    ],
  },
  {
    path: '/user-config',
    name: '用户管理',
    icon: 'user',
    access: 'SYSTEM_CONFIG',
    routes: [
      {
        path: '/user-config',
        redirect: '/user-config/KeChuangVerify',
      },
      {
        path: routeName.KECHUANGVERIFY,
        name: '科创成果审核',
        // component: './user_config/keChuang_verify',
        hideChildrenInMenu: true,
        routes: [
          {
            path: routeName.KECHUANGVERIFY,
            redirect: routeName.KECHUANGVERIFY_INDEX,
          },
          {
            path: routeName.KECHUANGVERIFY_INDEX,
            name: '科创成果审核',
            hideInBreadcrumb: true,
            component: './user_config/keChuang_verify',
          },
          {
            path: routeName.KECHUANGVERIFY_DETAIL,
            name: '科创成果详情',
            component: './user_config/keChuang_verify/detail',
          },
        ],
      },
      {
        path: routeName.LOGOUTVERIFY,
        name: '注销审核',
        component: './user_config/logout_verify',
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
        path: routeName.ACCOUNT,
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
