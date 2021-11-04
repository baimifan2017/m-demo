import React from 'react';
import { StationNewsList } from 'seid';

const props = {
  getNewsListUrl: 'http://10.4.69.36:1100/mq-api/mq/seo/getInbox',
  getNewsListParams: {
    userId: '33b15633b6b349b19c3a42dbac54911b',
    groupId: 'de2b4557f57940c5b78bd4615a3e1f3e',
  },
  setNewsStatusUrl: 'http://10.4.69.36:1100/mq-api/mq/seo/setStatus',
  getNewsDetailUrl: 'http://10.4.69.36:1100/mq-api/mq/seo/findById',
  modalProps: { width: 800 },
};
const StationNewsListDemo = () => <StationNewsList {...props} />;

export default StationNewsListDemo;
