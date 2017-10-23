/**
 * Created by ASUS on 2017/9/23.
 */


import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col ,Tabs} from 'antd';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'
import { Link } from 'react-router';

import DropdownButton from 'components/DropdownButton';

import ModalContainer from 'components/ModalContainer'

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
import AppTable from 'components/AppTable';

import CoreComponent from 'components/CoreComponent'

import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
const TabPane = Tabs.TabPane;



export class DispatchOrderDetailPage2 extends React.PureComponent {
    constructor(props) {
        super(props);

        let modifyData;
        let modifyId;

        console.log('sssss:::',this.props.location.state[0])

        if(_.isArray(this.props.location.state)){
            modifyData = this.props.location.state[0];
            modifyId = this.props.location.state[0].gid;
        }else{
            modifyData = this.props.location.state;
            modifyId = this.props.location.state.gid;
        }

        if(modifyData!=undefined){
            var self=this;

            let dataSource={
                mode: "dataContext",
                type: "api",
                method: "POST",
                url:'/ime/imeLogisticsDelivery/query.action'
            }

            let que=this.props.location.state[0];

            console.log('que:::',que)

            resolveDataSource({ dataSource }).then(function (data) {
                let ext1=data.ext.enumHeader.sendStatus;
                let ext2=data.ext.enumHeader.recvStatus;
                for(let key in ext1){
                    if(key==que.sendStatus){
                        que.sendStatus=ext1[key]
                    }
                }

                for(let key in ext1){
                    if(key==que.recvStatus){
                        que.recvStatus=ext2[key]
                    }
                }

                pubsub.publish("@@form.init", { id: "detail112234", data: Immutable.fromJS(que)})

            })

        }

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
                <form>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>物流配送</Breadcrumb.Item>
                    <Breadcrumb.Item>物流配送单</Breadcrumb.Item>
                    <Breadcrumb.Item>配送单详情页</Breadcrumb.Item>
                </Breadcrumb>

                <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col>
                            {
                                    <AppButton config={{
                                        id: "cancel333",
                                        title: "返回",
                                        visible: true,
                                        enabled: true,
                                        type: "primary",
                                        subscribes: [
                                            {
                                                event: "cancel333.click",
                                                pubs: [
                                                    {
                                                        event: "@@navigator.goBack",
                                                    }
                                                ]
                                            }
                                        ]
                                    }}></AppButton>

                            }

                        </Col>
                    </Row>
                </Card>

                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "codeasdf",
                                label: "配送单号",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "配送单号",
                                form:'detail112234'
                            }} component={TextField} name="code" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "codeasdf2",
                                label: "需求产线",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "配送方案",
                            }} component={TextField} name="mdMrlDeliverySchemeGidRef.deliveryName" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "codeasdf123",
                                label: "配送方案",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "配送方案"
                            }} component={TextField} name="factoryLineGidRef.lineName" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "code4",
                                label: "供应仓库",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "配送方案"
                            }} component={TextField} name="mdWarehouseGidRef.warehouseName" />
                        </Col>
                    </Row>

                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "reqStartDate",
                                label: "需求开始时间",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "配送方案",
                                form:'detail112234'
                            }} component={TextField} name="reqStartDate" />
                        </Col>

                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "code6",
                                label: "需求结束时间",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "需求结束时间"
                            }} component={TextField} name="需求结束时间" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "code7",
                                label: "指定需求时间",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "需求结束时间"
                            }} component={TextField} name="appointReqEndDate" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "code8",
                                label: "发货状态",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "发货状态"
                            }} component={TextField} name="sendStatus" />
                        </Col>
                    </Row>

                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "code9",
                                label: "收货状态",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "发货状态"
                            }} component={TextField} name="recvStatus" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "code10",
                                label: "打印时间",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "打印时间"
                            }} component={TextField} name="printDate" />
                        </Col>
                        <Col span={6}>

                        </Col>
                        <Col span={6}>

                        </Col>
                    </Row>

                </Card>

                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Tabs defaultActiveKey="logistics-dist-tabs-1">
                        <TabPane tab="物流派工单" key="logistics-dist-tabs-1">
                            <AppTable name="logistics-dist-grid-1" config={{
                                "id": "logistics-dist-grid-1",
                                "name": "logistics-dist-grid-1",
                                "type": "checkbox",//表格单选复选类型
                                "size": "default",//表格尺寸
                                "rowKey": "gid",//主键
                                "onLoadData": true,//初始化是否加载数据
                                "tableTitle": "",//表头信息
                                "width": 2850,//表格宽度
                                "showSerial": true,//是否显示序号
                                // "editType": true,//是否增加编辑列
                                "page": 1,//当前页
                                "pageSize": 10,//一页多少条
                                "isPager": false,//是否分页
                                "isSearch": false,//是否显示模糊查询
                                "columns": [
                                    {title: '物流派工单编号', width: 150, dataIndex: 'code', key: '1'},
                                    {title: '来源物流工单号', width: 150, dataIndex: 'logisticsWorkOrderGidRef.code', key: '2'},
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
                                    {title: '工序', dataIndex: 'routeOpeartionName', key: '18', width: 150},
                                    {title: '工位', dataIndex: 'factoryWorkStationGidRef.stationName', key: '19', width: 150},
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    url: '/ime/imeLogisticsTrack/getListByDeliveryId.action',
                                    payload:{deliveryId:this.props.location.state[0].gid}
                                },

                            }}/>
                        </TabPane>
                        <TabPane tab="物料明细" key="logistics-dist-tabs-2">
                            <AppTable name="logistics-dist-grid-2" config={{
                                "id": "logistics-dist-grid-2",
                                "name": "logistics-dist-grid-2",
                                "type": "checkbox",//表格单选复选类型
                                "size": "default",//表格尺寸
                                "rowKey": "gid",//主键
                                "onLoadData": true,//初始化是否加载数据
                                "tableTitle": "",//表头信息
                                "width": 2550,//表格宽度
                                "showSerial": true,//是否显示序号
                                // "editType": true,//是否增加编辑列
                                "page": 1,//当前页
                                "pageSize": 10,//一页多少条
                                "isPager": false,//是否分页
                                "isSearch": false,//是否显示模糊查询
                                "columns": [
                                    {title: '物料编号', width: 150, dataIndex: 'mdMaterielInfoGidRef.code', key: '1'},
                                    {title: '物料名称 ', width: 150, dataIndex: 'mdMaterielInfoGidRef.name', key: '2'},
                                    {title: '计划数量', dataIndex: 'planQty', key: '3', width: 150},
                                    {title: '需求数量', dataIndex: 'reqQty', key: '4', width: 150},
                                    {title: '可发数量', dataIndex: 'unDeliveryQty', key: '5', width: 150},
                                    {title: '已发数量', dataIndex: 'deliveredQty', key: '6', width: 150},
                                    {title: '可收数量', dataIndex: 'unReceiveQty', key: '7', width: 150},
                                    {title: '已收数量', dataIndex: 'receivedQty', key: '8', width: 150},
                                    {title: '数量单位', dataIndex: 'standardUnit', key: '9', width: 150},
                                    {title: '物料需求时间', dataIndex: 'reqDate', key: '10', width: 150},
                                    {title: '最新需求时间', dataIndex: '', key: '11', width: 150},
                                    {title: '需求状态', dataIndex: 'reqStatus', key: '12', width: 150},
                                    {title: '来源工单', dataIndex: '', key: '13', width: 150},
                                    {title: '来源订单', dataIndex: '', key: '14', width: 150},
                                    {title: '产品编号', dataIndex: '', key: '15', width: 150},
                                    {title: '计划开始时间', dataIndex: '', key: '16', width: 150},
                                    {title: '最新开始时间', dataIndex: '', key: '17', width: 150},
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    url: '/ime/imeLogisticsTrack/getDetailListByDeliveryId.action',
                                    payload:{deliveryId:this.props.location.state[0].gid}
                                },

                            }}/>
                        </TabPane>
                        <TabPane tab="发货明细" key="logistics-dist-tabs-3">
                            <AppTable name="logistics-dist-grid-3" config={{
                                "id": "logistics-dist-grid-3",
                                "name": "logistics-dist-grid-3",
                                "type": "checkbox",//表格单选复选类型
                                "size": "default",//表格尺寸
                                "rowKey": "gid",//主键
                                "onLoadData": true,//初始化是否加载数据
                                "tableTitle": "",//表头信息
                                "width": 750,//表格宽度
                                "showSerial": true,//是否显示序号
                                // "editType": true,//是否增加编辑列
                                "page": 1,//当前页
                                "pageSize": 10,//一页多少条
                                "isPager": false,//是否分页
                                "isSearch": false,//是否显示模糊查询
                                "columns": [
                                    {title: '发货编号', width: 150, dataIndex: 'code', key: '1'},
                                    {title: '物料编号 ', width: 150, dataIndex: 'mdMaterialInfoGidRef.code', key: '2'},
                                    {title: '已发数量', dataIndex: 'sendNum', key: '3', width: 150},
                                    {title: '发货时间', dataIndex: 'sendDate', key: '4', width: 150},
                                    {title: '发货人', dataIndex: 'sendPersonGidRef.personnelName', key: '5', width: 150},
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    pager: false,
                                    url: '/ime/imeLogisticsDelivery/findDeliverDetail.action',
                                    payload:{id:this.props.location.state[0].gid,trackId:''}
                                },
                            }}/>
                        </TabPane>
                        <TabPane tab="收货明细" key="logistics-dist-tabs-4">
                            <AppTable name="logistics-dist-grid-4" config={{
                                "id": "logistics-dist-grid-4",
                                "name": "logistics-dist-grid-4",
                                "type": "checkbox",//表格单选复选类型
                                "size": "default",//表格尺寸
                                "rowKey": "gid",//主键
                                "onLoadData": true,//初始化是否加载数据
                                "tableTitle": "",//表头信息
                                "width": 550,//表格宽度
                                "showSerial": true,//是否显示序号
                                // "editType": true,//是否增加编辑列
                                "page": 1,//当前页
                                "pageSize": 10,//一页多少条
                                "isPager": true,//是否分页
                                "isSearch": false,//是否显示模糊查询
                                "columns": [
                                    {title: '收货编号', width: 150, dataIndex: 'code', key: '1'},
                                    {title: '物料编号 ', width: 150, dataIndex: 'mdMaterialInfoGidRef.code', key: '2'},
                                    {title: '收货数量', dataIndex: 'recvNum', key: '3', width: 150},
                                    {title: '签收时间', dataIndex: 'recvDate', key: '4', width: 150},
                                    {title: '签收人', dataIndex: 'recvPersonGidRef.personnelName', key: '5', width: 150},
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    pager: true,
                                    url: '/ime/imeLogisticsDelivery/findReceivingDetail.action',
                                    payload:{id:this.props.location.state[0].gid,trackId:''}
                                },
                            }}/>
                        </TabPane>
                    </Tabs>
                </Card>
                </form>

            </div>
        );
    }
}

DispatchOrderDetailPage2.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


let DispatchOrderDetail2= reduxForm({
    form: "detail112234",
    initialValues: Immutable.fromJS({})
})(DispatchOrderDetailPage2)

function mapStateToProps(props) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DispatchOrderDetail2);
