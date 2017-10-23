/*
 *
 * OrderIssueRule
 *
 */

import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {Breadcrumb, Card, Row, Col} from 'antd';

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
import UploadField from 'components/Form/UploadField'
import FindbackField from 'components/Form/FindbackField'

export class OrderIssueRule extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>生产管理</Breadcrumb.Item>
          <Breadcrumb.Item>订单下发规则</Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{width: "100%", backgroundColor: "#f9f9f9"}} bodyStyle={{padding: "15px"}}>
          <Row>
            <Col>
              <AppButton config={{
                id: "order-rule-add-btn-1",
                title: "创建",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "order-rule-add-btn-1.click",
                    pubs: [
                      {
                        event: "@@navigator.push",
                        payload: {
                          url: "orderIssueRule/ruleAdd"
                        }
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                id: "order-rule-edit-btn-2",
                title: "修改",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "order-rule-edit-btn-2.click",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "orderDispatchRuleGrig", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            mode: "payload&&eventPayload",
                            payload: {
                              url: "orderIssueRule/ruleEdit"
                            }
                          }
                        ]
                      }
                    ],
                    // pubs: [
                    //   {
                    //     event: "@@navigator.push",
                    //     payload: {
                    //       url: ""
                    //     }
                    //   }
                    // ]
                  },
                  {
                    event: "orderDispatchRuleGrig.onSelectedRows",
                    pubs: [
                      {event: "order-rule-edit-btn-2.dataContext"},
                      {
                        event: "order-rule-edit-btn-2.expression",
                        meta: {
                          expression: `
                            console.log(dataContext);
                            if(dataContext && dataContext.length == 1) {
                              pubsub.publish("order-rule-edit-btn-2.enabled", true);
                            } else {
                              pubsub.publish("order-rule-edit-btn-2.enabled", false);
                            }
                          `
                        }
                      },
                      {
                        event: "order-rule-del-btn-3.enabled",
                        payload: true
                      },
                      {
                        event: "order-rule-del-btn-3.dataContext"
                      }
                    ]
                  },

                  {
                    event: "orderDispatchRuleGrig.onSelectedRowsClear",
                    pubs: [
                      {
                        event: "order-rule-edit-btn-2.enabled",
                        payload: false
                      },
                      {
                        event: "order-rule-del-btn-3.enabled",
                        //sdfsd
                        payload: false
                      }
                    ]
                  },
                  {
                    event: "order-rule-edit-btn-2.click",
                    behaviors: [
                      {
                        type: "fetch",
                        id: "orderDispatchRuleGrig", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            mode: "payload&&eventPayload",
                            payload: {
                              url: "orderIssueRule/ruleEdit"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }}>
              </AppButton>
              <AppButton config={{
                id: "order-rule-del-btn-3",
                title: "删除",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [

                  {
                    event: 'order-rule-del-btn-3.click',
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: "api",
                          method: "post",
                          url: "/ime/imePlanOrderPublishRule/delete.action",
                          payloadMapping: [{
                            from: "dataContext",
                            to: "@@Array",
                            key: 'gid',
                            // paramKey:"ids"
                          }],
                        },
                        successPubs: [
                          {
                            event: "@@message.success",
                            payload: '删除成功!'
                          },
                          {
                            outside: true,
                            event: "orderDispatchRuleGrig.loadData"
                          }
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload: "删除失败"
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
        <Card style={{width: "100%", marginTop: "15px"}} bodyStyle={{padding: "15px"}}>
          <Row>
            <Col span={16}>
              <AppTable name="orderDispatchRuleGrig" config={{
                "id": "orderDispatchRuleGrig",
                "name": "orderDispatchRuleGrig",
                "type": "checkbox",//表格单选复选类型
                "size": "default",//表格尺寸
                "rowKey": "gid",//主键
                "onLoadData": true,//初始化是否加载数据
                "tableTitle": "订单下发规则",//表头信息
                "width": 550,//表格宽度
                "showSerial": true,//是否显示序号
                // "editType": true,//是否增加编辑列
                "page": 1,//当前页
                "pageSize": 10,//一页多少条
                "isPager": true,//是否分页
                "isSearch": true,//是否显示模糊查询
                "columns": [
                  {title: '方案编号', width: 150, dataIndex: 'ruleCode', key: '1'},
                  {title: '方案名称', width: 150, dataIndex: 'ruleName', key: '2'},
                  {title: '固定值', dataIndex: 'fixedValue', key: '3', width: 100},
                  {title: '是否默认方案', dataIndex: 'isDefault', key: '4', width: 150, columnsType:{"type":"replace","text":{true:"是",false:"否"}}},
                ],
                // rowOperationItem: [
                //   {
                //     id: "del-operate-btn-1",
                //     type: "linkButton",
                //     title: "删除",
                //     subscribes: [
                //       {
                //         event: "del-operate-btn-1.click",
                //         behaviors: [
                //           {
                //             type: "request",
                //             dataSource: {
                //               type: "api",
                //               method: "POST",
                //               paramsInQueryString: true,//参数拼在url后面
                //               url: "/ime/imePlanOrderPublishRule/delete.action",
                //               payloadMapping: [{
                //                 from: "gid",
                //                 to: "id"
                //               }]
                //             },
                //             successPubs: [
                //               {
                //                 outside: true,
                //                 event: "orderDispatchRuleGrig.loadData"
                //               }
                //             ]
                //           }
                //         ]
                //       }
                //     ]
                //   }
                // ],
                dataSource: {
                  type: 'api',
                  method: 'post',
                  pager: true,
                  url: '/ime/imePlanOrderPublishRule/query.action'
                },
              }}/>
            </Col>


          </Row>


        </Card>
      </div>
    );
  }
}

OrderIssueRule.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default reduxForm({
  form: "orderIssueRuleForm",
})(OrderIssueRule)
// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch,
//   };
// }
//
// export default connect(null, mapDispatchToProps)(OrderIssueRule);
