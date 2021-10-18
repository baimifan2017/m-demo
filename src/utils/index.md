---
title: Utils
group:
  title: 输入组件
  path: /other
nav:
  title: components
  path: /components
---

## 何时使用

## API

### request

异步请求工具方法

- 常用配置属性

| 参数         | 说明                                                                                                         | 类型                                                                  | 默认值 | 版本 |
| ------------ | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------ | ---- |
| method       | 请求类型，大小写均可                                                                                         | ’GET'\|'POST'\|'DELETE'\|'PUT'                                        | ’GET‘  |      |
| params       | 请求 URL 参数                                                                                                | object                                                                | -      |      |
| data         | 请求 Body 参数                                                                                               | object\|string\|number                                                | -      |      |
| headers      | 请求头参数，其中内置布尔类型 needToken(是否需要 token,默认为 true)和 neverCancel(禁止重复提交，默认启用)属性 | {[key:string]:value:any}                                              | -      |      |
| responseType | 请求响应类型                                                                                                 | 'arraybuffer' \| 'blob' \| 'document' \| 'json' \| 'text' \| 'stream' | 'json' |      |

> 提示：非 GET 请求类型下可以同时配置 params 和 data。

### storage

本地存储工具方法

- 支持 localStorage 和 sessionStorage
- 为`storage`提供了两个静态对象`localStorage`和`sessionStorage`,两个静态对象都提供了如下方法：

1.  set(key: string, data: any) /\*_ 加密存储 _/
2.  get(key: string) /\*_ 自动解密取出 _/
3.  setNative(key: string, data: any) /\*_ 明文存储 _/
4.  getNative(key: string) /\*_ 明文取出 _/
5.  setWithPrefix(key: string, data: any, prefix?: string) /\*_ 带前缀加密存储 _/
6.  getWithPrefix(key: string, prefix?: string) /\*_ 带前缀自动解密取出 _/
7.  setNativeWithPrefix(key: string, data: any, prefix?: string) /\*_ 带前缀明文存储 _/
8.  getNativeWithPrefix(key: string, prefix?: string) /\*_ 带前缀明文取出 _/
9.  clear(key?: string | string[]) /\*_ 清除某个 key 或多个 key 的存储，若都为空则清除所有的存储 _/
10. clearWithPrefix(key?: string | string[], prefix?: string) /\*_ 清除某个带前缀的 key 或多个 key 的存储，若都为空则清除所有的存储 _/

其中带 Native 为非加密模式，带前缀不给默认是'seid'

- 使用举例

```jsx
import { utils } from 'm-demo';

const { storage } = utils;

storage.localStorage.set('key', { a: 1, b: 2 });
storage.localStorage.get('key');
storage.sessionStorage.set('key', { a: 1, b: 2 });
storage.sessionStorage.get('key');
```

### constants

组件库相关常量

1.  **CANCEL_REQUEST_MESSAGE**

    > 执行取消操作

2.  **CONST_GLOBAL**

    > 全局本地存储 key

    - `SESSION` 会话 key;
    - `TOKEN_KEY` token 的 key;
    - `OLD_TOKEN_KEY` 兼容旧的 token
    - `AUTH` 功能项数据 key;
    - `POLICY` 用户策略 key
    - `CURRENT_LOCALE` 当前语言类型 key
    - `CURRENT_USER` 当前用户 key
    - `FEATURE_KEY` 功能项数据 key;

3.  **AUTH_POLICY**

    > 用户权限策略;

    - `USER` 普通用户 key;
    - `TENANT_ADMIN` 租户管理员 key;
    - `ADMIN` 管理员 key;

**使用举例**

```jsx
import { constants } from 'm-demo';

const { CANCEL_REQUEST_MESSAGE, CONST_GLOBAL, AUTH_POLICY } = constants;
```

### dvaModel

dva 的 model 基类型，通过它可以导出`modelExtend`,`model`,`pageModel`

```ts
import { dvaModel } from 'm-demo';

const { modelExtend, model, pageModel } = dvaModel;
```

- model 内部结构

```ts

  reducers: {
    updateState(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      };
    },
  },

```

- pageModel 内部结构

```ts

   state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: false,
      total: 0,
      current: 1,
      pageSize: 30,
    },
  },

  reducers: {
    updateState(state: any, { payload }: any) {
      const { list, pagination } = payload;
      const { pagination: originPagination = {} } = state || {};
      return {
        ...state,
        list,
        pagination: {
          ...originPagination,
          ...pagination,
        },
      };
    },
  },
```

**_实际应举例_**

```js
import { del, getList, save } from './service';
import { message } from 'antd';
import { utils } from 'm-demo';
import { formatMessage } from 'umi-plugin-react/locale';

const { pathMatchRegexp, modelExtend, model } = utils;

export default modelExtend(model, {
  namespace: 'assetUnit',

  state: {
    list: [],
    rowData: null,
    showModal: false,
    routeList: [
      {
        icon: 'tool',
        name: formatMessage({
          id: 'app.backConfig',
          defaultMessage: '后台配置',
        }),
      },
      {
        name: formatMessage({
          id: 'asset.unit',
          defaultMessage: '资产计量单位管理',
        }),
      },
    ],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/backConfig/assetUnit', location.pathname)) {
          dispatch({
            type: 'queryList',
          });
        }
      });
    },
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const ds = yield call(getList, payload);
      if (ds.success) {
        yield put({
          type: 'updateState',
          payload: {
            list: ds.list,
          },
        });
      } else {
        throw ds;
      }
    },
    *save({ payload, callback }, { call }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(
          formatMessage({
            id: 'global.save-success',
            defaultMessage: '保存成功',
          }),
        );
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *del({ payload, callback }, { call }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(
          formatMessage({
            id: 'global.delete-success',
            defaultMessage: '删除成功',
          }),
        );
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
```

### 其它使用详情请查看代码演示
