---
title: WorkFlow
group:
  title: 展示组件
  path: /display
nav:
  title: components
  path: /components
---

1.1.50+新增组件

## 何时使用

-- 业务单据需要进入流程和审批时。

## 启动流程
<code src='./demo/startFlow.tsx'></code>

## 审批
<code src='./demo/approve.tsx'></code>

## API
  
## WorkFlow.StartFlow

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 样式类名 | string | - |  |
| style | 样式 | React.CSSProperties | - |  |
| businessKey | 业务单据 id | string | - |  |
| businessModelCode | 实体模型代码 | string | - |  |
| beforeStart | 启动前执行回调函数，请返回 Promise 或类似 Promise 对象 | PromiseLike | - |  |
| startComplete | 启动执行完成回调函数，返回接口对象 | object | - |  |
| onCancel | 取消按钮回调回调函数 |  | - |  |
| store | 数据接口配置，[配置详情](#StoreProps) | StoreProps | - |  |
| startButtonProps | 启动按钮 Button 属性配置 [ButtonProps](https://ant.design/components/button-cn/) | ButtonProps | - |  |

### StoreProps

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| serviceHost | 服务接口基地址 | string | 当前 http 基地址 |  |
| gateway | 服务网关名 | string | ‘sei-gateway’ |  |
| params | 接口请求参数 | object | - |  |
| type | 接口请求类型 | 'GET' \| 'POST' | 'POST' |  |
| url | 默认流程启动服务接口 | string | 'flow-service/defaultFlowBase/startFlowNew' |  |
