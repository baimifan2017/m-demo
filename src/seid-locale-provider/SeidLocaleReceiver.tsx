import * as React from 'react';
import * as PropTypes from 'prop-types';
import defaultLocaleData from './default';
import seidLocaleData from './seidLocale';

export interface LocaleReceiverProps {
  componentName?: string;
  defaultLocale?: object | Function;
  children: (
    locale: object,
    localeCode?: string,
    fullLocale?: object,
  ) => React.ReactNode;
}

interface LocaleInterface {
  [key: string]: any;
}

export interface LocaleReceiverContext {
  antLocale?: LocaleInterface;
}

export default class SeidLocaleReceiver extends React.Component<
  LocaleReceiverProps
> {
  static defaultProps = {
    componentName: 'global',
  };

  static contextTypes = {
    antLocale: PropTypes.object,
  };

  context: LocaleReceiverContext;

  getLocale() {
    const { componentName, defaultLocale } = this.props;
    const locale: object | Function =
      defaultLocale ||
      (defaultLocaleData as LocaleInterface)[componentName || 'global'];
    const { antLocale } = this.context;
    if (antLocale) {
      const { locale: localeCode = 'zh-cn' } = antLocale;
      const localeFromContext =
        componentName && seidLocaleData
          ? seidLocaleData[localeCode][componentName]
          : {};
      return {
        ...(typeof locale === 'function' ? locale() : locale),
        // @ts-ignore
        ...(localeFromContext || {}),
      };
    }
    return {
      ...(typeof locale === 'function' ? locale() : locale),
    };
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
