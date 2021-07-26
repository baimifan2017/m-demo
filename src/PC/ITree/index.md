---
title: ITree
group:
  title: 功能组件
  path: /pc
nav:
  title: components
  path: /components
  order: 2
---

### 何时使用

- 常用于左树右表的左右结构中

### 基本使用

  <code src="./demos/index.tsx" />

### API

| 参数    | 说明           | 类型                               | 默认值 |
| ------- | ---------------------- | ---------------------------------- | ------ |
| myKey   | 树状节点value           | string                    | -      |
| myTitle | 树状节点name            | string                    | -      |
| onSelect| 点击后事件              | function(row)             | -      |
| renderItemExtra | 树状节点后跟其他操作       | function(row)                | -      |
| header  | 树形选择器头部           | object                | -      |
| store   | 远程加载数据                | object                | -      |
| data    | 本地加载数据                 | array               | -      |

#### header

- 树转选择器头部配置
  默认将头部分为了左右两个部分

| 参数               | 说明                                                          | 类型                    | 默认值  |
| ----------------- | ------------------------------------------------------------- | ----------------------- | ------- |
| left              | 树形选择器头部左侧                                            | string                  | -       |
| powerCode         | 树形选择器头部右侧   

#### store

- 远程加载

| 参数               | 说明                                                          | 类型                    | 默认值  |
| ----------------- | ------------------------------------------------------------- | ----------------------- | ------- |
| url               | 远程加载地址（必填）                                            | string                  | -       |
| option            | 请求配置，包含header，method（默认get）                                            | string                  | -       |

> **_注意_**：

       1.可以在将控制功能按钮显示与隐藏条件写在listArr -> disable中，通过true｜false控制功能按钮显示隐藏权限。

       2.type 图标使用suid中ExtIcon (http://10.4.69.36:1024/components/ext-icon-cn/) 只用传入type即可，例如<Icon type="plus" /> 传入plus。
