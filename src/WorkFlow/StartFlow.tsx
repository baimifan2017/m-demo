/*
 * @Date: 2020-02-14 15:12:29
 * @Last Modified by: Eason
 * @Last Modified time: 2020-02-17 17:30:10
 */
import React, { Component } from 'react';
import { Method, AxiosRequestConfig } from 'axios';
import cls from 'classnames';
import { toLower } from 'lodash';
import message from 'antd/es/message';
import Button, { ButtonProps } from 'antd/es/button';
import Input from 'antd/es/input';
import Tooltip from 'antd/es/tooltip';
import ExtModal from '../ext-modal';
import ComboList from '../combo-list';
import ListLoader from '../list-loader';
import { request, formatMsg } from '../utils';
import StoreProps from './storeProps';
import SeidLocaleReceiver from '../seid-locale-provider/SeidLocaleReceiver';
import { LocaleItem } from '../locale';
import defaultLocale from './locale';
import NodeList from './NodeList';

const defaultGateway = 'sei-gateway';
const defaultStartSubmitUrl = 'flow-service/defaultFlowBase/startFlowNew';

export interface IStartFlowProps {
  className?: string;
  style?: React.CSSProperties;
  /** 业务单据id */
  businessKey: string;
  /** 实体模型代码 */
  businessModelCode: string;
  beforeStart?: () => PromiseLike<void>;
  /** 启动成功回调函数 */
  startComplete?: (res: any) => void;
  /** 取消按钮回调 */
  onCancel?: () => void;
  store: StoreProps;
  startButtonProps?: ButtonProps;
}

type IStartFlowState = {
  allowStart: boolean;
  globalLoading: boolean;
  showFlowModal: boolean;
  solidifyFlow: boolean;
  flowTypeList: any[];
  nodeInfoList: any[];
  currentFlowType: any | null;
  loading: boolean;
  executorUserMap: any;
  instancyStatusMap: any;
  store: StoreProps;
};

class StartFlow extends Component<IStartFlowProps, IStartFlowState> {
  protected locale: LocaleItem;

  protected nodeListRef: any;

  protected remark: string = '';

  constructor(props: IStartFlowProps) {
    super(props);
    this.state = {
      allowStart: false,
      globalLoading: false,
      showFlowModal: false,
      solidifyFlow: false,
      flowTypeList: [],
      nodeInfoList: [],
      currentFlowType: null,
      loading: false,
      executorUserMap: new Map(),
      instancyStatusMap: new Map(),
      store: {
        type: 'POST',
        url: defaultStartSubmitUrl,
        serviceHost: '',
        gateway: defaultGateway,
        ...(props.store || {}),
      },
    };
  }

  startSubmitCallBack = (res: any) => {
    const { startComplete } = this.props;
    if (startComplete) {
      startComplete(res);
    }
  };

