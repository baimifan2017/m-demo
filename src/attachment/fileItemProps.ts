import { ReactNode } from 'react';
import { UploadFile } from 'antd/es/upload/interface';
import { LocaleItem } from '../locale';
import { ViewType } from './Attachment';

type DataType = 'text' | 'date';

export interface SecondField {
  title: string;
  dataKey: string;
  dataType?: DataType;
}

export interface IUploadFile extends UploadFile {
  id?: string;
  ocrData?: string;
  description?: string;
  fileSize?: string;
  documentTypeEnum?: string;
  documentTypeEnumRemark?: string;
  uploadedTime?: string;
  selected?: boolean;
  extra?: (file: IUploadFile) => ReactNode;
  secondFields?: SecondField[];
  deletedDisabled?: boolean;
  downloadDisabled?: boolean;
  previewDisabled?: boolean;
}

export default interface IFileItemProps extends IUploadFile {
  index?: number;
  locale: LocaleItem;
  disabled?: boolean;
  viewType: ViewType;
  deleteFile?: (file: IUploadFile) => void;
  downloadFile?: (file: IUploadFile) => void;
  previewFile?: (file: IUploadFile) => void;
  selectedCheck: (selectedFile: IUploadFile) => void;
  downloadId: string | null;
}
