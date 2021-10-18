## authAction

## zh-CN

功能权限检查方法 举例。

## en-US

authAction example.

```jsx
import React from 'react';
import { utils } from 'm-demo';
import { Button } from 'antd';

const { authAction, storage, constants } = utils;

export default () => {
  const auth = ['CREATE', 'DELETE_ITEM'];

  storage.sessionStorage.set(constants.CONST_GLOBAL.AUTH, auth);
  const fmsAuth = storage.sessionStorage.get(constants.CONST_GLOBAL.AUTH);
  return (<div>
    {authAction(<Button key="CREATE">创建</Button>)}
    {authAction(<Button key="DELETE">删除</Button>)}
    {authAction(
      <Button key="DELETE" ignore="true">
        忽略检查
      </Button>,
    )}
  </div>)
}
```
