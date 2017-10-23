/*
 *
 * LogidsticsOrderRulePage
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Row, Card, Col, Tabs} from 'antd';
import {Link} from 'react-router';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'

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

//import CheckBoxField from '../../../../components/Form/CheckBoxField';
import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
const TabPane = Tabs.TabPane;
export class LogidsticsOrderRulePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.init();

        pubsub.subscribe("Table.refresh", () => {
            this.init();//初始化数据
            this.btnDisplay();//按钮列表控制
        })

        pubsub.subscribe("imeLogisticsOrderRuleDTO.onSelectedRows", (name, data) => {
            console.log("rows", data)
            if ((data)&&data.length < 1) {
                pubsub.publish("modifyBtn.enabled", false);
                pubsub.publish("saveBtn.enabled", false);
                pubsub.publish("delBtn.enabled", false);
                pubsub.publish("orderRuleCancel.enabled", true);
                pubsub.publish("orderRuleAddLine.enabled", false);
                pubsub.publish("imeLogisticsOrderRuleDTO.clearSelect");
                pubsub.publish("imeLogisticsOrderRuleDTO.activateAll");

            } else if ((data)&& data.length > 0) {
                pubsub.publish("modifyBtn.enabled", true);
                pubsub.publish("delBtn.enabled", true);
                pubsub.publish("orderRuleCancel.enabled", true);
               // pubsub.publish("orderRuleCancel.visible", true);
                pubsub.publish("orderRuleAddLine.enabled", true);
                pubsub.publish("saveBtn.enabled", true);

            }
        })

    }


    componentDidMount() {
    }

    init() {


        let dataSource = {
            type: 'api',
            method: 'post',
            url: '/ime/imeLogisticsOrderRule/query.action'
        }

        resolveDataSource({
            dataSource: dataSource
        }).then(function (response) {
            debugger
            if (response.success) {
                let modifyData = {}
                modifyData.imeLogisticsOrderRuleDTO = response.data;
                pubsub.publish("@@form.init", {id: "LogidsticsOrderRulePageForm", data: modifyData});

            } else {
                pubsub.publish("@@message.error", "始化失败!");
            }
        }.bind(this))

    }

    btnDisplay() {
        pubsub.publish("imeLogisticsOrderRuleDTO.clearSelect");
        pubsub.publish("imeLogisticsOrderRuleDTO.activateAll");
        pubsub.publish("modifyBtn.visible", true);
        pubsub.publish("modifyBtn.enabled", false);
        pubsub.publish("orderRuleAdd.visible", true);
        pubsub.publish("delBtn.visible", true);
        pubsub.publish("delBtn.enabled", false);
        pubsub.publish("saveBtn.visible", false);
        pubsub.publish("orderRuleCancel.visible", false);
        pubsub.publish("orderRuleAddLine.enabled", false);
    }

    render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>物流管理</Breadcrumb.Item>
              <Breadcrumb.Item>设置</Breadcrumb.Item>
              <Breadcrumb.Item>物流工单生成规则</Breadcrumb.Item>
          </Breadcrumb>
          <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
              <Row >
                  <Col>
                      <AppButton config={{
                          id: "orderRuleAdd",
                          title: "新增",
                          visible: true,
                          enabled: true,
                          type: 'primary',
                          subscribes: [
                              {
                                  event: "orderRuleAdd.click",
                                  pubs: [
                                      {
                                          event: "imeLogisticsOrderRuleDTO.addRow"
                                      },
                                      {
                                          event: "saveBtn.visible",
                                          payload: true
                                      },
                                      {
                                          event: "saveBtn.enabled",
                                          payload: true
                                      },
                                      {
                                          event: "orderRuleCancel.visible",
                                          payload: true
                                      },
                                      {
                                          event: "orderRuleCancel.enableds",
                                          payload: true
                                      },
                                      {
                                          event: "modifyBtn.visible",
                                          payload: false
                                      },
                                      {
                                          event: "delBtn.visible",
                                          payload: false
                                      },
                                      {
                                          event: "orderRuleAddLine.enabled",
                                          payload: true
                                      },
                                      {
                                          event: "orderRuleAdd.visible",
                                          payload: false
                                      }
                                  ]
                              }
                          ]
                      }} />
                      <AppButton config={{
                          id: "modifyBtn",
                          title: "修改",
                          visible: true,
                          enabled: false,
                          type: 'primary',
                          subscribes: [
                              {
                                  event: "imeLogisticsOrderRuleDTO.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "modifyBtn.dataContext"
                                      }
                                  ]
                              },
                              {
                                  event: "modifyBtn.click",
                                  behaviors: [
                                      {
                                          type: "fetch",
                                          id: "modifyBtn", //要从哪个组件获取数据
                                          data: "dataContext",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "imeLogisticsOrderRuleDTO.activateRow"
                                              },
                                              {
                                                  event: "delBtn.enabled",
                                                  payload: false
                                              },
                                              {
                                                  event: "saveBtn.visible",
                                                  payload: true
                                              },
                                              {
                                                  event: "saveBtn.enabled",
                                                  payload: true
                                              },
                                              {
                                                  event: "orderRuleCancel.visible",
                                                  payload: true
                                              },
                                              {
                                                  event: "orderRuleCancel.enabled",
                                                  payload: true
                                              },
                                              {
                                                  event: "modifyBtn.visible",
                                                  payload: false
                                              },
                                              {
                                                  event: "orderRuleAdd.visible",
                                                  payload: false
                                              },
                                              {
                                                  event: "delBtn.visible",
                                                  payload: false
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ]
                      }} />
                      <AppButton config={{
                          id: "saveBtn",
                          title: "保存",
                          visible: false,
                          enabled: true,
                          type: 'primary',
                          subscribes: [
                              {
                                  event: "saveBtn.click",
                                  behaviors:
                                      [
                                          {
                                              type: "fetch",
                                              id: "imeLogisticsOrderRuleDTO", //要从哪个组件获取数据
                                              data: "selectedRows",//要从哪个组件的什么属性获取数据
                                              successPubs: [  //获取数据完成后要发送的事件
                                                  {
                                                      event: "@@message.success",
                                                      eventPayloadExpression: `
                                                     resolveFetch({fetch:{id:"LogidsticsOrderRulePageForm",data:"@@formValues"}}).then(function (value) {
                                                             console.log(value,22222222)
                                                             let arr=value.imeLogisticsOrderRuleDTO
                                                             let list=[];
                                                              for(var i=0;i<arr.length;i++){
                                                               list.push(arr[i].ruleGid)
                                                            }

                                                            console.log('list::::',list)
                                                            let unique = function(arr){  
                                                                  let hashTable = {};
                                                                  let data = [];
                                                                  for(let i=0,l=arr.length;i<l;i++){
                                                                    if(!hashTable[arr[i]]){
                                                                      hashTable[arr[i]] = true;
                                                                      data.push(arr[i]);
                                                                    }
                                                                  }
                                                                  return data
                                                                }
                                                               let newlist= unique(list)
                                                               if(list.length==newlist.length){
                                                                      console.log("eventPayload1",eventPayload)
                                                                                    //callback(eventPayload.length);

                                                                                        let dataSource= {
                                                                                          type: "api",
                                                                                          mode:"dataContext",
                                                                                          method: "POST",
                                                                                          url: "/ime/imeLogisticsOrderRule/saveImeLogisticsOrderRuleList.action"
                                                                                        };

                                                                                        let onSuccess = function(response){
                                                                                            if(response.success){
                                                                                                pubsub.publish("@@message.success","操作成功");
                                                                                                //页面刷新
                                                                                                pubsub.publish("Table.refresh");
                                                                                            }else{
                                                                                                pubsub.publish("@@message.error",response.data);
                                                                                            }
                                                                                        }

                                                                                        resolveDataSourceCallback({dataSource:dataSource,dataContext:arr},onSuccess);
                                                                                    //callback("成功消息")
                                                               }else{
                                                                    pubsub.publish("@@message.error","选择的规则字段重复，请重新选择")
                                                               }
                                                     })

                                                                                    `
                                                  }
                                              ]
                                          }
                                      ]
                              }


                          ]
                      }} />
                      <AppButton config={{
                          id: "delBtn",
                          title: "删除",
                          visible: true,
                          enabled: false,
                          type: 'primary',
                          subscribes: [
                              {
                                  event: "delBtn.click",
                                  behaviors: [
                                      {
                                          type: "fetch",
                                          id: "imeLogisticsOrderRuleDTO", //要从哪个组件获取数据
                                          data: "selectedRows",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@form.init",
                                                  eventPayloadExpression: `
                                                           console.log(eventPayload,"dataaaaa");
                                                           let list=new Array();
                                                              for(var i=0;i<eventPayload.length;i++){
                                                              let dto=eventPayload[i];
                                                              if(dto&&dto.gid){
                                                               list.push(eventPayload[i].gid)
                                                              }
                                                                  }

                                                           //let id = eventPayload.gid;
                                                                  let dataSource= {
                                                                  type: "api",
                                                                  mode:"dataContext",
                                                                  method: "POST",
                                                                  url: "/ime/imeLogisticsOrderRule/delete.action"
                                                                };
                                                          let onSuccess = function(response){
                                                                        if(response.success){
                                                                            pubsub.publish("@@message.success","删除成功");
                                                                         //页面刷新
                                                                         pubsub.publish("Table.refresh");
                                                                         }else{
                                                                            pubsub.publish("@@message.error","删除失败");
                                                                        }
                                                                    }
                                          resolveDataSourceCallback({dataSource:dataSource,eventPayload:list,dataContext:list},onSuccess);

                                                                                    `
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ]

                      }} />

                      <AppButton config={{
                          id: "orderRuleCancel",
                          title: "取消",
                          visible: false,
                          enabled: true,
                          type: 'primary',
                          subscribes: [
                              {
                                  event:"orderRuleCancel.click",
                                  pubs:[
                                      {
                                          eventPayloadExpression: `
                                         //页面刷新
                                   pubsub.publish("Table.refresh");
                                      `
                                      }

                                      /*{
                                          event:"orderRuleAdd.visible",
                                          payload:true
                                      },
                                      {
                                          event:"modifyBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"delBtn.visible",
                                          payload:true
                                      },
                                      {
                                          event:"delBtn.enabled",
                                          payload:true
                                      },
                                      {
                                          event:"saveBtn.visible",
                                          payload:false
                                      },
                                      {
                                          event:"orderRuleCancel.visible",
                                          payload:false
                                      },
                                      {
                                          event:"orderRuleAddLine.enabled",
                                          payload:false
                                      },
                                      {
                                          event:"imeLogisticsOrderRuleDTO.activateAll",
                                          payload:false
                                      }*/
                                  ],
                              }
                          ]
                      }} />
                  </Col>
              </Row>
          </Card>

          <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
              <Tabs defaultActiveKey="1">
                  <TabPane tab="物流工单生成规则信息" key="1">
                     <Row>
                        <Col span={ 16 }>
                          {/*  <AppButton config={{
                                id: "orderRuleAddLine",
                                title: "增行",
                                enabled: false,
                                type: 'primary',
                                subscribes: [
                                    {
                                        event:"orderRuleAddLine.click",
                                        pubs:[
                                            {
                                                event:"imeLogisticsOrderRuleDTO.addRow"
                                            }
                                        ]
                                    }
                                ]
                            }} />*/}
                      <FieldArray name="imeLogisticsOrderRuleDTO" config={{
                          "form":"LogidsticsOrderRulePageForm",
                          "addButton": false, //是否显示默认增行按钮
                          "showSelect":true, //是否显示选择框
                          "unEditable":true, //初始化是否都不可编辑
                          "id": "imeLogisticsOrderRuleDTO",
                          "name": "imeLogisticsOrderRuleDTO",
                          "type": "checkbox",//表格单选复选类型
                          "size": "default",//表格尺寸
                          "rowKey": "gid",//主键
                          "tableTitle": "物流工单生成规则信息",//表头信息
                          "width": 1500,//表格宽度
                          "showSerial": true,//是否显示序号
                          "editType": true,//是否增加编辑列
                          "page": 1,//当前页
                          "pageSize": 10,//一页多少条
                          "isPager": true,//是否分页
                          "isSearch": true,//是否显示模糊查询
                          "columns": [
                              {
                                  "id": "tableSelectFiled1",
                                  "type": "selectField",
                                  "enabled": true,
                                  "title": "规则字段",
                                  "name": "ruleGid",
                                  "form": "LogidsticsOrderRulePageForm",
                                  dataSource: {
                                      type: "api",
                                      method: "post",
                                      url: "/sm/dictionaryEnumValue/query.action",
                                      mode: "payload",
                                      payload: {
                                          "query": {
                                              "query": [
                                                  {
                                                      "field": "smDictionaryEnumGid",
                                                      "type": "eq",
                                                      "value": "585B4C68E4737897E055000000000001"
                                                  }
                                              ],
                                              "sorted": "seq"
                                      }
                                      }
                                  },
                                  displayField: "val",
                                  valueField: "gid",
                              }
                        ]
                      }} component={TableField}/>
                 </Col>
                     </Row>
                  </TabPane>
              </Tabs>
          </Card>
      </div>
    );
  }
}

LogidsticsOrderRulePage.propTypes = {
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
let LogidsticsOrderRulePageForm =  reduxForm({
    form: "LogidsticsOrderRulePageForm",
    /*validate,
    asyncValidate,*/
})(LogidsticsOrderRulePage)

export default connect(mapStateToProps, mapDispatchToProps)(LogidsticsOrderRulePageForm);