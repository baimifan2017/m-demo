## getFlatTree

## zh-CN

将数据结构的数据转换成一维数组 举例。

## en-US

getFlatTree example.

```jsx
import React from 'react';
import { utils } from 'm-demo';

const { getFlatTree } = utils;

const treeData = [
  { id: '1', text: 'a', children: [{ id: '10', text: 'aa' }] },
  { id: '2', text: 'b' },
];

export default () => {
  const flatTree = getFlatTree(treeData);
  return <div>{JSON.stringify(flatTree)}</div>;
}
```
