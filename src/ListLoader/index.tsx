import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';

export interface LoadProps {
  spinning: boolean;
  className?: string;
  style?: React.CSSProperties;
}

class ListLoader extends PureComponent<LoadProps, any> {
  static defaultProps = {
    spinning: true,
  };

  static propTypes = {
    spinning: PropTypes.bool,
    className: PropTypes.string,
  };

  render() {
    const { spinning, className = '', style } = this.props;
    return (
      <div
        style={style}
        className={cls('seid-list-loader', 'spinning', className, { 'hidden': !spinning })}
      >
        <div />
        <div />
        <div />
      </div>
    );
  }
}

export default ListLoader;
