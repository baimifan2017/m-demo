(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{"F+kV":function(n,e,r){"use strict";r.r(e);var t=r("q1tI"),o=r.n(t),a=r("dEAq");r("Rsk4");e["default"]=n=>(o.a.useEffect((()=>{var e;null!==n&&void 0!==n&&null!==(e=n.location)&&void 0!==e&&e.hash&&a["AnchorLink"].scrollToAnchor(decodeURIComponent(n.location.hash.slice(1)))}),[]),o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"markdown"},o.a.createElement("h2",{id:""},o.a.createElement(a["AnchorLink"],{to:"#","aria-hidden":"true",tabIndex:-1},o.a.createElement("span",{className:"icon icon-link"}))),o.a.createElement("blockquote",null,o.a.createElement("ol",null,o.a.createElement("li",null,"\u5b89\u88c5\u65b9\u5f0f\uff1a npm install m-demo"),o.a.createElement("li",null,"\u7ef4\u62a4\u4eba\uff1axxx"),o.a.createElement("li",null,"\u7ef4\u62a4\u4eba\u8054\u7cfb\u65b9\u5f0f\uff1axxx"))))))},Rsk4:function(n,e,r){"use strict";r.r(e);var t=r("9og8"),o=r("WmNS"),a=r.n(o),i=r("rlch"),s="import React from 'react';\r\nimport { Table } from 'antd';\r\n// @ts-ignore\r\nimport { Action } from 'm-demo';\r\n\r\nexport default () => {\r\n  const itemArr = [\r\n    { name: '\u8be6\u60c5', powerCode: 'detail' },\r\n    { name: '\u7f16\u8f91', powerCode: 'edit' },\r\n    { name: '\u5220\u9664', powerCode: 'delete' },\r\n  ];\r\n\r\n  /**\r\n   * \u64cd\u4f5c\u6309\u94ae\u70b9\u51fb\u4e8b\u4ef6\r\n   * @param type  \u4e8b\u4ef6\u7c7b\u578b\uff1a\u4e0eitemArr\u4e2dpowerCode\u4e00\u81f4\r\n   * @param record  \u5f53\u524d\u884c\u4fe1\u606f\r\n   */\r\n  const handleClick = (type: any, record: any) => {\r\n    switch (type) {\r\n      case 'detail':\r\n        alert(type);\r\n        break;\r\n      case 'edit':\r\n        alert(type);\r\n        break;\r\n      case 'delete':\r\n        alert(type);\r\n        break;\r\n      default:\r\n        break;\r\n    }\r\n  };\r\n\r\n  const dataSource = [\r\n    { name: '\u5f20\u4e09', email: '51521212@qq.com', age: 21, address: '\u8fd9\u662f\u5730\u57401', key: '1' },\r\n    { name: '\u5f20\u4e09', email: '51521212@qq.com', age: 22, address: '\u8fd9\u662f\u5730\u57402', key: '2' },\r\n    { name: '\u5f20\u4e09', email: '51521212@qq.com', age: 23, address: '\u8fd9\u662f\u5730\u57403', key: '3' },\r\n  ];\r\n\r\n  return (\r\n    <Table\r\n      rowKey={row => row.age}\r\n      columns={[\r\n        { title: '\u59d3\u540d', dataIndex: 'name', width: 120 },\r\n        { title: '\u7535\u5b50\u90ae\u7bb1', dataIndex: 'email', width: 220 },\r\n        { title: '\u5e74\u9f84', dataIndex: 'age', width: 60 },\r\n        { title: '\u5730\u5740', dataIndex: 'address', width: 200 },\r\n        {\r\n          title: '\u64cd\u4f5c',\r\n          width: 120,\r\n          render: (_, record) => <Action onClick={handleClick} itemArr={itemArr} record={record} />,\r\n        },\r\n      ]}\r\n      dataSource={dataSource}\r\n    />\r\n  );\r\n};",c="import React, { Component } from 'react';\n// @ts-ignore\nimport { ErrorBoundary } from 'm-demo';\nimport { Table } from 'antd';\n\nclass Base extends Component {\n  render() {\n    // @ts-ignore\n    // @ts-ignore\n    return (\n      <div>\n        \u4e0b\u9762\u7684Error\u4f1a\u53d1\u751f\u9519\u8bef\uff0c\u4f46\u8fd9\u5e76\u4e0d\u4f1a\u5f71\u54cd\u6211\u7684\u663e\u793a\u3002\n        <ErrorBoundary errNode=\"\u8fd9\u91cc\u53d1\u751f\u4e86\u4e00\u4e2a\u8fb9\u754c\u9519\u8bef\">\n          <Table dataSource={[]} columns={['1', '2']} />\n        </ErrorBoundary>\n      </div>\n    );\n  }\n}\n\nexport default Base;",l='/**\n * @description: \u6811\u72b6\u8868\u6f14\u793a\n */\n\nimport React, { useRef } from \'react\';\n// @ts-ignore\nimport { ITree } from \'m-demo\';\nimport { Button, Popconfirm, Popover } from \'antd\';\nimport ProForm, { ProFormText } from \'@ant-design/pro-form\';\n\nimport { MinusCircleOutlined, PlusCircleOutlined } from \'@ant-design/icons\';\nimport request from \'umi-request\';\n\nexport interface RightFormProps {\n  handleAdd?: () => void;\n  handleSave: (\n    v: any,\n    row: { title: {} | null | undefined; children: any; key: any },\n  ) => void;\n  handleSelect: (v: any) => void;\n  handleDel: (v: any, callback: any) => void;\n  url: string;\n  myRef: React.Ref<any>;\n}\n\nconst Demo: React.FC<RightFormProps> = props => {\n  const myRef = useRef();\n\n  /**\n   * \u5220\u9664\u884c\n   * @param row\n   */\n  const handleDel = (row?: any) => {\n    console.log(row);\n  };\n\n  /**\n   * \u4fdd\u5b58\n   * @param v\n   * @param row\n   */\n  const handleSave = (v: object, row?: any) => {\n    console.log(v, row);\n  };\n\n  /**\n   * \u9009\u62e9tree\u8282\u70b9\u4e8b\u4ef6\n   * @param row\n   */\n  const onSelect = (row: object) => {\n    console.log(row);\n  };\n\n  const popElement = (\n    <ProForm\n      onFinish={async values => {\n        await handleSave(values);\n      }}\n    >\n      <ProForm.Group>\n        <ProFormText name="name" label="\u7ec4\u7ec7\u673a\u6784\u540d\u79f0" />\n        <ProFormText name="code" label="\u7ec4\u7ec7\u673a\u6784\u4ee3\u7801" />\n      </ProForm.Group>\n    </ProForm>\n  );\n\n  /**\n   * \u6811\u5f62\u9009\u62e9\u5668\u884c\u540e\u989d\u5916\u64cd\u4f5c\n   * @param row \u5f53\u524d\u9009\u4e2d\u6811\u72b6\u8282\u70b9\u5185\u5bb9\n   */\n  const renderItemExtra = (row: {\n    title: {} | null | undefined;\n    children: any;\n    key: any;\n  }): any => {\n    const commStyle = {\n      fontSize: 12,\n      cursor: \'pointer\',\n      margin: \'0 3px\',\n    };\n\n    const popElement = (\n      <ProForm\n        onFinish={async values => {\n          await handleSave(values, row);\n        }}\n      >\n        <ProForm.Group>\n          <ProFormText\n            name="departName"\n            label="\u90e8\u95e8\u540d\u79f0"\n            fieldProps={{\n              width: \'middle\',\n            }}\n            required\n          />\n          <ProFormText\n            name="departCode"\n            label="\u90e8\u95e8\u4ee3\u7801"\n            fieldProps={{\n              width: \'middle\',\n            }}\n          />\n        </ProForm.Group>\n      </ProForm>\n    );\n    return [\n      <Popover\n        title="\u65b0\u589e\u5b50\u8282\u70b9"\n        key="add"\n        content={popElement}\n        trigger="click"\n      >\n        <PlusCircleOutlined style={{ ...commStyle, color: \'red\' }} />\n      </Popover>,\n      <Popconfirm\n        title="\u786e\u5b9a\u5220\u9664\uff1f\u5220\u9664\u540e\u4e0d\u53ef\u6062\u590d"\n        key="del"\n        onConfirm={() => handleDel(row)}\n        okText="\u786e\u8ba4"\n        cancelText="\u53d6\u6d88"\n      >\n        <MinusCircleOutlined style={{ ...commStyle }} />\n      </Popconfirm>,\n    ];\n  };\n\n  const { handleAdd } = props;\n  const treeProps = {\n    myTitle: \'name\',\n    myKey: \'id\',\n    renderItemExtra,\n    onSelect,\n    header: {\n      right: (\n        <Popover content={popElement} title="\u65b0\u589e\u6839\u76ee\u5f55" trigger="click">\n          <Button onClick={handleAdd}>\u65b0\u589e</Button>\n        </Popover>\n      ),\n    },\n    ref: myRef,\n    store: {\n      url: \'/test\',\n    },\n  };\n  return (\n    <>\n      <ITree {...treeProps} />\n    </>\n  );\n};\n\nexport default Demo;';e["default"]={"action-base":{component:Object(i["c"])({loader:function(){var n=Object(t["a"])(a.a.mark((function n(){return a.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,Promise.all([r.e(1),r.e(3),r.e(8)]).then(r.bind(null,"mpql"));case 2:return n.abrupt("return",n.sent.default);case 3:case"end":return n.stop()}}),n)})));function e(){return n.apply(this,arguments)}return e}()}),previewerProps:{sources:{_:{tsx:s}},dependencies:{antd:{version:"4.16.13",css:"antd/dist/antd.css"},react:{version:">=16.9.0"},"m-demo":{version:"0.0.4"},"react-dom":{version:">=16.9.0"}},componentName:"Action",identifier:"action-base"}},"errorboundary-base":{component:Object(i["c"])({loader:function(){var n=Object(t["a"])(a.a.mark((function n(){return a.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,Promise.all([r.e(1),r.e(3),r.e(17),r.e(7)]).then(r.bind(null,"myi4"));case 2:return n.abrupt("return",n.sent.default);case 3:case"end":return n.stop()}}),n)})));function e(){return n.apply(this,arguments)}return e}()}),previewerProps:{sources:{_:{tsx:c}},dependencies:{antd:{version:"4.16.13",css:"antd/dist/antd.css"},react:{version:">=16.9.0"},"m-demo":{version:"0.0.4"},"react-dom":{version:">=16.9.0"}},identifier:"errorboundary-base"}},"itree-demos":{component:Object(i["c"])({loader:function(){var n=Object(t["a"])(a.a.mark((function n(){return a.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,Promise.all([r.e(1),r.e(3),r.e(17),r.e(7)]).then(r.bind(null,"0iVN"));case 2:return n.abrupt("return",n.sent.default);case 3:case"end":return n.stop()}}),n)})));function e(){return n.apply(this,arguments)}return e}()}),previewerProps:{sources:{_:{tsx:l}},dependencies:{antd:{version:"4.x",css:"antd/dist/antd.css"},react:{version:">=16.0.0"},"m-demo":{version:"0.0.4"},"@ant-design/pro-form":{version:"1.42.1",css:"@ant-design/pro-form/dist/form.css"},"@ant-design/icons":{version:"4.7.0"},"react-dom":{version:">=16.0.0"}},identifier:"itree-demos"}}}},x2v5:function(n){n.exports=JSON.parse("{}")}}]);