import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col ,Tabs} from 'antd';
import pubsub from 'pubsub-js'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable'
import AppTable from 'components/AppTable';
import AppButton from "components/AppButton"
import RadiosField from 'components/Form/RadiosField'
import TreeField from 'components/Form/TreeField';
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'


export class ReferenceModalPage extends React.PureComponent {
  constructor(props) {
    super(props);

  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div>
          <AppTable name="referenceTable" config={{
            "id": "referenceTable",
            "name": "referenceTable",
            "type": "checkbox",//表格单选复选类型
            "size": "small",//表格尺寸
            "rowKey": "gid",//主键
            "onLoadData": false,//初始化是否加载数据
            "editType": false,
            "isPager": true,//是否分页
            "isUpdown": false,//是否显示需要上下移的按钮
            "isSelectable":true,
            "isSearch": true,
            "width":"2000",
            "conditions":[{"dataIndex":"code"}],
            "columns": [
              {title: '生产工单编号', width: 100, dataIndex: 'code', key: '1'},
              {title: '来源订单', width: 100, dataIndex: 'planOrderGidRef.code', key: '2'},
              {title: '产品编号', dataIndex: 'productGidRef.materialGidRef.code', key: '3', width: 100},
              {title: '产品名称', dataIndex: 'productGidRef.materialGidRef.name', key: '4', width: 100},
              {title: '数量单位', width: 100, dataIndex: 'productGidRef.materialGidRef.measurementUnitGidRef.name', key: '5'},
              {title: '计划数量', dataIndex: 'planQty', key: '6', width: 100},
              {title: '本批数量', dataIndex: 'actualQty', key: '7', width: 100},
              {title: '计划开始日期', width: 100, dataIndex: 'workOrderBeginTime', key: '8',columnsType:{"type":"date","format":"yyyy-MM-dd"}},
              {title: '交付日期', width: 100, dataIndex: 'deliverTime', key: '9',columnsType:{"type":"date","format":"yyyy-MM-dd"}},
              {title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '10', width: 100},
              {title: '产线', dataIndex: 'productionLineGidRef.lineName', key: '11', width: 100},
              {title: '产线类型', width: 100, dataIndex: 'productionLineGidRef.lineType', key: '12'},
              {title: '工单顺序', dataIndex: 'workOrderSeq', key: '13', width: 100},
              {title: '工艺路线', dataIndex: 'routeGidRef.name', key: '14', width: 100},
              {title: '工单类型', width: 100, dataIndex: 'workOrderTypeGid', key: '15'},
              {title: '工单状态', dataIndex: 'workOrderStatusGid', key: '16', width: 100},
              {title: '工单BOM状态', dataIndex: 'workOrderBomStatusGid', key: '17', width: 100}
            ],
            dataSource: {
              type: 'api',
              method: 'post',
              pager:true,
              url: '/ime/imeWorkOrder/query.action',
            },
            subscribes:[
              {
                event:"referenceTable.onTableTodoAny",
                pubs:[
                  {
                    event:"referenceTable.loadData",
                    eventPayloadExpression:`
                          let payload = {"eventPayload":{"query":{"query":
                            [
                              {"operator":"and","field":"workOrderStatusGid", "type": "eq", "value": "40"},
                              {"operator":"and","field":"createStatus", "type": "ne", "value": "1"}
                            ]
                          }
                        }
                      }
                      callback(payload);
                    `
                  }
                ]
              }
            ]
          }}/>
          <Row>
              <Col span={5} offset={19}>
                  <AppButton config={{
                    id: "referenceSubmitButton",
                    title: "确定",
                    type: "primary",
                    size: "large",
                    visible: true,
                    enabled: false,
                    subscribes: [
                      {
                        event: "referenceSubmitButton.click",
                        behaviors:[
                          {
                            type: "fetch",
                            id: "referenceTable", //要从哪个组件获取数据
                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                            successPubs: [
                              {
                                event:"@@message.success",
                                eventPayloadExpression:`
                                  if(eventPayload != undefined)
                                  {
                                      let params = [];
                                      for(var i =0 ;i<eventPayload.length;i++){
                                        params.push(eventPayload[i].gid)
                                      }
                                      let dataSource = {
                                        type:'api',
                                        method:'post',
                                        mode:"payload",
                                        url:'/ime/imeLogisticsOrder/refCreate.action',
                                        payload:params
                                      }
                                      let onSuccess = function(response){
                                        if(response.success){
                                          callback("参照生成成功");
                                          pubsub.publish("referenceGeneration.onCancel");
                                          pubsub.publish("logisticsWorkTable.loadData");
                                          pubsub.publish("@@form.change", {id:"logisticsWorkForm",name:"reqDate",value:""})//清空查询条件
                                          pubsub.publish("logisticsMaterialTable.setData",[]);//清空子表
                                          pubsub.publish("logisticsDispatchTable.setData",[]);//清空子表
                                        }else{
                                          pubsub.publish("@@message.error",response.data);
                                        }
                                      }
                                      resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                  }else{
                                    pubsub.publish("@@message.error","请选择数据")
                                  }
                                `
                              }
                            ]
                          }
                        ]
                      },
                      {
                        event:"referenceTable.onSelectedRows",
                        pubs: [
                          {
                            event: "referenceSubmitButton.enabled",
                            payload:true
                          }
                        ]
                      },
                      {
                        event:"referenceTable.onSelectedRowsClear",
                        pubs: [
                          {
                            event: "referenceSubmitButton.enabled",
                            payload:false
                          }
                        ]
                      }
                    ]
                  }}>
                  </AppButton>
                  <AppButton config={{
                    id: "referenceCancelButton",
                    title: "取消",
                    type: "primary",
                    size: "large",
                    visible: true,
                    enabled: true,
                    subscribes: [
                      {
                        event: "referenceCancelButton.click",
                        pubs: [
                            {
                              event:"referenceGeneration.onCancel"
                            }
                        ]
                      }
                    ]
                  }}>
                  </AppButton>
              </Col>
          </Row>
      </div>
    );
  }
}

ReferenceModalPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

let ReferenceModalForm = reduxForm({
  form: "referenceModalPage"
})(ReferenceModalPage)

export default connect(null, mapDispatchToProps)(ReferenceModalForm);
