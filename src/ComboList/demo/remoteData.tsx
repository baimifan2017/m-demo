import React from 'react';
import { ComboList } from 'm-demo';

export default () => (
  <ComboList
    style={{ width: 280 }}
    store={{
      autoLoad: false,
      url: `http://rddgit.xxxxx.com:7300/mock/dc239b926aeb04627/seid.api/receiverType/list`,
    }}
    rowKey="name"
    reader={{
      name: 'remark',
      description: 'name',
    }}
  />
);
