---
order: 2
title: jsonToParams
---

## zh-CN

jsonToParams 举例。

## en-US

jsonToParams example.

```jsx
import { utils } from 'm-demo';

const { jsonToParams } = utils;

function Demo() {
  const json = { a: 1, b: 2 };
  return <div>{jsonToParams(json)}</div>;
}

ReactDOM.render(<Demo />, mountNode);
```
