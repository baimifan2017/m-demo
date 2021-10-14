---
title: ComboList
nav:
  title: components
  path: /components
group:
  path: /input
  title: 输入组件
  order: 1
---

## 通过接口获取数据

```jsx
import React from 'react';
import { ComboList } from 'm-demo';

export default () => (
  <ComboList
    style={{ width: 280 }}
    store={{
      autoLoad: false,
      url: `http://rddgit.changhong.com:7300/mock/5dd5efbdc239b926aeb04627/seid.api/receiverType/list`,
    }}
    rowKey="name"
    reader={{
      name: 'remark',
      description: 'name',
    }}
  />
);
```
