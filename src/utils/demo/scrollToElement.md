## scrollToElement

## zh-CN

让滚动条滚动到指定 dom 节点，使该节点在可视区域显示 举例。

> 需为 dom 指定 id

## en-US

scrollToElement usage example.

```jsx
import { Button } from 'antd';
import { utils, ScrollBar } from 'm-demo';

const { scrollToElement } = utils;

const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    id: i,
    content: `seid design part ${i}`,
  });
}

class App extends React.Component {
  handlerScroll = () => {
    const scrollPorps = {
      scrollBoxClassName: '.demo-scroll-box',
      targetId: 'item_10',
    };
    scrollToElement(scrollPorps);
  };

  render() {
    return (
      <div>
        <Button onClick={this.handlerScroll}>滚动到序号为10的项目</Button>
        <div style={{ height: 300 }}>
          <ScrollBar className="demo-scroll-box">
            <div>
              {listData.map(item => (
                <div
                  key={item.id}
                  id={`item_${item.id}`}
                  style={{ padding: '8px 0', height: 42 }}
                >
                  {item.content}
                </div>
              ))}
            </div>
          </ScrollBar>
        </div>
      </div>
    );
  }
}

export default App
```
