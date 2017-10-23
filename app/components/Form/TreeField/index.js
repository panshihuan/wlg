/**
 *
 * TreeField
 *
 */

import React, {PropTypes} from 'react';
import pubsub from 'pubsub-js'
import CoreComponent from 'components/CoreComponent'
import {Tree, Input, Spin, Icon} from 'antd';
import _ from 'lodash'

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
import {resolveDataSource} from 'utils/componentUtil'

/**
 * 递归查找搜索节点父节点的 key
 * @param text 搜索框内的值
 * @param tree 树的数组
 * @returns {*}
 */
const getParentKey = (text, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];

    if (node.childs) {
      if (node.childs.some(item => item.text === text)) {
        parentKey = node.id;
      } else if (getParentKey(text, node.childs)) {
        parentKey = getParentKey(text, node.childs);
      }
    }
  }

  return parentKey;
};

/**
 * 数组转换为树形结构数据，用数组存放，返回数组
 *
 * 返回值有两种，如果传递进来的根是object类型，返回树形结构数据类型也是object
 * 如果传递进来的根是array类型，返回树形结构数据类型也是array
 * @param root 根
 * @param data 数组
 * @returns {Array}
 */
const array2tree = (root, data) => {
  if (!root) {
    return [];
  }

  if (!data) {
    data = [];
  }
  // pid如果与当前对象 id对应添加孩子节点
  if (Object.prototype.toString.call(root).slice(8, -1) === "Array") {
    if (data && data.length > 0) {
      for (let j = 0; j < root.length; j++) {
        let childs = [];
        for (let i = 0; i < data.length; i++) {
          if (root[j].id == data[i].pid) {
            childs.push(data[i]);
          }
        }

        if (childs.length > 0) {
          root[j].childs = childs;
          array2tree(root[j].childs, data);
        }
      }
    }
  } else if (Object.prototype.toString.call(root).slice(8, -1) === 'Object') {
    let childs = [];
    for (let i = 0; i < data.length; i++) {
      if (root.id == data[i].pid) {
        childs.push(data[i]);
      }
    }
    if (childs.length > 0) {
      root.childs = childs;
      array2tree(root.childs, data);
    }
  } else {
    // 返回值boolean类型：暂无数据或数据没有被正确解析出来
    return false;
  }

  return root;
}

/**
 * 树形结构数据转数组
 * @param tree
 * @returns {Array}
 */
const tree2array = (tree, array) => {
  if (!array) array = [];
  tree.forEach((item, index) => {
    array.push(item);
    if (item.childs) {
      tree2array(item.childs, array);
    }
  });
  return array;
}


