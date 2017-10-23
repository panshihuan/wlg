/*
 *
 * Modify
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col,Tabs } from 'antd';
import { Link } from 'react-router';
import AppButton from 'components/AppButton';
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

import TextField from 'components/Form/TextField'
import SelectField from 'components/Form/SelectField'
import TableField from 'components/Form/TableField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import CheckBoxField from 'components/Form/CheckBoxField'
import Immutable from 'immutable'
import pubsub from 'pubsub-js'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'

const TabPane = Tabs.TabPane;
const validate = values => {
    const errors = {}
    if (!values.get('mdDefOperationCode')) {
        errors.mdDefOperationCode = '必填项'
    }
    if (!values.get('mdDefOperationName')) {
        errors.mdDefOperationName = '必填项'
    }

    let vv= values.toJS();
    if (!vv.defEquipmentExtList || !vv.defEquipmentExtList.length) {
        //errors.defEquipmentExtList = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.defEquipmentExtList.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.mdEquipmentCode) {
                memberErrors.mdEquipmentCode = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
        })
        if (membersArrayErrors.length) {
            errors.defEquipmentExtList = membersArrayErrors
        }
    }
    return errors
}

const asyncValidate = values => {
    let dataSource = {
        mode: "dataContext",
        type: "api",
        method: "POST",
        url: "/sm/checkUnique/check.action",
    }
    let gid = values.get('gid')
    let className = "com.neusoft.ime.md.mdDefOperation.dto.MdDefOperationDTO"
    let fieldNames = "code,delete";
    let fieldValues = values.get('mdDefOperationCode') + ",0";
    return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:gid,  className:className,fieldNames:fieldNames,fieldValues,fieldValues} }).then(function (res) {
        resolve(res)
    })).then(function (res) {
        if(!res.data){
            throw { mdDefOperationCode: "该编码已存在,请重新填写" }
        }
    })
}

export class Modify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);

        console.log('--------------------')
        let modifyId = this.props.location.state[0].gid
        let modifyData = this.props.location.state[0]

        let dataSource = {
            mode: "dataContext",
            type: "api",
            method: "POST",
            url: "/ime/mdDefOperation/findDtoById.action?id="+modifyId,
        }
        resolveDataSource( {dataSource, dataContext: { id: modifyId }}).then(function (data) {

            modifyData.defEquipmentExtList = data.data.defEquipmentExtList
            console.log(modifyData)
            pubsub.publish("@@form.init", { id: "Modify", data: Immutable.fromJS(modifyData) })
        })

    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>工序</Breadcrumb.Item>
                    <Breadcrumb.Item>工序详情</Breadcrumb.Item>
                </Breadcrumb>

                <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <AppButton config={{
                            id: "gx030001",
                            title: "保存",
                            visible: true,
                            enabled: true,
                            type: "primary",
                            subscribes: [
                                {
                                    event: "gx030001.click",
                                    behaviors: [
                                        {
                                            type: "request",
                                            dataSource: {
                                                type: "api",
                                                method: "POST",
                                                url: "/ime/mdDefOperation/updateList.action?id="+this.props.location.state[0].gid,
                                                withForm: "Modify",
                                            },
                                            successPubs: [  //获取数据完成后要发送的事件
                                                {
                                                    event: "@@navigator.push",
                                                    payload: {
                                                        url: "/mdDefOperation"
                                                    }
                                                }, {
                                                    event: "@@message.success",
                                                    payload: "修改成功"
                                                }
                                            ],
                                            errorPubs: [
                                                {
                                                    event: "@@message.error",
                                                    payload: "修改失败"
                                                }
                                            ]
                                        }
                                    ],
                                    pubs: [
                                        {
                                            /*event: "@@navigator.push",
                                            payload: {
                                              url: "/imeOrder"
                                            },*/

                                        }
                                    ]
                                }
                            ]
                        }}></AppButton>
                        <AppButton config={{
                            id: "gx030002",
                            title: "取消",
                            visible: true,
                            enabled: true,
                            type: "primary",
                            subscribes: [
                                {
                                    event: "gx030002.click",
                                    pubs: [
                                        {
                                            event: "@@navigator.push",
                                            payload: {
                                                url: "/mdDefOperation"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }}>
                        </AppButton>
                    </Row>
                </Card>


                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "mdDefOperationCode",
                                label: "工序编码",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入编码"
                            }} component={TextField} name="mdDefOperationCode" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "mdDefOperationName",
                                label: "工序名称",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入名称"
                            }} component={TextField} name="mdDefOperationName" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "mdDefOperationTypeGid",
                                label: "工序类型",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload:{
                                        "query":{
                                            "query":[
                                                {"field":"smDictionaryEnumGid","type":"eq","value":"5627BE1FB43E0FE1E055000000000001"}
                                            ],
                                            "sorted":"seq"
                                        }
                                    },
                                },
                                displayField: "val",
                                valueField: "gid",
                            }} component={SelectField} name="mdDefOperationTypeGid" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "mdFactoryWorkCenterName",
                                label: "工作中心",
                                form:"Modify",
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                // formMode:'edit',

                                tableInfo: {
                                    id: "tableId555jjkdjkljkldjd",
                                    size: "small",
                                    rowKey: "gid",
                                    width:100,
                                    tableTitle: "工作中心",
                                    columns: [
                                        { title: '工作中心编码', width: 200, dataIndex: 'workCenterCode', key: '24567y' },
                                        { title: '工作中心名称', width: 200, dataIndex: 'workCenterName', key: '36yyhhh' },
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/ime/mdFactoryWorkCenter/query.action',
                                    }
                                },
                                pageId: 'findBack66rffff',
                                displayField: "mdFactoryWorkCenterName",
                                valueField: {
                                    "from": "workCenterName",
                                    "to": "mdFactoryWorkCenterName"
                                },
                                associatedFields: [
                                    {
                                        "from": "gid",
                                        "to": "mdFactoryWorkCenterGid"
                                    }
                                ]
                            }} name="mdFactoryWorkCenterName" component={FindbackField} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "mdFactoryLineName",
                                label: "产线",
                                form:"Modify",
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                subscribes: [
                                    {
                                        event: "mdFactoryWorkCenterName.onChange",
                                        pubs: [
                                            {
                                                event: "mdFactoryLineName.expression",//在某个组件上执行表达式
                                                meta: {
                                                    expression: `
                            me.dataContext={gid:data.eventPayload.gid}
                            let val = ""
                            pubsub.publish("@@form.change", { id: "Modify", name: me.props.input.name, value: val })
                            pubsub.publish("@@form.change", { id: "Modify", name: "mdFactoryWorkUnitName", value: val })
                            pubsub.publish("@@form.change", { id: "Modify", name: "mdFactoryStationName", value: val })
                          `
                                                }
                                            }
                                        ]
                                    }
                                ],
                                tableInfo: {
                                    id: "tableIkkkkdlldgge",
                                    size: "small",
                                    rowKey: "gid",
                                    width:100,
                                    tableTitle: "产线",
                                    onLoadData: false,
                                    showSerial: true,
                                    columns: [
                                        { title: '产线编码', dataIndex: 'lineCode', key: '9', width: 200 },
                                        { title: '产线名称', dataIndex: 'lineName', key: '10', width: 200 },
                                        { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '3', width: 200 },
                                    ],
                                    subscribes: [
                                        {
                                            event: "tableIkkkkdlldgge.onTableTodoAny",
                                            behaviors: [
                                                {
                                                    type: "fetch",
                                                    id: "mdFactoryLineName", //要从哪个组件获取数据
                                                    data: "dataContext",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "tableIkkkkdlldgge.loadData",
                                                            eventPayloadExpression:`
                                let payload ={}
                                if(eventPayload != undefined){
                                  payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "workCenterGid", "type": "eq", "value": eventPayload.gid
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                                }
                                 callback(payload)
                              `
                                                        }
                                                    ]
                                                }
                                            ],
                                           /* pubs: [
                                                {
                                                    event: "tableIkkkkdlldgge.expression",//在某个组件上执行表达式
                                                    meta: {
                                                        expression: `
                          let dataSource= {
                    type: 'api',
                    method: 'post',
                    mode:"payload&&eventPayload",
                    url: '/ime/mdFactoryLine/query.action',
                  };
                            resolveFetch({fetch:{id:'mdFactoryLineName',data:'dataContext'}}).then(function(dt){
                              console.log(dt)

                             if(dt==undefined)
                              {
                              delete  dataSource.mode;
                              pubsub.publish("tableIkkkkdlldgge.loadData")

                              }
                              else
                              {
                                let  payload = {
                    "query": {
                      "query": [
                        {
                          "field": "workCenterGid", "type": "eq", "value": dt.gid
                        }
                      ],
                      "sorted": "gid asc"
                    },
                    "pager":{
        "page":1,
        "pageSize":10
    }
                  }
                                    pubsub.publish("tableIkkkkdlldgge.loadData",{eventPayload:payload})

                              }
                            })
                          `
                                                    }
                                                }
                                            ]*/
                                        }
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        mode:"payload&&eventPayload",
                                        url: '/ime/mdFactoryLine/query.action',
                                    }
                                },
                                pageId: 'findBack66rfllludjddh',
                                displayField: "mdFactoryLineName",
                                valueField: {
                                    "from": "lineName",
                                    "to": "mdFactoryLineName"
                                },
                                associatedFields: [
                                    {
                                        "from": "gid",
                                        "to": "mdFactoryLineGid"
                                    },
                                    {
                                        "from": "workCenterGidRef.workCenterName",
                                        "to": "mdFactoryWorkCenterName"
                                    },
                                    {
                                        "from": "workCenterGidRef.gid",
                                        "to": "mdFactoryWorkCenterGid"
                                    }
                                ],
                            }} name="mdFactoryLineName" component={FindbackField} />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "mdFactoryWorkUnitName",
                                label: "工作单元",
                                form:"Modify",
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                subscribes: [
                                    {
                                        event: "mdFactoryLineName.onChange",
                                        pubs: [
                                            {
                                                event: "mdFactoryWorkUnitName.expression",//在某个组件上执行表达式
                                                meta: {
                                                    expression: `
                            me.dataContext={gid:data.eventPayload.gid}
                            let val = ""
                            pubsub.publish("@@form.change", { id: "Modify", name: me.props.input.name, value: val })
                            pubsub.publish("@@form.change", { id: "Modify", name: "mdFactoryStationName", value: val })
                          `
                                                }
                                            }
                                        ]
                                    }
                                ],
                                tableInfo: {
                                    id: "tableIkwkkdlldgge",
                                    size: "small",
                                    rowKey: "gid",
                                    width:100,
                                    tableTitle: "工作单元",
                                    onLoadData: false,
                                    showSerial: true,
                                    columns: [
                                        { title: '工作单元编码', dataIndex: 'workUnitCode', key: '9', width: 200 },
                                        { title: '工作单元名称', dataIndex: 'workUnitName', key: '10', width: 200 },
                                        { title: '产线', dataIndex: 'factoryLineGidRef.lineName', key: '3', width: 200 },

                                    ],
                                    subscribes: [
                                        {
                                            event: "tableIkwkkdlldgge.onTableTodoAny",
                                            behaviors: [
                                                {
                                                    type: "fetch",
                                                    id: "mdFactoryWorkUnitName", //要从哪个组件获取数据
                                                    data: "dataContext",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "tableIkwkkdlldgge.loadData",
                                                            eventPayloadExpression:`
                                let payload ={}
                                if(eventPayload != undefined){
                                  payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "factoryLineGid", "type": "eq", "value": eventPayload.gid
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                                }
                                 callback(payload)
                              `
                                                        }
                                                    ]
                                                }
                                            ],
                                        /*    pubs: [
                                                {
                                                    event: "tableIkwkkdlldgge.expression",//在某个组件上执行表达式
                                                    meta: {
                                                        expression: `
                          let dataSource= {
                    type: 'api',
                    method: 'post',
                    mode:"payload&&eventPayload",
                    url: '/ime/mdFactoryWorkUnit/query.action',
                  };
                            resolveFetch({fetch:{id:'mdFactoryWorkUnitName',data:'dataContext'}}).then(function(dt){
                              console.log(dt)

                             if(dt==undefined)
                              {
                              delete  dataSource.mode;
                              pubsub.publish("tableIkwkkdlldgge.loadData")

                              }
                              else
                              {
                                let  payload = {
                    "query": {
                      "query": [
                        {
                          "field": "factoryLineGid", "type": "eq", "value": dt.gid
                        }
                      ],
                      "sorted": "gid asc"
                    },
                    "pager":{
        "page":1,
        "pageSize":10
    }
                  }
                                    pubsub.publish("tableIkwkkdlldgge.loadData",{eventPayload:payload})

                              }
                            })
                          `
                                                    }
                                                }
                                            ]*/
                                        }
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        mode:"payload&&eventPayload",
                                        url: '/ime/mdFactoryWorkUnit/query.action',
                                    }
                                },
                                pageId: 'findBack66rfl0ludj3dh',
                                displayField: "mdFactoryWorkUnitName",
                                valueField: {
                                    "from": "workUnitName",
                                    "to": "mdFactoryWorkUnitName"
                                },
                                associatedFields: [
                                    {
                                        "from": "gid",
                                        "to": "mdFactoryWorkUnitGid"
                                    },
                                    {
                                        "from": "factoryLineGidRef.lineName",
                                        "to": "mdFactoryLineName"
                                    },
                                    {
                                        "from": "factoryLineGidRef.gid",
                                        "to": "mdFactoryLineGid"
                                    },
                                    {
                                        "from": "factoryLineGidRef.workCenterGidRef.gid",
                                        "to": "mdFactoryWorkCenterGid"
                                    },
                                    {
                                        "from": "factoryLineGidRef.workCenterGidRef.workCenterName",
                                        "to": "mdFactoryWorkCenterName"
                                    }
                                ]
                            }} name="mdFactoryWorkUnitName" component={FindbackField} />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "mdFactoryStationName",
                                label: "工位",
                                form:"Modify",
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                subscribes: [
                                    {
                                        event: "mdFactoryWorkUnitName.onChange",
                                        pubs: [
                                            {
                                                event: "mdFactoryStationName.expression",//在某个组件上执行表达式
                                                meta: {
                                                    expression: `
                            me.dataContext={gid:data.eventPayload.gid}
                            let val = ""
                            pubsub.publish("@@form.change", { id: "Modify", name: me.props.input.name, value: val })
                          `
                                                }
                                            }
                                        ]
                                    }
                                ],
                                tableInfo: {
                                    id: "tableIkwkvdlldgge",
                                    size: "small",
                                    rowKey: "gid",
                                    width:100,
                                    tableTitle: "工位",
                                    onLoadData: false,
                                    showSerial: true,
                                    columns: [
                                        { title: '工位编码', dataIndex: 'stationCode', key: '9', width: 200 },
                                        { title: '工位名称', dataIndex: 'stationName', key: '10', width: 200 },
                                        { title: '工作单元', dataIndex: 'workUnitGidRef.workUnitName', key: '3', width: 200 },
                                    ],
                                    subscribes: [
                                        {
                                            event: "tableIkwkvdlldgge.onTableTodoAny",
                                            behaviors: [
                                                {
                                                    type: "fetch",
                                                    id: "mdFactoryStationName", //要从哪个组件获取数据
                                                    data: "dataContext",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "tableIkwkvdlldgge.loadData",
                                                            eventPayloadExpression:`
                                let payload ={}
                                if(eventPayload != undefined){
                                  payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "workUnitGid", "type": "eq", "value": eventPayload.gid
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                                }
                                 callback(payload)
                              `
                                                        }
                                                    ]
                                                }
                                            ],
                                           /* pubs: [
                                                {
                                                    event: "tableIkwkvdlldgge.expression",//在某个组件上执行表达式
                                                    meta: {
                                                        expression: `
                          let dataSource= {
                    type: 'api',
                    method: 'post',
                    mode:"payload&&eventPayload",
                    url: '/ime/mdFactoryWorkStation/query.action',
                  };
                            resolveFetch({fetch:{id:'mdFactoryStationName',data:'dataContext'}}).then(function(dt){
                              console.log(dt)

                             if(dt==undefined)
                              {
                              delete  dataSource.mode;
                              pubsub.publish("tableIkwkvdlldgge.loadData")

                              }
                              else
                              {
                                let  payload = {
                    "query": {
                      "query": [
                        {
                          "field": "workUnitGid", "type": "eq", "value": dt.gid
                        }
                      ],
                      "sorted": "gid asc"
                    },
                    "pager":{
        "page":1,
        "pageSize":10
    }
                  }
                                    pubsub.publish("tableIkwkvdlldgge.loadData",{eventPayload:payload})

                              }
                            })
                          `
                                                    }
                                                }
                                            ]*/
                                        }
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        mode:"payload&&eventPayload",
                                        url: '/ime/mdFactoryWorkStation/query.action',
                                    }
                                },
                                pageId: 'findBack66rfl0ludc3dh',
                                displayField: "mdFactoryStationName",
                                valueField: {
                                    "from": "stationName",
                                    "to": "mdFactoryStationName"
                                },
                                associatedFields: [
                                    {
                                        "from": "gid",
                                        "to": "mdFactoryStationGid"
                                    },
                                    {
                                        "from": "workUnitGidRef.workUnitName",
                                        "to": "mdFactoryWorkUnitName"
                                    },
                                    {
                                        "from": "workUnitGidRef.gid",
                                        "to": "mdFactoryWorkUnitGid"
                                    },
                                    {
                                        "from": "workUnitGidRef.factoryLineGidRef.gid",
                                        "to": "mdFactoryLineGid"
                                    },
                                    {
                                        "from": "workUnitGidRef.factoryLineGidRef.lineName",
                                        "to": "mdFactoryLineName"
                                    },
                                    {
                                        "from": "workUnitGidRef.factoryLineGidRef.workCenterGidRef.gid",
                                        "to": "mdFactoryWorkCenterGid"
                                    },
                                    {
                                        "from": "workUnitGidRef.factoryLineGidRef.workCenterGidRef.workCenterName",
                                        "to": "mdFactoryWorkCenterName"
                                    }
                                ]
                            }} name="mdFactoryStationName" component={FindbackField} />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "processingModeGid",
                                label: "加工方式",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload:{
                                        "query":{
                                            "query":[
                                                {"field":"smDictionaryEnumGid","type":"eq","value":"5627BE1FB43F0FE1E055000000000001"}
                                            ],
                                            "sorted":"seq"
                                        }
                                    },
                                },
                                displayField: "val",
                                valueField: "gid",
                            }} component={SelectField} name="processingModeGid" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "processTest",
                                label: "检验工序",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                isNumber: true,
                                checkedChildren: "是",
                                unCheckedChildren: "否"
                            }} component={SwitchField} name="processTest" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "worksheetGenarationModeGid",
                                label: "派工单产生",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload:{
                                        "query":{
                                            "query":[
                                                {"field":"smDictionaryEnumGid","type":"eq","value":"5628CF31424826A8E055000000000001"}
                                            ],
                                            "sorted":"seq"
                                        }
                                    },
                                },
                                displayField: "val",
                                valueField: "gid",
                            }} component={SelectField} name="worksheetGenarationModeGid" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "businessModeGid",
                                label: "报工方式",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请选择",
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload:{
                                        "query":{
                                            "query":[
                                                {"field":"smDictionaryEnumGid","type":"eq","value":"5628CF31424726A8E055000000000001"}
                                            ],
                                            "sorted":"seq"
                                        }
                                    },
                                },
                                displayField: "val",
                                valueField: "gid",
                            }} component={SelectField} name="businessModeGid" />
                        </Col>
                        <Col span={5}>
                            <Field config={{
                                enabled: true,
                                id: "rhythm",
                                label: "节拍",  //标签名称
                                labelSpan: 10,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                placeholder: "请输入节拍"
                            }} component={TextField} name="rhythm" />
                        </Col>
                        <Col span={1}>
                            <Field config={{
                                id: "rhythmTypeGid",
                                label: "",  //标签名称
                                labelSpan: 2,   //标签栅格比例（0-24）
                                wrapperSpan: 22,  //输入框栅格比例（0-24）
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload:{
                                        "query":{
                                            "query":[
                                                {"field":"smDictionaryEnumGid","type":"eq","value":"56354B1899A83E18E055000000000001"}
                                            ],
                                            "sorted":"seq"
                                        }
                                    },
                                },
                                displayField: "val",
                                valueField: "gid",
                            }} component={SelectField} name="rhythmTypeGid" />
                        </Col>
                    </Row>

                </Card>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="设备" key="1">
                            <Row>
                                <Col span={24}>
                                    <FieldArray name="defEquipmentExtList" config={{
                                        "id": "tafnjnjjsod93jv0200",
                                        "name": "tableFiledkkdheeera3678b",
                                        "rowKey": "id",
                                        "showSelect":true, //是否显示选择框
                                        "columns": [
                                            {
                                                "id": "sbTabSelectFiled0201",
                                                "type": "selectField",
                                                "title": "需求方式",
                                                "name": "demandModeGid",
                                                dataSource: {
                                                    type: "api",
                                                    method:"post",
                                                    url:"/sm/dictionaryEnumValue/query.action",
                                                    mode:"payload",
                                                    payload:{
                                                        "query":{
                                                            "query":[
                                                                {"field":"smDictionaryEnumGid","type":"eq","value":"56E9CDAAE31B53F5E055000000000001"}
                                                            ],
                                                            "sorted":"seq"
                                                        }
                                                    }
                                                },
                                                displayField: "val",
                                                valueField: "gid"
                                            },
                                            {
                                                "id": "sbTabSelectFiled0202",
                                                "type": "selectField",
                                                "title": "需求规则",
                                                "name": "demandRuleGid",
                                                dataSource: {
                                                    type: "api",
                                                    method:"post",
                                                    url:"/sm/dictionaryEnumValue/query.action",
                                                    mode:"payload",
                                                    payload:{
                                                        "query":{
                                                            "query":[
                                                                {"field":"smDictionaryEnumGid","type":"eq","value":"56E9CDAAE31C53F5E055000000000001"}
                                                            ],
                                                            "sorted":"seq"
                                                        }
                                                    }
                                                },
                                                displayField: "val",
                                                valueField: "gid"
                                            },
                                            {
                                                "id": "sbTabFindbackField0203",
                                                "type": "findbackField",
                                                "title": "设备编码",
                                                "form": "Modify",
                                                "name": "mdEquipmentCode",

                                                tableInfo: {
                                                    id: "tapdjbdvchaskjcnda",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    tableTitle: "设备信息",
                                                    showSerial: true,  //序号
                                                    width:100,
                                                    columns: [
                                                        { title: '设备编码', width: 150, dataIndex: 'code', key: '1' },
                                                        { title: '设备名称', width: 150, dataIndex: 'name', key: '2' },
                                                        { title: '设备类型', width: 150, dataIndex: 'mdEquipmentTypeGidRef.name', key: '3' },
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/ime/mdEquipment/query.action'
                                                    }
                                                },
                                                pageId: 'tableFijoshahhfkae0212',
                                                displayField: "mdEquipmentCode",
                                                valueField: {
                                                    "from": "code",
                                                    "to": "mdEquipmentCode"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "name",
                                                        "to": "mdEquipmentName"
                                                    },
                                                    {
                                                        "from": "mdEquipmentTypeGidRef.name",
                                                        "to": "mdEquipmentType"
                                                    },
                                                    {
                                                        "from": "gid",
                                                        "to": "mdEquipmentGid"
                                                    }

                                                ]
                                            },
                                            {
                                                "id": "sbTabTextFiled0204",
                                                "type": "textField",
                                                "title": "设备名称",
                                                "name": "mdEquipmentName",
                                                "enabled": false
                                            },
                                            {
                                                "id": "sbTabTextFiled0205",
                                                "type": "textField",
                                                "title": "设备类型",
                                                "name": "mdEquipmentType",
                                                "enabled": false
                                            },
                                            {
                                                "id": "sbTabTextFiled0206",
                                                "type": "textField",
                                                "title": "设备数量",
                                                "name": "equipmentNumber",
                                                "enabled": true
                                            },
                                            {
                                                "id": "sbTabFindbackField0207",
                                                "type": "findbackField",
                                                "title": "设备日历",
                                                "form": "Modify",
                                                "name": "equipmentCalendarName",

                                                tableInfo: {
                                                    id: "tapdjicdjijiaknda",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    tableTitle: "日历信息",
                                                    showSerial: true,  //序号
                                                    width:100,
                                                    columns: [
                                                        { title: '日历编码', width: 200, dataIndex: 'calendarCode', key: '1' },
                                                        { title: '日历名称', width: 200, dataIndex: 'calendarName', key: '2' },

                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/calendar/query.action'
                                                    }
                                                },
                                                pageId: 'tableFijbcjsissikkae',
                                                displayField: "equipmentCalendarName",
                                                valueField: {
                                                    "from": "calendarName",
                                                    "to": "equipmentCalendarName"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "gid",
                                                        "to": "equipmentCalendarGid"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "sbTabTextFiled0208",
                                                "type": "textField",
                                                "title": "设备产能",
                                                "name": "equipmentCapacity",
                                                "enabled": true
                                            },
                                            {
                                                "id": "sbTabTextFiled0209",
                                                "type": "textField",
                                                "title": "加工批量",
                                                "name": "processBatch",
                                                "enabled": true
                                            },
                                            {
                                                "id": "sbTabTextFiled0210",
                                                "type": "textField",
                                                "title": "有效工作时间",
                                                "name": "effectiveWorkingTime",
                                                "enabled": true
                                            }
                                        ]
                                    }}component={TableField}/>

                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Card>

            </div>
        );
    }
}
Modify.propTypes = {
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

let ModifyForm =  reduxForm({
    form: "Modify",
    validate,
    asyncValidate,
    asyncBlurFields: ['mdDefOperationCode']
})(Modify)
export default connect(mapStateToProps, mapDispatchToProps)(ModifyForm);
