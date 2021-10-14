import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cls from 'classnames';
// @ts-ignore
import { isBoolean, isPlainObject } from 'lodash';
import isEqual from 'react-fast-compare';
// @ts-ignore
import PerfectScrollbar from 'perfect-scrollbar';
import Select from 'antd/es/select';
import Input from 'antd/es/input';
import Table from 'antd/es/table';
import { PaginationProps } from 'antd/es/pagination';
import { AxiosRequestConfig, Method } from 'axios';
import LocaleReceiver from '../seid-locale-provider/SeidLocaleReceiver';
import { LocaleItem } from '../locale';
import ComboProps from './comboProps';
import { formatMsg, objectAssignAppend, setCursorPosition } from '../utils';
import request from '@/utils/request';
import defaultLocale from './locale';
import './style/index.less';

const { Search } = Input;

class ComboGrid<T> extends Component<ComboProps<T>, any> {
  static defaultProps = {
    remotePaging: false,
    disabled: false,
    showSearch: true,
    store: null,
    dataSource: [],
    columns: [],
    height: 250,
    allowClear: false,
    placeholder: '',
    searchPlaceHolder: '',
    searchProperties: ['code', 'name'],
    rowKey: 'id',
    name: '',
    field: [],
  };

  static propTypes = {
    cascadeParams: PropTypes.object,
    disabled: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    allowClear: PropTypes.bool,
    classNames: PropTypes.string,
    placeholder: PropTypes.string,
    store: PropTypes.shape({
      type: PropTypes.oneOf(['GET', 'get', 'POST', 'post']),
      url: PropTypes.string,
      params: PropTypes.object,
      autoLoad: PropTypes.bool,
    }),
    reader: PropTypes.shape({
      data: PropTypes.string,
      name: PropTypes.string,
      field: PropTypes.array,
    }).isRequired,
    remotePaging: PropTypes.bool,
    showSearch: PropTypes.bool,
    width: PropTypes.number,
    searchPlaceHolder: PropTypes.string,
    searchProperties: PropTypes.array,
    dataSource: PropTypes.array,
    afterLoaded: PropTypes.func,
    afterSelect: PropTypes.func,
    afterClear: PropTypes.func,
    rowKey: PropTypes.string,
    name: PropTypes.string.isRequired,
    field: PropTypes.array,
  };

  protected loaded: boolean = false;

  protected data: object[] = [];

  protected comboGrid: HTMLDivElement | undefined;

  protected select: any;

  protected dataTable: any;

  protected scrollBar: any;

  protected quickSearchValue: string = '';

  protected searchInput: any;

  constructor(props: ComboProps<T>) {
    super(props);
    const { defaultValue, value, dataSource = [], pagination } = props;
    const defaultV = value || defaultValue || undefined;
    this.loaded = false;
    this.data = [...dataSource];
    const defaultPagination =
      pagination === false
        ? false
        : {
            current: 1,
            pageSize: 15,
            total: dataSource.length || 0,
            // @ts-ignore
            ...(isBoolean(pagination) ? {} : pagination),
          };
    let defaultData = dataSource;
    if (!isBoolean(defaultPagination) && isPlainObject(defaultPagination)) {
      defaultData = this.data.slice(
        0,
        defaultPagination.current * defaultPagination.pageSize,
      );
    }
    this.state = {
      value: defaultV,
      loading: false,
      showGrid: false,
      gridData: defaultData,
      pagination: defaultPagination,
    };
  }

  onResize = () => {
    if (this.dataTable) {
      const { height } = this.props;
      const tDom = ReactDOM.findDOMNode(this.dataTable);
      if (tDom && tDom instanceof HTMLElement) {
        const antTableBody = tDom.querySelector('.ant-table-body');
        if (antTableBody && antTableBody instanceof HTMLElement) {
          antTableBody.style.maxHeight = `${height}px`;
          if (this.scrollBar) {
            this.scrollBar.destroy();
            this.scrollBar = null;
          }
          this.scrollBar = new PerfectScrollbar(antTableBody);
          this.scrollBar.update();
        }
      }
    }
  };

  componentDidMount() {
    // document.addEventListener('mousedown', this.hideComboGrid, false);
    const { store } = this.props;
    if (store && store.autoLoad === true) {
      this.getData();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hideComboGrid);
  }

  componentDidUpdate(prevProps: ComboProps<T>) {
    if (
      !isEqual(prevProps.value, this.props.value) ||
      !isEqual(prevProps.cascadeParams, this.props.cascadeParams)
    ) {
      const { defaultValue, value } = this.props;
      const { pagination } = this.state;
      const defaultV = value || defaultValue || undefined;
      if (!isEqual(prevProps.cascadeParams, this.props.cascadeParams)) {
        Object.assign(pagination, { current: 1 });
      }
      this.setState({
        value: defaultV,
        pagination,
      });
    }
  }

