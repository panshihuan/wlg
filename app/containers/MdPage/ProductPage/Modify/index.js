
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb , Row, Card, Col, Tabs } from 'antd';
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
import pubsub from 'pubsub-js'
import Immutable from 'immutable'

import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

const TabPane = Tabs.TabPane;
const validate = values => {
    const errors = {}
    if (!values.getIn(['materialGidRef','code'])) {
        errors.materialGidRef={}
        errors.materialGidRef.code = '必填项'
    }

    if (!values.getIn(['materialGidRef','name'])) {
        errors.materialGidRef={}
        errors.materialGidRef.name = '必填项'
    }

    if (!values.get('bomType')) {
        errors.bomType = '必填项'
    }

    let vv= values.toJS();

    if (!vv.mdProductInfoDetailDTOs || !vv.mdProductInfoDetailDTOs.length) {
        //errors.mdProductInfoDetailDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.mdProductInfoDetailDTOs.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member ||member.materialGidRef == undefined|| member.materialGidRef.code ===undefined) {
                memberErrors.materialGidRef={}
                memberErrors.materialGidRef.code = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }

        })
        if (membersArrayErrors.length) {
            errors.mdProductInfoDetailDTOs = membersArrayErrors
        }
    }

    return errors
}

export class Modify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        console.log("props",props)
        let modifyId = this.props.location.state[0].gid
        let modifyData = this.props.location.state[0]
        let dataSource = {
            mode: "dataContext",
            type: "api",
            method: "POST",
            url: "/ime/mdProductInfo/findById.action?id="+modifyId,
        }

        resolveDataSource({ dataSource, dataContext: { id: modifyId } }).then(function (data) {
            modifyData.mdProductInfoDetailDTOs = data.data.mdProductInfoDetailDTOs
            pubsub.publish("@@form.init", { id: "Modify", data: Immutable.fromJS(modifyData) })
        })


    }

    componentDidMount(){
        let isPivotalValue
        if(this.props.location.state[0].isPivotal!=undefined){
            isPivotalValue = this.props.location.state[0].isPivotal
        }
        console.log(isPivotalValue)
        pubsub.publish("productInfoTableId.activateCol",{cols:["DetailIsPivotal"],type:isPivotalValue})
    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>产品</Breadcrumb.Item>
                    <Breadcrumb.Item>产品详情</Breadcrumb.Item>
                </Breadcrumb>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col>
                            <AppButton config={{
                                id: "pSaveBtn1",
                                title: "保存",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "pSaveBtn1.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/mdProductInfo/modify.action?id="+this.props.location.state[0].gid,
                                                    withForm: "Modify",
                                                },
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        payload: {
                                                            url: "/product"
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
                                id: "pCancel1",
                                title: "取消",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "pCancel1.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "/product"
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
                                enabled: false,
                                id: "materialGidRef.code",
                                label: "产品编码",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入",
                                form:"Modify",
                                tableInfo: {
                                    id: "productTable-material",
                                    size: "small",
                                    rowKey: "gid",
                                    tableTitle: "物料信息",
                                    width:"500px",
                                    columns: [
                                        { title: '物料编码', width: 100, dataIndex: 'code', key: '1' },
                                        { title: '物料名称', width: 100, dataIndex: 'name', key: '2' },
                                        { title: '计量单位', dataIndex: 'measurementUnitGidRef.name', key: '3', width: 80 },
                                        { title: '规格', dataIndex: 'spec', key: '4', width: 80 },
                                        { title: '型号', dataIndex: 'model', key: '5', width: 80 },
                                        { title: '图号', dataIndex: 'figureNumber', key: '6', width: 80 }
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/ime/mdMaterielInfo/query.action'
                                    }
                                },
                                pageId: 'productFindBack-productCode',
                                displayField: "materialGidRef.code",
                                valueField: {
                                    "from": "code",
                                    "to": "materialGidRef.code"
                                },
                                associatedFields: [
                                    {
                                        "from": "measurementUnitGidRef.name",
                                        "to": "materialGidRef.measurementUnitGidRef.name"
                                    },{
                                        "from": "name",
                                        "to": "materialGidRef.name"
                                    },{
                                        "from": "spec",
                                        "to": "materialGidRef.spec"
                                    },{
                                        "from": "model",
                                        "to": "materialGidRef.model"
                                    },{
                                        "from": "figureNumber",
                                        "to": "materialGidRef.figureNumber"
                                    },{
                                        "from": "gid",
                                        "to": "materialGid"
                                    }
                                ],
                                subscribes:[
                                    {
                                        event:"productTable-material.onSelectedRows",
                                        pubs:[
                                            {
                                                event:"productTable-material.expression",
                                                meta:{
                                                    expression:`
                                             console.log("选中值",data)
                                             let gid = data.eventPayload[0].gid
                                             let dataSource = {
                                                type: "api",
                                                method: "POST",
                                                mode:"dataContext",
                                                url: "/ime/mdProductInfo/validateProductInfoGid.action?id="+gid,
                                            }
                                            let onSuccess = function(data){
                                                if(data.data){
                                                    pubsub.publish("@@message.error","该产品已存在，请重新选择")
                                                    pubsub.publish("materialGidRef.name.dataContext",{eventPayload:data.data});
                                                }else{
                                                    pubsub.publish("@@message.success","该物料可用")
                                                    pubsub.publish("materialGidRef.name.dataContext",{eventPayload:data.data});
                                                }
                                            }
                                            resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                          `
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        event:"materialGidRef.code.onChange",
                                        pubs:[
                                            {
                                                event: "materialGidRef.code.expression",
                                                meta: {
                                                    expression: `
                                             resolveFetch({fetch:{id:'materialGidRef.name',data:'dataContext'}}).then(function(value){
                                                console.log("value2222222222",value)
                                                if(value){
                                                    pubsub.publish("@@form.change", { id: "Modify", name:"materialGidRef.code", value: "" })
                                                    pubsub.publish("@@form.change", { id: "Modify", name:"materialGidRef.name", value: "" })
                                                    pubsub.publish("@@form.change", { id: "Modify", name:"materialGidRef.measurementUnitGidRef.name" , value: "" })
                                                    pubsub.publish("@@form.change", { id: "Modify", name:"materialGidRef.spec", value: "" })
                                                    pubsub.publish("@@form.change", { id: "Modify", name:"materialGidRef.model", value: "" })
                                                    pubsub.publish("@@form.change", { id: "Modify", name:"materialGidRef.figureNumber", value: "" })
                                                }
                                             })
                                          `
                                                }
                                            }
                                        ]
                                    }
                                ],

                            }} component={FindbackField} name="materialGidRef.code" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "materialGidRef.name",
                                label: "产品名称",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="materialGidRef.name" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "materialGidRef.measurementUnitGidRef.name",
                                label: "主单位",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="materialGidRef.measurementUnitGidRef.name" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "materialGidRef.spec",
                                label: "规格",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="materialGidRef.spec" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "materialGidRef.model",
                                label: "型号",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="materialGidRef.model" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "materialGidRef.figureNumber",
                                label: "图号",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="materialGidRef.figureNumber" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "bomType",
                                label: "BOM类型",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload: {
                                        "query": {
                                            "query": [
                                                {
                                                    "field": "smDictionaryEnumGid",
                                                    "type": "eq",
                                                    "value": "56272988A1761D58E055000000000001"
                                                }
                                            ],
                                            "sorted": "seq"
                                        }
                                    }
                                },
                                displayField: "val",
                                valueField: "gid",

                            }} component={SelectField} name="bomType" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "replaceBom",
                                label: "主替BOM",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                dataSource: {
                                    type: "api",
                                    method:"post",
                                    url:"/sm/dictionaryEnumValue/query.action",
                                    mode:"payload",
                                    payload: {
                                        "query": {
                                            "query": [
                                                {
                                                    "field": "smDictionaryEnumGid",
                                                    "type": "eq",
                                                    "value": "56272988A1791D58E055000000000001"
                                                }
                                            ],
                                            "sorted": "seq"
                                        }
                                    }
                                },
                                displayField: "val",
                                valueField: "gid",
                            }} component={SelectField} name="replaceBom" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "routePathRef",
                                label: "工艺路线",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                form:"Modify",
                                subscribes:[
                                    {
                                        event: "routePathRef.onChange",
                                        pubs: [
                                            {
                                                event: "routePathRef.expression",//在某个组件上执行表达式
                                                meta: {
                                                    expression: `
                                                            me.dataContext={gid:data.eventPayload.gid}
                                                            //console.log(me.dataContext);
                                                                `
                                                }
                                            }
                                        ]
                                    }

                                ],
                                tableInfo: {
                                    id: "productTable-routePath",
                                    size: "small",
                                    rowKey: "gid",
                                    width:"300px",
                                    tableTitle: "工艺路线",
                                    columns: [
                                        { title: '工艺路线编码', dataIndex: 'routeLineCode', key: '1', width: 100 },
                                        { title: '工艺路线名称', dataIndex: 'routeLineName', key: '2', width: 100 },
                                        { title: '工艺路线版本', dataIndex: 'routeLineVersion', key: '3', width: 80 }
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/ime/mdRouteLine/query.action',
                                    }
                                },
                                pageId: 'productPage-routePath',
                                displayField: "routePathRef.code",
                                valueField: {
                                    "from": "routeLineCode",
                                    "to": "routePathRef.code",
                                },
                                associatedFields: [
                                    {
                                        "from": "routeLineVersion",
                                        "to": "routePathRef.version"
                                    },{
                                        "from": "gid",
                                        "to": "routePath"
                                    }
                                ]
                            }} component={FindbackField} name="routePathRef.code" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "routePathRef.version",
                                label: "工艺路线版本",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="routePathRef.version" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "baseQuantity",
                                label: "基本数量",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="baseQuantity" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "version",
                                label: "版本号",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="version" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "versionDescription",
                                label: "版本说明",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入"
                            }} component={TextField} name="versionDescription" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "isVirtual",
                                label: "虚拟件",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                checkedChildren: "是",
                                unCheckedChildren: "否"
                            }} component={SwitchField} name="isVirtual" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "isPivotal",
                                label: "关键件",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                checkedChildren: "是",
                                unCheckedChildren: "否",
                                subscribes: [
                                    {
                                        event: "isPivotal.onChange",
                                        pubs: [
                                            {
                                                event: "productInfoTableId.activateCol",
                                                eventPayloadExpression:`
                                                    console.log(eventPayload)
                                                    callback({
                                                      cols:["DetailIsPivotal"],
                                                      type: eventPayload
                                                    })
                                                `
                                            }
                                        ]
                                    }
                                ]
                            }} component={SwitchField} name="isPivotal" />
                        </Col>

                    </Row>
                </Card>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="子物料" key="1">
                            <Row>
                                <Col span={24}>
                                    <AppButton config={{
                                        id: "productAddBtn",
                                        title: "增加",
                                        type: "primary",
                                        size: "default",
                                        visible: true,
                                        enabled: true,
                                        subscribes:[
                                            {
                                                event:"productAddBtn.click",
                                                pubs:[
                                                    {
                                                        event:"productInfoTableId.addRow",
                                                 //        eventPayloadExpression:`
                                                 //        console.log("11111111111111")
                                                 //        resolveFetch({fetch:{id:'Modify',data:'@@formValues'}}).then(function(data){
                                                 //            console.log(data)
                                                 //            pubsub.publish("pCancel1.dataContext",{
                                                 //                    eventPayload:data.isPivotal
                                                 //            });
                                                 //        })
                                                 //        callback(111)
                                                 // `
                                                    },
                                                    // {
                                                    //     event:"productInfoTableId.activateCol",
                                                    //     eventPayloadExpression:`
                                                    //     resolveFetch({fetch:{id:'pCancel1',data:'dataContext'}}).then(function(data2){
                                                    //     console.log(data2)
                                                    //         callback({
                                                    //             cols:["DetailIsPivotal"],
                                                    //             type:data2
                                                    //         })
                                                    //     })
                                                    //     `
                                                    // }
                                                ]
                                            },

                                        ]
                                    }}/>
                                    <FieldArray name="mdProductInfoDetailDTOs" config={{
                                        "addButton":false,
                                        "id": "productInfoTableId",
                                        "name": "productTableFiled1",
                                        "rowKey": "id",
                                        "type":"radio",
                                        "columns": [
                                            {
                                                id: "productTableFiled2",
                                                type: "findbackField",
                                                title: "物料编码",
                                                form: "Modify",
                                                name: "materialGidRef.code",

                                                tableInfo: {
                                                    id: "tableInfo",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width:"500px",
                                                    tableTitle: "物料编码",
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '物料编码', width: 120, dataIndex: 'code', key: '1' },
                                                        { title: '物料名称', width: 120, dataIndex: 'name', key: '2' },
                                                        { title: '计量单位', dataIndex: 'measurementUnitGidRef.name', key: '3', width: 50 },
                                                        { title: '规格', dataIndex: 'spec', key: '4', width: 70 },
                                                        { title: '型号', dataIndex: 'model', key: '5', width: 70 },
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/ime/mdMaterielInfo/query.action',
                                                    }
                                                },
                                                pageId: 'tableFiledPage',
                                                displayField: "materialGidRef.code",
                                                valueField: {
                                                    "from": "code",
                                                    "to": "materialGidRef.code"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "name",
                                                        "to": "materialGidRef.name"
                                                    }, {
                                                        "from": "measurementUnitGidRef.name",
                                                        "to": "materialUnit"
                                                    }, {
                                                        "from": "spec",
                                                        "to": "materialGidRef.spec"
                                                    }, {
                                                        "from": "model",
                                                        "to": "materialGidRef.model"
                                                    }, {
                                                        "from": "gid",
                                                        "to": "materialGid"
                                                    }
                                                ]
                                            }
                                            , {
                                                "id": "materialGidRefName",
                                                "type": "textField",
                                                "title": "物料名称",
                                                "name": "materialGidRef.name",
                                                "enabled": false
                                            }, {
                                                "id": "materialGidRefSpec",
                                                "type": "textField",
                                                "title": "规格",
                                                "name": "materialGidRef.spec",
                                                "enabled": false
                                            }, {
                                                "id": "materialGidRefModel",
                                                "type": "textField",
                                                "title": "型号",
                                                "name": "materialGidRef.model",
                                                "enabled": false
                                            }, {
                                                "id": "measurementUnitGidRefName",
                                                "title": "计量单位",
                                                "type": "textField",
                                                "name": "materialUnit",
                                                "enabled": false
                                            },
                                            {
                                                "id": "productTableSelectFiled1",
                                                "type": "selectField",
                                                "title": "替代件",
                                                "name": "substitute",
                                                dataSource: {
                                                    type: "api",
                                                    method:"post",
                                                    url:"/sm/dictionaryEnumValue/query.action",
                                                    mode:"payload",
                                                    payload:{
                                                        "query":{
                                                            "query":[
                                                                {"field":"smDictionaryEnumGid","type":"eq","value":"56272988A1791D58E155000000000001"}
                                                            ],
                                                            "sorted":"seq"
                                                        }
                                                    }
                                                },
                                                displayField: "val",
                                                valueField: "gid"
                                            },
                                            {
                                                "id": "productTableFiled3",
                                                "type": "findbackField",
                                                "title": "工序",
                                                "name":"mdRouteOperationName",
                                                "enabled": true,
                                                "form":"Modify",
                                                subscribes:[
                                                    {
                                                        event:"productTableFiled16.onTableTodoAny",
                                                        pubs:[{
                                                            event:"productTableFiled16.expression",
                                                            meta:{
                                                                expression:`
                                                      resolveFetch({fetch:{id:'Modify',data:'@@formValues'}}).then(function(dt){
                                                             let dataSource={
                                                              type: 'api',
                                                              method: 'post',
                                                              url: '/ime/mdRouteLine/getRouteOperationByRouteGid.action',
                                                              paramsInQueryString:true,
                                                              payload:{
                                                                routeGid:dt.routePath
                                                              }
                                                              };
                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:{}},function(ddd){
                                                               pubsub.publish(me.id+".setData",{eventPayload:ddd.data})
                                                        })
                                                      });
                                                             `
                                                            }
                                                        }
                                                        ]
                                                    }
                                                ],
                                                tableInfo: {
                                                    id: "productTableFiled16",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    tableTitle: "工序",
                                                    onLoadData:false,
                                                    width:"300px",
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '工序编码', width: 100, dataIndex: 'code', key: '1' },
                                                        { title: '工序名称', width: 100, dataIndex: 'name', key: '2' }
                                                    ]
                                                },
                                                pageId: 'productPage4',
                                                displayField: "mdRouteOperationName",
                                                valueField: {
                                                    "from": "name",
                                                    "to": "mdRouteOperationName"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "gid",
                                                        "to": "mdRouteOperationGid"
                                                    },
                                                    {
                                                        "from": "code",
                                                        "to": "mdRouteOperationCode"
                                                    },
                                                    // {
                                                    //     "from": "name",
                                                    //     "to": "mdRouteOperationName"
                                                    // }
                                                ]
                                            },
                                            {
                                                "id": "productTableFiled4",
                                                "type": "findbackField",
                                                "title": "工位",
                                                "form": "Modify",
                                                "name": "factoryStationGidRef.stationName",
                                                tableInfo: {
                                                    id: "productTableFiled5",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    tableTitle: "工位",
                                                    width:500,
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '工位编码', width: 100, dataIndex: 'stationCode', key: '1' },
                                                        { title: '工位名称', width: 100, dataIndex: 'stationName', key: '2' },
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/ime/mdFactoryWorkStation/query.action',
                                                    }
                                                },
                                                pageId: 'productPage2',
                                                displayField: "stationName",
                                                valueField: {
                                                    "from": "stationName",
                                                    "to": "factoryStationGidRef.stationName"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "gid",
                                                        "to": "factoryStationGid"
                                                    }
                                                ]
                                            }, {
                                                "id": "productTableFiled6",
                                                "type": "findbackField",
                                                "title": "子件工艺路线",
                                                "form": "Modify",
                                                "name": "subTechnicsGidRef.name",

                                                tableInfo: {
                                                    id: "productTableFiled7",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    tableTitle: "工艺路线",
                                                    width:500,
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '工艺路线编码', width: 80, dataIndex: 'routeLineCode', key: '1' },
                                                        { title: '工艺路线名称', width: 80, dataIndex: 'routeLineName', key: '2' },
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/ime/mdRouteLine/query.action',
                                                    }
                                                },
                                                pageId: 'productPage3',
                                                displayField: "subTechnicsGidRef.name",
                                                valueField: {
                                                    "from": "routeLineName",
                                                    "to": "subTechnicsGidRef.name"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "gid",
                                                        "to": "subTechnicsGid"
                                                    }
                                                ]
                                            },
                                            /*{
                                                "id": "productTableFiled8",
                                                "type": "selectField",
                                                "title": "追溯",
                                                "name": "review",
                                                dataSource: {
                                                    type: "api",
                                                    method:"post",
                                                    url:"/sm/dictionaryEnumValue/query.action",
                                                    mode:"payload",
                                                    payload:{
                                                        "query":{
                                                            "query":[
                                                                {"field":"smDictionaryEnumGid","type":"eq","value":"56272988A1791D58E156000000000001"}
                                                            ],
                                                            "sorted":"seq"
                                                        }
                                                    }
                                                },
                                                displayField: "val",
                                                valueField: "gid"
                                            }, */
                                            {
                                                "id": "DetailIsPivotal",
                                                "title": "关键件",
                                                "type": "switchField",
                                                "name": "DetailIsPivotal",
                                                "enabled": true,
                                                "checkedChildren": "是",
                                                "unCheckedChildren": "否"
                                            },
                                            {
                                                "id": "validBeginTime",
                                                "title": "有效起始日期",
                                                "type": "dateField",
                                                "name": "validBeginTime",
                                                "enabled": true
                                            },
                                            {
                                                "id": "validEndTime",
                                                "title": "有效截止日期",
                                                "type": "dateField",
                                                "name": "validEndTime",
                                                "enabled": true
                                            },
                                            {
                                                "id": "productTableFiled9",
                                                "type": "selectField",
                                                "title": "用量方案",
                                                "name": "dosageScheme",
                                                dataSource: {
                                                    type: "api",
                                                    method:"post",
                                                    url:"/sm/dictionaryEnumValue/query.action",
                                                    mode:"payload",
                                                    payload:{
                                                        "query":{
                                                            "query":[
                                                                {"field":"smDictionaryEnumGid","type":"eq","value":"56272988A1669D58E055000000000001"}
                                                            ],
                                                            "sorted":"seq"
                                                        }
                                                    }
                                                },
                                                displayField: "val",
                                                valueField: "gid",
                                                subscribes: [
                                                    {
                                                        event: "productTableFiled9.onChange",
                                                        pubs: [
                                                            {
                                                                event: "productTableFiled12.expression",
                                                                meta:{
                                                                    expression: `
                                                                    let bomGid={gid:data.eventPayload}
                                                                    //console.log("bomGid",bomGid)
                                                                    let val
                                                                    if( bomGid.gid=="56EE122D4E275E53E055000000000001"){
                                                                        val = 1
                                                                        //console.log("val1111111111",val)
                                                                        pubsub.publish("@@form.change", { id: "Modify", name:me.props.input.name, value: val })
                                                                    }else if(bomGid.gid=="56EE122D4E285E53E055000000000001"){
                                                                        let val2=""
                                                                        //console.log("val2222222222",val2)
                                                                        pubsub.publish("@@form.change", { id: "Modify", name:me.props.input.name, value: val2 })
                                                                    }
                                                              `
                                                                }
                                                            },
                                                            {
                                                                event:"productTableFiled13.expression",
                                                                meta:{
                                                                    expression:`
                                                                        resolveFetch({fetch:{id:'productTableFiled10['+me.props.config.rowIndex+']',data:'props'}}).then(function(data1){
                                                                                //console.log("data1",data1);
                                                                                resolveFetch({fetch:{id:'productTableFiled12['+me.props.config.rowIndex+']',data:'props'}}).then(function(data2){
                                                                                //console.log("data2",data2);
                                                                                if(data1.input.value!="" && data2.input.value!="" && data1.input.value!=undefined && data2.input.value!=undefined){
                                                                                    let fz = data1.input.value
                                                                                    let fm = data2.input.value
                                                                                    let val = fz/fm
                                                                                    pubsub.publish("@@form.change", { id: "Modify", name:me.props.input.name , value: val })
                                                                                }else {
                                                                                    let val = ""
                                                                                    pubsub.publish("@@form.change", { id: "Modify", name:me.props.input.name , value: val })
                                                                                }
                                                                            })
                                                                        })
                                                                    `
                                                                }
                                                            },
                                                            {
                                                                event:"productTableFiled10.expression",
                                                                meta:{
                                                                    expression:``
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "productTableFiled10",
                                                "type": "textField",
                                                "title": "BOM用量",
                                                "name":"bomNumber",
                                                "enabled": true,
                                            },
                                            {
                                                "id": "productTableFiled11",
                                                "type": "textField",
                                                "title": "分子数量",
                                                "name":"moleculeNumber",
                                                "enabled": true,
                                                subscribes:[
                                                    {
                                                        event:"productTableFiled10.onChange",
                                                        pubs:[
                                                            {
                                                                event:"productTableFiled11.expression",
                                                                meta:{
                                                                    expression:`
                                                                        resolveFetch({fetch:{id:'productTableFiled9['+me.props.config.rowIndex+']',data:'props'}}).then(function(data2){
                                                                            //console.log("data2",data2)
                                                                            if(data2.input.value=="56EE122D4E275E53E055000000000001"){   //判断用量方案是bom用量时
                                                                                resolveFetch({fetch:{id:'productTableFiled10['+me.props.config.rowIndex+']',data:'props'}}).then(function(data){
                                                                                    //console.log(data,"data")
                                                                                        if(!data.input.value){
                                                                                            data.input.value = ""
                                                                                        }
                                                                                        let num = parseInt(data.input.value)
                                                                                        //console.log("me",me)
                                                                                        let val
                                                                                        val = num
                                                                                        pubsub.publish("@@form.change", { id: "Modify", name: me.props.input.name, value: val })
                                                                                        //pubsub.publish("productTableFiled11.dataContext",{eventPayload:val})
                                                                                    })
                                                                            }else if(data2.input.value=="56EE122D4E285E53E055000000000001"){    //判断用量方案为物料/产品时
                                                                                /*let val2 =""
                                                                                console.log("222222222222",val2)
                                                                                pubsub.publish("@@form.change", { id: "Modify", name: me.props.input.name, value: val2 })*/

                                                                            }
                                                                        })

                                                                    `
                                                                }
                                                            },
                                                            {
                                                                event: "productTableFiled13.expression",
                                                                meta: {
                                                                    expression: `
                                                                        resolveFetch({fetch:{id:'productTableFiled9['+me.props.config.rowIndex+']',data:'props'}}).then(function(bom){
                                                                           if(bom.input.value=="56EE122D4E275E53E055000000000001"){
                                                                             resolveFetch({fetch:{id:'productTableFiled10['+me.props.config.rowIndex+']',data:'props'}}).then(function(data1){
                                                                                //console.log("data1",data1);
                                                                                resolveFetch({fetch:{id:'productTableFiled12['+me.props.config.rowIndex+']',data:'props'}}).then(function(data2){
                                                                                //console.log("data2",data2);
                                                                                if(data1.input.value!="" && data2.input.value!="" && data1.input.value!=undefined && data2.input.value!=undefined){
                                                                                    let fz = data1.input.value
                                                                                    let fm = data2.input.value
                                                                                    let val = fz/fm
                                                                                    pubsub.publish("@@form.change", { id: "Modify", name:me.props.input.name , value: val })
                                                                                }else {
                                                                                    let val = ""
                                                                                    pubsub.publish("@@form.change", { id: "Modify", name:me.props.input.name , value: val })
                                                                                }
                                                                                })
                                                                            })
                                                                           }
                                                                        })
                                                                    `
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "productTableFiled12",
                                                "type": "textField",
                                                "title": "分母数量",
                                                "name":"denoNumber",
                                                "enabled": true,
                                                subscribes:[
                                                    {
                                                        event:"productTableFiled12.onChange",
                                                        pubs:[
                                                            {
                                                                event:"productTableFiled13.expression",
                                                                meta:{
                                                                    expression: `
                                                                        resolveFetch({fetch:{id:'productTableFiled11['+me.props.config.rowIndex+']',data:'props'}}).then(function(data1){
                                                                            console.log("data11111111111111",data1)
                                                                            resolveFetch({fetch:{id:'productTableFiled12['+me.props.config.rowIndex+']',data:'props'}}).then(function(data2){
                                                                                //console.log("data222222222222222222",data2);
                                                                                if(data1.input.value!="" && data2.input.value!="" && data1.input.value!=undefined && data2.input.value!=undefined){
                                                                                    let fz = data1.input.value
                                                                                    let fm = data2.input.value
                                                                                    let val = fz/fm
                                                                                    pubsub.publish("@@form.change", { id: "Modify", name:me.props.input.name , value: val })
                                                                                }else {
                                                                                    let val = ""
                                                                                    pubsub.publish("@@form.change", { id: "Modify", name:me.props.input.name , value: val })
                                                                                }
                                                                            })
                                                                        })
                                                                    `
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "productTableFiled13",
                                                "type": "textField",
                                                "title": "使用数量",
                                                "name":"useNumber",
                                                "enabled": true,
                                                // subscribes:[
                                                //     {
                                                //         event:"productTableFiled10.onChange",
                                                //         pubs:[
                                                //             {
                                                //                 event: "productTableFiled13.expression",
                                                //                 meta: {
                                                //                     expression: `
                                                //                     let index
                                                //                             resolveFetch({fetch:{id:'productTableFiled6['+me.props.config.rowIndex+']',data:'props'}}).then(function(data1){
                                                //                                 console.log("data1",data1);
                                                //                                 index=data1.config.index
                                                //                                 console.log("index",index)
                                                //                                 })
                                                //                     let moleculeNumber
                                                //                             resolveFetch({fetch:{id:'Modify',data:'@@formValues'}}).then(function(data2){
                                                //                                 console.log("data2",data2)
                                                //                                 moleculeNumber=data2.mdProductInfoDetailDTOs["index"].bomNumber
                                                //                             })
                                                //                     `
                                                //                 }
                                                //             }
                                                //         ]
                                                //
                                                //     }
                                                //     ]
                                                subscribes:[
                                                    {
                                                        event:"productTableFiled11.onChange",
                                                        pubs:[
                                                            {
                                                                event:"productTableFiled13.expression",
                                                                meta:{
                                                                    expression: `
                                                                        resolveFetch({fetch:{id:'productTableFiled11['+me.props.config.rowIndex+']',data:'props'}}).then(function(data1){
                                                                            console.log("data11111111111111",data1)
                                                                            resolveFetch({fetch:{id:'productTableFiled12['+me.props.config.rowIndex+']',data:'props'}}).then(function(data2){
                                                                                //console.log("data222222222222222222",data2);
                                                                                if(data1.input.value!="" && data2.input.value!="" && data1.input.value!=undefined && data2.input.value!=undefined){
                                                                                    let fz = data1.input.value
                                                                                    let fm = data2.input.value
                                                                                    let val = fz/fm
                                                                                    pubsub.publish("@@form.change", { id: "Modify", name:me.props.input.name , value: val })
                                                                                }else {
                                                                                    let val = ""
                                                                                    pubsub.publish("@@form.change", { id: "Modify", name:me.props.input.name , value: val })
                                                                                }
                                                                            })
                                                                        })
                                                                    `
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "productTableFiled14",
                                                "type": "textField",
                                                "title": "损耗率",
                                                "name":"lossRate",
                                                "enabled": true
                                            },
                                            {
                                                "id": "productTableFiled15",
                                                "type": "selectField",
                                                "title": "领料方式",
                                                "name": "pickWay",
                                                dataSource: {
                                                    type: "api",
                                                    method:"post",
                                                    url:"/sm/dictionaryEnumValue/query.action",
                                                    mode:"payload",
                                                    payload:{
                                                        "query":{
                                                            "query":[
                                                                {"field":"smDictionaryEnumGid","type":"eq","value":"56272988A1791D58E156200100000001"}
                                                            ],
                                                            "sorted":"seq"
                                                        }
                                                    }
                                                },
                                                displayField: "val",
                                                valueField: "gid"
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
        onSubmit:()=>{debugger}
    };
}

let ModifyForm = reduxForm({
    form: "Modify",
    validate,
})(Modify)
export default connect(mapStateToProps, mapDispatchToProps)(ModifyForm);
