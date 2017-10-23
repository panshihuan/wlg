import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import pubsub from 'pubsub-js'
import {fromJS} from 'immutable'

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
import DropdownButton from 'components/DropdownButton';
import ModalContainer from 'components/ModalContainer'
import TimeField from 'components/Form/TimeField'
import ReferAdd from './referAdd'
const TabPane = Tabs.TabPane;

const validate = values => {
  const errors = {}
  if (!values.get('logisticsChoose-data')) {
    errors['logisticsChoose-data'] = '必填项!'
  }
  if (!values.get('logisticsChoose-datum')) {
    errors['logisticsChoose-datum'] = '必填项!'
  }
  if (!values.get('logisticsChoose-time') && values.get('logisticsChoose-time') == "START_WORK") {
    errors['logisticsChoose-time'] = '必填项!'
  }
  if (!values.get('logisticsChoose-gap')) {
    errors['logisticsChoose-gap'] = '必填项!'
  }
  return errors
}

export class LogisticsDispatchPage extends React.PureComponent {
  render() {
    return (
      <div>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>物流管理</Breadcrumb.Item>
          <Breadcrumb.Item>物流派工单</Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
          <Row >
            <Col>
              <DropdownButton config={{
                id: "logisticsDispatch-Add",
                name: "创建",
                visible: true,
                enabled: true,
                type: 'primary',
                subscribes: [
                  {
                    event: "logisticsDispatch-Add.onClick",
                    pubs:[
                      {
                        eventPayloadExpression:`
                          if(eventPayload=="0"){
                          }else if(eventPayload=="1"){
                              pubsub.publish("logisticsDispatch-referModal.openModal")
                          }
                        `
                      }
                    ]
                  }
                ],
                dataSource: {
                  type: 'customValue',
                  values: [
                    {key: "0", name: "直接创建","enabled":false},
                    {key: "1", name: "参照生成"}
                  ]
                },
                displayField: "name",
                valueField: "id"
              }} />
              <AppButton config={{
                id: "logisticsDispatch-Edit",
                title: "修改",
                visible: true,
                enabled: false,
                type: 'primary',
                subscribes: [
                  {
                    event:"logisticsDispatch-MainTable.onSelectedRows",
                    pubs:[
                      {
                        event:"logisticsDispatch-Edit.dataContext",
                      },
                      {
                        event: "logisticsDispatch-Edit.expression",
                        meta: {
                          expression: `
                            if(dataContext && dataContext.length == 1) {
                              pubsub.publish("logisticsDispatch-Edit.enabled", true);
                            } else {
                              pubsub.publish("logisticsDispatch-Edit.enabled", false);
                            }
                          `
                        }
                      }
                    ]
                  },
                  {
                    event:"logisticsDispatch-MainTable.onSelectedRowsClear",
                    pubs:[
                      {
                        event:"logisticsDispatch-Edit.enabled",
                        payload:false
                      }
                    ]
                  },
                  {
                    event:"logisticsDispatch-Edit.click",
                    behaviors:[
                      {
                        type: "fetch",
                        id: "logisticsDispatch-MainTable", //要从哪个组件获取数据
                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                        successPubs: [  //获取数据完成后要发送的事件
                          {
                            event: "@@navigator.push",
                            mode: "payload&&eventPayload",
                            payload: {
                              url: "/imeLogisticsDispatch/detail"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }} />
              <AppButton config={{
                id: "logisticsDispatch-Del",
                title: "删除",
                visible: true,
                enabled: false,
                type: 'primary',
                subscribes: [
                  {
                    event:"logisticsDispatch-MainTable.onSelectedRows",
                    pubs:[
                      {
                        event:"logisticsDispatch-Del.enabled",
                        payload:true
                      },
                      {
                        event: "logisticsDispatch-Del.dataContext"
                      }
                    ]
                  },
                  {
                    event:"logisticsDispatch-MainTable.onSelectedRowsClear",
                    pubs:[
                      {
                        event:"logisticsDispatch-Del.enabled",
                        payload:false
                      }
                    ]
                  },
                  {
                    event:"logisticsDispatch-Del.click",
                    behaviors:[
                      {
                        type:"request",
                        dataSource:{
                          type:'api',
                          method:'post',
                          url:'/ime/imeLogisticsTrack/delete.action',
                          bodyExpression:`
                            let gids = []
                            for(let i=0;i<dataContext.length;i++){
                              gids.push(dataContext[i]["gid"])
                            }
                            callback(gids)
                          `
                        },
                        successPubs: [
                          {
                            event: "@@message.success",
                            payload:'删除成功!'
                          },
                          {
                            event: "logisticsDispatch-MainTable.loadData"
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
                  }
                ]
              }} />
              <AppButton config={{
                id: "logisticsDispatch-Publish",
                title: "发布",
                visible: true,
                enabled: false,
                type: 'default',
                subscribes: [
                  {
                    event:"logisticsDispatch-MainTable.onSelectedRows",
                    pubs:[
                      {
                        event:"logisticsDispatch-Publish.enabled",
                        payload:true
                      },
                      {
                        event: "logisticsDispatch-Publish.dataContext"
                      }
                    ]
                  },
                  {
                    event:"logisticsDispatch-MainTable.onSelectedRowsClear",
                    pubs:[
                      {
                        event:"logisticsDispatch-Publish.enabled",
                        payload:false
                      }
                    ]
                  },
                  {
                    event:"logisticsDispatch-Publish.click",
                    behaviors:[
                      {
                        type:"request",
                        dataSource:{
                          type:'api',
                          method:'post',
                          url:'/ime/imeLogisticsTrack/executionPublish.action',
                          bodyExpression:`
                            let gids = []
                            for(let i=0;i<dataContext.length;i++){
                              gids.push(dataContext[i]["gid"])
                            }
                            callback(gids)
                          `
                        },
                        successPubs: [
                          {
                            event: "@@message.success",
                            payload:'发布成功!'
                          },
                          {
                            event: "logisticsDispatch-MainTable.loadData"
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
              }} />

            </Col>
          </Row>
        </Card>
        <Row>
          <Col span={ 5 }>
            <Card bordered={true} style={{ width: "100%",  marginRight: "20px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
              <Field config={{
                id: "logisticsChoose-data",
                label: "日期",
                showRequiredStar: true,  //是否显示必填星号
                form:"logisticsDispatchForm",
                enabled:true
              }} name="logisticsChoose-data" component={DateField}/>
              <Field config={{
                id: "logisticsChoose-datum",
                label: "基准",
                showRequiredStar: false,  //是否显示必填星号
                form:"logisticsDispatchForm",
                enabled:true,
                dataSource:{
                  type:"api",
                  method:"POST",
                  url:"/ime/imeLogisticsTrack/getTimeReferenceCombox.action"
                },
                displayField: "value",
                valueField: "id"
              }} name="logisticsChoose-datum" component={SelectField}/>
              <Field config={{
                id: "logisticsChoose-time",
                label: "时间",
                showRequiredStar: false,  //是否显示必填星号
                form:"logisticsDispatchForm",
                enabled:true,
                format:"HH:mm", //展示时间的格式
                subscribes:[
                  {
                    event:"logisticsChoose-datum.onChange",
                    pubs:[
                      {
                        iif:'CURRENT',
                        event:"logisticsChoose-time.enabled",
                        payload:false,
                      },
                      {
                        iif:'CURRENT',
                        event:"@@form.change",
                        eventPayloadExpression:`
                          callback({ id: "logisticsDispatchForm", name: "logisticsChoose-time", value: "" })
                        `
                      },
                      {
                        iif:'START_WORK',
                        event:"logisticsChoose-time.enabled",
                        payload:true,
                      }
                    ]
                  }
                ]
              }} name="logisticsChoose-time" component={TimeField}/>
              <Row>
                <Col span={ 20 }>
                  <Field config={{
                    id: "logisticsChoose-gap",
                    label: "间隔",
                    showRequiredStar: false,  //是否显示必填星号
                    form:"logisticsDispatchForm",
                    enabled:true,
                    labelSpan: 10,   //标签栅格比例（0-24）
                    wrapperSpan: 12,  //输入框栅格比例（0-24）
                  }} name="logisticsChoose-gap" component={InputNumberField}/>
                </Col>
                <Col span={ 4 }>
                  <span style={{lineHeight:"32px"}}>分钟</span>
                </Col>
              </Row>
              <AppTable config={{
                "id": "logisticsDispatch-TimeTable",
                "name": "1234567890",
                "size": "default",//表格尺寸
                "rowKey": "id",//主键
                "onLoadData": false,//初始化是否加载数据
                "editType": false,
                "isPager": false,//是否分页
                "isSelectable":false,
                "isSearch": false,
                "showSerial":false,
                "isShowHeader":false,
                "width":100,
                "columns": [
                  {title: '时间段', width: 100, dataIndex: 'value', key: '1'},
                ],
                dataSource:{
                  type:"api",
                  method:"POST",
                  url:"/ime/imeLogisticsTrack/getTimeInterval.action",
                  withForm:'logisticsDispatchForm',
                  bodyExpression:`
                    resolveFetch({fetch:{id:"logisticsDispatchForm",data:"@@formValues"}}).then(function (value) {
                      if(value){
                        if(value["logisticsChoose-datum"] && value["logisticsChoose-gap"]){
                          let datum = value["logisticsChoose-datum"]
                          let gap = value["logisticsChoose-gap"]
                          if(datum == "CURRENT"){
                            callback({type:datum,timeStr:'',interval:gap})
                          }else if(datum == "START_WORK"){
                            if(value["logisticsChoose-time"]){
                              let time = value["logisticsChoose-time"]
                              callback({type:datum,timeStr:time,interval:gap})
                            }
                          }
                        }
                      }
                    })
                  `
                },
                subscribes:[
                  {
                    event:"logisticsChoose-datum.onChange",
                    pubs:[
                      {
                        event:"logisticsDispatch-TimeTable.loadData",
                      }
                    ]
                  },
                  {
                    event:"logisticsChoose-time.onChange",
                    pubs:[
                      {
                        event:"logisticsDispatch-TimeTable.loadData",
                      }
                    ]
                  },
                  {
                    event:"logisticsChoose-gap.onChange",
                    pubs:[
                      {
                        event:"logisticsDispatch-TimeTable.loadData",
                      }
                    ]
                  }
                ]
              }}
              />
            </Card>
          </Col>
          <Col span={1}>
          </Col>

          <Col span={18}>
            <Card bordered={true} style={{ width: "100%",  marginRight: "20px", marginTop: "20px", minHeight: "340px" }} bodyStyle={{ padding: "15px" }}>
              <AppTable config={{
                "id": "logisticsDispatch-MainTable",
                "name": "1234567890",
                "type": "checkbox",//表格单选复选类型
                "size": "default",//表格尺寸
                "rowKey": "gid",//主键
                "onLoadData": false,//初始化是否加载数据
                "editType": true,
                "isPager": true,//是否分页
                "isSelectable":true,
                "isSearch": true,
                "conditions":[{"dataIndex":"code"}],
                "width":"2500px",
                "columns": [
                  {title: '物流派工单编号', width: 200, dataIndex: 'code', key: '1'},
                  {title: '来源物流工单号', width: 200, dataIndex: 'logisticsWorkOrderGidRef.code', key: '2'},
                  {title: '供应仓库', dataIndex: 'mdWarehouseGidRef.warehouseName', key: '3', width: 150},
                  {title: '配送类型', dataIndex: 'mdMrlDeliverySchemeGidRef.deliveryType', key: '4', width: 150},
                  {title: '物料组号', dataIndex: 'mdMrlDeliveryModeGidRef.code', key: '5', width: 150},
                  {title: '物料组名', dataIndex: 'mdMrlDeliveryModeGidRef.name', key: '6', width: 150},
                  {title: '物料编码', dataIndex: 'mdMaterielInfoGidRef.code', key: '7', width: 150},
                  {title: '物料名称', dataIndex: 'mdMaterielInfoGidRef.name', key: '8', width: 150},
                  {title: '包装方式', dataIndex: 'packingMode', key: '9', width: 150},
                  {title: '包装标准', dataIndex: 'packingStandard', key: '10', width: 150},
                  {title: '标准数量', dataIndex: 'standardQty', key: '11', width: 150},
                  {title: '标准单位', dataIndex: 'standardUnit', key: '12', width: 150},
                  {title: '需求产线', dataIndex: 'factoryLineGidRef.lineName', key: '13', width: 150},
                  {title: '计划数量', dataIndex: 'planQty', key: '14', width: 150},
                  {title: '需求数量', dataIndex: 'reqQty', key: '15', width: 150},
                  {title: '需求日期', dataIndex: 'reqDate', key: '16', width: 150 ,columnsType:{"type":"date","format":"yyyy-MM-dd"}},
                  {title: '需求时间', dataIndex: 'reqDate', key: '17', width: 150 ,columnsType:{"type":"date","format":"hh:mm:ss"}},
                  {title: '工序', dataIndex: 'routeOpeartionName', key: '18', width: 120},
                  {title: '工位', dataIndex: 'factoryWorkStationGidRef.stationName', key: '19', width: 120},
                  {title: '创建批次', dataIndex: 'name', key: '20', width: 150}
                ],
                dataSource: {
                  type: 'api',
                  method: 'post',
                  withForm:'logisticsDispatchForm',
                  url: '/ime/imeLogisticsTrack/query.action',
                  pager:true,
                  bodyExpression:`
                    resolveFetch({fetch:{id:"logisticsDispatch-MainTable"}}).then(function (component) {
                      let time = component.dataContext["value"].split("-");
                      resolveFetch({fetch:{id:"logisticsDispatchForm",data:"@@formValues"}}).then(function (value) {
                          if(value["logisticsChoose-data"]){
                          let data = value["logisticsChoose-data"]
                          let search = component.searchFuzzyTable(component.state.fuzzyValue)
                          let query={
                            "query":{
                              "query":[
                                {"field":"reqDate","type":"gt","value":data+" "+time[0]+":00","operator":"and"},
                                {"field":"reqDate","type":"lt","value":data+" "+time[1]+":00","operator":"and"}
                              ]
                            },
                            "pager":{"page":component.state.page,"pageSize":component.state.pageSize}
                          }
                          query.query.query = query.query.query.concat(search)
                          callback(query)
                        }
                      })
                    })
                  `
                },
                subscribes:[
                  {
                    event:"logisticsDispatch-TimeTable.onClickRow",
                    pubs:[
                      {
                        event: "logisticsDispatch-MainTable.loadData",
                      },
                      {
                        event: "logisticsDispatch-MainTable.dataContext",
                      }
                    ]
                  }
                ]
              }} />
            </Card>

            <Card bordered={true} style={{ width: "100%",  marginRight: "20px", marginTop: "20px", minHeight: "350px" }} bodyStyle={{ padding: "15px" }}>
              <Tabs>
                <TabPane tab="物料需求" key="1">
                  <AppTable config={{
                    "id": "logisticsDispatch-SubTable",
                    "name": "1234567890",
                    "type": "checkbox",//表格单选复选类型
                    "size": "default",//表格尺寸
                    "rowKey": "gid",//主键
                    "onLoadData": false,//初始化是否加载数据
                    "editType": false,
                    "isPager": true,//是否分页
                    "isSelectable":true,
                    "isSearch": true,
                    "conditions":[{"dataIndex":"mdMaterielInfoGidRef.code"}],
                    "width":2450,
                    "columns": [
                      {title: '物料编码', width: 150, dataIndex: 'mdMaterielInfoGidRef.code', key: '1'},
                      {title: '物料名称', width: 150, dataIndex: 'mdMaterielInfoGidRef.name', key: '2'},
                      {title: '物流工单编号', dataIndex: 'orderCode', key: '3', width: 180,},
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
                        resolveFetch({fetch:{id:"logisticsDispatch-MainTable"}}).then(function (component) {
                          console.log(eventPayload)
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
                    },
                    subscribes:[
                      {
                        event:"logisticsDispatch-MainTable.onClickRow",
                        pubs:[
                          {
                            event: "logisticsDispatch-SubTable.loadData",
                          }
                        ]
                      }
                    ]
                  }} />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
        <ModalContainer config={{
          visible: false, // 是否可见，必填*
          enabled: true, // 是否启用，必填*
          id: "logisticsDispatch-referModal", // id，必填*
          pageId: "logisticsDispatch-referModal", // 指定是哪个page调用modal，必填*
          type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
          title: "生成物流派工单", // title，不传则不显示title
          closable: true, // 是否显示右上角关闭按钮，默认不显示
          width: "80%", // 宽度，默认520px
          okText: "确定", // ok按钮文字，默认 确定
          cancelText: "取消", // cancel按钮文字，默认 取消
          style: {top: 120}, // style样式
          wrapClassName: "wcd-center", // class样式
          hasFooter: false, // 是否有footer，默认 true
          maskClosable: true, // 点击蒙层是否允许关闭，默认 true
        }}
        >
          <ReferAdd/>
        </ModalContainer>
      </div>
    );
  }
}

LogisticsDispatchPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}


function mapStateToProps(props) {
  return {
    onSubmit:()=>{debugger}
  };
}

let logisticsDispatchForm = reduxForm({
  form: "logisticsDispatchForm",
  validate
})(LogisticsDispatchPage)

export default connect(mapStateToProps, mapDispatchToProps)(logisticsDispatchForm);