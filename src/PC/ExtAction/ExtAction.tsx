/**
 *@author:lzh
 *@describe: ExAction
 *@time:
 */
import React, {Component, Fragment, ReactNode} from 'react';
// @ts-ignore
import {Dropdown, Icon, Menu, message, Popconfirm, Spin} from 'antd';
import {ExtIcon, utils, WorkFlow} from 'suid';
import cls from 'classnames';
import styles from './style/index.less';
import isEqual from 'react-fast-compare';

const {Item} = Menu;
const {getUUID} = utils;
const {StartFlow, FlowHistoryButton} = WorkFlow;

export interface IListProps {
  title: string
  key: string
  disabled?: boolean
  className?: string
  /** 权限代码，权限code与disabled两者共同控制着按钮显示*/
  authorityCode?: string
  type?: ReactNode | string
  /** 提示信息*/
  warnTip?: string
  /** 流程启动实体路径*/
  businessModelCode?: string
  /** 流程启动前事件*/
  onBeforeStart?: (resolve: { success: boolean }) => void
  /** 流程启动后事件*/
  onStartComplete?: (record: object) => void
}

export declare type ILayOut = 'Inline' | 'Vertical';

export interface IActionProps {
  /** 下拉列表数组*/
  listArr: IListProps[]
  /** 当前选中行信息*/
  record: object
  /** 布局方式*/
  layOut?: ILayOut
  /** 点击事件*/
  action?: (key: string, record: object) => void
}

export interface IActionState {
  menuShow: boolean
  menusData: any[]
  selectedKeys: string
}

class ExtAction extends Component<IActionProps, IActionState> {

  constructor(props: IActionProps | Readonly<IActionProps>) {
    super(props);
    this.state = {
      menuShow: false,
      menusData: [],
      selectedKeys: '',
    };
  }

  static defaultProps = {
    listArr: [],
  }

  componentDidUpdate(prevProps: { record: any; }, prevState: any) {
    if (!isEqual(prevProps.record, this.props.record)) {
      this.initActionMenus();
    }
  }

  cancelAction = (e: React.MouseEvent<HTMLElement> | undefined) => {
    // @ts-ignore
    e.stopPropagation();
    this.setState({
      selectedKeys: '',
      menuShow: false,
    });
  };

  action = (e: React.MouseEvent<HTMLElement> | undefined, key: string, record: object) => {
    if (e) e.stopPropagation();
    this.setState({
      selectedKeys: '',
      menuShow: false,
    }, () => {
      const {action} = this.props;
      if (action) action(key, record)
    });
  };

  onBeforeStart = (_beforeStart: (resolve: (value: { success: boolean }) => void, record: object) => void): any => {
    const {record} = this.props;
    return new Promise(resolve => {
      this.setState({
        selectedKeys: '',
        menuShow: false,
      });
      _beforeStart(resolve, record);
    });
  };

  onStartComplete = (res: { success: boolean; }, _startComplete: (arg0: any) => void) => {
    const {record} = this.props;
    if (res.success) {
      message.destroy();
      this.setState({
        selectedKeys: '',
        menuShow: false,
      });
      _startComplete(record)
    }
  };

  onActionOperation = (e: any, record: object) => {
    const {action} = this.props;
    if (e.key.indexOf('history_de') || e.key.indexOf('startFlow_de')) {
      this.setState({
        selectedKeys: e.key,
        menuShow: true,
      });
    } else {
      this.setState({
        selectedKeys: '',
        menuShow: false,
      }, () => {
        if (action) action(e.key, record);
      });
    }
  };

  /**
   * 渲染流程按钮
   * @param type
   * @param item
   * @param record
   * @param key
   */
  onRenderFlow = (type: 'history' | 'start', item: any, record: any, key: any) => {
    if (type === 'history') {
      return <FlowHistoryButton key={key} businessId={record.id}>
        <div style={{height: '100%'}}>
          <span className="menu-title">{item.title}</span>
        </div>
      </FlowHistoryButton>
    }

    if (type === 'start') {
      // @ts-ignore
      return <StartFlow
        key={record.id}
        businessKey={record.id}
        businessModelCode={item.businessModelCode}
        beforeStart={() => this.onBeforeStart(item.onBeforeStart)}
        startComplete={(res) => this.onStartComplete(res, item.onStartComplete)}
      >
        {loading => {
          return (
            <div style={{height: '100%'}}>
              <Spin spinning={loading}>
                <span className="menu-title">{item.title}</span>
              </Spin>
            </div>
          );
        }}
      </StartFlow>
    }
  }

