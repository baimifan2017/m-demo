/*
 * @Date:   2019-07-02 16:07:20
 * @Last Modified time: 2019-07-02 17:03:46
 */
import React, { Component } from 'react';
import Modal, { ModalProps } from 'antd/es/modal';
import DragWrapper from './DragWrapper';
import './style/index.less';

export interface IExtModalProps extends ModalProps {}

/**
 * 其他属性配置参考antd中的Modal组件
 */
export default class ExtModal extends Component<IExtModalProps, any> {
  static DragWrapper: typeof DragWrapper;

  render() {
    const { visible, title, ...rest } = this.props;
    if (!title) {
      return (
        <DragWrapper>
          <Modal {...this.props} />
        </DragWrapper>
      );
    }
    const DragTitle = (
      <DragWrapper>
        <>{title}</>
      </DragWrapper>
    );
    return <Modal visible={visible} title={DragTitle} {...rest} />;
  }
}

ExtModal.DragWrapper = DragWrapper;
