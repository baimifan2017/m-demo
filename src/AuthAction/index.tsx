import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { authAction } from '../utils';

export interface IAuthAction {
  key: string;
  ignore: boolean;
  children: React.ReactNode;
}

class AuthAction extends PureComponent<IAuthAction, any> {
  static defaultProps = {
    ignore: false,
  };

  static propTypes = {
    key: PropTypes.string.isRequired,
    ignore: PropTypes.bool,
    children: PropTypes.any.isRequired,
  };

  render() {
    const { children, ...rest } = this.props;
    return <>{authAction(rest) ? children : null}</>;
  }
}

export default AuthAction;
