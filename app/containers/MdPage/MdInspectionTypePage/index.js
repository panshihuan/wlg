/*
 *
 * MdInspectionSitePage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import AppButton from 'components/AppButton';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import Immutable from 'immutable';
import pubsub from 'pubsub-js'
import TableField from 'components/Form/TableField';

import TextField from 'components/Form/TextField';
import AppTable from 'components/AppTable';



const TabPane = Tabs.TabPane;
const validate = values => {
    const errors = {}
    if (!values.get('inspectionSiteCode')) {
        errors.inspectionSiteCode = '必填项'
    }
    return errors
}

export class MdInspectionTypePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    //构造
    constructor(props) {
        super(props);
        let dataSource = {
            mode: "dataContext",
            type: "api",
            method: "POST",
            url: "/ime/mdInspectionType/query.action",
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
            console.log('data:::',data)
            pubsub.publish("@@form.init", { id: "MdInspectionTypePage", data: Immutable.fromJS({typeTable:data.data}) })
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
        console.log("111")
    }
    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>质量</Breadcrumb.Item>
                    <Breadcrumb.Item>检验类别</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={8} xs={24}>
                            <AppButton config={{
                                id: "typeAdd11",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "typeAdd11.click",
                                        pubs: [
                                            {
                                                event: "typeTable.addRow"
                                            },
                                            {
                                                event: "typeAdd11.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modify22.visible",
                                                payload: false
                                            },
                                            {
                                                event: "addSave33.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modifySave33.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel44.visible",
                                                payload: true
                                            },
                                            {
                                                event: "delete55.visible",
                                                payload: false
                                            },
                                        ],
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton loading={this.props.submitting} onClick={this.props.handleSubmit((values) => {
                            })} config={{
                                id: "modify22",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "typeTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "modify22.dataContext"
                                            }
                                        ]
                                    },
                                    {
                                        event: "modify22.click",
                                        behaviors:[
                                            {
                                                type:"fetch",
                                                id: "modify22", //要从哪个组件获取数据
                                                data: "dataContext",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "typeTable.activateRow"
                                                    },
                                                    {
                                                        event: "typeAdd11.visible",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "modify22.visible",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "addSave33.visible",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "modifySave33.visible",
                                                        payload: true
                                                    },
                                                    {
                                                        event: "cancel44.visible",
                                                        payload: true
                                                    },
                                                    {
                                                        event: "delete55.visible",
                                                        payload: false
                                                    },
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        event:"typeTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "modify22.enabled",
                                                payload:true
                                            }
                                        ]
                                    },
                                    {
                                        event:"typeTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "modify22.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "addSave33",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "addSave33.click",
                                        behaviors:[
                                            {
                                                type:"fetch",
                                                id:"typeTable",
                                                data:"selectedRows",
                                                successPubs:[
                                                    {
                                                        event:"@@form.init",
                                                        eventPayloadExpression:`
                                                        console.log("eventPayload",eventPayload)
                                                        let dataSource= {
                                                                  type: "api",
                                                                  mode:"dataContext",
                                                                  method: "POST",
                                                                  url: "/ime/mdInspectionType/add.action",
                                                                }
                                                            let onSuccess = function(res){
                                                                var datas ={};
                                                                datas["typeTable"] = res.data;
                                                                pubsub.publish("typeTable.loadData")
                                                                pubsub.publish('@@message.success',"新增成功")
                                                            }

                                                           //刷新
                                                           console.log("刷新")
                                                              console.log("刷新")
                                                            resolveFetch({fetch:{id:'addSave33',data:'dataContext'}}).then(function(dt){
                                                                var params = {
                                                                     "query":{
                                                                      }
                                                                }
                                                                let dataSource= {
                                                                    type: "api",
                                                                    mode:"dataContext",
                                                                    method: "POST",
                                                                    url: "/ime/mdInspectionType/query.action",
                                                                }
                                                                let onSuccess = function(res){
                                                                   var datas ={};
                                                                   datas["typeTable"] = res.data;
                                                                   pubsub.publish("@@form.init",{id:"MdInspectionTypePage",data:datas});
                                                                }
                                                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                            });
                                                            resolveDataSourceCallback({dataSource:dataSource,dataContext:eventPayload},onSuccess);
                                                  `
                                                    }
                                                ]
                                            }
                                        ],
                                        pubs: [
                                            {
                                              event: "typeAdd11.visible",
                                              payload: true
                                          },
                                          {
                                              event: "modify22.visible",
                                              payload: true
                                          },
                                          {
                                              event: "addSave33.visible",
                                              payload: false
                                          },
                                          {
                                              event: "modifySave33.visible",
                                              payload: false
                                          },
                                          {
                                              event: "cancel44.visible",
                                              payload: false
                                          },
                                          {
                                              event: "delete55.visible",
                                              payload: true
                                          },
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "modifySave33",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "modifySave33.click",
                                        behaviors:[
                                            {
                                                type:"fetch",
                                                id:"typeTable",
                                                data:"selectedRows",
                                                successPubs:[
                                                    {
                                                        event:"@@form.init",
                                                        eventPayloadExpression:`
                                                        console.log("eventPayload",eventPayload)
                                                        let dataSource= {
                                                                  type: "api",
                                                                  mode:"dataContext",
                                                                  method: "POST",
                                                                  url: "/ime/mdInspectionType/modify.action?id="+eventPayload.gid,
                                                                }
                                                            let onSuccess = function(res){
                                                                var datas ={};
                                                                datas["typeTable"] = res.data;
                                                                pubsub.publish("typeTable.loadData")
                                                                pubsub.publish('@@message.success',"修改成功")
                                                            }
                                                            resolveFetch({fetch:{id:'addSave33',data:'dataContext'}}).then(function(dt){
                                                                var params = {
                                                                     "query":{
                                                                      }
                                                                }
                                                                let dataSource= {
                                                                    type: "api",
                                                                    mode:"dataContext",
                                                                    method: "POST",
                                                                    url: "/ime/mdInspectionType/query.action",
                                                                }
                                                                let onSuccess = function(res){
                                                                   var datas ={};
                                                                   datas["typeTable"] = res.data;
                                                                   pubsub.publish("@@form.init",{id:"MdInspectionTypePage",data:datas});
                                                                }
                                                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess)
                                                            });
                                                            resolveDataSourceCallback({dataSource:dataSource,dataContext:eventPayload},onSuccess);
                                                  `
                                                    }
                                                ]
                                            }
                                        ],
                                        pubs: [
                                            {
                                                event: "typeAdd11.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modify22.visible",
                                                payload: true
                                            },
                                            {
                                                event: "addSave33.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modifySave33.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel44.visible",
                                                payload: false
                                            },
                                            {
                                                event: "delete55.visible",
                                                payload: true
                                            },
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "cancel44",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cancel44.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/mdInspectionType/query.action",
                                                },

                                                successPubs: [{
                                                    event: "@@form.init",
                                                    eventPayloadExpression: `
                                                        let datas = {typeTable:eventPayload}
                                                 console.log("eventPayload2",eventPayload)//调接口后的返回值
                                                callback({id:"MdInspectionTypePage",data:datas})
                            `,
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
                                                event: "typeAdd11.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modify22.visible",
                                                payload: true
                                            },
                                            {
                                                event: "addSave33.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modifySave33.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel44.visible",
                                                payload: false
                                            },
                                            {
                                                event: "delete55.visible",
                                                payload: true
                                            },
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "delete55",
                                title: "删除",
                                type:"primary",
                                size:"large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"typeTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "delete55.enabled",
                                                payload:true
                                            }
                                        ]
                                    },
                                    {
                                        event:"typeTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "delete55.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "typeTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "delete55.dataContext"
                                            }
                                        ]
                                    },
                                    {
                                        event: "delete55.click",
                                        behaviors:[
                                            {
                                                type:"fetch",
                                                id:"typeTable",
                                                data:"selectedRows",
                                                successPubs:[
                                                    {
                                                        event:"delete55.eventPayloadExpression",
                                                        eventPayloadExpression:`
                                                            console.log(eventPayload);
                                                            let dataSource= {
                                                                type: 'api',
                                                                method: 'POST',
                                                                mode:"dataContext",
                                                                url: '/ime/mdInspectionType/delete.action?id='+eventPayload.gid,
                                                            };
                                                            console.log(eventPayload);
                                                            let params = [];
                                                            params.push(eventPayload);
                                                            console.log(params);
                                                            resolveDataSourceCallback({dataSource:dataSource, dataContext:params},function(response){
                                                              if(response.success) {
                                                                pubsub.publish("@@message.success","删除成功");
                                                                //刷新
                                                                resolveFetch({fetch:{id:'addSave33',data:'dataContext'}}).then(function(dt){
                                                                var params = {
                                                                     "query":{
                                                                      }
                                                                }
                                                                let dataSource= {
                                                                    type: "api",
                                                                    mode:"dataContext",
                                                                    method: "POST",
                                                                    url: "/ime/mdInspectionType/query.action",
                                                                }
                                                                let onSuccess = function(res){
                                                                   var datas ={};
                                                                   datas["typeTable"] = res.data;
                                                                   pubsub.publish("@@form.init",{id:"MdInspectionTypePage",data:datas});
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
                                    }
                                ]
                            }}>
                            </AppButton>
                        </Col>
                    </Row>
                </Card>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="" key="1">
                            <Row>
                                <Col span={24}>
                                    <FieldArray name="typeTable" config={{
                                        "id": "typeTable",
                                        "name": "typeTable",
                                        "form":"MdInspectionTypePage",
                                        "rowKey": "id",
                                        "addButton": false, //是否显示默认增行按钮
                                        "showSelect":true, //是否显示选择框
                                        "type":"radio", //表格单选（radio）复选（checkbox）类型
                                        "unEditable":true, //初始化是否都不可编辑
                                        "showSerial": "true",
                                        "columns":[
                                            {
                                                "id": "typeCode",
                                                "type": "textField",
                                                "title": "检测类别编码",
                                                "name": "code",
                                                "enabled": true
                                            },
                                            {
                                                "id": "typeName",
                                                "type": "textField",
                                                "title": "检测类别名称",
                                                "name": "name",
                                                "enabled": true
                                            },
                                            {
                                                "id": "typeRemark",
                                                "type": "textField",
                                                "title": "备注",
                                                "name": "remark",
                                                "enabled": true
                                            },
                                        ],
                                        rowOperationItem: [
                                            {
                                                id: "deleteTypeRow",//deleteItemRow  23456789009865
                                                type: "linkButton",
                                                title: "删除",
                                                subscribes: [
                                                    {
                                                        event: "deleteTypeRow.click",
                                                        behaviors: [
                                                            {
                                                                type: "request",
                                                                dataSource: {
                                                                    type: "api",
                                                                    method: "POST",
                                                                    paramsInQueryString: false,//参数拼在url后面
                                                                    url: "/ime/mdInspectionType/deleteList.action",
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
                                                                        event: "typeTable.loadData",
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
                                    } } component={TableField} />
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        );
    }
}

export default reduxForm({
    form: "MdInspectionTypePage",
    validate,
})(MdInspectionTypePage)

//export default connect(null, mapDispatchToProps)(MdInspectionTypePage);

/*MdInspectionSitePage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(null, mapDispatchToProps)(MdInspectionSitePage);
*/