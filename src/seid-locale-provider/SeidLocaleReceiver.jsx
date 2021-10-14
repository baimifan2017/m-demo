import * as React from 'react';
import * as PropTypes from 'prop-types';
import defaultLocaleData from './default';
import seidLocaleData from './seidLocale';
export default class SeidLocaleReceiver extends React.Component {
  getLocale() {
    const { componentName, defaultLocale } = this.props;
    const locale =
      defaultLocale || defaultLocaleData[componentName || 'global'];
    const { antLocale } = this.context;
    if (antLocale) {
      const { locale: localeCode = 'zh-cn' } = antLocale;
      const localeFromContext =
        componentName && seidLocaleData
          ? seidLocaleData[localeCode][componentName]
          : {};
      return Object.assign(
        {},
        typeof locale === 'function' ? locale() : locale,
        localeFromContext || {},
      );
    }
    return Object.assign({}, typeof locale === 'function' ? locale() : locale);
  }
  getLocaleCode() {
    const { antLocale } = this.context;
    const localeCode = antLocale && antLocale.locale;
    // Had use LocaleProvide but didn't set locale
    if (antLocale && antLocale.exist && !localeCode) {
      return defaultLocaleData.locale;
    }
    return localeCode;
  }
  // changeLocaleCode = (/* localeCode: string */) => {
  // empty
  // };
  render() {
    const localeCode = this.getLocaleCode();
    // this.changeLocaleCode(localeCode);
    return this.props.children(
      this.getLocale(),
      localeCode,
      this.context.antLocale,
    );
  }
}
SeidLocaleReceiver.defaultProps = {
  componentName: 'global',
};
SeidLocaleReceiver.contextTypes = {
  antLocale: PropTypes.object,
};
