import React from 'react';
import { ListCard } from 'm-demo';

class ListCardDemo extends React.Component {
  render() {
    const listCardProps = {
      title: '无分页栏',
      rowKey: 'code',
      onSelectChange: (keys, items) => {
        console.log(keys, items);
      },
      store: {
        url: `http://10.4.32.53:7300/mock/5e0c81854987bb28481c8f55/mocker/service/user/findAll`,
      },
      searchProperties: ['name', 'address'],
      pagination: false,
      itemField: {
        title: item => item.name,
        description: item => item.address,
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
