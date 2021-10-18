import { ColumnProps } from 'antd/es/table';

export default interface IColumnProps<T> extends Omit<ColumnProps<T>, 'width'> {
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
