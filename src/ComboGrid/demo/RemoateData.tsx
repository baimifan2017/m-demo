import React from 'react';
// @ts-ignore
import { ComboGrid } from 'm-demo';

const RemoteData = () => {
  const searchCols = ['name', 'remark'];

  return (
    <ComboGrid
      style={{ width: 280 }}
      store={{
        autoLoad: false,
        url: `http://rddgit.changhong.com:7300/mock/5dd5efbdc239b926aeb04627/seid.api/receiverType/list`,
      }}
      columns={[
        {
          title: '枚举代码',
          width: 80,
          dataIndex: 'name',
        },
        {
          title: '枚举名称',
          width: 120,
          dataIndex: 'remark',
        },
      ]}
      searchProperties={searchCols}
      rowKey="name"
      reader={{
        name: 'remark',
      }}
    />
  );
};

export default RemoteData;
