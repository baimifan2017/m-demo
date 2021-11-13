import React from 'react';
import { ListCard } from 'm-demo';

const listCardProps = {
  title: '远程数据获取演示',
  onSelectChange: (keys, items) => {
    console.log(keys, items);
  },
  store: {
    url: `http://10.4.32.xx:7300/mock/5e0c81854987bb28481c8f55/mocker/service/user/findAll`,
  },
  searchProperties: ['name', 'address'],
  itemField: {
    title: item => item.name,
    description: item => item.address,
    extra: item => <span style={{ fontSize: 12, marginRight: 8 }}>{item.code}</span>,
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
