import { Radio } from 'antd';
import { ListCard } from 'm-demo';
import React from 'react';

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
  renderAvatar = (keyValue, checkedList) => {
    return <Radio checked={!!checkedList[keyValue]} />;
  };

  render() {
    const listCardProps = {
      title: '自定义Avatar',
      dataSource: data,
      rowKey: 'code',
      onSelectChange: (keys, items) => {
        console.log(keys, items);
      },
      itemField: {
        avatar: this.renderAvatar,
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

export default ListCardDemo
