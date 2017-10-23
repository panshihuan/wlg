import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField';
import TextField from 'components/Form/TextField';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import NavTreeField from 'components/NavTree'
import uuid from 'uuid/v4'
import TreeField from 'components/Form/TreeField'
import OrderSplitModalCss from 'components/Styled/OrderSplitModal'
import {Row, Col,Button} from 'antd'


const validate = values => {
    let  errors = {}
    const reg = new RegExp("^[0-9]*$")
    if (!values.get('batchQty')) {
      errors.batchQty = '必填项!'
    }

    if(!reg.test(values.get('batchQty'))){
        errors.batchQty="请输入有效数字"
    }
    return errors
  }


export class WorkOrderSplitModal extends React.PureComponent {

  constructor(props) {
    super(props);

        this.state={
            index:[],
            dataSource:[],
            parms:undefined
        }

      pubsub.subscribe(`navTree-1.mergeData`,(eventName,payLoad)=>{
          // Object.keys(payLoad)
          if(Object.keys(payLoad)[0]=='dataSource'){
                this.setState({
                    dataSource:payLoad["dataSource"]
                })
          }else if(Object.keys(payLoad)[0]=='index'){
              this.setState({
                  index:payLoad["index"]
              })
          }
      })


      pubsub.subscribe(`orderSplitModal-btn-2.dataContext`,(eventName,payLoad)=>{
          // Object.keys(payLoad)

      })


  }

