import React from 'react';
import { Button } from 'antd';
import { ExtTable } from 'm-demo';

const props = {
  columns: [
    {
      title: '操作',
      key: 'operation',
      width: 120,
      render: (text, record) => {
        console.log(record);
      },
    },
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
      optional: true,
      width: 60,
    },
    {
      title: 'a',
      dataIndex: 'a',
      optional: true,
      width: 60,
    },
    {
      title: 'b',
      dataIndex: 'b',
      optional: true,
      width: 60,
    },
    {
      title: 'c',
      dataIndex: 'c',
      optional: true,
      width: 60,
    },
    {
      title: 'd',
      dataIndex: 'd',
      optional: true,
      width: 60,
    },
    {
      title: 'e',
      dataIndex: 'e',
      optional: true,
      width: 60,
    },
    {
      title: 'f',
      dataIndex: 'f',
      optional: true,
      width: 60,
    },
    {
      title: 'g',
      dataIndex: 'g',
      optional: true,
      width: 60,
    },
    {
      title: 'h',
      dataIndex: 'h',
      optional: true,
      width: 60,
    },
  ],
  dataSource: [
    {
      id: '1',
      name: '张三',
      email: 'cheng.yi@changhong.com',
      age: 20,
    },
    {
      id: '2',
      name: '李四',
      email: 'shi.li@changhong.com',
      age: 40,
    },
    {
      id: '3',
      name: '王五',
      email: 'wu.wang@changhong.com',
      age: 49,
    },
    {
      id: '4',
      name: '吴三',
      email: 'san.wu@changhong.com',
      age: 28,
    },
  ],
  showSearch: true,
  checkbox: true,
  selectedRowKeys: ['4'],
  toolBar: { extra: <Button icon="funnel-plot">高级</Button> },
  storageId: '949ff2b4-f0ab-4d55-9d12-4e496639b095',
};

class Demo extends React.Component {
  render() {
    return (
      <div style={{ height: 500 }}>
        <ExtTable {...props} />
      </div>
    );
  }
}

export default Demo;
