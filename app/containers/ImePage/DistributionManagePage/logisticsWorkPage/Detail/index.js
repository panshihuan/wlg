/*
 *
 * Detail
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import pubsub from 'pubsub-js'
import { fromJS } from "immutable"

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
import TimeField from 'components/Form/TimeField'


import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

const TabPane = Tabs.TabPane;
const validate = values => {
  const errors = {}
  if (!values.get('reqDate')) {
    errors.reqDate = '必填项'
  }

  return errors
}

class Detail extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.setState({})
    if (!this.props.location.state[0]) {
      let dataSource = {
        type: "api",
        method: "POST",
        url: "/ime/imeLogisticsOrder/getOrderBean.action",
      }
      resolveDataSource({ dataSource }).then(function (res) {
        pubsub.publish("@@form.init", { id: "detail", data: fromJS({ code: res.data.code }) })
      })

    } else {
      let modifyId = this.props.location.state[0].gid
      let dataSource2 = {
        type: "api",
        method: "POST",
        mode: "dataContext",
        url: "/ime/imeLogisticsOrder/findById.action",
      }

      resolveDataSource({ dataSource: dataSource2, dataContext: { id: modifyId } }).then(function (res) {
        if (!res.data) {
          res.data = {}
        }
        if (!res.data.status) {
          res.data.orderStatusName = ''
        } else {
          res.data.statusName = res.ext.enumHeader.status[res.data.status]
        }
        if (res.data.imeLogisticsOrderDetailDTOs) {
          for (var i = 0; i < res.data.imeLogisticsOrderDetailDTOs.length; i++) {
            if (!res.data.imeLogisticsOrderDetailDTOs[i].reqStatus) {
              res.data.imeLogisticsOrderDetailDTOs[i].reqStatusName = ''
            } else {
              res.data.imeLogisticsOrderDetailDTOs[i].reqStatusName = res.ext.enumHeader["imeLogisticsOrderDetailDTOs.reqStatus"][res.data.imeLogisticsOrderDetailDTOs[i].reqStatus]
            }
          }
        }
        pubsub.publish("@@form.init", { id: "detail", data: fromJS(res.data) })
      })
    }



  }

  componentWillMount() {
  }
  componentDidMount() {
    if (!this.props.location.state[0]) {
      pubsub.publish("save222eee.visible", false)
      //pubsub.publish("savechuangeee.visible", false)
     // pubsub.publish("deleteData.visible", false)
    } else {
      let modifyId = this.props.location.state[0].gid
      pubsub.publish("save222.visible", false)
     // pubsub.publish("cancel222.visible", false)
      pubsub.publish("planNum.enabled", false)
      pubsub.publish("deleteData.dataContext", { eventPayload: [modifyId] })
    }
  }
  componentWillUnmount() {

  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.location)
    // console.log(this.props.location)
    /*if (nextProps.location.key != this.props.location.key) {
      // console.log("uuu")
      this.setState({})
      // console.log(nextProps.location)
      if (nextProps.location.state["data"]) {
        pubsub.publish("save222eee.visible", true)
        pubsub.publish("save222.visible", false)
        pubsub.publish("cancel222.visible", false)
        pubsub.publish("savechuangeee.visible", true)
        pubsub.publish("deleteData.visible", true)
        pubsub.publish("planNum.enabled", false)
        let modifyId = nextProps.location.state["data"]
        let dataSource2 = {
          type: "api",
          method: "POST",
          mode: "dataContext",
          url: "/ime/imeLogisticsOrder/findById.action",
        }
        pubsub.publish("deleteData.dataContext", { eventPayload: [modifyId] })
        resolveDataSource({ dataSource: dataSource2, dataContext: { id: modifyId } }).then(function (res) {
          pubsub.publish("@@form.init", { id: "detail", data: fromJS(res.data) })

        })
      } else {
        pubsub.publish("save222.visible", true)
        pubsub.publish("cancel222.visible", true)
        pubsub.publish("save222eee.visible", false)
        pubsub.publish("savechuangeee.visible", false)
        pubsub.publish("deleteData.visible", false)

        let dataSource = {
          type: "api",
          method: "POST",
          url: "/ime/imeLogisticsOrder/getOrderBean.action",
        }
        resolveDataSource({ dataSource }).then(function (res) {
          pubsub.publish("@@form.init", { id: "detail", data: fromJS({ code: res.data.code }) })
        })
      }
    }*/
  }

  render() {
    return (
      <div style={{ padding: "10px" }}>
        <Breadcrumb className="breadcrumb" separator=">">
          <Breadcrumb.Item>物流管理</Breadcrumb.Item>
          <Breadcrumb.Item>物流工单</Breadcrumb.Item>
          <Breadcrumb.Item>物流工单详情</Breadcrumb.Item>
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
                    pubs: [
                      {
                        event: "planNum.enabled",
                        payload: true
                      }
                    ],
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/imeLogisticsOrder/add.action",
                          withForm: "detail",
                        },
                        successPubs: [  //获取数据完成后要发送的事件
                         /* {
                            event: "@@navigator.push",
                            mode: "payload&&dataContext",
                            payload: {
                              url: "/imeLogisticsWork/detail"
                            }

                          },*/ 
                          {
                            event: "@@navigator.push",
                            payload: {
                              url: "/imeLogisticsWork"
                            }
                          },
                          {
                            event: "@@message.success",
                            payload: "新增成功"
                          }
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload: "新增失败"
                          }
                        ]
                      }
                    ],
                  }
                ]
              }}></AppButton>

              <AppButton config={{
                id: "savechuangeee",
                title: "创建",
                visible: false,
                enabled: true,
                type: "primary",
                subscribes: [
                  {
                    event: "savechuangeee.click",
                    pubs: [
                      {
                        event: "@@navigator.push",
                        payload: {
                          url: "/imeLogisticsWork/detail"
                        }
                      }
                    ]
                  }
                ]
              }}></AppButton>

              <AppButton config={{
                id: "save222eee",
                title: "保存",
                visible: true,
                enabled: true,
                type: "primary",
                subscribes: [
                  {
                    event: "save222eee.click",
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/imeLogisticsOrder/modify.action",
                          withForm: "detail",
                        },
                        successPubs: [
                          {
                            event: "@@navigator.push",
                            payload: {
                              url: "/imeLogisticsWork"
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
                          },
                        ]
                      }
                    ],
                  }
                ]
              }}></AppButton>
              <AppButton config={{
                id: "deleteData",
                title: "删除",
                type: "primary",
                visible: false,
                enabled: false,
                subscribes: [
                  {
                    event: "deleteData.click",
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/imeLogisticsOrder/delete.action",
                          mode: "dataContext"
                        },
                        successPubs: [
                          {
                            event: "@@message.success",
                            payload: '删除成功!'
                          },
                          {
                            event: "@@navigator.push",
                            payload: {
                              url: "/imeLogisticsWork"
                            }
                          }
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload: '删除失败!'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
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
                          url: "/imeLogisticsWork"
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
                enabled: false,
                id: "code",
                label: "物流工单编号",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24）
                placeholder: "请输入编码"
              }} component={TextField} name="code" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: true,
                form: "detail",
                id: "gCode",
                label: "供应仓库编码",
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24）
                // formMode:'edit',
                tableInfo: {
                  id: "tableId555eeeeee",
                  size: "small",
                  rowKey: "gid",
                  tableTitle: "仓库信息",
                  width: "100",
                  columns: [
                    { title: '仓库编号', width: 100, dataIndex: 'warehouseCode', key: '1' },
                    { title: '仓库名称', width: 100, dataIndex: 'warehouseName', key: '2' },
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'post',
                    url: '/ime/mdWarehouse/query.action'
                  }
                },
                pageId: 'findBack66ooohh',
                displayField: "warehouseCode",
                valueField: {
                  "from": "warehouseCode",
                  "to": "mdWarehouseGidRef.warehouseCode"
                },
                associatedFields: [
                  {
                    "from": "warehouseName",
                    "to": "mdWarehouseGidRef.warehouseName"
                  }, {
                    "from": "gid",
                    "to": "mdWarehouseGid"
                  },
                ],

              }} name="mdWarehouseGidRef.warehouseCode" component={FindbackField} />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "gName",
                label: "供应仓库名称",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24））
                placeholder: "根据规则回写"
              }} component={TextField} name="mdWarehouseGidRef.warehouseName" />
            </Col>
            <Col span={6}>
              <Field config={{
                id: "numUnit",
                label: "配送方案",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24）
                form: "detail",
                tableInfo: {
                  id: "tableIdddd55",
                  size: "small",
                  rowKey: "gid",
                  tableTitle: "配送方案",
                  width: "500",
                  columns: [
                    { title: '配送编码', width: 200, dataIndex: 'deliveryCode', key: '1' },
                    { title: '配送名称', width: 200, dataIndex: 'deliveryName', key: '2' },
                    { title: '版本编号', dataIndex: 'versionCode', key: '3', width: 200 },
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'post',
                    url: '/ime/mdMrlDeliveryScheme/query.action',
                    mode: "payload",
                    payload: {
                      "query": {
                        "query": [
                          {
                            "field": "deliveryType", "type": "eq", "value": "ANT"
                          }
                        ],
                      }
                    }
                  }
                },
                pageId: 'pfdddganfindback',
                displayField: "deliveryName",
                valueField: {
                  "from": "deliveryName",
                  "to": "mdMrlDeliverySchemeGidRef.deliveryName"
                },
                associatedFields: [
                  {
                    "from": "gid",
                    "to": "mdMrlDeliverySchemeGid"
                  }
                ]
              }} component={FindbackField} name="mdMrlDeliverySchemeGidRef.deliveryName" />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <Field config={{
                id: "payTime",
                label: "需求产线",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24）
                form: "detail",
                tableInfo: {
                  id: "tableId5dfre55",
                  size: "small",
                  rowKey: "gid",
                  tableTitle: "产线信息",
                  onLoadData: false,
                  showSerial: false,
                  width: "500",
                  columns: [
                    { title: '产品编号', width: 200, dataIndex: 'lineCode', key: '1' },
                    { title: '产品名称', width: 200, dataIndex: 'lineName', key: '2' },
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'post',
                    url: '/ime/imeLogisticsOrder/getLineListByDeliveryScheme.action'
                  },
                  subscribes: [
                    {
                      event: "tableId5dfre55.onTableTodoAny",
                      behaviors: [
                        {
                          type: "fetch",
                          id: "detail", //要从哪个组件获取数据
                          data: "@@formValues",//要从哪个组件的什么属性获取数据
                          successPubs: [  //获取数据完成后要发送的事件
                            {
                              event: "tableId5dfre55.loadData",
                              eventPayloadExpression: `
                                let payload ={}
                                if(eventPayload != undefined){
                                  payload = {
                                    "schemeId":eventPayload["mdMrlDeliverySchemeGid"]
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
                pageId: 'chanfeeerbackpage',
                displayField: "lineName",
                valueField: {
                  "from": "lineName",
                  "to": "factoryLineGidRef.lineName"
                },
                associatedFields: [{
                  "from": "gid",
                  "to": "factoryLineGid"
                }]
              }} component={FindbackField} name="factoryLineGidRef.lineName" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "planNum",
                label: "需求日期",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24）
                placeholder: "需求明细最小日期",
                //showRequiredStar: true,
                //showTime: true
              }} component={DateField} name="reqDate" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "realNum",
                label: "需求时间",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写",
                onlyTime: true,
                //format:"HH:mm:ss",
                //form:"detail"
              }} component={DateField} name="reqTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "orderType",
                label: "单据状态",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写",
              }} component={TextField} name="statusName" />
            </Col>
          </Row>

        </Card>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="物料需求" key="1">
              <Row type="flex" justify="space-between">
                <Col span={2} offset={22}>
                  <AppButton config={{
                    id: "adksk",
                    title: "增加物料",
                    type: "primary",
                    visible: true,
                    enabled: true,
                    subscribes: [
                      {
                        event: "adksk.click",
                        pubs: [
                          {
                            event: "pageIdxffre46666exx.openModal"
                          }
                        ]
                      }
                    ]
                  }} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FieldArray name="imeLogisticsOrderDetailDTOs" config={{
                    "id": "tafnjnjdkkdllow4jh777frr",
                    "name": "tableFiledkkdhegrfera3678b",
                    "rowKey": "id",
                    form: "detail",
                    showSelect: true,
                    addButton: false,
                    "columns": [
                      {
                        "id": "tablefffFiled1edd",
                        "type": "textField",
                        "title": "物料编码",
                        "name": "mdMaterialInfoGidRef.code",
                        "enabled": false
                      }
                      , {
                        "id": "tablefffFiled1",
                        "type": "textField",
                        "title": "物料名称",
                        "name": "mdMaterialInfoGidRef.name",
                        "enabled": false
                      }, {
                        "id": "tablrrreFiled2",
                        "type": "textField",
                        "title": "数量单位",
                        "name": "mdMaterialInfoGidRef.measurementUnitGidRef.name",
                        "enabled": false
                      }, {
                        "id": "tableFilooooed3",
                        "type": "InputNumberField",
                        "title": "包装数量",
                        "name": "packNum",
                        "min":1, 
                      }, {
                        "id": "tablellllled4",
                        "title": "包装方式",
                        "type": "selectField",
                        "title": "包装方式",
                        "name": "packWay",
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
                      }, {
                        "id": "tableFoppuyed5",
                        "title": "计划数量",
                        "type": "textField",
                        "name": "planQty",
                      }, {
                        "id": "tabhkoooiled6",
                        "title": "需求数量",
                        "type": "textField",
                        "name": "reqQty",
                        subscribes: [
                          {
                            event: "tableFoppuyed5.onChange",
                            pubs: [
                              {
                                event: "tabhkoooiled6.expression",
                                meta: {
                                  expression: `
                                  pubsub.publish("@@form.change", { id: "detail", name: me.props.input.name, value: data.eventPayload })
                                  `
                                }
                              }
                            ]
                          }
                        ]
                      }, {
                        "id": "tablellhgted71",
                        "title": "物料需求时间",
                        "type": "dateField",
                        "name": "materialReqTime",
                        showTime: true,
                      }, {
                        "id": "tablellhgted72",
                        "title": "最新需求时间",
                        "type": "dateField",
                        "name": "newestReqTime",
                        showTime: true,
                        subscribes: [
                          {
                            event: "tablellhgted71.onChange",
                            pubs: [
                              {
                                event: "tablellhgted72.expression",
                                meta: {
                                  expression: `
                                  pubsub.publish("@@form.change", { id: "detail", name: me.props.input.name, value: data.eventPayload })
                                  resolveFetch({fetch:{id:'detail',data:'@@formValues'}}).then(function(res){
                                    if(!res.reqDate){
                                      pubsub.publish("@@form.change", { id: "detail", name: "reqDate", value: data.eventPayload })
                                      pubsub.publish("@@form.change", { id: "detail", name: "reqTime", value: data.eventPayload })
                                    }else{
                                      let timeArr = []
                                      for(var i=0;i<res.imeLogisticsOrderDetailDTOs.length;i++){
                                        if(res.imeLogisticsOrderDetailDTOs[i].materialReqTime){
                                          timeArr.push(res.imeLogisticsOrderDetailDTOs[i].materialReqTime)
                                        }
                                      }
                                      let minTime = timeArr[0]
                                      for(var i=0;i<timeArr.length;i++){
                                        if(new Date(timeArr[i].replace(/-/,"/"))< new Date(minTime.replace(/-/,"/"))){
                                          minTime = timeArr[i]
                                        }
                                      }
                                      pubsub.publish("@@form.change", { id: "detail", name: "reqDate", value:minTime })
                                      pubsub.publish("@@form.change", { id: "detail", name: "reqTime", value: minTime })
                                    }
                                  })
                                  `
                                }
                              }
                            ]
                          }
                        ]
                      }, {
                        "id": "tablellhgted73",
                        "title": "配送组号",
                        "type": "findbackField",
                        "name": "materialGroupGidRef.code",
                        form: "detail",
                        tableInfo: {
                          id: "tapdjbdpeisongyuan",
                          size: "small",
                          rowKey: "gid",
                          width: "500",
                          tableTitle: "配送组号",
                          showSerial: true,  //序号
                          columns: [
                            { title: '配送组号', width: 100, dataIndex: 'code', key: '1' },
                            { title: '配送组名', width: 150, dataIndex: 'name', key: '2' },
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/ime/mdMrlDeliveryMode/query.action',
                          }
                        },
                        pageId: 'tabpeisongdooddlaiyuan',
                        displayField: "name",
                        valueField: {
                          "from": "name",
                          "to": "materialGroupGidRef.code"
                        },
                        associatedFields: [
                          {
                            "from": "gid",
                            "to": "materialGroupGid"
                          }, {
                            "from": "name",//配送组名
                            "to": "materialGroupGidRef.name"
                          }, {
                            "from": "packStandard",//包装标准
                            "to": "packStandard"
                          }, 
                        ]
                      }, {
                        "id": "tablellhgted74",
                        "title": "配送组名",
                        "type": "textField",
                        "name": "materialGroupGidRef.name",
                        "enabled": false
                      }, {
                        "id": "tablellhgted75",
                        "title": "包装标准",
                        "type": "selectField",
                        "name": "packStandard",
                        "enabled": false,
                        dataSource: {
                          type: "api",
                          method: "post",
                          url: "/ime/mdMrlDeliveryMode/getPackStandardCombox.action"
                        },
                        displayField: "value",
                        valueField: "id",
                      }, {
                        "id": "tablellhgted76",
                        "title": "标准单位",
                        "type": "textField",
                        "name": "standardUnit",
                        "enabled": false
                      }, {
                        "id": "tablellhgted7cs",
                        "title": "标准数量",
                        "type": "textField",
                        "name": "standardQty",
                        "enabled": false,
                        subscribes:[
                          {
                            event:"tableFilooooed3.onChange",
                            pubs:[
                              {
                                event:"tablellhgted7cs.expression",
                                meta:{
                                  expression:`
                                    pubsub.publish("@@form.change",{id:'detail',name:me.props.input.name,value:data.eventPayload})
                                  `
                                }
                              }
                            ]
                          }
                        ]
                      }, {
                        "id": "tablellhgted7gr",
                        "title": "需求状态",
                        "type": "textField",
                        "name": "reqStatusName",
                        "enabled": false
                      }, {
                        "id": "tablelee34ed7",
                        "title": "需求工位",
                        "type": "findbackField",
                        "name": "factoryWorkStationGidRef.stationName",
                        //"enabled": false
                        subscribes:[
                          {
                            event:"tgongongweidyuan.onTableTodoAny",
                            behaviors: [
                        {
                          type: "fetch",
                          id: "detail", //要从哪个组件获取数据
                          data: "@@formValues",//要从哪个组件的什么属性获取数据
                          successPubs: [  //获取数据完成后要发送的事件
                            {
                              event: "tgongongweidyuan.loadData",
                              eventPayloadExpression:`
                              let payload
                              if(!eventPayload.imeLogisticsOrderDetailDTOs[me.props.config.index].productionLineGid){
                                payload = {
                                  "query": {
                                    "query": [
                                      {
                                        "field": "workUnitGidRef.factoryLineGid", "type": "eq", "value": 'null'
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
                                          "field": "workUnitGidRef.factoryLineGid", "type": "eq", "value": eventPayload.imeLogisticsOrderDetailDTOs[me.props.config.index].productionLineGid
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
                        form: "detail",
                        tableInfo: {
                          id: "tgongongweidyuan",
                          size: "small",
                          rowKey: "gid",
                          width: "500",
                          tableTitle: "工位",
                          onLoadData: false,
                          showSerial: true,  //序号
                          columns: [
                            { title: '工位编码', width: 100, dataIndex: 'stationCode', key: '1' },
                            { title: '工位名称', width: 100, dataIndex: 'stationName', key: '2' },
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/ime/mdFactoryWorkStation/query.action',
                            pager:true,
                          }
                        },
                        pageId: 'thdugongweiiyuan',
                        displayField: "stationName",
                        valueField: {
                          "from": "stationName",
                          "to": "factoryWorkStationGidRef.stationName"
                        },
                        associatedFields: [
                          {
                            "from": "gid",
                            "to": "factoryWorkStationGid"
                          }
                        ]
                      }, {
                        "id": "tablellheee3r3",
                        "title": "备注说明",
                        "type": "textField",
                        "name": "remark",
                        "enabled": true
                      }, {
                        "id": "tableo9plpted7",
                        "title": "需求工序",
                        "type": "findbackField",
                        "name": "routeOperationName",
                        //"enabled": false,
                        subscribes: [
                          {
                              event:"tgongxuddddyuan.onTableTodoAny",
                              pubs:[
                                {
                                  event:"tableo9plpted7.expression",
                                  meta: {
                              expression:`
                              resolveFetch({fetch:{id:'detail',data:'@@formValues'}}).then(function(da){
                                if(!da.imeLogisticsOrderDetailDTOs[me.props.config.index].routeGid){
                                  pubsub.publish('tgongxuddddyuan['+me.props.config.rowIndex+'].setData',{eventPayload:[]})
                                }else{
                                let payload = {id:da.imeLogisticsOrderDetailDTOs[me.props.config.index].routeGid}
                                  let dataSource = {
                                  type: 'api',
                                  method: 'post',
                                  paramsInQueryString:true,
                                  url: '/ime/mdRouteLine/findById.action',
                                }
                                resolveDataSourceCallback({dataSource:dataSource,eventPayload:payload},function(res){
                                  pubsub.publish('tgongxuddddyuan['+me.props.config.rowIndex+'].setData',{eventPayload:res.data.mdRouteOperationDTOs})
                                })
                              }
                              })
                              `
                                  }
                                }
                                
                              ]
                            }
                        ],
                        form: "detail",
                        tableInfo: {
                          id: "tgongxuddddyuan",
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
                        pageId: 'thduxusjwjiyuan',
                        displayField: "name",
                        valueField: {
                          "from": "name",
                          "to": "routeOperationName"
                        },
                        associatedFields: [
                          {
                            "from": "gid",
                            "to": "routeOperationGid"
                          }
                        ]
                      }, {
                        "id": "tabder4rgted7",
                        "title": "供应货主",
                        "type": "textField",
                        "name": "supplyWarehouseGidRef.warehouseName",
                        "enabled": false
                      }, {
                        "id": "tablfrt65789ed7",
                        "title": "生产订单",
                        "type": "textField",
                        "name": "imePlanOrderGidRef.code",
                        "enabled": false
                      }, {
                        "id": "tablellfrghy7i457",
                        "title": "生产工单",
                        "type": "findbackField",
                        "name": "imeWorkOrderGidRef.code",
                        form: "detail",
                        tableInfo: {
                          id: "tahduuseugyuan",
                          size: "small",
                          rowKey: "gid",
                          width: "500",
                          tableTitle: "生产工单",
                          showSerial: true,  //序号
                          columns: [
                            { title: '生产工单', width: 100, dataIndex: 'code', key: '1' },
                            { title: '生产订单', width: 150, dataIndex: 'planOrderGidRef.code', key: '2' },
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/ime/imeWorkOrder/query.action',
                            payload: {
                            "query": {
                              "query": 
                                [
                                  {"operator":"and","field":"workOrderStatusGid", "type": "eq", "value": "40"},
                                  {"operator":"and","field":"createStatus", "type": "ne", "value": "1"}
                                ]
                            }
                          }
                          }
                        },
                        pageId: 'thdusudeddlaiyuan',
                        displayField: "code",
                        valueField: {
                          "from": "code",
                          "to": "imeWorkOrderGidRef.code"
                        },
                        associatedFields: [
                          {
                            "from": "gid",
                            "to": "imeWorkOrderGid"
                          }, {
                            "from": "planOrderGid",//生产订单
                            "to": "imePlanOrderGid"
                          }, {
                            "from": "planOrderGidRef.code",//生产订单
                            "to": "imePlanOrderGidRef.code"
                          }, {
                            "from": "workOrderSeq",//工单顺序
                            "to": "workOrderSeq"
                          }, {
                            "from": "productSeq",//生产序列
                            "to": "productSeq"
                          },{
                            "from": "routeGid",//工艺路线gid
                            "to": "routeGid"
                          },{
                            "from": "productionLineGid",//产线gid
                            "to": "productionLineGid"
                          }
                        ]
                      }, {
                        "id": "tablellhlpowpkijk7",
                        "title": "工单顺序",
                        "type": "textField",
                        "name": "workOrderSeq",
                        "enabled": false
                      }, {
                        "id": "tablfhu54ted7",
                        "title": "生产序列",
                        "type": "textField",
                        "name": "productSeq",
                        "enabled": false
                      },
                    ]
                  }} component={TableField} />
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="物流派工单" key="2">
              <Card bordered={true}>
                <AppTable name="1234567890" config={{
                  "id": "1234567890",
                  "name": "1234567890",
                  "type": "checkbox",//表格单选复选类型
                  "size": "default",//表格尺寸
                  "rowKey": "gid",//主键
                  "onLoadData": false,//初始化是否加载数据
                  "width": 100,//表格宽度
                  "showSerial": true,//是否显示序号
                  "editType": true,//是否增加编辑列
                  "page": 1,//当前页
                  "pageSize": 10,//一页多少条
                  "isPager": true,//是否分页
                  "isSearch": true,//是否显示模糊查询
                  "columns": [
                    { title: '物流派工单编号', width: 100, dataIndex: 'code', key: '1' },
                    { title: '供应仓库', width: 100, dataIndex: 'mdWarehouseGidRef.warehouseName', key: '2' },
                    { title: '配送类型', width: 100, dataIndex: 'mdMrlDeliverySchemeGidRef.deliveryType', key: '3' },
                    { title: '需求单位', dataIndex: 'standardUnit', key: '4', width: 150 },
                    { title: '需求日期', dataIndex: 'reqDate', key: '5', width: 100 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                    { title: '需求时间', dataIndex: 'reqDate', key: '6', width: 100 ,columnsType:{"type":"date","format":"hh:mm:ss"}},
                    { title: '单据状态', dataIndex: 'status', key: '7', width: 100 },
                  ],
                  rowOperationItem: [
                    {
                      id: "23456789009865",
                      type: "linkButton",
                      title: "删除",
                      subscribes: [
                        {
                          event: "23456789009865.click",
                          behaviors: [
                            {
                              type: "request",
                              dataSource: {
                                type: "api",
                                method: "POST",
                                paramsInQueryString: false,//参数拼在url后面
                                url: "/ime/imeLogisticsTrack/delete.action",
                                payloadMapping: [{
                                  from: "dataContext",
                                  to: "@@Array",
                                  key: "gid"
                                }]
                              },
                              successPubs: [
                                {
                                  outside: true,
                                  event: "@@message.success",
                                  payload: '删除成功!'
                                },
                                {
                                  outside: true,
                                  event: "1234567890.loadData",
                                }
                              ],
                              errorPubs: [
                                {
                                  event: "@@message.error",
                                  payload: '删除失败!'
                                }
                              ]
                            }
                          ]
                        },


                      ]
                    }
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'post',
                    pager: true,
                    url: '/ime/imeLogisticsTrack/query.action'
                  },
                  subscribes: [
                    {
                      event: "1234567890.onTableTodoAny",
                      behaviors: [
                        {
                          type: "fetch",
                          id: "detail", //要从哪个组件获取数据
                          data: "@@formValues",//要从哪个组件的什么属性获取数据
                          successPubs: [  //获取数据完成后要发送的事件
                            {
                              event: "1234567890.loadData",
                              eventPayloadExpression: `
                          let id
                          if(eventPayload.gid === undefined){
                            id = "null"
                          }else{
                            id = eventPayload.gid
                          }
                          let payload = {
                              "query": {
                                "query": [
                                  {
                                    "field": "logisticsWorkOrderGid", "type": "eq", "value": id
                                  }
                                ],
                                "sorted": "gid asc"
                              }
                            }
                           callback(payload)
                        `
                            }
                          ]
                        }
                      ],
                    }
                  ]
                }} />
              </Card>

            </TabPane>
          </Tabs>
        </Card>
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
                      }, {
                        event: "DisRecordOk.dataContext"
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
                  }, {
                    event: "DisRecordOk.click",
                    pubs: [
                      {
                        event: "DisRecordOk.expression",
                        meta: {
                          expression: `
                            let newData = me.dataContext
                            for(var i=0;i<newData.length;i++){
                              newData[i].mdMaterialInfoGidRef = {}
                              newData[i].mdMaterialInfoGidRef.measurementUnitGidRef = {}
                              newData[i].mdMaterialInfoGid = newData[i].gid
                              newData[i].mdMaterialInfoGidRef.code = newData[i].code
                              newData[i].mdMaterialInfoGidRef.name = newData[i].name
                              newData[i].mdMaterialInfoGidRef.measurementUnitGid = newData[i].measurementUnitGid
                              newData[i].mdMaterialInfoGidRef.measurementUnitGidRef.name = newData[i].measurementUnitGidRef.name
                            }
                            let pushData = []
                            for(var i=0;i<newData.length;i++){
                              let oneData = {}
                              if(!newData[i].mdMaterialInfoGidRef){
                                newData[i].mdMaterialInfoGidRef = {}
                              }
                              if(!newData[i].mdMaterialInfoGidRef.measurementUnitGidRef){
                                newData[i].mdMaterialInfoGidRef.measurementUnitGidRef = {}
                              }
                              oneData.mdMaterialInfoGidRef = newData[i].mdMaterialInfoGidRef
                              oneData.mdMaterialInfoGid = newData[i].mdMaterialInfoGid
                              oneData.standardUnit = newData[i].mdMaterialInfoGidRef.measurementUnitGidRef.name
                              pushData.push(oneData)
                            }
                            resolveFetch({fetch:{id:'detail',data:'@@formValues'}}).then(function(res){
                            let vData
                            if(!res){
                              res = {}
                            }
                            if(res.imeLogisticsOrderDetailDTOs){
                              
                              vData = pushData.concat(res.imeLogisticsOrderDetailDTOs)
                            }else{
                              vData = pushData
                            }
                            let reCode = []
                            for(var i =0;i<vData.length;i++){
                              reCode.push(vData[i].mdMaterialInfoGidRef.code)
                            }
                            var nary=reCode.sort()
                            let message = ''
                            for(var i=0;i<nary.length;i++){
                                if (nary[i]==nary[i+1]){
                                  message = '物料编码'+nary[i]+'重复,请重新选择'
                                  break;
                                }
                            }
                            if(message){
                              pubsub.publish("@@message.error",message)
                            }else{
                              pubsub.publish("@@form.change", { id: "detail",name:"imeLogisticsOrderDetailDTOs" ,value: fromJS(vData) })
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

Detail.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}


function mapStateToProps(props) {
  return {
    onSubmit: () => { debugger }
  };
}



let DetailForm = reduxForm({
  form: "detail",
  validate,
})(Detail)

export default connect(mapStateToProps, mapDispatchToProps)(DetailForm);
