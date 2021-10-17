var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import cssAnimate, { isCssAnimationSupported } from 'css-animation';
import cx from 'classnames';
import omit from 'omit.js';
class Animate extends PureComponent {
    constructor() {
        super(...arguments);
        this.animate = (type, callback) => {
            const node = ReactDOM.findDOMNode(this);
            if (isCssAnimationSupported && type) {
                cssAnimate(node, type, callback);
            }
            else if (!isCssAnimationSupported) {
                // eslint-disable-next-line no-console
                console.warn('不支持css动画');
            }
        };
    }
    componentDidMount() {
        const { type, callback } = this.props;
        this.animate(type, callback);
    }
    componentDidUpdate() {
        const { type, callback } = this.props;
        this.animate(type, callback);
    }
    render() {
        const _a = this.props, { className, children, delay, duration, style } = _a, otherProps = __rest(_a, ["className", "children", "delay", "duration", "style"]);
        const cn = cx('animated', className);
        const _style = Object.assign({}, (style || {}));
        if (duration) {
            _style.animationDuration = `${duration}ms`;
            _style.WebkitAnimationDuration = `${duration}ms`;
        }
        if (delay) {
            _style.animationDelay = `${delay}ms`;
            _style.WebkitAnimationDelay = `${delay}ms`;
        }
        const divProps = omit(otherProps, ['type', 'callback', 'delay', 'duration']);
        return (<div className={cn} {...divProps} style={_style}>
        {children}
      </div>);
    }
}
Animate.propTypes = {
    type: PropTypes.string,
    callback: PropTypes.func,
    duration: PropTypes.number,
    delay: PropTypes.number,
};
export default Animate;
