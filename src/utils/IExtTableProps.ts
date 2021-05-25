/**
 *@author:lzh
 *@describe:
 *@time:
 */
import React, { Component, CSSProperties, ReactNode } from 'react';
import { ColumnProps, TableProps } from 'antd/es/table';
import { RuleObject } from 'antd/es/form';

import { PaginationProps } from 'antd/es/pagination';
import PerfectScrollbar from 'perfect-scrollbar';
import { LocaleItem } from 'suid/lib/locale';
import { Size } from 'suid/lib/panel';
import { Sort } from 'suid/lib/ext-table';

declare interface StoreProps {
  /**
   * zh-CN: 数据请求参数
   * en-US: request params
   */
  params?: object;
  /**
   * zh-CN: 数据请求类型
   * en-US: Data request method
   */
  type: String;
  /**
   * zh-CN: 接口地址
   * en-US: interface address
   */
  url: string;
}

export interface IToolBarProps {
  /**
   * zh-CN: 左边内容，可传入按钮参数数组
   * en-US: Left Content. Receive Array of Button Props
   */
  left: ReactNode;
  /**
   *  zh-CN: 右边内容
   *  en-US: Right Content.
   */
  right: ReactNode;
  /**
   * zh-CN: 占比，根据栅栏配置
   * en-US: radio
   */
  layout?: {
    leftSpan?: number;
    rightSpan?: number;
  };
  /**
   * zh-CN: 样式作用于Row
   */
  style?: CSSProperties;
  /**
   * zh-CN: class作用于Row
   */
  className?: string;
  /**
   * zh-CN: 样式作用于左边区域
   */
  leftStyle?: CSSProperties;
  /**
   * zh-CN: 样式作用于右边区域
   */
  rightStyle?: CSSProperties;
  /**
   * zh-CN: class作用于左边区域
   */
  leftClassName?: string;
  /**
   * zh-CN: class作用于右边区域
   */
  rightClassName?: string;
  extra?: ReactNode;
}

declare interface IColumnProps<T> extends Omit<ColumnProps<T>, 'width'> {
  dataType?: 'text' | 'date' | 'number';
  required?: boolean;
  optional?: boolean;
  width?: number;
  /**
   * 该列是否禁止使用个性配置功能(宽度调整、位置更换、列的显示隐藏)
   * 注意: 值为true时，width为必设项
   */
  disableCustomize?: boolean;
}

export interface ICheckboxProps {
  // 是否通过点击行来进行选中
  rowCheck?: boolean;
  // 是否多选
  multiSelect: boolean;
}

class GUID {
  private readonly str: string;

  constructor(str?: string) {
    this.str = str || GUID.getNewGUIDString();
  }

  toString() {
    return this.str;
  }

  private static getNewGUIDString() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // eslint-disable-next-line no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // eslint-disable-next-line no-bitwise
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}

export default GUID;

export interface Reader {
  dataReader?: string;
  totalReader?: string;
}

export declare type SortOrder = 'descend' | 'ascend';

export declare type RowSelectionType = 'checkbox' | 'radio';

export declare type SelectionSelectFn<T> = (
  record: T,
  selected: boolean,
  selectedRows: Object[],
  nativeEvent: Event,
) => void;

export declare type SelectionItemSelectFn = (key: string[]) => void;

export interface SelectionItem {
  key: string;
  text: React.ReactNode;
  onSelect?: SelectionItemSelectFn;
}

export declare type TableSelectWay =
  | 'onSelect'
  | 'onSelectMultiple'
  | 'onSelectAll'
  | 'onSelectInvert';

export interface TableRowSelection<T> {
  type?: RowSelectionType;
  selectedRowKeys?: string[] | number[];
  onChange?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => void;
  getCheckboxProps?: (record: T) => Object;
  onSelect?: SelectionSelectFn<T>;
  onSelectMultiple?: (
    selected: boolean,
    selectedRows: T[],
    changeRows: T[],
  ) => void;
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  onSelectInvert?: (selectedRowKeys: string[] | number[]) => void;
  selections?: SelectionItem[] | boolean;
  hideDefaultSelections?: boolean;
  fixed?: boolean;
  columnWidth?: string | number;
  selectWay?: TableSelectWay;
  columnTitle?: string | React.ReactNode;
}

declare interface IExtTableState<T> {
  loading?: boolean;
  scrollWidth: number;
  scrollHeight: number;
  selectedRowKeys: string[];
  selectedRows: T[];
  renderColumns: IColumnProps<T>[];
  gridData: T[];
  pagination: boolean | PaginationProps;
  checkboxConfig: ICheckboxProps;
  columnResizing: boolean;
  sort?: Sort;
}
declare class IExtTableProps<T> extends Component<
  IExtTableProps<T>,
  IExtTableState<T>
