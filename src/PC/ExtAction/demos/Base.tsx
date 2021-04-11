import React from 'react';
import {Button} from 'antd';
import {ExtTable} from 'suid';
// @ts-ignore
// import {ExtAction} from 'm-demo';

export default () => {


  const dataSource = [
    {name: '张三', email: '51521212@qq.com', age: 21, address: '这是地址1'},
    {name: '张三', email: '51521212@qq.com', age: 22, address: '这是地址2'},
    {name: '张三', email: '51521212@qq.com', age: 23, address: '这是地址3'},
  ]

  const props = {
    columns: [
      // {
      //   title: '操作', dataIndex: 'operate', width: 120, required: true,
      //   render: (text, record) => {
      //     <ExtAction/>
      //   }
      // },
      {title: '姓名', dataIndex: 'name', width: 120, required: true},
      {title: '电子邮箱', dataIndex: 'email', width: 220},
      {title: '年龄', dataIndex: 'age', width: 60},
      {title: '地址', dataIndex: 'address', width: 200},
    ],
    dataSource,
    title: '表格标题',
    rowKey:'age',
    style:{height:'350px'},
    toolBar: {
      left: (
        <>
          <Button type="primary" onClick={() => console.log('新增')} style={{marginRight: '8px'}}>
            Vertical
          </Button>
          <Button type="primary" onClick={() => console.log('新增')}>
            Inline
          </Button>
        </>
      ),
    },
  };
  // @ts-ignore
  return <ExtTable {...props}/>
}
