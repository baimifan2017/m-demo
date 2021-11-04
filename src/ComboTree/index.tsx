import * as React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import isEqual from 'react-fast-compare';
import cls from 'classnames';
import { FormProps, FormInstance } from 'antd/es/form/Form';
import Select from 'antd/es/select';
import Input from 'antd/es/input';
import Skeleton from 'antd/es/skeleton';
import Empty from 'antd/es/empty';
import Tree, { AntTreeNodeSelectedEvent } from 'antd/es/tree';
import { Method, AxiosRequestConfig } from 'axios';
import ScrollBar from '../ScrollBar';
import { objectAssignAppend, request, setCursorPosition } from '../utils';
import './style/index.less';

const { Search } = Input;
const { TreeNode } = Tree;

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
  type: 'GET' | 'POST';
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
   * zh-CN: ComboList属性field映射,属性名必须一一对应
   * en-US: display property name
   */
  field?: string[];
  /**
   * zh-CN: 显示的属性名
   * en-US: display property name
   */
  name: string;
  /**
   * zh-CN: 子节点的属性名
   */
  childKey: string;
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
  afterSelect?: (item: any) => void;
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

const childFieldKey = 'children';

class ComboTree<T> extends React.Component<ComboProps<T>, any> {
  static defaultProps = {
    disabled: false,
    showSearch: true,
    store: null,
    dataSource: [],
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
      childKey: PropTypes.string,
    }).isRequired,
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

  protected comboList: HTMLDivElement | undefined;

  protected select: React.ReactNode;

  protected quickSearchValue: string = '';

  protected searchInput: any;

  constructor(props: ComboProps<T>) {
    super(props);
    const { defaultValue, value, dataSource = [] } = props;
    const defaultV = value || defaultValue || undefined;
    this.loaded = false;
    this.data = [...dataSource];
    this.state = {
      value: defaultV,
      loading: false,
      showTree: false,
      treeData: dataSource,
      autoExpandParent: true,
      defaultSelectedKeys: [],
      expandedKeys: [],
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

  hideComboList = (e: MouseEvent) => {
    const { showTree } = this.state;
    const tDom = ReactDOM.findDOMNode(this.comboList);
    if (showTree) {
      if (tDom && tDom.contains(e.target as HTMLElement)) {
        this.focus();
      } else {
        setTimeout(() => {
          this.setState({ showTree: false });
        }, 200);
      }
    }
  };

  componentDidUpdate(prevProps: ComboProps<T>) {
    if (
      !isEqual(prevProps.cascadeParams, this.props.cascadeParams) ||
      !isEqual(prevProps.value, this.props.value)
    ) {
      const { defaultValue, value } = this.props;
      const defaultV = value || defaultValue || undefined;
      this.setState({
        value: defaultV,
      });
    }
  }

  showComboList = (showTree: boolean) => {
    if (showTree) {
      const { store } = this.props;
      if (store) {
        this.getData();
      }
      this.setState({ showTree });
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

  getData = () => {
    const { cascadeParams, store } = this.props;
    const { params } = store || {};
    const superParams = { ...(params || {}) };
    if (cascadeParams) {
      this.loaded = false;
      objectAssignAppend(superParams, cascadeParams);
    }
    if (!this.loaded) {
      this.loadData(superParams);
    }
  };

  loadData = (params: any) => {
    const { store, afterLoaded, reader } = this.props;
    const { url, type } = store || {};
    const methodType: Method = type || 'GET';
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
            }
            this.data = ds;
            this.setState({
              treeData: [...ds],
            });
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

  filterNodes = (
    filterName: string,
    valueKey: string,
    treeData: object[],
    expandedKeys: string[],
  ) => {
    const { reader } = this.props;
    const { childKey } = reader;
    const newArr: object[] = [];
    treeData.forEach(treeNode => {
      const nodeChildren = (treeNode as any)[childKey || childFieldKey];
      const fieldValue = this.getReader(filterName, treeNode);
      if (fieldValue.toLowerCase().indexOf(valueKey) > -1) {
        newArr.push(treeNode);
        expandedKeys.push(this.getRowKey(treeNode));
      } else if (nodeChildren && nodeChildren.length > 0) {
        const ab = this.filterNodes(
          filterName,
          valueKey,
          nodeChildren,
          expandedKeys,
        );
        const obj = {
          ...treeNode,
          [childKey || childFieldKey]: ab,
        };
        if (ab && ab.length > 0) {
          newArr.push(obj);
        }
      }
    });
    return newArr;
  };

  getLocalFilterData = () => {
    const { expandedKeys: expKeys } = this.state;
    const { reader, name } = this.props;
    let newData = [...this.data];
    const expandedKeys: string[] = [...expKeys];
    const searchValue = this.quickSearchValue;
    if (searchValue) {
      let filterName = name;
      if (reader && reader.name) {
        filterName = reader.name;
      }
      newData = this.filterNodes(
        filterName,
        searchValue.toLowerCase(),
        newData,
        expandedKeys,
      );
    }
    return { treeData: newData, expandedKeys };
  };

  onExpand = (expandedKeys: string[]) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  handlerSearchChange = (e: any) => {
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
    const { treeData, expandedKeys } = this.getLocalFilterData();
    this.setState(
      {
        treeData,
        expandedKeys,
        autoExpandParent: true,
      },
      this.focus,
    );
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
      throw new Error('rowKey is empty');
    }
    return key;
  };

  getItemBySelectedKeys = (selectedKeys: string[]) => {
    const nodeData: object[] = [];
    for (let i = 0; i < selectedKeys.length; i++) {
      this.getTreeNodeByKey(this.data, nodeData, selectedKeys[i]);
    }
    return nodeData;
  };

  getTreeNodeByKey = (treeNodes: object[], nodeData: object[], key: string) => {
    const { reader } = this.props;
    const { childKey } = reader;
    for (let i = 0; i < treeNodes.length; i += 1) {
      const node = treeNodes[i];
      const rowKey = this.getRowKey(node);
      const nodeChildren = (node as any)[childKey || childFieldKey];
      if (rowKey === key) {
        nodeData.push(node);
      }
      if (nodeChildren && nodeChildren.length > 0) {
        this.getTreeNodeByKey(nodeChildren, nodeData, key);
      }
    }
  };

  onSelect = (selectedKeys: string[], e: AntTreeNodeSelectedEvent) => {
    const { afterSelect, reader, form, name, field = [] } = this.props;
    if (e.selected) {
      const selectNodes = this.getItemBySelectedKeys(selectedKeys);
      const item = selectNodes.length > 0 ? selectNodes[0] : null;
      this.setState(
        {
          showTree: false,
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
            afterSelect(item);
          }
        },
      );
    }
  };

  renderTreeNodes = (data: object[]) => {
    const { reader } = this.props;
    const searchValue = this.quickSearchValue;
    return data.map(item => {
      const { name: readerName, childKey } = reader;
      const readerValue = (item as any)[readerName];
      const readerChildren = (item as any)[childKey || childFieldKey];
      const i = readerValue.toLowerCase().indexOf(searchValue.toLowerCase());
      const beforeStr = readerValue.substr(0, i);
      const afterStr = readerValue.substr(i + searchValue.length);
      const title =
        i > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{readerValue}</span>
        );
      if (readerChildren && readerChildren.length > 0) {
        return (
          <TreeNode title={title} key={this.getRowKey(item)}>
            {this.renderTreeNodes(readerChildren)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={this.getRowKey(item)} />;
    });
  };

  render() {
    const {
      treeData,
      loading,
      value,
      showTree,
      expandedKeys,
      autoExpandParent,
      defaultSelectedKeys,
    } = this.state;
    const {
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
        // open={showTree}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={this.onClearValue}
        disabled={disabled}
        {...selectRestProps}
        dropdownRender={() => (
          <div
            className={cls('seid-combo-tree')}
            ref={ref => this.initComboList(ref)}
          >
            {showSearch ? (
              <div className="action-bar">
                <Search
                  ref={node => (this.searchInput = node)}
                  placeholder={searchPlaceHolder}
                  onChange={this.handlerSearchChange}
                  onSearch={this.onSearch}
                  onPressEnter={this.onSearch}
                />
              </div>
            ) : null}
            <div className="list-body">
              <Skeleton loading={loading} active>
                <ScrollBar style={{height: 220}}>
                  {treeData && treeData.length === 0 ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    <Tree
                      autoExpandParent={autoExpandParent}
                      expandedKeys={expandedKeys}
                      defaultSelectedKeys={defaultSelectedKeys}
                      // @ts-ignore
                      onExpand={this.onExpand}
                      // @ts-ignore
                      onSelect={this.onSelect}
                    >
                      {this.renderTreeNodes(treeData)}
                    </Tree>
                  )}
                </ScrollBar>
              </Skeleton>
            </div>
          </div>
        )}
      />
    );
  }
}

export default ComboTree;
