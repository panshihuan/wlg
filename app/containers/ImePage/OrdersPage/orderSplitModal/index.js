import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField'
import TextField from 'components/Form/TextField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import Immutable from 'immutable'
import NavTreeField from 'components/NavTree'
import uuid from 'uuid/v4'
import TreeField from 'components/Form/TreeField'
import OrderSplitModalCss from 'components/Styled/OrderSplitModal'
import {Row, Col,Button} from 'antd'
import CoreComponent from 'components/CoreComponent'

const validate = values => {
    let errors = {}
    const reg = new RegExp("^[0-9]*$")

    if(!reg.test(values.get('batchNum'))){
        errors.batchNum="请输入有效数字"
    }

    if(!reg.test(values.get('batchQty'))){
        errors.batchQty="请输入有效数字"
    }
    return errors;
};

export class OrderSplitModal extends CoreComponent {

  constructor(props) {
    super(props);
        this.state={
            index:[],
            dataSource:[],
            parms:undefined,
            newDataSource:undefined
        }

      pubsub.subscribe(`navTree-1.mergeData`,(eventName,payLoad)=>{
          // Object.keys(payLoad)
          if(Object.keys(payLoad)[0]=='dataSource'){
                this.setState({
                    dataSource:payLoad["dataSource"]
                })
          }else if(Object.keys(payLoad)[0]=='index'){
              if(payLoad["index"]=='all'){
                  this.setState({
                      index:['all']
                  })
              }else{
                  this.setState({
                      index:payLoad["index"]
                  })
              }

          }
      })


  }

  componentWillMount() {
  }
  componentDidMount() {


  }
  componentWillUnmount() {
      super.componentWillUnmount()
      this.unSubscribeFetchData()
  }

    unSubscribeFetchData = () => {
        pubsub.unsubscribe(`btnSubmit.click`)
        pubsub.unsubscribe(`btnPreview.click`)
        pubsub.unsubscribe(`navTree-1.mergeData`)
        pubsub.unsubscribe(`navTree-1.dataContext`)
        pubsub.unsubscribe(`orderSplitModal-a-1.onChange`)
        pubsub.unsubscribe(`orderSplitModal-a-2.onChange`)
        pubsub.unsubscribe(`navTree-1.didMount`)
    }

