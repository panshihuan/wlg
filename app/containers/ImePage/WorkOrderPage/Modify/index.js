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
  if(values.get('workOrderEndTime')&&values.get('workOrderBeginTime')){
    var endTime = new Date(values.get('workOrderEndTime').substr(0,10).replace(/-/,"/")) 
    var beginTime = new Date(values.get('workOrderBeginTime').substr(0,10).replace(/-/,"/")) 
    if(!(endTime>beginTime)){
      errors.workOrderEndTime = "计划开始时间必须小于计划完成时间"
      errors.workOrderEndTime = "计划开始时间必须小于计划完成时间"
    }
  }
  if (!values.get('code')) {
    errors.code = '必填项'
  } 
  if (!values.get('workOrderBeginTime')) {
    errors.workOrderBeginTime = '必填项'
  }
  if (!values.get('actualQty')) {
    errors.actualQty = '必填项'
  }
  if (!values.get('workOrderEndTime')) {
    errors.workOrderEndTime = '必填项'
  }
  if (!reg.test(values.get('planQty'))) {
    errors.planQty = '请输入数字'
  }
  if (!values.getIn(['productionLineGidRef','lineName'])) {
    errors.productionLineGidRef={}
    errors.productionLineGidRef.lineName = '必填项'
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

  if (!vv.imeWorkOrderDetailDTOs || !vv.imeWorkOrderDetailDTOs.length) {
    //errors.imeWorkOrderDetailDTOs = { _error: 'At least one member must be entered' }
  } else {
    const membersArrayErrors = []
    vv.imeWorkOrderDetailDTOs.forEach((member, memberIndex) => {
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
      errors.imeWorkOrderDetailDTOs = membersArrayErrors
    }
  }
  return errors
}

class Modify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    pubsub.subscribe("planNum.onChange", (name, payload) => {
      pubsub.publish("@@form.change", { id: "modify", name: "actualQty", value: payload })
    })
    pubsub.subscribe("workCenter.onChange", (name, payload) => {
      pubsub.publish("@@form.change", { id: "modify", name: "productionLineGidRef.lineType", value: '' })
      pubsub.publish("@@form.change", { id: "modify", name: "productionLineGidRef.lineName", value: '' })
      pubsub.publish("@@form.change", { id: "modify", name: "productionLineGid", value: '' })
      pubsub.publish("workLine.setDisplayValue", '')
    })
    let modifyId = this.props.location.state[0].gid
    let modifyData = this.props.location.state[0]
    let dataSource = {
      mode: "dataContext",
      type: "api",
      method: "POST",
      url: "/ime/imeWorkOrder/findById.action",
    }
    resolveDataSource({ dataSource, dataContext: { id: modifyId } }).then(function (data) {
      if(!modifyData.workOrderStatusGid){
        modifyData.workOrderStatusName =''
      }else{
        modifyData.workOrderStatusName =data.ext.enumHeader.workOrderStatusGid[modifyData.workOrderStatusGid]
      }
      if(!modifyData.workOrderBomStatusGid){
        modifyData.workOrderBomStatusName =''
      }else{
        modifyData.workOrderBomStatusName =data.ext.enumHeader.workOrderBomStatusGid[modifyData.workOrderBomStatusGid]
      }
      modifyData.imeWorkOrderDetailDTOs = data.data.imeWorkOrderDetailDTOs
      pubsub.publish("@@form.init", { id: "modify", data: Immutable.fromJS(modifyData) })
    })
  }

  componentWillMount() {
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  componentWillReceiveProps(nextProps) {
    pubsub.publish("addChange2")
  }

  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item>生产管理</Breadcrumb.Item>
          <Breadcrumb.Item>生产工单</Breadcrumb.Item>
          <Breadcrumb.Item>工单详情</Breadcrumb.Item>
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
                          url: "/ime/imeWorkOrder/modify.action?",
                          withForm: "modify",
                        },
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            payload: {
                              url: "/imeWorkOrder"
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
                          },{
                            event: "@@navigator.push",
                            payload: {
                              url: "/imeWorkOrder"
                            }
                          }
                        ]
                      }
                    ],
                    pubs: [
                      {
                        /*event: "@@navigator.push",
                        payload: {
                          url: "/imeOrder"
                        },*/

                      }
                    ]
                  }
                ]
              }}/>
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
                          url: "/imeWorkOrder"
                        }
                      }
                    ]
                  }
                ]
              }}/>
            </Col>
          </Row>
        </Card>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
          <Row>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "code",
                label: "工单编号",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  //是否显示必填星号
                placeholder: "请输入编码"
              }} component={TextField} name="code" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                form: "modify",
                id: "zgCode",
                label: "产品编号",
                showRequiredStar: true,
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                // formMode:'edit',
              }} name="productGidRef.materialGidRef.code" component={TextField} />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "gName",
                label: "产品名称",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                showRequiredStar: true,
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据产品编码带出"
              }} component={TextField} name="productGidRef.materialGidRef.name" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "numUnit",
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
                id: "payTime",
                label: "交付期限",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入日期"
              }} component={DateField} name="deliverTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                id: "planNum",
                label: "计划数量",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入"
              }} component={TextField} name="planQty" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "realNum",
                label: "本批数量",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "＝计划数量",


              }} component={TextField} name="actualQty" />
            </Col>
            <Col span={6}>
              <Field config={{
                id: "orderType",
                label: "工单类型",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                dataSource: {
                  type: "api",
                  method:"post",
                  url:"/sm/dictionaryEnumValue/query.action",
                  mode:"payload",
                  payload:{
                    "query":{
                      "query":[
                        {
                          "field":"smDictionaryEnumGid","type":"eq","value":"56B2314945384BE1E055000000000001"
                        }
                      ],
                      "sorted":"seq"
                    }
                  }
                },
                displayField: "val",
                valueField: "gid",
              }} component={SelectField} name="workOrderTypeGid" />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "orderState",
                label: "工单状态",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写"
              }} component={TextField} name="workOrderStatusName" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled:false,
                id: "artRoute",
                label: "工艺路线",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据产品编码带出",
              }} component={TextField} name="routeGidRef.name"/>
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "workCenter",
                label: "工作中心",
                form: "modify",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  
                // formMode:'edit',

                tableInfo: {
                  id: "tableId5jkdljkldjd",
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
                pageId: 'findBack66rff',
                displayField: "workCenterName",
                valueField: {
                  "from": "workCenterName",
                  "to": "workCenterGidRef.workCenterName"
                },
                associatedFields: [
                  {
                    "from": "gid",
                  "to": "workCenterGid"
                  }
                ]
              }} name="workCenterGidRef.workCenterName" component={FindbackField} />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "workLine",
                label: "产线",
                form: "modify",
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  
                subscribes: [
                  {
                    event: "workCenter.onChange",
                    pubs: [
                      {
                        event: "workLine.expression",//在某个组件上执行表达式
                        meta: {
                          expression: `
                            me.dataContext={gid:data.eventPayload.gid}
                          `
                        }
                      }
                    ]
                  }
                ],
                tableInfo: {
                  id: "tableIkkkkdllgge",
                  size: "small",
                  rowKey: "gid",
                  width: "600",
                  tableTitle: "产线",
                  onLoadData: false,
                  showSerial: true,
                  columns: [
                    { title: '产线编码', dataIndex: 'lineCode', key: '1', width: 200 },
                    { title: '产线名称', dataIndex: 'lineName', key: '2', width: 200 },
                    { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '3', width: 200 },
                  ],
                  subscribes: [
                    {
                      event: "tableIkkkkdllgge.onTableTodoAny",
                      behaviors: [
                        {
                          type: "fetch",
                          id: "modify", //要从哪个组件获取数据
                          data: "@@formValues",//要从哪个组件的什么属性获取数据
                          successPubs: [  //获取数据完成后要发送的事件
                            {
                              event: "tableIkkkkdllgge.loadData",
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
                    }
                  ],
                  dataSource:{
                    type: 'api',
                    method: 'post',
                    url: '/ime/mdFactoryLine/query.action',
                    pager:true,
                  }
                },
                pageId: 'findBack66rudjddh',
                displayField: "lineName",
                valueField: {
                  "from": "lineName",
                  "to": "productionLineGidRef.lineName"
                },
                associatedFields: [
                  {
                    "from": "workCenterGidRef.workCenterName",
                    "to": "workCenterGidRef.workCenterName"
                  },{
                  "from": "gid",
                  "to": "productionLineGid"
                },{
                  "from": "workCenterGid",
                  "to": "workCenterGid"
                },{
                    "from": "lineType",
                  "to": "productionLineGidRef.lineType"
                  }
                ],
              }} name="productionLineGidRef.lineName" component={FindbackField} />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "planStartData",
                label: "计划开始日期",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入",
                showRequiredStar: true,  
              }} component={DateField} name="workOrderBeginTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "planFinishData",
                label: "计划完成时间",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入",
                showRequiredStar: true,  
              }} component={DateField} name="workOrderEndTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                id: "priorityLevel",
                label: "优先级别",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请选择",
                dataSource: {
                  type: "api",
                  method:"post",
                  url:"/sm/dictionaryEnumValue/query.action",
                  mode:"payload",
                  payload:{
                    "query":{
                      "query":[
                        {"field":"smDictionaryEnumGid","type":"eq","value":"56B2315955384BE1E055000000000001"}
                      ],
                      "sorted":"seq"
                    }
                  },
                },
                displayField: "val",
                valueField: "gid",
              }} component={SelectField} name="priorityLevel" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "lineType",
                label: "产线类型",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                showRequiredStar: true,  
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
                id: "factStartTime",
                label: "实际开始时间",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "请输入时间",
                showTime: true,
              }} component={DateField} name="actualBeginTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "factFinishTime",
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
                id: "orderEndNum",
                label: "完工数量",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写"
              }} component={TextField} name="finishQty" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "BOMState",
                label: "BOM状态",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写"
              }} component={TextField} name="workOrderBomStatusName" />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "guessStartTime",
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
                id: "guessFinishTime",
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
                id: "gOrder",
                label: "工单顺序",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写"
              }} component={TextField} name="workOrderSeq" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "orderProcess",
                label: "来源订单",  //标签名称
                labelSpan: 8,   //标签栅格比例（0-24）
                wrapperSpan: 16,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写"
              }} component={TextField} name="planOrderGidRef.code" />
            </Col>
          </Row>
        </Card>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="子物料" key="1">

            <Row type="flex" justify="space-between">
                <Col span={2}>
                <AppButton config={{
                  id: "adgonghiksk",
                title: "增加",
                type: "primary",
                size: "small",
                visible: true,
                enabled: true,
                subscribes:[
                  {
                    event:"adgonghiksk.click",
                    pubs:[
                      {
                        event:"tafnjnjdkkdll0jsodojw4jh777frr.addRow"
                      }
                    ]
                  }
                ]
                }}/>
                </Col>

                <Col span={4}>
                <AppButton config={{
                  id: "addOkziwulk",
                title: "子物料拆分",
                type: "primary",
                size: "small",
                visible: true,
                enabled: false,
                subscribes:[
                  {
                    event:"tafnjnjdkkdll0jsodojw4jh777frr.onSelectedRows",
                    pubs:[
                          {
                            event:"tafnjnjdkkdll0jsodojw4jh777frr.expression",
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
                        id:"tafnjnjdkkdll0jsodojw4jh777frr",
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
                </Col>
                </Row>

              <Row>
                <Col span={24}>
                  <FieldArray name="imeWorkOrderDetailDTOs" config={{
                    "id": "tafnjnjdkkdll0jsodojw4jh777frr",
                    "name": "tableFiledkkdhegrfera3678b",
                    "rowKey": "id",
                    showSelect:true,
                    addButton :false,
                    type:"radio",
                    form:"modify",
                    "columns": [
                      {
                        id: "tableFiled8jjoooppp",
                        type: "findbackField",
                        title: "物料编号",
                        form: "modify",
                        name: "materialGidRef.code",
                        tableInfo: {
                          id: "tapdjbdbndxs",
                          size: "small",
                          rowKey: "gid",
                          width: "500",
                          tableTitle: "物料编号",
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
                        pageId: 'tableFijoodoodd',
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
                        "id": "tableFiled18",
                        "type": "textField",
                        "title": "物料名称",
                        "name": "materialGidRef.name",
                        "enabled": false
                      }, {
                        "id": "tableFiled29",
                        "type": "textField",
                        "title": "规格",
                        "name": "materialGidRef.spec",
                        "enabled": false
                      }, {
                        "id": "tableFiled39",
                        "type": "textField",
                        "title": "型号",
                        "name": "materialGidRef.model",
                        "enabled": false
                      }, {
                        "id": "tableFiled499",
                        "title": "计量单位",
                        "type": "textField",
                        "name": "materialGidRef.measurementUnitGidRef.name",
                        "enabled": false
                      }, {
                        "id": "tableFiled588",
                        "title": "物料数量(分子)",
                        "type": "textField",
                        "name": "materialNumber",
                        "enabled": false
                      }, {
                        "id": "tableFiled698",
                        "title": "产品数量(分母)",
                        "type": "textField",
                        "name": "productNumber",
                        "enabled": false
                      }, {
                        "id": "tableFiled7888",
                        "title": "计划用量",
                        "type": "textField",
                        "name": "planQty"
                      }, {
                        "id": "tableFiled8888",
                        "title": "订单用量",
                        "type": "textField",
                        "name": "orderQty",
                        "enabled": false,
                        subscribes:[
                          {
                            event:"tableFiled7888.onChange",
                            pubs:[
                              {
                                event:"tableFiled8888.expression",
                                meta: {
                                  expression: `
                                  let pnum = parseInt(data.eventPayload)
                                    resolveFetch({fetch:{id:'realNum',data:'props'}}).then(function(data){
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
                            event:"planNum.onChange",
                            outSide:true,                            
                            pubs:[
                              {
                                event:"tableFiled8888.expression",
                                meta: {
                                  expression: `
                                  let pnum = parseInt(data.eventPayload)
                                    resolveFetch({fetch:{id:'tableFiled7888['+me.props.config.rowIndex+']',data:'props'}}).then(function(data){
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
                        "id": "tableSelectFileddd1",
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
                        "id": "tableFiled8jjkfffffkoooppk7udlaiyuan",
                        "type": "findbackField",
                        "title": "来源仓库",
                        "form": "modify",
                        "name": "wareHouseGidRef.warehouseName",
                        tableInfo: {
                          id: "tapdjbdvcbndxsffvgfddslaiyuan",
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
                        pageId: 'tableFijofffffsoodyuan',
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
                        "id": "tableFiled8jjkkfffxuxcwjkk7ud",
                        "type": "findbackField",
                        "title": "工序",
                        "form": "modify",
                        "name": "mdRouteOperationName",
                        subscribes: [
                          {
                              event:"tapdjbdvcbndfffffddsvgfdds.onTableTodoAny",
                              pubs:[
                                {
                                  event:"tapdjbdvcbndfffffddsvgfdds.expression",
                                  meta: {
                              expression:`
                              resolveFetch({fetch:{id:'modify',data:'@@formValues'}}).then(function(da){
                                if(!da.productGidRef){
                                  da.productGidRef = {}
                                }
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
                          id: "tapdjbdvcbndfffffddsvgfdds",
                          size: "small",
                          rowKey: "gid",
                          width: "500",
                          tableTitle: "工序",
                          onLoadData: false,
                          showSerial: true,  //序号
                          columns: [
                            { title: '工序编码', width: 100, dataIndex: 'code', key: '1' },
                            { title: '工序名称', width: 100, dataIndex: 'name', key: '2' },
                          ],
                        },
                        pageId: 'tableFgongxuofoodd',
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
                        "id": "tableFigongweiohhdsxcwjkk7ud",
                        "type": "findbackField",
                        "title": "工位",
                        "form": "modify",
                        "name": "factoryStationGidRef.stationName",
                        subscribes:[
                          {
                            event:"tableFigongweiohhdsxcwjkk7ud.onTableTodoAny",
                            behaviors: [
                              {
                                type: "fetch",
                                id: "modify", //要从哪个组件获取数据
                                data: "@@formValues",//要从哪个组件的什么属性获取数据
                                successPubs: [  //获取数据完成后要发送的事件
                                  {
                                    event: "tapdjbdvi4ffsvg2222ddfffdds.loadData",
                                    eventPayloadExpression:`
                                    let payload ={}
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
                          id: "tapdjbdwei4ffsvg2222ddfffdds",
                          size: "small",
                          rowKey: "gid",
                          tableTitle: "工位",
                          width: "500",
                          showSerial: true,  //序号
                          onLoadData: false,
                          columns: [
                            { title: '工位编码', width: 100, dataIndex: 'stationCode', key: '1' },
                            { title: '工位名称', width: 150, dataIndex: 'stationName', key: '2' },
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/ime/mdFactoryWorkStation/query.action',
                            pager:true,
                          }
                        },
                        pageId: 'tablegongddddwertttweiodd',
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
                        "id": "tableFilgongyiluxiafffffc7ud",
                        "type": "findbackField",
                        "title": "工艺路线",
                        "form": "modify",
                        "name": "technicsGidRef.name",
                        tableInfo: {
                          id: "tapdjbdgugdd222ne",
                          size: "small",
                          rowKey: "gid",
                          tableTitle: "工艺路线",
                          width:100,
                          columns: [
                            { title: '工艺路线编码', width: 100, dataIndex: 'routeLineCode', key: '1' },
                            { title: '工艺路线名称', width:100, dataIndex: 'routeLineName', key: '2' },
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/ime/mdRouteLine/query.action',
                          }
                        },
                        pageId: 'tablegongyiluxiadd2odd',
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
                        "id": "tauisuddfffffffff1ddftrrrefsadew43",
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
  initialValues: Immutable.fromJS({ "orderType": "正常" })
})(Modify)

export default connect(mapStateToProps, mapDispatchToProps)(ModifyForm);
