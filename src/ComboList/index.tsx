import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import isEqual from 'react-fast-compare';
import cls from 'classnames';
// @ts-ignore
import { isBoolean, isPlainObject } from 'lodash';
import { FormProps } from 'antd/es/form/Form';
import { FormInstance } from 'antd';
import Select from 'antd/es/select';
import Input from 'antd/es/input';
import List from 'antd/es/list';
import Skeleton from 'antd/es/skeleton';
import Pagination, { PaginationProps } from 'antd/es/pagination';
import { AxiosRequestConfig, Method } from 'axios';
import ScrollBar from '../ScrollBar';
import { objectAssignAppend, request, setCursorPosition } from '../utils';
import './style/index.less';

const { Search } = Input;

export interface StoreProps {
  /**
   * zh-CN: 数据请求参数
   * en-US: request params
   */
  params?: object;
  /**
   * zh-CN: 数据请求类型
   * en-US: Data request method
   */
  type: Method;
  /**
   * zh-CN: 接口地址
   * en-US: interface address
   */
  url: string;
  /**
   * zh-CN: 初始化时自动获取数据
   * en-US: Automatically acquire data during initialization
   */
  autoLoad: boolean;
}

export interface Reader {
  /**
   * zh-CN: 截取的数据节点
   * en-US: data node
   */
  data?: string;
  /**
   * zh-CN: 次要信息属性名
   * en-US: display property name
   */
  description?: string;
  /**
   * zh-CN: ComboList属性field映射,属性名必须一一对应
   * en-US: display property name
   */
  field?: string[];
  /**
   * zh-CN: 显示的属性名
   * en-US: display property name
   */
  name: string;
}

export interface ListProps<T> {
  /**
   * zh-CN: 设置列表布局, 设置成 vertical 则竖直样式显示, 默认横排
   * en-US: The layout of list, default is vertical, If a horizontal list is desired, set the itemLayout property to horizontal
   */
  itemLayout: 'vertical' | 'horizontal';
  /**
   * zh-CN: 自定义渲染列表项
   * en-US: customize render list item
   */
  renderItem?: (item: T, index: number) => React.ReactNode;
}

export interface ComboProps<T> {
  /**
   * zh-CN: 可以点击清除图标删除内容
   * en-US: Allow to remove input content with clear icon
   */
  allowClear: boolean;
  /**
   * zh-CN: 选择数据行后触发该事件
   * en-US: After select will trigger this event
   */
  afterSelect?: (item: T, index: number) => void;
  /**
   * zh-CN: 清空数据触发该事件
   * en-US: After clear will trigger this event
   */
  afterClear?: () => void;
  /**
   * zh-CN: 数据请求完成调用该事件，返回接口请求的数据
   * en-US: Data record array to be displayed
   */
  afterLoaded?: (data: object[]) => void;
  /**
   * zh-CN: 级联参数配置
   * en-US: Cascade parameter configuration
   */
  cascadeParams?: object;
  /**
   * zh-CN: 选择框样式名
   * en-US: ComboList className
   */
  className?: string;
  /**
   * zh-CN: 输入框默认内容
   * en-US: The initial input content
   */
  defaultValue?: string;
  /**
   * zh-CN: 组件失效状态
   * en-US: Disabled state of button
   */
  disabled?: boolean;
  /**
   * zh-CN: 静态数据源
   * en-US: Data record array to be displayed
   */
  dataSource?: object[];
  /**
   * zh-CN: 额外提交的表单字段属性名，表单受控
   * en-US: Attribute name of extra submitted form field, controlled form
   */
  field?: string[];
  /**
   * zh-CN: antd表单组件form
   * en-US: antd Form
   */
  form?: FormProps & FormInstance;
  /**
   * zh-CN: 列表属性
   * en-US: List attribute
   */
  listProps?: ListProps<T>;
  /**
   * zh-CN: 填充输入框显示的表单字段属性名，表单受控
   * en-US: Fill in the attribute name of the form field displayed in the input box. The form is controlled
   */
  name: string;
  /**
   * zh-CN: 选择框默认文字
   * en-US: Placeholder of select
   */
  placeholder?: string;
  /**
   * zh-CN: 接口数据解析适配
   * en-US: Data map object
   */
  reader: Reader;
  /**
   * zh-CN: 远程分页
   * en-US: Remote paging
   */
  remotePaging?: boolean;
  /**
   * zh-CN: 设置列表项唯一的key，可以是返回字符串的字符串或函数
   * en-US: Item's unique key, could be a string or function that returns a string
   */
  rowKey: ((item: T) => string) | string;
  /**
   * zh-CN: css属性配置
   * en-US: css properties
   */
  style?: React.CSSProperties;
  /**
   * zh-CN: 数据接口对象
   * en-US: Data interface object
   */
  store?: StoreProps;

