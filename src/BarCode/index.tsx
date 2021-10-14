import React from 'react';
import JsBarcode from 'jsbarcode';
import cls from 'classnames';

export interface BarCodeProps {
  /** 生成条形码的字符串 */
  encodeText: string;
  /** 覆盖显示的文本 */
  text: string;
  /** 条形码类型 */
  format: string;
  /** 设置文本的垂直位置 */
  textPosition: string;
  /** 设置文本的水平对齐方式 */
  textAlign: string;
  /** 设置文本字体的大小 */
  fontSize: number;
  /** 条形码背景 */
  background: string;
  /** 是否在条形码下面显示文本 */
  displayValue: boolean;
  /** 条形码高度 */
  height: number;
  /** 容器元素的样式类 */
  wrapperClassName: string;
  /** 容器元素的内联样式 */
  style: object;
  /** JsBarcode 其他相关配置 */
}

class BarCode extends React.Component<BarCodeProps> {
  public static defaultProps = {
    encodeText: 'NO.01',
    format: 'CODE128',
    textAlign: 'center',
    textPosition: 'bottom',
    background: '#FFFFFF',
    height: 40,
    displayValue: true,
    fontSize: 14,
  };

  /** 条形码容器元素的引用 */
  public barRef: any;

  public componentDidMount() {
    this.createBarcode();
  }

  public componentDidUpdate() {
    this.createBarcode();
  }

  public render() {
    const { wrapperClassName, style } = this.props;

    return (
      <div style={style} className={cls(wrapperClassName, 'barcode-box')}>
        <svg
          ref={ref => {
            this.barRef = ref;
          }}
        />
      </div>
    );
  }

  /** 根据参数使用JsBarcode生成对应的条形码 */
  private createBarcode = () => {
    const { encodeText, ...rest } = this.props;

    JsBarcode(this.barRef, encodeText, { ...rest });
  };
}

export default BarCode;
