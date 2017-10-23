/*
 *
 * 工作中心属性编辑表单
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import pubsub from 'pubsub-js'
import { fromJS } from "immutable"

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
import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'
import Immutable from 'immutable'
import { submit } from 'redux-form/immutable'
import unionBy  from 'lodash/unionBy'


import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

import CanvasBaseForm from './CanvasBaseForm'


const validate = values => {
    const errors = {}
    if (!values.get('code')) {
        errors.code = '必填项'
    }
    if (!values.get('name')) {
        errors.name = '必填项'
    }

    return errors
}

class RouteLineForm extends CanvasBaseForm { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props)

        this.pubsubEvents = {
            'routeLineFormConfirmButton.click': 'routeLineFormConfirmButton.click'
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.initSubscribe();
        this.initData();
    }
    
    // 初始化数据
    initData(){
        let shape = this.props.shape;
        let layer = shape.getLayer();
        let shapeData = shape.getAttr('shapeData');
        // 名称和label保持同步
        shapeData.name = shape.getAttr('text');
        //将canvas中的数据同步到表格中去
        pubsub.publish("@@form.init", { id: "RouteLineForm", data: Immutable.fromJS(shape.getAttr('shapeData')) })
    }

    // 注册事件
    initSubscribe(){
        let _this = this;
        pubsub.subscribe("routeLineFormConfirmButton.click", () => {
            resolveFetch({
                fetch: {
                    id: "RouteLineForm",
                    data: "@@formValues"
                }
            }).then(function (data) {
                window.store.dispatch(submit('RouteLineForm'));
                let currentForm=window.store.getState().get("form").get('RouteLineForm');
                let error=false;
                if(currentForm!=undefined)
                {
                    if(currentForm.get('syncErrors')|| currentForm.get('asyncErrors'))
                    {
                        error=true
                    }
                }
                if(!error){
                    let shape = _this.props.shape;
                    let layer = shape.getLayer();
                    if(data){
                        shape.setAttr('shapeData',data);
                        shape.setAttr('text',data.name);
                        layer.draw();
                        pubsub.publish('technicFormModal.onCancel');
                        //根据选择的产品，将该产品加入到共享产品列表中
                        let dataSource= {type: "api",method: "POST",url: "/ime/mdProductInfo/findById.action?id="+data.productInfoGid};
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


                            // 获取数据
                            let  mdRouteEquipmentForm = window.store.getState().get("form").get('mdRouteEquipmentForm');
                            if(!mdRouteEquipmentForm){
                                pubsub.publish("@@form.change", { id: "mdRouteEquipmentForm",name:"routeProductDTOs" ,value: fromJS(dataList) })
                            } else {
                                let routeProductDTOs = mdRouteEquipmentForm.toJS().values.routeProductDTOs || []
                                let imeArr = unionBy(routeProductDTOs.concat(dataList), 'productInfoGid');
                                pubsub.publish("@@form.change", { id: "mdRouteEquipmentForm",name:"routeProductDTOs" ,value: fromJS(imeArr) })
                            }
                        });
                    }
                }

            })
        })
    }


    componentWillUnmount() {
        super.componentWillUnmount()
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>工艺</Breadcrumb.Item>
                    <Breadcrumb.Item>编辑属性</Breadcrumb.Item>
                </Breadcrumb>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "routeLineCode",
                                form:"RouteLineForm",
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
                                form:"RouteLineForm",
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
                                form:"RouteLineForm",
                                label: "工艺路线版本",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请输入版本",
                            }} component={TextField} name="routeLineVersion" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "routeLineType",
                                form:"RouteLineForm",
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
                            }} component={SelectField} name="routeLineType" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "outputNum",
                                form:"RouteLineForm",
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
                                form:"RouteLineForm",
                                label: "工艺节拍",  //标签名称
                                labelSpan: 10,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                placeholder: "请输入节拍",
                            }} component={TextField} name="rhythm" />
                        </Col>
                        <Col span={1}>
                            <Field config={{
                                id: "timeTypeRhythm",
                                form:"RouteLineForm",
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
                                form:"RouteLineForm",
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
                            }} component={SelectField} name="workModeGid" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "trackOrderModeGid",
                                form:"RouteLineForm",
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
                            }} component={SelectField} name="trackOrderModeGid" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "materialInfoCode",
                                label: "产品编码",
                                form:"RouteLineForm",
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                tableInfo: {
                                    id: "RouteLineFormMaterialInfoList",
                                    form: 'RouteLineForm',
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
                                pageId: 'RouteLineFormMaterialCodePage',
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
                                        event:"RouteLineFormMaterialInfoList.onTableTodoAny",
                                        pubs:[
                                            {
                                                event:"RouteLineFormMaterialInfoList.expression",
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

                      pubsub.publish("@@form.change", { id: "Create",name:"routeProductDTOs" ,value:fromJS(dataList)})
                    });
                    `
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }} name="materialInfoCode" component={FindbackField} />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "materialInfoName",
                                form:"RouteLineForm",
                                label: "产品名称",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="materialInfoName" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "spec",
                                form:"RouteLineForm",
                                label: "规格",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="spec" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "model",
                                form:"RouteLineForm",
                                label: "型号",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="model" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "productVersion",
                                form:"RouteLineForm",
                                label: "产品版本",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="productVersion" />
                        </Col>

                        <Col span={5}>
                            <Field config={{
                                enabled: true,
                                id: "produceCycle",
                                form:"RouteLineForm",
                                label: "生产周期",  //标签名称
                                labelSpan: 10,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                placeholder: "请输入生产周期"
                            }} component={TextField} name="produceCycle" />
                        </Col>
                        <Col span={1}>
                            <Field config={{
                                id: "timeTypeProduceCycle",
                                form:"RouteLineForm",
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
                    <Row>
                        <Col>
                            <AppButton config={{
                                id: "routeLineFormConfirmButton",
                                title: "确定",
                                visible: true,
                                enabled: true,
                                type: "primary",
                            }}></AppButton>
                            <AppButton config={{
                                id: "routeLineFormCancelButton",
                                title: "取消",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "routeLineFormCancelButton.click",
                                        pubs:[{
                                            event: "technicFormModal.onCancel",
                                        }]
                                    }
                                ]
                            }}></AppButton>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}

RouteLineForm.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        onSubmit:()=>{}
    };
}

let RouteLineFormForm = reduxForm({
    form: "RouteLineForm",
    validate,
})(RouteLineForm)

export default connect(null, mapDispatchToProps)(RouteLineFormForm);
