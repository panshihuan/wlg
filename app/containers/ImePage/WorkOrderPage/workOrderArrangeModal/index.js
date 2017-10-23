import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import {Button} from 'antd'
import FindbackField from 'components/Form/FindbackField'
import InputNumberField from 'components/Form/InputNumberField'
import SelectField from 'components/Form/SelectField'
import DateField from 'components/Form/DateField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import {Row, Col} from 'antd'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import ModalContainer from 'components/ModalContainer'
const validate = values => {
  const errors = {}
  if (!values.get('productLineGid')) {
    errors.productLineGid = '产线必填'
  }
  if (!values.get('forecastTime')) {
    errors.forecastTime = '预测开工时间必填'
  }
  return errors
}

export class WorkOrderArrangeModal extends React.PureComponent {
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
        {/* <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "arrangeAddModel", // id，必填*
          pageId: "arrangeAddModel", // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          title: "添加待排序订单", // title，不传则不显示title
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
          <AppTable name="arrangeTableAdd" config={{
            "id": "arrangeTableAdd",
            "name": "arrangeTableAdd",
            // "tableTitle": "编排中订单列表",
            "type": "checkbox",//表格单选复选类型
            "size": "default",//表格尺寸
            "rowKey": "gid",//主键
            "onLoadData": false,//初始化是否加载数据
            "showSerial": true,
            "editType": true,
            "columns": [
              {title: '订单编码', width: 100, dataIndex: 'code', key: '1'},
              {title: '物料编码', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '2'},
              {title: '物料名称', width: 150, dataIndex: 'productGidRef.materialGidRef.name', key: '3'},
              {
                title: '计量单位名称',
                dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name',
                key: '4',
                width: 150
              },
              {title: '计划数量', dataIndex: 'planQty', key: '5', width: 100},
              {title: '本批数量', dataIndex: 'actualQty', key: '6', width: 100},
              {title: '计划开始时间', dataIndex: 'planBeginTime', key: '7', width: 150},
              {title: '交付时间', dataIndex: 'deliverTime', key: '8', width: 150},
              {title: '工作单元名称', dataIndex: 'workCenterGidRef.workUnitName', key: '9', width: 150},
              {title: '订单顺序', dataIndex: 'orderSeq', key: '10', width: 100},
              {title: '工艺名称', dataIndex: 'productGidRef.routePathRef.name', key: '11', width: 100},
              {title: '订单类型', dataIndex: 'planOrderTypeGid', key: '12', width: 100},
              {title: '订单状态', dataIndex: 'orderStatusGid', key: '13', width: 100}
            ],
            dataSource: {}
          }}

          />
          <Row>
            <Col span={4} offset={20}>
              <AppButton config={{
                id: "addOk",
                title: "确定",
                type:"primary",
                size:"large",
                visible: true,
                enabled: false,
                subscribes:[
                  {
                    event:"arrangeTableAdd.onSelectedRows",
                    pubs:[
                      {
                        event:"addOk.enabled",
                        payload:true
                      }
                    ]
                  },
                  {
                    event:"arrangeTableAdd.onSelectedRowsClear",
                    pubs:[
                      {
                        event:"addOk.enabled",
                        payload:false
                      }
                    ]
                  },
                  {
                    event:"addOk.click",
                    pubs:[
                      {
                        event: "arrangeTableAdd.expression",
                        meta: {
                          expression: `
                            let selectedRows = me.selectedRows||[]
                            let allData= _.cloneDeep(me.state.dataSource); //总数据
                            let selectedRowKeys=me.state.selectedRowKeys;  //选中数据gid
                            let leftData = []

                            resolveFetch({fetch:{id:"arrangeTable",data:"state"}}).then(function (data) {
                              let dataSource = _.cloneDeep(data.dataSource)||[];
                              let currentData = selectedRows.concat(dataSource)
                              pubsub.publish('arrangeTable.setData',{eventPayload:currentData})
                            })

                            for(var i=0;i<allData.length;i++){
                              var item = allData[i]
                              if(selectedRowKeys.indexOf(item.gid)==-1){
                                leftData.push(item)
                              }
                            }
                            pubsub.publish('arrangeTableAdd.setData',{eventPayload:leftData})
                            console.log("增加",allData,selectedRows,leftData)
                          `
                        },
                      },
                      {
                        event: "arrangeTable.expression",
                        meta: {
                          expression: `
                            resolveFetch({fetch:{id:"arrangeTableAdd",data:"state"}}).then(function (data) {
                              me.arrangeDelData = data.dataSource
                            })
                          `
                        }
                      },
                      {
                        event: "arrangeAddModel.onCancel",
                      }
                    ]
                  }
                ]
              }} />
              <AppButton config={{
                id: "addCancel",
                title: "取消",
                type:"default",
                size:"large",
                visible: true,
                enabled: true,
                subscribes: [
                  {
                    event: "addCancel.click",
                    pubs:[{
                      event: "arrangeAddModel.onCancel",
                    }]
                  }
                ]
              }} />
            </Col>
          </Row>
            </ModalContainer> */}
        <form>
            <Row>
                <Col span={11}>
                    <Field config={{
                        enabled: true,
                        id: "workLineSelect",
                        label: "产线",
                        showRequiredStar: true,  //是否显示必填星号
                        form:"workOrderArrangeModal",
                        // formMode:'edit',
                        dataSource: {},
                        tableInfo: {
                            id:"tableId555",
                            size:"small",
                            rowKey:"gid",
                            tableTitle:"产线",
                            width:100,
                            columns:[
                                {title: '产线编码', width: 200, dataIndex: 'lineCode', key: '1'},
                                {title: '产线名称', width: 200, dataIndex: 'lineName', key: '2'}
                            ],
                            dataSource: {
                                type: 'api',
                                method: 'post',
                                url: '/ime/mdFactoryLine/query.action',
                            }
                        },
                        pageId:'factoryLineModal',
                        displayField: "lineName",
                        valueField: {
                          "from": "gid",
                          "to": "productLineGid"
                        }
                    }} name="productLineGid" component={FindbackField}/>
                </Col>
                <Col span={11}>
                    <Field config={{
                        id: "dateSelect",
                        type: "selectField",
                        label: "计划生产日期",
                        name: "planDate",
                        showRequiredStar: false,  //是否显示必填星号
                        dataSource: {
                            type: "api",
                            method: "POST",
                            url: "/ime/imeWorkOrder/getPlanDateCombox.action",
                            bodyExpression:`
                              let productLineGid = ""
                              resolveFetch({fetch:{id:"workOrderArrangeModal",data:"@@formValues"}}).then(function (data) {
                                let productLineGid = data && data.productLineGid && data.productLineGid
                                callback({productLineGid:productLineGid})
                              })
                            `

                        },
                        displayField: "value",
                        valueField: "id",
                        subscribes:[
                          {
                            event:"dateSelect.onChange",
                            pubs:[
                              {
                                event:"arrangeTable.loadData",
                              }
                            ]
                          }
                        ]
                    }} name="planDate" component={SelectField}/>
                </Col>
            </Row>
            <Row>
                <Col span={11}>
                    <Field config={{
                        "id": "ruleSelect",
                        "type": "selectField",
                        "label": "编排规则方案",
                        "title": "下拉",
                        "name": "ruleGid",
                        dataSource: {
                            type: "api",
                            method: "POST",
                            url: "/ime/mdSortRule/getWorkOrderCombox.action",
                        },
                        showRequiredStar: false,  //是否显示必填星号
                        displayField: "value",
                        valueField: "id"
                    }} name="ruleGid" component={SelectField}/>
                </Col>
                <Col span={11}>
                  <Field config={{
                      "id": "tableDateFiled1",
                      placeholder: "请输入日期",
                      "label": "首单预测开工时间",
                      showRequiredStar: true,  //是否显示必填星号
                      labelSpan: 8,   //标签栅格比例（0-24）
                      wrapperSpan: 16,  //输入框栅格比例（0-24）
                      showTime:true
                  
                  }} name="forecastTime" component={DateField}/>
              </Col>
              <Col span={2}>
                <AppButton config={{
                  id: "btn90",
                  title: "计算时间",
                  type:"default",
                  size:"large",
                  visible: true,
                  enabled: true,
                  subscribes: [
                    {
                      event:"workLineSelect.onChange",
                      pubs:[
                        {
                          event: "btn90.dataContext",
                        },
                        {
                          event:"dateSelect.loadData"
                        },
                        {
                          event:"arrangeTable.loadData",
                        }
                      ]
                    },

                    {
                      event: "btn90.click",
                      behaviors: [
                        {
                         type: "request",
                         dataSource: {
                           type: "api",
                           method: "POST",
                           url: "/ime/imeWorkOrder/getFirstGuesstDate.action",
                           payloadMapping:[{
                             from:"gid",
                             to:"productLineGid"
                           }]
                         },
                         successPubs: [
                           {
                            mode:"payload&&dataContext",                            
                            event: "@@form.change",
                            payload:{
                              id:"workOrderArrangeModal",
                              name:"forecastTime"
                            },
                            payloadMapping:[{
                              from:"@@DataContext",
                              to:"value"
                            }]
                            
                           }
                         ]
                       }
                     ]
                    }
                  ]
                }} />
              </Col>
            </Row>
           { /* <Row>
              <Col  xs={{ span: 6, offset: 18 }} lg={{ span: 4, offset: 20 }}>
                <AppButton config={{
                  id: "arrangeDelete",
                  title: "删除",
                  type:"primary",
                  size:"large",
                  visible: true,
                  enabled: false,
                  subscribes: [
                    {
                      event: "arrangeTable.onSelectedRows",
                      pubs:[
                        {
                          event: "arrangeDelete.enabled",
                          payload:true
                        }
                      ]
                    },
                    {
                      event: "arrangeTable.onSelectedRowsClear",
                      pubs:[
                        {
                          event: "arrangeDelete.enabled",
                          payload:false
                        }
                      ]
                    }
                  ]
                }} />
                <AppButton config={{
                  id: "arrangeAdd",
                  title: "增加",
                  type:"primary",
                  size:"large",
                  visible: true,
                  enabled: true,
                  subscribes: [
                    {
                      event: "arrangeAdd.click",
                      pubs: [
                        {
                          event: "arrangeAddModel.openModal",
                        }
                      ],
                      behaviors: [
                        {
                          type: "fetch",
                          id: "arrangeTable", //要从哪个组件获取数据
                          data: "arrangeDelData",//要从哪个组件的什么属性获取数据
                          successPubs: [  //获取数据完成后要发送的事件

                            {
                              event:"arrangeTableAdd.setData",
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }} />
              </Col>
              </Row> */}
            <Row>
                <AppTable name="arrangeTable" config={{
                  "id":"arrangeTable",
                  "name":"arrangeTable",
                  "tableTitle":"编排中工单列表",
                  "type":"checkbox",//表格单选复选类型
                  "size":"default",//表格尺寸
                  "rowKey": "gid",//主键
                  "onLoadData":false,//初始化是否加载数据
                  "showSerial":true,
                  "editType":true,
                  "isSearch":false,
                  "isPager":false,
                  "isUpdown":true,
                  "columns":[
                    { title: '来源订单', width: 100, dataIndex: 'planOrderGidRef.code', key: '1' },
                    { title: '工单编号', width: 100, dataIndex: 'code', key: '2' },
                    { title: '产品编号', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '3' },
                    { title: '产品名称', dataIndex: 'productGidRef.materialGidRef.name', key: '4', width: 100 },
                    { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '5', width: 100 },
                    { title: '计划数量', dataIndex: 'planQty', key: '6', width: 100 },
                    { title: '本批数量', dataIndex: 'actualQty', key: '7', width: 100 },
                    { title: '计划开始日期', dataIndex: 'workOrderBeginTime', key: '8', width: 130 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                    { title: '交付日期', dataIndex: 'deliverTime', key: '9', width: 100 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                    { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '10', width: 100 },
                    { title: '产线', dataIndex: 'productionLineGidRef.lineName', key: '11', width: 100 },
                    { title: '工单顺序', dataIndex: 'workOrderSeq', key: '12', width: 100 },
                    { title: '工艺路线', dataIndex: 'routeGidRef.name', key: '13', width: 100 },
                    { title: '工单类型', dataIndex: 'workOrderTypeGid', key: '14', width: 100 },
                    { title: '工单状态', dataIndex: 'workOrderStatusGid', key: '15', width: 100 },
                    { title: '工单BOM状态', dataIndex: 'workOrderBomStatusGid', key: '16', width: 130 }
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'post',
                    url: '/ime/imeWorkOrder/layoutQuery.action',
                    withForm: "workOrderArrangeModal",
                  }/* ,
                  subscribes: [
                    {
                      event: "arrangeDelete.click",
                      pubs: [
                        {
                          event: "arrangeTable.expression",
                          meta:{
                            expression:`
                              let allData= me.arrangeAllData; //总数据
                              let selectedRows=me.state.selectedRows;  //选中数据
                              let leftData = [];  //删掉后剩下的数据
                              let arrangeDelData=me.arrangeDelData||[];  //加到增加表格中的数据

                              arrangeDelData= arrangeDelData.concat(selectedRows);
                              for(var i = 0; i<allData.length;i++){
                                var gid = allData[i].gid
                                var item = _.find(arrangeDelData,{gid:gid})
                                if(!item){
                                   leftData.push(allData[i])
                                 }
                              }
                              me.arrangeDelData = arrangeDelData
                              pubsub.publish('arrangeTable.setData',{eventPayload:leftData})

                              //传递给"确定"按钮的信息
                              pubsub.publish("btn2.dataContext",{
                                  eventPayload:leftData
                              });

                              console.log('删除',me,arrangeDelData,leftData)
                            `
                          }
                        }
                      ]
                    }
                  ] */
                }}/>
            </Row>
            <Row>
                <Col span={6} offset={18}>
                    <AppButton config={{
                      id: "btn1",
                      title: "预览",
                      type:"default",
                      size:"large",
                      visible: true,
                      enabled: true,
                      subscribes: [
                        {
                          event: "btn1.click",
                          behaviors: [
                            {
                              type: "fetch",
                              id: "workOrderArrangeModal", //要从哪个组件获取数据
                              data: "@@formValues",//要从哪个组件的什么属性获取数据
                              successPubs: [  //获取数据完成后要发送的事件
                                {
                                  event:"arrangeTable.loadData",
                                  // payload:this.formValues
                                }
                              ]
                            }
                          ]
                        },{
                          event:"arrangeTable.onTableLoaded",
                          pubs:[
                            {
                              event:"arrangeTable.expression",
                              meta:{
                                expression:`
                                  me.arrangeAllData = me.state.dataSource
                                  me.arrangeDelData = []
                                `
                              }
                            }]
                        }
                      ]
                    }} />
                    <AppButton config={{
                      id: "btn2",
                      title: "确定",
                      type:"primary",
                      size:"large",
                      visible: true,
                      enabled: false,
                      subscribes: [
                        {
                          event:"arrangeTable.onTableLoaded",
                          pubs: [
                            {
                              event: "btn2.enabled",
                              payload:true
                            },
                            {
                              event: "btn2.dataContext"
                            }
                          ]
                        },
                        {
                          event: "btn2.click",
                          behaviors: [
                            {
                              type: "request",
                              dataSource: {
                                type: "api",
                                method: 'post',
                                url: '/ime/imeWorkOrder/saveOrder.action',
                                bodyExpression:`
                                  if(!submitValidateForm("workOrderArrangeModal")){
                                    resolveFetch({fetch:{id:"workOrderArrangeModal",data:"@@formValues"}}).then(function (value) {
                                      resolveFetch({fetch:{id:"arrangeTable",data:"state"}}).then(function (data) {
                                        let dataSource = data.dataSource
                                        let ids = []
                                        for(let i =0;i<dataSource.length;i++){
                                          ids.push(dataSource[i].gid)
                                        }
                                        callback({productLineGid:value.productLineGid,forecastTime:value.forecastTime,ids:ids})
                                      })
                                    })
                                  }
                                `
                              },
                              successPubs: [
                                {
                                  event: "@@message.success",
                                  payload:'编排成功!'
                              },
                              {
                                event: "workOrderArrange.onCancel"
                              },
                              {
                                  event: "zxcvbnmasdfgh.loadData",
                              }
                              ],
                              errorPubs :[
                                {
                                  event: "@@message.error",
                                  payload:'编排失败!'
                              },
                              ]
                            }
                          ]
                        }
                      ]

                    }} />
                    <AppButton config={{
                      id: "btn3",
                      title: "取消",
                      type:"default",
                      size:"large",
                      visible: true,
                      enabled: true,
                      subscribes: [
                        {
                          event: "btn3.click",
                          pubs:[{
                            event: "workOrderArrange.onCancel",
                          }]
                        }
                      ]
                    }} />
                </Col>
            </Row>
        </form>

      </div>
    );
  }
}

WorkOrderArrangeModal.propTypes = {
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

let workOrderArrangeModalForm = reduxForm({
  form: "workOrderArrangeModal",
  validate,
})(WorkOrderArrangeModal);


export default connect(mapStateToProps, mapDispatchToProps)(workOrderArrangeModalForm);