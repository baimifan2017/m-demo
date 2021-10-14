import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Locale as AntdLocale } from 'antd/es/locale-provider';
import ConfigProvider from 'antd/es/config-provider';
import antEn from 'antd/es/locale-provider/en_US';
import antZh from 'antd/es/locale-provider/zh_CN';

const antdLocales = {
  'en-US': antEn,
  'zh-CN': antZh,
};

type Locales = 'zh-CN' | 'en-US';

export interface Locale extends AntdLocale {
  Panel?: Object;
  AmountInput?: Object;
  Attachment?: Object;
  AuthorityDataTree?: Object;
  CronBuilder?: Object;
  ScopeDatePicker?: Object;
  ExtTable?: Object;
  StationNewsCard?: Object;
  ComboGrid?: Object;
}

export interface LocaleProviderProps {
  antdLocale: Locales;
  locale: Locale;
  children?: React.ReactNode;
}

class LocaleProvider extends React.Component<LocaleProviderProps, any> {
  static propTypes = {
    antdLocale: PropTypes.string,
    locale: PropTypes.object,
  };

  static defaultProps = {
    antdLocale: 'zh-CN',
    locale: {},
  };

  static childContextTypes = {
    antLocale: PropTypes.object,
  };

  getChildContext() {
    return {
      antLocale: {
        ...this.props.locale,
        exist: true,
      },
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

export default LocaleProvider;
