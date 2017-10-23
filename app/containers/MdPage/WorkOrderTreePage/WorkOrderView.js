/*
 *
 * OrderUniqueRule
 *
 */

import React, {PropTypes} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import Immutable from 'immutable';
import pubsub from 'pubsub-js'
import {connect} from 'react-redux';
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
import TreeField from 'components/Form/TreeField'
import UploadField from 'components/Form/UploadField'
import FindbackField from 'components/Form/FindbackField'
import tinyCache from 'tinycache'

const TabPane = Tabs.TabPane;
import CoreComponent from 'components/CoreComponent'


export class WorkOrderView extends CoreComponent { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props)
        // let formGid = this.props.workOrderFormValue.gid
        // console.log("",formGid)
        let formData = this.props.workOrderFormValue
        // if(!formData.workOrderStatusGid){
        //     formData.workOrderStatusName =''
        // }else{
        //     formData.workOrderStatusName =formData.ext.enumHeader.workOrderStatusGid[formData.workOrderStatusGid]
        // }
        pubsub.publish("@@form.init", { id: "workOrderViewForm", data: Immutable.fromJS(formData) })

    }


    render(){
        debugger
        if(this.state.visible!=undefined&&this.state.visible==false)
        {

            return null
        }

        return(
            <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "code",
                            label: "工单编号",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入编码"
                        }} component={TextField} name="code" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            form: "modify",
                            id: "zgCode",
                            label: "产品编号",
                            showRequiredStar: true,
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            // formMode:'edit',
                        }} name="productGidRef.materialGidRef.code" component={TextField} />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "gName",
                            label: "产品名称",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            showRequiredStar: true,
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "根据产品编码带出"
                        }} component={TextField} name="productGidRef.materialGidRef.name" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "numUnit",
                            label: "计量单位",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "根据产品编码带出"
                        }} component={TextField} name="productGidRef.materialGidRef.measurementUnitGidRef.name" />
                    </Col>
                </Row>

                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "payTime",
                            label: "交付期限",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请输入日期"
                        }} component={DateField} name="deliverTime" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            id: "planNum",
                            label: "计划数量",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请输入"
                        }} component={TextField} name="planQty" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "realNum",
                            label: "本批数量",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "＝计划数量",


                        }} component={TextField} name="actualQty" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            id: "orderType",
                            label: "工单类型",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            dataSource: {
                                type: "api",
                                method:"post",
                                url:"/sm/dictionaryEnumValue/query.action",
                                mode:"payload",
                                payload:{
                                    "query":{
                                        "query":[
                                            {
                                                "field":"smDictionaryEnumGid","type":"eq","value":"56B2314945384BE1E055000000000001"
                                            }
                                        ],
                                        "sorted":"seq"
                                    }
                                }
                            },
                            displayField: "val",
                            valueField: "gid",
                        }} component={SelectField} name="workOrderTypeGid" />
                    </Col>
                </Row>

                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "orderState",
                            label: "工单状态",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "根据规则回写"
                        }} component={TextField} name="workOrderStatusName" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled:false,
                            id: "artRoute",
                            label: "工艺路线",
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "根据产品编码带出",
                        }} component={TextField} name="routeGidRef.name"/>
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "workCenter",
                            label: "工作中心",
                            form: "modify",
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,
                            // formMode:'edit',

                            tableInfo: {
                                id: "tableId5jkdljkldjd",
                                size: "small",
                                rowKey: "gid",
                                width: "500",
                                tableTitle: "工作中心",
                                columns: [
                                    { title: '工作中心编码', width: 200, dataIndex: 'workCenterCode', key: '1' },
                                    { title: '工作中心名称', width: 200, dataIndex: 'workCenterName', key: '2' },
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    url: '/ime/mdFactoryWorkCenter/query.action',
                                }
                            },
                            pageId: 'findBack66rff',
                            displayField: "workCenterName",
                            valueField: {
                                "from": "workCenterName",
                                "to": "workCenterGidRef.workCenterName"
                            },
                            associatedFields: [
                                {
                                    "from": "gid",
                                    "to": "workCenterGid"
                                }
                            ]
                        }} name="workCenterGidRef.workCenterName" component={FindbackField} />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "workLine",
                            label: "产线",
                            form: "modify",
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,
                            subscribes: [
                                {
                                    event: "workCenter.onChange",
                                    pubs: [
                                        {
                                            event: "workLine.expression",//在某个组件上执行表达式
                                            meta: {
                                                expression: `
                            me.dataContext={gid:data.eventPayload.gid}
                          `
                                            }
                                        }
                                    ]
                                }
                            ],
                            tableInfo: {
                                id: "tableIkkkkdllgge",
                                size: "small",
                                rowKey: "gid",
                                width: "600",
                                tableTitle: "产线",
                                onLoadData: false,
                                showSerial: true,
                                columns: [
                                    { title: '产线编码', dataIndex: 'lineCode', key: '1', width: 200 },
                                    { title: '产线名称', dataIndex: 'lineName', key: '2', width: 200 },
                                    { title: '工作中心', dataIndex: 'workCenterGidRef.workCenterName', key: '3', width: 200 },
                                ],
                                subscribes: [
                                    {
                                        event: "tableIkkkkdllgge.onTableTodoAny",
                                        behaviors: [
                                            {
                                                type: "fetch",
                                                id: "modify", //要从哪个组件获取数据
                                                data: "@@formValues",//要从哪个组件的什么属性获取数据
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "tableIkkkkdllgge.loadData",
                                                        eventPayloadExpression:`
                                let payload ={}
                                if(eventPayload != undefined){
                                  payload = {
                                    "query": {
                                      "query": [
                                        {
                                          "field": "workCenterGid", "type": "eq", "value": eventPayload.workCenterGid
                                        }
                                      ],
                                      "sorted": "gid asc"
                                    }
                                  }
                                }
                                 callback(payload)
                              `
                                                    }
                                                ]
                                            }
                                        ],
                                    }
                                ],
                                dataSource:{
                                    type: 'api',
                                    method: 'post',
                                    url: '/ime/mdFactoryLine/query.action',
                                    pager:true,
                                }
                            },
                            pageId: 'findBack66rudjddh',
                            displayField: "lineName",
                            valueField: {
                                "from": "lineName",
                                "to": "productionLineGidRef.lineName"
                            },
                            associatedFields: [
                                {
                                    "from": "workCenterGidRef.workCenterName",
                                    "to": "workCenterGidRef.workCenterName"
                                },{
                                    "from": "gid",
                                    "to": "productionLineGid"
                                },{
                                    "from": "workCenterGid",
                                    "to": "workCenterGid"
                                },{
                                    "from": "lineType",
                                    "to": "productionLineGidRef.lineType"
                                }
                            ],
                        }} name="productionLineGidRef.lineName" component={FindbackField} />
                    </Col>
                </Row>

                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "planStartData",
                            label: "计划开始日期",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请输入",
                            showRequiredStar: true,
                        }} component={DateField} name="workOrderBeginTime" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "planFinishData",
                            label: "计划完成时间",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请输入",
                            showRequiredStar: true,
                        }} component={DateField} name="workOrderEndTime" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            id: "priorityLevel",
                            label: "优先级别",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请选择",
                            dataSource: {
                                type: "api",
                                method:"post",
                                url:"/sm/dictionaryEnumValue/query.action",
                                mode:"payload",
                                payload:{
                                    "query":{
                                        "query":[
                                            {"field":"smDictionaryEnumGid","type":"eq","value":"56B2315955384BE1E055000000000001"}
                                        ],
                                        "sorted":"seq"
                                    }
                                },
                            },
                            displayField: "val",
                            valueField: "gid",
                        }} component={SelectField} name="priorityLevel" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "lineType",
                            label: "产线类型",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,
                            dataSource: {
                                type: "api",
                                method: "post",
                                url: "/sm/dictionaryEnumValue/query.action",
                                mode:"payload",
                                payload: {
                                    "query": {
                                        "query": [
                                            { "field": "smDictionaryEnumGid", "type": "eq", "value": "56350D1ED4843DB2E055000000000001" }
                                        ],
                                        "sorted": "seq"
                                    }
                                },
                            },
                            displayField: "val",
                            valueField: "gid",
                        }} component={SelectField} name="productionLineGidRef.lineType" />
                    </Col>
                </Row>

                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "factStartTime",
                            label: "实际开始时间",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请输入时间",
                            showTime: true,
                        }} component={DateField} name="actualBeginTime" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "factFinishTime",
                            label: "实际结束时间",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请输入时间",
                            showTime: true
                        }} component={DateField} name="actualEndTime" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "orderEndNum",
                            label: "完工数量",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "根据规则回写"
                        }} component={TextField} name="finishQty" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "BOMState",
                            label: "BOM状态",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "根据规则回写"
                        }} component={TextField} name="workOrderBomStatusName" />
                    </Col>
                </Row>

                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "guessStartTime",
                            label: "测算开始时间",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请输入时间",
                            showTime: true
                        }} component={DateField} name="measureBeginTime" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "guessFinishTime",
                            label: "测算完成时间",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "请输入时间",
                            showTime: true
                        }} component={DateField} name="measureEndTime" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "gOrder",
                            label: "工单顺序",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "根据规则回写"
                        }} component={TextField} name="workOrderSeq" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "orderProcess",
                            label: "来源订单",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "根据规则回写"
                        }} component={TextField} name="planOrderGidRef.code" />
                    </Col>
                </Row>
            </Card>
        )
    }


}

WorkOrderView.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

function mapStateToProps(props) {
    return {
        onSubmit: () => {
        }
    }
}


let WorkOrderViewForm = reduxForm({
    form: "workOrderViewForm",
})(WorkOrderView)

export default connect(mapStateToProps, mapDispatchToProps)(WorkOrderViewForm)

