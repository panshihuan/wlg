import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable'
import {Breadcrumb, Card, Row, Col,Layout,Menu, Icon,Tabs } from 'antd';
import { connect } from 'react-redux';
import pubsub from 'pubsub-js'

import AppTable from '../../../../components/AppTable';
import AppButton from '../../../../components/AppButton';
import TreeField from '../../../../components/Form/TreeField';
import TextField from 'components/Form/TextField';
import SelectField from 'components/Form/SelectField';
import TableField from 'components/Form/TableField';
import FindbackField from 'components/Form/FindbackField';
import InputNumberField from 'components/Form/InputNumberField'
import ModalContainer from 'components/ModalContainer'
import RadiosField from 'components/Form/RadiosField'
import LogisticsModalPage from './logisticsModalPage'
import CoreComponent from 'components/CoreComponent'

let packValidate=true;
const validate = values => {
  const errors = {}
  const reg = /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/
  if (!values.get('code')) {
    errors.code = '必填项'
  }
  if (!values.get('name')) {
    errors.name = '必填项'
  }
  if (!values.getIn(['mdMrlDeliverySchemeGidRef','deliveryName'])) {
    errors.mdMrlDeliverySchemeGidRef={}
    errors.mdMrlDeliverySchemeGidRef.deliveryName = '必填项'
  }
  if (!values.getIn(['mdFactoryLineGidRef','lineName'])) {
    errors.mdFactoryLineGidRef={}
    errors.mdFactoryLineGidRef.lineName = '必填项'
  }


  let vv= values.toJS();
  if(!packValidate){
  if (!vv.mdMrlDeliveryModeDetailDTOs || !vv.mdMrlDeliveryModeDetailDTOs.length) {
  } else {
    const membersArrayErrors = []
    vv.mdMrlDeliveryModeDetailDTOs.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.packNumber || !reg.test(member.packNumber)) {
        memberErrors.packNumber = '请输入有效数字'
        membersArrayErrors[memberIndex] = memberErrors
      }
    })
    if (membersArrayErrors.length) {
      errors.mdMrlDeliveryModeDetailDTOs = membersArrayErrors
    }
  }
}
  return errors
}
export class LogisticsModePage extends CoreComponent {
  constructor(props) {
    super(props);
    this.packValidate=packValidate;
  }

  componentWillMount() {

  }

