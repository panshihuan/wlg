/*
 *
 * ImeQcKeyModulePage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import { Link } from 'react-router';

import AppButton from 'components/AppButton';
import AppTable from '../../../components/AppTable';

export class ImeQcKeyModulePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>质量管理</Breadcrumb.Item>
              <Breadcrumb.Item>关键件</Breadcrumb.Item>
          </Breadcrumb>
          <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
              <Row>
                  <Col span={14} xs={24}>
                      <AppButton config={{
                          id: "imeQcKeyModuleCreate",
                          title: "创建",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "imeQcKeyModuleCreate.click",
                                  pubs: [
                                      {
                                          event: "@@navigator.push",
                                          payload: {
                                              url: "imeQcKeyModule/create"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }}>

                      </AppButton>
                      <AppButton config={{
                          id: "imeQcKeyModuleModify",
                          title: "修改",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"imeQcKeyModuleTable.onSelectedRows",
                                  pubs: [
                                      {

                                          event: "imeQcKeyModuleTable.expression",
                                          meta: {
                                              expression: `
                                                  let size = data.eventPayload.length
                                                  console.log(size)
                                                  if(size==1){
                                                    pubsub.publish("imeQcKeyModuleModify.enabled",true);
                                                  }else{
                                                    pubsub.publish("imeQcKeyModuleModify.enabled",false);
                                                  }
                                                  `
                                          }
                                      }
                                  ]
                              },
                              {
                                  event:"imeQcKeyModuleTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "imeQcKeyModuleModify.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "imeQcKeyModuleModify.click",
                                  behaviors: [
                                      {
                                          type: "fetch",
                                          id: "imeQcKeyModuleTable", //要从哪个组件获取数据
                                          data: "selectedRows",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@navigator.push",
                                                  mode: "payload&&eventPayload",
                                                  payload: {
                                                      url: "imeQcKeyModule/modify"
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
                          id: "imeQcKeyModuleDelete",
                          title: "删除",
                          type:"primary",
                          size:"large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"imeQcKeyModuleTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "imeQcKeyModuleDelete.enabled",
                                          payload:true
                                      }
                                  ]
                              },
                              {
                                  event:"imeQcKeyModuleTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "imeQcKeyModuleDelete.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "imeQcKeyModuleTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "imeQcKeyModuleDelete.dataContext"
                                      }
                                  ]
                              },
                              {
                                  event: "imeQcKeyModuleDelete.click",
                                  pubs:[
                                      {
                                          event: "imeQcKeyModuleDelete.expression",
                                          meta:{
                                              expression:`
                                        resolveFetch({fetch:{id:'imeQcKeyModuleDelete',data:'dataContext'}}).then(function(data){
                                              console.log(data)
                                              let gids = []
                                              for(var i=0;i<data.length;i++){
                                                gids.push(data[i].gid)
                                              }
                                              console.log(gids)
                                              let dataSource = {
                                                type: "api",
                                                mode:"payload",
                                                method: "POST",
                                                url: "/ime/imeQcKeyModule/delete.action",
                                                payload: gids
                                              }
                                              let onSuccess = function(response){
                                                if(response.success) {
                                                    pubsub.publish("@@message.success","删除成功");
                                                    pubsub.publish("imeQcKeyModuleTable.loadData");
                                                }
                                                  else {
                                                    pubsub.publish("@@message.error","删除失败");
                                                  }
                                              }
                                              resolveDataSourceCallback({dataSource:dataSource},onSuccess)

                                        })
                                            `
                                          }
                                      }
                                  ],
                                  /*  behaviors: [
                                        {
                                            type: "request",
                                            dataSource: {
                                                type: "api",
                                                method: "POST",
                                                url: "/ime/mdDefOperation/delete",
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
                                                    event: "gx010101.loadData"
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
                                    ]*/
                              }
                          ]
                      }}>
                      </AppButton>
                  </Col>
              </Row>
          </Card>

          <Card bordered={true}>
              <AppTable name="imeQcKeyModuleTable" config={{
                  "id": "imeQcKeyModuleTable",
                  "name": "关键件首页",
                  "type": "checkbox",//表格单选复选类型
                  "size": "default",//表格尺寸
                  "rowKey": "gid",//主键
                  "onLoadData": true,//初始化是否加载数据
                  "tableTitle": "关键件信息",//表头信息
                  "width": 1000,//表格宽度
                  "showSerial": true,//是否显示序号
                  "editType": true,//是否增加编辑列
                  "page": 1,//当前页
                  "pageSize": 10,//一页多少条
                  "isPager": true,//是否分页
                  "isSearch": true,//是否显示模糊查询
                  "columns": [
                      { title: '序列件', width: 140, dataIndex: 'barCode', key: '1' },
                      { title: '产品编码', width: 150, dataIndex: 'mdProductInfoGidRef.materialGidRef.code', key: '2' },
                      { title: '产品名称', width: 140, dataIndex: 'mdProductInfoGidRef.materialGidRef.name', key: '3' },
                      { title: '生产工单编号', width: 150, dataIndex: 'imeWorkOrderGidRef.code', key: '4' },
                      { title: '规格', width: 80, dataIndex: 'mdProductInfoGidRef.materialGidRef.spec', key: '5' },
                      { title: '型号', dataIndex: 'mdProductInfoGidRef.materialGidRef.model', key: '6', width: 100 },
                      { title: '单位', dataIndex: 'mdProductInfoGidRef.materialGidRef.measurementUnitGidRef.name', key: '7', width: 70 },
                      { title: '数量', dataIndex: 'amount', key: '8', width: 80 },
                  ],
                  rowOperationItem: [
                      {
                          id: "imeQcKeyModuleDelete01",
                          type: "linkButton",
                          title: "删除",
                          subscribes: [
                              {
                                  event: "imeQcKeyModuleDelete01.click",
                                  behaviors: [
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              paramsInQueryString: false,//参数拼在url后面
                                              url: "/ime/imeQcKeyModule/delete",
                                              bodyExpression:`
                                              let id = dataContext.gid
                                                  let gids=[]
                                                  if(id){
                                                    gids.push(id)
                                                  }
                                                  console.log(gids)
                                                callback(gids)
                                               `
                                          },
                                          successPubs: [
                                              {
                                                  outside:true,
                                                  event: "@@message.success",
                                                  payload:'删除成功!'
                                              },
                                              {
                                                  outside:true,
                                                  event: "imeQcKeyModuleTable.loadData",
                                              }
                                          ],
                                          errorPubs: [
                                              {
                                                  event: "@@message.error",
                                                  payload:'删除失败!'
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
                      pager:true,
                      url: '/ime/imeQcKeyModule/query.action'
                  }
              }} />
          </Card>

      </div>
    );
  }
}

ImeQcKeyModulePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(ImeQcKeyModulePage);
