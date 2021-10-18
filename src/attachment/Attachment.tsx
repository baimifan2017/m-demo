import React, { CSSProperties } from 'react';
import get from 'lodash/get';
import isString from 'lodash/isString';
import omit from 'lodash/omit';
import cls from 'classnames';
import isEqual from 'react-fast-compare';
import Tooltip from 'antd/es/tooltip';
import Popconfirm from 'antd/es/popconfirm';
import Button, { ButtonProps } from 'antd/es/button';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import List from 'antd/es/list';
import Empty from 'antd/es/empty';
import message from 'antd/es/message';
import Dropdown from 'antd/es/dropdown';
import Menu from 'antd/es/menu';
import { RcCustomRequestOptions } from 'antd/es/upload/interface';
import Upload, { RcFile, UploadChangeParam, UploadProps } from 'antd/es/upload';
import { request, formatMsg } from '../utils';
import { ResponseResult, AxiosRequestConfig, AxiosResponse } from '../utils/request';
import ExtIcon from '../ExtIcon';
import Animate from '../Animate';
import ToolBar from '../ToolBar';
import defaultLocale from './locale';
import { LocaleItem } from '../locale';
import SeidLocaleReceiver from '../seid-locale-provider/SeidLocaleReceiver';
import { isPhoto } from '../_util/utils';
import FileItem from './FileItem';
import { IUploadFile } from './fileItemProps';
import './style/index.less'

export type ViewType = 'list' | 'card';

// 文件上传接口回调
const thenProcess = (option: RcCustomRequestOptions, res: ResponseResult) => {
  const { file, onSuccess, onError } = option;
  if (get(res, 'success')) {
    onSuccess(res.data, file);
  } else {
    message.error(get(res, 'message'));
    onError(get(res, 'message'));
  }
};

export interface RightMenuItem {
  title: string;
  key: string;
  icon?: string;
  disabled?: boolean;
}

