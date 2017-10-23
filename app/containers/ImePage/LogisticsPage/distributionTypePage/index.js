import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable';
import pubsub from 'pubsub-js'

import {Breadcrumb, Card, Row, Col,Layout,Tabs} from 'antd';
const TabPane = Tabs.TabPane;
const { Header, Footer, Sider, Content } = Layout;
import { resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import DistributionTypePageCss from './styles'
import NavTreeField from 'components/NavTree'
import NavTreeField2 from 'components/NavTree2'

import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton';
import TableField from 'components/Form/TableField';
import TextField from 'components/Form/TextField'
import ModalContainer from 'components/ModalContainer'
import FindbackField from 'components/Form/FindbackField'

const validate = values => {
    let errors = {}
    if(!values.get('deliveryCode')){
        errors.deliveryCode="必填项"
    }else{

    }

    return errors;
};

export class DistributionTypePage extends React.PureComponent {
    constructor(props) {
        super(props);
        // pubsub.subscribe(`query.refresh`,()=>{
        //     this.requestQuery()
        // })
        // pubsub.subscribe('distributionTypePage-btn-5.click',()=>{
        //     window.location.reload()
        // })
        // pubsub.subscribe('sssss.asd',()=>{
        //     window.location.reload()
        // })
    }

    componentDidMount() {
        this.requestQuery()
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        this.unSubscribe1();
        this.unSubscribe2();
        this.unSubscribe3();
        this.unSubscribe4();
        this.unSubscribe5();
        this.unSubscribe6();
        this.unSubscribe7();
        this.unSubscribe8();
        this.unSubscribe9();
        this.unSubscribe10();
        this.unSubscribe11();
    }

    unSubscribe1(){pubsub.unsubscribe(`distributionTypePage-btn-1.click`)}
    unSubscribe2(){pubsub.unsubscribe(`distributionTypePage-btn-2.click`)}
    unSubscribe3(){pubsub.unsubscribe(`distributionTypePage-btn-3.click`)}
    unSubscribe4(){pubsub.unsubscribe(`distributionTypePage-btn-4.click`)}
    unSubscribe5(){pubsub.unsubscribe(`distributionTypePage-btn-5.click`)}
    unSubscribe6(){pubsub.unsubscribe(`distributionTypePage-btn-4-2.click`)}

    unSubscribe7(){pubsub.unsubscribe(`DistributionType-tableField-1.onSelectedRowsClear`)}
    unSubscribe8(){pubsub.unsubscribe(`DistributionType-tableField-1.onSelect`)}
    unSubscribe9(){pubsub.unsubscribe(`DistributionType-tableField-1.onSelectedRows`)}
    unSubscribe10(){pubsub.unsubscribe(`distributionTypePage-btn-4.expression`)}
    unSubscribe11= () => {pubsub.unsubscribe(`distributionTypePage-btn-4-2.expression`)}


    //query接口
    requestQuery(){
        let dataSource = {
            mode: "dataContext",
            type: "api",
            method: "POST",
            url: "/ime/mdMrlDeliveryScheme/query.action",
        };
        resolveDataSource({
            dataSource,
        }).then(data=>{
            pubsub.publish("@@form.init", { id: "distributionTypeForm", data: Immutable.fromJS({aaa:data.data}) })
            // pubsub.publish('DistributionType-tableField-1.dataContext',data.data)
        })
    }

  render() {
    return (
      <DistributionTypePageCss style={{height:'100%',overflowX:'auto',background:'#ECECEC',padding:'15px'}}>
        <div className="distributionType" style={{height:'100%'}}>
          <Breadcrumb className="breadcrumb" style={{marginTop:'0px',paddingTop:'12px'}}>
          <Breadcrumb.Item>业务建模</Breadcrumb.Item>
          <Breadcrumb.Item>物流</Breadcrumb.Item>
          <Breadcrumb.Item>配送类型</Breadcrumb.Item>
        </Breadcrumb>

         {/*第一排按钮*/}
          <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px",paddingRight:'15px'}}
                bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px"}}>
                      <div>
                          <AppButton config={{
                              id: "distributionTypePage-btn-1",
                              title: "创建",
                              type:"primary",
                              size:"large",
                              visible: true,
                              enabled: true,
                              subscribes: [
                                  {
                                      event: "distributionTypePage-btn-1.click",
                                      pubs:[
                                          {
                                              event:'distributionTypePage-btn-1.visible',
                                              payload:false
                                          },
                                          {
                                              event:'distributionTypePage-btn-2.visible',
                                              payload:false
                                          },
                                          {
                                              event:'distributionTypePage-btn-3.visible',
                                              payload:false
                                          },
                                          {
                                              event:'DistributionType-tableField-1.addRow',
                                          },

                                      ],

                                  }
                              ]
                          }} />
                          <AppButton config={{
                              id: "distributionTypePage-btn-2",
                              title: "修改",
                              type:"primary",
                              size:"large",
                              visible: true,
                              enabled: false,
                              subscribes: [
                                  {
                                      event:"DistributionType-tableField-1.onSelectedRows",
                                      pubs: [
                                          {
                                              event:"distributionTypePage-btn-2.dataContext"
                                          },
                                          {
                                              event: "distributionTypePage-btn-2.enabled",
                                              payload:true
                                          }
                                      ]
                                  },
                                  {
                                      event:"DistributionType-tableField-1.onSelectedRowsClear",
                                      pubs: [
                                          {
                                              event: "distributionTypePage-btn-2.enabled",
                                              payload:false
                                          }
                                      ]
                                  },
                                  {
                                      event: "distributionTypePage-btn-2.click",
                                      behaviors:[
                                          {
                                              type:"fetch",
                                              id:'distributionTypePage-btn-2',
                                              data:"dataContext",
                                              successPubs:[
                                                  {
                                                      event:'DistributionType-tableField-1.activateRow'
                                                  },
                                                  {
                                                      event:'distributionTypePage-btn-1.visible',
                                                      payload:false
                                                  },
                                                  {
                                                      event:'distributionTypePage-btn-2.visible',
                                                      payload:false
                                                  },
                                                  {
                                                      event:'distributionTypePage-btn-3.visible',
                                                      payload:false
                                                  }
                                              ]
                                          }
                                      ]

                                  },
                              ]
                          }} />
                          <AppButton config={{
                              id: "distributionTypePage-btn-3",
                              title: "删除",
                              type:"primary",
                              size:"large",
                              visible: true,
                              enabled: false,
                              subscribes: [
                                  {
                                      event:"DistributionType-tableField-1.onSelectedRows",
                                      pubs: [
                                          {
                                              event: "distributionTypePage-btn-3.enabled",
                                              payload:true
                                          },
                                          {
                                              event:'distributionTypePage-btn-3.dataContext'
                                          },

                                      ]
                                  },
                                  {
                                      event:"DistributionType-tableField-1.onSelectedRowsClear",
                                      pubs: [
                                          {
                                              event: "distributionTypePage-btn-3.enabled",
                                              payload:false
                                          }
                                      ]
                                  },

                                  {
                                      event: "distributionTypePage-btn-3.click",
                                      pubs:[
                                          {
                                              event: "DistributionType-tableField-1.expression",//在某个组件上执行表达式
                                              meta: {
                                                  expression: `
                                                    let gid=me.selectedRows().gid ;
                                                    let dataSource = {
                                                      type: "api",
                                                      method: "POST",
                                                      url: "/ime/mdMrlDeliveryScheme/delete.action"
                                                    }

                                                    resolveDataSourceCallback({ dataSource:dataSource,eventPayload:{"id":gid}},
                                                        function (data) {
                                                            resolveFetch({fetch:{id:'distributionTypeForm',data:'@@formValues'}}).then(function(dc){
                                                                if(data.success){
                                                                    let renderFunc=function(){
                                                                        let dataSource2 = {
                                                                            type: "api",
                                                                            method: "POST",
                                                                            url: "/ime/mdMrlDeliveryScheme/query.action"
                                                                         }
                                                                          resolveDataSourceCallback({ dataSource:dataSource2},
                                                                            function(res){
                                                                                    pubsub.publish("@@form.init",{id:"distributionTypeForm",data:{aaa:res.data}})
                                                                              }
                                                                          )
                                                                     }
                                                                    renderFunc()
                                                                    pubsub.publish('@@message.success','删除成功!')
                                                                }else{
                                                                    pubsub.publish('@@message.error',data.data)
                                                                }

                                                                pubsub.publish('distributionTypePage-btn-2.enabled',false)
                                                                pubsub.publish('distributionTypePage-btn-3.enabled',false)
                                                                pubsub.publish('DistributionType-tableField-1.activateAll')

                                                            })


                                                        }

                                                    )

                                              `
                                              }
                                          },

                                      ],

                                  },

                              ]
                          }} />
                      </div>
                      <div>
                          <AppButton config={{
                              id: "distributionTypePage-btn-4",
                              title: "保存",
                              type:"primary",
                              size:"large",
                              visible: false,
                              enabled: true,
                              subscribes: [
                                  {
                                      event: "distributionTypePage-btn-1.click",
                                      pubs:[
                                          {
                                              event:'distributionTypePage-btn-4.visible',
                                              payload:true
                                          }
                                      ]
                                  },
                                  {
                                      event: "distributionTypePage-btn-4.click",
                                      pubs:[
                                          {
                                              event: "distributionTypePage-btn-4.expression",//在某个组件上执行表达式
                                              meta: {
                                                  expression: `
                                                        let dataSource = {
                                                          type: "api",
                                                          method: "POST",
                                                          url: "/ime/mdMrlDeliveryScheme/add.action"
                                                        }

                                                            resolveFetch({fetch:{id:'distributionTypeForm',data:'@@formValues'}}).then(function(dt){
                                                                let createRow;
                                                                let obj;
                                                                if(dt.aaa){
                                                                    createRow=dt.aaa[dt.aaa.length-1]
                                                                }

                                                                console.log('createRow:::',createRow)

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

                                                                        if(data.length!=arr.length){
                                                                            result=false;
                                                                            break;
                                                                        }else {
                                                                            result=true;
                                                                        }
                                                                    }
                                                                    return result
                                                              };

                                                                if(dt.mdMrlPackTypeDTOs||dt.mdMrlGroupSortRuleDTOs||dt.mdMrlSchemeScopeDTOs){
                                                                    obj=Object.assign(createRow,{mdMrlPackTypeDTOs:dt.mdMrlPackTypeDTOs},{mdMrlGroupSortRuleDTOs:dt.mdMrlGroupSortRuleDTOs},{mdMrlSchemeScopeDTOs:dt.mdMrlSchemeScopeDTOs})
                                                                }else{
                                                                    obj=createRow
                                                                }

                                                                if(
                                                                    !obj.deliveryCode||
                                                                    !obj.deliveryName||
                                                                    !obj.deliveryType||
                                                                    !obj.versionCode
                                                                ){
                                                                    pubsub.publish('@@message.error','请完善表格后再保存!')
                                                                    return;
                                                                }

                                                                if(obj.mdMrlPackTypeDTOs&&obj.mdMrlPackTypeDTOs.length){
                                                                        let ste=false;
                                                                       _.map(obj.mdMrlPackTypeDTOs,function(item,index){
                                                                            if(!item.sortCriteria){
                                                                                ste=true
                                                                            }
                                                                       })
                                                                       if(ste){
                                                                            pubsub.publish('@@message.error','请完善"分组规则"!')
                                                                            return;
                                                                       }

                                                                       if(obj.mdMrlPackTypeDTOs&&obj.mdMrlPackTypeDTOs.length>1){
                                                                            let result=unique(obj.mdMrlPackTypeDTOs,['sortCriteria'])
                                                                            if(!result){
                                                                                pubsub.publish('@@message.error','"分组规则"选项不能重复!')
                                                                                return;
                                                                            }
                                                                        }
                                                                }

                                                                if(obj.mdMrlGroupSortRuleDTOs&&obj.mdMrlGroupSortRuleDTOs.length){
                                                                        let ste=false;
                                                                       _.map(obj.mdMrlGroupSortRuleDTOs,function(item,index){
                                                                            if(!item.sortCriteria||!item.ruleSeq){
                                                                                ste=true;
                                                                            }
                                                                       })

                                                                       if(ste){
                                                                            pubsub.publish('@@message.error','请完善"排序规则"!')
                                                                            return;
                                                                       }

                                                                       if(obj.mdMrlGroupSortRuleDTOs&&obj.mdMrlGroupSortRuleDTOs.length>1){
                                                                            let result=unique(obj.mdMrlGroupSortRuleDTOs,['sortCriteria'])
                                                                            if(!result){
                                                                                pubsub.publish('@@message.error','"排序规则"选项不能重复!')
                                                                                return;
                                                                            }
                                                                        }
                                                                }

                                                                if(obj.mdMrlSchemeScopeDTOs&&obj.mdMrlSchemeScopeDTOs.length){
                                                                    let ste=false;
                                                                       _.map(obj.mdMrlSchemeScopeDTOs,function(item,index){
                                                                            if(!item.factoryLineGidRef){
                                                                                ste=true
                                                                            }
                                                                       })

                                                                       if(ste){
                                                                           pubsub.publish('@@message.error','请完善"适用范围"!');
                                                                           return;
                                                                       }

                                                                       if(obj.mdMrlSchemeScopeDTOs&&obj.mdMrlSchemeScopeDTOs.length>1){
                                                                        let arr=[];
                                                                        _.map(obj.mdMrlSchemeScopeDTOs,function(item,index){
                                                                            let obj={};
                                                                            obj['lineCode']=item.factoryLineGidRef.lineCode;
                                                                            arr.push(obj)
                                                                        })
                                                                        let result=unique(arr,['lineCode'])
                                                                        if(!result){
                                                                            pubsub.publish('@@message.error','"适用范围"选项不能重复!')
                                                                            return;
                                                                        }
                                                                    }

                                                                }

                                                                resolveDataSourceCallback({ dataSource:dataSource,eventPayload:obj},
                                                                    function (data) {
                                                                        if(data.success){
                                                                            let renderFunc=function(){
                                                                                let dataSource2 = {
                                                                                    type: "api",
                                                                                    method: "POST",
                                                                                    url: "/ime/mdMrlDeliveryScheme/query.action"
                                                                                 }
                                                                                  resolveDataSourceCallback({ dataSource:dataSource2},
                                                                                    function(res){
                                                                                            pubsub.publish("@@form.init",{id:"distributionTypeForm",data:{aaa:res.data}})
                                                                                      }
                                                                                  )
                                                                             }
                                                                            renderFunc()

                                                                            pubsub.publish('distributionTypePage-btn-2.enabled',false)
                                                                            pubsub.publish('distributionTypePage-btn-3.enabled',false)
                                                                            pubsub.publish('DistributionType-tableField-1.activateAll')

                                                                            pubsub.publish('@@message.success','创建成功!')
                                                                        }else{
                                                                            pubsub.publish('@@message.success',data.data)
                                                                        }

                                                                        pubsub.publish('distributionTypePage-btn-1.visible',true)
                                                                        pubsub.publish('distributionTypePage-btn-2.visible',true)
                                                                        pubsub.publish('distributionTypePage-btn-3.visible',true)
                                                                        pubsub.publish('distributionTypePage-btn-4.visible',false)
                                                                        pubsub.publish('distributionTypePage-btn-4-2.visible',false)
                                                                        pubsub.publish('distributionTypePage-btn-5.visible',false)

                                                                    }
                                                                )

                                                            })


                                             `
                                              }
                                          }

                                      ],

                                  },

                              ]
                          }} />

                          <AppButton config={{
                              id: "distributionTypePage-btn-4-2",
                              title: "保存",
                              type:"primary",
                              size:"large",
                              visible: false,
                              enabled: true,
                              subscribes: [
                                  {
                                      event: "distributionTypePage-btn-2.click",
                                      pubs:[
                                          {
                                              event:'distributionTypePage-btn-4-2.visible',
                                              payload:true
                                          }
                                      ]
                                  },
                                  {
                                      event: "distributionTypePage-btn-4-2.click",
                                      pubs:[
                                          {
                                              event: "distributionTypePage-btn-4-2.expression",//在某个组件上执行表达式
                                              meta: {
                                                  expression: `
                                                        let dataSource = {
                                                          type: "api",
                                                          method: "POST",
                                                          url: "/ime/mdMrlDeliveryScheme/modify.action"
                                                        }

                                                        resolveFetch({fetch:{id:'DistributionType-tableField-1',data:'selectedRows'}}).then(function(my){
                                                            resolveFetch({fetch:{id:'distributionTypeForm',data:'@@formValues'}}).then(function(dt){
                                                                let obj;
                                                                if(dt.mdMrlPackTypeDTOs||dt.mdMrlGroupSortRuleDTOs||dt.mdMrlSchemeScopeDTOs){
                                                                    obj=Object.assign(my,{mdMrlPackTypeDTOs:dt.mdMrlPackTypeDTOs},{mdMrlGroupSortRuleDTOs:dt.mdMrlGroupSortRuleDTOs},{mdMrlSchemeScopeDTOs:dt.mdMrlSchemeScopeDTOs})
                                                                }else{
                                                                    obj=my
                                                                }

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

                                                                        if(data.length!=arr.length){
                                                                            result=false;
                                                                            break;
                                                                        }else {
                                                                            result=true;
                                                                        }
                                                                    }
                                                                    return result
                                                              };

                                                                if(
                                                                    !obj.deliveryCode||
                                                                    !obj.deliveryName||
                                                                    !obj.deliveryType||
                                                                    !obj.versionCode
                                                                ){
                                                                    pubsub.publish('@@message.error','请完善表格后再保存!')
                                                                    return;
                                                                }

                                                                if(obj.mdMrlPackTypeDTOs&&obj.mdMrlPackTypeDTOs.length){
                                                                         let ste=false;
                                                                       _.map(obj.mdMrlPackTypeDTOs,function(item,index){
                                                                            if(!item.sortCriteria){
                                                                                ste=true
                                                                            }
                                                                       })

                                                                       if(ste){
                                                                            pubsub.publish('@@message.error','请完善"分组规则"!')
                                                                            return;
                                                                       }

                                                                       if(obj.mdMrlPackTypeDTOs&&obj.mdMrlPackTypeDTOs.length>1){
                                                                            let result=unique(obj.mdMrlPackTypeDTOs,['sortCriteria'])
                                                                            if(!result){
                                                                                pubsub.publish('@@message.error','"分组规则"选项不能重复!')
                                                                                return;
                                                                            }
                                                                        }
                                                                }

                                                                if(obj.mdMrlGroupSortRuleDTOs&&obj.mdMrlGroupSortRuleDTOs.length){
                                                                        let ste=false;
                                                                       _.map(obj.mdMrlGroupSortRuleDTOs,function(item,index){
                                                                            if(!item.sortCriteria||!item.ruleSeq){
                                                                                ste=true;
                                                                            }
                                                                       })
                                                                       if(ste){
                                                                             pubsub.publish('@@message.error','请完善"排序规则"!')
                                                                            return;
                                                                       }

                                                                       if(obj.mdMrlGroupSortRuleDTOs&&obj.mdMrlGroupSortRuleDTOs.length>1){
                                                                            let result=unique(obj.mdMrlGroupSortRuleDTOs,['sortCriteria'])
                                                                            if(!result){
                                                                                pubsub.publish('@@message.error','"排序规则"选项不能重复!')
                                                                                return;
                                                                            }
                                                                        }
                                                                }

                                                                if(obj.mdMrlSchemeScopeDTOs&&obj.mdMrlSchemeScopeDTOs.length){
                                                                    let ste=false;
                                                                       _.map(obj.mdMrlSchemeScopeDTOs,function(item,index){
                                                                            if(!item.factoryLineGidRef){
                                                                                ste=true
                                                                            }
                                                                       })

                                                                       if(ste){
                                                                           pubsub.publish('@@message.error','请完善"适用范围"!');
                                                                           return;
                                                                       }

                                                                       if(obj.mdMrlSchemeScopeDTOs&&obj.mdMrlSchemeScopeDTOs.length>1){
                                                                        let arr=[];
                                                                        _.map(obj.mdMrlSchemeScopeDTOs,function(item,index){
                                                                            let obj={};
                                                                            obj['lineCode']=item.factoryLineGidRef.lineCode;
                                                                            arr.push(obj)
                                                                        })
                                                                        let result=unique(arr,['lineCode'])
                                                                        if(!result){
                                                                            pubsub.publish('@@message.error','"适用范围"选项不能重复!')
                                                                            return;
                                                                        }
                                                                    }

                                                                }

                                                                resolveDataSourceCallback({ dataSource:dataSource,eventPayload:obj},
                                                                    function (data) {
                                                                        if(data.success){
                                                                            let renderFunc=function(){
                                                                                let dataSource2 = {
                                                                                    type: "api",
                                                                                    method: "POST",
                                                                                    url: "/ime/mdMrlDeliveryScheme/query.action"
                                                                                 }
                                                                                  resolveDataSourceCallback({ dataSource:dataSource2},
                                                                                    function(res){
                                                                                            pubsub.publish("@@form.init",{id:"distributionTypeForm",data:{aaa:res.data}})
                                                                                      }
                                                                                  )
                                                                             }

                                                                             renderFunc()
                                                                             pubsub.publish('sssss.asd',true)

                                                                            pubsub.publish('distributionTypePage-btn-2.enabled',false)
                                                                            pubsub.publish('distributionTypePage-btn-3.enabled',false)
                                                                            pubsub.publish('DistributionType-tableField-1.activateAll')
                                                                            pubsub.publish('DistributionType-tableField-1.clearSelect')

                                                                            pubsub.publish('@@message.success','修改成功!')

                                                                        }else{
                                                                            pubsub.publish('@@message.success',data.data)
                                                                        }

                                                                        pubsub.publish('distributionTypePage-btn-1.visible',true)
                                                                        pubsub.publish('distributionTypePage-btn-2.visible',true)
                                                                        pubsub.publish('distributionTypePage-btn-3.visible',true)
                                                                        pubsub.publish('distributionTypePage-btn-4.visible',false)
                                                                        pubsub.publish('distributionTypePage-btn-4-2.visible',false)
                                                                        pubsub.publish('distributionTypePage-btn-5.visible',false)

                                                                    }
                                                                )

                                                            })


                                                        })

                                             `
                                              }
                                          }

                                      ],

                                  },

                              ]
                          }} />

                          <AppButton config={{
                              id: "distributionTypePage-btn-5",
                              title: "取消",
                              type:"primary",
                              size:"large",
                              visible: false,
                              enabled: true,
                              subscribes: [
                                  {
                                      event: "distributionTypePage-btn-1.click",
                                      pubs:[
                                          {
                                              event:'distributionTypePage-btn-5.visible',
                                              payload:true
                                          }
                                      ]
                                  },
                                  {
                                      event: "distributionTypePage-btn-2.click",
                                      pubs:[
                                          {
                                              event:'distributionTypePage-btn-5.visible',
                                              payload:true
                                          }
                                      ]
                                  },

                                  {
                                      event: "distributionTypePage-btn-5.click",
                                      pubs:[
                                          {
                                              event:'distributionTypePage-btn-1.visible',
                                              payload:true
                                          },
                                          {
                                              event:'distributionTypePage-btn-2.visible',
                                              payload:true
                                          },{
                                              event:'distributionTypePage-btn-3.visible',
                                              payload:true
                                          },{
                                              event:'distributionTypePage-btn-4.visible',
                                              payload:false
                                          },
                                          {
                                              event:'distributionTypePage-btn-4-2.visible',
                                              payload:false
                                          },
                                          {
                                              event:'distributionTypePage-btn-5.visible',
                                              payload:false
                                          },
                                          {
                                              event:'DistributionType-tableField-1.expression',
                                              meta:{
                                                  expression:`
                                                    let renderFunc=function(){
                                                        let dataSource2 = {
                                                            type: "api",
                                                            method: "POST",
                                                            url: "/ime/mdMrlDeliveryScheme/query.action"
                                                         }
                                                          resolveDataSourceCallback({ dataSource:dataSource2},
                                                            function(res){
                                                                    pubsub.publish("@@form.init",{id:"distributionTypeForm",data:{aaa:res.data}})
                                                              }
                                                          )
                                                     }
                                                     renderFunc()

                                                     pubsub.publish('DistributionType-tableField-1.clearSelect')

                                                    pubsub.publish('distributionTypePage-btn-2.enabled',false)
                                                    pubsub.publish('distributionTypePage-btn-3.enabled',false)
                                                    pubsub.publish('DistributionType-tableField-1.activateAll')
                                                  `
                                              }
                                          }

                                      ]
                                  }
                              ]
                          }} />
                      </div>
                  </Card>
          {/*按钮结束*/}

          {/*内容区*/}
          <Row gutter={12} style={{height:'100%'}}>
              {/*树*/}
              <Col span={6} style={{height:'100%'}}>
                  <Card style={{height:'100%'}}>
                      <Field config={{
                          id:'DistributionType-NavTree-1',
                          title:'配送类型',
                          showField:'text', //需要在树上展示的字段名称,
                          initLoad:true, //true:初始化加载,反之不加载
                          showJoin:'id', //ANT(随时件) 搭配展示
                          sendField:'id',//监听onSelect时，传递出来的字段，不填则是整条数据被传递出来
                          tableInfoId:'DistributionType-tableField-1', //需要操作的组件id
                          dataSource:{
                              type:'api',
                              method:'post',
                              url:'/ime/mdMrlDeliveryScheme/getMrlDeliverySchemeTree.action',
                          },

                          subscribes:[
                              {
                                  event:'DistributionType-tableField-1.onSelect',
                                  pubs: [
                                      {
                                          event: "DistributionType-tableField-1.expression",//在某个组件上执行表达式
                                          meta: {
                                              expression: `
                                                pubsub.publish('DistributionType-tableField-1.dataContext',data)
                                             `
                                          }
                                      }
                                  ]
                              },

                              //  request 自定义请求参数、自定义渲染数据 (示例勿删!)
                              {
                                  // event:'DistributionType-NavTree-1.nullPub',
                                  // pubs:[
                                  //     {
                                  //         eventPayloadExpression:`
                                  //           callback({id:123})
                                  //         `,
                                  //         event:'DistributionType-NavTree-1.loadNavTree',
                                  //
                                  //     }
                                  // ]

                                  // behaviors:[
                                  //     {
                                  //         type:'request',
                                  //         dataSource:{
                                  //             type:'api',
                                  //             method:'post',
                                  //             url:'/ime/mdMrlDeliveryScheme/getMrlDeliverySchemeTree.action',
                                  //             bodyExpression:`
                                  //               callback({isdsdsd:11111,dd:2222})
                                  //             `
                                  //         },
                                  //         successPubs:[
                                  //             {
                                  //                 event: "DistributionType-NavTree-1.setNavTree",
                                  //                 eventPayloadExpression:`
                                  //                       console.log("eventPayload::::",eventPayload)
                                  //                       callback(eventPayload)
                                  //                 `
                                  //             }
                                  //         ]
                                  //     },
                                  //
                                  // ]
                              }
                          ]

                      }} name="NavTree" component={NavTreeField2}/>
                  </Card>
              </Col>

              {/*table(上)*/}
              <Col span={18} className="distributionType-tabTop">
                  <Row  className="distributionType-tabTop-top" style={{marginBottom:'10px'}}>
                      <Col span={24}>
                          <Card>
                              <Tabs defaultActiveKey="1-1">
                                  <TabPane tab="配送方案" key="1-1">
                                      <FieldArray
                                        name="aaa"
                                        component={TableField}
                                        config={{
                                            id:"DistributionType-tableField-1",
                                            name:"DistributionType-tableField-1",
                                            "form":"distributionTypeForm",
                                            "rowKey": "id",
                                            "addButton": false, //是否显示默认增行按钮
                                            "showSelect":true, //是否显示选择框
                                            "type":"radio", //表格单选（radio）复选（checkbox）类型
                                            "unEditable":true, //初始化是否都不可编辑
                                            "showRowDeleteButton":false,
                                            subscribes:[
                                                {
                                                    event:'DistributionType-tableField-1.onSelectedRows',
                                                    pubs:[
                                                        {
                                                            event: "DistributionType-tableField-1.expression",//在某个组件上执行表达式
                                                            meta: {
                                                                expression: `
                                                                    let gid=me.selectedRows().gid ;
                                                                    let dataSource = {
                                                                      mode: "dataContext",
                                                                      type: "api",
                                                                      method: "POST",
                                                                      url: "/ime/mdMrlDeliveryScheme/findById.action"
                                                                    }

                                                                    pubsub.publish('distributionTypePage-btn-3.dataContext',gid)

                                                                    resolveDataSourceCallback({ dataSource:dataSource,dataContext:{"id":gid}},
                                                                        function (data) {
                                                                            resolveFetch({fetch:{id:'distributionTypeForm',data:'@@formValues'}}).then(function(dc){
                                                                                pubsub.publish("@@form.init",{id:"distributionTypeForm",data:Object.assign({aaa:dc.aaa},data.data)})
                                                                            })
                                                                        }
                                                                    )

                                                                `
                                                            }
                                                        },

                                                    ]
                                                },
                                                //树选择事件
                                                {
                                                    event:'DistributionType-NavTree-1.onSelect',
                                                    pubs: [
                                                        {
                                                            event: "DistributionType-tableField-1.expression",//在某个组件上执行表达式
                                                            meta: {
                                                                expression: `
                                                                let dataSource = {
                                                                  type: "api",
                                                                  method: "POST",
                                                                  url: "/ime/mdMrlDeliveryScheme/query.action"
                                                                }

                                                                if(data.eventPayload){
                                                                    let parms={
                                                                    "query":{
                                                                        "query":[
                                                                          {
                                                                            "left":"(",
                                                                            "field":"deliveryType",
                                                                            "type":"eq",
                                                                            "value":data.eventPayload,
                                                                            "right":")",
                                                                            "operator":"and"
                                                                          }
                                                                        ],

                                                                      }
                                                                    }

                                                                    resolveDataSourceCallback({ dataSource:dataSource,eventPayload:parms},
                                                                        function (data) {
                                                                                pubsub.publish("@@form.init",{id:"distributionTypeForm",data:{aaa:data.data}})
                                                                        }
                                                                    )
                                                                }else{
                                                                    resolveDataSourceCallback({ dataSource:dataSource},
                                                                        function (data) {
                                                                                pubsub.publish("@@form.init",{id:"distributionTypeForm",data:{aaa:data.data}})
                                                                        }
                                                                    )
                                                                }


                                                              `
                                                            }
                                                        }
                                                    ]
                                                },
                                            ],

                                            columns:[
                                                {
                                                    "id": "DistributionType-textField-1",
                                                    "type": "textField",
                                                    "title": "配送编码",
                                                    "name": "deliveryCode",
                                                    "form":"distributionTypeForm",
                                                },
                                                {
                                                    "id": "DistributionType-textField-2",
                                                    "type": "textField",
                                                    "title": "配送名称",
                                                    "name": "deliveryName",
                                                    "form":"distributionTypeForm",
                                                },
                                                {
                                                    "id": "DistributionType-textField-3",
                                                    "type": "textField",
                                                    "title": "版本编号",
                                                    "name": "versionCode",
                                                    "form":"distributionTypeForm",
                                                },
                                                {
                                                    "id": "DistributionType-selectField-1",
                                                    "type": "selectField",
                                                    "title": "配送类型",
                                                    "name": "deliveryType",
                                                    "form":"distributionTypeForm",
                                                    "dataSource": {
                                                        type: "api",
                                                        method: "POST",
                                                        url: "/ime/mdMrlDeliveryScheme/getMrlDeliverySchemeCombox.action",
                                                    },
                                                    displayField: "value",
                                                    valueField: "id"
                                                }
                                            ]
                                        }}
                                      >
                                      </FieldArray>
                                  </TabPane>

                              </Tabs>
                          </Card>
                      </Col>
                  </Row>

                  {/*table(下)*/}
                  <Row className="distributionType-tabTop-bottom">
                      <Col span={24}>
                          <Card>
                              <Tabs defaultActiveKey="2-1">
                                  <TabPane forceRender="true" tab="分组规则" key="2-1">

                                      <FieldArray
                                          name="mdMrlPackTypeDTOs"
                                          component={TableField}
                                          config={{
                                              id:"DistributionType-tableField-2",
                                              name:"DistributionType-tableField-2",
                                              rowKey:"gid",
                                              columns:[
                                                  {
                                                      "id": "DistributionType-selectField-2",
                                                      "type": "selectField",
                                                      "title": "排序依据",
                                                      "name": "sortCriteria",
                                                      "form":"distributionTypeForm",
                                                      "dataSource": {
                                                          type: "api",
                                                          method: "POST",
                                                          mode: "payload",
                                                          payload: {
                                                              "query": {
                                                                  "query": [
                                                                      { "field": "smDictionaryEnumGid", "type": "eq", "value": "56B2315955384BE3E055000000000001" }
                                                                  ],
                                                                  "sorted": "seq"
                                                              }
                                                          },
                                                          url: "/sm/dictionaryEnumValue/query.action",
                                                      },
                                                      displayField: "val",
                                                      valueField: "code"
                                                  }
                                              ]
                                          }}
                                      >
                                      </FieldArray>
                                  </TabPane>
                                  <TabPane forceRender="true" tab="排序规则" key="2-2">

                                      <FieldArray
                                          name="mdMrlGroupSortRuleDTOs"
                                          component={TableField}
                                          config={{
                                              id:"DistributionType-tableField-3",
                                              name:"DistributionType-tableField-3",
                                              rowKey:"gid",
                                              columns:[
                                                  {
                                                      "id": "DistributionType-selectField-3",
                                                      "type": "selectField",
                                                      "title": "排序依据",
                                                      "name": "sortCriteria",
                                                      "form":"distributionTypeForm",
                                                      "dataSource": {
                                                          type: "api",
                                                          method: "POST",
                                                          mode: "payload",
                                                          payload: {
                                                              "query": {
                                                                  "query": [
                                                                      { "field": "smDictionaryEnumGid", "type": "eq", "value": "56B2315955384BE3E055000000000001" }
                                                                  ],
                                                                  "sorted": "seq"
                                                              }
                                                          },
                                                          url: "/sm/dictionaryEnumValue/query.action",
                                                      },
                                                      displayField: "val",
                                                      valueField: "code"
                                                  },
                                                  {
                                                      "id": "DistributionType-selectField-4",
                                                      "type": "selectField",
                                                      "title": "顺序",
                                                      "name": "ruleSeq",
                                                      "form":"distributionTypeForm",
                                                      "dataSource": {
                                                          type: "api",
                                                          method: "POST",
                                                          mode: "payload",
                                                          payload: {
                                                              "query": {
                                                                  "query": [
                                                                      { "field": "smDictionaryEnumGid", "type": "eq", "value": "56B2315955384CF2E055000000000001" }
                                                                  ],
                                                                  "sorted": "seq"
                                                              }
                                                          },
                                                          url: "/sm/dictionaryEnumValue/query.action",
                                                      },
                                                      displayField: "val",
                                                      valueField: "code"
                                                  }
                                              ]
                                          }}
                                      >
                                      </FieldArray>
                                  </TabPane>
                                  <TabPane forceRender="true" tab="适用范围" key="2-3">

                                      <FieldArray
                                          name="mdMrlSchemeScopeDTOs"
                                          component={TableField}
                                          config={{
                                              id:"DistributionType-tableField-4",
                                              name:"DistributionType-tableField-4",
                                              rowKey:"gid",
                                              columns:[
                                                  {
                                                      "id": "DistributionType-textField-4",
                                                      "type": "findbackField",
                                                      "title": "产线编号",
                                                      "name": "factoryLineGidRef.lineCode",
                                                      "form":"distributionTypeForm",
                                                      pageId: 'DistributionType-textField-4',
                                                      displayField: "lineCode",
                                                      valueField: {
                                                          "from": "lineCode",
                                                          "to": "factoryLineGidRef.lineCode"
                                                      },
                                                      associatedFields: [
                                                          {
                                                              "from": "lineName",
                                                              "to": "factoryLineGidRef.lineName"
                                                          },
                                                          {
                                                              "from": "workCenterGidRef.workCenterName",
                                                              "to": "factoryLineGidRef.workCenterGidRef.workCenterName"
                                                          },
                                                          {
                                                              "from": "gid",
                                                              "to": "factoryLineGid"
                                                          },
                                                      ],
                                                      tableInfo: {
                                                          id:"DistributionType-table-3",
                                                          size:"small",
                                                          rowKey:"gid",
                                                          tableTitle:"产线信息",
                                                          showSerial:true,  //序号
                                                          columns:[
                                                              {title: '产线编号', width: 100, dataIndex: 'lineCode', key: '1'},
                                                              {title: '产线名称',width: 100, dataIndex: 'lineName', key: '2'},
                                                              {title: '产线类型', width: 100, dataIndex: 'lineType', key: '3'},
                                                              {title: '工作中心', width: 100, dataIndex: 'workCenterGidRef.workCenterName', key: '4'},

                                                          ],
                                                          dataSource: {
                                                              type: 'api',
                                                              method: 'post',
                                                              url: '/ime/mdFactoryLine/query.action',
                                                          }
                                                      },
                                                  },
                                                  {
                                                      "id": "DistributionType-textField-5",
                                                      "type": "textField",
                                                      "title": "产线名称",
                                                      "name": "factoryLineGidRef.lineName",
                                                      "form":"distributionTypeForm",
                                                      "enabled":false
                                                  },
                                                  {
                                                      "id": "DistributionType-textField-6",
                                                      "type": "textField",
                                                      "title": "工作中心",
                                                      "name": "factoryLineGidRef.workCenterGidRef.workCenterName",
                                                      "form":"distributionTypeForm",
                                                      "enabled":false
                                                  },

                                              ]
                                          }}
                                      >
                                      </FieldArray>
                                  </TabPane>

                              </Tabs>
                          </Card>
                      </Col>
                  </Row>


              </Col>
          </Row>

            <ModalContainer config={{
                visible: false, // 是否可见，必填*
                enabled: true, // 是否启用，必填*
                id: "distributionTypePage-modal-1", // id，必填*
                pageId: "distributionTypePage-modal-1", // 指定是哪个page调用modal，必填*
                type: "confirm", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                title: "确定删除?", // title，不传则不显示title
                closable: true, // 是否显示右上角关闭按钮，默认不显示
                width: "50%", // 宽度，默认520px
                okText: "确定", // ok按钮文字，默认 确定
                cancelText: "取消", // cancel按钮文字，默认 取消
                style: {top: 120}, // style样式
                wrapClassName: "wcd-center", // class样式
                hasFooter: false, // 是否有footer，默认 true
                maskClosable: true, // 点击蒙层是否允许关闭，默认 true
            }}
            >
            </ModalContainer>
      </div>

      </DistributionTypePageCss>
    );
  }
}

DistributionTypePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default reduxForm({
  form: "distributionTypeForm",
    validate
})(DistributionTypePage)