/**
*
* NavTree2
*
*/

import React from 'react';
import pubsub from 'pubsub-js'
import {Table, Row, Col, Input, Button,Tree } from 'antd'
const TreeNode = Tree.TreeNode;
import request from 'utils/request';
import CoreComponent from 'components/CoreComponent';
import {resolveDataSource} from 'utils/componentUtil';

class NavTree2 extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.selectedItem=null; //被选中项的数据
        this.state = Object.assign({
            dataSource: [],
        }, this.state);

        //publish一个空事件
        pubsub.publish(`${this.props.config.id}.nullPub`);

        //set Data 用法：见DistributionTypePage组件(业务建模/物流/配送路径)
        pubsub.subscribe(`${this.props.config.id}.setNavTree`,(eName,payload)=>{
            this.makeResponse(payload).then(result=>{
                this.setState({dataSource:result})
            });
        });

        //load data
        pubsub.subscribe(`${this.props.config.id}.loadNavTree`,(ename,payload)=>{
            this.loadDatas(payload)
        })

    }

    componentDidMount(){
        this.getDatas();
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        pubsub.unsubscribe(`${this.props.config.id}.loadNavTree`)
        pubsub.unsubscribe(`${this.props.config.id}.setNavTree`)
        pubsub.unsubscribe(`${this.props.config.id}.nullPub`)
        pubsub.unsubscribe(`${this.props.config.id}.onSelect`)
    }

    // get data  (request无请求参数,适用于首次加载无请求参数的情况)
    getDatas(){
        if(this.props.config.initLoad){
            if(this.props.config.dataSource){
                resolveDataSource({dataSource:this.props.config.dataSource}).then(res=>{
                    this.makeResponse(res).then(result=>{
                        this.setState({dataSource:result})
                    });
                })
            }
        }
    }

    // load Data (request 有请求参数,适用于带请求参数的情况)
    loadDatas(payload){
        resolveDataSource({dataSource:this.props.config.dataSource,eventPayload:payload}).then(res=>{
            this.makeResponse(res).then(result=>{
                this.setState({dataSource:result})
            });
        })
    }

    // 处理response
    makeResponse(res){
        let promise=new Promise((resolve,reject)=>{
            let result;
            if(_.has(res.data[0],"childs")){
                result=res.data[0]['childs']
            }else{
                result=res.data
            }
            resolve(result)
        });
        return promise;
    }

    // 处理selectedItem(被选中的项)
    makeSeletedItem(){

    }

    // ant提供
    onSelect = (selectedKeys, info) => {
      const {sendField}=this.props.config;
      const {dataSource} =this.state;
        console.log('selectedKeys:::',selectedKeys)

        let selectedRow=dataSource[selectedKeys[0]];
        let sendData;
        if(selectedKeys=="all"){
            sendData=undefined;
        }else if(selectedKeys.length){
            if(sendField){
                sendData=selectedRow[sendField]
            }else{
                sendData=selectedRow
            }
        }else{
            return;
        }

        pubsub.publish(`${this.props.config.id}.onSelect`,sendData)

    };

    // ant提供
    onCheck = (checkedKeys, info) => {

    };

    render() {
      const {dataSource}=this.state;
      const {showJoin,showField}=this.props.config;
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
                          <TreeNode
                              title={
                                  showJoin?`${item[showJoin]}(${item[showField]})`:item[showField]
                              }
                              key={index} />
                      )
                  }
              </TreeNode>
            </Tree>
        </div>
      );
  }
}

NavTree2.propTypes = {

};

export default NavTree2;
