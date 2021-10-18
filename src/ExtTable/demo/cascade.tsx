import React from 'react';
import { ComboList, ExtTable } from 'm-demo';

class App extends React.Component {
  state = {
    cascadeParams: null,
    name: '',
  };

  handlerNameChange = item => {
    this.setState({
      cascadeParams: { name: item.name },
    });
  };

  render() {
    const { cascadeParams } = this.state;
    const props = {
      cascadeParams,
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
      toolBar: {
        left: (
          <div>
            <span>收款类型：</span>
            <ComboList
              style={{ width: 280 }}
              store={{
                autoLoad: false,
                url: `http://10.4.32.53:7300/mock/5dd5efbdc239b926aeb04627/seid.api/receiverType/list`,
              }}
              rowKey='name'
              afterSelect={this.handlerNameChange}
              reader={{
                name: 'remark',
                description: 'name',
              }}
            />
          </div>
        ),
      },
    };
    return <ExtTable {...props} />;
  }
}

export default App;
