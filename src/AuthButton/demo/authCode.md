---
order: 1
title:
  zh-CN: AuthCode
  en-US: AuthCode
---

## zh-CN

带有 AuthCode，当权限校验不通过时，当前组件不渲染。

## en-US

with `authCode`, if have no auth, this components will not be rendered.

```jsx
import { AuthButton } from 'seid';

ReactDOM.render(
  <AuthButton authCode="authCode" type="primary">
    123
  </AuthButton>,
  mountNode,
);
```