  pagination: boolean | PaginationProps;
  /** s
   * zh-CN: 显示快速搜索
   * en-US: Show search
   */
  showSearch: boolean;
  /**
   * zh-CN: 搜索框默认文字
   * en-US: Placeholder of search
   */
  searchPlaceHolder?: string;
  /**
   * zh-CN: 搜索属性配置
   * en-US: Properties of search
   */
  searchProperties?: string[];
  /**
   * zh-CN: 输入框内容
   * en-US: The input content value
   */
  value?: string;
  /** s
   * zh-CN: 数据面板宽度
   * en-US: Data list width
   */
  width?: number;
}

class ComboList<T> extends React.Component<ComboProps<T>, any> {
  static defaultProps = {
    remotePaging: false,
    disabled: false,
    showSearch: true,
    store: null,
    dataSource: [],
    listProps: { itemLayout: 'horizontal' },
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
      description: PropTypes.string,
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
    listProps: PropTypes.shape({
      itemLayout: PropTypes.oneOf(['vertical', 'horizontal']),
      renderItem: PropTypes.func,
    }),
    rowKey: PropTypes.string,
    name: PropTypes.string.isRequired,
    field: PropTypes.array,
  };

  protected loaded: boolean = false;

  protected data: object[] = [];

  protected comboList: HTMLDivElement | undefined;

