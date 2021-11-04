var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { Component } from 'react';
import { Upload, Tooltip, Popover, Icon, Modal, Progress, message, Spin, Result } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { injectIntl } from 'react-intl';
const { Dragger } = Upload;
class PicSearcher extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            loading: false,
            modalVisible: false,
            popoverVisible: false,
            icons: [],
            fileList: [],
            error: false,
            modelLoaded: false,
        };
        this.loadModel = () => {
            const script = document.createElement('script');
            script.onload = () => __awaiter(this, void 0, void 0, function* () {
                yield window.antdIconClassifier.load();
                this.setState({ modelLoaded: true });
                document.addEventListener('paste', this.onPaste);
            });
            script.src = 'https://cdn.jsdelivr.net/gh/lewis617/antd-icon-classifier@0.0/dist/main.js';
            document.head.appendChild(script);
        };
        this.onPaste = (event) => {
            const items = event.clipboardData && event.clipboardData.items;
            let file = null;
            if (items && items.length) {
                for (let i = 0; i < items.length; i += 1) {
                    if (items[i].type.indexOf('image') !== -1) {
                        file = items[i].getAsFile();
                        break;
                    }
                }
            }
            if (file)
                this.uploadFile(file);
        };
        this.uploadFile = (file) => {
            this.setState(() => ({ loading: true }));
            const reader = new FileReader();
            reader.onload = () => {
                this.toImage(reader.result).then(this.predict);
                this.setState(() => ({
                    fileList: [{ uid: 1, name: file.name, status: 'done', url: reader.result }],
                }));
            };
            reader.readAsDataURL(file);
        };
        this.toImage = (url) => {
            return new Promise(resolve => {
                const img = new Image();
                img.setAttribute('crossOrigin', 'anonymous');
                img.src = url;
                img.onload = function onload() {
                    resolve(img);
                };
            });
        };
        this.predict = (imgEl) => {
            try {
                let icons = window.antdIconClassifier.predict(imgEl);
                if (gtag && icons.length >= 1) {
                    gtag('event', 'icon', {
                        event_category: 'search-by-image',
                        event_label: icons[0].className,
                    });
                }
                icons = icons.map((i) => ({ score: i.score, type: i.className.replace(/\s/g, '-') }));
                this.setState(() => ({ icons, loading: false, error: false }));
            }
            catch (err) {
                this.setState(() => ({ loading: false, error: true }));
            }
        };
        this.toggleModal = () => {
            this.setState(prev => ({
                modalVisible: !prev.modalVisible,
                popoverVisible: false,
                fileList: [],
                icons: [],
            }));
            if (!localStorage.getItem('disableIconTip')) {
                localStorage.setItem('disableIconTip', 'true');
            }
        };
        this.onCopied = (text) => {
            message.success(<span>
        <code className="copied-code">{text}</code> copied 🎉
      </span>);
        };
    }
    componentDidMount() {
        this.loadModel();
        this.setState({ popoverVisible: !localStorage.getItem('disableIconTip') });
    }
    componentWillUnmount() {
        document.removeEventListener('paste', this.onPaste);
    }
    render() {
        const { intl: { messages }, } = this.props;
        const { modalVisible, popoverVisible, icons, fileList, loading, modelLoaded, error, } = this.state;
        return (<div className="icon-pic-searcher">
        <Popover content={messages[`app.docs.components.icon.pic-searcher.intro`]} visible={popoverVisible}>
          <Icon type="camera" className="icon-pic-btn" onClick={this.toggleModal}/>
        </Popover>
        <Modal title={messages[`app.docs.components.icon.pic-searcher.title`]} visible={modalVisible} onCancel={this.toggleModal} footer={null}>
          {modelLoaded || (<Spin spinning={!modelLoaded} tip={messages['app.docs.components.icon.pic-searcher.modelloading']}>
              <div style={{ height: 100 }}/>
            </Spin>)}
          {modelLoaded && (<Dragger accept="image/jpeg, image/png" listType="picture" customRequest={(o) => this.uploadFile(o.file)} fileList={fileList} showUploadList={{ showPreviewIcon: false, showRemoveIcon: false }}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox"/>
              </p>
              <p className="ant-upload-text">
                {messages['app.docs.components.icon.pic-searcher.upload-text']}
              </p>
              <p className="ant-upload-hint">
                {messages['app.docs.components.icon.pic-searcher.upload-hint']}
              </p>
            </Dragger>)}
          <Spin spinning={loading} tip={messages['app.docs.components.icon.pic-searcher.matching']}>
            <div className="icon-pic-search-result">
              {icons.length > 0 && (<div className="result-tip">
                  {messages['app.docs.components.icon.pic-searcher.result-tip']}
                </div>)}
              <table>
                {icons.length > 0 && (<thead>
                    <tr>
                      <th className="col-icon">
                        {messages['app.docs.components.icon.pic-searcher.th-icon']}
                      </th>
                      <th>{messages['app.docs.components.icon.pic-searcher.th-score']}</th>
                    </tr>
                  </thead>)}
                <tbody>
                  {icons.map((icon) => (<tr key={icon.type}>
                      <td className="col-icon">
                        <CopyToClipboard text={`<Icon type="${icon.type}" />`} onCopy={this.onCopied}>
                          <Tooltip title={icon.type} placement="right">
                            <Icon type={icon.type}/>
                          </Tooltip>
                        </CopyToClipboard>
                      </td>
                      <td>
                        <Progress percent={Math.ceil(icon.score * 100)}/>
                      </td>
                    </tr>))}
                </tbody>
              </table>
              {error && (<Result status="500" title="503" subTitle={messages['app.docs.components.icon.pic-searcher.server-error']}/>)}
            </div>
          </Spin>
        </Modal>
      </div>);
    }
}
export default injectIntl(PicSearcher);
