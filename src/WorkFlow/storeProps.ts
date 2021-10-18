/*
 * @Date: 2020-02-17 17:25:19
 * @Last Modified time: 2020-02-17 17:25:19
 */
import { Method } from 'axios';

export default interface StoreProps {
  /** 数据请求参数 */
  params?: object;
  /** 数据请求类型 */
  type: Method;
  /** 接口地址 */
  url: string;
  /** 服务接口基地址 */
  serviceHost?: string;
  /** 服务网关名 */
  gateway?: string;
}
