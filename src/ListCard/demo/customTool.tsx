import { Button, Input } from 'antd';
import { ListCard } from 'm-demo';
import React from 'react';

const Search = Input.Search;

class ListCardDemo extends React.Component {
  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.listCardRef.handlerSearch();
  };

  renderCustomTool = ({ total }) => {
    return (
      <>
        <Button type="link" icon="plus">
          新建
        </Button>
        <div>
          <Search
            placeholder="可输入名称关键字查询"
            onChange={e => this.handlerSearchChange(e.target.value)}
            onSearch={this.handlerSearch}
            onPressEnter={this.handlerSearch}
            style={{ width: 172 }}
          />
          <span style={{ marginLeft: 8 }}>{`共 ${total} 项`}</span>
        </div>
      </>
    );
  };
  render() {
    const listCardProps = {
      title: '自定工具栏',
      showSearch: false,
      onSelectChange: (keys, items) => {
        console.log(keys, items);
      },
      searchProperties: ['name', 'address'],
      store: {
        url: `http://10.4.32.53:7300/mock/5e0c81854987bb28481c8f55/mocker/service/user/findAll`,
      },
      itemField: {
        title: item => item.name,
        description: item => item.address,
        extra: item => <span style={{ fontSize: 12, marginRight: 8 }}>{item.code}</span>,
      },
      onListCardRef: ref => (this.listCardRef = ref),
      customTool: this.renderCustomTool,
    };
    return (
      <div style={{ height: 420 }}>
        <ListCard {...listCardProps} />
      </div>
    );
  }
}


export default ListCardDemo
