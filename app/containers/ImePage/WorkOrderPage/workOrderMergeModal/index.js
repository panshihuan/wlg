import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer';
import {resolveDataSource, publishEvents, resolveFetch,resolveDataSourceCallback} from 'utils/componentUtil'
import InputNumberField from 'components/Form/InputNumberField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import {Row, Col} from 'antd'

export class WorkOrderMergeModal extends React.PureComponent {
  constructor(props) {
    super(props);


  }

  componentWillMount() {
  }
  componentDidMount() {

  }

    componentWillUnmount() {
        this.unSubscribeFetchData()
    }

    unSubscribeFetchData = () => {
        pubsub.unsubscribe(`table123.dataContext`)
        pubsub.unsubscribe(`orderMergeTable-table-11.onSelectedRows`)
        pubsub.unsubscribe(`orderMergeTable-table-11.onTableTodoAny`)
        pubsub.unsubscribe(`orderMergeTable-table-11.onTableTodoAny`)
        pubsub.unsubscribe(`workOrderMergeModal-modal-1.onOk`)
        pubsub.unsubscribe(`orderMergeTable-btn-3.click`)

    }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <form>
          <Row>
              <Col span="24">
                  <AppTable name="orderMergeTable" config={{
                      "id":"orderMergeTable-table-11",
                      "name":"orderMergeTable-table-11",
                      "type":"radio",//表格单选复选类型
                      "size":"default",//表格尺寸
                      "rowKey": "gid",//主键
                      "onLoadData":false,//初始化是否加载数据
                      "showSerial":true,
                      "editType":false,
                      "isSearch":false,
                      "isPager":false,
                      "columns":[
                        { title: '来源订单', width: 100, dataIndex: 'planOrderGidRef.code', key: '1' },
                        { title: '工单编号', width: 100, dataIndex: 'code', key: '2' },
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
                          {
                              event:'orderMergeTable-table-11.onTableTodoAny',
                              behaviors:[
                                  {
                                      type:'fetch',
                                      id:'zxcvbnmasdfgh',
                                      data:'selectedRows',
                                      successPubs:[
                                          {
                                              event:'orderMergeTable-table-11.setData',
                                              eventPayloadExpression:`
                                                resolveFetch({fetch:{id:"zxcvbnmasdfgh",data:"ext"}}).then(function (ext) {
                                                  callback({eventPayload:eventPayload,ext:ext})
                                                })
                                              `
                                          }
                                      ]
                                  },
                              ]
                          },
                          {
                              event:"orderMergeModal-btn-2.click",
                              pubs:[
                                {
                                    event: "orderMergeTable-table-11.expression",
                                    meta:{
                                      expression:`
                                        let dataSource = {
                                            type:'api',
                                            method:'post',
                                            url:'/ime/imeWorkOrder/workOrderBlending.action'
                                        }
                                        let allData= me.state.dataSource||[]; //总数据
                                        let selectedRows=me.state.selectedRows||[];  //选中数据
                                        let param ={};
                                        param['ids'] = [];
                                        for(let i=0;i<allData.length;i++){
                                            param['ids'].push(allData[i]['gid'])
                                        }
                                        if(selectedRows.length>0){
                                            param['id'] = selectedRows[0]['gid'];
                                        }else{
                                            param['id'] = "";
                                        }
                                        let onSuccess = function(response){
                                            if(response.success){
                                                pubsub.publish("@@message.success","合批成功")
                                                pubsub.publish("workOrderMerge.onCancel")
                                                pubsub.publish("zxcvbnmasdfgh.loadData")
                                            }else{
                                                pubsub.publish("@@message.error",response.data)
                                            }
                                        }
                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:param},onSuccess)
                                      `
                                    }
                                  }
                              ]
                          },
                          {
                              event:'orderMergeTable-table-11.onSelectedRows',
                              behaviors:[
                                  {
                                      type:'fetch',
                                      id:'orderMergeTable-table-11',
                                      data:'selectedRows',
                                      successPubs:[
                                          {
                                              event:'orderMergeModal-btn-2.dataContext',

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
                      id: "orderMergeTable-btn-3",
                      title: "取消",
                      type:"default",
                      size:"large",
                      visible: true,
                      enabled: true,
                      subscribes: [
                          {
                              event: "orderMergeTable-btn-3.click",
                              pubs:[{
                                  event: "workOrderMerge.onCancel",
                              }]
                          }
                      ]
                  }} />

                  {/*确定按钮*/}
                  <AppButton config={{
                      id: "workOrderMergeModal-btn-2",
                      title: "确定",
                      type:"primary",
                      size:"large",
                      visible: true,
                      enabled: true,
                      subscribes: [
                          {
                              event:'orderMergeTable-table-11.onSelectedRows',
                              pubs:[
                                  {
                                      event:'workOrderMergeModal-btn-2.dataContext',
                                      // ime/imeWorkOrder/workOrderBlending.action
                                  }
                              ]
                          },
                          {
                              event: "workOrderMergeModal-btn-2.click",
                              behaviors: [
                                  {
                                      type:'fetch',
                                      id:'zxcvbnmasdfgh',
                                      data:'selectedRows',
                                      successPubs:[
                                          {
                                              event:'table123.dataContext',
                                              // mode:'mode'
                                          }
                                      ]
                                  },
                                  {
                                      type: "request",
                                      dataSource:{
                                          type:'api',
                                          method:'post',
                                          url:'/ime/imeWorkOrder/workOrderBlending.action',
                                          // mode:"dataContext",
                                          paramsInQueryString:false,//参数拼在url后面
                                          bodyExpression:`
                                              let selectRows=[];
                                              let unique=function(arr,attr){
                                                    let result;
                                                    for(let x=0,len=attr.length;x<len;x++){
                                                        let hashTable = {};
                                                        let data = [];
                                                        for(let i=0,l=arr.length;i<l;i++){
                                                            if(!hashTable[arr[i][attr[x]]]){
                                                                hashTable[arr[i][attr[x]]] = true;
                                                                data.push(arr[i][attr[x]]);
                                                            }
                                                        }
                                                        if(data.length!=1){
                                                            result=false;
                                                            break;
                                                        }else {
                                                            result=true;
                                                        }
                                                    }
                                                    return result
                                              };


                                            pubsub.subscribe('table123.dataContext',function(ename,payload){

                                                 let arr=payload.eventPayload;
                                                 //需要比对的属性(业务)
                                                 let arrAttr=['workOrderStatusGid','workOrderTypeGid','deliverTime']

                                                 let result= unique(arr,arrAttr)

                                                 let sucCall=function(){
                                                     _.map(payload.eventPayload,function(item,index){
                                                            selectRows.push(item.gid)
                                                        })

                                                        if(dataContext&&dataContext.length){
                                                            callback({ids:selectRows,id:dataContext[0].gid})
                                                        }else{
                                                            callback({ids:selectRows})
                                                        }
                                                        pubsub.publish('workOrderMerge.onCancel')
                                                 }

                                                 if(!result){
                                                    pubsub.publish('workOrderMergeModal-modal-1.openModal')
                                                 }else{
                                                        sucCall()
                                                 }

                                                 pubsub.subscribe('workOrderMergeModal-modal-1.onOk',function(){
                                                       sucCall()
                                                 })

                                                 pubsub.subscribe('workOrderMergeModal-modal-1.onCancel',function(){
                                                        pubsub.publish('workOrderMerge.onCancel')
                                                 })
                                                 pubsub.subscribe('workOrderMergeModal-modal-1.onOk',function(){
                                                        pubsub.publish('workOrderMerge.onCancel')
                                                 })

                                            })

                                          `,

                                      },


                                      successPubs: [
                                          {
                                              event: "@@message.success",
                                              payload:'合批成功!'
                                          },
                                          {
                                              event: "workOrderMerge.onCancel",
                                          },
                                          {
                                              event: "zxcvbnmasdfgh.loadData",
                                          }
                                      ],
                                      errorPubs:[
                                          {
                                              event: "@@message.error",
                                              eventPayloadExpression:`
                                                  callback(eventPayload)
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

          <ModalContainer config={{
              visible: false, // 是否可见，必填*
              enabled: true, // 是否启用，必填*
              id: "workOrderMergeModal-modal-1", // id，必填*
              pageId: "workOrderMergeModal-modal-1", // 指定是哪个page调用modal，必填*
              type: "confirm", // 默认modal模式，即modal容器，也可选 info success error warning confirm
              title: "工单合批", // title，不传则不显示title
              content: (
                  <div>
                      <p>工单基本信息存在不一致，是否强制合批?</p>
                  </div>
              ), // 非modal模式使用
              closable: true, // 是否显示右上角关闭按钮，默认不显示
              width: "60%", // 宽度，默认520px
              okText: "确定", // ok按钮文字，默认 确定
              cancelText: "取消", // cancel按钮文字，默认 取消
              style: {top: 120}, // style样式
              wrapClassName: "wcd-center", // class样式
              hasFooter: true, // 是否有footer，默认 true
              maskClosable: true, // 点击蒙层是否允许关闭，默认 true
          }}
          >
              <Row>
                  <Col span={6} offset={20}>
                      {/*取消按钮*/}
                      <AppButton config={{
                          id: "workOrderMergeModal-btn-5",
                          title: "取消",
                          type:"default",
                          size:"large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "workOrderMergeModal-btn-5.click",
                                  pubs:[{
                                      event: "workOrderMergeModal-modal-1.onCancel",
                                  }]
                              }
                          ]
                      }} />
                  </Col>
              </Row>

          </ModalContainer>

      </form>
    );
  }
}

WorkOrderMergeModal.propTypes = {

};

export default  reduxForm({
    form: "WorkOrderMergeModal",
})(WorkOrderMergeModal);

