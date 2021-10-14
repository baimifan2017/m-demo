---
order: 6
title: objectAssignHave
---

## zh-CN

只覆盖已存在的属性 举例。

## en-US

objectAssignHave example.

```jsx
import { utils } from 'm-demo';

const { objectAssignHave } = utils;

function Demo() {
  const tartget = { name: '张三', tip: '你好' };
  const source = { name: '李四', age: 45 };
  objectAssignHave(tartget, source);
  const result = JSON.stringify(tartget);
  return <div>{result}</div>;
}

ReactDOM.render(<Demo />, mountNode);
```
