var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import omit from 'omit.js';
import AntdIcon from 'antd/es/icon';
import ToolTip from 'antd/es/tooltip';
import icons from './iconfont';
// eslint-disable-next-line react/prefer-stateless-function
class ExtIcon extends Component {
    constructor(props) {
        super(props);
        this.renderIcon = () => {
            const _a = this.props, { font, antd, type, spin, prefixCls, disabled, className } = _a, restProps = __rest(_a, ["font", "antd", "type", "spin", "prefixCls", "disabled", "className"]);
            const cn = {
                click: Boolean(restProps.onClick),
                disabled,
            };
            if (disabled) {
                restProps.onClick = () => { };
            }
            const iconType = type && `${type.startsWith('#') ? type.replace(/#/, '') : type}`;
            const iconProps = omit(restProps, ['tooltip']);
            return antd ? (<AntdIcon type={type} className={cls(className, cn)} spin={spin} {...iconProps}/>) : (<i className={cls(prefixCls, { spin }, cn, className)} {...iconProps}>
        <svg className="svg-icon" aria-hidden="true">
          <use xlinkHref={`#${font}-${iconType}`}/>
        </svg>
      </i>);
        };
        icons.initIcon();
    }
    render() {
        const { tooltip } = this.props;
        if (tooltip) {
            return <ToolTip {...tooltip}>{this.renderIcon()}</ToolTip>;
        }
        return this.renderIcon();
    }
}
ExtIcon.propTypes = {
    prefixCls: PropTypes.string,
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    font: PropTypes.string,
    antd: PropTypes.bool,
    spin: PropTypes.bool,
    disabled: PropTypes.bool,
};
ExtIcon.defaultProps = {
    prefixCls: 'seid-icon',
    className: '',
    font: 'seid-font',
    antd: false,
    spin: false,
    disabled: false,
};
export default ExtIcon;
