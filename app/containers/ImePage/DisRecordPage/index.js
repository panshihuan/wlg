import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from '../../../components/AppTable';
import DropdownButton from '../../../components/DropdownButton';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer'
import DisRecordDetailPage from './DisRecordDetailPage'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import TableField from 'components/Form/TableField';
import request from 'utils/request'

const validate = values => {
  const errors = {}
  const reg = new RegExp("^[0-9]*$")

  let vv= values.toJS();

  if (!vv.mdWorkOrderDetailDTOs || !vv.mdWorkOrderDetailDTOs.length) {
  } else {
    const membersArrayErrors = []
    vv.mdWorkOrderDetailDTOs.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.finiahQty || !reg.test(member.finiahQty)) {
        memberErrors.finiahQty = '请输入有效数字'
        membersArrayErrors[memberIndex] = memberErrors
      }
    })
    if (membersArrayErrors.length) {
      errors.mdWorkOrderDetailDTOs = membersArrayErrors
    }
  }
  return errors
}
export class DisRecordPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderSpit: ''
    }
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
          <Breadcrumb.Item>报工记录</Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
          <Row>
            <Col>
              <AppButton config={{
                id: "startWrokhhjsjkskso",
                title: "开工",
                visible: true,
                enabled: true,
                ghost: true,
                type: "primary",
                subscribes: [
                  {
                    event: "startWrokhhjsjkskso.click",
                    pubs: [
                      {
                        event: "pageIdxffre46666exx.openModal",
                      }
                    ]
                  }

                ]
              }}></AppButton>
              <AppButton config={{
                id: "startfddk09382903iphhjsjkskso",
                title: "开始",
                visible: true,
                enabled: true,
                ghost: true,
                type: "primary",
                subscribes: [
                  {
                    event: "startfddk09382903iphhjsjkskso.click",
                    pubs: [
                      {
                        event: "pageIdxffre46666exx2.openModal",
                      }
                    ]
                  }

                ]
              }}></AppButton>
              <AppButton config={{
                id: "endskjoiesoWrokhhjsjkskso",
                title: "完工",
                visible: true,
                enabled: true,
                ghost: true,
                type: "primary",
                subscribes: [
                  {
                    event: "endskjoiesoWrokhhjsjkskso.click",
                    behaviors:[
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/imeTrackOrder/getListByStartWorkStatus.action"
                        },
                        successPubs: [
                          {
                            event: "@@form.change",
                            eventPayloadExpression:`
                              if(eventPayload!=undefined){
                                callback({ id: "disRecordPageForm",name:"mdWorkOrderDetailDTOs" ,value:fromJS(eventPayload)})
                              }
                            `
                          }
                        ]
                      }
                    ],
                    pubs:[
                      {
                        event: "pageIdxffre46666exx3.openModal",
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
            <Col>
              <AppTable name="DisRecord-table-indexall" config={{
                "id": "DisRecord-table-index",
                "name": "DisRecord-table-index",
                "type": "checkbox",//表格单选复选类型
                "size": "default",//表格尺寸
                "rowKey": "gid",//主键
                "onLoadData": true,//初始化是否加载数据
                "width": 2200,//表格宽度
                "showSerial": true,//是否显示序号
                "editType": false,//是否增加编辑列
                "page": 1,//当前页
                "pageSize": 10,//一页多少条
                "isPager": true,//是否分页
                "isSearch": true,//是否显示模糊查询
                "conditions":[{"dataIndex":"code"},{"dataIndex":"imeWorkOrderGidRef.code"}],
                subscribes:[
                  {
                    event: "pageIdDidddssRecordteeeeeeeffgg.onCancel",
                    pubs:[
                      {
                        event:"DisRecord-table-index.loadData"
                      }
                    ]
                  },{
                    event: "pageIdDidddssRecordteeeeeeeffgg2.onCancel",
                    pubs:[
                      {
                        event:"DisRecord-table-index.loadData"
                      }
                    ]
                  },{
                    event: "pageIdDidddssRecordteeeeeeeffgg3.onCancel",
                    pubs:[
                      {
                        event:"DisRecord-table-index.loadData"
                      }
                    ]
                  }
                ],
                "columns": [
                  { title: '派工单号', width: 100, dataIndex: 'code', key: '1',columnsType: {"type": "link", url: "imeDispatch/detail"} },
                  { title: '来源工单', width: 100, dataIndex: 'imeWorkOrderGidRef.code', key: '2' },
                  { title: '产品编号', width: 100, dataIndex: 'mdProductInfoGidRef.materialGidRef.code', key: '3' },
                  { title: '工序编号', dataIndex: 'operationCode', key: '4', width: 100 },
                  { title: '工作单元', dataIndex: 'mdFactoryWorkUnitGidRef.workUnitName', key: '5', width: 100 },
                  { title: '工位编号', dataIndex: 'mdFactoryWorkStationGidRef.stationCode', key: '6', width: 100 },
                  { title: '设备编号', dataIndex: 'imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef.code', key: '7', width: 80 },
                  { title: '派工对象', dataIndex: '', key: '8', width: 100 },
                  { title: '接收人员', dataIndex: 'receivePersonnelGidRef.personnelName', key: '9', width: 100 },
                  { title: '开工人员', dataIndex: 'startPersonnelGidRef.personnelName', key: '10', width: 100 },
                  { title: '完工人员', dataIndex: 'finishPersonnelGidRef.personnelName', key: '11', width: 100 },
                  { title: '委外类型', dataIndex: 'delegateTypeGid', key: '12', width: 100 },
                  { title: '优先级别', dataIndex: 'priorityLevelGid', key: '13', width: 100 },
                  { title: '计划数量', dataIndex: 'planQty', key: '14', width: 100 },
                  { title: '计划开始时间', dataIndex: 'planBeginTime', key: '15', width: 100 },
                  { title: '计划完成时间', dataIndex: 'planEndTime', key: '16', width: 100 },
                  { title: '测算开始时间', dataIndex: 'calculateBeginTime', key: '17', width: 100 },
                  { title: '测算结束时间', dataIndex: 'calculateEndTime', key: '18', width: 100 },
                  { title: '实际开始时间', dataIndex: 'actualBeginTime', key: '19', width: 100 },
                  { title: '实际完成时间', dataIndex: 'actualEndTime', key: '20', width: 100 },
                  { title: '完工数量', dataIndex: 'finiahQty', key: '21', width: 100 },
                  { title: '派工单状态', dataIndex: 'trackOrderStatus', key: '22', width: 100 }
                ],
                dataSource: {
                  type: 'api',
                  method: 'post',
                  pager:true,
                  url: '/ime/imeTrackOrder/query.action'
                },
                subscribes:[
                  {
                    event:"finishDispachCode.onOk",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "mdWorkOrderDetailDTOs", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [
                          {
                            event: "@@message.success",
                            eventPayloadExpression:`
                             let params =[];
                             if(eventPayload != undefined){
                                for(var i = 0;i<eventPayload.length;i++){
                                  let obj = {gid:eventPayload[i].gid,finiahQty:eventPayload[i].finiahQty}
                                  params.push(obj)
                                }
                                let dataSource = {
                                  type: "api",
                                  method: "POST",
                                  mode:"payload",
                                  payload:params,
                                  url: "/ime/imeTrackRecord/finishWork.action"
                                }
                                
                                resolveDataSourceCallback({dataSource:dataSource},function(ddd){
                                  if(ddd.success){
                                    pubsub.publish("pageIdDidddssRecordteeeeeeeffgg3.onCancel")
                                    pubsub.publish("finishDispachCode.onCancel")
                                    pubsub.publish("DisRecord-table-index.loadData")
                                    callback("完工成功")
                                 }else{
                                   pubsub.publish("@@message.error","完工失败")
                                 }
                              })
                             }
                            `
                          }
                        ]                
                      }
                    ]
                  }
                ]
              }} />
            </Col>
          </Row>
        </Card>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
          <Row>
            <Col>
              <AppButton config={{
                id: "finishuuuuWrokhhjsjkskso",
                title: "结束",
                visible: true,
                //enabled: false,
                ghost: true,
                type: "primary",
                payload:"0",
                subscribes: [
                  {
                    event: "DisRecordtableindexendhjkahdudoi902i30.onSelectedRows",
                    pubs: [
                      {
                        event: "finishuuuuWrokhhjsjkskso.enabled",
                        payload: true
                      }
                    ]
                  },
                  {
                    event: "DisRecordtableindexendhjkahdudoi902i30.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "finishuuuuWrokhhjsjkskso.enabled",
                        payload: false
                      }
                    ]
                  },
                  {
                    event: "DisRecordtableindexendhjkahdudoi902i30.onSelectedRows",
                    pubs: [
                      {
                        event: "finishuuuuWrokhhjsjkskso.dataContext"
                      }
                    ]
                  },
                  {
                    event: "finishuuuuWrokhhjsjkskso.click",
                    pubs: [
                      {
                        event: "finishuuuuWrokhhjsjkskso.expression",
                        meta: {
                          expression: `
                          let dataSource = {
                        type: "api",
                          method: "POST",
                          url: "/ime/imeTrackRecord/checkOperationPerson.action",
                          mode:"dataContext",
                      }
                      
                      if(me.dataContext.length == 1 && me.dataContext[0].operationStatus == "20"){
                        pubsub.publish("@@message.error","已结束")
                      }else{
                        resolveDataSourceCallback({dataSource:dataSource,dataContext:me.dataContext.map(function(v){return v.gid})},function(res){
                        
                        me.payload = "2"
                        if(res.data == 1 ){
                          pubsub.publish("pageIdxxdrfrf3444eex.openModal")
                        pubsub.publish("@@form.init",{id:"disRecordDetailPage",data:me.dataContext[0]})
                        }else if(res.data == 2){
                          pubsub.publish("@@message.error","勾选自己的报工单")
                          pubsub.publish("finishuuuuWrokhhjsjkskso.chang")
                        }else if(res.data == 3){
                           let params = {
                          type: "api",
                          method: "POST",
                          url: "/ime/imeTrackRecord/endOtherOrder.action",
                          mode:"dataContext",
                        }
                        resolveDataSourceCallback({dataSource:params,dataContext:me.dataContext.map(function(v){return v.gid})},function(res){
                          
                          pubsub.publish("finishuuuuWrokhhjsjkskso.chang")
                          pubsub.publish("@@message.success","")
                        },function(e){
                          
                        })
                      }
                      },function(e){
                        
                      })
                      }
                      
                    `
                        }
                      }
                    ],
                  }
                ]
              }}></AppButton>
            </Col>
          </Row>
        </Card>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9",marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
          <Row>
            <Col>
            
              <AppTable name="end-sjksjksjskDisRecord-table-indexall" config={{
                "id": "DisRecordtableindexendhjkahdudoi902i30",
                "name": "DisRecord-table-index-endjkjoiioi",
                "type": "checkbox",//表格单选复选类型
                "size": "small",//表格尺寸
                "rowKey": "gid",//主键
                "onLoadData": false,//初始化是否加载数据
                "width": 900,//表格宽度
                "showSerial": true,//是否显示序号
                "editType": true,//是否增加编辑列
                "page": 1,//当前页
                "pageSize": 10,//一页多少条
                "isSearch": true,//是否显示模糊查询
                "conditions":[{"dataIndex":"code"},{"dataIndex":"imeTrackOrderGidRef.code"}],
                "columns": [
                  { title: '报工单号', width: 100, dataIndex: 'code', key: '1ddd' },
                  { title: '派工单号', width: 100, dataIndex: 'imeTrackOrderGidRef.code', key: '2fff',columnsType: {"type": "link", url: "imeDispatch/detail"} },
                  { title: '操作状态', width: 100, dataIndex: 'operationStatus', key: '3fff' },
                  { title: '开始时间', dataIndex: 'startDate', key: '4fff', width: 100 },
                  { title: '开始用户', dataIndex: 'startPersonGidRef.personnelName', key: '5fff', width: 100 },
                  { title: '工作单元', dataIndex: 'mdFactoryWorkUnitGidRef.workUnitName', key: '6ffv', width: 100 },
                  { title: '报工数量', dataIndex: 'orderNumber', key: '7ddds', width: 100 },
                  { title: '结束时间', dataIndex: 'endDate', key: '8e44', width: 100 },
                  { title: '结束用户', dataIndex: 'endPersonGidRef.personnelName', key: '94r5', width: 100 },
                ],
                dataSource: {
                  type: 'api',
                  method: 'post',
                  pager:true,
                  url: '/ime/imeTrackRecord/query.action'
                },
                subscribes:[
                  {
                    event:"pageIdDisRecordtableeeeeeeffgg.onCancel",
                    pubs:[
                      {
                        event:"DisRecordtableindexendhjkahdudoi902i30.loadData",
                        eventPayloadExpression:`
                        let params =me.dataContext;
                        if(params!=undefined){
                          let payload = {"eventPayload":{"query":{"query":
                            [
                              {"operator":"and","field":"imeTrackOrderGid", "type": "eq", "value": params.gid}
                            ]
                          }
                        }
                      }
                        callback(payload);
                      }
                        `
                      }
                    ]
                  },
                  {
                    event:"finishuuuuWrokhhjsjkskso.chang",
                    pubs:[
                      {
                        event:"DisRecordtableindexendhjkahdudoi902i30.loadData",
                        eventPayloadExpression:`
                        let params =me.dataContext;
                        if(params!=undefined){
                          let payload = {"eventPayload":{"query":{"query":
                            [
                              {"operator":"and","field":"imeTrackOrderGid", "type": "eq", "value": params.gid}
                            ]
                          }
                        }
                      }
                        callback(payload);
                      }
                        `
                      }
                    ]
                  },
                  {
                    event:"DisRecord-table-index.onClickRow",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "DisRecord-table-index", //要从哪个组件获取数据
                        data: "rowRecord",//要从哪个组件的什么属性获取数据
                        successPubs: [
                          {
                            event: "DisRecordtableindexendhjkahdudoi902i30.loadData",
                            eventPayloadExpression:`
                              me.dataContext = eventPayload;
                              if(eventPayload!=undefined){
                                  let payload = {"eventPayload":{"query":{"query":
                                    [
                                      {"operator":"and","field":"imeTrackOrderGid", "type": "eq", "value": eventPayload.gid}
                                    ]
                                  }
                                }
                              }
                                callback(payload);
                              }
                            `
                          }
                        ]                
                      }
                    ]
                  },
                  {
                    event:"DisRecord-table-index.onClickRowClear",
                    pubs:[
                      {
                        event:"DisRecordtableindexendhjkahdudoi902i30.setData",
                        eventPayloadExpression:`
                          callback({eventPayload:[]});
                        `
                      }
                    ]
                  }
                ]
              }} />
            </Col>
          </Row>
        </Card>

        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "pageIdDisRecordtableeeeeeeffgg", // id，必填*
          pageId: "pageIdxxdrfrf3444eex", // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          title: "任务结束", // title，不传则不显示title
          width: "80%", // 宽度，默认520px
          okText: "确定", // ok按钮文字，默认 确定
          cancelText: "取消", // cancel按钮文字，默认 取消
          style: { top: 80 }, // style样式
          wrapClassName: "wcd-center", // class样式
          hasFooter: false, // 是否有footer，默认 true
          maskClosable: true, // 点击蒙层是否允许关闭，默认 true
        }}
        >
          <DisRecordDetailPage />
        </ModalContainer>
        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "pageIdDidddssRecordteeeeeeeffgg", // id，必填*
          pageId: "pageIdxffre46666exx", // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          width: "80%", // 宽度，默认520px
          okText: "确定", // ok按钮文字，默认 确定
          title: "任务开工",
          cancelText: "取消", // cancel按钮文字，默认 取消
          style: { top: 80 }, // style样式
          wrapClassName: "wcd-center", // class样式
          hasFooter: false, // 是否有footer，默认 true
          maskClosable: true, // 点击蒙层是否允许关闭，默认 true

        }}
        >
        <Row>
            <Col>
          <AppTable name="end-tanchukuangjskDicord-table-indexall" config={{
            "id": "DisRecordletanchukuangxe",
            "name": "DisRecortanchukuangble-index-endjkjoiioi",
            "type": "checkbox",//表格单选复选类型
            "size": "small",//表格尺寸
            "rowKey": "gid",//主键
            "onLoadData": true,//初始化是否加载数据
            "width": 2200,//表格宽度
            "showSerial": true,//是否显示序号
            "editType": true,//是否增加编辑列
            "page": 1,//当前页
            "isSearch": true,//是否显示模糊查询
            "columns": [
              { title: '来源工单', width: 100, dataIndex: 'imeWorkOrderGidRef.code', key: '1' },
              { title: '产品编号', width: 100, dataIndex: 'mdProductInfoGidRef.materialGidRef.code', key: '2' },
              { title: '派工单号', width: 100, dataIndex: 'code', key: '3' ,columnsType: {"type": "link", url: "imeDispatch/detail"}},
              { title: '工序编号', dataIndex: 'operationCode', key: '4', width: 100 },
              { title: '工作单元', dataIndex: 'mdFactoryWorkUnitGidRef.workUnitName', key: '5', width: 100 },
              { title: '工位编号', dataIndex: 'mdFactoryWorkStationGidRef.stationCode', key: '6', width: 100 },
              { title: '设备编号', dataIndex: 'imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef.code', key: '7', width: 100 },
              { title: '派工对象', dataIndex: '', key: '8', width: 100 },
              { title: '接收人员', dataIndex: 'receivePersonnelGidRef.personnelName', key: '9', width: 100 },
              { title: '开工人员', dataIndex: 'startPersonnelGidRef.personnelName', key: '10', width: 100 },
              { title: '完工人员', dataIndex: 'finishPersonnelGidRef.personnelName', key: '11', width: 100 },
              { title: '委外类型', dataIndex: 'delegateTypeGid', key: '12', width: 100 },
              { title: '优先级别', dataIndex: 'priorityLevelGid', key: '13', width: 100 },
              { title: '计划数量', dataIndex: 'planQty', key: '14', width: 100 },
              { title: '计划开始时间', dataIndex: 'planBeginTime', key: '15', width: 100 },
              { title: '计划完成时间', dataIndex: 'planEndTime', key: '16', width: 100 },
              { title: '测算开始时间', dataIndex: 'calculateBeginTime', key: '17', width: 100 },
              { title: '测算结束时间', dataIndex: 'calculateEndTime', key: '18', width: 100 },
              { title: '实际开始时间', dataIndex: 'actualBeginTime', key: '19', width: 100 },
              { title: '实际完成时间', dataIndex: 'actualEndTime', key: '20', width: 100 },
              { title: '完工数量', dataIndex: 'finiahQty', key: '21', width: 100 },
              { title: '派工单状态', dataIndex: 'trackOrderStatus', key: '22', width: 100 }
            ],
            dataSource: {
              type: "api",
              method: "post",
              url: "/ime/imeTrackOrder/getListByAllotStatus.action",
            }
          }} />
          </Col>
          </Row>
          <Row>
            <Col span={4} offset={20}>
              <AppButton config={{
                id: "DisRecordOk",
                title: "确定",
                type: "primary",
                size: "large",
                visible: true,
                enabled: true,
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
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/imeTrackRecord/startWork.action",
                          payloadMapping: [{
                            from: "dataContext",
                            to: "@@Array",
                            key: "gid"
                          }]
                        },
                        successPubs: [
                          {
                            event: "@@message.success",
                            payload: "操作成功"
                          },
                          {
                            event: "pageIdDidddssRecordteeeeeeeffgg.onCancel"
                          },
                          {
                            event:"DisRecord-table-index.loadData"
                          }
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload: "操作失败"
                          },
                          {
                            event: "pageIdDidddssRecordteeeeeeeffgg.onCancel"
                          }
                        ]
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

        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "pageIdDidddssRecordteeeeeeeffgg2", // id，必填*
          pageId: "pageIdxffre46666exx2", // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          width: "80%", // 宽度，默认520px
          title: "任务开始",
          okText: "确定", // ok按钮文字，默认 确定
          cancelText: "取消", // cancel按钮文字，默认 取消
          style: { top: 80 }, // style样式
          wrapClassName: "wcd-center", // class样式
          hasFooter: false, // 是否有footer，默认 true
          maskClosable: true, // 点击蒙层是否允许关闭，默认 true
        }}
        >
          <AppTable name="end-tanchukuangjskDicord-table-indexall2" config={{
            "id": "DisRecordletanchukuangxe2",
            "name": "DisRecortanchukuangble-index-endjkjoiioi2",
            "type": "checkbox",//表格单选复选类型
            "size": "default",//表格尺寸
            "rowKey": "gid",//主键
            "onLoadData": true,//初始化是否加载数据
            "width": 2100,//表格宽度
            "showSerial": true,//是否显示序号
            "editType": true,//是否增加编辑列
            "page": 1,//当前页
            "isSearch": true,//是否显示模糊查询
            "columns": [
              { title: '来源工单', width: 100, dataIndex: 'imeWorkOrderGidRef.code', key: '1' },
              { title: '产品编号', width: 100, dataIndex: 'mdProductInfoGidRef.materialGidRef.code', key: '2' },
              { title: '派工单号', width: 100, dataIndex: 'code', key: '3' ,columnsType: {"type": "link", url: "imeDispatch/detail"}},
              { title: '工序编号', dataIndex: 'operationCode', key: '4', width: 100 },
              { title: '工作单元', dataIndex: 'mdFactoryWorkUnitGidRef.workUnitName', key: '5', width: 100 },
              { title: '工位编号', dataIndex: 'mdFactoryWorkStationGidRef.stationCode', key: '6', width: 100 },
              { title: '设备编号', dataIndex: 'imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef.code', key: '7', width: 100 },
              { title: '派工对象', dataIndex: '', key: '8', width: 80 },
              { title: '接收人员', dataIndex: 'receivePersonnelGidRef.personnelName', key: '9', width: 100 },
              { title: '开工人员', dataIndex: 'startPersonnelGidRef.personnelName', key: '10', width: 100 },
              { title: '完工人员', dataIndex: 'finishPersonnelGidRef.personnelName', key: '11', width: 100 },
              { title: '委外类型', dataIndex: 'delegateTypeGid', key: '12', width: 100 },
              { title: '优先级别', dataIndex: 'priorityLevelGid', key: '13', width: 100 },
              { title: '计划数量', dataIndex: 'planQty', key: '14', width: 100 },
              { title: '计划开始时间', dataIndex: 'planBeginTime', key: '15', width: 100 },
              { title: '计划完成时间', dataIndex: 'planEndTime', key: '16', width: 100 },
              { title: '测算开始时间', dataIndex: 'calculateBeginTime', key: '17', width: 100 },
              { title: '测算结束时间', dataIndex: 'calculateEndTime', key: '18', width: 100 },
              { title: '实际开始时间', dataIndex: 'actualBeginTime', key: '19', width: 100 },
              { title: '实际完成时间', dataIndex: 'actualEndTime', key: '20', width: 100 },
              { title: '完工数量', dataIndex: 'finiahQty', key: '21', width: 100 },
              { title: '派工单状态', dataIndex: 'trackOrderStatus', key: '22', width: 100 }
            ],
            dataSource: {
              type: "api",
              method: "post",
              url: "/ime/imeTrackOrder/getListByStartStatus.action",
            }
          }} />
          <Row>
            <Col span={4} offset={20}>
              <AppButton config={{
                id: "DisRecordOk2",
                title: "确定",
                type: "primary",
                size: "large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "DisRecordletanchukuangxe2.onSelectedRows",
                    pubs: [
                      {
                        event: "DisRecordOk2.enabled",
                        payload: true
                      }
                    ]
                  },
                  {
                    event: "DisRecordletanchukuangxe2.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "DisRecordOk2.enabled",
                        payload: false
                      }
                    ]
                  },
                  {
                    event: "DisRecordletanchukuangxe2.onSelectedRows",
                    pubs: [
                      {
                        event: "DisRecordOk2.dataContext"
                      }
                    ]
                  }, {
                    event: "DisRecordOk2.click",
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/imeTrackRecord/start.action",
                          payloadMapping: [{
                            from: "dataContext",
                            to: "@@Array",
                            key: "gid"
                          }]
                        },
                        successPubs: [
                          {
                            event: "@@message.success",
                            payload: "操作成功"
                          },
                          {
                            event: "pageIdDidddssRecordteeeeeeeffgg2.onCancel"
                          },
                          {
                            event:"DisRecord-table-index.loadData"
                          }
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload: "操作失败"
                          },
                          {
                            event: "pageIdDidddssRecordteeeeeeeffgg2.onCancel"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }} />
              <AppButton config={{
                id: "DisRecordddeeeoioCancel2",
                title: "取消",
                type: "default",
                size: "large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "DisRecordddeeeoioCancel2.click",
                    pubs: [
                      {
                        event: "pageIdDidddssRecordteeeeeeeffgg2.onCancel",
                      },
                    ]
                  }
                ]
              }} />
            </Col>
          </Row>
        </ModalContainer>

        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "pageIdDidddssRecordteeeeeeeffgg3", // id，必填*
          pageId: "pageIdxffre46666exx3", // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          width: "80%", // 宽度，默认520px
          okText: "确定", // ok按钮文字，默认 确定
          cancelText: "取消", // cancel按钮文字，默认 取消
          title: "完工操作页面",
          style: { top: 80 }, // style样式
          wrapClassName: "wcd-center", // class样式
          hasFooter: false, // 是否有footer，默认 true
          maskClosable: true, // 点击蒙层是否允许关闭，默认 true
        }}
        >
        <FieldArray name="mdWorkOrderDetailDTOs" config={{
          "id": "mdWorkOrderDetailDTOs",
          "name": "mdWorkOrderDetailDTOs",
          "form":"disRecordPageForm",
          "rowKey": "gid",
          "addButton": false, //是否显示默认增行按钮
          "showRowDeleteButton":false,
          "showSelect":true, //是否显示选择框
          "type":"checkbox", //表格单选（radio）复选（checkbox）类型
          "unEditable":false, //初始化是否都不可编辑
          "columns": [
            {
              "id": "imeWorkOrderGidRef.code",
              "type": "textField",
              "title": "来源工单",
              "name": "imeWorkOrderGidRef.code",
              "enabled":false
            },
            {
              "id": "mdProductInfoGidRef.materialGidRef.code",
              "type": "textField",
              "title": "产品物料编号",
              "name": "mdProductInfoGidRef.materialGidRef.code",
              "enabled":false
            },
            {
              "id": "code",
              "type": "textField",
              "title": "派工单号",
              "name": "code",
              "enabled":false
            },
            {
              "id": "operationCode",
              "type": "textField",
              "title": "工序编号",
              "name": "operationCode",
              "enabled":false
            },
            {
              "id": "mdFactoryWorkUnitGidRef.workUnitName",
              "type": "textField",
              "title": "工作单元",
              "name": "mdFactoryWorkUnitGidRef.workUnitName",
              "enabled":false
            },
            {
              "id": "mdFactoryWorkStationGidRef.stationCode",
              "type": "textField",
              "title": "工位编号",
              "name": "mdFactoryWorkStationGidRef.stationCode",
              "enabled":false
            },
            {
              "id": "imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef.code",
              "type": "textField",
              "title": "设备编号",
              "name": "imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef.code",
              "enabled":false
            },
            {
              "id": "zanshimeiyou",
              "type": "textField",
              "title": "派工对象",
              "name": "zanshimeiyou",
              "enabled":false
            },
            {
              "id": "receivePersonnelGidRef.personnelName",
              "type": "textField",
              "title": "接收人员",
              "name": "receivePersonnelGidRef.personnelName",
              "enabled":false
            },
            {
              "id": "startPersonnelGidRef.personnelName",
              "type": "textField",
              "title": "开工人员",
              "name": "startPersonnelGidRef.personnelName",
              "enabled":false
            },
            {
              "id": "finishPersonnelGidRef.personnelName",
              "type": "textField",
              "title": "完工人员",
              "name": "finishPersonnelGidRef.personnelName",
              "enabled":false
            },
            {
              "id": "delegateTypeGid",
              "type": "selectField",
              "title": "委外类型",
              "name": "delegateTypeGid",
              "enabled":false,
              "dataSource": {
                type: "api",
                method: "post",
                url: "/sm/dictionaryEnumValue/query.action",
                mode: "payload",
                payload: {
                  "query": {
                    "query": [
                      {
                        "field": "smDictionaryEnumGid", "type": "eq", "value": "EFC278BEB85A4F42B257846AE0CACD08"
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
              "id": "priorityLevelGid",
              "type": "selectField",
              "title": "优先级别",
              "name": "priorityLevelGid",
              "enabled":false,
              "dataSource": {
                type: "api",
                method: "post",
                url: "/sm/dictionaryEnumValue/query.action",
                mode: "payload",
                payload: {
                  "query": {
                    "query": [
                      {
                        "field": "smDictionaryEnumGid", "type": "eq", "value": "56B2315955384BE1E055000000000001"
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
              "id": "planQty",
              "type": "textField",
              "title": "计划数量",
              "name": "planQty",
              "enabled":false,
            },
            {
              "id": "planBeginTime",
              "type": "textField",
              "title": "计划开始时间",
              "name": "planBeginTime",
              "enabled":false,
            },
            {
              "id": "planEndTime",
              "type": "textField",
              "title": "计划完成时间",
              "name": "planEndTime",
              "enabled":false,
            },
            {
              "id": "calculateBeginTime",
              "type": "textField",
              "title": "测算开始时间",
              "name": "calculateBeginTime",
              "enabled":false,
            },
            {
              "id": "calculateEndTime",
              "type": "textField",
              "title": "测算结束时间",
              "name": "calculateEndTime",
              "enabled":false,
            },
            {
              "id": "actualBeginTime",
              "type": "textField",
              "title": "实际开始时间",
              "name": "actualBeginTime",
              "enabled":false,
            },
            {
              "id": "actualEndTime",
              "type": "textField",
              "title": "实际完成时间",
              "name": "actualEndTime",
              "enabled":false,
            },
            {
              "id": "finiahQty",
              "type": "InputNumberField",
               "min":0, 
              "title": "完工数量",
              "name": "finiahQty",
              "enabled":true,
            },
            {
              "id": "trackOrderStatus",
              "type": "selectField",
              "title": "派工单状态",
              "name": "trackOrderStatus",
              "enabled":false,
              "dataSource": {
                type: "api",
                method: "post",
                url: "/ime/imeTrackOrder/getStatusCombox.action",
              },
              displayField: "value",
              valueField: "id",
            }
            
          ]
        }} component={TableField}/>
         {/* <AppTable name="end-tanchukuangjskDicord-table-indexall3" config={{
            "id": "DisRecordletanchukuangxe3",
            "name": "DisRecortanchukuangble-index-endjkjoiioi3",
            "type": "checkbox",//表格单选复选类型
            "size": "default",//表格尺寸
            "rowKey": "gid",//主键
            "onLoadData": true,//初始化是否加载数据
            "width": 2200,//表格宽度
            "showSerial": true,//是否显示序号
            "editType": true,//是否增加编辑列
            "page": 1,//当前页
            "isSearch": true,//是否显示模糊查询
            "columns": [
              { title: '来源工单', width: 100, dataIndex: 'imeWorkOrderGidRef.code', key: '1' },
              { title: '产品编号', width: 100, dataIndex: 'mdProductInfoGidRef.materialGidRef.code', key: '2' },
              { title: '派工单号', width: 100, dataIndex: 'code', key: '3' ,columnsType: {"type": "link", url: "imeDispatch/detail"}},
              { title: '工序编号', dataIndex: 'operationCode', key: '4', width: 100 },
              { title: '工作单元', dataIndex: 'mdFactoryWorkUnitGidRef.workUnitName', key: '5', width: 100 },
              { title: '工位编号', dataIndex: 'mdFactoryWorkStationGidRef.stationCode', key: '6', width: 100 },
              { title: '设备编号', dataIndex: 'imeTrackOrderEquipmentDetailDTOs.mdEquipmentGidRef.code', key: '7', width: 100 },
              { title: '派工对象', dataIndex: '', key: '8', width: 80 },
              { title: '接收人员', dataIndex: 'receivePersonnelGidRef.personnelName', key: '9', width: 100 },
              { title: '开工人员', dataIndex: 'startPersonnelGidRef.personnelName', key: '10', width: 100 },
              { title: '完工人员', dataIndex: 'finishPersonnelGidRef.personnelName', key: '11', width: 100 },
              { title: '委外类型', dataIndex: 'delegateTypeGid', key: '12', width: 100 },
              { title: '优先级别', dataIndex: 'priorityLevelGid', key: '13', width: 100 },
              { title: '计划数量', dataIndex: 'planQty', key: '14', width: 100 },
              { title: '计划开始时间', dataIndex: 'planBeginTime', key: '15', width: 100 },
              { title: '计划完成时间', dataIndex: 'planEndTime', key: '16', width: 100 },
              { title: '测算开始时间', dataIndex: 'calculateBeginTime', key: '17', width: 100 },
              { title: '测算结束时间', dataIndex: 'calculateEndTime', key: '18', width: 100 },
              { title: '实际开始时间', dataIndex: 'actualBeginTime', key: '19', width: 100 },
              { title: '实际完成时间', dataIndex: 'actualEndTime', key: '20', width: 100 },
              { title: '完工数量', dataIndex: 'finiahQty', key: '21', width: 100 },
              { title: '派工单状态', dataIndex: 'trackOrderStatus', key: '22', width: 100 }
            ],
            dataSource: {
              type: "api",
              method: "post",
              url: "/ime/imeTrackOrder/getListByStartWorkStatus.action",
            }
          }} />*/}
          <Row>
            <Col span={4} offset={20}>
              <AppButton config={{
                id: "DisRecordOk3",
                title: "确定",
                type: "primary",
                size: "large",
                visible: true,
                enabled: false,
                subscribes: [
                  {
                    event: "mdWorkOrderDetailDTOs.onSelectedRows",
                    pubs: [
                      {
                        event: "DisRecordOk3.enabled",
                        payload: true
                      }
                    ]
                  },
                  {
                    event: "mdWorkOrderDetailDTOs.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "DisRecordOk3.enabled",
                        payload: false
                      }
                    ]
                  },
                  {
                    event: "DisRecordOk3.click",
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/imeTrackRecord/checkUnFinishRecord.action",
                          bodyExpression:`
                          resolveFetch({fetch:{id:'mdWorkOrderDetailDTOs',data:'selectedRows'}}).then(function(res){
                            let ids =[];
                            
                            if(res != undefined){
                              for(var i=0;i<res.length;i++){
                                ids.push(res[i].gid)
                              }
                              callback(ids);
                            }
                          })
                          `
                        },
                        successPubs: [
                          {
                            event: "@@message.success",
                            eventPayloadExpression:`
                            resolveFetch({fetch:{id:'mdWorkOrderDetailDTOs',data:'selectedRows'}}).then(function(res){
                              if(eventPayload!=undefined){
                                if(eventPayload == true){
                                    let params = [];
                                    if(res!=undefined){
                                      for(var i=0;i<res.length;i++){
                                        let obj = {gid:res[i].gid,finiahQty:res[i].finiahQty}
                                        params.push(obj)
                                      }
                                    }
                                    let dataSource = {
                                      type: "api",
                                      method: "POST",
                                      mode:"payload",
                                      payload:params,
                                      url: "/ime/imeTrackRecord/finishWork.action"
                                    }
                                    resolveDataSourceCallback({dataSource:dataSource},function(ddd){
                                      
                                      if(ddd.success){
                                         pubsub.publish("pageIdDidddssRecordteeeeeeeffgg3.onCancel")
                                         pubsub.publish("DisRecord-table-index.loadData")
                                         callback("完工成功")
                                      }else{
                                        pubsub.publish("@@message.error","完工失败")
                                      }
                                     
                                  })
                                }else{
                                  pubsub.publish("finishDispachCode.openModal")
                                }
                              }

                            })
                            `
                          }
                          /*{
                            event: "pageIdDidddssRecordteeeeeeeffgg3.onCancel"
                          },
                          {
                            event:"DisRecord-table-index.loadData"
                          }*/
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload: "操作失败"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }} />
              <AppButton config={{
                id: "DisRecordddeeeoioCancel3",
                title: "取消",
                type: "default",
                size: "large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "DisRecordddeeeoioCancel3.click",
                    pubs: [
                      {
                        event: "pageIdDidddssRecordteeeeeeeffgg3.onCancel",
                      },
                    ]
                  }
                ]
              }} />
            </Col>
          </Row>
        </ModalContainer>
        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "finishDispachCode", // id，必填*
          pageId: "finishDispachCode", // 指定是哪个page调用modal，必填*
          type: "confirm", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          title: "订单撤销下发", // title，不传则不显示title
          content: (
            <div>
            <p>该派工单下存在未结束的报工记录,确定完工？</p>
            </div>
          ), // 非modal模式使用
          closable: true, // 是否显示右上角关闭按钮，默认不显示
          width: 500, // 宽度，默认520px
          okText: "确定按钮", // ok按钮文字，默认 确定
          cancelText: "取消按钮", // cancel按钮文字，默认 取消
          style: {top: 120}, // style样式
          wrapClassName: "wcd-center", // class样式
          hasFooter: true, // 是否有footer，默认 true
          maskClosable: false, // 点击蒙层是否允许关闭，默认 true
        }}
        >
        </ModalContainer>

      </div>
    );
  }
}
DisRecordPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

function mapStateToProps(props) {
  return {
    onSubmit:()=>{}
  };
}
let DisRecordPageForm =  reduxForm({
  form: "disRecordPageForm",
  validate
})(DisRecordPage)

export default connect(mapStateToProps, mapDispatchToProps)(DisRecordPageForm);