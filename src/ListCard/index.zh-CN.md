---
title: ListCard
group:
  title: 展示组件
  path: /display
nav:
  title: components
  path: /components
---

1.1.50+版本新增组件

## 何时使用

- 数据字段显示相对较少，但需要分页显示数据。
- 可以用于数据分配和显示，简单主数据列表导航。

## 基本使用
<code src='./demo/basic.tsx'></code>


## 列表自定义 Avatar
<code src='./demo/avatar.tsx'></code>
## 列表自定义 Avatar，使用函数的方式
<code src='./demo/avatarFun.tsx'></code>


## 带复选框的列表
<code src='./demo/checked.tsx'></code>


## 自定义工具栏
可以自定义工具栏，向工具栏添加按钮，甚至重写自己搜索。

<code src='./demo/checked.tsx'></code>

## 没有标题栏
<code src='./demo/noheader.tsx'></code>

## 无分页栏
<code src='./demo/nopageBar.tsx'></code>

## 远程数据
1.通过接配置的方式获取数据，可实现自动本地分页和远程分页功能，包括快速搜索。2.可自定义显示自定义扩展工具或显示字段。

<code src='./demo/nopageBar.tsx'></code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 列表卡片标题 | ReactNode\|string | - |  |
| bordered | 是否有边框 | boolean | false |  |
| dataSource | 静态数据源 | any[] | - |  |
| checkbox | 显示复选框 | boolean |  |  |
| rowKey | 设置列表项唯一的 key，可以是返回字符串的字符串或函数 | item => string \| string | 'id' |  |
| selectedKeys | 默认选择的行键值 | string[] | [] |  |
| pagination | 分页配置，参考[pagination](https://ant.design/components/pagination-cn/)  文档，设为 false 时不展示和进行分页 | boolean \| PaginationProps | {pageSize:30} |  |
| onSelectChange | 行选择触发事件 | (keys:string[], items:any[]) => void |  |  |
| allowCancelSelect | 是否可以取消选择行 | boolean | false |  |
| style | 样式 | React.CSSProperties |  |  |
| className | 样式类名 | string |  |  |
| store | 数据接口对象,参考[配置项](#StoreProps) | StoreProps |  |  |
| showSearch | 显示搜索框 | boolean | true |  |
| cascadeParams | 级联参数配置 | object |  |  |
| listProps | 列表属性配置,参考[配置项](#ListProps) | ListProps |  |  |
| remotePaging | 远程分页 | boolean | false |  |
| searchPlaceHolder | 搜索框默认文字 | string |  |  |
| searchProperties | 搜索接口数据属性配置 | string[] | \['code', 'name'] |  |
| itemField | 列表显示字段配置，[参考配置](#ItemFieldProps) | ItemFieldProps |  |  |
| showArrow | 显示行指示箭头 | boolean | true |  |
| extra | 卡片右上角的操作区域 | string\| React.ReactNode |  |  |
| loading | 加载中状态 | boolean |  |  |
| onListCardRef | 实例化事件，该事件可以获取组件实例，以便调用相关[公开的方法](http://10.4.69.36:1024/components/ext-table-cn/#Method) | (ref: any) => void |  |  |
| customTool | 自定义工具栏 | (data) => React.ReactNode |  |  |
| itemTool | 列表项自定义工具栏或其它内容 | (item, index) => React.ReactNode |  |  |

### StoreProps

| 参数   | 说明         | 类型            | 默认值 | 版本 |
| ------ | ------------ | --------------- | ------ | ---- |
| params | 接口请求参数 | object          | -      |      |
| type   | 接口请求类型 | 'GET' \| 'POST' | GET    |      |
| url    | 接口请求地址 | string          | -      |      |

### ListProps

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| itemLayout | 设置列表布局, 设置成 vertical 则竖直样式显示, 默认横排 | 'vertical' \| 'horizontal' | 'horizontal' |  |
| renderItem | 自定义渲染列表项 | Function(item, index) => React.ReactNode | - |  |

### ItemFieldProps

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| avatar | 列表元素的图标或自定义显示内容 | (keyValue: any, checkedList: any, index: number) => React.ReactNode | React.ReactNode | - |  |
| title | 列表标题显示字段名 | (item, index) => React.ReactNode | (item) => item.name \|\| '' |  |
| description | 列表副标题显示字段名 | (item, index) => React.ReactNode | (item) => item.code \|\| '' |  |
| extra | 列表额外显示内容 | (item, index) => React.ReactNode | - |  |
