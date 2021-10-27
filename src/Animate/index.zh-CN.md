---
title: Animate
group:
  title: 展示组件
  path: /display
nav:
  title: components 
  path: /components
---

## 何时使用

- 需要对页面某个 Dom 元素进行动效场景切换时

## 使用方法
<code src="./demo/basic.jsx"></code>

## API

| 参数     | 说明                  | 类型     | 默认值 | 版本 |
| -------- | --------------------- | -------- | ------ | ---- |
| callback | 动画结束的回调函数)   | Function | -      |      |
| delay    | 动画持续时间(ms 毫秒) | number   | -      |      |
| duration | 动画持续时间(ms 毫秒) | number   | -      |      |
| type     | 动画类型              | string   |        |      |

## 使用方式

- 动画组件 Animate 已内置[Animate.css](https://daneden.github.io/animate.css/)所有动画，也可以用自已定义的动画

```html
<Animate type="动画名称" duration="持续时间" delay="延时执行" callback="结束后回调">
  Animate Me!
</Animate>
```
