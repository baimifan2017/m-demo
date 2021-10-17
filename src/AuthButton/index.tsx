import * as React from 'react';
import Button, { ButtonProps } from 'antd/es/button';
import AuthWidget from '../auth-widget';

class AButton extends React.Component<ButtonProps, any> {
  constructor(props: ButtonProps) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    return <Button {...this.props} />;
  }
}

export default AuthWidget<ButtonProps>(AButton);
