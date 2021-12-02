/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
// 云聪 10.7.106.58:9090
// 叶杨 10.7.104.146:9090
// 开发 http://10.40.152.24:7001
// 测试 http://10.40.152.24:10086
// --no-ignore
export default {
  dev: {
    '/iiep-manage/': {
      target: 'http://10.40.152.24:10086',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/statement/': {
      target: 'http://10.40.152.24:10086',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
