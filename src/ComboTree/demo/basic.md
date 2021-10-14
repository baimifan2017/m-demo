---
title: ComboList
nav:
  title: components
  path: /components
group:
  path: /input
  title: 输入组件
order: 1
---

## 基本使用

```jsx
import React from 'react';
import { ComboTree } from 'm-demo';

const treeData = [
  {
    title: '四川省',
    id: '0-0',
    children: [
      {
        title: '成都市',
        id: '0-0-0',
        children: [
          { title: '天府新区', id: '0-0-0-0' },
          { title: '武侯区', id: '0-0-0-1' },
          { title: '成华区', id: '0-0-0-2' },
        ],
      },
      {
        title: '绵阳市',
        id: '0-0-1',
        children: [
          { title: '高新区', id: '0-0-1-0' },
          { title: '经开区', id: '0-0-1-1' },
          { title: '江油市', id: '0-0-1-2' },
        ],
      },
      {
        title: '德阳市',
        id: '0-0-2',
      },
    ],
  },
  {
    title: '北京市',
    id: '0-1',
    children: [
      { title: '朝阳区', id: '0-1-0-0' },
      { title: '海淀区', id: '0-1-0-1' },
      { title: '西城区', id: '0-1-0-2' },
    ],
  },
  {
    title: '杭州市',
    id: '0-2',
  },
];

class App extends React.Component {
  handlerAfterSelect = item => {
    console.log(item);
  };

  render() {
    return (
      <ComboTree
        style={{ width: '100%' }}
        dataSource={treeData}
        allowClear
        afterSelect={this.handlerAfterSelect}
        reader={{
          name: 'title',
        }}
      />
    );
  }
}

export default App;
```
