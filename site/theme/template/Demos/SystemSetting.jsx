import React from 'react';
import { SystemSetting } from 'seid';
import { Card, Tabs } from 'antd';
import 'antd/lib/card/style';
import 'antd/lib/tabs/style';

class SystemSettingDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenuKey: 'table',
      paneKey: 'table',
    };
  }

  onChange = paneKey => {
    this.setState({ paneKey });
  };

  updateTabPane = pane => {
    const { tabs = [] } = this.state;
    if (tabs.find(t => t.key === pane.key)) {
      tabs.forEach((t, index) => {
        if (t.key === pane.key) {
          tabs.splice(index, 1, { ...pane });
          this.setState({ paneKey: pane.key, tabs: [...tabs] });
        }
      });
    } else {
      tabs.push({ ...pane });
      this.setState({ tabs: [...tabs], paneKey: pane.key });
    }
  };

  onEdit = (targetKey, action) => {
    if (action === 'remove') {
      this.remove(targetKey);
    }
  };

  remove = targetKey => {
    let { paneKey } = this.state;
    const { tabs = [] } = this.state;
    let lastIndex;
    tabs.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = tabs.filter(pane => pane.key !== targetKey);
    if (panes.length && paneKey === targetKey) {
      if (lastIndex >= 0) {
        paneKey = panes[lastIndex].key;
      } else {
        paneKey = 'table';
      }
    } else if (panes.length === 0) {
      paneKey = 'table';
    }

    this.setState({ tabs: [...panes], paneKey });
  };

  render() {
    const { selectedMenuKey, paneKey, tabs = [] } = this.state;
    return (
      <Card style={{ padding: '12px', height: '100%' }}>
        <Tabs
          hideAdd
          type="editable-card"
          activeKey={paneKey}
          onChange={this.onChange}
          onEdit={this.onEdit}
        >
          <Tabs.TabPane closable={false} key="table" tab="系统设置">
            <SystemSetting
              removeTabPane={this.remove}
              selectedMenuKey={selectedMenuKey}
              paneKey={paneKey}
              updateTabPane={this.updateTabPane}
            />
          </Tabs.TabPane>
          {tabs.map(tab => (
            <Tabs.TabPane closable key={tab.key} tab={tab.title}>
              {tab.content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Card>
    );
  }
}

export default SystemSettingDemo;
