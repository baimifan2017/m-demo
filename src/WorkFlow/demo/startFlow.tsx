import React from 'react';
import { WorkFlow, ExtIcon } from 'm-demo';

const { StartFlow } = WorkFlow;

const props = {
  businessKey: '489DCAA6-13F0-11E9-9AE6-0242C0A8440B',
  businessModelCode: 'com.ecmp.flow.entity.DefaultBusinessModel',
  store: {
    gateway: 'api-gateway',
    serviceHost: 'http://xxxxx',
  },
};

class StartFlowDemo extends React.Component {
  render() {
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <p>默认启动工作流</p>
          <StartFlow {...props} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p>自定义启动工作流</p>
          <StartFlow {...props}>
            <div
              style={{
                display: 'inline-flex',
                height: 32,
                lineHeight: 32,
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <ExtIcon type="check-circle" antd style={{ marginRight: 8 }} />
              提交送审
            </div>
          </StartFlow>
        </div>
      </div>
    );
  }
}

export default StartFlowDemo;
