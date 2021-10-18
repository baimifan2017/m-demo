import React from 'react';
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
    },
  ],
  store: {
    url: 'http://10.4.32.53:7300/mock/5dd5efbdc239b926aeb04627/seid.api/user/userList',
  },
  title: '表格标题',
};

export default () => <ExtTable {...props} />
