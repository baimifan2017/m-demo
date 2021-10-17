---
order: 2
title:
  zh-CN: 没有Title
  en-US: No title
---

## zh-CN

当没有 Title 时，Modal 作为拖拽点。

## en-US

When there is not Title Props, Modal is the Drag Point.

```jsx
import { Button } from 'antd';
import { ExtModal } from 'seid';
import React from 'react';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  render() {
    const props = {
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
        <ExtModal {...props} />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
