import { CSSProperties } from 'react';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { PaginationProps } from 'antd/es/pagination';
import { ColumnProps } from 'antd/es/table/interface';
import Reader from './reader';
import StoreProps from './storeProps';

export default interface ComboProps<T> {
  /**
   * zh-CN: 可以点击清除图标删除内容
   * en-US: Allow to remove input content with clear icon
   */
  allowClear: boolean;
  /**
   * zh-CN: 选择数据行后触发该事件
   * en-US: After select will trigger this event
   */
  afterSelect?: (item: T, index: number) => void;
  /**
   * zh-CN: 清空数据触发该事件
   * en-US: After clear will trigger this event
   */
  afterClear?: () => void;
  /**
   * zh-CN: 数据请求完成调用该事件，返回接口请求的数据
   * en-US: Data record array to be displayed
   */
  afterLoaded?: (data: object[]) => void;
  /**
   * zh-CN: 数据显示列配置，详情参见antd的columns属性
   * en-US: Data record array to be displayed
   */
  columns: ColumnProps<T>[];
  /**
   * zh-CN: 级联参数配置
   * en-US: Cascade parameter configuration
   */
  cascadeParams?: object;
  /**
   * zh-CN: 选择框样式名
   * en-US: ComboList className
   */
  className?: string;
  /**
   * zh-CN: 输入框默认内容
   * en-US: The initial input content
   */
  defaultValue?: string;
  /**
   * zh-CN: 组件失效状态
   * en-US: Disabled state of button
   */
  disabled?: boolean;
  /**
   * zh-CN: 静态数据源
   * en-US: Data record array to be displayed
   */
  dataSource?: object[];
  /**
   * zh-CN: 额外提交的表单字段属性名，表单受控
   * en-US: Attribute name of extra submitted form field, controlled form
   */
  field?: string[];
  /**
   * zh-CN: antd表单组件form
   * en-US: antd Form
   */
  form?: WrappedFormUtils;
  /** s
   * zh-CN: 数据面板表格最大高度
   * en-US: Data list max height
   */
  height?: number;
  /**
   * zh-CN: 填充输入框显示的表单字段属性名，表单受控
   * en-US: Fill in the attribute name of the form field displayed in the input box. The form is controlled
   */
  name: string;
  /**
   * zh-CN: 选择框默认文字
   * en-US: Placeholder of select
   */
  placeholder?: string;
  /**
   * zh-CN: 接口数据解析适配
   * en-US: Data map object
   */
  reader: Reader;
  /**
   * zh-CN: 远程分页
   * en-US: Remote paging
   */
  remotePaging?: boolean;
  pagination?: boolean | PaginationProps;
  /**
   * zh-CN: 设置列表项唯一的key，可以是返回字符串的字符串或函数
   * en-US: Item's unique key, could be a string or function that returns a string
   */
  rowKey: ((item: T) => string) | string;
  /**
   * zh-CN: css属性配置
   * en-US: css properties
   */
  style?: CSSProperties;
  /**
   * zh-CN: 数据接口对象
   * en-US: Data interface object
   */
  store?: StoreProps;
  /** s
   * zh-CN: 显示快速搜索
   * en-US: Show search
   */
  showSearch: boolean;
  /**
   * zh-CN: 搜索框默认文字
   * en-US: Placeholder of search
   */
  searchPlaceHolder?: string;
  /**
   * zh-CN: 搜索属性配置
   * en-US: Properties of search
   */
  searchProperties?: string[];
  /**
   * zh-CN: 输入框内容
   * en-US: The input content value
   */
  value?: string;
  /** s
   * zh-CN: 数据面板宽度
   * en-US: Data list width
   */
  width?: number;
}
