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
// 开发 http://10.40.152.206:10086
// 测试 http://10.40.152.24:10086
// --no-ignore
/*
  服务器地址匹配
  1.0
    dev    http://10.40.152.206:10086
    test    http://10.40.152.24:10086
  2.0
    dev    http://172.30.33.222:10086
    test    http://172.30.33.212:10086

*/
export default {
  dev: {
    '/antelope-manage/': {
      target: 'http://172.30.33.212:10086',
      // target: 'http://10.8.7.227:9093',
      // target: 'http://10.8.5.110:9093',
      // target: 'http://172.30.35.217:9095',
      // target: 'http://172.30.35.217:8089',
      changeOrigin: true,
      pathRewrite: { '^': '' },
      // pathRewrite: { '^/antelope-manage': '' },
    },
    '/antelope-live/': {
      target: 'http://10.40.152.206:10086',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/antelope-pay/': {
      target: 'http://172.30.33.212:10086',
      // target: 'http://10.8.7.227:8089',
      changeOrigin: true,
      pathRewrite: { '^': '' },
      // pathRewrite: { '^/antelope-pay': '' },
    },
    '/antelope-diagnose/': {
      target: 'http://172.30.33.212:10086',
      // target: 'http://10.8.5.66:9103', // 张海刚
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/antelope-common/': {
      target: 'http://172.30.33.212:10086',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/antelope-user/': {
      target: 'http://172.30.33.212:10086',
      // target: 'http://10.8.7.33:8090',
      changeOrigin: true,
      pathRewrite: { '^': '' },
      // pathRewrite: { '^/antelope-user': '' },
    },
    '/antelope-science/': {
      target: 'http://172.30.35.227:10086',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/antelope-other/': {
      target: 'http://172.30.33.212:10086',
      // target: 'http://10.8.7.227:9099',
      changeOrigin: true,
      pathRewrite: { '^': '' },
      // pathRewrite: { '^/antelope-other': '' },
    },
    '/antelope-finance/': {
      target: 'http://172.30.33.212:10086',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/antelope-recommend/': {
      target: 'http://172.30.33.212:10086',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
