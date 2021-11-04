---
title: ExtIcon
nav:
  title: components
  path: /components
group:
  path: /display
  title: 展示组件
---
## 何时使用  

## 组件库图标列表
  
## 基本使用
```jsx
import React from 'react';
import { ExtIcon } from "m-demo";
 
export default () =>   <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: 36 }}>
  <ExtIcon type="plus" antd />
  <ExtIcon type="word" />
  <ExtIcon type="full-screen" spin />
  <ExtIcon
    type="StepForwardOutlined"
    antd
    tooltip={{ title: '这是一个antd图标可以响应点击事件' }}
    onClick={() => message.info('click')}
  />
</div>
```


## 带工具提示
```jsx
import React from 'react';
import { message } from 'antd';
import { ExtIcon } from "m-demo";

export default () => <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '12px' }}>
  <ExtIcon
    tooltip={{ title: '这是一个文件图标单击事件不可用' }}
    type="column"
    onClick={() => message.info('click')}
    disabled
  />  
  <ExtIcon
    type="exit-full-screen"
    tooltip={{ title: '这是一个word文档图标可以响应点击事件' }}
    onClick={() => message.info('click')}
  />  
  <ExtIcon
    type="full-screen"
    tooltip={{ title: '这是一个全屏图标可以响应点击事件' }}
    onClick={() => message.info('click')}
  />
  <ExtIcon
    type="copy"
    antd
    tooltip={{ title: '这是一个antd图标可以响应点击事件' }}
    onClick={() => message.info('click')}
  />
  
</div>
```


## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| antd | 是否 antd 图标 | boolean | false |  |
| disabled | 是否可用，具有 onClick 的时候有效 | boolean | false |  |
| font | 字体 SVG 图标库名称(iconfont 图标库项目的 FontClass/Symbol 前缀) | string | 'seid-font' |  |
| tooltip | 工具提示 | TooltipProps[属性配置参照 Tooltip 组件](https://ant.design/components/tooltip-cn/) | - |  |

> 备注，其它属性配置请参照 antd 的[Icon](https://ant.design/components/icon-cn/)组件。
