---
title: ListLoader
nav:
  title: components
  path: /components
group:
  path: /display
  title: 展示组件
---
## 何时使用

- 当页面某些列表块数据加载时，显示等待状态。

## zh-CN

基本使用。

## en-US

Basic usage example.

```tsx
import React from "react";
import { ListLoader } from "m-demo";

export default () => <ListLoader />;  
```


## API

### ListLoader

| 参数      | 说明         | 类型                | 默认值 | 版本 |
| --------- | ------------ | ------------------- | ------ | ---- |
| className | 样式类名     | string              | -      |      |
| spinning  | 是否加载     | boolean             | true   |      |
| style     | css 属性配置 | React.CSSProperties | -      |      |

### 颜色可进行全局变量配置

- 颜色依赖 antd 的全局主色 @primary-color

```less
@primary-color: '@primary-color透明度的65%';
```
