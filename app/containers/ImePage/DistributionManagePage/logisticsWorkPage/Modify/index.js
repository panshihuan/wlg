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


import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

const TabPane = Tabs.TabPane;
const validate = values => {
  const errors = {}
  /*const reg = new RegExp("^[0-9]*$")
  if(values.get('planEndTime')&&values.get('planBeginTime')){
    var endTime = new Date(values.get('planEndTime').replace(/-/,"/")) 
    var beginTime = new Date(values.get('planBeginTime').replace(/-/,"/")) 
    if(!(endTime>beginTime)){
      errors.planEndTime = "计划开始时间必须小于计划完成时间"
      errors.planBeginTime = "计划开始时间必须小于计划完成时间"
    }
  }
  
  if (!values.get('code')) {
    errors.code = '必填项'
  } 
  if (!values.get('planEndTime')) {
    errors.planEndTime = '必填项'
  }
  if (!values.get('planBeginTime')) {
    errors.planBeginTime = '必填项'
  }
  if (!values.get('planQty')) {
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
    errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
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
  return errors*/
}

class Modify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    /*let modifyId = this.props.location.state[0].gid
    let dataSource = {
      mode: "dataContext",
      type: "api",
      method: "POST",
      url: "/ime/imeLogisticsOrder/findById.action",
    }
    resolveDataSource({ dataSource, dataContext: { id: modifyId } }).then(function(res){
      pubsub.publish("@@form.init", { id: "modify", data: Immutable.fromJS(res.data) })
    })*/
    
  }

  componentWillMount() {
  }
  componentDidMount() {
   console.log(this.props.location)
  }
  componentWillUnmount() {
    
  }
  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <div style={{ padding:"10px" }}>
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
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/imeLogisticsOrder/modify.action",
                          withForm: "modify",
                        },
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            payload: {
                              url: "/imeLogisticsWork/modify"
                            }
                          }, {
                            event: "@@message.success",
                            payload: "新增成功"
                          }
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload: "新增失败"
                          },{
                            event: "@@navigator.push",
                            mode: "payload&&eventPayload",
                            payload: {
                              url: "/imeLogisticsWork/modify",
                            }
                          }
                        ]
                      }
                    ],
                  }
                ]
              }}></AppButton>
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
                form: "modify",
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
                  "to": "mdWarehouseGidRef.code"
                },
                associatedFields: [
                    {
                  "from": "warehouseName",
                  "to": "mdWarehouseGidRef.name"
                },{
                  "from": "warehouseType",
                  "to": "mdWarehouseGid"
                },
                ],
               
              }} name="mdWarehouseGidRef.code" component={FindbackField} />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "gName",
                label: "供应仓库名称",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24））
                placeholder: "根据规则回写"
              }} component={TextField} name="mdWarehouseGidRef.name" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled: false,
                id: "numUnit",
                label: "配送方案",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24）
                form:"modify",
                tableInfo: {
                  id: "tableIddccdd55",
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
                pageId: 'pfdddganfindback',
                displayField: "deliveryName",
                valueField: {
                  "from": "deliveryName",
                  "to": "mdMrlDeliverySchemeGidRef.deliveryName"
                },
                associatedFields:[
                  {
                    "from": "gid",
                    "to": "mdMrlDeliverySchemeGid"
                  }
                ]
              }} component={TextField} name="mdMrlDeliverySchemeGidRef.name" />
            </Col>
          </Row>

          <Row>
            <Col span={6}>
              <Field config={{
                enabled: true,
                id: "payTime",
                label: "需求产线",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24）
                from:"modify",
                tableInfo: {
                  id: "tableId5dfre55",
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
                    url: '/ime/imeLogisticsOrder/getLineListByDeliveryScheme.action'
                  },
                  subscribes: [
                    {
                      event: "tableId5dfre55.onTableTodoAny",
                      behaviors: [
                        {
                          type: "fetch",
                          id: "modify", //要从哪个组件获取数据
                          data: "@@formValues",//要从哪个组件的什么属性获取数据
                          successPubs: [  //获取数据完成后要发送的事件
                            {
                              event: "tableId5dfre55.loadData",
                              eventPayloadExpression:`
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
                displayField: "mdFactoryLineGidRef.lineName",
                valueField: {
                  "from": "mdFactoryLineGidRef.lineName",
                  "to": "FactoryLineGidRef.lineName"
                },
                associatedFields:[{
                  "from": "gid",
                  "to": "FactoryLineGid"
                }]
              }} component={FindbackField} name="FactoryLineGidRef.lineName" />
            </Col>
            <Col span={6}>
              <Field config={{
                id: "planNum",
                label: "需求日期",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24）
                placeholder: "需求明细最小日期"
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
              }} component={TextField} name="reqTime" />
            </Col>
            <Col span={6}>
              <Field config={{
                enabled:false,
                id: "orderType",
                label: "单据状态",  //标签名称
                labelSpan: 10,   //标签栅格比例（0-24）
                wrapperSpan: 14,  //输入框栅格比例（0-24）
                placeholder: "根据规则回写",
              }} component={TextField} name="status" />
            </Col>
          </Row>

         </Card>
         <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="物料需求" key="1">
            <Row type="flex" justify="space-between">
                <Col span={2} offset={22}>
                <AppButton config={{
                  id: "adgonghiksk",
                title: "增加",
                type: "primary",
                visible: true,
                enabled: true,
                subscribes:[
                  {
                    event:"adgonghiksk.click",
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
                  <FieldArray name="imeLogisticsOrderDetailDTOs" config={{
                    "id": "tafnjnjdkkdllow4jh777frr",
                    "name": "tableFiledkkdhegrfera3678b",
                    "rowKey": "id",
                    form:"modify",
                    showSelect:true,
                    addButton :false,
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
                        "type": "textField",
                        "title": "包装数量",
                        "name": "packNum",
                        "enabled": false
                      }, {
                        "id": "tablellllled4",
                        "title": "包装方式",
                        "type": "textField",
                        "name": "packWay",
                        "enabled": false
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
                        subscribes:[
                          {
                            event:"tableFoppuyed5.onChange",
                            pubs:[
                              {
                                event:"tabhkoooiled6.expression",
                                meta:{
                                  expression:`
                                  pubsub.publish("@@form.change", { id: "modify", name: me.props.input.name, value: data.eventPayload })
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
                      }, {
                        "id": "tablellhgted72",
                        "title": "最新需求时间",
                        "type": "dateField",
                        "name": "newestReqTime",
                        subscribes:[
                          {
                            event:"tablellhgted71.onChange",
                            pubs:[
                              {
                                event:"tablellhgted72.expression",
                                meta:{
                                  expression:`
                                  pubsub.publish("@@form.change", { id: "modify", name: me.props.input.name, value: data.eventPayload })
                                  `
                                }
                              }
                            ]
                          }
                        ]
                      }, {
                        "id": "tablellhgted73",
                        "title": "配送组号",
                        "type": "textField",
                        "name": "materialGroupGidRef.code",
                        "enabled": false
                      }, {
                        "id": "tablellhgted74",
                        "title": "配送组名",
                        "type": "textField",
                        "name": "materialGroupGidRef.name",
                        "enabled": false
                      }, {
                        "id": "tablellhgted75",
                        "title": "包装标准",
                        "type": "textField",
                        "name": "packStandard",
                        "enabled": false
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
                        "enabled": false
                      }, {
                        "id": "tablellhgted7gr",
                        "title": "需求状态",
                        "type": "textField",
                        "name": "reqStatus",
                        "enabled": false
                      }, {
                        "id": "tablelee34ed7",
                        "title": "需求工位",
                        "type": "textField",
                        "name": "factoryWorkStationGidRef.name",
                        "enabled": false
                      }, {
                        "id": "tablellheee3r3",
                        "title": "备注说明",
                        "type": "textField",
                        "name": "remark",
                        "enabled": false
                      },  {
                        "id": "tableo9plpted7",
                        "title": "需求工序",
                        "type": "textField",
                        "name": "routeOperationName",
                        "enabled": false
                      },  {
                        "id": "tabder4rgted7",
                        "title": "供应货主",
                        "type": "textField",
                        "name": "supplyWarehouseGidRef.name",
                        "enabled": false
                      },  {
                        "id": "tablfrt65789ed7",
                        "title": "生产订单",
                        "type": "textField",
                        "name": "imePlanOrderGidRef.code",
                        "enabled": false
                      },  {
                        "id": "tablellfrghy7i457",
                        "title": "生产工单",
                        "type": "textField",
                        "name": "imeWorkOrderGidRef.name",
                        "enabled": false
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
            "onLoadData": true,//初始化是否加载数据
            "width": 100,//表格宽度
            "showSerial": true,//是否显示序号
            "editType": true,//是否增加编辑列
            "page": 1,//当前页
            "pageSize": 10,//一页多少条
            "isPager": true,//是否分页
            "isSearch": true,//是否显示模糊查询
            "columns": [
              { title: '物流派工单编号', width: 100, dataIndex: 'code', key: '1' },
              { title: '供应仓库', width: 100, dataIndex: 'mdWarehouseGidRef.name', key: '2' },
              { title: '配送类型', width: 100, dataIndex: 'mdMrlDeliverySchemeGidRef.deliveryType', key: '3' },
              { title: '需求产线', dataIndex: 'factoryLineGidRef.lineName', key: '4', width: 150 },
              { title: '需求日期', dataIndex: 'reqDate', key: '5', width: 100 },
              { title: '需求时间', dataIndex: 'reqDate', key: '6', width: 100 },
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
                            event: "1234567890.loadData",
                        }
                        ],
                        errorPubs: [
                            {
                                event: "@@message.error",
                                payload:'删除失败!'
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
              pager:true,
              url: '/ime/imeLogisticsTrack/query.action'
            }
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
                      },{
                        event:"DisRecordOk.dataContext"
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
                    pubs:[
                      {
                        event:"DisRecordOk.expression",
                        meta:{
                          expression:`
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
                            resolveFetch({fetch:{id:'modify',data:'@@formValues'}}).then(function(res){
                            let vData
                            if(!res){
                              res = {}
                            }
                            if(res.imeLogisticsOrderDetailDTOs){
                              vData = pushData.concat(res.imeLogisticsOrderDetailDTOs)
                            }else{
                              vData = pushData
                            }
                            pubsub.publish("@@form.change", { id: "modify",name:"imeLogisticsOrderDetailDTOs" ,value: fromJS(vData) })
                            pubsub.publish("pageIdDidddssRecordteeeeeeeffgg.onCancel")
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
