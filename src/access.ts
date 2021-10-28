import Account from '@/types/account';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: Account.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    // 服务配置权限 （运营账号 + 运营管理员）
    SERVICE_CONFIG:
      currentUser && (currentUser.type === 'MANAGER' || currentUser.type === 'MANAGER_ADMIN'),
    // 系统配置权限 （运营管理员）
    SYSTEM_CONFIG: currentUser && currentUser.type === 'MANAGER_ADMIN',
  };
}
