---
category: Components
subtitle: 国际化
type: 基础
title: LocaleReceiver
---

接收全局语言配置信息。

## When To Use

- 当需要接收全局配置语言信息时，利用当前组件包裹自己的组件。

## API

### LocaleReceiver

| 参数          | 说明                                               | 类型                                      | 默认值 |
| ------------- | -------------------------------------------------- | ----------------------------------------- | ------ |
| componentName | 组件名称，根据组件名称去找当前语言环境下的翻译信息 | string                                    |        |
| defaultLocale | 默认语言配置                                       | object: { lang: { ... } } \| () => object |        |
| children      | 被包裹的组件                                       | React.ReactNode                           |        |
