---
title: ExtModal
group:
  title: 展示组件
  path: /display
nav:
  title: components
  path: /components
---

A New Component

## 何时使用

## Modal作为拖拽点
```jsx
import React from 'react';
import { Button, Modal } from 'antd';
import { ExtModal } from 'm-demo';

const { DragWrapper } = ExtModal;

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, title: '标题' };
  }

  render() {
    const props = {
      title: this.state.title,
      visible: this.state.visible,
      onCancel: () => {
        this.setState({
          visible: false,
        });
      },
    };
    return (
      <div>
        <Button
          onClick={() => {
            this.setState({
              visible: true,
            });
          }}
        >
          弹框
        </Button>
        <DragWrapper>
          <Modal {...props} />
        </DragWrapper>
      </div>
    );
  }
}

export default Demo
```


## API

api 完全继承 antd 的 Modal 组件，详情请参见 antd 的[Modal](https://ant.design/components/modal-cn/#API)
