/*
 *
 * ImePlanOrderPublishRulePage
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import TableField from 'components/Form/TableField';
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil';
import {Breadcrumb, Row, Card, Col, Tabs} from 'antd';
import AppButton from 'components/AppButton';
import pubsub from 'pubsub-js';
import Immutable from 'immutable';
import CoreComponent from 'components/CoreComponent'

const validate = values => {
    const errors = {}
    const reg = new RegExp("^[0-9]*$")

    let vv = values.toJS();

    if (!vv.publishRule || !vv.publishRule.length) {
        //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.publishRule.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.ruleCode) {
                memberErrors.ruleCode = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
            if (!member || !member.ruleName) {
                memberErrors.ruleName = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
            if (!member || !member.fixedValue) {
                memberErrors.fixedValue = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }else if (!reg.test(member.fixedValue) || member.fixedValue<=0) {
                memberErrors.fixedValue = '请输入正整数!'
                membersArrayErrors[memberIndex] = memberErrors
            }

        })
        if (membersArrayErrors.length) {
            errors.publishRule = membersArrayErrors
        }
    }
    return errors
}

const TabPane = Tabs.TabPane;
export class ImePlanOrderPublishRulePage extends React.PureComponent /* CoreComponent*/ { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
       /* this.state =Object.assign( {
            tabTitle: "hhh"
        },this.state)*/
        let dataSource = {
            type: "api",
            method: "POST",
            url: "/ime/imePlanOrderPublishRule/query.action",
        }
        resolveDataSource({ dataSource}).then(function (data) {
            let initData = {};
            console.log(data);
            initData.publishRule = data.data;
            pubsub.publish("@@form.init", { id: "publishRuleForm", data: Immutable.fromJS(initData) });
            pubsub.publish("publishRuleTable.activateAll", false);

        })

