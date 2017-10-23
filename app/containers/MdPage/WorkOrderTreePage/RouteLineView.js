/*
 *
 * OrderUniqueRule
 *
 */

import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import Immutable from 'immutable';
import pubsub from 'pubsub-js'
import {connect} from 'react-redux';
import AppButton from 'components/AppButton'
import AppTable from 'components/AppTable'
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
import TreeField from 'components/Form/TreeField'
import UploadField from 'components/Form/UploadField'
import FindbackField from 'components/Form/FindbackField'
import tinyCache from 'tinycache'

const TabPane = Tabs.TabPane;
import CoreComponent from 'components/CoreComponent'


export class RouteLineView extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props)
        console.log("props22222222",props)
        let formData = this.props.routeLineFormValue
        pubsub.publish("@@form.init", { id: "routeLineViewForm", data: Immutable.fromJS(formData) })

    }


    render(){
        debugger
        if(this.state.visible!=undefined&&this.state.visible==false)
        {

            return null
        }

        return(
            <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "routeLineCode",
                            label: "工艺路线编码",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入编码"
                        }} component={TextField} name="code" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "routeLineName",
                            label: "工艺路线名称",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入名称",

                        }} component={TextField} name="name" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "routeLineVersion",
                            label: "工艺路线版本",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请输入版本",
                        }} component={TextField} name="version" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            id: "routeLineType",
                            label: "工艺路线类型",  //标签名称
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
                                            {"field":"smDictionaryEnumGid","type":"eq","value":"5672E5535B775A23E055000000000001"}
                                        ],
                                        "sorted":"seq"
                                    }
                                },
                            },
                            displayField: "val",
                            valueField: "gid",
                        }} component={SelectField} name="type" />
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "outputNum",
                            label: "输出数量",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请输入数量",
                        }} component={TextField} name="outputNum" />
                    </Col>
                    <Col span={5}>
                        <Field config={{
                            enabled: true,
                            id: "rhythm",
                            label: "工艺节拍",  //标签名称
                            labelSpan: 10,   //标签栅格比例（0-24）
                            wrapperSpan: 12,  //输入框栅格比例（0-24）
                            placeholder: "请输入节拍",
                        }} component={TextField} name="rhythm" />
                    </Col>
                    <Col span={1}>
                        <Field config={{
                            id: "timeTypeRhythm",
                            label: "",  //标签名称
                            labelSpan: 4,   //标签栅格比例（0-24）
                            wrapperSpan: 20,  //输入框栅格比例（0-24）
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
                        }} component={SelectField} name="timeTypeRhythm" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            id: "workModeGid",
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
                        }} component={SelectField} name="workMode" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            id: "trackOrderModeGid",
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
                        }} component={SelectField} name="trackOrderMode" />
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "materialInfoCode",
                            label: "产品编码",
                            form:"routeLineViewForm",
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            tableInfo: {
                                id: "tablechanpin0101",
                                size: "small",
                                rowKey: "gid",
                                width:100,
                                tableTitle: "产品",
                                onLoadData: false,
                                columns: [
                                    { title: '产品编码', dataIndex: 'materialGidRef.code', key: '1', width: 100 },
                                    { title: '产品名称', dataIndex: 'materialGidRef.name', key: '2', width: 100 },
                                    { title: '规格', dataIndex: 'materialGidRef.spec', key: '3', width: 50 },
                                    { title: '型号', dataIndex: 'materialGidRef.model', key: '4', width: 50 },
                                    { title: '版本号', dataIndex: 'version', key: '5', width: 50 },
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    url: '/ime/mdProductInfo/query.action',
                                }
                            },
                            pageId: 'findBackchanpin0102',
                            displayField: "materialInfoCode",
                            valueField: {
                                "from": "materialGidRef.code",
                                "to": "materialInfoCode"
                            },
                            associatedFields: [
                                {
                                    "from": "gid",
                                    "to": "productInfoGid"
                                },
                                {
                                    "from": "materialGidRef.gid",
                                    "to": "materialInfoGid"
                                },
                                {
                                    "from": "materialGidRef.name",
                                    "to": "materialInfoName"
                                },
                                {
                                    "from": "materialGidRef.spec",
                                    "to": "spec"
                                },
                                {
                                    "from": "materialGidRef.model",
                                    "to": "model"
                                },
                                {
                                    "from": "version",
                                    "to": "productVersion"
                                }
                            ],
                            subscribes: [
                                {
                                    event:"tablechanpin0101.onTableTodoAny",
                                    pubs:[
                                        {
                                            event:"tablechanpin0101.expression",
                                            meta:{
                                                expression:`
                                               let field = "routePath"
                                    let payload = {
                                        "query": {
                                          "query": [
                                            {
                                              "field": field, "type": "null"
                                            }
                                          ],
                                         // "sorted": "gid asc"
                                        },
                                        "pager":{
                                            "page":1,
                                            "pageSize":10
                                        }
                                    }
                                     pubsub.publish(me.props.config.id+'.loadData',{eventPayload:payload})
                                  `
                                            }

                                        }
                                    ],

                                },
                                {
                                    event: "materialInfoCode.onChange",
                                    pubs: [
                                        {
                                            event: "materialInfoCode.expression",//在某个组件上执行表达式
                                            meta: {
                                                expression: `
                                              console.log(1234567890)
                      let dataSource= {type: "api",method: "POST",url: "/ime/mdProductInfo/findById.action?id="+data.eventPayload.gid};
                    resolveDataSource({dataSource:dataSource}).then(function(res){
                      let mdData = {}
                      if(res.data.materialGidRef){
                          mdData.productCode = res.data.materialGidRef.code
                          mdData.productName = res.data.materialGidRef.name
                      }
                      mdData.bomType = res.data.bomType
                      mdData.baseQuantity = res.data.baseQuantity
                      if(res.data.routePathRef){
                          mdData.routePathName = res.data.routePathRef.name
                      }
                      mdData.isVirtual = res.data.isVirtual
                      mdData.productInfoGid = res.data.gid
                      let dataList = []
                      dataList.push(mdData)
                      console.log(dataList)

                      pubsub.publish("@@form.change", { id: "Create",name:"routeProductDTOs" ,value:fromJS(dataList)})
                    });
                    `
                                            }
                                        }
                                    ]
                                }
                            ]
                        }} name="productInfoGidRef.materialGidRef.code" component={FindbackField} />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "materialInfoName",
                            label: "产品名称",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                        }} component={TextField} name="productInfoGidRef.materialGidRef.name" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "spec",
                            label: "规格",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                        }} component={TextField} name="productInfoGidRef.materialGidRef.spec" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "model",
                            label: "型号",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                        }} component={TextField} name="productInfoGidRef.materialGidRef.model" />
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "productVersion",
                            label: "产品版本",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                        }} component={TextField} name="productVersion" />
                    </Col>

                    <Col span={5}>
                        <Field config={{
                            enabled: true,
                            id: "produceCycle",
                            label: "生产周期",  //标签名称
                            labelSpan: 10,   //标签栅格比例（0-24）
                            wrapperSpan: 12,  //输入框栅格比例（0-24）
                            placeholder: "请输入生产周期"
                        }} component={TextField} name="produceCycle" />
                    </Col>
                    <Col span={1}>
                        <Field config={{
                            id: "timeTypeProduceCycle",
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
                        }} component={SelectField} name="timeTypeProduceCycle" />
                    </Col>
                </Row>
            </Card>
        )
    }


}

RouteLineView.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

function mapStateToProps(props) {
    return {
        onSubmit: () => {
        }
    }
}


let RouteLineViewForm = reduxForm({
    form: "routeLineViewForm",
})(RouteLineView)

export default connect(mapStateToProps, mapDispatchToProps)(RouteLineViewForm)

