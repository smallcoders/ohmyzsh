import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { RequestOptionsInit } from 'umi-request';
import type { RunTimeLayoutConfig, RequestConfig } from 'umi'; // RequestConfig
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { getCurrentUser } from '@/services/account';
import type Account from '@/types/account';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
// import { RequestOptionsInit } from 'umi-request';
// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: Account.CurrentUser;
  fetchUserInfo?: () => Promise<Account.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const { result } = await getCurrentUser();
      return result;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      // 界面中的水印
      content: '',
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
    logo: require('@/assets/system/logo-img.png'),
  };
};

// 请求拦截
function requestInterceptors(url: string, options: RequestOptionsInit) {
  // console.log('url', url)
  // // 设置代理前缀/api
  // const newUrl = `http://10.7.107.89:9090${url}`;
  // const obj: any = options;
  return {
    url: url,
    options,
  };
}

/**
 * 登录会话过期，跳转登录页面
 * @param response
 * @param options
 */
const responseInterceptors = (response: Response) => {
  //console.log(response);
  // 403，会话过期
  if (response.status === 403) {
    history.push(loginPath);
    throw new Error('会话已经过期，请重新登录');
  }

  console.log('response', response);

  return response;
};

export const request: RequestConfig = {
  requestInterceptors: [requestInterceptors],
  responseInterceptors: [responseInterceptors],
};
