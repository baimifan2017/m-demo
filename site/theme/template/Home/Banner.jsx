import React from 'react';
import { FormattedMessage } from 'react-intl';

class Banner extends React.PureComponent {
  static defaultProps = {
    className: 'banner',
  };

  render() {
    return (
      <div className="home-page-wrapper banner-wrapper" id="banner">
        <h1>
          <FormattedMessage id="app.home.title" />
        </h1>
        <p>
          <FormattedMessage id="app.home.slogan" />
        </p>
      </div>
    );
  }
}

export default Banner;
