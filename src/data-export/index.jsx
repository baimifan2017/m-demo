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
import Button from 'antd/es/button';
import xlsx from 'xlsx';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import moment from 'moment';
import { downloadFileByALink, request } from '../utils';
// 请求数据
const requestData = (requestParams) => __awaiter(this, void 0, void 0, function* () {
    return request(Object.assign({}, requestParams));
});
const string2Blob = (content) => {
    return new Blob([content], { type: 'application/octet-stream' });
};
const downloadFile = (url, saveName) => {
    if (typeof url === 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    downloadFileByALink(url, saveName);
};
// 生成文件
const generateFile = (exportType, data, sheetName = 'Sheet1', filename, filenameFormat) => {
    if (exportType === 'xlsx') {
        const sheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, sheet, sheetName);
        xlsx.writeFile(workbook, `${filename ? `${filename}.` : ''}${moment().format(filenameFormat)}.xlsx`);
    }
    else {
        const sheet = xlsx.utils.json_to_sheet(data);
        const content = xlsx.utils.sheet_to_csv(sheet);
        const blob = string2Blob(content);
        downloadFile(blob, `${filename ? `${filename}.` : ''}${moment().format(filenameFormat)}.txt`);
    }
};
const DataExport = (props) => __awaiter(this, void 0, void 0, function* () {
    const { requestParams, data, filename, sheetName, explainResponse, exportType = 'xlsx', filenameFormat = 'YYYYMMDDHHmmss', } = props;
    let exportData = data;
    if (requestParams) {
        exportData = yield requestData(requestParams);
        if (explainResponse) {
            exportData = explainResponse(exportData);
        }
    }
    generateFile(exportType, exportData, sheetName, filename, filenameFormat);
});
export const ExportButton = (_a) => {
    var props = __rest(_a, []);
    const names = [
        'requestParams',
        'data',
        'filename',
        'sheetName',
        'explainResponse',
        'exportType',
        'filenameFormat',
    ];
    const buttonProps = omit(props, names);
    const exportProps = pick(props, names);
    return <Button {...buttonProps} onClick={() => DataExport(exportProps)}/>;
};
DataExport.Button = ExportButton;
export default DataExport;
