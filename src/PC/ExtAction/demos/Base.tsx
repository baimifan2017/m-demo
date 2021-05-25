import React from 'react';
import { Table } from 'antd';
import ExtAction from '@/PC/ExtAction';

export default () => {
  const _onAction = (key: string, record: object) => {
    alert(key);
    console.log(record);
  };

  const dataSource = [
    { name: '张三', email: '51521212@qq.com', age: 21, address: '这是地址1' },
    { name: '张三', email: '51521212@qq.com', age: 22, address: '这是地址2' },
    { name: '张三', email: '51521212@qq.com', age: 23, address: '这是地址3' },
  ];

  return (
    <Table
      columns={[
        {
          title: '操作',
          width: 120,
          render: (text, record) => (
            <ExtAction
              record={record}
              action={(key, record) => _onAction(key, record)}
            />
          ),
        },
        { title: '姓名', dataIndex: 'name', width: 120 },
        { title: '电子邮箱', dataIndex: 'email', width: 220 },
        { title: '年龄', dataIndex: 'age', width: 60 },
        { title: '地址', dataIndex: 'address', width: 200 },
      ]}
      dataSource={dataSource}
    />
  );
};
