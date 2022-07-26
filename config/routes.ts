export const routeName = {
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
  INDUSTRY_TOPIC: '/service-config/industry-topic', // 机构类型管理
  EXPERT_MANAGE: '/service-config/expert-manage', // 专家管理
  EXPERT_MANAGE_INDEX: '/service-config/expert-manage/index', // 专家管理
  EXPERT_MANAGE_DETAIL: '/service-config/expert-manage/detail', // 专家详情
  REQUIREMENT_MANAGEMENT: '/service-config/requirement-management', // 需求管理
  REQUIREMENT_MANAGEMENT_INDEX: '/service-config/requirement-management/index', // 需求管理
  REQUIREMENT_MANAGEMENT_DETAIL: '/service-config/requirement-management/detail', // 需求管理详情
  ACCOUNT: '/system-config/account', // 账号管理

  CREATIVE_VERIFY: '/verify-agency/creative-verify', // 科技成果审核
  CREATIVE_VERIFY_INDEX: '/verify-agency/creative-verify/index', // 科技成果审核
  CREATIVE_VERIFY_DETAIL: '/verify-agency/creative-verify/detail', // 科技成果详情
  NEED_VERIFY: '/verify-agency/need-verify', // 科技成果审核
  NEED_VERIFY_INDEX: '/verify-agency/need-verify/index', // 科技成果审核
  NEED_VERIFY_DETAIL: '/verify-agency/need-verify/detail', // 科技成果详情
  LOGOUT_VERIFY: '/verify-agency/logout-verify', // 注销审核
  SERVICE_COMMISSIONER_VERIFY: '/verify-agency/service-commissioner-verify', // 服务专员审核
  SERVICE_PROGRAMME_VERIFY: '/verify-agency/service-programme-verify', // 服务方案审核
  SERVICE_PROGRAMME_VERIFY_INDEX: '/verify-agency/service-programme-verify/index', // 服务方案审核
  SERVICE_PROGRAMME_VERIFY_DETAIL: '/verify-agency/service-programme-verify/detail', // 服务方案审核详情
  OFFICE_REQUIREMENT_VERIFY: '/verify-agency/office-requirement-verify', // 企业需求审核
  OFFICE_REQUIREMENT_VERIFY_INDEX: '/verify-agency/office-requirement-verify/index', // 企业需求审核
  OFFICE_REQUIREMENT_VERIFY_DETAIL: '/verify-agency/office-requirement-verify/detail', // 企业需求审核详情

  ENTERPRISE_ADMIN_VERIFY: '/verify-agency/enterprise-admin-verify', // 企业管理员审核
  ENTERPRISE_ADMIN_VERIFY_INDEX: '/verify-agency/enterprise-admin-verify/index', // 企业管理员审核
  ENTERPRISE_ADMIN_VERIFY_DETAIL: '/verify-agency/enterprise-admin-verify/detail', // 企业管理员审核详情

  PURCHASE_MANAGE: '/purchase-manage/order-manage', // 订单管理
  PURCHASE_MANAGE_INDEX: '/purchase-manage/order-manage/index', // 订单管理列表
  PURCHASE_MANAGE_DETAIL: '/purchase-manage/order-manage/detail', // 订单管理详情

  AUTHENTICATION_INFO: '/user-config/authentication-info', // 认证信息
  AUTHENTICATION_INFO_INDEX: '/user-config/authentication-info/index', // 认证信息列表
  AUTHENTICATION_INFO_DETAIL: '/user-config/authentication-info/detail', // 认证信息编辑
  USER_FEEDBACK: '/user-config/user-feedback', // 用户反馈
  COMMISSIONER_SERVICE: '/user-config/commissioner-service', // 专员服务记录
  ADMIN_ACCOUNT_DISTRIBUTOR: '/user-config/admin-account-distributor', // 管理员账号分配

  LIVE_TYPES_MAINTAIN: '/live-management/live-types-maintain', //直播类型管理

  ANTELOPE_LIVE_MANAGEMENT: '/live-management/antelope-live-management', // 羚羊直播管理
  // ANTELOPE_LIVE_MANAGEMENT_INDEX: '/live-management/antelope-live-management/index', // 羚羊直播管理
  ANTELOPE_LIVE_MANAGEMENT_ADD: '/live-management/antelope-live-management/add-live', // 新增直播
  ANTELOPE_LIVE_MANAGEMENT_DETAIL: '/live-management/antelope-live-management/detail', // 直播详情

  WONDERFUL_VIDEO_MANAGEMENT: '/live-management/wonderful-video-management', // 精彩视频管理
  WONDERFUL_VIDEO_MANAGEMENT_INDEX: '/live-management/wonderful-video-management/index', // 精彩视频管理
  WONDERFUL_VIDEO_MANAGEMENT_DETAIL: '/live-management/wonderful-video-management/detail', // 视频详情

  SEARCH_RECORD_MANAGEMENT: '/live-management/search-record-management',//直播类型管理
  ANTELOPE_LIVE_INTENTION_COLLECT: '/live-management/intention-collect',// 直播意向采集

  BILL_MANAGEMENT: '/purchase-manage/bill-management', // 发票管理
  SERVICE_TAGS_MANAGE: '/purchase-manage/service-tags-manage', // 服务标签管理
  SALES_TAGS_MANAGE: '/purchase-manage/sales-tags-manage', // 促销标签管理
  PROVIDERS_MANAGE: '/purchase-manage/providers-manage', // 服务商管理
  PROVIDERS_MANAGE_ADD: '/purchase-manage/providers-manage/add-provider', // 新增供应商
  PROVIDER_TYPES: '/purchase-manage/provider-types', // 供应商类型
  SALES_STATISTICS: '/purchase-manage/sales-statistics', // 商品数据统计
  SALES_STATISTICS_DETAIL: '/purchase-manage/sales-statistics/detail', // 活动数据-活动详情

  PROPAGANDA_CONFIG: '/local-propaganda/propaganda-config/index', // 地市宣传页管理
  ADD_PROPAGANDA_CONFIG: '/local-propaganda/propaganda-config/add-management', // 新增地市宣传页管理
  MANAGEMENT_ACTIVITIES: '/local-propaganda/management_activities', // 地市活动管理

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
        path: '/service-config/achievements-manage',
        name: '科技成果管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/service-config/achievements-manage',
            redirect: '/service-config/achievements-manage/index',
          },
          {
            path: '/service-config/achievements-manage/index',
            name: '科技成果管理',
            hideInBreadcrumb: true,
            component: './service_config/achievements_manage',
          },
          {
            path: '/service-config/achievements-manage/detail',
            name: '科技成果详情',
            component: './service_config/achievements_manage/detail',
          },
        ],
      },
      {
        path: '/service-config/creative-need-manage',
        name: '创新需求管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/service-config/creative-need-manage',
            redirect: '/service-config/creative-need-manage/index',
          },
          {
            path: '/service-config/creative-need-manage/index',
            name: '创新需求管理',
            hideInBreadcrumb: true,
            component: './service_config/creative_need_manage/index',
          },
          {
            path: '/service-config/creative-need-manage/detail',
            name: '创新需求详情',
            component: './service_config/creative_need_manage/detail',
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
        path: routeName.REQUIREMENT_MANAGEMENT,
        name: '需求管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: routeName.REQUIREMENT_MANAGEMENT,
            redirect: routeName.REQUIREMENT_MANAGEMENT_INDEX,
          },
          {
            path: routeName.REQUIREMENT_MANAGEMENT_INDEX,
            name: '需求管理',
            hideInBreadcrumb: true,
            component: './service_config/requirement_management/index',
          },
          {
            path: routeName.REQUIREMENT_MANAGEMENT_DETAIL,
            name: '需求详情',
            component: './service_config/requirement_management/detail',
          },
        ],
      },
      {
        path: routeName.NEWS,
        name: '新闻资讯',
        component: './service_config/news',
      },
      {
        path: routeName.INDUSTRY_TOPIC,
        name: '产业专题',
        component: './service_config/industry_topic',
      },
      
    ],
  },
  {
    path: '/local-propaganda',
    name: '地市专题管理',
    icon: 'unordered-list',
    access: 'LOCAL-PROPAGANDA',
    routes: [
      {
        path: '/local-propaganda',
        redirect: '/local-propaganda/propaganda-config',
      },
      {
        path: '/local-propaganda/propaganda-config',
        name: '地市宣传页管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/local-propaganda/propaganda-config',
            redirect: routeName.PROPAGANDA_CONFIG
          },
          {
            path: routeName.PROPAGANDA_CONFIG,
            hideInBreadcrumb: true,
            name: '地市宣传页管理',
            component: './local_propaganda/propaganda_config'
          },
          {
            path: routeName.ADD_PROPAGANDA_CONFIG,
            name: '新增地市宣传页',
            component: './local_propaganda/add_management',
          }
        ]
      },
      {
        path: routeName.MANAGEMENT_ACTIVITIES,
        name: '地市活动管理',
        component: './local_propaganda/management_activities'
      }
    ]
  },
  {
    path: '/operate-data',
    name: '运营数据',
    icon: 'desktop',
    access: 'SERVICE_CONFIG',
    routes: [
      {
        path: '/operate-data',
        redirect: '/operate-data/data-manage/index',
      },

      // {
      //   path: '/operate-data/data-display',
      //   name: '数据展示',
      //   component: './operate_data/data_display',
      // },
      {
        path: '/operate-data/data-manage',
        name: '数据管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/operate-data/data-manage',
            redirect: '/operate-data/data-manage/index',
          },
          {
            path: '/operate-data/data-manage/index',
            name: '数据管理',
            hideInBreadcrumb: true,
            component: './operate_data/data_manage/index',
          },
          {
            path: '/operate-data/data-manage/detail',
            name: '认证信息详情',
            component: './operate_data/data_manage/detail',
          },
        ],
      },
    ],
  },
  {
    path: '/purchase-manage',
    name: '采购管理',
    icon: 'account-book',
    access: 'SERVICE_CONFIG',
    routes: [
      {
        path: '/purchase-manage',
        redirect: '/purchase-manage/commodity-manage',
      },
      {
        path: '/purchase-manage/commodity-manage',
        name: '商品管理',
        component: './purchase_manage/commodity_manage',
      },
      {
        path: '/purchase-manage/commodity-create',
        name: '商品新增',
        hideInMenu: true,
        component: './purchase_manage/commodity_manage/create',
      },
      {
        path: '/purchase-manage/commodity-detail',
        name: '商品详情',
        hideInMenu: true,
        component: './purchase_manage/commodity_manage/detail',
      },
      {
        path: '/purchase-manage/promotions-manage',
        name: '活动管理',
        component: './purchase_manage/promotions_manage',
      },
      {
        path: routeName.BILL_MANAGEMENT,
        name: '发票管理',
        component: './purchase_manage/bill_manage',
      },
      {
        path: routeName.SERVICE_TAGS_MANAGE,
        name: '服务标签管理',
        component: './purchase_manage/service_tags_manage',
      },
      {
        path: routeName.SALES_TAGS_MANAGE,
        name: '促销标签管理',
        component: './purchase_manage/sales_tags_manage',
      },
      {
        path: routeName.PROVIDERS_MANAGE,
        name: '供应商管理',
        component: './purchase_manage/providers_manage',
      },
      {
        path: routeName.PROVIDERS_MANAGE_ADD,
        name: '新增供应商',
        hideInMenu: true,
        component: './purchase_manage/add_provider',
      },
      {
        path: routeName.PROVIDER_TYPES,
        name: '供应商类型',
        component: './purchase_manage/provider_types',
      },
      {
        path: routeName.SALES_STATISTICS,
        name: '销售数据统计',
        component: './purchase_manage/sales_statistics',
      },
      {
        path: routeName.SALES_STATISTICS_DETAIL,
        name: '活动详情',
        hideInMenu: true,
        component: './purchase_manage/sales_statistics/detail',
      },
      {
        path: '/purchase-manage/promotions-create',
        name: '活动新增',
        hideInMenu: true,
        component: './purchase_manage/promotions_manage/create',
      },
      {
        path: '/purchase-manage/promotions-detail',
        name: '活动详情',
        hideInMenu: true,
        component: './purchase_manage/promotions_manage/detail',
      },
      {
        path: routeName.PURCHASE_MANAGE,
        name: '订单管理',
        hideChildrenInMenu: true,
        routes: [
          {
            path: routeName.PURCHASE_MANAGE,
            redirect: routeName.PURCHASE_MANAGE_INDEX,
          },
          {
            path: routeName.PURCHASE_MANAGE_INDEX,
            name: '订单管理',
            hideInBreadcrumb: true,
            component: './purchase_manage/order_manage',
          },
          {
            path: routeName.PURCHASE_MANAGE_DETAIL,
            name: '订单详情',
            component: './purchase_manage/order_manage/detail',
          },
        ],
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
        hideChildrenInMenu: true,
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
        name: '科产管理员配置',
        component: './user_config/admin_account_distributor',
      },
    ],
  },
  {
    path: '/verify-agency',
    name: '审核待办',
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
      {
        path: routeName.SERVICE_PROGRAMME_VERIFY,
        name: '服务方案审核',
        hideChildrenInMenu: true,
        routes: [
          {
            path: routeName.SERVICE_PROGRAMME_VERIFY,
            redirect: routeName.SERVICE_PROGRAMME_VERIFY_INDEX,
          },
          {
            path: routeName.SERVICE_PROGRAMME_VERIFY_INDEX,
            name: '服务方案审核',
            hideInBreadcrumb: true,
            component: './verify_agency/service_programme_verify',
          },
          {
            path: routeName.SERVICE_PROGRAMME_VERIFY_DETAIL,
            name: '审核详情',
            component: './verify_agency/service_programme_verify/detail',
          },
        ],
      },
      {
        path: routeName.OFFICE_REQUIREMENT_VERIFY,
        name: '企业需求审核',
        hideChildrenInMenu: true,
        routes: [
          {
            path: routeName.OFFICE_REQUIREMENT_VERIFY,
            redirect: routeName.OFFICE_REQUIREMENT_VERIFY_INDEX,
          },
          {
            path: routeName.OFFICE_REQUIREMENT_VERIFY_INDEX,
            name: '企业需求审核',
            hideInBreadcrumb: true,
            component: './verify_agency/office_requirement_verify/index',
          },
          {
            path: routeName.OFFICE_REQUIREMENT_VERIFY_DETAIL,
            name: '审核详情',
            component: './verify_agency/office_requirement_verify/detail',
          },
        ],
      },
      {
        path: routeName.ENTERPRISE_ADMIN_VERIFY,
        name: '企业管理员审核',
        hideChildrenInMenu: true,
        routes: [
          {
            path: routeName.ENTERPRISE_ADMIN_VERIFY,
            redirect: routeName.ENTERPRISE_ADMIN_VERIFY_INDEX,
          },
          {
            path: routeName.ENTERPRISE_ADMIN_VERIFY_INDEX,
            name: '企业管理员审核',
            hideInBreadcrumb: true,
            component: './verify_agency/enterprise_admin_verify',
          },
          {
            path: routeName.ENTERPRISE_ADMIN_VERIFY_DETAIL,
            name: '企业管理员审核详情',
            component: './verify_agency/enterprise_admin_verify/components/detail',
          },
        ],
      }
    ],
  },
  {
    path: '/live-management',
    name: '直播管理',
    icon: 'DesktopOutlined',
    access: 'SERVICE_CONFIG',
    routes: [
      {
        path: '/live-management',
        redirect: routeName.LIVE_TYPES_MAINTAIN,
      },
      {
        path: routeName.LIVE_TYPES_MAINTAIN,
        name: '直播类型维护',
        component: './live_management/live_types_maintain',
      },
      {
        path: routeName.ANTELOPE_LIVE_MANAGEMENT,
        name: '羚羊直播管理',
        hideChildrenInMenu: true,
        routes: [
          // {
          //   path: routeName.ANTELOPE_LIVE_MANAGEMENT,
          //   redirect: routeName.ANTELOPE_LIVE_MANAGEMENT_INDEX
          // },
          {
            path: routeName.ANTELOPE_LIVE_MANAGEMENT,
            name: '羚羊直播管理',
            component: './live_management/antelope_live_management',
          },
          {
            path: routeName.ANTELOPE_LIVE_MANAGEMENT_ADD,
            name: '新增直播',
            component: './live_management/add_live',
          },
          {
            path: routeName.ANTELOPE_LIVE_MANAGEMENT_DETAIL,
            name: '直播详情',
            component: './live_management/antelope_live_management/detail',
          },
        ],
      },
      {
        path: routeName.WONDERFUL_VIDEO_MANAGEMENT,
        name: '精彩视频管理',
        hideChildrenInMenu: true,
        routes: [
          // {
          //   path: routeName.WONDERFUL_VIDEO_MANAGEMENT,
          //   redirect: routeName.WONDERFUL_VIDEO_MANAGEMENT_INDEX
          // },
          {
            path: routeName.WONDERFUL_VIDEO_MANAGEMENT,
            name: '精彩视频管理',
            component: './live_management/wonderful_video_management',
          },
          {
            path: routeName.WONDERFUL_VIDEO_MANAGEMENT_DETAIL,
            name: '视频详情',
            component: './live_management/wonderful_video_management/detail',
          },
        ],
      },
      {
        path: routeName.SEARCH_RECORD_MANAGEMENT,
        name: '搜索记录管理',
        component: './live_management/search_record_management',
      },
      {
        path: routeName.ANTELOPE_LIVE_INTENTION_COLLECT,
        name: '直播意向采集',
        component: './live_management/intention_collect',
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
