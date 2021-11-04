---
title: ExTable
nav:
  title: components
  path: /components
group:
  path: /input
  title: 输入组件
order: 1
---

A New Component
 
## 何时使用

-- 当显示大量数据时。

## 基本使用
<code src='./demo/basic.tsx'></code>

## 从外部获取查询参数
<code src='./demo/cascade.tsx'></code>

  
## 带复选框的表格
<code src='./demo/checkbox.tsx'></code>

## 远程获取数据    
<code src='./demo/remote.tsx'></code>
  
## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| columns | 表格的列配置，[详情](#IColumnProps) | IColumnProps[] | - |  |
| cascadeParams | 联合参数配置 | object | - |  |  |
| toolBar | 工具条配置[详情](http://10.4.69.36:1024/components/tool-bar-cn/) | IToolBarProps | - |  |
| remotePaging | 是否远程分页,远程分页时可配置 store 属性，[详情](#StoreProps) | boolean | false |  |
| height | 表格高度 | number | 460 |  |
| width | 表格宽度,不设置则自适应容器 | number | - |  |
| title | 表格标题 | string | - |  |
| store | 表格远程数据接口配置 [详情](#StoreProps) | StoreProps | - |  |
| selectedRowKeys | 选中的行 keys | string[] | - |  |
| checkbox | 表格的选择框配置,[详情](#ICheckboxProps) | boolean \| ICheckboxProps | - |  |
| onSelectRow | 行选择回调函数 | (selectedRowKeys: string[], selectedRows: T[]) => void | - |  |
| onChange | 分页、排序、筛选变化时触发 | Function(pagination, filters, sorter, extra: { currentDataSource: [] }) | - |  |
| showSearch | 表格是否显示搜索框 | boolean | true |  |
| searchPlaceHolder | 搜索框显示的提示文案 | string | 请输入关键字查询 |  |
| searchProperties | 搜索的数据珍属性配置 | string[] |  |  |
| ellipsis | 全局设置超过宽度将自动省略 | boolean | true |  |
| pagination | 数据分页配置,[详情](https://ant.design/components/pagination-cn/) | boolean \| PaginationProps | - |  |
| reader | 远程数据接数据适配器[详情](#Reader) | Reader | - |  |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数 | (item: T) => string \| string | 'id' |  |
| summary | 分页组件附加文案配置，比如自定义汇总显示等等 | ReactNode | - |  |
| loading | 设置表格数据加载状态 | boolean | - |  |
| storageId | 可以实现列配置本地存储，此值为保证唯一性，必须为 UUID，推荐使用组件 utils 的 UUID 工具方法产生 | UUID v4 | - |  |
| onTableRef | 表格实例化事件，该事件可以获取表格实例，以便调用表格相关[公开的方法](#Method) | (ref)=>ExtTable | - |  |

> **_注意_**：

       1.本地列配置的存储只对列属性含有 dataIndex 的生效。

       2.本当表格具有store配置时，内部已经实现了分页功能；如果未配置store，通过表格的onChange、dataSource和pagination配置也可实现外部远程分页。

       3.列配置本地存储需要权衡使用，目前使用的是localeStorage的存储方式，由于localeStorage的存储是有容量大小限制的。

## IColumnProps

基类属性请参照 antd[详情](https://ant.design/components/table-cn/#Column)，其中 width 属性重写，类型必须是数值类型

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| required | 为 true 表示此列为必显示，用户不能取消显示，但可以设置显示顺序 | boolean | - | --- |
| width | 列的宽度 | number | 120 | --- |
| optional | 为 true 时表示此列为备选字段，初始时不会显示在表格中，用户可以自定义选择列勾选后可显示 | boolean | - | --- |

## StoreProps

| 参数   | 说明         | 类型            | 默认值 | 版本 |
| ------ | ------------ | --------------- | ------ | ---- |
| params | 接口请求参数 | object          | -      |      |
| type   | 接口请求类型 | 'GET' \| 'POST' | GET    |      |
| url    | 接口请求地址 | string          | -      |      |

## Reader

| 参数        | 说明       | 类型   | 默认值    | 版本 |
| ----------- | ---------- | ------ | --------- | ---- |
| dataReader  | 表格数据体 | string | -         |      |
| totalReader | 总记录数   | string | 'records' |      |

## ICheckboxProps

| 参数        | 说明                 | 类型    | 默认值 | 版本 |
| ----------- | -------------------- | ------- | ------ | ---- |
| rowCheck    | 行选择触发复选框选中 | boolean | true   |      |
| multiSelect | 可以多选             | boolean | true   |      |

## Method 公开的方法

| 方法名            | 说明                                               | 参数 | 默认值 | 版本 |
| ----------------- | -------------------------------------------------- | ---- | ------ | ---- |
| remoteDataRefresh | 远程数据刷新方法，调用此方法可以让表格重新加载数据 | -    | -      |      |
