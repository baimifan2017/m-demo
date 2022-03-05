import { defineConfig } from 'dumi';
import { resolve } from 'path';

export default defineConfig({
  title: 'm-demo',
  mode: 'site',
  locales: [['zh-CN', '中文']],
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/umijs/dumi',
    },
    {
      title: '参考技术',
      path: '链接是可选的',
      // 可通过如下形式嵌套二级导航菜单，目前暂不支持更多层级嵌套：
      children: [
        {
          title: 'x-render',
          path: 'https://x-render.gitee.io/form-render/config/props',
        },
        {
          title: 'pro-component',
          path:
            'https://procomponents.ant.design/components/table/?current=1&pageSize=5',
        },
      ],
    },
    {
      tile: '物料管理',
      path: 'https://appworks.site/materialCenter/antd.html',
    },
  ],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  // styles: [ `body { color: red; }`,`https://./site/static/theme.less`,`./site/static/animate.less`,`./site/static/index.less`],
  // base: '/m-demo',
  // publicPath: '/m-demo/',
  alias: {
    '@': resolve(__dirname, './src'),
    'm-demo': resolve(__dirname, './src'),
    // 'm-demo': resolve(__dirname, './src'),
    pcComponents: resolve(__dirname, './src/Pc/src/components'),
  },
  dynamicImport: {
    loading: '@/AntdComponents/Loading',
  },
  theme: {
    // 主题配置
    // '@primary-color': '#d90921',
  },
  // more config: https://d.umijs.org/config
});
