---
title: Panel
nav:
  title: components
  path: /components
group:
  path: /display
  title: 展示组件
---
## 何时使用

## 基本使用

```jsx

import React from 'react';

import { Panel } from "m-demo";

export default () => <Panel title="面板标题">这是面板容器组件</Panel>

```

## 无标题 

```jsx

import React from 'react';

import { Panel } from "m-demo";

export default () => <Panel title="无标题栏面板" showHeader={false} bordered={false}>

  这是无标题栏面板

</Panel>

```

## 可以滚动

```jsx

import React from 'react';

import { Panel } from "m-demo";

export default () => <Panel title="面板标题" scroll>

  <p>这是面板容器组件</p>

  <p>这是面板容器组件</p>

  <p>这是面板容器组件</p>

  <p>这是面板容器组件</p>

  <p>这是面板容器组件</p>

  <p>这是面板容器组件</p>

  <p>这是面板容器组件</p>

  <p>这是面板容器组件</p>

  <p>这是面板容器组件</p>

  <p>这是面板容器组件</p>

</Panel>

```

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bordered | 是否有边框 | boolean | true |  |
| closable | 是否显示关闭按钮 | boolean | false |  |
| className | 选择框样式名 | string | - |  |  |
| collapse | 允许收起面板内容 | boolean | true |  |
| cover | 是否覆盖面板内容 | boolean | false |  |
| expand | 允许最大化 | boolean | true |  |
| height | 面板高度 | string\|number | 260 |  |  |
| onChange | 展开与收起回调,参考[配置项](#IChangeProps) | Function(IChangeProps)=>void |  |  |
| onRefresh | 刷新回调 | Function()=>void |  |  |
| onClose | 关闭面板回调 | Function(panelKey)=>void |  |  |
| onResize | 面板高宽发生变化自动触发该事件,[事情参数详情](#Size) | Function(Size)=>void |  |  |
| showHeader | 显示标题栏 | boolean | true |  |  |
| style | css 属性配置 | React.CSSProperties | - |  |  |
| scroll | 面板内容允许滚动 | boolean | false |  |  |
| title | 面板标题 | string | - |  |  |
| width | 面板宽度 | string\|number | '100%' |  |  |  |

### IChangeProps

| 参数     | 说明           | 类型    | 默认值 | 版本 |
| -------- | -------------- | ------- | ------ | ---- |
| collapse | 面板是否收起   | boolean |        |      |
| expand   | 面板是否最大化 | boolean |        |

### Size

| 参数       | 说明             | 类型   | 默认值 | 版本 |
| ---------- | ---------------- | ------ | ------ | ---- |
| height     | 面板的高度       | number |        |      |
| bodyHeight | 面板 Body 的高度 | number |        |      |
| width      | 面板的宽度       | number |        |      |
| bodyWidth  | 面板 Body 的宽度 | number |        |      |