class TreeField extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)

    this.state = Object.assign({
      dataSource: [],
      arrayDataSource: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      checkedKeys: [],
      checkedInfo: [],
      selectedKeys: [],
      selectedInfo: [],
      showLoading:false
    },this.state)

    /**
     * 订阅加载动态数据事件
     */
    pubsub.subscribe(`${props.config.id}.loadData`, (eventName, payload) => {
      this.loadData();
    })

    /**
     * 订阅加载静态数据事件
     */
    pubsub.subscribe(`${props.config.id}.setTreeData`, (eventName, payload) => {
      this.setTreeData(eventName, payload);
    })

    /**
     * 自定义勾选
     */
    pubsub.subscribe(`${props.config.id}.checkedKeys`, (eventName, payload) => {
      this.setState({
        checkedKeys:_.cloneDeep(payload)
      })
    })

    /**
     * 全选
     */
    pubsub.subscribe(`${props.config.id}.checkedAll`, (eventName, payload) => {
      const {dataSource} = this.state
      this.setState({
        checkedKeys:this.getAllKeys(dataSource)
      })
    })

    /**
     * 取消勾选
     */
    pubsub.subscribe(`${props.config.id}.checkedClear`, (eventName, payload) => {
      this.setState({
        checkedKeys:[]
      })
    })
  }

  /**
   * 获取所有key（全选）
   */
  getAllKeys = (data) =>{
    let keysArr = []
    data && data.map(item=>{
      keysArr.push(item["id"] || item["gid"])
      if (item.childs && item.childs.length) {
        this.getAllKeys(item.childs)
      }
    })
    return keysArr
  }

  /**
   * 加载静态数据
   *
   * @param eventName 事件名称
   * @param payload 树结构数据
   */
  setTreeData = (eventName, payload) => {
    this.setState({
      "expandedKeys": this.state.expandedKeys,
      "searchValue": '',
      "autoExpandParent": true,
      "checkedKeys": [],
      "checkedInfo": [],
      "selectedKeys": [],
      "selectedInfo": [],
    })
    pubsub.publish(`${this.props.config.id}.onSelectClear`)
    if (payload) {
      // let root = response.data.filter(d => d.pid == undefined || d.pid == '');
      // let data = array2tree(root,response.data);
      // 树形结构数据
      this.setState({dataSource: payload})
      let data = tree2array(payload, []);
      // 数组
      this.setState({arrayDataSource: data});
    } else {
      this.setState({dataSource: false});
    }
  }


  /**
   * 请求数据
   */
  loadData = () => {
    this.setState({
      showLoading:true,
      dataSource:[]
    })
    resolveDataSource({dataSource: this.props.config.dataSource}).then(function (response) {
      if (response.data) {
        //
        this.setState({
          "expandedKeys": this.state.expandedKeys,
          "searchValue": '',
          "autoExpandParent": true,
          "checkedKeys": [],
          "checkedInfo": [],
          "selectedKeys": [],
          "selectedInfo": [],
        })
        pubsub.publish(`${this.props.config.id}.onSelectClear`)
        // let root = response.data.filter(d => d.pid == undefined);
        // let data = array2tree(root,response.data);
        // 树形结构数据
        let data = tree2array(response.data, []);
        this.setState({
          dataSource: response.data,
          showLoading:false,
          arrayDataSource: data,// 数组
        })
        pubsub.publish(`${this.props.config.id}.onTreeLoaded`)

      } else {
        this.setState({
          dataSource: []
        });
      }
    }.bind(this));
  }

  /**
   * 展开/收起节点
   *
   * @param expandedKeys
   * @param bool
   * @param node
   */
  handleExpand = (expandedKeys, {expanded: bool, node}) => {

    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });

    pubsub.publish(`${this.props.config.id}.onExpand`, {"expandedKeys": expandedKeys, "expand": {expanded: bool, node}})
  }

  /**
   * 加载树节点
   *
   * @param data
   * @returns {XML}
   */
  loadTreeNode = (data) => {
    // let root = data.find(d => d.pid == undefined);
    const {searchValue, expandedKeys, autoExpandParent} = this.state;

    const loop = data => data.map((item) => {
      // 搜索树匹配搜索字符标记为红色
      const index = item.text ? item.text.indexOf(searchValue) : -999;
      const beforeStr = item.text ? item.text.substr(0, index) : '';
      const afterStr = item.text ? item.text.substr(index + searchValue.length) : '';
      const text = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{color: '#f50'}}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.text}</span>;
      // 递归渲染树节点
      if (item.childs && item.childs.length) {
        if (item.id) {
          return <TreeNode key={item.id} data-item={item} title={text}>{loop(item.childs)}</TreeNode>;
        } else {
          return <TreeNode key={item.gid} data-item={item} title={text}>{loop(item.childs)}</TreeNode>;
        }

      }

      if (item.id) {
        return <TreeNode key={item.id} data-item={item} title={text}/>;
      } else {
        return <TreeNode key={item.gid} data-item={item} title={text}/>;
      }

    });

    /**
     * 解决拖拽和搜索同时使用冲突
     */
    if (this.props.config.draggable) {
      return (
        <Tree
          showLine={this.props.config.showLine}
          checkable={this.props.config.checkable}
          defaultExpandedKeys={this.props.config.defaultExpandedKeys == undefined ? [] : this.props.config.defaultExpandedKeys}
          defaultSelectedKeys={this.props.config.defaultSelectedKeys == undefined ? [] : this.props.config.defaultSelectedKeys}
          defaultCheckedKeys={this.props.config.defaultCheckedKeys == undefined ? [] : this.props.config.defaultCheckedKeys}
          defaultExpandAll={this.props.config.defaultExpandAll}
          checkedKeys={this.state.checkedKeys}
          onSelect={this.handleSelect}
          onCheck={this.handleCheck}
          onExpand={this.handleExpand}
          autoExpandParent={this.state.autoExpandParent}
          draggable={this.props.config.draggable}
          onDragEnter={this.handleDragEnter}
          onDrop={this.handleDrop}
          checkStrictly={this.props.config.checkStrictly}
        >
          {loop(data)}
        </Tree>
      );
    } else if (this.props.config.isDragOrSearch === "draggable") {
      return (
        <Tree
        showLine={this.props.config.showLine}
        checkable={this.props.config.checkable}
        defaultExpandedKeys={this.props.config.defaultExpandedKeys == undefined ? [] : this.props.config.defaultExpandedKeys}
        defaultSelectedKeys={this.props.config.defaultSelectedKeys == undefined ? [] : this.props.config.defaultSelectedKeys}
        defaultCheckedKeys={this.props.config.defaultCheckedKeys == undefined ? [] : this.props.config.defaultCheckedKeys}
        defaultExpandAll={this.props.config.defaultExpandAll}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.handleSelect}
        onCheck={this.handleCheck}
        onExpand={this.handleExpand}
        autoExpandParent={this.state.autoExpandParent}
        draggable
        onDragEnter={this.handleDragEnter}
        onDrop={this.handleDrop}
        checkStrictly={this.props.config.checkStrictly}
      >
        {loop(data)}
      </Tree>
      );
    } else if(this.props.config.isDragOrSearch === "search") {
      return (
        <div>
          <Search style={{width: this.props.config.searchBoxWidth}} placeholder="Search" onChange={this.handleChange}/>}
          <Tree
            showLine={this.props.config.showLine}
            checkable={this.props.config.checkable}
            defaultExpandedKeys={this.props.config.defaultExpandedKeys == undefined ? [] : this.props.config.defaultExpandedKeys}
            defaultSelectedKeys={this.props.config.defaultSelectedKeys == undefined ? [] : this.props.config.defaultSelectedKeys}
            defaultCheckedKeys={this.props.config.defaultCheckedKeys == undefined ? [] : this.props.config.defaultCheckedKeys}
            defaultExpandAll={this.props.config.defaultExpandAll}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.handleSelect}
            onCheck={this.handleCheck}
            onExpand={this.handleExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            draggable={this.props.config.draggable}
            onDragEnter={this.handleDragEnter}
            onDrop={this.handleDrop}
            checkStrictly={this.props.config.checkStrictly}
          >
            {loop(data)}
          </Tree>
        </div>
      );
    } else {
      return (
        <Tree
        showLine={this.props.config.showLine}
        checkable={this.props.config.checkable}
        defaultExpandedKeys={this.props.config.defaultExpandedKeys == undefined ? [] : this.props.config.defaultExpandedKeys}
        defaultSelectedKeys={this.props.config.defaultSelectedKeys == undefined ? [] : this.props.config.defaultSelectedKeys}
        defaultCheckedKeys={this.props.config.defaultCheckedKeys == undefined ? [] : this.props.config.defaultCheckedKeys}
        defaultExpandAll={this.props.config.defaultExpandAll}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.handleSelect}
        onCheck={this.handleCheck}
        onExpand={this.handleExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        draggable={this.props.config.draggable}
        onDragEnter={this.handleDragEnter}
        onDrop={this.handleDrop}
        checkStrictly={this.props.config.checkStrictly}
      >
        {loop(data)}
      </Tree>
      );
    }


  }

  componentDidMount() {
    if(this.props.config.onLoadData !== false){
      this.loadData();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    pubsub.unsubscribe(`${this.props.config.id}.setTreeData`)
    pubsub.unsubscribe(`${this.props.config.id}.loadData`)
    pubsub.unsubscribe(`${this.props.config.id}.checkedKeys`)
    pubsub.unsubscribe(`${this.props.config.id}.checkedAll`)
    pubsub.unsubscribe(`${this.props.config.id}.checkedClear`)
  }

  /**
   * 选择item
   * @param selectedKeys
   * @param info
   */
  handleSelect = (selectedKeys, info) => {
    let selectNode = info['node']['props']['data-item']
    this.setState(
      {
        "selectedKeys": selectedKeys,
        "selectedInfo": info
      }
    );
    this.selectNode = selectNode
    if (selectedKeys && selectedKeys.length == 0) {
      pubsub.publish(`${this.props.config.id}.onSelectClear`)
    } else if (selectedKeys && selectedKeys.length > 0) {
      pubsub.publish(`${this.props.config.id}.onSelect`, {selectedKeys: selectedKeys, info: info, selectNode:selectNode})
    }
  }

  /**
   * 选择checkbox
   * @param checkedKeys
   * @param info
   */
  handleCheck = (checkedKeys, info) => {
    console.log(info)
    let checkedNodes = []
    let newCheckedKeys = []

    info.checkedNodes.map(item => {
      checkedNodes.push(item.props["data-item"])
    })

    if (!this.props.config.checkStrictly) {
      newCheckedKeys = checkedKeys
    } else {
      newCheckedKeys = checkedKeys.checked
    }

    this.checkedNodes = checkedNodes
    this.setState({
      "checkedKeys": newCheckedKeys,
      "checkedInfo": checkedNodes
    })

    if (newCheckedKeys && newCheckedKeys.length == 0) {
      pubsub.publish(`${this.props.config.id}.onCheckClear`)
    } else if (newCheckedKeys && newCheckedKeys.length > 0) {
      pubsub.publish(`${this.props.config.id}.onCheck`, {checkedKeys: newCheckedKeys, info: checkedNodes})
    }
  }

  /**
   * 搜索树,查找到匹配节点展开其父节点
   * @param e
   */
  handleChange = (e) => {
    const value = e.target.value;
    const expandedKeys = this.state.arrayDataSource.map((item) => {
      if (item.text && item.text.indexOf(value) > -1) {
        return getParentKey(item.text, this.state.arrayDataSource);
      }
      return null;
    }).filter((item, index, array) => item && array.indexOf(item) === index);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
    pubsub.publish(`${this.props.config.id}.onChange`, e)
  }

  /**
   * 拖拽
   * @param info
   */
  handleDrop = (info) => {
    const dropKey = info.node.props.eventKey; // 目标节点
    const dragKey = info.dragNode.props.eventKey; // 当前拖拽节点
    const dropPos = info.node.props.pos.split('-'); // 0-0 开头依次添加 -0 , -1 , -2
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);  // 被放置的位置 - 最后一项索引

    const loop = (data, key, callback) => {
      // 遍历节点，如果等于传递进来的key 目标节点key，callback
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        // 没找到，找子节点key
        if (item.childs) {
          return loop(item.childs, key, callback);
        }
      });
    };

    const data = [...this.state.dataSource];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      // callback中 首先删掉当前拖拽节点，然后把拖拽节点赋值给全局变量
      arr.splice(index, 1);
      dragObj = item;
    });
    // 如果平级拖拽
    if (info.dropToGap) {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i - 1, 0, dragObj);
      }
    } else {
      // 如果不是平级图拽
      loop(data, dropKey, (item) => {
        item.childs = item.childs || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.childs.push(dragObj);
      });
    }
    // 给state设值，重新渲染树
    this.setState({
      dataSource: data,
    });
    pubsub.publish(`${this.props.config.id}.onDrop`, info)
  };

  handleDragEnter = (info) => {
    pubsub.publish(`${this.props.config.id}.onDragEnter`, info)
  }

  /**
   * 异步加载数据
   * @param treeNode
   * @returns {*}
   */
  handleLoadData = (treeNode) => {
    pubsub.publish(`${this.props.config.id}.onLoadData`, treeNode)
  }


  render() {
    const { visible, dataSource, showLoading } = this.state
    const { config: {searchBoxWidth}} = this.props
    if (visible === false) return null;

    const childs = this.loadTreeNode(dataSource);
    return (
      <div>
        {this.props.config.search &&
        <Search style={{width: searchBoxWidth}} placeholder="Search" onChange={this.handleChange}/>}
        {childs}
        {dataSource.length ===0 && <div style={{color: "#999"}}><Icon type="frown-o"/>&nbsp;暂无数据</div>}
        {showLoading && <div><Spin size="large"/></div>}
      </div>
    );
  }
}

TreeField.propTypes = {};

export default TreeField;
