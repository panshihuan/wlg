/*
 *
 * CalendarPage
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import pubsub from 'pubsub-js'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable'
import AppTable from 'components/AppTable';
import AppButton from "components/AppButton"
import TreeField from 'components/Form/TreeField';
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import TextField from 'components/Form/TextField';
import FindbackField from 'components/Form/FindbackField';
import SelectField from 'components/Form/SelectField'
import SwitchField from 'components/Form/SwitchField'

export class CalendarPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>系统管理</Breadcrumb.Item>
              <Breadcrumb.Item>日历</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
              <Card bordered={true}
                    style={{width: "100%", marginRight: "20px", marginTop: "20px", minHeight: "20px","backgroundColor": "rgba(247, 247, 247, 1)"}}
                    bodyStyle={{padding: "15px"}}>

                  <Col span={8} xs={24}>
                      <AppButton config={{
                          id: "CalendarCreateBtn",
                          title: "创建",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "CalendarCreateBtn.click",
                                  pubs: [
                                      {
                                          event: "@@navigator.push",
                                          payload: {
                                              url: "calendar/create"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }}/>
                      <AppButton config={{
                          id: "CalendarModifyBtn",
                          title: "修改",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"CalendarTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "CalendarModifyBtn.enabled",
                                          payload:true
                                      }
                                  ]
                              },
                              {
                                  event:"CalendarTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "CalendarModifyBtn.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "CalendarModifyBtn.click",
                                  behaviors: [
                                      {
                                          type: "fetch",
                                          id: "CalendarTable", //要从哪个组件获取数据
                                          data: "selectedRows",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@navigator.push",
                                                  mode: "payload&&eventPayload",
                                                  payload: {
                                                      url: "calendar/modify"
                                                  }
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ]
                      }}/>
                      {/*<AppButton config={{
                          id: "CalendarDeleteBtn",
                          title: "删除",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event: "MenuCreateBtn.click",
                                  pubs: [
                                      {
                                          event: "MenuCreateBtn.expression",
                                          meta: {
                                              expression: `
                                                        let formData = {};
                                                        //清空表单
                                                        pubsub.publish("@@form.init", {id: "MenuForm", data: formData});
                                                  `
                                          }

                                      },
                                  ]
                              }
                          ]
                      }}/>*/}
                      <AppButton config={{
                          id: "CalendarRuleManageBtn",
                          title: "维护规则",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"CalendarTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "CalendarRuleManageBtn.enabled",
                                          payload:true
                                      }
                                  ]
                              },
                              {
                                  event:"CalendarTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "CalendarRuleManageBtn.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "CalendarRuleManageBtn.click",
                                  behaviors: [
                                      {
                                          type: "fetch",
                                          id: "CalendarTable", //要从哪个组件获取数据
                                          data: "selectedRows",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@navigator.push",
                                                  mode: "payload&&eventPayload",
                                                  payload: {
                                                      url: "calendar/manageRule"
                                                  }
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ]
                      }}/>
                      <AppButton config={{
                          id: "CalendarPreviewBtn",
                          title: "日历预览",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event: "MenuCreateBtn.click",
                                  pubs: [
                                      {
                                          event: "MenuCreateBtn.expression",
                                          meta: {
                                              expression: `
                                                        let formData = {};
                                                        //清空表单
                                                        pubsub.publish("@@form.init", {id: "MenuForm", data: formData});
                                                  `
                                          }

                                      },
                                  ]
                              }
                          ]
                      }}/>
                      {/*<AppButton config={{
                          id: "ShiftManageBtn",
                          title: "定义班次",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "MenuCreateBtn.click",
                                  pubs: [
                                      {
                                          event: "MenuCreateBtn.expression",
                                          meta: {
                                              expression: `
                                                        let formData = {};
                                                        //清空表单
                                                        pubsub.publish("@@form.init", {id: "MenuForm", data: formData});
                                                  `
                                          }

                                      },
                                  ]
                              }
                          ]
                      }}/>*/}
                  </Col>
              </Card>
          </Row>

          <Row>
              <Card bordered={true}>
                  <AppTable name="CalendarTable" config={{
                      "id": "CalendarTable",
                      "name": "CalendarTable",
                      "type": "radio",//表格单选复选类型
                      "size": "default",//表格尺寸
                      "rowKey": "gid",//主键
                      "onLoadData": true,//初始化是否加载数据
                      "tableTitle": "日历列表",//表头信息
                      "width": 900,//表格宽度
                      "showSerial": true,//是否显示序号
                      "editType": true,//是否增加编辑列
                      "page": 1,//当前页
                      "pageSize": 10,//一页多少条
                      "isPager": true,//是否分页
                      "isSearch": true,//是否显示模糊查询
                      "columns": [
                          { title: '日历编码', width: 100, dataIndex: 'calendarCode', key: '1' },
                          { title: '日历名称', width: 100, dataIndex: 'calendarName', key: '2' },

                      ],
                      rowOperationItem: [
                          {
                              id: "CalendarTableDeleteLinkBtn",
                              type: "linkButton",
                              title: "删除",
                              subscribes: [
                                  {
                                      event: "CalendarTableDeleteLinkBtn.click",
                                      behaviors: [
                                          {
                                              type: "request",
                                              dataSource: {
                                                  type: "api",
                                                  method: "POST",
                                                  paramsInQueryString: true,//参数拼在url后面
                                                  url: "/sm/calendar/delete",
                                                  payloadMapping: [{
                                                      from: "gid",
                                                      to: "id"
                                                  }]
                                              },
                                              successPubs: [
                                                  {
                                                      outside: true,
                                                      event: "CalendarTable.loadData"
                                                  }
                                              ]
                                          }
                                      ]
                                  },


                              ]
                          }
                      ],
                      subscribes:[
                          {
                              event:'CalendarTable.onSelectedRows',
                              pubs:[
                                  {
                                      event:''
                                  }
                              ]
                          }
                      ],
                      dataSource: {
                          type: 'api',
                          method: 'post',
                          url: '/sm/calendar/query.action'
                      }
                  }} />
              </Card>

          </Row>
      </div>
    );
  }
}

CalendarPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(CalendarPage);
