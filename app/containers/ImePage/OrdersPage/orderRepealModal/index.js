import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import {Row, Col} from 'antd'

export class orderRepealModal extends React.PureComponent {
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
                      "editType":true,
                      "isSearch":false,
                      "columns":[
                          { title: '订单编码', width: 100, dataIndex: 'code', key: '1' },
                          { title: '产品编号', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '2' },
                          { title: '产品名称', width: 150, dataIndex: 'productGidRef.materialGidRef.name', key: '3' },
                          { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '4', width: 150 },
                          { title: '计划数量', dataIndex: 'planQty', key: '5', width: 100 },
                          { title: '本批数量', dataIndex: 'actualQty', key: '6', width: 100 },
                          { title: '计划开始日期', dataIndex: 'planBeginTime', key: '7', width: 150 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                          { title: '交付日期', dataIndex: 'deliverTime', key: '8', width: 150 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                          { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '9', width: 150 },
                          { title: '订单顺序', dataIndex: 'orderSeq', key: '10', width: 100 },
                          { title: '工艺路线', dataIndex: 'productGidRef.routePathRef.name', key: '11', width: 100 },
                          { title: '订单类型', dataIndex: 'planOrderTypeGid', key: '12', width: 100 },
                          { title: '订单状态', dataIndex: 'orderStatusGid', key: '13', width: 100 },
                          { title: '订单BOM状态', dataIndex: 'bomStatusGid ', key: '14', width: 100 },
                          { title: '订单进程', dataIndex: 'processStatus ', key: '15', width: 100 },
                      ],
                      dataSource: {
                          type: 'api',
                          method: 'post',
                          payload:{
                              "pager": {
                                  "page": 1,
                                  "pageSize": 10
                              },
                              "query": {
                                  "query": [
                                      {
                                          "left": "(",
                                          "field": "parentWorkOrderGid ",
                                          "type": "null",
                                          "operator": "and"
                                      },
                                      {
                                          "right": ")",
                                          "field": "workOrderStatusGid  ",
                                          "type": "ne",
                                          "value": "40",
                                          "operator": "and"
                                      }
                                  ]
                              }
                          },
                          url: '/ime/imePlanOrder/getRevokePlanOrderList.action'
                      },
                      subscribes:[
                          // {
                          //     event:'orderRepealModal-table-11.onTableTodoAny',
                          //     behaviors:[
                          //         {
                          //             type:'fetch',
                          //             id:'1234567890',
                          //             data:'selectedRows',
                          //             successPubs:[
                          //                 {
                          //                     event:'orderRepealModal-table-11.setData',
                          //                 }
                          //             ]
                          //         }
                          //     ]
                          // },
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
                                  event: "pageIdxxx1.onCancel",
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
                                          url:'/ime/imePlanOrder/planOrderRevoke.action',
                                          paramsInQueryString:false,//参数拼在url后面
                                          payloadMapping:[{
                                              from: "dataContext",
                                              to: "@@Array",
                                              key: "gid",
                                              // paramKey:"ids"
                                          }]
                                      },

                                      successPubs: [
                                          {
                                              event: "@@message.success",
                                              payload:'撤销分批成功!'
                                          },
                                          {
                                              event: "pageIdxxx1.onCancel",
                                          },
                                          {
                                              event: "1234567890.loadData",
                                          }

                                      ],
                                      errorPubs:[
                                          {
                                              event: "@@message.error",
                                              eventPayloadExpression:`
                                                  callback(eventPayload)
                                              `
                                          },
                                          {
                                              event: "pageIdxxx1.onCancel",
                                          },
                                          {
                                              event: "1234567890.loadData",
                                          }
                                      ],

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

orderRepealModal.propTypes = {

};

export default  reduxForm({
    form: "orderRepealModal",
})(orderRepealModal);

