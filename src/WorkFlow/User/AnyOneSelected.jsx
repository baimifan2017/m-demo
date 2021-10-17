/*
 * @Author: Eason
 * @Date: 2020-02-15 11:53:29
 * @Last Modified by: Eason
 * @Last Modified time: 2020-02-17 09:43:50
 */
import React, { Component } from 'react';
import Radio from 'antd/es/radio';
import Button from 'antd/es/button';
import { formatMsg } from '../../utils';
class AnyOneSelected extends Component {
    constructor(props) {
        super(props);
        this.handlerOrganizationChange = (orgId) => {
            this.setState({ orgId });
        };
        this.renderCustomTool = (data) => {
            const { locale } = this.props;
            const { checkedList = {}, total = 0 } = data;
            const keys = Object.keys(checkedList);
            return (
                <  >
                (<Button size="small" onClick={(e) => this.removeAssignedUser(e)} disabled={keys.length === 0} type="danger">
          {formatMsg(locale.removeLable, { count: keys.length })}
        </Button>
                    ,
                        <span style={{ marginLeft: 8 }}>{formatMsg(locale.totalCount, { count: total })}</span>));
             >
            ;
            ;
        };
        this.removeAssignedUser = (e) => {
            e && e.stopPropagation();
            const users = [];
            const removedUsers = [];
            const { assignedSelectedUserKeys = [], assignedUser = [] } = this.state;
            assignedUser.forEach((u) => {
                if (assignedSelectedUserKeys.indexOf(u.id) === -1) {
                    users.push(u);
                }
                else {
                    removedUsers.push(u);
                }
            });
            this.setState({
                assignedUser: users,
            }, () => {
                this.listCardRef.manualUpdateItemChecked(removedUsers);
                this.handlerSelectChange();
            });
        };
        this.handerAssignUserSelectChange = (_keys, items) => {
            this.setState({
                assignedUser: items,
            }, this.handlerSelectChange);
        };
        this.handerAssignedUserSelectChange = (assignedSelectedUserKeys) => {
            this.setState({ assignedSelectedUserKeys });
        };
        this.handlerOrganizationAfterLoaded = (orgId) => {
            this.setState({ orgId });
        };
        this.handlerSelectChange = () => {
            const { onSelectChange } = this.props;
            const { assignedUser = [] } = this.state;
            const keys = assignedUser.map((u) => u.id);
            if (onSelectChange) {
                onSelectChange(keys);
            }
        };
        this.renderSingleAvatar = (keyValue, checkedList) => {
            return <Radio checked={!!checkedList[keyValue]}/>;
        };
        this.state = {
            orgId: null,
            assignedUser: [],
            assignedSelectedUserKeys: [],
        };
    }
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
                title: (item) => (
                    <  >
                    { item: .userName }
                    < span), style = {}
            }
        }, { fontSize:  = 12, marginLeft:  = 8, color:  = '#999' };
    }
}
 > {} `(${item.code})`;
span >
;
 >
;
description: (item) => item.organization ? <span style={{ fontSize: 12 }}>{item.organization.name}</span> : '',
;
searchProperties: ['userName', 'code', 'organization.name'],
    remotePaging;
true,
    store;
{
    type: 'POST',
        url;
    `${host}${gateway}/flow-service/flowDefination/listUserByOrg`,
        params;
    {
        includeSubNode: true;
    }
}
onSelectChange: this.handerAssignUserSelectChange,
    onListCardRef;
(ref) => (this.listCardRef = ref),
;
;
const assignedListCardProps = {
    className: 'anyone-user-box',
    title: formatMsg(locale.selectedPerson, { count: assignedUser.length }),
    bordered: false,
    checkbox: true,
    pagination: false,
    dataSource: assignedUser,
    itemField: {
        title: (item) => (
            <  >
            { item: .userName }
            < span), style = {}
    }
}, { fontSize:  = 12, marginLeft:  = 8, color:  = '#999' };
 > {} `(${item.code})`;
span >
;
 >
;
description: (item) => item.organization ? <span style={{ fontSize: 12 }}>{item.organization.name}</span> : '',
;
showArrow: false,
    showSearch;
false,
    customTool;
this.renderCustomTool,
    onSelectChange;
this.handerAssignedUserSelectChange,
;
;
return (<Row gutter={4} className={cls('anyone-user-wrapper')}>
        <Col span={6} className={cls('anyone-user-box')}>
          <Organization store={store} locale={locale} onSelectChange={this.handlerOrganizationChange} onAfterLoaded={this.handlerOrganizationAfterLoaded}/>
        </Col>
        <Col span={9} className={cls('anyone-user-box')}>
          {orgId ? <ListCard {...listCardProps}/> : <ListLoader />}
        </Col>
        <Col span={9} className={cls('anyone-user-box')}>
          <ListCard {...assignedListCardProps}/>
        </Col>
      </Row>);
export default AnyOneSelected;
