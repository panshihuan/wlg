/*
 *
 * OrderArrangeRule
 *
 */

import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import { connect } from 'react-redux';
import AppButton from 'components/AppButton'
import pubsub from 'pubsub-js'
import AppTable from 'components/AppTable'
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
import TreeField from 'components/Form/TreeField'
import UploadField from 'components/Form/UploadField'
import FindbackField from 'components/Form/FindbackField'
import CoreComponent from 'components/CoreComponent'
const TabPane = Tabs.TabPane;

export class OrderArrangeRule extends CoreComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)

    this.state = Object.assign({
      showBtns: 0
    }, this.state);
  }


  render() {
    return (

      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>生产管理</Breadcrumb.Item>
              <Breadcrumb.Item>编排规则方案</Breadcrumb.Item>
          </Breadcrumb>
        <Card style={{width: "100%", backgroundColor: "#f9f9f9"}} bodyStyle={{padding: "15px"}}>
          <Row>
            <Col>
              <AppButton config={{
                id: "logistics-time-add-btn-1",
                title: "创建",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "logistics-time-add-btn-1.click",
                    pubs: [
                      {
                        event:"arrange-unique-table.addRow"
                      }, {
                        event: "that.expression",
                        meta: {
                          expression: `
                          console.log('edit');
                          me.setState({
                            showBtns: 1
                          });
                        `
                        }
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              {this.state.showBtns == 0 && <AppButton config={{
                id: "arrange-order-rule-edit-btn-2",
                title: "修改",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "arrange-order-rule-edit-btn-2.click",
                    pubs: [{
                        event: "that.expression",
                        meta: {
                          expression: `
                          console.log('edit');
                          me.setState({
                            showBtns: 1
                          });
                        `
                        }
                    },{
                      event: "arrange-unique-table.activateAll",
                      payload: true
                    },{
                      event: "logistics-time-add-btn-2.enabled",
                      payload: true
                    }],

                  },
                ]
              }}>
              </AppButton>}
              {this.state.showBtns == 1 && <AppButton config={{
                id: "arrange-order-rule-save-btn-2",
                title: "保存",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "arrange-order-rule-save-btn-2.click",
                    pubs: [{
                      event: "that.expression",
                      meta: {
                        expression: `
                          console.log('edit');
                          me.setState({
                            showBtns: 0
                          });
                        `
                      }
                    },{
                      event: "arrange-unique-table.activateAll",
                      payload: false
                    }],
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/mdSortRule/modify.action",
                          // withForm: "orderUniqueRuleForm",
                          bodyExpression: `
                            resolveFetch({fetch:{id: "orderArrangeRuleForm",data: "@@formValues"}}).then(function(data){
                              if(data){

                                callback(data)
                              }
                            });
                          `
                        },
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@message.success",
                            payload: "保存成功"
                          }
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload: "保存失败"
                          }
                        ]
                      }
                    ]
                  },
                ]
              }}>
              </AppButton>}
              <AppButton config={{
                id: "arrange-order-del-btn-3",
                title: "删除",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "arrange-unique-table.onSelectedRows",
                    pubs: [
                      // {
                      //   event: "arrange-order-del-btn-3.dataContext"
                      // },
                      // {
                      //   event: "arrange-order-del-btn-3.expression",
                      //   meta: {
                      //     expression: `
                      //       if(dataContext) {
                      //         pubsub.publish("arrange-order-del-btn-3.enabled", true);
                      //       } else {
                      //         pubsub.publish("arrange-order-del-btn-3.enabled", false);
                      //       }
                      //     `
                      //   }
                      // }
                    ]
                  },

                  {
                    event: 'arrange-order-del-btn-3.click',
                    behaviors: [
                      {
                        type: "fetch",
                        id: "arrange-unique-table", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@message.success",
                            eventPayloadExpression: `
                              console.log(dataContext);
                              console.log("eventPayload1",eventPayload)
                              if(dataContext) {
                                let dataSource = {
                                  type: "api",
                                  method: "POST",
                                  url: "/ime/mdSortRule/delete.action?id=" + dataContext.info.node.props['data-item'].id
                                }

                                resolveDataSource({dataSource:dataSource}).then((function(response){
                                  if(response.success) {
                                    pubsub.publish("@@message.success","删除成功");
                                  } else {
                                    pubsub.publish("@@message.error","删除失败");
                                  }
                                }).bind(this));

                              }
                            `,
                          }
                        ]
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
            </Col>
          </Row>
        </Card>
        <Row>
          <Col span={ 5 }>
            <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
              <Field config={{
                id: 'arrange-rule-tree-1',
                search: false,
                enabled: true,
                visible: true,
                // defaultExpandedKeys: ['0-0-0', '0-0-1'],
                // defaultSelectedKeys: ['0-0-0', '0-0-1'],
                // defaultCheckedKeys: ['0-0-0', '0-0-1'],
                checkable: false,
                showLine: true,
                draggable: false,
                searchBoxWidth: 300,
                dataSource: {
                  type: "api",
                  method: "POST",
                  url: '/ime/mdSortRule/getTree'
                },
                subscribes: [
                  {
                    event:'arrange-rule-tree-1.onSelect',
                    pubs:[{
                      event: 'arrange-rule-tree-1.expression',
                      eventPayloadExpression: `
                        console.log(eventPayload);
                        var id = eventPayload.info.node.props['data-item'].id;
                        var dataSource = {
                          type: "api",
                          method: "post",
                          url: "/ime/mdSortRule/findById?id=" + id
                        }
                        resolveDataSource({dataSource: dataSource}).then(function(data) {
                          console.log(data);
                          if(data.success) {
                            pubsub.publish("logistics-time-add-btn-1.enabled", true);
                            pubsub.publish("arrange-order-rule-edit-btn-2.enabled", true);
                            pubsub.publish("@@form.init", {id: "orderArrangeRuleForm", data: Immutable.fromJS(data.data)})
                          } else {
                            pubsub.publish("logistics-time-add-btn-1.enabled", false);
                            pubsub.publish("arrange-order-rule-edit-btn-2.enabled", false);
                            pubsub.publish("@@form.init", {id: "orderArrangeRuleForm", data: Immutable.fromJS({})})
                          }

                        });
                      `
                    }, {
                      event: "arrange-order-del-btn-3.dataContext"
                    }]
                  },
                ]
              }} name="tree"  component={ TreeField } />
            </Card>
          </Col>
          <Col span={1}>

          </Col>

          <Col span={ 18 }>
            <Card bordered={true} style={{ marginTop: "20px" }}>
              <Row style={{marginTop: "30px", marginBottom: "30px"}}>
                <Col span={8}>
                  <Field config={{
                    enabled: true,
                    id: "code",
                    label: "编排方案编码",  //标签名称
                    labelSpan: 8,   //标签栅格比例（0-24）
                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                    showRequiredStar: true,  //是否显示必填星号
                    placeholder: "请输入"
                  }} component={TextField} name="code" />
                </Col>
                <Col span={2}>

                </Col>
                <Col span={8}>
                  <Field config={{
                    enabled: true,
                    id: "name",
                    label: "编排方案名称",  //标签名称
                    labelSpan: 8,   //标签栅格比例（0-24）
                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                    showRequiredStar: true,  //是否显示必填星号
                    placeholder: "请输入"
                  }} component={TextField} name="name" />
                </Col>
                <Col span={6}>

                </Col>
              </Row>
              <Row>
                <Col>
                  <AppButton config={{
                    id: "logistics-time-add-btn-2",
                    title: "创建",
                    visible: true,
                    enabled: false,
                    type: 'primary',
                    subscribes: [
                      {
                        event: "logistics-time-add-btn-2.click",
                        pubs: [
                          {
                            event: "arrange-unique-table.addRow"
                          }
                        ]
                      }
                    ]
                  }}>
                  </AppButton>
                  <FieldArray
                    id="arrange-unique-table"
                    name="mdSortRuleDetailDTOs"
                    component={TableField}
                    config={{
                      "id": "arrange-unique-table",
                      "name": "arrange-unique-table",
                      "rowKey": "gid",
                      "form": "orderArrangeRuleForm",
                      "type": "radio", //表格单选（radio）复选（checkbox）类型
                      "addButton": false, //是否显示默认增行按钮
                      "unEditable": true, //初始化是否都不可编辑
                      "showSelect": true,
                      columns: [{
                        "id": "arrange-unique-table-selectField-1",
                        "enabled": true,
                        "type": "selectField",
                        "title": "规则字段",
                        "name": "ruleField",
                        "form": "orderArrangeRuleForm",
                        dataSource: {
                          type: "api",
                          method: "post",
                          url: "/ime/mdSortRule/getRulePlanFieldCombox.action",
                        },
                        displayField: "value",
                        valueField: "id",
                      },{
                        "id": "arrange-unique-table-selectField-2",
                        "enabled": true,
                        "type": "selectField",
                        "title": "正序/逆序",
                        "name": "sortOrder",
                        "form": "orderArrangeRuleForm",
                        dataSource: {
                          type: "api",
                          method: "post",
                          url: "/ime/mdSortRule/getRuleOrderCombox.action",
                        },
                        displayField: "value",
                        valueField: "id",
                      }
                      // {
                      //     "id": "arrange-unique-table-selectField-1",
                      //     "enabled": true,
                      //     "type": "selectField",
                      //     "title": "规则字段",
                      //     "name": "filedName",
                      //     "form": "orderArrangeRuleForm",
                      //     dataSource: {
                      //       type: "api",
                      //       method: "post",
                      //       url: "/sm/dictionaryEnumValue/query.action",
                      //       mode: "payload",
                      //       payload: {
                      //         "query": {
                      //           "query": [
                      //             {
                      //               "field": "smDictionaryEnumGid",
                      //               "type": "eq",
                      //               "value": "56B3C94406A94EE3E055000000000001"
                      //             }
                      //           ],
                      //           "sorted": "seq"
                      //         }
                      //       },
                      //     },
                      //     displayField: "val",
                      //     valueField: "gid",
                      //
                      //   }
                        ],
                      rowOperationItem: [
                        {
                          id: "order-del-operate-btn-2",
                          type: "linkButton",
                          title: "删除",
                          subscribes: [
                            {
                              event: "order-del-operate-btn-2.click",
                              behaviors: [
                                {
                                  type: "request",
                                  dataSource: {
                                    type: "api",
                                    method: "POST",
                                    paramsInQueryString: true,//参数拼在url后面
                                    url: "/ime/uniqueRule/delete.action",
                                    payloadMapping: [{
                                      from: "gid",
                                      to: "id"
                                    }]
                                  },
                                  successPubs: [
                                    // {
                                    //   outside: true,
                                    //   event: "order-unique-table.loadData"
                                    // },
                                    {
                                      outside: true,
                                      event: "@@message.success",
                                      payload: "删除成功"
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ],
                    }}
                  >
                  </FieldArray>
                  {/*<AppTable name="dispatchOrder" config={{
                    "id": "dispatchOrder",
                    "name": "dispatchOrder",
                    "type": "checkbox",//表格单选复选类型
                    "size": "default",//表格尺寸
                    "rowKey": "gid",//主键
                    "onLoadData": true,//初始化是否加载数据
                    "tableTitle": "",//表头信息
                    "width": 600,//表格宽度
                    "showSerial": true,//是否显示序号
                    "editType": false,//是否增加编辑列
                    "page": 1,//当前页
                    "pageSize": 10,//一页多少条
                    "isPager": false,//是否分页
                    "isSearch": false,//是否显示模糊查询
                    "columns": [
                      { title: '规则字段', width: 300, dataIndex: 'imeWorkOrderGid', key: '1' },
                      { title: '正序/逆序', width: 300, dataIndex: 'mdProductInfoGid', key: '2' },

                    ],
                    subscribes: [
                      {
                        event:'arrange-rule-tree-1.onSelect',
                        pubs: [
                          {

                            event: "dispatchOrder.expression",//在某个组件上执行表达式
                            meta: {
                              expression: `
                                let nodeMap = data.eventPayload.info.node.props['data-item'].nodeMap;
                                let query =[];
                                let count = 0;
                                var array = Object.entries(nodeMap);
                                console.log(array);

                                for(let i = 0;i< array.length;i++){
                                  let conditions = {};
                                  if(i==0){
                                    conditions["field"] = array[i][0];
                                    conditions["type"] = "eq";
                                    conditions["value"] = array[i][1];
                                    conditions["operator"] = "and";
                                    if(array.length>1){
                                      conditions["left"] = "(";
                                    }
                                  }
                                   else if (i == array.length-1) {
                                    conditions["right"] = ")";
                                    conditions["field"] = array[i][0];;
                                    conditions["type"] = "eq";
                                    conditions["value"] = array[i][1];
                                    conditions["operator"] = "and";
                                  }
                                  else {
                                    conditions["field"] = array[i][0];;
                                    conditions["type"] = "eq";
                                    conditions["value"] = array[i][1];;
                                    conditions["operator"] = "and";
                                  }
                                  query.push(conditions);
                                };

                                let params = {
                                  "query":{
                                    "query":query
                                  },
                                  "pager":{"page":1,"pageSize":10}
                                };

                                pubsub.publish("dispatchOrder.loadData",params);
                                `
                            }
                          }
                        ]
                        // pubs: [
                        //   {
                        //     event: "dispatchOrder.loadData",
                        //     payload:{
                        //       "query":{
                        //         "query":[
                        //           {
                        //             "left":"(",
                        //             "field":"code",
                        //             "type":"eq",
                        //             "value":"002",
                        //             "right":")",
                        //             "operator":"and"
                        //           }
                        //         ],
                        //         "sorted":"gid asc"
                        //       },
                        //       "pager":{
                        //         "page":"1",
                        //         "pageSize":"3"
                        //       }
                        //     }
                        //   }
                        // ]
                      }
                    ],
                    dataSource: {
                      type: "api",
                      pager:false,
                      method: "POST",
                      url: "/ime/imeTrackOrder/query.action"
                      // type:"customValue",
                      // method: "get",
                      // values: [
                      //   { gid: "1",mdProductInfoGid: "11111111",code: "1234" }
                      // ]
                    },
                  }} />*/}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

OrderArrangeRule.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

function mapStateToProps(props) {
  return {
    onSubmit: () => {
    }
  }
}

let orderArrangeRuleForm = reduxForm({
  config: { id: `that` },
  form: "orderArrangeRuleForm",
})(OrderArrangeRule)


export default connect(mapStateToProps, mapDispatchToProps)(orderArrangeRuleForm)
