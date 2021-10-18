import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Method, AxiosRequestConfig } from 'axios';
import Table, { TableProps, TableRowSelection, RowSelectionType } from 'antd/es/table'
import Input from 'antd/es/input';
import { isBoolean, sortedUniq } from 'lodash';
import omit from 'omit.js';
import { PaginationProps } from 'antd/es/pagination';
import { Resizable } from 'react-resizable';
import cls from 'classnames';
import PerfectScrollbar from 'perfect-scrollbar';
import isEqual from 'react-fast-compare';
import SeidLocaleReceiver from '../seid-locale-provider/SeidLocaleReceiver';
import Panel, { Size } from '../panel';
import ToolBar, { IToolBarProps } from '../ToolBar';
import defaultLocale from './locale';
import { LocaleItem } from '../locale';
import IColumnProps from './columnProps';
import StoreProps from './storeProps';
import ExtTool from './ExtTool';
import GUID from './guid';
import { formatMsg, objectAssignAppend, request, storage } from '../utils';
import './style/index.less'
const { Search } = Input;

const blankColumn = {
  title: '',
  key: '_blank_workspace',
  disableCustomize: true,
};

export interface ICheckboxProps {
  // 是否通过点击行来进行选中
  rowCheck?: boolean;
  // 是否多选
  multiSelect: boolean;
}

export interface Reader {
  dataReader?: string;
  totalReader?: string;
}

export interface IExtTableProps<T>
  extends Omit<TableProps<T>, 'rowSelection' | 'columns' | 'pagination' | 'rowKey' | 'title'> {
  columns?: IColumnProps<T>[];
  toolBar?: IToolBarProps;
  remotePaging?: boolean;
  height?: number;
  width?: number | string;
  title?: string;
  store?: StoreProps;
  cascadeParams?: object;
  selectedRowKeys: string[];
  checkbox?: boolean | ICheckboxProps;
  onSelectRow?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  onTableRef?: (ref: any) => void;
  showSearch?: boolean;
  searchPlaceHolder?: string;
  searchProperties?: string[];
  ellipsis?: boolean;
  pagination: boolean | PaginationProps;
  rowKey: ((item: T) => string) | string;
  summary?: ReactNode;
  storageId?: GUID;
  reader?: Reader;
  loading?: boolean;
}

export interface SortConfig {
  sortCol: string;
  sort: 'asc' | 'desc';
}

declare interface IExtTableState<T> {
  loading?: boolean;
  scrollWidth: number;
  scrollHeight: number;
  wrappedHeight?: number;
  selectedRowKeys: string[];
  selectedRows: T[];
  renderColumns: IColumnProps<T>[];
  gridData: T[];
  pagination: boolean | PaginationProps;
  checkType?: RowSelectionType;
  checkboxConfig?: ICheckboxProps;
}

