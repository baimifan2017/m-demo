import React, { Component } from 'react';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import $$ from 'cmn-utils';
import cls from 'classnames';

const { debounce, throttle } = $$;

/**
 * 在一个类上增加这个装饰器，可以监听组件的大小变化，
 * 被包装的类在porps中将注入组件的width和height，并且
 * 在上级函组件中可以使用onResize函数
 * @param {*} config
 */
const defaultConfig = {
  refreshRate: 2, // 调用频率
  refreshMode: 'throttle', // 使用函数，只能是节流或防抖函数[throttle | debounce]
};

export interface Config {
  refreshRate: number;
  refreshMode: 'throttle' | 'debounce';
}

export interface ISize {
  width: number;
  height: number;
  position?: any;
}

export interface IResizeProps {
  onResizeMe?: (size: ISize) => void;
  className?: string;
}

const ResizeMe = (config = defaultConfig as Config) => {
  const refreshFunc = config.refreshMode === 'throttle' ? throttle : debounce;

  return (WrappedComponent: React.ElementType) => {
    return class Resize extends Component<IResizeProps | any, any> {
      onResizeStrategy: any;

      resizeSensor: any;

      element: any;

      constructor(props: IResizeProps) {
        super(props);
        this.onResizeStrategy = refreshFunc(this.onResize, config.refreshRate);
        this.state = {
          width: 0,
          height: 0,
          position: undefined,
        };
      }

      componentDidMount() {
        const element = this.element.parentNode;
        this.resizeSensor = new ResizeSensor(element, this.onResizeStrategy);
        this.onResizeStrategy();
      }

      componentWillUnmount() {
        const element = this.element.parentNode;
        this.resizeSensor.detach(element, this.onResizeStrategy);
      }

      onResize = () => {
        const element = this.element.parentNode;
        const { onResizeMe } = this.props;
        const {
          width,
          height,
          paddingLeft,
          paddingRight,
          paddingTop,
          paddingBottom,
        } = getComputedStyle(element);

        const size = {
          width: parseInt(width, 10) - parseInt(paddingLeft, 10) - parseInt(paddingRight, 10),
          height: parseInt(height, 10) - parseInt(paddingTop, 10) - parseInt(paddingBottom, 10),
        } as ISize;
        this.setState(size);
        if (onResizeMe) onResizeMe(size);
      };

      render() {
        const { className = '', ...rest } = this.props;
        return (
          <div ref={node => (this.element = node)} className={cls('seid-resize-me', className)}>
            <WrappedComponent {...rest} size={{ ...this.state }} />
          </div>
        );
      }
    };
  };
};

export default ResizeMe;
