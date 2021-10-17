---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic usage
---

## zh-CN

基本使用。

## en-US

Basic usage example.

```jsx
import { DataExport } from 'seid';

const { Button } = DataExport;
const requestParams = {
  url: 'http://rddgit.changhong.com:7300/mock/5dd5efbdc239b926aeb04627/seid.api/user/userList',
};
const explainResponse = res => {
  if (res.success) {
    return res.data;
  }
  return [];
};

ReactDOM.render(
  <Button requestParams={requestParams} type="primary" explainResponse={explainResponse}>
    导出
  </Button>,
  mountNode,
);
```
