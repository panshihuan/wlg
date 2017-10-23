
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

/*设置必填项*/
const validate = values => {
    const errors = {}
    /*console.log('values:::',values)*/
    const reg = new RegExp("^[0-9]*$")
    if (!values.get('qcDispatchedQty')) {
        errors.qcDispatchedQty = '必填项'
    }
    if(!reg.test(values.get('qcDispatchedQty'))){
        errors.qcDispatchedQty="请输入有效数字"
    }


    if(values.get('checkBeginTime')&&values.get('checkEndTime')){
        var endTime = new Date(values.get('checkEndTime').replace(/-/,"/"))
        var beginTime = new Date(values.get('checkBeginTime').replace(/-/,"/"))
        /*console.log(!(endTime>beginTime))*/
        if(!(endTime>beginTime)){
            errors.checkBeginTime = "开始时间必须小于完成时间"
            errors.checkEndTime = "开始时间必须小于完成时间"
        }
    }

    if(values.get('imeQcBillCheckingToolDTOs')){
        let vv=values.get('imeQcBillCheckingToolDTOs').toJS()
        const membersArrayErrors = []
        vv.forEach((member, memberIndex) => {
            /*console.log('item:::',member)*/
            const memberErrors = {}
            if (!member || !member.qty) {
                memberErrors.qty = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }

            if(!reg.test(member.qty)){
                memberErrors.qty = '请输入有效数字'
                membersArrayErrors[memberIndex] = memberErrors
            }

        })

        if (membersArrayErrors.length) {
            errors.imeQcBillCheckingToolDTOs = membersArrayErrors
        }
    }

    return errors
};


