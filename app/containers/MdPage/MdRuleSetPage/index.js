/*
 *
 * MdRuleSetPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
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
import UploadField from 'components/Form/UploadField'
import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'

import ModalContainer from 'components/ModalContainer'
import AppTable from 'components/AppTable';

import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

const TabPane = Tabs.TabPane;
export class MdRuleSetPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>规则建模</Breadcrumb.Item>
              <Breadcrumb.Item>规则集</Breadcrumb.Item>
          </Breadcrumb>
          <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
              <Row>
                  <Col span={14} xs={24}>
                      <AppButton config={{
                          id: "mrlRuleSetCreate",
                          title: "创建",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "mrlRuleSetCreate.click",
                                  pubs: [
                                      {
                                          event: "@@navigator.push",
                                          payload: {
                                              url: "mdRuleSet/create"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }}>
                          }}></AppButton>
                      <AppButton config={{
                          id: "mrlRuleSetModify",
                          title: "修改",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"mrlRuleSetTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "mrlRuleSetModify.enabled",
                                          payload:true
                                      }
                                  ]
                              },
                              {
                                  event:"mrlRuleSetTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "mrlRuleSetModify.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "mrlRuleSetModify.click",
                                  behaviors: [
                                      {
                                          type: "fetch",
                                          id: "mrlRuleSetTable", //要从哪个组件获取数据
                                          data: "selectedRows",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@navigator.push",
                                                  mode: "payload&&eventPayload",
                                                  payload: {
                                                      url: "mdRuleSet/modify"
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
                          id: "mrlRuleSetDelete",
                          title: "删除",
                          type:"primary",
                          size:"large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"mrlRuleSetTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "mrlRuleSetDelete.enabled",
                                          payload:true
                                      }
                                  ]
                              },
                              {
                                  event:"mrlRuleSetTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "mrlRuleSetDelete.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "mrlRuleSetTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "mrlRuleSetDelete.dataContext"
                                      }
                                  ]
                              },
                              {
                                  event: "mrlRuleSetDelete.click",
                                  pubs: [
                                      {
                                      eventPayloadExpression:`

                                         pubsub.publish("ruleSetDeleteConfirm.openModal")

                                      `
                                      }
                                  ]
                              },
                              {
                                  event: "ruleSetDeleteConfirm.onOk",
                                  behaviors:  [
                                          {
                                              type: "request",
                                              dataSource: {
                                              type: "api",
                                              method: "POST",
                                              url: "/ime/mdRuleSet/delete",
                                              paramsInQueryString:false,//参数拼在url后面
                                              payloadMapping:[{
                                                      from: "dataContext",
                                                      to: "@@Array",
                                                      key: "gid"
                                              }]
                                          },
                                              successPubs: [
                                                  {
                                                      event: "mrlRuleSetTable.loadData"
                                                  }, {
                                                      event: "@@message.success",
                                                      payload: "删除成功"
                                                  }
                                              ],
                                              errorPubs: [
                                                  {
                                                      event: "@@message.error",
                                                      payload: "删除失败"
                                                  }
                                              ]
                                      }
                                  ],

                              }
                          ]
                      }}>
                      </AppButton>
                  </Col>

              </Row>
          </Card>

          <Card bordered={true}>
              <AppTable name="mrlRuleSetTable" config={{
                  "id": "mrlRuleSetTable",
                  "name": "规则集首页",
                  "type": "checkbox",//表格单选复选类型
                  "size": "default",//表格尺寸
                  "rowKey": "gid",//主键
                  "onLoadData": true,//初始化是否加载数据
                  "tableTitle": "规则列表",//表头信息
                  "width": 1200,//表格宽度
                  "showSerial": true,//是否显示序号
                  "editType": true,//是否增加编辑列
                  "page": 1,//当前页
                  "pageSize": 10,//一页多少条
                  "isPager": true,//是否分页
                  "isSearch": true,//是否显示模糊查询
                  "columns": [
                      { title: '规则编码', width: 100, dataIndex: 'code', key: '1' },
                      { title: '规则名称', width: 100, dataIndex: 'name', key: '2' },
                      { title: '规则类型', width: 50, dataIndex: 'ruleTypeGid', key: '3' },
                      { title: '明细枚举类型', width: 50, dataIndex: 'dictionaryEnumRef.name', key: '4' },


                  ],
                  rowOperationItem: [
                      {
                          id: "rowDeleteOperation",
                          type: "linkButton",
                          title: "删除",
                          subscribes: [
                              {
                                  event: "rowDeleteOperation.click",
                                  behaviors: [
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              paramsInQueryString: false,//参数拼在url后面
                                              url: "/ime/mdRuleSet/delete",
                                              payloadMapping: [{
                                                  from: "dataContext",
                                                  to: "@@Array",
                                                  key: "gid"
                                              }]
                                          },
                                          successPubs: [
                                              {
                                                  outside: true,
                                                  event: "mrlRuleSetTable.loadData"
                                              }
                                          ]
                                      }
                                  ]
                              },


                          ]
                      }
                  ],

                  dataSource: {
                      type: 'api',
                      method: 'post',
                      url: '/ime/mdRuleSet/query.action'
                  }
              }} />
          </Card>

          <ModalContainer config={{
              visible: false, // 是否可见，必填*
              enabled: true, // 是否启用，必填*
              id: "ruleSetDeleteConfirm", // id，必填*
              pageId: "ruleSetDeleteConfirm", // 指定是哪个page调用modal，必填*
              type: "confirm", // 默认modal模式，即modal容器，也可选 info success error warning confirm
              title: "规则删除", // title，不传则不显示title
              content: (
                  <div>
                      <p>是否确认？</p>
                  </div>
              ), // 非modal模式使用
              closable: true, // 是否显示右上角关闭按钮，默认不显示
              width: 300, // 宽度，默认520px
              okText: "确定按钮", // ok按钮文字，默认 确定
              cancelText: "取消按钮", // cancel按钮文字，默认 取消
              style: {top: 120}, // style样式
              wrapClassName: "wcd-center", // class样式
              hasFooter: true, // 是否有footer，默认 true
              maskClosable: false, // 点击蒙层是否允许关闭，默认 true
          }}
          >
          </ModalContainer>
          <div className="wrapper">

          </div>
      </div>
    );
  }
}

MdRuleSetPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(MdRuleSetPage);
