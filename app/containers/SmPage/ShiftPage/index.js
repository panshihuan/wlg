/*
 *
 * Shift
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import pubsub from 'pubsub-js'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable'
import AppTable from 'components/AppTable';
import AppButton from "components/AppButton"
import TreeField from 'components/Form/TreeField';
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import TableField from 'components/Form/TableField'


const validate = values => {
    const errors = {}
    /*const reg = new RegExp("^[0-9]*$")


    if (!values.get('code')) {
        errors.code = '必填项'
    }
    if (!values.get('planEndTime')) {
        errors.planEndTime = '必填项'
    }
    if (!values.get('planBeginTime')) {
        errors.planBeginTime = '必填项'
    }
    if (!values.get('planQty')) {
        errors.planQty = '必填项'
    }
    if (!reg.test(values.get('planQty'))) {
        errors.planQty = '请输入数字'
    }

    if(values.get('planEndTime')&&values.get('planBeginTime')){
        var endTime = new Date(values.get('planEndTime').replace(/-/,"/"))
        var beginTime = new Date(values.get('planBeginTime').replace(/-/,"/"))
        console.log(!(endTime>beginTime))
        if(!(endTime>beginTime)){
            console.log(1)
            errors.planEndTime = "计划开始时间必须小于计划完成时间"
            errors.planBeginTime = "计划开始时间必须小于计划完成时间"
        }
    }

    if (!values.getIn(['workCenterGidRef','workCenterName'])) {
        errors.workCenterGidRef={}
        errors.workCenterGidRef.workCenterName = '必填项'
    }

    if (!values.getIn(['productGidRef','materialGidRef','code'])) {
        errors.productGidRef={}
        errors.productGidRef.materialGidRef={}
        errors.productGidRef.materialGidRef.code = '必填项'
    }
*/

    let vv= values.toJS();

    if (!vv.ShiftTable || !vv.ShiftTable.length) {
        //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.ShiftTable.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.shiftName) {
                memberErrors.shiftName = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }

        })
        if (membersArrayErrors.length) {
            errors.ShiftTable = membersArrayErrors
        }
    }
    return errors
}

export class ShiftPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor() {
        super()
        this.init()



        pubsub.subscribe("ShiftTable.refresh",()=>{
            this.init()
        })

