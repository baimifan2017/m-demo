/* eslint-disable prefer-promise-reject-errors */
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { constants, storage } from '.';

export { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';

export type CodeType = { [index: string]: any } | null;

const codeSuffix = '请稍后重试或联系管理员!';
export const codeMessage = {
  200: '请求成功.',
  201: '请求已创建.',
  202: '请求已经进入排队(异步任务)!',
  203: '请求为非标准认证!',
  204: '请求没有找到内容!',
  205: '请求已重置内容!',
  206: '请求包含部分内容!',
  400: '请求错误!服务器无法理解!',
  401: '请求未授权!需要身份安全认证!',
  403: `服务器拒绝请求!${codeSuffix}`,
  404: `请求资源未找到!${codeSuffix}`,
  405: '请求方法不允许!已被禁止!',
  406: '请求资源信息不可接受!',
  407: '请求要求代理身份安全认证!',
  408: '请求服务出现超时或异常!',
  409: '请求资源内容发生冲突!',
  410: '请求的资源被永久删除!',
  411: '请求资源所需长度不满足!',
  412: '请求执行过程预处理失败!',
  413: '请求实体过大!服务器无法处理!',
  414: '请求URL过长!服务器无法处理!',
  415: '请求不支持该传输的类型!',
  422: '请求在创建对象时验证错误!',
  500: `服务器内部出现错误!${codeSuffix}`,
  501: '服务不存在!服务器不支持!',
  502: `网关错误!无效的请求!${codeSuffix}`,
  503: `服务不可用!处于超载或系统维护!${codeSuffix}`,
  504: '网关超时!未及时获取请求!',
  505: 'HTTP版本协议不支持!',
  506: `服务器太忙!${codeSuffix}`,
};

export function isValidKey(
  key: string,
  obj: { [index: string]: any },
): CodeType {
  if (obj[key]) {
    return obj[key];
  }
  return null;
}

export interface ResponseResult extends AxiosResponse {
  success: boolean;
  message?: any;
  statusCode?: any;
  status?: any;
}

export interface RequestPromise<T = any> extends AxiosPromise<T> {}

/* 防止重复提交，利用axios的cancelToken */
let pending: any[] = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const CancelToken: any = axios.CancelToken;

const removePending: any = (config: any, f: any) => {
  // 获取请求的url
  const flagUrl = config.url;
  // 判断该请求是否在请求队列中
  if (pending.indexOf(flagUrl) !== -1) {
    // 如果在请求中，并存在f,f即axios提供的取消函数
    if (f) {
      f(constants.CANCEL_REQUEST_MESSAGE); // 执行取消操作
    } else {
      pending.splice(pending.indexOf(flagUrl), 1); // 把这条记录从数组中移除
    }
  } else if (f) {
    // 如果不存在在请求队列中，加入队列
    pending.push(flagUrl);
  }
};

/* 创建axios实例 */
const request = axios.create({
  timeout: 60000, // 请求超时时间
});

/* request拦截器 */
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const { method = 'get', headers } = config;
    const { needToken = true, neverCancel } = headers;

    // neverCancel 配置项，允许多个请求
    if (!neverCancel) {
      // 生成cancelToken
      config.cancelToken = new CancelToken((c: any) => {
        removePending(config, c);
      });
    }
    // cache control
    if (
      method.toLocaleLowerCase() === 'get' &&
      process.env.NODE_ENV === 'production'
    ) {
      const cacheControl = 'cache-control';
      const pragma = 'Pragma';
      config.headers[cacheControl] = 'no-cache';
      config.headers[pragma] = 'no-cache';
    }

    let tokenKey = constants.CONST_GLOBAL.OLD_TOKEN_KEY;
    // tokens SEI3.0验证方式
    let token = storage.sessionStorage.getNative(tokenKey);
    if (token) {
      token = token.accessToken;
    } else {
      tokenKey = constants.CONST_GLOBAL.TOKEN_KEY;
      token = storage.sessionStorage.get(tokenKey);
    }
    if (token && needToken) {
      config.headers[tokenKey] = token;
    }
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  },
);

/* response拦截器 */
request.interceptors.response.use(
  (response: ResponseResult) => {
    // 移除队列中的该请求，注意这时候没有传第二个参数f
    removePending(response.config);
    // 获取返回数据，并处理。按自己业务需求修改。
    const { statusText, status, data: restData, headers, config } = response;
    if (typeof restData === 'object') {
      /** 依赖后台接口响应返回作了特殊判断 */
      if (
        ('status' in restData &&
          restData.status &&
          restData.status !== 200 &&
          restData.status !== 'SUCCESS') ||
        ('success' in restData && !restData.success) ||
        ('successful' in restData && !restData.successful)
      ) {
        return Promise.resolve<ResponseResult>({
          success: false,
          message: restData.message || restData.msg || statusText,
          statusCode: restData.status || 600,
          data: restData.data || restData || null,
          status,
          statusText,
          headers,
          config,
        });
      }
    }
    return Promise.resolve<ResponseResult>({
      data: restData.data || restData || null,
      success: true,
      message: restData.message || restData.msg || statusText,
      statusCode: status,
      status,
      statusText,
      headers,
      config,
    });
  },
  (error: any) => {
    // 异常处理
    pending = [];
    const { response, message } = error;
    if (message === constants.CANCEL_REQUEST_MESSAGE) {
      return Promise.reject<ResponseResult>({
        message,
        success: false,
        data: null,
      });
    }
    let msg;
    let statusCode;
    if (response && response instanceof Object) {
      const { data: resData, statusText, status } = response;
      statusCode = status;
      msg = resData.message || statusText;
    } else {
      statusCode = 600;
      msg = message || 'Network Error';
    }
    return Promise.reject<ResponseResult>({
      success: false,
      statusCode,
      message: msg,
    });
  },
);

export default request;
