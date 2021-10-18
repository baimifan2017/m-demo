import React from 'react';
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

const listCardProps = {
  dataSource: data,
  showSearch: false,
  rowKey: 'code',
  onSelectChange: (keys, items) => {
    console.log(keys, items);
  },
  itemField: {
    title: item => item.name,
    description: item => item.code,
  },
};

class ListCardDemo extends React.Component {
  render() {
    return (
      <div style={{ height: 420 }}>
        <ListCard {...listCardProps} />
      </div>
    );
  }
}

export default ListCardDemo
