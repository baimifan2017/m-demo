import React, { Component, ReactNode } from 'react';
import cls from 'classnames';
import Dropdown from 'antd/es/dropdown';
import Menu from 'antd/es/menu';
import Popover from 'antd/es/popover';
import ExtIcon from '../ExtIcon';
import SeidLocaleReceiver from '../seid-locale-provider/SeidLocaleReceiver';
import { LocaleItem } from '../locale';
import defaultLocale from './locale';
import { constants, getUUID } from '../utils';
import IColumnProps from './columnProps';
import ColumnAssign from './ColumnAssign';
import GUID from './guid';

const { Item } = Menu;
const { EXT_TABLE_TOOL } = constants;

export interface IExtToolProps<T> {
  columns: IColumnProps<T>[];
  targetColumns: IColumnProps<T>[];
  onColumnCheckedChange: (cols: IColumnProps<T>[]) => void;
  saveToggleToStorage: (cols: IColumnProps<T>[], needSave: boolean | undefined) => void;
  storageId?: GUID;
  hasStorage?: boolean;
}
export interface IExtToolState<T> {
  popVisible: boolean;
  menuShow: boolean;
  targetColumns: IColumnProps<T>[];
}

const getMenuData = (locale: LocaleItem) => [
  {
    title: locale.columns,
    icon: 'column',
    key: EXT_TABLE_TOOL.SET_COLUMNS,
  },
];

class ExtTool<T> extends Component<IExtToolProps<T>, IExtToolState<T>> {
  static defaultProps = {
    columns: [],
    targetColumns: [],
  };

  constructor(props: IExtToolProps<T>) {
    super(props);
    const { targetColumns } = props;
    this.state = {
      popVisible: false,
      menuShow: false,
      targetColumns,
    };
  }

  updateTargetColumn = (column: IColumnProps<T>) => {
    const { targetColumns } = this.state;
    const newTargetColumns = [...targetColumns];
    for (let i = 0; i < newTargetColumns.length; i += 1) {
      if (newTargetColumns[i].dataIndex === column.dataIndex) {
        newTargetColumns[i] = column;
        break;
      }
    }
    this.setState({
      targetColumns: newTargetColumns,
    });
  };

  handlerMenuClick = (e: any) => {
    const { key } = e;
    switch (key) {
      case EXT_TABLE_TOOL.SET_COLUMNS:
        this.setState({
          menuShow: true,
        });
        break;
      default:
    }
  };

  handlePopoverChange = (popVisible: boolean) => {
    this.setState({ popVisible });
  };

  renderToolMenu = (locale: LocaleItem) => {
    const menuData = getMenuData(locale);
    const { popVisible, targetColumns } = this.state;
    const columnAssignProps = {
      locale,
      targetColumns,
      ...this.props,
    };
    const menuId = getUUID();
    return (
      <Menu id={menuId} className={cls('ext-table-tool-menu-box')} onClick={this.handlerMenuClick}>
        {menuData.map((m: any) => {
          if (m.key === EXT_TABLE_TOOL.SET_COLUMNS) {
            return (
              <Item key={m.key} className={cls('colmun')}>
                <Popover
                  trigger="click"
                  visible={popVisible}
                  placement="rightTop"
                  key="ext-table-tool-menu-popover-box"
                  onVisibleChange={visible => this.handlePopoverChange(visible)}
                  overlayClassName={cls('ext-table-tool-menu-popover-box')}
                  content={<ColumnAssign {...columnAssignProps} />}
                >
                  <ExtIcon type={m.icon} />
                  {m.title}
                </Popover>
              </Item>
            );
          }
          return <Item key={m.key}>{m.title}</Item>;
        })}
      </Menu>
    );
  };

  handlerMenuShow = (menuShow: boolean) => {
    const { popVisible } = this.state;
    if (popVisible && !menuShow) {
      this.setState({ popVisible: false });
    }
    this.setState({ menuShow });
  };

  renderTool = (locale: LocaleItem) => {
    const { menuShow } = this.state;
    return (
      <Dropdown
        placement="bottomLeft"
        visible={menuShow}
        trigger={['click']}
        onVisibleChange={this.handlerMenuShow}
        overlay={this.renderToolMenu(locale)}
      >
        <div className={cls('ext-table-tool-trigger')}>
          <ExtIcon type="appstore" antd />
          <ExtIcon type="down" antd />
        </div>
      </Dropdown>
    );
  };

  render(): ReactNode {
    return (
      <SeidLocaleReceiver componentName="ExtTable" defaultLocale={defaultLocale}>
        {this.renderTool}
      </SeidLocaleReceiver>
    );
  }
}

export default ExtTool;
