import React from 'react';
import { ScrollBar } from 'm-demo';
const listData: { content: string; }[] = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    content: `m-demo design part ${i}`,
  });
}

export default () => {


  return <div
    style={{ display: 'flex', maxHeight: '200px' }}
  >
    <ScrollBar
      onScrollY={v => console.log('y:', v)}
    >
      <div>
        {listData.map((item, key) => (
          <div style={{ padding: '8px 0' }} key={key}>{item.content}</div>
        ))}
      </div>
    </ScrollBar>
  </div>;
}

