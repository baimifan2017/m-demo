import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import omit from 'omit.js';
import AntdIcon  from 'antd/es/icon';
import ToolTip, { TooltipProps } from 'antd/es/tooltip';
import icons from './iconfont';
import  './style/index.less';
import  './style/animate.less';

export interface IExtIconProps {
  antd: boolean;
  font: string;
  type: string;
  tooltip?: TooltipProps;
  disabled: boolean;
  onClick?: () => any;
  spin?: boolean;
  prefixCls?: string
  className?:string
}

// eslint-disable-next-line react/prefer-stateless-function
class ExtIcon extends Component<IExtIconProps, any> {
  static propTypes = {
    prefixCls: PropTypes.string,
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    font: PropTypes.string,
    antd: PropTypes.bool,
    spin: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    prefixCls: 'seid-icon',
    className: '',
    font: 'seid-font',
    antd: false,
    spin: false,
    disabled: false,
  };

  constructor(props: IExtIconProps) {
    super(props);
    icons.initIcon();
  }

  renderIcon = () => {
    const { font, antd, type, spin, prefixCls, disabled, className, ...restProps } = this.props;
    const cn = {
      click: Boolean(restProps.onClick),
      disabled,
    };
    if (disabled) {
      restProps.onClick = () => {
      };
    }
    const iconType = type && `${type.startsWith('#') ? type.replace(/#/, '') : type}`;
    const iconProps = omit(restProps, ['tooltip']);
    return antd ? (
      <AntdIcon type={type} className={cls(className, cn)} spin={spin} {...iconProps} />
    ) : (
      <i className={cls(prefixCls, { spin }, cn, className)} {...iconProps}>
        <svg className='svg-icon' aria-hidden='true' style={{display:'block',height:'1em',width:'1em'}}>
          <use xlinkHref={`#${font}-${iconType}`} />
        </svg>
      </i>
    );
  };

  render() {
    const { tooltip } = this.props;
    if (tooltip) {
      return <ToolTip {...tooltip}>{this.renderIcon()}</ToolTip>;
    }
    return this.renderIcon();
  }
}

export default ExtIcon;
