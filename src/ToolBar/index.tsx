import React, { Component, CSSProperties, ReactNode } from 'react';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Button from 'antd/es/button';
import Popover from 'antd/es/popover';
// @ts-ignore
import debounce from 'lodash/debounce';
import cls from 'classnames';
import ExtIcon from '../ExtIcon';
import { ISize } from '../ResizeMe';
import ResizeCol from './ResizeCol';
import './style/index.less'

export interface IToolBarProps {
  /**
   * zh-CN: 左边内容，可传入按钮参数数组
   * en-US: Left Content. Receive Array of Button Props
   */
  left: ReactNode;
  /**
   *  zh-CN: 右边内容
   *  en-US: Right Content.
   */
  right: ReactNode;
  /**
   * zh-CN: 占比，根据栅栏配置
   * en-US: radio
   */
  layout?: {
    leftSpan?: number;
    rightSpan?: number;
  };
  /**
   * zh-CN: 样式作用于Row
   */
  style?: CSSProperties;
  /**
   * zh-CN: class作用于Row
   */
  className?: string;
  /**
   * zh-CN: 样式作用于左边区域
   */
  leftStyle?: CSSProperties;
  /**
   * zh-CN: 样式作用于右边区域
   */
  rightStyle?: CSSProperties;
  /**
   * zh-CN: class作用于左边区域
   */
  leftClassName?: string;
  /**
   * zh-CN: class作用于右边区域
   */
  rightClassName?: string;
  extra?: ReactNode;
}

declare interface IToolBarState {
  showLeft?: boolean;
  showRight?: boolean;
}

/**
 * 工具栏,监听宽度改变展示效果
 */
class ToolBar extends Component<IToolBarProps, IToolBarState> {
  static defaultProps: IToolBarProps = {
    layout: {
      leftSpan: 12,
      rightSpan: 12,
    },
    left: null,
    right: null,
  };

  leftCol: any;

  rightCol: any;

  leftNode: HTMLDivElement | null | undefined;

  rightNode: HTMLDivElement | null | undefined;

  leftWidth: number = 0;

  rightWidth: number = 0;

  state = {
    showLeft: true,
    showRight: true,
  };

  constructor(props: IToolBarProps) {
    super(props);
    this.calcLeftDom = debounce(this.calcLeftDom, 500);
    this.calcRightDom = debounce(this.calcRightDom, 500);
  }

  calcLeftDom = (size: ISize) => {
    const newState: IToolBarState = {};
    const { showLeft } = this.state;
    const { leftNode } = this;
    const { width } = size;
    if (leftNode) {
      if (showLeft && this.leftWidth !== leftNode.offsetWidth) {
        this.leftWidth = leftNode.offsetWidth;
        newState.showLeft = Math.floor(leftNode.offsetWidth) <= Math.ceil(width);
      } else {
        newState.showLeft = Math.floor(this.leftWidth) <= Math.ceil(width);
      }
    }
    this.setState(newState);
  };

  calcRightDom = (size: ISize) => {
    const newState: IToolBarState = {};
    const { showRight } = this.state;
    const { rightNode } = this;
    const { width } = size;
    if (rightNode) {
      if (showRight && this.rightWidth !== rightNode.offsetWidth) {
        this.rightWidth = rightNode.offsetWidth;
        newState.showRight = Math.floor(rightNode.offsetWidth) <= Math.ceil(width);
      } else {
        newState.showRight = Math.floor(this.rightWidth) <= Math.ceil(width);
      }
    }
    this.setState(newState);
  };

  getLayout = () => {
    const { layout = {} } = this.props;
    const { leftSpan = 12, rightSpan = 12 } = layout;
    return {
      leftSpan,
      rightSpan,
    };
  };

  getLeftComponent = () => {
    const { left } = this.props;
    return left;
  };

  getRightComponent = () => {
    const { right, extra } = this.props;
    return (
      <>
        {right}
        {extra}
      </>
    );
  };

  render() {
    const {
      style,
      className,
      rightClassName,
      rightStyle,
      leftClassName,
      leftStyle,
      left,
      right,
    } = this.props;
    const { showLeft, showRight } = this.state;
    const { leftSpan, rightSpan } = this.getLayout();
    if (!left && !right) return null;
    // @ts-ignore
    return (
      <Row
        style={style}
        className={cls(className, 'seid-tool-bar')}
        type="flex"
        justify="space-between"
        align="middle"
      >
        <Col
          ref={node => (this.leftCol = node)}
          className={cls('tool-box', 'tool-box-left', leftClassName)}
          style={leftStyle}
          span={leftSpan}
        >
          <ResizeCol onResizeMe={this.calcLeftDom}>
            <div
              className="left-box"
              style={{
                display: showLeft ? 'inline-block' : 'none',
                whiteSpace: 'nowrap',
              }}
              ref={node => (this.leftNode = node)}
            >
              {this.getLeftComponent()}
            </div>
            {!showLeft && (
              <Popover
                overlayClassName="seid-float-tool-bar-left"
                placement="bottomRight"
                content={this.getLeftComponent()}
              >
                <Button style={{ float: 'left' }}>
                  <ExtIcon type="double-right" antd />
                </Button>
              </Popover>
            )}
          </ResizeCol>
        </Col>
        <Col
          className={cls('tool-box', 'tool-box-right', rightClassName)}
          style={rightStyle}
          span={rightSpan}
        >
          <ResizeCol onResizeMe={this.calcRightDom}>
            <div
              className="right-box"
              style={{
                display: showRight ? 'inline-block' : 'none',
                whiteSpace: 'nowrap',
              }}
              ref={node => (this.rightNode = node)}
            >
              {this.getRightComponent()}
            </div>
            {!showRight && (
              <Popover
                overlayClassName="seid-float-tool-bar-right"
                placement="bottomRight"
                content={this.getRightComponent()}
              >
                <Button style={{ float: 'right' }}>
                  <ExtIcon type="double-left" antd />
                </Button>
              </Popover>
            )}
          </ResizeCol>
        </Col>
      </Row>
    );
  }
}

export default ToolBar;
