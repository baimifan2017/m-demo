var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React, { PureComponent } from 'react';
import get from 'lodash/get';
import omit from 'lodash/omit';
import cls from 'classnames';
import moment from 'moment';
import Item from 'antd/es/list/Item';
import Progress from 'antd/es/progress';
import Card from 'antd/es/card';
import Popconfirm from 'antd/es/popconfirm';
import ExtIcon from '../ext-icon';
import getAvatar from './FileIcon';
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
export function getStatus(status) {
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
class FileItem extends PureComponent {
    constructor() {
        super(...arguments);
        this.renderItemDescription = () => {
            const _a = this.props, { locale } = _a, rest = __rest(_a, ["locale"]);
            const _b = omit(rest, uploadOptions), { status, secondFields = [] } = _b, restUploadFile = __rest(_b, ["status", "secondFields"]);
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
            ];
            if (status !== 'done') {
                return null;
            }
            const fields = defaultSecondFields.concat(secondFields);
            return (<div className="desc-box">
        {fields.map(field => {
                let value = get(restUploadFile, field.dataKey) ||
                    get(restUploadFile, `response[0].${field.dataKey}`);
                if (field.dataType === 'date') {
                    value = moment(value).format('YYYY-MM-DD HH:mm:ss');
                }
                return (<div className="desc-item" key={field.dataKey}>
              <span className="label">{field.title}</span>
              <span className="value">{value}</span>
            </div>);
            })}
      </div>);
        };
        this.downloadFile = () => {
            const _a = this.props, { downloadFile } = _a, rest = __rest(_a, ["downloadFile"]);
            if (downloadFile) {
                const file = omit(rest, uploadOptions);
                downloadFile(file);
            }
        };
        this.deleteFile = () => {
            const _a = this.props, { deleteFile } = _a, rest = __rest(_a, ["deleteFile"]);
            if (deleteFile) {
                const file = omit(rest, uploadOptions);
                deleteFile(file);
            }
        };
        this.previewFile = () => {
            const _a = this.props, { previewFile } = _a, rest = __rest(_a, ["previewFile"]);
            if (previewFile) {
                const file = omit(rest, uploadOptions);
                previewFile(file);
            }
        };
        this.getItemActions = () => {
            const _a = this.props, { locale, downloadId, deletedDisabled, downloadDisabled, previewDisabled } = _a, rest = __rest(_a, ["locale", "downloadId", "deletedDisabled", "downloadDisabled", "previewDisabled"]);
            const file = omit(rest, uploadOptions);
            const { id, uid, status, extra } = file;
            const downloadBtn = (<ExtIcon className={cls('file-item-tool-item')} onClick={this.downloadFile} antd key="download" type={downloadId === (id || uid) ? 'loading' : 'cloud-download'}/>);
            const deleteBtn = (<Popconfirm title={locale.deleteConfirm} key="delete-confirm" onConfirm={() => this.deleteFile()}>
        <ExtIcon className="file-item-tool-item delete" antd key="delete" type="delete"/>
      </Popconfirm>);
            const previewBtn = (<ExtIcon className={cls('file-item-tool-item')} onClick={this.previewFile} antd key="preview" type="eye"/>);
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
        this.selectCheck = () => {
            const _a = this.props, { selectedCheck } = _a, rest = __rest(_a, ["selectedCheck"]);
            const file = omit(rest, uploadOptions);
            selectedCheck(file);
        };
        this.renderItem = () => {
            const _a = this.props, { viewType } = _a, rest = __rest(_a, ["viewType"]);
            const { id, uid, name, percent, status, selected } = rest;
            if (viewType === 'list') {
                const avatar = getAvatar(rest, 32);
                return (<Item className={cls('seid-file-item', { selected }, 'view-type-list', status)} key={id || uid} actions={this.getItemActions()}>
          <Item.Meta avatar={avatar} title={name} description={this.renderItemDescription()}/>
          {status !== 'done' && status !== 'error' ? (<Progress type="circle" percent={percent} status={getStatus(status)} width={40}/>) : (<div className={cls('select-action')} onClick={() => this.selectCheck()}>
              <ExtIcon type="check" antd/>
            </div>)}
        </Item>);
            }
            if (viewType === 'card') {
                const avatar = getAvatar(rest, 160);
                return (<Card style={{ width: 300 }} hoverable className={cls('seid-file-item', { selected }, 'view-type-card', status)} key={id || uid} cover={avatar} actions={this.getItemActions()}>
          <Card.Meta title={name} description={this.renderItemDescription()}/>
          {status !== 'done' && status !== 'error' ? (<Progress type="circle" percent={percent} status={getStatus(status)} width={40}/>) : (<div className={cls('select-action')} onClick={() => this.selectCheck()}>
              <ExtIcon type="check" antd/>
            </div>)}
        </Card>);
            }
            return null;
        };
    }
    render() {
        return  <  > { this: .renderItem() };
         > ;
    }
}
export default FileItem;
