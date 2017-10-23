/*
 *
 * MdEquipmentTypePage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb , Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import AppButton from "components/AppButton";
import TextField from 'components/Form/TextField';
import SelectField from 'components/Form/SelectField';
import TableField from 'components/Form/TableField';
import FindbackField from 'components/Form/FindbackField';
import pubsub from 'pubsub-js';
import Immutable from 'immutable';
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil';
import { reduxForm, Field, FieldArray } from 'redux-form/immutable';
import TreeField from '../../../components/Form/TreeField';

const validate = values => {
    const errors = {}
    if (!values.get('code')) {
        errors.code = '必填项'
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

    let className = "com.neusoft.ime.md.mdEquipmentType.dto.MdEquipmentTypeDTO";
    let fieldNames = "code,delete";
    let fieldValues = values.get('code') + ",0";
    let gid = (values.get('gid')!=undefined && values.get('gid')!='')?values.get('gid'):''

    console.log(values.get('gid'))

    return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:gid,  className:className,fieldNames:fieldNames,fieldValues,fieldValues} }).then(function (res) {
        resolve(res)
    })).then(function (res) {
        if (!res.data) {
            throw {code:'已存在!'};
        }
    })
}

export class MdEquipmentTypePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>业务建模</Breadcrumb.Item>
              <Breadcrumb.Item>设备</Breadcrumb.Item>
              <Breadcrumb.Item>设备分类</Breadcrumb.Item>
          </Breadcrumb>

          <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
              <Row>
                  <Col>
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
                                          event:"createBtn.expression",
                                          meta: {
                                              expression:`
                                                pubsub.publish("cancelBtn.dataContext", {
                                                    eventPayload:"1"
                                                });
                                                pubsub.publish("@@form.change",  { id: "equipmentTypeForm",name:"gid" ,value: "" });
                                                pubsub.publish("@@form.change",  { id: "equipmentTypeForm",name:"code" ,value: "" });
                                                pubsub.publish("@@form.change",  { id: "equipmentTypeForm",name:"name" ,value: "" });
                                                resolveFetch({fetch:{id:"modifyBtn",data:"dataContext"}}).then(function (data) {
                                                    console.log(data);
                                                    if(data!=undefined){
                                                        if(data.eventPayload.selectedKeys[0]=="0"){
                                                            pubsub.publish("@@form.change",  { id: "equipmentTypeForm",name:"parentTypeGidRef.name" ,value: "" });
                                                        }else{
                                                            pubsub.publish("@@form.change",  { id: "equipmentTypeForm",name:"parentTypeGidRef.name" ,value: data.eventPayload.info.selectedNodes["0"].props["data-item"].text });
                                                        }
                                                    }else{
                                                        pubsub.publish("@@form.change",  { id: "equipmentTypeForm",name:"parentTypeGidRef.name" ,value: "" });
                                                    }
                                                });
                                              `
                                          }
                                      },
                                      {
                                          event: "code.enabled",
                                          payload: true
                                      },
                                      {
                                          event: "name.enabled",
                                          payload: true
                                      },
                                      {
                                          event: "parentTypeGidRef.name.enabled",
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
                                          event: "deleteBtn.visible",
                                          payload: false
                                      },
                                      {
                                          event: "saveBtn.visible",
                                          payload: true
                                      },
                                      {
                                          event: "cancelBtn.visible",
                                          payload: true
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
                                          event: "code.enabled",
                                          payload: true
                                      },
                                      {
                                          event: "name.enabled",
                                          payload: true
                                      },
                                      {
                                          event: "parentTypeGidRef.name.enabled",
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
                                          event: "deleteBtn.visible",
                                          payload: false
                                      },
                                      {
                                          event: "saveBtn.visible",
                                          payload: true
                                      },
                                      {
                                          event: "cancelBtn.visible",
                                          payload: true
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
                          enabled: true,
                          subscribes: [
                              {
                                  event: "saveBtn.click",
                                  pubs: [
                                      {
                                          event:"saveBtn.expression",
                                          meta: {
                                              expression:`
                                                   resolveFetch({fetch:{id:"equipmentTypeForm",data:"@@formValues"}}).then(function (data) {
                                                        resolveFetch({fetch:{id:'cancelBtn',data:'dataContext'}}).then(function(dt){
                                                            if(dt!=1){
                                                                let dataSource = {
                                                                    mode: "dataContext",
                                                                    type: "api",
                                                                    method: "POST",
                                                                    url: "/ime/mdEquipmentType/modify.action?id="+data.gid
                                                                }
                                                                resolveDataSourceCallback({dataSource:dataSource, dataContext: data },
                                                                    function(res){
                                                                        if(res.success){
                                                                            pubsub.publish("@@message.success", "修改成功");
                                                                            pubsub.publish('equipmentTypeTree.loadData');
                                                                        }else{
                                                                            pubsub.publish("@@message.error",response.data);
                                                                        }
                                                                }, function(e){
                                                                        console.log(e);
                                                                        pubsub.publish("@@message.error",修改失败);
                                                                        // pubsub.publish("@@navigator.push", {url: "/mdEquipmentType"});
                                                                });
                                                            }else{
                                                                let dataSource = {
                                                                    mode: "dataContext",
                                                                    type: "api",
                                                                    method: "POST",
                                                                    url: "/ime/mdEquipmentType/add.action"
                                                                }
                                                                data.gid = "";
                                                                resolveDataSourceCallback({ dataSource:dataSource, dataContext: data },
                                                                    function(res){
                                                                        if(res.success){
                                                                            console.log(res);
                                                                            pubsub.publish("@@message.success", "创建成功");
                                                                            pubsub.publish("cancelBtn.dataContext", {
                                                                                eventPayload:"0"  //默认为0  为1时是创建
                                                                            });
                                                                            pubsub.publish('equipmentTypeTree.loadData');
                                                                        }else{
                                                                            pubsub.publish("@@message.error",res.data);
                                                                        }

                                                                    },
                                                                    function(e){
                                                                        console.log(e);
                                                                        pubsub.publish("@@message.error", "创建失败");
                                                                });
                                                            }
                                                        });

                                                 })

                                              `
                                          }
                                      },
                                      {
                                          event: "code.enabled",
                                          payload: false
                                      },
                                      {
                                          event: "name.enabled",
                                          payload: false
                                      },
                                      {
                                          event: "parentTypeGidRef.name.enabled",
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
                                          event: "deleteBtn.visible",
                                          payload: true
                                      },
                                      {
                                          event: "saveBtn.visible",
                                          payload: false
                                      },
                                      {
                                          event: "cancelBtn.visible",
                                          payload: false
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
                          visible: false,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "cancelBtn.click",
                                  pubs: [
                                      {
                                          event: "code.enabled",
                                          payload: false
                                      },
                                      {
                                          event: "name.enabled",
                                          payload: false
                                      },
                                      {
                                          event: "parentTypeGidRef.name.enabled",
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
                                          event: "deleteBtn.visible",
                                          payload: true
                                      },
                                      {
                                          event: "saveBtn.visible",
                                          payload: false
                                      },
                                      {
                                          event: "cancelBtn.visible",
                                          payload: false
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
                                                console.log(me);
                                                if(me.dataContext!=undefined){
                                                    let id = me.dataContext[0]||"";
                                                    console.log(id)
                                                    let dataSource= {
                                                        type: "api",
                                                        mode:"dataContext",
                                                        method: "POST",
                                                        paramsInQueryString:true,
                                                        url: "/ime/mdEquipmentType/delete.action?id="+id,
                                                    }
                                                    let onSuccess = function(response){
                                                        if(response.success){
                                                            pubsub.publish("@@message.success","删除成功")
                                                            pubsub.publish('equipmentTypeTree.loadData');
                                                            pubsub.publish("@@form.init", { id: "equipmentTypeForm", data: Immutable.fromJS("") })
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
                  </Col>
              </Row>
          </Card>

          <Row>
              <Col span={ 5 }>
                  <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                      <Field config={{
                          id: 'equipmentTypeTree',
                          search: false,
                          enabled: true,
                          visible: true,
                          checkable: false,
                          showLine: true,
                          draggable: false,
                          form: "equipmentTypeForm",
                          searchBoxWidth: 300,
                          dataSource: {
                              type: "api",
                              method: "POST",
                              url: '/ime/mdEquipmentType/getEquipmentTypeTree.action'
                          },
                          subscribes: [
                              {
                                  event: 'equipmentTypeTree.onSelect',
                                  pubs: [
                                      {
                                          event: "modifyBtn.enabled",
                                          payload: true
                                      },
                                      {
                                          event:"equipmentTypeTree.expression",
                                          meta: {
                                              expression: `
                                                let condition = data.eventPayload.selectedKeys[0];
                                                pubsub.publish("modifyBtn.dataContext",{
                                                    eventPayload:data
                                                });
                                                pubsub.publish("deleteBtn.dataContext",{
                                                      eventPayload:me.state.selectedKeys
                                                });
                                                if(data.eventPayload.info.selectedNodes["0"].props.children==undefined){
                                                    pubsub.publish("deleteBtn.enabled", true);
                                                }else{
                                                    pubsub.publish("deleteBtn.enabled", false);
                                                }
                                                //回填表单
                                                let dataSource= {
                                                  type: "api",
                                                  mode:"dataContext",
                                                  method: "POST",
                                                  url: "/ime/mdEquipmentType/findById.action?id="+condition
                                                };
                                                resolveDataSourceCallback({dataSource:dataSource, dataContext: {}},
                                                  function(res){
                                                    if(res.success){
                                                        pubsub.publish("@@form.init", { id: "equipmentTypeForm", data: Immutable.fromJS(res.data) })
                                                        //pubsub.publish("@@form.change",  { id: "equipmentTypeForm",name:"gid" ,value: fromJS(res.data.gid) })
                                                        //pubsub.publish("@@form.change",  { id: "equipmentTypeForm",name:"code" ,value: fromJS(res.data.code) })
                                                        //pubsub.publish("@@form.change",  { id: "equipmentTypeForm",name:"name" ,value: fromJS(res.data.name) })
                                                        pubsub.publish("@@form.change",  { id: "equipmentTypeForm",name:"parentTypeGidRef.name" ,value: fromJS(res.data.parentTypeGidRef.name) })
                                                        pubsub.publish("@@form.change",  { id: "equipmentTypeForm",name:"parentTypeGid" ,value: fromJS(res.data.parentTypeGidRef.gid) })
                                                    }
                                                  },
                                                  function(){
                                                  }
                                                )
                                              `
                                          }
                                      }
                                  ]
                              }
                          ]
                      }} name="equipmentTypeTree"  component={ TreeField } />
                  </Card>
              </Col>

              <Col span={1}>
              </Col>

              <Col span={ 18 } >
                  <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                      <Row>
                          <Col span={8}>
                              <Field config={{
                                  enabled: false,
                                  id: "code",
                                  label: "分类编码",  //标签名称
                                  labelSpan: 8,   //标签栅格比例（0-24）
                                  wrapperSpan: 16,  //输入框栅格比例（0-24）
                                  form: "equipmentTypeForm",
                                  showRequiredStar: true,  //是否显示必填星号
                                  placeholder: "请输入分类编码"
                              }} component={TextField} name="code" />
                          </Col>
                          <Col span={8}>
                              <Field config={{
                                  enabled: false,
                                  id: "name",
                                  label: "分类名称",  //标签名称
                                  labelSpan: 8,   //标签栅格比例（0-24）
                                  wrapperSpan: 16,  //输入框栅格比例（0-24）
                                  form: "equipmentTypeForm",
                                  placeholder: "请输入分类名称"
                              }} component={TextField} name="name" />
                          </Col>
                          <Col span={8}>
                              <Field config={{
                                  enabled: false,
                                  id: "parentTypeGidRef.name",
                                  label: "上级分类名称",  //标签名称
                                  labelSpan: 8,   //标签栅格比例（0-24）
                                  wrapperSpan: 16,  //输入框栅格比例（0-24）
                                  form: "equipmentTypeForm",
                                  showRequiredStar: false,  //是否显示必填星号
                                  placeholder: "请输入上级分类名称",
                                  tableInfo: {
                                      id: "parentTypeGidRef",
                                      size: "small",
                                      rowKey: "gid",
                                      width:"500",
                                      tableTitle: "上级分类参照",
                                      columns: [
                                          { title: '分类编码', dataIndex: 'code', key: '2', width: 200 },
                                          { title: '分类名称', dataIndex: 'name', key: '1', width: 200 },
                                          { title: '上级分类名称', dataIndex: 'parentTypeGidRef.name', key: '3', width: 230 }
                                      ],
                                      dataSource: {
                                          type: 'api',
                                          method: 'POST',
                                          url: '/ime/mdEquipmentType/query.action',
                                          bodyExpression:`
                                            resolveFetch({fetch:{id:'modifyBtn',data:'dataContext'}}).then(function(treeNode){
                                                console.log(treeNode);
                                                let getTreeNode = function(treeNode){
                                                    var node = "";
                                                    /*console.log(treeNode.props.children);*/
                                                    if(treeNode.props.children!=null && treeNode.props.children.length>0){
                                                        node += treeNode.key+","
                                                        for(var i in treeNode.props.children){
                                                            node += getTreeNode(treeNode.props.children[i])
                                                        }
                                                    }else{
                                                        node += treeNode.key+","
                                                    }
                                                    return node
                                                }
                                                if(treeNode==undefined || treeNode.eventPayload.info.selectedNodes[0]=='0'){
                                                    callback({});

                                                }else{
                                                    let nodeGid = getTreeNode(treeNode.eventPayload.info.selectedNodes[0]);
                                                    callback({
                                                        query:{
                                                            query:[
                                                            {
                                                                left:"(",
                                                                field:"gid",
                                                                type:"noin",
                                                                value:nodeGid.substring(0, nodeGid.lastIndexOf(",")),
                                                                right:")",
                                                                operator:"and"
                                                            }]
                                                        }
                                                    });
                                                }
                                            })
                                          `
                                      }
                                  },
                                  pageId: 'parentTypeGidRef',
                                  valueField: {
                                      "from": "name",
                                      "to": "parentTypeGidRef.name"
                                  },
                                  associatedFields: [
                                      {
                                          "from": "gid",
                                          "to": "parentTypeGid"
                                      },
                                      {
                                          "from": "code",
                                          "to": "parentTypeGidRef.code"
                                      },
                                      {
                                          "from": "name",
                                          "to": "parentTypeGidRef.name"
                                      }
                                  ]
                              }} component={FindbackField} name="parentTypeGidRef.name" />
                          </Col>
                      </Row>
                  </Card>
              </Col>
          </Row>
      </div>
    );
  }
}



MdEquipmentTypePage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
    form: "equipmentTypeForm",
    validate,
    asyncValidate,
    asyncBlurFields: ['code']
})(MdEquipmentTypePage)
