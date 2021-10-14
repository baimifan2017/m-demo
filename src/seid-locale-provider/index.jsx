import * as React from 'react';
import * as PropTypes from 'prop-types';
import ConfigProvider from 'antd/es/config-provider';
import antEn from 'antd/es/locale-provider/en_US';
import antZh from 'antd/es/locale-provider/zh_CN';
const antdLocales = {
  'en-US': antEn,
  'zh-CN': antZh,
};
class LocaleProvider extends React.Component {
  getChildContext() {
    return {
      antLocale: Object.assign({}, this.props.locale, { exist: true }),
    };
  }
  render() {
    const { children, antdLocale } = this.props;
    return (
      <ConfigProvider locale={antdLocales[antdLocale]}>
        {children}
      </ConfigProvider>
    );
  }
}
LocaleProvider.propTypes = {
  antdLocale: PropTypes.string,
  locale: PropTypes.object,
};
LocaleProvider.defaultProps = {
  antdLocale: 'zh-CN',
  locale: {},
};
LocaleProvider.childContextTypes = {
  antLocale: PropTypes.object,
};
export default LocaleProvider;
