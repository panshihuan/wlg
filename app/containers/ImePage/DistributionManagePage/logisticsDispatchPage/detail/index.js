import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import pubsub from 'pubsub-js'
import {fromJS} from 'immutable'

import AppButton from 'components/AppButton'
import AppTable from 'components/AppTable'
import TextField from 'components/Form/TextField'
import DateField from 'components/Form/DateField'
import SelectField from 'components/Form/SelectField'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil';
import Immutable from 'immutable'
import TimeField from "components/Form/TimeField";

const TabPane = Tabs.TabPane;

class LogisticsDispatchPageDetail extends React.PureComponent {
  constructor(props) {
    super(props);

    let modifyId = this.props.location.state[0].gid;
    let dataSource = {
      mode: "dataContext",
      type: "api",
      method: "POST",
      url: "/ime/imeLogisticsTrack/findById.action",
    };
    resolveDataSource({dataSource, dataContext: {id: modifyId}}).then(function (data) {
      pubsub.publish("@@form.init", {id: "logisticsDispatchDetailForm", data: Immutable.fromJS(data.data)})
      pubsub.publish("LogisticsDispatchDetail-SubTable.loadData",data.data)
    })
  }

  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>物流管理</Breadcrumb.Item>
          <Breadcrumb.Item>物流派工单</Breadcrumb.Item>
          <Breadcrumb.Item>物流派工单详情</Breadcrumb.Item>
        </Breadcrumb>

        {/*第一排按钮*/}
        <Card style={{width: "100%", backgroundColor: "#f9f9f9"}} bodyStyle={{padding: "15px"}}>
          <Row>
            <Col>
              {/*<AppButton config={{
                id: "LogisticsDispatchPageDetail-del",
                title: "删除",
                visible: true,
                enabled: true,
                type: "primary",
                subscribes: [
                  {
                    event: "LogisticsDispatchPageDetail-del.click",
                    behaviors: [
                      {
                        type: "request",
                        dataSource: {
                          type: 'api',
                          method: 'post',
                          url: '/ime/imeLogisticsTrack/delete.action',
                          bodyExpression: `
                            resolveFetch({fetch:{id:"logisticsDispatchDetailForm",data:"@@formValues"}}).then(function (value) {
                              if(value){
                                // callback([value.gid])
                              }
                            })
                          `
                        },
                        successPubs: [
                          {
                            event: "@@message.success",
                            payload: '删除成功!'
                          },
                          {
                            event: "@@navigator.push",
                            payload: {
                              url: "/imeLogisticsDispatch"
                            }
                          }
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload: '删除失败!'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }}/>
              <AppButton config={{
                id: "LogisticsDispatchPageDetail-publish",
                title: "发布",
                visible: true,
                enabled: true,
                type: "default",
                subscribes: [
                  {
                    event:"LogisticsDispatchPageDetail-publish.click",
                    behaviors:[
                      {
                        type:"request",
                        dataSource:{
                          type:'api',
                          method:'post',
                          url:'/ime/imeLogisticsTrack/executionPublish.action',
                          bodyExpression:`
                            resolveFetch({fetch:{id:"logisticsDispatchDetailForm",data:"@@formValues"}}).then(function (value) {
                              if(value){
                                callback([value.gid])
                              }
                            })
                          `
                        },
                        successPubs: [
                          {
                            event: "@@message.success",
                            payload:'发布成功!'
                          }
                        ],
                        errorPubs: [
                          {
                            event: "@@message.error",
                            payload:'发布失败!'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }}/>*/}
              <AppButton config={{
                id: "LogisticsDispatchPageDetail-del",
                title: "返回",
                visible: true,
                enabled: true,
                type: "primary",
                subscribes: [
                  {
                    event: "LogisticsDispatchPageDetail-del.click",
                    pubs:[
                      {
                        event:"@@navigator.goBack"
                      }
                    ]
                  }
                ]
              }}/>
            </Col>
          </Row>
        </Card>

