/**
 *@author:lzh
 *@describe: 错误边界
 *@time:
 */
import React, { Component } from 'react';

export interface IErrorBoundaryProps {
  /**
   * @description 边界错误提示
   * */
  errNode: React.ReactNode | string;
}

/**
 * @description 是否发生错误
 */
export interface IErrorBoundState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static defaultProps = {
    errNode: '加载错误...',
  };

  static getDerivedStateFromError(error: any) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    if (error) {
      console.error('错误信息', error);
      return { hasError: true };
    }
  }

  render() {
    const { errNode } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return errNode;
    }
    return this.props.children;
  }
}
