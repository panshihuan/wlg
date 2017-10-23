
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
import CoreComponent from 'components/CoreComponent'

const validate = values => {
    const errors = {}
    let vv= values.toJS();

    if (!vv.uniqueRule || !vv.uniqueRule.length) {
    } else {
        const membersArrayErrors = []
        vv.uniqueRule.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.filedName) {
                memberErrors.filedName = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
        })
        if (membersArrayErrors.length) {
            errors.uniqueRule = membersArrayErrors
        }
    }
    return errors
}
const TabPane = Tabs.TabPane;
export class MdOrderUniqueRulePage extends CoreComponent {
    constructor(props) {
        super(props);
         this.state =Object.assign( {
           tabTitle: ""
       },this.state);

         pubsub.subscribe(`ruleId.setTitle`,(m,d)=>{//定义更改table页签的方法
            this.setState({tabTitle:d})
         })

    }
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>生产管理</Breadcrumb.Item>
              <Breadcrumb.Item>设置</Breadcrumb.Item>
              <Breadcrumb.Item>唯一性规则</Breadcrumb.Item>
          </Breadcrumb>
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
                                          event: 'uniqueRuleTree.expression',
                                          meta: {
                                              expression: `
                                              console.log(dataContext);
                                                let params = {};
                                                if(dataContext && dataContext.nodeGid && dataContext.nodeGid!=''){
                                                  pubsub.publish("uniqueRuleTable.visible",true);
                                                  pubsub.publish("ruleId.setTitle",dataContext.nodeText);
                                                      var query =
                                                          {
                                                            "query": [
                                                               {
                                                                    "left":"(",
                                                                    "field":"uniqueRuleTypeGid",
                                                                    "type":"eq",
                                                                    "value":dataContext.nodeGid,
                                                                    "right":")",
                                                                    "operator":"and"
                                                               }
                                                             ]
                                                            }
                                                }else{
                                                   pubsub.publish("uniqueRuleTable.visible",false);
                                                   pubsub.publish("ruleId.setTitle","");
                                                    var query =
                                                          {
                                                            "query": [
                                                               {
                                                                    "left":"(",
                                                                    "field":"gid",
                                                                    "type":"eq",
                                                                    "value":'123456789!!@@!5555444',
                                                                    "right":")",
                                                                    "operator":"and"
                                                               }
                                                             ]
                                                            }
                                                }
                                                params.query = query;
                                                let dataSource={
                                                  type: 'api',
                                                  method: 'post',
                                                  url: '/ime/uniqueRule/query.action',
                                                  mode: "dataContext"
                                                 }
                                                 let onSuccess =function(response){
                                                    console.log(response);
                                                    if(response.success){
                                                        let data = {};
                                                        data.uniqueRule = response.data;
                                                        pubsub.publish("@@form.init", { id: "uniqueRuleForm", data: Immutable.fromJS(data)})

                                                    }else{
                                                        pubsub.publish("@@form.init", { id: "uniqueRuleForm", data: Immutable.fromJS({})})
                                                    }
                                                 }
                                                 resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess);

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
                          enabled: false,
                          subscribes: [
                              {
                                  event: "createBtn.click",
                                  pubs: [
                                      /*{
                                          event: "uniqueRuleAdd.enabled",
                                          payload: true
                                      },
                                      {
                                          event: "uniqueRuleAdd.visible",
                                          payload: true
                                      }
                                      ,*/
                                      {
                                          event:"uniqueRuleTable.activateAll",
                                          payload:true
                                      }
                                     /* ,
                                      {
                                          event: "createBtn.visible",
                                          payload: false
                                      }*/,
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
                                          event: "uniqueRuleTable.addRow"
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
                                    /*  {
                                          event: "uniqueRuleAdd.enabled",
                                          payload: false
                                      },
                                      {
                                          event: "uniqueRuleAdd.visible",
                                          payload: true
                                      },*/
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
                                  ]
                              },
                              {
                                  event: "uniqueRuleTable.onSelectedRows",
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
                                                  event: "uniqueRuleTable.activateRow"
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
                                          id: "uniqueRuleTable",
                                          data: "selectedRows",
                                          successPubs: [
                                              {
                                                  event: "@@form.init",
                                                  eventPayloadExpression: `
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
                                                              url: "/ime/uniqueRule/batchDelete.action",

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
                              {
                                  event: "saveBtn.click",
                                  pubs: [
                                      {
                                          event: "uniqueRuleTree.expression",
                                          meta: {
                                              expression: `
                                                    console.log(dataContext);
                                                  resolveFetch({fetch:{id:'uniqueRuleForm',data:'@@formValues'}}).then(function(data){
                                                        let paramss = {};
                                                        let param = [];
                                                        let type = dataContext.nodeGid;
                                                        paramss.type=type;
                                                        if(data && data.uniqueRule){
                                                            param = data.uniqueRule;
                                                        }

                                                      //console.log(param)
                                                      if(submitValidateForm("uniqueRuleForm")){
                                                      }else{
                                                        //console.log(param)
                                                        let checkArray = [];
                                                        let flag = true;//判断方案编号重复的标记
                                                        if(param.length>0){
                                                           for(var i=0;i<param.length;i++){
                                                              if(param[i].gid && param[i].gid!=''){
                                                              }else{
                                                                param[i].uniqueRuleTypeGid = dataContext.nodeGid;

                                                              }
                                                              for(var j=0;j<checkArray.length;j++){
                                                                  if(checkArray[j] && param[i].filedName==checkArray[j]){
                                                                       flag = false;
                                                                       pubsub.publish("@@message.error","保存失败,规则字段重复!");
                                                                       break;
                                                                  }
                                                               }
                                                              checkArray.push(param[i].filedName);
                                                           }
                                                        }
                                                        paramss.uniqueRules = param;
                                                        let dataSource= {
                                                            type: 'api',
                                                            method: 'POST',
                                                            mode:"payload",
                                                            url: '/ime/uniqueRule/saveUniqueRuleList.action',
                                                            payload: paramss
                                                        };

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
                                    /*  {
                                          event: "uniqueRuleAdd.enabled",
                                          payload: false
                                      },
                                      {
                                          event: "uniqueRuleAdd.visible",
                                          payload: true
                                      },*/
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
                                      }
                                      ,
                                      {
                                          event: "cleanBtn.click"
                                      }
                                      ,
                                      {
                                          event: "uniqueRuleTable.clearSelect"
                                      }
                                      ,
                                      {
                                          event:"uniqueRuleTable.activateAll",
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
          <Row>
              <Col span={5}>
                  <Field config={{
                      id: 'uniqueRuleTree', //组件id //busiGroupTree001
                      search: false,
                      enabled: false,
                      visible: true,
                      // defaultExpandedKeys: ['0-0-0', '0-0-1'],
                      // defaultSelectedKeys: ['0-0-0', '0-0-1'],
                      // defaultCheckedKeys: ['0-0-0', '0-0-1'],
                      checkable: false, //复选框
                      showLine: false,
                      draggable: false, //是否可以拖拽
                      searchBoxWidth: 300,
                      subscribes:[
                          {
                              event:"uniqueRuleTree.onSelect",
                              pubs: [
                                  {
                                      event:"uniqueRuleTree.expression",
                                      meta: {
                                          expression: `
                                                let condition = data.eventPayload.selectedKeys[0];
                                                let treeText = data.eventPayload.selectNode.text;

                                                //console.log(data.eventPayload);
                                                //console.log(condition);
                                                //console.log(treeText);
                                                let params = {};
                                                if(data && data.eventPayload && data.eventPayload.selectNode && data.eventPayload.selectNode.pid!='0'){
                                                    pubsub.publish("uniqueRuleTree.dataContext", {eventPayload:{nodeGid:condition,nodeText:treeText}});
                                                    pubsub.publish("createBtn.enabled", true);
                                                    //pubsub.publish("uniqueRuleTable.visible",true);
                                                    //pubsub.publish("ruleId.setTitle",treeText);
                                                      /*var query =
                                                          {
                                                            "query": [
                                                               {
                                                                    "left":"(",
                                                                    "field":"uniqueRuleTypeGid",
                                                                    "type":"eq",
                                                                    "value":condition,
                                                                    "right":")",
                                                                    "operator":"and"
                                                               }
                                                             ]
                                                            }*/

                                                }else{
                                                    pubsub.publish("uniqueRuleTree.dataContext", {eventPayload:{}});
                                                    pubsub.publish("createBtn.enabled", false);
                                                    //pubsub.publish("uniqueRuleTable.visible",false);
                                                    //pubsub.publish("ruleId.setTitle","");
                                                   /* var query =
                                                          {
                                                            "query": [
                                                               {
                                                                    "left":"(",
                                                                    "field":"gid",
                                                                    "type":"eq",
                                                                    "value":'123456789!!@@!55',
                                                                    "right":")",
                                                                    "operator":"and"
                                                               }
                                                             ]
                                                            }*/
                                                }
                                               /* params.query = query;
                                                let dataSource={
                                                  type: 'api',
                                                  method: 'post',
                                                  url: '/ime/uniqueRule/query.action',
                                                  mode: "dataContext"
                                                 }
                                                 let onSuccess =function(response){
                                                    console.log(response);
                                                    if(response.success){
                                                        let data = {};
                                                        data.uniqueRule = response.data;
                                                        pubsub.publish("@@form.init", { id: "uniqueRuleForm", data: Immutable.fromJS(data)})
                                                    }else{
                                                        pubsub.publish("@@form.init", { id: "uniqueRuleForm", data: Immutable.fromJS({})})
                                                    }
                                                 }
                                                 resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess);*/
                                                 pubsub.publish("cancelBtn.click");
                                            `
                                      }

                                  }
                              ]

                          }


                      ],
                      dataSource: {
                          type: "api",
                          method: "POST",
                          url: '/ime/uniqueRule/findUniqueRuleByEnumId.action'
                      },

                  }} name="uniqueRuleTree"  component={ TreeField } />
              </Col>
              <Col span={1}>
              </Col>
              <Col span={ 18 } >
                  <Card style={{width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px"}} bodyStyle={{padding: "15px"}}>
                      <Tabs defaultActiveKey="1">
                          <TabPane tab={this.state.tabTitle} key="1">
                             {/* <Row type="flex" justify="space-between">
                                  <Col span={4}>
                                      <AppButton config={{
                                          id: "uniqueRuleAdd",
                                          title: "增加",
                                          type: "primary",
                                          size: "small",
                                          visible: true,
                                          enabled: false,
                                          subscribes: [
                                              {
                                                  event: "uniqueRuleAdd.click",
                                                  pubs: [
                                                      {
                                                          event: "uniqueRuleTable.addRow"
                                                      }
                                                  ]
                                              }
                                          ]
                                      }}/>
                                  </Col>

                              </Row>*/}
                              <Row>
                                  <Col span={24}>
                                      <FieldArray name="uniqueRule" config={{
                                          addButton: false,
                                          id: "uniqueRuleTable",
                                          name: "uniqueRuleTable",
                                          rowKey: "id",
                                          showSelect: true,
                                          form: "uniqueRuleForm",
                                          unEditable: false,
                                          type: "checkbox",
                                          showRowDeleteButton: true,
                                          visible:false,
                                          columns: [
                                              {
                                                  "id": "filedName",
                                                  "enabled": true,
                                                  "type": "selectField",
                                                  "title": "规则字段",
                                                  "name": "filedName",
                                                  "form": "uniqueRuleForm",
                                                  dataSource: {
                                                      type: "api",
                                                      method: "post",
                                                      url: "/sm/dictionaryEnumValue/query.action",
                                                      mode: "payload",
                                                      payload: {
                                                          "query": {
                                                              "query": [
                                                                  {
                                                                      "field": "smDictionaryEnumGid", "type": "eq", "value":  "56B3C94406A94EE3E055000000000001"
                                                                  }
                                                              ],
                                                              "sorted": "seq"
                                                          }
                                                      }
                                                  },
                                                  displayField: "val",
                                                  valueField: "gid",
                                              }
                                          ],
                                          subscribes: [
                                              {
                                                  event: 'uniqueRuleTable.onSelectedRows',
                                                  behaviors: [
                                                      {
                                                          type: "fetch",
                                                          id: "uniqueRuleTable", //要从哪个组件获取数据
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
              </Col>
          </Row>

      </div>
    );
  }
}

MdOrderUniqueRulePage.propTypes = {
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
let UniqueRuleForm = reduxForm({
    config:{id:"ruleId"},
    form: "uniqueRuleForm",
    validate
})(MdOrderUniqueRulePage)

export default connect(mapStateToProps, mapDispatchToProps)(UniqueRuleForm)




