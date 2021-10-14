import { LocaleInterface } from '../locale';
import enUS from '../locale/en_US';
import zhCN from '../locale/zh_CN';

export default {
  'zh-cn': zhCN,
  en: enUS,
} as {
  [key: string]: LocaleInterface;
};
