import React from 'react';
import { Tree, Input, Popconfirm, message, Popover } from 'antd';
// @ts-ignore
import { get } from 'lodash';
import request from 'umi-request';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ProForm, { ProFormText } from '@ant-design/pro-form';

const { Search } = Input;

const x = 3;
const y = 2;
const z = 1;
const gData: never[] = [];

// @ts-ignore
const generateData = (_level: number, _preKey: string | undefined, _tns: any[] | undefined) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
// @ts-ignore
generateData(z);

const dataList: { key: any; title: any; }[] = [];
const generateList = (data: string | any[], myKey = 'key', myTitle: string) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    let params = {};
    // @ts-ignore
    params[myKey] = node[myKey];
    // @ts-ignore
    params[myTitle] = node[myTitle];
    // @ts-ignore
    dataList.push(params);
    if (node.children) {
      generateList(node.children, myKey, myTitle);
    }
  }
};
// generateList(gData);

// @ts-ignore
const getParentKey = (key: any, tree: string | any[], myKey) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: { [x: string]: any; }) => item[myKey] === key)) {
        parentKey = node[myKey];
      } else if (getParentKey(key, node.children, myKey)) {
        parentKey = getParentKey(key, node.children, myKey);
      }
    }
  }
  return parentKey;
};

export interface TreeProps {
  myKey: string,
  myTitle: string,
  extra?: any,
  onSelect: (v: any) => void,
  renderItemExtra: (v: object) => JSX.Element,
  header?: {
    left?: any,
    right?: any,
  },
  store?: {
    url: string,
    option?: {
      method: 'get'
    }
  }
  data?: object[]
}

class SearchTree extends React.Component<TreeProps> {
  public props: Readonly<TreeProps> = this.props;

  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    dataSource: [],
  };


  static defaultProps = {
    myKey: 'key',
    myTitle: 'title',
  };

  handleFindTree = () => {
    const { store = {} } = this.props;
    // @ts-ignore
    const { url, option } = store;
    if (url) {
      request(url, {
        method: get(option, 'method', 'get'),
      }).then((r: { success: any; data: any; msg: any; }) => {
        const { success, data, msg } = r;
        if (success) {
          this.setState({
            dataSource: data,
          });
          const { myKey, myTitle } = this.props;
          generateList(data, myKey, myTitle);
        } else {
          message.error(msg, 3);
        }
      });
    }
  };

  componentDidMount() {
    this.handleFindTree();
  }

  onExpand = (expandedKeys: any) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e: { target: { value: any; }; }) => {
    const { dataSource } = this.state;
    const { myTitle, myKey } = this.props;
    const { value } = e.target;

    const expandedKeys = dataList
      .map(item => {
        // @ts-ignore
        if (item[myTitle].indexOf(value) > -1) {
          // @ts-ignore
          return getParentKey(item[myKey], dataSource, myKey);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  render() {
    const { searchValue, expandedKeys, autoExpandParent, dataSource } = this.state;
    const { header, myTitle, myKey, onSelect, renderItemExtra } = this.props;

    // @ts-ignore
    const loop = (data: { title: {} | null | undefined; children: any; key: any; }[]) =>
      data.map((item: any) => {
        const index = item[myTitle].indexOf(searchValue);
        const beforeStr = item[myTitle].substr(0, index);
        const afterStr = item[myTitle].substr(index + searchValue.length);
        // @ts-ignore
        const temTitle =
          index > -1 ? (
            <span style={{ width: '100%' }} onClick={() => onSelect(item)}>
              {beforeStr}
              <span className='site-tree-search-value'>{searchValue}</span>
              {afterStr}

              <span style={{ marginLeft: 12 }} className='operate'>
                {renderItemExtra(item)}
              </span>
            </span>
          ) : (
            <span v-data={item} onClick={() => onSelect(item)}>{item[myTitle]}</span>
          );
        if (item.children) {
          return { title: temTitle, key: item[myKey], children: loop(item.children) };
        }

        return {
          title: temTitle,
          key: item[myKey],
        };
      });

    return (
      <React.Fragment>
        <div className='search-box'>
          {
            get(header, 'left') ? header?.left :
              <Search style={!get(header, 'right') ? { marginBottom: 8 } : { marginRight: 2, width: '80%' }}
                      placeholder='请输入查询' onChange={this.onChange} />
          }
          {
            get(header, 'right') ? header?.right : null
          }
        </div>
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(dataSource)}
        />
      </React.Fragment>
    );
  }
}

export default SearchTree;
