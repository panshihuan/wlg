import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import pubsub from 'pubsub-js'
import { fromJS } from "immutable"

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
import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'
import ModalContainer from 'components/ModalContainer'
import AppTable from 'components/AppTable';

import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

const TabPane = Tabs.TabPane;
const validate = values => {
    const errors = {}
    if (!values.getIn(['mdProductInfoGidRef', 'materialGidRef', 'code'])) {
        errors.mdProductInfoGidRef = {}
        errors.mdProductInfoGidRef.materialGidRef = {}
        errors.mdProductInfoGidRef.materialGidRef.code = '必填项'
    }

    return errors
}

class Detail extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
        if (this.props.location.state[0]) {
            let id = this.props.location.state[0].gid
            let dataSource = {
                mode: "dataContext",
                type: "api",
                method: "POST",
                url: "/ime/imeQcQac/findById.action",
            }
            resolveDataSource({ dataSource, dataContext: { id: id } }).then(function (res) {
                if (res.data.qcDispatqcChStatus === undefined) {
                    res.data.qcDispatqcChStatus1 = ''
                } else {
                    res.data.qcDispatqcChStatus1 = res.ext.enumHeader.qcDispatqcChStatus[res.data.qcDispatqcChStatus]
                }
                if (res.data.qcInspectionStatus === undefined) {
                    res.data.qcInspectionStatus1 = ''
                } else {
                    res.data.qcInspectionStatus1 = res.ext.enumHeader.qcInspectionStatus[res.data.qcInspectionStatus]
                }
                pubsub.publish("@@form.init", { id: "detail", data: fromJS(res.data) })
                let id = res.data.gid
                pubsub.publish("123paijian90.loadData", {
                    "query": {
                        "query": [
                            {
                                "field": "imeQcQacGid", "type": "eq", "value": id
                            }
                        ],
                        "sorted": "gid asc"
                    }
                })
            })

        } else {
            pubsub.publish("@@form.init", { id: "detail", data: { "checkType": "59B118ACACD83D66E055000000000001", "createSource": "59B118ACACDB3D66E055000000000001", "qcHasDispatchedQty": 0 } })
        }


    }

    componentWillMount() {
    }
    componentDidMount() {
        if (this.props.location.state[0]) {
            pubsub.publish("save222.visible", false)
        } else {
            pubsub.publish("save222modify.visible", false)
        }
    }
    componentWillUnmount() {

    }
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div style={{ backgroundColor: "#f9f9f9", padding: "10px" }}>
                <Breadcrumb className="breadcrumb" separator=">">
                    <Breadcrumb.Item>质量管理</Breadcrumb.Item>
                    <Breadcrumb.Item>报检单</Breadcrumb.Item>
                    <Breadcrumb.Item>报检单详情</Breadcrumb.Item>
                </Breadcrumb>
                <Card style={{ width: "100%", backgroundColor: "#fff" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col>
                            <AppButton config={{
                                id: "save222",
                                title: "保存",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "save222.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/imeQcQac/add.action",
                                                    withForm: "detail",
                                                },
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        mode: "payload&&dataContext",
                                                        payload: {
                                                            url: "/qualityDispatch"
                                                        }
                                                    }, {
                                                        event: "@@message.success",
                                                        payload: "新增成功"
                                                    }
                                                ],
                                                errorPubs: [
                                                    {
                                                        event: "@@message.error",
                                                        payload: "新增失败"
                                                    }
                                                ]
                                            }
                                        ],
                                    }
                                ]
                            }}></AppButton>

                            <AppButton config={{
                                id: "save222modify",
                                title: "保存",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "save222modify.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/imeQcQac/modify.action",
                                                    withForm: "detail",
                                                },
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        mode: "payload&&dataContext",
                                                        payload: {
                                                            url: "/qualityDispatch"
                                                        }
                                                    }, {
                                                        event: "@@message.success",
                                                        payload: "修改成功"
                                                    }
                                                ],
                                                errorPubs: [
                                                    {
                                                        event: "@@message.error",
                                                        payload: "修改失败"
                                                    }
                                                ]
                                            }
                                        ],
                                    }
                                ]
                            }}></AppButton>


                            <AppButton config={{
                                id: "savechuangeee",
                                title: "取消",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "savechuangeee.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "/qualityDispatch"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }}></AppButton>
                        </Col>
                    </Row>
                </Card>
                <Card style={{ width: "100%", backgroundColor: "#fff" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "code",
                                label: "派检单编号",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "自动生成"
                            }} component={TextField} name="code" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                form: "detail",
                                id: "gCode",
                                label: "检验类别",
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                dataSource: {
                                    type: "api",
                                    method: "post",
                                    url: "/sm/dictionaryEnumValue/query.action",
                                    mode: "payload",
                                    payload: {
                                        "query": {
                                            "query": [
                                                { "field": "smDictionaryEnumGid", "type": "eq", "value": "59B118ACACD43D66E055000000000001" }
                                            ],
                                            "sorted": "seq"
                                        }
                                    },
                                },
                                displayField: "val",
                                valueField: "gid",
                            }} name="checkType" component={SelectField} />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "gName",
                                label: "创建来源",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                dataSource: {
                                    type: "api",
                                    method: "post",
                                    url: "/sm/dictionaryEnumValue/query.action",
                                    mode: "payload",
                                    payload: {
                                        "query": {
                                            "query": [
                                                { "field": "smDictionaryEnumGid", "type": "eq", "value": "59B118ACACD53D66E055000000000001" }
                                            ],
                                            "sorted": "seq"
                                        }
                                    },
                                },
                                displayField: "val",
                                valueField: "gid",
                            }} component={SelectField} name="createSource" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                visible: true,
                                id: "numUnit",
                                label: "报检记录编号",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "根据规则回写"
                            }} component={TextField} name="imeQcQacRecordCode" />
                        </Col>
                    </Row>

                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "payTime",
                                label: "产品编号",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                showRequiredStar: true,
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                form: "detail",
                                tableInfo: {
                                    id: "tabmhdhd555",
                                    size: "small",
                                    rowKey: "gid",
                                    tableTitle: "产品信息",
                                    width: 100,
                                    columns: [
                                        { title: '产品编号', width: 200, dataIndex: 'materialGidRef.code', key: '1' },
                                        { title: '产品名称', width: 200, dataIndex: 'materialGidRef.name', key: '2' },
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/ime/mdProductInfo/query.action'
                                    }
                                },
                                pageId: 'findhiuueu65656',
                                displayField: "materialGidRef.code",
                                valueField: {
                                    "from": "materialGidRef.code",
                                    "to": "mdProductInfoGidRef.materialGidRef.name"
                                },
                                associatedFields: [
                                    {
                                        "from": "materialGidRef.name",
                                        "to": "mdProductInfoGidRef.materialGidRef.name"
                                    },
                                    {
                                        "from": "gid",
                                        "to": "mdProductInfoGid"
                                    }
                                ],
                            }} component={FindbackField} name="mdProductInfoGidRef.materialGidRef.code" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "planNum",
                                label: "产品名称",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "产品编号带出",
                            }} component={TextField} name="mdProductInfoGidRef.materialGidRef.name" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "realNum",
                                label: "应检数量",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                min: 0
                            }} component={InputNumberField} name="shouldCheckQty" />
                        </Col>

                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "realNum",
                                label: "累计派检",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                min: 0
                            }} component={InputNumberField} name="qcHasDispatchedQty" />
                        </Col>
                        </Row>
                        <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "realNum2",
                                label: "累计报检",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                min: 0
                            }} component={InputNumberField} name="qcHasInspectionQty" />
                        </Col>

                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "orderType",
                                label: "工单",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "根据规则回写",
                            }} component={TextField} name="imeWorkOrderGidRef.code" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "orderState",
                                label: "派工单",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "根据规则回写"
                            }} component={TextField} name="imeTrackOrderGidRef.code" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "artRoute",
                                label: "工序",
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "根据规则回写"
                            }} name="mdRouteOperationName" component={TextField} />
                        </Col>
                        </Row>

                    <Row>
                       
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "workCenter",
                                label: "工艺路线",
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "根据规则回写"
                            }} name="mdRouteLineGidRef.name" component={TextField} />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "workLine1",
                                label: "派检状态",
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "根据规则回写"
                            }} name="qcDispatqcChStatus1" component={TextField} />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "workLine444",
                                label: "报检状态",
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                placeholder: "根据规则回写"
                            }} name="qcInspectionStatus1" component={TextField} />
                        </Col>
                    </Row>

                </Card>

                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="派检记录" key="1">
                            <Row>
                                <Col>
                                    <AppTable name="1234567890" config={{
                                        "id": "123paijian90",
                                        "name": "1234567890",
                                        "type": "checkbox",//表格单选复选类型
                                        "size": "default",//表格尺寸
                                        "rowKey": "gid",//主键
                                        "onLoadData": false,//初始化是否加载数据
                                        "width": 1200,//表格宽度
                                        "showSerial": true,//是否显示序号
                                        "editType": false,//是否增加编辑列
                                        "page": 1,//当前页
                                        "pageSize": 10,//一页多少条
                                        "isPager": true,//是否分页
                                        "isSearch": true,//是否显示模糊查询
                                        "columns": [
                                            { title: '派检记录编号', width: 100, dataIndex: 'code', key: '1' },
                                            { title: '派检数量', width: 100, dataIndex: 'qcDispatchedQty', key: '2' },
                                            { title: '报检数量', width: 100, dataIndex: 'qcInspectionQty', key: '3' },
                                            { title: '派检人', dataIndex: 'qcDispatchedPersonRef.personnelName', key: '4', width: 100 },
                                            { title: '检验员', dataIndex: 'surveyorRef.personnelName', key: '5', width: 100 },
                                            { title: '派检工位', dataIndex: 'mdFactoryWorkStationGidRef.stationName', key: '6', width: 100 },
                                            { title: '检验方式', dataIndex: 'imeQcQualityWayGidRef.name', key: '7', width: 100, },
                                            { title: '派检时间', dataIndex: 'qcDispatchedTime', key: '8', width: 100, },
                                            { title: '计划开检时间', dataIndex: 'checkBeginTime', key: '9', width: 100 },
                                            { title: '计划检完时间', dataIndex: 'checkEndTime', key: '10', width: 100 },
                                            { title: '报检状态', dataIndex: 'qcInspectionStatus', key: '11', width: 100 },
                                            { title: '质检说明', dataIndex: 'remarks', key: '12', width: 100 },
                                        ],
                                        dataSource: {
                                            type: 'api',
                                            method: 'post',
                                            pager: true,
                                            url: '/ime/imeQcQacBill/query.action'
                                        },
                                        subscribes:[
                                            {
                                                event:"123paijian90.onSelectedRowsClear",
                                                pubs:[
                                                    {
                                                        event:"123jianjun90.setData",
                                                        payload:[]
                                                    },{
                                                        event:"12baojilujiann90.setData",
                                                        payload:[]
                                                    },{
                                                        event:"12bajincrahn90.setData", 
                                                        payload:[]
                                                    },{
                                                        event:"12quexianhn90.setData",
                                                        payload:[]
                                                    }
                                                ]
                                            }
                                        ]
                                    }} />
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tab="检具/量具" key="2">
                            <Row>
                                <Col>
                                    <AppTable name="1234cdeee890" config={{
                                        "id": "123jianjun90",
                                        "name": "1234567890",
                                        "type": "checkbox",//表格单选复选类型
                                        "size": "default",//表格尺寸
                                        "rowKey": "gid",//主键
                                        "onLoadData": false,//初始化是否加载数据
                                        "width": 700,//表格宽度
                                        "showSerial": true,//是否显示序号
                                        "editType": false,//是否增加编辑列
                                        "page": 1,//当前页
                                        "pageSize": 10,//一页多少条
                                        "isPager": true,//是否分页
                                        "isSearch": true,//是否显示模糊查询
                                        "columns": [
                                            { title: '派检记录编号', width: 100, dataIndex: 'imeQcQacBillGidRef.code', key: '1' },
                                            { title: '检具编码', width: 100, dataIndex: 'code', key: '2' },
                                            { title: '检具名称', width: 100, dataIndex: 'name', key: '3' },
                                            { title: '数量', width: 100, dataIndex: 'qty', key: '4' },
                                            { title: '单位', dataIndex: 'mdMeasurementUnitGid', key: '5', width: 100 },
                                            { title: '有效使用起始时间', dataIndex: 'useBeginTime', key: '6', width: 100 },
                                            { title: '有效使用截止时间', dataIndex: 'useEndTime', key: '7', width: 100 },
                                        ],
                                        dataSource: {
                                            type: 'api',
                                            method: 'post',
                                            pager: true,
                                            url: '/ime/imeQcBillCheckingtool/query.action'
                                        },
                                        subscribes: [
                                            {
                                                event: "123jianjun90.onTableTodoAny",
                                                behaviors: [
                                                    {
                                                        type: "fetch",
                                                        id: "123paijian90", //要从哪个组件获取数据
                                                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                        successPubs: [  //获取数据完成后要发送的事件
                                                            {
                                                                event: "123jianjun90.loadData",
                                                                eventPayloadExpression: `
                                                            let payload ={}
                                                            if(!eventPayload){
                                                                eventPayload = []
                                                            }
                                                            if(eventPayload.length){
                                                                let ids = []
                                                                for(var i=0;i<eventPayload.length;i++){
                                                                    ids.push(eventPayload[i].gid)
                                                                }
                                                                payload = {
                                                                "query": {
                                                                    "query": [
                                                                    {
                                                                        "field": "imeQcQacBillGid", "type": "in", "value": ids.join(',')
                                                                    }
                                                                    ],
                                                                    "sorted": "gid asc"
                                                                }
                                                                }
                                                                callback(payload)
                                                            }
                                                                
                              `
                                                            }
                                                        ]
                                                    }
                                                ],
                                            },{
                                                event:"123paijian90.onSelectedRows",
                                                pubs:[
                                                    {
                                                        event: "123jianjun90.loadData",
                                                        eventPayloadExpression: `
                                                    let payload ={}
                                                    if(eventPayload.length){
                                                    let ids = []
                                                    for(var i=0;i<eventPayload.length;i++){
                                                        ids.push(eventPayload[i].gid)
                                                    }
                                                        payload = {
                                                        "query": {
                                                            "query": [
                                                            {
                                                                "field": "imeQcQacBillGid", "type": "in", "value": ids.join(',')
                                                            }
                                                            ],
                                                            "sorted": "gid asc"
                                                        }
                                                        }
                                                        callback(payload)
                                                    }
                                                    `
                                                    }
                                                ]
                                            }
                                        ]
                                    }} />
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tab="报检记录" key="3">
                            <Row>
                                <Col>
                                    <AppTable name="12baoj7890" config={{
                                        "id": "12baojilujiann90",
                                        "name": "1234567890",
                                        "type": "checkbox",//表格单选复选类型
                                        "size": "default",//表格尺寸
                                        "rowKey": "gid",//主键
                                        "onLoadData": false,//初始化是否加载数据
                                        "width": 1000,//表格宽度
                                        "showSerial": true,//是否显示序号
                                        "editType": false,//是否增加编辑列
                                        "page": 1,//当前页
                                        "pageSize": 10,//一页多少条
                                        "isPager": true,//是否分页
                                        "isSearch": true,//是否显示模糊查询
                                        "columns": [
                                            { title: '派检记录编号', width: 100, dataIndex: 'imeQcQacBillGidRef.code', key: '1' },
                                            { title: '报检记录编号', width: 100, dataIndex: 'code', key: '2' },
                                            { title: '派检数量', width: 100, dataIndex: 'qcDispatchedQty', key: '3' },
                                            { title: '报检数量', width: 100, dataIndex: 'qcInspectionQty', key: '4' },
                                            { title: '报检人', dataIndex: 'qcInspectionPersonRef.personnelName', key: '5', width: 100 },
                                            { title: '报检工位', dataIndex: 'mdFactoryWorkStationGidRef.stationName', key: '6', width: 100 },
                                            { title: '报检时间', dataIndex: 'qcInspectionTime', key: '7', width: 100 },
                                            { title: '检验结果', dataIndex: 'imeQcQualityGradeRef.name', key: '8', width: 100, },
                                            { title: '质量处理方式', dataIndex: 'qcHandleWay', key: '9', width: 100, },
                                            { title: '质检说明', dataIndex: 'remarks', key: '10', width: 100 },
                                        ],
                                        dataSource: {
                                            type: 'api',
                                            method: 'post',
                                            pager: true,
                                            url: '/ime/imeQcQacRecord/query.action'
                                        },
                                       
                                        subscribes: [
                                            {
                                                event: "12baojilujiann90.onTableTodoAny",
                                                behaviors: [
                                                    {
                                                        type: "fetch",
                                                        id: "123paijian90", //要从哪个组件获取数据
                                                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                        successPubs: [  //获取数据完成后要发送的事件
                                                            {
                                                                event: "12baojilujiann90.loadData",
                                                                eventPayloadExpression: `
                                                            let payload ={}
                                                            if(!eventPayload){
                                                                eventPayload = []
                                                            }
                                                            if(eventPayload.length){
                                                                let ids = []
                                                                for(var i=0;i<eventPayload.length;i++){
                                                                    ids.push(eventPayload[i].gid)
                                                                }
                                                                payload = {
                                                                "query": {
                                                                    "query": [
                                                                    {
                                                                        "field": "imeQcQacBillGid", "type": "in", "value": ids.join(',')
                                                                    }
                                                                    ],
                                                                    "sorted": "gid asc"
                                                                }
                                                                }
                                                                callback(payload)
                                                            }
                                                                
                              `
                                                            }
                                                        ]
                                                    }
                                                ],
                                            },{
                                                event:"123paijian90.onSelectedRows",
                                                pubs:[
                                                    {
                                                        event: "12baojilujiann90.loadData",
                                                        eventPayloadExpression: `
                                                    let payload ={}
                                                    if(eventPayload.length){
                                                        let ids = []
                                                                for(var i=0;i<eventPayload.length;i++){
                                                                    ids.push(eventPayload[i].gid)
                                                                }
                                                        payload = {
                                                        "query": {
                                                            "query": [
                                                            {
                                                                "field": "imeQcQacBillGid", "type": "in", "value": ids.join(',')
                                                            }
                                                            ],
                                                            "sorted": "gid asc"
                                                        }
                                                        }
                                                        callback(payload)
                                                    }
                                                        
                                                    `
                                                    }
                                                ]
                                            },{
                                                event:"12baojilujiann90.onSelectedRowsClear",
                                                pubs:[
                                                    {
                                                        event:"12bajincrahn90.setData", 
                                                        payload:[]
                                                    },{
                                                        event:"12quexianhn90.setData",
                                                        payload:[]
                                                    }
                                                ]
                                            }
                                        ]
                                    }} />
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tab="检验卡" key="4">
                            <Row>
                                <Col>
                                    <AppTable name="12baoj7890" config={{
                                        "id": "12bajincrahn90",
                                        "name": "1234567890",
                                        "type": "checkbox",//表格单选复选类型
                                        "size": "default",//表格尺寸
                                        "rowKey": "gid",//主键
                                        "onLoadData": false,//初始化是否加载数据
                                        "width": 1300,//表格宽度
                                        "showSerial": true,//是否显示序号
                                        "editType": false,//是否增加编辑列
                                        "page": 1,//当前页
                                        "pageSize": 10,//一页多少条
                                        "isPager": true,//是否分页
                                        "isSearch": true,//是否显示模糊查询
                                        "columns": [
                                            { title: '派检记录编号', width: 100, dataIndex: 'imeQcQacRecordGidRef.imeQcQacBillGidRef.code', key: '1' },
                                            { title: '报检记录编号', width: 100, dataIndex: 'imeQcQacRecordGidRef.code', key: '2' },
                                            { title: '工序编码', width: 100, dataIndex: 'imeQcQacBillDetailGidRef.mdRouteOperationCode', key: '3' },
                                            { title: '工序名称', width: 100, dataIndex: 'imeQcQacBillDetailGidRef.mdRouteOperationName', key: '4' },
                                            { title: '检验项目编号', width: 100, dataIndex: 'imeQcQacBillDetailGidRef.imeQcQualityCheckitemGidRef.code', key: '5' },
                                            { title: '检验项目名称', dataIndex: 'imeQcQacBillDetailGidRef.imeQcQualityCheckitemGidRef.name', key: '6', width: 100 },
                                            { title: '检验项目类型', dataIndex: 'imeQcQacBillDetailGidRef.imeQcQualityCheckitemGidRef.type', key: '7', width: 100 },
                                            { title: '检验指标编码', dataIndex: 'imeQcQacBillDetailGidRef.indexCode', key: '8', width: 100 },
                                            { title: '检验指标描述', dataIndex: 'imeQcQacBillDetailGidRef.indexName', key: '9', width: 100, },
                                            { title: '检验指标结果', dataIndex: 'checkResult', key: '10', width: 100, },
                                            { title: '上限值', dataIndex: 'imeQcQacBillDetailGidRef.upperLimit', key: '11', width: 100 },
                                            { title: '下限值', dataIndex: 'imeQcQacBillDetailGidRef.lowerLimit', key: '12', width: 100 },
                                            { title: '标准重要度', dataIndex: 'imeQcQacBillDetailGidRef.importance', key: '13', width: 100 },
                                        ],
                                        dataSource: {
                                            type: 'api',
                                            method: 'post',
                                            pager: true,
                                            url: '/ime/imeQcCheckcard/query.action'
                                        },
                                        subscribes: [
                                            {
                                                event: "12bajincrahn90.onTableTodoAny",
                                                behaviors: [
                                                    {
                                                        type: "fetch",
                                                        id: "12baojilujiann90", //要从哪个组件获取数据
                                                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                        successPubs: [  //获取数据完成后要发送的事件
                                                            {
                                                                event: "12bajincrahn90.loadData",
                                                                eventPayloadExpression: `
                                                            let payload ={}
                                                            if(!eventPayload){
                                                                eventPayload = []
                                                            }
                                                            if(eventPayload.length){
                                                                let ids = []
                                                                for(var i=0;i<eventPayload.length;i++){
                                                                    ids.push(eventPayload[i].gid)
                                                                }
                                                                payload = {
                                                                "query": {
                                                                    "query": [
                                                                    {
                                                                        "field": "imeQcQacRecordGid", "type": "in", "value": ids.join(',')
                                                                    }
                                                                    ],
                                                                    "sorted": "gid asc"
                                                                }
                                                                }
                                                                callback(payload)
                                                            }
                                                               
                              `
                                                            }
                                                        ]
                                                    }
                                                ],
                                            },{
                                                event:"12baojilujiann90.onSelectedRows",
                                                pubs:[
                                                    {
                                                        event: "12bajincrahn90.loadData",
                                                        eventPayloadExpression: `
                                                        let payload ={}
                                                        if(eventPayload.length){
                                                            let ids = []
                                                                for(var i=0;i<eventPayload.length;i++){
                                                                    ids.push(eventPayload[i].gid)
                                                                }
                                                            payload = {
                                                            "query": {
                                                                "query": [
                                                                {
                                                                    "field": "imeQcQacRecordGid", "type": "in", "value": ids.join(',')
                                                                }
                                                                ],
                                                                "sorted": "gid asc"
                                                            }
                                                            }
                                                            callback(payload)
                                                        }
                                                            
                                                    `
                                                    }
                                                ]
                                            }
                                        ]
                                    }} />
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tab="缺陷信息" key="5">
                            <Row>
                                <Col>
                                    <AppTable name="12quexian890" config={{
                                        "id": "12quexianhn90",
                                        "name": "1234567890",
                                        "type": "checkbox",//表格单选复选类型
                                        "size": "default",//表格尺寸
                                        "rowKey": "gid",//主键
                                        "onLoadData": false,//初始化是否加载数据
                                        "width": 500,//表格宽度
                                        "showSerial": true,//是否显示序号
                                        "editType": false,//是否增加编辑列
                                        "page": 1,//当前页
                                        "pageSize": 10,//一页多少条
                                        "isPager": true,//是否分页
                                        "isSearch": true,//是否显示模糊查询
                                        "columns": [
                                            { title: '派检记录编号', width: 100, dataIndex: 'imeQcQacRecordGidRef.imeQcQacBillGidRef.code', key: '1' },
                                            { title: '报检记录编号', width: 100, dataIndex: 'imeQcQacRecordGidRef.code', key: '2' },
                                            { title: '缺陷编码', width: 100, dataIndex: 'imeQcInvalidinfoGidRef.code', key: '3' },
                                            { title: '缺陷名称', width: 100, dataIndex: 'imeQcInvalidinfoGidRef.name', key: '4' },
                                            { title: '缺陷等级', width: 100, dataIndex: 'defectLevel', key: '5' },
                                        ],
                                        dataSource: {
                                            type: 'api',
                                            method: 'post',
                                            pager: true,
                                            url: '/ime/imeQcDefectiveinfo/query.action'
                                        },
                                        subscribes: [
                                            {
                                                event: "12quexianhn90.onTableTodoAny",
                                                behaviors: [
                                                    {
                                                        type: "fetch",
                                                        id: "12baojilujiann90", //要从哪个组件获取数据
                                                        data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                        successPubs: [  //获取数据完成后要发送的事件
                                                            {
                                                                event: "12quexianhn90.loadData",
                                                                eventPayloadExpression: `
                                                            let payload ={}
                                                            if(!eventPayload){
                                                                eventPayload = []
                                                            }
                                                            if(eventPayload.length){
                                                                let ids = []
                                                                for(var i=0;i<eventPayload.length;i++){
                                                                    ids.push(eventPayload[i].gid)
                                                                }
                                                                payload = {
                                                                "query": {
                                                                    "query": [
                                                                    {
                                                                        "field": "imeQcQacRecordGid", "type": "in", "value": ids.join(',')
                                                                    }
                                                                    ],
                                                                    "sorted": "gid asc"
                                                                }
                                                                }
                                                                callback(payload)
                                                            }
                                                                
                              `
                                                            }
                                                        ]
                                                    }
                                                ],
                                            },{
                                                event:"12baojilujiann90.onSelectedRows",
                                                pubs:[
                                                    {
                                                        event: "12quexianhn90.loadData",
                                                        eventPayloadExpression: `
                                                        let payload ={}
                                                        if(eventPayload.length){
                                                            let ids = []
                                                                for(var i=0;i<eventPayload.length;i++){
                                                                    ids.push(eventPayload[i].gid)
                                                                }
                                                            payload = {
                                                            "query": {
                                                                "query": [
                                                                {
                                                                    "field": "imeQcQacRecordGid", "type": "in", "value": ids.join(',')
                                                                }
                                                                ],
                                                                "sorted": "gid asc"
                                                            }
                                                            }
                                                            callback(payload)
                                                        }
                                                           
                                                    `
                                                    }
                                                ]
                                            }
                                        ]
                                    }} />
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        )
    }
}

Detail.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}


function mapStateToProps(props) {
    return {
        onSubmit: () => { debugger }
    };
}



let DetailForm = reduxForm({
    form: "detail",
    validate,
})(Detail)

export default connect(mapStateToProps, mapDispatchToProps)(DetailForm);
