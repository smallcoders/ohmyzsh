﻿export const routeName = {
  DATA_COLUMN: '/service-config/data-column', // 数据栏
  DIAGNOSTIC_TASKS: '/service-config/diagnostic-tasks/index', // 诊断任务
  DIAGNOSTIC_TASKS_DETAIL: '/service-config/diagnostic-tasks/detail', // 诊断记录
  DIAGNOSTIC_TASKS_REPORT: '/service-config/diagnostic-tasks/report', // 诊断报告
  COURSE_MANAGE: '/service-config/course-manage/index', // 课程管理
  ADD_COURSE: '/service-config/course-manage/add', // 新增或编辑课程
  APP_RESOURCE: '/service-config/app-resource/index', // 应用资源
  APP_MANAGE: '/service-config/app-manage/index', // 应用管理
  DATA_ANALYSIS: '/service-config/app-manage/data-analysis', // 综合采购数据分析
  ADD_APP_RESOURCE: '/service-config/app-manage/add-resource', // 新增应用资源
  SOLUTION: '/service-config/solution', // 服务方案
  SOLUTION_INDEX: '/service-config/solution/index', // 服务方案
  SOLUTION_DETAIL: '/service-config/solution/detail', // 服务方案详情
  NEWS: '/service-config/news', // 新闻
  ORG_TYPE_MANAGE: '/service-config/org-type-manage', // 机构类型管理
  EXPERT_MANAGE: '/service-config/expert-manage', // 专家管理
  EXPERT_MANAGE_INDEX: '/service-config/expert-manage/index', // 专家管理
  EXPERT_MANAGE_DETAIL: '/service-config/expert-manage/detail', // 专家详情
  ACCOUNT: '/system-config/account', // 账号管理

  CREATIVE_VERIFY: '/verify-agency/creative-verify', // 科技成果审核
  CREATIVE_VERIFY_INDEX: '/verify-agency/creative-verify/index', // 科技成果审核
  CREATIVE_VERIFY_DETAIL: '/verify-agency/creative-verify/detail', // 科技成果详情
  NEED_VERIFY: '/verify-agency/need-verify', // 科技成果审核
  NEED_VERIFY_INDEX: '/verify-agency/need-verify/index', // 科技成果审核
  NEED_VERIFY_DETAIL: '/verify-agency/need-verify/detail', // 科技成果详情
  LOGOUT_VERIFY: '/verify-agency/logout-verify', // 注销审核
  SERVICE_COMMISSIONER_VERIFY: '/user-config/service-commissioner-verify', // 服务专员审核

  AUTHENTICATION_INFO: '/user-config/authentication-info', // 认证信息
  AUTHENTICATION_INFO_INDEX: '/user-config/authentication-info/index', // 认证信息列表
  AUTHENTICATION_INFO_DETAIL: '/user-config/authentication-info/detail', // 认证信息编辑
  USER_FEEDBACK: '/user-config/user-feedback', // 用户反馈
  COMMISSIONER_SERVICE: '/user-config/commissioner-service', // 专员服务记录
  ADMIN_ACCOUNT_DISTRIBUTOR: '/user-config/admin-account-distributor', // 管理员账号分配
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
        path: '/service-config/app-manage',
        name: '应用管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/service-config/app-manage',
            redirect: routeName.APP_MANAGE,
          },
          {
            path: routeName.APP_MANAGE,
            hideInBreadcrumb: true,
            name: '应用管理',
            component: './service_config/app_manage',
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
        name: '服务管理',
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
        path: routeName.ORG_TYPE_MANAGE,
        name: '机构类型管理',
        component: './service_config/org_type_manage',
      },
      {
        path: routeName.EXPERT_MANAGE,
        name: '专家管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: routeName.EXPERT_MANAGE,
            redirect: routeName.EXPERT_MANAGE_INDEX,
          },
          {
            path: routeName.EXPERT_MANAGE_INDEX,
            name: '专家管理',
            hideInBreadcrumb: true,
            component: './service_config/expert_manage',
          },
          {
            path: routeName.EXPERT_MANAGE_DETAIL,
            name: '专家详情',
            component: './service_config/expert_manage/expert_detail',
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
    access: 'SERVICE_CONFIG',
    routes: [
      {
        path: '/user-config',
        redirect: routeName.AUTHENTICATION_INFO_INDEX,
      },
      {
        path: routeName.AUTHENTICATION_INFO,
        name: '认证信息',
        // hideChildrenInMenu: true,
        routes: [
          {
            path: routeName.AUTHENTICATION_INFO,
            redirect: routeName.AUTHENTICATION_INFO_INDEX,
          },
          {
            path: routeName.AUTHENTICATION_INFO_INDEX,
            name: '认证信息',
            hideInBreadcrumb: true,
            component: './user_config/authentication_info',
          },
          {
            path: routeName.AUTHENTICATION_INFO_DETAIL,
            name: '认证信息详情',
            component: './user_config/authentication_info/detail',
          },
        ],
      },
      {
        path: routeName.USER_FEEDBACK,
        name: '用户反馈',
        component: './user_config/user_feedback',
      },

      {
        path: routeName.COMMISSIONER_SERVICE,
        name: '专员服务记录',
        component: './user_config/commissioner_service',
      },
      {
        path: routeName.ADMIN_ACCOUNT_DISTRIBUTOR,
        name: '管理员账号分配',
        component: './user_config/admin_account_distributor',
      },
    ],
  },
  {
    path: '/verify-agency',
    name: '审核代办',
    icon: 'control',
    access: 'SERVICE_CONFIG',
    routes: [
      {
        path: '/verify-agency',
        redirect: routeName.LOGOUT_VERIFY,
      },
      {
        path: routeName.LOGOUT_VERIFY,
        name: '注销审核',
        component: './verify_agency/logout_verify',
      },
      {
        path: routeName.SERVICE_COMMISSIONER_VERIFY,
        name: '服务专员审核',
        component: './verify_agency/service_commissioner_verify',
      },
      {
        path: routeName.CREATIVE_VERIFY,
        name: '科技成果审核',
        hideChildrenInMenu: true,
        routes: [
          {
            path: routeName.CREATIVE_VERIFY,
            redirect: routeName.CREATIVE_VERIFY_INDEX,
          },
          {
            path: routeName.CREATIVE_VERIFY_INDEX,
            name: '科技成果审核',
            hideInBreadcrumb: true,
            component: './verify_agency/creative_verify',
          },
          {
            path: routeName.CREATIVE_VERIFY_DETAIL,
            name: '科技成果详情',
            component: './verify_agency/creative_verify/detail',
          },
        ],
      },
      {
        path: routeName.NEED_VERIFY,
        name: '创新需求审核',
        hideChildrenInMenu: true,
        routes: [
          {
            path: routeName.NEED_VERIFY,
            redirect: routeName.NEED_VERIFY_INDEX,
          },
          {
            path: routeName.NEED_VERIFY_INDEX,
            name: '创新需求审核',
            hideInBreadcrumb: true,
            component: './verify_agency/need_verify',
          },
          {
            path: routeName.NEED_VERIFY_DETAIL,
            name: '创新需求详情',
            component: './verify_agency/need_verify/detail',
          },
        ],
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
