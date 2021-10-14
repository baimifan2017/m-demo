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

## 基本使用

```jsx
import React from 'react';
import { ComboList } from 'm-demo';

const data = [
  {
    title: '北京',
    code: '001',
  },
  {
    title: '成都',
    code: '002',
  },
  {
    title: '上海',
    code: '003',
  },
  {
    title: '绵阳',
    code: '004',
  },
];

export default () => (
  <ComboList
    style={{ width: 200 }}
    dataSource={data}
    reader={{
      name: 'title',
      description: 'code',
    }}
  />
);
```
