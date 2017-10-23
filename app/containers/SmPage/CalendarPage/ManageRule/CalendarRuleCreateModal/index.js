/*
    CalendarRule Create Page
    日历规则创建页面
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
import AppButton from "components/AppButton"
import TableField from 'components/Form/TableField'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import Immutable from 'immutable'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'


const TabPane = Tabs.TabPane;
const validate = values => {
    const errors = {}
    if (!values.get('ruleName')) {
        errors.code = '必填项'
    }
    if (!values.get('ruleCode')) {
        errors.code = '必填项'
    }
    return errors
}


class CalendarRuleCreateModal extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
         this.calendarId = this.props.location.state[0].gid;

        //console.log("CalendarRuleCreateModal:calendarId",this.calendarId)
        //生成规则编码
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
                modifyData.ruleCode = response.data;
                pubsub.publish("@@form.init", {id: "RuleDetailForm", data: modifyData});

            } else {
                pubsub.publish("@@message.error", "初始化获取编码失败!");
            }
        })





    }

    addDate(date,days){
        var d=new Date(date);
        d.setDate(d.getDate()+days);
        var m=d.getMonth()+1;
        if(m<10){
            m = "0" + m
        }
        var r=d.getDate();
        if(r<10){
            r= "0"+r
        }
        return d.getFullYear()+'-'+m+'-'+r;
    }

    calculateDate(repeatWay,interval,startTime,frequency,endTime){
        debugger
        startTime = new Date(Date.parse(startTime.replace(/-/g,"/")))

        if(typeof(frequency) != "undefined" && frequency != null ){
            //根据发生次数计算结束日期
            if(repeatWay == "56C75306ECC40587E055000000000001"){
                //天
                var days = parseInt(interval)*parseInt(frequency)-1
                return this.addDate(startTime,days)
            }else{
                //周
                //var r = isContain(startTime,weekdays)
                //if(r.flag){
                //开始日期刚好在选中的周期之中或者之前,重复间隔和发生次数从当前日期开始计算
                var days = (parseInt(interval)*parseInt(frequency))*7-1
                return this.addDate(startTime,days)
                //}else{
                //开始时期已经过了当前周期,重复间隔和发生次数从下周的此日期开始计算
                //var days = (parseInt(interval)*parseInt(frequency)+1)*7-7
                //return addDate(r.maxDate,days)
                // }

            }
        }else if(typeof(endTime) != "undefined" && endTime != null){
            //根据结束日期计算发生次数
            debugger
            console.log("endTime",endTime)
            endTime = new Date(Date.parse(endTime.replace(/-/g,"/")))
            if(repeatWay == "56C75306ECC40587E055000000000001"){
                //天
                debugger
                var days = (endTime - startTime+1)/1000/60/60/24;
                return Math.ceil(days/interval)
            }else{
                //周
                var weeks = (endTime - startTime)/1000/60/60/24/7;
                return Math.ceil(weeks/interval)
            }
        }
    }


    componentWillMount() {
    }
    componentDidMount() {
        //是否工作日
        pubsub.subscribe("isWorkday.onChange", (name, payload) => {

            // pubsub.publish("@@form.change", { id: "detail", name: "actualQty", value: payload })
            if(payload){
                pubsub.publish("RuleDetailAddLineBtn.enabled",true)
            }else{
                pubsub.publish("RuleDetailAddLineBtn.enabled",false)

                //清空时段表单
                resolveFetch({
                    fetch: {
                        id: "RuleDetailForm",
                        data: "@@formValues"
                    }
                }).then(function (data) {
                    data.calendarRuleDetailDTOs = null
                    pubsub.publish("@@form.init", {id: "RuleDetailForm", data: data});
                })
            }
        })

        //change repeatWay
        pubsub.subscribe("repeatWay.onChange", (name, payload) => {
            //天  56C75306ECC40587E055000000000001;  周   56C75306ECC50587E055000000000001
            console.log("name:",name)
            console.log("payload:",payload)
            // pubsub.publish("@@form.change", { id: "detail", name: "actualQty", value: payload })
            if(payload == '56C75306ECC40587E055000000000001'){
                pubsub.publish("weekdays.enabled",false)
                //清空周选择
                resolveFetch({
                    fetch: {
                        id: "RuleDetailForm",
                        data: "@@formValues"
                    }
                }).then(function (data) {
                    data.weekdays = null
                    pubsub.publish("@@form.init", {id: "RuleDetailForm", data: data});

                })

            }else if(payload == '56C75306ECC50587E055000000000001'){
                pubsub.publish("weekdays.enabled",true)
            }
        })

        //change interval
        pubsub.subscribe("frequency.onChange", (name, payload) => {

            resolveFetch({
                fetch: {
                    id: "RuleDetailForm",
                    data: "@@formValues"
                }
            }).then(function (data) {
                //console.log("formValues",data)
                let re = this.calculateDate(data.repeatWay, data.interval, data.startTime, payload, null)
                console.log("return", re)
                data.endTime = re
                pubsub.publish("@@form.init", {id: "RuleDetailForm", data: data});
            }.bind(this))
        })

        //change endTime
        pubsub.subscribe("endTime.onChange", (name, payload) => {

            resolveFetch({
                fetch: {
                    id: "RuleDetailForm",
                    data: "@@formValues"
                }
            }).then(function (data) {
                //console.log("formValues",data)

                data.frequency = this.calculateDate(data.repeatWay, data.interval, data.startTime, null, payload)

                pubsub.publish("@@form.init", {id: "RuleDetailForm", data: data});

            }.bind(this))
        })

    }
    componentWillUnmount() {


    }
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div>
               
                <Card style={{ width: "100%",backgroundColor: "#f9f9f9"}} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col>
                            <AppButton config={{
                                id: "CalendarRuleSaveBtnInCalendarRuleCreateModal",
                                title: "保存",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "CalendarRuleSaveBtnInCalendarRuleCreateModal.click",
                                        pubs:[
                                            {
                                                event: "CalendarRuleSaveBtnInCalendarRuleCreateModal.expression",
                                                meta: {
                                                    expression: `
                                                        resolveFetch({
                                                            fetch: {
                                                                id: "RuleDetailForm",
                                                                data: "@@formValues"
                                                            }
                                                        }).then(function (data) {
                                                            console.log("data", data)
                                                            let form = data
                                                            if(typeof(data.weekdays)!='undefined' && null != data.weekdays){
                                                                console.log("data.weekdays",data.weekdays)
                                                                console.log("weekdays",data.weekdays.values())
                                                                let str = data.weekdays.toString()
                                                                form.weekdays = str
                                                            }


                                                            form.smCalendarGid = "${this.calendarId}"


                                                            let dataSource = {
                                                                type: "api",
                                                                method: "POST",
                                                                url: "/sm/calendarRule/save.action",
                                                                mode: "payload",
                                                                payload: form

                                                            }

                                                            let onSuccess = function (response) {
                                                                if (response.success) {
                                                                    pubsub.publish("@@message.success", "保存成功!");
                                                                    pubsub.publish("CalendarRuleCreateModal.onCancel")


                                                                    pubsub.publish("CalendarRuleTable.loadData");
                                                                } else {
                                                                    //console.log("修改失败!");
                                                                    pubsub.publish("@@message.error", "保存失败!");
                                                                    //pubsub.publish("@@message.error",response.data);
                                                                }
                                                            }



                                                            resolveDataSourceCallback({
                                                                dataSource: dataSource,
                                                                eventPayload: {},
                                                                dataContext: {}
                                                            }, onSuccess);
                                                        })
                                                    `
                                                }
                                            }
                                        ]


                                    }
                                ]
                            }}></AppButton>


                            <AppButton config={{
                                id: "CalendarRuleCancelBtnInCalendarRuleCreateModal",
                                title: "取消",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "CalendarRuleCancelBtnInCalendarRuleCreateModal.click",
                                        pubs: [
                                            {
                                                event: "CalendarRuleCreateModal.onCancel"
                                            }
                                        ]
                                    }
                                ]
                            }}></AppButton>
                        </Col>
                    </Row>
                </Card>
                <Card style={{ width: "100%", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col span={8}>
                            <Field config={{
                                form: "RuleDetailForm",
                                enabled: false,
                                id: "ruleCode",
                                label: "规则编码",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入编码"
                            }} component={TextField} name="ruleCode" />
                        </Col>
                        <Col span={8}>
                            <Field config={{
                                enabled: true,
                                form: "RuleDetailForm",
                                id: "ruleName",
                                label: "规则名称",
                                placeholder: "请输入名称",
                                showRequiredStar: true,
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="ruleName" />
                        </Col>

                        <Col span={8}>
                            <Field config={{
                                enabled: true,
                                form: "RuleDetailForm",
                                id: "isWorkday",
                                label: "工作日",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 1,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                checkedChildren: "是",
                                unCheckedChildren: "否",
                                isNumber: true
                            }} component={SwitchField} name="isWorkday"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Field config={{
                                id: "repeatWay",
                                form:"RuleDetailForm",
                                label: "重复方式",  //标签名称
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
                                                { "field": "smDictionaryEnumGid", "type": "eq", "value": "56C74C5DFAA9056AE055000000000001" }
                                            ],
                                            "sorted": "seq"
                                        }
                                    },
                                },
                                displayField: "val",
                                valueField: "gid",
                            }} component={SelectField} name="repeatWay" />
                        </Col>

                        <Col span={8}>
                            <Field config={{
                                enabled: true,
                                form: "RuleDetailForm",
                                id: "interval",
                                label: "重复间隔",
                                placeholder: "1,2,3...",
                                showRequiredStar: false,
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="interval" />
                        </Col>
                    </Row>
                    <Row>
                        <Field config={{
                            enabled: true,
                            form:"RuleDetailForm",
                            id: "weekdays",
                            label: "周期",  //标签名称
                            labelSpan: 4,   //标签栅格比例（0-24）
                            wrapperSpan: 20,  //输入框栅格比例（0-24）
                            showRequiredStar: false,  //是否显示必填星号
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
                                            "value": "570204ABC797073FE055000000000001"
                                        }], "sorted": "seq"
                                    }
                                }
                            }
                        }} component={CheckBoxField} name="weekdays"/>
                    </Row>

                    <Row>
                        <Col span={8}>
                            <Field config={{
                                enabled: true,
                                form:"RuleDetailForm",
                                id: "startTime",
                                label: "开始日期",  //标签名称
                                showRequiredStar: true,
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请输入"
                            }} component={DateField} name="startTime" />
                        </Col>

                        <Col span={8}>
                            <Field config={{
                                enabled: true,
                                form: "RuleDetailForm",
                                id: "frequency",
                                label: "共发生次数",
                                placeholder: "1,2,3...",
                                showRequiredStar: false,
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="frequency" />
                        </Col>

                        <Col span={8}>
                            <Field config={{
                                enabled: true,
                                form:"RuleDetailForm",
                                id: "endTime",
                                label: "结束日期",  //标签名称
                                showRequiredStar: true,
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "请输入"
                            }} component={DateField} name="endTime" />
                        </Col>
                    </Row>
                </Card>

                <Card style={{ width: "100%",  marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="日历规则时段明细" key="1">
                            <Row>
                                <Col span={14} xs={24}>
                                    <AppButton config={{
                                        id: "RuleDetailAddLineBtn",
                                        title: "新增",
                                        type: "primary",
                                        size: "large",
                                        visible: true,
                                        enabled: false,
                                        subscribes:[
                                            {
                                                event:"RuleDetailAddLineBtn.click",
                                                pubs:[
                                                    {
                                                        event:"CalendarRuleDetailTable.addRow"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                    }>
                                    </AppButton>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FieldArray name="calendarRuleDetailDTOs" config={{
                                        "id": "CalendarRuleDetailTable",
                                        "name": "CalendarRuleDetailTable",
                                        "form":"RuleDetailForm",
                                        "rowKey": "gid",
                                        "addButton": false, //是否显示默认增行按钮
                                        "showSelect":true, //是否显示选择框
                                        "type":"radio", //表格单选（radio）复选（checkbox）类型
                                        "unEditable":true, //初始化是否都不可编辑
                                        "showRowDeleteButton": false,  //是否显示删除按钮
                                        "columns": [
                                            {
                                                "id": "shiftName",
                                                "type": "findbackField",
                                                "title": "班次",
                                                "name": "smShiftGid",
                                                "form":"RuleDetailForm",
                                                tableInfo: {
                                                    id: "shiftTable",
                                                    size: "small",
                                                    rowKey: "gid",
                                                    width: "500",
                                                    tableTitle: "班次",
                                                    showSerial: true,  //序号
                                                    columns: [
                                                        { title: '班次编码', width: 100, dataIndex: 'shiftCode', key: '1' },
                                                        { title: '班次名称', width: 150, dataIndex: 'shiftName', key: '2' },
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/shift/query.action',
                                                    }
                                                },
                                                pageId: 'shiftTableInCalendarRuleDetail',
                                                displayField: "shiftName",
                                                valueField: {
                                                    "from": "gid",
                                                    "to": "smShiftGid"
                                                },
                                            }, {
                                                "id": "workTime",
                                                "type": "textField",
                                                "title": "上班时间",
                                                "name": "workTime",
                                            }, {
                                                "id": "closingTime",
                                                "type": "textField",
                                                "title": "下班时间",
                                                "name": "closingTime",
                                            },
                                        ],


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

CalendarRuleCreateModal.propTypes = {
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
    form: "RuleDetailForm",
    validate,
})(CalendarRuleCreateModal)



export default connect(mapStateToProps, mapDispatchToProps)(Form);