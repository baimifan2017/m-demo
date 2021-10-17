import * as React from 'react';
import Button from 'antd/es/button';
import AuthWidget from '../auth-widget';
class AButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return <Button {...this.props}/>;
    }
}
export default AuthWidget(AButton);
