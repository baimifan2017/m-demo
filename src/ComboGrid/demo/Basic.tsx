import React from 'react';
// @ts-ignore
import { ComboGrid } from 'm-demo';

const searchCols = ['code', 'title'];

const data = [
  {
    title: '北京',
    code: '001',
  },
  {
    title: '成都',
    code: '002',
  },
  {
    title: '上海',
    code: '003',
  },
  {
    title: '绵阳',
    code: '004',
  },
  {
    title: '西安',
    code: '005',
  },
  {
    title: '杭州',
    code: '006',
  },
  {
    title: '江油',
    code: '007',
  },
  {
    title: '台湾',
    code: '008',
  },
];

const Basic = () => {
  return (
    <ComboGrid
      style={{ width: 280 }}
      dataSource={data}
      columns={[
        {
          title: '代码',
          width: 100,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 120,
          dataIndex: 'title',
        },
      ]}
      searchProperties={searchCols}
      rowKey="code"
      allowClear
      reader={{
        name: 'title',
      }}
    />
  );
};

export default Basic;
