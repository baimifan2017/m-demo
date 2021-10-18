## pathMatchRegexp

## zh-CN

路由匹配判断。

## en-US

Router compare example.

```jsx
import React from 'react';
import { utils } from 'm-demo';

const { pathMatchRegexp } = utils;

export default () => {
  const compareResult = pathMatchRegexp('/fee/demo', '/fee/demo');
  console.log(compareResult);
  return <div>{compareResult ? '成功' : '失败'}</div>;
}
```
