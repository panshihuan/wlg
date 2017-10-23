/**
 * Created by ASUS on 2017/9/20.
 */
import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import TableField from 'components/Form/TableField';
import AppButton from 'components/AppButton'
import RadiosField from 'components/Form/RadiosField'
import TextField from 'components/Form/TextField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import { connect } from 'react-redux';
import Immutable from 'immutable'
import SendModalCss from './styles'
import uuid from 'uuid/v4'
import {Row, Col,Button,Tabs} from 'antd'
const TabPane = Tabs.TabPane;


const validate = values => {
    const errors = {}

    const reg = new RegExp("(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)")
    if(values.get('aaa')){
        let vv=values.get('aaa').toJS()
        const membersArrayErrors = []
        vv.forEach((member, memberIndex) => {
            const memberErrors = {}
            let num=member.deliveryQty2;

            if (!reg.test(num) ){
                memberErrors.deliveryQty2 = '请输入有效数字'
                membersArrayErrors[memberIndex] = memberErrors
            }

        })

        if (membersArrayErrors.length) {
            errors.aaa = membersArrayErrors
        }
    }

    return errors
};



export class SendModal extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        pubsub.unsubscribe("sendModal-tableField-1.onTableTodoAny")
        pubsub.unsubscribe("SendModal-btn-1.click")
        pubsub.unsubscribe("SendModal-btn-2.click")
        pubsub.unsubscribe("SendModal-radio-1.onChange")
        pubsub.unsubscribe("sendModal-tableField-1.onSelectedRows")
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return <SendModalCss>
            <Row>
                <Col span={24}>
                    <Field config={{
                        id:'SendModal-radio-1',
                        enabled: true,
                        displayField: "name",
                        valueField: "id",
                        dataSource:{
                            type:'customValue',
                            values:[
                                {
                                    name:'按物流派工单发货',
                                    id:'1'
                                },
                                {
                                    name:'按明细发货',
                                    id:'2'
                                }
                            ]
                        },
                    subscribes:[
                        {
                            event:"SendModal-radio-1.onChange",
                            pubs: [
                                {
                                  event: "sendModal-tableField-2.activateCol",
                                  eventPayloadExpression:`
                                  if(eventPayload =='1'){
                                    let param ={cols:["deliveryQty2"],type: false}
                                    callback(param)
                                  }else{
                                    let param ={cols:["deliveryQty2"],type: true}
                                    callback(param)
                                  }
                                  
                                  `
                                }
                              ]
                        }
                    ]
                    }} name="SendModal-radio-1" component={RadiosField}/>

                </Col>
            </Row>

            {/*table(上)*/}
            <Row  className="distributionType-tabTop-top" style={{marginBottom:'10px'}}>
                <Col span={24}>
                    <Tabs defaultActiveKey="1-1">
                        <TabPane tab="物流派工单" key="1-1">
                            <AppTable name="sendModal-tableField-1" config={{
                                "id": "sendModal-tableField-1",
                                "name": "sendModal-tableField-1",
                                "type": "checkbox",//表格单选复选类型
                                "size": "default",//表格尺寸
                                "rowKey": "gid",//主键
                                "onLoadData": false,//初始化是否加载数据
                                "tableTitle": "",//表头信息
                                // "width": '100%',//表格宽度
                                "showSerial": true,//是否显示序号
                                // "editType": true,//是否增加编辑列
                                "page": 1,//当前页
                                "pageSize": 10,//一页多少条
                                "isPager": true,//是否分页
                                "isSearch": true,//是否显示模糊查询
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
                                    {title: '需求日期', dataIndex: 'reqDate', key: '16', width: 150},
                                    {title: '需求时间', dataIndex: 'reqDate', key: '17', width: 150},
                                    {title: '工序', dataIndex: 'routeOpeartionName', key: '18', width: 120},
                                    {title: '工位', dataIndex: 'factoryWorkStationGidRef.stationName', key: '19', width: 120},
                                    {title: '创建批次', dataIndex: 'name', key: '20', width: 150}

                                ],
                                subscribes:[
                                    {
                                        event: 'sendModal-tableField-1.onTableTodoAny',
                                        // behaviors:[
                                        //     {
                                        //         type: "request",
                                        //         dataSource: {
                                        //             type: 'api',
                                        //             method: 'post',
                                        //             pager: true,
                                        //             mode:'dataContext',
                                        //             url: '/ime/imeLogisticsTrack/getListByDeliveryId.action',
                                        //             bodyExpression: `
                                        //                 resolveFetch({fetch:{id:'logistics-dist-grid-index',data:'selectedRows'}}).then(function(pd){
                                        //                     let dataSource={
                                        //                         type: 'api',
                                        //                         method: 'post',
                                        //                         pager: true,
                                        //                         url: '/ime/imeLogisticsTrack/getListByDeliveryId.action'
                                        //                     }
                                        //                     callback({deliveryId:pd[0].gid})
                                        //                 })
                                        //
                                        //             `
                                        //         },
                                        //
                                        //     }
                                        // ],
                                        pubs: [
                                            {
                                                event: "sendModal-tableField-1.expression",
                                                meta: {
                                                    expression: `
                                                         resolveFetch({fetch:{id:'logistics-dist-grid-index',data:'selectedRows'}}).then(function(pd){
                                                            let dataSource={
                                                                type: 'api',
                                                                method: 'post',
                                                                pager: true,
                                                                url: '/ime/imeLogisticsTrack/getListByDeliveryId.action'
                                                            }
                                                            resolveDataSourceCallback({ dataSource:dataSource,eventPayload:{deliveryId:pd[0].gid}},
                                                                function (data) {
                                                                     pubsub.publish('sendModal-tableField-1.setData',data)
                                                                }
                                                            )

                                                        })

                                                    `
                                                }
                                            }
                                        ]
                                    },
                                ]

                            }}/>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>

            {/*table(下)*/}
            <Row  className="distributionType-tabTop-top" >
                <Col span={24}>
                    <Tabs defaultActiveKey="1-2">
                        <TabPane tab="物料明细" key="1-2">
                            <FieldArray
                                name="aaa"
                                component={TableField}
                                config={{
                                    id:"sendModal-tableField-2",
                                    name:"sendModal-tableField-2",
                                    "form":"SendModalForm",
                                    "rowKey": "id",
                                    "addButton": false, //是否显示默认增行按钮
                                    "showSelect":true, //是否显示选择框
                                    "type":"radio", //表格单选（radio）复选（checkbox）类型
                                    subscribes:[
                                        {
                                            event:'sendModal-tableField-1.onTableTodoAny',
                                            pubs:[
                                                {
                                                    event: "sendModal-tableField-2.expression",//在某个组件上执行表达式
                                                    meta: {
                                                        expression: `
                                                            resolveFetch({fetch:{id:'logistics-dist-grid-index',data:'selectedRows'}}).then(function(pd){
                                                                return pd[0].gid
                                                            }).then(function(pd){
                                                                let dataSource = {
                                                                  type: "api",
                                                                  method: "POST",
                                                                  url: "/ime/imeLogisticsTrack/getDetailListByDeliveryId.action"
                                                                }

                                                                resolveDataSourceCallback({ dataSource:dataSource,eventPayload:{deliveryId:pd}},
                                                                    function (data) {
                                                                        let reg=new RegExp("^[0-9]*[\.]{1}[0-9]{1,100}$")
                                                                        _.map(data.data,function(item,index){
                                                                            if(item.planQty&&reg.test(item.planQty)){
                                                                                data.data[index].planQty=data.data[index].planQty.toFixed(2)
                                                                            }
                                                                            if(item.reqQty&&reg.test(item.reqQty)){
                                                                                data.data[index].reqQty=data.data[index].reqQty.toFixed(2)
                                                                            }
                                                                            if(item.unDeliveryQty&&reg.test(item.unDeliveryQty)){
                                                                                data.data[index].unDeliveryQty=data.data[index].unDeliveryQty.toFixed(2)
                                                                            }
                                                                            if(item.deliveredQty&&reg.test(item.deliveredQty)){
                                                                                data.data[index].deliveredQty=data.data[index].deliveredQty.toFixed(2)
                                                                            }
                                                                            if(item.unDeliveryQty&&reg.test(item.unDeliveryQty)){
                                                                                data.data[index].unDeliveryQty=data.data[index].unDeliveryQty.toFixed(2)
                                                                            }
                                                                            if(item.unDeliveryQty&&reg.test(item.unDeliveryQty)){
                                                                                data.data[index].unDeliveryQty=data.data[index].unDeliveryQty.toFixed(2)
                                                                            }
                                                                            if(item.receivedQty&&reg.test(item.receivedQty)){
                                                                                data.data[index].receivedQty=data.data[index].receivedQty.toFixed(2)
                                                                            }
                                                                            if(item.deliveryQty2&&reg.test(item.deliveryQty2)){
                                                                                data.data[index].deliveryQty2=data.data[index].deliveryQty2.toFixed(2)
                                                                            }

                                                                        })
                                                                            pubsub.publish("@@form.init",{id:"SendModalForm",data:{aaa:data.data}})
                                                                    }
                                                                )
                                                            })

                                                        `
                                                    }
                                                },
                                            ],

                                        },
                                        {
                                            event:'sendModal-tableField-1.onSelectedRows',
                                            pubs:[
                                                {
                                                    event: "sendModal-tableField-2.expression",//在某个组件上执行表达式
                                                    meta: {
                                                        expression: `
                                                            resolveFetch({fetch:{id:'logistics-dist-grid-index',data:'selectedRows'}}).then(function(pd){
                                                                return pd[0].gid
                                                            }).then(function(pd){
                                                                resolveFetch({fetch:{id:'sendModal-tableField-1',data:'selectedRows'}}).then(function(sd){
                                                                let arr=[];
                                                                    _.map(sd,function(item,index){
                                                                        arr.push(item.gid)
                                                                    })
                                                                    let dataSource = {
                                                                      type: "api",
                                                                      method: "POST",
                                                                      url: "/ime/imeLogisticsTrack/getDetailListByDeliveryId.action"
                                                                    }

                                                                    resolveFetch({fetch:{id:'SendModalForm',data:"@@formValues"}}).then(function(vals){
                                                                        if(vals['SendModal-radio-1']){
                                                                            resolveDataSourceCallback({ dataSource:dataSource,eventPayload:{deliveryId:pd,trackIds:arr}},
                                                                                function (data) {
                                                                                        pubsub.publish("@@form.init",{id:"SendModalForm",data:{"SendModal-radio-1":vals['SendModal-radio-1'],aaa:data.data}})
                                                                                }
                                                                            )
                                                                        }else{
                                                                            resolveDataSourceCallback({ dataSource:dataSource,eventPayload:{deliveryId:pd,trackIds:arr}},
                                                                                function (data) {
                                                                                        pubsub.publish("@@form.init",{id:"SendModalForm",data:{aaa:data.data}})
                                                                                }
                                                                            )
                                                                        }
                                                                    })


                                                                })

                                                            })

                                                        `
                                                    }
                                                },
                                            ],
                                        },

                                        {
                                            event:'sendModal-tableField-1.onSelectedRowsClear',
                                            pubs:[
                                                {
                                                    event: "sendModal-tableField-2.expression",//在某个组件上执行表达式
                                                    meta: {
                                                        expression: `
                                                            resolveFetch({fetch:{id:'logistics-dist-grid-index',data:'selectedRows'}}).then(function(pd){
                                                                return pd[0].gid
                                                            }).then(function(pd){
                                                                let dataSource = {
                                                                  type: "api",
                                                                  method: "POST",
                                                                  url: "/ime/imeLogisticsTrack/getDetailListByDeliveryId.action"
                                                                }

                                                                resolveDataSourceCallback({ dataSource:dataSource,eventPayload:{deliveryId:pd}},
                                                                    function (data) {
                                                                            pubsub.publish("@@form.init",{id:"SendModalForm",data:{aaa:data.data}})
                                                                    }
                                                                )
                                                            })

                                                        `
                                                    }
                                                },
                                            ],

                                        },

                                        {
                                            event:'SendModal-radio-1.onChange',
                                            pubs: [
                                                {
                                                    eventPayloadExpression: `
                                                        if(eventPayload=="2"){
                                                            callback(true)
                                                        }else{
                                                            callback(false)
                                                        }
                                                    `,
                                                    event: "SendModal-textField-1.enabled",
                                                }
                                            ],
                                        }
                                    ],

                                    columns:[
                                        {"title": "物料编码", "name": "mdMaterielInfoGidRef.code", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "物料名称", "name": "mdMaterielInfoGidRef.name", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "派工单编号", "name": "", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "计划数量", "name": "planQty", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "需求数量", "name": "reqQty", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "可发数量", "name": "unDeliveryQty", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "已发数量", "name": "deliveredQty", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "可收数量", "name": "unReceiveQty", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "已收数量", "name": "receivedQty", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},

                                        {
                                            "id": "SendModal-textField-8",
                                            "type": "textField",
                                            "title": "本次发货",
                                            "name": "deliveryQty2",
                                            "form":"SendModalForm",
                                            "enabled": false,
                                        },

                                        {"title": "数量单位", "name": "", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "物料需求时间", "name": "reqDate", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "最新需求时间", "name": "reqDate", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "需求状态", "name": "reqStatus", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "来源工单", "name": "", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "计划开始时间", "name": "", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},
                                        {"title": "最新开始时间", "name": "", "id": "SendModal-textField-1", "type": "textField", "form":"SendModalForm", "enabled": false},

                                    ]
                                }}
                            >
                            </FieldArray>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>

            <Row>
                <Col span={6} offset={18}>
                    <AppButton config={{
                        id: "SendModal-btn-1",
                        title: "取消",
                        type:"default",
                        size:"large",
                        visible: true,
                        enabled: true,
                        subscribes: [
                            {
                                event: "SendModal-btn-1.click",
                                pubs:[{
                                    event: "logistics-modal-1.onCancel",
                                }]
                            }
                        ]
                    }} />

                    {/*确定按钮*/}
                    <AppButton config={{
                        id: "SendModal-btn-2",
                        title: "确定",
                        type:"primary",
                        size:"large",
                        visible: true,
                        enabled: false,
                        subscribes: [
                            {
                                event:'SendModal-radio-1.onChange',
                                pubs: [
                                    {
                                        eventPayloadExpression: `
                                            if(eventPayload=="2"){
                                                callback(true)
                                            }else{
                                                resolveFetch({fetch:{id:'sendModal-tableField-1',data:'selectedRows'}}).then(function(res){
                                                    if(res&&res.length){
                                                        callback(true)
                                                    }else{
                                                        callback(false)
                                                    }
                                                })
                                            }
                                        `,
                                        event: "SendModal-btn-2.enabled",
                                    }
                                ],
                            },
                            {
                                event:"sendModal-tableField-1.onSelectedRows",
                                pubs: [
                                    {
                                        eventPayloadExpression: `
                                             let radio;
                                             resolveFetch({fetch:{id:'SendModalForm',data:'@@formValues'}}).then(function(py){
                                                if(py['SendModal-radio-1']){
                                                    if(py['SendModal-radio-1']=="1"){
                                                        radio=py['SendModal-radio-1'];
                                                        return radio;
                                                    }else{
                                                        callback(true)
                                                    }
                                                }else{
                                                    callback(false)
                                                }

                                             }).then(function(radio){
                                                if(eventPayload&&eventPayload.length&&radio){
                                                    callback(true)
                                                }
                                             })

                                        `,
                                        event: "SendModal-btn-2.enabled",
                                    },
                                    {
                                        event: "SendModal-btn-2orderSplitModal-btn-2.enabled",
                                        payload:true
                                    }
                                ]
                            },
                            {
                                event:'sendModal-tableField-1.onSelectedRowsClear',
                                pubs:[
                                    {
                                        eventPayloadExpression:`
                                            resolveFetch({fetch:{id:'sendModal-tableField-1',data:'selectedRows'}}).then(function(dt){
                                                let radio;
                                                 resolveFetch({fetch:{id:'SendModalForm',data:'@@formValues'}}).then(function(py){
                                                    if(py['SendModal-radio-1']&&py['SendModal-radio-1']=="1"){
                                                        if(!dt||!dt.length){
                                                            callback(false)
                                                        }
                                                    }
                                                 })
                                            })

                                        `,
                                        event: "SendModal-btn-2.enabled",
                                    }
                                ]
                            },

                            {
                                event: "SendModal-btn-2.click",
                                pubs:[
                                    {
                                        eventPayloadExpression:`
                                            let dataSource={
                                                type:'api',
                                                method:'post',
                                                mode:'dataContext',
                                                url:'/ime/imeLogisticsDelivery/deliverByTrackIdsSubmit.action',
                                            }

                                            let dataSource2={
                                                type:'api',
                                                method:'post',
                                                mode:'dataContext',
                                                url:'/ime/imeLogisticsDelivery/deliverSubmit.action',
                                            }

                                   //按物流派工单发货
                                    console.log('ssssss:::',submitValidateForm('SendModalForm'))

                                                resolveFetch({fetch:{id:'SendModalForm',data:'@@formValues'}}).then(function(pd){
                                                    if(pd['SendModal-radio-1']){
                                                        if(pd['SendModal-radio-1']=="1"){
                                                             resolveFetch({fetch:{id:'sendModal-tableField-1',data:'selectedRows'}}).then(function(st){
                                                                let arr=[];
                                                                _.map(st,function(item,index){
                                                                    arr.push(item.gid)
                                                                })

                                                                resolveDataSourceCallback({ dataSource:dataSource,dataContext:arr},
                                                                    function (data) {
                                                                            if(data.success){
                                                                                pubsub.publish("@@message.success",'发货成功!')
                                                                                pubsub.publish('logistics-dist-grid-index.loadData')
                                                                            }else{
                                                                                pubsub.publish("@@message.error",data.data)
                                                                            }
                                                                            pubsub.publish("logistics-modal-1.onCancel")
                                                                    }
                                                                )

                                                             })
                                                        }

                                                 //按明细发货
                                                        if(pd['SendModal-radio-1']=="2"){
                                                            if(!submitValidateForm('SendModalForm')){
                                                                resolveFetch({fetch:{id:'SendModalForm',data:'@@formValues'}}).then(function(pd){
                                                                    if(pd['SendModal-radio-1']){
                                                                        if(pd['SendModal-radio-1']=="2"&&pd.aaa&&pd.aaa.length){
                                                                            let arr=[];
                                                                            _.map(pd.aaa,function(item,index){
                                                                                let obj={};
                                                                                obj.id=item.gid;
                                                                                obj.deliveryQty=item.deliveryQty2||null;
                                                                                arr.push(obj)
                                                                            })

                                                                            resolveDataSourceCallback({ dataSource:dataSource2,dataContext:arr},
                                                                                function (data) {
                                                                                        if(data.success){
                                                                                            pubsub.publish("@@message.success",'发货成功!')
                                                                                            pubsub.publish('logistics-dist-grid-index.loadData')
                                                                                        }else{
                                                                                            pubsub.publish("@@message.error",data.data)
                                                                                        }
                                                                                        pubsub.publish("logistics-modal-1.onCancel")
                                                                                }
                                                                            )
                                                                        }
                                                                    }

                                                                })

                                                                }else{
                                                                    pubsub.publish('@@message.error','请正确填写表单!')
                                                                }

                                                            }

                                                    }

                                                })




                                        `,
                                    }
                                ],

                            }
                        ]

                    }} />

                </Col>
            </Row>

        </SendModalCss>
    }

}

SendModal.propTypes = {
    dispatch: PropTypes.func.isRequired,
  };
  
  
  function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    };
  }

function mapStateToProps(props) {
    return {
        onSubmit:()=>{}
    };
}
  
  let SendModalForm = reduxForm({
    form: "SendModalForm",
      validate,
    initialValues: Immutable.fromJS({ "SendModal-radio-1": "1" })
  })(SendModal)
  
  export default connect(mapStateToProps, mapDispatchToProps)(SendModalForm);