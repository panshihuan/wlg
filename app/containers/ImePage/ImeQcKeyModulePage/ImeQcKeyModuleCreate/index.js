/*
 *
 * ImeQcKeyModuleCreate
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col,Tabs } from 'antd';
import { Link } from 'react-router';
import AppButton from 'components/AppButton';
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

import TextField from 'components/Form/TextField'
import SelectField from 'components/Form/SelectField'
import TableField from 'components/Form/TableField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import CheckBoxField from 'components/Form/CheckBoxField'
import Immutable from 'immutable'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'

const TabPane = Tabs.TabPane;
const validate = values => {
    const errors = {}
    if (!values.getIn(['mdProductInfoGidRef','materialGidRef','code'])) {
        errors.mdProductInfoGidRef={}
        errors.mdProductInfoGidRef.materialGidRef={}
        errors.mdProductInfoGidRef.materialGidRef.code = '必填项'
    }
    return errors
}
export class ImeQcKeyModuleCreate extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>质量管理</Breadcrumb.Item>
              <Breadcrumb.Item>关键件</Breadcrumb.Item>
              <Breadcrumb.Item>关键件详情</Breadcrumb.Item>
          </Breadcrumb>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
              <Row>
                  <AppButton config={{
                      id: "imeQcKeyModuleSave02",
                      title: "保存",
                      visible: true,
                      enabled: true,
                      type: "primary",
                     /* subscribes: [
                          {
                              event: "imeQcKeyModuleSave02.click",
                              behaviors: [
                                  {
                                      type: "request",
                                      dataSource: {
                                          type: "api",
                                          method: "POST",
                                          url: "/ime/mdDefOperation/saveList.action",
                                          withForm:"Create"

                                      },
                                      successPubs: [  //获取数据完成后要发送的事件
                                          {
                                              event: "@@navigator.push",
                                              payload: {
                                                  url: "/mdDefOperation"
                                              }
                                          }, {
                                              event: "@@message.success",
                                              payload: "新增成功"
                                          }
                                      ],
                                      errorPubs: [
                                          {
                                              event: "@@message.error",
                                              payload: "新增失败"
                                          }
                                      ]
                                  }
                              ],
                              pubs: [
                                  {
                                      /!*event: "@@navigator.push",
                                      payload: {
                                        url: "/imeOrder"
                                      },*!/

                                  }
                              ]
                          }
                      ]*/
                  }}></AppButton>
                  <AppButton config={{
                      id: "imeQcKeyModuleCancel02",
                      title: "取消",
                      visible: true,
                      enabled: true,
                      type: "primary",
                      subscribes: [
                          {
                              event: "imeQcKeyModuleCancel02.click",
                              pubs: [
                                  {
                                      event: "@@navigator.push",
                                      payload: {
                                          url: "/imeQcKeyModule"
                                      }
                                  }
                              ]
                          }
                      ]
                  }}></AppButton>
                 {/* <AppButton config={{
                      id: "imeQcKeyModuleBinding02",
                      title: "绑定",
                      visible: true,
                      enabled: true,
                      type: "primary",
                      subscribes: [
                          {
                              event: "imeQcKeyModuleBinding02.click",

                              behaviors:[
                                  {
                                      type:"fetch",
                                      id:"imeQcKeyModuleInfoDTOs",
                                      data:"selectedRows",
                                      successPubs:[
                                          {
                                              event:"@@form.init",
                                              eventPayloadExpression:`
                                                console.log(1111111111)
                                                let list = eventPayload
                                                let dataSource = {
                                                    type: "api",
                                                    mode:"payload",
                                                    method: "POST",
                                                    url: "/ime/imeQcKeyModule/saveList.action",
                                                    payload: list
                                                }
                                                let onSuccess = function(response){
                                                if(response.success) {
                                                    pubsub.publish("@@message.success","绑定成功");
                                                    pubsub.publish("imeQcKeyModuleInfoDTOs.loadData")
                                                }
                                                  else {
                                                    pubsub.publish("@@message.error","绑定失败");
                                                  }
                                              }
                                              resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                              `
                                          }
                                      ]
                                  }
                              ],
                          }
                      ]
                  }}></AppButton>
                  <AppButton config={{
                      id: "imeQcKeyModuleUnbundling02",
                      title: "解绑",
                      visible: true,
                      enabled: true,
                      type: "primary",
                      subscribes: [
                          {
                              event: "imeQcKeyModuleUnbundling02.click",
                              behaviors:[
                                  {
                                      type:"fetch",
                                      id:"imeQcKeyModuleInfoDTOs",
                                      data:"selectedRows",
                                      successPubs:[
                                          {
                                              event:"@@form.init",
                                              eventPayloadExpression:`
                                                console.log(1111111111)
                                                let list = eventPayload

                                                let dataSource = {
                                                    type: "api",
                                                    mode:"payload",
                                                    method: "POST",
                                                    url: "/ime/imeQcKeyModule/saveList.action",
                                                    payload: list
                                                }
                                                let onSuccess = function(response){
                                                if(response.success) {
                                                    pubsub.publish("@@message.success","解绑成功");
                                                    pubsub.publish("imeQcKeyModuleInfoDTOs.loadData")
                                                }
                                                  else {
                                                    pubsub.publish("@@message.error","解绑失败");
                                                  }
                                              }
                                              resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                              `
                                          }
                                      ]
                                  }
                              ],
                          }
                      ]
                  }}></AppButton>*/}
              </Row>
          </Card>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "barCode",
                          label: "序列号",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          //showRequiredStar: true,  //是否显示必填星号
                          //placeholder: "请输入序列号"
                      }} component={TextField} name="barCode" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "mdProductInfoGidRef.materialGidRef.code",
                          label: "产品编码",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: true,  //是否显示必填星号
                          //placeholder: "请输入编码"
                      }} component={TextField} name="mdProductInfoGidRef.materialGidRef.code" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "mdProductInfoGidRef.materialGidRef.name",
                          label: "产品名称",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          //showRequiredStar: true,  //是否显示必填星号
                          //placeholder: "请输入名称"
                      }} component={TextField} name="mdProductInfoGidRef.materialGidRef.name" />
                  </Col>

                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "mdProductInfoGidRef.materialGidRef.spec",
                          label: "规格",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          //showRequiredStar: true,  //是否显示必填星号
                          //placeholder: "请输入"
                      }} component={TextField} name="mdProductInfoGidRef.materialGidRef.spec" />
                  </Col>
              </Row>
              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "mdProductInfoGidRef.materialGidRef.model",
                          label: "型号",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          //showRequiredStar: true,  //是否显示必填星号
                          //placeholder: "请输入"
                      }} component={TextField} name="mdProductInfoGidRef.materialGidRef.model" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "mdProductInfoGidRef.materialGidRef.measurementUnitGidRef.name",
                          label: "计量单位",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          //showRequiredStar: true,  //是否显示必填星号
                          //placeholder: "请输入"
                      }} component={TextField} name="mdProductInfoGidRef.materialGidRef.measurementUnitGidRef.name" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "amount",
                          label: "数量",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          //showRequiredStar: true,  //是否显示必填星号
                          //placeholder: "请输入数量"
                      }} component={TextField} name="amount" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "status",
                          label: "单据状态",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          //showRequiredStar: true,  //是否显示必填星号
                          //placeholder: "请输入数量"
                      }} component={TextField} name="status" />
                  </Col>
              </Row>
          </Card>
          <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
              <Tabs defaultActiveKey="1">
                  <TabPane tab="子物料" key="1">
                      <Row>
                          <Col span={24}>
                              <FieldArray name="imeQcKeyModuleInfoDTOs" config={{
                                  "id": "imeQcKeyModuleInfoDTOs",
                                  "name": "imeQcKeyModuleInfoDTOs",
                                  "rowKey": "id",
                                  "showSelect":true, //是否显示选择框
                                  "addButton" :false,
                                  "type": "checkbox",//表格单选复选类型
                                  "form": "ImeQcKeyModuleCreate",
                                  "showRowDeleteButton": false,  //是否显示操作列
                                  "columns": [
                                      {
                                          "id": "wlTabTextFiled11",
                                          "type": "textField",
                                          "title": "物料编号",
                                          "name": "mdMaterielInfoGidRef.code",
                                          "enabled": false
                                      },
                                      {
                                          "id": "wlTabTextFiled12",
                                          "type": "textField",
                                          "title": "物料名称",
                                          "name": "mdMaterielInfoGidRef.name",
                                          "enabled": false
                                      },
                                      {
                                          "id": "wlTabTextFiled13",
                                          "type": "textField",
                                          "title": "规格",
                                          "name": "mdMaterielInfoGidRef.spec",
                                          "enabled": false
                                      },
                                      {
                                          "id": "wlTabTextFiled14",
                                          "type": "textField",
                                          "title": "型号",
                                          "name": "mdMaterielInfoGidRef.model",
                                          "enabled": false
                                      },
                                      {
                                          "id": "wlTabTextFiled15",
                                          "type": "textField",
                                          "title": "单位",
                                          "name": "mdMaterielInfoGidRef.measurementUnitGidRef.name",
                                          "enabled": false
                                      },
                                      {
                                          "id": "wlTabTextFiled16",
                                          "type": "textField",
                                          "title": "条码",
                                          "name": "barCode",
                                          "enabled": true
                                      },
                                      {
                                          "id": "wlTabTextFiled17",
                                          "type": "textField",
                                          "title": "绑定状态",
                                          "name": "bundlingStatus",
                                          "enabled": false
                                      }
                                  ]
                              }}component={TableField}/>
                          </Col>
                      </Row>
                  </TabPane>
              </Tabs>
          </Card>


      </div>
    );
  }
}

ImeQcKeyModuleCreate.propTypes = {
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

let CreateForm =  reduxForm({
    form: "ImeQcKeyModuleCreate",
    validate,
   /* asyncValidate,
    asyncBlurFields: ['mdDefOperationCode']*/
})(ImeQcKeyModuleCreate)
export default connect(mapStateToProps, mapDispatchToProps)(CreateForm);