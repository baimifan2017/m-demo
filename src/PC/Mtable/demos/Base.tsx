import React from 'react';
import {Button} from 'antd';
// @ts-ignore
import {Mtable} from 'm-demo';


const columns = [
  {title: '姓名', dataIndex: 'name', width: 120, required: true,},
  {title: '电子邮箱', dataIndex: 'email', width: 220,},
  {title: '年龄', dataIndex: 'age', width: 60,},
  {title: '地址', dataIndex: 'address', width: 260,}
]


export default class Base extends React.Component {
  state = {
    visible: false
  }

  private tableRef: { remoteDataRefresh: () => void; } | undefined;

  _onToggleVisible = (isShow?: boolean) => {
    const {visible} = this.state;
    this.setState({visible: isShow || !visible});
  }

  _onEdit = () => {
    this._onToggleVisible();
  }


  _onFresh = () => {
    if (this.tableRef) {
      this.tableRef.remoteDataRefresh();
    }
  }
  /**
   * 编辑/新增提交按钮
   * 提交完成后会自动关闭modal、刷新table，但必须安装demo返回参数。
   * @param value  form表单value
   * @return {success:boolean,msg:string}
   *
   */
  _onSubmit = (value: any) => {
    alert(value);
    return {success: true, msg: '提交成功'}
  }

  render() {
    const {visible} = this.state;
    const mTableProps = {
      title: 'demo', // 标题
      onSubmit: (value: any) => this._onSubmit(value),
      onClose: (value: boolean) => this._onToggleVisible(value),
      visible,
      columns,
      store: {
        url: 'http://10.4.32.53:7300/mock/5dd5efbdc239b926aeb04627/seid.api/userList'
      },
      sort: {
        field: {lastEditedDate: 'DESC', createdDate: null},
      },
      toolBar: {
        left: (<>
          <Button type="primary" onClick={() => this._onToggleVisible()}>新增</Button>
          <Button style={{marginLeft: '8px'}} onClick={() => this._onFresh()}>刷新</Button>
        </>)
      },
      searchProperties: ['name', 'email', 'address'],
      showSearchTooltip: true,
      searchPlaceHolder: '申请单号',
      remotePaging: true,
      storageId: '55cc6611-497f-4a32-b82e-6ca6096c57ab',
      onTableRef: (ref: any) => this.tableRef = ref,
    }
    return <div style={{height: '350px'}}>
      <Mtable {...mTableProps}/>
    </div>
  }
}
