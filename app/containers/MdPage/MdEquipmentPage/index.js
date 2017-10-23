/*
 *
 * MdEquipmentPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js';
import { Link } from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import AppTable from '../../../components/AppTable';
import TreeField from '../../../components/Form/TreeField';
import AppButton from 'components/AppButton';
import {publishEvents} from 'utils/componentUtil'


export class MdEquipmentPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>业务建模</Breadcrumb.Item>
              <Breadcrumb.Item>设备</Breadcrumb.Item>
          </Breadcrumb>
          <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
              <Row>
                  <Col span={14}>
                      <AppButton config={{
                          id: "createBtn",
                          title: "创建",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "createBtn.click",
                                  behaviors: [
                                      {
                                          type: "fetch",
                                          id: "equipmentTree", //要从哪个组件获取数据
                                          data: "selectNode",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@navigator.push",
                                                  mode: "payload&&eventPayload",
                                                  payload: {
                                                      url: "mdEquipmentDetailPage"
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
                          id: "modifyBtn",
                          title: "修改",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"equipmentTable.onSelectedRows",
                                  pubs:[
                                      {
                                          event: "modifyBtn.expression",//在某个组件上执行表达式
                                          meta: {
                                              expression: `
                                                resolveFetch({fetch:{id:'equipmentTable',data:'selectedRows'}}).then(function(dt){
                                                    if(dt==undefined)
                                                        return
                                                    if(dt.length==1){
                                                        pubsub.publish("modifyBtn.enabled",true);
                                                    }else{
                                                        pubsub.publish("modifyBtn.enabled",false);
                                                    }
                                                })
                                            `
                                          }
                                      }
                                  ]
                              },
                              {
                                  event:"equipmentTable.onSelectedRowsClear",
                                  pubs:[
                                      {
                                          event: "modifyBtn.expression",//在某个组件上执行表达式
                                          meta: {
                                              expression: `
                                                resolveFetch({fetch:{id:'equipmentTable',data:'selectedRows'}}).then(function(dt){
                                                    if(dt==undefined)
                                                        return
                                                    if(dt.length==1){
                                                        pubsub.publish("modifyBtn.enabled",true);
                                                    }else{
                                                        pubsub.publish("modifyBtn.enabled",false);
                                                    }
                                                })
                                            `
                                          }
                                      }
                                  ]
                              },
                              {
                                  event: "modifyBtn.click",
                                  behaviors: [
                                      {
                                          type: "fetch",
                                          id: "equipmentTable", //要从哪个组件获取数据
                                          data: "selectedRows",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@navigator.push",
                                                  mode: "payload&&eventPayload",
                                                  payload: {
                                                      url: "mdEquipmentDetailPage"
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
                          id: "deleteBtn",
                          title: "删除",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"equipmentTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "deleteBtn.enabled",
                                          payload:true
                                      }
                                  ]
                              },
                              {
                                  event:"equipmentTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "deleteBtn.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "equipmentTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "deleteBtn.dataContext"
                                      }
                                  ]
                              },
                              {
                                  event: "deleteBtn.click",
                                  pubs: [
                                      {
                                          event: "deleteBtn.expression",//在某个组件上执行表达式
                                          meta: {
                                              expression: `
                                              resolveFetch({fetch:{id:'equipmentTable',data:'dataContext'}}).then(function(dt){
                                                  let gids = []
                                                  for(var i in dataContext){
                                                    gids.push(dataContext[i].gid)
                                                  }
                                                  console.log(dataContext)
                                                  console.log(dt)
                                                  console.log(gids)
                                                  let dataSource= {
                                                      type: "api",
                                                      mode:"dataContext",
                                                      method: "POST",
                                                      url: "/ime/mdEquipment/deleteList.action"
                                                  };
                                                  resolveDataSourceCallback({dataSource:dataSource, dataContext: gids},
                                                      function(res){
                                                        if(res.success){
                                                            let params = {
                                                              "query":{
                                                                "query":[
                                                                    {
                                                                        left:"(",
                                                                        field:"mdEquipmentTypeGid",
                                                                        type:"eq",
                                                                        value:dt,
                                                                        right:")",
                                                                        operator:"and"
                                                                    }
                                                                ]
                                                              },
                                                              "pager":{"page":1,"pageSize":10}
                                                            };
                                                            pubsub.publish("equipmentTable.loadData",params);
                                                        }
                                                      },
                                                      function(){
                                                      }
                                                  )
                                              })
                                            `
                                          }
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
              <Col span={5}>
                  <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                      <Field config={{
                          id: 'equipmentTree',
                          search: false,
                          enabled: true,
                          visible: true,
                          checkable: false,
                          showLine: true,
                          draggable: false,
                          searchBoxWidth: 300,
                          dataSource: {
                              type: "api",
                              method: "POST",
                              url: '/ime/mdEquipmentType/getEquipmentTypeTree.action'
                          },
                      }} name="equipmentTree"  component={ TreeField } />
                  </Card>
              </Col>
              <Col span={1}></Col>
              <Col span={18}>
                  <Card bordered={true} style={{ marginTop: "20px" }}>
                      <AppTable name="equipmentTable" config={{
                          "id": "equipmentTable",
                          "name": "equipmentTable",
                          "type": "checkbox",//表格单选复选类型
                          "size": "default",//表格尺寸
                          "rowKey": "gid",//主键
                          "onLoadData": false,//初始化是否加载数据
                          "tableTitle": "设备",//表头信息
                          "width": 500,//表格宽度
                          "showSerial": true,//是否显示序号
                          "editType": true,//是否增加编辑列
                          "page": 1,//当前页
                          "pageSize": 10,//一页多少条
                          "isPager": true,//是否分页
                          "isSearch": true,//是否显示模糊查询
                          "columns": [
                              { title: '设备编码', width: 100, dataIndex: 'code', key: '1' },
                              { title: '设备名称', width: 100, dataIndex: 'name', key: '2' },
                              { title: '设备型号', width: 100, dataIndex: 'model', key: '3' },
                              { title: '设备规格', width: 100, dataIndex: 'spec', key: '4' },
                              { title: '设备类型', width: 100, dataIndex: 'mdEquipmentTypeGidRef.name', key: '5' },
                              { title: '计量单位', width: 100, dataIndex: 'mdMeasurementUnitGidRef.name', key: '6' },
                              { title: '设备状态', width: 100, dataIndex: 'status', key: '7' },
                              { title: '设备序列号', width: 120, dataIndex: 'serialNo', key: '8' }
                          ],
                          subscribes: [
                              {
                                  event:'equipmentTree.onSelect',
                                  pubs: [
                                      {

                                          event: "equipmentTable.expression",//在某个组件上执行表达式
                                          meta: {
                                              expression: `
                                              console.log(data.eventPayload.selectedKeys[0])
                                              if(data.eventPayload.selectedKeys[0]!=0){
                                                  let equipmentTypeGid = data.eventPayload.selectedKeys[0];
                                                  let query =[];
                                                  let conditions = {}
                                                  conditions["field"] = "mdEquipmentTypeGid";
                                                  conditions["type"] = "eq";
                                                  conditions["value"] = equipmentTypeGid;
                                                  conditions["operator"] = "and";
                                                  query.push(conditions);
                                                let params = {
                                                  "query":{
                                                    "query":query
                                                  }
                                                };

                                                pubsub.publish("equipmentTable.loadData",params);
                                              }else{
                                                pubsub.publish("equipmentTable.loadData");
                                              }
                                              pubsub.publish("equipmentTable.dataContext",{
                                                eventPayload:data.eventPayload.selectedKeys[0]
                                              });
                                              pubsub.publish("createBtn.dataContext", {
                                                eventPayload:data.eventPayload
                                              });
                                            `
                                          }
                                      }
                                  ]
                              }
                          ],
                          rowOperationItem: [
                              {
                                  id: "delBtn",
                                  type: "linkButton",
                                  title: "删除",
                                  subscribes: [
                                      {
                                          event: "delBtn.click",
                                          behaviors: [
                                              {
                                                  type: "request",
                                                  dataSource: {
                                                      type: "api",
                                                      method: "POST",
                                                      paramsInQueryString: true,//参数拼在url后面
                                                      url: "/ime/mdEquipment/delete.action",
                                                      payloadMapping: [{
                                                          from: "gid",
                                                          to: "id"
                                                      }]
                                                  },
                                                  successPubs: [
                                                      {
                                                          outside:true,
                                                          event: "@@message.success",
                                                          payload:'删除成功!'
                                                      },
                                                      {
                                                          outside: true,
                                                          event: "equipmentTable.loadData"
                                                      }
                                                  ]
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ],
                          dataSource: {
                              type: "api",
                              pager:false,
                              method: "POST",
                              url: "/ime/mdEquipment/query.action"
                          },
                      }} />
                  </Card>



              </Col>
          </Row>

      </div>
    );
  }
}

MdEquipmentPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default reduxForm({
    form: "mdEquipmentForm",
})(MdEquipmentPage)