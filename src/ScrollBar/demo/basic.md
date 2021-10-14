---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic usage
---

## 基本使用

```jsx
import React from 'react';
import { ScrollBar } from 'm-demo';

const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    content: `m-demo design part ${i}`,
  });
}

export default (
  <div style={{ height: 300 }}>
    <ScrollBar>
      <div>
        {listData.map(item => (
          <div style={{ padding: '8px 0' }}>{item.content}</div>
        ))}
      </div>
    </ScrollBar>
  </div>
);
```
