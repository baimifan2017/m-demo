import React from 'react';
import { WorkFlow } from 'm-demo';

const { Approve } = WorkFlow;

const props = {
  businessId: '50ACAFE9-206D-11EA-84CB-0242C0A8440A',
  taskId: '50DC245C-206D-11EA-84CB-0242C0A8440A',
  store: {
    gateway: 'api-gateway',
    serviceHost: 'http://xxx.changhong.com',
  },
};

class ApproveDemo extends React.Component {
  render() {
    return (
      <div style={{ height: 720, backgroundColor: '#f8f8f8', padding: 8 }}>
        <Approve {...props}>
          <div>单据内容</div>
        </Approve>
      </div>
    );
  }
}

export default ApproveDemo;
