import React, { PureComponent } from 'react';
import Input from 'antd/es/input';
import Tree from 'antd/es/tree';
import ScrollBar from '../../scroll-bar';
import ExtIcon from '../../ext-icon';
import ListLoader from '../../list-loader';
import { listAllOrgs } from '../service';
const Search = Input.Search;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';
class Organization extends PureComponent {
    constructor(props) {
        super(props);
        this.allValue = '';
        this.data = [];
        this.filterNodes = (valueKey, treeData, expandedKeys) => {
            const newArr = [];
            treeData.forEach(treeNode => {
                const nodeChildren = treeNode[childFieldKey];
                const fieldValue = treeNode.name;
                if (fieldValue.toLowerCase().indexOf(valueKey) > -1) {
                    newArr.push(treeNode);
                    expandedKeys.push(treeNode.id);
                }
                else if (nodeChildren && nodeChildren.length > 0) {
                    const ab = this.filterNodes(valueKey, nodeChildren, expandedKeys);
                    const obj = Object.assign({}, treeNode, { [childFieldKey]: ab });
                    if (ab && ab.length > 0) {
                        newArr.push(obj);
                    }
                }
            });
            return newArr;
        };
        this.getLocalFilterData = () => {
            const { expandedKeys: expKeys } = this.state;
            let newData = [...this.data];
            const expandedKeys = [...expKeys];
            const searchValue = this.allValue;
            if (searchValue) {
                newData = this.filterNodes(searchValue.toLowerCase(), newData, expandedKeys);
            }
            return { treeData: newData, expandedKeys };
        };
        this.handlerSearchChange = (v) => {
            this.allValue = v || '';
        };
        this.handlerSearch = () => {
            const { treeData, expandedKeys } = this.getLocalFilterData();
            this.setState({
                treeData,
                expandedKeys,
                autoExpandParent: true,
            });
        };
        this.getSelectData = (selectedKey, treeData, currentNode) => {
            for (let i = 0; i < treeData.length; i += 1) {
                const item = treeData[i];
                const childData = item[childFieldKey];
                if (item.id === selectedKey) {
                    Object.assign(currentNode, item);
                    break;
                }
                if (childData && childData.length > 0) {
                    this.getSelectData(selectedKey, childData, currentNode);
                }
            }
        };
        this.handlerSelect = (selectedKeys, e) => {
            const { treeData } = this.state;
            let currentNode = null;
            if (e.selected) {
                currentNode = {};
                this.getSelectData(selectedKeys[0], treeData, currentNode);
            }
            this.setState({
                selectedKeys,
            }, () => {
                const { onSelectChange } = this.props;
                if (onSelectChange) {
                    const orgId = selectedKeys.length > 0 ? selectedKeys[0] : null;
                    onSelectChange(orgId);
                }
            });
        };
        this.handlerExpand = (expandedKeys) => {
            this.setState({
                expandedKeys,
                autoExpandParent: false,
            });
        };
        this.renderTreeNodes = (treeData) => {
            const searchValue = this.allValue || '';
            return treeData.map(item => {
                const readerValue = item.name;
                const readerChildren = item[childFieldKey];
                const i = readerValue.toLowerCase().indexOf(searchValue.toLowerCase());
                const beforeStr = readerValue.substr(0, i);
                const afterStr = readerValue.substr(i + searchValue.length);
                const title = i > -1 ? (<span>
            {beforeStr}
            <span style={{ color: hightLightColor }}>{searchValue}</span>
            {afterStr}
          </span>) : (<span>{readerValue}</span>);
                if (readerChildren && readerChildren.length > 0) {
                    return (<TreeNode title={title} key={item.id}>
            {this.renderTreeNodes(readerChildren)}
          </TreeNode>);
                }
                return (<TreeNode switcherIcon={<ExtIcon type="star" antd style={{ fontSize: 12 }}/>} title={title} key={item.id}/>);
            });
        };
        this.state = {
            loading: false,
            treeData: [],
            expandedKeys: [],
            selectedKeys: [],
            autoExpandParent: true,
        };
    }
    componentDidMount() {
        const { store, onAfterLoaded } = this.props;
        const { gateway, serviceHost } = store;
        this.setState({ loading: true });
        listAllOrgs(serviceHost, gateway)
            .then((res) => {
            if (res.success) {
                this.data = [...res.data];
                let selectedKeys = [];
                let expandedKeys = [];
                let orgId = null;
                if (this.data.length > 0) {
                    orgId = this.data[0].id;
                    selectedKeys = [orgId];
                    expandedKeys = [orgId];
                }
                this.setState({
                    selectedKeys,
                    expandedKeys,
                    treeData: res.data,
                }, () => {
                    if (onAfterLoaded) {
                        onAfterLoaded(orgId);
                    }
                });
            }
        })
            .finally(() => {
            this.setState({ loading: false });
        });
    }
    render() {
        const { locale } = this.props;
        const { allValue, treeData, expandedKeys, selectedKeys, autoExpandParent, loading, } = this.state;
        return (<div className="user-org-box">
        <div className="title">{locale.organizationLabel}</div>
        <div className="search-box">
          <Search placeholder={locale.searchPlaceholder} defaultValue={allValue} onChange={e => this.handlerSearchChange(e.target.value)} onSearch={this.handlerSearch} onPressEnter={this.handlerSearch} style={{ width: 172 }}/>
        </div>
        <div className="user-org-body">
          <ScrollBar>
            {loading ? (<ListLoader />) : (<Tree autoExpandParent={autoExpandParent} selectedKeys={selectedKeys} expandedKeys={expandedKeys} switcherIcon={<ExtIcon type="down" antd style={{ fontSize: 12 }}/>} onSelect={this.handlerSelect} onExpand={this.handlerExpand}>
                {this.renderTreeNodes(treeData)}
              </Tree>)}
          </ScrollBar>
        </div>
      </div>);
    }
}
export default Organization;
