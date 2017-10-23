import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer'
import InputNumberField from 'components/Form/InputNumberField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import {Row, Col} from 'antd'

export class orderMergeModal extends React.PureComponent {
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
        pubsub.unsubscribe(`table1234567890.dataContext`)
        pubsub.unsubscribe(`orderMergeTable-table-11.onTableTodoAny`)
        pubsub.unsubscribe(`orderMergeTable-btn-3.click`)
        pubsub.unsubscribe(`orderMergeTable-btn-5.click`)
        pubsub.unsubscribe(`orderMergeModal-modal-1.onOk`)
        pubsub.unsubscribe(`orderMergeModal-modal-1.onCancel`)

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
                      "editType":true,
                      "isSearch":false,
                      "columns":[
                          { title: '订单编号', width: 100, dataIndex: 'code', key: '2' },
                          { title: '产品编号', dataIndex: 'productGidRef.materialGidRef.code', key: '3', width: 150 },
                          { title: '产品名称', dataIndex: 'productGidRef.materialGidRef.name', key: '4', width: 150 },
                          { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '5', width: 150 },
                          { title: '计划数量', dataIndex: 'planQty', key: '6', width: 150 },
                          { title: '本批数量', dataIndex: 'actualQty', key: '7', width: 150 },
                          { title: '计划开始日期', dataIndex: 'planBeginTime', key: '8', width: 150 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                          { title: '交付日期', dataIndex: 'deliverTime', key: '9', width: 150 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                          { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '10' ,width: 150},
                          { title: '订单顺序', dataIndex: 'orderSeq', key: '11' ,width: 150},
                          { title: '工艺路线', dataIndex: 'productGidRef.routePathRef.name', key: '12' ,width: 150},
                          { title: '订单类型', dataIndex: 'planOrderTypeGid', key: '13' ,width: 150},
                          { title: '订单状态', dataIndex: 'orderStatusGid', key: '14' ,width: 150},
                          { title: '订单BOM状态', dataIndex: 'bomStatusGid', key: '15' ,width: 150},
                          { title: '订单进程', dataIndex: 'processStatus', key: '16' ,width: 150},
                      ],
                      subscribes:[
                          {
                              event:'orderMergeTable-table-11.onTableTodoAny',
                              behaviors:[
                                  {
                                      type:'fetch',
                                      id:'1234567890',
                                      data:'selectedRows',
                                      successPubs:[
                                          {
                                              event:'orderMergeTable-table-11.setData',
                                          }

                                      ]
                                  }
                              ]
                          },


                      ]

                  }}/>
              </Col>
          </Row>

          <br/>

          <Row>
              <Col span={6} offset={18}>
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
                                  event: "pageIdxxx2.onCancel",
                              }]
                          }
                      ]
                  }} />

                  {/*确定按钮*/}
                  <AppButton config={{
                      id: "orderMergeModal-btn-2",
                      pageId:'orderMergeModal-btn-2',
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
                                         event:'orderMergeModal-btn-2.dataContext',
                                     }
                                 ]
                          },
                          {
                              event: "orderMergeModal-btn-2.click",
                              behaviors: [
                                  {
                                      type:'fetch',
                                      id:'1234567890',
                                      data:'selectedRows',
                                      successPubs:[
                                          {
                                              event:'table1234567890.dataContext',
                                              // mode:'mode'
                                          }
                                      ]
                                  },
                                  {
                                      type: "request",
                                      dataSource:{
                                          type:'api',
                                          method:'post',
                                          url:'/ime/imePlanOrder/planOrderBlending.action',
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

                                            pubsub.subscribe('table1234567890.dataContext',function(ename,payload){

                                                 let arr=payload.eventPayload;
                                                 //需要比对的属性(业务)
                                                 let arrAttr=['planOrderTypeGid','orderStatusGid','bomStatusGid','deliverTime']

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
                                                        pubsub.publish('pageIdxxx2.onCancel')
                                                 }

                                                 if(!result){
                                                    pubsub.publish('orderMergeModal-modal-1.openModal')
                                                 }else{
                                                    sucCall()
                                                 }

                                                 pubsub.subscribe('orderMergeModal-modal-1.onOk',function(){
                                                        sucCall()
                                                 })

                                                 pubsub.subscribe('orderMergeModal-modal-1.onCancel',function(){
                                                        pubsub.publish('pageIdxxx2.onCancel')
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
                                              event: "pageIdxxx2.onCancel",
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
                                              event: "pageIdxxx2.onCancel",
                                          },
                                          {
                                              event: "1234567890.loadData",
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
              id: "orderMergeModal-modal-1", // id，必填*
              pageId: "orderMergeModal-modal-1", // 指定是哪个page调用modal，必填*
              type: "confirm", // 默认modal模式，即modal容器，也可选 info success error warning confirm
              title: "订单合批", // title，不传则不显示title
              content: (
                  <div>
                      <p>订单基本信息存在不一致，是否强制合批?</p>
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
          </ModalContainer>

      </form>
    );
  }
}

orderMergeModal.propTypes = {

};

export default  reduxForm({
    form: "orderMergeModal",
})(orderMergeModal);

