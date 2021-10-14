export default interface Reader {
  /**
   * zh-CN: 截取的数据节点
   * en-US: data node
   */
  data?: string;
  /**
   * zh-CN: ComboGrid属性field映射,属性名必须一一对应
   * en-US: display property name
   */
  field?: string[];
  /**
   * zh-CN: 显示的属性名
   * en-US: display property name
   */
  name: string;
}