  componentWillMount() {
  }
  componentDidMount() {


  }
  componentWillUnmount() {
    pubsub.unsubscribe("navTree-1.mergeData");
    pubsub.unsubscribe("orderSplitModal-btn-2.dataContext");
  }
  componentWillReceiveProps(nextProps) {
  }
  render() {
    return (
      <form>
          <Row>
              <Col span={11} push={2}>
                  <Field config={{
                      id: "orderSplitModal-a-1",
                      enabled: true,  //是否启用
                      visible: true,  //是否可见
                      label: "将每个子工单本批数量设置为:",  //标签名称
                      size:'large',  //尺寸大小:large、small
                      min:1,        //最小、大值
                      max:undefined,
                      showRequiredStar: true,
                      //formatter:'rmb',   //百分比%：percent；货币￥：rmb（ 格式化数字，以展示具有具体含义的数据）
                      step:undefined,   //小数位数: 0.01保留2位有效数值
                      //labelSpan: 4,   //标签栅格比例（0-24）
                      wrapperSpan: 12,  //输入框栅格比例（0-24）
                      hasFeedback: false,  //验证失败时是否显示feedback图案
                  }} name="batchQty" component={TextField}/>
              </Col>
          </Row>

          <Row>
              <Col span={3}>
                  <Field config={{
                      id:'navTree-1',
                      title:'分批工单',
                      subscribes:[
                          {
                              event:'navTree-1.didMount',
                              behaviors:[
                                  {
                                      type:'fetch',
                                      id:'zxcvbnmasdfgh',
                                      data:'selectedRows',
                                      successPubs:[
                                          {
                                              event:'navTree-1.setData',
                                          }
                                      ]
                                  }
                              ]
                          }

                      ],

                  }} name="NavTree" component={NavTreeField}/>
              </Col>
              <Col span={21}>
                  <AppTable name="orderSplitModal-table-1" config={{
                      "id":"orderSplitModal-table-1",
                      "name":"orderSplitModal-table-1",
                      "type":"checkbox",//表格单选复选类型
                      "size":"default",//表格尺寸
                      "tableTitle": "工单拆分信息",//表头信息
                      "rowKey": "gid",//主键
                      "onLoadData":false,//初始化是否加载数据
                      "showSerial":true,
                      "width":1800,
                      "editType":false,
                      "isSearch":false,
                      "isPager":false,
                      "columns":[
                        { title: '来源订单', width: 100, dataIndex: 'planOrderGidRef.code', key: '1' },
                        { title: '父工单编号', width: 100, dataIndex: 'code', key: '2' },
                        { title: '工单编号', width: 100, dataIndex: '', key: '3' },
                        { title: '产品编号', width: 100, dataIndex: 'productGidRef.materialGidRef.code', key: '4' },
                        { title: '产品名称', dataIndex: 'productGidRef.materialGidRef.name', key: '5', width: 100 },
                        { title: '数量单位', dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '6', width: 100 },
                        { title: '计划数量', dataIndex: 'planQty', key: '7', width: 100 },
                        { title: '本批数量', dataIndex: 'actualQty', key: '8', width: 100 },
                        { title: '计划开始日期', dataIndex: 'workOrderBeginTime', key: '9', width: 100 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                        { title: '交付日期', dataIndex: 'deliverTime', key: '10', width: 100 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                        { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '11', width: 100 },
                        { title: '产线', dataIndex: 'productionLineGidRef.lineName', key: '12', width: 100 },
                        { title: '工单顺序', dataIndex: 'workOrderSeq', key: '13', width: 100 },
                        { title: '工艺路线', dataIndex: 'routeGidRef.name', key: '14', width: 100 },
                        { title: '工单类型', dataIndex: 'workOrderTypeGid', key: '15', width: 100 },
                        { title: '工单状态', dataIndex: 'workOrderStatusGid', key: '16', width: 100 },
                        { title: '工单BOM状态', dataIndex: 'workOrderBomStatusGid', key: '17', width: 100 }
                      ],
                      subscribes:[
                          {
                              event:'btnSubmit.click',
                              pubs:[
                                  {
                                      event:'orderSplitModal-table-1.setData',
                                      eventPayloadExpression:`
                                      resolveFetch({fetch:{id:"zxcvbnmasdfgh",data:"ext"}}).then(function (ext) {
                                        callback({eventPayload:eventPayload,ext:ext})
                                      })
                                    `
                                  }
                              ]
                          },
                          {
                              event:'navTree-1.mergeData',
                              pubs:[
                                {
                                    event:'orderSplitModal-table-1.setData',
                                    eventPayloadExpression:`
                                    resolveFetch({fetch:{id:"zxcvbnmasdfgh",data:"ext"}}).then(function (ext) 
                                    {
                                      //callback({eventPayload:eventPayload,ext:ext})
                                        resolveFetch({fetch:{id:"orderSplitModal-table-1",data:"dataContext"}}).then(function (dataContext) 
                                        {
                                            if(dataContext != undefined&&dataContext["data"]!= undefined)
                                            {
                                                if(eventPayload["index"].length>0){
                                                    let workordercode = dataContext["yunshuju"][eventPayload["index"]["0"]]["code"]
                                                    let showData =[];
                                                    for(let i = 0;i<dataContext["data"].length;i++)
                                                    {
                                                        let item =dataContext["data"][i]
                                                        if(item["code"].indexOf(workordercode)!=-1)
                                                        {
                                                            showData.push(item);
                                                        }
                                                    }
                                                    callback({eventPayload:showData,ext:ext})
                                                }else{
                                                    callback({eventPayload:dataContext["data"],ext:ext})
                                                }
                                            }else{
                                                callback({eventPayload:[],ext:ext})
                                            }
                                        })
                                    })
                                    
                                  `
                                }
                            ]
                          }
                      ],

                  }}/>
              </Col>
          </Row>

          <br/>
          {/*预览按钮*/}
          <Row>
              <Col span={6} offset={18}>
                  <Button loading={this.props.submitting} size="large" onClick={this.props.handleSubmit((values) => {
                      let batchQty=values.get('batchQty');
                      let dataSource=_.cloneDeep(this.state.dataSource);
                      let index=this.state.index;
                      let ids=[];
                      let newDataSource=[];
                      if(dataSource.length == 0){
                        pubsub.publish(`@@message.error`,"请选择需要分批的工单")
                        return;
                      }
                      //处理树
                      /*if(index.length){
                          let arr=[];
                          arr.push(dataSource[index[0]]);
                          dataSource=arr;
                          ids.push(dataSource[0].gid)
                      }else{*/
                          _.map(dataSource,(item,index)=>{
                              ids.push(item.gid)
                          })
                      //}
                      //增加验证填写的数量是否合格
                      for(let i =0 ;i<dataSource.length;i++){
                        if(Number(dataSource[i]["actualQty"])<Number(batchQty)){
                            pubsub.publish(`@@message.error`,`子工单${dataSource[i].code}分批数量不能大于父工单的本批数量`)
                            return;
                          }
                      }
                      //循环生成批次
                      for(let z =0 ;z<dataSource.length;z++){
                          //let itemData =[];//拆分后的数组
                        if(Number(dataSource[z]["actualQty"])%Number(batchQty) ==0){
                            let batchItem = parseInt(Number(dataSource[z]["actualQty"])/Number(batchQty));
                            for(let j =0;j<batchItem;j++){
                                let item = _.cloneDeep(dataSource[z]);
                                item["code"] = `${dataSource[z]["code"]}`
                                item["actualQty"] = Number(batchQty);
                                newDataSource.push(item);
                            }
                        }else{
                            let batchItem = parseInt(Number(dataSource[z]["actualQty"])/Number(batchQty));
                            for(let k =0;k<batchItem+1;k++){
                                let itemk = _.cloneDeep(dataSource[z]);
                                itemk["code"] = `${dataSource[z]["code"]}`
                                if(k==batchItem){
                                    itemk["actualQty"]= Number(dataSource[z]["actualQty"])%Number(batchQty)
                                }else{
                                    itemk["actualQty"] = Number(batchQty);
                                }
                                
                                newDataSource.push(itemk);
                            }
                        }
                        //newDataSource.concat(itemData);
                      }
                      for(let ki=0;ki<newDataSource.length;ki++){
                        newDataSource[ki]["gid"] = `zxcvbnmasdfg${ki}`
                      }

                      //传递给"确定"按钮的信息
                      pubsub.publish("orderSplitModal-btn-2.dataContext",{
                          eventPayload:{
                              ids:ids,
                              actualQty:batchQty||1
                          }
                      });
                      pubsub.publish("orderSplitModal-table-1.dataContext",{
                        eventPayload:{
                            data:newDataSource,
                            yunshuju:dataSource
                        }
                    });
                      pubsub.publish(`btnSubmit.click`,newDataSource)
                      pubsub.publish(`btnPreview.click`,{})

                  })}>预览</Button>

                  <AppButton config={{
                      id: "orderSplitModal-btn-3",
                      title: "取消",
                      type:"default",
                      size:"large",
                      visible: true,
                      enabled: true,
                      subscribes: [
                          {
                              event: "orderSplitModal-btn-3.click",
                              pubs:[{
                                  event: "workOrderSplit.onCancel",
                              }]
                          }
                      ]
                  }} />

                  {/*确定按钮*/}
                  <AppButton config={{
                      id: "orderSplitModal-btn-2",
                      title: "确定",
                      type:"primary",
                      size:"large",
                      visible: true,
                      enabled: false,
                      subscribes: [
                          {
                              event:"btnSubmit.click",
                              pubs: [
                                  {
                                      event: "orderSplitModal-btn-2.enabled",
                                      payload:true
                                  }
                              ]
                          },
                          {
                              event: "orderSplitModal-btn-2.click",
                              behaviors: [
                                  {
                                      type: "request",
                                      dataSource:{
                                          type:'api',
                                          method:'post',
                                          url:'/ime/imeWorkOrder/workOrderSplite.action',
                                          mode:"dataContext"
                                      },
                                      successPubs: [
                                          {
                                              event: "@@message.success",
                                              payload:'分批成功!'
                                          },
                                          {
                                              event: "workOrderSplit.onCancel",
                                          },
                                          {
                                              event: "zxcvbnmasdfgh.loadData",
                                          }

                                      ],
                                      errorPubs: [
                                          {
                                              event: "@@message.error",
                                              payload:'分批失败!'
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



WorkOrderSplitModal.propTypes = {

};


export default  reduxForm({
    form: "WorkOrderSplitModal",
    validate
})(WorkOrderSplitModal);