  hideComboGrid = (e: MouseEvent) => {
    const { showGrid } = this.state;
    const tDom = ReactDOM.findDOMNode(this.comboGrid);
    if (showGrid) {
      if (tDom && tDom.contains(e.target as HTMLElement)) {
        this.focus();
      } else {
        setTimeout(() => {
          this.setState({ showGrid: false });
        }, 200);
      }
    }
  };

  showComboGrid = (showGrid: boolean) => {
    if (showGrid) {
      const { store } = this.props;
      if (store) {
        this.getData();
      }
      this.setState({ showGrid }, () => {
        window.setTimeout(this.onResize, 200);
      });
    }
  };

  getReaderData = (obj: any) => {
    const { reader } = this.props;
    let data = [];
    if (reader.data) {
      data = this.getReader(reader.data, obj) || [];
    }
    return data;
  };

  getReader = (readerField: string, obj: any) => {
    let data = null;
    if (typeof obj === 'object' && readerField) {
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

  getData = () => {
    const { cascadeParams, store, remotePaging, searchProperties } = this.props;
    const { pagination } = this.state;
    const { params } = store || {};
    const superParams = { ...(params || {}) };
    if (remotePaging && !isBoolean(pagination) && isPlainObject(pagination)) {
      objectAssignAppend(superParams, {
        quickSearchValue: this.quickSearchValue,
        quickSearchProperties: searchProperties,
        pageInfo: {
          page: pagination.current,
          rows: pagination.pageSize,
        },
      });
    }
    if (cascadeParams) {
      this.loaded = false;
      objectAssignAppend(superParams, cascadeParams);
    }
    if (!this.loaded) {
      this.loadData(superParams);
    }
  };

  loadData = (params: any) => {
    const { store, afterLoaded, remotePaging, reader } = this.props;
    const { pagination } = this.state;
    const { url, type } = store || {};
    const methodType: Method = type || 'get';
    this.setState({ loading: true });
    const requestOptions: AxiosRequestConfig = {
      method: methodType,
      url,
      // @ts-ignore
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
            if (reader && reader.data) {
              ds = this.getReaderData(resultData);
            } else if (resultData instanceof Array) {
              ds = resultData;
            } else if (resultData.rows instanceof Array) {
              ds = resultData.rows;
            }
            if (
              remotePaging &&
              !isBoolean(pagination) &&
              isPlainObject(pagination)
            ) {
              this.setState({
                gridData: ds,
                pagination: {
                  ...pagination,
                  total: resultData.records,
                },
              });
            } else {
              this.data = ds;
              let gridData = [...ds];
              let paginationTmp: PaginationProps | boolean = pagination;
              if (!isBoolean(pagination) && isPlainObject(pagination)) {
                paginationTmp = {
                  ...pagination,
                  current: 1,
                  total: ds.length,
                };
                const { pageSize = 15 } = pagination;
                gridData = this.data.slice(0, pageSize);
              }
              this.setState({
                gridData,
                pagination: paginationTmp,
              });
            }
            if (afterLoaded && afterLoaded instanceof Function) {
              afterLoaded(ds);
            }
          }
        })
        .finally(() => {
          this.loaded = true;
          this.setState({ loading: false }, this.onResize);
        });
    }
  };

  onPageChange = (current: number, pageSize: number) => {
    const { pagination } = this.state;
    const { remotePaging } = this.props;
    let paginationTmp: PaginationProps | boolean = pagination;
    if (!isBoolean(pagination) && isPlainObject(pagination)) {
      paginationTmp = {
        ...pagination,
        current,
        pageSize,
      };
    }
    this.setState(
      {
        pagination: paginationTmp,
      },
      () => {
        if (remotePaging) {
          this.loaded = false;
          this.getData();
        } else {
          const newData = this.getLocalFilterData();
          const gridData = newData.slice(
            (current - 1) * pageSize,
            current * pageSize,
          );
          this.setState({
            gridData,
          });
        }
      },
    );
  };

  afterSelect = (item: T, index: number) => {
    const { afterSelect, reader, form, name, field = [] } = this.props;
    this.setState(
      {
        showGrid: false,
        value: this.getReader(reader.name, item),
      },
      () => {
        const data = { [name]: this.getReader(reader.name, item) };
        const formData = form ? form.getFieldsValue() : {};
        if (
          reader &&
          reader.field &&
          field.length > 0 &&
          field.length === reader.field.length
        ) {
          field.forEach((f, idx) => {
            data[f] = this.getReader(
              reader.field ? reader.field[idx] : '',
              item,
            );
          });
        }
        Object.assign(formData, data);
        if (form) {
          form.setFieldsValue(formData);
        }
        if (afterSelect) {
          afterSelect(item, index);
        }
      },
    );
  };

  onClearValue = () => {
    const { afterClear, form, name, reader, field = [] } = this.props;
    this.setState(
      {
        value: undefined,
      },
      () => {
        const data = { [name]: null };
        if (reader && reader.field && field.length === reader.field.length) {
          field.forEach(f => {
            data[f] = null;
          });
        }
        if (form) {
          form.setFieldsValue(data);
        }
        if (afterClear) {
          afterClear();
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
          if (fieldValue) {
            fund =
              fieldValue
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

  focus = () => {
    if (this.searchInput && this.searchInput.input) {
      setCursorPosition(this.searchInput.input, this.quickSearchValue.length);
    }
  };

  onSearch = () => {
    const { pagination } = this.state;
    const { remotePaging } = this.props;
    let paginationTmp: PaginationProps | boolean = pagination;
    if (!isBoolean(pagination)) {
      paginationTmp = {
        ...pagination,
        current: 1,
      };
    }
    if (remotePaging) {
      this.loaded = false;
      this.setState(
        {
          pagination: paginationTmp,
        },
        () => {
          this.focus();
          this.getData();
        },
      );
    } else {
      const newData = this.getLocalFilterData();
      let gridData = [...newData];
      if (!isBoolean(paginationTmp) && isPlainObject(paginationTmp)) {
        // @ts-ignore
        if ('pageSize' in paginationTmp) {
          gridData = newData.slice(0, paginationTmp.pageSize);
        }
        Object.assign(paginationTmp, { current: 1, total: newData.length });
      }
      this.setState({ gridData }, this.focus);
    }
  };

  initComboGrid = (ref: any) => {
    if (ref) {
      const { width } = this.props;
      this.comboGrid = ref;
      if (width && width > 0) {
        ref.parentNode.style.width = `${width}px`;
      }
    }
  };

  onRowEventChange = (record: T, idx: number) => {
    return {
      onClick: () => this.afterSelect(record, idx),
    };
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

  showTotal = (total: number, locale: LocaleItem) => {
    return formatMsg(locale.total, { total });
  };

  getTableWidth = () => {
    const { columns, width = 0 } = this.props;
    let w = 0;
    columns.forEach(col => {
      if (col.width && col.width > 0) {
        w += (col.width as number) || 0;
      }
    });
    if ((w === 0 || w < width) && this.select && this.dataTable) {
      w += width || this.select.clientWidth || 0;
    }
    return w;
  };

  renderComboGrid = (locale: LocaleItem): ReactNode => {
    const { gridData, loading, pagination, value, showGrid } = this.state;
    const {
      allowClear,
      disabled,
      showSearch,
      searchPlaceHolder,
      height,
      columns,
      placeholder,
      style = {},
      className,
    } = this.props;
    const selectRestProps = { style, className };
    Object.assign(selectRestProps, { value });
    // @ts-ignore
    return (
      <Select
        ref={ele => (this.select = ele)}
        placeholder={placeholder}
        onDropdownVisibleChange={this.showComboGrid}
        // open={showGrid}
        allowClear={allowClear}
        onChange={this.onClearValue}
        disabled={disabled}
        {...selectRestProps}
        dropdownRender={() => (
          <div
            className={cls('seid-combo-grid')}
            ref={ref => this.initComboGrid(ref)}
          >
            {showSearch ? (
              <div className="action-bar">
                <Search
                  ref={node => (this.searchInput = node)}
                  placeholder={searchPlaceHolder}
                  onChange={this.onSearchChange}
                  onSearch={this.onSearch}
                  onPressEnter={this.onSearch}
                />
              </div>
            ) : null}
            <Table
              style={{ wordBreak: 'break-word' }}
              loading={loading}
              rowKey={record => this.getRowKey(record)}
              ref={(node: any) => (this.dataTable = node)}
              columns={columns}
              dataSource={gridData}
              scroll={{ x: this.getTableWidth(), y: height }}
              size="middle"
              // @ts-ignore
              onRow={(record: T, index: number) =>
                this.onRowEventChange(record, index)
              }
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                size: 'small',
                // @ts-ignore
                onChange: this.onPageChange,
                showTotal: (total: number) => this.showTotal(total, locale),
              }}
            />
          </div>
        )}
      />
    );
  };

  render(): ReactNode {
    return (
      <LocaleReceiver defaultLocale={defaultLocale} componentName="ComboGrid">
        {/* @ts-ignore*/}
        {this.renderComboGrid}
      </LocaleReceiver>
    );
  }
}

export default ComboGrid;
