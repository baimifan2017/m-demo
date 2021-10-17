import React from 'react';
import Avatar from 'antd/es/avatar';
import { IUploadFile } from './fileItemProps';
import ExtIcon from '../ext-icon';

export default function getAvatar(file: IUploadFile, size: number) {
  const { name, fileName, thumbUrl } = file;
  const nameStr = name || fileName;
  if (thumbUrl) {
    return <Avatar shape="square" size={size} src={thumbUrl} />;
  }
  const fileType = nameStr && nameStr.split('.').pop();
  switch (fileType) {
    case 'xls':
    case 'xlsx':
      return (
        <Avatar shape="square" size={size}>
          <ExtIcon style={{ fontSize: size }} type="excel" />
        </Avatar>
      );
    case 'doc':
    case 'docx':
      return (
        <Avatar shape="square" size={size}>
          <ExtIcon style={{ fontSize: size }} type="word" />
        </Avatar>
      );
    case 'ppt':
    case 'pptx':
      return (
        <Avatar shape="square" size={size}>
          <ExtIcon style={{ fontSize: size }} type="ppt" />
        </Avatar>
      );
    case 'pdf':
      return (
        <Avatar shape="square" size={size}>
          <ExtIcon style={{ fontSize: size }} type="pdf" />
        </Avatar>
      );
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return (
        <Avatar shape="square" size={size}>
          <ExtIcon style={{ fontSize: size }} type="image" />
        </Avatar>
      );
    default:
      return (
        <Avatar shape="square" size={size}>
          <ExtIcon style={{ fontSize: size }} type="file" />
        </Avatar>
      );
  }
}
