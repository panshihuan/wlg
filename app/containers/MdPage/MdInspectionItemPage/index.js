/*
 *
 * MdInspectionSitePage
 *
 */

import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import TreeField from '../../../components/Form/TreeField';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import AppButton from "components/AppButton"
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import React, {PropTypes} from 'react';
import Immutable from 'immutable';
import pubsub from 'pubsub-js'
import TableField from 'components/Form/TableField';

const TabPane = Tabs.TabPane;

const validate = values => {
    const errors = {}
    if (!values.get('inspectionItemCode')) {
        errors.inspectionItemCode = '必填项'
    }
    return errors
}

export class MdInspectionItemPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        let dataSource = {
            mode: "dataContext",
            type: "api",
            method: "POST",
            url: "/ime/mdInspectionItem/query.action",
        };
        console.log("初始化页面")
        let dataContext={
            "condition": [
                {
                    "field": {
                        "accessible": true,
                        "annotations": [
                            "string"
                        ],
                        "declaredAnnotations": {},
                        "modifiers": 0,
                        "name": "string"
                    },
                    "left": "LEFT",
                    "operator": "AND",
                    "path": {},
                    "right": "LEFT",
                    "type": "EQ",
                    "value": "string"
                }
            ],
            "conditions": [
                {
                    "field": {
                        "accessible": true,
                        "annotations": [
                            "string"
                        ],
                        "declaredAnnotations": {},
                        "modifiers": 0,
                        "name": "string"
                    },
                    "left": "LEFT",
                    "operator": "AND",
                    "path": {},
                    "right": "LEFT",
                    "type": "EQ",
                    "value": "string"
                }
            ],
            "page": {
                "actionType": 0,
                "count": 0,
                "endNo": 0,
                "nextPageNo": 0,
                "page": 0,
                "pageSize": 0,
                "pages": 0,
                "prePageNo": 0,
                "startNo": 0
            },
            "pager": {
                "page":1,
                "pageSize":10
            },
            "query": {
                "query": [
                    {
                        "field": "inspectionType",
                        "type": "eq",
                        "value": ""
                    }
                ],
                "sorted": "seq"
            },
            "sorted": "string"
        };

        resolveDataSource({
            dataSource,
            // dataContext:dataContext
        }).then(data=>{
           // console.log('data:::',data)
            pubsub.publish("@@form.init", { id: "MdInspectionItemPage", data: Immutable.fromJS({itemTable:data.data}) })
        })

    }

    //不用
    componentWillMount() {

    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {

    }

    //销毁
    componentWillUnmount() {

    }

    //不用
    componentWillReceiveProps(nextProps) {
       // console.log("111")
    }
    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>质量</Breadcrumb.Item>
                    <Breadcrumb.Item>检验项目</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={8} xs={24}>
                            <AppButton config={{
                                id: "itemAdd1",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "itemAdd1.click",
                                        pubs: [
                                            {
                                                event: "itemTable.addRow",
                                                eventPayloadExpression:`
                                                console.log(me);
                                                //console.log(data);
                                                console.log(dataContext);
                                                callback({inspectionTypeRef:{name:dataContext.nodeName},inspectionType:dataContext.nodeGid})

                                            `
                                            },
                                            {
                                                event: "itemAdd1.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modify2.visible",
                                                payload: false
                                            },
                                            {
                                                event: "addSave3.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modifySave3.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel4.visible",
                                                payload: true
                                            },
                                            {
                                                event: "delete5.visible",
                                                payload: false
                                            },
                                        ],
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton loading={this.props.submitting} onClick={this.props.handleSubmit((values) => {
                            })} config={{
                                id: "modify2",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "itemTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "modify2.dataContext"
                                            }
                                        ]
                                    },
                                    {
                                        event: "modify2.click",
                                        behaviors:[
                                            {
                                                type:"fetch",
                                                id: "modify2", //要从哪个组件获取数据
                                                data: "dataContext",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "itemTable.activateRow"
                                                    },
                                                    {
                                                        event: "itemAdd1.visible",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "modify2.visible",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "addSave3.visible",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "modifySave3.visible",
                                                        payload: true
                                                    },
                                                    {
                                                        event: "cancel4.visible",
                                                        payload: true
                                                    },
                                                    {
                                                        event: "delete5.visible",
                                                        payload: false
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        event:"itemTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "modify2.enabled",
                                                payload:true
                                            }
                                        ]
                                    },
                                    {
                                        event:"itemTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "modify2.enabled",
                                                payload:false
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "addSave3",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "addSave3.click",
                                        pubs: [
                                            {
                                                event: "itemAdd1.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modify2.visible",
                                                payload: true
                                            },
                                            {
                                                event: "addSave3.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modifySave3.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel4.visible",
                                                payload: false
                                            },
                                            {
                                                event: "delete5.visible",
                                                payload: true
                                            },
                                            {
                                                event: "itemTable.dataContext",
                                            },
                                            {
                                                event: 'addSave3.expression',
                                                meta: {
                                                    expression: `
                                                      resolveFetch({fetch:{id:'MdInspectionItemPage',data:'@@formValues'}}).then(function(data){
                                                          console.log(data);
                                                          let dataSource= {
                                                            type: 'api',
                                                            method: 'post',
                                                            mode:"payload",
                                                            url: '/ime/mdInspectionItem/save.action',
                                                            payload: data.itemTable
                                                          };

                                                        resolveDataSourceCallback({dataSource:dataSource},function(response){
                                                        if(response.success) {
                                                            pubsub.publish("@@message.success","新增保存成功");
                                                            resolveFetch({fetch:{id:'addSave3',data:'dataContext'}}).then(function(dt){
                                                                var query =[{
                                                                    "field":"inspectionType",
                                                                    "type":"eq",
                                                                    "value":dt,
                                                                    "operator":"and"
                                                                }]
                                                                var params = {
                                                                     "query":{
                                                                     "query":query
                                                                      }
                                                                }
                                                                let dataSource= {
                                                                    type: "api",
                                                                    mode:"dataContext",
                                                                    method: "POST",
                                                                    url: "/ime/mdInspectionItem/query.action",
                                                                }
                                                                let onSuccess = function(res){
                                                                   var datas ={};
                                                                   datas["itemTable"] = res.data;
                                                                   pubsub.publish("@@form.init",{id:"MdInspectionItemPage",data:datas});
                                                                }
                                                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                            });
                                                     } else {
                                                            pubsub.publish("@@message.error","新增保存失败");
                                                          }
                                                        },function(e){
                                                        //  console.log(e)
                                                        })
                                                    })
                                                    `
                                                }
                                            },
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "modifySave3",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "modifySave3.click",
                                        behaviors:[
                                            {
                                                type:"fetch",
                                                id:"itemTable",
                                                data:"selectedRows",
                                                successPubs:[
                                                    {
                                                        event:"modifySave3.eventPayloadExpression",
                                                        eventPayloadExpression:`
                                                            console.log(eventPayload);
                                                            let dataSource= {
                                                                type: 'api',
                                                                method: 'POST',
                                                                mode:"dataContext",
                                                                url: '/ime/mdInspectionItem/save.action'
                                                            };
                                                            let params = [];
                                                            params.push(eventPayload);
                                                            console.log(params);
                                                            resolveDataSourceCallback({dataSource:dataSource, dataContext:params},function(response){
                                                            if(response.success) {
                                                                pubsub.publish("@@message.success","修改保存成功");
                                                                //刷新
                                                                resolveFetch({fetch:{id:'addSave3',data:'dataContext'}}).then(function(dt){
                                                                var query =[{
                                                                    "field":"inspectionType",
                                                                    "type":"eq",
                                                                    "value":dt,
                                                                    "operator":"and"
                                                                }]
                                                                var params = {
                                                                     "query":{
                                                                     "query":query
                                                                      }
                                                                }
                                                                let dataSource= {
                                                                    type: "api",
                                                                    mode:"dataContext",
                                                                    method: "POST",
                                                                    url: "/ime/mdInspectionItem/query.action",
                                                                }
                                                                let onSuccess = function(res){
                                                                   var datas ={};
                                                                   datas["itemTable"] = res.data;
                                                                   console.log("测试")
                                                                   pubsub.publish("@@form.init",{id:"MdInspectionItemPage",data:datas});
                                                                }
                                                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                            });
                                                         } else {
                                                                pubsub.publish("@@message.error","修改保存失败");
                                                              }
                                                            },function(e){
                                                                console.log(e)
                                                            })
                                                        `
                                                    }
                                                ]
                                            }
                                        ],
                                        pubs: [
                                            {
                                                event: "itemAdd1.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modify2.visible",
                                                payload: true
                                            },
                                            {
                                                event: "addSave3.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modifySave3.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel4.visible",
                                                payload: false
                                            },
                                            {
                                                event: "delete5.visible",
                                                payload: true
                                            },
                                            {
                                                event: "itemTable.onSelectedRows",
                                                pubs: [
                                                    {
                                                        event: "delete5.dataContext"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "cancel4",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cancel4.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/mdInspectionItem/query.action",
                                                },
                                                successPubs: [{
                                                    event: "@@form.init",
                                                    eventPayloadExpression: `
                                                        let datas = {itemTable:eventPayload}
                                                        console.log("eventPayload2",eventPayload)//调接口后的返回值
                                                        callback({id:"MdInspectionItemPage",data:datas})
                            `
                                                    }
                                                ]
                                            }
                                        ],
                                        /* pubs: [
                                             {

                                                 event: "itemTable.expression",//在某个组件上执行表达式
                                                 meta: {
                                                     expression: `
                                                     console.log("0913");
                                 let nodeGid = data.eventPayload.selectedKeys["0"]
                                 console.log(data.eventPayload);
                                 let dataSource= {
                                   type: "api",
                                   mode:"dataContext",
                                   method: "POST",
                                   url: "/ime/mdInspectionItem/query.action",
                                 }
                                 let onSuccess = function(res){
                                    var datas ={};
                                    datas["itemTable"] = res.data;
                                    pubsub.publish("@@form.init",{id:"MdInspectionItemPage",data:{}});

                                 }
                                 resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                  `
                                                 }
                                             }
                                         ],*/
                                        pubs: [
                                            {
                                                event: "itemAdd1.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modify2.visible",
                                                payload: true
                                            },
                                            {
                                                event: "addSave3.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modifySave3.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel4.visible",
                                                payload: false
                                            },
                                            {
                                                event: "delete5.visible",
                                                payload: true
                                            },
                                        ]
                                    }
                                ]

                                // subscribes: [
                                //     {
                                //         event: "cancel4.click",
                                //         behaviors:[
                                //             {
                                //                 type:"request",
                                //                 dataSource:{
                                //                     type: "api",
                                //                     mode:"dataContext",
                                //                     method: "POST",
                                //                     url: "/ime/mdInspectionItem/query.action",
                                //                     bodyExpression:`
                                //               resolveFetch({fetch:{id:'itemTable',data:'dataContext'}}).then(function(dt){
                                //               console.log(dt,"come on!");
                                //                 let nodeGid = dt
                                //                 if(nodeGid=="0"){
                                //                     var query =[{
                                //                         "field":"",
                                //                         "type":"eq",
                                //                         "value":nodeGid,
                                //                         "operator":"and"
                                //                         }]
                                //                     var params = {
                                //                          "query":{
                                //                          "query":query
                                //                           }
                                //                         }
                                //                 }else{
                                //                     var query =[{
                                //                         "field":"inspectionType",
                                //                         "type":"eq",
                                //                         "value":nodeGid,
                                //                         "operator":"and"
                                //                         }]
                                //                     var params = {
                                //                          "query":{
                                //                          "query":query
                                //                           }
                                //                         }
                                //                 }
                                //                 comsole.log("666")
                                //                 callback({dataSource:dataSource,dataContext:params})
                                //                 })
                                //               `
                                //                 },
                                //                 successPubs: [  //获取数据完成后要发送的事件
                                //                     {
                                //                         event: "@@form.init",
                                //                         eventPayloadExpression: `
                                //                   resolveFetch({fetch:{id:'itemTable',data:'dataContext'}}).then(function(dt){
                                //                         let nodeGid = dt
                                //                                     if(nodeGid=="0"){
                                //                                     var query =[{
                                //                                         "field":"",
                                //                                         "type":"eq",
                                //                                         "value":nodeGid,
                                //                                         "operator":"and"
                                //                                         }]
                                //                                     var params = {
                                //                                          "query":{
                                //                                          "query":query
                                //                                           }
                                //                                         }
                                //                                     let dataSource= {
                                //                                           type: "api",
                                //                                           mode:"dataContext",
                                //                                           method: "POST",
                                //                                           url: "/ime/mdInspectionItem/query.action",
                                //                                         }
                                //                                     let onSuccess = function(res){
                                //                                                        var datas ={};
                                //                                                        datas["itemTable"] = res.data;
                                //                                                        pubsub.publish("@@form.init",{id:"mdInspectionItem",data:datas});
                                //                                                     }
                                //                                     resolveDataSourceCallback({dataSource:dataSource,dataContext:undefined},onSuccess)
                                //                                     }else{
                                //                                     var query =[{
                                //                                         "field":"inspectionType",
                                //                                         "type":"eq",
                                //                                         "value":nodeGid,
                                //                                         "operator":"and"
                                //                                         }]
                                //                                     var params = {
                                //                                          "query":{
                                //                                          "query":query
                                //                                           }
                                //                                         }
                                //                                     let dataSource= {
                                //                                           type: "api",
                                //                                           mode:"dataContext",
                                //                                           method: "POST",
                                //                                           url: "/ime/mdInspectionItem/query.action",
                                //                                         }
                                //                                     let onSuccess = function(res){
                                //                                                        var datas ={};
                                //                                                        datas["itemTable"] = res.data;
                                //                                                        pubsub.publish("@@form.init",{id:"mdInspectionItem",data:datas});
                                //                                                     }
                                //                                     resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                //                                     }})
                                //
                                //                   `
                                //                     }
                                //                 ]
                                //             }
                                //         ],
                                //         pubs: [
                                //             {
                                //                 event:"itemAdd1.visible",
                                //                 payload:true
                                //             },
                                //             {
                                //                 event:"modify2.visible",
                                //                 payload:true
                                //             },
                                //             {
                                //                 event:"addSave3.visible",
                                //                 payload:false
                                //             },
                                //             {
                                //                 event:"modifySave3.visible",
                                //                 payload:false
                                //             },
                                //             {
                                //                 event:"cancel4.visible",
                                //                 payload:false
                                //             },
                                //             {
                                //                 event:"delete5.visible",
                                //                 payload:true
                                //             }
                                //         ]
                                //     }
                                // ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "delete5",
                                title: "删除",
                                type:"primary",
                                size:"large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "delete5.click",
                                        behaviors:[
                                            {
                                                type:"fetch",
                                                id:"itemTable",
                                                data:"selectedRows",
                                                successPubs:[
                                                    {
                                                        event:"delete5.eventPayloadExpression",
                                                        eventPayloadExpression:`
                                                            console.log(eventPayload);
                                                            let dataSource= {
                                                                type: 'api',
                                                                method: 'POST',
                                                                mode:"dataContext",
                                                                url: '/ime/mdInspectionItem/delete.action?id='+eventPayload.gid,
                                                            };
                                                            let params = [];
                                                            params.push(eventPayload);
                                                            console.log(params);
                                                            resolveDataSourceCallback({dataSource:dataSource, dataContext:params},function(response){
                                                            if(response.success) {
                                                                pubsub.publish("@@message.success","删除成功");
                                                                //刷新
                                                                resolveFetch({fetch:{id:'addSave3',data:'dataContext'}}).then(function(dt){
                                                                var query =[{
                                                                    "field":"inspectionType",
                                                                    "type":"eq",
                                                                    "value":dt,
                                                                    "operator":"and"
                                                                }]
                                                                var params = {
                                                                     "query":{
                                                                     "query":query
                                                                      }
                                                                }
                                                                let dataSource= {
                                                                    type: "api",
                                                                    mode:"dataContext",
                                                                    method: "POST",
                                                                    url: "/ime/mdInspectionItem/query.action",
                                                                }
                                                                let onSuccess = function(res){
                                                                   var datas ={};
                                                                   datas["itemTable"] = res.data;
                                                                   pubsub.publish("@@form.init",{id:"MdInspectionItemPage",data:datas});
                                                                }
                                                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                            });
                                                              } else {
                                                                pubsub.publish("@@message.error","删除失败");
                                                              }
                                                            },function(e){
                                                                console.log(e)
                                                            })
                                                        `
                                                    }
                                                ]
                                            }
                                        ],
                                        pubs: [
                                            {
                                                event: "itemAdd1.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modify2.visible",
                                                payload: true
                                            },
                                            {
                                                event: "addSave3.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modifySave3.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel4.visible",
                                                payload: false
                                            },
                                            {
                                                event: "delete5.visible",
                                                payload: true
                                            }
                                        ]
                                    },
                                    {
                                        event:"itemTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "delete5.enabled",
                                                payload:true
                                            }
                                        ]
                                    },
                                    {
                                        event:"itemTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "delete5.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                ]
                            }}>
                            </AppButton>
                        </Col>
                    </Row>
                </Card>
                <Row>
                    <Col span={ 7 }>
                        <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                            <Field config={{
                                id: 'inspectionTypeTree001', //组件id
                                search: false,
                                enabled: true,
                                visible: true,
                                // defaultExpandedKeys: ['0-0-0', '0-0-1'],
                                // defaultSelectedKeys: ['0-0-0', '0-0-1'],
                                // defaultCheckedKeys: ['0-0-0', '0-0-1'],
                                checkable: false, //复选框
                                showLine: false,
                                draggable: false, //是否可以拖拽
                                searchBoxWidth: 300,
                                dataSource: {
                                    type: "api",
                                    method: "POST",
                                    url: '/ime/mdInspectionItem/getInspectionTypeTree.action'
                                },
                            }} name="inspectionTypeTree001"  component={ TreeField } />
                        </Card>
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={ 16 } >
                        <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="" key="1">
                                    <Row>
                                        <Col span={24}>
                                            <FieldArray name="itemTable" config={{
                                                "id": "itemTable",
                                                "name": "itemTable",
                                                "form":"MdInspectionItemPage",
                                                "rowKey": "id",
                                                "addButton": false, //是否显示默认增行按钮
                                                "showSelect":true, //是否显示选择框
                                                "type":"radio", //表格单选（radio）复选（checkbox）类型
                                                "unEditable":true, //初始化是否都不可编辑
                                                "showSerial": "true",
                                                "columns":[
                                                    {
                                                        "id": "itemCode",
                                                        "type": "textField",
                                                        "title": "检测项目编码",
                                                        "name": "code",
                                                        "enabled": true
                                                    },
                                                    {
                                                        "id": "itemName",
                                                        "type": "textField",
                                                        "title": "检测项目名称",
                                                        "name": "name",
                                                        "enabled": true
                                                    },
                                                    {
                                                        "id": "tableFiled0912leibie",
                                                        "type": "findbackField",
                                                        "title": "检测类别",
                                                        "name": "inspectionTypeRef.name",
                                                        "form": "MdInspectionItemPage",
                                                        tableInfo: {
                                                            id: "item0912jianceleibie",
                                                            size: "small",
                                                            rowKey: "gid",
                                                            width: "500",
                                                            tableTitle: "检测类别",
                                                            showSerial: true,  //序号
                                                            columns: [
                                                                { title: '检测类别编码', width: 100, dataIndex: 'code', key: '1' },
                                                                { title: '检测类别名称', width: 150, dataIndex: 'name', key: '2' },
                                                                { title: '备注', width: 150, dataIndex: 'remark', key: '3' }
                                                            ],
                                                            dataSource: {
                                                                type: 'api',
                                                                method: 'post',
                                                                url: '/ime/mdInspectionType/query.action',
                                                            }
                                                        },
                                                        pageId: 'tableFiledItem0912leibie',
                                                        displayField: "name",
                                                        valueField: {
                                                            "from": "gid",
                                                            "to": "inspectionTypeRef.gid"
                                                        },
                                                        associatedFields: [
                                                            {
                                                                "from": "gid",
                                                                "to": "inspectionType"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                rowOperationItem: [
                                                    {
                                                        id: "deleteItemRow",//deleteItemRow  23456789009865
                                                        type: "linkButton",
                                                        title: "删除",
                                                        subscribes: [
                                                            {
                                                                event: "deleteItemRow.click",
                                                                behaviors: [
                                                                    {
                                                                        type: "request",
                                                                        dataSource: {
                                                                            type: "api",
                                                                            method: "POST",
                                                                            paramsInQueryString: false,//参数拼在url后面
                                                                            url: "/ime/mdInspectionItem/deleteList.action",
                                                                            payloadMapping:[{
                                                                                from: "dataContext",
                                                                                to: "@@Array",
                                                                                key: "gid"
                                                                            }]
                                                                        },
                                                                        successPubs: [
                                                                            {
                                                                                outside:true,
                                                                                event: "@@message.success",
                                                                                payload:'删除成功!'
                                                                            },
                                                                            {
                                                                                outside:true,
                                                                                event: "itemTable.loadData",
                                                                            }
                                                                        ],
                                                                        errorPubs: [
                                                                            {
                                                                                event: "@@message.error",
                                                                                payload:'删除失败!'
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                        ]
                                                    }
                                                ],
                                                subscribes:[
                                                    {
                                                        event:'inspectionTypeTree001.onSelect',
                                                        pubs:[
                                                            {
                                                                event:"itemTable.expression",
                                                                meta:{
                                                                    expression:`
                                                                    let nodeGid = data.eventPayload.selectedKeys["0"]
                                                                    //console.log(data.eventPayload);
                                                                    let nodeName = data.eventPayload.info.selectedNodes["0"].props["data-item"].text;
                                                                    pubsub.publish("itemAdd1.dataContext",{eventPayload:{nodeGid:nodeGid,nodeName:nodeName}})

                                                                    if(nodeGid=="0"){
                                                                        let dataSource= {
                                                                            type: "api",
                                                                            mode:"dataContext",
                                                                            method: "POST",
                                                                            url: "/ime/mdInspectionItem/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                       var datas ={};
                                                                       datas["itemTable"] = res.data;
                                                                       pubsub.publish("@@form.init",{id:"MdInspectionItemPage",data:datas});
                                                                    }
                                                                    pubsub.publish("itemTable.dataContext",{
                                                                    eventPayload:data.eventPayload.selectedKeys["0"]
                                                                    });
                                                                    resolveDataSourceCallback({dataSource:dataSource,dataContext:undefined},onSuccess)
                                                                    } else{
                                                                    var query =[{
                                                                        "field":"inspectionType",
                                                                        "type":"eq",
                                                                        "value":nodeGid,
                                                                        "operator":"and"
                                                                        }]
                                                                    var params = {
                                                                         "query":{
                                                                         "query":query
                                                                          }
                                                                        }
                                                                    let dataSource= {
                                                                          type: "api",
                                                                          mode:"dataContext",
                                                                          method: "POST",
                                                                          url: "/ime/mdInspectionItem/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                          var datas ={};
                                                                          datas["itemTable"] = res.data;
                                                                          pubsub.publish("@@form.init",{id:"MdInspectionItemPage",data:datas});
                                                                                    }
                                                                    pubsub.publish("addSave3.dataContext",{
                                                                    eventPayload:data.eventPayload.selectedKeys[0]
                                                            });
                                                                    resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                            }
                                                              `
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ],
                                //                 subscribes:[
                                //                     {
                                //                         event:'inspectionTypeTree001.onSelect',
                                //                         pubs: [
                                //                             {
                                //
                                //                                 event: "itemTable.expression",//在某个组件上执行表达式
                                //                                 meta: {
                                //                                     expression: `
                                // console.log("good");
                                //
                                // let nodeGid = data.eventPayload.selectedKeys["0"]
                                // console.log(data.eventPayload);
                                //     var query =[{
                                //     "field":"inspectionType",
                                //     "type":"eq",
                                //     "value":nodeGid,
                                //     "operator":"and"
                                //     }]
                                // var params = {
                                //   "query":{
                                //     "query":query
                                //   }
                                // }
                                // let dataSource= {
                                //   type: "api",
                                //   mode:"dataContext",
                                //   method: "POST",
                                //   url: "/ime/mdInspectionItem/query.action",
                                // }
                                // let onSuccess = function(res){
                                //
                                //    var datas ={};
                                //    datas["itemTable"] = res.data;
                                //    pubsub.publish("@@form.init",{id:"MdInspectionItemPage",data:datas});
                                //
                                // }
                                // resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                //  `
                                //                                 }
                                //                             }
                                //                         ]
                                //                     },
                                //                     {
                                //                         event:'inspectionTypeTree001.onSelect',
                                //                         pubs: [
                                //                             {
                                //                                 event: "itemAdd1.enabled",
                                //                                 payload:true
                                //                             }
                                //                         ]
                                //                     },
                                //                 ],
                                                // dataSource: {
                                                //     type: 'api',
                                                //     method: 'post',
                                                //     pager:true,
                                                //     url: '/ime/mdInspectionItem/query.action'
                                                // }
                                            } } component={TableField} />
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default reduxForm({
    form: "MdInspectionItemPage",
    validate,
})(MdInspectionItemPage)

//export default connect(null, mapDispatchToProps)(MdInspectionItemPage);
