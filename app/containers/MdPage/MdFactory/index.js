/*
 *
 * MdFactory
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col  } from 'antd';
import { Link } from 'react-router';
import AppButton from 'components/AppButton';
import AppTable from '../../../components/AppTable';

export class MdFactory extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>业务建模</Breadcrumb.Item>
              <Breadcrumb.Item>工厂</Breadcrumb.Item>
          </Breadcrumb>
          <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
              <Row>
                  <Col span={14} xs={24}>
                      <AppButton config={{
                          id: "factoryCreateBtn",
                          title: "创建",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "factoryCreateBtn.click",
                                  pubs: [
                                      {
                                          event: "@@navigator.push",
                                          payload: {
                                              url: "MdFactory/NewCreate"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }}>
                      </AppButton>
                      <AppButton config={{
                          id: "factoryModifyBtn",
                          title: "修改",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                              {
                                  event:"factoryTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "factoryModifyBtn.enabled",
                                          payload:true
                                      }
                                  ]
                              },
                              {
                                  event:"factoryTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "factoryModifyBtn.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "factoryModifyBtn.click",
                                  behaviors: [
                                      {
                                          type: "fetch",
                                          id: "factoryTable", //要从哪个组件获取数据
                                          data: "selectedRows",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@navigator.push",
                                                  mode: "payload&&eventPayload",
                                                  payload: {
                                                      url: "MdFactory/Modify"
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
                          id: "factoryDeleteBtn",
                          title: "删除",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                            /*  {
                                  event:"factoryTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "factoryDeleteBtn.enabled",
                                          payload:true
                                      }
                                  ]
                              },*/
                              {
                                  event:"factoryTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "factoryDeleteBtn.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "factoryTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "factoryDeleteBtn.dataContext"
                                      }
                                  ]
                              },
                              {
                                  event: "factoryDeleteBtn.click",
                                  behaviors: [
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              url: "/ime/mdFactoryInfo/delete",
                                              paramsInQueryString:true,//参数拼在url后面
                                              payloadMapping:[{
                                                  from: "dataContext",
                                                  to: "@@String",
                                                  key: "gid",
                                                  paramKey:"id"
                                              }]
                                          },
                                          successPubs: [
                                              {
                                                  event: "@@message.success",
                                                  payload: "删除成功"
                                              },
                                              {
                                                  outside: true,
                                                  event: "factoryTable.loadData"
                                              }
                                          ],

                                          errorPubs: [
                                              {
                                                  event: "@@message.error",
                                                  payload: "删除失败,删除的行存在工作中心"
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

          <Card bordered={true}>
              <AppTable name="factoryTable" config={{
                  "id": "factoryTable",
                  "name": "factoryTable",
                  "type": "checkbox",//表格单选复选类型
                  "size": "default",//表格尺寸
                  "rowKey": "gid",//主键
                  "onLoadData": true,//初始化是否加载数据
                  "tableTitle": "产品信息",//表头信息
                  "width": 1500,//表格宽度
                  "showSerial": true,//是否显示序号
                  "editType": true,//是否增加编辑列
                  "page": 1,//当前页
                  "pageSize": 10,//一页多少条
                  "isPager": true,//是否分页
                  "isSearch": true,//是否显示模糊查询
                  "columns": [
                      { title: '工厂编码', width: 100, dataIndex: 'smBusiUnitGidRef.busiUnitCode', key: '1' },
                      { title: '工厂名称', width: 100, dataIndex: 'smBusiUnitGidRef.busiUnitName', key: '2' },
                      { title: '工作中心数量', width: 100, dataIndex: 'workCenterNumber', key: '3' },
                      { title: '产线数量', width: 100, dataIndex: 'lineNumber', key: '4' },
                      { title: '工作单元数量', width: 100 , dataIndex: 'workNuitNumber', key: '5'},
                      { title: '工位数量', width: 100, dataIndex: 'stationNumber', key: '6' },
                      { title: '启用状态', width: 100, dataIndex: 'enable', key: '7' },
                      { title: '创建人', width: 100, dataIndex: 'createBy', key: '8' },
                      { title: '创建时间', width: 100, dataIndex: 'createTime', key: '9' }
                  ],
                  rowOperationItem: [
                      {
                          id: "factoryLinkBtn",
                          type: "linkButton",
                          title: "删除",
                          subscribes: [
                              {
                                  event: "factoryLinkBtn.click",
                                  behaviors: [
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              paramsInQueryString: true,//参数拼在url后面
                                              url: "/ime/mdFactoryInfo/delete",
                                              payloadMapping: [{
                                                  from: "gid",
                                                  to: "id"
                                              }]
                                          },
                                          successPubs: [
                                               {
                                                  event: "@@message.success",
                                                  payload: "删除成功"
                                              },
                                              {
                                                  outside: true,
                                                  event: "factoryTable.loadData"
                                              }
                                          ],
                                          errorPubs: [
                                              {
                                                  event: "@@message.error",
                                                  payload: "删除失败,删除的行存在工作中心"
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
                          event:'factoryTable.onSelectedRows',
                          pubs:[
                              {

                                  event: "factoryTable.expression",//在某个组件上执行表达式
                                  meta: {
                                      expression: `
                                console.log("happy");
                                console.log(data);
                                let selectData = data.eventPayload["0"]
                                console.log(selectData)
                                if(selectData && selectData.workCenterNumber && selectData.workCenterNumber  >0){
                                     pubsub.publish("factoryDeleteBtn.enabled", false);

                                }else{
                                    pubsub.publish("factoryDeleteBtn.enabled", true);
                                }

                               `
                                  }
                              }

                          ]
                      }
                  ],
                  dataSource: {
                      type: 'api',
                      method: 'POST',
                      url: '/ime/mdFactoryInfo/query.action'
                  }
              }} />
          </Card>
      </div>
    );
  }
}

MdFactory.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(MdFactory);
