import React, { Component, CSSProperties, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { Popconfirm } from 'antd';
import isEqual from 'react-fast-compare';
import Animate from '../animate';
import ExtIcon from '../ExtIcon';
import ScrollBar from '../ScrollBar';
import ResizeMe, { Config, ISize } from '../ResizeMe';
import { getUUID } from '../utils';
import LocaleReceiver from '../seid-locale-provider/SeidLocaleReceiver';
import { LocaleItem } from '../locale';
import defaultLocale from './locale';
import './style/index.less'

export interface Size extends ISize {
  bodyWidth: number;
  bodyHeight: number;
}

export interface IChangeProps {
  collapse: boolean;
  expand: boolean;
}

export interface IPanelProps {
  bordered?: boolean;
  closable?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
  collapse?: boolean;
  expand?: boolean;
  isPortal: boolean;
  panelKey: string;
  onChange?: (changeProps: IChangeProps) => void;
  onRefresh?: () => void;
  onClose?: (panelKey: string) => void;
  width: string | number;
  height: string | number;
  autoHideToolbar?: boolean;
  showHeader?: boolean;
  showRefresh?: boolean;
  scroll?: boolean;
  showDrag?: boolean;
  cover?: boolean;
  size: Size;
  onResize?: (size: Size) => void;
}

class Panel extends Component<IPanelProps, any> {
  constructor(props: IPanelProps) {
    super(props);
    this.state = {
      collapse: false,
      expand: false,
      refresh: getUUID(),
      animationName: '',
      parentHeight: 0,
    };
  }

  protected panel: any;

  protected panelHead: any;

  protected panelBody: any;

  static defaultProps = {
    showRefresh: true,
    bordered: true,
    showHeader: true,
    closable: false,
    collapse: true,
    expand: true,
    showDrag: false,
    scroll: false,
    cover: false,
    isPortal: false,
    autoHideToolbar: false,
    width: '100%',
    height: 260,
  };

  static propTypes = {
    closable: PropTypes.bool,
    title: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  componentDidMount() {
    const { isPortal, size } = this.props;
    if (isPortal) {
      this.panel.addEventListener('mouseenter', this.setZIndex, false);
      this.panel.addEventListener('mouseleave', this.resetZIndex, false);
      this.setState({
        parentHeight: size.height,
      });
    }
  }

  componentDidUpdate(prevProps: IPanelProps) {
    if (!isEqual(prevProps.size, this.props.size)) {
      const { collapse } = this.state;
      const { size, onResize, isPortal } = this.props;
      if (!collapse && isPortal) {
        this.setState({
          parentHeight: size.height,
        });
      }
      if (onResize && onResize instanceof Function) {
        const newSize: Size = this.getSize();
        onResize(newSize);
      }
    }
  }

  componentWillUnmount() {
    const { isPortal } = this.props;
    if (isPortal) {
      this.panel.removeEventListener('mouseenter', this.setZIndex);
      this.panel.removeEventListener('mouseleave', this.resetZIndex);
    }
  }

  getSize = () => {
    const {
      height,
      width,
      borderLeftWidth,
      borderRightWidth,
      borderTopWidth,
      borderBottomWidth,
    } = getComputedStyle(this.panel);
    const { height: headHeight } = this.panelHead
      ? getComputedStyle(this.panelHead)
      : { height: '0' };
    const {
      paddingLeft: bodyPaddingLeft,
      paddingRight: bodyPaddingRight,
      paddingTop: bodyPaddingTop,
      paddingBottom: bodyPaddingBottom,
    } = getComputedStyle(this.panelBody);
    const newSize: Size = {
      width: parseInt(width, 10),
      bodyWidth: 0,
      height: parseInt(height, 10),
      bodyHeight: 0,
    };
    newSize.bodyWidth =
      parseInt(width, 10) -
      parseInt(bodyPaddingLeft, 10) -
      parseInt(bodyPaddingRight, 10) -
      parseInt(borderLeftWidth, 10) -
      parseInt(borderRightWidth, 10);
    newSize.bodyHeight =
      parseInt(height, 10) -
      parseInt(borderTopWidth, 10) -
      parseInt(borderBottomWidth, 10) -
      parseInt(headHeight, 10) -
      parseInt(bodyPaddingTop, 10) -
      parseInt(bodyPaddingBottom, 10);
    return newSize;
  };

  setZIndex = (e: MouseEvent) => {
    if (this.panel && this.panel.contains(e.target as HTMLDivElement)) {
      const tDom = ReactDOM.findDOMNode(this.panel);
      if (
        tDom &&
        tDom instanceof HTMLElement &&
        tDom.parentNode &&
        tDom.parentNode instanceof HTMLElement &&
        tDom.parentNode.parentNode &&
        tDom.parentNode.parentNode instanceof HTMLElement
      ) {
        tDom.parentNode.parentNode.style.zIndex = '20';
      }
    }
  };

  resetZIndex = () => {
    const tDom = ReactDOM.findDOMNode(this.panel);
    if (
      tDom &&
      tDom instanceof HTMLElement &&
      tDom.parentNode &&
      tDom.parentNode instanceof HTMLElement &&
      tDom.parentNode.parentNode &&
      tDom.parentNode.parentNode instanceof HTMLElement
    ) {
      tDom.parentNode.parentNode.style.zIndex = 'inherit';
    }
  };

  onExpand = () => {
    const { onChange, isPortal } = this.props;
    const { expand: originExpand } = this.state;
    const expand = !originExpand;
    this.setState({
      expand,
      collapse: false,
    });
    if (isPortal && this.panel) {
      const tDom = ReactDOM.findDOMNode(this.panel);
      if (
        tDom &&
        tDom instanceof HTMLElement &&
        tDom.parentNode &&
        tDom.parentNode instanceof HTMLElement &&
        tDom.parentNode.parentNode &&
        tDom.parentNode.parentNode instanceof HTMLElement
      ) {
        if (expand) {
          tDom.parentNode.parentNode.classList.add('expand');
        } else {
          tDom.parentNode.parentNode.classList.remove('expand');
        }
      }
    }
    if (onChange && onChange instanceof Function) {
      onChange({
        expand,
        collapse: false,
      });
    }
  };

  onCollapse = () => {
    const { onChange, isPortal } = this.props;
    const { parentHeight, collapse: originCollapse } = this.state;
    const collapse = !originCollapse;
    this.setState({
      collapse,
      expand: false,
    });
    if (onChange && onChange instanceof Function) {
      onChange({
        collapse,
        expand: false,
      });
    }
    if (isPortal && this.panel) {
      const tDom = ReactDOM.findDOMNode(this.panel);
      if (
        tDom &&
        tDom instanceof HTMLElement &&
        tDom.parentNode &&
        tDom.parentNode instanceof HTMLElement &&
        tDom.parentNode.parentNode &&
        tDom.parentNode.parentNode instanceof HTMLElement
      ) {
        if (collapse) {
          tDom.parentNode.parentNode.style.height = 'auto';
          tDom.parentNode.parentNode.classList.add('collapse');
        } else {
          tDom.parentNode.parentNode.style.height = `${parentHeight}px`;
          tDom.parentNode.parentNode.classList.remove('collapse');
        }
      }
    }
  };

  onRefresh = () => {
    const { onRefresh } = this.props;
    this.setState({
      refresh: getUUID(),
      animationName: 'fadeIn',
    });
    if (onRefresh && onRefresh instanceof Function) {
      onRefresh();
    }
  };

  onClose = () => {
    const { onClose, panelKey } = this.props;
    onClose && onClose(panelKey);
  };

  animateCallback = () => {
    this.setState({ animationName: '' });
  };

  renderBody = (): ReactNode => {
    const { children } = this.props;
    const { animationName, refresh } = this.state;
    return (
      <Animate
        className="panel-content"
        type={animationName}
        callback={() => this.animateCallback}
        key={refresh}
      >
        {children}
      </Animate>
    );
  };

  getToolBarBox = (locale: LocaleItem) => {
    const { expand, collapse } = this.state;
    const { expand: exp, collapse: copse, showRefresh } = this.props;
    const { closable } = this.props;
    return (
      <div className="toolbox">
        {showRefresh ? (
          <ExtIcon type="reload" className="tool-item loader" onClick={this.onRefresh} antd />
        ) : null}
        {exp ? (
          <ExtIcon
            type={`${expand ? 'panel-exit-full-screen' : 'panel-full-screen'}`}
            className="tool-item full-screen"
            onClick={this.onExpand}
          />
        ) : null}
        {copse && !expand ? (
          <ExtIcon
            type={`${collapse ? 'down-circle' : 'up-circle'}`}
            className="tool-item full-screen"
            antd
            onClick={this.onCollapse}
          />
        ) : null}
        {closable && !expand ? (
          <Popconfirm
            title={locale.closeConfirm}
            getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
            placement="bottom"
            onConfirm={() => this.onClose()}
          >
            <ExtIcon type="close" className="tool-item remove" antd />
          </Popconfirm>
        ) : null}
      </div>
    );
  };

  renderPanel = (locale: LocaleItem): ReactNode => {
    const { expand, collapse } = this.state;
    const {
      bordered,
      className,
      title,
      width,
      height,
      style,
      cover,
      showHeader,
      scroll,
      isPortal,
      autoHideToolbar,
      showDrag,
    } = this.props;
    const cn = cls(className, {
      'panel-bordered': bordered,
      'panel-full-screen': expand,
      'panel-collapsed': collapse,
      'auto-hide-toolbar': !expand && isPortal && autoHideToolbar,
      portal: isPortal,
      'no-drag': !showDrag && !expand,
      cover,
    });
    const styles: CSSProperties = {
      ...style,
      width,
    };
    const bodyStyles: CSSProperties = {};
    if (!expand) {
      if (collapse) {
        bodyStyles.height = 0;
        bodyStyles.maxHeight = 0;
      } else {
        bodyStyles.height = height;
        bodyStyles.maxHeight = height;
      }
    }
    if (isPortal) {
      bodyStyles.height = '100%';
      delete bodyStyles.maxHeight;
      styles.width = '100%';
      styles.height = '100%';
    }
    return (
      <div className={cls('seid-panel', cn)} ref={node => (this.panel = node)} style={styles}>
        {autoHideToolbar && showDrag && !expand ? (
          <ExtIcon type="drag" className="seid-drag-handler" />
        ) : null}
        {isPortal && autoHideToolbar && !expand ? this.getToolBarBox(locale) : null}
        {showHeader ? (
          <div className="panel-header" ref={node => (this.panelHead = node)}>
            {!autoHideToolbar && showDrag && !expand ? (
              <ExtIcon type="drag" className="seid-drag-handler" />
            ) : null}
            <div className="panel-header-title">{title}</div>
            {(isPortal && !autoHideToolbar) || expand || !isPortal
              ? this.getToolBarBox(locale)
              : null}
          </div>
        ) : null}
        <div className="panel-body" ref={node => (this.panelBody = node)} style={bodyStyles}>
          {scroll ? <ScrollBar>{this.renderBody()}</ScrollBar> : this.renderBody()}
        </div>
      </div>
    );
  };

  render(): ReactNode {
    return (
      <LocaleReceiver defaultLocale={defaultLocale} componentName="Panel">
        {/* @ts-ignore*/}
        {this.renderPanel}
      </LocaleReceiver>
    );
  }
}

export default ResizeMe({ refreshRate: 50 } as Config)(Panel);
