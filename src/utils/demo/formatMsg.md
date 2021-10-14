---
order: 4
title: formatMsg
---

## zh-CN

formatMsg 举例。

## en-US

formatMsg example.

```jsx
import { utils } from 'm-demo';

const { formatMsg } = utils;

function Demo() {
  const msg = { name: '张三', tip: '你好' };
  return <div>{formatMsg('{name},{tip}!', msg)}</div>;
}

ReactDOM.render(<Demo />, mountNode);
```
