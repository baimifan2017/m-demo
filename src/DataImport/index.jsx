import React, { Component } from 'react';
import Button from 'antd/es/button';
import Upload from 'antd/es/upload';
import message from 'antd/es/message';
import Select from 'antd/es/select';
import xlsx from 'xlsx';
import uniqueId from 'lodash/uniqueId';
import ExtTable from '../ext-table';
import { downloadFileByALink } from '../utils';
import ExtModal from '../ext-modal';
import { getString } from '../_util/utils';
import LocaleReceiver from '../seid-locale-provider/SeidLocaleReceiver';
import defaultLocale from './locale';
const downloadFile = (download) => {
    if (!download) {
        return;
    }
    if (download instanceof Function) {
        download();
        return;
    }
    const strList = download.split('/');
    downloadFileByALink(download, strList[strList.length - 1]);
};
class DataImport extends Component {
    constructor(props) {
        super(props);
        this.locale = { locale: 'zh-cn' };
        this.getColumns = (locale) => {
            const { columns } = this.props;
            const initColumns = [
                {
                    dataIndex: 'status',
                    title: locale.status,
                    render: (text, record) => {
                        if (record.validate) {
                            return <div style={{ color: 'green' }}>{text}</div>;
                        }
                        return <div style={{ color: 'red' }}>{text}</div>;
                    },
                },
                {
                    dataIndex: 'message',
                    title: locale.message,
                },
            ];
            return initColumns.concat(columns);
        };
        this.handleChangeUploadVisible = () => {
            const { uploadVisible } = this.state;
            this.setState({ uploadVisible: !uploadVisible, fileList: [] });
        };
        this.handleChangeDataVisible = () => {
            const { dataShowVisible } = this.state;
            if (dataShowVisible) {
                this.setState({ dataShowVisible: false, fileList: [], tableData: [], validated: false });
                return;
            }
            this.setState({ dataShowVisible: !dataShowVisible });
        };
        this.handleChange = (fileObj) => {
            const { file, fileList } = fileObj;
            const { remote } = this.state;
            let files;
            const { onChange } = this.props;
            if (!this.beforeUpload(file)) {
                return;
            }
            if (file.status === 'done') {
                // 上传成功后，隐藏上传按钮，如果是remote, 执行查询，展示数据。
                if (remote) {
                    // empty TODO::上传至远程服务器
                }
                else {
                    // 如果不是remote, 解析excle, 保存数据并展示，展示数据。
                    const { originFileObj } = file;
                    this.analyzeXlsFile(originFileObj);
                }
            }
            files = fileList.map(fileItem => {
                if (fileItem.status === 'done') {
                    fileItem.uid = fileItem.response[0].id;
                }
                return fileItem;
            });
            if (file.status === 'error') {
                message.error('');
                files = fileList.filter((item) => item.status !== 'error');
            }
            if (onChange) {
                onChange(Object.assign({}, fileObj, { fileList: files }));
            }
            if (!('fileList' in this.props)) {
                this.setState({ fileList: files });
            }
        };
        this.analyzeXlsFile = (originFileObj) => {
            const fileReader = new FileReader();
            const _this = this;
            if (originFileObj) {
                fileReader.readAsBinaryString(originFileObj);
                fileReader.onloadend = function onLoad() {
                    const workbook = xlsx.read(this.result, { type: 'binary' });
                    const { Sheets, SheetNames } = workbook;
                    if (SheetNames && SheetNames.length) {
                        const sheet1 = Sheets[SheetNames[0]];
                        const jsonObj = xlsx.utils.sheet_to_json(sheet1);
                        // 删除第一行数据(固定为题头)
                        jsonObj.splice(0, 1);
                        jsonObj.forEach((item) => (item.key = uniqueId()));
                        _this.setState({ tableData: jsonObj, dataShowVisible: true, uploadVisible: false });
                    }
                };
            }
        };
        this.downloadTemplate = (value) => {
            const { templateFileList = [] } = this.props;
            if (value) {
                const tItem = templateFileList.find(i => i.key === value || i.fileName === value);
                this.setState({ currentTemplate: tItem });
                if (tItem) {
                    const { download } = tItem;
                    downloadFile(download);
                }
                return;
            }
            const { currentTemplate } = this.state;
            const item = currentTemplate || (templateFileList.length ? templateFileList[0] : { download: undefined });
            const { download: downloadUrl } = item;
            downloadFile(downloadUrl);
        };
        this.beforeUpload = (file) => {
            return (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel' ||
                file.name.endsWith('.xls') ||
                file.name.endsWith('.xlsx'));
        };
        this.freakCustomRequest = ({ file, onSuccess, onProgress }) => {
            onProgress({ percent: 100, status: 'uploading' }, file);
            new Promise(resolve => {
                resolve();
            }).then(() => {
                onSuccess([{ success: true, id: '-1' }], file);
            });
        };
        this.validateData = () => {
            const { tableData } = this.state;
            const { validateFunc } = this.props;
            if (tableData && tableData.length && validateFunc) {
                let newData = validateFunc(tableData);
                if (newData && Array.isArray(newData) && tableData.length === newData.length) {
                    const validated = newData.every(item => item.validate);
                    if (!validated) {
                        newData = newData.sort((a, b) => {
                            if (a.validate && !b.validate)
                                return 1;
                            if (!a.validate && b.validate)
                                return -1;
                            return 0;
                        });
                    }
                    this.setState({ validated, tableData: newData });
                }
                else {
                    throw new Error(this.locale.error1);
                }
            }
        };
        this.importData = () => {
            const { tableData, validated } = this.state;
            if (validated) {
                const { importFunc } = this.props;
                if (importFunc) {
                    importFunc([...tableData]);
                }
                this.setState({ dataShowVisible: false, tableData: [] });
            }
            else {
                message.error(this.locale.error2);
            }
        };
        this.renderComponent = (locale) => {
            const { templateFileList, action } = this.props;
            this.locale = locale;
            const { uploadVisible, fileList = [], tableData, dataShowVisible, validated, selectedTemplate, } = this.state;
            const columns = this.getColumns(locale);
            const uploadProps = {
                className: 'list',
                accept: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                onChange: this.handleChange,
                beforeUpload: this.beforeUpload,
                fileList,
                customRequest: action ? undefined : this.freakCustomRequest,
            };
            return (
                <  >
                (<Button type="primary" onClick={this.handleChangeUploadVisible}>
          {locale.import}
        </Button>
                    ,
                        (<ExtModal width={720} title={locale.fileUpload} destroyOnClose onCancel={this.handleChangeUploadVisible} visible={uploadVisible}>
          <div className="template-download">
            <span>{locale.templateDownload}:</span>
            <Select value={selectedTemplate} dropdownMatchSelectWidth={false} className="select" allowClear={false} onChange={(v) => this.setState({ selectedTemplate: v })}>
              {templateFileList.map(item => (<Select.Option key={item.key || item.fileName} value={item.key || item.fileName}>
                  {item.fileName}
                </Select.Option>))}
            </Select>
            <Button type="primary" onClick={() => this.downloadTemplate()}>
              {locale.download}
            </Button>
          </div>
          <Upload {...uploadProps}>
            <div className="upload-tool-bar">
              {!fileList.length && (<Button disabled={uploadProps.disabled} type="primary" icon="upload" style={{ marginRight: 5 }}>
                  {locale.upload}
                </Button>)}
            </div>
          </Upload>
        </ExtModal>
                            ,
                                <ExtModal width="98%" visible={dataShowVisible} title={locale.validateData} okText={validated ? locale.import : locale.validate} cancelText={locale.cancel} onOk={validated ? this.importData : this.validateData} onCancel={this.handleChangeDataVisible}>
          <ExtTable checkbox={false} columns={columns} dataSource={tableData}/>
        </ExtModal>)));
             >
            ;
            ;
        };
        const { action, customRequest, templateFileList } = props;
        const defaultTemplateFile = templateFileList && templateFileList.length
            ? templateFileList[0]
            : {
                key: undefined,
                fileName: undefined,
                download: '',
            };
        this.state = {
            tableData: [],
            uploadVisible: false,
            remote: !!(action || customRequest),
            selectedTemplate: getString(defaultTemplateFile.key || defaultTemplateFile.fileName),
        };
    }
    static getDerivedStateFromProps(nextProps) {
        if (nextProps.fileList) {
            return {
                fileList: nextProps.fileList,
            };
        }
        return null;
    }
    render() {
        return (<LocaleReceiver componentName="DataImport" defaultLocale={defaultLocale}>
        {this.renderComponent}
      </LocaleReceiver>);
    }
}
DataImport.defaultProps = {
    templateFileList: [],
    columns: [],
};
export default DataImport;
