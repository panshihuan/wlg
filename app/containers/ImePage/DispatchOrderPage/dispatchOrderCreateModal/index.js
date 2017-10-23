import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col ,Tabs} from 'antd';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from "components/AppButton"


export class DispatchOrderCreateModal extends React.PureComponent {
  constructor(props) {
    super(props);

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
          <AppTable name="dispatchOrder" config={{
              "id": "dispatchOrderCreateModal-table-1",
              "name": "dispatchOrderCreateModal-table-1",
              "type": "radio",//表格单选复选类型
              "size": "default",//表格尺寸
              "rowKey": "gid",//主键
              "onLoadData": true,//初始化是否加载数据
              "tableTitle": "",//表头信息
              "width": 3300,//表格宽度
              "showSerial": true,//是否显示序号
              "editType": true,//是否增加编辑列
              "page": 1,//当前页
              "pageSize": 10,//一页多少条
              "isPager": true,//是否分页
              "isSearch": false,//是否显示模糊查询
              "columns": [
                  { title: '来源订单', width: 100, dataIndex: 'planOrderGidRef.code', key: '1' },
                  { title: '工单编号', width: 100, dataIndex: 'code', key: '2' },
                  { title: '产品编号', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '3' },
                  { title: '产品名称', dataIndex: 'productGidRef.materialGidRef.name', key: '4', width: 100 },
                  { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '5', width: 100 },
                  { title: '计划数量', dataIndex: 'planQty', key: '6', width: 100 },
                  { title: '本批数量', dataIndex: 'actualQty', key: '7', width: 100 },
                  { title: '计划开始日期', dataIndex: 'workOrderBeginTime', key: '8', width: 100 },
                  { title: '交付日期', dataIndex: 'deliverTime', key: '9', width: 100 },
                  { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '10', width: 100 },
                  { title: '产线', dataIndex: 'productionLineGidRef.lineName', key: '11', width: 100 },
                  { title: '工单顺序', dataIndex: 'workOrderSeq', key: '12', width: 100 },
                  { title: '工艺路线', dataIndex: 'routeGidRef.name', key: '13', width: 100 },
                  { title: '工单类型', dataIndex: 'workOrderTypeGid', key: '14', width: 100 },
                  { title: '工单状态', dataIndex: 'workOrderStatusGid', key: '15', width: 100 },
                  { title: '工单BOM状态', dataIndex: 'workOrderBomStatusGid', key: '16', width: 100 }
              ],
              dataSource: {
                  type: 'api',
                  method: 'post',
                  url: '/ime/imeWorkOrder/query.action'
              }
          }} />

          <Row>
              <Col span={6} offset={20}>
                  <AppButton config={{
                      id: "dispatchOrderCreateModal-btn-1",
                      title: "取消",
                      type:"default",
                      size:"large",
                      visible: true,
                      enabled: true,
                      subscribes: [
                          {
                              event: "dispatchOrderCreateModal-btn-1.click",
                              pubs:[
                                  {
                                      event: "dispatchOrder-modal-1.onCancel",
                                  },
                                  {

                                  }
                              ]
                          }
                      ]
                  }} />

                  {/*确定按钮*/}
                  <AppButton config={{
                      id: "dispatchOrderCreateModal-btn-2",
                      title: "确定",
                      type:"primary",
                      size:"large",
                      visible: true,
                      enabled: false,
                      subscribes: [
                          {
                              event:"dispatchOrderCreateModal-table-1.onSelectedRows",
                              pubs: [
                                  {
                                      event: "dispatchOrderCreateModal-btn-2.enabled",
                                      payload:true
                                  },
                                  {
                                      event:'dispatchOrderCreateModal-btn-2.dataContext'
                                  }
                              ]
                          },
                          {
                              event: "dispatchOrderCreateModal-table-1.onSelectedRowsClear",
                              pubs: [
                                  {
                                      event: "dispatchOrderCreateModal-btn-2.enabled",
                                      payload:false
                                  }
                              ],
                          },
                          {
                              event: "dispatchOrderCreateModal-btn-2.click",
                              behaviors: [
                                  {
                                      type: "request",
                                      dataSource:{
                                          type:'api',
                                          method:'post',
                                          url:'/ime/imeWorkOrder/workOrderPublish.action',
                                          paramsInQueryString:false,//参数拼在url后面,
                                          bodyExpression:`
                                          if(dataContext != undefined){
                                            callback({"id":dataContext[0].gid})
                                          }
                                        `
                                      },
                                      successPubs: [
                                          {
                                              event: "@@message.success",
                                              payload:'新建成功!'
                                          },
                                          {
                                              event: "dispatchOrder-modal-1.onCancel",
                                          },
                                          {
                                              event: "dispatchOrder.loadData",
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
                                              event: "dispatchOrder-modal-1.onCancel",
                                          },
                                          {
                                              event: "dispatchOrder.loadData",
                                          }
                                      ]
                                  }
                              ]
                          }
                      ]

                  }} />
              </Col>
          </Row>

      </div>
    );
  }
}

DispatchOrderCreateModal.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(DispatchOrderCreateModal);
