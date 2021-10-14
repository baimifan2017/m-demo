---
title: Action
group:
  title: 其他
  path: /other
nav:
  title: components
  path: /components
---

### 何时使用

- Table 中的操作按钮
- 默认 3 个功能按钮，超过 3 个功能按钮，更多部分为省略号。

### 基本使用

  <code src="./demos/Base.tsx" />

### API

| 参数    | 说明                    | 类型                                | 默认值 |
| ------- | ----------------------- | ----------------------------------- | ------ |
| onClick | 点击事件                | function(type:string,record:object) | -      |
| itemArr | 功能按钮数组            | array                               | -      |
| record  | 当前行 render 中 record | object                              | -      |
| size    | 操作按钮间隔            | object                              | -      |

#### itemArr

- 功能项目数组,控制功能项。

| 参数      | 说明                   | 类型    | 默认值 |
| --------- | ---------------------- | ------- | ------ |
| name      | 当前功能项名称（必填） | string  | -      |
| powerCode | 功能权限 code。(必填)  | string  | -      |
| hidden    | 是否隐藏当前功能       | boolean | -      |

> **_注意_**：

       1.可以在将控制功能按钮显示与隐藏条件写在listArr -> disable中，通过true｜false控制功能按钮显示隐藏权限。

       2.type 图标使用suid中ExtIcon (http://10.4.69.36:1024/components/ext-icon-cn/) 只用传入type即可，例如<Icon type="plus" /> 传入plus。
