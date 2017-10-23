/**
*
* NavTree
*
*/

import React from 'react';
import pubsub from 'pubsub-js'
import {Table, Row, Col, Input, Button,Tree } from 'antd'
const TreeNode = Tree.TreeNode;
import request from 'utils/request'
import CoreComponent from 'components/CoreComponent'
import {resolveDataSource} from 'utils/componentUtil'


class NavTree extends CoreComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props)
        this.state={
            dataSource:[],
        }
        pubsub.subscribe(`${props.config.id}.setData`,(name,payload)=>{
            this.setState({dataSource:payload.eventPayload},()=>{
                pubsub.publish(`${this.props.config.id}.mergeData`,{dataSource:payload.eventPayload})
            })
        })
    }

    onSelect = (selectedKeys, info) => {
      console.log('selectedKeys:::',selectedKeys)

        if(selectedKeys=="all"){
            pubsub.publish(`${this.props.config.id}.mergeData`,{index:'all'})
        }else{
            if(selectedKeys!="undefined"){
                pubsub.publish(`${this.props.config.id}.mergeData`,{index:selectedKeys})
            }
        }



    }

    onCheck = (checkedKeys, info) => {

    }

    componentDidMount(){
      pubsub.publish(`${this.props.config.id}.didMount`,{})
        pubsub.publish(`${this.props.config.id}.mergeData`,{index:[]})
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        pubsub.unsubscribe(`${this.props.config.id}.setData`)
    }

    render() {
      const {dataSource,ids}=this.state;

        return (
        <div>
          <Tree
              className="draggable-tree"
              checkable={false}
              multiple={false}
              onSelect={this.onSelect}
              onCheck={this.onCheck}
          >
            <TreeNode title={this.props.config.title} key="all">
                {
                    dataSource&&dataSource.map((item,index)=>
                      <TreeNode title={item.code} key={index} />
                    )
                }
            </TreeNode>
          </Tree>
        </div>
      );
  }
}

NavTree.propTypes = {

};

export default NavTree;
