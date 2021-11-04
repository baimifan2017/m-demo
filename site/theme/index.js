const path = require('path');

const homeTmpl = './template/Home/index';
const contentTmpl = './template/Content/index';
const appShellTmpl = './template/AppShell';
const systemTmpl = './template/Demos/SystemSetting';
const stationNewsTmpl = './template/Demos/StationNewsList'; // 站内消息列表
const stationNewsManageTmpl = './template/Demos/StationNewsManage'; // 站内消息管理
const testTmpl = './template/Test/index'; // 测试用例

function pickerGenerator(module) {
  const tester = new RegExp(`^docs/${module}`);
  return markdownData => {
    const { filename } = markdownData.meta;
    if (tester.test(filename) && !/\/demo$/.test(path.dirname(filename))) {
      return {
        meta: markdownData.meta,
      };
    }
    return null;
  };
}

module.exports = {
  lazyLoad(nodePath, nodeValue) {
    if (typeof nodeValue === 'string') {
      return true;
    }
    return nodePath.endsWith('/demo');
  },
  pick: {
    components(markdownData) {
      const { filename } = markdownData.meta;
      if (!/^components/.test(filename) || /[/\\]demo$/.test(path.dirname(filename))) {
        return null;
      }
      return {
        meta: markdownData.meta,
      };
    },
    changelog(markdownData) {
      if (/CHANGELOG/.test(markdownData.meta.filename)) {
        return {
          meta: markdownData.meta,
        };
      }
      return null;
    },
    'docs/react': pickerGenerator('react'),
    'docs/front': pickerGenerator('front'),
    'docs/service': pickerGenerator('service'),
    'docs/bigData': pickerGenerator('bigData'),
    'docs/framework': pickerGenerator('framework'),
    'docs/resource': pickerGenerator('resource'),
    'docs/feed-back': pickerGenerator('feed-back'),
    'docs/spec': pickerGenerator('spec'),
  },
  plugins: [
    'bisheng-plugin-description',
    'bisheng-plugin-toc?maxDepth=2&keepElem',
    'bisheng-plugin-antd?injectProvider',
    'bisheng-plugin-react?lang=__react',
    // 'bisheng-plugin-apigen?exclude1=cache-storage&exclude2=util&exclude3=auth-widget&exclude4=http-request&exclude5=ext-icon',
  ],
  routes: {
    path: '/',
    component: './template/Layout/index',
    indexRoute: { component: homeTmpl },
    childRoutes: [
      {
        path: 'app-shell',
        component: appShellTmpl,
      },
      {
        path: 'index-cn',
        component: homeTmpl,
      },
      {
        path: 'docs/react/:children',
        component: contentTmpl,
      },
      {
        path: 'changelog',
        component: contentTmpl,
      },
      {
        path: 'changelog-cn',
        component: contentTmpl,
      },
      {
        path: 'components/:children/',
        component: contentTmpl,
      },
      {
        path: 'docs/front/:children',
        component: contentTmpl,
      },
      {
        path: 'docs/service/:children',
        component: contentTmpl,
      },
      {
        path: 'docs/framework/:children',
        component: contentTmpl,
      },
      {
        path: 'docs/bigData/:children',
        component: contentTmpl,
      },
      {
        path: 'docs/feed-back/:children',
        component: contentTmpl,
      },
      {
        path: 'demos/system-setting',
        component: systemTmpl,
      },
      {
        path: 'demos/system-setting-cn',
        component: systemTmpl,
      },
      {
        path: 'stationNewsList',
        component: stationNewsTmpl,
      },
      {
        path: 'stationNewsList-cn',
        component: stationNewsTmpl,
      },
      {
        path: 'stationNewsManage-cn',
        component: stationNewsManageTmpl,
      },
      {
        path: 'stationNewsManage',
        component: stationNewsManageTmpl,
      },
      {
        path: 'test-cn',
        component: testTmpl,
      },
    ],
  },
};
