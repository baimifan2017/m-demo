---
order: 9
title: chineseAmount
---## zh-CN

中文金额函数使用方式 举例。

## en-US

chineseAmount usage example.

```jsx
import { utils } from 'm-demo';

const { chineseAmount } = utils;

function Demo() {
  return <div>{chineseAmount(12345678.12)}</div>;
}

ReactDOM.render(<Demo />, mountNode);
```