export function toolRightMenuData(locale: LocaleItem) {
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

export const blobToFile = (res: AxiosResponse, filename?: string) => {
  const { data, headers } = res;
  const name: string = filename || decodeURI(headers['content-disposition'].split('=')[1]);
  const eLink: HTMLAnchorElement = document.createElement('a');
  eLink.download = name;
  eLink.style.display = 'none';
  eLink.href = URL.createObjectURL(data);
  document.body.appendChild(eLink);
  eLink.click();
  URL.revokeObjectURL(eLink.href); // 释放URL 对象
  document.body.removeChild(eLink);
};

export interface IAttachmentProps
  extends Omit<UploadProps, 'className' | 'style' | 'disabled' | 'fileList' | 'onChange'> {
  className?: string;
  allowUpload?: boolean;
  allowDelete?: boolean;
  allowDownload?: boolean;
  allowPreview?: boolean;
  watermark?: string | boolean;
  showFileCategory?: boolean;
  viewType: ViewType;
  style?: CSSProperties;
  uploadButton?: ButtonProps;
  maxUploadNum?: number;
  serviceHost?: string;
  uploadUrl?: string;
  fileList?: IUploadFile[];
  download?: (files: IUploadFile[]) => AxiosRequestConfig | string;
  thumbUrl?: (file: IUploadFile) => string | string;
  previewUrl?: (file: IUploadFile) => string | string;
  onSelectFile: (files: IUploadFile[]) => void;
  onDeleteFile: (files: IUploadFile[]) => void;
  onChange?: (fileList: IUploadFile[]) => void;
  toolExtras?: RightMenuItem[];
  toolExtrasAction?: (key: string) => void;
  onAttachmentRef?: (ref: any) => void;
  limitFileExt?: string[];
}

type IAttachmentState = {
  fileList?: IUploadFile[];
  showFileCategory?: boolean;
  viewType: ViewType;
  fileCategoryVisable?: boolean;
  viewTypeAnimate: string;
  downloading?: boolean;
  currentDownloadId: string | null;
  errorFileCount: number;
};

class Attachment extends React.Component<IAttachmentProps, IAttachmentState> {
  locale: LocaleItem;

  protected upload: Upload | null;

  protected promiseList: Array<
    Promise<{ response: ResponseResult; option: RcCustomRequestOptions }>
  > = [];

  protected uploadFileListLength: number;

  protected processedFileNumber: number = 0;

  protected processArgs: RcCustomRequestOptions[] = [];

  static defaultProps = {
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

  constructor(props: IAttachmentProps) {
    super(props);
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

  componentDidUpdate(preProps: IAttachmentProps) {
    if (!isEqual(preProps.fileList, this.props.fileList)) {
      const { fileList = [] } = this.props;
      this.setState({
        fileList: this.formatThumbUrl(fileList),
      });
    }
  }

  formatThumbUrl = (fileList: IUploadFile[]) => {
    const { thumbUrl, serviceHost } = this.props;
    return fileList.map(file => {
      if (file.status === 'done' && !file.thumbUrl && isPhoto(file.name)) {
        let url = '';
        if (isString(thumbUrl)) {
          url = formatMsg(serviceHost ? `${serviceHost}/${thumbUrl}` : thumbUrl, {
            id: file.id,
          });
        } else if (thumbUrl instanceof Function) {
          url = thumbUrl(file);
        }
        file.thumbUrl = url;
      }
      return file;
    });
  };

  getAttachmentData = () => {
    const { fileList, errorFileCount } = this.state;
    return { fileList, errorFileCount };
  };

  handlerBeforeUpload = (file: RcFile) => {
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

  beforeUpload = (file: RcFile, fileList: RcFile[]): boolean | PromiseLike<void> => {
    const { beforeUpload } = this.props;
    this.uploadFileListLength = fileList.length;
    if (beforeUpload) {
      return beforeUpload(file, fileList);
    }
    return this.handlerBeforeUpload(file);
  };

  handlerUpload = (option: RcCustomRequestOptions): void => {
    const { uploadUrl } = this.props;
    if (uploadUrl) {
      this.processArgs.push(option);
      if (this.processArgs.length === this.uploadFileListLength) {
        this.startUpload();
      }
    }
  };

  startUpload = async () => {
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
          const responses: {
            response: ResponseResult;
            option: RcCustomRequestOptions;
            // eslint-disable-next-line no-await-in-loop
          }[] = await Promise.all(this.promiseList);
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
          const responses: {
            response: ResponseResult;
            option: RcCustomRequestOptions;
            // eslint-disable-next-line no-await-in-loop
          }[] = await Promise.all(this.promiseList);
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
  };

  processRequest = (
    data: FormData,
    option: RcCustomRequestOptions,
  ): Promise<{ response: ResponseResult; option: RcCustomRequestOptions }> => {
    const { uploadUrl, serviceHost } = this.props;
    const { onProgress } = option;
    const uploadPath = serviceHost ? `${serviceHost}/${uploadUrl}` : uploadUrl;
    return new Promise(resolve => {
      request({
        url: uploadPath,
        method: 'POST',
        data,
        onUploadProgress: ({ loaded, total }: any) => {
          const percent = Number(Math.round((loaded / total) * 100).toFixed(2));
          onProgress({ percent }, option.file);
        },
        headers: {
          neverCancel: true,
        },
      })
        .then((res: ResponseResult) => {
          resolve({
            option,
            response: res,
          });
        })
        .catch((error: ResponseResult) => resolve({ response: error, option }));
    });
  };

  downloadFile = (file: IUploadFile) => {
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
      } else if (download instanceof Function) {
        this.setState({ downloading: true });
        const config = download([file]) as AxiosRequestConfig;
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

  batchDownloadFiles = () => {
    message.info('此功能正在内测中...');
  };

  deleteFile = (file: IUploadFile) => {
    const { fileList = [] } = this.state;
    const newFileList = fileList.filter(f => (file.id && f.id !== file.id) || f.uid !== file.uid);
    this.setState({ fileList: newFileList }, () => {
      const { onDeleteFile } = this.props;
      if (onDeleteFile) {
        onDeleteFile([file]);
      }
    });
  };

  batchDeleteFiles = () => {
    const { fileList = [] } = this.state;
    const newFileList = fileList.filter(f => !f.selected);
    const deleteFileList = fileList.filter(f => f.selected && !f.deletedDisabled);
    const deletedDisabledFileList = fileList.filter(f => f.selected && f.deletedDisabled);
    this.setState(
      {
        fileList: newFileList.concat(deletedDisabledFileList),
      },
      () => {
        const { onDeleteFile } = this.props;
        if (onDeleteFile) {
          onDeleteFile(deleteFileList);
        }
      },
    );
  };

  previewFile = () => {};

  handlerChange = (fileInfo: UploadChangeParam) => {
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
      } else if (thumbUrl instanceof Function) {
        url = thumbUrl(file as IUploadFile);
      }
      fileList.forEach((item, index) => {
        if (item.uid === file.uid) {
          fileList.splice(index, 1, { ...item, ...file, thumbUrl: url });
        }
      });
    }
    // 过滤掉beforeUpload返回false时的文件list
    const filterList: IUploadFile[] = fileList
      .filter(list => list.status)
      .map((f: IUploadFile) => {
        if (f.status === 'done') {
          f.id = get(f, 'response[0].id');
        } else {
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

  renderFileUpload = () => {
    const { uploadButton, ...rest } = this.props;
    const { fileList } = this.state;
    const uploadProps = omit(rest || {}, [...omitProps, 'fileList']);
    const buttonProps = omit(uploadButton || {}, ['onClick']);
    return (
      <div className={cls('seid-file-upload')}>
        <Upload
          {...uploadProps}
          showUploadList={false}
          beforeUpload={this.beforeUpload}
          customRequest={async options => this.handlerUpload(options)}
          onChange={this.handlerChange}
          fileList={fileList}
          ref={node => (this.upload = node)}
        >
          {uploadProps.allowUpload ? (
            <Button type="primary" icon="upload" {...buttonProps}>
              {this.locale.upload}
            </Button>
          ) : null}
        </Upload>
      </div>
    );
  };

  renderToolBarLeft = () => {
    const { downloading, fileList = [] } = this.state;
    const selectedFileList = fileList.filter(file => file.selected);
    const downloadFileList = selectedFileList.filter(file => !file.downloadDisabled);
    const uploadedFileList = downloadFileList.filter(file => file.id);
    const deleteFileList = selectedFileList.filter(file => !file.deletedDisabled);
    return (
      <div className="tool-action">
        <div className={cls('action-item')}>{this.renderFileUpload()}</div>
        {selectedFileList.length > 0 ? (
          <>
            {uploadedFileList.length === downloadFileList.length ? (
              <div className={cls('action-item')}>
                <Button icon="download" loading={downloading} onClick={this.batchDownloadFiles}>
                  {`${this.locale.download}(${downloadFileList.length})`}
                </Button>
              </div>
            ) : null}
            {deleteFileList.length > 0 ? (
              <div className={cls('action-item')}>
                <Popconfirm
                  title={formatMsg(this.locale.batchDeleteConfirm, {
                    count: deleteFileList.length,
                  })}
                  key="batch-delete-confirm"
                  onConfirm={() => this.batchDeleteFiles()}
                >
                  <Button type="danger">{`${this.locale.delete}(${deleteFileList.length})`}</Button>
                </Popconfirm>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    );
  };

  handlerViewType = () => {
    let { viewType } = this.state;
    if (viewType === 'list') {
      viewType = 'card';
    } else {
      viewType = 'list';
    }
    this.setState({ viewType, viewTypeAnimate: 'bounceIn' });
  };

  renderViewType = () => {
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
    return (
      <div className={cls('tool-item')} onClick={this.handlerViewType}>
        <Animate type={viewTypeAnimate} callback={() => this.setState({ viewTypeAnimate: '' })}>
          <Tooltip title={get(this.locale, localeKey)}>
            <ExtIcon {...extIconProps} />
          </Tooltip>
        </Animate>
      </div>
    );
  };

  onToolActionOperation = (e: any) => {
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

  getToolBarRightMenu = () => {
    const { toolExtras } = this.props;
    let menuData = toolRightMenuData(this.locale) as RightMenuItem[];
    if (toolExtras) {
      menuData = menuData.concat(toolExtras);
    }
    return (
      <Menu
        className={cls('seid-attchment-tool-menu-box')}
        onClick={e => this.onToolActionOperation(e)}
      >
        {menuData.map(m => (
          <Menu.Item key={m.key} disabled={m.disabled}>
            {m.icon ? <ExtIcon type={m.icon} /> : null}
            {m.title}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  renderToolBarRight = () => {
    return (
      <div className="tool-box">
        {this.renderViewType()}

        <Dropdown
          trigger={['click']}
          className="tool-drop-down"
          overlay={this.getToolBarRightMenu()}
        >
          <div className={cls('tool-item')}>
            <ExtIcon type="more" antd />
          </div>
        </Dropdown>
      </div>
    );
  };

  selectAll = () => {
    const { onSelectFile } = this.props;
    const { fileList = [] } = this.state;
    fileList.forEach(file => {
      file.selected = true;
    });
    this.setState(
      {
        fileList,
      },
      () => {
        if (onSelectFile && onSelectFile instanceof Function) {
          onSelectFile(fileList);
        }
      },
    );
  };

  reverseSelect = () => {
    const { onSelectFile } = this.props;
    const { fileList = [] } = this.state;
    fileList.forEach(file => {
      if (file.selected) {
        file.selected = false;
      } else {
        file.selected = true;
      }
    });
    this.setState(
      {
        fileList,
      },
      () => {
        if (onSelectFile && onSelectFile instanceof Function) {
          onSelectFile(fileList);
        }
      },
    );
  };

  selectedCheck = (selectedFile: IUploadFile) => {
    const { onSelectFile } = this.props;
    let { fileList = [] } = this.state;
    const id = selectedFile.id || selectedFile.uid;
    fileList = fileList.map(f => {
      if (f.id === id || f.uid === id) {
        if (f.selected) {
          f.selected = false;
        } else {
          f.selected = true;
        }
      }
      return f;
    });
    this.setState(
      {
        fileList,
      },
      () => {
        if (onSelectFile && onSelectFile instanceof Function) {
          const selectFiles = fileList.filter(f => f.selected);
          onSelectFile(selectFiles);
        }
      },
    );
  };

  renderItemList = () => {
    const { allowDelete, allowDownload, allowPreview } = this.props;
    const { fileList = [], currentDownloadId, viewType } = this.state;
    if (fileList.length === 0) {
      return <Empty className="file-empty" description={this.locale.empty} />;
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
      return (
        <List
          itemLayout="vertical"
          dataSource={fileList}
          renderItem={(item: IUploadFile, index) => (
            <FileItem index={index} {...fileItemProps} {...item} />
          )}
        />
      );
    }
    if (viewType === 'card') {
      return (
        <Row gutter={8} className="file-item-icon-box">
          {fileList.map((item: IUploadFile, index) => {
            return (
              <Col span={8} key={`file-item-${item.id || item.uid}`}>
                <FileItem index={index} {...fileItemProps} {...item} />
              </Col>
            );
          })}
        </Row>
      );
    }
  };

  renderComponent = (localeItem: LocaleItem) => {
    this.locale = localeItem;
    const { className, style } = this.props;
    const { showFileCategory, fileCategoryVisable } = this.state;
    return (
      <div className={cls(className, 'seid-attachment')} style={style}>
        <ToolBar
          className="attachment-tool-bar"
          layout={{ leftSpan: 18, rightSpan: 6 }}
          left={this.renderToolBarLeft()}
          right={this.renderToolBarRight()}
        />
        <Row className="attachment-body">
          <Col
            className="attachment-file-category-box"
            span={showFileCategory && fileCategoryVisable ? 2 : 0}
          >
            附件分类列表
          </Col>
          <Col
            className="attachment-file-list-box"
            span={showFileCategory && fileCategoryVisable ? 22 : 24}
          >
            {this.renderItemList()}
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    return (
      <SeidLocaleReceiver defaultLocale={defaultLocale} componentName="Attachment">
        {this.renderComponent}
      </SeidLocaleReceiver>
    );
  }
}

export default Attachment;
