import React from 'react';
import { Table } from 'antd';
// @ts-ignore
import { Action } from 'm-demo';

export default () => {
  const itemArr = [
    { name: '详情', powerCode: 'detail' },
    { name: '编辑', powerCode: 'edit' },
    { name: '删除', powerCode: 'delete' },
  ];

  /**
   * 操作按钮点击事件
   * @param type  事件类型：与itemArr中powerCode一致
   * @param record  当前行信息
   */
  const handleClick = (type: any, record: any) => {
    switch (type) {
      case 'detail':
        alert(type);
        break;
      case 'edit':
        alert(type);
        break;
      case 'delete':
        alert(type);
        break;
      default:
        break;
    }
  };

  const dataSource = [
    { name: '张三', email: '51521212@qq.com', age: 21, address: '这是地址1', key: '1' },
    { name: '张三', email: '51521212@qq.com', age: 22, address: '这是地址2', key: '2' },
    { name: '张三', email: '51521212@qq.com', age: 23, address: '这是地址3', key: '3' },
  ];

  return (
    <Table
      rowKey={row => row.age}
      columns={[
        { title: '姓名', dataIndex: 'name', width: 120 },
        { title: '电子邮箱', dataIndex: 'email', width: 220 },
        { title: '年龄', dataIndex: 'age', width: 60 },
        { title: '地址', dataIndex: 'address', width: 200 },
        {
          title: '操作',
          width: 120,
          render: (_, record) => <Action onClick={handleClick} itemArr={itemArr} record={record} />,
        },
      ]}
      dataSource={dataSource}
    />
  );
};
