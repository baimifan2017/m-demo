// @ts-ignore
import { isFinite, isNaN, isPlainObject } from 'lodash';
import pathToRegexp, { Path } from 'path-to-regexp';
// @ts-ignore
import * as Scroll from 'react-scroll';
// @ts-ignore
import { v4 as uuid } from 'uuid';
import { isNotEmpty } from '../_util/utils';
import request from './request';
import constants from './constants';
import storage from './storage';
import ThemeUtils from './themeUtils';
import dvaModel from './model';

const scroller = Scroll.scroller;

export { default as ThemeUtils } from './themeUtils';
export { default as storage } from './storage';
export { default as constants } from './constants';
export { default as request } from './request';

const findRootParentIds = (data: any, levelParam: string) => {
  const rootParentIds: string[] = [];
  let minLevel = 0;
  let isFirst = true;
  for (const item of data) {
    const levelData = parseInt(item[levelParam], 10);
    if (isNaN(levelData)) {
      // pass
      // continue;
    } else if (isFirst) {
      minLevel = levelData;
      isFirst = false;
    } else if (minLevel > levelData) {
      minLevel = levelData;
    }
  }
  if (isNotEmpty(minLevel)) {
    const dataByMinLevel = data.filter(
      (item: any) =>
        item[levelParam] && parseInt(item[levelParam], 10) === minLevel,
    );
    for (const dataItem of dataByMinLevel) {
      const { parentId } = dataItem;
      if (parentId && !rootParentIds.includes(parentId)) {
        rootParentIds.push(parentId);
      }
    }
  }
  return rootParentIds;
};

/**
 * 通用将平级JSON数组转嵌套
 * @param {*} data
 * @param {*} parentId
 * @param {*} subParam
 * @param {*} dataId
 */
export const setCommonJsonArrayNest = (
  data: any,
  parentId = '0',
  subParam = 'subMenu',
  dataId = 'menuId',
) => {
  const result: any[] = [];
  let temp;
  if (data) {
    data.forEach((json: any) => {
      if (json.parentId === parentId) {
        temp = setCommonJsonArrayNest(data, json[dataId], subParam, dataId);
        if (isNotEmpty(temp)) {
          json[subParam] = temp;
        }
        result.push(json);
      }
    });
  }
  return result;
};

/**
 * 获取Pane包含的数据
 * @param {*} key 编号，一般对应Menu的Key
 * @param {*} title 标题，一般对应Menu的名称
 * @param {*} content 内容
 * @param {*} isWebDefault 是否网站首页
 * @param {*} url 菜单链接地址
 * @param {*} closable 是否可关闭
 * @param {*} isMenu 是否菜单页面
 * @param {*} refKey 来源Key值
 * @param {*} isExternal 是否为外部http|https地址
 */
export const getTabPaneData = ({
                                 key,
                                 title,
                                 content,
                                 url = '',
                                 isWebDefault = false,
                                 closable = false,
                                 isMenu = true,
                                 refKey = '',
                                 isExternal = false,
                               }: any): any => ({
  key,
  title,
  content,
  url,
  isWebDefault,
  closable,
  isMenu,
  refKey,
  isExternal,
});

/**
 * 解析页面的主题
 * @param str
 * @return {any}
 */
export const parseThemes = (str: string): any => {
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
      // empty
    }
  }
  return obj;
};

export const convertListToTreeJson = (
  data: any,
  subParam = 'subMenu',
  dataId = 'menuId',
  leveParam = 'menuLevel',
) => {
  const result = [];
  if (data) {
    const rootParentIds = findRootParentIds(data, leveParam);
    if (rootParentIds.length > 0) {
      for (const rootParentId of rootParentIds) {
        const tempResultArray = setCommonJsonArrayNest(
          data,
          rootParentId,
          subParam,
          dataId,
        );
        for (const tempResult of tempResultArray) {
          result.push(tempResult);
        }
      }
    }
  }
  return result;
};

export function downloadFileByALink(url: string, saveName?: string) {
  const aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  let event: MouseEvent;
  if (window.MouseEvent) {
    event = new MouseEvent('click');
  } else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null,
    );
  }
  aLink.dispatchEvent(event);
}

export function objectAssignHave(o: any, c: any) {
  if (o && c && typeof c === 'object') {
    for (const p in o) {
      if (c[p] !== undefined && c[p] !== null) o[p] = c[p];
    }
  }
  return o;
}

export function objectAssignAppend(o: any, c: any) {
  if (o && c && typeof c === 'object') {
    for (const p in c) {
      if (!o[p]) {
        o[p] = c[p];
      }
    }
  }
  return o;
}

export function formatMsg(message: string, values: object) {
  const isValidKey = (key: string, obj: { [index: string]: any }): string => {
    if (obj[key] !== null && obj[key] !== undefined) {
      return obj[key];
    }
    return '';
  };

  if (message) {
    return message.replace(/\{(\w+)\}/g, (_k: string, v: string) =>
      isValidKey(v, values),
    );
  }

}

/**
 * flatTreeParams: 将树型结构数据转化成扁平化的数组结构
 */

export function getFlatTree(
  arr: Array<any>,
  treeNodeKey: string = 'children',
  result: Array<any> = [],
): Array<any> {
  if (arr && arr instanceof Array) {
    arr.forEach(item => {
      if (item[treeNodeKey]) {
        result.push({ ...item });
        getFlatTree(item[treeNodeKey], treeNodeKey, result);
      } else {
        result.push({ ...item });
      }
    });
  }
  return result;
}