      /*  pubsub.subscribe(`jkdfjjk854r90t09fkffgl.setTitle`,(m,d)=>{//定义更改table页签的方法
            this.setState({tabTitle:d})
        })*/

    }
    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>生产管理</Breadcrumb.Item>
                    <Breadcrumb.Item>设置</Breadcrumb.Item>
                    <Breadcrumb.Item>订单下发规则</Breadcrumb.Item>
                </Breadcrumb>
                <div className="wrapper">
                    <Card bordered={true} style={{"marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px"}}
                          bodyStyle={{"paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px"}}>
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
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/imePlanOrderPublishRule/query.action"
                                                }
                                                resolveDataSourceCallback({dataSource:dataSource},function(data){
                                                    let initData = {};
                                                    initData.publishRule = data.data;
                                                pubsub.publish("@@form.init", { id: "publishRuleForm", data: Immutable.fromJS(initData) });

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
                                                {
                                                    event: "publishRuleAdd.enabled",
                                                  /*  eventPayloadExpression:` //调用构造里面写的方法  更改table页签
                                                         pubsub.publish("jkdfjjk854r90t09fkffgl.setTitle","dddd")
                                                         callback(true)
                                                    `,*/
                                                    payload: true
                                                },
                                                {
                                                    event: "publishRuleAdd.visible",
                                                    payload: true
                                                }
                                                ,
                                                  {
                                                      event:"publishRuleTable.activateAll",
                                                      payload:true
                                                  }
                                                ,
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
                                                    event: "deleteBtn.visible",
                                                    payload: false
                                                },
                                                {
                                                    event: "saveBtn.enabled",
                                                    payload: true
                                                }
                                                ,
                                                {
                                                    event: "saveBtn.visible",
                                                    payload: true
                                                }
                                                ,
                                                {
                                                    event: "publishRuleTable.addRow"
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
                                                {
                                                    event: "publishRuleAdd.enabled",
                                                    payload: false
                                                },
                                                {
                                                    event: "publishRuleAdd.visible",
                                                    payload: true
                                                },
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
                                                    event: "deleteBtn.visible",
                                                    payload: false
                                                },
                                                {
                                                    event: "saveBtn.enabled",
                                                    payload: true
                                                }
                                                ,
                                                {
                                                    event: "saveBtn.visible",
                                                    payload: true
                                                }
                                                ,
                                                {
                                                    event: "publishRuleModify.visible",
                                                    payload: true
                                                }
                                            ]
                                        },
                                        {
                                            event: "publishRuleTable.onSelectedRows",
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
                                                            event: "publishRuleTable.activateRow"
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
                                            behaviors: [
                                                {
                                                    type: "fetch",
                                                    id: "publishRuleTable",
                                                    data: "selectedRows",
                                                    successPubs: [
                                                        {
                                                            event: "@@form.init",
                                                            eventPayloadExpression: `
                                                    //console.log("HHHHHHHHHHH");
                                                  //console.log("eventPayload",eventPayload)
                                                  let params = [];
                                                  let flag = false;
                                                  if(eventPayload && eventPayload.length && eventPayload.length>=0){
                                                        for(var i=0;i<eventPayload.length;i++){
                                                            if(flag){break;}
                                                            if(eventPayload[i] && eventPayload[i].isDefault){
                                                                //console.log(eventPayload[i].isDefault);
                                                                flag = true;
                                                            }
                                                            if(eventPayload[i] && eventPayload[i].gid){
                                                                params.push(eventPayload[i].gid);
                                                            }
                                                        }
                                                  }
                                                  if(flag){
                                                    //pubsub.publish('@@message.error',"删除失败!");
                                                  }else{
                                                     let dataSource= {
                                                              type: "api",
                                                              mode:"dataContext",
                                                              method: "POST",
                                                              url: "/ime/imePlanOrderPublishRule/delete.action",
                                                          }
                                                        let onSuccess = function(res){
                                                                var datas ={};
                                                                pubsub.publish('@@message.success',"删除成功");
                                                                pubsub.publish('cancelBtn.click');
                                                            }
                                                        resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess);
                                                  }

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
                                        {
                                            event: "saveBtn.click",
                                            pubs: [
                                                {
                                                    event: "saveBtn.expression",
                                                    meta: {
                                                        expression: `
                                                  resolveFetch({fetch:{id:'publishRuleForm',data:'@@formValues'}}).then(function(data){
                                                        //console.log(data);
                                                        let param = [];
                                                        if(data && data.publishRule){
                                                            param = data.publishRule;
                                                        }
                                                        let dataSource= {
                                                        type: 'api',
                                                        method: 'POST',
                                                        mode:"payload",
                                                        url: '/ime/imePlanOrderPublishRule/savePlanOrderPublishRuleList.action',
                                                        payload: param
                                                      };
                                                      //console.log(param)
                                                      if(submitValidateForm("publishRuleForm")){

                                                      }else{
                                                        //console.log(param)
                                                        let checkArray = [];
                                                        let flag = true;//判断方案编号重复的标记
                                                        let sign = false;//判断是否所有的 是否默认为false
                                                        if(param.length>0){
                                                            //console.log("Come ON");
                                                           for(var i=0;i<param.length;i++){
                                                              if(!flag){break;}
                                                              for(var j=0;j<checkArray.length;j++){
                                                                  if(checkArray[j] && param[i].ruleCode==checkArray[j]){
                                                                       flag = false;
                                                                       pubsub.publish("@@message.error","保存失败,方案编号重复!");
                                                                       break;
                                                                  }
                                                               }
                                                               if(param[i].isDefault){
                                                                    sign = true;
                                                               }
                                                              checkArray.push(param[i].ruleCode);
                                                           }
                                                        }
                                                        //console.log(checkArray);
                                                        //console.log(flag);
                                                        if(!sign){
                                                            pubsub.publish("@@message.error","保存失败,至少有一个默认方案为‘是’!");
                                                        }
                                                         if(flag && sign){
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
                                                {
                                                    event: "publishRuleAdd.enabled",
                                                    payload: false
                                                },
                                                {
                                                    event: "publishRuleAdd.visible",
                                                    payload: true
                                                },
                                                {
                                                    event: "modifyBtn.visible",
                                                    payload: true
                                                }
                                                ,
                                                {
                                                    event: "createBtn.visible",
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
                                                    event: "deleteBtn.visible",
                                                    payload: true
                                                }
                                                ,
                                                {
                                                    event: "deleteBtn.enabled",
                                                    payload: false
                                                }
                                                ,
                                                {
                                                    event: "modifyBtn.enabled",
                                                    payload: false
                                                },
                                                {
                                                    event: "publishRuleModify.visible",
                                                    payload: false
                                                }
                                                ,
                                                {
                                                    event: "cleanBtn.click"
                                                }
                                                ,
                                                {
                                                    event: "publishRuleTable.clearSelect"
                                                }
                                                ,
                                                {
                                                    event:"publishRuleTable.activateAll",
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
                    <Card style={{width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px"}} bodyStyle={{padding: "15px"}}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="" key="1">  {/*{this.state.tabTitle}*/}
                                <Row type="flex" justify="space-between">
                                    <Col span={1}>
                                        <AppButton config={{
                                            id: "publishRuleAdd",
                                            title: "增加",
                                            type: "primary",
                                            size: "small",
                                            visible: true,
                                            enabled: false,
                                            subscribes: [
                                                {
                                                    event: "publishRuleAdd.click",
                                                    pubs: [
                                                        {
                                                            event: "publishRuleTable.addRow"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }}/>
                                    </Col>
                                    <Col span={1}>
                                        <AppButton config={{
                                            id: "publishRuleModify",
                                            title: "全部修改",
                                            type: "primary",
                                            size: "small",
                                            visible: false,
                                            enabled: true,
                                            subscribes: [
                                                {
                                                    event: "publishRuleModify.click",
                                                    pubs: [
                                                        {
                                                            event: "publishRuleTable.activateAll",
                                                            payload:true
                                                        }
                                                    ]
                                                }
                                            ]
                                        }}/>
                                    </Col>
                                    <Col span={22}></Col>

                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FieldArray name="publishRule" config={{
                                            addButton: false,
                                            id: "publishRuleTable",
                                            name: "publishRuleTable",
                                            rowKey: "id",
                                            showSelect: true,
                                            form: "publishRuleForm",
                                            unEditable: false,
                                            type: "checkbox",
                                            showRowDeleteButton: true,
                                            columns: [
                                                {
                                                    "id": "ruleCode",
                                                    "type": "textField",
                                                    "title": "方案编号",
                                                    "name": "ruleCode"
                                                },
                                                {
                                                    "id": "ruleName",
                                                    "type": "textField",
                                                    "title": "方案名称",
                                                    "name": "ruleName"
                                                },
                                                {
                                                    "id": "fixedValue",
                                                    "type": "textField",
                                                    "title": "固定值",
                                                    "name": "fixedValue"
                                                },
                                                {
                                                    "id": "isDefault",
                                                    "title": "是否默认方案",
                                                    "type": "switchField",
                                                    "name": "isDefault",
                                                    "checkedChildren": "是",
                                                    "unCheckedChildren": "否",
                                                    subscribes:[
                                                        {
                                                            event:"isDefault.onChange",
                                                            pubs:[
                                                                {
                                                                    event: 'isDefault.expression',
                                                                    meta: {
                                                                        expression: `
                                                                        //console.log("Happy!!!");
                                                                        //console.log(me.props.config.rowIndex);//获取当前改变行
                                                                       // console.log(me.props.input.name);//table中对应的行
                                                                        //console.log(me.props.input.value);//当前更改的值
                                                                     //resolveFetch({fetch:{id:'publishRuleTable',data:'rowIds'}}).then(function(data){//获得所有的行
                                                                      //  console.log(data);
                                                                     //})
                                                                     if(me.props.input.value){
                                                                        resolveFetch({fetch:{id:'publishRuleForm',data:'@@formValues'}}).then(function(data){
                                                                            //console.log(data);
                                                                            //console.log(data.publishRule);
                                                                            let ruleArrays = data.publishRule
                                                                            for(var i=0;i<ruleArrays.length;i++){
                                                                                if(("publishRule["+i+"].isDefault")==me.props.input.name){
                                                                                    continue;
                                                                                }
                                                                                ruleArrays[i].isDefault = false;
                                                                            }
                                                                            data.publishRule = ruleArrays;
                                                                            pubsub.publish("@@form.init", {id: "publishRuleForm", data: data});
                                                                        })
                                                                     }else{//将默认改为false的时候
                                                                        resolveFetch({fetch:{id:'publishRuleForm',data:'@@formValues'}}).then(function(data){
                                                                            //console.log(data);
                                                                            //console.log(data.publishRule);
                                                                            let ruleArrays = data.publishRule
                                                                            let flag = false;
                                                                            for(var i=0;i<ruleArrays.length;i++){
                                                                                if(ruleArrays[i].isDefault){
                                                                                  flag = true;
                                                                                  break;
                                                                                }
                                                                            }
                                                                            if(!flag){
                                                                                pubsub.publish("@@form.change", { id: "publishRuleForm", name:me.props.input.name , value: true })
                                                                            }
                                                                        })
                                                                     }

                                                                    `
                                                                    }
                                                                },
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            subscribes: [
                                                {
                                                    event: 'publishRuleTable.onSelectedRows',
                                                    behaviors: [
                                                        {
                                                            type: "fetch",
                                                            id: "publishRuleTable", //要从哪个组件获取数据
                                                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                            successPubs: [  //获取数据完成后要发送的事件
                                                                {
                                                                    event: "@@form.init",
                                                                    eventPayloadExpression: `
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
                                        }} component={TableField}/>
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
            </div>
        );
    }

   /* componentWillUnmount()
    { // 将定义的方法释放掉
        super.componentWillUnmount();
        pubsub.unsubscribe(`jkdfjjk854r90t09fkffgl.setTitle`);
    }*/
}

ImePlanOrderPublishRulePage.propTypes = {
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

let imePlanOrderPublishRule = reduxForm({
    /*config:{id:"jkdfjjk854r90t09fkffgl"},*/  //定义一个页面的id  后面用来调用方法
    form: "publishRuleForm",
    validate
})(ImePlanOrderPublishRulePage)

export default connect(mapStateToProps, mapDispatchToProps)(imePlanOrderPublishRule);
