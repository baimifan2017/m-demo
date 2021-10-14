export type StorageType = 'localStorage' | 'sessionStorage';

export const mergeKey = (key: string, prefix?: string) => {
  return `${prefix || 'seid'}_${key}`;
};

const getCacheHelper = (storageType: StorageType) => ({
  /** base64加密存储 */
  set(key: string, data: any) {
    const kvStr = JSON.stringify(data);
    const kv = window.btoa(window.encodeURIComponent(kvStr));
    window[storageType].setItem(key, kv);
  },
  setWithPrefix(key: string, data: any, prefix?: string) {
    const kvStr = JSON.stringify(data);
    const kv = window.btoa(window.encodeURIComponent(kvStr));
    window[storageType].setItem(mergeKey(key, prefix), kv);
  },
  /** 解密取出 */
  get(key: string) {
    const kv = window[storageType].getItem(key);
    if (kv) {
      try {
        return JSON.parse(window.decodeURIComponent(window.atob(kv)));
      } catch (e) {
        return JSON.parse(kv);
      }
    }
    return null;
  },
  getWithPrefix(key: string, prefix?: string) {
    const kv = window[storageType].getItem(mergeKey(key, prefix));
    if (kv) {
      try {
        return JSON.parse(window.decodeURIComponent(window.atob(kv)));
      } catch (e) {
        return JSON.parse(kv);
      }
    }
    return null;
  },
  /** 非加密存储 */
  setNative(key: string, data: any) {
    const kvStr = JSON.stringify(data);
    window[storageType].setItem(key, kvStr);
  },
  setNativeWithPrefix(key: string, data: any, prefix?: string) {
    const kvStr = JSON.stringify(data);
    window[storageType].setItem(mergeKey(key, prefix), kvStr);
  },
  /** 取值 */
  getNative(key: string) {
    const kv = window[storageType].getItem(key);
    if (kv) {
      try {
        return JSON.parse(kv);
      } catch (e) {
        return kv;
      }
    }
    return null;
  },
  getNativeWithPrefix(key: string, prefix?: string) {
    const kv = window[storageType].getItem(mergeKey(key, prefix));
    if (kv) {
      try {
        return JSON.parse(kv);
      } catch (e) {
        return kv;
      }
    }
    return null;
  },
  clear(key?: string | string[]) {
    if (key) {
      if (Array.isArray(key)) {
        key.forEach(k => {
          window[storageType].removeItem(k);
        });
      } else {
        window[storageType].removeItem(key);
      }
    } else {
      window[storageType].clear();
    }
  },
  clearWithPrefix(key?: string | string[], prefix?: string) {
    if (key) {
      if (Array.isArray(key)) {
        key.forEach(k => {
          const keyTmp = mergeKey(k, prefix);
          window[storageType].removeItem(keyTmp);
        });
      } else {
        const keyTmp = mergeKey(key, prefix);
        window[storageType].removeItem(keyTmp);
      }
    } else {
      window[storageType].clear();
    }
  },
});

export default {
  localStorage: getCacheHelper('localStorage'),
  sessionStorage: getCacheHelper('sessionStorage'),
};