  protected select: any;

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
      showList: false,
      listData: defaultData,
      pagination: defaultPagination,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.hideComboList, false);
    const { store } = this.props;
    if (store && store.autoLoad === true) {
      this.getData();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hideComboList);
  }

  componentDidUpdate(prevProps: ComboProps<T>) {
    if (
      !isEqual(prevProps.cascadeParams, this.props.cascadeParams) ||
      !isEqual(prevProps.value, this.props.value)
    ) {
      const { pagination } = this.state;
      const { defaultValue, value } = this.props;
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

  hideComboList = (e: MouseEvent) => {
    const { showList } = this.state;
    const tDom = ReactDOM.findDOMNode(this.comboList);
    if (showList) {
      if (tDom && tDom.contains(e.target as HTMLElement)) {
        this.focus();
      } else {
        setTimeout(() => {
          this.setState({ showList: false });
        }, 200);
      }
    }
  };

  showComboList = (showList: boolean) => {
    if (showList) {
      const { store } = this.props;
      if (store) {
        this.getData();
      }
      this.setState({ showList });
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
                listData: ds,
                pagination: {
                  ...pagination,
                  current: 1,
                  total: resultData.records,
                },
              });
            } else {
              this.data = ds;
              let listData = [...ds];
              let paginationTmp: PaginationProps | boolean = pagination;
              if (!isBoolean(pagination) && isPlainObject(pagination)) {
                paginationTmp = {
                  ...pagination,
                  current: 1,
                  total: ds.length,
                };
                const { pageSize = 15 } = pagination;
                listData = this.data.slice(0, pageSize);
              }
              this.setState({
                listData,
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
          this.setState({ loading: false });
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
          const listData = newData.slice(
            (current - 1) * pageSize,
            current * pageSize,
          );
          this.setState({
            listData,
          });
        }
      },
    );
  };

  afterSelect = (item: T, index: number) => {
    const { afterSelect, reader, form, name, field = [] } = this.props;
    this.setState(
      {
        showList: false,
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
        if (afterClear && afterClear instanceof Function) {
          afterClear();
        }
      },
    );
  };

  getLocalFilterData = () => {
    const { reader, name } = this.props;
    let newData = this.data;
    const searchValue = this.quickSearchValue;
    if (searchValue) {
      let filterName = name;
      if (reader && reader.name) {
        filterName = reader.name;
      }
      newData = newData.filter(item => {
        const fieldValue = this.getReader(filterName, item);
        if (fieldValue) {
          return (
            fieldValue.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
          );
        }
        return false;
      });
    }
    return newData;
  };

  onSearchChange = (e: any) => {
    this.quickSearchValue = e.target.value;
  };

  focus = () => {
    if (this.searchInput && this.searchInput.input) {
      setCursorPosition(
        this.searchInput.input.input,
        this.quickSearchValue.length,
      );
    }
  };

  onSearch = () => {
    const { pagination } = this.state;
    const { remotePaging } = this.props;
    let paginationTmp: PaginationProps = pagination;
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
      let listData = [...newData];
      if (!isBoolean(paginationTmp) && isPlainObject(paginationTmp)) {
        listData = newData.slice(0, paginationTmp.pageSize);
        Object.assign(paginationTmp, { current: 1, total: newData.length });
      }
      this.setState(
        {
          listData,
          pagination: paginationTmp,
        },
        this.focus,
      );
    }
  };

  initComboList = (ref: any) => {
    if (ref) {
      const { width } = this.props;
      this.comboList = ref;
      if (width && width > 0) {
        ref.parentNode.style.width = `${width}px`;
      }
    }
  };

  getRowKey = (item: any, index: number) => {
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
      key = `list-item-${index}`;
    }
    return key;
  };

  render() {
    const { listData, loading, pagination, value, showList } = this.state;
    const {
      listProps,
      reader,
      allowClear,
      disabled,
      showSearch,
      searchPlaceHolder,
      placeholder,
      style = {},
      className,
    } = this.props;
    const selectRestProps = { style, className };
    Object.assign(selectRestProps, { value });
    return (
      <Select
        ref={ele => (this.select = ele)}
        onDropdownVisibleChange={this.showComboList}
        // open={showList}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={this.onClearValue}
        disabled={disabled}
        {...selectRestProps}
        dropdownRender={() => (
          <div
            className={cls('seid-combo-list')}
            ref={ref => this.initComboList(ref)}
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
            <div className="list-body">
              <ScrollBar>
                <List
                  itemLayout={
                    listProps && listProps.itemLayout
                      ? listProps.itemLayout
                      : 'horizontal'
                  }
                  dataSource={listData}
                  loading={loading}
                  renderItem={(item, index) => (
                    <List.Item
                      key={this.getRowKey(item, index)}
                      onClick={() => this.afterSelect(item as T, index)}
                      className={cls({
                        [cls('row-selected')]:
                          this.getReader(reader.name, item) === value,
                      })}
                    >
                      <Skeleton loading={loading} active>
                        {listProps && listProps.renderItem ? (
                          listProps.renderItem(item as T, index)
                        ) : (
                          <List.Item.Meta
                            title={this.getReader(reader.name, item)}
                            description={
                              reader.description
                                ? this.getReader(reader.description, item)
                                : ''
                            }
                          />
                        )}
                      </Skeleton>
                    </List.Item>
                  )}
                />
              </ScrollBar>
            </div>
            {pagination === false ? null : (
              <div className="list-page-bar">
                <Pagination
                  simple
                  onChange={this.onPageChange}
                  {...pagination}
                />
              </div>
            )}
          </div>
        )}
      />
    );
  }
}

export default ComboList;