> {
  protected queryParams: any;
  protected panel: any;
  protected dataTable: any;
  protected ps: PerfectScrollbar | null;
  protected headPs: PerfectScrollbar | null;
  protected toolBar: any;
  protected locale: LocaleItem;
  protected data: T[];
  protected quickSearchValue: string;
  protected fixedTimer: null;
  protected expandedRowKeys: string[] | number[];
  protected components: {
    header: {
      cell: (props: any) => JSX.Element;
    };
  };
  protected extTool: any;
  protected antTableBody: HTMLElement;
  protected antTableHeader: HTMLElement;
  static defaultProps: {
    loading: boolean;
    pagination: boolean;
    rowKey: string;
    ellipsis: boolean;
    bordered: boolean;
    dataSource: never[];
    showSearch: boolean;
    searchPlaceHolder: string;
    selectedRowKeys: never[];
    lineNumber: boolean;
    allowCancelSelect: boolean;
    searchWidth: number;
    expandIconColumnIndex: number;
    indentSize: number;
    searchProperties: string[];
    resizeMinWidth: number;
    allowCustomColumns: boolean;
    fixedHeader: boolean;
  };
  constructor(props: IExtTableProps<T>);
  componentDidMount(): void;
  componentDidUpdate(prevProps: IExtTableProps<T>): void;
  componentWillUnmount(): void;
  remoteDataRefresh: () => void;
  getQueryParams: () => any;
  getTableData: () => T[];
  manualSelectedRows: (selectedRowKeys?: any) => void;
  getStorageColumns: () => IColumnProps<T>[] | undefined;
  getStorage: () => IColumnProps<T>[] | undefined;
  saveToggleToStorage: (
    targetColumns: IColumnProps<T>[],
    needSave: boolean | undefined,
  ) => void;
  getCheckboxConfig: () => ICheckboxProps;
  onColumnCheckedChange: (targetColumns: IColumnProps<T>[]) => void;
  generateTitle: (
    title: any,
    name: string,
    sort?: Sort | undefined,
  ) => JSX.Element;
  handerHeaderCell: (
    column: IColumnProps<T>,
  ) => {
    onClick: () => void;
  };
  getRenderColumns: (columns?: IColumnProps<T>[]) => IColumnProps<T>[];
  onTableResize: () => void;
  handlerOnResize: (size: Size) => void;
  getData: () => void;
  loadData: (params: any) => void;
  failCallback: () => void;
  handlerPageChange: (current: number, pageSize: number) => void;
  handlerTableChange: (
    pagination: PaginationProps,
    filters: any,
    sorter: any,
    extra: any,
  ) => void;
  onShowSizeChange: (current: number, pageSize: number) => void;
  getLocalFilterData: () => any[];
  handlerSearchChange: (v: any) => void;
  handlerPressEnter: () => void;
  handlerSearch: (v: any) => void;
  getToolBarRight: (
    toolBar: IToolBarProps | undefined,
    showSearch: boolean | undefined,
  ) => JSX.Element;
  renderToolBar: () => JSX.Element | null;
  getRowKey: (item: any) => any;
  handleCellResize: (index: number) => (e: MouseEvent, { size }: any) => void;
  handleResizeStop: (e: any) => void;
  getInitSelectedRows: (
    selectedKeys?: string[] | undefined,
    data?: T[] | undefined,
  ) => T[];
  handlerRowSelectChange: (
    selectedRowKeys: string[],
    selectedRows: T[],
  ) => void;
  checkboxProps: (
    row: any,
  ) => {
    disabled: any;
    onChange: () => void;
  };
  rowClick: (row: any) => void;
  handlerRowClassName: (row: any) => 'tr-selected tr-size' | 'tr-size';
  hanlderRow: (
    row: T,
    index: number,
  ) => {
    onClick: (args: React.MouseEvent<Element, MouseEvent>) => void;
    onDoubleClick?:
      | ((arg: React.MouseEvent<Element, MouseEvent>) => void)
      | undefined;
    onContextMenu?:
      | ((arg: React.MouseEvent<Element, MouseEvent>) => void)
      | undefined;
    onMouseEnter?:
      | ((arg: React.MouseEvent<Element, MouseEvent>) => void)
      | undefined;
    onMouseLeave?:
      | ((arg: React.MouseEvent<Element, MouseEvent>) => void)
      | undefined;
  };
  showPaginationSummary: (
    total: number,
    range: [number, number],
  ) => JSX.Element;
  initExpandedRowKeys: () => void;
  renderTable: (locale: LocaleItem) => JSX.Element;
  render(): ReactNode;
}
export interface IComboProps<T> {
  allowClear: boolean;
  afterSelect?: (item: T, index: number) => void;
  afterClear?: () => void;
  afterLoaded?: (data: object[]) => void;
  cascadeParams?: object;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  dataSource?: object[];
  field?: string[];
  form?: any;
  listProps?: any;
  name: string;
  placeholder?: string;
  reader: any;
  /**
   * zh-CN: 远程分页
   * en-US: Remote paging
   */
  remotePaging?: boolean;
  /**
   * zh-CN: 设置列表项唯一的key，可以是返回字符串的字符串或函数
   * en-US: Item's unique key, could be a string or function that returns a string
   */
  rowKey: ((item: T) => string) | string;
  /**
   * zh-CN: css属性配置
   * en-US: css properties
   */
  style?: React.CSSProperties;
  store?: StoreProps;
  pagination: boolean | PaginationProps;
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
  searchProperties?: string[];
  value?: string;
  width?: number;
  emptyText?: string;
  onPageChange?: (pagination: PaginationProps) => void;
  onSearch?: (v: any) => void;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

/** 自定义明明空间，防止重复*/
export namespace IMyProps {
  export interface IFormItemProps {
    label: string;
    name: string;
    type: string; // 组件类型
    rules: RuleObject[]; // 验证规则
    extra?: string | number;
    tooltip?: string;
    render?: (value: any) => any;
    initialValue?: any;
    comboProps?: any;
  }

  export declare type IStyleType = 'Antd' | 'Material';

  export declare type IFormLayOut = 'horizontal' | 'vertical' | 'inline';

  export interface IResult {
    success: boolean;
    msg: string;
  }
}
