import React, { PureComponent } from 'react';
import { get, omit } from 'lodash';
import cls from 'classnames';
import moment from 'moment';
import Item from 'antd/es/list/Item';
import Progress from 'antd/es/progress';
import Card from 'antd/es/card';
import Popconfirm from 'antd/es/popconfirm';
import ExtIcon from '../ExtIcon';
import getAvatar from './FileIcon';
import IFileItemProps, { IUploadFile, SecondField } from './fileItemProps';

const uploadOptions = [
  'index',
  'locale',
  'disabled',
  'viewType',
  'deleteFile',
  'downloadFile',
  'previewFile',
  'selectedCheck',
  'downloadId',
];

export function getStatus(status: any): 'normal' | 'exception' | 'active' | 'success' | undefined {
  switch (status) {
    case 'uploading':
      return 'active';
    case 'error':
      return 'exception';
    case 'success':
      return 'success';
    case 'done':
      return 'success';
    case 'removed':
      return 'success';
    default:
      return undefined;
  }
}

class FileItem extends PureComponent<IFileItemProps, any> {
  renderItemDescription = () => {
    const { locale, ...rest } = this.props;
    const { status, secondFields = [], ...restUploadFile } = omit(rest, uploadOptions);
    const defaultSecondFields = [
      {
        title: locale.fileSize,
        dataKey: 'fileSize',
      },
      {
        title: locale.uploadedTime,
        dataKey: 'uploadedTime',
        dataType: 'date',
      },
    ] as SecondField[];
    if (status !== 'done') {
      return null;
    }
    const fields = defaultSecondFields.concat(secondFields);
    return (
      <div className="desc-box">
        {fields.map(field => {
          let value =
            get(restUploadFile, field.dataKey) ||
            get(restUploadFile, `response[0].${field.dataKey}`);
          if (field.dataType === 'date') {
            value = moment(value).format('YYYY-MM-DD HH:mm:ss');
          }
          return (
            <div className="desc-item" key={field.dataKey}>
              <span className="label">{field.title}</span>
              <span className="value">{value}</span>
            </div>
          );
        })}
      </div>
    );
  };

  downloadFile = () => {
    const { downloadFile, ...rest } = this.props;
    if (downloadFile) {
      const file = omit(rest, uploadOptions) as IUploadFile;
      downloadFile(file);
    }
  };

  deleteFile = () => {
    const { deleteFile, ...rest } = this.props;
    if (deleteFile) {
      const file = omit(rest, uploadOptions) as IUploadFile;
      deleteFile(file);
    }
  };

  previewFile = () => {
    const { previewFile, ...rest } = this.props;
    if (previewFile) {
      const file = omit(rest, uploadOptions) as IUploadFile;
      previewFile(file);
    }
  };

  getItemActions = () => {
    const {
      locale,
      downloadId,
      deletedDisabled,
      downloadDisabled,
      previewDisabled,
      ...rest
    } = this.props;
    const file = omit(rest, uploadOptions) as IUploadFile;
    const { id, uid, status, extra } = file;
    const downloadBtn = (
      <ExtIcon
        className={cls('file-item-tool-item')}
        onClick={this.downloadFile}
        antd
        key="download"
        type={downloadId === (id || uid) ? 'loading' : 'cloud-download'}
      />
    );
    const deleteBtn = (
      <Popconfirm
        title={locale.deleteConfirm}
        key="delete-confirm"
        onConfirm={() => this.deleteFile()}
      >
        <ExtIcon className="file-item-tool-item delete" antd key="delete" type="delete" />
      </Popconfirm>
    );
    const previewBtn = (
      <ExtIcon
        className={cls('file-item-tool-item')}
        onClick={this.previewFile}
        antd
        key="preview"
        type="eye"
      />
    );
    const actions = [];
    if (status === 'done') {
      if (!downloadDisabled) {
        actions.push(downloadBtn);
      }
      if (!previewDisabled) {
        actions.push(previewBtn);
      }
    }
    if ((status === 'done' || status === 'error') && !deletedDisabled) {
      actions.push(deleteBtn);
    }
    if (extra) {
      actions.push(<span className="file-item-tool-item extra">{extra(file)}</span>);
    }
    return actions;
  };

  selectCheck = () => {
    const { selectedCheck, ...rest } = this.props;
    const file = omit(rest, uploadOptions) as IUploadFile;
    selectedCheck(file);
  };

  renderItem = () => {
    const { viewType, ...rest } = this.props;
    const { id, uid, name, percent, status, selected } = rest;
    if (viewType === 'list') {
      const avatar = getAvatar(rest, 32);
      return (
        <Item
          className={cls('seid-file-item', { selected }, 'view-type-list', status)}
          key={id || uid}
          actions={this.getItemActions()}
        >
          <Item.Meta avatar={avatar} title={name} description={this.renderItemDescription()} />
          {status !== 'done' && status !== 'error' ? (
            <Progress type="circle" percent={percent} status={getStatus(status)} width={40} />
          ) : (
            <div className={cls('select-action')} onClick={() => this.selectCheck()}>
              <ExtIcon type="check" antd />
            </div>
          )}
        </Item>
      );
    }
    if (viewType === 'card') {
      const avatar = getAvatar(rest, 160);
      return (
        <Card
          style={{ width: 300 }}
          hoverable
          className={cls('seid-file-item', { selected }, 'view-type-card', status)}
          key={id || uid}
          cover={avatar}
          actions={this.getItemActions()}
        >
          <Card.Meta title={name} description={this.renderItemDescription()} />
          {status !== 'done' && status !== 'error' ? (
            <Progress type="circle" percent={percent} status={getStatus(status)} width={40} />
          ) : (
            <div className={cls('select-action')} onClick={() => this.selectCheck()}>
              <ExtIcon type="check" antd />
            </div>
          )}
        </Card>
      );
    }
    return null;
  };

  render() {
    return <>{this.renderItem()}</>;
  }
}

export default FileItem;
