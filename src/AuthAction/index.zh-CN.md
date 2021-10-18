---
title: AuthAction
group:
  title: 展示组件
  path: /display
nav:
  title: components
  path: /components
---
## 何时使用

- 对某个操作内容需要功能项权限验证。

## 最基本用法

```jsx
import React from 'react';
import { AuthAction } from 'm-demo';
import { Button } from 'antd';

export default () =>  <AuthAction key="FEATURE_KEY" ignore>
  <Button>新建</Button>
</AuthAction>
```


## API

### ChineseAmount

| 参数     | 说明                   | 类型            | 默认值 | 版本 |
| -------- | ---------------------- | --------------- | ------ | ---- |
| children | 需要功能权限验证的内容 | React.ReactNode | -      |      |
| ignore   | 忽略检查               | boolean         | false  |      |
| key      | 功能项代码             | string          | -      |      |
