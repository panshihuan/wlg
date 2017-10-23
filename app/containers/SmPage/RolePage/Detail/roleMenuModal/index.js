import React, { PropTypes } from 'react';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable'
import NavTreeField from 'components/NavTree'
import uuid from 'uuid/v4'
import TreeField from 'components/Form/TreeField'
import { connect } from 'react-redux';
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'




export class RoleMenuModal extends React.PureComponent {

    ok = false   //Operate.success
    constructor(props) {
        super(props);
        //debugger
        //this.id = this.props.location.state[0].gid

        this.id= this.props.roleGid

        console.log("roleGid###",this.id)

    }

    componentWillMount() {
    }
    componentDidMount() {

    }
    componentWillUnmount() {
    }
    componentWillReceiveProps(nextProps) {
    }
    render() {
        return (
            <div>
                <Row>
                    <Col span={10}>
                        <div style={{marginBottom:"20px"}}>全局菜单</div>
                        <Field config={{
                            id: 'MenuTree-left',
                            search: true,
                            enabled: true,
                            visible: true,
                            checkable: true,
                            showLine: true,
                            draggable: false,
                            checkStrictly:false,
                            searchBoxWidth: 300,
                            dataSource: {
                                type: "api",
                                method: "POST",
                                url: '/sm/menu/queryForTree.action'
                            },
                            subscribes:[
                                {
                                    event:"roleMenuAdd-right.click",
                                    pubs:[
                                        {
                                            event: "MenuTree-left.expression",
                                            meta: {
                                                expression: `
                                                    let leftRoot = _.cloneDeep(me.state.dataSource)
                                                    let leftTreeNode = leftRoot[0].childs;
                                                    let checkedNode = _.cloneDeep(me.state.checkedInfo)

                                                    //执行右移动作
                                                    let checkedKeys = _.cloneDeep(me.state.checkedKeys)
                                                    //console.log("me",me)
                                                    console.log("checkedKeys",checkedKeys)
                                                    //console.log(">>>>",checkedNode)

                                                    let id = "${this.id}"
                                                    console.log("roleId",id)

                                                    let dtos = []

                                                    for(var i in checkedKeys){
                                                            var dto = {smRoleGid:id,smMenuGid:checkedKeys[i]}
                                                            console.log("dto",dto)
                                                            dtos.push(dto)
                                                     }
                                                     console.log("dtos",dtos)

                                                     let dataSource= {
                                                                type: "api",
                                                                method: "POST",
                                                                url: "/sm/roleMenu/addList.action",
                                                                mode:"payload",
                                                                payload: dtos
                                                            };

                                                             //回调函数
                                                            let callBack = function(response){
                                                                if(response.success){
                                                                    pubsub.publish("@@message.success","操作成功");
                                                                    pubsub.publish('MenuTree-right.loadData')
                                                                    //右移成功,删除左边树节点
                                                                     pubsub.publish("Operate.success");

                                                                }else{
                                                                    pubsub.publish("@@message.error",response.data);
                                                                    pubsub.publish("RoleMenuAdd-OK.enabled",false);
                                                                }
                                                            }
                                                             resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},callBack);
                                                             //右移按钮置灰
                                                                    pubsub.publish('roleMenuAdd-right.enable',false)

                                                `
                                            }
                                        }
                                    ]
                                }
                            ]


                        }} name="MenuTree-left"  component={ TreeField } />

                    </Col>
                    <Col style={{paddingTop:"200px"}} span={4}>
                        <div>
                            <AppButton config={{
                                id: "roleMenuAdd-left",
                                title: "-",
                                type:"primary",
                                size:"large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"MenuTree-right.onCheck",
                                        pubs:[
                                            {
                                                event:"roleMenuAdd-left.dataContext",
                                            },
                                            {
                                                event: "roleMenuAdd-left.expression",
                                                meta: {
                                                    expression: `
                                                    console.log("listen successful")
                                                    pubsub.publish('roleMenuAdd-left.enabled',true)
                              `
                                                }
                                            }
                                        ]
                                    }
                                ]

                            }} />
                        </div>
                        <div style={{marginTop:"20px"}}>
                            <AppButton config={{
                                id: "roleMenuAdd-right",
                                title: "+",
                                type:"primary",
                                size:"large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"MenuTree-left.onCheck",
                                        pubs:[
                                            {
                                                event:"roleMenuAdd-right.dataContext"
                                            },
                                            {
                                                event: "roleMenuAdd-right.expression",
                                                meta: {
                                                    expression: `
                                                    console.log(">>>>")
                                                    pubsub.publish('roleMenuAdd-right.enabled',true)
                              `
                                                }
                                            },
                                            {
                                                event:"roleMenuAdd-right.enabled",
                                                payload: false
                                            },
                                        ]
                                    },
                                ]
                            }} />
                        </div>
                    </Col>
                    { <Col span={10}>
                        <div style={{marginBottom:"20px"}}>已分配菜单</div>
                        <Field config={{
                            id: 'MenuTree-right',
                            search: true,
                            enabled: true,
                            visible: true,
                            checkable: true,
                            showLine: true,
                            draggable: false,
                            checkStrictly:false,
                            searchBoxWidth: 300,
                            dataSource: {
                                type: "api",
                                method: "POST",
                                url: "/sm/roleMenu/getTreeForRole.action?id="+ this.id,
                            },
                            subscribes:[
                                {
                                    event:"roleMenuAdd-left.click",
                                    pubs:[
                                        {
                                            event: "MenuTree-right.expression",
                                            meta: {
                                                expression: `
                                                    let leftRoot = _.cloneDeep(me.state.dataSource)
                                                    let leftTreeNode = leftRoot[0].childs;
                                                    let checkedNode = _.cloneDeep(me.state.checkedInfo)
                                                    console.log("checkNode",checkedNode)
                                                    //执行右移动作
                                                    let checkedKeys = _.cloneDeep(me.state.checkedKeys)
                                                    //console.log("me",me)
                                                    console.log("checkedKeys",checkedKeys)

                                                    let id = "${this.id}"
                                                    console.log("roleId",id)

                                                    let dtos = []

                                                    for(var i in checkedKeys){
                                                            var dto = {smRoleGid:id,smMenuGid:checkedKeys[i]}
                                                            console.log("dto",dto)
                                                            dtos.push(dto)
                                                     }
                                                     console.log("dtos",dtos)



                                                    let dataSource= {
                                                                type: "api",
                                                                method: "POST",
                                                                url: "/sm/roleMenu/deleteList.action",
                                                                mode:"payload",
                                                                payload: dtos
                                                            };
                                                    //回调函数
                                                    let callBack = function(response){
                                                        if(response.success){
                                                            pubsub.publish("@@message.success","操作成功");
                                                            pubsub.publish("Operate.success");
                                                            //左移成功,删除节点,重新加载右树
                                                            pubsub.publish('MenuTree-right.loadData')


                                                            //右移按钮置灰
                                                            pubsub.publish('roleMenuAdd-left.enable',false)
                                                        }else{
                                                            pubsub.publish("@@message.error",response.data);
                                                            pubsub.publish("RoleMenuAdd-OK.enabled",false);
                                                        }
                                                    }
                                                     resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},callBack);



                                                `
                                            }
                                        }
                                    ]
                                }
                            ]

                        }} name="MenuTree-right"  component={ TreeField } />
                    </Col>}
                </Row>
                <Row>
                    <Col span={6} offset={20}>
                        <AppButton config={{
                            id: "RoleMenuAdd-OK",
                            title: "确定",
                            type:"primary",
                            size:"large",
                            visible: true,
                            enabled: false,
                            subscribes: [
                                {
                                    event:"roleMenuAdd-left.click",
                                    pubs:[
                                        {
                                            event:"RoleMenuAdd-OK.enabled",
                                            payload:true
                                        }
                                    ]
                                },
                                {
                                    event:"roleMenuAdd-right.click",
                                    pubs:[
                                        {
                                            event:"RoleMenuAdd-OK.enabled",
                                            payload:true
                                        }
                                    ]
                                },
                                {
                                    event:"RoleMenuAdd-OK.click",
                                    pubs:[
                                        {
                                            event: "RoleMenuAdd-OK.expression",
                                            meta: {
                                                expression: `
                                                    console.log("ok",${this.ok})
                                                    if(${this.ok}){
                                                        pubsub.publish("@@message.success","操作成功");
                                                    }
                              `
                                            }
                                        },{
                                            event: "roleMenuModal.onCancel",
                                        }
                                    ]
                                }
                            ]

                        }} />
                        <AppButton config={{
                            id: "RoleMenuAdd-Cancel",
                            title: "取消",
                            type:"default",
                            size:"large",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "RoleMenuAdd-Cancel.click",
                                    pubs:[{
                                        event: "roleMenuModal.onCancel",
                                    }]
                                }
                            ]
                        }} />
                    </Col>
                </Row>
            </div>
        );
    }
}



RoleMenuModal.propTypes = {

};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(RoleMenuModal);