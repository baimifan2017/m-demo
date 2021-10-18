import { Method } from 'axios';

export default interface StoreProps {
  /**
   * zh-CN: 数据请求参数
   * en-US: request params
   */
  params?: object;
  /**
   * zh-CN: 数据请求类型
   * en-US: Data request method
   */
  type: Method;
  /**
   * zh-CN: 接口地址
   * en-US: interface address
   */
  url: string;
}
