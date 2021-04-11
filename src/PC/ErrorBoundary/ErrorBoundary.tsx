/**
 *@author:lzh
 *@describe: 错误边界
 *@time:
 */
import React, {Component} from 'react';

export interface IErrorBoundaryProps {
  /**
   * @description 边界错误提示
   * */
  errNode: React.ReactNode | string
}


export default class ErrorBoundary extends Component<IErrorBoundaryProps> {
  constructor(props: IErrorBoundaryProps | Readonly<IErrorBoundaryProps>) {
    super(props);
    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError(error: any) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    if (error) {
      return {hasError: true};
    }
  }

  render() {
    const {errNode} = this.props;
    const {hasError} = this.state;
    if (hasError) {
      return errNode
    }
    return this.props.children;
  }
}


