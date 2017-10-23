import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Row, Card, Col, Tabs} from 'antd';
import {Link} from 'react-router';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'

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

//import CheckBoxField from '../../../../components/Form/CheckBoxField';
import AppButton from "components/AppButton";
import FindbackField from 'components/Form/FindbackField';
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';

const TabPane = Tabs.TabPane;


const validate = values => {
    const errors = {}
    if (!values.get('productGid')) {
        errors.productGid = '必填项'
    }
    return errors
}

export class QualityStandardCreatePage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            orderSpit: ''
        }

        let dataSource = {
            type: 'api',
            method: 'post',
            url: '/sm/codeRule/generateCode.action?ruleCode=QS'
        }

        resolveDataSource({
            dataSource: dataSource
        }).then(function (response) {
            if (response.success) {
                let modifyData = {}
                modifyData.code = response.data;
                pubsub.publish("@@form.init", {id: "createForm", data: modifyData});

            } else {
                pubsub.publish("@@message.error", "初始化获取编码失败!");
            }
        }.bind(this))
    }


    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>质量</Breadcrumb.Item>
                    <Breadcrumb.Item>质检标准创建</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true}
                      style={{"marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px"}}
                      bodyStyle={{
                          "paddingTop": "10px",
                          "paddingBottom": "10px",
                          "paddingLeft": "25px",
                          "paddingRight": "25px"
                      }}>
                    <Row>
                        <Col span={8} xs={24}>

                            <AppButton config={{
                                id: "saveBtn",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "saveBtn.click",
                                        pubs:
                                            [
                                                {
                                                    event: "saveBtn.expression",
                                                    meta: {
                                                        expression: `
                                                                resolveFetch({fetch:{id:"createForm",data:"@@formValues"}}).then(function (value) {


                                                                    let  formValue = value;

                                                                    //console.log("表达式调试");
                                                                    //console.log(formValue);
                                                                    if(!formValue.productGid){
                                                                     pubsub.publish("@@message.error","物料编码不能为空");

                                                                        return;
                                                                    }
                                                                    if(!formValue.qualityWayGid){
                                                                     pubsub.publish("@@message.error","质检方式不能为空");

                                                                        return;
                                                                    }



                                                                    let dataSource= {
                                                                      type: "api",
                                                                      mode:"dataContext",
                                                                      method: "POST",
                                                                      url: "/ime/imeQcQualityStandard/add.action"
                                                                    };

                                                                    let onSuccess = function(response){
                                                                        if(response.success){
                                                                            pubsub.publish("@@message.success","操作成功");
                                                                            pubsub.publish("@@navigator.push", {url: "/imeQualityStandard"});
                                                                        }else{
                                                                            pubsub.publish("@@message.error",response.data);
                                                                        }
                                                                    }

                                                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:formValue,dataContext:formValue},onSuccess);


                                                                });
                                                            `
                                                    }
                                                }
                                            ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "cancelBtn",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cancelBtn.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "/imeQualityStandard"
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
                <Card bordered={true}>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                form: "createForm",
                                id: "code",
                                label: "质检标准编码",  //标签名称
                                labelSpan: 10,   //标签栅格比例（0-24）
                                wrapperSpan: 14,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入编码"
                            }} component={TextField} name="code"/>
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "productGid",
                                form: "createForm",
                                label: "物料编码",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请选择产品",

                                tableInfo: {
                                    id: "productGidFindBackTable",
                                    size: "small",
                                    rowKey: "gid",
                                    width: "500",
                                    tableTitle: "物料编码",
                                    columns: [
                                        {title: '物料名称', dataIndex: 'materialGidRef.name', key: '2', width: 100},
                                        {title: '物料编码', dataIndex: 'materialGidRef.code', key: '1', width: 100},
                                        {title: '规格', width: 50, dataIndex: 'materialGidRef.spec', key: '3'},
                                        {title: '型号', width: 50, dataIndex: 'materialGidRef.model', key: '4'},
                                        {
                                            title: '单位',
                                            width: 50,
                                            dataIndex: 'materialGidRef.measurementUnitGidRef.name',
                                            key: '5'
                                        },
                                        {title: '工艺路线', width: 100, dataIndex: 'routePathRef.name', key: '6'}
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/ime/mdProductInfo/query.action',
                                    }
                                },
                                pageId: 'productGidFindBackTablePage',
                                displayField: "materialGidRef.code",
                                valueField: {
                                    "from": "gid",
                                    "to": "productGid"
                                },
                                associatedFields: [
                                    {
                                        "from": "materialGidRef.name",
                                        "to": "productGidRef.materialGidRef.name"
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
                                        "from": "materialGidRef.measurementUnitGidRef.name",
                                        "to": "unit"
                                    },
                                    {
                                        "from": "routePathRef.name",
                                        "to": "mdRouteLineName"
                                    },
                                    {
                                        "from": "routePathRef.gid",
                                        "to": "mdRouteLine"
                                    }


                                ]


                            }} component={FindbackField} name="productGid"/>
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                form: "createForm",
                                id: "productGidRef.materialGidRef.name",
                                label: "物料名称",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "物料名称"
                            }} component={TextField} name="productGidRef.materialGidRef.name"/>
                        </Col>

                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                form: "createForm",
                                id: "spec",
                                label: "规格",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "规格"
                            }} component={TextField} name="spec"/>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                form: "createForm",
                                id: "model",
                                label: "型号",  //标签名称
                                labelSpan: 10,   //标签栅格比例（0-24）
                                wrapperSpan: 14,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "型号"
                            }} component={TextField} name="model"/>
                        </Col>

                        <Col span={6}>

                            <Field config={{
                                enabled: false,
                                form: "createForm",
                                id: "unit",
                                label: "单位",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "单位"
                            }} component={TextField} name="unit"/>
                        </Col>

                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "qualityWayGid",
                                form: "createForm",
                                label: "质检方式",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请选择质检方式",

                                tableInfo: {
                                    id: "qualityWayGidFindBackTable",
                                    size: "small",
                                    rowKey: "gid",
                                    width: "500",
                                    tableTitle: "质检方式",
                                    columns: [
                                        {title: '名称', dataIndex: 'name', key: '2', width: 100},
                                        {title: '编码', dataIndex: 'code', key: '1', width: 100},
                                        {title: '描述', dataIndex: 'description', key: '3', width: 300}
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/ime/imeQcQualityWay/query.action',
                                    }
                                },
                                pageId: 'qualityWayGidFindBackTablePage',
                                displayField: "name",
                                valueField: {
                                    "from": "gid",
                                    "to": "qualityWayGid"
                                },
                                associatedFields: [
                                    /*{
                                        "from": "busiUnitCode",
                                        "to": "abbreviate"
                                    }*/
                                ]


                            }} component={FindbackField} name="qualityWayGid"/>
                        </Col>

                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                form: "createForm",
                                id: "mdRouteLineName",
                                label: "工艺路线",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "工艺路线"
                            }} component={TextField} name="mdRouteLineName"/>
                        </Col>

                    </Row>
                    <Row>

                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                form: "createForm",
                                visible: false,
                                id: "mdRouteLine",
                                label: "工艺路线",  //标签名称
                                labelSpan: 10,   //标签栅格比例（0-24）
                                wrapperSpan: 14,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "工艺路线"
                            }} component={TextField} name="mdRouteLine"/>
                        </Col>
                    </Row>
                    <Row>
                        <Tabs id="tabPane" defaultActiveKey="1" type="card">
                            <TabPane tab="检验项目" key="1" id="tab1">
                                <FieldArray name="imeQcInspectionItemDTOs" config={{
                                    "id": "imeQcInspectionItemDTOs",
                                    "name": "imeQcInspectionItemDTOs",
                                    "form": "createForm",
                                    "rowKey": "gid",
                                    "mode": "new",
                                    "addButton": true, //是否显示默认增行按钮
                                    "showSelect": false, //是否显示选择框
                                    "type": "checkbox", //表格单选（radio）复选（checkbox）类型
                                    "unEditable": true, //初始化是否都不可编辑
                                    "showRowDeleteButton": true,  //是否显示操作列
                                    mode: "new",
                                    "columns": [

                                        {
                                            "id": "mdRouteOperationGid",
                                            "type": "findbackField",
                                            "title": "工序编码",
                                            "form": "createForm",
                                            "name": "mdRouteOperationGid",
                                            subscribes:
                                                [
                                                    {
                                                        event: "routeOperationGidTable.onTableTodoAny",
                                                        pubs: [
                                                            {
                                                                event: "routeOperationGidTable.expression",
                                                                meta: {
                                                                    expression: `
                                                                                  resolveFetch({fetch: {id: 'createForm', data: '@@formValues'}}).then(function (da) {
                                                                                    //console.log(da)
                                                                                    if (da.mdRouteLine) {
                                                                                       let payload = {id: da.mdRouteLine}
                                                                                        let dataSource = {
                                                                                            type: 'api',
                                                                                            method: 'post',
                                                                                            paramsInQueryString: true,
                                                                                            url: '/ime/mdRouteLine/findById.action'
                                                                                        }
                                                                                        resolveDataSourceCallback({dataSource: dataSource, eventPayload: payload}, function (res) {
                                                                                            pubsub.publish(me.props.config.id + '.setData', {eventPayload: res.data.mdRouteOperationDTOs})
                                                                                        })
                                                                                    }

                                                                                  });
                                                                                  `
                                                                }
                                                            }

                                                        ]
                                                    }
                                                ],
                                            tableInfo:
                                                {
                                                    id: "routeOperationGidTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "200",
                                                    tableTitle: "工序",
                                                    showSerial: true,  //序号
                                                    onLoadData: false,
                                                    columns:
                                                        [
                                                            {title: '工序编码', width: 100, dataIndex: 'code', key: '1'},
                                                            {title: '工序名称', width: 100, dataIndex: 'name', key: '2'}
                                                        ]
                                                },
                                            pageId: 'routeOperationGidPage',
                                            displayField: "code",
                                            valueField:
                                                {
                                                    "from": "gid",
                                                    "to": "mdRouteOperationGid"
                                                },
                                            associatedFields: [
                                                {
                                                    "from": "name",
                                                    "to": "mdRouteOperationName"
                                                },
                                                {
                                                    "from": "code",
                                                    "to": "mdRouteOperationCode"
                                                }

                                            ]
                                        }, /*{
                                            "id": "mdRouteOperationCode",
                                            "type": "textField",
                                            "title": "工序编码",
                                            "name": "mdRouteOperationCode",
                                            "enabled": false,
                                            "visible": false

                                        },*/
                                        {
                                            "id": "mdRouteOperationName",
                                            "type": "textField",
                                            "title": "工序名称",
                                            "name": "mdRouteOperationName",
                                            "enabled": false

                                        },
                                        {
                                            "id": "qualityCheckItemGid",
                                            "type": "findbackField",
                                            "title": "检验项目编码",
                                            "name": "qualityCheckItemGid",
                                            "form": "createForm",

                                            tableInfo:
                                                {
                                                    id: "checkItemGidTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    tableTitle: "质检项目",
                                                    width: 450,
                                                    showSerial: true,  //序号
                                                    columns:
                                                        [
                                                            {title: '编码', width: 100, dataIndex: 'code', key: '1'},
                                                            {title: '名称', width: 100, dataIndex: 'name', key: '2'},
                                                            {title: '类型', dataIndex: 'type', key: '3', width: 100},
                                                            {title: '备注', dataIndex: 'remark', key: '4', width: 150}
                                                        ],
                                                    dataSource:
                                                        {
                                                            type: 'api',
                                                            method: 'post',
                                                            url: '/ime/imeQcQualityCheckitem/query.action'
                                                        }
                                                },
                                            pageId: 'checkItemGidPage',
                                            displayField: "code",
                                            valueField:
                                                {
                                                    "from": "gid",
                                                    "to": "qualityCheckItemGid"
                                                },
                                            associatedFields: [
                                                {
                                                    "from": "name",
                                                    "to": "checkItemDTO.name"
                                                },
                                                {
                                                    "from": "type",
                                                    "to": "checkItemDTO.type"
                                                }
                                            ],
                                            subscribes: [

                                                {
                                                    event: "qualityCheckItemGid.onChange",
                                                    pubs: [
                                                        {
                                                            event: "upperLimit.enabled",
                                                            eventPayloadExpression: `
                                                            let type = eventPayload.type;
                                                            if(type=="59B01BE2490839D6E055000000000001"){
                                                                callback(false);
                                                            }else{
                                                                callback(true);
                                                            }
                                                                                    `
                                                        }, {
                                                            event: "lowerLimit.enabled",
                                                            eventPayloadExpression: `
                                                            let type = eventPayload.type;
                                                            if(type=="59B01BE2490839D6E055000000000001"){
                                                                callback(false);
                                                            }else{
                                                                callback(true);
                                                            }
                                                                                    `
                                                        }
                                                    ]
                                                }
                                                ]
                                        },
                                        {
                                            "id": "checkItemDTO.name",
                                            "type": "textField",
                                            "title": "检验项目名称",
                                            "enabled": false,
                                            "name": "checkItemDTO.name"

                                        },
                                        {
                                            "id": "checkItemDTO.type",
                                            "type": "selectField",
                                            "title": "检验项目类型",
                                            "enabled": false,
                                            "name": "checkItemDTO.type",
                                            dataSource: {
                                                type: "api",
                                                method: "post",
                                                url: "/sm/dictionaryEnumValue/query.action",
                                                mode: "payload",
                                                payload: {
                                                    "query": {
                                                        "query": [
                                                            {
                                                                "field": "smDictionaryEnumGid",
                                                                "type": "eq",
                                                                "value": "59B01BE2490739D6E055000000000001"
                                                            }
                                                        ],
                                                        "sorted": "seq"
                                                    }
                                                },
                                            },
                                            displayField: "val",
                                            valueField: "gid"


                                        },
                                        {
                                            "id": "indexCode",
                                            "type": "textField",
                                            "title": "检验指标编码",
                                            "name": "indexCode"

                                        },
                                        {
                                            "id": "indexDesc",
                                            "type": "textField",
                                            "title": "检验指标描述",
                                            "name": "indexDesc"

                                        },
                                        {
                                            "id": "upperLimit",
                                            "type": "textField",
                                            "title": "上限值",
                                            "name": "upperLimit"

                                        },
                                        {
                                            "id": "lowerLimit",
                                            "type": "textField",
                                            "title": "下限值",
                                            "name": "lowerLimit"

                                        },
                                        {
                                            "id": "importance",
                                            "type": "selectField",
                                            "title": "标准重要度",
                                            "name": "importance",
                                            dataSource: {
                                                type: "api",
                                                method: "post",
                                                url: "/sm/dictionaryEnumValue/query.action",
                                                mode: "payload",
                                                payload: {
                                                    "query": {
                                                        "query": [
                                                            {
                                                                "field": "smDictionaryEnumGid",
                                                                "type": "eq",
                                                                "value": "59B01BE2490939D6E055000000000001"
                                                            }
                                                        ],
                                                        "sorted": "seq"
                                                    }
                                                },
                                            },
                                            displayField: "val",
                                            valueField: "gid"

                                        }


                                    ]
                                }} component={TableField}/>
                            </TabPane>
                            <TabPane tab="缺陷信息" key="2">
                                <FieldArray name="imeQcInvalidinfoDTOs" config={{
                                    "id": "imeQcInvalidinfoDTOs",
                                    "name": "imeQcInvalidinfoDTOs",
                                    "form": "createForm",
                                    "rowKey": "gid",
                                    "addButton": true, //是否显示默认增行按钮
                                    "showSelect": false, //是否显示选择框
                                    "type": "checkbox", //表格单选（radio）复选（checkbox）类型
                                    "unEditable": true, //初始化是否都不可编辑
                                    "showRowDeleteButton": true,  //是否显示操作列
                                    "columns": [

                                        {
                                            "id": "defectGid",
                                            "type": "findbackField",
                                            "title": "缺陷编码",
                                            "name": "defectGid",
                                            "form": "createForm",
                                            tableInfo:
                                                {
                                                    id: "defectGidTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    tableTitle: "缺陷信息",
                                                    showSerial: true,  //序号
                                                    width: 450,
                                                    columns:
                                                        [
                                                            {title: '编码', width: 100, dataIndex: 'code', key: '1'},
                                                            {title: '名称', width: 100, dataIndex: 'name', key: '2'},
                                                            {
                                                                title: '等级',
                                                                dataIndex: 'defectiveLevel',
                                                                key: '3',
                                                                width: 100
                                                            },
                                                            {title: '备注', dataIndex: 'remarks', key: '4', width: 150}
                                                        ],
                                                    dataSource:
                                                        {
                                                            type: 'api',
                                                            method: 'post',
                                                            url: '/ime/imeQcDefect/query.action'
                                                        }
                                                },
                                            pageId: 'defectGidPage',
                                            displayField: "code",
                                            valueField:
                                                {
                                                    "from": "gid",
                                                    "to": "defectGid"
                                                },
                                            associatedFields: [
                                                {
                                                    "from": "name",
                                                    "to": "name"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "name",
                                            "type": "textField",
                                            "title": "缺陷名称",
                                            "enabled": false,
                                            "name": "name"

                                        },
                                        {
                                            "id": "remarks",
                                            "type": "textField",
                                            "title": "备注",
                                            "name": "remarks"

                                        }

                                    ]
                                }} component={TableField}/>
                            </TabPane>
                            <TabPane tab="检具/量具" key="3">
                                <FieldArray name="imeQcQualityStandardToolDTOs" config={{
                                    "id": "imeQcQualityStandardToolDTOs",
                                    "name": "imeQcQualityStandardToolDTOs",
                                    "form": "createForm",
                                    "rowKey": "gid",
                                    "addButton": true, //是否显示默认增行按钮
                                    "showSelect": false, //是否显示选择框
                                    "type": "checkbox", //表格单选（radio）复选（checkbox）类型
                                    "unEditable": true, //初始化是否都不可编辑
                                    "showRowDeleteButton": true,  //是否显示操作列
                                    "columns": [

                                        {
                                            "id": "checkingtoolGid",
                                            "type": "findbackField",
                                            "title": "检具/量具编码",
                                            "name": "checkingtoolGid",
                                            "form": "createForm",
                                            tableInfo:
                                                {
                                                    id: "checkingToolTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    tableTitle: "检具档案信息",
                                                    showSerial: true,  //序号
                                                    width: 450,
                                                    columns:
                                                        [
                                                            {title: '检具/量具编码', width: 100, dataIndex: 'code', key: '1'},
                                                            {title: '检具/量具名称', width: 100, dataIndex: 'name', key: '2'},
                                                            {title: '工具类型', dataIndex: 'type', key: '3', width: 100},
                                                            {title: '备注', dataIndex: 'remark', key: '4', width: 150}
                                                        ],
                                                    dataSource:
                                                        {
                                                            type: 'api',
                                                            method: 'post',
                                                            url: '/ime/imeQcCheckingtool/query.action'
                                                        }
                                                },
                                            pageId: 'checkingToolPage',
                                            displayField: "code",
                                            valueField:
                                                {
                                                    "from": "gid",
                                                    "to": "checkingtoolGid"
                                                },
                                            associatedFields: [
                                                {
                                                    "from": "name",
                                                    "to": "name"
                                                },
                                                {
                                                    "from": "type",
                                                    "to": "unit"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "name",
                                            "type": "textField",
                                            "title": "检具/量具名称",
                                            "enabled": false,
                                            "name": "name"

                                        },
                                        {
                                            "id": "amount",
                                            "type": "textField",
                                            "title": "数量",
                                            "name": "amount"

                                        },
                                        {
                                            "id": "unit",
                                            "type": "selectField",
                                            "title": "工具类型",
                                            "name": "unit",
                                            "enabled": false,
                                            dataSource: {
                                                type: "api",
                                                method: "post",
                                                url: "/sm/dictionaryEnumValue/query.action",
                                                mode: "payload",

                                                payload: {
                                                    "query": {
                                                        "query": [
                                                            {
                                                                "field": "smDictionaryEnumGid",
                                                                "type": "eq",
                                                                "value": "5A22B8055C5A2798E055000000000001"
                                                            }
                                                        ],
                                                        "sorted": "seq"
                                                    }
                                                },
                                            },
                                            displayField: "val",
                                            valueField: "gid"

                                        }

                                    ]
                                }} component={TableField}/>

                            </TabPane>
                        </Tabs>
                    </Row>


                </Card>
            </div>
        );
    }
}


export default reduxForm({
    form: "createForm",
    validate
})(QualityStandardCreatePage)


