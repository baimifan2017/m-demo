var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import React from 'react';
import get from 'lodash/get';
import isString from 'lodash/isString';
import omit from 'lodash/omit';
import cls from 'classnames';
import isEqual from 'react-fast-compare';
import Tooltip from 'antd/es/tooltip';
import Popconfirm from 'antd/es/popconfirm';
import Button from 'antd/es/button';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import List from 'antd/es/list';
import Empty from 'antd/es/empty';
import message from 'antd/es/message';
import Dropdown from 'antd/es/dropdown';
import Menu from 'antd/es/menu';
import Upload from 'antd/es/upload';
import { request, formatMsg } from '../utils';
import ExtIcon from '../ext-icon';
import Animate from '../animate';
import ToolBar from '../tool-bar';
import defaultLocale from './locale';
import SeidLocaleReceiver from '../seid-locale-provider/SeidLocaleReceiver';
import { isPhoto } from '../_util/utils';
import FileItem from './FileItem';
// 文件上传接口回调
const thenProcess = (option, res) => {
    const { file, onSuccess, onError } = option;
    if (get(res, 'success')) {
        onSuccess(res.data, file);
    }
    else {
        message.error(get(res, 'message'));
        onError(get(res, 'message'));
    }
};
export function toolRightMenuData(locale) {
    return [
        {
            title: locale.selectAll,
            key: 'tool-right-select-all',
        },
        {
            title: locale.reverseSelect,
            key: 'tool-right-reverse-select',
        },
    ];
}
const omitProps = [
    'viewType',
    'serviceHost',
    'getThumbUrl',
    'className',
    'style',
    'showFileCategory',
    'uploadUrl',
    'maxUploadNum',
    'download',
    'extra',
    'secondFields',
];
export const blobToFile = (res, filename) => {
    const { data, headers } = res;
    const name = filename || decodeURI(headers['content-disposition'].split('=')[1]);
    const eLink = document.createElement('a');
    eLink.download = name;
    eLink.style.display = 'none';
    eLink.href = URL.createObjectURL(data);
    document.body.appendChild(eLink);
    eLink.click();
    URL.revokeObjectURL(eLink.href); // 释放URL 对象
    document.body.removeChild(eLink);
};
class Attachment extends React.Component {
    constructor(props) {
        super(props);
        this.promiseList = [];
        this.processedFileNumber = 0;
        this.processArgs = [];
        this.formatThumbUrl = (fileList) => {
            const { thumbUrl, serviceHost } = this.props;
            return fileList.map(file => {
                if (file.status === 'done' && !file.thumbUrl && isPhoto(file.name)) {
                    let url = '';
                    if (isString(thumbUrl)) {
                        url = formatMsg(serviceHost ? `${serviceHost}/${thumbUrl}` : thumbUrl, {
                            id: file.id,
                        });
                    }
                    else if (thumbUrl instanceof Function) {
                        url = thumbUrl(file);
                    }
                    file.thumbUrl = url;
                }
                return file;
            });
        };
        this.getAttachmentData = () => {
            const { fileList, errorFileCount } = this.state;
            return { fileList, errorFileCount };
        };
        this.handlerBeforeUpload = (file) => {
            const { limitFileExt } = this.props;
            const index = file.name.lastIndexOf('.');
            const suffix = file.name.substr(index + 1);
            let valid = true;
            if (limitFileExt) {
                const checkValid = limitFileExt.indexOf(suffix);
                if (checkValid < 0) {
                    message.destroy();
                    message.error(formatMsg(this.locale.validMessage, { typeList: limitFileExt.toString() }));
                }
                valid = checkValid >= 0;
            }
            return valid;
        };
        this.beforeUpload = (file, fileList) => {
            const { beforeUpload } = this.props;
            this.uploadFileListLength = fileList.length;
            if (beforeUpload) {
                return beforeUpload(file, fileList);
            }
            return this.handlerBeforeUpload(file);
        };
        this.handlerUpload = (option) => {
            const { uploadUrl } = this.props;
            if (uploadUrl) {
                this.processArgs.push(option);
                if (this.processArgs.length === this.uploadFileListLength) {
                    this.startUpload();
                }
            }
        };
        this.startUpload = () => __awaiter(this, void 0, void 0, function* () {
            const { maxUploadNum } = this.props;
            if (maxUploadNum) {
                for (const option of this.processArgs) {
                    const { file } = option;
                    const { name = '' } = file;
                    const data = new FormData();
                    data.append('request', file);
                    data.append('fileName', name);
                    this.promiseList.push(this.processRequest(data, option));
                    this.processedFileNumber += 1;
                    if (this.processedFileNumber === this.uploadFileListLength) {
                        const responses = yield Promise.all(this.promiseList);
                        responses.forEach(res => {
                            const { response, option: rcOption } = res;
                            thenProcess(rcOption, response);
                        });
                        this.promiseList = [];
                        this.processedFileNumber = 0;
                        this.processArgs = [];
                        return;
                    }
                    if (this.promiseList.length === maxUploadNum) {
                        const responses = yield Promise.all(this.promiseList);
                        responses.forEach(res => {
                            const { response, option: rcOption } = res;
                            thenProcess(rcOption, response);
                        });
                        this.promiseList = [];
                    }
                }
                return;
            }
            this.processArgs.forEach(option => {
                const { file, onError } = option;
                const { name = '' } = file;
                const data = new FormData();
                data.append('request', file);
                data.append('fileName', name);
                this.processRequest(data, option)
                    .then(res => {
                    const { response, option: rcOption } = res;
                    thenProcess(rcOption, response);
                })
                    .catch(error => {
                    onError(error);
                });
            });
            this.processArgs = [];
        });
        this.processRequest = (data, option) => {
            const { uploadUrl, serviceHost } = this.props;
            const { onProgress } = option;
            const uploadPath = serviceHost ? `${serviceHost}/${uploadUrl}` : uploadUrl;
            return new Promise(resolve => {
                request({
                    url: uploadPath,
                    method: 'POST',
                    data,
                    onUploadProgress: ({ loaded, total }) => {
                        const percent = Number(Math.round((loaded / total) * 100).toFixed(2));
                        onProgress({ percent }, option.file);
                    },
                    headers: {
                        neverCancel: true,
                    },
                })
                    .then((res) => {
                    resolve({
                        option,
                        response: res,
                    });
                })
                    .catch((error) => resolve({ response: error, option }));
            });
        };
        this.downloadFile = (file) => {
            const { download, serviceHost } = this.props;
            if (download && file) {
                this.setState({
                    currentDownloadId: file.id || file.uid,
                });
                if (isString(download)) {
                    const fileName = get(file, 'response[0].fileName') || file.name || file.fileName;
                    const fileId = get(file, 'response[0].id') || file.id;
                    const downladUrl = formatMsg(download, { id: fileId });
                    setTimeout(() => {
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.href = serviceHost ? `${serviceHost}/${downladUrl}` : downladUrl;
                        a.download = fileName;
                        a.click();
                        a.parentNode && a.parentNode.removeChild(a);
                        this.setState({ currentDownloadId: null });
                    }, 1000);
                }
                else if (download instanceof Function) {
                    this.setState({ downloading: true });
                    const config = download([file]);
                    request(config)
                        .then(res => {
                        blobToFile(res);
                    })
                        .catch(error => {
                        throw new Error(error);
                    })
                        .finally(() => {
                        this.setState({ currentDownloadId: null });
                    });
                }
            }
        };
        this.batchDownloadFiles = () => {
            message.info('此功能正在内测中...');
        };
        this.deleteFile = (file) => {
            const { fileList = [] } = this.state;
            const newFileList = fileList.filter(f => (file.id && f.id !== file.id) || f.uid !== file.uid);
            this.setState({ fileList: newFileList }, () => {
                const { onDeleteFile } = this.props;
                if (onDeleteFile) {
                    onDeleteFile([file]);
                }
            });
        };
        this.batchDeleteFiles = () => {
            const { fileList = [] } = this.state;
            const newFileList = fileList.filter(f => !f.selected);
            const deleteFileList = fileList.filter(f => f.selected && !f.deletedDisabled);
            const deletedDisabledFileList = fileList.filter(f => f.selected && f.deletedDisabled);
            this.setState({
                fileList: newFileList.concat(deletedDisabledFileList),
            }, () => {
                const { onDeleteFile } = this.props;
                if (onDeleteFile) {
                    onDeleteFile(deleteFileList);
                }
            });
        };
        this.previewFile = () => { };
        this.handlerChange = (fileInfo) => {
            const { fileList, file } = fileInfo;
            const { thumbUrl, onChange, serviceHost } = this.props;
            let errorFileCount = 0;
            // 获取缩略图地址
            if (file.status === 'done' && thumbUrl && isPhoto(file.name)) {
                let url = '';
                if (isString(thumbUrl)) {
                    url = formatMsg(serviceHost ? `${serviceHost}/${thumbUrl}` : thumbUrl, {
                        id: get(file, 'response[0].id'),
                    });
                }
                else if (thumbUrl instanceof Function) {
                    url = thumbUrl(file);
                }
                fileList.forEach((item, index) => {
                    if (item.uid === file.uid) {
                        fileList.splice(index, 1, Object.assign({}, item, file, { thumbUrl: url }));
                    }
                });
            }
            // 过滤掉beforeUpload返回false时的文件list
            const filterList = fileList
                .filter(list => list.status)
                .map((f) => {
                if (f.status === 'done') {
                    f.id = get(f, 'response[0].id');
                }
                else {
                    errorFileCount++;
                }
                return f;
            });
            this.setState({ fileList: filterList, errorFileCount }, () => {
                if (onChange) {
                    onChange(filterList);
                }
            });
        };
        this.renderFileUpload = () => {
            const _a = this.props, { uploadButton } = _a, rest = __rest(_a, ["uploadButton"]);
            const { fileList } = this.state;
            const uploadProps = omit(rest || {}, [...omitProps, 'fileList']);
            const buttonProps = omit(uploadButton || {}, ['onClick']);
            return (<div className={cls('seid-file-upload')}>
        <Upload {...uploadProps} showUploadList={false} beforeUpload={this.beforeUpload} customRequest={(options) => __awaiter(this, void 0, void 0, function* () { return this.handlerUpload(options); })} onChange={this.handlerChange} fileList={fileList} ref={node => (this.upload = node)}>
          {uploadProps.allowUpload ? (<Button type="primary" icon="upload" {...buttonProps}>
              {this.locale.upload}
            </Button>) : null}
        </Upload>
      </div>);
        };
        this.renderToolBarLeft = () => {
            const { downloading, fileList = [] } = this.state;
            const selectedFileList = fileList.filter(file => file.selected);
            const downloadFileList = selectedFileList.filter(file => !file.downloadDisabled);
            const uploadedFileList = downloadFileList.filter(file => file.id);
            const deleteFileList = selectedFileList.filter(file => !file.deletedDisabled);
            return (<div className="tool-action">
        <div className={cls('action-item')}>{this.renderFileUpload()}</div>
        {selectedFileList.length > 0 ? (
                <  >
                { uploadedFileList: .length === downloadFileList.length ? (<div className={cls('action-item')}>
                <Button icon="download" loading={downloading} onClick={this.batchDownloadFiles}>
                  {`${this.locale.download}(${downloadFileList.length})`}
                </Button>
              </div>) : null })
                :
                    { deleteFileList: .length > 0 ? (<div className={cls('action-item')}>
                <Popconfirm title={formatMsg(this.locale.batchDeleteConfirm, {
                            count: deleteFileList.length,
                        })} key="batch-delete-confirm" onConfirm={() => this.batchDeleteFiles()}>
                  <Button type="danger">{`${this.locale.delete}(${deleteFileList.length})`}</Button>
                </Popconfirm>
              </div>) : null }}>
        ) : null}
      </div>);
        };
        this.handlerViewType = () => {
            let { viewType } = this.state;
            if (viewType === 'list') {
                viewType = 'card';
            }
            else {
                viewType = 'list';
            }
            this.setState({ viewType, viewTypeAnimate: 'bounceIn' });
        };
        this.renderViewType = () => {
            const { viewType, viewTypeAnimate } = this.state;
            const extIconProps = {
                type: 'appstore',
                style: { fontSize: '18px' },
                antd: true,
            };
            let localeKey = 'card';
            if (viewType === 'card') {
                extIconProps.type = 'bars';
                localeKey = 'list';
            }
            return (<div className={cls('tool-item')} onClick={this.handlerViewType}>
        <Animate type={viewTypeAnimate} callback={() => this.setState({ viewTypeAnimate: '' })}>
          <Tooltip title={get(this.locale, localeKey)}>
            <ExtIcon {...extIconProps}/>
          </Tooltip>
        </Animate>
      </div>);
        };
        this.onToolActionOperation = (e) => {
            e.domEvent.stopPropagation();
            const { toolExtrasAction } = this.props;
            switch (e.key) {
                case 'tool-right-select-all':
                    this.selectAll();
                    break;
                case 'tool-right-reverse-select':
                    this.reverseSelect();
                    break;
                default:
                    if (toolExtrasAction) {
                        toolExtrasAction(e.key);
                    }
            }
        };
        this.getToolBarRightMenu = () => {
            const { toolExtras } = this.props;
            let menuData = toolRightMenuData(this.locale);
            if (toolExtras) {
                menuData = menuData.concat(toolExtras);
            }
            return (<Menu className={cls('seid-attchment-tool-menu-box')} onClick={e => this.onToolActionOperation(e)}>
        {menuData.map(m => (<Menu.Item key={m.key} disabled={m.disabled}>
            {m.icon ? <ExtIcon type={m.icon}/> : null}
            {m.title}
          </Menu.Item>))}
      </Menu>);
        };
        this.renderToolBarRight = () => {
            return (<div className="tool-box">
        {this.renderViewType()}

        <Dropdown trigger={['click']} className="tool-drop-down" overlay={this.getToolBarRightMenu()}>
          <div className={cls('tool-item')}>
            <ExtIcon type="more" antd/>
          </div>
        </Dropdown>
      </div>);
        };
        this.selectAll = () => {
            const { onSelectFile } = this.props;
            const { fileList = [] } = this.state;
            fileList.forEach(file => {
                file.selected = true;
            });
            this.setState({
                fileList,
            }, () => {
                if (onSelectFile && onSelectFile instanceof Function) {
                    onSelectFile(fileList);
                }
            });
        };
        this.reverseSelect = () => {
            const { onSelectFile } = this.props;
            const { fileList = [] } = this.state;
            fileList.forEach(file => {
                if (file.selected) {
                    file.selected = false;
                }
                else {
                    file.selected = true;
                }
            });
            this.setState({
                fileList,
            }, () => {
                if (onSelectFile && onSelectFile instanceof Function) {
                    onSelectFile(fileList);
                }
            });
        };
        this.selectedCheck = (selectedFile) => {
            const { onSelectFile } = this.props;
            let { fileList = [] } = this.state;
            const id = selectedFile.id || selectedFile.uid;
            fileList = fileList.map(f => {
                if (f.id === id || f.uid === id) {
                    if (f.selected) {
                        f.selected = false;
                    }
                    else {
                        f.selected = true;
                    }
                }
                return f;
            });
            this.setState({
                fileList,
            }, () => {
                if (onSelectFile && onSelectFile instanceof Function) {
                    const selectFiles = fileList.filter(f => f.selected);
                    onSelectFile(selectFiles);
                }
            });
        };
        this.renderItemList = () => {
            const { allowDelete, allowDownload, allowPreview } = this.props;
            const { fileList = [], currentDownloadId, viewType } = this.state;
            if (fileList.length === 0) {
                return <Empty className="file-empty" description={this.locale.empty}/>;
            }
            const fileItemProps = {
                locale: this.locale,
                viewType,
                selectedCheck: this.selectedCheck,
                deleteFile: this.deleteFile,
                downloadFile: this.downloadFile,
                previewFile: this.previewFile,
                downloadId: currentDownloadId,
                downloadDisabled: !allowDownload,
                deletedDisabled: !allowDelete,
                previewDisabled: !allowPreview,
            };
            if (viewType === 'list') {
                return (<List itemLayout="vertical" dataSource={fileList} renderItem={(item, index) => (<FileItem index={index} {...fileItemProps} {...item}/>)}/>);
            }
            if (viewType === 'card') {
                return (<Row gutter={8} className="file-item-icon-box">
          {fileList.map((item, index) => {
                    return (<Col span={8} key={`file-item-${item.id || item.uid}`}>
                <FileItem index={index} {...fileItemProps} {...item}/>
              </Col>);
                })}
        </Row>);
            }
        };
        this.renderComponent = (localeItem) => {
            this.locale = localeItem;
            const { className, style } = this.props;
            const { showFileCategory, fileCategoryVisable } = this.state;
            return (<div className={cls(className, 'seid-attachment')} style={style}>
        <ToolBar className="attachment-tool-bar" layout={{ leftSpan: 18, rightSpan: 6 }} left={this.renderToolBarLeft()} right={this.renderToolBarRight()}/>
        <Row className="attachment-body">
          <Col className="attachment-file-category-box" span={showFileCategory && fileCategoryVisable ? 2 : 0}>
            附件分类列表
          </Col>
          <Col className="attachment-file-list-box" span={showFileCategory && fileCategoryVisable ? 22 : 24}>
            {this.renderItemList()}
          </Col>
        </Row>
      </div>);
        };
        const { showFileCategory, viewType, fileList = [] } = this.props;
        this.state = {
            showFileCategory,
            viewType,
            fileCategoryVisable: true,
            fileList: this.formatThumbUrl(fileList),
            viewTypeAnimate: '',
            downloading: false,
            currentDownloadId: null,
            errorFileCount: 0,
        };
    }
    componentDidMount() {
        const { onAttachmentRef } = this.props;
        if (onAttachmentRef) {
            onAttachmentRef(this);
        }
    }
    componentDidUpdate(preProps) {
        if (!isEqual(preProps.fileList, this.props.fileList)) {
            const { fileList = [] } = this.props;
            this.setState({
                fileList: this.formatThumbUrl(fileList),
            });
        }
    }
    render() {
        return (<SeidLocaleReceiver defaultLocale={defaultLocale} componentName="Attachment">
        {this.renderComponent}
      </SeidLocaleReceiver>);
    }
}
Attachment.defaultProps = {
    fileList: [],
    disabled: false,
    viewType: 'list',
    uploadUrl: 'edm-service/upload',
    thumbUrl: 'edm-service/download?isThumbnail=true&docId={id}',
    previewUrl: 'edm-service/preview/{id}',
    download: 'edm-service/download?docId={id}',
    watermark: '',
    allowUpload: true,
    allowDelete: true,
    allowDownload: true,
    allowPreview: true,
};
export default Attachment;
