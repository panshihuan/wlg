/*
 *
 * MdDefOperationPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import { Link } from 'react-router';

import AppButton from 'components/AppButton';
import AppTable from '../../../components/AppTable';


export class MdDefOperationPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>业务建模</Breadcrumb.Item>
              <Breadcrumb.Item>工序</Breadcrumb.Item>
          </Breadcrumb>
          <div className="wrapper">
              <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                    bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                  <Row>
                      <Col span={14} xs={24}>
                          <AppButton config={{
                              id: "gx010001",
                              title: "创建",
                              type: "primary",
                              size: "large",
                              visible: true,
                              enabled: true,
                              subscribes: [
                                  {
                                      event: "gx010001.click",
                                      pubs: [
                                          {
                                              event: "@@navigator.push",
                                              payload: {
                                                  url: "mdDefOperation/create"
                                              }
                                          }
                                      ]
                                  }
                              ]
                          }}>
                          </AppButton>
                          <AppButton config={{
                              id: "gx010002",
                              title: "修改",
                              type: "primary",
                              size: "large",
                              visible: true,
                              enabled: false,
                              subscribes: [
                                  {
                                      event:"gx010101.onSelectedRows",
                                      pubs: [
                                          {
                                              event: "gx010101.expression",
                                              meta: {
                                                  expression: `
                                                  let size = data.eventPayload.length
                                                  console.log(size)
                                                  if(size==1){
                                                    pubsub.publish("gx010002.enabled",true);
                                                  }else{
                                                    pubsub.publish("gx010002.enabled",false);
                                                  }
                                                  `
                                              }
                                          }
                                      ]
                                  },
                                  {
                                      event:"gx010101.onSelectedRowsClear",
                                      pubs: [
                                          {
                                              event: "gx010002.enabled",
                                              payload:false
                                          }
                                      ]
                                  },
                                  {
                                      event: "gx010002.click",
                                      behaviors: [
                                          {
                                              type: "fetch",
                                              id: "gx010101", //要从哪个组件获取数据
                                              data: "selectedRows",//要从哪个组件的什么属性获取数据
                                              successPubs: [  //获取数据完成后要发送的事件
                                                  {
                                                      event: "@@navigator.push",
                                                      mode: "payload&&eventPayload",
                                                      payload: {
                                                          url: "mdDefOperation/modify"
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
                              id: "gx010003",
                              title: "删除",
                              type:"primary",
                              size:"large",
                              visible: true,
                              enabled: false,
                              subscribes: [
                                  {
                                      event:"gx010101.onSelectedRows",
                                      pubs: [
                                          {
                                              event: "gx010003.enabled",
                                              payload:true
                                          }
                                      ]
                                  },
                                  {
                                      event:"gx010101.onSelectedRowsClear",
                                      pubs: [
                                          {
                                              event: "gx010003.enabled",
                                              payload:false
                                          }
                                      ]
                                  },
                                  {
                                      event: "gx010101.onSelectedRows",
                                      pubs: [
                                          {
                                              event: "gx010003.dataContext"
                                          }
                                      ]
                                  },
                                  {
                                      event: "gx010003.click",
                                      pubs:[
                                          {
                                              event: "gx010003.expression",
                                              meta:{
                                                  expression:`
                                        resolveFetch({fetch:{id:'gx010003',data:'dataContext'}}).then(function(data){
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
                                                url: "/ime/mdDefOperation/deleteList.action",
                                                payload: gids
                                              }
                                              let onSuccess = function(response){
                                                if(response.success) {
                                                    pubsub.publish("@@message.success","删除成功");

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
                  <AppTable name="gx010101" config={{
                      "id": "gx010101",
                      "name": "工序首页",
                      "type": "checkbox",//表格单选复选类型
                      "size": "default",//表格尺寸
                      "rowKey": "gid",//主键
                      "onLoadData": true,//初始化是否加载数据
                      "tableTitle": "工序信息",//表头信息
                      "width": 1500,//表格宽度
                      "showSerial": true,//是否显示序号
                      "editType": true,//是否增加编辑列
                      "page": 1,//当前页
                      "pageSize": 10,//一页多少条
                      "isPager": true,//是否分页
                      "isSearch": true,//是否显示模糊查询
                      "columns": [
                          { title: '工序编码', width: 100, dataIndex: 'mdDefOperationCode', key: '1' },
                          { title: '工序名称', width: 80, dataIndex: 'mdDefOperationName', key: '2' },
                          { title: '工序类型', width: 50, dataIndex: 'mdDefOperationTypeName', key: '3' },
                          { title: '工作中心', dataIndex: 'mdFactoryWorkCenterName', key: '4', width: 80 },
                          { title: '产线', dataIndex: 'mdFactoryLineName', key: '5', width: 80 },
                          { title: '工作单元', dataIndex: 'mdFactoryWorkUnitName', key: '6', width: 80 },
                          { title: '工位', dataIndex: 'mdFactoryStationName', key: '7', width: 80 },
                          { title: '加工方式', dataIndex: 'processingModeName', key: '8', width: 50 },
                          { title: '检验工序', dataIndex: 'processTest', key: '9', width: 50 ,columnsType:{"type":"replace","text":{1:"是",0:"否"}}},
                          { title: '派工单产生', dataIndex: 'worksheetGenarationModeName', key: '10', width: 80 },
                          { title: '报工方式', dataIndex: 'businessModeName', key: '11', width: 70 }

                      ],
                      rowOperationItem: [
                          {
                              id: "gx010004",
                              type: "linkButton",
                              title: "删除",
                              subscribes: [
                                  {
                                      event: "gx010004.click",
                                      behaviors: [
                                          {
                                              type: "request",
                                              dataSource: {
                                                  type: "api",
                                                  method: "POST",
                                                  paramsInQueryString: true,//参数拼在url后面
                                                  url: "/ime/mdDefOperation/delete",
                                                  payloadMapping: [{
                                                      from: "gid",
                                                      to: "id"
                                                  }]
                                              },
                                              successPubs: [
                                                  {
                                                      outside: true,
                                                      event: "gx010101.loadData"
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
                          url: '/ime/mdDefOperation/query.action'
                      }
                  }} />
              </Card>

          </div>
      </div>
    );
  }
}

MdDefOperationPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(MdDefOperationPage);
