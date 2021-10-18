## formatMsg

## zh-CN

formatMsg 举例。

## en-US

formatMsg example.

```jsx
import React from 'react';
import { utils } from 'm-demo';

const { formatMsg } = utils;

export default () => {
  const msg = { name: '张三', tip: '你好' };
  return <div>{formatMsg('{name},{tip}!', msg)}</div>;
}
```