const ResizeableTitle = (props: any) => {
  const { onResize, width, disableCustomize, ...restProps } = props;
  if (!width || disableCustomize) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const defaultPageSize = 30;

const defaultPageSizeOptions = ['30', '50', '100'];

const defaultHeight = 460;

const defaultPaginationHeight = 48;

class ExtTable<T> extends Component<IExtTableProps<T>, IExtTableState<T>> {
  protected panel: any;

  protected dataTable: any;

  protected ps: PerfectScrollbar | null = null;

  protected toolBar: any;

  protected locale: LocaleItem | undefined;

  protected data: T[];

  protected quickSearchValue: string = '';

  protected components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  protected extTool: any;

  static defaultProps = {
    loading: false,
    pagination: true,
    rowKey: 'id',
    ellipsis: true,
    height: defaultHeight,
    dataSource: [],
    showSearch: true,
    searchPlaceHolder: '',
    selectedRowKeys: [],
    searchProperties: ['code', 'name'],
  };

  constructor(props: IExtTableProps<T>) {
    super(props);
    const { dataSource, pagination, columns, loading, height, selectedRowKeys } = props;
    const gridData = (dataSource ? [...dataSource] : []) as T[];
    this.data = [...gridData];
    const paginationTmp =
      pagination === false
        ? false
        : ({
            current: 1,
            pageSize: defaultPageSize,
            total: gridData.length,
            showSizeChanger: true,
            pageSizeOptions: defaultPageSizeOptions,
            ...(isBoolean(pagination) ? {} : pagination),
          } as PaginationProps);
    const checkboxConfig = this.getCheckboxConfig();
    let checkType: RowSelectionType = 'radio';
    if (checkboxConfig && checkboxConfig.multiSelect) {
      checkType = 'checkbox';
    }
    if (!isBoolean(paginationTmp) && paginationTmp.pageSizeOptions && paginationTmp.pageSize) {
      paginationTmp.pageSizeOptions.push(paginationTmp.pageSize.toString());
      const tmp = paginationTmp.pageSizeOptions.map((s: string) => Number(s));
      paginationTmp.pageSizeOptions = sortedUniq(tmp.sort((a, b) => a - b)).map((s: number) =>
        s.toString(),
      );
    }
    this.state = {
      loading,
      gridData,
      wrappedHeight: height || defaultHeight,
      scrollWidth: 0,
      scrollHeight: 0,
      renderColumns: this.getStorageColumns() || this.getRenderColumns(columns),
      pagination: paginationTmp,
      selectedRowKeys,
      selectedRows: [],
      checkType,
      checkboxConfig,
    };
  }

  componentDidMount() {
    const { onTableRef } = this.props;
    if (onTableRef) {
      onTableRef(this);
    }
    this.remoteDataRefresh();
  }

  componentDidUpdate(prevProps: IExtTableProps<T>) {
    const {
      cascadeParams,
      loading,
      selectedRowKeys,
      dataSource,
      pagination: paginationProps,
    } = this.props;
    if (!isEqual(prevProps.cascadeParams, cascadeParams)) {
      const { pagination } = this.state;
      let paginationTmp: PaginationProps | boolean = pagination;
      if (!isBoolean(pagination)) {
        paginationTmp = {
          ...pagination,
          current: 1,
        };
      }
      this.setState({ pagination: paginationTmp }, this.getData);
    }
    if (!isEqual(prevProps.loading, loading)) {
      this.setState({
        loading,
      });
    }
    if (!isEqual(prevProps.selectedRowKeys, selectedRowKeys)) {
      this.setState({
        selectedRowKeys,
      });
    }
    if (!isEqual(prevProps.dataSource, dataSource)) {
      this.data = dataSource ? [...dataSource] : [];
      const { pagination } = this.state;
      const gridData = (dataSource ? [...dataSource] : []) as T[];
      let paginationTmp: PaginationProps | boolean = pagination;
      if (!isBoolean(pagination)) {
        paginationTmp = {
          ...pagination,
          ...(isBoolean(paginationProps) ? {} : paginationProps),
          current: 1,
          total: gridData.length,
        };
      }
      this.setState(
        {
          gridData,
          pagination: paginationTmp,
        },
        () => {
          this.onTableResize();
        },
      );
    }
  }

  remoteDataRefresh = () => {
    const { store } = this.props;
    if (store) {
      const { pagination } = this.state;
      let paginationTmp: PaginationProps | boolean = pagination;
      if (!isBoolean(pagination)) {
        paginationTmp = {
          ...pagination,
          current: 1,
        };
      }
      this.setState({ pagination: paginationTmp }, this.getData);
    }
  };

  getStorageColumns = (): IColumnProps<T>[] | undefined => {
    let targetCols = this.getStorage();
    if (targetCols) {
      targetCols = this.getRenderColumns(targetCols);
    }
    return targetCols;
  };

  getStorage = (): IColumnProps<T>[] | undefined => {
    const { storageId, columns = [] } = this.props;
    let storageCols;
    if (storageId) {
      storageCols = storage.localStorage.get(storageId.toString());
      if (storageCols) {
        storageCols.forEach((col: any) => {
          for (let i = 0; i < columns.length; i += 1) {
            const originCol: any = columns[i];
            if (originCol.dataIndex === col.dataIndex) {
              Object.keys(originCol).forEach((originKey: any) => {
                if (originCol[originKey] instanceof Function) {
                  col[originKey] = originCol[originKey];
                }
              });
              break;
            }
          }
        });
      }
    }
    return storageCols;
  };

  saveToggleToStorage = (targetColumns: IColumnProps<T>[], needSave: boolean | undefined) => {
    const { storageId } = this.props;
    if (storageId) {
      if (needSave) {
        storage.localStorage.set(storageId.toString(), targetColumns);
      } else {
        storage.localStorage.clear(storageId.toString());
      }
    }
  };

  getCheckboxConfig = (): ICheckboxProps | undefined => {
    const { checkbox } = this.props;
    const checkboxConfig: ICheckboxProps = {
      rowCheck: true,
      multiSelect: true,
    };
    if (!isBoolean(checkbox)) {
      Object.assign(checkboxConfig, checkbox);
    }
    return checkboxConfig;
  };

  onColumnCheckedChange = (targetColumns: IColumnProps<T>[]) => {
    this.setState(
      {
        renderColumns: this.getRenderColumns(targetColumns),
      },
      () => {
        this.onTableResize();
        if (this.getStorage()) {
          this.saveToggleToStorage(targetColumns, true);
        }
      },
    );
  };

  getRenderColumns = (columns: IColumnProps<T>[] = []) => {
    const cols = columns.filter((col: IColumnProps<T>) => col.required || !col.optional);
    cols.forEach((col: IColumnProps<T>) => {
      if (!col.width) {
        col.width = 120;
      }
    });
    const { columns: oringinColumns = [], storageId } = this.props;
    const extToolProps = {
      columns: oringinColumns.filter(col => col.dataIndex || col.key),
      targetColumns: [...cols],
      onColumnCheckedChange: this.onColumnCheckedChange,
      saveToggleToStorage: this.saveToggleToStorage,
      storageId,
      hasStorage: !!this.getStorage(),
    };
    const sequence = {
      title: <ExtTool ref={node => (this.extTool = node)} {...extToolProps} />,
      key: '_seq',
      width: 80,
      align: 'center',
      required: true,
      fixed: 'left',
      disableCustomize: true,
      className: 'row-seq',
      render: (_text: any, _record: T, index: number) => {
        const { pagination } = this.state;
        const paginationTmp = isBoolean(pagination) ? {} : pagination;
        if (paginationTmp.current && paginationTmp.pageSize) {
          return (paginationTmp.current - 1) * paginationTmp.pageSize + index + 1;
        }
        return index + 1;
      },
    } as IColumnProps<T>;
    cols.unshift(sequence);
    cols.push(blankColumn as IColumnProps<T>);
    return cols;
  };

  onTableResize = () => {
    if (this.dataTable) {
      const { scrollHeight, gridData } = this.state;
      const { pagination } = this.props;
      let tableHeight = scrollHeight;
      if (gridData.length === 0 && pagination !== false) {
        tableHeight += defaultPaginationHeight;
      }
      const tDom = ReactDOM.findDOMNode(this.dataTable) as HTMLElement;
      const antTableBody = tDom.querySelector('.ant-table-body') as HTMLElement;
      antTableBody.style.height = `${tableHeight}px`;
      antTableBody.style.maxHeight = `${tableHeight}px`;
      if (this.ps) {
        this.ps.destroy();
        this.ps = null;
      }
      this.ps = new PerfectScrollbar(antTableBody);
      this.ps && this.ps.update();
    }
  };

  handlerOnResize = (size: Size) => {
    const { toolBar, showSearch, pagination, title } = this.props;
    let { wrappedHeight } = this.state;
    const { bodyWidth, bodyHeight } = size;
    const tbodyHeadHeight = 47;
    let scrollHeight = bodyHeight - tbodyHeadHeight;
    if (this.panel) {
      const panelDeom = ReactDOM.findDOMNode(this.panel) as HTMLElement;
      if (panelDeom && panelDeom.parentNode && panelDeom.parentNode instanceof HTMLElement) {
        if (panelDeom.parentNode.style.height) {
          wrappedHeight = parseInt(panelDeom.parentNode.style.height, 10);
          scrollHeight = wrappedHeight - tbodyHeadHeight;
          if (title) {
            const titleHeaderDom = panelDeom.querySelector('.panel-header') as HTMLElement;
            const { height: titleHeaderHeight } = getComputedStyle(titleHeaderDom);
            scrollHeight -= parseInt(titleHeaderHeight, 10);
            wrappedHeight -= parseInt(titleHeaderHeight, 10);
          }
          if ((toolBar || showSearch) && this.toolBar) {
            const toolBarDom = ReactDOM.findDOMNode(this.toolBar) as HTMLElement;
            const { height: toolBarHeight } = getComputedStyle(toolBarDom);
            scrollHeight -= parseInt(toolBarHeight, 10);
          }
          if (pagination !== false) {
            scrollHeight -= defaultPaginationHeight;
          }
        } else {
          wrappedHeight = bodyHeight;
          if ((toolBar || showSearch) && this.toolBar) {
            const toolBarDom = ReactDOM.findDOMNode(this.toolBar) as HTMLElement;
            const { height: toolBarHeight } = getComputedStyle(toolBarDom);
            scrollHeight -= parseInt(toolBarHeight, 10);
          }
          if (pagination !== false) {
            scrollHeight -= defaultPaginationHeight;
          }
        }
        this.setState(
          {
            wrappedHeight,
            scrollWidth: bodyWidth,
            scrollHeight,
          },
          this.onTableResize,
        );
      }
    }
  };

  getData = () => {
    const { cascadeParams, store, remotePaging, searchProperties } = this.props;
    const { pagination } = this.state;
    const { params } = store || {};
    const superParams = { ...(params || {}) };
    if (remotePaging) {
      objectAssignAppend(superParams, {
        quickSearchValue: this.quickSearchValue,
        quickSearchProperties: searchProperties,
        pageInfo: isBoolean(pagination)
          ? {}
          : {
              page: pagination.current,
              rows: pagination.pageSize,
            },
      });
    }
    if (cascadeParams) {
      objectAssignAppend(superParams, cascadeParams);
    }
    this.loadData(superParams);
  };

  loadData = (params: any) => {
    const { store, remotePaging, reader } = this.props;
    const { pagination } = this.state;
    const { url, type } = store || {};
    const methodType: Method = type || 'get';
    this.setState({ loading: true });
    const requestOptions: AxiosRequestConfig = {
      method: methodType,
      url,
      headers: { neverCancel: true },
    };
    if (methodType.toLocaleLowerCase() === 'get') {
      requestOptions.params = params;
    } else {
      requestOptions.data = params;
    }
    if (url) {
      request(requestOptions)
        .then((res: any) => {
          if (res.success) {
            const resultData = res.data || [];
            let ds = [];
            if (reader && reader.dataReader) {
              ds = this.getReaderData(resultData);
            } else if (resultData instanceof Array) {
              ds = resultData;
            } else if (resultData.rows instanceof Array) {
              ds = resultData.rows;
            }
            const paginationTmp = isBoolean(pagination) ? {} : pagination;
            if (remotePaging) {
              const total = this.getReader(
                reader && reader.totalReader ? reader.totalReader : 'records',
                resultData,
              );
              this.setState({
                gridData: ds,
                pagination: {
                  ...paginationTmp,
                  total,
                },
              });
            } else {
              const { pageSize = defaultPageSize } = paginationTmp;
              this.data = ds;
              const gridData = this.data.slice(0, pageSize);
              this.setState({
                gridData,
                pagination: {
                  ...paginationTmp,
                  total: ds.length,
                  current: 1,
                },
              });
            }
          }
        })
        .finally(() => {
          this.setState({ loading: false }, this.onTableResize);
        });
    }
  };

  getReaderData = (obj: any) => {
    const { reader } = this.props;
    let data = [];
    if (reader && reader.dataReader) {
      data = this.getReader(reader.dataReader, obj) || [];
    }
    return data;
  };

  getReader = (readerField: string, obj: any) => {
    let data = null;
    if (obj && typeof obj === 'object' && readerField) {
      const s = readerField.split('.');
      let d = obj[s[0]];
      for (let i = 1; i < s.length; i++) {
        d = d[s[i]];
        if (d instanceof Array && d.length > 0 && i < s.length - 1) {
          d = d[0];
        }
      }
      if (d) {
        data = d;
      }
    }
    return data;
  };

  handlerPageChange = (current: number, pageSize: number) => {
    const { pagination } = this.state;
    const { remotePaging } = this.props;
    const paginationTmp = isBoolean(pagination) ? {} : pagination;
    this.setState(
      {
        pagination: {
          ...paginationTmp,
          current,
          pageSize,
        },
      },
      () => {
        if (remotePaging) {
          this.getData();
        } else {
          const newData = this.getLocalFilterData();
          const gridData = newData.slice((current - 1) * pageSize, current * pageSize);
          this.setState({
            gridData,
          });
        }
      },
    );
  };

  handlerTableChange = (pagination: PaginationProps, filters: any, sorter: any, extra: any) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, extra);
    }
  };

  onShowSizeChange = (current: number, pageSize: number) => {
    const { pagination } = this.state;
    const { remotePaging } = this.props;
    const paginationTmp = isBoolean(pagination) ? {} : pagination;
    this.setState(
      {
        pagination: {
          ...paginationTmp,
          current,
          pageSize,
        },
      },
      () => {
        if (remotePaging) {
          this.getData();
        }
      },
    );
  };

  getLocalFilterData = () => {
    const { searchProperties = [] } = this.props;
    let newData = this.data;
    const searchValue = this.quickSearchValue;
    if (searchValue) {
      newData = newData.filter(item => {
        let fund = false;
        for (let i = 0; i < searchProperties.length; i += 1) {
          const fieldValue = this.getReader(searchProperties[i], item);
          if (fieldValue !== undefined && fieldValue !== null) {
            fund =
              fieldValue
                .toString()
                .toLowerCase()
                .indexOf(searchValue.trim().toLowerCase()) !== -1;
            if (fund) {
              break;
            }
          }
        }
        return fund;
      });
    }
    return newData;
  };

  onSearchChange = (e: any) => {
    this.quickSearchValue = e.target.value;
  };

  onSearch = () => {
    const { pagination } = this.state;
    const { remotePaging } = this.props;
    const paginationTmp = isBoolean(pagination) ? {} : pagination;
    if (remotePaging) {
      this.setState(
        {
          pagination: {
            ...paginationTmp,
            current: 1,
          },
        },
        () => {
          this.getData();
        },
      );
    } else {
      const newData = this.getLocalFilterData();
      this.setState(
        {
          pagination: {
            ...paginationTmp,
            current: 1,
            total: newData.length,
          },
        },
        () => {
          const gridData = newData.slice(0, paginationTmp.pageSize);
          this.setState({ gridData }, this.onTableResize);
        },
      );
    }
  };

  getToolBarRight = (toolBar: IToolBarProps | undefined, showSearch: boolean | undefined) => {
    const barProps = toolBar || { right: null, extra: null };
    const { searchPlaceHolder } = this.props;
    return (
      <>
        {barProps.right}
        {showSearch ? (
          <div className="search-item">
            <Search
              style={{ width: 160 }}
              placeholder={searchPlaceHolder || this.locale.searchPlaceHolder}
              onChange={this.onSearchChange}
              onSearch={this.onSearch}
              onPressEnter={this.onSearch}
            />
          </div>
        ) : null}
        {barProps.extra}
      </>
    );
  };

  renderToolBar = () => {
    const { toolBar, showSearch } = this.props;
    if (!toolBar && !showSearch) {
      return null;
    }
    const toolBarProps = omit(toolBar || {}, ['className', 'right', 'extra']);
    return (
      <ToolBar
        ref={node => (this.toolBar = node)}
        className={cls('seid-ext-table-toolbar', toolBar ? toolBar.className : '')}
        {...toolBarProps}
        right={this.getToolBarRight(toolBar, showSearch)}
      />
    );
  };

  getRowKey = (item: any) => {
    const { rowKey } = this.props;
    let key;
    if (typeof rowKey === 'function') {
      key = rowKey(item);
    } else if (typeof rowKey === 'string') {
      key = item[rowKey];
    } else {
      key = item.key;
    }
    if (!key) {
      throw new Error('rowKey');
    }
    return key;
  };

  handleCellResize = (index: number) => (_: MouseEvent, { size }: any) => {
    this.setState(({ renderColumns }) => {
      const nextColumns = [...renderColumns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      if (this.extTool) {
        this.extTool.updateTargetColumn(nextColumns[index]);
      }
      this.onTableResize();
      const storageCols = this.getStorage();
      if (storageCols) {
        for (let i = 0; i < storageCols.length; i += 1) {
          if (storageCols[i].dataIndex === nextColumns[index].dataIndex) {
            storageCols[i] = nextColumns[index];
            break;
          }
        }
        this.saveToggleToStorage(storageCols, true);
      }
      return { renderColumns: nextColumns };
    });
  };

  handlerRowSelectChange = (selectedRowKeys: string[], selectedRows: T[]) => {
    const { onSelectRow } = this.props;
    this.setState({ selectedRowKeys, selectedRows });
    if (onSelectRow) {
      onSelectRow(selectedRowKeys, selectedRows);
    }
  };

  checkboxProps = (row: any) => {
    const { selectedRowKeys } = this.state;
    const rowKeyValue = row[this.getRowKey(row)];
    return {
      selectedRowKeys: selectedRowKeys.filter(key => key === rowKeyValue),
      disabled: row.disabled,
    };
  };

  rowClick = (row: any) => {
    const rowKey = this.getRowKey(row);
    const { checkbox } = this.props;
    const { selectedRowKeys, selectedRows, checkboxConfig } = this.state;
    if (checkboxConfig && checkboxConfig.rowCheck) {
      if (!checkbox || !checkboxConfig.multiSelect) {
        selectedRowKeys.includes(rowKey)
          ? this.handlerRowSelectChange([], [])
          : this.handlerRowSelectChange([rowKey], [row]);
      } else if (selectedRowKeys.includes(rowKey)) {
        const rowkeys = selectedRowKeys.filter(key => key !== rowKey);
        const rows = selectedRows.filter((r: any) => this.getRowKey(r) !== rowKey);
        this.handlerRowSelectChange(rowkeys, rows);
      } else {
        this.handlerRowSelectChange([...selectedRowKeys, rowKey], [...selectedRows, row]);
      }
    }
  };

  handlerRowClassName = (row: any) => {
    const { selectedRowKeys } = this.state;
    const rowKey = this.getRowKey(row);
    if (selectedRowKeys.includes(rowKey)) {
      return 'tr-selected tr-size';
    }
    return 'tr-size';
  };

  hanlderRow = (row: T, index: number) => {
    // 重写onRow
    const { onRow } = this.props;
    if (onRow) {
      const { onClick: onPropsClick } = onRow(row, index);
      if (onPropsClick) {
        return {
          ...onRow(row, index),
          onClick: (args: React.MouseEvent) => {
            this.rowClick(row);
            onPropsClick(args);
          },
        };
      }
      return {
        ...onRow(row, index),
        onClick: () => {
          this.rowClick(row);
        },
      };
    }
    return {
      onClick: () => {
        this.rowClick(row);
      },
    };
  };

  showPaginationSummary = (total: number, range: [number, number]) => {
    const { selectedRowKeys } = this.state;
    const { summary } = this.props;
    const totalInfo = formatMsg(this.locale.total, {
      selected: selectedRowKeys.length.toString(),
      start: range[0],
      end: range[1],
      total,
    });
    let selected = '';
    if (selectedRowKeys.length > 0) {
      selected = formatMsg(this.locale.selected, { selected: selectedRowKeys.length.toString() });
    }
    return (
      <>
        {summary}
        {`${selected} ${totalInfo}`}
      </>
    );
  };

  renderTable = (locale: LocaleItem) => {
    this.locale = locale;
    const { title, checkbox, bordered, width, ...rest } = this.props;
    const {
      wrappedHeight,
      scrollWidth,
      scrollHeight,
      renderColumns,
      gridData,
      pagination,
      loading,
      selectedRowKeys,
      checkType,
    } = this.state;
    const paginationTmp = isBoolean(pagination) ? {} : pagination;
    const columns = renderColumns.map((col, index) => ({
      ...col,
      ellipsis: true,
      onHeaderCell: (column: IColumnProps<T>) => ({
        width: column.width,
        fixed: 'left',
        disableCustomize: column.disableCustomize,
        onResize: this.handleCellResize(index),
      }),
    }));
    const panelProps = {
      title,
      showHeader: !!title,
      height: wrappedHeight,
      width,
      bordered,
      className: cls('seid-ext-table', { 'no-title': !title }),
      cover: true,
      showRefresh: false,
      collapse: false,
      onResize: this.handlerOnResize,
    };
    const rowSelection = checkbox
      ? ({
          selectedRowKeys,
          onChange: this.handlerRowSelectChange,
          getCheckboxProps: this.checkboxProps,
          type: checkType,
        } as TableRowSelection<T>)
      : undefined;
    const antdTableProps = omit(rest || {}, [
      'columns',
      'rowKey',
      'toolBar',
      'pagination',
      'onSelectRow',
      'remotePaging',
      'store',
      'cascadeParams',
      'selectedRowKeys',
      'onSelectRow',
      'onTableRef',
      'showSearch',
      'searchPlaceHolder',
      'searchProperties',
      'ellipsis',
      'summary',
      'storageId',
      'reader',
      'loading',
    ]);
    let paginationProps: boolean | PaginationProps = false;
    if (pagination !== false) {
      paginationProps = {
        ...paginationTmp,
        size: 'middle',
        onChange: this.handlerPageChange,
        onShowSizeChange: this.onShowSizeChange,
        showTotal: this.showPaginationSummary,
      };
    }
    return (
      <Panel ref={node => (this.panel = node)} {...panelProps}>
        {this.renderToolBar()}
        <Table
          {...antdTableProps}
          size="middle"
          bordered
          ref={node => (this.dataTable = node)}
          loading={loading}
          rowKey={record => this.getRowKey(record)}
          components={this.components}
          columns={columns}
          rowSelection={rowSelection}
          onRow={(row: T, index: number) => this.hanlderRow(row, index)}
          rowClassName={this.handlerRowClassName}
          scroll={{
            x: scrollWidth,
            y: scrollHeight,
          }}
          onChange={this.handlerTableChange}
          dataSource={gridData}
          pagination={paginationProps}
        />
      </Panel>
    );
  };

  render(): ReactNode {
    return (
      <SeidLocaleReceiver componentName="ExtTable" defaultLocale={defaultLocale}>
        {this.renderTable}
      </SeidLocaleReceiver>
    );
  }
}

export default ExtTable;
