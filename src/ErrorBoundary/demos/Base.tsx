import React, { Component } from 'react';
// @ts-ignore
import { ErrorBoundary } from 'm-demo';
import { Table } from 'antd';

class Base extends Component {
  render() {
    // @ts-ignore
    return (
      <div>
        下面的Error会发生错误，但这并不会影响我的显示。
        <ErrorBoundary errNode="这里发生了一个边界错误">
          <Table dataSource={[]} columns={['1', '2']} />
        </ErrorBoundary>
      </div>
    );
  }
}

export default Base;
