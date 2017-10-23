import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col} from 'antd';
import pubsub from 'pubsub-js'
import {Link} from 'react-router';

import TextField from 'components/Form/TextField'
import CheckBoxField from 'components/Form/CheckBoxField'
import SelectField from 'components/Form/SelectField'
import TableField from 'components/Form/TableField'
import TextAreaField from 'components/Form/TextAreaField'
import UploadField from 'components/Form/UploadField'
import AppButton from "components/AppButton"
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';


const validate = values => {
    const errors = {}
    if (!values.get('name')) {
        errors.name = '必填项'
    }

    let vv = values.toJS();

    if (!vv.defectTable || !vv.defectTable.length) {
        //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.defectTable.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.name) {
                memberErrors.name = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }

        })
        if (membersArrayErrors.length) {
            errors.defectTable = membersArrayErrors
        }
    }

    return errors
}

export class DeFectInformationPage extends React.PureComponent {

    constructor(props) {
        super(props);
        this.init();

        pubsub.subscribe("defectTable.refresh", () => {
            this.init();//初始化数据
            this.btnDisplay();//按钮列表控制
        })

        pubsub.subscribe("defectTable.onSelectedRows", (name, data) => {
            //console.log("rows", data)
            if ((data) && (data.length < 1)) {
                pubsub.publish("modifyBtn.enabled", false);
                pubsub.publish("saveBtn.enabled", false);
                pubsub.publish("delBtn.enabled", false);
                pubsub.publish("defectTable.clearSelect");
                pubsub.publish("defectTable.activateAll");
            } else if ((data) && (data.length > 0)) {
                pubsub.publish("modifyBtn.enabled", true);
                pubsub.publish("delBtn.enabled", true);
            }
        })

    }


    componentDidMount() {
    }


    init() {


        let dataSource = {
            type: 'api',
            method: 'post',
            url: '/ime/imeQcDefect/query.action'
        }

        resolveDataSource({
            dataSource: dataSource
        }).then(function (response) {
            if (response.success) {
                let modifyData = {}
                modifyData.defectTable = response.data;
                pubsub.publish("@@form.init", {id: "defectForm", data: modifyData});

            } else {
                pubsub.publish("@@message.error", "缺陷信息始化失败!");
            }
        }.bind(this))

    }