        pubsub.subscribe("ShiftTable.onSelectedRows",(name,data)=>{
            //console.log("rows",data.length)
            if(data.length < 1){
                pubsub.publish("ShiftModifyBtn.enabled", false);
                pubsub.publish("ShiftSaveBtn.visible", false);
                pubsub.publish("ShiftDeleteBtn.enabled", false);
                pubsub.publish("ShiftTable.activateAll", false);
            }else{
                pubsub.publish("ShiftModifyBtn.enabled", true);
                pubsub.publish("ShiftDeleteBtn.enabled", true);
            }
        })

    }

    componentDidMount() {

    }

    init() {
        let formData = {}
        // 列表初始化表单
        let dataSource = {
            type: 'api',
            method: 'post',
            mode: "payload",
            url: '/sm/shift/query.action'
        }

        resolveDataSource({
            dataSource: dataSource
        }).then(function (response) {
            if (response.success) {
                formData.ShiftTable = response.data
                console.log("回显的值",formData)
                pubsub.publish("@@form.init", {id: "ShiftForm", data: Immutable.fromJS(formData)})
            } else {
                pubsub.publish("@@message.error", "班次表初始化失败!");
            }
        }.bind(this))
    }
    
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>日历</Breadcrumb.Item>
              <Breadcrumb.Item>班次</Breadcrumb.Item>
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
                              id: "ShiftCreateBtn",
                              title: "创建",
                              type: "primary",
                              size: "large",
                              visible: true,
                              enabled: true,
                              subscribes: [
                                  {
                                      event: "ShiftCreateBtn.click",
                                      pubs: [
                                          {
                                              event: "ShiftTable.addRow",
                                              eventPayloadExpression:`
                                                       let code
                                                       let dataSource = {
                                                            type: 'api',
                                                            method: 'post',
                                                            url: '/sm/codeRule/generateCode.action?ruleCode=QS'
                                                        }

                                                       let onSuccess = function(response){
                                                           if (response.success) {
                                                                 code = response.data;
                                                                 console.log("code",code)
                                                                 callback({shiftCode:code})
                                                            } else {
                                                                pubsub.publish("@@message.error", "初始化获取编码失败!");
                                                            }
                                                        }

                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:null,dataContext:null},onSuccess);


                                                          `
                                          },{
                                              event: "ShiftSaveBtn.visible",
                                              payload: true
                                          }
                                      ]
                                  }
                              ]
                          }}/>
                          <AppButton config={{
                              id: "ShiftModifyBtn",
                              title: "修改",
                              type: "primary",
                              size: "large",
                              visible: true,
                              enabled: false,
                              subscribes: [
                                  {
                                      event: "ShiftTable.onSelectedRows",
                                      pubs: [
                                          {
                                              event: "ShiftModifyBtn.dataContext"
                                          }
                                      ]
                                  },
                                  {
                                      event: "ShiftModifyBtn.click",
                                      behaviors:[
                                          {
                                              type:"fetch",
                                              id: "ShiftModifyBtn", //要从哪个组件获取数据
                                              data: "dataContext",//要从哪个组件的什么属性获取数据
                                              successPubs: [  //获取数据完成后要发送的事件
                                                  {
                                                      event: "ShiftTable.activateRow"
                                                  },{
                                                      event:"ShiftSaveBtn.visible",
                                                      payload: true
                                                  }
                                              ]
                                          }
                                      ]
                                  }
                              ]
                          }}/>
                          <AppButton config={{
                              id: "ShiftSaveBtn",
                              title: "保存",
                              type: "primary",
                              size: "large",
                              visible: false,
                              enabled: true,
                              subscribes: [
                                  {
                                      event: "ShiftSaveBtn.click",
                                      behaviors:[
                                          {
                                              type:"fetch",
                                              id: "ShiftTable", //要从哪个组件获取数据
                                              data: "selectedRows",//要从哪个组件的什么属性获取数据
                                              successPubs: [  //获取数据完成后要发送的事件
                                                  {
                                                      event: "@@message.success",
                                                      eventPayloadExpression: `
                                                console.log("eventPayload1",eventPayload)
                                                let array = []
                                                if(eventPayload.length > 0 ){
                                                    for(let index = 0; index < eventPayload.length;index++ ){
                                                        console.log("item",eventPayload[index])
                                                        if(typeof (eventPayload[index]) != 'undefined'){
                                                            array.push(eventPayload[index])
                                                        }
                                                    }
                                                    let dataSource = {
                                                        type: 'api',
                                                        method: 'post',
                                                        mode:"dataContext",
                                                        url: '/sm/shift/createAndSave.action'

                                                    }

                                                     let onSuccess = function(response){
                                                       if (response.success) {
                                                            pubsub.publish("@@message.success", "保存成功!");
                                                            pubsub.publish("ShiftModifyBtn.enabled", false);
                                                            pubsub.publish("ShiftDeleteBtn.enabled", false);
                                                            pubsub.publish("ShiftSaveBtn.visible", false);
                                                            pubsub.publish("ShiftTable.clearSelect");

                                                            pubsub.publish("ShiftTable.refresh")
                                                            pubsub.publish("ShiftTable.activateAll", false);

                                                        } else {
                                                            pubsub.publish("@@message.error", response.data);
                                                        }
                                                    }
                                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:array,dataContext:array},onSuccess);
                                                }else{
                                                    pubsub.publish("@@message.error", "请选择要操作的行!");
                                                }


                    `,
                                                  }
                                              ]
                                          }
                                      ]
                                  }
                              ]
                          }}/>
                          <AppButton config={{
                              id: "ShiftDeleteBtn",
                              title: "删除",
                              type: "primary",
                              size: "large",
                              visible: true,
                              enabled: false,
                              subscribes: [
                                  {
                                      event: "ShiftDeleteBtn.click",
                                      behaviors:[
                                          {
                                              type:"fetch",
                                              id: "ShiftTable", //要从哪个组件获取数据
                                              data: "selectedRows",//要从哪个组件的什么属性获取数据
                                              successPubs: [  //获取数据完成后要发送的事件
                                                  {
                                                      event: "@@message.success",
                                                      eventPayloadExpression: `
                                            console.log("eventPayload1",eventPayload)

                                            let ids = []
                                            for(let index = 0; index < eventPayload.length;index++ ){
                                                //console.log("item",eventPayload[index])
                                                if(typeof (eventPayload[index]) != 'undefined'){
                                                    if(typeof (eventPayload[index].gid) != 'undefined'){
                                                        ids.push(eventPayload[index].gid)
                                                    }
                                                }
                                            }
                                            //console.log("ids",ids)
                                            let dataSource = {
                                                type: 'api',
                                                method: 'post',
                                                mode:"dataContext",
                                                url: '/sm/shift/deleteByIds.action'

                                            }

                                             let onSuccess = function(response){
                                                if (response.success) {
                                                    pubsub.publish("@@message.success", "删除成功!");
                                                    pubsub.publish("ShiftTable.refresh")
                                                    pubsub.publish("ShiftModifyBtn.enabled", false);
                                                    pubsub.publish("ShiftSaveBtn.visible", false);
                                                    pubsub.publish("ShiftDeleteBtn.enabled", false);
                                                    pubsub.publish("ShiftTable.activateAll", false);
                                                } else {
                                                    pubsub.publish("@@message.error", "删除失败!");
                                                }
                                            }

                                             resolveDataSourceCallback({dataSource:dataSource,eventPayload:null,dataContext:ids},onSuccess);

                    `,
                                                  }
                                              ]
                                          }
                                      ]
                                  }
                              ]
                          }}/>
                      </Col>
                  </Card>
              </Row>

              <Row>
                  <Card bordered={true}>
                      <FieldArray name="ShiftTable" config={{
                          "id": "ShiftTable",
                          "name": "ShiftTable",
                          "form": "ShiftForm",
                          "rowKey": "gid",
                          "addButton": false, //是否显示默认增行按钮
                          "showSelect": true, //是否显示选择框
                          "type": "checkbox", //表格单选（radio）复选（checkbox）类型
                          "unEditable": true, //初始化是否都不可编辑
                          "showRowDeleteButton": true,  //是否显示操作列
                          "columns": [
                              {
                                  "id": "shiftCode",
                                  "type": "textField",
                                  "title": "班次编码",
                                  "name": "shiftCode",
                                  "enabled":false
                              }, {
                                  "id": "shiftName",
                                  "type": "textField",
                                  "title": "班次名称",
                                  showRequiredStar: true,
                                  "name": "shiftName",
                              }
                          ]
                      }} component={TableField}/>
                  </Card>

              </Row>
          </div>
      </div>
    );
  }
}

ShiftPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

let Form =  reduxForm({
    form: "ShiftForm",
    validate
})(ShiftPage)

export default connect(null, mapDispatchToProps)(Form);