export function getUUID() {
  return uuid();
}

export function pathMatchRegexp(regexp: Path, pathname: string) {
  const regExp: RegExp = pathToRegexp(regexp);
  return regExp.exec(pathname);
}

export function jsonToParams(obj: object) {
  try {
    if (isPlainObject(obj)) {
      const tempArr: string[] = [];
      Object.keys(obj).forEach(k => {
        const key = encodeURIComponent(k);
        const value = encodeURIComponent((obj as any)[k]);
        tempArr.push(`${key}=${value}`);
      });
      return tempArr.join('&');
    }
    return '';
  } catch (err) {
    return '';
  }
}

export function chineseAmount(amount: string | number) {
  let hasPrefix = false;
  // eslint-disable-next-line no-nested-ternary
  let money = isFinite(amount)
    ? amount
    : isNaN(Number(amount))
      ? 0
      : Number(amount);
  if (Number(money) < 0) {
    hasPrefix = true;
    money = -1 * Number(money);
  }
  const upperCaseMoney = String(Math.round(Number(money) * 100));
  let upperValue = '';
  const minus = '负';
  const String1 = '零壹贰叁肆伍陆柒捌玖';
  let String2 = '万仟佰拾亿仟佰拾万仟佰拾元角分';
  const len = upperCaseMoney.length;
  let Ch1;
  let Ch2;
  let nZero = 0;
  let String3;
  if (len > 15) {
    return '超出计算范围';
  }
  if (Number(upperCaseMoney) === 0) {
    upperValue = '零元整';
    return upperValue;
  }
  String2 = String2.substr(String2.length - len, len);
  for (let i = 0; i < len; i++) {
    String3 = parseInt(upperCaseMoney.substr(i, 1), 10);
    if (i !== len - 3 && i !== len - 7 && i !== len - 11 && i !== len - 15) {
      if (String3 === 0) {
        Ch1 = '';
        Ch2 = '';
        nZero += 1;
      } else if (String3 !== 0 && nZero !== 0) {
        Ch1 = String1.substr(String3, 1);
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      } else {
        Ch1 = String1.substr(String3, 1);
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      }
    } else {
      if (String3 !== 0 && nZero !== 0) {
        Ch1 = `零${String1.substr(String3, 1)}`;
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      } else if (String3 !== 0 && nZero === 0) {
        Ch1 = String1.substr(String3, 1);
        Ch2 = String2.substr(i, 1);
        nZero = 0;
      } else if (String3 === 0 && nZero >= 3) {
        Ch1 = '';
        Ch2 = '';
        nZero += 1;
      } else {
        Ch1 = '';
        Ch2 = String2.substr(i, 1);
        nZero += 1;
      }
      if (i === len - 11 || i === len - 3) {
        Ch2 = String2.substr(i, 1);
      }
    }
    upperValue = upperValue + Ch1 + Ch2;
  }

  if (String3 === 0) {
    upperValue += '整';
  }
  if (hasPrefix) {
    upperValue = minus + upperValue;
  }
  return upperValue;
}

function scrollToElement({
                           scrollBoxClassName = '',
                           targetId = '',
                           options = {},
                         }) {
  if (targetId) {
    let container = document.querySelector('div.order-scroll-bar');
    if (scrollBoxClassName) {
      container = document.querySelector(scrollBoxClassName);
    }
    const scrollOptions = {
      smooth: true,
      container,
    };
    Object.assign(scrollOptions, options);
    scroller.scrollTo(targetId, scrollOptions);
  }
}

export const getFileSize = (size?: number | undefined | string | null) => {
  if (size === null || size === '' || size === undefined) {
    return '0 Bytes';
  }
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;
  const srcsize = parseFloat(size.toString());
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  size = srcsize / 1024 ** index;
  size = size.toFixed(2);
  return size + unitArr[index];
};

export const authAction = (btn: any) => {
  let fmsAuth = storage.sessionStorage.get(constants.CONST_GLOBAL.AUTH) || [];
  if (isPlainObject(fmsAuth)) {
    const hashs = window.location.hash.split('#');
    fmsAuth = fmsAuth[hashs[1]] || [];
  }
  const policy = storage.sessionStorage.get(constants.CONST_GLOBAL.POLICY);
  if (
    policy === constants.AUTH_POLICY.ADMIN ||
    policy === constants.AUTH_POLICY.TENANT_ADMIN
  ) {
    return btn;
  }
  if (
    fmsAuth.indexOf(btn.key) > -1 ||
    btn.ignore ||
    (btn.props && (btn.props.ignore === 'true' || btn.props.ignore === true))
  ) {
    return btn;
  }
  return '';
};

export const setCursorPosition = (
  ctrl: HTMLInputElement | any,
  pos: number,
) => {
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  } else if (ctrl.createTextRange) {
    const range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
};

export default {
  getTabPaneData,
  parseThemes,
  convertListToTreeJson,
  downloadFileByALink,
  objectAssignAppend,
  objectAssignHave,
  formatMsg,
  getFlatTree,
  chineseAmount,
  getUUID,
  pathMatchRegexp,
  scrollToElement,
  jsonToParams,
  request,
  constants,
  storage,
  ThemeUtils,
  dvaModel,
  authAction,
  getFileSize,
};
