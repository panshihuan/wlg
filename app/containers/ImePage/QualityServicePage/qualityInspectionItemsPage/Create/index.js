/*
 *
 * Create 质检项目创建页面
 *
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {Link} from 'react-router';

import DropdownButton from 'components/DropdownButton';

import ModalContainer from 'components/ModalContainer'

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
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import UploadField from 'components/Form/UploadField'
import AppTable from 'components/AppTable';

import CoreComponent from 'components/CoreComponent'

import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'

const TabPane = Tabs.TabPane;

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
const asyncValidate = values => {
    let dataSource = {
        mode: "dataContext",
        type: "api",
        method: "POST",
        url: "/sm/checkUnique/check.action",
    }
    let className = "com.neusoft.ime.qc.imeQcQualityCheckitem.dto.CheckItemDTO"
    let fieldNames = "code,delete";
    let fieldValues = values.get('code') + ",0";
    return new Promise(resolve => resolveDataSource({
        dataSource,
        dataContext: {gid: "", className: className, fieldNames: fieldNames, fieldValues, fieldValues}
    }).then(function (res) {
        resolve(res)
    })).then(function (res) {
        if (!res.data) {
            throw {code: "该编码已存在,请重新填写"}
        }
    })
}

export class Create extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);

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
                pubsub.publish("@@form.init", {id: "CheckItemForm", data: modifyData});

            } else {
                pubsub.publish("@@message.error", "初始化获取编码失败!");
            }
        }.bind(this))

        pubsub.subscribe("type.onChange", (name, payload) => {
            //定性  59B01BE2490839D6E055000000000001;  定量   59B01BE2490839D6E055000000000002
            //console.log("name:", name)
            //console.log("payload:", payload)
            // pubsub.publish("@@form.change", { id: "detail", name: "actualQty", value: payload })
            if (payload == '59B01BE2490839D6E055000000000001') {
                pubsub.publish("AddLineBtnInCheckItemCreatePage.enabled", true)
                pubsub.publish("CheckItemOptionTable.activateAll", true)
            } else if (payload == '59B01BE2490839D6E055000000000002') {
                pubsub.publish("AddLineBtnInCheckItemCreatePage.enabled", false)
                pubsub.publish("CheckItemOptionTable.activateAll", false)

                //定量时,清空检测项表
                resolveFetch({
                    fetch: {
                        id: "CheckItemForm",
                        data: "@@formValues"
                    }
                }).then(function (data) {
                    data.CheckItemOptions = null
                    pubsub.publish("@@form.init", {id: "CheckItemForm", data: data});
                })

            }
        })

        // //保存
        // pubsub.subscribe("CheckItemCreat.save", () => {
        //     resolveFetch({
        //         fetch: {
        //             id: "CheckItemForm",
        //             data: "@@formValues"
        //         }
        //     }).then(function (data) {
        //         console.log("data", data)
        //         let dataSource = {
        //
        //
        //         }
        //
        //         resolveDataSource({
        //             dataSource: dataSource
        //         }).then(function (response) {
        //
        //             if (response.success) {
        //                 pubsub.publish("@@message.success", "保存成功!");
        //                 pubsub.publish("CancelBtnInQcItemPage.click")
        //             } else {
        //                 pubsub.publish("@@message.error", "保存失败!");
        //             }
        //         }.bind(this))
        //     })
        // })
    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>质量</Breadcrumb.Item>
                    <Breadcrumb.Item>质检项目</Breadcrumb.Item>
                    <Breadcrumb.Item>质检项目详情</Breadcrumb.Item>
                </Breadcrumb>
                <div className="wrapper">

                    <Row>
                        <Card bordered={true}
                              style={{
                                  width: "100%",
                                  marginRight: "20px",
                                  marginTop: "20px",
                                  minHeight: "20px",
                                  "backgroundColor": "rgba(247, 247, 247, 1)"
                              }}
                              bodyStyle={{padding: "15px"}}>

                            <Col span={8} xs={24}>
                                <AppButton config={{
                                    id: "SaveBtnInQcItemPage",
                                    title: "保存",
                                    type: "primary",
                                    size: "large",
                                    visible: true,
                                    enabled: true,
                                    subscribes: [
                                        {
                                            event: "SaveBtnInQcItemPage.click",
                                            /*pubs:[
                                              {
                                                event: "SaveBtnInQcItemPage.enabled",
                                                payload:false
                                              }
                                            ],*/
                                            behaviors:[
                                              {
                                                type:"request",
                                                dataSource:{
                                                  type: "api",
                                                  method: "POST",
                                                  url: "/ime/imeQcQualityCheckitem/save.action",
                                                  withForm:"CheckItemForm"
                                                },
                                                successPubs:[
                                                  {
                                                    event:"@@message.success",
                                                    payload:"保存成功"
                                                  },
                                                  {
                                                    event: "@@navigator.push",
                                                    payload: {
                                                      url: "/imeQualityInspectionItems"
                                                    }
                                                  }
                                                ],
                                                errorPubs:[
                                                  {
                                                    event:"@@message.error",
                                                    payload:"保存失败"
                                                  }
                                                ]
                                              }
                                            ]
                                        }
                                    ]
                                }}/>
                                <AppButton config={{
                                    id: "CancelBtnInQcItemPage",
                                    title: "取消",
                                    type: "primary",
                                    size: "large",
                                    visible: true,
                                    enabled: true,
                                    subscribes: [
                                        {
                                            event: "CancelBtnInQcItemPage.click",
                                            pubs: [
                                                {
                                                    event: "@@navigator.push",
                                                    payload: {
                                                        url: "/imeQualityInspectionItems"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }}/>
                            </Col>
                        </Card>
                    </Row>
                    <Card style={{width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px"}}
                          bodyStyle={{padding: "15px"}}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="基本信息" key="1">
                                <Card style={{width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px"}}
                                      bodyStyle={{padding: "15px"}}>
                                    <Row>
                                        <Col span={8}>
                                            <Field config={{
                                                form: "CheckItemForm",
                                                enabled: false,
                                                id: "code",
                                                label: "检验项目编码",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                showRequiredStar: true,  //是否显示必填星号
                                                placeholder: "请输入编码"
                                            }} component={TextField} name="code"/>
                                        </Col>
                                        <Col span={8}>
                                            <Field config={{
                                                enabled: true,
                                                form: "CheckItemForm",
                                                id: "name",
                                                label: "检验项目名称",
                                                placeholder: "请输入名称",
                                                showRequiredStar: true,
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            }} component={TextField} name="name"/>
                                        </Col>
                                        <Col span={8}>
                                            <Field config={{
                                                id: "type",
                                                form: "CheckItemForm",
                                                label: "检验项目类型",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                placeholder: "请选择",
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
                                                valueField: "gid",
                                            }} component={SelectField} name="type"/>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col span={8}>
                                            <Field config={{
                                                enabled: true,
                                                id: "mdDefOperationGid",
                                                form: "CheckItemForm",
                                                label: "工序编码",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                showRequiredStar: true,  //是否显示必填星号
                                                placeholder: "请选择工序编码",
                                                tableInfo: {
                                                    id: "mdDefOperationGidRefFindBackTableInCheckItemCreatPage",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: 300,
                                                    tableTitle: "工序档案",
                                                    columns: [
                                                        {
                                                            title: '工序编码',
                                                            dataIndex: 'mdDefOperationCode',
                                                            key: '1',
                                                            width: 100
                                                        },
                                                        {
                                                            title: '工序名称',
                                                            dataIndex: 'mdDefOperationName',
                                                            key: '2',
                                                            width: 100
                                                        },
                                                        {
                                                            title: '工序类型',
                                                            dataIndex: 'mdDefOperationTypeName',
                                                            key: '3',
                                                            width: 100
                                                        },
                                                        {
                                                            title: '工作中心',
                                                            dataIndex: 'mdFactoryWorkCenterGidRef.workCenterName',
                                                            key: '4',
                                                            width: 100
                                                        },
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/ime/mdDefOperation/query.action',
                                                    }
                                                },
                                                pageId: 'FindBackTablePageInCheckItemCreatPage',
                                                displayField: "mdDefOperationCode",
                                                valueField: {
                                                    "from": "gid",
                                                    "to": "mdDefOperationGid"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "mdDefOperationName",
                                                        "to": "mdDefOperationName"
                                                    }
                                                ]
                                            }} component={FindbackField} name="mdDefOperationGid"/>
                                        </Col>
                                        <Col span={8}>
                                            <Field config={{
                                                enabled: false,
                                                form: "CheckItemForm",
                                                id: "mdDefOperationName ",
                                                label: "工序名称",
                                                placeholder: "",
                                                showRequiredStar: true,
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            }} component={TextField} name="mdDefOperationName"/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8}>
                                            <Field config={{
                                                enabled: true,
                                                form: "CheckItemForm",
                                                id: "remark",
                                                label: "备注",
                                                placeholder: "请输入备注",
                                                showRequiredStar: true,
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            }} component={TextAreaField} name="remark"/>
                                        </Col>
                                    </Row>
                                </Card>
                            </TabPane>
                        </Tabs>
                    </Card>

                    <Card style={{width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px"}}
                          bodyStyle={{padding: "15px"}}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="检测项" key="1">
                                <Card style={{width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px"}}
                                      bodyStyle={{padding: "15px"}}>
                                    <AppButton config={{
                                        id: "AddLineBtnInCheckItemCreatePage",
                                        title: "增加",
                                        type: "primary",
                                        size: "small",
                                        visible: true,
                                        enabled: false,
                                        subscribes: [
                                            {
                                                event: "AddLineBtnInCheckItemCreatePage.click",
                                                pubs: [
                                                    {
                                                        event: "CheckItemOptionTable.addRow"
                                                    }
                                                ]
                                            },

                                        ]
                                    }}/>
                                    <FieldArray name="CheckItemOptions" config={{
                                        "id": "CheckItemOptionTable",
                                        "name": "CheckItemOptionTable",
                                        "form": "CheckItemForm",
                                        "rowKey": "gid",
                                        "addButton": false, //是否显示默认增行按钮
                                        "showSelect": true, //是否显示选择框
                                        "type": "checkbox", //表格单选（radio）复选（checkbox）类型
                                        "unEditable": true, //初始化是否都不可编辑
                                        "showRowDeleteButton": true,  //是否显示操作列
                                        "columns": [
                                            {
                                                "id": "name",
                                                "type": "textField",
                                                "title": "检测项",
                                                "name": "name",
                                            }, {
                                                "id": "remark",
                                                "type": "textField",
                                                "title": "备注",
                                                "name": "remark",
                                            }
                                        ]
                                    }} component={TableField}/>
                                </Card>
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
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
        onSubmit: () => {
            debugger
        }
    };
}

let Form = reduxForm({
    form: "CheckItemForm",
    validate,
    asyncValidate
})(Create)

export default connect(mapStateToProps, mapDispatchToProps)(Form);