  componentWillReceiveProps(nextProps) {
  }
  render() {
    return (
    <OrderSplitModalCss className="orderSplitModal">

      <form>
          <Row>
              <Col span="11">
                  <Field config={{
                      id: "orderSplitModal-a-1",
                      enabled: true,  //是否启用
                      visible: true,  //是否可见
                      label: "子订单数:",  //标签名称
                      size:'large',  //尺寸大小:large、small
                      wrapperSpan: 12,  //输入框栅格比例（0-24）
                      showRequiredStar: true,  //是否显示必填星号
                  }} name="batchNum" component={TextField}/>
              </Col>
              <Col span="11">
                  <Field config={{
                      id: "orderSplitModal-a-2",
                      enabled: true,  //是否启用
                      visible: true,  //是否可见
                      label: "子订单本批数量:",  //标签名称
                      size:'large',  //尺寸大小:large、small
                      wrapperSpan: 12,  //输入框栅格比例（0-24）
                      showRequiredStar: true,  //是否显示必填星号
                  }} name="batchQty" component={TextField}/>
              </Col>
          </Row>

          <Row>
              <Col span="5">
                  <Field config={{
                      id:'navTree-1',
                      title:'分批订单',
                      subscribes:[
                          {
                              event:'navTree-1.didMount',
                              behaviors:[
                                  {
                                      type:'fetch',
                                      id:'1234567890',
                                      data:'selectedRows',
                                      successPubs:[
                                          {
                                              event:'navTree-1.setData',
                                          },
                                          {
                                             event:'orderSplitModal-table-1.dataContext'
                                          }
                                      ]
                                  }
                              ]
                          }

                      ],

                  }} name="NavTree" component={NavTreeField}/>
              </Col>
              <Col span="19">
                  <AppTable name="orderSplitModal-table-1" config={{
                      "id":"orderSplitModal-table-1",
                      "name":"orderSplitModal-table-1",
                      "type":"checkbox",//表格单选复选类型
                      "size":"default",//表格尺寸
                      "rowKey": "newGid",//主键
                      "onLoadData":false,//初始化是否加载数据
                      "showSerial":true,
                      "editType":true,
                      "isSearch":false,
                      "columns":[
                          { title: '父订单编号', width: 100, dataIndex: 'code', key: '1' },
                          { title: '订单编号', width: 100, dataIndex: '', key: '2' },
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
                              event:'navTree-1.mergeData',
                              pubs:[
                                  {
                                      event:'1234567890.expression',
                                      meta: {
                                          expression: `
                                            pubsub.publish('1234567890.dataContext',me.ext)
                                          `
                                      }
                                  },
                                  {
                                      event:'orderSplitModal-table-1.expression',
                                      meta:{
                                          expression:`
                                          pubsub.subscribe('orderSplitModal-table-1.dataContext',function(ename,pay){
                                            me.dataSource=pay.eventPayload
                                          })
                                          pubsub.subscribe('1234567890.dataContext',function(ename,pay){
                                            me.ext=pay
                                          })


                                          luoji()

                                          pubsub.subscribe('orderSplitModal-a-1.onChange',function(ename,payload){
                                            me.batchNum=payload
                                                luoji()
                                          })
                                          pubsub.subscribe('orderSplitModal-a-2.onChange',function(ename,payload){
                                            me.batchQty=payload
                                            luoji()
                                          })

                                          function luoji(){
                                              let arr=[];
                                              me.ids=[];
                                              if(Object.keys(data.eventPayload)[0]=='dataSource'){
                                                arr=me.dataSource
                                                  _.map(me.dataSource,function(item,index){
                                                      me.ids.push(item.gid)
                                                  })
                                              }else if(Object.keys(data.eventPayload)[0]=='index'){
                                              console.log('index:::',data.eventPayload["index"])
                                                  if(data.eventPayload["index"]=='all'){
                                                          index=['all']
                                                          arr=me.dataSource
                                                          _.map(arr,function(item,index){
                                                              me.ids.push(item.gid)
                                                          })
                                                  }else{
                                                    if(data.eventPayload["index"].length){
                                                          let result=me.dataSource[data.eventPayload.index]
                                                          arr.push(result)
                                                          index=data.eventPayload["index"]
                                                          me.ids.push(arr[0].gid)
                                                    }else{
                                                        _.map(arr,function(item,index){
                                                              me.ids.push(item.gid)
                                                          })
                                                    }

                                                  }

                                              }

                                              if(me.batchNum){
                                                   let arr3=[];
                                                   for(let j=0;j<arr.length;j++){
                                                        let arr2=[];
                                                          for(let i=0;i<me.batchNum;i++){
                                                              arr2.push(_.cloneDeep(arr[j]))
                                                          }
                                                          arr3=_.cloneDeep(arr3.concat(arr2))
                                                   }

                                                   arr=_.cloneDeep(arr3);
                                              }

                                                if(me.batchQty){
                                                      for(let j=0;j<arr.length;j++){
                                                          arr[j]["actualQty"]=me.batchQty;
                                                      }
                                                }

                                                for(let i=0;i<arr.length;i++){
                                                    arr[i]['newGid']="xxxx"+i
                                                }

                                                 let actualQtyArr=[];

                                              _.map(me.dataSource,function(item,index){
                                                  if(item.actualQty){
                                                      actualQtyArr.push(Number(item.actualQty))
                                                  }
                                              })

                                              let minActualQty=Math.min.apply(null,actualQtyArr)

                                              if(me.batchNum&&me.batchQty){
                                                  me.batchNum=me.batchNum||1
                                                  me.batchQty=me.batchQty||1
                                                  if(!((Number(me.batchNum)*Number(me.batchQty))<minActualQty)){
                                                        if(!me.temporaryState){
                                                            pubsub.publish("@@message.error",'子订单本批数量*子订单数 < 父订单批量数')
                                                            me.temporaryState=true
                                                        }
                                                        setTimeout(function(){
                                                            me.temporaryState=false
                                                        },500)

                                                        pubsub.publish('unBtnSubmit.click',{})

                                                      return;
                                                  }
                                              }else{
                                                   // pubsub.publish("@@message.error",'请输入订单数和批数再预览!')
                                                   return;
                                              }


                                                  //传递给"确定"按钮的信息
                                                  pubsub.publish("orderSplitModal-btn-2.dataContext",{
                                                      eventPayload:{
                                                          ids:me.ids,
                                                          batchNum:me.batchNum||'',
                                                          batchQty:me.batchQty||''
                                                      }
                                                  });

                                                let obj={
                                                    eventPayload:arr,
                                                    ext:me.ext
                                                }

                                                pubsub.publish('orderSplitModal-table-1.setData',obj)
                                                pubsub.publish('btnSubmit.click')

                                          }


                                          `
                                      }
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
                  {/*<Button loading={this.props.submitting} size="large" onClick={this.props.handleSubmit((values) => {*/}
                      {/*let batchNum=values.get('batchNum');*/}
                      {/*let batchQty=values.get('batchQty');*/}
                      {/*let dataSource=this.state.dataSource;*/}
                      {/*let index=this.state.index;*/}
                      {/*let ids=[];*/}
                      {/*let newDataSource=[];*/}

                      {/*//处理树*/}
                      {/*if(index[0]=='all'){*/}
                          {/*dataSource=this.state.dataSource;*/}
                          {/*_.map(dataSource,(item,index)=>{*/}
                              {/*ids.push(item.gid)*/}
                          {/*})*/}
                      {/*}else{*/}
                          {/*if(index.length){*/}
                              {/*let arr=[];*/}
                              {/*arr.push(dataSource[index[0]]);*/}
                              {/*dataSource=arr;*/}
                              {/*ids.push(dataSource[0].gid)*/}
                          {/*}else{*/}
                              {/*_.map(dataSource,(item,index)=>{*/}
                                  {/*ids.push(item.gid)*/}
                              {/*})*/}
                          {/*}*/}
                      {/*}*/}


                      {/*//处理inputNumber（batchNum）*/}
                      {/*if(batchNum){*/}
                          {/*_.map(dataSource,(item,i)=>{*/}
                              {/*let arr=[];*/}
                              {/*for(var i=0;i<batchNum;i++){*/}
                                  {/*arr.push(_.cloneDeep(item))*/}
                              {/*}*/}
                              {/*newDataSource=_.cloneDeep(newDataSource.concat(arr))*/}
                          {/*})*/}
                      {/*}*/}

                      {/*//处理inputNumber（batchQty）*/}
                      {/*if(batchQty){*/}
                          {/*let arr=newDataSource.length?newDataSource:dataSource;*/}
                          {/*_.map(arr,(item,i)=>{*/}
                              {/*item["actualQty"]=batchQty;*/}
                          {/*})*/}

                          {/*newDataSource=arr;*/}

                      {/*}*/}

                      {/*newDataSource=newDataSource.length?newDataSource:dataSource;*/}

                      {/*//配合AppTable 处理组件key*/}
                      {/*newDataSource.map((item,index)=>{*/}

                          {/*item['newGid']="xxx"+index*/}
                      {/*})*/}

                      {/*let actualQtyArr=[];*/}

                      {/*_.map(dataSource,(item,index)=>{*/}
                          {/*if(item.actualQty){*/}
                              {/*actualQtyArr.push(Number(item.actualQty))*/}
                          {/*}*/}
                      {/*})*/}

                      {/*let minActualQty=Math.min.apply(null,actualQtyArr)*/}

                      {/*if(batchNum||batchQty){*/}
                          {/*if(!((Number(batchNum)*Number(batchQty))<minActualQty)){*/}
                              {/*pubsub.publish(`@@message.error`,'批量数*子订单数 < 父订单批量数')*/}
                              {/*return;*/}
                          {/*}*/}
                      {/*}*/}

                      {/*//传递给"确定"按钮的信息*/}
                      {/*pubsub.publish("orderSplitModal-btn-2.dataContext",{*/}
                          {/*eventPayload:{*/}
                              {/*ids:ids,*/}
                              {/*batchNum:batchNum||'',*/}
                              {/*batchQty:batchQty||''*/}
                          {/*}*/}
                      {/*});*/}

                      {/*this.setState({*/}
                          {/*newDataSource:{*/}
                                  {/*ids:ids,*/}
                                  {/*batchNum:batchNum||'',*/}
                                  {/*batchQty:batchQty||''*/}
                          {/*},*/}

                      {/*},()=>{*/}
                            {/*console.log('回调：：：',this.state.dataSource,this.state.newDataSource)*/}
                      {/*})*/}

                      {/*pubsub.publish(`btnSubmit.click`,newDataSource)*/}
                      {/*pubsub.publish(`btnPreview.click`,{})*/}

                  {/*})}>预览</Button>*/}

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
                                  event: "pageIdxxx0000.onCancel",
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
                              event:"unBtnSubmit.click",
                              pubs: [
                                  {
                                      event: "orderSplitModal-btn-2.enabled",
                                      payload:false
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
                                          url:'/ime/imePlanOrder/planOrderSplite.action',
                                          mode:"dataContext"
                                      },
                                      successPubs: [
                                          {
                                              event: "@@message.success",
                                              payload:'分批成功!'
                                          },
                                          {
                                              event: "pageIdxxx0000.onCancel",
                                          },
                                          {
                                              event: "1234567890.loadData",
                                          }

                                      ],
                                      errorPubs:[
                                          {
                                              event:'@@message.error',
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

      </form>
    </OrderSplitModalCss>

    );
  }
}



OrderSplitModal.propTypes = {

};


export default  reduxForm({
    form: "orderSplitModal",
    validate
})(OrderSplitModal);

