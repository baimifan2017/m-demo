import React from 'react';
import { ScrollBar } from 'm-demo';


const listData: { content: string; }[] = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    content: `m-demo design part ${i}`,
  });
}

export default () => {


  return <ScrollBar style={{ width: 500, height: 130 }}>
    <div>
      {
        listData.map(item => {
          return <div>{item.content}</div>
        })
      }
    </div>
  </ScrollBar>
}

