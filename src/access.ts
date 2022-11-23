import Account from '@/types/account';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: Account.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  console.log('用户权限', currentUser)
  let permissionCodes = {}

  currentUser?.permissionCodes?.map(p => {
    permissionCodes[p] = true
  })

  // if (currentUser?.type === 'MANAGER_ADMIN') return {}

  return {
    ...(currentUser?.menuShowMap || {}),
    ...(permissionCodes || {}),
  };
}
