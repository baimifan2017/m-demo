var __rest =
  (this && this.__rest) ||
  function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
  };
import isNaN from 'lodash/isNaN';
import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
export function rounding(src, precision = 2) {
  if (isUndefined(src) || src === null) return;
  const num = parseFloat(src.toString());
  if (isNaN(num)) return;
  const result =
    Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
  let s = result.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + precision) {
    s += '0';
  }
  return s;
}
export function isEmpty(value) {
  if (typeof value === 'undefined' || value === null || value === '')
    return true;
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    value === {} ||
    value === [] ||
    value.length === 0
  );
}
export function isNotEmpty(value) {
  return !isEmpty(value);
}
export function getRowIdentity(row, rowKey) {
  if (typeof rowKey === 'string') {
    return get(row, rowKey);
  }
  if (typeof rowKey === 'function') {
    return rowKey(row);
  }
}
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
export const convertSearchFilter = params => {
  const _a = params || {},
    {
      quickSearchProperties = ['code', 'name'],
      pageInfo = { page: 1, rows: 15 },
    } = _a,
    search = __rest(_a, ['quickSearchProperties', 'pageInfo']);
  const keys = Object.keys(search);
  const quickSearchValue = keys.includes('quickValue') ? search.quickValue : '';
  const filtersKeys = keys.filter(item => item.includes('Q_'));
  const filters = filtersKeys.map(item => {
    const itemArr = item.split('_'); // Q_EQ_id_String
    return {
      operator: itemArr.length >= 2 ? itemArr[1] : 'EQ',
      fieldName: itemArr.length >= 3 ? itemArr[2] : '',
      fieldType: itemArr.length >= 4 ? itemArr[3] : 'String',
      value: search[item],
    };
  });
  const sortOrdersKeys = keys.filter(item => item.includes('S_'));
  const sortOrders = sortOrdersKeys.map(item => {
    const itemArr = item.split('_'); // S_id
    return {
      property: itemArr.length >= 2 ? itemArr[1] : '',
      direction: search[item],
    };
  });
  const otherParams = {};
  keys.filter(key => {
    // const bool = !key.includes('Q_') && !key.includes('S_') && !key.includes('quickValue');
    otherParams[key] = search[key];
    return true;
  });
  return Object.assign(
    { quickSearchProperties, quickSearchValue, filters, sortOrders, pageInfo },
    otherParams,
  );
};
/*
 * 解析url 判断当前文件是否为图片
 * @param {[string]} url [文件地址]
 */
export function isPhoto(url) {
  url = url || '';
  return (
    url.toLowerCase().includes('png') ||
    url.toLowerCase().includes('jpg') ||
    url.toLowerCase().includes('gif') ||
    url.toLowerCase().includes('jpeg')
  );
}
export function getString(value) {
  if (value) {
    if (value.toString) {
      return value.toString();
    }
    return `${value}`;
  }
  return value;
}
export function compare(name, direction = 'asc', minor) {
  return function(o, p) {
    let a;
    let b;
    if (o && p && typeof o === 'object' && typeof p === 'object') {
      a = o[name];
      b = p[name];
      if (a === b) {
        return typeof minor === 'function' ? minor(o, p) : 0;
      }
      if (typeof a === typeof b) {
        if (direction === 'asc') {
          return a < b ? -1 : 1;
        }
        return a < b ? 1 : -1;
      }
      if (direction === 'asc') {
        return typeof a < typeof b ? -1 : 1;
      }
      return typeof a < typeof b ? 1 : -1;
    }
    throw new Error('error');
  };
}
