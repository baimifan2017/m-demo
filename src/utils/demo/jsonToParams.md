## jsonToParams

## zh-CN

jsonToParams 举例。

## en-US

jsonToParams example.

```jsx
import React from 'react';
import { utils } from 'm-demo';

const { jsonToParams } = utils;

export default () => {

  const json = { a: 1, b: 2 };
  return <div>{jsonToParams(json)}</div>;
}

```
