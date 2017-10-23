/*
 *
 * Modify 质检项目修改
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col ,Tabs} from 'antd';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'
import { Link } from 'react-router';

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
import UploadField from 'components/Form/UploadField'
import AppTable from 'components/AppTable';

import CoreComponent from 'components/CoreComponent'

import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
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

export class Modify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.init()

        pubsub.subscribe("type.onChange", (name, payload) => {
            //定性  59B01BE2490839D6E055000000000001;  定量   59B01BE2490839D6E055000000000002
            //console.log("name:", name)
            //console.log("payload:", payload)
            // pubsub.publish("@@form.change", { id: "detail", name: "actualQty", value: payload })
            if (payload == '59B01BE2490839D6E055000000000001') {
                pubsub.publish("AddLineBtnInCheckItemModifyPage.enabled", true)
                pubsub.publish("CheckItemOptions.activateAll", true)
            } else if (payload == '59B01BE2490839D6E055000000000002') {
                pubsub.publish("AddLineBtnInCheckItemModifyPage.enabled", false)
                pubsub.publish("CheckItemOptions.activateAll", false)
            }
        })
    }

    componentDidMount() {
        let formData = this.props.location.state[0]

        //console.log("回显的值", formData)
        //回显,根据定量和定性来,设置Tab和增行按钮
        if(formData.type&&formData.type=='59B01BE2490839D6E055000000000001'){
            pubsub.publish("AddLineBtnInCheckItemModifyPage.enabled", true)
            pubsub.publish("CheckItemOptions.activateAll", true)
        }else{
            pubsub.publish("AddLineBtnInCheckItemModifyPage.enabled", false)
            pubsub.publish("CheckItemOptions.activateAll", false)
        }
    }

    init(){

        let formData = this.props.location.state[0]


        //查询calendarRuleDetail 列表初始化表单
        let dataSource = {
            type: 'api',
            method: 'post',
            mode: "payload",
            url: '/ime/imeQcCheckitemOption/query.action',
            payload: {
                "query": {
                    "query": [
                        {
                            "field": "imeQcQualityCheckitemGid",
                            "type": "eq",
                            "value": formData.gid
                        }
                    ]
                }
            }

        }

        resolveDataSource({
            dataSource: dataSource
        }).then(function (response) {
            if (response.success) {
                //console.log("response.data", response.data)

                formData.CheckItemOptions = response.data
                //console.log("formData", formData)
                pubsub.publish("@@form.init", {id: "CheckItemFormInModify", data: Immutable.fromJS(formData)})
            } else {
                pubsub.publish("@@message.error", "初始化失败!");
            }
        }.bind(this))


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
                                    id: "SaveBtnInQcItemPageInModify",
                                    title: "保存",
                                    type: "primary",
                                    size: "large",
                                    visible: true,
                                    enabled: true,
                                    subscribes: [
                                        {
                                            event: "SaveBtnInQcItemPageInModify.click",
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
                                                        withForm:"CheckItemFormInModify"
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
                                    id: "CancelBtnInQcItemPageModify",
                                    title: "取消",
                                    type: "primary",
                                    size: "large",
                                    visible: true,
                                    enabled: true,
                                    subscribes: [
                                        {
                                            event: "CancelBtnInQcItemPageModify.click",
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
                                                form: "CheckItemFormInModify",
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
                                                form: "CheckItemFormInModify",
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
                                                form: "CheckItemFormInModify",
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
                                                id: "mdDefOperationGidRef.code",
                                                form: "CheckItemFormInModify",
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
                                                        {title: '工序编码',dataIndex: 'mdDefOperationCode', key: '1', width: 100},
                                                        {title: '工序名称', dataIndex: 'mdDefOperationName', key: '2', width: 100},
                                                        {title: '工序类型', dataIndex: 'mdDefOperationTypeName', key: '3', width: 100},
                                                        {title: '工作中心', dataIndex: 'mdFactoryWorkCenterGidRef.workCenterName', key: '4', width: 100},
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/ime/mdDefOperation/query.action',
                                                    }
                                                },
                                                pageId: 'FindBackTablePageInCheckItemCreatPage',
                                                displayField: "mdDefOperationGidRef.code",
                                                valueField: {
                                                    "from": "mdDefOperationCode",
                                                    "to": "mdDefOperationGidRef.code"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from":"gid",
                                                        "to":"mdDefOperationGid"
                                                    },
                                                    {
                                                        "from":"mdDefOperationCode",
                                                        "to":"mdDefOperationGidRef.code"
                                                    },
                                                    {
                                                        "from": "mdDefOperationName",
                                                        "to": "mdDefOperationGidRef.name"
                                                    }
                                                ]
                                            }} component={FindbackField} name="mdDefOperationGidRef.code"/>
                                        </Col>
                                        <Col span={8}>
                                            <Field config={{
                                                enabled: false,
                                                form: "CheckItemFormInModify",
                                                id: "mdDefOperationGidRef.name ",
                                                label: "工序名称",
                                                placeholder: "",
                                                showRequiredStar: true,
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            }} component={TextField} name="mdDefOperationGidRef.name"/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8}>
                                            <Field config={{
                                                enabled: true,
                                                form: "CheckItemFormInModify",
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
                                        id: "AddLineBtnInCheckItemModifyPage",
                                        title: "增加",
                                        type: "primary",
                                        size: "small",
                                        visible: true,
                                        enabled: true,
                                        subscribes: [
                                            {
                                                event: "AddLineBtnInCheckItemModifyPage.click",
                                                pubs: [
                                                    {
                                                        event: "CheckItemOptions.addRow"
                                                    }
                                                ]
                                            },

                                        ]
                                    }}/>


                                    <FieldArray name="CheckItemOptions" config={{
                                        "id": "CheckItemOptions",
                                        "name": "CheckItemOptions",
                                        "form": "CheckItemFormInModify",
                                        "rowKey": "gid",
                                        "addButton": false, //是否显示默认增行按钮
                                        "showSelect": true, //是否显示选择框
                                        "type": "checkbox", //表格单选（radio）复选（checkbox）类型
                                        "unEditable": false, //初始化是否都不可编辑
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


let Form = reduxForm({
    form: "CheckItemFormInModify",
    validate
})(Modify)

export default connect(mapStateToProps, mapDispatchToProps)(Form)
