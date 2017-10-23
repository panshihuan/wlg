/*
 *
 * OrderUniqueRule
 *
 */

import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import Immutable from 'immutable';
import pubsub from 'pubsub-js'
import {connect} from 'react-redux';
import AppButton from 'components/AppButton'
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
import tinyCache from 'tinycache'

const TabPane = Tabs.TabPane;
import CoreComponent from 'components/CoreComponent'

const validate = values => {
  const errors = {}
  console.error(values.toJS());
  // if (!values.get('ruleCode')) {
  //   errors.code = '必填项'
  // }
  return errors
}
export class OrderUniqueRule extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)

    this.state = Object.assign({
      showTabs: -1,
      showBtns: 0,
      treeNode: null
    }, this.state);

    pubsub.subscribe("order-unique-rule-show.show", (name, data) => {
      let node = (data && data.eventPayload) ? data.eventPayload.info.node.props["data-item"] : this.state.treeNode;
      this.setState({
        treeNode: node
      });
      this.toggleTabs();
    })
  }

  toggleTabs = () => {
    let query = [];
    let conditions = {};
    console.log(this.state.treeNode);
    conditions["field"] = "uniqueRuleTypeGid";
    conditions["type"] = "eq";
    conditions["value"] = this.state.treeNode.id;
    conditions["operator"] = "and";
    query.push(conditions);
    let params = {
      "query": {
        "query": query
      },
      "pager": {"page": 1, "pageSize": 10}
    };


    let dataSource = {
      mode: "dataContext",
      type: "api",
      method: "POST",
      url: "/ime/uniqueRule/query.action"
    }
    if (this.state.treeNode.text == "订单子物料唯一性") {
      pubsub.publish("order-unique-add-btn-1.enabled", true);
      pubsub.publish("order-rule-edit-btn-2.enabled", true);
      resolveDataSource({
        dataSource: dataSource,
        dataContext: params
      }).then(function (data) {
        console.log('data:::', data)
        pubsub.publish("@@form.init", {id: "orderUniqueRuleForm", data: Immutable.fromJS({table1: data.data})})
      })


      this.setState({
        showTabs: 0,
        showBtns: 0
      });
    } else if (this.state.treeNode.text == "工单子物料唯一性") {
      pubsub.publish("order-unique-add-btn-1.enabled", true);
      pubsub.publish("order-rule-edit-btn-2.enabled", true);
      resolveDataSource({
        dataSource: dataSource,
        dataContext: params
      }).then(function (data) {
        console.log('data:::', data)

        pubsub.publish("@@form.init", {id: "orderUniqueRuleForm", data: Immutable.fromJS({table2: data.data})})
      })
      this.setState({
        showTabs: 1,
        showBtns: 0
      });
    } else {
      this.setState({
        showTabs: -1
      });
      pubsub.publish("order-unique-add-btn-1.enabled", false);
      pubsub.publish("order-rule-edit-btn-2.enabled", false);
    }
  }

  callback = (key) => {
    console.log(key);
  }

  render() {
    pubsub.publish("unique-rule-del-btn.enabled",false);
    if(this.state.showTabs < 0) {
      pubsub.publish("order-unique-add-btn-1.enabled", false);
      pubsub.publish("order-rule-edit-btn-2.enabled", false);
    }
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>生产管理</Breadcrumb.Item>
          <Breadcrumb.Item>唯一性规则</Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{width: "100%", backgroundColor: "#f9f9f9"}} bodyStyle={{padding: "15px"}}>
          <Row>
            <Col>
              <AppButton config={{
                id: "order-unique-add-btn-1",
                title: "创建",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "order-unique-add-btn-1.click",
                    pubs: [
                      {
                        event: "self.expression",
                        meta: {
                          expression: `
                            me.setState({
                              showBtns: 1
                            });
                          `
                        }
                      },
                      {
                        event:"order-unique-table.addRow"
                      },
                      {
                        event:"work-order-unique-table.addRow"
                      },

                    ]
                  }
                ]
              }}>
              </AppButton>
              {this.state.showBtns == 0 && <AppButton config={{
                id: "order-rule-edit-btn-2",
                title: "修改",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "order-rule-edit-btn-2.click",
                    pubs: [
                      {
                        event: "self.expression",
                        meta: {
                          expression: `
                            me.setState({
                              showBtns: 1
                            });
                        `
                        }
                      },
                      // {
                      //   event: "@@form.init",
                      //   eventPayloadExpression: `
                      //     console.log(5);
                      //     console.log(dataContext);
                      //     console.log(eventPayload);
                      //     // callback({ id: "orderUniqueRuleForm", data:{} })
                      //   `
                      // },
                      {
                        event: "order-unique-table.activateAll",
                        payload: true
                      }, {
                        event: "work-order-unique-table.activateAll",
                        payload: true
                      }],
                  },
                  // {
                  //   event: "order-unique-table.onSelectedRows",
                  //   pubs: [
                  //     {
                  //       event: "order-rule-edit-btn-2.dataContext"
                  //     },
                  //     {
                  //       event: "order-rule-edit-btn-2.expression",
                  //       meta: {
                  //         expression: `
                  //           console.log("-------------------------------dataContext-------------------------");
                  //           console.log(dataContext);
                  //         `
                  //       }
                  //     },
                  //   ]
                  // }
                ]
              }}>
              </AppButton>}
              {this.state.showBtns == 1 && <AppButton config={{
                id: "order-rule-save-btn",
                title: "保存",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "order-rule-save-btn.click",
                    pubs: [{
                      event: "self.expression",
                      meta: {
                        expression: `
                          me.setState({
                            showBtns: 0
                          });
                        `
                      }
                    }, {
                      event: "order-unique-table.activateAll",
                      payload: false
                    }, {
                      event: "work-order-unique-table.activateAll",
                      payload: false
                    }],
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "POST",
                          url: "/ime/uniqueRule/saveUniqueRuleList.action",
                          // withForm: "orderUniqueRuleForm",
                          bodyExpression: `
                            resolveFetch({fetch:{id: "orderUniqueRuleForm",data: "@@formValues"}}).then(function(data){
                              resolveFetch({fetch:{id: "unique-rule-tree-1",data: "dataContext"}}).then(function(tree){
                                var uniqueRuleTypeGid = tree.info.node.props['data-item'].id;
                                console.log(uniqueRuleTypeGid);
                                console.log(data);
                                data = data.table1 ? data.table1 : data.table2;
                                if(data && data.length >= 0) {
                                  for(var i = 0; i < data.length; i++) {
                                    if(!data[i].uniqueRuleTypeGid) {
                                      data[i].uniqueRuleTypeGid = uniqueRuleTypeGid;
                                    }
                                  }
                                }
                                callback(data);
                              })


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
                id: "unique-rule-del-btn",
                title: "删除",
                visible: true,
                enabled: false,
                type: 'primary',
                subscribes: [
                  {
                    event: "order-unique-table.onSelectedRows",
                    pubs: [
                      {
                        event: "order-rule-edit-btn-2.dataContext"
                      },
                      {
                        event: "unique-rule-del-btn.dataContext"
                      },
                      {
                        event: "unique-rule-del-btn.expression",
                        meta: {
                          expression: `
                            console.error(dataContext);
                            if(dataContext) {
                              pubsub.publish("unique-rule-del-btn.enabled", true);
                            } else {
                              pubsub.publish("unique-rule-del-btn.enabled", false);
                            }
                          `
                        }
                      }
                    ]
                  },
                  {
                    event: "work-order-unique-table.onSelectedRows",
                    pubs: [
                      {
                        event: "unique-rule-del-btn.dataContext"
                      },
                      {
                        event: "unique-rule-del-btn.expression",
                        meta: {
                          expression: `
                            console.error(dataContext);
                            if(dataContext) {
                              pubsub.publish("unique-rule-del-btn.enabled",true);
                            } else {
                              pubsub.publish("unique-rule-del-btn.enabled",false);
                            }


                          `
                        }
                      }
                    ]
                  },
                  {
                    event: 'unique-rule-del-btn.click',
                    behaviors: [
                      {
                        type: "fetch",
                        id: "order-unique-table", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@message.success",
                            eventPayloadExpression: `
                              console.log(me.state);
                              console.log("eventPayload1",eventPayload)
                              let dataSource = {
                                type: "api",
                                method: "POST",
                                url: "/ime/uniqueRule/delete.action?id="+eventPayload.gid
                              }
                              resolveDataSource({dataSource:dataSource}).then((function(response){
                                if(response.success) {
                                  pubsub.publish("@@message.success","删除成功");
                                } else {
                                  pubsub.publish("@@message.error","删除失败");
                                }
                                pubsub.publish("order-unique-rule-show.show")
                              }).bind(this))
                            `,
                          }
                        ]
                      },
                      {
                        type: "fetch",
                        id: "work-order-unique-table", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@message.success",
                            eventPayloadExpression: `
                              console.log("eventPayload1",eventPayload)
                              if(eventPayload) {
                                let dataSource = {
                                  type: "api",
                                  method: "POST",
                                  url: "/ime/uniqueRule/delete.action?id=" + eventPayload.gid
                                }

                                resolveDataSource({dataSource:dataSource}).then((function(response){
                                  if(response.success) {
                                    pubsub.publish("@@message.success","删除成功");
                                  } else {
                                    pubsub.publish("@@message.error","删除失败");
                                  }
                                  pubsub.publish("order-unique-rule-show.show");
                                }).bind(this));

                              }
                            `,
                          }
                        ]
                      }
                    ]
                    // behaviors: [
                    //   {
                    //     type: "request",
                    //     dataSource: {
                    //       type: "api",
                    //       method: "post",
                    //       url: "/ime/mdMrlTimeProgram/delete.action",
                    //       payloadMapping: [{
                    //         from: "dataContext",
                    //         to: "@@Array",
                    //         key: 'gid',
                    //         // paramKey:"ids"
                    //       }],
                    //     },
                    //     successPubs: [
                    //       {
                    //         event: "@@message.success",
                    //         payload: '删除成功!'
                    //       },
                    //       {
                    //         outside: true,
                    //         event: "order-unique-table.loadData"
                    //       }
                    //     ],
                    //     errorPubs: [
                    //       {
                    //         event: "@@message.error",
                    //         payload: "删除失败"
                    //       }
                    //     ]
                    //   }
                    // ]
                  },
                ]
              }}>
              </AppButton>
            </Col>
          </Row>
        </Card>
        <Row>
          <Col span={5}>
            <Card bordered={true} style={{width: "100%", marginRight: "50px", marginTop: "20px", minHeight: "710px"}}
                  bodyStyle={{padding: "15px"}}>
              <Field config={{
                id: 'unique-rule-tree-1',
                search: false,
                enabled: true,
                visible: true,
                // defaultExpandedKeys: ['0-0-0', '0-0-1'],
                // defaultSelectedKeys: ['0-0-0', '0-0-1'],
                // defaultCheckedKeys: ['0-0-0', '0-0-1'],
                checkable: false,
                showTabsLine: false,
                draggable: false,
                searchBoxWidth: 300,
                dataSource: {
                  type: "api",
                  method: "POST",
                  url: '/ime/uniqueRule/findUniqueRuleByEnumId.action'
                },
                subscribes: [
                  {
                    event: 'unique-rule-tree-1.onSelect',
                    pubs: [
                      {
                        event: "order-unique-rule-show.show"
                      },
                      {
                        event: "unique-rule-tree-1.dataContext"
                      }
                      // {
                      //   event: "self.expression",//在某个组件上执行表达式
                      //   eventPayloadExpression: `
                      //         console.log(data);
                      //         `
                      //
                      // }

                    ]
                  }
                ],
              }} name="tree" component={TreeField}/>
            </Card>
          </Col>
          <Col span={1}>

          </Col>

          <Col span={18}>
            <Card bordered={true} style={{marginTop: "20px"}}>
              {this.state.showTabs == 0 ? <Tabs visible={false} defaultActiveKey="tabs-1" onChange={this.callback}>
                <TabPane tab="订单子物料唯一性" key="tabs-1">
                  <FieldArray
                    id="order-unique-table"
                    name="table1"
                    component={TableField}
                    config={{
                      "id": "order-unique-table",
                      "name": "order-unique-table",
                      "rowKey": "gid",
                      "form": "orderUniqueRuleForm",
                      "type": "radio", //表格单选（radio）复选（checkbox）类型
                      "addButton": false, //是否显示默认增行按钮
                      "unEditable": true, //初始化是否都不可编辑
                      "showSelect": true,
                      // "dataSource": {
                      //   type: "api",
                      //   method: "post",
                      //   url: "/ime/uniqueRule/query.action"
                      // },
                      columns: [{
                        "id": "order-unique-table-selectField-1",
                        "enabled": true,
                        "type": "selectField",
                        "title": "规则字段",
                        "name": "filedName",
                        "form": "orderUniqueRuleForm",
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
                                  "value": "56B3C94406A94EE3E055000000000001"
                                }
                              ],
                              "sorted": "seq"
                            }
                          },
                        },
                        displayField: "val",
                        valueField: "gid",

                      }],
                      rowOperationItem: [
                        {
                          id: "order-del-operate-btn-1",
                          type: "linkButton",
                          title: "删除",
                          subscribes: [
                            {
                              event: "order-del-operate-btn-1.click",
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
                </TabPane>
              </Tabs> : ''}
              {this.state.showTabs == 1 ? <Tabs defaultActiveKey="tabs-2" onChange={this.callback}>
                <TabPane tab="工单子物料唯一性" key="tabs-2">
                  <FieldArray
                    id="work-order-unique-table"
                    name="table2"
                    component={TableField}
                    config={{
                      "id": "work-order-unique-table",
                      "name": "work-order-unique-table",
                      "rowKey": "gid",
                      "form": "orderUniqueRuleForm",
                      "type": "radio", //表格单选（radio）复选（checkbox）类型
                      "addButton": false, //是否显示默认增行按钮
                      "unEditable": true, //初始化是否都不可编辑
                      "showSelect": true,
                      "dataSource": {
                        type: "api",
                        method: "post",
                        url: "/ime/uniqueRule/query.action"
                      },
                      columns: [{
                        "id": "order-unique-table-selectField-1",
                        "enabled": true,
                        "type": "selectField",
                        "title": "规则字段",
                        "name": "filedName",
                        "form": "orderUniqueRuleForm",
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
                                  "value": "56B3C94406A94EE3E055000000000001"
                                }
                              ],
                              "sorted": "seq"
                            }
                          },
                        },
                        displayField: "val",
                        valueField: "gid"
                      }],
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
                </TabPane>
              </Tabs> : ''}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

OrderUniqueRule.propTypes = {
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


let orderUniqueRuleForm = reduxForm({
  config: {id: `self`},
  validate,
  form: "orderUniqueRuleForm",
})(OrderUniqueRule)

export default connect(mapStateToProps, mapDispatchToProps)(orderUniqueRuleForm)

