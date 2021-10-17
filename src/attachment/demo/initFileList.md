---
order: 1
title:
  zh-CN: 文件列表初始化，文件项操作扩展
  en-US: File list initialization, file item operation extension
---

## zh-CN

文件列表初始化，文件项操作扩展。

## en-US

File list initialization, file item operation extension usage.

```jsx
import { Attachment, ExtIcon } from 'seid';
import { message } from 'antd';
import get from 'lodash/get';

const fileList = [
  {
    id: '1234',
    uid: '1234',
    name: '测试文件.xls',
    fileName: '测试文件.xls',
    fileSize: '123kb',
    uploadedTime: '2020-01-12 14:32',
    status: 'done',
    extra: file => {
      return <ExtIcon type="more" onClick={() => message.info('执行[文件项]的扩展方法')} antd />;
    },
    secondFields: [{ title: '条码', dataKey: 'ocrData' }],
  },
  {
    id: '12341',
    uid: '12341',
    name: '测试文件.doc',
    fileName: '测试文件.doc',
    fileSize: '13kb',
    uploadedTime: '2020-01-12 14:32',
    status: 'done',
    extra: file => {
      return <ExtIcon type="more" onClick={() => message.info('执行[文件项]的扩展方法')} antd />;
    },
    secondFields: [{ title: '条码', dataKey: 'ocrData' }],
  },
  {
    appModule: 'EDM_API',
    description: null,
    documentType: 1,
    documentTypeEnum: 'Image',
    documentTypeEnumRemark: '图片',
    fileName: 'R1550-3.jpg',
    fileSize: '491K',
    id: '5e250d4bb1bece000188ebd0',
    itemId: 'CB88B221-3B2A-11EA-AF7D-0242C0A84423',
    name: 'R1550-3.jpg',
    ocrData: null,
    size: 503670,
    status: 'done',
    tenantCode: '10044',
    uploadUserAccount: '654321',
    uploadUserId: '1592D012-A330-11E7-A967-02420B99179E',
    uploadUserName: '系统管理员',
    uploadedTime: '2020-01-20 10:15:39',
  },
];

class App extends React.Component {
  toolExtrasAction = key => {
    switch (key) {
      case 'replace':
        message.info('执行工具栏扩展方法');
        break;
    }
  };

  handlerDeleteFile = files => {
    console.log(files);
  };

  render() {
    const attachmentProps = {
      serviceHost: 'http://10.4.208.87',
      multiple: true,
      fileList,
      toolExtras: [{ title: '替换', key: 'replace' }],
      toolExtrasAction: this.toolExtrasAction,
      onDeleteFile: this.handlerDeleteFile,
    };
    return <Attachment {...attachmentProps} />;
  }
}

ReactDOM.render(<App />, mountNode);
```
