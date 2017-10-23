/*
 *
 * MdRouteLine
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import { Link } from 'react-router';

import AppButton from 'components/AppButton';
import AppTable from '../../../components/AppTable';

export class MdRouteLine extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>业务建模</Breadcrumb.Item>
              <Breadcrumb.Item>工艺</Breadcrumb.Item>
        </Breadcrumb>
          <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
            <Row>
              <Col span={14} xs={24}>
              <AppButton config={{
                  id: "gy010001",
                  title: "创建",
                  type: "primary",
                  size: "large",
                  visible: true,
                  enabled: true,
                  subscribes: [
                      {
                          event: "gy010001.click",
                          pubs: [
                              {
                                  event: "@@navigator.push",
                                  payload: {
                                      url: "mdRouteLine/create"
                                  }
                              }
                          ]
                      }
                  ]
              }}>
              }}></AppButton>
                  <AppButton config={{
                      id: "gy010002",
                      title: "修改",
                      type: "primary",
                      size: "large",
                      visible: true,
                      enabled: false,
                      subscribes: [
                          {
                              event:"gy010101.onSelectedRows",
                              pubs: [
                                  {
                                      event: "gy010101.expression",
                                      meta: {
                                          expression: `
                                                  let size = data.eventPayload.length
                                                  console.log(data.eventPayload)
                                                  console.log(size)
                                                  if(size==1){
                                                    pubsub.publish("gy010002.enabled",true);
                                                  }else{
                                                    pubsub.publish("gy010002.enabled",false);
                                                  }
                                                  `
                                      }
                                  }
                              ]
                          },
                          {
                              event:"gy010101.onSelectedRowsClear",
                              pubs: [
                                  {
                                      event: "gy010002.enabled",
                                      payload:false
                                  }
                              ]
                          },
                          {
                              event: "gy010002.click",
                              behaviors: [
                                  {
                                      type: "fetch",
                                      id: "gy010101", //要从哪个组件获取数据
                                      data: "selectedRows",//要从哪个组件的什么属性获取数据
                                      successPubs: [  //获取数据完成后要发送的事件
                                          {
                                              event: "@@navigator.push",
                                              mode: "payload&&eventPayload",
                                              payload: {
                                                  url: "mdRouteLine/modify"
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
                      id: "gy010003",
                      title: "删除",
                      type:"primary",
                      size:"large",
                      visible: true,
                      enabled: false,
                      subscribes: [
                          {
                              event:"gy010101.onSelectedRows",
                              pubs: [
                                  {
                                      event: "gy010003.enabled",
                                      payload:true
                                  }
                              ]
                          },
                          {
                              event:"gy010101.onSelectedRowsClear",
                              pubs: [
                                  {
                                      event: "gy010003.enabled",
                                      payload:false
                                  }
                              ]
                          },
                          {
                              event: "gy010101.onSelectedRows",
                              pubs: [
                                  {
                                      event: "gy010003.dataContext"
                                  }
                              ]
                          },
                          {
                              event: "gy010003.click",
                              pubs:[
                                  {
                                      event: "gy010003.expression",
                                      meta:{
                                          expression:`
                                        resolveFetch({fetch:{id:'gy010003',data:'dataContext'}}).then(function(data){
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
                                                url: "/ime/mdRouteLine/deleteList.action",
                                                payload: gids
                                              }
                                              let onSuccess = function(response){
                                                if(response.success) {
                                                    pubsub.publish("@@message.success","删除成功");
                                                    pubsub.publish("gy010101.loadData")
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
                             /* behaviors: [
                                  {
                                      type: "request",
                                      dataSource: {
                                          type: "api",
                                          method: "POST",
                                          url: "/ime/mdRouteLine/delete",
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
                                              event: "gy010101.loadData"
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
              <AppTable name="gy010101" config={{
                  "id": "gy010101",
                  "name": "工艺首页",
                  "type": "checkbox",//表格单选复选类型
                  "size": "default",//表格尺寸
                  "rowKey": "gid",//主键
                  "onLoadData": true,//初始化是否加载数据
                  "tableTitle": "工艺信息",//表头信息
                  "width": 1200,//表格宽度
                  "showSerial": true,//是否显示序号
                  "editType": true,//是否增加编辑列
                  "page": 1,//当前页
                  "pageSize": 10,//一页多少条
                  "isPager": true,//是否分页
                  "isSearch": true,//是否显示模糊查询
                  "columns": [
                      { title: '物料编码', width: 100, dataIndex: 'materialInfoCode', key: '1' },
                      { title: '物料名称', width: 100, dataIndex: 'materialInfoName', key: '2' },
                      { title: '规格', width: 50, dataIndex: 'spec', key: '3' },
                      { title: '型号', dataIndex: 'model', key: '4', width: 50 },
                      { title: '工艺路线编码', dataIndex: 'routeLineCode', key: '5', width: 150 },
                      { title: '工艺路线名称', dataIndex: 'routeLineName', key: '6', width: 150 },
                      { title: '数量', dataIndex: 'outputNum', key: '7', width: 50 },
                      { title: '节拍', dataIndex: 'rhythm', key: '8', width: 50 },

                  ],
                  rowOperationItem: [
                      {
                          id: "gy010004",
                          type: "linkButton",
                          title: "删除",
                          subscribes: [
                              {
                                  event: "gy010004.click",
                                  behaviors: [
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              paramsInQueryString: true,//参数拼在url后面
                                              url: "/ime/mdRouteLine/delete",
                                              payloadMapping: [{
                                                  from: "gid",
                                                  to: "id"
                                              }]
                                          },
                                          successPubs: [
                                              {
                                                  outside: true,
                                                  event: "gy010101.loadData"
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
                      url: '/ime/mdRouteLine/query.action'
                  }
              }} />
          </Card>
      </div>
    );
  }
}

MdRouteLine.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(MdRouteLine);
