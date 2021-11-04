import React from 'react';
import { Input, Button } from 'antd';
import { ExtTable } from 'seid';

const props = {
  columns: [
    {
      title: 'Full Name',
      width: 202,
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: 'Full Name',
      width: 202,
      dataIndex: 'name3',
    },
    {
      title: 'Full Name',
      width: 202,
      dataIndex: 'name2',
    },
    {
      title: 'Full Name',
      dataIndex: 'name1',
    },
  ],
  data: {
    list: [
      {
        key: '1',
        name: 'John BrownJohn BrownJohn BrownJohn',
        name1: 'John',
        name2: 'Brown',
        name3: 'John',
      },
      {
        key: '2',
        name: 'Jim Green',
        name1: 'John',
        name2: 'Brown',
        name3: 'John',
      },
    ],
    pagination: {
      pageNum: 1,
      pageSize: 20,
      totalRows: 2,
    },
  },
  resizeColumns: true,
  columnTool: true,
  bordered: true,
  rowKey: 'name',
  onSelectRows: console.log,
  onChange: console.log,
  toolBar: {
    left: <Button onClick={() => console.log('新增')}>新增</Button>,
    right: <Input />,
  },
};

export default () => <ExtTable {...props} />;
