---
title: Attachment
group:
  title: 输入组件
  path: /input
nav:
  title: components
  path: /components
---


附件管理组件，丰富`Upload`文件上传组件；

## 何时使用

- 文件上传控制时使用。

## 最简单使用
```jsx
import React from 'react';
import { Attachment } from 'm-demo';
import get from 'lodash/get';

const attachmentProps = {
  serviceHost: 'http://10.4.208.87',
  multiple: true,
};

export default () => <Attachment {...attachmentProps} />;
```

## 文件列表初始化
文件项操作扩展。

<code src="./demo/initFileList.tsx"></code>

## 限制文件类型
<code src="./demo/limitFileExt.tsx"></code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 组件样式类名 | string | - |  |
| style | 组件样式 | CSSProperties | - |  |
| allowUpload | 允许上传 | boolean | true |  |
| allowDelete | 允许删除 | boolean | true |  |
| allowDownload | 允许下载 | boolean | true |  |
| allowPreview | 允许预览 | boolean | true |  |
| viewType | 附件显示方式 | ViewType: 'list' \| 'icon' | ’list‘ |  |
| uploadButton | 上传按钮属性配置，参见 antd 的 Button 组件属性 | ButtonProps | - |  |
| maxUploadNum | 同时上传附件的数量 | number | - |  |
| serviceHost | 附件服务接口基地址 | string | - |  |
| uploadUrl | 附件上传地址，使用 edm 模块时可以只配置 serviceHost | string | - |  |
| download | 附件下载地址，使用 edm 模块时可以只配置 serviceHost,支持方法动态构造附件下载 request 请求配置 | Function(files: IUploadFile[]) => AxiosRequestConfig \| string | - |  |
| thumbUrl | 图片附件缩略图地址，使用 edm 模块时可以只配置 serviceHost | Function(file: IUploadFile) => string \| string | - |  |
| previewUrl | 附件预览地址，使用 edm 模块时可以只配置 serviceHost | Function(file: IUploadFile) => string \| string | - |  |
| fileList | 组件附件显示数据源，参见[IUploadFile](#IUploadFile) | IUploadFile[] | - |  |
| onDeleteFile | 附件删除时触发事件,返回删除的附件数据 | Function(files: IUploadFile[]) => void | - |  |
| onSelectFile | 附件选择时触发事件 | Function(files: IUploadFile[]) => void | - |  |
| onChange | 上传文件改变时的状态 | Function(files: IUploadFile[]) => void | - |  |
| toolExtras | 组件工具栏最右侧更多自定义操作扩展，属性配置参见[RightMenuItem](#RightMenuItem) | RightMenuItem[] | - |  |
| toolExtrasAction | 组件工具栏最右侧更多自定义操作事件触发回调函数 | Function(key: string) => void | - |  |
| onAttachmentRef | 获取组件实例的回调函数 | Function(ref: any) => void | - |  |
| limitFileExt | 上传附件扩展名的限制，可限定只能允许传指定类型的附件 | string[] | - |  |

## IUploadFile

- 此属性配置继承 antd 的 Upload 的属性[UploadFile](https://ant.design/components/upload-cn/)配置,此处只展示扩展的属性。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| id | 附件的 id | string | - |  |
| ocrData | 识别附件的 ocr 的数据 | string | - |  |
| fileSize | 附件大小 | string | - |  |
| description | 附件描述 | string | - |  |
| documentTypeEnum | 附件类型 | string | - |  |
| documentTypeEnumRemark | 附件类型描述 | string | - |  |
| uploadedTime | 附件上传时间 | string | - |  |
| deletedDisabled | 附件删除不可用（优先级最高） | boolean | - |  |
| downloadDisabled | 附件下载不可用（优先级最高） | boolean | - |  |
| previewDisabled | 附件预览不可用（优先级最高） | boolean | - |  |
| selected | 附件已选择 | boolean | - |  |
| extra | 附件操作扩展 | Function(file: IUploadFile) => ReactNode | - |  |
| secondFields | 附件的次要信息字段显示配置[SecondField](#SecondField) | SecondField[] | - |  |

## RightMenuItem

| 参数     | 说明                        | 类型    | 默认值 | 版本 |
| -------- | --------------------------- | ------- | ------ | ---- |
| title    | 显示的菜单操作标题          | string  | -      |      |
| key      | 菜单 key,需自定义，但要唯一 | string  | -      |      |
| icon     | 图标 type 名称              | string  | -      |      |
| disabled | 菜单是否可用                | boolean | -      |      |

## SecondField

| 参数     | 说明                     | 类型           | 默认值 | 版本 |
| -------- | ------------------------ | -------------- | ------ | ---- |
| title    | 显示的字段标题           | string         | -      |      |
| dataKey  | 显示的字段属性名，唯一键 | string         | -      |      |
| dataType | 字段数据类型             | ‘text’\|'date' | 'text' |      |
