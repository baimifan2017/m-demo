---
order: 5
title: objectAssignAppend
---

## zh-CN

只追加没有的属性 举例。

## en-US

objectAssignAppend example.

```jsx
import { utils } from 'm-demo';

const { objectAssignAppend } = utils;

function Demo() {
  const tartget = { name: '张三', tip: '你好' };
  const source = { name: '李四', age: 45 };
  objectAssignAppend(tartget, source);
  const result = JSON.stringify(tartget);
  return <div>{result}</div>;
}

ReactDOM.render(<Demo />, mountNode);
```
