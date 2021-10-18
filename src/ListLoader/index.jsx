import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
class ListLoader extends PureComponent {
    render() {
        const { spinning, className = '', style } = this.props;
        return (<div style={style} className={cls('seid-list-loader', 'spinning', className, { 'hidden': !spinning })}>
        <div />
        <div />
        <div />
      </div>);
    }
}
ListLoader.defaultProps = {
    spinning: true,
};
ListLoader.propTypes = {
    spinning: PropTypes.bool,
    className: PropTypes.string,
};
export default ListLoader;
