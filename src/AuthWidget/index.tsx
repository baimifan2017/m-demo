import React, { PropsWithChildren } from 'react';
import { storage, constants } from '../utils';

export interface IAuthProps {
  authCode?: string;
  authorities?: string[];
}

function AuthWidget<T = PropsWithChildren<any>>(
  WrappedComponent: React.ComponentType,
): React.ComponentClass<T & IAuthProps> {
  class Widget extends React.Component<T & IAuthProps, any> {
    constructor(props: T & IAuthProps) {
      super(props);
      this.state = {};
    }

    render(): React.ReactNode {
      const { authCode, authorities, ...props } = this.props;
      if (process.env.NODE_ENV === 'development') {
        return <WrappedComponent {...props} />;
      }
      if (!authCode) {
        return <WrappedComponent {...props} />;
      }
      if (authorities && authCode) {
        if (authorities.includes(authCode as string)) {
          return <WrappedComponent {...props} />;
        }
        return null;
      }
      const authList: string | null = storage.sessionStorage.get(
        constants.CONST_GLOBAL.FEATURE_KEY,
      );
      if (authList && authList.includes(authCode as string)) {
        return <WrappedComponent {...props} />;
      }
      return null;
    }
  }
  return Widget;
}

export default AuthWidget;
