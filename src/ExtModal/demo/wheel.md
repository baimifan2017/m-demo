---
order: 1
title:
  zh-CN: Modal作为拖拽点
  en-US: Modal is the Drag Point
---

## zh-CN

Modal 作为拖拽点。

## en-US

Modal is the Drag Point.

```jsx
import { Button, Modal } from 'antd';
import { ExtModal } from 'seid';
import React from 'react';

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

ReactDOM.render(<Demo />, mountNode);
```
