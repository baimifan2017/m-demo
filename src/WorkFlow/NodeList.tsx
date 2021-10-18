/*
 * @Date: 2020-02-14 17:16:58
 * @Last Modified time: 2020-02-15 17:02:16
 */

import React, { PureComponent } from 'react';
import cls from 'classnames';
import { toLower, isEqual } from 'lodash';
import Collapse from 'antd/es/collapse';
import Tag from 'antd/es/tag';
import Switch from 'antd/es/switch';
import ScrollBar from '../ScrollBar';
import StoreProps from './storeProps';
import { LocaleItem } from '../locale';
import UserList from './UserList';

export interface NodeListProps {
  store: StoreProps;
  nodeInfoList: any[];
  locale: LocaleItem;
  executorUserMap: object;
  onChange?: (data: any) => void;
}

const { Panel } = Collapse;

class NodeList extends PureComponent<NodeListProps, any> {
  static defaultProps = {
    nodeInfoList: [],
  };

  constructor(props: NodeListProps) {
    super(props);
    const { executorUserMap = new Map() } = props;
    this.state = {
      executorUserMap,
      instancyStatusMap: new Map(),
    };
  }

  componentDidMount() {
    const { onChange } = this.props;
    if (onChange) {
      const { ...rest } = this.state;
      onChange(rest);
    }
  }

  componentDidUpdate(prevProps: NodeListProps) {
    const { executorUserMap = new Map(), onChange } = this.props;
    if (!isEqual(prevProps.executorUserMap, executorUserMap)) {
      this.setState({ executorUserMap }, () => {
        if (onChange) {
          const { ...rest } = this.state;
          onChange(rest);
        }
      });
    }
  }

  handlerChooseInstancyChange = (node: any, checked: boolean, e: MouseEvent) => {
    e && e.stopPropagation();
    const { onChange } = this.props;
    const { instancyStatusMap } = this.state;
    instancyStatusMap.set(node.id, checked);
    this.setState({ instancyStatusMap }, () => {
      if (onChange) {
        const { ...rest } = this.state;
        onChange(rest);
      }
    });
  };

  handlerUserSelectChange = (nodeId: string, keys: string[]) => {
    const { onChange } = this.props;
    const { executorUserMap } = this.state;
    if (keys.length === 0) {
      executorUserMap.delete(nodeId);
    } else {
      executorUserMap.set(nodeId, keys.join(','));
    }
    this.setState({ executorUserMap }, () => {
      if (onChange) {
        const { ...rest } = this.state;
        onChange(rest);
      }
    });
  };

  renderPanelHeader = (node: any) => {
    const { locale } = this.props;
    const { name, flowTaskType = '' } = node;
    const flowType = toLower(flowTaskType);
    let taskTypeTitle = '';
    let color = 'blue';
    switch (flowType) {
      case 'singlesign':
        taskTypeTitle = locale.nodeSinglesign;
        color = 'purple';
        break;
      case 'countersign':
        taskTypeTitle = locale.nodeCountersign;
        color = 'geekblue';
        break;
      case 'approve':
        taskTypeTitle = locale.nodeApprove;
        color = 'cyan';
        break;
      case 'paralleltask':
        taskTypeTitle = locale.nodeParalleltask;
        color = 'orange';
        break;
      case 'serialtask':
        taskTypeTitle = locale.nodeSerialtask;
        color = 'red';
        break;
      case 'receivetask':
        taskTypeTitle = locale.nodeReceivetask;
        color = 'magenta';
        break;
      case 'servicetask':
        taskTypeTitle = locale.nodeServicetask;
        color = '#87d068';
        break;
      case 'pooltask':
        taskTypeTitle = locale.nodePooltask;
        color = 'blue';
        break;
      case 'common':
      default:
        taskTypeTitle = locale.nodeCommon;
    }
    return (
      <span className="task-title-box">
        {name}
        <Tag color={color}>{taskTypeTitle}</Tag>
      </span>
    );
  };

  renderChooseInstancy = (node: any) => {
    const { locale } = this.props;
    if (node.allowChooseInstancy) {
      return (
        <>
          <span className="instancy-label">{locale.instancy}</span>
          <Switch
            size="small"
            onChange={(checked: boolean, e: any) =>
              this.handlerChooseInstancyChange(node, checked, e)
            }
          />
        </>
      );
    }
    return null;
  };

  render() {
    const { executorUserMap } = this.state;
    const { nodeInfoList, locale, store } = this.props;
    const activeKeys = nodeInfoList.map(n => n.id);
    const collapseProps = {
      defaultActiveKey: activeKeys,
      bordered: false,
    };
    return (
      <div className="list-body">
        <ScrollBar>
          <Collapse {...collapseProps}>
            {nodeInfoList.map((node: any) => {
              return (
                <Panel
                  forceRender
                  className={cls(toLower(node.uiUserType || ''))}
                  header={this.renderPanelHeader(node)}
                  key={node.id}
                  extra={this.renderChooseInstancy(node)}
                >
                  <UserList
                    key={`user_${node.id}`}
                    store={store}
                    nodeId={node.id}
                    flowTaskType={node.flowTaskType}
                    uiType={node.uiType}
                    uiUserType={node.uiUserType}
                    dataSource={node.executorSet}
                    locale={locale}
                    defaultExecutorUsers={executorUserMap.get(node.id)}
                    onUserSelectChange={this.handlerUserSelectChange}
                  />
                </Panel>
              );
            })}
          </Collapse>
        </ScrollBar>
      </div>
    );
  }
}

export default NodeList;