  handlerModalVisible = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
    this.setState({ showFlowModal: false, globalLoading: false });
  };

  handlerSubmit = () => {
    const {
      store,
      solidifyFlow,
      executorUserMap,
      instancyStatusMap,
      nodeInfoList,
      currentFlowType,
    } = this.state;
    const { businessKey, businessModelCode } = this.props;
    if (solidifyFlow) {
      // 固化流程
      return;
    }
    this.setState({
      globalLoading: true,
    });
    const taskList: any = [];
    nodeInfoList.forEach((item: any) => {
      const selectUser = executorUserMap.get(item.id);
      const instancyStatus = instancyStatusMap.get(item.id) || false;
      taskList.push({
        nodeId: item.id,
        userVarName: item.userVarName,
        flowTaskType: item.flowTaskType,
        instancyStatus,
        userIds: selectUser instanceof Array ? selectUser.toString() : selectUser,
      });
    });
    const { flowDefKey, id } = currentFlowType;
    const params: any = {
      businessKey,
      businessModelCode,
      flowDefKey,
      taskList: JSON.stringify(taskList),
      typeId: id,
      opinion: this.remark,
    };
    const { url, type, serviceHost, gateway } = store;
    const methodType: Method = type || 'post';
    const requestOptions: AxiosRequestConfig = {
      method: methodType,
      url: `${serviceHost}/${gateway}/${url}`,
    };
    if (methodType.toLocaleLowerCase() === 'get') {
      requestOptions.params = params;
    } else {
      requestOptions.data = params;
    }
    request(requestOptions)
      .then((res: any) => {
        if (res.success) {
          message.success(res.message || this.locale.submitSuccess);
        } else {
          message.error(res.message);
        }
        this.startSubmitCallBack(res);
        this.handlerModalVisible();
      })
      .finally(() => {
        this.setState({
          globalLoading: false,
        });
      });
  };

  handlerFlowTypeSelect = (currentFlowType: any) => {
    this.setState({ currentFlowType, loading: true }, this.startFlow);
  };

  handlerRemarkChange = (e: any) => {
    this.remark = e.target.value;
  };

  startFlow = () => {
    const { currentFlowType, store, flowTypeList: orginFlowTypeList } = this.state;
    const { businessKey, businessModelCode } = this.props;
    if (!businessKey || !businessModelCode) {
      message.error(formatMsg(this.locale.failTitle, { desc: 'businessKey、businessModelCode' }));
      return false;
    }
    this.setState({
      globalLoading: true,
    });
    const params = {
      businessKey,
      businessModelCode,
      typeId: currentFlowType ? currentFlowType.id : null,
    };
    const { url, type, serviceHost, gateway } = store;
    const methodType: Method = type || 'post';
    const requestOptions: AxiosRequestConfig = {
      method: methodType,
      url: `${serviceHost}/${gateway}/${url}`,
    };
    if (methodType.toLocaleLowerCase() === 'get') {
      requestOptions.params = params;
    } else {
      requestOptions.data = params;
    }
    request(requestOptions)
      .then((res: any) => {
        if (res.success) {
          const { nodeInfoList = [], solidifyFlow, flowTypeList = [], checkStartResult = false } =
            res.data || {};
          if (nodeInfoList.length > 0) {
            const executorUserMap = new Map();
            nodeInfoList.forEach((node: any) => {
              if ((node.executorSet || []).length === 1) {
                executorUserMap.set(node.id, node.executorSet[0].id);
              }
              const flowTaskType = toLower(node.flowTaskType || '');
              if (flowTaskType === 'pooltask') {
                executorUserMap.set(node.id, null);
              }
              /** 会签单签默认全选 */
              if (
                (node.uiUserType !== 'AnyOne' && flowTaskType === 'countersign') ||
                flowTaskType === 'singlesign'
              ) {
                const users = (node.executorSet || []).map((user: any) => user.id);
                executorUserMap.set(node.id, users.join(','));
              }
            });
            const newFlowTypeList = orginFlowTypeList.length > 0 ? orginFlowTypeList : flowTypeList;
            this.setState({
              allowStart: checkStartResult,
              showFlowModal: true,
              solidifyFlow,
              flowTypeList: newFlowTypeList,
              currentFlowType: flowTypeList.length > 0 ? flowTypeList[0] : null,
              executorUserMap,
              nodeInfoList,
            });
          } else {
            message.warning(this.locale.checkFail);
            this.startSubmitCallBack({ success: false });
          }
        } else {
          message.error(res.message);
          this.startSubmitCallBack({ success: false });
        }
      })
      .catch(err => {
        message.error(err.message || err);
        this.startSubmitCallBack({ success: false });
      })
      .finally(() => {
        this.setState({
          globalLoading: false,
          loading: false,
        });
      });
  };

  handlerStart = (e: MouseEvent) => {
    e && e.stopPropagation();
    const { beforeStart } = this.props;
    if (beforeStart) {
      beforeStart().then((res: any) => {
        if (res.success) {
          this.startFlow();
        } else {
          message.error(res.message || this.locale.submitFail);
        }
      });
    } else {
      this.startFlow();
    }
  };

  handlerNodeListChange = (data: any) => {
    const { executorUserMap, instancyStatusMap } = data;
    this.setState({ executorUserMap, instancyStatusMap });
  };

  renderStartButton = (localeItem: LocaleItem) => {
    this.locale = localeItem;
    const {
      store,
      allowStart,
      globalLoading,
      currentFlowType,
      solidifyFlow,
      loading,
      flowTypeList,
      nodeInfoList = [],
      showFlowModal,
      executorUserMap,
    } = this.state;
    const { className, style, children, startButtonProps } = this.props;
    const flowTypeProps = {
      value: currentFlowType ? currentFlowType.name : null,
      dataSource: flowTypeList,
      afterSelect: this.handlerFlowTypeSelect,
      style: { width: 200 },
      pagination: false,
      reader: {
        name: 'name',
      },
    };
    const btnStartDisabled =
      !allowStart || !(nodeInfoList.length > 0 && nodeInfoList.length === executorUserMap.size);
    const extProps = { onClick: this.handlerStart };
    const element =
      children && React.isValidElement(children) ? (
        React.Children.only(children)
      ) : (
        <Button type="primary" loading={globalLoading} {...startButtonProps}>
          {' '}
          {localeItem.startTitle}
        </Button>
      );
    const nodeListProps = {
      store,
      nodeInfoList,
      executorUserMap,
      locale: localeItem,
      onChange: this.handlerNodeListChange,
    };
    const hasAnyOne = nodeInfoList.filter(node => node.uiUserType === 'AnyOne').length > 0;
    return (
      <div className={cls('seid-flow-start', className)} style={style}>
        {React.cloneElement(element, { ...extProps })}
        <ExtModal
          title={currentFlowType ? currentFlowType.flowDefName : ''}
          wrapClassName="seid-flow-start-modal"
          bodyStyle={hasAnyOne ? { height: 520, maxHeight: 520 } : { height: 430, maxHeight: 430 }}
          width={hasAnyOne ? 880 : 520}
          visible={showFlowModal}
          okText={solidifyFlow ? localeItem.configureExecutor : localeItem.ok}
          onOk={this.handlerSubmit}
          onCancel={this.handlerModalVisible}
          okButtonProps={{
            style: { marginRight: '8px' },
            disabled: btnStartDisabled,
            type:
              !solidifyFlow && !(nodeInfoList.length === executorUserMap.size)
                ? 'default'
                : 'primary',
          }}
          destroyOnClose
          confirmLoading={globalLoading}
          centered
          maskClosable={false}
        >
          <div className="flow-type-box">
            <span className="label">{this.locale.flowTypeLabel}</span>
            <ComboList {...flowTypeProps} />
          </div>
          {loading ? (
            <ListLoader />
          ) : (
            <>
              <NodeList {...nodeListProps} />
              <div className="remark-box">
                <Tooltip title={localeItem.remarkPlaceholder} placement="top">
                  <Input.TextArea
                    style={{ border: 'none', resize: 'none' }}
                    rows={3}
                    placeholder={localeItem.remarkPlaceholder}
                    onChange={this.handlerRemarkChange}
                  />
                </Tooltip>
              </div>
            </>
          )}
        </ExtModal>
      </div>
    );
  };

  render() {
    return (
      <SeidLocaleReceiver defaultLocale={defaultLocale} componentName="StartFlow">
        {this.renderStartButton}
      </SeidLocaleReceiver>
    );
  }
}

export default StartFlow;
