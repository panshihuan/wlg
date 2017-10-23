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

export class LogisticsModalPage extends React.PureComponent {
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
        <Row>
            <Col span={24}>
                <Field config={{
                enabled: true,
                id: "materialSource",
                label: "物料来源",
                dataSource:{
                    type: "customValue",
                    values: [
                        {key: "workOrder", value: "工单子物料"},
                        {key: "materielInfo", value: "物料档案"}
                    ]
                },
                subscribes:[
                    {
                        event: "materialSource.onChange",
                        pubs:[
                            {
                            event:"checkMrlDetailTable.loadData",
                            eventPayloadExpression:`
                                resolveFetch({fetch:{id:'logisticsModeForm',data:'@@formValues'}}).then(function(res){
                                    let lineGid = "";
                                    if(res != undefined){
                                        if(res.mdFactoryLineGid != undefined){
                                            lineGid = res.mdFactoryLineGid;
                                        }
                                    }
                                    let payload ={eventPayload:{"source":eventPayload,"lineGid":lineGid}}
                                    callback(payload)
                                })
                            `
                            }
                        ]
                    }
                ],
                displayField: "value",
                valueField: "key",
                labelSpan: 3,
                wrapperSpan: 21
                }} name="materialSource" component={RadiosField}/>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <AppTable name="checkMrlDetailTable" config={{
                "id": "checkMrlDetailTable",
                "name": "checkMrlDetailTable",
                "type": "checkbox",//表格单选复选类型
                "size": "small",//表格尺寸
                "rowKey": "gid",//主键
                "onLoadData": false,//初始化是否加载数据
                "width": 700,//表格宽度
                "showSerial": true,//是否显示序号
                "editType": false,//是否增加编辑列
                "page": 1,//当前页
                "pageSize": 10,
                "isSearch": true,//是否显示模糊查询
                "columns": [
                    { title: '物料编号', width: 100, dataIndex: 'materielInfoCode', key: '1' },
                    { title: '物料名称', width: 100, dataIndex: 'materielInfoName', key: '2' },
                    { title: '数量单位', dataIndex: 'measurementUnitName', key: '3', width: 100 },
                    { title: '供应仓库', dataIndex: 'materialWarehouseName', key: '4', width: 100 },
                    { title: '产线', dataIndex: 'mdFactoryLineName', key: '5', width: 100 },
                    { title: '工序', dataIndex: 'mdDefOperationName', key: '6', width: 100 },
                    { title: '工位', dataIndex: 'mdFactoryStationName', key: '7', width: 100 },
                ],
                dataSource: {
                    type: "api",
                    method: "post",
                    url: "/ime/mdMrlDeliveryMode/queryTemplateDTO.action",
                    pager:true
                },
                subscribes:[
                    {
                    event: "checkMrlDetailTable.onTableTodoAny",
                    pubs:[
                            {
                            event:"checkMrlDetailTable.loadData",
                            eventPayloadExpression:`
                                resolveFetch({fetch:{id:'logisticsModeForm',data:'@@formValues'}}).then(function(res){
                                    let lineGid = "";
                                    if(res != undefined){
                                        if(res.mdFactoryLineGid != undefined){
                                            lineGid = res.mdFactoryLineGid;
                                        }
                                    }
                                    let payload ={eventPayload:{"source":"workOrder","lineGid":lineGid}}
                                    callback(payload)
                                })
                            `
                            }
                        ]
                    },
                    {
                        event:"checkMrlDetailTable.onSelectedRows",
                        pubs:[
                            {
                                event:"submitBatchMrl.enabled",
                                payload:true
                            },
                            {
                                event: "submitBatchMrl.dataContext"
                            }
                        ]
                    },
                    {
                        event:"checkMrlDetailTable.onSelectedRowsClear",
                        pubs:[
                            {
                                event:"submitBatchMrl.enabled",
                                payload:false
                            },
                            {
                                event: "submitBatchMrl.dataContext"
                            }
                        ]
                    }
                ]
                }} />
            </Col>
        </Row>
        <Row>
            <Col span={4} offset={20}>
                <AppButton config={{
                id: "submitBatchMrl",
                title: "添加",
                type: "primary",
                size: "default",
                visible: true,
                enabled: false,
                subscribes:[
                    {
                        event:"submitBatchMrl.click",
                        behaviors:[
                            {
                            type:"fetch",
                            id:"checkMrlDetailTable",
                            data:"selectedRows",
                            successPubs:[
                                {
                                    event:"submitBatchMrl.expression",
                                    meta:{
                                        expression:`
                                        resolveFetch({fetch:{id:'logisticsModeForm',data:'@@formValues'}}).then(function(res){
                                                var errorMessage = undefined;
                                                var jumpFor = false;
                                                if(dataContext!=undefined){
                                                    for(var i=0; i < dataContext.length;i++){
                                                        //用于跳出多层循环
                                                        if(jumpFor){
                                                            break;
                                                        }
                                                        dataContext[i].materialDetailGidRef = {}
                                                        dataContext[i].materialDetailGidRef.measurementUnitGidRef = {}
                                                        dataContext[i].materialDetailGidRef.materialWarehouseRef = {}
                                                        dataContext[i].mdFactoryLineGidRef = {}
                                                        dataContext[i].mdDefOperationGidRef = {}
                                                        dataContext[i].mdFactoryStationGidRef = {}
                                                        dataContext[i].materialDetailGid = dataContext[i].materielInfoGid;
                                                        delete dataContext[i].gid
                                                        dataContext[i].materialDetailGidRef.code = dataContext[i].materielInfoCode
                                                        dataContext[i].materialDetailGidRef.name = dataContext[i].materielInfoName
                                                        dataContext[i].materialDetailGidRef.measurementUnitGidRef.name = dataContext[i].measurementUnitName
                                                        dataContext[i].materialDetailGidRef.materialWarehouseRef.warehouseName = dataContext[i].materialWarehouseName
                                                        dataContext[i].mdFactoryLineGidRef.lineName = dataContext[i].mdFactoryLineName
                                                        dataContext[i].mdDefOperationGidRef.name = dataContext[i].mdDefOperationName
                                                        dataContext[i].mdFactoryStationGidRef.stationName= dataContext[i].mdFactoryStationName
                                                        var parentData = res.mdMrlDeliveryModeDetailDTOs;
                                                        //用于判断是否已存在已存在物料编码
                                                        if(res.mdMrlDeliveryModeDetailDTOs!=undefined){
                                                            for(var j = 0 ;j<res.mdMrlDeliveryModeDetailDTOs.length;j++){
                                                                if(dataContext[i]["materialDetailGidRef"]["code"] == parentData[j]["materialDetailGidRef"]["code"]){
                                                                    errorMessage = "物料"+dataContext[i].materialDetailGidRef.code+"已经存在,请重新选择";
                                                                    jumpFor = true;
                                                                }
                                                            }
                                                        }
                                                      }
                                                    if(errorMessage){
                                                        pubsub.publish("@@message.error",errorMessage)
                                                    }else{
                                                        let params = [];
                                                        if(res["mdMrlDeliveryModeDetailDTOs"]!=undefined){
                                                            params = res.mdMrlDeliveryModeDetailDTOs.concat(dataContext)
                                                        }else{
                                                            params = dataContext;
                                                        }
                                                        pubsub.publish("@@form.change", { id: "logisticsModeForm",name:"mdMrlDeliveryModeDetailDTOs" ,value: fromJS(params) })
                                                        pubsub.publish("checkMrlDetailPage.onCancel")
                                                        pubsub.publish("mdMrlDeliveryModeDetailDTOs.activateAll",{payload:true})
                                                        resolveFetch({fetch:{id:'logisticsModeForm',data:'@@formValues'}}).then(function(res){
                                                            if(res["packStandard"] != undefined){
                                                                if(res["packStandard"] == "NESTING_PACK"){
                                                                    pubsub.publish("mdMrlDeliveryModeDetailDTOs.activateCol",{"cols":["packWay","packNumber"],"type":false});
                                                                }else{
                                                                    pubsub.publish("mdMrlDeliveryModeDetailDTOs.activateCol",{"cols":["packWay","packNumber"],"type":true});
                                                                }
                                                            }
                                                        })
                                                    }
                                            }
                                      })
                                    `
                                    }
                                }
                            ]
                            }
                        ]
                    }
                ]
                }}/>
                <AppButton config={{
                    id: "canelBatchMrl",
                    title: "取消",
                    type: "primary",
                    size: "default",
                    visible: true,
                    enabled: true,
                    subscribes:[
                        {
                        event:"canelBatchMrl.click",
                        pubs:[
                            {
                            event:"checkMrlDetailPage.onCancel"
                            }
                        ]
                        }
                    ]
                    }}/>
            </Col>
        </Row>
      </div>
    );
  }
}

LogisticsModalPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

let LogisticsModalForm = reduxForm({
  form: "logisticsModalForm",
  initialValues: Immutable.fromJS({ "materialSource": "workOrder" })
})(LogisticsModalPage)

export default connect(null, mapDispatchToProps)(LogisticsModalForm);
