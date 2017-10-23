/*
 *
 * MeasurementUnitPage
 *
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb , Row, Card, Col, Tabs } from 'antd';
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil';
import AppButton from "components/AppButton";
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import TreeField from 'components/Form/TreeField';
import TableField from 'components/Form/TableField';
import TextField from 'components/Form/TextField';
import AppTable from 'components/AppTable';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'

const TabPane = Tabs.TabPane;

// const asyncValidate = values => {
//     let dataSource = {
//         mode: "dataContext",
//         type: "api",
//         method: "POST",
//         url: "/sm/checkUnique/check.action",
//     }
//
//     let className = "com.neusoft.ime.md.mdMeasurementUnit.dto.MdMeasurementUnitDTO";
//     let fieldNames = "code,delete";
//     let fieldValues = values.get('code') + ",0";
//     // let gid = (values.get('gid')!=undefined && values.get('gid')!='')?values.get('gid'):''
//     //
//     // console.log(values.get('gid'))
//
//     return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:"",  className:className,fieldNames:fieldNames,fieldValues:fieldValues} }).then(function (res) {
//         resolve(res)
//     })).then(function (res) {
//         if (res.data) {
//             throw {code:'已存在!'};
//         }
//     })
// }

export class MeasurementUnitPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
        let dataSource = {
            mode: "dataContext",
            type: "api",
            method: "POST",
            url: "/ime/mdMeasurementUnit/query.action",
        };
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
                        "field": "",
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
            pubsub.publish("@@form.init", { id: "measurementUnitForm", data: Immutable.fromJS({measurementUnitTable:data.data}) })
            pubsub.publish("measurementUnitTable.activateAll", false)
        })

    }


    render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>业务建模</Breadcrumb.Item>
              <Breadcrumb.Item>物料</Breadcrumb.Item>
              <Breadcrumb.Item>计量单位</Breadcrumb.Item>
          </Breadcrumb>
          <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
              <Row>
                  <Col span={14} xs={24}>
                      <AppButton config={{
                          id: "unitCreateBtn",
                          title: "创建",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "unitCreateBtn.click",
                                  pubs: [
                                      {
                                          event:"unitCreateBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitModifyBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitDeleteBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"updateBasicUnitBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitCreateSaveBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitModifySaveBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitCancelBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitCreateSaveBtn.enabled",
                                          payload:true
                                      },
                                      {
                                          event:"unitCancelBtn.enabled",
                                          payload:true
                                      },
                                      {
                                          event:"measurementUnitTable.addRow",
                                          eventPayloadExpression:`
                                          //pubsub.publish("measurementUnitTable.activateAll", true)
                                                   callback({type:dataContext.nodeGid})
                                            `
                                      }
                                  ]
                              }
                          ]
                      }}>
                      </AppButton>
                      <AppButton config={{
                          id: "unitModifyBtn",
                          title: "修改",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"measurementUnitTable.onSelectedRows",
                                  pubs:[
                                      // {
                                      //     event: "unitModifyBtn.enabled",
                                      //     payload:true
                                      // },
                                      // {
                                      //     event: "unitDeleteBtn.enabled",
                                      //     payload:true
                                      // },
                                      // {
                                      //     event: "updateBasicUnitBtn.enabled",
                                      //     payload:true
                                      // },
                                      {
                                          event: "unitModifyBtn.dataContext"
                                      },
                                      {
                                          event: "measurementUnitTable.expression",      //当勾选多条时修改按钮置灰
                                          meta: {
                                              expression: `
                                              if(data.eventPayload!=undefined && data.eventPayload!=null){
                                                  let size = data.eventPayload.length
                                                  console.log("size",size)
                                                  if(size==1){
                                                    pubsub.publish("unitModifyBtn.enabled",true);
                                                    pubsub.publish("unitDeleteBtn.enabled",true);
                                                    pubsub.publish("updateBasicUnitBtn.enabled",true);
                                                    //pubsub.publish("unitModifySaveBtn.enabled",true);
                                                   // pubsub.publish("unitCreateSaveBtn.enabled",true);
                                                  }else if(size==0){
                                                    pubsub.publish("unitModifyBtn.enabled",false);
                                                    pubsub.publish("unitDeleteBtn.enabled",false);
                                                    pubsub.publish("updateBasicUnitBtn.enabled",false);
                                                    //pubsub.publish("unitModifySaveBtn.enabled",false);
                                                    //pubsub.publish("unitCreateSaveBtn.enabled",false);
                                                  }else{
                                                    //pubsub.publish("unitModifyBtn.enabled",false);
                                                    //pubsub.publish("unitDeleteBtn.enabled",false);
                                                    pubsub.publish("updateBasicUnitBtn.enabled",false);
                                                    //pubsub.publish("unitModifySaveBtn.enabled",false);
                                                    //pubsub.publish("unitCreateSaveBtn.enabled",false);
                                                  }
                                              }
                                                  `
                                          }
                                      }
                                      //控制按钮显示、不显示
                                      // {
                                      //     event: "unitCreateBtn.visible",
                                      //     payload:true
                                      // },{
                                      //     event:"unitModifyBtn.visible",
                                      //     payload:true
                                      // },
                                      // {
                                      //     event:"unitDeleteBtn.visible",
                                      //     payload:true
                                      // },
                                      // {
                                      //     event:"updateBasicUnitBtn.visible",
                                      //     payload:true
                                      // },
                                      // {
                                      //     event:"unitCreateSaveBtn.visible",
                                      //     payload:false
                                      // },
                                      // {
                                      //     event:"unitModifySaveBtn.visible",
                                      //     payload:false
                                      // },
                                      // {
                                      //     event:"unitCancelBtn.visible",
                                      //     payload:false
                                      // },
                                      // {
                                      //     event: "measurementUnitTable.activateAll",
                                      //     payload:false
                                      // }
                                      // {
                                      //     event:"measurementUnitTable.expression",
                                      //     meta:{
                                      //         expression:`
                                      //             console.log(data)
                                      //             console.log(11111,data.eventPayload)
                                      //         `
                                      //     }
                                      // }
                                  ],
                                  // behaviors:[
                                  //     {
                                  //         type: "fetch",
                                  //         id: "measurementUnitTable",
                                  //         data: "selectedRows",
                                  //         successPubs: [
                                  //             {
                                  //                 event: "@@form.init",
                                  //                 eventPayloadExpression: `
                                  //                     //console.log(111)
                                  //                 `
                                  //             }
                                  //         ]
                                  //     }
                                  //     ]
                              },
                              {
                                  event: "unitModifyBtn.click",
                                  behaviors:[
                                      {
                                          type:"fetch",
                                          id: "unitModifyBtn", //要从哪个组件获取数据
                                          data: "dataContext",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "measurementUnitTable.activateRow"
                                              }
                                          ]
                                      },
                      //                 {
                      //                     type:"request",
                      //                     dataSource: {
                      //                         type: "api",
                      //                         mode: "dataContext",
                      //                         method: "POST",
                      //                         url: "/ime/mdMeasurementUnit/query.action"
                      //                     },
                      //                     bodyExpression:`
                      //                         resolveFetch({fetch:{id:'measurementUnitTable',data:'dataContext'}}).then(function(dt){
                      //                         console.log(dt);
                      //                           let nodeGid = dt
                      //                           if(nodeGid=="-1"){
                      //                               var query =[{
                      //                                   "field":"",
                      //                                   "type":"eq",
                      //                                   "value":nodeGid,
                      //                                   "operator":"and"
                      //                                   }]
                      //                               var params = {
                      //                                    "query":{
                      //                                    "query":query
                      //                                     }
                      //                                   }
                      //                           }else{
                      //                               var query =[{
                      //                                   "field":"type",
                      //                                   "type":"eq",
                      //                                   "value":nodeGid,
                      //                                   "operator":"and"
                      //                                   }]
                      //                               var params = {
                      //                                    "query":{
                      //                                    "query":query
                      //                                     }
                      //                                   }
                      //                           }
                      //                           callback({dataSource:dataSource,dataContext:params})
                      //                           })
                      //                         `
                      // }
                                  ],
                                  pubs: [
                                      {
                                          event:"unitCreateBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitModifyBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitDeleteBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"updateBasicUnitBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitCreateSaveBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitModifySaveBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitCancelBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitModifySaveBtn.enabled",
                                          payload:true
                                      },
                                      {
                                          event:"unitCancelBtn.enabled",
                                          payload:true
                                      },
                                  ]
                              }

                          ]
                      }}>
                      </AppButton>
                      <AppButton config={{
                          id: "unitDeleteBtn",
                          title: "删除",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event: "unitDeleteBtn.click",
                                  behaviors:[
                                      {
                                          type:"fetch",
                                          id:"measurementUnitTable",
                                          data:"selectedRows",
                                          successPubs:[
                                              {
                                                  event:"@@form.init",
                                                  eventPayloadExpression:`
                                                        console.log("dataContext11111111111",eventPayload)

                                                        let ids=[]
                                                        for(var i in eventPayload){
                                                            if(eventPayload[i]!=undefined){
                                                            ids.push(eventPayload[i].gid)
                                                            }
                                                        }
                                                        let dataSource= {
                                                              type: "api",
                                                              mode:"payload",
                                                              method: "POST",
                                                              url: "/ime/mdMeasurementUnit/deleteList.action",
                                                              payload:ids
                                                            }
                                                        let onSuccess = function(res){
                                                            if(res.success){
                                                                var datas ={};
                                                                datas["measurementUnitTable"] = res.data;
                                                                pubsub.publish('@@message.success',"删除成功")
                                                            }else{
                                                                pubsub.publish('@@message.error',"删除失败")
                                                            }
                                                         resolveFetch({fetch:{id:'measurementUnitTable',data:'dataContext'}}).then(function(dt){
                                                                    let nodeGid = dt
                                                                    if(nodeGid=="-1"){
                                                                    let dataSource= {
                                                                          type: "api",
                                                                          mode:"dataContext",
                                                                          method: "POST",
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                       var datas ={};
                                                                       datas["measurementUnitTable"] = res.data;
                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});
                                                                    }
                                                                    resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                                                    }else{
                                                                    var query =[{
                                                                        "field":"type",
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
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                       var datas ={};
                                                                       datas["measurementUnitTable"] = res.data;
                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});
                                                                       pubsub.publish("measurementUnitTable.clearSelect")
                                                                    }
                                                                    resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                                    }
                                                                    })
                                                            }
                                                            resolveDataSourceCallback({dataSource:dataSource,dataContext:eventPayload},onSuccess);
                                                  `
                                              }
                                              ]
                                      }
                                  ],
                                  pubs: [
                                      {
                                          event: "@@form.init",
                                          expression: `

                                          `
                                      },
                                  ]
                              }
                          ]
                      }}>
                      </AppButton>
                      <AppButton config={{
                          id: "updateBasicUnitBtn",
                          title: "设置基本单位",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event: "updateBasicUnitBtn.click",
                                  behaviors:[
                                      {
                                          type:"fetch",
                                          id:"measurementUnitTable",
                                          data:"selectedRows",
                                          successPubs:[
                                              {
                                                  event:"@@form.init",
                                                  eventPayloadExpression:`
                                                      let dataSource= {
                                                            type: "api",
                                                            mode:"dataContext",
                                                            method: "POST",
                                                            url: "/ime/mdMeasurementUnit/updateBasicUnit.action?id="+eventPayload[0].gid,
                                                      }
                                                      let onSuccess = function(res){
                                                         if(res.success){
                                                            var datas ={};
                                                            datas["measurementUnitTable"] = res.data;
                                                            pubsub.publish('@@message.success',"设置成功")
                                                         }else{
                                                            pubsub.publish('@@message.error',"设置失败")
                                                         }
                                                      resolveFetch({fetch:{id:'measurementUnitTable',data:'dataContext'}}).then(function(dt){
                                                                    let nodeGid = dt
                                                                    if(nodeGid=="-1"){
                                                                    let dataSource= {
                                                                          type: "api",
                                                                          mode:"dataContext",
                                                                          method: "POST",
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                       var datas ={};
                                                                       datas["measurementUnitTable"] = res.data;
                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});
                                                                    }
                                                                    resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                                                    }else{
                                                                    var query =[{
                                                                        "field":"type",
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
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                       var datas ={};
                                                                       datas["measurementUnitTable"] = res.data;
                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});
                                                                    }
                                                                    resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                                    }
                                                                    })
                                                            }
                                                            resolveDataSourceCallback({dataSource:dataSource,dataContext:eventPayload},onSuccess);
                                                  `
                                              }
                                          ]
                                      }
                                  ],
                                  pubs: [
                                      {

                                      }
                                  ]
                              }
                          ]
                      }}>
                      </AppButton>
                      <AppButton config={{
                          id: "unitCreateSaveBtn",
                          title: "保存",
                          type: "primary",
                          size: "large",
                          visible: false,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "unitCreateSaveBtn.click",
                                  behaviors:[
                                      {
                                          type:"fetch",
                                          id:"measurementUnitTable",
                                          data:"selectedRows",
                                          successPubs:[
                                              {
                                                  event:"@@form.init",
                                                  eventPayloadExpression:`
                                                       //console.log("CONTEXT"，dataContext)
                                                       resolveFetch({fetch:{id:'measurementUnitForm',data:'@@formValues'}}).then(function(formData){
                                                            console.log("formData",formData)
                                                            let params = formData.measurementUnitTable
                                                            let dataSource= {
                                                                      type: "api",
                                                                      mode:"payload",
                                                                      method: "POST",
                                                                      url: "/ime/mdMeasurementUnit/saveList.action",
                                                                      payload:params
                                                                    }
                                                            let onSuccess = function(res){
                                                                if(res.success){
                                                                    var datas ={};
                                                                    datas["measurementUnitTable"] = res.data;
                                                                    pubsub.publish('@@message.success',"新增成功")
                                                                }else{
                                                                    pubsub.publish('@@message.error',"新增失败")
                                                                }
                                                                resolveFetch({fetch:{id:'measurementUnitTable',data:'dataContext'}}).then(function(dt){
                                                                    let nodeGid = dt
                                                                    if(nodeGid=="-1"){
                                                                    let dataSource= {
                                                                          type: "api",
                                                                          mode:"dataContext",
                                                                          method: "POST",
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                       var datas ={};
                                                                       datas["measurementUnitTable"] = res.data;
                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});
                                                                    }
                                                                    resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                                                    }else{
                                                                    var query =[{
                                                                        "field":"type",
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
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                       var datas ={};
                                                                       datas["measurementUnitTable"] = res.data;
                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});
                                                                    }
                                                                    resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                                    }
                                                                    })
                                                            }
                                                            pubsub.publish("measurementUnitTable.clearSelect")
                                                            pubsub.publish("measurementUnitTable.activateAll", false)
                                                            resolveDataSourceCallback({dataSource:dataSource,dataContext:eventPayload[0]},onSuccess);
                                                       })
                                                  `
                                              }
                                          ]
                                      }
                                  ],
                                  pubs: [
                                      {
                                          event:"unitCreateBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitModifyBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitDeleteBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"updateBasicUnitBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitCreateSaveBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitModifySaveBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitCancelBtn.visible",
                                          payload:false
                                      }
                                  ]
                              }
                          ]
                      }}>
                      </AppButton>
                      <AppButton config={{
                          id: "unitModifySaveBtn",
                          title: "保存",
                          type: "primary",
                          size: "large",
                          visible: false,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "unitModifySaveBtn.click",
                                  behaviors:[
                                      {
                                          type:"fetch",
                                          id:"measurementUnitTable",
                                          data:"selectedRows",
                                          successPubs:[
                                              {
                                                  event:"@@form.init",
                                                  eventPayloadExpression:`
                                                        resolveFetch({fetch:{id:'measurementUnitForm',data:'@@formValues'}}).then(function(formData){
                                                            console.log("formData",formData)
                                                            let params = formData.measurementUnitTable
                                                            let dataSource= {
                                                                      type: "api",
                                                                      mode:"payload",
                                                                      method: "POST",
                                                                      url: "/ime/mdMeasurementUnit/saveList.action",
                                                                      payload:params
                                                            }
                                                        let onSuccess = function(res){
                                                            if(res.success){
                                                                var datas ={};
                                                                datas["measurementUnitTable"] = res.data;
                                                                pubsub.publish('@@message.success',"修改成功")
                                                            }else{
                                                                pubsub.publish('@@message.error',"修改失败")
                                                            }
                                                        resolveFetch({fetch:{id:'measurementUnitTable',data:'dataContext'}}).then(function(dt){
                                                                    let nodeGid = dt
                                                                    if(nodeGid=="-1"){
                                                                    let dataSource= {
                                                                          type: "api",
                                                                          mode:"dataContext",
                                                                          method: "POST",
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                       var datas ={};
                                                                       datas["measurementUnitTable"] = res.data;
                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});
                                                                    }
                                                                    resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                                                    }else{
                                                                    var query =[{
                                                                        "field":"type",
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
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                       var datas ={};
                                                                       datas["measurementUnitTable"] = res.data;
                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});
                                                                    }
                                                                    resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                                    }
                                                                    })
                                                            }
                                                            pubsub.publish("measurementUnitTable.clearSelect")
                                                            pubsub.publish("measurementUnitTable.activateAll", false)
                                                            resolveDataSourceCallback({dataSource:dataSource,dataContext:eventPayload[0]},onSuccess);
                                                            })
                                                  `
                                              }
                                          ]
                                      }
                                  ],
                                  pubs: [
                                      {
                                          event:"unitCreateBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitModifyBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitDeleteBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"updateBasicUnitBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitCreateSaveBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitModifySaveBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitCancelBtn.visible",
                                          payload:false
                                      }
                                  ]
                              }
                          ]
                      }}>
                      </AppButton>
                      <AppButton config={{
                          id: "unitCancelBtn",
                          title: "取消",
                          type: "primary",
                          size: "large",
                          visible: false,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "unitCancelBtn.click",
                                  behaviors:[
                                      {
                                          type:"request",
                                          dataSource:{
                                              type: "api",
                                              mode:"dataContext",
                                              method: "POST",
                                              url: "/ime/mdMeasurementUnit/query.action",
                                              bodyExpression:`
                                              pubsub.publish("measurementUnitTable.clearSelect")
                                              pubsub.publish("measurementUnitTable.activateAll",false)
                                              pubsub.publish("unitModifyBtn.enabled",false);
                                              pubsub.publish("unitDeleteBtn.enabled",false);
                                              pubsub.publish("updateBasicUnitBtn.enabled",false);
                                              resolveFetch({fetch:{id:'measurementUnitTable',data:'dataContext'}}).then(function(dt){
                                                let nodeGid = dt
                                                if(nodeGid=="-1"){
                                                    var query =[{
                                                        "field":"",
                                                        "type":"eq",
                                                        "value":nodeGid,
                                                        "operator":"and"
                                                        }]
                                                    var params = {
                                                         "query":{
                                                         "query":query
                                                          }
                                                        }
                                                }else{
                                                    var query =[{
                                                        "field":"type",
                                                        "type":"eq",
                                                        "value":nodeGid,
                                                        "operator":"and"
                                                        }]
                                                    var params = {
                                                         "query":{
                                                         "query":query
                                                          }
                                                        }
                                                }
                                                callback({dataSource:dataSource,dataContext:params})
                                                })
                                              `
                                          },
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@form.init",
                                                  eventPayloadExpression: `
                                                  resolveFetch({fetch:{id:'measurementUnitTable',data:'dataContext'}}).then(function(dt){
                                                        let nodeGid = dt
                                                                    if(nodeGid=="-1"){
                                                                    var query =[{
                                                                        "field":"",
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
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                    }
                                                                    let onSuccess = function(res){
                                                                                       var datas ={};
                                                                                       datas["measurementUnitTable"] = res.data;
                                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});
                                                                                    }
                                                                    resolveDataSourceCallback({dataSource:dataSource,dataContext:undefined},onSuccess)
                                                                    }else{
                                                                    var query =[{
                                                                        "field":"type",
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
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                                       var datas ={};
                                                                                       datas["measurementUnitTable"] = res.data;
                                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});
                                                                                    }
                                                                    resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                                    }})
                                                  `
                                              }
                                          ]
                                      }
                                  ],
                                  pubs: [
                                      // {
                                      //     event: "measurementUnitTable.activateAll",
                                      //     payload:false
                                      // },
                                      {
                                          event:"unitCreateBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitModifyBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitDeleteBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"updateBasicUnitBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"unitCreateSaveBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitModifySaveBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"unitCancelBtn.visible",
                                          payload:false
                                      }
                                  ]
                              }
                          ]
                      }}>
                      </AppButton>
                  </Col>
              </Row>
          </Card>
          <Row>
              <Col span={ 5 }>
                  <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                      <Field config={{
                          id: 'measurementUnitTree',
                          search: false,
                          enabled: true,
                          visible: true,
                          checkable: false,
                          showLine: true,
                          draggable: false,
                          searchBoxWidth: 300,
                          dataSource: {
                              type: "api",
                              method: "POST",
                              url: '/ime/mdMeasurementUnit/findMeasureByEnumId.action'
                          },
                      }} name="measurementUnitTree"  component={ TreeField } />
                  </Card>
              </Col>
              <Col span={1}>
              </Col>
              <Col span={18}>
                  <Card  style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                      <Tabs defaultActiveKey="1">
                          <TabPane tab="" key="1">
                              <Row>
                                  <Col span={24}>
                                      <FieldArray name="measurementUnitTable" config={{
                                          "id":"measurementUnitTable",
                                          "name":"measurementUnitTable",
                                          "form":"measurementUnitForm",
                                          "rowKey":"id",
                                          "addButton":false,
                                          "showSelect":true,
                                          "unEditable":true, //初始化是否都不可编辑
                                          "type": "checkbox",//表格单选复选类型
                                          "showRowDeleteButton": true,//是否显示操作
                                          "columns":[
                                              {
                                                  "id": "code",
                                                  "title": "计量单位编码",
                                                  "type": "textField",
                                                  "name": "code",
                                                  "enabled": true,
                                                  subscribes: [
                                                      {
                                                          event: "code.onChange",
                                                          pubs: [
                                                              {
                                                                  event:"code.expression",
                                                                  meta:{
                                                                      expression: `
                                                                          resolveFetch({fetch:{id:'code['+me.props.config.rowIndex+']',data:'props'}}).then(function(data1){
                                                                                console.log("data1",data1)
                                                                                let codeValue = data1.input.value
                                                                                let dataSource = {
                                                                                    type: "api",
                                                                                    method: "POST",
                                                                                    url: "/ime/mdMeasurementUnit/validateCode.action?code="+codeValue,
                                                                                }
                                                                                let onSuccess = function(response){
                                                                                    if(response.data){
                                                                                        pubsub.publish("@@message.error","code已存在，请重新输入！")
                                                                                        pubsub.publish("productTable.loadData")
                                                                                        pubsub.publish("unitCreateSaveBtn.enabled",false)
                                                                                    }else{
                                                                                        pubsub.publish("unitCreateSaveBtn.enabled",true)
                                                                                    }
                                                                                }
                                                                                resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                                                          })
                                                                      `
                                                                  }
                                                              }
                                                              ]
                                                      }
                                              ],
                                              },
                                              {
                                                  "id": "name",
                                                  "title": "计量单位名称",
                                                  "type": "textField",
                                                  "name": "name",
                                                  "enabled": true,
                                              },
                                              {
                                                  "id": "englishName",
                                                  "title": "英文名称",
                                                  "type": "textField",
                                                  "name": "englishName",
                                                  "enabled": true,
                                              },
                                              {
                                                  "id": "type",
                                                  "title": "计量分类",
                                                  "type": "selectField",
                                                  "name": "type",
                                                  "enabled": true,
                                                  dataSource: {
                                                      type: "api",
                                                      method:"post",
                                                      url:"/sm/dictionaryEnumValue/query.action",
                                                      mode:"payload",
                                                      payload:{
                                                          "query":{
                                                              "query":[
                                                                  {"field":"smDictionaryEnumGid","type":"eq","value":"563553CDEB423E07E055000000000001"}
                                                              ],
                                                              "sorted":"seq"
                                                          }
                                                      }
                                                  },
                                                  displayField: "val",
                                                  valueField: "gid"
                                              },
                                              {
                                                  "id": "basicUnit",
                                                  "title": "是否基本单位",
                                                  "type": "switchField",
                                                  "name": "basicUnit",
                                                  "enabled": false,
                                                  "checkedChildren": "是",
                                                  "unCheckedChildren": "否",
                                              },
                                              {
                                                  "id": "conversionFactor",
                                                  "title": "换算系数",
                                                  "type": "textField",
                                                  "name": "conversionFactor",
                                                  "enabled": true,
                                              },
                                              {
                                                  "id": "decimalDigit",
                                                  "title": "小数位数",
                                                  "type": "textField",
                                                  "name": "decimalDigit",
                                                  "enabled": true,
                                              }
                                          ],
                                          subscribes:[
                                              {
                                                  event:'measurementUnitTree.onSelect',
                                                  pubs:[
                                                      {
                                                          event:"measurementUnitTable.expression",
                                                          meta:{
                                                              expression:`
                                                                    pubsub.publish("measurementUnitTable.clearSelect")//切换树时清除列表的select
                                                                    pubsub.publish("unitModifyBtn.enabled", false);
                                                                    //pubsub.publish("unitDeleteBtn.enabled", false);
                                                                    pubsub.publish("measurementUnitTable.activateAll", false)//树点击时使列表不可编辑
                                                                    pubsub.publish("updateBasicUnitBtn.enabled", false);
                                                                    let nodeGid = data.eventPayload.selectedKeys["0"]
                                                                    pubsub.publish("unitCreateBtn.dataContext",{eventPayload:{nodeGid:nodeGid}});
                                                                    if(nodeGid=="-1"){
                                                                    var query =[{
                                                                        "field":"",
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
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                                       var datas ={};
                                                                                       datas["measurementUnitTable"] = res.data;
                                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});

                                                                                    }
                                                                    pubsub.publish("measurementUnitTable.dataContext",{
                                                                    eventPayload:data.eventPayload.selectedKeys["0"]
                                                                    });
                                                                    resolveDataSourceCallback({dataSource:dataSource,dataContext:undefined},onSuccess)
                                                                    } else{
                                                                    var query =[{
                                                                        "field":"type",
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
                                                                          url: "/ime/mdMeasurementUnit/query.action",
                                                                        }
                                                                    let onSuccess = function(res){
                                                                                       var datas ={};
                                                                                       datas["measurementUnitTable"] = res.data;
                                                                                       pubsub.publish("@@form.init",{id:"measurementUnitForm",data:datas});
                                                                                    }

                                                                    pubsub.publish("measurementUnitTable.dataContext",{
                                                                    eventPayload:data.eventPayload.selectedKeys["0"]
                                                                    });
                                                                    resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                                    }

                                                              `
                                                          }
                                                      },
                                                      {
                                                          event:"unitCreateBtn.enabled",
                                                          payload:true
                                                      },
                                                      {
                                                          event:"unitModifyBtn.enabled",
                                                          payload:false
                                                      },
                                                      {
                                                          event:"unitDeleteBtn.enabled",
                                                          payload:false
                                                      },
                                                      {
                                                          event:"updateBasicUnitBtn.enabled",
                                                          payload:false
                                                      },
                                                      {
                                                          event:"unitCreateSaveBtn.enabled",
                                                          payload:false
                                                      },
                                                      {
                                                          event:"unitModifySaveBtn.enabled",
                                                          payload:false
                                                      },
                                                      {
                                                          event:"unitCancelBtn.enabled",
                                                          payload:false
                                                      },
                                                      {
                                                          event:"unitCreateBtn.visible",
                                                          payload:true
                                                      },
                                                      {
                                                          event:"unitModifyBtn.visible",
                                                          payload:true
                                                      },
                                                      {
                                                          event:"unitDeleteBtn.visible",
                                                          payload:true
                                                      },
                                                      {
                                                          event:"updateBasicUnitBtn.visible",
                                                          payload:true
                                                      },
                                                      {
                                                          event:"unitCreateSaveBtn.visible",
                                                          payload:false
                                                      },
                                                      {
                                                          event:"unitModifySaveBtn.visible",
                                                          payload:false
                                                      },
                                                      {
                                                          event:"unitCancelBtn.visible",
                                                          payload:false
                                                      }
                                                  ]
                                              }
                                          ],
                                          // dataSource: {
                                          //     type: 'api',
                                          //     method: 'post',
                                          //     pager:true,
                                          //     url: '/ime/mdMeasurementUnit/query.action'
                                          // }
                                      }}component={TableField} />
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

MeasurementUnitPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

function mapStateToProps(props) {
    return {
        onSubmit:()=>{}
    };
}

let MeasurementUnitForm = reduxForm({
    form: "measurementUnitForm",
    //asyncValidate
})(MeasurementUnitPage)

export default connect(mapStateToProps, mapDispatchToProps)(MeasurementUnitForm);
