---
title: AuthWidget
nav:
  title: components
  path: /components
group:
  path: /display
  title: 展示组件
---

通过传入权限参数控制组件是否显示。

## 何时使用

- 需要根据用户权限当前组件是否可见时使用。

## 最简单的用法， 不带 `authCode`不受权限控制。

```jsx
import React from 'react';
import { AuthWidget } from 'm-demo';
import { Button } from 'antd';

const AuthButton = AuthWidget(Button);

ReactDOM.render(<AuthButton type="primary">123</AuthButton>, mountNode);
```


## 带有 AuthCode，当权限校验不通过时，当前组件不渲染。

```jsx
import React from 'react';
import { AuthWidget } from 'm-demo';
import { Button } from 'antd';

const AuthButton = AuthWidget(Button);

export default () => <AuthButton authCode="authCode" type="primary">
  123
</AuthButton>
```

## 带有 AuthCode，当权限校验通过时，当前组件将会显示，并正常使用。

```jsx
import React from 'react';
import { AuthWidget } from 'm-demo';
import { Button, Input } from 'antd';

const AuthButton = AuthWidget(Button);
const AuthInput = AuthWidget(Input);

export default () => <>
  <AuthButton authCode="authCode" authorities={['authCode']} type="primary">
    123
  </AuthButton>
  <AuthInput
    style={{ marginTop: '8px' }}
    authCode="authCode1"
    authorities={['authCode1', 'authCode']}
  />
</>
```


## API

### AuthWidget

| 参数      | 说明         | 类型      | 默认值 |
| --------- | ------------ | --------- | ------ |
| component | 需要控制组件 | ReactNode | \|     |

> 经过 AuthWidget 包裹的组件会默认加上下面两个参数

### Output

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| authCode | 权限代码 | string | \| |
| authorities | 权限列表。没有传入权限列表时，会默认获取 localStorage 中 authorities 内容。 | string\[] | localStorage.get('authorities') |
