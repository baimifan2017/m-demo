---
title: BarCode
nav:
  title: components
  path: /components
group:
  path: /display
  title: 展示组件
---

根据参数生成对应的条形码

## 使用场景

- 根据业务需要，决定是否使用

<embed src="./demo/basic.md"></embed>

## API

### BarCode

| 参数             | 说明                     | 类型    | 默认值  |
| ---------------- | ------------------------ | ------- | ------- |
| encodeText       | 生成条形码的字符串       | string  | NO.01   |
| text             | 覆盖显示的文本           | string  | \\      |
| format           | 条形码类型               | string  | CODE128 |
| textPosition     | 设置文本的垂直位置       | string  | bottom  |
| textAlign        | 设置文本的水平对齐方式   | string  | center  |
| fontSize         | 设置文本字体的大小       | number  | 14      |
| background       | 条形码背景               | string  | #FFFFFF |
| displayValue     | 是否在条形码下面显示文本 | boolean | true    |
| height           | 条形码高度               | number  | 40      |
| wrapperClassName | 容器元素的样式类         | string  | \\      |
| style            | 容器元素的内联样式       | object  | \\      |

BarCode 的更多属性，请参考[JsBarcode](https://github.com/lindell/JsBarcode#options)
