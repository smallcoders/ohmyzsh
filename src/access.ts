import Account from '@/types/account';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: Account.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  let permissionCodes = {}

  currentUser?.permissionCodes?.map(p => {
    permissionCodes[p] = true
  })

  console.log('#', {
    ...(currentUser?.menuShowMap || {}),
    ...(permissionCodes || {}),
  })

  // if (currentUser?.type === 'MANAGER_ADMIN') return {}

  return {
    ...(currentUser?.menuShowMap || {}),
    ...(permissionCodes || {}),
  };
}
