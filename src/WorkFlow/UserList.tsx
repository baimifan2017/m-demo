/*
 * @Author: Eason
 * @Date: 2020-02-14 19:17:59
 * @Last Modified by: Eason
 * @Last Modified time: 2020-02-15 16:44:09
 */
import React, { PureComponent } from 'react';
import { split } from 'lodash';
import Alert from 'antd/es/alert';
import Radio from 'antd/es/radio';
import { LocaleItem } from '../locale';
import StoreProps from './storeProps';
import ListCard from '../list-card';
import AnyOneSelected from './User/AnyOneSelected';

export interface NodeListProps {
  store: StoreProps;
  nodeId: string;
  dataSource: any[];
  locale: LocaleItem;
  loading?: boolean;
  uiUserType?: string;
  uiType?: string;
  flowTaskType?: string;
  defaultExecutorUsers?: string;
  onUserSelectChange?: (nodeId: string, keys: string[]) => void;
}

class UserSelect extends PureComponent<NodeListProps, any> {
  static defaultProps = {
    dataSource: [],
    loading: false,
    flowTaskType: '',
  };

  handlerUserSelectChange = (checkedUserList: string[]) => {
    const { onUserSelectChange, nodeId } = this.props;
    if (onUserSelectChange) {
      onUserSelectChange(nodeId, checkedUserList);
    }
  };

  renderSingleAvatar = (keyValue: string, checkedList: any) => {
    return <Radio checked={!!checkedList[keyValue]} />;
  };

  renderUserList = () => {
    const {
      flowTaskType = '',
      uiUserType,
      uiType,
      dataSource,
      locale,
      store,
      defaultExecutorUsers,
    } = this.props;
    if (flowTaskType.toLowerCase() === 'pooltask') {
      return <Alert message={locale.noNeedSelectUser} type="info" showIcon banner />;
    }
    if (uiUserType === 'AnyOne') {
      return (
        <AnyOneSelected
          store={store}
          uiType={uiType}
          locale={locale}
          onSelectChange={this.handlerUserSelectChange}
        />
      );
    }

    let selectedKeys: string[] = [];
    if (defaultExecutorUsers) {
      selectedKeys = split(defaultExecutorUsers, ',');
    }
    const listCardProps = {
      className: 'common-user-box',
      bordered: false,
      pagination: false,
      showSearch: false,
      dataSource,
      selectedKeys,
      checkbox: uiType === 'checkbox',
      itemField: {
        avatar: uiType === 'checkbox' ? undefined : this.renderSingleAvatar,
        title: (item: any) => (
          <>
            {item.name}
            <span style={{ fontSize: 12, marginLeft: 8, color: '#999' }}>{`(${item.code})`}</span>
          </>
        ),
        description: (item: any) =>
          item.organizationName ? (
            <span style={{ fontSize: 12 }}>{item.organizationName}</span>
          ) : (
            ''
          ),
        extra: (item: any) => (
          <span style={{ fontSize: 12, marginRight: 8 }}>{item.positionName}</span>
        ),
      },
      showArrow: false,
      onSelectChange: this.handlerUserSelectChange,
    };
    return <ListCard {...listCardProps} />;
  };

  render() {
    return <div className="user-list">{this.renderUserList()}</div>;
  }
}

export default UserSelect;
