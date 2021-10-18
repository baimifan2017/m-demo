/*
 * @Date: 2020-02-16 18:20:23
 * @Last Modified time: 2020-02-17 00:12:52
 */
import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { cloneDeep, get, isBoolean, isPlainObject } from 'lodash';
import { Method, AxiosRequestConfig } from 'axios';
import Input from 'antd/es/input';
import Pagination, { PaginationProps } from 'antd/es/pagination';
import List from 'antd/es/list';
import Skeleton from 'antd/es/skeleton';
import Checkbox from 'antd/es/checkbox';
import Card from 'antd/es/card';
import ExtIcon from '../ExtIcon';
import ScrollBar from '../ScrollBar';
import { objectAssignAppend, request, formatMsg } from '../utils';
import SeidLocaleReceiver from '../seid-locale-provider/SeidLocaleReceiver';
import defaultLocale from './locale';
import { LocaleItem } from '../locale';

const Search = Input.Search;

export interface StoreProps {
  params?: object;
  type: Method;
  url: string;
}

export interface ListProps<T> {
  itemLayout: 'vertical' | 'horizontal';
  renderItem?: (item: T, index: number) => React.ReactNode;
}

export interface ItemFieldProps<T> {
  avatar?: (keyValue: any, checkedList: any, index: number) => React.ReactNode | React.ReactNode;
  title: (item: T, index: number) => React.ReactNode;
  description: (item: T, index: number) => React.ReactNode;
  extra?: (item: T, index: number) => React.ReactNode;
}

export interface ListCardProps<T> {
  title?: string | React.ReactNode;
  bordered?: boolean;
  dataSource: T[];
  checkbox?: boolean;
  rowKey: (item: T) => string | string;
  selectedKeys?: string[];
  pagination?: boolean | PaginationProps;
  onSelectChange?: (keys: string[], items: T[]) => void;
  allowCancelSelect?: boolean;
  style?: React.CSSProperties;
  className?: string;
  store?: StoreProps;
  showSearch: boolean;
  cascadeParams?: object;
  listProps?: ListProps<T>;
  remotePaging?: boolean;
  searchPlaceHolder?: string;
  searchProperties?: string[];
  itemField: ItemFieldProps<T>;
  showArrow?: boolean;
  extra?: string | React.ReactNode;
  loading?: boolean;
  onListCardRef?: (ref: any) => void;
  customTool?: (params: any) => React.ReactNode;
  itemTool?: (item: T, index: number) => React.ReactNode;
}

type ListCardState<T> = {
  loading?: boolean;
  selectAll: boolean;
  selectIndeterminate: boolean;
  checkedList: any;
  dataSource: T[];
  pagination: boolean | PaginationProps;
  paginationCount: number;
};

class ListCard<T> extends Component<ListCardProps<T>, ListCardState<T>> {
  protected locale: LocaleItem;

  protected loaded: boolean = false;

  protected allValue: string = '';

  protected data: T[] = [];

  static propTypes = {
    itemField: PropTypes.object.isRequired,
    dataSource: PropTypes.array,
    selectedKeys: PropTypes.array,
    onSelectChange: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    loading: false,
    dataSource: [],
    rowKey: 'id',
    bordered: false,
    remotePaging: false,
    allowCancelSelect: false,
    showSearch: true,
    showArrow: true,
    store: null,
    selectedKeys: [],
    listProps: { itemLayout: 'horizontal' },
    searchPlaceHolder: '',
    searchProperties: ['code', 'name'],
    itemField: {
      title: (item: any) => item.name || '',
      description: (item: any) => item.code || '',
    },
  };

  constructor(props: ListCardProps<T>) {
    super(props);
    const { pagination, dataSource = [], selectedKeys = [], loading } = props;
    this.loaded = false;
    this.data = [...dataSource];
    const defaultSelectKeys: any = {};
    selectedKeys.forEach(key => {
      defaultSelectKeys[key] = key;
    });
    const defaultPagination =
      pagination === false
        ? false
        : {
            current: 1,
            pageSize: 30,
            total: dataSource.length || 0,
            ...(isBoolean(pagination) ? {} : pagination),
          };
    const selectAll = selectedKeys.length > 0 && selectedKeys.length === dataSource.length;
    const selectIndeterminate = !!(
      selectedKeys.length > 0 && selectedKeys.length < dataSource.length
    );
    let defaultData = dataSource;
    let paginationCount = 0;
    if (!isBoolean(defaultPagination) && isPlainObject(defaultPagination)) {
      defaultData = this.data.slice(0, defaultPagination.current * defaultPagination.pageSize);
    } else {
      paginationCount = dataSource.length;
    }
    this.state = {
      loading,
      selectAll,
      selectIndeterminate,
      checkedList: defaultSelectKeys,
      dataSource: defaultData,
      pagination: defaultPagination,
      paginationCount,
    };
  }

