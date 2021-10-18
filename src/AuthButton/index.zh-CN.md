---
title: AuthButton
group:
  title: 展示组件
  path: /display
nav:
  title: components
  path: /components
---

由 AuthWidget 包裹，控制方式与 AuthWidget 相同，传入 authCode 或 authorities 参数控制组件渲染。

## 何时使用

- 需要控制用户权限是否能够使用输入框时。

## 基本使用
```jsx
import React from 'react';
import { AuthButton } from 'm-demo';

export default () => <AuthButton type="primary">123</AuthButton>

```


## 带有 AuthCode

当权限校验不通过时，当前组件不渲染。
```jsx
import React from 'react';
import { AuthButton } from 'm-demo';

export default () =>  <AuthButton authCode="authCode" type="primary">
  123
</AuthButton>;

```

## API

### AuthButton

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| authCode | 权限代码 | string | \| |
| authorities | 权限列表。没有传入权限列表时，会默认获取 localStorage 中 authorities 内容。 | string\[] | localStorage.get('authorities') |

AuthButton 的其他属性和 antd 自带的 [button](https://facebook.github.io/react/docs/events.html#supported-events) 一致。
