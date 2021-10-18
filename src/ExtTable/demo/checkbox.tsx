import React from 'react';
import { Button } from 'antd';
import { ExtTable } from 'm-demo';

const props = {
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      required: true,
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      width: 220,
      optional: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 60,
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 260,
      optional: true,
    },
  ],
  store: {
    url: 'http://10.4.32.53:7300/mock/5dd5efbdc239b926aeb04627/seid.api/userList',
  },
  title: '表格标题',
  checkbox: true,
  selectedRowKeys: [],
  toolBar: {
    left: (
      <Button type="primary" onClick={() => console.log('新增')}>
        新增
      </Button>
    ),
  },
};

export default () => <ExtTable {...props} />;
