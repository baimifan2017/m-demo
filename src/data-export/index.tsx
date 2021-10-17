import React, { ReactElement } from 'react';
import Button, { ButtonProps } from 'antd/es/button';
import xlsx from 'xlsx';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import moment from 'moment';
import { AxiosRequestConfig } from 'axios';
import { downloadFileByALink, request } from '../utils';

export interface IDataExportProps {
  requestParams?: AxiosRequestConfig;
  data?: any;
  filename?: string;
  filenameFormat?: string;
  sheetName?: string;
  explainResponse?: (response: any) => any;
  exportType?: 'xlsx' | 'txt';
}

// 请求数据
const requestData = async (requestParams: AxiosRequestConfig) => {
  return request({ ...requestParams });
};

const string2Blob = (content: string) => {
  return new Blob([content], { type: 'application/octet-stream' });
};

const downloadFile = (url: string | Blob, saveName: string) => {
  if (typeof url === 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  downloadFileByALink(url, saveName);
};

// 生成文件
const generateFile = (
  exportType: 'xlsx' | 'txt',
  data: any,
  sheetName: string = 'Sheet1',
  filename?: string,
  filenameFormat?: string,
) => {
  if (exportType === 'xlsx') {
    const sheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, sheet, sheetName);
    xlsx.writeFile(
      workbook,
      `${filename ? `${filename}.` : ''}${moment().format(filenameFormat)}.xlsx`,
    );
  } else {
    const sheet = xlsx.utils.json_to_sheet(data);
    const content = xlsx.utils.sheet_to_csv(sheet);
    const blob = string2Blob(content);
    downloadFile(blob, `${filename ? `${filename}.` : ''}${moment().format(filenameFormat)}.txt`);
  }
};

const DataExport = async (props: IDataExportProps) => {
  const {
    requestParams,
    data,
    filename,
    sheetName,
    explainResponse,
    exportType = 'xlsx',
    filenameFormat = 'YYYYMMDDHHmmss',
  } = props;
  let exportData: any = data;
  if (requestParams) {
    exportData = await requestData(requestParams);
    if (explainResponse) {
      exportData = explainResponse(exportData);
    }
  }
  generateFile(exportType, exportData, sheetName, filename, filenameFormat);
};

export const ExportButton = ({ ...props }: IDataExportProps & ButtonProps): ReactElement => {
  const names = [
    'requestParams',
    'data',
    'filename',
    'sheetName',
    'explainResponse',
    'exportType',
    'filenameFormat',
  ];
  const buttonProps: ButtonProps = omit(props, names);
  const exportProps: IDataExportProps = pick(props, names);
  return <Button {...buttonProps} onClick={() => DataExport(exportProps)} />;
};

DataExport.Button = ExportButton;

export default DataExport;
