
import React from 'react';
import { ComboList } from 'm-demo';

const data = [
  {
    title: '北京',
    code: '001',
    desc: '100001',
  },
  {
    title: '成都',
    code: '002',
    desc: '100002',
  },
  {
    title: '上海',
    code: '003',
    desc: '100003',
  },
  {
    title: '绵阳',
    code: '004',
    desc: '100004',
  },
];

export default () => (
  <ComboList
    style={{ width: 260 }}
    dataSource={data}
    afterSelect={console.log}
    listProps={{
      renderItem: (item:any) => {
        return (
          <div
            style={{
              display: 'flex',
              cursor: 'pointer',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <div style={{ flexDirection: 'column', width: '100%' }}>
              <div style={{ alignItems: 'flex-start', flexGrow: 1 }}>
                {item.title}
              </div>
              <div style={{ marginTop: 4, color: '#999' }}>{item.code}</div>
            </div>
            <div style={{ minWidth: 60 }}>{item.desc}</div>
          </div>
        );
      },
    }}
    reader={{
      name: 'title',
    }}
  />
);
