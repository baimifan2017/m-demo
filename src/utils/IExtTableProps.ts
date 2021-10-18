/**
 *@author:lzh
 *@describe:
 *@time:
 */
import React, { CSSProperties, ReactNode } from 'react';
import { ColumnProps } from 'antd/es/table';

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
