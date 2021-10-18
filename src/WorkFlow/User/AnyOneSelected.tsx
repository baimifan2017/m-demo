/*

 * @Date: 2020-02-15 11:53:29
 * @Last Modified time: 2020-02-17 09:43:50
 */
import React, { Component } from 'react';
import cls from 'classnames';
import { Method } from 'axios';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Radio from 'antd/es/radio';
import Button from 'antd/es/button';
import ListCard from '../../ListCard';
import ListLoader from '../../ListLoader';
import StoreProps from '../storeProps';
import { LocaleItem } from '../../locale';
import Organization from './Organization';
import { formatMsg } from '../../utils';

export interface AnyOneSelectedProps {
  store: StoreProps;
  locale: LocaleItem;
  uiType?: string;
  onSelectChange?: (keys: string[]) => void;
}

class AnyOneSelected extends Component<AnyOneSelectedProps, any> {
  protected listCardRef: any;

  constructor(props: AnyOneSelectedProps) {
    super(props);
    this.state = {
      orgId: null,
      assignedUser: [],
      assignedSelectedUserKeys: [],
    };
  }

  handlerOrganizationChange = (orgId: string | null) => {
    this.setState({ orgId });
  };

  renderCustomTool = (data: any) => {
    const { locale } = this.props;
    const { checkedList = {}, total = 0 } = data;
    const keys = Object.keys(checkedList);
    return (
      <>
        <Button
          size="small"
          onClick={(e: any) => this.removeAssignedUser(e)}
          disabled={keys.length === 0}
          type="danger"
        >
          {formatMsg(locale.removeLable, { count: keys.length })}
        </Button>
        <span style={{ marginLeft: 8 }}>{formatMsg(locale.totalCount, { count: total })}</span>
      </>
    );
  };

  removeAssignedUser = (e: MouseEvent) => {
    e && e.stopPropagation();
    const users: any[] = [];
    const removedUsers: any[] = [];
    const { assignedSelectedUserKeys = [], assignedUser = [] } = this.state;
    assignedUser.forEach((u: any) => {
      if (assignedSelectedUserKeys.indexOf(u.id) === -1) {
        users.push(u);
      } else {
        removedUsers.push(u);
      }
    });
    this.setState(
      {
        assignedUser: users,
      },
      () => {
        this.listCardRef.manualUpdateItemChecked(removedUsers);
        this.handlerSelectChange();
      },
    );
  };

  handerAssignUserSelectChange = (_keys: string[], items: any[]) => {
    this.setState(
      {
        assignedUser: items,
      },
      this.handlerSelectChange,
    );
  };

  handerAssignedUserSelectChange = (assignedSelectedUserKeys: string[]) => {
    this.setState({ assignedSelectedUserKeys });
  };

  handlerOrganizationAfterLoaded = (orgId: string | null) => {
    this.setState({ orgId });
  };

  handlerSelectChange = () => {
    const { onSelectChange } = this.props;
    const { assignedUser = [] } = this.state;
    const keys = assignedUser.map((u: any) => u.id);
    if (onSelectChange) {
      onSelectChange(keys);
    }
  };

  renderSingleAvatar = (keyValue: string, checkedList: any) => {
    return <Radio checked={!!checkedList[keyValue]} />;
  };

  render() {
    const { orgId, assignedUser } = this.state;
    const { store, locale, uiType } = this.props;
    const { serviceHost, gateway } = store;
    const host = serviceHost ? `${serviceHost}/` : '';
    const listCardProps = {
      className: 'anyone-user-box',
      title: locale.candidate,
      bordered: false,
      cascadeParams: {
        organizationId: orgId,
      },
      checkbox: uiType === 'checkbox',
      itemField: {
        avatar: uiType !== 'checkbox' ? this.renderSingleAvatar : undefined,
        title: (item: any) => (
          <>
            {item.userName}
            <span style={{ fontSize: 12, marginLeft: 8, color: '#999' }}>{`(${item.code})`}</span>
          </>
        ),
        description: (item: any) =>
          item.organization ? <span style={{ fontSize: 12 }}>{item.organization.name}</span> : '',
      },
      searchProperties: ['userName', 'code', 'organization.name'],
      remotePaging: true,
      store: {
        type: 'POST' as Method,
        url: `${host}${gateway}/flow-service/flowDefination/listUserByOrg`,
        params: { includeSubNode: true },
      },
      onSelectChange: this.handerAssignUserSelectChange,
      onListCardRef: (ref: any) => (this.listCardRef = ref),
    };
    const assignedListCardProps = {
      className: 'anyone-user-box',
      title: formatMsg(locale.selectedPerson, { count: assignedUser.length }),
      bordered: false,
      checkbox: true,
      pagination: false,
      dataSource: assignedUser,
      itemField: {
        title: (item: any) => (
          <>
            {item.userName}
            <span style={{ fontSize: 12, marginLeft: 8, color: '#999' }}>{`(${item.code})`}</span>
          </>
        ),
        description: (item: any) =>
          item.organization ? <span style={{ fontSize: 12 }}>{item.organization.name}</span> : '',
      },
      showArrow: false,
      showSearch: false,
      customTool: this.renderCustomTool,
      onSelectChange: this.handerAssignedUserSelectChange,
    };
    return (
      <Row gutter={4} className={cls('anyone-user-wrapper')}>
        <Col span={6} className={cls('anyone-user-box')}>
          <Organization
            store={store}
            locale={locale}
            onSelectChange={this.handlerOrganizationChange}
            onAfterLoaded={this.handlerOrganizationAfterLoaded}
          />
        </Col>
        <Col span={9} className={cls('anyone-user-box')}>
          {orgId ? <ListCard {...listCardProps} /> : <ListLoader />}
        </Col>
        <Col span={9} className={cls('anyone-user-box')}>
          <ListCard {...assignedListCardProps} />
        </Col>
      </Row>
    );
  }
}

export default AnyOneSelected;
