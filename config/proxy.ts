/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
// --no-ignore
export default {
  dev: {
    '/iiep-manage/': {
      target: 'http://10.7.105.219:9090',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/iiep-manage/uap': {
      target: 'http://10.7.105.219:9090',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/iiep-manage/account': {
      target: 'http://10.7.105.219:9090',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  // test: {
  //   '/api/': {
  //     target: 'https://preview.pro.ant.design',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
  // pre: {
  //   '/api/': {
  //     target: 'your pre url',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
};
