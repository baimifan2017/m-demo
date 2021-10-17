/*
 * @Author: zp
 * @Date:   2019-07-02 16:11:15
 * @Last Modified by:   zp
 * @Last Modified time: 2019-09-11 17:46:19
 */
import React, { cloneElement } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'antd/es/modal';
import DragM from './DragM';
const deepTraversal = (node, className) => {
    let target = null;
    if (node !== null) {
        const children = node.children;
        for (let i = 0; i < children.length; i++) {
            const tempClassName = children[i].className;
            if (tempClassName && tempClassName.includes(className)) {
                target = children[i];
                break;
            }
            if (children[i].childElementCount) {
                return deepTraversal(children[i], className);
            }
        }
    }
    return target;
};
export default class DragWrapper extends React.Component {
    constructor() {
        super(...arguments);
        this.getCurrentNode = () => {
            this.curNode = ReactDOM.findDOMNode(this.ref);
        };
        /** 根据类名获取祖先dom */
        this.findDomByClassName = (className) => {
            // 向下
            if (this.curNode && this.curNode instanceof HTMLElement) {
                const target = deepTraversal(this.curNode, className);
                if (target) {
                    return target;
                }
            }
            // 向上
            if (this.curNode && this.curNode instanceof HTMLElement) {
                let node = this.curNode ? this.curNode.parentElement : this.curNode;
                while (node) {
                    const tempClassName = node.className;
                    if (tempClassName && tempClassName.includes(className)) {
                        return node;
                    }
                    node = node.parentElement;
                }
            }
            return null;
        };
        this.updateTransform = (transformStr) => {
            if (this.modalDom && this.modalDom instanceof HTMLElement) {
                const { style } = this.modalDom;
                style.transform = transformStr;
            }
        };
    }
    componentDidMount() {
        this.getCurrentNode();
        this.modalDom = this.findDomByClassName('ant-modal-content');
        this.container = ReactDOM.findDOMNode(this.ref);
    }
    render() {
        const { children } = this.props;
        if (children && children.type === Modal) {
            const { visible } = children.props;
            if (visible) {
                setTimeout(() => {
                    this.modalDom = this.findDomByClassName('ant-modal-content');
                    const { position = {} } = this.ref || {};
                    const { dx, dy } = position;
                    if (dx && dy) {
                        this.updateTransform(`translate(${dx}px,${dy}px)`);
                    }
                }, 0);
            }
            const node = cloneElement(React.Children.only(children), {
                getContainer: () => this.container,
            });
            return (<DragM ref={(inst) => {
                this.ref = inst;
            }} updateTransform={this.updateTransform}>
          <div>{node}</div>
        </DragM>);
        }
        return (<DragM ref={(inst) => {
            this.ref = inst;
        }} updateTransform={this.updateTransform}>
        <div>{children}</div>
      </DragM>);
    }
}
