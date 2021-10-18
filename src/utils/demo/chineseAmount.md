## chineseAmount

中文金额函数使用方式 举例。

## en-US

chineseAmount usage example.

```jsx
import React from 'react';
import { utils } from 'm-demo';

const { chineseAmount } = utils;

export default () => {
  return <div>{chineseAmount(12345678.12)}</div>;
}
```
