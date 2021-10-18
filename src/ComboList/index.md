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

## 何时使用

- 有大量的数据需要加载（包括本地分页和远程分页）。
- 显示的属性字段相对较少。

## 基础使用

<code src="./demo/basic.tsx"></code>

## 自定义下拉

<code src="./demo/customListItem.tsx"></code>

## 无分页条

<code src="./demo/nopagebar.tsx"></code>

## 远程加载

<code src="./demo/remoteData.tsx"></code>

## API

### ComboList

| 参数              | 说明                                                                                                          | 类型                             | 默认值            | 版本 |     |
| ----------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------------- | ---- | --- |
| allowClear        | 可以点击清除图标删除内容                                                                                      | boolean                          | false             |      |     |
| afterSelect       | 选择数据行后触发该事件                                                                                        | Function(item: T, index: number) | -                 |      |     |
| afterClear        | 清空数据触发该事件                                                                                            | Function                         | -                 |      |     |
| afterLoaded       | 数据请求完成调用该事件，返回接口请求的数据                                                                    | Function(data: object\[])        | -                 |      |     |
| cascadeParams     | 级联参数配置                                                                                                  | object                           | -                 |      |     |
| className         | 选择框样式名                                                                                                  | string                           | -                 |      |     |
| defaultValue      | 输入框默认内容                                                                                                | string                           | -                 |      |     |
| disabled          | 组件失效状态                                                                                                  | boolean                          | false             |      |     |
| dataSource        | 静态数据源                                                                                                    | object\[]                        | \[]               |      |     |
| field             | 额外提交的表单字段属性名，表单受控                                                                            | string\[]                        | \[]               |      |     |
| form              | antd 表单的 form 属性,参考 antd 的[Form](<https://ant.design/components/form-cn/#Form.create(options)>)组件   | WrappedFormUtils                 | -                 |      |     |
| pagination        | 分页配置，参考[pagination](https://ant.design/components/pagination-cn/)  文档，设为 false 时不展示和进行分页 | boolean \| PaginationProps       | {pageSize:15}     |      |
| listProps         | 列表属性配置,参考[配置项](#ListProps)                                                                         | object                           | -                 |      |     |
| name              | 填充输入框显示的表单字段属性名，表单受控                                                                      | string                           |                   |      |     |
| placeholder       | 选择框默认文字                                                                                                | string                           | -                 |      |     |
| reader            | 接口数据解析适配，参考[配置项](#Reader)                                                                       | object                           | -                 |      |     |
| remotePaging      | 远程分页                                                                                                      | boolean                          | false             |      |     |
| rowKey            | 设置列表项唯一的 key，可以是返回字符串的字符串或函数                                                          | Function((item: T) => string)    | string            | 'id' |     |
| style             | css 属性配置                                                                                                  | React.CSSProperties              | -                 |      |     |
| showSearch        | 显示快速搜索                                                                                                  | boolean                          | true              |      |     |
| searchPlaceHolder | 搜索框默认文字                                                                                                | string                           | -                 |      |     |
| searchProperties  | 搜索接口数据属性配置                                                                                          | string\[]                        | \['code', 'name'] |      |     |
| store             | 数据接口对象,参考[配置项](#StoreProps)                                                                        | object                           | -                 |      |     |
| value             | 输入框内容                                                                                                    | string                           | -                 |      |     |
| width             | 数据面板宽度,默认与选择框同宽                                                                                 | number                           | -                 |      |     |

### StoreProps

| 参数     | 说明                 | 类型            | 默认值 | 版本 |
| -------- | -------------------- | --------------- | ------ | ---- |
| params   | 接口请求参数         | object          | -      |      |
| type     | 接口请求类型         | 'GET' \| 'POST' | GET    |      |
| url      | 接口请求地址         | string          | -      |      |
| autoLoad | 初始化时自动获取数据 | boolean         | false  |      |

### ListProps

| 参数       | 说明                                                   | 类型                                                | 默认值       | 版本 |
| ---------- | ------------------------------------------------------ | --------------------------------------------------- | ------------ | ---- |
| itemLayout | 设置列表布局, 设置成 vertical 则竖直样式显示, 默认横排 | 'vertical' \| 'horizontal'                          | 'horizontal' |      |
| renderItem | 自定义渲染列表项                                       | Function(item: T, index: number) => React.ReactNode | -            |      |

### Reader

| 参数        | 说明                                         | 类型      | 默认值 | 版本 |
| ----------- | -------------------------------------------- | --------- | ------ | ---- |
| data        | 截取的数据节点                               | string    | -      |      |
| description | 次要信息属性名                               | string    | -      |      |
| field       | ComboList 属性 field 映射,属性名必须一一对应 | string\[] | -      |      |
| name        | 显示的属性名,ComboList 属性 name 映射        | string    | -      |      |
