---
order: 1
title: pathMatchRegexp
---

## zh-CN

路由匹配判断。

## en-US

Router compare example.

```jsx
import { utils } from 'm-demo';

const { pathMatchRegexp } = utils;

function Demo() {
  const compareResult = pathMatchRegexp('/fee/demo', '/fee/demo');
  console.log(compareResult);
  return <div>{compareResult ? '成功' : '失败'}</div>;
}

ReactDOM.render(<Demo />, mountNode);
```
