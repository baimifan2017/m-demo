var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
/*
 * @Author: zp
 * @Date:   2019-07-02 16:07:20
 * @Last Modified by:   zp
 * @Last Modified time: 2019-07-02 17:03:46
 */
import React, { Component } from 'react';
import Modal from 'antd/es/modal';
import DragWrapper from './DragWrapper';
/**
 * 其他属性配置参考antd中的Modal组件
 */
export default class ExtModal extends Component {
    render() {
        const _a = this.props, { visible, title } = _a, rest = __rest(_a, ["visible", "title"]);
        if (!title) {
            return (<DragWrapper>
          <Modal {...this.props}/>
        </DragWrapper>);
        }
        const DragTitle = (<DragWrapper>
        <>{title}</>
      </DragWrapper>);
        return <Modal visible={visible} title={DragTitle} {...rest}/>;
    }
}
ExtModal.DragWrapper = DragWrapper;
