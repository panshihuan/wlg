import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import {Row, Col} from 'antd'

export class WorkOrderRepealModal extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }
  componentDidMount() {
        // pubsub.publish('orderRepealModal-table-11.laterData',{})
  }
  componentWillUnmount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  render() {
    return (
      <form>
          <Row>
              <Col span="24">
                  <AppTable name="orderRepealTable" config={{
                      "id":"orderRepealModal-table-11",
                      "name":"orderRepealModal-table-11",
                      "type":"checkbox",//表格单选复选类型
                      "size":"default",//表格尺寸
                      "rowKey": "gid",//主键
                      "onLoadData":true,//初始化是否加载数据
                      "showSerial":true,
                      "editType":false,
                      "isSearch":false,
                      "isPager":true,
                      "columns":[
                        { title: '来源订单', width: 100, dataIndex: 'planOrderGidRef.code', key: '1' },
                        { title: '工单编号', width: 100, dataIndex: '', key: '2' },
                        { title: '产品编号', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '3' },
                        { title: '产品名称', dataIndex: 'productGidRef.materialGidRef.name', key: '4', width: 100 },
                        { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '5', width: 100 },
                        { title: '计划数量', dataIndex: 'planQty', key: '6', width: 100 },
                        { title: '本批数量', dataIndex: 'actualQty', key: '7', width: 100 },
                        { title: '计划开始日期', dataIndex: 'workOrderBeginTime', key: '8', width: 100 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                        { title: '交付日期', dataIndex: 'deliverTime', key: '9', width: 100 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                        { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '10', width: 100 },
                        { title: '产线', dataIndex: 'productionLineGidRef.lineName', key: '11', width: 100 },
                        { title: '工单顺序', dataIndex: 'workOrderSeq', key: '12', width: 100 },
                        { title: '工艺路线', dataIndex: 'routeGidRef.name', key: '13', width: 100 },
                        { title: '工单类型', dataIndex: 'workOrderTypeGid', key: '14', width: 100 },
                        { title: '工单状态', dataIndex: 'workOrderStatusGid', key: '15', width: 100 },
                        { title: '工单BOM状态', dataIndex: 'workOrderBomStatusGid', key: '16', width: 100 }
                      ],
                      subscribes:[
                          /* {
                              event:'orderRepealModal-table-11.onTableTodoAny',
                              behaviors:[
                                  {
                                      type:'fetch',
                                      id:'zxcvbnmasdfgh',
                                      data:'selectedRows',
                                      successPubs:[
                                          {
                                              event:'orderRepealModal-table-11.setData',
                                          }
                                      ]
                                  }
                              ]
                          }, */
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

                      ],
                      dataSource: {
                        type: 'api',
                          method: 'post',
                          url: '/ime/imeWorkOrder/query.action',
                          payload:{
                            query:{
                              query:[
                                {
                                  "left":"(",
                                  "field":"parentWorkOrderGid",
                                  "type":"null",
                                  "operator":"and"
                                },
                                {
                                  "right":")",
                                  "field":"workOrderStatusGid",
                                  "type":"ne",
                                  "value":"40",
                                  "operator":"and"
                                }
                              ]
                            }
                          }
                        }
                  }}/>
              </Col>
          </Row>
          <br/>
          <Row>
              <Col span={6} offset={20}>
                  {/*取消按钮*/}
                  <AppButton config={{
                      id: "orderRepealModal-btn-3",
                      title: "取消",
                      type:"default",
                      size:"large",
                      visible: true,
                      enabled: true,
                      subscribes: [
                          {
                              event: "orderRepealModal-btn-3.click",
                              pubs:[{
                                  event: "workOrderRepeal.onCancel",
                              }]
                          }
                      ]
                  }} />

                  {/*确定按钮*/}
                  <AppButton config={{
                      id: "orderRepealModal-btn-2",
                      title: "确定",
                      type:"primary",
                      size:"large",
                      visible: true,
                      enabled: false,
                      subscribes: [
                          {
                              event: "orderRepealModal-table-11.onSelectedRowsClear",
                              pubs: [
                                  {
                                      event: "orderRepealModal-btn-2.enabled",
                                      payload:false
                                  }
                              ],
                          },

                          {
                              event: "orderRepealModal-table-11.onSelectedRows",
                              pubs: [
                                  {
                                      event: "orderRepealModal-btn-2.enabled",
                                      payload:true
                                  }
                              ],
                          },
                          {
                              event: "orderRepealModal-btn-2.click",
                              behaviors: [
                                  {
                                      type: "request",
                                      dataSource:{
                                          type:'api',
                                          method:'post',
                                          url:'/ime/imeWorkOrder/workOrderRevoke.action',
                                          paramsInQueryString:false,//参数拼在url后面
                                          payloadMapping:[{
                                              from: "dataContext",
                                              to: "@@Array",
                                              key: "gid",
                                              //paramKey:"ids"
                                          }]
                                      },
                                      successPubs: [
                                          {
                                              event: "@@message.success",
                                              payload:'撤销分批成功!'
                                          },
                                          {
                                              event: "workOrderRepeal.onCancel",
                                          },
                                          {
                                              event: "zxcvbnmasdfgh.loadData",
                                          }

                                      ],
                                      errorPubs: [
                                          {
                                              event: "@@message.error",
                                              payload:'撤销失败!'
                                          }
                                      ]
                                  }
                              ]
                          }
                      ]

                  }} />


              </Col>
          </Row>
      </form>
    );
  }
}

WorkOrderRepealModal.propTypes = {

};

export default  reduxForm({
    form: "WorkOrderRepealModal",
})(WorkOrderRepealModal);

