---
order: 3
title:
  zh-CN: 限制文件类型
  en-US: limit file type
---

## zh-CN

限制文件类型。

## en-US

limit file type usage.

```jsx
import { Attachment, ExtIcon } from 'seid';
import get from 'lodash/get';

const attachmentProps = {
  serviceHost: 'http://10.4.208.87',
  multiple: true,
  limitFileExt: ['xls', 'xlsx', 'doc', 'docx'],
};

ReactDOM.render(<Attachment {...attachmentProps} />, mountNode);
```
