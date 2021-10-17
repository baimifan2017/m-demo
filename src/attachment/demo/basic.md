---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

最简单的用法。

## en-US

The simplest usage.

```jsx
import { Attachment } from 'seid';
import get from 'lodash/get';

const attachmentProps = {
  serviceHost: 'http://10.4.208.87',
  multiple: true,
};

ReactDOM.render(<Attachment {...attachmentProps} />, mountNode);
```
