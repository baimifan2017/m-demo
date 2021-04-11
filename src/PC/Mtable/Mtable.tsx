/**
 * @author lzh
 * @desc:
 * @date:2021-03-29
 */

import React, {ReactNode} from 'react';
import {message} from "antd";
import {ExtModal, ExtTable} from 'suid';
import cls from 'classnames';
import {omit} from 'lodash';
import {IExtTableProps} from 'suid/es/ext-table'
import {IMyProps} from '@/utils/IExtTableProps';
import RenderAntdForm from "@/utils/RenderAntdForm";
import './style/index'


export interface ITableProps extends IExtTableProps<object> {
  /** 名称*/
  title: string;
  /** modal visible*/
  visible: boolean;
  /** 样式切换*/
  styleType?: IMyProps.IStyleType;
  /** 弹出modal中form表单内容*/
  modalFormItems: IMyProps.IFormItemProps[];
  /** modal中form布局方式*/
  formLayout: IMyProps.IFormLayOut;
  /** 提交事件*/
  onSubmit: (value: Object | Object[]) => IMyProps.IResult;
  /** 关闭modal*/
  onClose: () => void
}


class Mtable extends React.Component<ITableProps, any> {

  private tableRef: ReactNode;

  constructor(props: ITableProps) {
    super(props);
    this.state = {
      selectedRow: {}, // 当前选中行
    }
  }


  static defaultProps = {
    // @ts-ignore
    onTableRef: (ref: React.ReactNode) => (this.tableRef = ref),
    styleType: 'Antd',
    formLayout: 'inline',
  }

  /**
   * 刷新页面
   */
  _onRefresh = (): void => {
    if (this.tableRef) {
      // @ts-ignore
      this.tableRef.remoteDataRefresh();
    }
  }

  /**
   * 保存单据
   */
  _onSubmit = (value?: any): void => {
    const {onSubmit} = this.props;
    // @ts-ignore
    if (onSubmit) {

      new Promise(resolve => {
        const re = onSubmit(value);
        resolve(re)
      })
        .then(re => {
          // @ts-ignore
          const {success, msg} = re;
          if (success) {
            message.success(msg, 5);
          } else {
            message.error(msg, 5);
          }
        })
        .finally(() => {
        })
    }
  }

  _onRowClick = (value: any): void => {
    this.setState({selectedRow: value})
  }

  _onRenderTitle = (title: string, selectedRow: any): React.ReactNode => {
    if (selectedRow?.id) {
      return <>
        {title}
        <span className={cls('m-demo-sub')}> _ 编辑</span>
      </>
    } else {
      return <>
        {title}
        <span className={cls('m-demo-sub')}> _ 新增</span>
      </>
    }
  }

  render(): ReactNode {
    const {selectedRow} = this.state;
    const {modalFormItems, title, onClose, visible} = this.props;
    // table参数
    let tableProps = omit(this.props, ['styleType', 'modalFormItems', 'onSubmit', 'title'])

    // modal参数
    const modalProps = {
      title: this._onRenderTitle(title, selectedRow),
      visible,
      onCancel: (): void => onClose(),
      onOk: (): void => this._onSubmit()
    }

    return <div className={cls('m-table')}>
      {/** @ts-ignore */}
      <ExtTable
        {...tableProps}
        onRow={(record: any) => {
          return {
            onClick: () => this._onRowClick(record), // 点击行
          };
        }}
      />
      {
        visible ?
          <ExtModal {...modalProps}>
            <RenderAntdForm formItems={modalFormItems} onSubmit={this._onSubmit}/>
          </ExtModal> : null
      }
    </div>;
  }
}

export default Mtable;
