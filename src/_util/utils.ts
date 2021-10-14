import isNaN from 'lodash/isNaN';
import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';

export function rounding(
  src: string | number | null,
  precision: number = 2,
): string | undefined {
  if (isUndefined(src) || src === null) return;
  const num: number = parseFloat(src.toString());
  if (isNaN(num)) return;
  const result: number = Math.round(num * 10 ** precision) / 10 ** precision;
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

export function isEmpty(value?: any) {
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

export function isNotEmpty(value?: any) {
  return !isEmpty(value);
}

export function getRowIdentity(row: Object, rowKey: any): any {
  if (typeof rowKey === 'string') {
    return get(row, rowKey);
  }
  if (typeof rowKey === 'function') {
    return rowKey(row);
  }
}

export function loadScript(src: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export const convertSearchFilter = (params: {
  quickSearchProperties: string[];
  pageInfo: { page: number; rows: number };
  quickValue?: string;
  [key: string]: any;
}) => {
  const {
    quickSearchProperties = ['code', 'name'],
    pageInfo = { page: 1, rows: 15 },
    ...search
  } = params || {};
  const keys = Object.keys(search);
  const quickSearchValue = keys.includes('quickValue') ? search.quickValue : '';
  const filtersKeys = keys.filter(item => item.includes('Q_'));
  const filters = filtersKeys.map(item => {
    const itemArr = item.split('_'); // Q_EQ_id_String
    return {
      operator: itemArr.length >= 2 ? itemArr[1] : 'EQ', // 操作类型
      fieldName: itemArr.length >= 3 ? itemArr[2] : '', // 筛选字段
      fieldType: itemArr.length >= 4 ? itemArr[3] : 'String', // 筛选类型
      value: search[item], // 筛选值
    };
  });
  const sortOrdersKeys = keys.filter(item => item.includes('S_'));
  const sortOrders = sortOrdersKeys.map(item => {
    const itemArr = item.split('_'); // S_id
    return {
      property: itemArr.length >= 2 ? itemArr[1] : '', // 排序字段
      direction: search[item], // 排序类型 ASC DESC
    };
  });
  const otherParams: {
    [key: string]: any;
  } = {};
  keys.filter(key => {
    // const bool = !key.includes('Q_') && !key.includes('S_') && !key.includes('quickValue');
    otherParams[key] = search[key];
    return true;
  });

  return {
    quickSearchProperties,
    quickSearchValue,
    filters,
    sortOrders,
    pageInfo,
    ...otherParams,
  };
};

/*
 * 解析url 判断当前文件是否为图片
 * @param {[string]} url [文件地址]
 */
export function isPhoto(url: string) {
  url = url || '';
  return (
    url.toLowerCase().includes('png') ||
    url.toLowerCase().includes('jpg') ||
    url.toLowerCase().includes('gif') ||
    url.toLowerCase().includes('jpeg')
  );
}

export function getString(value: any): string | undefined {
  if (value) {
    if (value.toString) {
      return value.toString();
    }
    return `${value}`;
  }
  return value;
}

export function compare(
  name: string,
  direction: string = 'asc',
  minor?: (a: any, b: any) => number,
): (a: any, b: any) => number {
  return function(o: any, p: any): number {
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
