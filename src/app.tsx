import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi'; // RequestConfig
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { getCurrentManager } from '@/services/manager';
import type Manager from '@/types/manager';
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
  currentUser?: Manager.CurrentUser;
  fetchUserInfo?: () => Promise<Manager.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const { result } = await getCurrentManager();
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
    // links: isDev
    //   ? [
    //     <Link to="/umi/plugin/openapi" target="_blank">
    //       <LinkOutlined />
    //       <span>OpenAPI 文档</span>
    //     </Link>,
    //     <Link to="/~docs">
    //       <BookOutlined />
    //       <span>业务组件文档</span>
    //     </Link>,
    //   ]
    //   : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
    logo: require('@/assets/system/logo-img.png'),
  };
};

// // 请求拦截
// function requestInterceptors(url: string, options: RequestOptionsInit) {
//   console.log('url', url)
//   // 设置代理前缀/api
//   const newUrl = `http://10.7.106.44:3000/${url}`;
//   const obj: any = options;
//   return {
//     url: newUrl,
//     options: obj,
//   };
// }

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
  return response;
};

export const request: RequestConfig = {
  //requestInterceptors: [requestInterceptors],
  responseInterceptors: [responseInterceptors],
};
