---
title: ErrorBoundary
group:
  path: /other
nav:
  title: components
  path: /components
order: 1
---

### 何时使用

- 边界错误，防止页面因为某个组件错误而奔溃。

### 基本使用

  <code src="./demos/Base.tsx" />

### API

| 参数    | 说明                           | 类型            | 默认值 |
| ------- | ------------------------------ | --------------- | ------ |
| errNode | 如果被包裹组件发生错误替代方案 | string\/element | -      |

> **_注意_**：

       注意包裹对象颗粒度大小
