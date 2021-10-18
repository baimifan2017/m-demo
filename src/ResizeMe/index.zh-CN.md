---
title: ResizeMe
group:
  title: 输入组件
  path: /input
nav:
  title: components
  path: /components
---


## 何时使用

- 需要监听父组件容器大小变化时，子组件自适应父组件的高度和宽度。


##  基本使用
```jsx
import React from 'react';
import { ResizeMe } from 'm-demo';

class Demo extends React.PureComponent {
  render() {
    const { size } = this.props;
    return (
      <>
        <div>
          <span>父组件宽度:</span>
          <span>{`${size.width} px`}</span>
        </div>
        <div>
          <span>父组件高度:</span>
          <span>{`${size.height} px`}</span>
        </div>
      </>
    );
  }
}

const ChildDemo = ResizeMe()(Demo);

class ParentDemo extends React.PureComponent {
  render() {
    return (
      <div style={{ width: 300, height: 100 }}>
        <ChildDemo />
      </div>
    );
  }
}

export default ParentDemo;
```


#### 注意

> 此组件为高级函数组件，只能以装饰器或组件传入，并且只能是带有 class 的组件。

## API

- 无

## 使用方式

- 在一个类上增加这个装饰器，可以监听组件的大小变化，被包装的类在 porps 中将自动注入 size 属性对象（即组件的 width 和 height），并且在上级函组件中可以使用 onResizeMe 函数。
