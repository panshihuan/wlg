import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import Immutable from 'immutable';
import pubsub from 'pubsub-js'
import {connect} from 'react-redux';
import AppButton from 'components/AppButton'
import AppTable from 'components/AppTable'
import ModalContainer from 'components/ModalContainer'
import DropdownButton from '../../../../components/DropdownButton';
import SendModal from './SendModal';
import GetModal from './GetModal';
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
import TreeField from 'components/Form/TreeField'
import UploadField from 'components/Form/UploadField'
import FindbackField from 'components/Form/FindbackField'
import tinyCache from 'tinycache'
import LogisticsDistributionCreateModal from './logisticsDistributionCreateModal'

const TabPane = Tabs.TabPane;
import CoreComponent from 'components/CoreComponent'

export class LogisticsDistributionListPage extends React.PureComponent {
  callback = (key) => {
    console.log(key);
  }

  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>物流管理</Breadcrumb.Item>
              <Breadcrumb.Item>物流配送单</Breadcrumb.Item>
          </Breadcrumb>
          <Card style={{width: "100%", backgroundColor: "#F7F7F7"}} bodyStyle={{padding: "15px"}}>
              <Row>
                  <Col>
                      <DropdownButton config={{
                        id: 'logistics-dist-add-btn-1',
                        name: '创建',
                        enabled: true,
                        type: "primary",
                        size: "default",
                        subscribes: [
                          {
                            event: 'logistics-dist-add-btn-1.onClick',
                            pubs: [
                              {
                                eventPayloadExpression: `
                            if(eventPayload=="0"){

                            }else if(eventPayload=="1"){
                                pubsub.publish("logistics-dist-add-modal-1.openModal")
                               /* var dataSource = {
                                type: "api",
                                method: "post",
                                url: "/ime/imeLogisticsTrack/query.action"
                              }
                              //var params = {status:"20"}
                              var params = {"query":{"query":[
                                {"left":"(","operator":"and","field":"logisticsDeliveryGid","type":"null"},
                                {"right":")","operator":"and","field":"status","type":"eq",value:"20"}
                              ]}}
                              resolveDataSourceCallback({dataSource: dataSource,eventPayload: params},
                                  function(data) {
                                    console.log("表格",data);
                                    if(data.success) {
                                      pubsub.publish("logistics-dist-modal-grid-1.setData",data);
                                    }
                                  }
                              );*/
                            }
                         `
                              }
                            ]
                          }
                        ],
                        dataSource: {
                          type: 'customValue',
                          values: [
                            {key: "0", name: "直接创建", "enabled": false},
                            {key: "1", name: "参照生成", "enabled": true},
                          ]
                        },
                        displayField: "name",
                        valueField: "id"
                      }} name="logistics-dist-add-btn-1"></DropdownButton>
                      <AppButton config={{
                        id: "logistics-dist-edit-btn-2",
                        title: "修改",
                        visible: true,
                        enabled: true,
                        type: 'primary',
                        subscribes: [
                          {
                            event: "logistics-dist-edit-btn-2.click",
                              behaviors: [
                                  {

                                      type: "fetch",
                                      id: "logistics-dist-grid-index", //要从哪个组件获取数据
                                      data: "selectedRows",//要从哪个组件的什么属性获取数据
                                      successPubs: [  //获取数据完成后要发送的事件
                                          {
                                              event: "@@navigator.push",
                                              mode: "payload&&eventPayload",
                                              payload: {
                                                  url: "imeLogisticsDistributionList/detail112234"
                                              }
                                          }
                                      ]
                                  }
                              ]

                          }
                        ]
                      }}>
                      </AppButton>
                      <AppButton config={{
                        id: "logistics-dist-del-btn-3",
                        title: "删除",
                        visible: true,
                        enabled: true,
                        type: 'primary',
                        subscribes: [
                          // {
                          //   event: "logistics-dist-del-btn-3.click",
                          //   pubs: [
                          //     {
                          //       event: "logistics-dist-del-btn-3.expression",
                          //       meta: {
                          //         expression: `
                          //   console.log(dataContext);
                          //   var dataSource = {
                          //     type: "api",
                          //     method: "post",
                          //     paramsInQueryString: false,//参数拼在url后面
                          //     url: "/ime/imeLogisticsTrack/delete.action",
                          //     payloadMapping:[{
                          //       from: "dataContext",
                          //       to: "@@Array",
                          //       key: "gid"
                          //     }]
                          //   }
                          //   resolveDataSource({dataSource: dataSource}).then(function(data) {
                          //     console.log(data);
                          //     if(data.success) {
                          //       pubsub.publish("logistics-dist-grid-index.loadData");
                          //       pubsub.publish("@@message.success", "删除成功")
                          //     } else {
                          //       pubsub.publish("@@message.error", "删除失败")
                          //     }
                          //   });
                          // `
                          //       }
                          //     }
                          //   ]
                          // },
                          {
                            event: "logistics-dist-del-btn-3.click",
                            behaviors: [
                              {
                                type: "request",
                                dataSource: {
                                  type: "api",
                                  method: "POST",
                                  url: "/ime/imeLogisticsDelivery/delete.action",
                                  payloadMapping:[{
                                    from: "dataContext",
                                    to: "@@Array",
                                    key: "gid"
                                  }]
                                },
                                successPubs: [
                                  {
                                    outside:true,
                                    event: "@@message.success",
                                    payload:'删除成功!'
                                  },
                                  {
                                    outside:true,
                                    event: "logistics-dist-grid-index.loadData",
                                  }
                                ],
                                errorPubs: [
                                  {
                                    event: "@@message.error",
                                    eventPayloadExpression:`
                                      if(eventPayload){
                                        callback(eventPayload);
                                      }else{
                                        callback("删除失败!");
                                      }
                                      
                                    `
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }}>
                      </AppButton>
                      <div style={{
                        display: "inline-block",
                        width: "0px",
                        height: "15px",
                        borderLeft: "1px solid #ccc",
                        marginLeft: "10px",
                        marginRight: "10px"
                      }}></div>
                      <DropdownButton config={{
                        id: 'logistics-dist-send-btn-4',
                        name: '发货',
                        enabled: true,
                        type: "default",
                        ghost: "true",
                        size: "default",
                        subscribes: [],
                        dataSource: {
                          type: 'customValue',
                          values: [
                            {key: "0", name: "发货", "enabled": true},
                            {key: "1", name: "按整单发货", "enabled": true},
                          ]
                        },
                        displayField: "name",
                        valueField: "id",
                        subscribes: [
                          {
                            event: "logistics-dist-send-btn-4.onClick",
                            pubs: [
                              {
                                eventPayloadExpression: `
                            if(eventPayload=="0"){
                                pubsub.publish("logistics-modal-1.openModal")
                            }else if(eventPayload=="1"){
                              console.log(dataContext);
                              var dataSource = {
                                type: "api",
                                method: "post",
                                url: "/ime/imeLogisticsDelivery/deliverByWholeSubmit"
                              }
                              var params = {
                                "id": dataContext[0].gid
                              }
                              resolveDataSourceCallback({dataSource: dataSource,eventPayload: params},
                                function(data) {
                                  console.log(data);
                                  if(data.success) {
                                    pubsub.publish("@@message.success", "整单发货成功")
                                    pubsub.publish("logistics-dist-grid-index.loadData");
                                  } else {
                                    pubsub.publish("@@message.error", "整单发货失败")
                                  }
                                }
                              );
                            }
                         `
                              }
                            ]
                          },
                            {
                                event:'logistics-dist-grid-index.onSelectedRows',
                                pubs:[
                                    {
                                        eventPayloadExpression:`
                                          console.log('e:::',eventPayload)
                                          //recvStatus
                                          if(eventPayload[0].sendStatus=="30"){
                                            callback(false)
                                          }else{
                                            callback(true)
                                          }
                                        `,
                                        event:'logistics-dist-send-btn-4.enabled'
                                    }
                                ]
                            },

                        ]
                      }} name="logistics-dist-send-btn-4"></DropdownButton>
                    <AppButton config={{
                        id: "logistics-dist-sign-btn-5",
                        title: "签收",
                        visible: true,
                        enabled: false,
                        type: 'default',
                        subscribes: [
                            {
                                event:'logistics-dist-sign-btn-5.click',
                                pubs:[
                                    {
                                        event:'logistics-modal-3.openModal'
                                    }
                                ]
                            },
                            {
                                event:'logistics-dist-grid-index.onSelectedRows',
                                pubs:[
                                    {
                                        eventPayloadExpression:`
                                          console.log('e:::',eventPayload)
                                          //recvStatus
                                          if(eventPayload[0].recvStatus=="30"){
                                            callback(false)
                                          }else{
                                            callback(true)
                                          }
                                        `,
                                        event:'logistics-dist-sign-btn-5.enabled'
                                    }
                                ]
                            },
                            {
                                event:'logistics-dist-grid-index.onSelectedRowsClear',
                                pubs:[
                                    {
                                        event:'logistics-dist-sign-btn-5.enabled',
                                        payload:false
                                    }
                                ]
                            }
                        ]
                    }}>
                    </AppButton>
                  </Col>
              </Row>
          </Card>

          <Card bordered={true} style={{marginTop: "20px"}}>
              <AppTable name="logistics-dist-grid-index" config={{
                "id": "logistics-dist-grid-index",
                "name": "logistics-dist-grid-index",
                "type": "checkbox",//表格单选复选类型
                "size": "default",//表格尺寸
                "rowKey": "gid",//主键
                "onLoadData": true,//初始化是否加载数据
                "tableTitle": "",//表头信息
                "width": 1500,//表格宽度
                "showSerial": true,//是否显示序号
                // "editType": true,//是否增加编辑列
                "page": 1,//当前页
                "pageSize": 10,//一页多少条
                "isPager": true,//是否分页
                "isSearch": false,//是否显示模糊查询
                "columns": [
                  {title: '配送单号', width: 150, dataIndex: 'code', key: '1'},
                  {title: '配送方案', width: 150, dataIndex: 'mdMrlDeliverySchemeGidRef.deliveryName', key: '2'},
                  {title: '需求产线', dataIndex: 'factoryLineGidRef.lineName', key: '3', width: 150},
                  {title: '供应仓库', dataIndex: 'mdWarehouseGidRef.warehouseName', key: '4', width: 150},
                  {title: '需求开始时间', dataIndex: 'reqStartDate', key: '5', width: 150},
                  {title: '需求结束时间', dataIndex: 'reqEndDate', key: '6', width: 150},
                  {title: '指定需求时间', dataIndex: 'appointReqEndDate', key: '7', width: 150},
                  {title: '发货状态', dataIndex: 'sendStatus', key: '8', width: 150},
                  {title: '收货状态', dataIndex: 'recvStatus', key: '9', width: 150},
                  {title: '打印时间', dataIndex: 'printDate', key: '10', width: 150},
                ],
                dataSource: {
                  type: 'api',
                  method: 'post',
                  pager: true,
                  url: '/ime/imeLogisticsDelivery/query.action'
                },
                subscribes: [
                  {
                    event: "logistics-dist-grid-index.onSelectedRows",
                    pubs: [
                      {
                        event: "logistics-dist-add-btn-1.dataContext"
                      }, {
                        event: "logistics-dist-edit-btn-2.dataContext"
                      }, {
                        event: "logistics-dist-del-btn-3.dataContext"
                      }, {
                            event: "logistics-dist-send-btn-4.dataContext"
                        },{
                        event: "logistics-dist-grid-1.dataContext"
                      }, {
                        event: "logistics-dist-grid-2.dataContext"
                      }, {
                        event: "logistics-dist-grid-3.dataContext"
                      }, {
                        event: "logistics-dist-grid-4.dataContext"
                      }, /*{
                        event: "logistics-dist-add-btn-1.enabled",
                        payload: true
                      },*/ {
                        event: "logistics-dist-edit-btn-2.enabled",
                        payload: true
                      }, {
                        event: "logistics-dist-del-btn-3.enabled",
                        payload: true
                      }

                    ]
                  }, 
                  {
                    event: "logistics-dist-grid-index.onSelectedRowsClear",
                    pubs: [
                      /*{
                        event: "logistics-dist-add-btn-1.enabled",
                        payload: false
                      },*/
                      {
                        event: "logistics-dist-edit-btn-2.enabled",
                        payload: false
                      },
                      {
                        event: "logistics-dist-del-btn-3.enabled",
                        payload: false
                      },
                      {
                        event: "logistics-dist-send-btn-4.enabled",
                        payload: false
                      }
                    ]
                  },
                  {
                    event:"logistics-dist-grid-index.onClickRow",
                    behaviors:[
                      {
                        type: "fetch",
                        id: "logistics-dist-grid-index", //要从哪个组件获取数据
                        data: "rowRecord",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "logistics-dist-grid-1.loadData",
                            eventPayloadExpression: `
                            console.log(eventPayload,"1")
                                if(eventPayload) {
                                  callback({deliveryId:eventPayload.gid})
                                }
                            `
                          },
                          {
                            event: "logistics-dist-grid-2.loadData",
                            eventPayloadExpression: `
                            console.log(eventPayload,"2")
                                if(eventPayload) {
                                  callback({deliveryId:eventPayload.gid})
                                }
                            `
                          },
                          {
                            event: "logistics-dist-grid-3.loadData",
                            eventPayloadExpression: `
                            console.log(eventPayload,"3")
                                if(eventPayload) {
                                  let param ={"query":{"query":[
                                    {"operator":"and","field":"imeLogisticsDeliveryGid", "type": "eq", "value": eventPayload.gid}
                                  ]}}
                                  callback(param)
                                }
                            `
                          },
                          {
                            event: "logistics-dist-grid-4.loadData",
                            eventPayloadExpression: `
                            console.log(eventPayload,"4")
                                if(eventPayload) {
                                  let param ={"query":{"query":[
                                    {"operator":"and","field":"imeLogisticsDeliveryGid", "type": "eq", "value": eventPayload.gid}
                                  ]}}
                                  callback(param)
                                }
                            `
                          }
                        ]
                      }
                    ]
                  },
                  {
                    event:"logistics-dist-grid-index.onClickRowClear",
                    pubs:[
                      {
                        event: "logistics-dist-grid-1.setData",
                        payload:[]
                      },
                      {
                        event: "logistics-dist-grid-2.setData",
                        payload:[]
                      },
                      {
                        event: "logistics-dist-grid-3.setData",
                        payload:[]
                      },
                      {
                        event: "logistics-dist-grid-4.setData",
                        payload:[]
                      }
                    ]
                  }
                ]
              }}/>
              <Tabs defaultActiveKey="logistics-dist-tabs-1" forceRender={true} onChange={this.callback}>
                  <TabPane tab="物流派工单" key="logistics-dist-tabs-1">
                      <AppTable name="logistics-dist-grid-1" config={{
                        "id": "logistics-dist-grid-1",
                        "name": "logistics-dist-grid-1",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": false,//初始化是否加载数据
                        "tableTitle": "",//表头信息
                        "width": 2850,//表格宽度
                        "showSerial": true,//是否显示序号
                        // "editType": true,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 10,//一页多少条
                        "isPager": false,//是否分页
                        "isSearch": false,//是否显示模糊查询
                        "columns": [
                          {title: '物流派工单编号', width: 150, dataIndex: 'code', key: '1'},
                          {title: '来源物流工单号', width: 150, dataIndex: 'logisticsWorkOrderGidRef.code', key: '2'},
                          {title: '供应仓库', dataIndex: 'mdWarehouseGidRef.warehouseName', key: '3', width: 150},
                          {title: '配送类型', dataIndex: 'mdMrlDeliverySchemeGidRef.deliveryType', key: '4', width: 150},
                          {title: '物料组号', dataIndex: 'mdMrlDeliveryModeGidRef.code', key: '5', width: 150},
                          {title: '物料组名', dataIndex: 'mdMrlDeliveryModeGidRef.name', key: '6', width: 150},
                          {title: '物料编码', dataIndex: 'mdMaterielInfoGidRef.code', key: '7', width: 150},
                          {title: '物料名称', dataIndex: 'mdMaterielInfoGidRef.name', key: '8', width: 150},
                          {title: '包装方式', dataIndex: 'packingMode', key: '9', width: 150},
                          {title: '包装标准', dataIndex: 'packingStandard', key: '10', width: 150},
                          {title: '标准数量', dataIndex: 'standardQty', key: '11', width: 150},
                          {title: '标准单位', dataIndex: 'standardUnit', key: '12', width: 150},
                          {title: '需求产线', dataIndex: 'factoryLineGidRef.lineName', key: '13', width: 150},
                          {title: '计划数量', dataIndex: 'planQty', key: '14', width: 150},
                          {title: '需求数量', dataIndex: 'reqQty', key: '15', width: 150},
                          {title: '需求日期', dataIndex: 'reqDate', key: '16', width: 150},
                          {title: '需求时间', dataIndex: 'reqDate', key: '17', width: 150},
                          {title: '工序', dataIndex: 'routeOpeartionName', key: '18', width: 150},
                          {title: '工位', dataIndex: 'factoryWorkStationGidRef.stationName', key: '19', width: 150},
                        ],
                        dataSource: {
                          type: 'api',
                          method: 'post',
                          url: '/ime/imeLogisticsTrack/getListByDeliveryId.action'
                        }/*,
                        subscribes: [
                          {
                            event: 'logistics-dist-grid-1.onClickRow',
                            behaviors: [
                              {
                                type: "fetch",
                                id: "logistics-dist-grid-index", //要从哪个组件获取数据
                                data: "rowRecord",//要从哪个组件的什么属性获取数据
                                successPubs: [  //获取数据完成后要发送的事件
                                  {
                                    event: "logistics-dist-grid-1.loadData",
                                    eventPayloadExpression: `
                                        if(eventPayload) {
                                          callback({deliveryId:eventPayload[0].gid})
                                        }
                                    `
                                  }
                                ]
                              }
                            ]

                          },
                          {
                            event: 'logistics-dist-grid-index.onSelectedRows',
                            behaviors: [
                              {
                                type: "fetch",
                                id: "logistics-dist-grid-1", //要从哪个组件获取数据
                                data: "dataContext",//要从哪个组件的什么属性获取数据
                                successPubs: [  //获取数据完成后要发送的事件
                                  {
                                    event: "logistics-dist-grid-1.loadData",
                                    eventPayloadExpression: `
                             console.log(eventPayload);
                             callback({deliveryId:eventPayload[0].gid});
                        `
                                  }
                                ]
                              }
                            ]


                          }
                        ]*/
                      }}/>
                  </TabPane>
                  <TabPane tab="物料明细" forceRender={true} key="logistics-dist-tabs-2">
                      <AppTable name="logistics-dist-grid-2" config={{
                        "id": "logistics-dist-grid-2",
                        "name": "logistics-dist-grid-2",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": false,//初始化是否加载数据
                        "tableTitle": "",//表头信息
                        "width": 2550,//表格宽度
                        "showSerial": true,//是否显示序号
                        // "editType": true,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 10,//一页多少条
                        "isPager": false,//是否分页
                        "isSearch": false,//是否显示模糊查询
                        "columns": [
                          {title: '物料编号', width: 150, dataIndex: 'mdMaterielInfoGidRef.code', key: '1'},
                          {title: '物料名称 ', width: 150, dataIndex: 'mdMaterielInfoGidRef.name', key: '2'},
                          {title: '计划数量', dataIndex: 'planQty', key: '3', width: 150},
                          {title: '需求数量', dataIndex: 'reqQty', key: '4', width: 150},
                          {title: '可发数量', dataIndex: 'unDeliveryQty', key: '5', width: 150},
                          {title: '已发数量', dataIndex: 'deliveredQty', key: '6', width: 150},
                          {title: '可收数量', dataIndex: 'unReceiveQty', key: '7', width: 150},
                          {title: '已收数量', dataIndex: 'receivedQty', key: '8', width: 150},
                          {title: '数量单位', dataIndex: 'standardUnit', key: '9', width: 150},
                          {title: '物料需求时间', dataIndex: 'reqDate', key: '10', width: 150},
                          {title: '最新需求时间', dataIndex: '', key: '11', width: 150},
                          {title: '需求状态', dataIndex: 'reqStatus', key: '12', width: 150},
                          {title: '来源工单', dataIndex: '', key: '13', width: 150},
                          {title: '来源订单', dataIndex: '', key: '14', width: 150},
                          {title: '产品编号', dataIndex: '', key: '15', width: 150},
                          {title: '计划开始时间', dataIndex: '', key: '16', width: 150},
                          {title: '最新开始时间', dataIndex: '', key: '17', width: 150},
                        ],
                        dataSource: {
                          type: 'api',
                          method: 'post',
                          url: '/ime/imeLogisticsTrack/getDetailListByDeliveryId.action'
                        }/*,
                        subscribes: [
                          {
                            event: 'logistics-dist-grid-2.onTableTodoAny',
                            behaviors: [
                              {
                                type: "fetch",
                                id: "logistics-dist-grid-index", //要从哪个组件获取数据
                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                successPubs: [  //获取数据完成后要发送的事件
                                  {
                                    event: "logistics-dist-grid-2.loadData",
                                    eventPayloadExpression: `
                                      if(eventPayload) {
                                      callback({deliveryId:eventPayload[0].gid})
                                    }
                                    `
                                  }
                                ]
                              }
                            ]

                          },
                          {
                            event: 'logistics-dist-grid-index.onSelectedRows',
                            behaviors: [
                              {
                                type: "fetch",
                                id: "logistics-dist-grid-2", //要从哪个组件获取数据
                                data: "dataContext",//要从哪个组件的什么属性获取数据
                                successPubs: [  //获取数据完成后要发送的事件
                                  {
                                    event: "logistics-dist-grid-2.loadData",
                                    eventPayloadExpression: `
                                      console.log(eventPayload);
                                      callback({deliveryId:eventPayload[0].gid});
                                    `
                                  }
                                ]
                              }
                            ]


                          }
                        ]*/
                      }}/>
                  </TabPane>
                  <TabPane tab="发货明细" forceRender={true} key="logistics-dist-tabs-3">
                      <AppTable name="logistics-dist-grid-3" config={{
                        "id": "logistics-dist-grid-3",
                        "name": "logistics-dist-grid-3",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": false,//初始化是否加载数据
                        "tableTitle": "",//表头信息
                        "width": 750,//表格宽度
                        "showSerial": true,//是否显示序号
                        // "editType": true,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 10,//一页多少条
                        "isPager": true,//是否分页
                        "isSearch": false,//是否显示模糊查询
                        "columns": [
                          {title: '发货编号', width: 150, dataIndex: 'code', key: '1'},
                          {title: '物料编号 ', width: 150, dataIndex: 'mdMaterialInfoGidRef.code', key: '2'},
                          {title: '已发数量', dataIndex: 'sendNum', key: '3', width: 150},
                          {title: '发货时间', dataIndex: 'sendDate', key: '4', width: 150},
                          {title: '发货人', dataIndex: 'sendPersonGidRef.personnelName', key: '5', width: 150},
                        ],
                        dataSource: {
                          type: 'api',
                          method: 'post',
                          pager: true,
                          url: '/ime/imeLogisticsDelivery/querySendDetail.action'
                        }/*,
                        subscribes: [
                          {
                            event: 'logistics-dist-grid-3.onTableTodoAny',
                            behaviors: [
                              {
                                type: "fetch",
                                id: "logistics-dist-grid-index", //要从哪个组件获取数据
                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                successPubs: [  //获取数据完成后要发送的事件
                                  {
                                    event: "logistics-dist-grid-3.loadData",
                                    eventPayloadExpression: `
                            if(eventPayload) {
                              callback({id:eventPayload[0].gid,trackId:''})
                            }
                        `
                                  }
                                ]
                              }
                            ]

                          },
                          {
                            event: 'logistics-dist-grid-index.onSelectedRows',
                            behaviors: [
                              {
                                type: "fetch",
                                id: "logistics-dist-grid-3", //要从哪个组件获取数据
                                data: "dataContext",//要从哪个组件的什么属性获取数据
                                successPubs: [  //获取数据完成后要发送的事件
                                  {
                                    event: "logistics-dist-grid-3.loadData",
                                    eventPayloadExpression: `
                             console.log(eventPayload);
                             callback({id:eventPayload[0].gid,trackId:''});
                        `
                                  }
                                ]
                              }
                            ]


                          }
                        ]*/
                      }}/>
                  </TabPane>
                  <TabPane tab="收货明细" forceRender={true} key="logistics-dist-tabs-4">
                      <AppTable name="logistics-dist-grid-4" config={{
                        "id": "logistics-dist-grid-4",
                        "name": "logistics-dist-grid-4",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": true,//初始化是否加载数据
                        "tableTitle": "",//表头信息
                        "width": 550,//表格宽度
                        "showSerial": true,//是否显示序号
                        // "editType": true,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 10,//一页多少条
                        "isPager": true,//是否分页
                        "isSearch": false,//是否显示模糊查询
                        "columns": [
                          {title: '收货编号', width: 150, dataIndex: 'code', key: '1'},
                          {title: '物料编号 ', width: 150, dataIndex: 'mdMaterialInfoGidRef.code', key: '2'},
                          {title: '收货数量', dataIndex: 'recvNum', key: '3', width: 150},
                          {title: '签收时间', dataIndex: 'recvDate', key: '4', width: 150},
                          {title: '签收人', dataIndex: 'recvPersonGidRef.personnelName', key: '5', width: 150},
                        ],
                        dataSource: {
                          type: 'api',
                          method: 'post',
                          pager: true,
                          url: '/ime/imeLogisticsDelivery/queryRecvDetail.action'
                        }/*,
                        subscribes: [
                          {
                            event: 'logistics-dist-grid-4.onTableTodoAny',
                            behaviors: [
                              {
                                type: "fetch",
                                id: "logistics-dist-grid-index", //要从哪个组件获取数据
                                data: "selectedRows",//要从哪个组件的什么属性获取数据
                                successPubs: [  //获取数据完成后要发送的事件
                                  {
                                    event: "logistics-dist-grid-4.loadData",
                                    eventPayloadExpression: `
                                      if(eventPayload) {
                                        callback({id:eventPayload[0].gid,trackId:''})
                                      }
                                    `
                                  }
                                ]
                              }
                            ]

                          },
                          {
                            event: 'logistics-dist-grid-index.onSelectedRows',
                            behaviors: [
                              {
                                type: "fetch",
                                id: "logistics-dist-grid-4", //要从哪个组件获取数据
                                data: "dataContext",//要从哪个组件的什么属性获取数据
                                successPubs: [  //获取数据完成后要发送的事件
                                  {
                                    event: "logistics-dist-grid-4.loadData",
                                    eventPayloadExpression: `
                             console.log(eventPayload);
                             callback({id:eventPayload[0].gid,trackId:''});
                        `
                                  }
                                ]
                              }
                            ]


                          }
                        ]*/
                      }}/>
                  </TabPane>
              </Tabs>
          </Card>

        <ModalContainer config={{
            visible: false, // 是否可见，必填*
            enabled: true, // 是否启用，必填*
            id: "logistics-modal-1", // id，必填*
            pageId: "logistics-modal-1", // 指定是哪个page调用modal，必填*
            type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
            title: "发货", // title，不传则不显示title
            closable: true, // 是否显示右上角关闭按钮，默认不显示
            width: "80%", // 宽度，默认520px
            okText: "确定", // ok按钮文字，默认 确定
            cancelText: "取消", // cancel按钮文字，默认 取消
            style: {top: 120}, // style样式
            wrapClassName: "wcd-center", // class样式
            hasFooter: false, // 是否有footer，默认 true
            maskClosable: true, // 点击蒙层是否允许关闭，默认 true
        }}
        >
          <SendModal />
        </ModalContainer>

        <ModalContainer config={{
            visible: false, // 是否可见，必填*
            enabled: true, // 是否启用，必填*
            id: "logistics-modal-3", // id，必填*
            pageId: "logistics-modal-3", // 指定是哪个page调用modal，必填*
            type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
            title: "收货", // title，不传则不显示title
            closable: true, // 是否显示右上角关闭按钮，默认不显示
            width: "80%", // 宽度，默认520px
            okText: "确定", // ok按钮文字，默认 确定
            cancelText: "取消", // cancel按钮文字，默认 取消
            style: {top: 120}, // style样式
            wrapClassName: "wcd-center", // class样式
            hasFooter: false, // 是否有footer，默认 true
            maskClosable: true, // 点击蒙层是否允许关闭，默认 true
        }}
        >
          <GetModal />
        </ModalContainer>

          <ModalContainer config={{
            visible: false, // 是否可见，必填*
            enabled: true, // 是否启用，必填*
            id: "logistics-dist-add-modal-1", // id，必填*
            pageId: "logistics-dist-add-modal-1", // 指定是哪个page调用modal，必填*
            type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
            title: "参照派工单", // title，不传则不显示title
            closable: true, // 是否显示右上角关闭按钮，默认不显示
            width: "80%", // 宽度，默认520px
            okText: "确定", // ok按钮文字，默认 确定
            cancelText: "取消", // cancel按钮文字，默认 取消
            style: {top: 120}, // style样式
            wrapClassName: "wcd-center", // class样式
            hasFooter: false, // 是否有footer，默认 true
            maskClosable: true, // 点击蒙层是否允许关闭，默认 true
          }}
          >
              <LogisticsDistributionCreateModal/>
          </ModalContainer>

      </div>
    );
  }
}

LogisticsDistributionListPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default reduxForm({
  form: "logisticsDistributionListForm",
})(LogisticsDistributionListPage)