  componentDidMount() {
    const { onListCardRef } = this.props;
    if (onListCardRef) {
      onListCardRef(this);
    }
    this.remoteDataRefresh();
  }

  componentDidUpdate(prevProps: ListCardProps<T>) {
    const { dataSource, cascadeParams, loading = false } = this.props;
    if (!isEqual(prevProps.cascadeParams, cascadeParams)) {
      this.getData();
    }
    if (!isEqual(prevProps.loading, loading)) {
      this.setState({ loading });
    }
    if (!isEqual(prevProps.dataSource, dataSource)) {
      const { pagination } = this.state;
      this.data = [...dataSource];
      let paginationTmp: PaginationProps | boolean = pagination;
      let paginationCount = 0;
      if (!isBoolean(pagination)) {
        paginationTmp = {
          ...pagination,
          current: 1,
          total: dataSource.length,
        };
      } else {
        paginationCount = dataSource.length;
      }
      this.setState({
        paginationCount,
        dataSource,
        checkedList: {},
        selectAll: false,
        selectIndeterminate: false,
        pagination: paginationTmp,
      });
    }
  }

  remoteDataRefresh = () => {
    const { store } = this.props;
    if (store) {
      this.getData();
    }
  };

  handlerSearchChange = (v: any) => {
    this.allValue = v;
  };

