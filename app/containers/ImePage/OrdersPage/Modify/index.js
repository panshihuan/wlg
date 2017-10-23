/*
 *
 * Modify
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'

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
import UploadField from 'components/Form/UploadField'
import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'

import ModalContainer from 'components/ModalContainer'
import AppTable from 'components/AppTable';

import DetailSplit from './DetailSplit'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

const TabPane = Tabs.TabPane;
const validate = values => {
  const errors = {}
  const reg = new RegExp("^[0-9]*$")
  if(values.get('planEndTime')&&values.get('planBeginTime')){

    var endTime = new Date(values.get('planEndTime').substr(0,10).replace(/-/,"/")) 
    var beginTime = new Date(values.get('planBeginTime').substr(0,10).replace(/-/,"/")) 
    if(!(endTime>beginTime)){
      errors.planEndTime = "计划开始时间必须小于计划完成时间"
      errors.planBeginTime = "计划开始时间必须小于计划完成时间"
    }
  }
  if (!values.get('planEndTime')) {
    errors.planEndTime = '必填项'
  }
  if (!values.get('planBeginTime')) {
    errors.planBeginTime = '必填项'
  }
  if (!values.get('planQty') ) {
    errors.planQty = '必填项'
  }
if (!reg.test(values.get('planQty'))) {
    errors.planQty = '请输入数字'
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
  

  let vv= values.toJS();

  if (!vv.imePlanOrderDetailDTOs || !vv.imePlanOrderDetailDTOs.length) {
    //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
  } else {
    const membersArrayErrors = []
    vv.imePlanOrderDetailDTOs.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.planQty) {
        memberErrors.planQty = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (!member ||member.materialGidRef == undefined|| member.materialGidRef.code ===undefined) {
        memberErrors.materialGidRef={}
        memberErrors.materialGidRef.code = '必填'
        membersArrayErrors[memberIndex] = memberErrors
      }
      
    })
    if (membersArrayErrors.length) {
      errors.imePlanOrderDetailDTOs = membersArrayErrors
    }
  }
return errors
}

class Modify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    pubsub.subscribe("planNum2.onChange", (name, payload) => {
      pubsub.publish("@@form.change", { id: "modify", name: "actualQty", value: payload }) 
    })
    pubsub.subscribe("workCenterwwwwwww.onChange", (name, payload) => {
      pubsub.publish("@@form.change", { id: "modify", name: "productionLineGidRef.lineType", value: '' })
      pubsub.publish("@@form.change", { id: "modify", name: "productionLineGidRef.lineName", value: '' })
      pubsub.publish("@@form.change", { id: "modify", name: "productionLineGid", value: '' })
      pubsub.publish("workLine1.setDisplayValue", '')
    })
    let modifyId = this.props.location.state[0].gid
    let modifyData = this.props.location.state[0]
    let dataSource = {
      mode: "dataContext",
      type: "api",
      method: "POST",
      url: "/ime/imePlanOrder/findById.action",
    }
    resolveDataSource({ dataSource, dataContext: { id: modifyId } }).then(function (data) {
      if(!modifyData.orderStatusGid){
        modifyData.orderStatusName =''
      }else{
        modifyData.orderStatusName =data.ext.enumHeader.orderStatusGid[modifyData.orderStatusGid]
      }
      if(!modifyData.bomStatusGid){
        modifyData.bomStatusName =''
      }else{
        modifyData.bomStatusName =data.ext.enumHeader.bomStatusGid[modifyData.bomStatusGid]
      }
      if(!modifyData.processStatus){
        modifyData.processStatusName =''
      }else{
        modifyData.processStatusName =data.ext.enumHeader.processStatus[modifyData.processStatus]
      }
      let subData = data.data.imePlanOrderDetailDTOs
      modifyData.imePlanOrderDetailDTOs = data.data.imePlanOrderDetailDTOs
      pubsub.publish("@@form.init", { id: "modify", data: Immutable.fromJS(modifyData) })
    })
    
  }

  componentWillMount() {
  }
  componentDidMount() {

  }
  componentWillUnmount() {
    pubsub.unsubscribe("submit")
  }
  componentWillReceiveProps(nextProps) {
    pubsub.publish("addChange")
  }

  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item>生产管理</Breadcrumb.Item>
          <Breadcrumb.Item>生产订单</Breadcrumb.Item>
          <Breadcrumb.Item>订单详情</Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
          <Row>
            <Col>
              <AppButton config={{
                id: "save22211111",
                title: "保存",
                visible: true,
                enabled: true,
                type: "primary",
                subscribes: [
                  {
                    event: "save22211111.click",
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/imePlanOrder/modify.action",
                          withForm: "modify",
                        },
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            payload: {
                              url: "/imeOrder"
                            }
                          }, {
                            event: "@@message.success",
                            payload: "修改成功"
                          }
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload: "修改失败"
                          }
                        ]
                      }
                    ],
                  }
                ]
              }}></AppButton>
              <AppButton config={{
                id: "cancel2221111111",
                title: "取消",
                visible: true,
                enabled: true,
                type: "primary",
                subscribes: [
                  {
                    event: "cancel2221111111.click",
                    pubs: [
                      {
                        event: "@@navigator.push",
                        payload: {
                          url: "/imeOrder"
                        }
                      }
                    ]
                  }
                ]
              }}></AppButton>
            </Col>
          </Row>
        </Card>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
          <Row>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "code1",
                label: "订单编号",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                enabled:false,
                placeholder: "请输入编码"
              }} component={TextField} name="code" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                form: "modify",
                id: "gCode1",
                label: "产品编号",
                showRequiredStar: true,
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                // formMode:'edit',
                tableInfo: {
                  id: "tableId55511111111",
                  size: "small",
                  rowKey: "gid",
                  width: "500",
                  tableTitle: "产品编号",
                  columns: [
                    { title: '产品编号', width: 200, dataIndex: 'materialGidRef.code', key: '1' },
                    { title: '产品名称', width: 200, dataIndex: 'materialGidRef.name', key: '2' },
                    { title: '计量单位', dataIndex: 'materialGidRef.measurementUnitGidRef.name', key: '3', width: 200 },
                    { title: '工艺路线', dataIndex: 'routePathRef.name', key: '4', width: 200 }
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'post',
                    url: '/ime/mdProductInfo/query.action'
                  }
                },
                pageId: 'findBack66ooo56565656111111112222222',
                displayField: "materialGidRef.code",
                valueField: {
                  "from": "materialGidRef.code",
                  "to": "productGidRef.materialGidRef.code"
                },
                associatedFields: [
                  {
                    "from": "materialGidRef.name",
                    "to": "productGidRef.materialGidRef.name"
                  },
                  {
                    "from": "materialGidRef.measurementUnitGidRef.name",
                    "to": "productGidRef.materialGidRef.measurementUnitGidRef.name"
                  },
                  {
                    "from": "routePathRef.name",
                    "to": "productGidRef.routePathRef.name"

                  },{
                  "from": "gid",
                  "to": "productGid"
                },{
                    "from": "routePath",
                    "to": "productGidRef.routePath"
                  }
                ],
                subscribes: [
                  {
                    event: "gCode1.onChange",
                    pubs: [
                      {
                        event: "gCode1.expression",//在某个组件上执行表达式
                        meta: {
                          expression: `
                          let dataSource= {type: "api",method: "POST",url: "/ime/mdProductInfo/findById.action?id="+data.eventPayload.gid};
                    resolveDataSourceCallback({dataSource:dataSource},function(res){

                      pubsub.publish("@@form.change", { id: "modify",name:"imePlanOrderDetailDTOs" ,value: fromJS(res.data.mdProductInfoDetailDTOs) })


                    })
                          `
                        }
                      }
                    ]
                  }
                ]
              }} name="productGidRef.materialGidRef.code" component={FindbackField} />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "gName1",
                label: "产品名称",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据产品编码带出"
              }} component={TextField} name="productGidRef.materialGidRef.name" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "numUnit1",
                label: "计量单位",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据产品编码带出"
              }} component={TextField} name="productGidRef.materialGidRef.measurementUnitGidRef.name" />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "payTime1",
                label: "交付期限",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入日期"
              }} component={DateField} name="deliverTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                id: "planNum2",
                label: "计划数量",  //标签名称
                showRequiredStar: true,
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入"
              }} component={TextField} name="planQty" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "realNum1",
                label: "本批数量",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "＝计划数量",


              }} component={TextField} name="actualQty" />
            </Col>
            <Col span={6}>
              <Field config={{
                id: "orderType1",
                label: "订单类型",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder:"正常",
                dataSource: {
                  type: "api",
                  method: "post",
                  url: "/sm/dictionaryEnumValue/query.action",
                  mode: "payload",
                  payload: {
                    "query": {
                      "query": [
                        {
                          "field": "smDictionaryEnumGid", "type": "eq", "value": "56B2314945384BE1E055000000000001"
                        }
                      ],
                      "sorted": "seq"
                    }
                  }
                },
                displayField: "val",
                valueField: "gid",
              }} component={SelectField} name="planOrderTypeGid" />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "orderState1",
                label: "订单状态",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写"
              }} component={TextField} name="orderStatusName" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "artRoute1",
                label: "工艺路线",
                form: "modify",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                // formMode:'edit',
                tableInfo: {
                  id: "tableId555lljdhgy1111dddd",
                  size: "small",
                  rowKey: "gid",
                  width: "500",
                  tableTitle: "工艺路线",
                  columns: [
                    { title: '工艺路线编码', dataIndex: 'routeLineCode', key: '1', width: 200 },
                    { title: '工艺路线名称', dataIndex: 'routeLineName', key: '2', width: 200 }
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'post',
                    url: '/ime/mdRouteLine/query.action',
                  }
                },
                pageId: 'findBack66ooo322efff333',
                displayField: "routeLineName",
                valueField: {
                  "from": "routeLineName",
                  "to": "productGidRef.routePathRef.name"
                },
                associatedFields: [
                  {
                  "from": "routeLineGid",
                  "to": "productGidRef.routePath"
                },
                ]
              }} name="productGidRef.routePathRef.name" component={FindbackField} />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "workCenterwwwwwww",
                label: "工作中心",
                showRequiredStar: true,
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）,
                form: "modify",
                tableInfo: {
                  id: "tableId555jjkdjkljkldjdeccccdddfta",
                  size: "small",
                  rowKey: "gid",
                  width: "500",
                  tableTitle: "工作中心",
                  columns: [
                    { title: '工作中心编码', width: 200, dataIndex: 'workCenterCode', key: '1' },
                    { title: '工作中心名称', width: 200, dataIndex: 'workCenterName', key: '2' },
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'post',
                    url: '/ime/mdFactoryWorkCenter/query.action',
                  }
                },
                pageId: 'findBack66rfddrfrdswe34fff',
                displayField: "workCenterName",
                valueField: {
                  "from": "workCenterName",
                  "to": "workCenterGidRef.workCenterName"
                },
                associatedFields: [
                  {
                  "from": "gid",
                  "to": "workCenterGid"
                },
                ]
              }} name="workCenterGidRef.workCenterName" component={FindbackField} />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "workLine1",
                label: "产线",
                form: "modify",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                subscribes: [
                  {
                    event: "workCenterwwwwwww.onChange",
                    pubs: [
                      {
                        event: "workLine1.expression",//在某个组件上执行表达式
                        meta: {
                          expression: `
                            me.dataContext={gid:data.eventPayload.gid}
                          `
                        }
                      }
                    ]
                  }
                ],
                // formMode:'edit',
                tableInfo: {
                  id: "tableIkkkkdlldgdcfg44rdsge",
                  size: "small",
                  rowKey: "gid",
                  width: "500",
                  tableTitle: "产线",
                  onLoadData: false,
                  showSerial: false,
                  columns: [
                    { title: '产线编码', dataIndex: 'lineCode', key: '1', width: 200 },
                    { title: '产线名称', dataIndex: 'lineName', key: '2', width: 200 },
                    { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '3', width: 200 },
                  ],
                  subscribes: [
                    {
                      event: "tableIkkkkdlldgdcfg44rdsge.onTableTodoAny",
                      behaviors: [
                        {
                          type: "fetch",
                          id: "modify", //要从哪个组件获取数据
                          data: "@@formValues",//要从哪个组件的什么属性获取数据
                          successPubs: [  //获取数据完成后要发送的事件
                            {
                              event: "tableIkkkkdlldgdcfg44rdsge.loadData",
                              eventPayloadExpression:`
                                let payload ={}
                                if(eventPayload != undefined){
                                  payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "workCenterGid", "type": "eq", "value": eventPayload.workCenterGid
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                                }
                                 callback(payload)
                              `
                            }
                          ]
                        }
                      ],
                      /*pubs: [
                        {
                          event: "tableIkkkkdlldgdcfg44rdsge.expression",//在某个组件上执行表达式
                          meta: {
                            expression: `
                            resolveFetch({fetch:{id:'modify',data:'@@formValues'}}).then(function(dt){
                              let dtGid = dt.workCenterGid
                             if(dtGid==undefined)
                              {
                                    pubsub.publish("tableIkkkkdlldgdcfg44rdsge.loadData")
                              }
                              else
                              {
                                let  payload = {
                    "query": {
                      "query": [
                        {
                          "field": "workCenterGid", "type": "eq", "value": dtGid
                        }
                      ],
                      "sorted": "gid asc"
                    },
                    "pager":{
        "page":1,
        "pageSize":10
    }
                  }
                                    pubsub.publish("tableIkkkkdlldgdcfg44rdsge.loadData",{eventPayload:payload})

                              }
                            })
                          `
                          }
                        }
                      ]*/
                    }
                  ],
                  dataSource:{
                    type: 'api',
                    method: 'post',
                    pager:true,
                    url: '/ime/mdFactoryLine/query.action',
                  },
                },
                pageId: 'findBack66rflefrf332rggglludjddh',
                displayField: "lineName",
                valueField: {
                  "from": "lineName",
                  "to": "productionLineGidRef.lineName"
                },
                associatedFields: [
                  {
                    "from": "workCenterGidRef.workCenterName",
                    "to": "workCenterGidRef.workCenterName"
                  }, {
                  "from": "gid",
                  "to": "productionLineGid"
                },{
                    "from": "workCenterGid",
                  "to": "workCenterGid"
                  },{
                    "from": "lineType",
                  "to": "productionLineGidRef.lineType"
                  }

                ]
              }} name="productionLineGidRef.lineName" component={FindbackField} />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "planStartData1",
                label: "计划开始日期",  //标签名称
                showRequiredStar: true,
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入"
              }} component={DateField} name="planBeginTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "planFinishData1",
                label: "计划完成时间",  //标签名称
                showRequiredStar: true,
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入"
              }} component={DateField} name="planEndTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                id: "priorityLevel1",
                label: "优先级别",  //标签名称
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
                        { "field": "smDictionaryEnumGid", "type": "eq", "value": "56B2315955384BE1E055000000000001" }
                      ],
                      "sorted": "seq"
                    }
                  },
                },
                displayField: "val",
                valueField: "gid",
              }} component={SelectField} name="priorityLevelGid" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "lineType1",
                label: "产线类型",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                dataSource: {
                  type: "api",
                  method: "post",
                  url: "/sm/dictionaryEnumValue/query.action",
                  mode:"payload",
                  payload: {
                    "query": {
                      "query": [
                        { "field": "smDictionaryEnumGid", "type": "eq", "value": "56350D1ED4843DB2E055000000000001" }
                      ],
                      "sorted": "seq"
                    }
                  },
                },
                displayField: "val",
                valueField: "gid",
              }} component={SelectField} name="productionLineGidRef.lineType" />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "factStartTime1",
                label: "实际开始时间",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入时间",
                showTime: true
              }} component={DateField} name="actualBeginTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "factFinishTime1",
                label: "实际结束时间",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入时间",
                showTime: true
              }} component={DateField} name="actualEndTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "orderEndNum1",
                label: "完工数量",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写"
              }} component={TextField} name="finishQty" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "BOMState1",
                label: "BOM状态",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写"
              }} component={TextField} name="bomStatusName" />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "guessStartTime1",
                label: "测算开始时间",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入时间",
                showTime: true
              }} component={DateField} name="measureBeginTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "guessFinishTime1",
                label: "测算完成时间",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入时间",
                showTime: true
              }} component={DateField} name="measureEndTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "gOrder1",
                label: "订单顺序",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写"
              }} component={TextField} name="orderSeq" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "orderProcess1",
                label: "进程状态",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写"
              }} component={TextField} name="processStatusName" />
            </Col>
          </Row>
        </Card>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="子物料" key="1">
            <Row type="flex" justify="space-between">
                <Col span={2}>
                <AppButton config={{
                  id: "adxiugaiuhiksk",
                title: "增加",
                type: "primary",
                size: "small",
                visible: true,
                enabled: true,
                subscribes:[
                  {
                    event:"adxiugaiuhiksk.click",
                    pubs:[
                      {
                        event:"tafnjnjjsodojw4jh777frredwschhj4.addRow"
                      }
                    ]
                  }
                ]
                }}/>
                </Col>
                <Col span={6}>
                <AppButton config={{
                  id: "addOkziwulk",
                title: "子物料拆分",
                type: "primary",
                size: "small",
                visible: true,
                enabled: false,
                subscribes:[
                  {
                    event:"tafnjnjjsodojw4jh777frredwschhj4.onSelectedRows",
                    pubs:[
                          {
                            event:"tafnjnjjsodojw4jh777frredwschhj4.expression",
                            meta:{
                              expression:`
                                let index
                                for(var i=0;i<me.rowIds.length;i++){
                                  if(me.rowIds[i] == data.eventPayload){
                                    index = i
                                  }
                                }
                                me.dataContext = index
                              `
                            }
                          },
                      
                      {
                        event:"addOkziwulk.enabled",
                        payload:true
                      }
                    ]
                  },{
                    event:"addOkziwulk.click",
                    behaviors:[
                      {
                        type:"fetch",
                        id:"tafnjnjjsodojw4jh777frredwschhj4",
                        data:"selectedRows",
                        successPubs:[
                          {
                            event:"addOkziwulk.expression",
                            meta:{
                              expression:`
                              me.dataContext = data['eventPayload']
                               if(!data['eventPayload'].materialNumber){
                                  pubsub.publish("@@message.error","物料数量为空无法拆分")
                                }else{
                                  pubsub.publish("pag6exx.openModal")
                                }
                              `
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
                }}/>
                <AppButton config={{
                  id: "adksk",
                title: "批量选择物料",
                type: "primary",
                size: "small",
                visible: true,
                enabled: true,
                subscribes:[
                  {
                    event:"adksk.click",
                    pubs:[
                      {
                        event:"pageIdxffre46666exx.openModal"
                      }
                    ]
                  }
                ]
                }}/>
                </Col>
                </Row>
              <Row>
                <Col span={24}>
                  <FieldArray name="imePlanOrderDetailDTOs" config={{
                    "id": "tafnjnjjsodojw4jh777frredwschhj4",
                    "name": "tableFiledkkdhegrfera3678b",
                    "rowKey": "id",
                    addButton :false,
                    type:"radio",
                    form:"modify",
                    showSelect:true,
                    "columns": [
                      {
                        id: "tableFiled8jjkkooopppddsxcwjkk7ud",
                        type: "findbackField",
                        title: "物料编号",
                        name: "materialGidRef.code",
                        form: "modify",
                        tableInfo: {
                          id: "tapdjbdvcbndxse44ffsvgfdds",
                          size: "small",
                          rowKey: "gid",
                          width: "500",
                          tableTitle: "物料信息",
                          showSerial: true,  //序号
                          columns: [
                            { title: '物料编号', width: 100, dataIndex: 'code', key: '1' },
                            { title: '物料名称', width: 150, dataIndex: 'name', key: '2' },
                            { title: '计量单位', dataIndex: 'measurementUnitGidRef.name', key: '3', width: 150 },
                            { title: '规格', dataIndex: 'spec', key: '4', width: 100 },
                            { title: '型号', dataIndex: 'model', key: '5', width: 100 },
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/ime/mdMaterielInfo/query.action',
                          }
                        },
                        pageId: 'tableFijosoodoodd',
                        displayField: "code",
                        valueField: {
                          "from": "code",
                          "to": "materialGidRef.code"
                        },
                        associatedFields: [
                          {
                            "from": "name",
                            "to": "materialGidRef.name"
                          }, {
                            "from": "measurementUnitGidRef.name",
                            "to": "materialGidRef.measurementUnitGidRef.name"
                          }, {
                            "from": "spec",
                            "to": "materialGidRef.spec"
                          }, {
                            "from": "model",
                            "to": "materialGidRef.model"
                          },
                          {
                          "from": "gid",
                          "to": "materialGid"
                        },
                        ]
                      }
                      , {
                        "id": "tableFiled1ssssssdffsd",
                        "type": "textField",
                        "title": "物料名称",
                        "name": "materialGidRef.name",
                        "enabled": false
                      }, {
                        "id": "tableFiled2sadfadfd",
                        "type": "textField",
                        "title": "规格",
                        "name": "materialGidRef.spec",
                        "enabled": false
                      }, {
                        "id": "tableFiled3dfsdewe",
                        "type": "textField",
                        "title": "型号",
                        "name": "materialGidRef.model",
                        "enabled": false
                      }, {
                        "id": "tableFiled4eddfdcfd",
                        "title": "计量单位",
                        "type": "textField",
                        "name": "materialGidRef.measurementUnitGidRef.name",
                        "enabled": false
                      }, {
                        "id": "tableFiled5dfdcdf",
                        "title": "物料数量(分子)",
                        "type": "textField",
                        "name": "materialNumber",
                        "enabled": false
                      }, {
                        "id": "tableFiled6dfsdswe",
                        "title": "产品数量(分母)",
                        "type": "textField",
                        "name": "productNumber",
                        "enabled": false
                      }, {
                        "id": "tableFiled7efadere",
                        "title": "计划用量",
                        "type": "textField",
                        "name": "planQty"
                      }, {
                        "id": "tableFiled8efdfwdew",
                        "title": "订单用量",
                        "type": "textField",
                        "name": "orderQty",
                        "enabled": false,
                        subscribes:[
                          {
                            event:"tableFiled7efadere.onChange",
                            pubs:[
                              {
                                event:"tableFiled8efdfwdew.expression",
                                meta: {
                                  expression: `
                                  let pnum = parseInt(data.eventPayload)
                                    resolveFetch({fetch:{id:'realNum1',data:'props'}}).then(function(data){
                                      if(!data.input.value){
                                        data.input.value = 0
                                      }
                                      let num = parseInt(data.input.value)
                                      let val 
                                      val = num * pnum
                                      pubsub.publish("@@form.change", { id: "modify", name: me.props.input.name, value: val })
                                    })
                                  `
                                }
                              }
                            ]
                          },{
                            event:"planNum2.onChange",
                            outSide:true,                            
                            pubs:[
                              {
                                event:"tableFiled8efdfwdew.expression",
                                meta: {
                                  expression: `
                                  let pnum = parseInt(data.eventPayload)
                                    resolveFetch({fetch:{id:'tableFiled7efadere['+me.props.config.rowIndex+']',data:'props'}}).then(function(data){
                                      if(!data.input.value){
                                        data.input.value = 0
                                      }
                                      let num = parseInt(data.input.value)
                                      let val 
                                      val = num * pnum
                                      pubsub.publish("@@form.change", { id: "modify", name: me.props.input.name, value: val })
                                    })
                                  `
                                }
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "id": "tableSelectFiled1efsddddsssadew43",
                        "type": "selectField",
                        "title": "领料方式",
                        "name": "pickingTypeGid",
                        dataSource: {
                          type: "api",
                          method: "post",
                          url: "/sm/dictionaryEnumValue/query.action",
                          mode: "payload",
                          payload: {
                            "query": {
                              "query": [
                                { "field": "smDictionaryEnumGid", "type": "eq", "value": "56272988A1791D58E156200100000001" }
                              ],
                              "sorted": "seq"
                            }
                          }
                        },
                        displayField: "val",
                        valueField: "gid"
                      }, {
                        "id": "tableFiled8jjkkooopppddsxcwjkk7udlaiyuan",
                        "type": "findbackField",
                        "title": "来源仓库",
                        "name": "wareHouseGidRef.warehouseName",
                        "form": "modify",
                        tableInfo: {
                          id: "tapdjbdvcbndxse44ffcf35svgfddslaiyuan",
                          size: "small",
                          rowKey: "gid",
                          width: "500",
                          tableTitle: "来源仓库",
                          showSerial: true,  //序号
                          columns: [
                            { title: '仓库编码', width: 100, dataIndex: 'warehouseCode', key: '1' },
                            { title: '仓库编码名称', width: 150, dataIndex: 'warehouseName', key: '2' },
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/ime/mdWarehouse/query.action',
                          }
                        },
                        pageId: 'tableFijosoodooddlaiyuccccan',
                        displayField: "warehouseName",
                        valueField: {
                          "from": "warehouseName",
                          "to": "wareHouseGidRef.warehouseName"
                        },
                        associatedFields: [
                           {
                          "from": "gid",
                          "to": "wareHouseGid"
                        },
                        ]
                      }, {
                        "id": "tableFiled8jjkkoogongxuxcwjkk7ud",
                        "type": "findbackField",
                        "title": "工序",
                        "name": "mdRouteOperationName",
                        "form": "modify",
                        subscribes: [
                          {
                              event:"tapdjbdvcbndxgongxuvgfdds.onTableTodoAny",
                              pubs:[
                                {
                                  event:"tapdjbdvcbndxgongxuvgfdds.expression",
                                  meta: {

                              expression:`
                              resolveFetch({fetch:{id:'modify',data:'@@formValues'}}).then(function(da){
                                if(da.productGidRef.routePath){
                                  let payload = {id:da.productGidRef.routePath}
                                  let dataSource = {
                            type: 'api',
                            method: 'post',
                            paramsInQueryString:true,
                            url: '/ime/mdRouteLine/findById.action',
                          }
                          resolveDataSourceCallback({dataSource:dataSource,eventPayload:payload},function(res){
                            pubsub.publish(me.props.config.id+'.setData',{eventPayload:res.data.mdRouteOperationDTOs})
                          })
                                }
                                  
                              })
                              `
                                  }
                                }
                                
                              ]
                            }
                        ],
                        tableInfo: {
                          id: "tapdjbdvcbndxgongxuvgfdds",
                          size: "small",
                          rowKey: "gid",
                          width: "500",
                          tableTitle: "工序",
                          onLoadData: false,
                          showSerial: true,  //序号
                          columns: [
                            { title: '工序编码', width: 100, dataIndex: 'code', key: '1' },
                            { title: '工序名称', width: 150, dataIndex: 'name', key: '2' },
                          ],
                        },
                        pageId: 'tableFgongxuodoodd',
                        displayField: "name",
                        valueField: {
                          "from": "name",
                          "to": "mdRouteOperationName"
                        },
                        associatedFields: [
                           {
                          "from": "gid",
                          "to": "mdRouteOperationGid"
                        },{
                          "from": "code",
                          "to": "mdRouteOperationCode"
                        },
                        ]
                      }, {
                        "id": "tableFigongweiopppddsxcwjkk7ud",
                        "type": "findbackField",
                        "title": "工位",
                        "name": "factoryStationGidRef.stationName",
                        "form": "modify",
                        subscribes:[
                          {
                            event:"tapdjbdvgongwei4ffsvgfdds.onTableTodoAny",
                            behaviors: [
                        {
                          type: "fetch",
                          id: "modify", //要从哪个组件获取数据
                          data: "@@formValues",//要从哪个组件的什么属性获取数据
                          successPubs: [  //获取数据完成后要发送的事件
                            {
                              event: "tapdjbdvgongwei4ffsvgfdds.loadData",
                              eventPayloadExpression:`
                              let payload ={}
                              let field
                              let gid 
                              if(eventPayload.productionLineGid){
                                payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "workUnitGidRef.factoryLineGid", "type": "eq", "value": eventPayload.productionLineGid
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                              }else if(eventPayload.workCenterGid){
                                payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "workUnitGidRef.factoryLineGidRef.workCenterGid", "type": "eq", "value": eventPayload.workCenterGid
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                              }else{
                                payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "workUnitGidRef.factoryLineGidRef.workCenterGid", "type": "eq", "value": "23"
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                              }
                                 callback(payload)
                              `
                            }
                          ]
                        }
                      ],
                          }
                        ],
                        tableInfo: {
                          id: "tapdjbdvgongwei4ffsvgfdds",
                          size: "small",
                          rowKey: "gid",
                          width: "500",
                          tableTitle: "工位",
                          showSerial: true,  //序号
                          onLoadData:false,
                          columns: [
                            { title: '工位编码', width: 100, dataIndex: 'stationCode', key: '1' },
                            { title: '工位名称', width: 150, dataIndex: 'stationName', key: '2' },
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            mode:"payload&&eventPayload",
                            url: '/ime/mdFactoryWorkStation/query.action',
                          }
                        },
                        pageId: 'tablegongweiodoodd',
                        displayField: "stationName",
                        valueField: {
                          "from": "stationName",
                          "to": "factoryStationGidRef.stationName"
                        },
                        associatedFields: [
                          {
                          "from": "gid",
                          "to": "factoryStationGid"
                        },
                        ]
                      }, {
                        "id": "tableFilgongyiluxiansxcwjkk7ud",
                        "type": "findbackField",
                        "title": "工艺路线",
                        "name": "technicsGidRef.name",
                        "form": "modify",
                        tableInfo: {
                          id: "tapdjbdgongyiluxiane44ffsvgfdds",
                          size: "small",
                          rowKey: "gid",
                          tableTitle: "工艺路线",
                          width: "500",
                          showSerial: true,  //序号
                          columns: [
                            { title: '工艺路线编码', width: 100, dataIndex: 'routeLineCode', key: '1' },
                            { title: '工艺路线名称', width: 150, dataIndex: 'routeLineName', key: '2' },
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/ime/mdRouteLine/query.action',
                          }
                        },
                        pageId: 'tablegongyiluxiandoodd',
                        displayField: "routeLineName",
                        valueField: {
                          "from": "routeLineName",
                          "to": "technicsGidRef.name"
                        },
                        associatedFields: [
                          {
                          "from": "gid",
                          "to": "technicsGid"
                        },
                        ],
                      }, {
                        "id": "tableSezhuisu1efsccccadew43",
                        "type": "selectField",
                        "title": "追溯",
                        "name": "reviewGid",
                        dataSource: {
                          type: "api",
                          method: "post",
                          url: "/sm/dictionaryEnumValue/query.action",
                          mode: "payload",
                          payload: {
                            "query": {
                              "query": [
                                { "field": "smDictionaryEnumGid", "type": "eq", "value": "56272988A1791D58E156000000000001" }
                              ],
                              "sorted": "seq"
                            }
                          }
                        },
                        displayField: "val",
                        valueField: "gid"
                      }
                    ]
                  }} component={TableField} />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>

        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "pageeeeffgg", // id，必填*
          pageId: "pag6exx", // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          width: "80%", // 宽度，默认520px
          okText: "确定", // ok按钮文字，默认 确定
          title: "拆分子物料",
          cancelText: "取消", // cancel按钮文字，默认 取消
          style: { top: 80 }, // style样式
          wrapClassName: "wcd-center", // class样式
          hasFooter: false, // 是否有footer，默认 true
          maskClosable: true, // 点击蒙层是否允许关闭，默认 true

        }}
        >
        <DetailSplit/>
        </ModalContainer>

        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "pageIdDidddssRecordteeeeeeeffgg", // id，必填*
          pageId: "pageIdxffre46666exx", // 指定是哪个page调用modal，必填*
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
          <AppTable name="end-tanchukuangjskDicord-table-indexall" config={{
            "id": "DisRecordletanchukuangxe",
            "name": "DisRecortanchukuangble-index-endjkjoiioi",
            "type": "checkbox",//表格单选复选类型
            "size": "default",//表格尺寸
            "rowKey": "gid",//主键
            "onLoadData": true,//初始化是否加载数据
            "width": 100,//表格宽度
            "showSerial": true,//是否显示序号
            "editType": true,//是否增加编辑列
            "page": 1,//当前页
            "pageSize": 4,
            "isSearch": true,//是否显示模糊查询
            "columns": [
              { title: '物料编码', width: 100, dataIndex: 'code', key: '1' },
              { title: '物料名称', width: 100, dataIndex: 'name', key: '2' },
              { title: '计量单位', dataIndex: 'measurementUnitGidRef.name', key: '3', width: 100 },
              { title: '规格', dataIndex: 'spec', key: '4', width: 100 },
              { title: '型号', dataIndex: 'model', key: '5', width: 100 },
            ],
            dataSource: {
              type: "api",
              method: "post",
              url: "/ime/mdMaterielInfo/query.action",
            }
          }} />
          <Row>
            <Col span={4} offset={20}>
              <AppButton config={{
                id: "DisRecordOk",
                title: "添加",
                type: "primary",
                size: "large",
                visible: true,
                enabled: false,
                subscribes: [
                  {
                    event: "DisRecordletanchukuangxe.onSelectedRows",
                    pubs: [
                      {
                        event: "DisRecordOk.enabled",
                        payload: true
                      }
                    ]
                  },
                  {
                    event: "DisRecordletanchukuangxe.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "DisRecordOk.enabled",
                        payload: false
                      }
                    ]
                  },
                  {
                    event: "DisRecordletanchukuangxe.onSelectedRows",
                    pubs: [
                      {
                        event: "DisRecordOk.dataContext"
                      }
                    ]
                  }, {
                    event: "DisRecordOk.click",
                    pubs:[
                      {
                        event:"DisRecordOk.expression",
                        meta:{
                          expression:`
                            for(var i=0; i < me.dataContext.length;i++){
                              me.dataContext[i].materialGidRef = {}
                              me.dataContext[i].materialGidRef.measurementUnitGidRef = {} 
                              me.dataContext[i].materialGidRef.code = me.dataContext[i].code
                              me.dataContext[i].materialGidRef.name = me.dataContext[i].name
                              me.dataContext[i].materialGidRef.spec = me.dataContext[i].spec
                              me.dataContext[i].materialGidRef.model= me.dataContext[i].model 
                              me.dataContext[i].materialGidRef.measurementUnitGidRef.name= me.dataContext[i].measurementUnitGidRef.name
                              me.dataContext[i].materialGid= me.dataContext[i].gid
                              me.dataContext[i].gid ="";
                            }
                            resolveFetch({fetch:{id:'modify',data:'@@formValues'}}).then(function(res){
                              if(!res.imePlanOrderDetailDTOs){
                              pubsub.publish("@@form.change", { id: "modify",name:"imePlanOrderDetailDTOs" ,value: fromJS(me.dataContext) })
                              pubsub.publish("pageIdDidddssRecordteeeeeeeffgg.onCancel")
                              }else{
                                let imeArr = res.imePlanOrderDetailDTOs.concat(me.dataContext)
                              pubsub.publish("@@form.change", { id: "modify",name:"imePlanOrderDetailDTOs" ,value: fromJS(imeArr) })
                              pubsub.publish("pageIdDidddssRecordteeeeeeeffgg.onCancel")
                              }
                              
                            })
                          `
                        }
                      }
                    ]
                  }
                ]
              }} />
              <AppButton config={{
                id: "DisRecordddeeeoioCancel",
                title: "取消",
                type: "default",
                size: "large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "DisRecordddeeeoioCancel.click",
                    pubs: [
                      {
                        event: "pageIdDidddssRecordteeeeeeeffgg.onCancel",
                      },
                    ]
                  }
                ]
              }} />
            </Col>
          </Row>
        </ModalContainer>
      </div>
    );
  }
}

Modify.propTypes = {
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



let ModifyForm = reduxForm({
  form: "modify",
  validate,
})(Modify)

export default connect(mapStateToProps, mapDispatchToProps)(ModifyForm);