    btnDisplay() {
        pubsub.publish("defectTable.clearSelect");
        pubsub.publish("defectTable.activateAll");
        pubsub.publish("modifyBtn.enabled", false);
        pubsub.publish("saveBtn.enabled", false);
        pubsub.publish("delBtn.enabled", false);
    }


    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>质量</Breadcrumb.Item>
                    <Breadcrumb.Item>缺陷信息</Breadcrumb.Item>
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
                                id: "createBtn",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "createBtn.click",
                                        pubs: [
                                            {
                                                event: "defectTable.addRow",
                                                eventPayloadExpression: `

                                                 let dataSource0 = {
                                                    type: 'api',
                                                    method: 'post',
                                                    url: '/sm/codeRule/generateCode.action?ruleCode=QX'
                                                }
                                                let onSuccess = function(response){
                                                    if(response.success){
                                                        callback({code:response.data});
                                                    }else{
                                                        pubsub.publish("@@message.error", "生成缺陷编码失败!");
                                                    }
                                                }
                                                 resolveDataSourceCallback({dataSource:dataSource0,eventPayload:{},dataContext:{}},onSuccess);

                                                `
                                            }
                                        ]
                                    }

                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "modifyBtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "defectTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "modifyBtn.dataContext"
                                            }
                                        ]
                                    },
                                    {
                                        event: "modifyBtn.click",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "modifyBtn", //要从哪个组件获取数据
                                                data: "dataContext",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "defectTable.activateRow"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "saveBtn",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "createBtn.click",
                                        pubs: [
                                            {
                                                event: "saveBtn.enabled",
                                                payload: true
                                            }
                                        ]
                                    },
                                    {
                                        event: "modifyBtn.click",
                                        pubs: [
                                            {
                                                event: "saveBtn.enabled",
                                                payload: true
                                            }
                                        ]
                                    },
                                    {
                                        event: "saveBtn.click",
                                        behaviors:
                                            [
                                                {
                                                    type: "fetch",
                                                    id: "defectTable", //要从哪个组件获取数据
                                                    data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "@@message.success",
                                                            eventPayloadExpression: `
                                                                                    //console.log("eventPayload1",eventPayload)
                                                                                    //callback(eventPayload.length);
                                                                                    if(eventPayload.length>0){
                                                                                        let flag = true;
                                                                                        for(let i=0;i<eventPayload.length;i++){
                                                                                            let member = eventPayload[i];
                                                                                            if (!member || !member.name) {
                                                                                                pubsub.publish("@@message.error","缺陷名称不能为空");
                                                                                                flag = false;
                                                                                                break;
                                                                                            }

                                                                                        }


                                                                                        if(flag){
                                                                                            let dataSource= {
                                                                                              type: "api",
                                                                                              mode:"dataContext",
                                                                                              method: "POST",
                                                                                              url: "/ime/imeQcDefect/createOrUpdate.action"
                                                                                            };

                                                                                            let onSuccess = function(response){
                                                                                                if(response.success){
                                                                                                    pubsub.publish("@@message.success","操作成功");
                                                                                                    //页面刷新
                                                                                                    pubsub.publish("defectTable.refresh");
                                                                                                }else{
                                                                                                    pubsub.publish("@@message.error",response.data);
                                                                                                }
                                                                                            }

                                                                                            resolveDataSourceCallback({dataSource:dataSource,eventPayload:eventPayload,dataContext:eventPayload},onSuccess);
                                                                                        }
                                                                                    }else{
                                                                                        pubsub.publish("@@message.error","请勾选记录再保存");
                                                                                    }

                                                                                    //callback("成功消息")
                                                                                    `
                                                        }
                                                    ]
                                                }
                                            ]
                                    }

                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "delBtn",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "delBtn.click",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "defectTable", //要从哪个组件获取数据
                                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@message.success",
                                                        eventPayloadExpression: `
                                                                                //console.log("eventPayload2",eventPayload);
                                                                                //callback(eventPayload.length)
                                                                                if(eventPayload.length>0){
                                                                                    let list=new Array();
                                                                                    for(let i=0;i<eventPayload.length;i++){
                                                                                        let dto=eventPayload[i];
                                                                                        if(dto&&dto.gid){
                                                                                            list.push(dto.gid);
                                                                                        }
                                                                                    }
                                                                                    //console.log(list);
                                                                                    let dataSource= {
                                                                                        type: "api",
                                                                                        mode:"dataContext",
                                                                                        method: "POST",
                                                                                        url: "/ime/imeQcDefect/deleteByIds.action"
                                                                                    };

                                                                                    let onSuccess = function(response){
                                                                                        if(response.success){
                                                                                            pubsub.publish("@@message.success","操作成功");
                                                                                            //页面刷新
                                                                                            pubsub.publish("defectTable.refresh");
                                                                                            }else{
                                                                                            pubsub.publish("@@message.error",response.data);
                                                                                        }
                                                                                    }

                                                                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:list,dataContext:list},onSuccess);


                                                                                }else{
                                                                                     pubsub.publish("@@message.error","请勾选记录再删除");
                                                                                }


                                                                                `,
                                                    }
                                                ]
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
                    <FieldArray name="defectTable" config={{
                        "id": "defectTable",
                        "name": "defectTable",
                        "form": "defectForm",
                        "rowKey": "gid",
                        "addButton": false, //是否显示默认增行按钮
                        "showSelect": true, //是否显示选择框
                        "type": "checkbox", //表格单选（radio）复选（checkbox）类型
                        "unEditable": true, //初始化是否都不可编辑
                        "showRowDeleteButton": true,  //是否显示操作列
                        "columns": [

                            {
                                "id": "code",
                                "type": "textField",
                                "title": "缺陷编码",
                                "name": "code",
                                "enabled": false

                            },
                            {
                                "id": "name",
                                "type": "textField",
                                "title": "缺陷名称",
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
                </Card>
            </div>
        )
            ;
    }
}


export default reduxForm({
    form: "defectForm",
    validate
})(DeFectInformationPage)