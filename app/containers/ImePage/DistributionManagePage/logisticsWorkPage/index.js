import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {Breadcrumb, Card, Row, Col,Layout,Menu, Icon,Tabs } from 'antd';

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
import DropdownButton from 'components/DropdownButton'
import ModalContainer from 'components/ModalContainer'
import ReferenceModalPage from './ReferenceModalPage'

export class LogisticsWorkPage extends React.PureComponent {
  render() {
    const { Header, Content, Footer, Sider } = Layout;
    const TabPane = Tabs.TabPane;
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>物流管理</Breadcrumb.Item>
          <Breadcrumb.Item>物流工单</Breadcrumb.Item>
        </Breadcrumb>
        <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
          bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
          <Row>
            <Col span={14} xs={24}>
                  <DropdownButton config={{
                    id: 'dispatchOrder-dropDown-1',
                    name: '创建',
                    enabled: true,
                    size:"large",
                    type: 'primary',
                    dataSource: {
                        type: 'customValue',
                        values: [
                            {key: "0", name: "直接创建"},
                            {key: "1", name: "参照生成"},
                        ]

                    },
                      subscribes:[
                          {
                              event:'dispatchOrder-dropDown-1.onClick',
                              pubs:[
                                  {
                                      iif:'0',
                                      event: "@@navigator.push",
                                      payload: {
                                        url: "imeLogisticsWork/detail"
                                      }
                                  },
                                  {
                                    iif:'1',
                                    event:"referenceGeneration.openModal"
                                  }
                              ]
                          }
                      ],
                    displayField: "name",
                    valueField: "id"
                }} name="drop"></DropdownButton>
                <AppButton config={{
                    id: "logistiModifyButton",
                    title: "修改",
                    type: "primary",
                    size: "large",
                    visible: true,
                    enabled: false,
                    subscribes: [
                      {
                        event:"logisticsWorkTable.onSelectedRows",
                        pubs: [
                          {
                            event: "logistiModifyButton.enabled",
                            payload:true
                          }, {
                            event: "logistiModifyButton.dataContext"
                          }
                        ]
                      },
                      {
                        event:"logisticsWorkTable.onSelectedRowsClear",
                        pubs: [
                          {
                            event: "logistiModifyButton.enabled",
                            payload:false
                          }
                        ]
                      },
                      {
                        event: "logistiModifyButton.click",
                        behaviors: [
                          {
                            type: "fetch",
                            id: "logisticsWorkTable", //要从哪个组件获取数据
                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                            successPubs: [  //获取数据完成后要发送的事件
                              {
                                event: "@@navigator.push",
                                mode: "payload&&eventPayload",
                                payload: {
                                  url: "/imeLogisticsWork/detail"
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
                  id: "logistiDelButton",
                  title: "删除",
                  type: "primary",
                  size: "large",
                  visible: true,
                  enabled: false,
                  subscribes: [
                    {
                      event:"logisticsWorkTable.onSelectedRows",
                      pubs: [
                        {
                          event: "logistiDelButton.enabled",
                          payload:true
                        },
                        {
                          event: "logistiDelButton.dataContext"
                        }
                      ]
                    },
                    {
                      event:"logisticsWorkTable.onSelectedRowsClear",
                      pubs: [
                        {
                          event: "logistiDelButton.enabled",
                          payload:false
                        }
                      ]
                    },
                    {
                      event:"logistiDelButton.click",
                      behaviors:[
                        {
                          type: "request",
                          dataSource: {
                              type: "api",
                              method: "POST",
                              url: `/ime/imeLogisticsOrder/delete.action`,
                              payloadMapping:[{
                                from: "dataContext",
                                to: "@@Array",
                                key: "gid"
                            }]
                          },
                          successPubs:[
                              {
                                  event:'logisticsWorkTable.loadData',
                                  eventPayloadExpression:`
                                  resolveFetch({fetch:{id:"logisticsWorkForm",data:"@@formValues"}}).then(function (param) {
                                    if(param !=undefined){
                                        let payload = {"eventPayload":{"query":{"query":
                                        [
                                          {"operator":"and","field":"reqDate", "type": "ge", "value": param.reqDate+" 00:00:00","left":"("},
                                          {"operator":"and","field":"reqDate", "type": "le", "value": param.reqDate+" 23:59:59","right":")"}
                                          ]
                                        }
                                      }
                                     }
                                      callback(payload);
                                    }else{
                                      callback();
                                    }
                                })
                                  `
                              },
                              {
                                event:"@@message.success",
                                payload:"删除成功"
                              }
                          ],
                          errorPubs:[
                            {
                              event:"@@message.error",
                              eventPayloadExpression:`
                                callback(eventPayload);
                              `
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }}>
              </AppButton>
              <span className="ant-divider" />
              <AppButton config={{
                id: "logistiPackButton",
                title: "打包",
                type: "default",
                size: "large",
                visible: false,
                enabled: false,
                subscribes: [
                  {
                    event: "logistiPackButton.click",
                    pubs: [
                    ]
                  }
                ]
              }}>
            </AppButton>
            </Col>
          </Row>
        </Card>
          <Layout>
            <Sider width={200} style={{ background: '#fff' }}>
              <Card bordered={true} style={{ width: "100%", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                    <Field config={{
                      "id": "reqDateField",
                      placeholder: "请输入日期",
                      "label": "日期",
                      showRequiredStar: false,  //是否显示必填星号
                      labelSpan: 8,   //标签栅格比例（0-24）
                      wrapperSpan: 16,  //输入框栅格比例（0-24）
                      showTime:false,
                  }} name="reqDate" component={DateField}/>
              </Card>
            </Sider>
            <Layout>
              <Content style={{ background: '#fff' }}>
                <Card bordered={true}>
                    <AppTable name="logisticsWorkTable" config={{
                      "id": "logisticsWorkTable",
                      "name": "logisticsWorkTable",
                      "type": "checkbox",//表格单选复选类型
                      "size": "small",//表格尺寸
                      "rowKey": "gid",//主键
                      "onLoadData": true,//初始化是否加载数据
                      "tableTitle": "物流工单",//表头信息
                      "editType": false,
                      "isPager": true,//是否分页
                      "isUpdown": false,//是否显示需要上下移的按钮
                      "isSelectable":true,
                      "isSearch": true,
                      "conditions":[{"dataIndex":"code"}],
                      "width":"",
                      "columns": [
                        {title: '物流工单编号', width: 100, dataIndex: 'code', key: '1',columnsType:{"type":"link","url":"imeLogisticsWork/detail"}},
                        {title: '供应仓库', width: 100, dataIndex: 'mdWarehouseGidRef.warehouseCode', key: '2'},
                        {title: '配送类型', dataIndex: 'mdMrlDeliverySchemeGidRef.deliveryName', key: '3', width: 100},
                        {title: '需求产线', dataIndex: 'factoryLineGidRef.lineName', key: '4', width: 100},
                        {title: '需求日期', width: 100, dataIndex: 'reqDate', key: '5' ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                        {title: '需求时间', dataIndex: 'reqDate', key: '6', width: 100,columnsType:{"type":"date","format":"hh:mm:ss"}},
                        {title: '单据状态', dataIndex: 'status', key: '7', width: 100},
                      ],
                      dataSource: {
                      type: 'api',
                      method: 'post',
                      url: '/ime/imeLogisticsOrder/query.action',
                      pager:true
                      },
                      subscribes:[
                        {
                          event:"reqDateField.onChange",
                          behaviors: [
                            {
                              type: "fetch",
                              id: "logisticsWorkForm", //要从哪个组件获取数据
                              data: "@@formValues",//要从哪个组件的什么属性获取数据
                              successPubs: [  //获取数据完成后要发送的事件
                                {
                                  event: "logisticsWorkTable.loadData",
                                  eventPayloadExpression:`
                                    if(eventPayload != undefined)
                                    {
                                      let payload = {"eventPayload":{"query":{"query":
                                            [
                                              {"operator":"and","field":"reqDate", "type": "ge", "value": eventPayload.reqDate+" 00:00:00","left":"("},
                                              {"operator":"and","field":"reqDate", "type": "le", "value": eventPayload.reqDate+" 23:59:59","right":")"}
                                            ]
                                          }
                                        }
                                      }
                                      callback(payload)
                                    }

                                  `
                                }
                              ]
                            }
                          ]
                        },
                        {
                          event:"logisticsWorkTable.onClickRowClear",
                          pubs:[
                            {
                              event: "logisticsMaterialTable.setData",
                              payload:[]
                            },
                            {
                              event: "logisticsDispatchTable.setData",
                              payload:[]
                            }
                          ]
                        }
                      ]
                  }}/>
                </Card>
                <Card bordered={true}>
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="物料需求" key="1">
                        <AppTable name="logisticsMaterialTable" config={{
                          "id": "logisticsMaterialTable",
                          "name": "logisticsMaterialTable",
                          "type": "checkbox",//表格单选复选类型
                          "size": "small",//表格尺寸
                          "rowKey": "gid",//主键
                          "onLoadData": false,//初始化是否加载数据
                          "tableTitle": "物流需求",//表头信息
                          "editType": false,
                          "isPager": false,//是否分页
                          "isUpdown": false,//是否显示需要上下移的按钮
                          "isSelectable":false,
                          "isSearch": false,
                          "conditions":[{"dataIndex":"mdMaterialInfoGidRef.code"}],
                          "width":"3500",
                          "columns": [
                            {title: '物料编码', width: 100, dataIndex: 'mdMaterialInfoGidRef.code', key: '1'},
                            {title: '物料名称', width: 100, dataIndex: 'mdMaterialInfoGidRef.name', key: '2'},
                            {title: '物流工单编号', dataIndex: 'code', key: '3', width: 100},
                            {title: '数量单位', dataIndex: 'mdMaterialInfoGidRef.measurementUnitGidRef.name', key: '4', width: 100},
                            {title: '包装数量', width: 100, dataIndex: 'packNum', key: '5'},
                            {title: '包装方式', dataIndex: 'packWay', key: '6', width: 100},
                            {title: '计划数量', dataIndex: 'planQty', key: '7', width: 100},
                            {title: '需求数量', width: 100, dataIndex: 'reqQty', key: '8'},
                            {title: '物料需求时间', width: 150, dataIndex: 'materialReqTime', key: '9'},
                            {title: '最新需求时间', dataIndex: 'newestReqTime', key: '10', width: 150},
                            {title: '配送组号', dataIndex: 'materialGroupGidRef.code', key: '11', width: 150},
                            {title: '配送组名', width: 150, dataIndex: 'materialGroupGidRef.name', key: '12'},
                            {title: '包装标准', dataIndex: 'packStandard', key: '13', width: 150},
                            {title: '标准单位', dataIndex: 'standardUnit', key: '14', width: 100},
                            {title: '标准数量', dataIndex: 'standardQty', key: '15', width: 100},
                            {title: '需求状态', width: 100, dataIndex: 'reqStatus', key: '16'},
                            {title: '需求工位', width: 150, dataIndex: 'factoryWorkStationGidRef.stationName', key: '17'},
                            {title: '备注说明', dataIndex: 'remark', key: '18', width: 150},
                            {title: '需求工序', dataIndex: 'routeOperationName', key: '19', width: 150},
                            {title: '供应货主', width: 150, dataIndex: 'supplyWarehouseGidRef.warehouseName', key: '20'},
                            {title: '生产订单', dataIndex: 'imePlanOrderGidRef.code', key: '21', width: 150},
                            {title: '生产工单', dataIndex: 'imeWorkOrderGidRef.code', key: '22', width: 150},
                            {title: '工单顺序', width: 100, dataIndex: 'workOrderSeq', key: '23'},
                            {title: '生产序列', dataIndex: 'productSeq', key: '24', width: 100},
                            {title: '创建批次', dataIndex: 'createBatchNo', key: '25', width: 100},
                          ],
                          dataSource:{
                            type: 'api',
                            method: 'post',
                            pager:true,
                            url: '/ime/imeLogisticsOrder/queryDetail.action'
                          },
                          subscribes:[
                            {
                              event:"logisticsWorkTable.onClickRow",
                              behaviors: [
                                {
                                  type: "fetch",
                                  id: "logisticsWorkTable", //要从哪个组件获取数据
                                  data: "rowRecord",//要从哪个组件的什么属性获取数据
                                  successPubs: [
                                    {
                                      event: "logisticsMaterialTable.loadData",
                                      eventPayloadExpression:`
                                        if(eventPayload!=undefined){
                                            let payload = {"eventPayload":{"query":{"query":
                                              [
                                                {"operator":"and","field":"imeLogisticsOrderGid", "type": "eq", "value": eventPayload.gid}
                                              ]
                                            }
                                          }
                                        }
                                          callback(payload);
                                        }
                                      `
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                      }}/>
                    </TabPane>
                    <TabPane tab="物料派工单" key="2" forceRender={true}>
                        <AppTable name="logisticsDispatchTable" config={{
                          "id": "logisticsDispatchTable",
                          "name": "logisticsDispatchTable",
                          "type": "checkbox",//表格单选复选类型
                          "size": "small",//表格尺寸
                          "rowKey": "gid",//主键
                          "onLoadData": false,//初始化是否加载数据
                          "tableTitle": "物流派工单",//表头信息
                          "editType": false,
                          "isPager": false,//是否分页
                          "isUpdown": false,//是否显示需要上下移的按钮
                          "isSelectable":false,
                          "isSearch": false,
                          "conditions":[{"dataIndex":"code"}],
                          "width":"",
                          "columns": [
                            {title: '物流派工单编号', width: 100, dataIndex: 'code', key: '1',columnsType:{"type":"link","url":"imeLogisticsDispatch/detail"}},
                            {title: '供应仓库', width: 100, dataIndex: 'mdWarehouseGidRef.warehouseName', key: '2'},
                            {title: '配送类型', dataIndex: 'mdMrlDeliverySchemeGidRef.deliveryType', key: '3', width: 100},
                            {title: '需求单位', dataIndex: 'standardUnit', key: '4', width: 100},
                            {title: '需求日期', width: 100, dataIndex: 'reqDate', key: '5',columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                            {title: '需求时间', dataIndex: 'reqDate', key: '6', width: 100,columnsType:{"type":"date","format":"hh:mm:ss"}},
                            {title: '单据状态', dataIndex: 'status', key: '7', width: 100},
                          ],
                          dataSource: {
                            type: 'api',
                            method: 'post',
                            pager:true,
                            url: '/ime/imeLogisticsTrack/query.action'
                            },
                            subscribes:[
                            {
                              event:"logisticsWorkTable.onClickRow",
                              behaviors: [
                                {
                                  type: "fetch",
                                  id: "logisticsWorkTable", //要从哪个组件获取数据
                                  data: "rowRecord",//要从哪个组件的什么属性获取数据
                                  successPubs: [
                                    {
                                      event: "logisticsDispatchTable.loadData",
                                      eventPayloadExpression:`
                                        if(eventPayload!=undefined){
                                            let payload = {"eventPayload":{"query":{"query":
                                              [
                                                {"operator":"and","field":"logisticsWorkOrderGid", "type": "eq", "value": eventPayload.gid}
                                              ]
                                            }
                                          }
                                        }
                                          callback(payload);
                                        }
                                      `
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }}/>
                    </TabPane>
                  </Tabs>
                </Card>
              </Content>
            </Layout>
          </Layout>
          <ModalContainer config={{
            visible: false, // 是否可见，必填*
            enabled: true, // 是否启用，必填*
            id: "referenceGeneration", // id，必填*
            pageId: "referenceGeneration", // 指定是哪个page调用modal，必填*
            type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
            width: "60%", // 宽度，默认520px
            okText: "确定", // ok按钮文字，默认 确定
            title: "生成物料工单",
            cancelText: "取消", // cancel按钮文字，默认 取消
            style: { top: 80 }, // style样式
            wrapClassName: "wcd-center", // class样式
            hasFooter: false, // 是否有footer，默认 true
            maskClosable: true, // 点击蒙层是否允许关闭，默认 true
          }}
          >
            <ReferenceModalPage />
          </ModalContainer>
      </div>
    );
  }
}

LogisticsWorkPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default reduxForm({
  form: "logisticsWorkForm",
})(LogisticsWorkPage)