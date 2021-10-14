import message from 'antd/es/message';
import 'antd/es/message/style';
import { isNotEmpty, loadScript } from '../_util/utils';
let lessLoaded = false;
/**
 * 设置页面的主题
 * @param obj
 * @param func
 * @param set
 */
export const setThemes = (obj, func, set = true) => {
  const changeColor = () => {
    window.less.modifyVars(Object.assign({}, obj)).then(() => {
      if (set) {
        message.destroy(); // 过快弹出多个
        message.success('预览主题成功.');
      }
      if (func) {
        func();
      }
    });
  };
  const lessUrl =
    'https://gw.alipayobjects.com/os/es/less.js/3.8.1/less.min.js';
  if (lessLoaded) {
    changeColor();
  } else {
    window.less = {
      async: true,
      javascriptEnabled: true,
    };
    loadScript(lessUrl).then(() => {
      lessLoaded = true;
      changeColor();
    });
  }
};
/**
 * 解析页面的主题
 * @param str
 * @return {any}
 */
export const parseThemes = str => {
  let obj = {};
  if (isNotEmpty(str)) {
    try {
      obj = JSON.parse(
        str
          .replace('@header', '@head-back_color')
          .replace('@sider', '@sider-back_color')
          .replace('@font', '@sider-select_color')
          .replace('@button', '@select-color')
          .replace('@table', '@table_header_color'),
      );
    } catch (e) {
      console.error(e.message);
    }
  }
  return obj;
};
export default {
  setThemes,
  parseThemes,
};
