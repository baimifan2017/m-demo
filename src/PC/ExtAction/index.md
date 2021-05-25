---
title: 操作按钮
nav:
  title: Components
  path: /components
group:
  title: 功能组件
  order: 1
---

### 何时使用

- ExtTable 中的操作按钮
- 操作按钮提供横向与纵向两种方式，默认为纵向（超过 3 个功能按钮，更多部分为省略号）。

### 基本使用

- 不传 listArr 属性，ExtAction 默认为:编辑、查看、删除三个功能项
  <code src="./demos/Base.tsx" />

### 自定义功能相

多选，从已有条目中选择。设置`multiple`属性

### 禁用

### API

| 参数    | 说明           | 类型                               | 默认值 |
| ------- | -------------- | ---------------------------------- | ------ |
| listArr | 功能相         | array                              | -      |
| record  | 当前选中行项目 | object                             | -      |
| layOut  | 布局方式       | Inline \| Vertical                 | -      |
| action  | 点击功能项     | function(key:string,record:object) |        |

#### listArr

- 功能项目数组,控制功能项。

| 参数              | 说明                                                          | 类型                    | 默认值  |
| ----------------- | ------------------------------------------------------------- | ----------------------- | ------- |
| title             | 功能项名称（必填）                                            | string                  | -       |
| key               | 当前功能表示，在 action 方法中作为参数。(必填)                | string                  | -       |
| disabled          | 是否禁用                                                      | boolean                 | `false` |
| authorityCode     | 功能相权限代码                                                | string                  | -       |
| icon              | 操作图标，参考 ExtIcon 图标。                                 | ReactNode \ string      | -       |
| warnTip           | 如果有值将会启用 tips                                         | string                  | -       |
| businessModelCode | 流程实体                                                      | string                  | -       |
| onBeforeStart     | function(resolve),返回 resolve({success:true}) 表示继续流程。 | string                  | -       |
| onStartComplete   | 流程启动后事件                                                | function(record:object) | -       |

> **_注意_**：

       1.可以在将控制功能按钮显示与隐藏条件写在listArr -> disable中，通过true｜false控制功能按钮显示隐藏权限。

       2.type 图标使用suid中ExtIcon (http://10.4.69.36:1024/components/ext-icon-cn/) 只用传入type即可，例如<Icon type="plus" /> 传入plus。
