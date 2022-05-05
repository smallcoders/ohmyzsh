// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const JavaScriptObfuscator = require('webpack-obfuscator');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const getVersion = (argv: string[]) =>
  argv.find((item) => item.includes('--projectVersion='))?.replace('--projectVersion=', '');
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: false,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  // locale: {
  //   // default zh-CN
  //   default: 'zh-CN',
  //   antd: true,
  //   // default true, when it is true, will use `navigator.language` overwrite default
  //   baseNavigator: true,
  // },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 压缩
      config.plugin('FileManagerPlugin').use(FileManagerPlugin, [
        {
          events: {
            onEnd: {
              archive: [
                {
                  source: './dist',
                  destination: `./zip/iiep-manage-page-${getVersion(process.argv)}.zip`,
                },
              ],
            },
          },
        },
      ]);

      config.plugin('webpack-obfuscator').use(JavaScriptObfuscator, [
        {
          compact: true, //压缩代码
          controlFlowFlattening: false, //是否启用控制流扁平化(降低1.5倍的运行速度)
          deadCodeInjection: false, ///随机的死代码块(增加了混淆代码的大小)
          debugProtection: false, //此选项几乎不可能使用开发者工具的控制台选项卡
          debugProtectionInterval: false, //如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
          disableConsoleOutput: true, //通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
          identifierNamesGenerator: 'hexadecimal', //标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
          log: false,
          renameGlobals: false, //是否启用全局变量和函数名称的混淆
          rotateStringArray: true, //通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
          selfDefending: true, //混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
          stringArray: true, //删除字符串文字并将它们放在一个特殊的数组中
          stringArrayEncoding: false,
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false, //允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
        },
        [],
      ]);
    }
  },
  exportStatic: {},
});
