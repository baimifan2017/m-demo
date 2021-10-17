---
category: Components
subtitle: Auth Button
type: Business
title: AuthButton
---

由 AuthWidget 包裹，控制方式与 AuthWidget 相同，传入 authCode 或 authorities 参数控制组件渲染。

## When To Use

- 需要控制用户权限是否能够使用输入框时。

## API

### AuthButton

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| authCode | 权限代码 | string | \| |
| authorities | 权限列表。没有传入权限列表时，会默认获取 localStorage 中 authorities 内容。 | string\[] | localStorage.get('authorities') |

AuthButton 的其他属性和 antd 自带的 [button](https://facebook.github.io/react/docs/events.html#supported-events) 一致。
