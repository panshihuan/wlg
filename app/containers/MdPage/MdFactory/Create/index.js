// import React from 'react';
// import { shallow } from 'enzyme';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs  } from 'antd';
import { Link } from 'react-router';
import AppButton from "components/AppButton"
import TextField from 'components/Form/TextField'
import RadiosField from 'components/Form/RadiosField'
import AutoCompleteField from 'components/Form/AutoCompleteField'
import CheckBoxField from 'components/Form/CheckBoxField'
import DateField from 'components/Form/DateField'
import InputNumberField from 'components/Form/InputNumberField'
import SelectField from 'components/Form/SelectField'
import SwitchField from 'components/Form/SwitchField'
import TableField from 'components/Form/TableField'
import TextAreaField from 'components/Form/TextAreaField'
import UploadField from 'components/Form/UploadField'
import FindbackField from 'components/Form/FindbackField'

import { resolveDataSource, publishEvents, resolveFetch, resolveDataSourceCallback } from 'utils/componentUtil';
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'
const TabPane = Tabs.TabPane;
const validate = values => {
    const errors = {}
    if (values.get('smBusiUnitGidRef')&&!values.get('smBusiUnitGidRef').get('busiUnitCode')) {
        errors.code = '必填项'
    }
    if (values.get('smCalendarGidRef')&&!values.get('smCalendarGidRef').get('calendarCode')) {
        errors.code = '必填项'
    }
    return errors
}
export class Create extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>工厂</Breadcrumb.Item>
                    <Breadcrumb.Item>工厂详情</Breadcrumb.Item>
                </Breadcrumb>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col>
                            <AppButton config={{
                                id: "factorySaveBtn1",
                                title: "保存",
                                visible: true,
                                enabled: true,
                                type: "primary",

                                subscribes:[
                                    {
                                        event:'factorySaveBtn1.click',
                                        pubs:[
                                            {
                                                eventPayloadExpression:`
                                                console.log(1111111)
                                                resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (data) {
                                                          console.log(data,111111);

                                                                  let  factoryInfo = data;
                                                                  var  factoryWorkCenter =data["smbiUniust-factory"];
                                                                  var  factoryLine =data["smbusiUnit-factoryline"];
                                                                  var  factoryWorkUnit =data["busiUnit-factory"];
                                                                  var  factoryWorkStation =data["work-one"]

                                                                  let dataSource= {
                                                                      type: "api",
                                                                      mode:"dataContext",
                                                                      method: "POST",
                                                                      url: "/ime/mdFactoryInfo/saveFactoryInfoList.action",
                                                                    };
                                                              let obj={
                                                                     "factoryInfo":factoryInfo,
                                                                     "factoryWorkCenter":factoryWorkCenter,
                                                                      "factoryLine":factoryLine,
                                                                      "factoryWorkUnit":factoryWorkUnit,
                                                                      "factoryWorkStation":factoryWorkStation,

                                                                  }
                                                               let onSuccess = function(response){
                                                                        if(response.success){
                                                                            pubsub.publish("@@message.success","新增成功");
                                                                             pubsub.publish("refresh.click")
                                                                        }else{
                                                                            pubsub.publish("@@message.error","新增失败");

                                                                        }

                                                                    }
                                                                     resolveDataSourceCallback({dataSource:dataSource,eventPayload:obj,dataContext:obj},onSuccess);
                                                          })

                                                `
                                            }
                                        ]
                                    }
                                ]
                            }}></AppButton>
                            <AppButton config={{
                                id: "refresh",
                                title: "刷新",
                                visible: false,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "smBusiUnitGidRefBusiUnitCode.onChange",
                                        pubs: [
                                            {
                                                event: "refresh.expression",//在某个组件上执行表达式
                                                meta: {
                                                    expression: `
                                                        me.dataContext={noteGid:data.eventPayload.gid}
                                                        //console.log(dataContext,8888888);
                                                         pubsub.publish("refresh.click")
                          `
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        event: "refresh.click",
                                        pubs:[
                                            {
                                                event: 'refresh.expression',
                                                meta: {
                                                    expression: `
                                                console.log(dataContext);
                                                var modifyData = dataContext;
                                                let buGid =dataContext.noteGid;
                                                resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (value) {
                                                    console.log(value);
                                                    modifyData = value;
                                                    modifyData["noteGid"] = buGid;
                                                })
                                                let dataSource = {
                                                    //mode: "dataContext",
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/mdFactoryWorkCenter/query.action",
                                                    mode: "payload",
                                                    payload: {
                                                        "query": {
                                                            "query": [
                                                                {"field": "smBusiUnitGid", "type": "eq", "value": buGid}
                                                            ]
                                                        }
                                                    }
                                                }
                                                console.log("1");
                                                resolveDataSource({"dataSource":dataSource,dataContext:{}}).then(function(data) {
                                                     modifyData["smbiUniust-factory"] = data.data;

                                                    //pubsub.publish("@@form.init", {id: "Create", data: Immutable.fromJS(modifyData)})
                                                    let buGid1 =buGid
                                                    let dataSource = {
                                                        //mode: "dataContext",
                                                        type: "api",
                                                        method: "POST",
                                                        url: "/ime/mdFactoryLine/query.action",
                                                        mode: "payload",
                                                        payload: {
                                                            "query": {
                                                                "query": [
                                                                    {"field": "smBusiUnitGid", "type": "eq", "value": buGid1}
                                                                ]
                                                            }
                                                        }
                                                    }
                                                    resolveDataSource({"dataSource":dataSource, dataContext: {}}).then(function (data) {
                                                        modifyData["smbusiUnit-factoryline"] = data.data;
                                                        //pubsub.publish("@@form.init", {id: "Modify", data: Immutable.fromJS(modifyData)})
                                                        let buGid2 =buGid
                                                        let dataSource = {
                                                            //mode: "dataContext",
                                                            type: "api",
                                                            method: "POST",
                                                            url: "/ime/mdFactoryWorkUnit/query.action",
                                                            mode: "payload",
                                                            payload: {
                                                                "query": {
                                                                    "query": [
                                                                        {"field": "smBusiUnitGid", "type": "eq", "value": buGid2}
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                        resolveDataSource({"dataSource":dataSource, dataContext: {}}).then(function (data) {

                                                            modifyData["busiUnit-factory"] = data.data;
                                                            //pubsub.publish("@@form.init", {id: "Modify", data: Immutable.fromJS(modifyData)})
                                                            let buGid3 =buGid
                                                            let dataSource = {
                                                                //mode: "dataContext",
                                                                type: "api",
                                                                method: "POST",
                                                                url: "/ime/mdFactoryWorkStation/query.action",
                                                                mode: "payload",
                                                                payload: {
                                                                    "query": {
                                                                        "query": [
                                                                            {"field": "smBusiUnitGid", "type": "eq", "value": buGid3}
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                            resolveDataSource({"dataSource":dataSource, dataContext: {}}).then(function (data) {

                                                                modifyData["work-one"] = data.data;


                                                            let dataSource = {
                                                                //mode: "dataContext",
                                                                type: "api",
                                                                method: "POST",
                                                                url: "/ime/mdFactoryInfo/query.action",
                                                                mode: "payload",
                                                                payload: {
                                                                    "query": {
                                                                        "query": [
                                                                            {"field": "smBusiUnitGid", "type": "eq", "value": buGid}
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                             resolveDataSource({"dataSource":dataSource, dataContext: {}}).then(function (data) {
                                                                 console.log("hhhhhhaaaaaaa!!!!");
                                                                 console.log(data);
                                                                 modifyData["gid"] = data.data["0"].gid
                                                                 pubsub.publish("@@form.init", {id: "Create", data: modifyData})

                                                             })
                                                            })
                                                        })
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
                                id: "factoryCancel1",
                                title: "取消",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "factoryCancel1.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "/MdFactory"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                        </Col>
                    </Row>
                </Card>

                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "smBusiUnitGidRefBusiUnitCode",
                                label: "工厂编码",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入",
                                form:"Create",
                                tableInfo: {
                                    id: "factoryTable-busiUnit",
                                    size: "small",
                                    rowKey: "gid",
                                    tableTitle: "业务单元信息",
                                    width:500,
                                    columns: [
                                        { title: '业务单元编码', width: 100, dataIndex: 'busiUnitCode', key: '1' },
                                        { title: '业务单元名称', width: 150, dataIndex: 'busiUnitName', key: '2' },
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'POST',
                                        url: '/ime/mdFactoryInfo/queryFactoryInfoList.action',
                                    }
                                },

                                pageId: 'smBusiUnitGidRefBusiUnitCodetabl',
                                displayField: "smBusiUnitGidRef.busiUnitCode",
                                valueField: {
                                    "from": "busiUnitCode",
                                    "to": "smBusiUnitGidRef.busiUnitCode",
                                },
                                associatedFields: [
                                    {
                                        "from": "busiUnitName",
                                        "to": "smBusiUnitGidRef.busiUnitName"
                                    },
                                    {
                                        "from": "gid",
                                        "to": "smBusiUnitGid"
                                    }
                                ]
                            }} component={FindbackField} name="smBusiUnitGidRef.busiUnitCode" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "smBusiUnitGidRef.busiUnitName",
                                label: "工厂名称",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="smBusiUnitGidRef.busiUnitName" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "workCenterNumber",
                                label: "工作中心数量",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="workCenterNumber" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "workNuitNumber",
                                label: "工作单元数量",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="workNuitNumber" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "stationNumber",
                                label: "工位数量",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="stationNumber" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "lineNumber",
                                label: "产线数量",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="lineNumber" />
                        </Col>
                    </Row>
                </Card>

                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="工作中心" key="1">
                            <Row>
                                <Col span={24}>
                                    <AppButton config={{
                                        id: "addOkhuhiksk",
                                        title: "增加",
                                        type: "primary",
                                        size: "small",
                                        visible: true,
                                        enabled: false,
                                        subscribes:[
                                            {
                                                event:"smBusiUnitGidRefBusiUnitCode.onChange",
                                                pubs: [
                                                    {
                                                        event: "addOkhuhiksk.enabled",
                                                        payload:true
                                                    },
                                                    {
                                                        event: "addOkhuhiksk.dataContext",

                                                    }
                                                ]
                                            },
                                            {
                                                event:"addOkhuhiksk.click",
                                                pubs:[
                                                    {
                                                        event:"smbiUniust-factory.addRow",

                                                       eventPayloadExpression:`
                                                    console.log(dataContext)
                                                    callback({smBusiUnitGidRef:{busiUnitName:dataContext.busiUnitName},"smBusiUnitGid":dataContext.gid})

                                                 `
                                                    }
                                                ]
                                            },

                                        ]
                                    }}/>
                                    <FieldArray name="smbiUniust-factory" config={{
                                        addButton:false,
                                        "id": "smbiUniust-factory",
                                        "name": "tablesmbusiUnit1",
                                        "rowKey": "id",
                                        "showSelect":true,
                                        "unEditable":false,
                                        "type":"radio",
                                        "form":"Create",
                                        "columns": [
                                            {
                                                "id": "smbusiUnit-code",
                                                "type": "textField",
                                                "title": "工作中心编码",
                                                "name": "workCenterCode",
                                                "enabled": true
                                            }
                                            , {
                                                "id": "smbiUniust-name",
                                                "type": "textField",
                                                "title": "工作中心名称",
                                                "name": "workCenterName",
                                                "enabled": true
                                            }, {
                                                "id": "their-factory",
                                                "type": "textField",
                                                "title": "所属工厂",
                                                "name": "smBusiUnitGidRef.busiUnitName",
                                                "enabled": false,

                                            }, {
                                                "id": "work-calendarName",
                                                "type": "findbackField",
                                                "title": "工作日历",
                                                "name": "smCalendarGidRef.calendarName",
                                                "enabled": true,
                                                "form":"Create",
                                                tableInfo: {
                                                    id: "calendarTable00",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "工作日历",
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '工作日历编码', width: 100, dataIndex: 'calendarCode', key: '1' },
                                                        { title: '工作日历名称', width: 150, dataIndex: 'calendarName', key: '2' },
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/calendar/query.action',
                                                    }
                                                },

                                                pageId: 'table002',
                                                displayField: "smCalendarGidRef.calendarName",
                                                valueField: {
                                                    "from": "calendarName",
                                                    "to": "smCalendarGidRef.calendarName"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "gid",
                                                        "to": "smCalendarGid"
                                                    },
                                                ]
                                            }, {
                                                "id": "remarks01",
                                                "title": "备注",
                                                "type": "textField",
                                                "name": "remarks",
                                                "enabled": true
                                            }
                                        ],
                                    }} component={TableField} />
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tab="产线" key="2">
                            <Row>
                                <Col span={24}>
                                    <AppButton config={{
                                        id: "addOkhuhiksk1",
                                        title: "增加",
                                        type: "primary",
                                        size: "small",
                                        visible: true,
                                        enabled: true,
                                        subscribes:[
                                            {
                                                event:"addOkhuhiksk1.click",
                                                pubs:[
                                                    {
                                                        event:"smbusiUnit-factoryline.addRow",
                                                        eventPayloadExpression:`
                                                      resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (value) {
                                                     console.log(value.gid,value.smBusiUnitGidRef.busiUnitName);
                                                    callback({smBusiUnitGid:value.smBusiUnitGid})
                                                      })

                                                 `
                                                    }
                                                ]
                                            },
                                        ]
                                    }}/>
                                    <FieldArray name="smbusiUnit-factoryline" config={{
                                        addButton :false,
                                        "id": "smbusiUnit-factoryline",
                                        "name": "tablesmbusiUnit2",
                                        "rowKey": "gid",
                                        "showSelect":true,
                                        "columns": [
                                            {
                                                "id": "smbusiUnit-code",
                                                "type": "textField",
                                                "title": "产线编码",
                                                "name": "lineCode",
                                                "enabled": true
                                            }
                                            , {
                                                "id": "smbusiUnit-name",
                                                "type": "textField",
                                                "title": "产线名称",
                                                "name": "lineName",
                                                "enabled": true
                                            }, {
                                                "id": "work-smbusiUnit",
                                                "type": "findbackField",
                                                "title": "所属工作中心",
                                                "name": "workCenterGidRef.workCenterName",
                                                "form":"Create",
                                                "enabled": true,

                                                 tableInfo: {
                                                    id: "work-smbusiUnitsub",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "所属工作中心",
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '工作中心编码', width: 100, dataIndex: 'workCenterCode', key: '1' },
                                                        { title: '工作中心名称', width: 150, dataIndex: 'workCenterName', key: '2' },
                                                        { title: '工作日历', width: 150, dataIndex: 'smCalendarGidRef.calendarName', key: '3' },
                                                    ],
                                                     subscribes: [
                                                         {
                                                             event:"work-smbusiUnitsub.onTableTodoAny",
                                                             pubs:[
                                                                 {
                                                                     event:"work-smbusiUnitsub.expression",
                                                                     meta: {
                                                                         expression:`
                                                                 resolveFetch({fetch:{id:'Create',data:'@@formValues'}}).then(function(data){
                                                                  let id=data.smBusiUnitGid
                                                                  return id
                                                              }).then(function(id){
                                                              console.log('id:::::::::::::::',id)
                                                               let params = {
                                                              "query": {
                                                                "query": [
                                                                   {
                                                                        "left":"(",
                                                                        "field":"smBusiUnitGid",
                                                                        "type":"eq",
                                                                        "value":id,
                                                                        "right":")",
                                                                        "operator":"and"
                                                                   }
                                                                 ],
                                                                 "sorted":"gid asc"
                                                              }
                                                            }
                                                                 let dataSource={
                                                                    type: 'api',
                                                                    method: 'post',
                                                                    url: '/ime/mdFactoryWorkCenter/query.action',

                                                                }
                                                             resolveDataSourceCallback({dataSource:dataSource,eventPayload:params},function(ddd){
                                                                console.log(ddd)
                                                               pubsub.publish(me.id+".setData",{eventPayload:ddd.data})

                               })

                                                              })
                                                          `
                                                                     }
                                                                 }
                                                             ]
                                                         }
                                                     ],
                                                  /*  dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/ime/mdFactoryWorkCenter/query.action',
                                                    }*/
                                                },
                                                pageId: 'table008',
                                                displayField: "workCenterGidRef.workCenterName",
                                                valueField: {
                                                    "from": "workCenterName",
                                                    "to": "workCenterGidRef.workCenterName"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "gid",
                                                        "to": "workCenterGid"
                                                    },
                                                    {
                                                        "from": "smCalendarGidRef.calendarName",
                                                        "to": "smCalendarGidRef.calendarName"
                                                    },
                                                    {
                                                        "from": "smCalendarGid",
                                                        "to": "smCalendarGid"
                                                    },
                                                ]
                                            }, {
                                                "id": "lineType-name",
                                                "type": "selectField",
                                                "title": "产线类型",
                                                "name": "lineType",
                                                "enabled": true,
                                                dataSource: {
                                                    type: "api",
                                                    method: "post",
                                                    url: "/sm/dictionaryEnumValue/query.action",
                                                    mode: "payload",
                                                    payload: {
                                                        "query": {
                                                            "query": [
                                                                { "field": "smDictionaryEnumGid", "type": "eq", "value": "56350D1ED4843DB2E055000000000001" }
                                                            ],
                                                            "sorted": "seq"
                                                        }
                                                    }
                                                },
                                                displayField: "val",
                                                valueField: "gid"

                                            }, {
                                                "id": "work-calendarName02",
                                                "title": "工作日历",
                                                "type": "findbackField",
                                                "name": "smCalendarGidRef.calendarName",
                                                "enabled": true,
                                                "form":"Create",
                                                tableInfo: {
                                                    id: "calendarTable01",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "工作日历",
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '工作日历编码', width: 100, dataIndex: 'calendarCode', key: '1' },
                                                        { title: '工作日历名称', width: 150, dataIndex: 'calendarName', key: '2' },
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/calendar/query.action',
                                                    }
                                                },
                                                pageId: 'table002',
                                                displayField: "smCalendarGidRef.calendarName",
                                                valueField: {
                                                    "from": "calendarName",
                                                    "to": "smCalendarGidRef.calendarName"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "gid",
                                                        "to": "smCalendarGid"
                                                    },
                                                ]
                                            },
                                            {
                                                "id": "remarks003",
                                                "title": "备注",
                                                "type": "textField",
                                                "name": "remarks",
                                                "enabled": true
                                            }
                                        ]
                                    }} component={TableField} />
                                </Col>
                            </Row>
                        </TabPane>


                        <TabPane tab="工作单元" key="3">
                            <Row>
                                <Col span={24}>
                                    <AppButton config={{
                                        id: "addOkhuhiksk2",
                                        title: "增加",
                                        type: "primary",
                                        size: "small",
                                        visible: true,
                                        enabled: true,
                                        subscribes:[
                                            {
                                                event:"addOkhuhiksk2.click",
                                                pubs:[
                                                    {
                                                        event:"busiUnit-factory.addRow",
                                                        eventPayloadExpression:`
                                                      resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (value) {
                                                     console.log(value.gid,value.smBusiUnitGidRef.busiUnitName);
                                                  callback({"smBusiUnitGid":value.smBusiUnitGid})
                                                      })

                                                 `
                                                    }
                                                ]
                                            },
                                        ]
                                    }}/>
                                    <FieldArray name="busiUnit-factory" config={{
                                        addButton :false,
                                        "id": "busiUnit-factory",
                                        "name": "tablesmbusiUnit3",
                                        "rowKey": "id",
                                        "showSelect":true,
                                        "columns": [
                                            {
                                                "id": "tableFiled",
                                                "type": "textField",
                                                "title": "工作单元编码",
                                                "name": "workUnitCode",
                                                "enabled": true
                                            }
                                            , {
                                                "id": "tableFiled1",
                                                "type": "textField",
                                                "title": "工作单元名称",
                                                "name": "workUnitName",
                                                "enabled": true
                                            }, {
                                                "id": "tableFiled2",
                                                "type": "findbackField",
                                                "title": "所属产线",
                                                "name": "smBusiUnitGidRef.busiUnitName",
                                                "enabled": true,
                                                "form":"Create",
                                                tableInfo: {
                                                    id: "factory_line",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "所属产线",
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '产线编码', width: 100, dataIndex: 'lineCode', key: '1' },
                                                        { title: '产线名称', width: 150, dataIndex: 'lineName', key: '2' },
                                                        { title: '工作日历', width: 150, dataIndex: 'smCalendarGidRef.calendarName', key: '3' },
                                                    ],
                                                    subscribes: [
                                                        {
                                                            event:"factory_line.onTableTodoAny",
                                                            pubs:[
                                                                {
                                                                    event:"factory_line.expression",
                                                                    meta: {
                                                                        expression:`
                                                                 resolveFetch({fetch:{id:'Create',data:'@@formValues'}}).then(function(data){
                                                                  let id=data.smBusiUnitGid
                                                                  return id
                                                              }).then(function(id){
                                                              console.log('id:::::::::::::::',id)
                                                               let params = {
                                                              "query": {
                                                                "query": [
                                                                   {
                                                                        "left":"(",
                                                                        "field":"smBusiUnitGid",
                                                                        "type":"eq",
                                                                        "value":id,
                                                                        "right":")",
                                                                        "operator":"and"
                                                                   }
                                                                 ],
                                                                 "sorted":"gid asc"
                                                              }
                                                            }
                                                                 let dataSource={
                                                                    type: 'api',
                                                                    method: 'post',
                                                                    url: '/ime/mdFactoryLine/query.action',

                                                                }
                                                             resolveDataSourceCallback({dataSource:dataSource,eventPayload:params},function(ddd){
                                                                console.log(ddd)
                                                               pubsub.publish(me.id+".setData",{eventPayload:ddd.data})

                               })

                                                              })
                                                          `
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    /*dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/ime/mdFactoryLine/query.action',
                                                    }*/
                                                },
                                                pageId: 'table009',
                                                displayField: "factoryLineGidRef.lineName",
                                                valueField: {
                                                    "from": "lineName",
                                                    "to": "factoryLineGidRef.lineName"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "gid",
                                                        "to": "factoryLineGid"
                                                    },
                                                    {
                                                        "from": "smCalendarGidRef.calendarName",
                                                        "to": "smCalendarGidRef.calendarName"
                                                    },
                                                    {
                                                        "from": "smCalendarGid",
                                                        "to": "smCalendarGid"
                                                    },
                                                ]
                                            }, {
                                                "id": "tableFiled3",
                                                "type": "findbackField",
                                                "title": "工作日历",
                                                "name": "smCalendarGidRef.calendarName",
                                                "enabled": true,
                                                "form":"Create",
                                                tableInfo: {
                                                    id: "calendarTable02",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "工作日历",
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '工作日历编码', width: 100, dataIndex: 'calendarCode', key: '1' },
                                                        { title: '工作日历名称', width: 150, dataIndex: 'calendarName', key: '2' },
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/calendar/query.action',
                                                    }
                                                },
                                                pageId: 'table002',
                                                displayField: "smCalendarGidRef.calendarName",
                                                valueField: {
                                                    "from": "calendarName",
                                                    "to": "smCalendarGidRef.calendarName"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "gid",
                                                        "to": "smCalendarGid"
                                                    },
                                                ]
                                            }, {
                                                "id": "tableFiled4",
                                                "title": "备注",
                                                "type": "textField",
                                                "name": "remarks",
                                                "enabled": true
                                            }
                                        ]
                                    }} component={TableField} />
                                </Col>
                            </Row>

                        </TabPane>

                        <TabPane tab="工位" key="4">
                            <Row>
                                    <Col span={24}>
                                        <AppButton config={{
                                            id: "addOkhuhiksk3",
                                            title: "增加",
                                            type: "primary",
                                            size: "small",
                                            visible: true,
                                            enabled: true,
                                            subscribes:[
                                                {
                                                    event:"addOkhuhiksk3.click",
                                                    pubs:[
                                                        {
                                                            event:"work-one.addRow",
                                                            eventPayloadExpression:`
                                                      resolveFetch({fetch:{id:"Create",data:"@@formValues"}}).then(function (value) {
                                                     console.log(value.gid,value.smBusiUnitGidRef.busiUnitName);
                                                     callback({"smBusiUnitGid":value.smBusiUnitGid})
                                                      })

                                                 `
                                                        }
                                                    ]
                                                },
                                            ]

                                        }}/>
                                    <FieldArray name="work-one" config={{
                                        addButton :false,
                                        "id": "work-one",
                                        "name": "tablesmbusiUnit4",
                                        "rowKey": "id",
                                        "showSelect":true,
                                        "columns": [
                                            {
                                                "id": "tableFiled0",
                                                "type": "textField",
                                                "title": "工位编码",
                                                "name": "stationCode",
                                                "enabled": true
                                            }
                                            , {
                                                "id": "tableFiled1",
                                                "type": "textField",
                                                "title": "工位名称",
                                                "name": "stationName",
                                                "enabled": true
                                            }, {
                                                "id": "tableFiled2",
                                                "type": "findbackField",
                                                "title": "所属工作单元",
                                                "name": "smBusiUnitGidRef.busiUnitName",
                                                "enabled": true,
                                                "form":"Create",
                                                 tableInfo: {
                                                    id: "table109",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "所属工作单元",
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '工作单元编码', width: 100, dataIndex: 'workUnitCode', key: '1' },
                                                        { title: '工作单元名称', width: 150, dataIndex: 'workUnitName', key: '2' },
                                                        { title: '工作日历', width: 150, dataIndex: 'smCalendarGidRef.calendarName', key: '3' },
                                                    ],
                                                     subscribes: [
                                                         {
                                                             event:"table109.onTableTodoAny",
                                                             pubs:[
                                                                 {
                                                                     event:"table109.expression",
                                                                     meta: {
                                                                         expression:`
                                                                 resolveFetch({fetch:{id:'Create',data:'@@formValues'}}).then(function(data){
                                                                  let id=data.smBusiUnitGid
                                                                  return id
                                                              }).then(function(id){
                                                              console.log('id:::::::::::::::',id)
                                                               let params = {
                                                              "query": {
                                                                "query": [
                                                                   {
                                                                        "left":"(",
                                                                        "field":"smBusiUnitGid",
                                                                        "type":"eq",
                                                                        "value":id,
                                                                        "right":")",
                                                                        "operator":"and"
                                                                   }
                                                                 ],
                                                                 "sorted":"gid asc"
                                                              }
                                                            }
                                                                 let dataSource={
                                                                    type: 'api',
                                                                    method: 'post',
                                                                    url: '/ime/mdFactoryWorkUnit/query.action',

                                                                }
                                                             resolveDataSourceCallback({dataSource:dataSource,eventPayload:params},function(ddd){
                                                                console.log(ddd)
                                                               pubsub.publish(me.id+".setData",{eventPayload:ddd.data})

                               })

                                                              })
                                                          `
                                                                     }
                                                                 }
                                                             ]
                                                         }
                                                     ],
                                                },
                                                pageId: 'table063',
                                                displayField: "workUnitGidRef.workUnitName",
                                                valueField: {
                                                    "from": "workUnitName",
                                                    "to": "workUnitGidRef.workUnitName"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "gid",
                                                        "to": "workUnitGid"
                                                    },
                                                    {
                                                        "from": "smCalendarGidRef.calendarName",
                                                        "to": "smCalendarGidRef.calendarName"
                                                    },
                                                    {
                                                        "from": "smCalendarGid",
                                                        "to": "smCalendarGid"
                                                    },
                                                ]
                                            }, {
                                                "id": "tableFiled3",
                                                "type": "findbackField",
                                                "title": "工作日历",
                                                "name": "smCalendarGidRef.calendarName",
                                                "enabled": true,
                                                "form":"Create",
                                                tableInfo: {
                                                    id: "calendarTable03",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "工作日历",
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '工作日历编码', width: 100, dataIndex: 'calendarCode', key: '1' },
                                                        { title: '工作日历名称', width: 150, dataIndex: 'calendarName', key: '2' },
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/calendar/query.action',
                                                    }
                                                },
                                                pageId: 'table002',
                                                displayField: "smCalendarGidRef.calendarName",
                                                valueField: {
                                                    "from": "calendarName",
                                                    "to": "smCalendarGidRef.calendarName"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "gid",
                                                        "to": "smCalendarGid"
                                                    },
                                                ]
                                            }, {
                                                "id": "tableFiled4",
                                                "title": "备注",
                                                "type": "textField",
                                                "name": "remarks",
                                                "enabled": true
                                            }
                                        ]
                                    }} component={TableField} />
                                </Col>
                            </Row>

                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        );
    }
}
Create.propTypes = {
    dispatch: PropTypes.func.isRequired,
};



function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

function mapStateToProps(props) {
    return {
        onSubmit:()=>{debugger}
    };
}

let CreateForm = reduxForm({
    form: "Create",
    validate,
})(Create)
export default connect(mapStateToProps, mapDispatchToProps)(CreateForm);