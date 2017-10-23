/**
 * Created by ASUS on 2017/9/25.
 */

import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable';
import pubsub from 'pubsub-js'

import {Breadcrumb, Card, Row, Col,Layout,Tabs} from 'antd';
const TabPane = Tabs.TabPane;
const { Header, Footer, Sider, Content } = Layout;
import { resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'

import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton';
import TableField from 'components/Form/TableField';
import TextField from 'components/Form/TextField'
import ModalContainer from 'components/ModalContainer'
import FindbackField from 'components/Form/FindbackField'
import DropdownButton from '../../../components/DropdownButton';
import CreateModal from './CreateModal';
import ReportModal from './ReportModal';
import QualityDispatchModal from './QualityDispatchModal';

export class QualityDispatchPage extends React.PureComponent {
    constructor(props) {
        super(props);
        // pubsub.subscribe(`query.refresh`, () => {
        //     this.requestQuery()
        // })
    }

    componentDidMount() {
        // this.requestQuery()
    }

    componentWillUnmount() {
        // this.unSubscribeFetchData()
    }

    render(){
        return <div>
            <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item>质量管理</Breadcrumb.Item>
                <Breadcrumb.Item>报检单</Breadcrumb.Item>
            </Breadcrumb>
            <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                  bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                <Row>
                    <Col span={14} xs={24}>
                        <DropdownButton config={{
                            id: 'orderSplitModal_1',
                            name: '创建',
                            enabled: true,
                            type:"primary",
                            size:"large",
                            subscribes: [
                                {
                                    event: "orderSplitModal_1.onClick",
                                    pubs:[
                                        {
                                            eventPayloadExpression:`
                                                if(eventPayload=="0"){
                                                    pubsub.publish("@@navigator.push",{url:"qualityDispatch/detail"})
                                                }
                                                if(eventPayload=="1"){
                                                    pubsub.publish("qualityModal-1.openModal")
                                                }
                                              `
                                        }
                                    ]
                                },
                            ],
                            dataSource: {
                                type: 'customValue',
                                values: [
                                    {key: "0", name: "直接创建" ,"enabled":true},
                                    {key: "1", name: "参照生成","enabled":true},
                                ]

                            },
                            displayField: "name",
                            valueField: "id"
                        }} name="orderSplitModal_1"></DropdownButton>

                        <AppButton config={{
                            id: "2",
                            title: "修改",
                            type: "primary",
                            size: "large",
                            visible: true,
                            enabled: false,
                            subscribes: [
                                {
                                    event:"1234567890.onSelectedRows",
                                    pubs: [
                                        {
                                            event: "2.enabled",
                                            payload:true
                                        }
                                    ]
                                },
                                {
                                    event:"1234567890.onSelectedRowsClear",
                                    pubs: [
                                        {
                                            event: "2.enabled",
                                            payload:false
                                        }
                                    ]
                                },
                                {
                                    event: "2.click",
                                    behaviors: [
                                        {
                                            type: "fetch",
                                            id: "1234567890", //要从哪个组件获取数据
                                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                                            successPubs: [  //获取数据完成后要发送的事件
                                                {
                                                    event: "@@navigator.push",
                                                    mode: "payload&&eventPayload",
                                                    payload: {
                                                        url: "qualityDispatch/detail"
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
                            id: "3",
                            title: "删除",
                            type:"primary",
                            size:"large",
                            visible: true,
                            enabled: false,
                            subscribes: [
                                {
                                    event:"1234567890.onSelectedRows",
                                    pubs: [
                                        {
                                            event: "3.enabled",
                                            payload:true
                                        },
                                        {
                                            event: "3.dataContext"
                                        }
                                    ]
                                },
                                {
                                    event:"1234567890.onSelectedRowsClear",
                                    pubs: [
                                        {
                                            event: "3.enabled",
                                            payload:false
                                        }
                                    ]
                                },
                                {
                                    event: "1234567890.onSelectedRows",
                                    pubs: [
                                        {
                                            event: "3.dataContext"
                                        }
                                    ]
                                },
                                {
                                    event: "3.click",
                                    // pubs:[
                                    //     {
                                    //         eventPayloadExpression:`
                                    //             console.log("eventPayload1",eventPayload)
                                    //             let st=false;
                                    //             let arr=[];
                                    //              _.map(eventPayload,function(item,index){
                                    //                 arr.push(item.gid)
                                    //                 if(item.qcHasDispatchedQty=="0"){
                                    //                     st=true;
                                    //                 }
                                    //             })
                                    //
                                    //             if(st){
                                    //                 pubsub.publish('@@message.error',"包含已发生业务操作的单据!")
                                    //             }else{
                                    //                 let dataSoure=dataSource: {
                                    //                     type: "api",
                                    //                     method: "POST",
                                    //                     url: "/ime/imeQcQac/delete.action",
                                    //                 }
                                    //
                                    //                 resolveDataSourceCallback({dataSource:dataSource,eventPayload:arr},function(res){
                                    //                     if(res.success){
                                    //                         pubsub.publish('@@message.success',"删除成功!")
                                    //                     }else{
                                    //                         pubsub.publish('@@message.error',res.data)
                                    //                     }
                                    //                 })
                                    //             }
                                    //
                                    //
                                    //
                                    //         `
                                    //     }
                                    // ],
                                    behaviors: [
                                        {
                                            type: "request",
                                            dataSource: {
                                                type: "api",
                                                method: "POST",
                                                url: "/ime/imeQcQac/delete.action",
                                                paramsInQueryString:false,//参数拼在url后面
                                                payloadMapping:[{
                                                    from: "dataContext",
                                                    to: "@@Array",
                                                    key: "gid"
                                                }]
                                            },
                                            successPubs: [
                                                {
                                                    event: "@@message.success",
                                                    payload:'删除成功!'
                                                },
                                                {
                                                    event: "1234567890.loadData"
                                                }
                                            ],
                                            errorPubs: [
                                                {
                                                    event: "@@message.error",
                                                    eventPayloadExpression:`
                                                      if(eventPayload){
                                                        callback(eventPayload);
                                                      }else{
                                                        callback("删除失败!");
                                                      }

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
                            id: "5",
                            title: "派检",
                            size: "large",
                            visible: true,
                            enabled: false,
                            subscribes: [
                                {
                                    event:"1234567890.onSelectedRows",
                                    pubs: [
                                        {
                                            event: "5.enabled",
                                            payload:true
                                        }
                                    ]
                                },
                                {
                                    event:"1234567890.onSelectedRowsClear",
                                    pubs: [
                                        {
                                            event: "5.enabled",
                                            payload:false
                                        }
                                    ]
                                },
                                {
                                    event: "5.click",
                                    behaviors: [
                                        {
                                            type: "fetch",
                                            id: "1234567890", //要从哪个组件获取数据
                                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                                            successPubs: [  //获取数据完成后要发送的事件
                                                {
                                                    event: "qualityModal-2.openModal",

                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }}>
                        </AppButton>

                        <AppButton config={{
                            id: "4",
                            title: "报检",
                            size: "large",
                            visible: true,
                            enabled: false,
                            subscribes: [
                                {
                                    event:"1234567890.onSelectedRows",
                                    pubs: [
                                        {
                                            event: "4.enabled",
                                            payload:true
                                        }
                                    ]
                                },
                                {
                                    event:"1234567890.onSelectedRowsClear",
                                    pubs: [
                                        {
                                            event: "4.enabled",
                                            payload:false
                                        }
                                    ]
                                },
                                {
                                    event: "4.click",
                                    behaviors: [
                                        {
                                            type: "fetch",
                                            id: "1234567890", //要从哪个组件获取数据
                                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                                            successPubs: [  //获取数据完成后要发送的事件
                                                {
                                                    event: "qualityModal-3.openModal",

                                                }
                                            ]
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
                <AppTable name="1234567890" config={{
                    "id": "1234567890",
                    "name": "1234567890",
                    "type": "checkbox",//表格单选复选类型
                    "size": "default",//表格尺寸
                    "rowKey": "gid",//主键
                    "onLoadData": true,//初始化是否加载数据
                    "tableTitle": "",//表头信息
                    "width": 1500,//表格宽度
                    "showSerial": true,//是否显示序号
                    "page": 1,//当前页
                    "pageSize": 10,//一页多少条
                    "isPager": true,//是否分页
                    "isSearch": true,//是否显示模糊查询
                    "columns": [
                        { title: '派检单编号', width: 100, dataIndex: 'code', key: '1' },
                        { title: '检验类别', width: 100, dataIndex: 'checkType', key: '2' },
                        { title: '创建来源', width: 150, dataIndex: 'createSource', key: '3' },
                        { title: '报检记录编号', dataIndex: 'imeQcQacRecordCode', key: '4', width: 150 },
                        { title: '产品编号', dataIndex: 'mdProductInfoGidRef.materialGidRef.code', key: '5', width: 100 },
                        { title: '产品名称', dataIndex: 'mdProductInfoGidRef.materialGidRef.name', key: '6', width: 100 },
                        { title: '应检数量', dataIndex: 'shouldCheckQty', key: '7', width: 150 },
                        { title: '累计派检', dataIndex: 'qcHasDispatchedQty', key: '8', width: 150 },
                        { title: '累计报检', dataIndex: 'qcHasInspectionQty', key: '9', width: 150 },
                        { title: '工单', dataIndex: 'imeWorkOrderGidRef.code', key: '10', width: 100 },
                        { title: '派工单', dataIndex: 'imeTrackOrderGidRef.code', key: '11', width: 100 },
                        { title: '工序', dataIndex: 'mdRouteOperationName', key: '12', width: 100 },
                        { title: '工艺路线', dataIndex: 'mdRouteLineGidRef.name', key: '13', width: 100 },
                        { title: '派检状态', dataIndex: 'qcDispatqcChStatus', key: '14', width: 100 },
                        { title: '报检状态', dataIndex: 'qcInspectionStatus', key: '15', width: 100 },
                    ],
                    rowOperationItem: [
                        {
                            id: "23456789009865",
                            type: "linkButton",
                            title: "删除",
                            subscribes: [

                                {
                                    event: "23456789009865.click",
                                    behaviors: [
                                        {
                                            type: "request",
                                            dataSource: {
                                                type: "api",
                                                method: "POST",
                                                paramsInQueryString: false,//参数拼在url后面
                                                url: "/ime/imePlanOrder/delete.action",
                                                payloadMapping:[{
                                                    from: "dataContext",
                                                    to: "@@Array",
                                                    key: "gid"
                                                }]
                                            },
                                            successPubs: [
                                                {
                                                    outside:true,
                                                    event: "@@message.success",
                                                    payload:'删除成功!'
                                                },
                                                {
                                                    outside:true,
                                                    event: "1234567890.loadData",
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
                    subscribes:[
                        {
                            event:'1234567890.onSelectedRows',
                            pubs:[
                                {
                                    event:'orderMergeModal_1.dataContext'
                                }
                            ]
                        },
                        {
                            event:'1234567890.onSelectedRowsClear',
                            pubs:[
                                {
                                    event:'orderMergeModal_1.dataContext'
                                }
                            ]
                        }
                    ],
                    dataSource: {
                        type: 'api',
                        method: 'post',
                        pager:true,
                        url: '/ime/imeQcQac/query.action'
                    }
                }} />
            </Card>

            <ModalContainer config={{
                visible: false, // 是否可见，必填*
                enabled: true, // 是否启用，必填*
                id: "qualityModal-1", // id，必填*
                pageId: "qualityModal-1", // 指定是哪个page调用modal，必填*
                type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                title: "参照", // title，不传则不显示title
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
                <CreateModal/>
            </ModalContainer>
            <ModalContainer config={{
                visible: false, // 是否可见，必填*
                enabled: true, // 是否启用，必填*
                id: "qualityModal-2", // id，必填*
                pageId: "qualityModal-2", // 指定是哪个page调用modal，必填*
                type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                title: "派检", // title，不传则不显示title
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
                <QualityDispatchModal/>
            </ModalContainer>
            <ModalContainer config={{
                visible: false, // 是否可见，必填*
                enabled: true, // 是否启用，必填*
                id: "qualityModal-3", // id，必填*
                pageId: "qualityModal-3", // 指定是哪个page调用modal，必填*
                type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                title: "报检", // title，不传则不显示title
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
                <ReportModal/>
            </ModalContainer>

        </div>
    }
}


QualityDispatchPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


export default reduxForm({
    form: "distributionTypeForm",
})(QualityDispatchPage)