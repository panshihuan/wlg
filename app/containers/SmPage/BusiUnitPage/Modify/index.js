/*
 *
 * 业务单元修改页面
 *
 */

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
import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'

const TabPane = Tabs.TabPane;


const validate = values => {
    const errors = {}
    if (!values.get('busiUnitCode')) {
        errors.busiUnitCode = '必填项'
    }
    if (!values.get('busiUnitName')) {
        errors.busiUnitName = '必填项'
    }
    return errors
}


class BusiUnitModify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    id = "";
    modifyData = {};

    constructor(props) {
        super(props);
        this.state = {
            selectValue: []
        }
        pubsub.subscribe("planNum2.onChange", (name, payload) => {
            pubsub.publish("@@form.change", {id: "BusiUnitForm", name: "actualQty", value: payload})
        })
        //debugger
        let modifyId = this.props.location.state[0].gid;
        this.id = modifyId;
        let data = [];
        let dataSource0 = {
            type: 'api',
            method: 'post',
            url: '/sm/busiUnitFunc/queryFunc.action?smBusiUnitGid=' + modifyId
        }

        resolveDataSource({
            dataSource: dataSource0
        }).then(function (response) {
            debugger
            if (response.success) {

                //给下拉框赋值
                data = response.data;
                if (data.length > 0) {
                    //console.log("初始化", data);
                    this.setState({
                        selectValue: data
                    })
                }
            }

        }.bind(this))

        let dataSource = {
            type: 'api',
            method: 'post',
            url: '/sm/busiUnit/findById.action?id=' + modifyId
        }

        resolveDataSource({
            dataSource: dataSource
        }).then(function (response) {
            debugger
            if (response.success) {
                this.modifyData = response.data;
            } else {
                this.modifyData = this.props.location.state[0];
            }
            this.modifyData.funcGid = data;
            //表单初始化渲染
            pubsub.publish("@@form.init", {id: "BusiUnitForm", data: Immutable.fromJS(this.modifyData)})

            //渲染查找带回显示值
            if (this.modifyData.parentGidRef) {
                pubsub.publish("parentGid.setDisplayValue", this.modifyData.parentGidRef.busiUnitName)
            }

            if (this.modifyData.busiUnitFunc1 && this.modifyData.busiUnitFunc1.smBusiUnitFuncGidRef) {
                pubsub.publish("busiUnitFunc1.smBusiUnitFuncGid.setDisplayValue", this.modifyData.busiUnitFunc1.smBusiUnitFuncGidRef.busiUnitName)
            }
            if (this.modifyData.busiUnitFunc2 && this.modifyData.busiUnitFunc2.smBusiUnitFuncGidRef) {
                pubsub.publish("busiUnitFunc2.smBusiUnitFuncGid.setDisplayValue", this.modifyData.busiUnitFunc2.smBusiUnitFuncGidRef.busiUnitName)
            }
            if (this.modifyData.busiUnitFunc3 && this.modifyData.busiUnitFunc3.smBusiUnitFuncGidRef) {
                pubsub.publish("busiUnitFunc3.smBusiUnitFuncGid.setDisplayValue", this.modifyData.busiUnitFunc3.smBusiUnitFuncGidRef.busiUnitName)
            }
            if (this.modifyData.busiUnitFunc4 && this.modifyData.busiUnitFunc4.smBusiUnitFuncGidRef) {
                pubsub.publish("busiUnitFunc4.smBusiUnitFuncGid.setDisplayValue", this.modifyData.busiUnitFunc4.smBusiUnitFuncGidRef.busiUnitName)
            }
            if (this.modifyData.busiUnitFunc5 && this.modifyData.busiUnitFunc5.smBusiUnitFuncGidRef) {
                pubsub.publish("busiUnitFunc5.smBusiUnitFuncGid.setDisplayValue", this.modifyData.busiUnitFunc5.smBusiUnitFuncGidRef.busiUnitName)
            }
            if (this.modifyData.busiUnitFunc6 && this.modifyData.busiUnitFunc6.smBusiUnitFuncGidRef) {
                pubsub.publish("busiUnitFunc6.smBusiUnitFuncGid.setDisplayValue", this.modifyData.busiUnitFunc6.smBusiUnitFuncGidRef.busiUnitName)
            }
            if (this.modifyData.busiUnitFunc7 && this.modifyData.busiUnitFunc7.smBusiUnitFuncGidRef) {
                pubsub.publish("busiUnitFunc7.smBusiUnitFuncGid.setDisplayValue", this.modifyData.busiUnitFunc7.smBusiUnitFuncGidRef.busiUnitName)
            }
            if (this.modifyData.busiUnitFunc8 && this.modifyData.busiUnitFunc8.smBusiUnitFuncGidRef) {
                pubsub.publish("busiUnitFunc8.smBusiUnitFuncGid.setDisplayValue", this.modifyData.busiUnitFunc8.smBusiUnitFuncGidRef.busiUnitName)
            }

        }.bind(this))


    }


    componentDidMount() {
        pubsub.subscribe("funcGid.onChange", (name, value) => {

            resolveFetch({fetch: {id: "BusiUnitForm", data: "@@formValues"}}).then(function (formValue) {
                if (value.indexOf("55E4572C74781206E055000000000001") == -1) {
                    if (formValue.busiUnitFunc1) {
                        formValue.busiUnitFunc1.smBusiUnitFuncGid = '';
                        formValue.busiUnitFunc1.active = false;
                    }
                } else if (value.indexOf("55E4572C74781206E055000000000002") == -1) {
                    if (formValue.busiUnitFunc2) {
                        formValue.busiUnitFunc2.smBusiUnitFuncGid = '';
                        formValue.busiUnitFunc2.active = false;
                    }
                } else if (value.indexOf("55E4572C74781206E055000000000003") == -1) {
                    if (formValue.busiUnitFunc3) {
                        formValue.busiUnitFunc3.smBusiUnitFuncGid = '';
                        formValue.busiUnitFunc3.active = false;
                    }
                } else if (value.indexOf("55E4572C74781206E055000000000004") == -1) {
                    if (formValue.busiUnitFunc4) {
                        formValue.busiUnitFunc4.smBusiUnitFuncGid = '';
                        formValue.busiUnitFunc4.active = false;
                    }
                } else if (value.indexOf("55E4572C74781206E055000000000005") == -1) {
                    if (formValue.busiUnitFunc5) {
                        formValue.busiUnitFunc5.smBusiUnitFuncGid = '';
                        formValue.busiUnitFunc5.active = false;
                    }
                } else if (value.indexOf("55E4572C74781206E055000000000006") == -1) {
                    if (formValue.busiUnitFunc6) {
                        formValue.busiUnitFunc6.smBusiUnitFuncGid = '';
                        formValue.busiUnitFunc6.active = false;
                    }
                } else if (value.indexOf("55E480B94B1D121FE055000000000001") == -1) {
                    if (formValue.busiUnitFunc7) {
                        formValue.busiUnitFunc7.smBusiUnitFuncGid = '';
                        formValue.busiUnitFunc7.active = false;
                    }
                } else if (value.indexOf("55E480B94B1E121FE055000000000001") == -1) {
                    if (formValue.busiUnitFunc8) {
                        formValue.busiUnitFunc8.smBusiUnitFuncGid = '';
                        formValue.busiUnitFunc8.active = false;
                    }
                }
                pubsub.publish("@@form.init", {id: "BusiUnitForm", data: formValue});
            });

            this.setState({
                selectValue: value
            })
        })
    }

    componentWillUnmount() {
        pubsub.unsubscribe("funcGid.onChange");
    }

    render() {
        const {selectValue} = this.state;
        return (
            <div>
                <Breadcrumb className="breadcrumb" separator=">">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>业务单元</Breadcrumb.Item>
                    <Breadcrumb.Item>修改</Breadcrumb.Item>
                </Breadcrumb>
                <div className="wrapper">
                    <Card style={{width: "100%", backgroundColor: "#f9f9f9"}} bodyStyle={{padding: "15px"}}>
                        <Row>
                            <Col>
                                <AppButton config={{
                                    id: "saveBtn",
                                    title: "保存",
                                    visible: true,
                                    enabled: true,
                                    type: "primary",
                                    subscribes: [
                                        {
                                            event: "saveBtn.click",
                                            pubs:
                                                [
                                                    {
                                                        event: "saveBtn.expression",
                                                        meta: {
                                                            expression: `
                                                               resolveFetch({fetch:{id:"BusiUnitForm",data:"@@formValues"}}).then(function (value) {

                                                                    let  formValue = value;
                                                                    let funcGids = formValue.funcGid;

                                                                    //console.log(formValue);
                                                                    if (funcGids&&funcGids.indexOf('55E4572C74781206E055000000000001') != -1) {
                                                                        if(formValue.busiUnitFunc1){
                                                                            formValue.busiUnitFunc1.smBusiUnitGid = formValue.gid;
                                                                            formValue.busiUnitFunc1.funcGid = '55E4572C74781206E055000000000001';
                                                                        }else{
                                                                            var busiUnitFunc1 = {};
                                                                            busiUnitFunc1.smBusiUnitGid = formValue.gid;
                                                                            busiUnitFunc1.funcGid = '55E4572C74781206E055000000000001';
                                                                            formValue.busiUnitFunc1 = busiUnitFunc1;
                                                                        }
                                                                    } else {
                                                                        if (formValue.busiUnitFunc1) {
                                                                            formValue.busiUnitFunc1 = null;
                                                                        }
                                                                    }

                                                                    if (funcGids&&funcGids.indexOf('55E4572C74781206E055000000000002') != -1) {
                                                                        if(formValue.busiUnitFunc2){
                                                                            formValue.busiUnitFunc2.smBusiUnitGid = formValue.gid;
                                                                            formValue.busiUnitFunc2.funcGid = '55E4572C74781206E055000000000002';
                                                                        }else{
                                                                            var busiUnitFunc2 = {};
                                                                            busiUnitFunc2.smBusiUnitGid = formValue.gid;
                                                                            busiUnitFunc2.funcGid = '55E4572C74781206E055000000000002';
                                                                            formValue.busiUnitFunc2 = busiUnitFunc2;
                                                                        }

                                                                    } else {
                                                                        if (formValue.busiUnitFunc2) {
                                                                            formValue.busiUnitFunc2 = null;
                                                                        }
                                                                    }

                                                                    if (funcGids&&funcGids.indexOf('55E4572C74781206E055000000000003') != -1) {

                                                                        if(formValue.busiUnitFunc3){
                                                                            formValue.busiUnitFunc3.smBusiUnitGid = formValue.gid;
                                                                            formValue.busiUnitFunc3.funcGid = '55E4572C74781206E055000000000002';
                                                                        }else{
                                                                            var busiUnitFunc3 = {};
                                                                            busiUnitFunc3.smBusiUnitGid = formValue.gid;
                                                                            busiUnitFunc3.funcGid = '55E4572C74781206E055000000000003';
                                                                            formValue.busiUnitFunc3 = busiUnitFunc3;
                                                                        }


                                                                    } else {
                                                                        if (formValue.busiUnitFunc3) {
                                                                            formValue.busiUnitFunc3 = null;
                                                                        }
                                                                    }

                                                                    if (funcGids&&funcGids.indexOf('55E4572C74781206E055000000000004') != -1) {
                                                                        if(formValue.busiUnitFunc4){
                                                                            formValue.busiUnitFunc4.smBusiUnitGid = formValue.gid;
                                                                            formValue.busiUnitFunc4.funcGid = '55E4572C74781206E055000000000004';
                                                                        }else{
                                                                            var busiUnitFunc4 = {};
                                                                            busiUnitFunc4.smBusiUnitGid = formValue.gid;
                                                                            busiUnitFunc4.funcGid = '55E4572C74781206E055000000000004';
                                                                            formValue.busiUnitFunc4 = busiUnitFunc4;
                                                                        }

                                                                    } else {
                                                                        if (formValue.busiUnitFunc4) {
                                                                            formValue.busiUnitFunc4 = null;
                                                                        }
                                                                    }

                                                                    if (funcGids&&funcGids.indexOf('55E4572C74781206E055000000000005') != -1) {

                                                                        if(formValue.busiUnitFunc5){
                                                                            formValue.busiUnitFunc5.smBusiUnitGid = formValue.gid;
                                                                            formValue.busiUnitFunc5.funcGid = '55E4572C74781206E055000000000005';
                                                                        }else{
                                                                            var busiUnitFunc5 = {};
                                                                            busiUnitFunc5.smBusiUnitGid = formValue.gid;
                                                                            busiUnitFunc5.funcGid = '55E4572C74781206E055000000000005';
                                                                            formValue.busiUnitFunc5 = busiUnitFunc5;
                                                                        }


                                                                    } else {
                                                                        if (formValue.busiUnitFunc5) {
                                                                            formValue.busiUnitFunc5 = null;
                                                                        }
                                                                    }

                                                                    if (funcGids&&funcGids.indexOf('55E4572C74781206E055000000000006') != -1) {

                                                                        if(formValue.busiUnitFunc6){
                                                                            formValue.busiUnitFunc6.smBusiUnitGid = formValue.gid;
                                                                            formValue.busiUnitFunc6.funcGid = '55E4572C74781206E055000000000006';
                                                                        }else{
                                                                            var busiUnitFunc6 = {};
                                                                            busiUnitFunc6.smBusiUnitGid = formValue.gid;
                                                                            busiUnitFunc6.funcGid = '55E4572C74781206E055000000000006';
                                                                            formValue.busiUnitFunc6 = busiUnitFunc6;
                                                                        }

                                                                    } else {
                                                                        if (formValue.busiUnitFunc6) {
                                                                            formValue.busiUnitFunc6 = null;
                                                                        }
                                                                    }

                                                                    if (funcGids&&funcGids.indexOf('55E480B94B1D121FE055000000000001') != -1) {
                                                                        if(formValue.busiUnitFunc7){
                                                                            formValue.busiUnitFunc7.smBusiUnitGid = formValue.gid;
                                                                            formValue.busiUnitFunc7.funcGid = '55E480B94B1D121FE055000000000001';
                                                                        }else{
                                                                            var busiUnitFunc7 = {};
                                                                            busiUnitFunc7.smBusiUnitGid = formValue.gid;
                                                                            busiUnitFunc7.funcGid = '55E480B94B1D121FE055000000000001';
                                                                            formValue.busiUnitFunc7 = busiUnitFunc7;
                                                                        }
                                                                    } else {
                                                                        if (formValue.busiUnitFunc7) {
                                                                            formValue.busiUnitFunc7 = null;
                                                                        }
                                                                    }

                                                                    if (funcGids&&funcGids.indexOf('55E480B94B1E121FE055000000000001') != -1) {
                                                                        if(formValue.busiUnitFunc8){
                                                                            formValue.busiUnitFunc8.smBusiUnitGid = formValue.gid;
                                                                            formValue.busiUnitFunc8.funcGid = '55E480B94B1E121FE055000000000001';
                                                                        }else{
                                                                            var busiUnitFunc8 = {};
                                                                            busiUnitFunc8.smBusiUnitGid = formValue.gid;
                                                                            busiUnitFunc8.funcGid = '55E480B94B1E121FE055000000000001';
                                                                            formValue.busiUnitFunc8 = busiUnitFunc8;
                                                                        }


                                                                    } else {
                                                                        if (formValue.busiUnitFunc8) {
                                                                            formValue.busiUnitFunc8 = null;
                                                                        }
                                                                    }

                                                                    //console.log("表达式调试");
                                                                    //console.log(formValue);

                                                                    let dataSource= {
                                                                      type: "api",
                                                                      mode:"dataContext",
                                                                      method: "POST",
                                                                      url: "/sm/busiUnit/modify.action?id=" + formValue.gid
                                                                    };

                                                                    let onSuccess = function(response){
                                                                        if(response.success){
                                                                            pubsub.publish("@@message.success","操作成功");
                                                                            pubsub.publish("@@navigator.push", {url: "/busiUnit"});
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
                                }}></AppButton>
                                <AppButton config={{
                                    id: "cancelBtn",
                                    title: "取消",
                                    visible: true,
                                    enabled: true,
                                    type: "primary",
                                    subscribes: [
                                        {
                                            event: "cancelBtn.click",
                                            pubs: [
                                                {
                                                    event: "@@navigator.push",
                                                    payload: {
                                                        url: "/busiUnit"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }}></AppButton>
                            </Col>
                        </Row>
                    </Card>
                    <Card bordered={true} style={{marginTop: "20px"}}>
                        <Row>
                            <Col span={12}>
                                <Field config={{
                                    enabled: true,
                                    form: "BusiUnitForm",
                                    id: "busiUnitCode",
                                    label: "业务单元编码",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                                    showRequiredStar: true,  //是否显示必填星号
                                    placeholder: "请输入编码"
                                }} component={TextField} name="busiUnitCode"/>
                            </Col>
                            <Col span={12}>
                                <Field config={{
                                    enabled: true,
                                    id: "busiUnitName",
                                    label: "业务单元名称",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                                    showRequiredStar: true,  //是否显示必填星号
                                    placeholder: "请输入业务单元名称"
                                }} component={TextField} name="busiUnitName"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Field config={{
                                    enabled: true,
                                    id: "abbreviate",
                                    label: "简称",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                                    showRequiredStar: false,  //是否显示必填星号
                                    placeholder: "请输入简称"
                                }} component={TextField} name="abbreviate"/>
                            </Col>
                            <Col span={12}>
                                <Field config={{
                                    enabled: true,
                                    id: "mobile",
                                    label: "电话",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                                    placeholder: "请输入电话"
                                }} component={TextField} name="mobile"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Field config={{
                                    enabled: true,
                                    id: "parentGid",
                                    form: "BusiUnitForm",
                                    label: "上级业务单元",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                                    showRequiredStar: false,  //是否显示必填星号
                                    placeholder: "请选择业务单元",
                                    tableInfo: {
                                        id: "parentGidFindBackTable",
                                        size: "small",
                                        rowKey: "gid",
                                        width: "500",
                                        tableTitle: "上级业务单元",
                                        columns: [
                                            {title: '业务单元名称', dataIndex: 'busiUnitName', key: '2', width: 200},
                                            {title: '业务单元编码', dataIndex: 'busiUnitCode', key: '1', width: 200}
                                        ],
                                        dataSource: {
                                            type: 'api',
                                            method: 'post',
                                            url: '/sm/busiUnit/queryFindBack.action?id=' + this.id
                                        }
                                    },
                                    pageId: 'parentGidFindBackTablePage',
                                    displayField: "busiUnitName",
                                    valueField: {
                                        "from": "gid",
                                        "to": "parentGid"
                                    },
                                    associatedFields: [
                                        /*{
                                            "from": "busiUnitCode",
                                            "to": "abbreviate"
                                        }*/
                                    ]


                                }} component={FindbackField} name="parentGid"/>
                            </Col>
                            <Col span={12}>
                                <Field config={{
                                    enabled: true,
                                    id: "active",
                                    label: "是否启用",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                                    checkedChildren: '是',
                                    unCheckedChildren: '否'
                                }} component={SwitchField} name="active"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Field config={{
                                    enabled: true,
                                    id: "descr",
                                    label: "说明",  //标签名称
                                    labelSpan: 4,   //标签栅格比例（0-24）
                                    wrapperSpan: 20,  //输入框栅格比例（0-24）
                                    showRequiredStar: false,  //是否显示必填星号
                                    placeholder: "请输入编码"
                                }} component={TextAreaField} name="descr"/>
                            </Col>

                        </Row>
                        <Row>
                            <Col span={24}>
                                <Field config={{
                                    enabled: true,
                                    id: "funcGid",
                                    label: "所属职能",  //标签名称
                                    labelSpan: 4,   //标签栅格比例（0-24）
                                    wrapperSpan: 20,  //输入框栅格比例（0-24）
                                    showRequiredStar: false,  //是否显示必填星号
                                    placeholder: "请选择职能",
                                    valueField: 'gid',//实际值字段名
                                    displayField: 'val',//显示值字段名
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        mode: 'payload',
                                        url: '/sm/dictionaryEnumValue/query.action',
                                        payload: {
                                            "query": {
                                                "query": [{
                                                    "field": "smDictionaryEnumGid",
                                                    "type": "eq",
                                                    "value": "5625H5482846019FE055000000000001"
                                                }], "sorted": "seq"
                                            }
                                        }
                                    }, subscribes: [
                                        {
                                            event: "funcGid.onChange",
                                            pubs:
                                                [
                                                    {
                                                        //event: "saveBtn.enabled",
                                                        //payload: false
                                                    }
                                                ]
                                        }

                                    ]
                                }} component={CheckBoxField} name="funcGid"/>
                            </Col>

                        </Row>
                        <Row>
                            <Tabs id="tabPane" type="card">
                                {selectValue.indexOf("55E4572C74781206E055000000000001") != -1 &&
                                <TabPane tab="法人" key="55E4572C74781206E055000000000001" id="tab1">
                                    <Row>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                id: "busiUnitFunc1.smBusiUnitFuncGid",
                                                form: "BusiUnitForm",
                                                label: "上级职能业务单元",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                showRequiredStar: false,  //是否显示必填星号
                                                placeholder: "请选择业务单元",
                                                tableInfo: {
                                                    id: "busiUnitFunc1FindBackTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "上级业务单元",
                                                    columns: [
                                                        {
                                                            title: '业务单元名称',
                                                            dataIndex: 'busiUnitName',
                                                            key: '2',
                                                            width: 200
                                                        },
                                                        {
                                                            title: '业务单元编码',
                                                            dataIndex: 'busiUnitCode',
                                                            key: '1',
                                                            width: 200
                                                        }
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/busiUnit/queryFindBack.action?id=' + this.id + '&funcGid=55E4572C74781206E055000000000001'
                                                    }
                                                },
                                                pageId: 'busiUnitFunc1FindBackTablePage',
                                                displayField: "busiUnitName",
                                                valueField: {
                                                    "from": "gid",
                                                    "to": "busiUnitFunc1.smBusiUnitFuncGid"
                                                }

                                            }} component={FindbackField} name="busiUnitFunc1.smBusiUnitFuncGid"/>
                                        </Col>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                form: "BusiUnitForm",
                                                id: "busiUnitFunc1.active",
                                                label: "是否启用",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                checkedChildren: "是",
                                                unCheckedChildren: "否"
                                            }} component={SwitchField}
                                                   name="busiUnitFunc1.active"/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                }
                                {selectValue.indexOf("55E4572C74781206E055000000000002") != -1 &&
                                <TabPane tab="行政" key="55E4572C74781206E055000000000002">
                                    <Row>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                id: "busiUnitFunc2.smBusiUnitFuncGid",
                                                form: "BusiUnitForm",
                                                label: "上级职能业务单元",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                showRequiredStar: false,  //是否显示必填星号
                                                placeholder: "请选择业务单元",
                                                tableInfo: {
                                                    id: "busiUnitFunc2FindBackTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "上级业务单元",
                                                    columns: [
                                                        {
                                                            title: '业务单元名称',
                                                            dataIndex: 'busiUnitName',
                                                            key: '2',
                                                            width: 200
                                                        },
                                                        {
                                                            title: '业务单元编码',
                                                            dataIndex: 'busiUnitCode',
                                                            key: '1',
                                                            width: 200
                                                        }
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/busiUnit/queryFindBack.action?id=' + this.id + '&funcGid=55E4572C74781206E055000000000002',
                                                    }
                                                },
                                                pageId: 'busiUnitFunc2FindBackTablePage',
                                                displayField: "busiUnitName",
                                                valueField: {
                                                    "from": "gid",
                                                    "to": "busiUnitFunc2.smBusiUnitFuncGid"
                                                }

                                            }} component={FindbackField} name="busiUnitFunc2.smBusiUnitFuncGid"/>
                                        </Col>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                form: "BusiUnitForm",
                                                id: "busiUnitFunc2.active",
                                                label: "是否启用",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                checkedChildren: "是",
                                                unCheckedChildren: "否"
                                            }} component={SwitchField}
                                                   name="busiUnitFunc2.active"/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                }
                                {selectValue.indexOf("55E4572C74781206E055000000000003") != -1 &&
                                <TabPane tab="库存" key="55E4572C74781206E055000000000003">
                                    <Row>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                id: "busiUnitFunc3.smBusiUnitFuncGid",
                                                form: "BusiUnitForm",
                                                label: "上级职能业务单元",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                showRequiredStar: false,  //是否显示必填星号
                                                placeholder: "请选择业务单元",
                                                tableInfo: {
                                                    id: "busiUnitFunc3FindBackTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "上级业务单元",
                                                    columns: [
                                                        {
                                                            title: '业务单元名称',
                                                            dataIndex: 'busiUnitName',
                                                            key: '2',
                                                            width: 200
                                                        },
                                                        {
                                                            title: '业务单元编码',
                                                            dataIndex: 'busiUnitCode',
                                                            key: '1',
                                                            width: 200
                                                        }
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/busiUnit/queryFindBack.action?id=' + this.id + '&funcGid=55E4572C74781206E055000000000003',
                                                    }
                                                },
                                                pageId: 'busiUnitFunc3FindBackTablePage',
                                                displayField: "busiUnitName",
                                                valueField: {
                                                    "from": "gid",
                                                    "to": "busiUnitFunc3.smBusiUnitFuncGid"
                                                }

                                            }} component={FindbackField} name="busiUnitFunc3.smBusiUnitFuncGid"/>
                                        </Col>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                form: "BusiUnitForm",
                                                id: "busiUnitFunc3.active",
                                                label: "是否启用",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                checkedChildren: "是",
                                                unCheckedChildren: "否"
                                            }} component={SwitchField}
                                                   name="busiUnitFunc3.active"/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                }
                                {selectValue.indexOf("55E4572C74781206E055000000000004") != -1 &&
                                <TabPane tab="物流" key="55E4572C74781206E055000000000004">
                                    <Row>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                id: "busiUnitFunc4.smBusiUnitFuncGid",
                                                form: "BusiUnitForm",
                                                label: "上级职能业务单元",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                showRequiredStar: false,  //是否显示必填星号
                                                placeholder: "请选择业务单元",
                                                tableInfo: {
                                                    id: "busiUnitFunc4FindBackTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "上级业务单元",
                                                    columns: [
                                                        {
                                                            title: '业务单元名称',
                                                            dataIndex: 'busiUnitName',
                                                            key: '2',
                                                            width: 200
                                                        },
                                                        {
                                                            title: '业务单元编码',
                                                            dataIndex: 'busiUnitCode',
                                                            key: '1',
                                                            width: 200
                                                        }
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/busiUnit/queryFindBack.action?id=' + this.id + '&funcGid=55E4572C74781206E055000000000004',
                                                    }
                                                },
                                                pageId: 'busiUnitFunc4FindBackTablePage',
                                                displayField: "busiUnitName",
                                                valueField: {
                                                    "from": "gid",
                                                    "to": "busiUnitFunc4.smBusiUnitFuncGid"
                                                }

                                            }} component={FindbackField} name="busiUnitFunc4.smBusiUnitFuncGid"/>
                                        </Col>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                form: "BusiUnitForm",
                                                id: "busiUnitFunc4.active",
                                                label: "是否启用",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                checkedChildren: "是",
                                                unCheckedChildren: "否"
                                            }} component={SwitchField}
                                                   name="busiUnitFunc4.active"/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                }
                                {selectValue.indexOf("55E4572C74781206E055000000000005") != -1 &&
                                <TabPane tab="质检" key="55E4572C74781206E055000000000005">
                                    <Row>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                id: "busiUnitFunc5.smBusiUnitFuncGid",
                                                form: "BusiUnitForm",
                                                label: "上级职能业务单元",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                showRequiredStar: false,  //是否显示必填星号
                                                placeholder: "请选择业务单元",
                                                tableInfo: {
                                                    id: "busiUnitFunc5FindBackTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "上级业务单元",
                                                    columns: [
                                                        {
                                                            title: '业务单元名称',
                                                            dataIndex: 'busiUnitName',
                                                            key: '2',
                                                            width: 200
                                                        },
                                                        {
                                                            title: '业务单元编码',
                                                            dataIndex: 'busiUnitCode',
                                                            key: '1',
                                                            width: 200
                                                        }
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/busiUnit/queryFindBack.action?id=' + this.id + '&funcGid=55E4572C74781206E055000000000005',
                                                    }
                                                },
                                                pageId: 'busiUnitFunc5FindBackTablePage',
                                                displayField: "busiUnitName",
                                                valueField: {
                                                    "from": "gid",
                                                    "to": "busiUnitFunc5.smBusiUnitFuncGid"
                                                }

                                            }} component={FindbackField} name="busiUnitFunc5.smBusiUnitFuncGid"/>
                                        </Col>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                form: "BusiUnitForm",
                                                id: "busiUnitFunc5.active",
                                                label: "是否启用",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                checkedChildren: "是",
                                                unCheckedChildren: "否"
                                            }} component={SwitchField}
                                                   name="busiUnitFunc5.active"/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                }
                                {selectValue.indexOf("55E4572C74781206E055000000000006") != -1 &&
                                <TabPane tab="工厂" key="55E4572C74781206E055000000000006">
                                    <Row>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                id: "busiUnitFunc6.smBusiUnitFuncGid",
                                                form: "BusiUnitForm",
                                                label: "上级职能业务单元",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                showRequiredStar: false,  //是否显示必填星号
                                                placeholder: "请选择业务单元",
                                                tableInfo: {
                                                    id: "busiUnitFunc6FindBackTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "上级业务单元",
                                                    columns: [
                                                        {
                                                            title: '业务单元名称',
                                                            dataIndex: 'busiUnitName',
                                                            key: '2',
                                                            width: 200
                                                        },
                                                        {
                                                            title: '业务单元编码',
                                                            dataIndex: 'busiUnitCode',
                                                            key: '1',
                                                            width: 200
                                                        }
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/busiUnit/queryFindBack.action?id=' + this.id + '&funcGid=55E4572C74781206E055000000000006',
                                                    }
                                                },
                                                pageId: 'busiUnitFunc6FindBackTablePage',
                                                displayField: "busiUnitName",
                                                valueField: {
                                                    "from": "gid",
                                                    "to": "busiUnitFunc6.smBusiUnitFuncGid"
                                                }

                                            }} component={FindbackField} name="busiUnitFunc6.smBusiUnitFuncGid"/>
                                        </Col>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                form: "BusiUnitForm",
                                                id: "busiUnitFunc6.active",
                                                label: "是否启用",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                checkedChildren: "是",
                                                unCheckedChildren: "否"
                                            }} component={SwitchField}
                                                   name="busiUnitFunc6.active"/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                }
                                {selectValue.indexOf("55E480B94B1D121FE055000000000001") != -1 &&
                                <TabPane tab="计划" key="55E480B94B1D121FE055000000000001">
                                    <Row><Col span={12}>
                                        <Field config={{
                                            enabled: true,
                                            id: "busiUnitFunc7.smBusiUnitFuncGid",
                                            form: "BusiUnitForm",
                                            label: "上级职能业务单元",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            showRequiredStar: false,  //是否显示必填星号
                                            placeholder: "请选择业务单元",
                                            tableInfo: {
                                                id: "busiUnitFunc7FindBackTable",
                                                size: "small",
                                                rowKey: "gid",
                                                width: "500",
                                                tableTitle: "上级业务单元",
                                                columns: [
                                                    {
                                                        title: '业务单元名称',
                                                        dataIndex: 'busiUnitName',
                                                        key: '2',
                                                        width: 200
                                                    },
                                                    {
                                                        title: '业务单元编码',
                                                        dataIndex: 'busiUnitCode',
                                                        key: '1',
                                                        width: 200
                                                    }
                                                ],
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'post',
                                                    url: '/sm/busiUnit/queryFindBack.action?id=' + this.id + '&funcGid=55E480B94B1D121FE055000000000001',
                                                }
                                            },
                                            pageId: 'busiUnitFunc7FindBackTablePage',
                                            displayField: "busiUnitName",
                                            valueField: {
                                                "from": "gid",
                                                "to": "busiUnitFunc7.smBusiUnitFuncGid"
                                            }

                                        }} component={FindbackField} name="busiUnitFunc7.smBusiUnitFuncGid"/>
                                    </Col>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                form: "BusiUnitForm",
                                                id: "busiUnitFunc7.active",
                                                label: "是否启用",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                checkedChildren: "是",
                                                unCheckedChildren: "否"
                                            }} component={SwitchField}
                                                   name="busiUnitFunc7.active"/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                }
                                {selectValue.indexOf("55E480B94B1E121FE055000000000001") != -1 &&
                                <TabPane tab="采购" key="55E480B94B1E121FE055000000000001">
                                    <Row>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                id: "busiUnitFunc8.smBusiUnitFuncGid",
                                                form: "BusiUnitForm",
                                                label: "上级职能业务单元",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                showRequiredStar: false,  //是否显示必填星号
                                                placeholder: "请选择业务单元",
                                                tableInfo: {
                                                    id: "busiUnitFunc8FindBackTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "上级业务单元",
                                                    columns: [
                                                        {
                                                            title: '业务单元名称',
                                                            dataIndex: 'busiUnitName',
                                                            key: '2',
                                                            width: 200
                                                        },
                                                        {
                                                            title: '业务单元编码',
                                                            dataIndex: 'busiUnitCode',
                                                            key: '1',
                                                            width: 200
                                                        }
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/busiUnit/queryFindBack.action?id=' + this.id + '&funcGid=55E480B94B1E121FE055000000000001',
                                                    }
                                                },
                                                pageId: 'busiUnitFunc8FindBackTablePage',
                                                displayField: "busiUnitName",
                                                valueField: {
                                                    "from": "gid",
                                                    "to": "busiUnitFunc8.smBusiUnitFuncGid"
                                                }

                                            }} component={FindbackField} name="busiUnitFunc8.smBusiUnitFuncGid"/>
                                        </Col>
                                        <Col span={12}>
                                            <Field config={{
                                                enabled: true,
                                                form: "BusiUnitForm",
                                                id: "busiUnitFunc8.active",
                                                label: "是否启用",  //标签名称
                                                labelSpan: 8,   //标签栅格比例（0-24）
                                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                                checkedChildren: "是",
                                                unCheckedChildren: "否"
                                            }} component={SwitchField}
                                                   name="busiUnitFunc8.active"/>
                                        </Col>
                                    </Row>
                                </TabPane>
                                }
                            </Tabs>
                        </Row>

                    </Card>

                </div>
            </div>
        );
    }
}


export default reduxForm({
    form: "BusiUnitForm",
    validate
})(BusiUnitModify)
