import React from 'react';
import { Avatar } from 'antd';
import { ListCard } from 'm-demo';

const data = [
  {
    name: '北京',
    code: '001',
  },
  {
    name: '成都',
    code: '002',
  },
  {
    name: '上海',
    code: '003',
  },
  {
    name: '绵阳',
    code: '004',
  },
];

class ListCardDemo extends React.Component {
  render() {
    const listCardProps = {
      title: '自定义Avatar',
      dataSource: data,
      rowKey: 'code',
      onSelectChange: (keys, items) => {
        console.log(keys, items);
      },
      itemField: {
        avatar: <Avatar icon="user" shape="square" />,
        title: item => item.name,
        description: item => item.code,
      },
    };
    return (
      <div style={{ height: 420 }}>
        <ListCard {...listCardProps} />
      </div>
    );
  }
}

export default ListCardDemo;
