import React from 'react';
import { Attachment } from 'm-demo';

const attachmentProps = {
  serviceHost: 'http://10.4.208.87',
  multiple: true,
  limitFileExt: ['xls', 'xlsx', 'doc', 'docx'],
};


export default () => <Attachment {...attachmentProps} />
