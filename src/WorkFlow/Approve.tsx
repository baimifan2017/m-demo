/*
 * @Date: 2020-02-17 17:25:30
 * @Last Modified time: 2020-02-17 17:25:59
 */
import React, { Component, CSSProperties } from 'react';
import cls from 'classnames';
import Layout from 'antd/es/layout';
import Tabs from 'antd/es/tabs';
import Empty from 'antd/es/empty';
import ListLoader from '../ListLoader';
import ScrollBar from '../ScrollBar';
import SeidLocaleReceiver from '../seid-locale-provider/SeidLocaleReceiver';
import { LocaleItem } from '../locale';
import defaultLocale from './locale';
import {
  getApprovalHeaderVO,
  getProcessTrackVOById,
  getProcessTrackVOByTaskId,
  findNextNodes,
} from './service';
import StoreProps from './storeProps';
import ApprovePanel from './ApprovePanel';

const { Content, Footer, Sider } = Layout;
const { TabPane } = Tabs;
const defaultGateway = 'sei-gateway';

export interface ApproveProps {
  className?: string;
  style?: CSSProperties;
  store: Omit<StoreProps, 'url' | 'type' | 'params'>;
  /** 单据id */
  businessId: string;
  /** 流程任务id */
  taskId?: string;
  /** 流程实例id */
  instanceId?: string;
  onApproveRef?: (ref: any) => void;
}

type IApproveState = {
  activeKey: string;
  store: Omit<StoreProps, 'url' | 'type' | 'params'>;
  defaultOpinion?: string;
  header?: any;
  nextNodes?: any[];
  defaultSelectNode?: any;
  loading?: boolean;
  manualSelected?: boolean;
  flowHistoryList?: any[];
};

class Approve extends Component<ApproveProps, IApproveState> {
  protected locale: LocaleItem;

  protected remark: string = '';

  constructor(props: ApproveProps) {
    super(props);
    this.state = {
      activeKey: '1',
      loading: false,
      store: {
        serviceHost: '',
        gateway: defaultGateway,
        ...(props.store || {}),
      },
    };
  }

  componentDidMount() {
    const { store } = this.state;
    const { serviceHost, gateway } = store;
    const { taskId, instanceId, onApproveRef } = this.props;
    if (taskId) {
      this.setState({ loading: true });
      const promiseArr = [
        getApprovalHeaderVO(taskId, serviceHost, gateway),
        findNextNodes(taskId, serviceHost, gateway),
      ];
      if (instanceId) {
        promiseArr.push(getProcessTrackVOById(instanceId, serviceHost, gateway));
      } else {
        promiseArr.push(getProcessTrackVOByTaskId(taskId, serviceHost, gateway));
      }
      Promise.all(promiseArr)
        .then((res: any) => {
          const [headerResult, nextNodesResult, processTrackTaskResult] = res || [];
          if (headerResult.success && nextNodesResult.success && processTrackTaskResult.success) {
            const nextNodes = nextNodesResult.data;
            const header = headerResult.data;
            const processTrackTask = processTrackTaskResult.data;
            if (nextNodes && nextNodes instanceof Array) {
              let flowHistoryList = null;
              const manualSelected =
                nextNodes.filter(item => item.uiType === 'radiobox').length > 0;
              const { currentNodeDefaultOpinion = '' } = header;
              if (processTrackTask && processTrackTask.length > 0) {
                flowHistoryList = processTrackTask[0].flowHistoryList;
              }
              const defaultSelectNode = nextNodes.length > 0 ? nextNodes[0] : null;
              this.setState({
                header,
                nextNodes,
                defaultSelectNode,
                flowHistoryList,
                manualSelected,
                defaultOpinion: currentNodeDefaultOpinion,
              });
            }
          }
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
    if (onApproveRef) {
      onApproveRef(this);
    }
  }

  activeTab = (key: string) => {
    this.setState({
      activeKey: key,
    });
  };

  renderApprove = (localeItem: LocaleItem) => {
    this.locale = localeItem;
    const { className = '', style = {}, children } = this.props;
    const {
      activeKey,
      store,
      loading,
      header,
      nextNodes,
      defaultSelectNode,
      defaultOpinion,
      manualSelected,
    } = this.state;
    const approvePanelProps = {
      locale: localeItem,
      store,
      header,
      nextNodes,
      defaultSelectNode,
      defaultOpinion,
      manualSelected,
    };
    return (
      <Layout className={cls('seid-flow-approve', className)} style={style}>
        <Content className="seid-flow-order-box-wrap">
          <Layout className="seid-flow-order-box">
            <Content className="seid-flow-order-body">
              <Tabs
                className="tab-order-content-box"
                activeKey={activeKey}
                onChange={this.activeTab}
              >
                <TabPane tab="业务单据" key="1" className="order-content">
                  <ScrollBar>
                    {children ? (
                      React.Children.only(children)
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="单据内容是空的" />
                    )}
                  </ScrollBar>
                </TabPane>
                <TabPane tab="流程日志" key="2" className="order-flow-log">
                  流程日志
                </TabPane>
                <TabPane tab="流程图" key="3" className="order-flow-chart">
                  流程图
                </TabPane>
              </Tabs>
            </Content>
            <Footer className="seid-flow-order-foot">
              <div className="field-item">
                <span className="label">业务单号</span>
                <span className="value">{header ? header.businessCode : ''}</span>
              </div>
              <div className="field-item">
                <span className="label">制单人</span>
                <span className="value">{header ? header.createUser : ''}</span>
              </div>
              <div className="field-item">
                <span className="label">制单时间</span>
                <span className="value">{header ? header.createTime : ''}</span>
              </div>
            </Footer>
          </Layout>
        </Content>
        <Sider theme="light" width={360} className="seid-flow-approve-panel">
          {loading ? <ListLoader /> : <ApprovePanel {...approvePanelProps} />}
        </Sider>
      </Layout>
    );
  };

  render() {
    return (
      <SeidLocaleReceiver defaultLocale={defaultLocale} componentName="Approve">
        {this.renderApprove}
      </SeidLocaleReceiver>
    );
  }
}

export default Approve;
