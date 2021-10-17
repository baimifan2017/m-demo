---
order: 0
title:
  zh-CN: 基本使用
  en-US: Basic usage
---

## zh-CN

基本使用。

## en-US

Basic usage example.

```jsx
import { Button } from 'antd';
import { ExtModal } from 'seid';
import React from 'react';

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
        <ExtModal {...props} />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
