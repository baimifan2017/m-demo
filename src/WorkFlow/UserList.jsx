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
import AnyOneSelected from './User/AnyOneSelected';
class UserSelect extends PureComponent {
    constructor() {
        super(...arguments);
        this.handlerUserSelectChange = (checkedUserList) => {
            const { onUserSelectChange, nodeId } = this.props;
            if (onUserSelectChange) {
                onUserSelectChange(nodeId, checkedUserList);
            }
        };
        this.renderSingleAvatar = (keyValue, checkedList) => {
            return <Radio checked={!!checkedList[keyValue]}/>;
        };
        this.renderUserList = () => {
            const { flowTaskType = '', uiUserType, uiType, dataSource, locale, store, defaultExecutorUsers, } = this.props;
            if (flowTaskType.toLowerCase() === 'pooltask') {
                return <Alert message={locale.noNeedSelectUser} type="info" showIcon banner/>;
            }
            if (uiUserType === 'AnyOne') {
                return (<AnyOneSelected store={store} uiType={uiType} locale={locale} onSelectChange={this.handlerUserSelectChange}/>);
            }
            let selectedKeys = [];
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
                    title: (item) => (
                        <  >
                        { item: .name }
                        < span), style = {}
                }
            }, { fontSize:  = 12, marginLeft:  = 8, color:  = '#999' };
        };
    }
}
UserSelect.defaultProps = {
    dataSource: [],
    loading: false,
    flowTaskType: '',
};
 > {} `(${item.code})`;
span >
;
 >
;
description: (item) => item.organizationName ? (<span style={{ fontSize: 12 }}>{item.organizationName}</span>) : (''),
    extra;
(item) => (<span style={{ fontSize: 12, marginRight: 8 }}>{item.positionName}</span>),
;
showArrow: false,
    onSelectChange;
this.handlerUserSelectChange,
;
;
return <ListCard {...listCardProps}/>;
;
render();
{
    return <div className="user-list">{this.renderUserList()}</div>;
}
export default UserSelect;