  handlerSearch = () => {
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
      this.setState({ pagination: paginationTmp }, this.getData);
    } else {
      const newData = this.getLocalFilterData();
      let dataSource = [...newData];
      let paginationCount = 0;
      if (!isBoolean(paginationTmp) && isPlainObject(paginationTmp)) {
        dataSource = newData.slice(0, paginationTmp.pageSize);
        Object.assign(paginationTmp, { current: 1, total: newData.length });
      } else {
        paginationCount = newData.length;
      }
      this.setState({
        paginationCount,
        selectAll: false,
        selectIndeterminate: false,
        checkedList: {},
        dataSource,
        pagination: paginationTmp,
      });
    }
  };

  getLocalFilterData = () => {
    const { searchProperties = [] } = this.props;
    let dataSource = [];
    if (this.allValue) {
      const valueKey = this.allValue.toLowerCase();
      dataSource = this.data.filter((item: any) => {
        const fv: any[] = [];
        searchProperties.forEach(f => {
          fv.push(get(item, f) || '');
        });
        let found = false;
        for (let i = 0; i < fv.length; i += 1) {
          const value = fv[i];
          found = value.toLowerCase().indexOf(valueKey) > -1;
          if (found) {
            break;
          }
        }
        return found;
      });
    } else {
      dataSource = [...this.data];
    }
    return dataSource;
  };

  handlerPageChange = (current: number, pageSize: number) => {
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
          const dataSource = newData.slice((current - 1) * pageSize, current * pageSize);
          this.setState({
            dataSource,
          });
        }
      },
    );
  };

  getData = () => {
    const { cascadeParams, store, remotePaging, searchProperties } = this.props;
    const { pagination } = this.state;
    const { params } = store || {};
    const superParams = { ...(params || {}) };
    if (remotePaging && !isBoolean(pagination) && isPlainObject(pagination)) {
      objectAssignAppend(superParams, {
        quickSearchValue: this.allValue,
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
    const { store, remotePaging } = this.props;
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
            if (resultData instanceof Array) {
              ds = resultData;
            } else if (resultData.rows instanceof Array) {
              ds = resultData.rows;
            }
            if (remotePaging && !isBoolean(pagination) && isPlainObject(pagination)) {
              this.setState({
                dataSource: ds,
                pagination: {
                  ...pagination,
                  total: resultData.records,
                },
              });
            } else {
              this.data = ds;
              let dataSource = [...ds];
              let paginationCount = 0;
              let paginationTmp: PaginationProps | boolean = pagination;
              if (!isBoolean(pagination) && isPlainObject(pagination)) {
                paginationTmp = {
                  ...pagination,
                  current: 1,
                  total: ds.length,
                };
                const { current = 1, pageSize = 30 } = paginationTmp;
                dataSource = this.data.slice((current - 1) * pageSize, current * pageSize);
              } else {
                paginationCount = dataSource.length;
              }
              this.setState({
                paginationCount,
                dataSource,
                pagination: paginationTmp,
              });
            }
          }
        })
        .finally(() => {
          this.loaded = true;
          this.setState({ loading: false });
        });
    }
  };

  handlerItemCheck = (item: any, index: number) => {
    const { checkedList, dataSource } = this.state;
    const checkedKeys = cloneDeep(checkedList);
    let selectAll = false;
    const keyValue = this.getItemKey(item, index);
    let selectIndeterminate = false;
    if (checkedKeys[keyValue]) {
      delete checkedKeys[keyValue];
    } else {
      checkedKeys[keyValue] = item;
    }
    const keys = Object.keys(checkedKeys);
    if (keys.length > 0) {
      selectIndeterminate = true;
      if (keys.length === dataSource.length) {
        selectAll = true;
        selectIndeterminate = false;
      }
    }
    this.setState(
      {
        selectIndeterminate,
        selectAll,
        checkedList: checkedKeys,
      },
      this.handlerSelectChange,
    );
  };

  handlerItemSelect = (item: any, index: number) => {
    const { allowCancelSelect } = this.props;
    const { checkedList } = this.state;
    const keyValue = this.getItemKey(item, index);
    if (!allowCancelSelect && checkedList[keyValue]) {
      return;
    }
    let checkedKeys = cloneDeep(checkedList);
    if (checkedKeys[keyValue]) {
      checkedKeys = {};
    } else {
      checkedKeys = { [keyValue]: item };
    }
    this.setState(
      {
        checkedList: checkedKeys,
      },
      this.handlerSelectChange,
    );
  };

  manualUpdateItemChecked = (items: any[]) => {
    if (items.length === 0) {
      return;
    }
    const { checkedList, dataSource } = this.state;
    const checkedKeys = cloneDeep(checkedList);
    let selectAll = false;
    items.forEach((item: any, index: number) => {
      const keyValue = this.getItemKey(item, index);
      if (checkedKeys[keyValue]) {
        delete checkedKeys[keyValue];
      } else {
        checkedKeys[keyValue] = item;
      }
    });
    let selectIndeterminate = false;
    const keys = Object.keys(checkedKeys);
    if (keys.length > 0) {
      selectIndeterminate = true;
      if (keys.length === dataSource.length) {
        selectAll = true;
        selectIndeterminate = false;
      }
    }
    this.setState({
      selectIndeterminate,
      selectAll,
      checkedList: checkedKeys,
    });
  };

  handlerSelectAllChange = (e: any) => {
    const { checkedList, dataSource } = this.state;
    let checkedKeys: any = cloneDeep(checkedList);
    let selectAll = false;
    if (e.target.checked) {
      dataSource.forEach((item: any, index: number) => {
        const keyValue = this.getItemKey(item, index);
        checkedKeys[keyValue] = item;
      });
      selectAll = true;
    } else {
      checkedKeys = {};
    }
    this.setState(
      {
        selectAll,
        selectIndeterminate: false,
        checkedList: checkedKeys,
      },
      this.handlerSelectChange,
    );
  };

  handlerSelectChange = () => {
    const { onSelectChange } = this.props;
    const { checkedList } = this.state;
    if (onSelectChange) {
      const keys = Object.keys(checkedList || {});
      const items = keys.map(key => checkedList[key]);
      onSelectChange(keys, items);
    }
  };

  getItemKey = (item: any, index: number) => {
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

  getListItemProps = (item: any, index: number) => {
    const { checkbox } = this.props;
    const { checkedList } = this.state;
    const keyValue = this.getItemKey(item, index);
    if (checkbox) {
      return {
        onClick: () => this.handlerItemCheck(item, index),
        className: cls({ checked: !!checkedList[keyValue] }),
      };
    }
    return {
      onClick: () => this.handlerItemSelect(item, index),
      className: cls({ selected: !!checkedList[keyValue] }),
    };
  };

  hasNoHeader = () => {
    const { extra, showSearch, title } = this.props;
    if (extra || showSearch || title) {
      return false;
    }
    return true;
  };

  renderAvatar = (keyValue: any, index: number) => {
    const { itemField, checkbox } = this.props;
    const { checkedList } = this.state;
    const { avatar } = itemField;
    if (checkbox) {
      return <Checkbox checked={!!checkedList[keyValue]} />;
    }
    if (avatar instanceof Function) {
      return avatar(keyValue, checkedList, index);
    }
    return avatar;
  };

  renderCardExtra = () => {
    const { extra, showSearch, searchPlaceHolder } = this.props;
    if (extra || showSearch) {
      return (
        <>
          {showSearch ? (
            <Search
              placeholder={searchPlaceHolder || this.locale.searchPlaceHolder}
              onChange={e => this.handlerSearchChange(e.target.value)}
              onSearch={this.handlerSearch}
              onPressEnter={this.handlerSearch}
              style={{ width: 172 }}
            />
          ) : null}
          {extra}
        </>
      );
    }
    return null;
  };

  renderTool = () => {
    const { pagination, selectAll, selectIndeterminate, checkedList, paginationCount } = this.state;
    const { customTool, checkbox } = this.props;
    let total = this.data.length;
    if (!isBoolean(pagination) && isPlainObject(pagination)) {
      total = pagination.total || 0;
    } else {
      total = paginationCount;
    }
    if (customTool) {
      return customTool({ checkedList, total });
    }
    return (
      <>
        {checkbox ? (
          <Checkbox
            checked={selectAll}
            indeterminate={selectIndeterminate}
            onChange={this.handlerSelectAllChange}
          >
            {this.locale.selectAllLable}
          </Checkbox>
        ) : (
          <span />
        )}
        <span className="tool-desc">{formatMsg(this.locale.totalCount, { total })}</span>
      </>
    );
  };

  renderListCard = (locale: LocaleItem) => {
    this.locale = locale;
    const {
      title,
      className,
      style,
      listProps,
      itemField,
      showArrow,
      bordered,
      itemTool,
    } = this.props;
    const { loading, dataSource, pagination } = this.state;
    return (
      <Card
        style={style}
        title={title}
        className={cls('seid-list-card', className, {
          'no-header': this.hasNoHeader(),
          'no-page-bar': pagination === false,
        })}
        bordered={bordered}
        extra={this.renderCardExtra()}
      >
        <div className="list-card-tool-box">{this.renderTool()}</div>
        <div className="list-card-body">
          <ScrollBar>
            <List
              itemLayout={listProps && listProps.itemLayout ? listProps.itemLayout : 'horizontal'}
              dataSource={dataSource}
              loading={loading}
              renderItem={(item: any, index: number) => {
                const keyValue = this.getItemKey(item, index);
                return (
                  <List.Item key={keyValue} actions={[]} {...this.getListItemProps(item, index)}>
                    <Skeleton avatar loading={loading} active>
                      {listProps && listProps.renderItem ? (
                        listProps.renderItem(item as T, index)
                      ) : (
                        <>
                          <List.Item.Meta
                            avatar={this.renderAvatar(keyValue, index)}
                            title={itemField.title(item, index)}
                            description={itemField.description(item, index)}
                          />
                          {itemField.extra ? itemField.extra(item, index) : null}
                          {showArrow ? (
                            <div className="arrow-box">
                              <ExtIcon type="right" antd />
                            </div>
                          ) : null}
                        </>
                      )}
                    </Skeleton>
                    {itemTool && itemTool instanceof Function ? itemTool(item, index) : null}
                  </List.Item>
                );
              }}
            />
          </ScrollBar>
        </div>
        {pagination === false ? null : (
          <div className="list-card-page-bar">
            <Pagination simple onChange={this.handlerPageChange} {...pagination} />
          </div>
        )}
      </Card>
    );
  };

  render() {
    return (
      <SeidLocaleReceiver defaultLocale={defaultLocale} componentName="ListCard">
        {this.renderListCard}
      </SeidLocaleReceiver>
    );
  }
}

export default ListCard;