export class QualityDispatchModal extends React.PureComponent {
    constructor(props) {
        super(props);

        resolveFetch({fetch:{id:'1234567890',data:'selectedRows'}}).then((py)=>{
            /*console.log('py:::::',py);*/
            this.gid=py[0].gid;
            let gid=py[0].gid;
            let dataSource = {
                mode: "dataContext",
                type: "api",
                method: "POST",
                url: "/ime/imeQcQac/findByQacId.action",
            }
            resolveDataSource({ dataSource, dataContext: { id: gid } }).then(function (data) {
                /*console.log('aaaa：：：',data);*/
                if(data.success){
                        let ext=data.ext.enumHeader.qcInspectionStatus
                        for(let key in ext){
                            if(key == data.data.qcInspectionStatus){
                                data.data.qcInspectionStatus=ext[key]
                            }
                        }
                    pubsub.publish("@@form.init", { id: "QualityDispatchModalForm", data: Immutable.fromJS(data.data) })
                }else{
                    pubsub.publish("@@message.error","查询失败，请联系管理员")
                }
            })
        })


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
                {/*模态框上部-显示列表*/}
                <form>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                id: "code11",
                                label: "派检记录编号",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                enabled: false,
                                placeholder: "自动生成"
                            }} component={TextField} name=""/>
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "code12",
                                label: "产品编号",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                enabled: false,
                                placeholder: "根据生产工单产品带出"
                            }} component={TextField} name="mdProductInfoGidRef.materialGidRef.code"/>
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "code13",
                                label: "产品名称",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                enabled: false,
                                placeholder: "根据产品编码带出"
                            }} component={TextField} name="mdProductInfoGidRef.materialGidRef.name"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                id: "code21",
                                label: "派检数量",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                enabled: true,
                                placeholder: "请输入",
                                form:'QualityDispatchModalForm',
                            }} component={TextField} name="qcDispatchedQty"/>
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "code22",
                                label: "累检数量",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                enabled: false,
                                placeholder: "派检单派检累计数量"
                            }} component={TextField} name="qcHasDispatchedQty"/>
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "code23",
                                label: "派检人",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                enabled: false,
                                placeholder: "当前派检用户"
                            }} component={TextField} name="qcDispatchedPersonRef.name"/>
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "code24",
                                label: "检验工位",  //标签名称
                                form: "QualityDispatchModalForm",
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                enabled: true,
                                placeholder: "请选择",
                                // formMode:'edit',
                                tableInfo: {
                                    id: "tableId555",
                                    size: "small",
                                    rowKey: "gid",
                                    tableTitle: "检验工位",
                                    width: 100,
                                    columns: [
                                        { title: '工位名称', width: 100, dataIndex: 'stationName', key: '1' },
                                        { title: '工位编号', width: 100, dataIndex: 'stationCode', key: '2' },
                                    ],
                                    dataSource: {
                                        type: "api",
                                        method: "post",
                                        url: "/ime/mdFactoryWorkStation/query.action"
                                    }
                                },
                                pageId: 'findBack66ooo56565656',
                                displayField: "stationName",
                                valueField: {
                                    "from": "stationName",
                                    "to": "mdFactoryWorkStationGidRef.stationName"
                                },
                                associatedFields:[
                                    {
                                        "from": "gid",
                                        "to": "mdFactoryWorkStationGid"
                                    }
                                ]
                            }} component={FindbackField} name="mdFactoryWorkStationGidRef.stationName"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                id: "code31",
                                label: "检验方式",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                enabled: true,
                                dataSource: {
                                    type: "api",
                                    method: "post",
                                    url: "/ime/imeQcQualityWay/getQcQualityWayCombox.action"
                                },
                                displayField: "value",
                                valueField: "id"
                            }} component={SelectField} name="imeQcQualityWayGid"/>
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "code33",
                                label: "派检时间",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                enabled: false,
                                placeholder: "报检记录创建时间"
                            }} component={DateField} name="qcDispatchedTime"/>
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "code33",
                                label: "计划开检时间",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                enabled: true,
                                placeholder: "自动带入"
                            }} component={DateField} name="checkBeginTime"/>
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "code34",
                                label: "计划检完时间",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                enabled: true,
                                placeholder: "自动带入"
                            }} component={DateField} name="checkEndTime"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                id: "code41",
                                label: "报检状态",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                enabled: false,
                                placeholder: "根据规则回写"
                            }} component={TextField} name="qcInspectionStatus"/>

                            {/*<Field config={{
                                id: "code41",
                                label: "报检状态",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                enabled: false,
                                placeholder: "根据规则回写",
                                dataSource: {
                                    type: "api",
                                    method: "post",
                                    url: "/ime/imeQcQac/getInspectionStatusCombox.action"
                                },
                                displayField: "value",
                                valueField: "id"
                            }} component={SelectField} name="qcInspectionStatus"/>*/}
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "code42",
                                label: "检验员",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                enabled: true,
                                placeholder: "当前用户",
                                dataSource: {
                                    type: "api",
                                    method: "post",
                                    url: "/sm/personnel/query.action"
                                },
                                displayField: "personnelName",
                                valueField: "gid"
                            }} component={SelectField} name="surveyor"/>

                        </Col>
                        <Col span={6}>
                            <Field config={{
                                id: "code43",
                                label: "质检说明",  //标签名称
                                labelSpan: 12,   //标签栅格比例（0-24）
                                wrapperSpan: 12,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                enabled: true,
                                placeholder: "请输入"
                            }} component={TextField} name="remarks"/>
                        </Col>
                    </Row>
                </form>

                {/*模态框下部-标签页*/}
                <Row>
                    <Col span={24}>
                        <Card>
                            <Tabs defaultActiveKey="2-1">
                                <TabPane forceRender="true" tab="检具/量具" key="2-1">
                                    <AppButton config={{
                                        id: "adksk",
                                        title: "添加",
                                        type: "primary",
                                        size: "small",
                                        visible: true,
                                        enabled: true,
                                        subscribes:[
                                            {
                                                event:"adksk.click",
                                                pubs:[
                                                    {
                                                        event:"pageIdxffre46666exx.openModal"
                                                    }
                                                ]
                                            }
                                        ]
                                    }}/>
                                    <FieldArray
                                        name="imeQcBillCheckingToolDTOs"
                                        component={TableField}
                                        config={{
                                            addButton :false,
                                            id:"QualityDispatchModalType-tableField-2-1",
                                            name:"QualityDispatchModalType-tableField-2-1",
                                            rowKey:"gid",
                                            columns:[
                                                {
                                                    "id": "QualityDispatchModalType-tableField-3",
                                                    "type": "textField",
                                                    "title": "检具/量具编码",
                                                    "name": "code",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-4",
                                                    "type": "textField",
                                                    "title": "检具/量具名称",
                                                    "name": "name",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-5",
                                                    "type": "textField",
                                                    "title": "数量",
                                                    "name": "qty",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":true
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-6",
                                                    "type": "selectField",
                                                    "title": "工具类型",
                                                    "name": "type",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false,
                                                    placeholder:"请选择",
                                                    dataSource: {
                                                        type: "api",
                                                        method: "post",
                                                        url: "/sm/dictionaryEnumValue/query.action",
                                                        mode: "payload",
                                                        payload: {
                                                            "query": {
                                                                "query": [
                                                                    {
                                                                        "field": "smDictionaryEnumGid", "type": "eq", "value": "5A22B8055C5A2798E055000000000001"
                                                                    }
                                                                ],
                                                                "sorted": "seq"
                                                            }
                                                        }
                                                    },
                                                    displayField: "val",
                                                    valueField: "gid",
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-7",
                                                    "type": "textField",
                                                    "title": "使用起始时间",
                                                    "name": "useBeginTime",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-8",
                                                    "type": "textField",
                                                    "title": "使用截止时间",
                                                    "name": "useEndTime",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false
                                                }
                                            ]
                                        }}
                                    >
                                    </FieldArray>
                                </TabPane>
                                <TabPane forceRender="true" tab="派检标准" key="2-2">
                                    <AppButton config={{
                                        id: "adksk2",
                                        title: "添加",
                                        type: "primary",
                                        size: "small",
                                        visible: true,
                                        enabled: true,
                                        subscribes:[
                                            {
                                                event:"adksk2.click",
                                                pubs:[
                                                    {
                                                        event:"pageIdxffre46666exx2.openModal"
                                                    }
                                                ]
                                            }
                                        ]
                                    }}/>
                                    <FieldArray
                                        name="imeQcQacBillDetailDTOs"
                                        component={TableField}
                                        config={{
                                            addButton :false,
                                            id:"QualityDispatchModalType-tableField-2-2",
                                            name:"QualityDispatchModalType-tableField-2-2",
                                            rowKey:"gid",
                                            columns:[
                                                {
                                                    "id": "QualityDispatchModalType-tableField-10",
                                                    "type": "textField",
                                                    "title": "工序编码",
                                                    "name": "mdRouteOperationCode",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-11",
                                                    "type": "textField",
                                                    "title": "工序名称",
                                                    "name": "mdRouteOperationName",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-12",
                                                    "type": "textField",
                                                    "title": "检验项目编码",
                                                    "name": "imeQcQualityCheckitemGidRef.code",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-13",
                                                    "type": "textField",
                                                    "title": "检验项目名称",
                                                    "name": "imeQcQualityCheckitemGidRef.name",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-14",
                                                    "type": "selectField",
                                                    "title": "检验项目类型",
                                                    "name": "imeQcQualityCheckitemGidRef.type",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false,
                                                    placeholder:"请选择",
                                                    dataSource: {
                                                        type: "api",
                                                        method: "post",
                                                        url: "/sm/dictionaryEnumValue/query.action",
                                                        mode: "payload",
                                                        payload: {
                                                            "query": {
                                                                "query": [
                                                                    {
                                                                        "field": "smDictionaryEnumGid", "type": "eq", "value": "59B01BE2490739D6E055000000000001"
                                                                    }
                                                                ],
                                                                "sorted": "seq"
                                                            }
                                                        }
                                                    },
                                                    displayField: "val",
                                                    valueField: "gid",
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-15",
                                                    "type": "textField",
                                                    "title": "检验指标编码",
                                                    "name": "indexCode",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-16",
                                                    "type": "textField",
                                                    "title": "检验指标描述",
                                                    "name": "indexName",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-17",
                                                    "type": "textField",
                                                    "title": "上限值",
                                                    "name": "upperLimit",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":true
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-18",
                                                    "type": "textField",
                                                    "title": "下限值",
                                                    "name": "lowerLimit",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":true
                                                },
                                                {
                                                    "id": "QualityDispatchModalType-tableField-19",
                                                    "type": "selectField",
                                                    "title": "标准重要度",
                                                    "name": "importance",
                                                    "form":"QualityDispatchModalForm",
                                                    "enabled":false,
                                                    placeholder:"请选择",
                                                    dataSource: {
                                                        type: "api",
                                                        method: "post",
                                                        url: "/sm/dictionaryEnumValue/query.action",
                                                        mode: "payload",
                                                        payload: {
                                                            "query": {
                                                                "query": [
                                                                    {
                                                                        "field": "smDictionaryEnumGid", "type": "eq", "value": "59B01BE2490939D6E055000000000001"
                                                                    }
                                                                ],
                                                                "sorted": "seq"
                                                            }
                                                        }
                                                    },
                                                    displayField: "val",
                                                    valueField: "gid",
                                                }
                                            ]
                                        }}
                                    >
                                    </FieldArray>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                </Row>


                {/*模态框确认取消按钮*/}
                <Row>
                    <Col span={8} offset={20} style={{marginTop:'10px'}}>
                        <AppButton config={{
                            id: "referenceSubmitButton",
                            title: "确定",
                            type: "primary",
                            size: "large",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "referenceSubmitButton.click",
                                    behaviors:[
                                        {
                                            type: "request",
                                            dataSource: {
                                                type: "api",
                                                method: "POST",
                                                url: "/ime/imeQcQacBill/add.action",
                                                bodyExpression: `
                                                    resolveFetch({fetch:{id:'QualityDispatchModalForm',data:'@@formValues'}}).then(function(pd){
                                                        /*console.log('pd::::::',pd)*/
                                                        if(!submitValidateForm('QualityDispatchModalForm')){
                                                            if(typeof(pd.qcDispatchedQty)=="string"){
                                                                pd.qcDispatchedQty=parseInt(pd.qcDispatchedQty)
                                                            }
                                                            callback(pd)
                                                        }else{
                                                            pubsub.publish('@@message.error','请正确填写表单!')
                                                        }
                                                    })
                                                `
                                            },
                                            successPubs: [
                                            {
                                                event: "@@message.success",
                                                eventPayloadExpression: `
                                                    callback('派检成功!')
                                                    `,
                                            },
                                            {
                                                event:'qualityModal-2.onCancel'
                                            },
                                            {
                                                event:'qualityModal-2.loadData'
                                            }
                                        ],
                                            errorPubs:[
                                                {
                                                    event: "@@message.error",
                                                    eventPayloadExpression: `
                                                        if(eventPayload){
                                                            callback(eventPayload)
                                                        }else{
                                                            callback('派检失败!')
                                                        }
                                                    `
                                                },
                                                {
                                                    event:'qualityModal-2.onCancel'
                                                },
                                                {
                                                    event:'qualityModal-2.loadData'
                                                }
                                            ]
                                        }
                                    ]
                                },

                            ]
                        }}>
                        </AppButton>

                        <AppButton config={{
                            id: "referenceCancelButton",
                            title: "取消",
                            //type: "primary",
                            size: "large",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "referenceCancelButton.click",
                                    pubs: [
                                        {
                                            event:"qualityModal-2.onCancel"
                                        }
                                    ]
                                }
                            ]
                        }}>
                        </AppButton>

                    </Col>
                </Row>

                {/*标签页-检具模具-点击添加后弹出的模态框*/}
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "pageIdDidddssRecordteeeeeeeffgg", // id，必填*
                    pageId: "pageIdxffre46666exx", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    width: "80%", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    title: "添加检具/量具",
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: { top: 80 }, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}
                >
                    <AppTable name="end-tanchukuangjskDicord-table-indexall" config={{
                        "id": "DisRecordletanchukuangxe",
                        "name": "DisRecortanchukuangble-index-endjkjoiioi",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": true,//初始化是否加载数据
                        "width": 100,//表格宽度
                        "showSerial": true,//是否显示序号
                        "editType": false,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 4,
                        "isSearch": true,//是否显示模糊查询
                        "columns": [
                            { title: '检具/量具编码', width: 100, dataIndex: 'code', key: '1' },
                            { title: '检具/量具名称', width: 100, dataIndex: 'name', key: '2' },
                            { title: '工具类型', dataIndex: 'type', key: '3', width: 100 }
                        ],
                        dataSource: {
                            type: "api",
                            method: "post",
                            url: "/ime/imeQcCheckingtool/query.action",
                        }
                    }} />
                    <Row>
                        {/*点击添加检具模具后的-添加/删除按钮*/}
                        <Col span={4} offset={20}>
                            <AppButton config={{
                                id: "DisRecordOk",
                                title: "添加",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "DisRecordletanchukuangxe.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "DisRecordOk.enabled",
                                                payload: true
                                            }
                                        ]
                                    },
                                    {
                                        event: "DisRecordletanchukuangxe.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "DisRecordOk.enabled",
                                                payload: false
                                            }
                                        ]
                                    },
                                    {
                                        event: "DisRecordletanchukuangxe.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "DisRecordOk.dataContext"
                                            }
                                        ]
                                    }, {
                                        event: "DisRecordOk.click",
                                        pubs:[
                                            {
                                                event:"DisRecordOk.expression",
                                                meta:{
                                                    expression:`
                            resolveFetch({fetch:{id:'QualityDispatchModalForm',data:'@@formValues'}}).then(function(res){
                                if(!res.imeQcBillCheckingToolDTOs){
                                pubsub.publish("@@form.change", { id: "QualityDispatchModalForm",name:"imeQcBillCheckingToolDTOs" ,value: fromJS(me.dataContext) })
                                pubsub.publish("pageIdDidddssRecordteeeeeeeffgg.onCancel")
                                }else{
                                  let imeArr = res.imeQcBillCheckingToolDTOs.concat(me.dataContext)
                                pubsub.publish("@@form.change", { id: "QualityDispatchModalForm",name:"imeQcBillCheckingToolDTOs" ,value: fromJS(imeArr) })
                                pubsub.publish("pageIdDidddssRecordteeeeeeeffgg.onCancel")
                                }
                            })
                          `
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }} />
                            <AppButton config={{
                                id: "DisRecordddeeeoioCancel",
                                title: "取消",
                                type: "default",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "DisRecordddeeeoioCancel.click",
                                        pubs: [
                                            {
                                                event: "pageIdDidddssRecordteeeeeeeffgg.onCancel",
                                            },
                                        ]
                                    }
                                ]
                            }} />
                        </Col>
                    </Row>
                </ModalContainer>

                {/*标签页-派检标准-点击添加后弹出的模态框*/}
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "pageIdDidddssRecordteeeeeeeffgg2", // id，必填*
                    pageId: "pageIdxffre46666exx2", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    width: "80%", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    title: "添加派检标准",
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: { top: 80 }, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}
                >
                    <AppTable name="end-tanchukuangjskDicord-table-indexall2" config={{
                        "id": "DisRecordletanchukuangxe2",
                        "name": "DisRecortanchukuangble-index-endjkjoiioi2",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": true,//初始化是否加载数据
                        "width": 100,//表格宽度
                        "showSerial": true,//是否显示序号
                        "editType": false,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 4,
                        "isSearch": true,//是否显示模糊查询
                        "columns": [
                            { title: '工序编码', width: 100, dataIndex: 'mdDefOperationGidRef.code', key: '1' },
                            { title: '工序名称', width: 100, dataIndex: 'mdDefOperationGidRef.name', key: '2' },
                            { title: '检验项目编码', width: 100, dataIndex: 'code', key: '3' },
                            { title: '检验项目名称', width: 100, dataIndex: 'name', key: '4' },
                            { title: '检验项目类型', width: 100, dataIndex: 'type', key: '5' }
                        ],
                        dataSource: {
                            type: "api",
                            method: "post",
                            url: "/ime/imeQcQualityCheckitem/query.action",
                        }
                    }} />
                    <Row>
                        {/*点击添加派检标准后的-添加/删除按钮*/}
                        <Col span={4} offset={20}>
                            <AppButton config={{
                                id: "DisRecordOk2",
                                title: "添加",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "DisRecordletanchukuangxe2.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "DisRecordOk2.enabled",
                                                payload: true
                                            }
                                        ]
                                    },
                                    {
                                        event: "DisRecordletanchukuangxe2.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "DisRecordOk2.enabled",
                                                payload: false
                                            }
                                        ]
                                    },
                                    {
                                        event: "DisRecordletanchukuangxe2.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "DisRecordOk2.dataContext"
                                            }
                                        ]
                                    }, {
                                        event: "DisRecordOk2.click",
                                        pubs:[
                                            {
                                                event:"DisRecordOk2.expression",
                                                meta:{
                                                    expression:`
    resolveFetch({fetch:{id:'QualityDispatchModalForm',data:'@@formValues'}}).then(function(res){
    var errorMessage = undefined;
    var jumpFor = false;
    if(dataContext!=undefined){
        for(var i=0; i < dataContext.length;i++){
            //用于跳出多层循环
            if(jumpFor){
                break;
            }
            dataContext[i].imeQcQualityCheckitemGidRef= {}

            dataContext[i].imeQcQualityCheckitemGidRef.code= dataContext[i].code
            dataContext[i].imeQcQualityCheckitemGidRef.name= dataContext[i].name
            dataContext[i].imeQcQualityCheckitemGidRef.type= dataContext[i].type
            dataContext[i].mdRouteOperationCode=dataContext[i].mdDefOperationGidRef.code
            dataContext[i].mdRouteOperationName=dataContext[i].mdDefOperationGidRef.name

            dataContext[i].gid=dataContext[i].mdDefOperationGid
            dataContext[i].imeQcQualityCheckitemGid=dataContext[i].gid

            var parentData = res.imeQcQacBillDetailDTOs;
            //用于判断是否已存在已存在物料编码
            if(res.imeQcQacBillDetailDTOs!=undefined){
                for(var j = 0 ;j<res.imeQcQacBillDetailDTOs.length;j++){
                    if(dataContext[i]["imeQcQualityCheckitemGidRef"]["code"] == parentData[j]["imeQcQualityCheckitemGidRef"]["code"]){
                        errorMessage = "标准"+dataContext[i].imeQcQualityCheckitemGidRef.code+"已经存在,请重新选择";
                        jumpFor = true;
                    }
                }
            }
          }
        if(errorMessage){
            pubsub.publish("@@message.error",errorMessage)
        }else{
            let params = [];
            if(res["imeQcQacBillDetailDTOs"]!=undefined){
                params = res.imeQcQacBillDetailDTOs.concat(dataContext)
            }else{
                params = dataContext;
            }
            pubsub.publish("@@form.change", { id: "QualityDispatchModalForm",name:"imeQcQacBillDetailDTOs" ,value: fromJS(params) })
            pubsub.publish("pageIdDidddssRecordteeeeeeeffgg2.onCancel")
        }
}
})
                          `
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }} />
                            <AppButton config={{
                                id: "DisRecordddeeeoioCancel2",
                                title: "取消",
                                type: "default",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "DisRecordddeeeoioCancel2.click",
                                        pubs: [
                                            {
                                                event: "pageIdDidddssRecordteeeeeeeffgg2.onCancel",
                                            },
                                        ]
                                    }
                                ]
                            }} />
                        </Col>
                    </Row>
                </ModalContainer>

            </div>
        )
    }
}

QualityDispatchModal.propTypes = {
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

let QualityDispatchModalPage = reduxForm({
    form: "QualityDispatchModalForm",
    validate,
})(QualityDispatchModal)

export default connect(mapStateToProps, mapDispatchToProps)(QualityDispatchModalPage);