---
order: 0
title:
  zh-CN: UUID
  en-US: UUID
---

## zh-CN

生成唯一的 GUID 举例。

## en-US

UUID example.

```jsx
import { Button } from 'antd';
import { utils } from 'm-demo';

const { getUUID } = utils;

class Demo extends React.Component {
  state = {
    uuid: getUUID(),
  };

  createNewUUID = () => {
    this.setState({
      uuid: getUUID(),
    });
  };

  render() {
    const { uuid } = this.state;
    return (
      <div>
        <div>
          <Button type="primary" onClick={this.createNewUUID}>
            生成新UUID
          </Button>
        </div>
        <div
          style={{ marginTop: 8, fontWeight: 700, color: 'rgba(0,0,0,0.85)' }}
        >
          {uuid}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, mountNode);
```