  /**
   * 渲染流程按钮以外的普通按钮
   * @param item
   * @param record
   * @param isClick
   */
  onRenderItem = (item: { warnTip: any; type: string; key: string; title: React.ReactNode | string; className: string }, record: object, isClick?: boolean) => {
    if (item.warnTip) {
      return <Popconfirm
        overlayClassName={cls(styles['pop-confirm-box'])}
        title={item.warnTip || '确定要删除吗？提示：删除后不可恢复!'}
        placement="top"
        icon={item.type || <Icon type="question-circle"/>}
        onCancel={e => this.cancelAction(e)}
        onConfirm={e => this.action(e, item.key, record)}
      >
        <ExtIcon type={item.type} antd/>{item.title}
      </Popconfirm>
    } else {
      const {title, type, className} = item
      return <>
        <ExtIcon
          className={className}
          onClick={e => {
            if (isClick) this.action(e, item.key, record)
          }}
          type={type}
          antd
        />
        {title}
      </>
    }
  }

  getMenu = (menus: any, record: any) => {
    const {selectedKeys} = this.state;
    const menuId = getUUID();
    return (
      <Menu
        id={menuId}
        className={cls(styles['action-menu-box'])}
        onClick={e => this.onActionOperation(e, record)}
        selectedKeys={[selectedKeys]}
      >
        {
          menus.forEach((item: any, index: number) => {
            if (record?.flowStatus) {
              if (record?.flowStatus.toLowerCase() === 'init') {
                if (item.warnTip) {
                  return <Item key={item.key} onClick={(e) => {
                    e.domEvent && e.domEvent.stopPropagation()
                  }}>
                    {this.onRenderItem(item, record)}
                  </Item>
                } else {
                  return <Item key={item.key}>
                    {this.onRenderItem(item, record)}
                  </Item>
                }
              } else {
                if (item.businessModelCode) {
                  return (<>
                    <Item key={item.key + 'history_de'}>
                      {this.onRenderFlow('history', item, record, index)}
                    </Item>
                    <Item key={item.key + 'startFlow_de'}>
                      {this.onRenderFlow('start', item, record, index)}
                    </Item>
                  </>)
                }
              }
            }
          })
        }
      </Menu>
    );
  };

  componentDidMount() {
    this.initActionMenus();
  }

  initActionMenus = () => {
    const {listArr = []} = this.props;
    const menus = listArr.filter((action) => {
      return action;
    });
    const mData = menus.filter(m => !m.disabled);
    this.setState({
      menusData: mData,
    });
  };

  /**
   * DropDown 组件下拉显示控制
   * @param v
   */
  onVisibleChange = (v: boolean): void => {
    this.setState({
      menuShow: v,
    });
  };

  /**
   * Inline 样式
   * 横向一排显示，超过三个按钮采用下拉。
   * @param menus
   * @param menuShow
   */
  renderInline = (menus: any[], menuShow: boolean): ReactNode => {
    const {record} = this.props;

    return menus.map((item, index) => {
      if (index <= 3) {
        // @ts-ignore
        if (!record.flowStatus || record?.flowStatus.toLowerCase() === 'init') {
          this.onRenderItem(item, record, true)
        } else {
          this.onRenderFlow('history', item, record, index)
          this.onRenderFlow('start', item, record, index)
        }
      } else {
        const verticalMenus = menus.splice(3);
        this.renderVertical(verticalMenus, menuShow)
      }
    })
  }

  /**
   * Vertical样式
   * 全部纵向下拉显示
   * @param menusData
   * @param menuShow
   */
  renderVertical = (menusData: any, menuShow: boolean | undefined) => {
    const {record} = this.props;
    return <Dropdown
      trigger={['click']}
      overlay={this.getMenu(menusData, record)}
      className="action-drop-down"
      placement="bottomLeft"
      visible={menuShow}
      onVisibleChange={this.onVisibleChange}
    >
      <ExtIcon className={cls('action-recordItem')} type="more" antd />
    </Dropdown>
  }

  render() {
    const {layOut} = this.props;
    const {menuShow, menusData = []} = this.state;
    return (
      <Fragment>
        {
          menusData.length > 0 && layOut === 'Vertical'
            ?
            this.renderVertical(menusData, menuShow)
            :
            <span className={cls('action-box')}>
              {this.renderInline(menusData, menuShow)}
            </span>
        }
      </Fragment>
    );
  }
}

export default ExtAction;
