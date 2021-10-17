---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

最简单的用

## en-US

The simplest usage， only `encodeText` prop.

```jsx
import React from 'react';
import { DataImport } from 'seid';

const columns = [
  {
    dataIndex: 'modules',
    title: '功能模块',
  },
  {
    dataIndex: 'points',
    title: '功能点',
  },
  {
    dataIndex: 'description',
    title: '功能简介',
  },
  {
    dataIndex: 'level',
    title: '优先级',
  },
  {
    dataIndex: 'response',
    title: '负责人',
  },
  {
    dataIndex: 'startDate',
    title: '开始日期',
  },
  {
    dataIndex: 'endDevelopers',
    title: '后台开发',
  },
  {
    dataIndex: 'frontDevelopers',
    title: '前端开发',
  },
];

function validateItem(data) {
  return data.map(d => {
    if (d.endDevelopers > 2) {
      return {
        ...d,
        validate: false,
        status: '验证未通过',
        statusCode: 'failed',
        message: '验证未通过',
      };
    }
    return {
      ...d,
      validate: true,
      status: '验证通过',
      statusCode: 'success',
      message: '验证通过',
    };
  });
}

ReactDOM.render(<DataImport
  columns={columns}
  validateFunc={validateItem}
  importData={console.log}
  templateFileList={[
    {
      download: '/templates/合同管理需求确认清单导入模板.xlsx',
      fileName: '合同管理需求确认清单导入模板.xlsx',
      key: 'contract',
    },
  ]}
/>, mountNode);
```
