import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col ,Tabs} from 'antd';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'
import { Link } from 'react-router';

import DropdownButton from 'components/DropdownButton';

import ModalContainer from 'components/ModalContainer'

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
import AppTable from 'components/AppTable';

import CoreComponent from 'components/CoreComponent'

import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
const TabPane = Tabs.TabPane;

const validate = values => {
    const errors = {}
    if (!values.get('code')) {
        errors.code = '必填项'
    }
    return errors
};


export class DispatchOrderDetailPage extends React.PureComponent {
  constructor(props) {
    super(props);

      let modifyData;
      let modifyId;

      console.log('sssss:::',this.props.location.state)

    if(_.isArray(this.props.location.state)){
        modifyData = this.props.location.state[0];
        modifyId = this.props.location.state[0].gid;
    }else{
        modifyData = this.props.location.state;
        modifyId = this.props.location.state.gid;
    }

      if(modifyData!=undefined){

          var self=this;

          if(modifyData.imeWorkOrderGidRef==null){
              delete modifyData.imeWorkOrderGidRef;
          }  if(modifyData.mdFactoryWorkUnitGidRef==null){
              delete modifyData.mdFactoryWorkUnitGidRef;
          }

          let dataSource={
              mode: "dataContext",
              type: "api",
              method: "POST",
              url:'/ime/imeTrackOrder/findById.action'
          }

          resolveDataSource({ dataSource, dataContext: { id: modifyId } }).then(function (data) {
              if(!modifyData.trackOrderStatus){
                  modifyData.trackOrderStatus =''
              }else{
                  modifyData.trackOrderStatus =data.ext.enumHeader.trackOrderStatus[modifyData.trackOrderStatus]
              }

              if(!modifyData.imeWorkOrderGidRef&&!modifyData.imeWorkOrderGidRef.productionLineGidRef&&!modifyData.imeWorkOrderGidRef.productionLineGidRef.lineType){
                  modifyData.imeWorkOrderGidRef.productionLineGidRef.lineType =''
              }else{
                  modifyData.imeWorkOrderGidRef.productionLineGidRef.lineType =data.ext.enumHeader['imeWorkOrderGidRef.productionLineGidRef.lineType'][modifyData.imeWorkOrderGidRef.productionLineGidRef.lineType]
              }

              // if(!modifyData.imeWorkOrderGidRef&&!modifyData.imeTrackOrderEquipmentDetailDTOs&&!modifyData.imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef&&!modifyData.imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef.status){
              //     modifyData.imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef.status =''
              // }else{
              //     modifyData.imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef.status =data.ext.enumHeader['imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef.status'][modifyData.imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef.status]
              // }

              if(!modifyData.delegateTypeGid){
                  modifyData.delegateTypeGid =''
              }else{
                  modifyData.delegateTypeGid =data.ext.enumHeader['modifyData.delegateTypeGid'][modifyData.delegateTypeGid]
              }


              pubsub.publish("@@form.init", { id: "detail", data: Immutable.fromJS(modifyData) })
          })

          this.kk= modifyData.imeWorkOrderGidRef.productionLineGid;


      }

      pubsub.subscribe('dispatchOrderDetail-table-1.onTableTodoAny',()=>{

      })

  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>生产管理</Breadcrumb.Item>
          <Breadcrumb.Item>生产派工单</Breadcrumb.Item>
          <Breadcrumb.Item>派工详情页</Breadcrumb.Item>
        </Breadcrumb>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
              <Row>
                  <Col>
                      <AppButton config={{
                          id: "save222",
                          title: "保存",
                          visible: true,
                          enabled: true,
                          type: "primary",
                          subscribes: [
                              {
                                  event: "save222.click",
                                  behaviors: [
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              url: "/ime/imePlanOrder/add.action",
                                              withForm: "detail",
                                          },
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@message.success",
                                                  payload: "保存成功",
                                              }
                                          ],
                                          errorPubs:[
                                              {
                                                  event: "@@message.error",
                                                  eventPayloadExpression:`
                                                        if(eventPayload){
                                                            callback(eventPayload)
                                                        }else{
                                                            callback("保存失败!")
                                                        }

                                                  `
                                              }
                                          ],
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
                      }}></AppButton>

                      {
                          this.props.location.state&&_.isArray(this.props.location.state)?
                          <AppButton config={{
                              id: "cancel333",
                              title: "取消",
                              visible: true,
                              enabled: true,
                              type: "primary",
                              subscribes: [
                                  {
                                      event: "cancel333.click",
                                      pubs: [
                                          {
                                              event: "@@navigator.goBack",

                                          }
                                      ]
                                  }
                              ]
                          }}></AppButton>:
                              <AppButton config={{
                                  id: "cancel222",
                                  title: "取消",
                                  visible: true,
                                  enabled: true,
                                  type: "primary",
                                  subscribes: [
                                      {
                                          event: "cancel222.click",
                                          pubs: [
                                              {
                                                  event: "@@navigator.push",
                                                  payload: {
                                                      url: "/imeDispatch",
                                                      bigGid:this.props.location.state.bigGid,
                                                      bigKey:this.props.location.state.bigKey,
                                                  }
                                              }
                                          ]
                                      }
                                  ]
                              }}></AppButton>


                      }



                  </Col>
              </Row>
          </Card>
          <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "code",
                          label: "派工单编号",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          showRequiredStar: true,  //是否显示必填星号
                          placeholder: "请输入编码"
                      }} component={TextField} name="code" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          form: "detail",
                          id: "gCode",
                          label: "来源工单",
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          // formMode:'edit',
                          dataSource: {
                          },
                          tableInfo: {
                              id: "tableId555",
                              size: "small",
                              form: "detail",
                              rowKey: "gid",
                              tableTitle: "来源工单",
                              columns: [
                                  { title: '来源订单', width: 100, dataIndex: 'planOrderGidRef.code', key: '1' },
                                  { title: '工单编号', width: 100, dataIndex: 'code', key: '2' },
                                  { title: '产品编号', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '3' },
                                  { title: '产品名称', dataIndex: 'productGidRef.materialGidRef.name', key: '4', width: 100 },
                                  { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '5', width: 100 },
                                  { title: '计划数量', dataIndex: 'planQty', key: '6', width: 100 },
                                  { title: '本批数量', dataIndex: 'actualQty', key: '7', width: 100 },
                                  { title: '计划开始日期', dataIndex: 'workOrderBeginTime', key: '8', width: 100 },
                                  { title: '交付日期', dataIndex: 'deliverTime', key: '9', width: 100 },
                                  { title: '产线', dataIndex: 'productionLineGidRef.lineName', key: '10', width: 100 },
                                  { title: '工单顺序', dataIndex: 'workOrderSeq', key: '11', width: 100 },
                                  { title: '工艺路线', dataIndex: 'routeGidRef.name', key: '12', width: 100 },
                                  { title: '工单类型', dataIndex: 'workOrderTypeGid', key: '13', width: 100 },
                                  { title: '工单状态', dataIndex: 'workOrderStatusGid', key: '14', width: 100 },
                                  { title: 'BOM状态', dataIndex: 'workOrderBomStatusGid', key: '15', width: 100 }
                                ],
                                  dataSource: {
                                      type: 'api',
                                      method: 'post',
                                      url: '/ime/imeWorkOrder/query.action'
                                  }
                          },
                          pageId: 'findBack66ooo56565656',
                          displayField: "productGidRef.materialGidRef.code",
                          valueField: {
                              "from": "productGidRef.materialGidRef.code",
                              "to": "productGidRef.materialGidRef.code"
                          },

                      }} name="imeWorkOrderGidRef.code" component={FindbackField} />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          form: "detail",
                          id: "gCode",
                          label: "产品编号",
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          // formMode:'edit',
                          dataSource: {
                          },
                          tableInfo: {
                              id: "tableId555",
                              size: "small",
                              form: "detail",
                              rowKey: "gid",
                              tableTitle: "来源工单",
                              columns: [
                                  { title: '来源订单', width: 100, dataIndex: 'planOrderGidRef.code', key: '1' },
                                  { title: '工单编号', width: 100, dataIndex: 'code', key: '2' },
                                  { title: '产品编号', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '3' },
                                  { title: '产品名称', dataIndex: 'productGidRef.materialGidRef.name', key: '4', width: 100 },
                                  { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '5', width: 100 },
                                  { title: '计划数量', dataIndex: 'planQty', key: '6', width: 100 },
                                  { title: '本批数量', dataIndex: 'actualQty', key: '7', width: 100 },
                                  { title: '计划开始日期', dataIndex: 'workOrderBeginTime', key: '8', width: 100 },
                                  { title: '交付日期', dataIndex: 'deliverTime', key: '9', width: 100 },
                                  { title: '产线', dataIndex: 'productionLineGidRef.lineName', key: '10', width: 100 },
                                  { title: '工单顺序', dataIndex: 'workOrderSeq', key: '11', width: 100 },
                                  { title: '工艺路线', dataIndex: 'routeGidRef.name', key: '12', width: 100 },
                                  { title: '工单类型', dataIndex: 'workOrderTypeGid', key: '13', width: 100 },
                                  { title: '工单状态', dataIndex: 'workOrderStatusGid', key: '14', width: 100 },
                                  { title: 'BOM状态', dataIndex: 'workOrderBomStatusGid', key: '15', width: 100 }
                              ],
                              dataSource: {
                                  type: 'api',
                                  method: 'post',
                                  url: '/ime/imeWorkOrder/query.action'
                              }
                          },
                          pageId: 'findBack66ooo56565656',
                          displayField: "productGidRef.materialGidRef.code",
                          valueField: {
                              "from": "productGidRef.materialGidRef.code",
                              "to": "productGidRef.materialGidRef.code"
                          },
                      }} component={FindbackField} name="mdProductInfoGidRef.materialGidRef.code" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          form: "detail",
                          id: "gCode222",
                          label: "工序编号",
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          // formMode:'edit',
                          dataSource: {
                          },
                          tableInfo: {
                              id: "tableId555222",
                              size: "small",
                              form: "detail",
                              rowKey: "gid",
                              tableTitle: "工序编号",
                              columns: [
                                  { title: '工序编号', width: 100, dataIndex: 'mdDefOperationCode', key: '1' },
                                  { title: '工序名称', width: 100, dataIndex: 'mdDefOperationName', key: '2' },

                              ],
                              dataSource: {
                                  type: 'api',
                                  method: 'post',
                                  url: '/ime/mdDefOperation/query.action'
                              }
                          },
                          pageId: 'findBack66ooo56565656222',
                          displayField: "operationCode",
                          valueField: {
                              "from": "mdDefOperationCode",
                              "to": "operationCode"
                          }
                      }} component={FindbackField} name="operationCode" />
                  </Col>
              </Row>

              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          form: "detail",
                          id: "gCode33313",
                          label: "工作单元",
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          // formMode:'edit',
                          dataSource: {
                          },
                          tableInfo: {
                              id: "tableId55533313",
                              size: "small",
                              form: "detail",
                              rowKey: "gid",
                              tableTitle: "工作单元",
                              onLoadData: false,
                              showSerial: false,
                              columns: [
                                  { title: '工作单元编号', width: 100, dataIndex: 'workUnitCode', key: '1' },
                                  { title: '工作单元名称', width: 100, dataIndex: 'workUnitName', key: '2' },

                              ],

                              subscribes:[
                                  {
                                      event:'tableId55533313.onTableTodoAny',
                                      pubs:[
                                          {
                                              event:'tableId55533313.expression',
                                              meta:{
                                                  expression:`

                                                  let dataSource= {
                                                    type: 'api',
                                                    method: 'post',
                                                    mode:"payload&&eventPayload",
                                                    url: '/ime/mdFactoryWorkUnit/query.action',
                                                  };

                                                  let query={
                                                    "query": {
                                                        "query": [
                                                            {
                                                              "field": "factoryLineGid ", "type": "eq", "value": '${this.kk}'
                                                            }
                                                          ],
                                                          "sorted": "gid asc"
                                                        },
                                                        "pager":{
                                                            "page":1,
                                                            "pageSize":10
                                                        }
                                                    }

                                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:query},function(ddd){
                                                        pubsub.publish("tableId55533313.setData",{eventPayload:ddd.data})
                                                   })

                                                  `
                                              }
                                          }
                                      ]

                                  },


                              ]
                          },
                          pageId: 'findBack66ooo56565656333313',
                          displayField: "workUnitName",
                          valueField: {
                              "from": "workUnitName",
                              "to": "mdFactoryWorkUnitGidRef.workUnitName"
                          }
                      }} component={FindbackField} name="mdFactoryWorkUnitGidRef.workUnitName" />
                  </Col>



                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          form: "detail",
                          id: "gCode444",
                          label: "工位编号",
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          // formMode:'edit',
                          dataSource: {
                          },
                          subscribes:[
                              {
                                  event:'gCode33313.onChange',
                                  pubs:[
                                      {
                                          event:'gCode444.expression',
                                          meta:{
                                              expression:`
                                                me.dataContext={
                                                    gid:data.eventPayload.gid
                                                }

                                              `
                                          }
                                      }
                                  ]
                              }
                          ],
                          tableInfo: {
                              id: "tableId444",
                              size: "small",
                              form: "detail",
                              rowKey: "gid",
                              tableTitle: "工位编号",
                              onLoadData: false,
                              showSerial: false,
                              columns: [
                                  { title: '工位编号', width: 100, dataIndex: 'stationCode', key: '1' },
                                  { title: '工位名称', width: 100, dataIndex: 'stationName', key: '2' },

                              ],

                              subscribes:[
                                  {
                                      event:'tableId444.onTableTodoAny',
                                      pubs:[
                                          {
                                              event:'tableId444.expression',
                                              meta:{
                                                  expression:`
                                                    let dataSource= {
                                                        type: 'api',
                                                        method: 'post',
                                                        mode:"payload&&eventPayload",
                                                        url: '/ime/mdFactoryWorkStation/query.action',
                                                      };

                                                        resolveFetch({fetch:{id:'gCode444',data:'dataContext'}}).then(function(dt){
                                                            console.log('dt:::',dt)
                                                            if(dt==undefined){
                                                                delete dataSource.mode;
                                                                resolveDataSourceCallback({dataSource:dataSource},function(ddd){
                                                                    pubsub.publish("tableId444.setData",{eventPayload:ddd.data})
                                                               },function(e){
                                                                 console.log(e)
                                                               })
                                                            }else{
                                                                let query={
                                                                    "query": {
                                                                        "query": [
                                                                            {
                                                                              "field": "workUnitGid ", "type": "eq", "value": dt.gid
                                                                            },
                                                                            {
                                                                              "field": "workUnitGidRef.factoryLineGid", "type": "eq", "value": '${this.kk}'
                                                                            },
                                                                          ],
                                                                          "sorted": "gid asc"
                                                                        },
                                                                        "pager":{
                                                                            "page":1,
                                                                            "pageSize":10
                                                                        }
                                                                    }

                                                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:query},function(ddd){
                                                                        pubsub.publish("tableId444.setData",{eventPayload:ddd.data})
                                                                   })


                                                            }



                                                        })

                                                  `
                                              }
                                          }
                                      ]
                                  }
                              ],

                              // dataSource: {
                              //     type: 'api',
                              //     method: 'post',
                              //     url: '/ime/mdFactoryWorkStation/query.action'
                              // }
                          },
                          pageId: 'findBack66ooo56565656444',
                          displayField: "mdFactoryWorkStationGidRef.stationCode",
                          valueField: {
                              "from": "stationCode",
                              "to": "mdFactoryWorkStationGidRef.stationCode"
                          }
                      }} component={FindbackField} name="mdFactoryWorkStationGidRef.stationCode" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "realNum",
                          label: "接收人员",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "根据规则回写",
                      }} component={TextField} name="receivePersonnelGidRef.personnelName" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "statePay",
                          label: "开工人员",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "根据规则回写",
                      }} component={TextField} name="receivePersonnelGidRef.personnelName" />
                  </Col>
              </Row>

              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "orderState",
                          label: "完工人员",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "根据规则回写"
                      }} component={TextField} name="finishPersonnelGidRef.personnelName" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "artRoute",
                          label: "委外类型",
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "请选择",
                          dataSource: {
                              type: "customValue",
                              values: [
                                  { key: "0", value: "自制" },
                                  { key: "1", value: "委外" }
                              ]
                          },
                          displayField: "value",
                          valueField: "key",
                      }} name="delegateTypeGid" component={SelectField} />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "workCenter",
                          label: "优先级别",
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
                      }} name="priorityLevelGid" component={SelectField} />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          id: "number-1",
                          enabled: true,  //是否启用
                          visible: true,  //是否可见
                          label: "计划数量:",  //标签名称
                          size:'large',  //尺寸大小:large、small
                          min:1,        //最小、大值
                          max:undefined,
                          step:undefined,   //小数位数: 0.01保留2位有效数值
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          hasFeedback: false  //验证失败时是否显示feedback图案
                      }} name="planQty" component={InputNumberField} />
                  </Col>
              </Row>

              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "planStartData",
                          label: "计划开始时间",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "计划开始时间"
                      }} component={DateField} name="planBeginTime" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: true,
                          id: "planFinishData",
                          label: "计划完成时间",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "计划完成时间"
                      }} component={DateField} name="planEndTime" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "planFinishData22",
                          label: "测算开始时间",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "测算开始时间"
                      }} component={DateField} name="calculateBeginTime" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "planFinishData333",
                          label: "测算结束时间",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "测算结束时间"
                      }} component={DateField} name="calculateEndTime" />
                  </Col>
              </Row>

              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "planFinishData444",
                          label: "实际开始时间",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "实际开始时间"
                      }} component={DateField} name="actualBeginTime" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "factFinishTime555",
                          label: "实际结束时间",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "请输入时间"
                      }} component={DateField} name="actualEndTime" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          id: "number-2",
                          enabled: false,  //是否启用
                          visible: true,  //是否可见
                          label: "完工数量:",  //标签名称
                          size:'large',  //尺寸大小:large、small
                          min:1,        //最小、大值
                          max:undefined,
                          step:undefined,   //小数位数: 0.01保留2位有效数值
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          hasFeedback: false  //验证失败时是否显示feedback图案
                      }} component={InputNumberField} name="finiahQty" />
                  </Col>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "guessFinishTime66622",
                          label: "派工单状态",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "派工单状态"
                      }} component={TextField} name="trackOrderStatus" />
                  </Col>

              </Row>

              <Row>
                  <Col span={6}>
                      <Field config={{
                          enabled: false,
                          id: "gOrder77722",
                          label: "产线类型",  //标签名称
                          labelSpan: 8,   //标签栅格比例（0-24）
                          wrapperSpan: 16,  //输入框栅格比例（0-24）
                          placeholder: "产线类型"
                      }} component={TextField} name="imeWorkOrderGidRef.productionLineGidRef.lineType" />
                  </Col>
              </Row>
          </Card>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
              <Tabs defaultActiveKey="1">
                  <TabPane forceRender="true" tab="人员/班组" key="1">
                      <AppTable name="dispatchOrderDetail-table-1" config={{
                          "id":"dispatchOrderDetail-table-1",
                          "name":"dispatchOrderDetail-table-1",
                          "type":"checkbox",//表格单选复选类型
                          "size":"default",//表格尺寸
                          "rowKey": "gid",//主键
                          "onLoadData":false,//初始化是否加载数据
                          "showSerial":true,
                          "editType":true,
                          "isSearch":false,
                          "columns":[
                              { title: '班组编号', width: 100, dataIndex: 'mdTeamInfoGidRef.code', key: '1' },
                              { title: '班组名称', width: 100, dataIndex: 'imeTrackOrderTeamPersonnelDetailDTOs.mdTeamInfoGidRef.name', key: '2' },
                              { title: '人员编号', dataIndex: 'smPersonnelGidRef.personnelCode', key: '3', width: 100 },
                              { title: '人员名称', dataIndex: 'smPersonnelGidRef.personnelName', key: '4', width: 100 },
                              { title: '人员分类', dataIndex: 'smPersonnelGidRef.smPersonnelTypeLevelGidRef.personnelTypeName', key: '5', width: 100 },
                              { title: '业务单元', dataIndex: 'smPersonnelGidRef.smBusiUnitGidRef.busiUnitName', key: '6', width: 100 },
                              { title: '部门', dataIndex: 'smPersonnelGidRef.smDepartmentGidRef.name', key: '7', width: 100 },
                          ],
                          subscribes:[
                              {
                                  event:'dispatchOrderDetail-table-1.onTableTodoAny',
                                  behaviors:[
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              mode:"dataContext",
                                              url: `/ime/imeTrackOrder/findById.action`,
                                              payload:{id:(_.isArray(this.props.location.state)?this.props.location.state[0].gid:this.props.location.state.gid)},
                                              payloadMapping:[
                                                  {
                                                      from:'@@Array',
                                                      to:'imeTrackOrderTeamPersonnelDetailDTOs'
                                                  }
                                              ]
                                          },
                                          successPubs:[
                                              {
                                                  event:'dispatchOrderDetail-table-1.setData',
                                                  mode:'dataContext'
                                              }
                                          ]
                                      }
                                  ]
                              },


                          ]

                      }}/>
                  </TabPane>

                  <TabPane forceRender="true" tab="位置" key="2">
                      <AppTable name="orderRepealTable" config={{
                          "id":"dispatchOrderDetail-table-2",
                          "name":"dispatchOrderDetail-table-2",
                          "type":"checkbox",//表格单选复选类型
                          "size":"default",//表格尺寸
                          "rowKey": "gid",//主键
                          "onLoadData":false,//初始化是否加载数据
                          "showSerial":true,
                          "editType":true,
                          "isSearch":false,
                          "columns":[
                              { title: '工作单元', width: 100, dataIndex: 'mdFactoryWorkUnitGidRef.workUnitName', key: '1' },
                              { title: '工位编码', width: 100, dataIndex: 'mdFactoryWorkStationGidRef.stationCode', key: '2' },
                              { title: '工位名称', dataIndex: 'mdFactoryWorkStationGidRef.stationName', key: '3', width: 150 },
                              { title: '工作日历', dataIndex: 'mdFactoryWorkStationGidRef.smCalendarGidRef.calendarName', key: '4', width: 150 },
                              { title: '备注', dataIndex: 'mdFactoryWorkStationGidRef.remarks', key: '5', width: 150 },

                          ],
                          subscribes:[
                              {
                                  event:'dispatchOrderDetail-table-2.onTableTodoAny',
                                  behaviors:[
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              mode:"dataContext",
                                              url: `/ime/imeTrackOrder/findById.action`,
                                              payload:{id:(_.isArray(this.props.location.state)?this.props.location.state[0].gid:this.props.location.state.gid)},
                                              payloadMapping:[
                                                  {
                                                      from:'@@Array',
                                                      to:'imeTrackOrderPositionDetailDTOs'
                                                  }
                                              ]
                                          },
                                          successPubs:[
                                              {
                                                  event:'dispatchOrderDetail-table-2.setData',
                                                  mode:'dataContext'
                                              }
                                          ]
                                      }
                                  ]
                              },
                          ]

                      }}/>
                  </TabPane>

                  <TabPane forceRender="true" tab="设备" key="3">
                      <AppTable name="orderRepealTable" config={{
                          "id":"dispatchOrderDetail-table-3",
                          "name":"dispatchOrderDetail-table-3",
                          "type":"checkbox",//表格单选复选类型
                          "size":"default",//表格尺寸
                          "rowKey": "gid",//主键
                          "onLoadData":false,//初始化是否加载数据
                          "showSerial":true,
                          "editType":true,
                          "isSearch":false,
                          "columns":[
                              { title: '设备编码', width: 100, dataIndex: 'mdEquipmentGidRef.code', key: '1' },
                              { title: '设备名称', width: 100, dataIndex: 'mdEquipmentGidRef.name', key: '2' },
                              { title: '设备型号', dataIndex: 'mdEquipmentGidRef.model', key: '3', width: 150 },
                              { title: '设备规格', dataIndex: 'mdEquipmentGidRef.spec', key: '4', width: 150 },
                              { title: '设备类型', dataIndex: 'mdEquipmentGidRef.mdEquipmentTypeGidRef.name', key: '5', width: 150 },
                              { title: '计量单位', dataIndex: 'mdEquipmentGidRef.mdMeasurementUnitGidRef.name', key: '6', width: 150 },
                              { title: '设备状态', dataIndex: 'mdEquipmentGidRef.status', key: '7', width: 150 },
                              { title: '设备序列号', dataIndex: 'mdEquipmentGidRef.serialNo', key: '8', width: 150 },

                          ],
                          subscribes:[
                              {
                                  event:'dispatchOrderDetail-table-3.onTableTodoAny',
                                  behaviors:[
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              mode:"dataContext",
                                              url: `/ime/imeTrackOrder/findById.action`,
                                              payload:{id:(_.isArray(this.props.location.state)?this.props.location.state[0].gid:this.props.location.state.gid)},
                                              payloadMapping:[
                                                  {
                                                      from:'@@Array',
                                                      to:'imeTrackOrderEquipmentDetailDTOs'
                                                  }
                                              ]
                                          },
                                          successPubs:[
                                              {
                                                  event:'dispatchOrderDetail-table-3.setData',
                                                  mode:'dataContext'
                                              }
                                          ]
                                      }
                                  ]
                              },
                          ]

                      }}/>
                  </TabPane>

                  <TabPane forceRender="true" tab="报工记录" key="4">
                      <AppTable name="orderRepealTable" config={{
                          "id":"dispatchOrderDetail-table-4",
                          "name":"dispatchOrderDetail-table-4",
                          "type":"checkbox",//表格单选复选类型
                          "size":"default",//表格尺寸
                          "rowKey": "gid",//主键
                          "onLoadData":false,//初始化是否加载数据
                          "showSerial":true,
                          "editType":true,
                          "isSearch":false,
                          "columns":[
                              { title: '操作状态', width: 100, dataIndex: 'operationStatus', key: '1' },
                              { title: '开始时间', width: 100, dataIndex: 'startDate', key: '2' },
                              { title: '开始用户', dataIndex: 'startPersonGidRef.personnelName', key: '3', width: 150 },
                              { title: '结束时间', dataIndex: 'endDate', key: '4', width: 150 },
                              { title: '结束用户', dataIndex: 'endPersonGidRef.personnelName', key: '5', width: 150 },
                          ],
                          subscribes:[
                              {
                                  event:'dispatchOrderDetail-table-4.onTableTodoAny',
                                  behaviors:[
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              mode:"payload",
                                              url: `/ime/imeTrackRecord/query.action`,
                                              payload:{
                                                  "query":{
                                                      "query":[
                                                          {
                                                              field:"imeTrackOrderGid",
                                                              type:"eq",
                                                              value:(_.isArray(this.props.location.state)?this.props.location.state[0].gid:this.props.location.state.gid),
                                                              left:"(",
                                                              right:")",
                                                              operator:"and"
                                                          }
                                                      ]
                                                  },
                                                  "pager":{
                                                      "page":"1",
                                                      "pageSize":"10"
                                                  }
                                              },
                                          },
                                          successPubs:[
                                              {
                                                  event:'dispatchOrderDetail-table-4.setData',
                                              }
                                          ]
                                      }
                                  ]
                              },
                              {
                                  event:'orderRepealModal-table-11.onSelectedRows',
                                  behaviors:[
                                      {
                                          type:'fetch',
                                          id:'orderRepealModal-table-11',
                                          data:'selectedRows',
                                          successPubs:[
                                              {
                                                  event:'orderRepealModal-btn-2.dataContext',

                                              }
                                          ]
                                      }
                                  ]
                              }

                          ]

                      }}/>
                  </TabPane>

              </Tabs>
          </Card>

      </div>
    );
  }
}

DispatchOrderDetailPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


let DispatchOrderDetail= reduxForm({
    form: "detail",
    validate,
    initialValues: Immutable.fromJS({})
})(DispatchOrderDetailPage)

function mapStateToProps(props) {
    return {
        onSubmit:()=>{}
    };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DispatchOrderDetail);