  componentDidMount() {
    pubsub.subscribe("packStandard.onChange",(name,value)=>{
      if(value!=undefined){
        //套料包装
        if(value == "NESTING_PACK"){
          pubsub.publish("packWay.enabled",true);
          pubsub.publish("groupingCapacity.enabled",true);
          pubsub.publish("mdMrlDeliveryModeDetailDTOs.activateCol",{"cols":["packWay","packNumber"],"type":false});
          packValidate=false;
        }else{
          pubsub.publish("packWay.enabled",false);
          pubsub.publish("groupingCapacity.enabled",false);
          pubsub.publish("mdMrlDeliveryModeDetailDTOs.activateCol",{"cols":["packWay","packNumber"],"type":true});
          packValidate=true;
        }
      }
    })
    // event:"packStandard.onChange",
    // pubs:[
    //   {
    //     event:"packStandard.expression",
    //     meta: {
    //       expression: `
    //         let selectField = me.props.input;
    //         resolveFetch({fetch:{id:'LogisticsModePageGid'}}).then(function(page){
             
    //           if(selectField.value!=undefined){
    //             //套料包装
    //             if(selectField.value == "NESTING_PACK"){
    //               pubsub.publish("packWay.enabled",true);
    //               pubsub.publish("groupingCapacity.enabled",true);
    //               pubsub.publish("mdMrlDeliveryModeDetailDTOs.activateCol",{"cols":["packWay","packNumber"],"type":false});
    //               page.packValidate.isEnabled=false;
    //             }else{
    //               pubsub.publish("packWay.enabled",false);
    //               pubsub.publish("groupingCapacity.enabled",false);
    //               pubsub.publish("mdMrlDeliveryModeDetailDTOs.activateCol",{"cols":["packWay","packNumber"],"type":true});
    //               page.packValidate.isEnabled=true;
    //             }
    //           }
    //         })
    //       `
    //     }
    //   }
    // ]
  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {

  }
  render() {
    const { Header, Content, Footer, Sider } = Layout;
    const { SubMenu } = Menu;
    const TabPane = Tabs.TabPane;
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>业务建模</Breadcrumb.Item>
          <Breadcrumb.Item>物流</Breadcrumb.Item>
          <Breadcrumb.Item>物流配送方式</Breadcrumb.Item>
        </Breadcrumb>
        <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
        bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
          <Row>
            <Col span={14} xs={24}>
              <AppButton config={{
                id: "logistiCreateButton",
                title: "创建",
                type: "primary",
                size: "large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "logistiCreateButton.click",
                    pubs: [
                      {
                        event: "logistiCreateButton.visible",//创建按钮
                        payload: false
                      },
                      {
                        event: "logistiModifyButton.visible",//修改按钮
                        payload: false
                      },
                      {
                        event: "logistiDelButton.visible",//删除按钮
                        payload: false
                      },
                      {
                        event: "logistiSubmitCreateButton.visible",//新建保存按钮
                        payload: true
                      },
                      {
                        event: "logistiCanelButton.visible",//取消按钮
                        payload: true
                      },
                      {
                        event: "checkBatchMrl.enabled",//批量选择物料
                        payload: true
                      },
                      //------------------------------以上是创建按钮状态方法-----------------------
                      {
                        event:"code.enabled",
                        payload:true
                      },{
                        event:"name.enabled",
                        payload:true
                      },{
                        event:"mdMrlDeliverySchemeGidRef.deliveryName.enabled",
                        payload:true
                      },{
                        event:"mdFactoryLineGidRef.lineName.enabled",
                        payload:false
                      },{
                        event:"mdMrlTimeProgramGid.enabled",
                        payload:true
                      },{
                        event:"packStandard.enabled",
                        payload:true
                      },{
                        event:"packWay.enabled",
                        payload:false
                      },{
                        event:"groupingCapacity.enabled",
                        payload:false
                      },{
                        event:"deliveryBeat.enabled",
                        payload:true
                      },{
                        event:"deliveryBeatType.enabled",
                        payload:true
                      },
                      //------------------------------以上是创建引起表单状态方法--------------------
                      {
                        event:"@@form.init",
                        eventPayloadExpression:`
                          resolveFetch({fetch:{id:'logistiTree',data:'state'}}).then(function(res){
                            if(res != undefined){
                                if(res["selectedKeys"]!=undefined && res["selectedKeys"].length>0){
                                  let treeItem = res["selectedInfo"]["node"]["props"]["data-item"];
                                  if(treeItem["code"] == "3"){
                                    callback({id:"logisticsModeForm",data:{}})
                                  }
                                }else{
                                  callback({id:"logisticsModeForm",data:{}})
                                }
                            }
                          })
                          
                        `
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                id: "logistiModifyButton",
                title: "修改",
                type: "primary",
                size: "large",
                visible: true,
                enabled: false,
                subscribes: [
                  {
                    event: "logistiModifyButton.click",
                    pubs: [
                      {
                        event: "logistiCreateButton.visible",//创建按钮
                        payload: false
                      },
                      {
                        event: "logistiModifyButton.visible",//修改按钮
                        payload: false
                      },
                      {
                        event: "logistiDelButton.visible",//删除按钮
                        payload: false
                      },
                      {
                        event: "logistiSubmitModifyButton.visible",//修改保存按钮
                        payload: true
                      },
                      {
                        event: "logistiCanelButton.visible",//取消按钮
                        payload: true
                      },
                      {
                        event: "checkBatchMrl.enabled",//批量选择物料
                        payload: true
                      },
                      //------------------------------以上是修改按钮状态方法-----------------------
                      {
                        event:"code.enabled",
                        payload:true
                      },{
                        event:"name.enabled",
                        payload:true
                      },{
                        event:"mdMrlDeliverySchemeGidRef.deliveryName.enabled",
                        payload:true
                      },{
                        event:"mdFactoryLineGidRef.lineName.enabled",
                        payload:true
                      },{
                        event:"mdMrlTimeProgramGid.enabled",
                        payload:true
                      },{
                        event:"packStandard.enabled",
                        payload:true
                      },{
                        event:"packWay.enabled",
                        eventPayloadExpression:`
                        resolveFetch({fetch:{id:'logisticsModeForm',data:'@@formValues'}}).then(function(res){
                          if(res.packStandard!=undefined){
                            if(res.packStandard == "NESTING_PACK"){
                              callback(true)
                            }else{
                              callback(false)
                            }
                          }
                        })
                        `
                      },{
                        event:"groupingCapacity.enabled",
                        eventPayloadExpression:`
                        resolveFetch({fetch:{id:'logisticsModeForm',data:'@@formValues'}}).then(function(res){
                          if(res.packStandard!=undefined){
                            if(res.packStandard == "NESTING_PACK"){
                              callback(true)
                            }else{
                              callback(false)
                            }
                          }
                        })
                        `
                      },{
                        event:"deliveryBeat.enabled",
                        payload:true
                      },{
                        event:"deliveryBeatType.enabled",
                        payload:true
                      },
                      {
                        event:"mdMrlDeliveryModeDetailDTOs.activateAll",//子表编辑状态的修改
                        payload:true
                      }
                      //------------------------------以上是创建引起表单状态方法--------------------
                    ]
                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                id: "logistiDelButton",
                title: "删除",
                type: "primary",
                size: "large",
                visible: true,
                enabled: false,
                subscribes: [
                  {
                    event: "logistiDelButton.click",
                    behaviors: [
                      {
                        type:"request",
                        dataSource:{
                          type: "api",
                          method: "POST",
                          url:"/ime/mdMrlDeliveryMode/delete.action",
                          bodyExpression:`
                            dataContext && callback({id:dataContext.selectedKeys[0]})
                          `
                        },
                        successPubs: [
                          {
      
                            event: "@@message.success",
                            eventPayloadExpression: `
                              callback("删除成功")
                          `
                          },
                          {
                            event:"logistiTree.loadData",
                          },
                          {
                            event:"@@form.init",
                            eventPayloadExpression:`
                            callback({id:"logisticsModeForm",data:{}});
                            `
                          }
                        ],
                        errorPubs:[
                          {
                            event:"@@message.error",
                            eventPayloadExpression: `
                              callback(eventPayload.data)
                            `,
                          }
                        ]
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                id: "logistiSubmitCreateButton",
                title: "保存",
                type: "primary",
                size: "large",
                visible: false,
                enabled: true,
                subscribes: [
                  {
                    event: "logistiSubmitCreateButton.click",
                    behaviors:[
                      {
                        type:"request",
                        dataSource:{
                          type: "api",
                          method: "POST",
                          url:"/ime/mdMrlDeliveryMode/add.action",
                          withForm:"logisticsModeForm"
                        },
                        successPubs:[
                          {
                            event:"@@message.success",
                            eventPayloadExpression: `
                              callback("增加成功")
                            `
                          },
                          {
                            event: "logistiCreateButton.visible",//创建按钮
                            payload: true
                          },
                          {
                            event: "logistiModifyButton.visible",//修改按钮
                            payload: true
                          },
                          {
                            event: "logistiDelButton.visible",//删除按钮
                            payload: true
                          },
                          {
                            event: "logistiSubmitCreateButton.visible",//保存按钮
                            payload: false
                          },
                          {
                            event: "logistiCanelButton.visible",//取消按钮
                            payload: false
                          },
                          {
                            event: "checkBatchMrl.enabled",//批量选择物料
                            payload: false
                          },
                           //------------------------------以上是修改按钮状态方法-----------------------
                          {
                            event:"code.enabled",
                            payload:false
                          },{
                            event:"name.enabled",
                            payload:false
                          },{
                            event:"mdMrlDeliverySchemeGidRef.deliveryName.enabled",
                            payload:false
                          },{
                            event:"mdFactoryLineGidRef.lineName.enabled",
                            payload:false
                          },{
                            event:"mdMrlTimeProgramGid.enabled",
                            payload:false
                          },{
                            event:"packStandard.enabled",
                            payload:false
                          },{
                            event:"packWay.enabled",
                            payload:false
                          },{
                            event:"groupingCapacity.enabled",
                            payload:false
                          },{
                            event:"deliveryBeat.enabled",
                            payload:false
                          },{
                            event:"deliveryBeatType.enabled",
                            payload:false
                          },
                          {
                            event:"mdMrlDeliveryModeDetailDTOs.activateAll",//子表编辑状态的修改
                            payload:false
                          },
                          //------------------------------以上是创建引起表单状态方法--------------------
                          {
                            event:"logistiTree.loadData",
                          }
                        ],
                        errorPubs:[
                          {
                            event:"@@message.error",
                            eventPayloadExpression: `
                              callback(eventPayload.data)
                            `,
                          }
                        ]
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                id: "logistiSubmitModifyButton",
                title: "保存",
                type: "primary",
                size: "large",
                visible: false,
                enabled: true,
                subscribes: [
                  {
                    event: "logistiSubmitModifyButton.click",
                    behaviors:[
                      {
                        type:"request",
                        dataSource:{
                          type: "api",
                          method: "POST",
                          url:"/ime/mdMrlDeliveryMode/createOrUpdateDto.action",
                          withForm:"logisticsModeForm"
                        },
                        successPubs:[
                          {
                            event:"@@message.success",
                            eventPayloadExpression: `
                              callback("修改成功")
                            `
                          },
                          {
                            event: "logistiCreateButton.visible",//创建按钮
                            payload: true
                          },
                          {
                            event: "logistiModifyButton.visible",//修改按钮
                            payload: true
                          },
                          {
                            event: "logistiDelButton.visible",//删除按钮
                            payload: true
                          },
                          {
                            event: "logistiSubmitModifyButton.visible",//保存按钮
                            payload: false
                          },
                          {
                            event: "logistiCanelButton.visible",//取消按钮
                            payload: false
                          },
                          {
                            event: "checkBatchMrl.enabled",//批量选择物料
                            payload: false
                          },
                          //------------------------------以上是保存修改按钮状态方法-----------------------
                          {
                            event:"code.enabled",
                            payload:false
                          },{
                            event:"name.enabled",
                            payload:false
                          },{
                            event:"mdMrlDeliverySchemeGidRef.deliveryName.enabled",
                            payload:false
                          },{
                            event:"mdFactoryLineGidRef.lineName.enabled",
                            payload:false
                          },{
                            event:"mdMrlTimeProgramGid.enabled",
                            payload:false
                          },{
                            event:"packStandard.enabled",
                            payload:false
                          },{
                            event:"packWay.enabled",
                            payload:false
                          },{
                            event:"groupingCapacity.enabled",
                            payload:false
                          },{
                            event:"deliveryBeat.enabled",
                            payload:false
                          },{
                            event:"deliveryBeatType.enabled",
                            payload:false
                          },
                          {
                            event:"mdMrlDeliveryModeDetailDTOs.activateAll",//子表编辑状态的修改
                            payload:false
                          },
                          //------------------------------以上是取消引起表单状态方法--------------------
                          {
                            event:"logistiTree.loadData",
                          }
                        ],
                        errorPubs:[
                          {
                            event:"@@message.error",
                            eventPayloadExpression: `
                              callback(eventPayload)
                            `,
                          }
                        ]
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                id: "logistiCanelButton",
                title: "取消",
                type: "primary",
                size: "large",
                visible: false,
                enabled: true,
                subscribes: [
                  {
                    event: "logistiCanelButton.click",
                    pubs: [
                      {
                        event: "logistiCreateButton.visible",//创建按钮
                        payload: true
                      },
                      {
                        event: "logistiModifyButton.visible",//修改按钮
                        payload: true
                      },
                      {
                        event: "logistiDelButton.visible",//删除按钮
                        payload: true
                      },
                      {
                        event: "logistiSubmitCreateButton.visible",//新增保存按钮
                        payload: false
                      },
                      {
                        event: "logistiSubmitModifyButton.visible",//修改保存按钮
                        payload: false
                      },
                      {
                        event: "logistiCanelButton.visible",//取消按钮
                        payload: false
                      },
                      {
                        event: "checkBatchMrl.enabled",//批量选择物料
                        payload: false
                      },
                      {
                        event:"@@form.init",
                        eventPayloadExpression:`
                        resolveFetch({fetch:{id:'logistiTree',data:'state'}}).then(function(res){
                          if(res != undefined){
                              if(res["selectedKeys"]!=undefined && res["selectedKeys"].length>0){
                                let treeItem = res["selectedInfo"]["node"]["props"]["data-item"];
                                if(treeItem["code"] == "3"){
                                  callback({id:"logisticsModeForm",data:{}})
                                }
                              }else{
                                callback({id:"logisticsModeForm",data:{}})
                              }
                          }
                        })
                        `
                      },
                      //------------------------------以上是取消按钮状态方法-----------------------
                      {
                        event:"code.enabled",
                        payload:false
                      },{
                        event:"name.enabled",
                        payload:false
                      },{
                        event:"mdMrlDeliverySchemeGidRef.deliveryName.enabled",
                        payload:false
                      },{
                        event:"mdFactoryLineGidRef.lineName.enabled",
                        payload:false
                      },{
                        event:"mdMrlTimeProgramGid.enabled",
                        payload:false
                      },{
                        event:"packStandard.enabled",
                        payload:false
                      },{
                        event:"packWay.enabled",
                        payload:false
                      },{
                        event:"groupingCapacity.enabled",
                        payload:false
                      },{
                        event:"deliveryBeat.enabled",
                        payload:false
                      },{
                        event:"deliveryBeatType.enabled",
                        payload:false
                      },
                      {
                        event:"mdMrlDeliveryModeDetailDTOs.activateAll",//子表编辑状态的修改
                        payload:false
                      }
                      //------------------------------以上是取消引起表单状态方法--------------------
                    ]
                  }
                ]
              }}>
              </AppButton>
            </Col>
          </Row>
        </Card>
        <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Card bordered={true} style={{ width: "100%", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
          <Field config={{
            id: 'logistiTree',
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
              url: '/ime/mdMrlDeliveryMode/getMrlGroupTree.action'
            },
            subscribes:[
              {
                event:"logistiTree.onSelect",
                    pubs: [
                      {
                        event: "@@form.init",
                        eventPayloadExpression:`
                        let params = {};
                        //1.判断参数是否存在
                        if(eventPayload != undefined)
                        {
                          let treeItem = eventPayload["info"]["node"]["props"]["data-item"];
                          //2.判断是点的是树节点的哪种类型
                          if(treeItem["code"] =="3")
                          {
                            let dataSource = {
                              "type": "api",
                              "method": "POST",
                              "mode":"payload",
                              "payload": {
                                "id": treeItem["id"]
                              },
                              url: "/ime/mdMrlDeliveryMode/findById.action"
                            }
                            resolveDataSourceCallback({dataSource:dataSource,eventPayload:undefined},function(response){
                              params = response.data;
                              callback({id:"logisticsModeForm",data:params});
                            })
                          }else if(treeItem["code"] =="2"){
                            params ={mdMrlDeliverySchemeGidRef:{deliveryName:treeItem.text},mdMrlDeliverySchemeGid:treeItem.id,mdFactoryLineGid:treeItem.pid,mdFactoryLineGidRef:{lineName:treeItem.parentName}}
                            callback({id:"logisticsModeForm",data:params});
                          }else{
                            params ={mdFactoryLineGid:treeItem.id,mdFactoryLineGidRef:{lineName:treeItem.text}}
                            callback({id:"logisticsModeForm",data:params});
                          }
                        }
                        `
                      },
                      {
                        event:"logistiModifyButton.enabled",
                        eventPayloadExpression:`
                        let status = false;
                        if(eventPayload != undefined)
                        {
                          let treeItem = eventPayload["info"]["node"]["props"]["data-item"];
                          //判断为最底层的才亮
                          if(treeItem["code"] =="3"){
                            status=true;
                          }else{
                            status=false;
                          }
                        }
                        callback(status)
                        `
                      },
                      {
                        event:"logistiDelButton.enabled",
                        eventPayloadExpression:`
                        let status = false;
                        if(eventPayload != undefined)
                        {
                          let treeItem = eventPayload["info"]["node"]["props"]["data-item"];
                          //判断为最底层的才亮
                          if(treeItem["code"] =="3"){
                            status=true;
                          }else{
                            status=false;
                          }
                        }
                        callback(status)
                        `
                      },
                      {
                        event:"logistiSubmitCreateButton.visible",
                        payload:false
                      },
                      {
                        event:"logistiSubmitModifyButton.visible",
                        payload:false
                      },
                      {
                        event:"logistiCanelButton.visible",
                        payload:false
                      },
                      {
                        event: "logistiCreateButton.visible",//创建按钮
                        payload: true
                      },
                      {
                        event: "logistiModifyButton.visible",//修改按钮
                        payload: true
                      },
                      {
                        event: "logistiDelButton.visible",//删除按钮
                        payload: true
                      },
                      {
                        event: "checkBatchMrl.enabled",//批量选择物料
                        payload: false
                      },
                      //------------------------------以上是保存修改按钮状态方法-----------------------
                      {
                        event:"code.enabled",
                        payload:false
                      },{
                        event:"name.enabled",
                        payload:false
                      },{
                        event:"mdMrlDeliverySchemeGidRef.deliveryName.enabled",
                        payload:false
                      },{
                        event:"mdFactoryLineGidRef.lineName.enabled",
                        payload:false
                      },{
                        event:"mdMrlTimeProgramGid.enabled",
                        payload:false
                      },{
                        event:"packStandard.enabled",
                        payload:false
                      },{
                        event:"packWay.enabled",
                        payload:false
                      },{
                        event:"groupingCapacity.enabled",
                        payload:false
                      },{
                        event:"deliveryBeat.enabled",
                        payload:false
                      },{
                        event:"deliveryBeatType.enabled",
                        payload:false
                      },
                      {
                        event:"mdMrlDeliveryModeDetailDTOs.activateAll",//子表编辑状态的修改
                        payload:false
                      },
                      {
                        event:"logistiDelButton.dataContext",
                      }
                    ]
              },
              {
                event:"logistiTree.onSelectClear",
                pubs:[
                  {
                    event:"@@form.init",
                    eventPayloadExpression:`
                      callback({id:"logisticsModeForm",data:{}})
                    `
                  },
                  {
                    event:"logistiCreateButton.visible",
                    payload:true
                  },
                  {
                    event:"logistiModifyButton.enabled",
                    payload:false
                  },
                  {
                    event:"logistiModifyButton.visible",
                    payload:true
                  },
                  {
                    event:"logistiDelButton.enabled",
                    payload:false
                  },
                  {
                    event:"logistiDelButton.visible",
                    payload:true
                  },
                  {
                    event:"logistiSubmitCreateButton.visible",
                    payload:false
                  },
                  {
                    event:"logistiSubmitModifyButton.visible",
                    payload:false
                  },
                  {
                    event:"logistiCanelButton.visible",
                    payload:false
                  },
                  {
                    event: "checkBatchMrl.enabled",//批量选择物料
                    payload: false
                  },
                  //------------------------------以上是保存修改按钮状态方法-----------------------
                  {
                    event:"code.enabled",
                    payload:false
                  },{
                    event:"name.enabled",
                    payload:false
                  },{
                    event:"mdMrlDeliverySchemeGidRef.deliveryName.enabled",
                    payload:false
                  },{
                    event:"mdFactoryLineGidRef.lineName.enabled",
                    payload:false
                  },{
                    event:"mdMrlTimeProgramGid.enabled",
                    payload:false
                  },{
                    event:"packStandard.enabled",
                    payload:false
                  },{
                    event:"packWay.enabled",
                    payload:false
                  },{
                    event:"groupingCapacity.enabled",
                    payload:false
                  },{
                    event:"deliveryBeat.enabled",
                    payload:false
                  },{
                    event:"deliveryBeatType.enabled",
                    payload:false
                  },
                  {
                    event:"mdMrlDeliveryModeDetailDTOs.activateAll",//子表编辑状态的修改
                    payload:false
                  },
                  {
                    event:"logistiDelButton.dataContext",
                  }
                ]
              }
            ]
          }} name="logistiTree"  component={ TreeField } />
          </Card>
        </Sider>
        <Layout>
          <Content style={{ background: '#fff' }}>
            <Card bordered={true}>
                <Row>
                    <Col span={12}>
                      <Field config={{
                          enabled: false,
                          id: "code",
                          form: "logisticsModeForm",
                          label: "物料分组编号:",  //标签名称
                          showRequiredStar: true,
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "请输入编码"
                      }} component={TextField} name="code" />
                    </Col>
                    <Col span={12}>
                        <Field config={{
                            enabled: false,
                            id: "name",
                            label: "物料分组名称:",  //标签名称
                            form: "logisticsModeForm",
                            showRequiredStar: true,
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请输入名称"
                        }} component={TextField} name="name" />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Field config={{
                          enabled: false,
                          form: "logisticsModeForm",
                          id: "mdMrlDeliverySchemeGidRef.deliveryName",
                          label: "配送方案",
                          showRequiredStar: true,
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          subscribes:[
                            {
                              event: "mdMrlDeliverySchemeGidRef.deliveryName.onChange",
                              pubs: [
                                {
                                  event:"mdFactoryLineGidRef.lineName.enabled",
                                  payload:true
                                }
                              ]
                            }
                          ],
                          tableInfo: {
                            id: "tableId555",
                            size: "small",
                            rowKey: "gid",
                            tableTitle: "配送方案",
                            width: "500",
                            columns: [
                              { title: '配送编码', width: 200, dataIndex: 'deliveryCode', key: '1' },
                              { title: '配送名称', width: 200, dataIndex: 'deliveryName', key: '2' },
                              { title: '版本编号', dataIndex: 'versionCode', key: '3', width: 200 },
                              { title: '配送类型', dataIndex: 'deliveryType', key: '4', width: 200 }
                            ],
                            dataSource: {
                              type: 'api',
                              method: 'post',
                              url: '/ime/mdMrlDeliveryScheme/query.action'
                            }
                          },
                          pageId: 'peisongfanganfindback',
                          displayField: "mdMrlDeliverySchemeGidRef.deliveryName",
                          valueField: {
                            "from": "deliveryName",
                            "to": "mdMrlDeliverySchemeGidRef.deliveryName"
                          },
                          associatedFields:[{
                            "from": "gid",
                            "to": "mdMrlDeliverySchemeGid"
                          }]
                        }} name="mdMrlDeliverySchemeGidRef.deliveryName" component={FindbackField} />
                    </Col>
                    <Col span={12}>
                      <Field config={{
                        enabled: false,
                        form: "logisticsModeForm",
                        id: "mdFactoryLineGidRef.lineName",
                        form: "logisticsModeForm",
                        showRequiredStar: true,
                        label: "产线",
                        labelSpan: 8,   //标签栅格比例（0-24）
                        wrapperSpan: 16,  //输入框栅格比例（0-24
                        tableInfo: {
                          id: "tableId555",
                          size: "small",
                          rowKey: "gid",
                          tableTitle: "产线信息",
                          onLoadData: false,
                          showSerial: false,
                          "isSearch": false,
                          "isPager": false,//是否分页
                          width: "500",
                          columns: [
                            { title: '产品编号', width: 200, dataIndex: 'lineCode', key: '1' },
                            { title: '产品名称', width: 200, dataIndex: 'lineName', key: '2' },
                            { title: '产线类型', dataIndex: 'lineType', key: '3', width: 200 }
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/ime/mdMrlDeliveryMode/getFactoryLines.action'
                          },
                          subscribes: [
                            {
                              event: "tableId555.onTableTodoAny",
                              behaviors: [
                                {
                                  type: "fetch",
                                  id: "logisticsModeForm", //要从哪个组件获取数据
                                  data: "@@formValues",//要从哪个组件的什么属性获取数据
                                  successPubs: [  //获取数据完成后要发送的事件
                                    {
                                      event: "tableId555.loadData",
                                      eventPayloadExpression:`
                                        let payload ={}
                                        if(eventPayload != undefined){
                                          payload = {
                                            "schemeGid":eventPayload["mdMrlDeliverySchemeGid"]
                                          }
                                        }
                                         callback(payload)
                                      `
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        pageId: 'chanxianfindbackpage',
                        displayField: "mdFactoryLineGidRef.lineName",
                        valueField: {
                          "from": "lineName",
                          "to": "mdFactoryLineGidRef.lineName"
                        },
                        associatedFields:[{
                          "from": "gid",
                          "to": "mdFactoryLineGid"
                        }]
                      }} name="mdFactoryLineGidRef.lineName" component={FindbackField} />
                    </Col>
                </Row>
                <Row>
                  <Col span={12}>
                      <Field config={{
                        id: "mdMrlTimeProgramGid",
                        enabled: false,
                        label: "物料时间方案",  //标签名称
                        labelSpan: 8,   //标签栅格比例（0-24）
                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                        placeholder:"请选择",
                        dataSource: {
                          type: "api",
                          method: "post",
                          url: "/ime/mdMrlTimeProgram/getMrlTimeProgramCombox.action"
                        },
                        displayField: "value",
                        valueField: "id",
                      }} component={SelectField} name="mdMrlTimeProgramGid" />
                  </Col>
                  <Col span={12}>
                    <Field config={{
                      id: "packStandard",
                      enabled: false,
                      label: "包装标准",  //标签名称
                      labelSpan: 8,   //标签栅格比例（0-24）
                      wrapperSpan: 16,  //输入框栅格比例（0-24）
                      placeholder:"请选择",
                      dataSource: {
                        type: "api",
                        method: "post",
                        url: "/ime/mdMrlDeliveryMode/getPackStandardCombox.action"
                      },
                      /*subscribes:[
                        {
                          event:"packStandard.onChange",
                          pubs:[
                            {
                              event:"packStandard.expression",
                              meta: {
                                expression: `
                                  let selectField = me.props.input;
                                  resolveFetch({fetch:{id:'LogisticsModePageGid'}}).then(function(page){
                                   
                                    if(selectField.value!=undefined){
                                      //套料包装
                                      if(selectField.value == "NESTING_PACK"){
                                        pubsub.publish("packWay.enabled",true);
                                        pubsub.publish("groupingCapacity.enabled",true);
                                        pubsub.publish("mdMrlDeliveryModeDetailDTOs.activateCol",{"cols":["packWay","packNumber"],"type":false});
                                        page.packValidate.isEnabled=false;
                                      }else{
                                        pubsub.publish("packWay.enabled",false);
                                        pubsub.publish("groupingCapacity.enabled",false);
                                        pubsub.publish("mdMrlDeliveryModeDetailDTOs.activateCol",{"cols":["packWay","packNumber"],"type":true});
                                        page.packValidate.isEnabled=true;
                                      }
                                    }
                                  })
                                `
                              }
                            }
                          ]
                        }
                      ],*/
                      displayField: "value",
                      valueField: "id",
                    }} component={SelectField} name="packStandard" />
                  </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <Field config={{
                      id: "packWay",
                      label: "套料包装方式",  //标签名称
                      enabled: false,
                      labelSpan: 8,   //标签栅格比例（0-24）
                      wrapperSpan: 16,  //输入框栅格比例（0-24）
                      placeholder:"请选择",
                      dataSource: {
                        type: "api",
                        method: "post",
                        url: "/sm/dictionaryEnumValue/query.action",
                        mode: "payload",
                        payload: {
                          "query": {
                            "query": [
                              {
                                "field": "smDictionaryEnumGid", "type": "eq", "value": "585A3538E4747896E055000000000001"
                              }
                            ],
                            "sorted": "seq"
                          }
                        }
                      },
                      displayField: "val",
                      valueField: "gid",
                    }} component={SelectField} name="packWay" />
                    </Col>
                    <Col span={12}>
                      <Field config={{
                        id: "groupingCapacity",
                        enabled: false,  //是否启用
                        visible: true,  //是否可见
                        label: "分组容量(套)",  //标签名称
                        size:'large',  //尺寸大小:large、small
                        min:1,        //最小、大值
                        max:undefined,
                        showRequiredStar: false,
                        //formatter:'rmb',   //百分比%：percent；货币￥：rmb（ 格式化数字，以展示具有具体含义的数据）
                        step:undefined,   //小数位数: 0.01保留2位有效数值
                        //labelSpan: 4,   //标签栅格比例（0-24）
                        wrapperSpan: 12,  //输入框栅格比例（0-24）
                        hasFeedback: false,  //验证失败时是否显示feedback图案
                    }} name="groupingCapacity" component={InputNumberField}/>
                  </Col>
                </Row>
                <Row>
                    <Col span={12}>
                      <Row>
                        <Col span={20}>
                          <Field config={{
                            id: "deliveryBeat",
                            enabled: false,  //是否启用
                            visible: true,  //是否可见
                            label: "配送节拍",  //标签名称
                            size:'large',  //尺寸大小:large、small
                            min:0,        //最小、大值
                            max:undefined,
                            showRequiredStar: false,
                            //formatter:'rmb',   //百分比%：percent；货币￥：rmb（ 格式化数字，以展示具有具体含义的数据）
                            step:undefined,   //小数位数: 0.01保留2位有效数值
                            //labelSpan: 4,   //标签栅格比例（0-24）
                            wrapperSpan: 12,  //输入框栅格比例（0-24）
                            hasFeedback: false,  //验证失败时是否显示feedback图案
                        }} name="deliveryBeat" component={InputNumberField}/>
                        </Col>
                        <Col span={4}>
                        <Field config={{
                          id: "deliveryBeatType",
                          labelSpan: 8,   //标签栅格比例（0-24）
                          enabled: false,
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder:"请选择",
                          dataSource: {
                            type: "api",
                            method: "post",
                            url: "/ime/mdMrlDeliveryMode/getBeatTypeCombox.action"
                          },
                          displayField: "value",
                          valueField: "id",
                        }} component={SelectField} name="deliveryBeatType" />
                        </Col>
                      </Row>
                    </Col>
                </Row>
            </Card>
            <Card bordered={true}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="物料明细" key="1">
                <Row>
                    <Col span={2} offset={22}>
                        <AppButton config={{
                          id: "checkBatchMrl",
                          title: "批量选择物料",
                          type: "primary",
                          size: "default",
                          visible: true,
                          enabled: false,
                          subscribes:[
                            {
                              event:"checkBatchMrl.click",
                              pubs:[
                                {
                                  event:"checkMrlDetailPage.openModal"
                                }
                              ]
                            }
                          ]
                        }}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FieldArray name="mdMrlDeliveryModeDetailDTOs" config={{
                          "id": "mdMrlDeliveryModeDetailDTOs",
                          "name": "mdMrlDeliveryModeDetailDTOs",
                          "form":"logisticsModeForm",
                          "rowKey": "gid",
                          "addButton": false, //是否显示默认增行按钮
                          "showSelect":true, //是否显示选择框
                          "type":"radio", //表格单选（radio）复选（checkbox）类型
                          "unEditable":true, //初始化是否都不可编辑
                          "columns": [
                            {
                              "id": "materialDetailGidRef.code",
                              "type": "findbackField",
                              "title": "物料编号",
                              "name": "materialDetailGidRef.code",
                              "form":"logisticsModeForm",
                              tableInfo: {
                                id:"mrlDetail",
                                size:"small",
                                rowKey:"gid",
                                tableTitle:"物料信息",
                                showSerial:true,  //序号
                                columns:[
                                  {title: '物料编号', width: 100, dataIndex: 'materielInfoCode', key: '1'},
                                  {title: '物料名称', width: 100, dataIndex: 'materielInfoName', key: '2'},
                                  {title: '数量单位', dataIndex: 'measurementUnitName', key: '3', width: 150},
                                  {title: '供应仓库', dataIndex: 'materialWarehouseName', key: '4', width: 150},
                                  {title: '产线', dataIndex: 'mdFactoryLineName', key: '5', width: 150},
                                  {title: '工序', dataIndex: 'mdDefOperationName', key: '6', width: 150},
                                  {title: '工位', dataIndex: 'mdFactoryStationName', key: '7', width: 150}
                                ],
                                dataSource: {
                                  type: 'api',
                                  method: 'post',
                                  url: '/ime/mdMrlDeliveryMode/queryTemplateDTO.action'
                                }
                              },
                              pageId:'mrlDetailPage',
                              displayField: "materielInfoCode",
                              valueField: {
                                "from": "materielInfoCode",
                                "to": "materialDetailGidRef.code"
                              },
                              associatedFields: [
                                {
                                  "from": "materielInfoName",//物料名称
                                  "to": "materialDetailGidRef.name"
                                }, {
                                  "from": "measurementUnitName",//数量单位
                                  "to": "materialDetailGidRef.measurementUnitGidRef.name"
                                }, {
                                  "from": "materialWarehouseName",//供应仓库
                                  "to": "materialDetailGidRef.materialWarehouseRef.warehouseName"
                                }, {
                                  "from": "mdFactoryLineName",//产线
                                  "to": "mdFactoryLineGidRef.lineName"
                                },{
                                  "from": "mdDefOperationName",//工序
                                  "to": "mdDefOperationGidRef.name"
                                },
                                {
                                  "from": "mdFactoryStationName",//工位
                                  "to": "mdFactoryStationGidRef.stationName"
                                },
                                {
                                "from": "materielInfoGid",//物料主键
                                "to": "materialDetailGid"
                                },
                                {
                                  "from": "materialWarehouseGid",//仓库主键
                                  "to": "materialWarehouseGid"
                                },
                                {
                                  "from": "mdDefOperationGid",//工序主键
                                  "to": "mdDefOperationGid"
                                },
                                {
                                  "from": "measurementUnitGid",//单位主键
                                  "to": "measurementUnitGid"
                                },
                                {
                                  "from": "mdFactoryStationGid",//工位主键
                                  "to": "mdFactoryStationGid"
                                },
                                {
                                  "from": "mdFactoryLineGid",//产线主键
                                  "to": "mdFactoryLineGid"
                                },
                              ]
                            },
                            {
                              "id": "materialDetailGidRef.name",
                              "type": "textField",
                              "title": "物料名称",
                              "name": "materialDetailGidRef.name",
                              "enabled":false
                            },
                            {
                              "id": "materialDetailGidRef.measurementUnitGidRef.name",
                              "type": "textField",
                              "title": "数量单位",
                              "name": "materialDetailGidRef.measurementUnitGidRef.name",
                              "enabled":false
                            },
                            {
                              "id": "materialDetailGidRef.materialWarehouseRef.warehouseName",
                              "type": "textField",
                              "title": "供应仓库",
                              "name": "materialDetailGidRef.materialWarehouseRef.warehouseName",
                              "enabled":false
                            },
                            {
                              "id": "mdFactoryLineGidRef.lineName",
                              "type": "textField",
                              "title": "产线",
                              "name": "mdFactoryLineGidRef.lineName",
                              "enabled":false
                            },
                            {
                              "id": "mdDefOperationGidRef.name",
                              "type": "textField",
                              "title": "工序",
                              "name": "mdDefOperationGidRef.name",
                              "enabled":false
                            },
                            {
                              "id": "mdFactoryStationGidRef.name",
                              "type": "textField",
                              "title": "工位",
                              "name": "mdFactoryStationGidRef.stationName",
                              "enabled":false
                            },
                            {
                              "id": "packWay",
                              "type": "selectField",
                              "title": "包装方式",
                              "name": "packWay",
                              placeholder:"请选择",
                              dataSource: {
                                type: "api",
                                method: "post",
                                url: "/sm/dictionaryEnumValue/query.action",
                                mode: "payload",
                                payload: {
                                  "query": {
                                    "query": [
                                      {
                                        "field": "smDictionaryEnumGid", "type": "eq", "value": "585A3538E4747896E055000000000001"
                                      }
                                    ],
                                    "sorted": "seq"
                                  }
                                }
                              },
                              displayField: "val",
                              valueField: "gid",
                            },
                            {
                              "id": "packNumber",
                              "type": "textField",
                              "title": "包装数量",
                              "name": "packNumber",
                            },
                            {
                              "id": "kanbanrongliang",
                              "type": "textField",
                              "title": "看板容量",
                              "name": "kanbanrongliang",
                              "enabled":false
                            },
                            {
                              "id": "kanbanzhangshu",
                              "type": "textField",
                              "title": "看板张数",
                              "name": "kanbanzhangshu",
                              "enabled":false
                            },
                            {
                              "id": "buhuozhouqi",
                              "type": "textField",
                              "title": "补货周期",
                              "name": "buhuozhouqi",
                              "enabled":false
                            },
                            {
                              "id": "zhouqidanwei",
                              "type": "textField",
                              "title": "周期单位",
                              "name": "zhouqidanwei",
                              "enabled":false,
                            },
                            {
                              "id": "buhuoshiji",
                              "type": "textField",
                              "title": "补货时机",
                              "name": "buhuoshiji",
                              "enabled":false,
                            },
                            {
                              "id": "buhuoshuliang",
                              "type": "textField",
                              "title": "补货数量",
                              "name": "buhuoshuliang",
                              "enabled":false,
                            }
                          ]
                        }} component={TableField}/>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Card>
          </Content>
        </Layout>
      </Layout>
      <ModalContainer config={{
        visible: false, // 是否可见，必填*
        enabled: true, // 是否启用，必填*
        id: "checkMrlDetailPage", // id，必填*
        pageId: "checkMrlDetailPage", // 指定是哪个page调用modal，必填*
        type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
        width: "80%", // 宽度，默认520px
        okText: "确定", // ok按钮文字，默认 确定
        title: "选择物料",
        cancelText: "取消", // cancel按钮文字，默认 取消
        style: { top: 80 }, // style样式
        wrapClassName: "wcd-center", // class样式
        hasFooter: false, // 是否有footer，默认 true
        maskClosable: true, // 点击蒙层是否允许关闭，默认 true
      }}
      >
        <LogisticsModalPage/>
      </ModalContainer>
      </div>
    );
  }
}

LogisticsModePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

function mapStateToProps(props) {
  return {
    config:{id:"LogisticsModePageGid"},
    onSubmit:()=>{}
  };
}
let LogisticsModePageForm =  reduxForm({
  form: "logisticsModeForm",
  validate
})(LogisticsModePage)

export default connect(mapStateToProps, mapDispatchToProps)(LogisticsModePageForm);