        {/*内容区-上*/}
        <Row>
          <Col>
            <Card style={{width: "100%", backgroundColor: "#fff", marginTop: "15px"}} bodyStyle={{padding: "15px"}}>
              <Row>
                <Col span={6}>
                  <Field config={{                    id: "code11",
                    label: "物流派工单编号",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: true,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="code"/>
                </Col>
                <Col span={6}>
                  <Field config={{                    id: "code12",
                    label: "来源物流工单号",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="logisticsWorkOrderGidRef.code"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code13",
                    label: "供应仓库",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                  }} component={TextField} name="mdWarehouseGidRef.warehouseName"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code14",
                    label: "配送类型",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    dataSource: {
                      type: "api",
                      method: "POST",
                      url: "/ime/mdMrlDeliveryScheme/getMrlDeliverySchemeCombox.action",
                    },
                    displayField: "value",
                    valueField: "id"
                  }} component={SelectField} name="mdMrlDeliverySchemeGidRef.deliveryType"/>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Field config={{
                    id: "code21",
                    label: "物料组号",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="mdMrlDeliveryModeGidRef.code"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code22",
                    label: "物料组名",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="mdMrlDeliveryModeGidRef.name"/>
                </Col>
                <Col span={6}>
                  <Field config={{

                    id: "code23",
                    label: "物料编码",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="mdMaterielInfoGidRef.code"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code24",
                    label: "物料名称",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="mdMaterielInfoGidRef.name"/>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Field config={{
                    id: "code31",
                    label: "包装方式",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                    dataSource: {
                          type: "api",
                          method: "post",
                          url: "/sm/dictionaryEnumValue/query.action",
                          mode: "payload",
                          payload: {
                            "query": {
                              "query": [
                                {
                                  "field": "smDictionaryEnumGid", "type": "eq", "value": "585A3538E4747896E055000000000001"
                                }
                              ],
                              "sorted": "seq"
                            }
                          }
                        },
                        displayField: "val",
                        valueField: "gid",
                  }} component={SelectField} name="packingMode"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code32",
                    label: "包装标准",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    dataSource: {
                      type: "api",
                      method: "post",
                      url: "/ime/mdMrlDeliveryMode/getPackStandardCombox.action"
                    },
                    displayField: "value",
                    valueField: "id"
                  }} component={SelectField} name="packingStandard"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code33",
                    label: "标准数量",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="standardQty"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code34",
                    label: "标准单位",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="standardUnit"/>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Field config={{
                    id: "code41",
                    label: "需求产线",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="factoryLineGidRef.lineCode"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code42",
                    label: "计划数量",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="planQty"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code43",
                    label: "需求数量",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="reqQty"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code44",
                    label: "需求日期",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={DateField} name="reqDate"/>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Field config={{
                    id: "code51",
                    label: "需求时间",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TimeField} name="reqDate"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code52",
                    label: "工序",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="routeOpeartionName"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code53",
                    label: "工位",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="factoryWorkStationGidRef.stationName"/>
                </Col>
                <Col span={6}>
                  <Field config={{
                    id: "code54",
                    label: "创建批次",  //标签名称
                    labelSpan: 12,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                    showRequiredStar: false,  //是否显示必填星号
                    enabled: false,
                    //placeholder: "请输入编码"
                  }} component={TextField} name="code54"/>
                </Col>
              </Row>
              <Row>
              <Col span={6}>
              <Field config={{
                  enabled: false,
                  id: "workCenter",
                  label: "物流派工单状态",
                  labelSpan: 12,   //标签栅格比例（0-24）
                  wrapperSpan: 12,  //输入框栅格比例（0-24）
                  placeholder: "请选择",
                  dataSource: {
                    type: "api",
                    method: "post",
                    url: "/ime/customEnum/getLogisticsTrackOrderStatusEnums.action"
                  },
                  displayField: "value",
                  valueField: "key",
              }} name="status" component={SelectField} />
        </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/*内容区-下*/}
        <Row>
          <Col>
            <Card bordered={true} style={{width: "100%", marginRight: "20px", marginTop: "20px", minHeight: "350px"}}
                  bodyStyle={{padding: "15px"}}>
              <Tabs>
                <TabPane tab="物料需求" key="1">
                  <AppTable config={{
                    "id": "LogisticsDispatchDetail-SubTable",
                    "name": "1234567890",
                    "type": "checkbox",//表格单选复选类型
                    "size": "default",//表格尺寸
                    "rowKey": "gid",//主键
                    "onLoadData": false,//初始化是否加载数据
                    "editType": false,
                    "isPager": true,//是否分页
                    "isSelectable":true,
                    "isSearch": true,
                    "width":2450,
                    "columns": [
                      {title: '物料编码', width: 150, dataIndex: 'mdMaterielInfoGidRef.code', key: '1'},
                      {title: '物料名称', width: 150, dataIndex: 'mdMaterielInfoGidRef.name', key: '2'},
                      {title: '物流工单编号', dataIndex: 'namen', key: '3', width: 180},
                      {title: '数量单位', dataIndex: 'standardUnit', key: '4', width: 150,},
                      {title: '包装数量', dataIndex: 'standardQty', key: '5', width: 150},
                      {title: '包装方式', dataIndex: 'packingMode', key: '6', width: 150},
                      {title: '计划数量', dataIndex: 'planQty', key: '7', width: 150},
                      {title: '需求数量', dataIndex: 'reqQty', key: '8', width: 150},
                      {title: '物料需求时间', dataIndex: 'reqDate', key: '9', width: 180},
                      {title: '最新需求时间', dataIndex: 'reqDate', key: '10', width: 180},
                      {title: '配送组号', dataIndex: 'mdMrlDeliveryModeGidRef.code', key: '11', width: 150},
                      {title: '配送组名', dataIndex: 'mdMrlDeliveryModeGidRef.name', key: '12', width: 150},
                      {title: '包装标准', dataIndex: 'packingStandard', key: '13', width: 150},
                      {title: '标准单位', dataIndex: 'standardUnit', key: '14', width: 150},
                      {title: '标准数量', dataIndex: 'standardQty', key: '15', width: 150},
                      {title: '需求状态', dataIndex: 'reqStatus', key: '16', width: 150},
                      {title: '需求工位', dataIndex: 'factoryWorkStationGidRef.stationName', key: '17', width: 150},
                      {title: '备注说明', dataIndex: 'name', key: '18', width: 150},
                      {title: '需求工序', dataIndex: 'routeOpeartionCode', key: '19', width: 150},
                      {title: '供应货主', dataIndex: 'name', key: '20', width: 150},
                      {title: '生产订单', dataIndex: 'name', key: '21', width: 150},
                      {title: '生产工单', dataIndex: 'name', key: '22', width: 150},
                      {title: '工单顺序', dataIndex: 'name', key: '23', width: 150},
                      {title: '生产序列', dataIndex: 'name', key: '24', width: 150}
                    ],
                    dataSource: {
                      type: 'api',
                      method: 'post',
                      mode: "payload",//参数存在的位置
                      url: '/ime/imeLogisticsTrackDetail/queryLogisticsTrackDetail.action',
                      bodyExpression:`
                        resolveFetch({fetch:{id:"LogisticsDispatchDetail-SubTable"}}).then(function (component) {
                          let search = component.searchFuzzyTable(component.state.fuzzyValue)
                          let query={
                            "query":{
                              "query":[
                                {"field":"imeLogisticsTrackGid","type":"eq","value":eventPayload.gid,"operator":"and"}
                              ]
                            },
                            "pager":{"page":component.state.page,"pageSize":component.state.pageSize}
                          }
                          query.query.query = query.query.query.concat(search)
                          callback(query)
                        })
                      `
                    }
                  }} />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

LogisticsDispatchPageDetail.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default reduxForm({
  form: "logisticsDispatchDetailForm",
})(LogisticsDispatchPageDetail)