import React, { ReactNode } from 'react';
import ResizeMe from '../ResizeMe';

export interface IResizeColProps {
  children: ReactNode;
}

const Parent = ({ children }: IResizeColProps) => <>{children}</>;

const ResizeCol = ResizeMe()(Parent);

export default ResizeCol;

