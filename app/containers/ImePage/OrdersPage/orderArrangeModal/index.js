import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import {Button} from 'antd'
import FindbackField from 'components/Form/FindbackField'
import InputNumberField from 'components/Form/InputNumberField'
import SelectField from 'components/Form/SelectField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import {Row, Col} from 'antd'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import ModalContainer from 'components/ModalContainer'

const validate = values => {
  const errors = {}
  if (!values.get('workCenterGid')) {
    errors.workCenterGid = '工作中心必填'
  }
  if (!values.get('planDate')) {
    errors.planDate = '计划生产日期必填'
  }
  return errors
}

export class orderArrangeModal extends React.PureComponent {
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
        <ModalContainer config={{
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
            "editType": false,
            "columns": [
              { title: '订单编码', width: 100, dataIndex: 'code', key: '1' },
              { title: '订单顺序', dataIndex: 'orderSeq', key: '2' ,width: 100},
              { title: '产品编号', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '3' },
              { title: '产品名称', width: 150, dataIndex: 'productGidRef.materialGidRef.name', key: '4' },
              { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '5', width: 150 },
              { title: '计划数量', dataIndex: 'planQty', key: '6', width: 100 },
              { title: '本批数量', dataIndex: 'actualQty', key: '7', width: 100 },
              { title: '计划开始时间', dataIndex: 'planBeginTime', key: '8', width: 150 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
              { title: '交付日期', dataIndex: 'deliverTime', key: '9', width: 150 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
              { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '10', width: 150 },
              { title: '工艺路线', dataIndex: 'productGidRef.routePathRef.name', key: '11' ,width: 100},
              { title: '订单类型', dataIndex: 'planOrderTypeGid', key: '12' ,width: 100},
              { title: '订单状态', dataIndex: 'orderStatusGid', key: '13' ,width: 100},
              { title: '订单BOM状态', dataIndex: 'bomStatusGid', key: '14' ,width: 120},
              { title: '订单进程', dataIndex: 'processStatus', key: '15' ,width: 100}
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
                              let currentData = dataSource.concat(selectedRows)
                              pubsub.publish('arrangeTable.setData',{eventPayload:currentData,ext:dataContext})
                            })

                            for(var i=0;i<allData.length;i++){
                              var item = allData[i]
                              if(selectedRowKeys.indexOf(item.gid)==-1){
                                leftData.push(item)
                              }
                            }
                            pubsub.publish('arrangeTableAdd.setData',{eventPayload:leftData,ext:dataContext})
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
        </ModalContainer>
        <form>
            <Row>
                <Col span="11">
                    <Field config={{
                        enabled: true,
                        id: "workCenterSelect",
                        label: "工作中心",
                        showRequiredStar: true,  //是否显示必填星号
                        form:"orderArrangeModal",
                        // formMode:'edit',
                        dataSource: {},
                        tableInfo: {
                            id:"tableId555",
                            size:"small",
                            rowKey:"gid",
                            tableTitle:"工作中心",
                            width:100,
                            columns:[
                                {title: '工作中心编码', width: 200, dataIndex: 'workCenterCode', key: '1'},
                                {title: '工作中心名称', width: 200, dataIndex: 'workCenterName', key: '2'}
                            ],
                            dataSource: {
                                type: 'api',
                                method: 'post',
                                url: '/ime/mdFactoryWorkCenter/query.action',
                            }
                        },
                        pageId:'workCenterModal',
                        displayField: "workCenterName",
                        valueField: {
                          "from": "gid",
                          "to": "workCenterGid"
                        },
                        associatedFields: [

                        ]
                    }} name="workCenterGid" component={FindbackField}/>
                </Col>
                <Col span="11">
                    <Field config={{
                        id: "dateSelect",
                        type: "selectField",
                        label: "计划生产日期",
                        name: "planDate",
                        showRequiredStar: true,  //是否显示必填星号
                        dataSource: {
                            type: "api",
                            method: "POST",
                            url: "/ime/imePlanOrder/getPlanDateCombox.action",
                            bodyExpression:`
                              let workCenterGid = ""
                              resolveFetch({fetch:{id:"orderArrangeModal",data:"@@formValues"}}).then(function (data) {
                                let workCenterGid = data && data.workCenterGid && data.workCenterGid
                                callback({workCenterGid:workCenterGid})
                              })
                            `
                        },
                        displayField: "value",
                        valueField: "id",
                        subscribes:[
                          {
                            event:"workCenterSelect.onChange",
                            pubs:[
                              {
                                event:"dateSelect.loadData"
                              },
                              {
                                event:"arrangeTable.loadData",
                              }
                            ]
                          },
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
                            url: "/ime/mdSortRule/getPlanOrderCombox.action",
                        },
                        showRequiredStar: false,  //是否显示必填星号
                        displayField: "value",
                        valueField: "id"
                    }} name="ruleGid" component={SelectField}/>
                </Col>
            </Row>
            <Row>
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
                              eventPayloadExpression:`
                                callback({eventPayload:eventPayload,ext:dataContext});
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
            <Row>
                <AppTable name="arrangeTable" config={{
                  "id":"arrangeTable",
                  "name":"arrangeTable",
                  "tableTitle":"编排中订单列表",
                  "type":"checkbox",//表格单选复选类型
                  "size":"default",//表格尺寸
                  "rowKey": "gid",//主键
                  "onLoadData":false,//初始化是否加载数据
                  "showSerial":true,
                  "editType":false,
                  "isUpdown":true,
                  "isPager":false,
                  "isSearch":false,
                  "columns":[
                    { title: '订单编码', width: 100, dataIndex: 'code', key: '1' },
                    { title: '订单顺序', dataIndex: 'orderSeq', key: '2' ,width: 100},
                    { title: '产品编号', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '3' },
                    { title: '产品名称', width: 150, dataIndex: 'productGidRef.materialGidRef.name', key: '4' },
                    { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '5', width: 150 },
                    { title: '计划数量', dataIndex: 'planQty', key: '6', width: 100 },
                    { title: '本批数量', dataIndex: 'actualQty', key: '7', width: 100 },
                    { title: '计划开始时间', dataIndex: 'planBeginTime', key: '8', width: 150 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                    { title: '交付日期', dataIndex: 'deliverTime', key: '9', width: 150 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                    { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '10', width: 150 },
                    { title: '工艺路线', dataIndex: 'productGidRef.routePathRef.name', key: '11' ,width: 100},
                    { title: '订单类型', dataIndex: 'planOrderTypeGid', key: '12' ,width: 100},
                    { title: '订单状态', dataIndex: 'orderStatusGid', key: '13' ,width: 100},
                    { title: '订单BOM状态', dataIndex: 'bomStatusGid', key: '14' ,width: 120},
                    { title: '订单进程', dataIndex: 'processStatus', key: '15' ,width: 100}
                  ],
                  dataSource: {
                    type: 'api',
                    method: 'post',
                    url: '/ime/imePlanOrder/layoutQuery.action'/*?workCenterGid=578FAE05EE1A3A52E055000000000001&planDate=2017-08-31*/,
                    withForm: "orderArrangeModal",
                  },
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
                              pubsub.publish('arrangeTable.setData',{eventPayload:leftData,ext:me.ext})
                              pubsub.publish("arrangeAdd.dataContext",{
                                  eventPayload:me.ext
                              });

                              //传递给"确定"按钮的信息
                              pubsub.publish("btn2.dataContext",{
                                  eventPayload:leftData
                              });
                            `
                          }
                        }
                      ]
                    }
                  ]


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
                              id: "orderArrangeModal", //要从哪个组件获取数据
                              data: "@@formValues",//要从哪个组件的什么属性获取数据
                              successPubs: [  //获取数据完成后要发送的事件

                                {
                                  event:"arrangeTable.loadData",
                                  // payload:this.formValues
                                }
                              ]
                            }
                          ]
                        },
                        {
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
                                url: '/ime/imePlanOrder/saveOrder.action',
                                bodyExpression:`
                                  if(!submitValidateForm("orderArrangeModal")){
                                    resolveFetch({fetch:{id:"orderArrangeModal",data:"@@formValues"}}).then(function (value) {
                                      resolveFetch({fetch:{id:"arrangeTable",data:"state"}}).then(function (data) {
                                        let dataSource = data.dataSource
                                        let ids = []
                                        for(let i =0;i<dataSource.length;i++){
                                          ids.push(dataSource[i].gid)
                                        }
                                        callback({planDate:value.planDate, workCenterGid:value.workCenterGid, ids:ids})
                                      })
                                    })
                                  }
                                `
                              },
                              successPubs: [
                                {
                                  event: "orderArrange.onCancel"
                                },
                                {
                                  event: "@@message.success",
                                  payload:'编排成功!'
                                },
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
                            event: "orderArrange.onCancel",
                          }]
                        }
                      ]
                    }} />

                  {/*<Button onClick={this.props.handleSubmit((values) => {*/}
                  {/*})}>提交</Button>*/}
                </Col>
            </Row>
        </form>
      </div>
    );
  }
}

orderArrangeModal.propTypes = {
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

let orderArrangeModalForm = reduxForm({
  form: "orderArrangeModal",
  validate,
})(orderArrangeModal);


export default connect(mapStateToProps, mapDispatchToProps)(orderArrangeModalForm);

