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

const TabPane = Tabs.TabPane;
const validate = values => {
    const errors = {}
    if (!values.get('inspectionSiteCode')) {
        errors.inspectionSiteCode = '必填项'
    }
    return errors
}

export class MdInspectionSitePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    //构造
    constructor(props) {
        super(props);
        let dataSource = {
            mode: "dataContext",
            type: "api",
            method: "POST",
            url: "/ime/mdInspectionSite/query.action",
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
            pubsub.publish("@@form.init", { id: "MdInspectionSitePage", data: Immutable.fromJS({siteTable:data.data}) })
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
                    <Breadcrumb.Item>检验部位</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={8} xs={24}>
                            <AppButton config={{
                                id: "siteAdd001",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "siteAdd001.click",
                                        pubs: [
                                            {
                                                event: "siteTable.addRow"
                                            },
                                            {
                                                event: "siteAdd001.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modify002.visible",
                                                payload: false
                                            },
                                            {
                                                event: "addSave003.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modifySave003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel004.visible",
                                                payload: true
                                            },
                                            {
                                                event: "delete005.visible",
                                                payload: false
                                            },
                                        ],
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton loading={this.props.submitting} onClick={this.props.handleSubmit((values) => {
                            })} config={{
                                id: "modify002",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "siteTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "modify002.dataContext"
                                            }
                                        ]
                                    },
                                    {
                                        event: "modify002.click",
                                        behaviors:[
                                            {
                                                type:"fetch",
                                                id: "modify002", //要从哪个组件获取数据
                                                data: "dataContext",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "siteTable.activateRow"
                                                    },
                                                    {
                                                        event: "siteAdd001.visible",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "modify002.visible",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "addSave003.visible",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "modifySave003.visible",
                                                        payload: true
                                                    },
                                                    {
                                                        event: "cancel004.visible",
                                                        payload: true
                                                    },
                                                    {
                                                        event: "delete005.visible",
                                                        payload: false
                                                    },
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        event:"siteTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "modify002.enabled",
                                                payload:true
                                            }
                                        ]
                                    },
                                    {
                                        event:"siteTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "modify002.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "addSave003",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "addSave003.click",
                                        behaviors:[
                                            {
                                                type:"fetch",
                                                id:"siteTable",
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
                                                                  url: "/ime/mdInspectionSite/add.action",
                                                                }
                                                            let onSuccess = function(res){
                                                                var datas ={};
                                                                datas["typeTable"] = res.data;
                                                                pubsub.publish("siteTable.loadData")
                                                                pubsub.publish('@@message.success',"新增成功")
                                                            }
                                                            //刷新
                                                            resolveFetch({fetch:{id:'addSave003',data:'dataContext'}}).then(function(dt){
                                                                var params = {
                                                                     "query":{
                                                                      }
                                                                }
                                                                let dataSource= {
                                                                    type: "api",
                                                                    mode:"dataContext",
                                                                    method: "POST",
                                                                    url: "/ime/mdInspectionSite/query.action",
                                                                }
                                                                let onSuccess = function(res){
                                                                   var datas ={};
                                                                   datas["siteTable"] = res.data;
                                                                   pubsub.publish("@@form.init",{id:"MdInspectionSitePage",data:datas});
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
                                                event: "siteAdd001.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modify002.visible",
                                                payload: true
                                            },
                                            {
                                                event: "addSave003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modifySave003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel004.visible",
                                                payload: false
                                            },
                                            {
                                                event: "delete005.visible",
                                                payload: true
                                            },
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "modifySave003",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "modifySave003.click",
                                        behaviors:[
                                            {
                                                type:"fetch",
                                                id:"siteTable",
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
                                                                  url: "/ime/mdInspectionSite/modify.action?id="+eventPayload.gid,
                                                                }
                                                            let onSuccess = function(res){
                                                                var datas ={};
                                                                datas["typeTable"] = res.data;
                                                                pubsub.publish("siteTable.loadData")
                                                                pubsub.publish('@@message.success',"修改成功")
                                                            }
                                                             //刷新
                                                            resolveFetch({fetch:{id:'modifySave003',data:'dataContext'}}).then(function(dt){
                                                                var params = {
                                                                     "query":{
                                                                      }
                                                                }
                                                                let dataSource= {
                                                                    type: "api",
                                                                    mode:"dataContext",
                                                                    method: "POST",
                                                                    url: "/ime/mdInspectionSite/query.action",
                                                                }
                                                                let onSuccess = function(res){
                                                                   var datas ={};
                                                                   datas["siteTable"] = res.data;
                                                                   pubsub.publish("@@form.init",{id:"MdInspectionSitePage",data:datas});
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
                                                event: "siteAdd001.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modify002.visible",
                                                payload: true
                                            },
                                            {
                                                event: "addSave003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modifySave003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel004.visible",
                                                payload: false
                                            },
                                            {
                                                event: "delete005.visible",
                                                payload: true
                                            },
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "cancel004",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cancel004.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/mdInspectionSite/query.action",
                                                },

                                                successPubs: [{
                                                    event: "@@form.init",
                                                    eventPayloadExpression: `
                                                        let datas = {siteTable:eventPayload}
                                                 console.log("eventPayload2",eventPayload)//调接口后的返回值
                                                callback({id:"MdInspectionSitePage",data:datas})
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
                                                event: "siteAdd001.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modify002.visible",
                                                payload: true
                                            },
                                            {
                                                event: "addSave003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modifySave003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancel004.visible",
                                                payload: false
                                            },
                                            {
                                                event: "delete005.visible",
                                                payload: true
                                            },

                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "delete005",
                                title: "删除",
                                type:"primary",
                                size:"large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"siteTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "delete005.enabled",
                                                payload:true
                                            }
                                        ]
                                    },
                                    {
                                        event:"siteTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "delete005.enabled",
                                                payload:false
                                            }
                                        ]
                                    },
                                    {
                                        event: "siteTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "delete005.dataContext"
                                            }
                                        ]
                                    },
                                    {
                                        event: "delete005.click",
                                        behaviors:[
                                            {
                                                type:"fetch",
                                                id:"siteTable",
                                                data:"selectedRows",
                                                successPubs:[
                                                    {
                                                        event:"delete005.eventPayloadExpression",
                                                        eventPayloadExpression:`
                                                            console.log(eventPayload);
                                                            let dataSource= {
                                                                type: 'api',
                                                                method: 'POST',
                                                                mode:"dataContext",
                                                                url: '/ime/mdInspectionSite/delete.action?id='+eventPayload.gid,
                                                            };
                                                            console.log(eventPayload);
                                                            let params = [];
                                                            params.push(eventPayload);
                                                            console.log(params);
                                                            resolveDataSourceCallback({dataSource:dataSource, dataContext:params},function(response){
                                                              if(response.success) {
                                                                pubsub.publish("@@message.success","删除成功");
                                                                 //刷新
                                                            resolveFetch({fetch:{id:'delete005',data:'dataContext'}}).then(function(dt){
                                                                var params = {
                                                                     "query":{
                                                                      }
                                                                }
                                                                let dataSource= {
                                                                    type: "api",
                                                                    mode:"dataContext",
                                                                    method: "POST",
                                                                    url: "/ime/mdInspectionSite/query.action",
                                                                }
                                                                let onSuccess = function(res){
                                                                   var datas ={};
                                                                   datas["siteTable"] = res.data;
                                                                   pubsub.publish("@@form.init",{id:"MdInspectionSitePage",data:datas});
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
                                    <FieldArray name="siteTable" config={{
                                        "id": "siteTable",
                                        "name": "siteTable",
                                        "form":"MdInspectionSitePage",
                                        "rowKey": "id",
                                        "addButton": false, //是否显示默认增行按钮
                                        "showSelect":true, //是否显示选择框
                                        "type":"radio", //表格单选（radio）复选（checkbox）类型
                                        "unEditable":true, //初始化是否都不可编辑
                                        "showSerial": "true",
                                        "columns":[
                                            {
                                                "id": "siteCode",
                                                "type": "textField",
                                                "title": "检测部位编码",
                                                "name": "code",
                                                "enabled": true
                                            },
                                            {
                                                "id": "siteName",
                                                "type": "textField",
                                                "title": "检测部位名称",
                                                "name": "name",
                                                "enabled": true
                                            },
                                            {
                                                "id": "siteComments",
                                                "type": "textField",
                                                "title": "备注",
                                                "name": "comments",
                                                "enabled": true
                                            },
                                        ],
                                        rowOperationItem: [
                                            {
                                                id: "deleteSiteRow",//deleteItemRow  23456789009865
                                                type: "linkButton",
                                                title: "删除",
                                                subscribes: [
                                                    {
                                                        event: "deleteSiteRow.click",
                                                        behaviors: [
                                                            {
                                                                type: "request",
                                                                dataSource: {
                                                                    type: "api",
                                                                    method: "POST",
                                                                    paramsInQueryString: false,//参数拼在url后面
                                                                    url: "/ime/mdInspectionSite/deleteList.action",
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
    form: "MdInspectionSitePage",
    validate,
})(MdInspectionSitePage)

//export default connect(null, mapDispatchToProps)(MdInspectionSitePage);

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