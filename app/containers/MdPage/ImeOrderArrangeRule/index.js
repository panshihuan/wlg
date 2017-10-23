/*
 *
 * ImeOrderArrangeRule
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import AppButton from 'components/AppButton';
import TableField from 'components/Form/TableField';
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import pubsub from 'pubsub-js';
import { Link } from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import TextField from 'components/Form/TextField'
import TreeField from 'components/Form/TreeField'
import FindbackField from 'components/Form/FindbackField'
import SelectField from 'components/Form/SelectField'

const validate = values => {
    const errors = {}
    if (!values.get('code')) {
        errors.code = '必填项'
    }
    if (!values.get('name')) {
        errors.name = '必填项'
    }
    if (!values.get('type') ) {
        errors.type = '必填项'
    }

    let vv= values.toJS();

    if (!vv.mdSortRuleDetailDTOs || !vv.mdSortRuleDetailDTOs.length) {
        //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.mdSortRuleDetailDTOs.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.ruleField) {
                memberErrors.ruleField = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
        })
        if (membersArrayErrors.length) {
            errors.mdSortRuleDetailDTOs = membersArrayErrors
        }
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
    let className = "com.neusoft.ime.md.mdSortRule.dto.MdSortRuleDTO";
    let fieldNames = "code,delete";
    let fieldValues = values.get('code') + ",0";
    let gid = (values.get('gid')!=undefined && values.get('gid')!='')?values.get('gid'):''
    console.log(values.get('gid'))

    return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:gid,  className:className,fieldNames:fieldNames,fieldValues,fieldValues} }).then(function (res) {

        resolve(res)
    })).then(function (res) {
        if(!res.data){
            throw { code: "已存在" }
        }

    })

}

export class ImeOrderArrangeRule extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
    }
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>生产管理</Breadcrumb.Item>
              <Breadcrumb.Item>设置</Breadcrumb.Item>
              <Breadcrumb.Item>编排规则方案</Breadcrumb.Item>
          </Breadcrumb>
          <div className="wrapper">
              <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                    bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                  <Row>
                      <Col span={8}>
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
                                            resolveFetch({fetch:{id:'deleteBtn',data:'dataContext'}}).then(function(value){
                                                console.log(value)
                                                if(value && value!=0 && value!=''){
                                                      let dataSource = {
                                                        mode: "dataContext",
                                                        type: "api",
                                                        method: "POST",
                                                        url:  "/ime/mdSortRule/findById?id=" + value
                                                      }
                                                   resolveDataSourceCallback({dataSource:dataSource},function(data){
                                                    let initData = {};
                                                    initData = data.data
                                                    console.log(initData);
                                                    pubsub.publish("@@form.init", { id: "arrangeRuleForm", data: initData})
                                                    })
                                                }else{
                                                    pubsub.publish("@@form.init", { id: "arrangeRuleForm", data: {}})
                                                }
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
                              id: "refreshTreeBtn",
                              title: "刷新树",
                              type: "primary",
                              size: "large",
                              visible: false,
                              enabled: true,
                              subscribes: [
                                  {
                                      event: "refreshTreeBtn.click",
                                      pubs: [
                                          {
                                              event: 'refreshTreeBtn.expression',
                                              meta: {
                                                  expression: `
                                            resolveFetch({fetch:{id:'deleteBtn',data:'dataContext'}}).then(function(value){
                                                console.log(value)
                                                if(value && value!=0 && value!=''){
                                                      let dataSource = {
                                                        mode: "dataContext",
                                                        type: "api",
                                                        method: "POST",
                                                        url:  "/ime/mdSortRule/findById?id=" + value
                                                      }
                                                   resolveDataSourceCallback({dataSource:dataSource},function(data){
                                                    let initData = {};
                                                    initData = data.data
                                                    console.log(initData);
                                                    pubsub.publish("@@form.init", { id: "arrangeRuleForm", data: initData})
                                                    })
                                                }else{
                                                    pubsub.publish("@@form.init", { id: "arrangeRuleForm", data: {}})
                                                }
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
                                              event: "createBtn.expression",
                                              meta: {
                                                  expression: `
                                                     pubsub.publish("@@form.init", {id: "arrangeRuleForm", data: {}});
                                                    `
                                              }

                                          }
                                      ]
                                  },
                                  {
                                      event: "createBtn.click",
                                      pubs: [
                                          {
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
                                          },
                                          {
                                              event: "modifyBtn.visible",
                                              payload: false
                                          },
                                          {
                                              event: "saveCreateBtn.visible",
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
                                              event:"saveCreateBtn.enabled",
                                              payload:true
                                          }
                                          ,
                                          {
                                              event:"code.enabled",
                                              payload:true
                                          }
                                          ,
                                          {
                                              event:"name.enabled",
                                              payload:true
                                          }
                                          ,
                                          {
                                              event:"type.enabled",
                                              payload:true
                                          }
                                          ,
                                          {
                                              event:"detailTable.activateAll",
                                              payload:true
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
                                          ,
                                          {
                                              event:"code.enabled",
                                              payload:true
                                          }
                                          ,
                                          {
                                              event:"name.enabled",
                                              payload:true
                                          }
                                          ,
                                          {
                                              event:"type.enabled",
                                              payload:true
                                          }
                                          ,
                                          {
                                              event:"detailTable.activateAll",
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
                                      pubs: [
                                          {
                                              event:"deleteBtn.expression",
                                              meta: {
                                                  expression:`
                                                console.log(dataContext);
                                                if(dataContext && dataContext!=0 && dataContext!=''){
                                                    let dataSource= {
                                                        type: "api",
                                                        mode:"dataContext",
                                                        method: "POST",
                                                        paramsInQueryString:true,
                                                        url: "/ime/mdSortRule/delete.action?id="+dataContext,
                                                    }
                                                    let onSuccess = function(response){
                                                        if(response.success){
                                                            pubsub.publish("@@message.success","删除成功")
                                                            pubsub.publish("@@form.init", { id: "equipmentTypeForm", data: Immutable.fromJS("") });
                                                            pubsub.publish("arrangeRuleTree.loadData");
                                                        }else{
                                                            pubsub.publish("@@message.error","删除失败");
                                                        }
                                                    }
                                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:undefined},onSuccess);
                                                }
                                              `
                                              }
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
                                                  resolveFetch({fetch:{id:'arrangeRuleForm',data:'@@formValues'}}).then(function(data){
                                                        //console.log(data);
                                                        let dataSource= {
                                                        type: 'api',
                                                        method: 'POST',
                                                        mode:"payload",
                                                        url: '/ime/mdSortRule/modify.action',
                                                        payload: data
                                                      };
                                                      if(submitValidateForm("arrangeRuleForm")){

                                                      }else{
                                                        let checkGid = '';
                                                        let flag = true;
                                                        console.log(data)
                                                        console.log(data.mdSortRuleDetailDTOs)
                                                        console.log(data.mdSortRuleDetailDTOs.length)

                                                        if(data && data.mdSortRuleDetailDTOs && data.mdSortRuleDetailDTOs.length>0){
                                                               for(var i=0;i<data.mdSortRuleDetailDTOs.length;i++){
                                                                    if(checkGid.indexOf(data.mdSortRuleDetailDTOs[i].ruleField)>=0){
                                                                        console.log(checkGid);
                                                                        pubsub.publish("@@message.error","保存失败,规则字段重复!");
                                                                        flag = false
                                                                        break;
                                                                    }else{
                                                                        checkGid+=data.mdSortRuleDetailDTOs[i].ruleField+','
                                                                    }
                                                                }
                                                        }
                                                         //console.log(checkGid);
                                                         if(flag){
                                                            resolveDataSourceCallback({dataSource:dataSource},function(response){
                                                              if(response.success) {
                                                                pubsub.publish("@@message.success","保存成功");
                                                                pubsub.publish("cancelBtn.click");
                                                                pubsub.publish("arrangeRuleTree.loadData");
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
                              id: "saveCreateBtn",
                              title: "保存",
                              type: "primary",
                              size: "large",
                              visible: false,
                              enabled: true,
                              subscribes: [
                                  {
                                      event: "saveCreateBtn.click",
                                      pubs: [
                                          {
                                              event: "saveCreateBtn.expression",
                                              meta: {
                                                  expression: `
                                                  resolveFetch({fetch:{id:'arrangeRuleForm',data:'@@formValues'}}).then(function(data){
                                                        //console.log(data);
                                                        let dataSource= {
                                                        type: 'api',
                                                        method: 'POST',
                                                        mode:"payload",
                                                        url: '/ime/mdSortRule/add.action',
                                                        payload: data
                                                      };
                                                      if(submitValidateForm("arrangeRuleForm")){

                                                      }else{
                                                        let checkGid = '';
                                                        let flag = true;
                                                        console.log(data)
                                                        console.log(data.mdSortRuleDetailDTOs)
                                                        console.log(data.mdSortRuleDetailDTOs.length)

                                                        if(data && data.mdSortRuleDetailDTOs && data.mdSortRuleDetailDTOs.length>0){
                                                               for(var i=0;i<data.mdSortRuleDetailDTOs.length;i++){
                                                                    if(checkGid.indexOf(data.mdSortRuleDetailDTOs[i].ruleField)>=0){
                                                                        console.log(checkGid);
                                                                        pubsub.publish("@@message.error","保存失败,规则字段重复!");
                                                                        flag = false
                                                                        break;
                                                                    }else{
                                                                        checkGid+=data.mdSortRuleDetailDTOs[i].ruleField+','
                                                                    }
                                                                }
                                                        }
                                                         //console.log(checkGid);
                                                         if(flag){
                                                            resolveDataSourceCallback({dataSource:dataSource},function(response){
                                                              if(response.success) {
                                                                pubsub.publish("@@message.success","保存成功");
                                                                pubsub.publish("cancelBtn.click");
                                                                pubsub.publish("arrangeRuleTree.loadData");
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
                                              event: "detailAdd.enabled",
                                              payload: false
                                          },
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
                                              event: "saveCreateBtn.visible",
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
                                              event:"cleanBtn.click"
                                          }
                                          ,
                                          {
                                              event: "detailTable.clearSelect"
                                          }
                                          ,
                                          {
                                              event:"detailTable.activateAll",
                                              payload:false
                                          },
                                          {
                                              event:"code.enabled",
                                              payload:false
                                          }
                                          ,
                                          {
                                              event:"name.enabled",
                                              payload:false
                                          }
                                          ,
                                          {
                                              event:"type.enabled",
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
                  <Col span={ 7 }>
                      <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                          <Field config={{
                              id: 'arrangeRuleTree',
                              search: false,
                              enabled: true,
                              visible: true,
                              checkable: false,
                              showLine: true,
                              draggable: false,
                              searchBoxWidth: 300,
                              dataSource: {
                                  type: "api",
                                  method: "POST",
                                  url: '/ime/mdSortRule/getTree'
                              },
                              subscribes: [
                                  {
                                      event:'arrangeRuleTree.onSelect',
                                      pubs:[{
                                          event: 'arrangeRuleTree.expression',
                                          eventPayloadExpression: `
                                            console.log(eventPayload);
                                            var id = eventPayload.info.node.props['data-item'].id;
                                            if(id && id!=0){
                                                var dataSource = {
                                                  type: "api",
                                                  method: "post",
                                                  url: "/ime/mdSortRule/findById?id=" + id
                                                }
                                                resolveDataSource({dataSource: dataSource}).then(function(data) {
                                                  console.log(data);
                                                  if(data.success) {
                                                    pubsub.publish("deleteBtn.enabled", true);
                                                    pubsub.publish("modifyBtn.enabled", true);
                                                    pubsub.publish("@@form.init", {id: "arrangeRuleForm", data: Immutable.fromJS(data.data)})
                                                     pubsub.publish("detailTable.activateAll",false);
                                                  } else {
                                                    pubsub.publish("deleteBtn.enabled", false);
                                                    pubsub.publish("modifyBtn.enabled", false);
                                                    pubsub.publish("@@form.init", {id: "arrangeRuleForm", data: Immutable.fromJS({})})
                                                  }
                                                });
                                            }else{
                                                pubsub.publish("deleteBtn.enabled", false);
                                                pubsub.publish("modifyBtn.enabled", false);
                                                pubsub.publish("@@form.init", {id: "arrangeRuleForm", data: Immutable.fromJS({})})
                                            }
                                            pubsub.publish("deleteBtn.dataContext",{eventPayload:id});
                                            pubsub.publish("cancelBtn.click");

                      `
                                      }]
                                  },
                              ]
                          }} name="tree"  component={ TreeField } />
                      </Card>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={16} >
                      <Card bordered={true} style={{ marginTop: "20px" }}>
                          <Row style={{marginTop: "30px"}}>
                              <Col span={11}>
                                  <Field config={{
                                      enabled: false,
                                      id: "code",
                                      label: "编排方案编码",  //标签名称
                                      labelSpan: 8,   //标签栅格比例（0-24）
                                      wrapperSpan: 16,  //输入框栅格比例（0-24）
                                      showRequiredStar: true,  //是否显示必填星号
                                      placeholder: "请输入"
                                  }} component={TextField} name="code" />
                              </Col>
                              <Col span={2}>
                              </Col>
                              <Col span={11}>
                                  <Field config={{
                                      enabled: false,
                                      id: "name",
                                      label: "编排方案名称",  //标签名称
                                      labelSpan: 8,   //标签栅格比例（0-24）
                                      wrapperSpan: 16,  //输入框栅格比例（0-24）
                                      showRequiredStar: true,  //是否显示必填星号
                                      placeholder: "请输入"
                                  }} component={TextField} name="name" />
                              </Col>
                          </Row>
                          <Row>
                              <Col span={11}>
                                  <Field config={{
                                      id: "type",
                                      label: "编排方案类型",  //标签名称
                                      labelSpan: 8,   //标签栅格比例（0-24）
                                      wrapperSpan: 16,  //输入框栅格比例（0-24）
                                      placeholder:"请选择方案类型",
                                      showRequiredStar: true,
                                      enabled:false,
                                      dataSource: {
                                          type: "api",
                                          method: "post",
                                          url: "/ime/mdSortRule/getArrangeTypeCombox.action"
                                      },
                                      displayField: "value",
                                      valueField: "id",
                                      subscribes:[
                                          {
                                              event:"type.onChange",
                                              pubs:[
                                                  {
                                                      event: 'type.expression',
                                                      meta: {
                                                          expression: `
                          resolveFetch({fetch:{id:'arrangeRuleForm',data:'@@formValues'}}).then(function(data){
                            console.log(data);
                            data.mdSortRuleDetailDTOs = [];
                            pubsub.publish("@@form.init", {id: "arrangeRuleForm", data: data})
                          })
                      `
                                                      }
                                                  },
                                              ]
                                          }
                                      ]
                                  }} component={SelectField} name="type" />
                              </Col>
                              <Col span={13}></Col>
                          </Row>
                          <Row>
                              <Col>
                                  <AppButton config={{
                                      id: "detailAdd",
                                      title: "增加",
                                      visible: true,
                                      enabled: false,
                                      type: 'primary',
                                      subscribes: [
                                          {
                                              event: "detailAdd.click",
                                              pubs: [
                                                  {
                                                      event: "detailTable.addRow"
                                                  }
                                              ]
                                          }
                                      ]
                                  }}>
                                  </AppButton>
                                  <FieldArray name="mdSortRuleDetailDTOs" config={
                                      {
                                          "id": "detailTable",
                                          "name": "detailTable",
                                          "form":"arrangeRuleForm",
                                          "rowKey": "gid",
                                          "addButton":false,
                                          "showSelect":true,
                                          "unEditable":false,
                                          "type":"checkbox",
                                          columns: [
                                              {
                                                  "id": "ruleField",
                                                  "enabled": true,
                                                  "type": "selectField",
                                                  "title": "规则字段",
                                                  "name": "ruleField",
                                                  "form": "orderArrangeRuleForm",
                                                  dataSource: {
                                                      type: "api",
                                                      method: "post",
                                                      url: "/ime/mdSortRule/getArrangeFieldCombox.action",
                                                      bodyExpression:`
                                                 resolveFetch({fetch:{id:"arrangeRuleForm",data:"@@formValues"}}).then(function (data) {
                                                    console.log(data);
                                                    console.log(data.type);
                                                    if(data && data.type && data.type!=null){
                                                        callback({type:data.type});
                                                    }else{
                                                        callback({type:'happy'});
                                                    }
                                                 })
                                               `
                                                  },
                                                  displayField: "value",
                                                  valueField: "id",
                                              },
                                              {
                                                  "id": "sortOrder",
                                                  "enabled": true,
                                                  "type": "selectField",
                                                  "title": "正序/逆序",
                                                  "name": "sortOrder",
                                                  "form": "orderArrangeRuleForm",
                                                  dataSource: {
                                                      type: "api",
                                                      method: "post",
                                                      url: "/ime/mdSortRule/getRuleOrderCombox.action",
                                                  },
                                                  displayField: "value",
                                                  valueField: "id",
                                              }
                                          ],
                                      }
                                  } component={TableField} />
                              </Col>
                          </Row>
                      </Card>
                  </Col>
              </Row>
          </div>

      </div>
    );
  }
}

ImeOrderArrangeRule.propTypes = {
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
let imeOrderArrangeRule = reduxForm({
    form: "arrangeRuleForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['code']
})(ImeOrderArrangeRule)


export default connect(mapStateToProps, mapDispatchToProps)(imeOrderArrangeRule);
