---
title: ToolBar
group:
  title: 展示组件
  path: /display
nav:
  title: components
  path: /components
---


A New Component
  
## 何时使用

  
## 基本使用

基本使用。

```jsx
import React from 'react';
import { Input, Button } from 'antd';
import { ToolBar } from 'm-demo';

const props = {
  left: <Button onClick={() => console.log('新增')}>新增</Button>,
  right: <Input style={{ width: 200 }} />,
  extra: <span>ttt</span>,
};

export default () => <ToolBar {...props} />
```

## 带样式
通过传入 Style 内容控制三个区域的样式展示效果。

```jsx
import React from 'react';
import { Input, Button } from 'antd';
import { ToolBar } from 'm-demo';

const specialRight = (
  <>
    <Input style={{ width: 200 }} />
    12345123451234512345123451234512345
  </>
);

const props = {
  left: <Button onClick={() => console.log('新增')}>新增</Button>,
  right: (
    <>
      <Input style={{ width: 200 }} />
      12345
    </>
  ),
};

export default () => <>
  <ToolBar {...props} rowStyle={{ padding: '13px 6px' }} leftStyle={{ background: '#c3c' }} />
  
  <ToolBar
    left={
      <>
        <Button onClick={() => console.log('新增')}>新增</Button>
        <Button onClick={() => console.log('新增')}>新增</Button>
        <Button onClick={() => console.log('新增')}>新增</Button>
        <Button onClick={() => console.log('新增')}>新增</Button>
      </>
    } 
    right={specialRight}
    rowStyle={{ padding: '13px 6px' }}
    leftStyle={{ background: '#c3c' }}
  />
</>
```

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| left | 左边组件 | ReactNode | - | --- |
| right | 右边组件 | ReactNode | - | --- |
| layout | 布局,格栅布局 | {leftSpan:number,rightSpan:number} | {leftSpan:12,rightSpan:12} | --- |
| style | 样式 | CSSProperties | - | --- |
| className | 样式类名 | string | - | --- |
| leftStyle | 左边布局样式 | CSSProperties | - | --- |
| rightStyle | 右边布局样式 | CSSProperties | - | --- |
| leftClassName | 左边布局样式类名 | string | - | --- |
| rightClassName | 右边布局样式类名 | string | - | --- |
| extra | 最右边额外的组件 | ReactNode | - | --- |
