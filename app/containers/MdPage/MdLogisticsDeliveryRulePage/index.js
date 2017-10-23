import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import pubsub from 'pubsub-js';
import { Link } from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import AppTable from '../../../components/AppTable/index';
import DropdownButton from '../../../components/DropdownButton/index';
import {fromJS} from 'immutable'
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer';
import TreeField from '../../../components/Form/TreeField/index';
import AutoCompleteField from '../../../components/Form/AutoCompleteField/index';
import TableField from 'components/Form/TableField';
import Immutable from 'immutable';

import TextField from 'components/Form/TextField'
import SelectField from 'components/Form/SelectField'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import DateField from 'components/Form/DateField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import TextAreaField from 'components/Form/TextAreaField'
import TreeSelectField from 'components/Form/TreeSelectField';

const validate = values => {
    const errors = {}

    let vv= values.toJS();

    if (!vv.mdRuleSetDetailDTOs || !vv.mdRuleSetDetailDTOs.length) {
        //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.mdRuleSetDetailDTOs.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.ruleFieldGid) {
                memberErrors.ruleFieldGid = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
        })
        if (membersArrayErrors.length) {
            errors.mdRuleSetDetailDTOs = membersArrayErrors
        }
    }
    return errors
}
/*const asyncValidate = values => {
    //console.log("海贼王！！");
    let dataSource = {
        mode: "dataContext",
        type: "api",
        method: "POST",
        url: "/sm/checkUnique/check.action",
    }
    let className = "com.neusoft.ime.md.mdRuleSet.dto.MdRuleSetDTO";
    let fieldNames = "code,delete";
    let fieldValues = values.get('code') + ",0";

    return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:"",  className:className,fieldNames:fieldNames,fieldValues,fieldValues} }).then(function (res) {
        /!*if (!res.data) {
            //console.log(values.get('code') + '已存在!');
            resolve(values.get('code')+ '已存在!')
        }*!/
        resolve(res)
    })).then(function (res) {
        if(!res.data){
            throw { code: "已存在" }
        }

    })

}*/
const TabPane = Tabs.TabPane;
export class MdLogisticsDeliveryRulePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        let dataSource = {
            mode: "dataContext",
            type: "api",
            method: "POST",
            url: "/ime/mdLogisticsDeliveryRule/findById.action",
        }
        let id = '3ACE1E474FF84216AEF6E78C3B029BC3';//当前为一固定值
        resolveDataSource({ dataSource, dataContext: { id: id } }).then(function (data) {
            let initData = {};
            console.log(data);
            initData = data.data
            pubsub.publish("@@form.init", { id: "ruleForm", data: Immutable.fromJS(initData) })
            pubsub.publish("detailTable.activateAll", false)
            //pubsub.publish("detailTable.showRowDeleteButton", false);

        })

    }

  render() {
    return (
        <div>
            <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item>物流管理</Breadcrumb.Item>
                <Breadcrumb.Item>设置</Breadcrumb.Item>
                <Breadcrumb.Item>物流配送单生单规则</Breadcrumb.Item>
            </Breadcrumb>
            <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                  bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                <Row>
                    <Col span={8} xs={24}>
                        <AppButton config={{
                            id: "cleanBtn",
                            title: "初始化",
                            type: "primary",
                            size: "large",
                            visible: false,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "cleanBtn.click",
                                    pubs: [
                                        {
                                            event: 'cleanBtn.expression',
                                            meta: {
                                                expression: `

                                                let dataSource = {
                                                    mode: "dataContext",
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/mdLogisticsDeliveryRule/findById.action"
                                                }

                                                let id = '3ACE1E474FF84216AEF6E78C3B029BC3';//当前为一固定值
                                                resolveDataSourceCallback({dataSource:dataSource, dataContext: { id: id }},function(data){
                                                    let initData = {};
                                                    initData = data.data
                                                    console.log(initData);
                                                    pubsub.publish("@@form.init", { id: "ruleForm", data: initData})

                                                })

                                            `
                                            }
                                        }

                                    ]
                                }

                            ]
                        }}>
                        </AppButton>
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
                                        /*{
                                            event: "detailAdd.enabled",
                                            payload: true
                                        },
                                        {
                                            event: "detailAdd.visible",
                                            payload: true
                                        }
                                        ,
                                        {
                                            event: "createBtn.visible",
                                            payload: false
                                        },*/
                                        {
                                            event: "modifyBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event: "saveBtn.visible",
                                            payload: true
                                        },
                                        {
                                            event: "cancelBtn.visible",
                                            payload: true
                                        },

                                        {
                                            event:"deleteBtn.visible",
                                            payload:false
                                        },
                                        {
                                            event:"saveBtn.enabled",
                                            payload:true
                                        }
                                        ,
                                        {
                                            event:"saveBtn.visible",
                                            payload:true
                                        }
                                        ,
                                        {
                                            event:"detailTable.activateAll",
                                            payload:true
                                        }
                                        ,
                                        {
                                            event:"detailTable.addRow"
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
                                    event: "modifyBtn.click",
                                    pubs: [
                                     /*   {
                                            event: "detailAdd.enabled",
                                            payload: false
                                        },
                                        {
                                            event: "detailAdd.visible",
                                            payload: true
                                        }
                                        ,*/
                                        {
                                            event: "createBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event: "modifyBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event: "saveBtn.visible",
                                            payload: true
                                        },
                                        {
                                            event: "cancelBtn.visible",
                                            payload: true
                                        },

                                        {
                                            event:"deleteBtn.visible",
                                            payload:false
                                        },
                                        {
                                            event:"saveBtn.enabled",
                                            payload:true
                                        }
                                        ,
                                        {
                                            event:"saveBtn.visible",
                                            payload:true
                                        }
                                    ]
                                },
                                {
                                    event: "detailTable.onSelectedRows",
                                    pubs: [
                                        {
                                            event: "modifyBtn.dataContext"
                                        }
                                    ]
                                },
                                {
                                    event: "modifyBtn.click",
                                    behaviors:[
                                        {
                                            type:"fetch",
                                            id: "modifyBtn", //要从哪个组件获取数据
                                            data: "dataContext",//要从哪个组件的什么属性获取数据
                                            successPubs: [  //获取数据完成后要发送的事件
                                                {
                                                    event: "detailTable.activateRow"
                                                }
                                            ]
                                        }
                                    ]
                                }

                            ]
                        }}>
                        </AppButton>
                        <AppButton config={{
                            id: "deleteBtn",
                            title: "删除",
                            type: "primary",
                            size: "large",
                            visible: true,
                            enabled: false,
                            subscribes: [
                                {
                                    event: "deleteBtn.click",
                                    behaviors:[
                                        {
                                            type:"fetch",
                                            id:"detailTable",
                                            data:"selectedRows",
                                            successPubs:[
                                                {
                                                    event:"@@form.init",
                                                    eventPayloadExpression:`
                                                    console.log("HHHHHHHHHHH");
                                                  console.log("eventPayload",eventPayload)
                                                  let params = [];
                                                  if(eventPayload && eventPayload.length && eventPayload.length>=0){
                                                        for(var i=0;i<eventPayload.length;i++){
                                                            if(eventPayload[i] && eventPayload[i].gid){
                                                                params.push(eventPayload[i].gid);
                                                            }
                                                        }
                                                  }
                                                        let dataSource= {
                                                              type: "api",
                                                              mode:"dataContext",
                                                              method: "POST",
                                                              url: "/ime/mdLogisticsDeliveryRule/deleteDetail.action",

                                                          }
                                                        let onSuccess = function(res){
                                                                var datas ={};
                                                                pubsub.publish('@@message.success',"删除成功");
                                                                pubsub.publish('cancelBtn.click');

                                                            }
                                                        resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess);
                                                  `
                                                }
                                            ]
                                        }
                                    ],
                                }

                            ]
                        }}>
                        </AppButton>
                        <AppButton config={{
                            id: "saveBtn",
                            title: "保存",
                            type: "primary",
                            size: "large",
                            visible: false,
                            enabled: false,
                            subscribes: [
                                /*{
                                    event: "saveBtn.click",
                                    behaviors: [
                                        {
                                            type: "request",
                                            dataSource: {
                                                type: "api",
                                                method: "POST",
                                                url: "/ime/mdLogisticsDeliveryRule/modify.action",
                                                withForm: "ruleForm",
                                            },
                                            successPubs: [  //获取数据完成后要发送的事件
                                               {
                                                    event: "@@message.success",
                                                    payload: "保存成功"
                                                }
                                                ,
                                                {
                                                    event:"cancelBtn.click"
                                                }
                                            ],
                                            errorPubs: [
                                                {
                                                    event: "@@message.error",
                                                    payload: "保存失败"
                                                }
                                            ]
                                        }
                                    ],
                                }*/
                                {
                                    event: "saveBtn.click",
                                    pubs: [
                                        {
                                            event: "saveBtn.expression",
                                            meta: {
                                                expression: `
                                                  resolveFetch({fetch:{id:'ruleForm',data:'@@formValues'}}).then(function(data){
                                                        //console.log(data);
                                                        let dataSource= {
                                                        type: 'api',
                                                        method: 'POST',
                                                        mode:"payload",
                                                        url: '/ime/mdLogisticsDeliveryRule/modify.action',
                                                        payload: data
                                                      };
                                                      if(submitValidateForm("ruleForm")){

                                                      }else{
                                                        let checkGid = '';
                                                        let flag = true;
                                                        if(data && data.mdRuleSetDetailDTOs && data.mdRuleSetDetailDTOs.length){
                                                               for(var i=0;i<data.mdRuleSetDetailDTOs.length;i++){
                                                                    if(checkGid.indexOf(data.mdRuleSetDetailDTOs[i].ruleFieldGid)>=0){
                                                                        //console.log(checkGid);
                                                                        pubsub.publish("@@message.error","保存失败,规则字段重复!");
                                                                        flag = false
                                                                        break;
                                                                    }else{
                                                                        checkGid+=data.mdRuleSetDetailDTOs[i].ruleFieldGid+','
                                                                    }
                                                                }
                                                        }
                                                         //console.log(checkGid);
                                                         if(flag){
                                                            resolveDataSourceCallback({dataSource:dataSource},function(response){
                                                              if(response.success) {
                                                                pubsub.publish("@@message.success","保存成功");
                                                                pubsub.publish("cancelBtn.click");
                                                              } else {
                                                                pubsub.publish("@@message.error","保存失败");

                                                              }

                                                            })
                                                         }
                                                      }

                                                    })
                                                `
                                            }

                                        },

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
                            visible: false,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "cancelBtn.click",
                                    pubs: [
                                       /* {
                                            event: "detailAdd.enabled",
                                            payload: false
                                        },*/
                                        {
                                            event: "createBtn.visible",
                                            payload: true
                                        },
                                        {
                                            event: "modifyBtn.visible",
                                            payload: true
                                        },
                                        {
                                            event: "saveBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event: "cancelBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event:"deleteBtn.visible",
                                            payload:true
                                        }
                                        ,
                                        {
                                            event:"deleteBtn.enabled",
                                            payload:false
                                        }
                                        ,
                                        {
                                            event:"modifyBtn.enabled",
                                            payload:false
                                        }
                                        ,
                                        {
                                            event:"detailTable.clearSelect"

                                        }
                                        ,
                                        {
                                            event:"cleanBtn.click"
                                        }
                                        ,
                                        {
                                            event:"detailTable.activateAll",
                                            payload:false
                                        }
                                    ]

                                }

                            ]

                        }
                        }>
                        </AppButton>
                    </Col>
                </Row>
            </Card>
            <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="物流配送单生单规则" key="1">
                      {/*  <Row type="flex" justify="space-between">
                            <Col span={2}>
                                <AppButton config={{
                                    id: "detailAdd",
                                    title: "增加",
                                    type: "primary",
                                    size: "small",
                                    visible: true,
                                    enabled: false,
                                    subscribes:[
                                        {
                                            event:"detailAdd.click",
                                            pubs:[
                                                {
                                                    event:"detailTable.addRow"
                                                }
                                            ]
                                        }
                                    ]
                                }}/>
                            </Col>

                        </Row>*/}
                        <Row>
                            <Col span={24}>
                                <FieldArray name="mdRuleSetDetailDTOs" config={{
                                    "addButton" :false,
                                    "id": "detailTable",
                                    "name": "detailTable",
                                    "rowKey": "id",
                                    "type":"radio",
                                    "showSelect":true,
                                    "form":"ruleForm",
                                    "unEditable":false,
                                    "type":"checkbox",
                                    "showRowDeleteButton": true,
                                    "columns": [
                                        {
                                            "id": "ruleFieldDetailCol",
                                            "type": "selectField",
                                            "title": "规则字段",
                                            "name": "ruleFieldGid",
                                            dataSource: {
                                                type: "api",
                                                method: "post",
                                                url: "/sm/dictionaryEnumValue/query.action",
                                               /* bodyExpression:`
                                                  resolveFetch({fetch:{id:"ruleForm",data:"@@formValues"}}).then(function (data) {
                                                    console.log(data);
                                                    if(data && data.mdRuleSetDetailDTOs && data.mdRuleSetDetailDTOs.length>=0){
                                                        let ruleFieldGids = '';
                                                        for(var i =0;i<data.mdRuleSetDetailDTOs.length;i++){
                                                            if(data.mdRuleSetDetailDTOs[i].ruleFieldGid){
                                                                ruleFieldGids += data.mdRuleSetDetailDTOs[i].ruleFieldGid+","

                                                            }
                                                        }
                                                        if(ruleFieldGids!=''){
                                                           callback({
                                                                query:{
                                                                    query:[
                                                                    { "field": "smDictionaryEnumGid", "type": "eq", "value": "58F65026092B6D4AE055000000000001",operator:"and"},
                                                                    {
                                                                        left:"(",
                                                                        field:"gid",
                                                                        type:"noin",
                                                                        value:ruleFieldGids.substring(0, ruleFieldGids.lastIndexOf(",")),
                                                                        right:")",
                                                                        operator:"and"
                                                                    }
                                                                    ]
                                                                 }
                                                            });

                                                        }else{
                                                            callback({
                                                                query:{
                                                                    query:[
                                                                    { "field": "smDictionaryEnumGid", "type": "eq", "value": "58F65026092B6D4AE055000000000001",operator:"and"}
                                                                    ]
                                                                 }
                                                            });
                                                        }

                                                    }
                                                  })
                                                `*/
                                                mode: "payload",
                                                payload: {
                                                    "query": {
                                                        "query": [
                                                            { "field": "smDictionaryEnumGid", "type": "eq", "value": "58F65026092B6D4AE055000000000001" }
                                                        ],
                                                        "sorted": "seq"
                                                    }
                                                }
                                            },
                                            displayField: "val",
                                            valueField: "gid"
                                        }
                                    ],
                                    subscribes:[
                                        {
                                            event:'detailTable.onSelectedRows',
                                            behaviors:[
                                                {
                                                    type:"fetch",
                                                    id: "detailTable", //要从哪个组件获取数据
                                                    data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event:"@@form.init",
                                                            eventPayloadExpression:`
                                                                console.log(eventPayload);
                                                                if(eventPayload && eventPayload.length && eventPayload.length>0){
                                                                    pubsub.publish("deleteBtn.enabled",true);
                                                                    pubsub.publish("modifyBtn.enabled",true);
                                                                }else{
                                                                    pubsub.publish("deleteBtn.enabled",false);
                                                                    pubsub.publish("modifyBtn.enabled",false);
                                                                }
                                                            `
                                                        }

                                                    ]
                                                }
                                            ]

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

MdLogisticsDeliveryRulePage.propTypes = {
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

let mdLogisticsDeliveryRule = reduxForm({
    form: "ruleForm",
    validate/*,
    asyncValidate,
    asyncBlurFields: ['mdRuleSetDetailDTOs.ruleFieldGid']*/
})(MdLogisticsDeliveryRulePage)

export default connect(mapStateToProps, mapDispatchToProps)(mdLogisticsDeliveryRule);
