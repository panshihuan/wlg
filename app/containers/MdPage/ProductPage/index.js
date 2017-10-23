/*
 *
 * ProductPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col  } from 'antd';
import { Link } from 'react-router';
import AppButton from 'components/AppButton';
import AppTable from '../../../components/AppTable';



export class ProductPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
          <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item>业务建模</Breadcrumb.Item>
              <Breadcrumb.Item>产品</Breadcrumb.Item>
          </Breadcrumb>
          <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
              <Row>
                  <Col span={14} xs={24}>
                      <AppButton config={{
                          id: "productCreateBtn",
                          title: "创建",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: true,
                          subscribes: [
                              {
                                  event: "productCreateBtn.click",
                                  pubs: [
                                      {
                                          event: "@@navigator.push",
                                          payload: {
                                              url: "product/Create"
                                          }
                                      }
                                  ]
                              }
                          ]
                      }}>
                      </AppButton>
                      <AppButton config={{
                          id: "productModifyBtn",
                          title: "修改",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"productTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "productTable.expression",
                                          meta: {
                                              expression: `
                                                  let size = data.eventPayload.length
                                                  console.log(size)
                                                  if(size==1){
                                                    pubsub.publish("productModifyBtn.enabled",true);
                                                  }else{
                                                    pubsub.publish("productModifyBtn.enabled",false);
                                                  }
                                                  `
                                          }
                                      }
                                  ]
                              },
                              {
                                  event:"productTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "productModifyBtn.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "productModifyBtn.click",
                                  behaviors: [
                                      {
                                          type: "fetch",
                                          id: "productTable", //要从哪个组件获取数据
                                          data: "selectedRows",//要从哪个组件的什么属性获取数据
                                          successPubs: [  //获取数据完成后要发送的事件
                                              {
                                                  event: "@@navigator.push",
                                                  mode: "payload&&eventPayload",
                                                  payload: {
                                                      url: "product/Modify"
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
                          id: "productDeleteBtn",
                          title: "删除",
                          type: "primary",
                          size: "large",
                          visible: true,
                          enabled: false,
                          subscribes: [
                              {
                                  event:"productTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "productDeleteBtn.enabled",
                                          payload:true
                                      }
                                  ]
                              },
                              {
                                  event:"productTable.onSelectedRowsClear",
                                  pubs: [
                                      {
                                          event: "productDeleteBtn.enabled",
                                          payload:false
                                      }
                                  ]
                              },
                              {
                                  event: "productTable.onSelectedRows",
                                  pubs: [
                                      {
                                          event: "productDeleteBtn.dataContext"
                                      }
                                  ]
                              },
                              /*{
                                  event: "productDeleteBtn.click",
                                  behaviors: [
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              url: "/ime/mdProductInfo/delete",
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
                                                  event: "productTable.loadData"
                                              }
                                          ]
                                      }
                                  ]
                              }*/
                              {
                                  event: "productDeleteBtn.click",
                                  pubs:[
                                      {

                                              event: "productDeleteBtn.expression",
                                              meta: {
                                              expression: `
                                         resolveFetch({fetch:{id:"productDeleteBtn",data:"dataContext"}}).then(function(value){
                                            //console.log("value11111111111",value)
                                            let ids=[]
                                            for(var i in value){
                                                ids.push(value[i].gid)
                                            }
                                            //console.log("ids1111",ids)
                                            let dataSource = {
                                                type: "api",
                                                method: "POST",
                                                url: "/ime/mdProductInfo/deleteList.action",
                                                mode:"payload",
                                                payload:ids
                                            }
                                            let onSuccess = function(response){
                                                if(response.success){
                                                    pubsub.publish("@@message.success","删除成功")
                                                    pubsub.publish("productTable.loadData")
                                                }else{
                                                    pubsub.publish("@@message.error","删除失败")
                                                }
                                            }
                                            resolveDataSourceCallback({dataSource:dataSource},onSuccess)

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

          <Card bordered={true}>
              <AppTable name="productTable" config={{
                  "id": "productTable",
                  "name": "productTable",
                  "type": "checkbox",//表格单选复选类型
                  "size": "small",//表格尺寸
                  "rowKey": "gid",//主键
                  "onLoadData": true,//初始化是否加载数据
                  "tableTitle": "产品信息",//表头信息
                  "width": "500px",//表格宽度
                  "showSerial": true,//是否显示序号
                  "editType": true,//是否增加编辑列
                  "page": 1,//当前页
                  "pageSize": 10,//一页多少条
                  "isPager": true,//是否分页
                  "isSearch": true,//是否显示模糊查询
                  "columns": [
                      { title: '产品编码', width: 80, dataIndex: 'materialGidRef.code', key: '1' },
                      { title: '产品名称', width: 80, dataIndex: 'materialGidRef.name', key: '2' },
                      { title: 'BOM类型', width: 70, dataIndex: 'bomType', key: '3' },
                      { title: '基本数量', width: 60, dataIndex: 'baseQuantity', key: '4' },
                      { title: '工艺路线', width: 100 , dataIndex: 'routePathRef.name', key: '5'},
                      { title: '虚拟件', width: 50, dataIndex: 'isVirtual', key: '6',columnsType:{"type":"replace","text":{true:"是",false:"否"}} }
                  ],
                  rowOperationItem: [
                      {
                          id: "productLinkBtn",
                          type: "linkButton",
                          title: "删除",
                          subscribes: [
                              {
                                  event: "productLinkBtn.click",
                                  behaviors: [
                                      {
                                          type: "request",
                                          dataSource: {
                                              type: "api",
                                              method: "POST",
                                              paramsInQueryString: true,//参数拼在url后面
                                              url: "/ime/mdProductInfo/delete",
                                              payloadMapping: [{
                                                  from: "gid",
                                                  to: "id"
                                              }]
                                          },
                                          successPubs: [
                                              {
                                                  outside: true,
                                                  event: "productTable.loadData"
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
                      method: 'POST',
                      url: '/ime/mdProductInfo/query.action'
                  }
              }} />
          </Card>
      </div>
    );
  }
}

ProductPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};



function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(ProductPage);
