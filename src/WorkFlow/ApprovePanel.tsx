import React, { Component } from 'react';
import cls from 'classnames';
import Input from 'antd/es/input';
import Badge from 'antd/es/badge';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Dropdown from 'antd/es/dropdown';
import Radio from 'antd/es/radio';
import Modal from 'antd/es/modal';
import Timeline from 'antd/es/timeline';
import Menu from 'antd/es/menu';
import ExtIcon from '../ext-icon';
import { formatMsg } from '../utils';
import ScrollBar from '../scroll-bar';
import { LocaleItem } from '../locale';
import StoreProps from './storeProps';

const { TextArea } = Input;
const { confirm } = Modal;

export interface ApprovePanelProps {
  store: Omit<StoreProps, 'url' | 'type' | 'params'>;
  locale: LocaleItem;
  defaultOpinion?: string;
  header?: any;
  nextNodes?: any[];
  defaultSelectNode?: any;
  manualSelected?: boolean;
}

type IApprovePanelState = {
  opinion?: string;
  loading?: boolean;
  nextChooseNode?: any;
};

class ApprovePanel extends Component<ApprovePanelProps, IApprovePanelState> {
  constructor(props: ApprovePanelProps) {
    super(props);
    const { defaultOpinion = '', defaultSelectNode } = props;
    this.state = {
      opinion: defaultOpinion,
      nextChooseNode: defaultSelectNode,
      loading: false,
    };
  }

  handlerOpinionChange = (e: any) => {
    this.setState({ opinion: e.target.value });
  };

  handlerDecisionChange = (e: any) => {
    const { nextNodes = [] } = this.props;
    const { value } = e.target;
    const selectNodes = nextNodes.filter(node => node.id === value);
    this.setState({
      nextChooseNode: selectNodes.length > 0 ? selectNodes[0] : null,
    });
  };

  commonConfirm = (title: string, okHandler: () => void) => {
    confirm({
      title: '温馨提示',
      content: formatMsg('您确定要{title}吗？', { title }),
      onOk: () => {
        okHandler();
      },
    });
  };

  delegateApprove = () => {};

  handlerNext = () => {};

  renderDecision = () => {
    const { nextNodes = [], manualSelected } = this.props;
    const { nextChooseNode } = this.state;
    if (nextNodes.length > 0) {
      if (manualSelected) {
        return (
          <Radio.Group defaultValue={nextChooseNode.id} onChange={this.handlerDecisionChange}>
            {nextNodes.map(subRadio => (
              <Radio className="decision-item" key={subRadio.id} value={subRadio.id}>
                {subRadio.name}
              </Radio>
            ))}
          </Radio.Group>
        );
      }
      return nextNodes.map(subSpan => (
        <div key={subSpan.id} className="decision-item">
          {subSpan.name}
        </div>
      ));
    }
    return '';
  };

  renderBaseProcessBtn = () => {
    const { header } = this.props;
    const { nextChooseNode, loading } = this.state;
    const approveFlag =
      nextChooseNode.currentTaskType === 'CounterSign' ||
      nextChooseNode.currentTaskType === 'Approve';
    let btn = (
      <Button
        key="turn"
        loading={loading}
        style={{ marginRight: '5px', marginTop: '6px' }}
        type="primary"
        onClick={() => this.commonConfirm('完成委托审阅', this.delegateApprove)}
      >
        审阅
      </Button>
    );
    if (header.trustState !== 2) {
      if (approveFlag) {
        btn = (
          <>
            <Button
              loading={loading}
              key="approve"
              type="primary"
              onClick={() => this.handlerNext()}
            >
              同意
            </Button>
            <Button key="reject" type="danger" loading={loading} onClick={() => this.handlerNext()}>
              不同意
            </Button>
          </>
        );
      } else {
        btn = (
          <Button key="turn" type="primary" loading={loading} onClick={() => this.handlerNext()}>
            {header.solidifyFlow ? '同意' : '下一步'}
          </Button>
        );
      }
    }
    return btn;
  };

  render() {
    const { opinion } = this.state;
    const { header } = this.props;
    const menus: any[] = [];
    return (
      <div className="seid-approve-panel-body">
        <Card
          className={cls('card-box', 'work-note-box')}
          title={<Badge color="cyan" text="业务摘要" />}
          bordered={false}
          size="small"
        >
          <ScrollBar>{header ? header.workAndAdditionRemark : ''}</ScrollBar>
        </Card>
        <Card
          className={cls('card-box', 'prev-prosess-box')}
          title={<Badge color="orange" text="上一步处理结果" />}
          bordered={false}
          size="small"
        >
          <ScrollBar>
            <Timeline>
              <Timeline.Item color="gray" className="desc-box">
                想了解更多，请看流程日志
              </Timeline.Item>
              <Timeline.Item
                color="green"
                dot={<ExtIcon type="check-circle" style={{ fontSize: '16px' }} antd />}
              >
                <div className="remark-content">{header ? header.prOpinion : '未填写处理意见'}</div>
                <div className="person-box">{`${header ? header.prUser : ''} (${
                  header ? header.preCreateTime : ''
                })`}</div>
              </Timeline.Item>
            </Timeline>
          </ScrollBar>
        </Card>
        <Card
          className={cls('card-box', 'decision-box')}
          title={<Badge color="purple" text="决策" />}
          bordered={false}
          size="small"
        >
          <ScrollBar>{this.renderDecision()}</ScrollBar>
        </Card>
        <Card
          className={cls('card-box', 'process-box')}
          title={<Badge status="processing" text="处理意见" />}
          bordered={false}
          size="small"
        >
          <ScrollBar>
            <div className="remark-box">
              <TextArea
                style={{ resize: 'none' }}
                value={opinion}
                placeholder="同意/不同意"
                onChange={this.handlerOpinionChange}
                autoSize={{ minRows: 4, maxRows: 4 }}
              />
            </div>
            <div className="tool-action-box">
              <Button type="primary" className="btn-item">
                同意
              </Button>
              <Button type="danger" className="btn-item">
                不同意
              </Button>
              <Dropdown overlay={<Menu>{menus}</Menu>} className="btn-item">
                <Button>
                  更多
                  <ExtIcon type="down" antd />
                </Button>
              </Dropdown>
            </div>
          </ScrollBar>
        </Card>
      </div>
    );
  }
}

export default ApprovePanel;
