/**
 * Created by ASUS on 2017/9/29.
 */
/**
 * Created by ASUS on 2017/9/26.
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

const validate = values => {
    const errors = {}
    console.log('values:::',values)
    const reg = new RegExp("^[0-9]*$")
    if (!values.get('qcInspectionQty')) {
        errors.qcInspectionQty = '必填项'
    }
    if(!reg.test(values.get('qcInspectionQty'))){
        errors.qcInspectionQty="请输入有效数字"
    }

    if(values.get('qcDispatchedQty')&&values.get('qcInspectionQty')){
        if(values.get('qcInspectionQty')>values.get('qcDispatchedQty')){
            errors.qcInspectionQty="报检数不得大于派检数!"
        }

    }

    if(values.get('imeQcCheckCardDTOs')){
        let vv=values.get('imeQcCheckCardDTOs').toJS()
        const membersArrayErrors = []
        vv.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (member &&member.checkResult) {
                if(!reg.test(member.checkResult)){
                    memberErrors.checkResult = '请输入有效数字'
                    membersArrayErrors[memberIndex] = memberErrors
                }
            }

        })

        if (membersArrayErrors.length) {
            errors.imeQcCheckCardDTOs = membersArrayErrors
        }
    }

    return errors
};


export class ReportModal extends React.PureComponent {
    constructor(props) {
        super(props);

        let modifyData;
        let modifyId;

        resolveFetch({fetch:{id:'1234567890',data:'selectedRows'}}).then((pd)=>{
            console.log('pd::12:',pd)
            pubsub.publish("@@form.change", { id: "reportForm", name: "fCode", value: pd[0].code })
            let gid=pd[0].gid;
            this.gid=gid
            let dataSource={
                mode: "dataContext",
                type: "api",
                method: "POST",
                url:'/ime/imeQcQac/getBillsByQcId.action'
            };

            pubsub.subscribe('gCode1.onChange',(ename,py)=>{
                this.pGid=py.gid
                let dataSource2={
                    mode: "dataContext",
                    type: "api",
                    method: "POST",
                    url:'/ime/imeQcQacBill/findTempsByBillId'
                };

                resolveDataSource({ dataSource:dataSource2, dataContext: { id:py.gid} }).then(function (data) {
                    let ext=data.ext.enumHeader.type;
                    let obj=Object.assign({fCode:pd[0].code,myCode:py.code},data.data)

                    console.log('obj:::',obj)


                    resolveFetch({fetch:{id:'DistributionType-tableField-2',data:'rowIds'}}).then((pdt)=>{

                        console.log('pdt::::',pdt)

                        //obj.imeQcCheckCardDTOs  checkItemOptions

                        if(pdt){
                            _.map(pdt,(item,index)=>{
                                let arr=[];
                                let rArr=obj.imeQcCheckCardDTOs[index].checkItemOptions;
                                console.log('rArr:::',rArr)
                                _.map(rArr,(it,ind)=>{
                                    let obj={}
                                    obj.name=it.name;
                                    obj.gid=it.gid;
                                    arr.push(obj)
                                });

                                pubsub.publish(`DistributionType-selectField-22[${item}].setData`,arr)
                            })
                        }
                    });


                    if(obj.imeQcCheckCardDTOs&&obj.imeQcCheckCardDTOs.length&&obj.imeQcCheckCardDTOs[0].imeQcQacBillDetailGidRef&&obj.imeQcCheckCardDTOs[0].imeQcQacBillDetailGidRef.imeQcQualityCheckitemGidRef&&obj.imeQcCheckCardDTOs[0].imeQcQacBillDetailGidRef.imeQcQualityCheckitemGidRef.type){
                        let type=obj.imeQcCheckCardDTOs[0].imeQcQacBillDetailGidRef.imeQcQualityCheckitemGidRef.type;
                        let result;
                        for(let key in ext){
                            if(key==type){
                                result=ext[key]
                            }
                        }

                        _.map(obj.imeQcCheckCardDTOs,(item,index)=>{
                            item.imeQcQacBillDetailGidRef.imeQcQualityCheckitemGidRef.type=result;

                        })

                        pubsub.publish("@@form.init", { id: "reportForm", data: Immutable.fromJS(obj) })

                        if(type=="59B01BE2490839D6E055000000000002"){//
                            pubsub.publish('DistributionType-tableField-2.visibleCol',['DistributionType-textField-21'])
                            pubsub.publish('DistributionType-tableField-2.InvisibleCol',['DistributionType-textField-22'])
                        }else if(type=="59B01BE2490839D6E055000000000001"){ //
                            pubsub.publish('DistributionType-tableField-2.visibleCol',['DistributionType-textField-22'])
                            pubsub.publish('DistributionType-tableField-2.InvisibleCol',['DistributionType-textField-21'])
                        }
                    }else{
                        pubsub.publish("@@form.init", { id: "reportForm", data: Immutable.fromJS(obj) })
                    }

                });

            })

        });

    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {
        // super.componentWillUnmount();
        pubsub.unsubscribe(`referenceCancelButton.click`)
        pubsub.unsubscribe(`referenceSubmitButton.click`)
        pubsub.unsubscribe(`dispatchOrderDetail-table-1.onTableTodoAny`)
        pubsub.unsubscribe(`referenceTable.onSelectedRows`)
        pubsub.unsubscribe(`referenceTable.onSelectedRowsClear`)
        pubsub.unsubscribe(`DisRecordletanchukuangxe2.onTableTodoAny`)
        pubsub.unsubscribe(`DisRecordletanchukuangxe2.onSelectedRows`)
        pubsub.unsubscribe(`DisRecordletanchukuangxe2.onSelectedRowsClear`)
        pubsub.unsubscribe(`DisRecordletanchukuangxe2.onSelectedRows`)
        pubsub.unsubscribe(`DisRecordOk2.click`)
        pubsub.unsubscribe(`DisRecordddeeeoioCancel2.click`)
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        let self=this;
        return (
            <div>
                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "code111",
                            label: "报检单编号",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入编码"
                        }} component={TextField} name="fCode" />
                    </Col>

                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            form: "reportForm",
                            id: "gCode1",
                            label: "派检记录",
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            // formMode:'edit',
                            dataSource: {
                            },
                            tableInfo: {
                                id: "tableId55512",
                                size: "small",
                                form: "reportForm",
                                rowKey: "gid",
                                tableTitle: "派检记录",
                                columns: [
                                    { title: '派检记录编号', width: 100, dataIndex: 'code', key: '1' },
                                    { title: '派检数量', width: 100, dataIndex: 'qcDispatchedQty', key: '2' },
                                    { title: '报检数量', width: 100, dataIndex: 'qcInspectionQty', key: '3' },
                                    { title: '派检人', dataIndex: 'qcDispatchedPersonRef.personnelName', key: '4', width: 100 },
                                    { title: '检验员', dataIndex: 'surveyorRef.personnelName', key: '5', width: 100 },
                                    { title: '检验工位', dataIndex: 'mdFactoryWorkStationGidRef.stationName', key: '6', width: 100 },
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
                                    mode:'payload',
                                    payload:{
                                        id:this.gid
                                    },
                                    url: '/ime/imeQcQac/getBillsByQcId.action'
                                }
                            },
                            pageId: 'findBack66ooo5656565612',
                            displayField: "code",
                            valueField: {
                                "from": "gid",
                                "to": "myCode"
                            },

                        }} name="myCode" component={FindbackField} />
                    </Col>

                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "code2",
                            label: "产品编号",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入编码"
                        }} component={TextField} name="mdProductInfoGidRef.materialGidRef.code" />
                    </Col>

                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "code1231",
                            label: "产品名称",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入编码"
                        }} component={TextField} name="mdProductInfoGidRef.materialGidRef.name" />
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "code3",
                            label: "报检记录编号",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入编码"
                        }} component={TextField} name="code" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "code4",
                            label: "派检数量",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入编码"
                        }} component={TextField} name="qcDispatchedQty" />
                    </Col>

                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "code5",
                            label: "报检数量",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入编码",
                            form:'reportForm'
                        }} component={TextField} name="qcInspectionQty" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "realNum",
                            label: "报检人",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "根据规则回写",
                        }} component={TextField} name="qcInspectionPersonRef.personnelName" />
                    </Col>

                </Row>

                <Row>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            form: "reportForm",
                            id: "gCode2321",
                            label: "报检工位",
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            // formMode:'edit',
                            dataSource: {
                            },
                            tableInfo: {
                                id: "tableId555276",
                                size: "small",
                                form: "reportForm",
                                rowKey: "gid",
                                tableTitle: "报检工位",
                                columns: [
                                    { title: '派检记录编号', width: 100, dataIndex: 'imeQcQacGid', key: '1' },
                                    { title: '产品编号', width: 100, dataIndex: 'mdProductInfoGidRef.code', key: '2' },
                                    { title: '产品名称', width: 100, dataIndex: 'mdProductInfoGidRef.name', key: '3' },
                                    { title: '派检数量', width: 100, dataIndex: 'qcDispatchedQty', key: '4' },
                                    { title: '累检数量', width: 100, dataIndex: 'qcHasDispatchedQty', key: '5' },

                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    url: '/ime/mdFactoryWorkStation/query.action'
                                }
                            },
                            pageId: 'findBack66ooo5656565689',
                            displayField: "stationName",
                            valueField: {
                                "from": "gid",
                                "to": "mdFactoryWorkStationGidRef.stationName"
                            },

                        }} name="mdFactoryWorkStationGidRef.stationName" component={FindbackField} />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: false,
                            id: "orderState2",
                            label: "报检时间",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "根据规则回写"
                        }} component={TextField} name="qcInspectionTime" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "orderState3",
                            label: "检验结果",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "根据规则回写"
                        }} component={TextField} name="imeQcQualityGrade" />
                    </Col>
                    <Col span={6}>
                        <Field config={{
                            enabled: true,
                            id: "orderState4",
                            label: "质量处理方式",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            placeholder: "质量处理方式",
                            dataSource: {
                                type: "api",
                                method: "post",
                                url: "/sm/dictionaryEnumValue/query.action",
                                mode: "payload",
                                payload: {
                                    "query": {
                                        "query": [
                                            {
                                                "field": "smDictionaryEnumGid",
                                                "type": "eq",
                                                "value": "59B01BE2490339D6E055000000000001"
                                            }
                                        ],
                                        "sorted": "seq"
                                    }
                                },
                            },
                            displayField: "val",
                            valueField: "gid"
                        }} component={SelectField} name="qcHandleWay" />
                    </Col>

                </Row>
                <Row>
                    <Col span={6}>
                        <Field config={{
                            id: "number-1",
                            enabled: false,  //是否启用
                            visible: true,  //是否可见
                            label: "质量说明:",  //标签名称
                            size:'large',  //尺寸大小:large、small
                            min:1,        //最小、大值
                            max:undefined,
                            step:undefined,   //小数位数: 0.01保留2位有效数值
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            hasFeedback: false  //验证失败时是否显示feedback图案
                        }} name="remarks" component={TextField} />
                    </Col>
                </Row>


                {/*table(下)*/}
                <Row className="distributionType-tabTop-bottom">
                    <Col span={24}>
                        <Card>
                            <Tabs defaultActiveKey="2-1">
                                <TabPane forceRender="true" tab="检验卡" key="2-1">
                                    <FieldArray
                                        name="imeQcCheckCardDTOs"
                                        component={TableField}
                                        config={{
                                            id:"DistributionType-tableField-2",
                                            name:"DistributionType-tableField-2",
                                            rowKey:"gid",
                                            "addButton": false, //是否显示默认增行按钮
                                            "showRowDeleteButton":false,
                                            columns:[

                                                {
                                                    "id": "DistributionType-textField-11",
                                                    "type": "textField",
                                                    "title": "工序编码",
                                                    "name": "imeQcQacBillDetailGidRef.mdRouteOperationCode",
                                                    "form":"reportForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "DistributionType-textField-12",
                                                    "type": "textField",
                                                    "title": "工序名称",
                                                    "name": "imeQcQacBillDetailGidRef.mdRouteOperationName",
                                                    "form":"reportForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "DistributionType-textField-13",
                                                    "type": "textField",
                                                    "title": "检验项目编号",
                                                    "name": "imeQcQacBillDetailGidRef.code",
                                                    "form":"reportForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "DistributionType-textField-14",
                                                    "type": "textField",
                                                    "title": "检验项目名称",
                                                    "name": "imeQcQacBillDetailGidRef.name",
                                                    "form":"reportForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "DistributionType-selectField-15",
                                                    "type": "textField",
                                                    "title": "检验项目类型",
                                                    "name": "imeQcQacBillDetailGidRef.imeQcQualityCheckitemGidRef.type",
                                                    "form":"reportForm",
                                                    "enabled":false,
                                                    subscribes:[
                                                        {
                                                            event:'gCode1.onChange',
                                                            pubs:[
                                                                {
                                                                    eventPayloadExpression:`
                                                                    console.log("dataContext1",dataContext)
                                                                    console.log("eventPayload1",eventPayload)
                                                                    resolveFetch({fetch:{id:'DistributionType-selectField-15',data:'dataContext'}}).then(function(pd){
                                                                        console.log('pppp:::::',pd)
                                                                    })
                                                                        console.log('1111:::',dataContext)
                                                                        console.log('2222:::',data)

                                                                    `
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "id": "DistributionType-textField-16",
                                                    "type": "textField",
                                                    "title": "检验指标编码",
                                                    "name": "imeQcQacBillDetailGidRef.indexCode",
                                                    "form":"reportForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "DistributionType-textField-17",
                                                    "type": "textField",
                                                    "title": "检验指标描述",
                                                    "name": "imeQcQacBillDetailGidRef.indexName",
                                                    "form":"reportForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "DistributionType-textField-18",
                                                    "type": "textField",
                                                    "title": "上限值",
                                                    "name": "upperLimit",
                                                    "form":"reportForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "DistributionType-textField-19",
                                                    "type": "textField",
                                                    "title": "下限值",
                                                    "name": "lowerLimit",
                                                    "form":"reportForm",
                                                    "enabled":false
                                                },

                                                {
                                                    "id": "DistributionType-textField-21",
                                                    "type": "textField",
                                                    "title": "检验项目类型定量",
                                                    "name": "checkResult",
                                                    "form":"reportForm",
                                                    "enabled":true,
                                                },
                                                {
                                                    "id": "DistributionType-selectField-22",
                                                    "type": "selectField",
                                                    "title": "检验项目类型定性",
                                                    "name": "itemResult",
                                                    "form":"reportForm",
                                                    dataSource: {
                                                        // type: "api",
                                                        // method: "post",
                                                        // url: "/sm/dictionaryEnumValue/query.action",
                                                        // mode: "payload",
                                                        // payload: {
                                                        //     "query": {
                                                        //         "query": [
                                                        //             {
                                                        //                 "field": "smDictionaryEnumGid",
                                                        //                 "type": "eq",
                                                        //                 "value": "59B01BE2490739D6E055000000000001"
                                                        //             }
                                                        //         ],
                                                        //         "sorted": "seq"
                                                        //     }
                                                        // },
                                                    },
                                                    displayField: "name",
                                                    valueField: "gid"
                                                },
                                                {
                                                    "id": "DistributionType-textField-221",
                                                    "type": "textField",
                                                    "title": "标准重要度",
                                                    "name": "importance",
                                                    "form":"reportForm",
                                                    "enabled":false
                                                },

                                            ]
                                        }}
                                    >
                                    </FieldArray>
                                </TabPane>
                                <TabPane forceRender="true" tab="缺陷信息" key="2-2">
                                    <AppButton config={{
                                        id: "adksk",
                                        title: "添加",
                                        type: "primary",
                                        size: "default",
                                        visible: true,
                                        enabled: true,
                                        subscribes:[
                                            {
                                                event:"adksk.click",
                                                pubs:[
                                                    {
                                                        event:"pageIdxffre46666exx2.openModal"
                                                    }
                                                ]
                                            }
                                        ]
                                    }}/>
                                    <FieldArray
                                        name="imeQcDefectiveInfoDTOs"
                                        component={TableField}
                                        config={{
                                            id:"DistributionType-tableField-23",
                                            name:"DistributionType-tableField-23",
                                            rowKey:"gid",
                                            addButton :false,
                                            columns:[
                                                {
                                                    "id": "DistributionType-textField-25",
                                                    "type": "textField",
                                                    "title": "缺陷编码",
                                                    "name": "imeQcInvalidinfoGidRef.code",
                                                    "form":"distributionTypeForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "DistributionType-textField-26",
                                                    "type": "textField",
                                                    "title": "缺陷名称",
                                                    "name": "imeQcInvalidinfoGidRef.name",
                                                    "form":"distributionTypeForm",
                                                    "enabled":false
                                                },
                                                {
                                                    "id": "DistributionType-textField-27",
                                                    "type": "selectField",
                                                    "title": "缺陷等级",
                                                    "name": "defectLevel",
                                                    "form":"distributionTypeForm",
                                                    "enabled":true,
                                                    dataSource: {
                                                        type: "api",
                                                        method: "post",
                                                        url: "/sm/dictionaryEnumValue/query.action",
                                                        mode: "payload",
                                                        payload: {
                                                            "query": {
                                                                "query": [
                                                                    {
                                                                        "field": "smDictionaryEnumGid", "type": "eq", "value": "59B01BE2490639D6E055000000000001"
                                                                    }
                                                                ],
                                                                "sorted": "seq"
                                                            }
                                                        }
                                                    },
                                                    displayField: "val",
                                                    valueField: "gid",
                                                },

                                            ]
                                        }}
                                    >
                                    </FieldArray>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col span={8} offset={20} style={{marginTop:'10px'}}>
                        <AppButton config={{
                            id: "referenceCancelButton",
                            title: "取消",
                            type: "primary",
                            size: "large",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "referenceCancelButton.click",
                                    pubs: [
                                        {
                                            event:"qualityModal-3.onCancel"
                                        }
                                    ]
                                }
                            ]
                        }}>
                        </AppButton>

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
                                                url: "/ime/imeQcQacRecord/add",
                                                bodyExpression: `
                                                    resolveFetch({fetch:{id:'reportForm',data:'@@formValues'}}).then(function(pd){
                                                        console.log('发给后台:::',pd)
                                                        delete pd.fCode;
                                                        delete pd.myCode;
                                                        if(!submitValidateForm('reportForm')){
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
                                                    console.log("dataContext111",dataContext)
                                                    console.log("eventPayload111",eventPayload)
                                                    callback('报检成功!')

                                                    `,
                                                },
                                                {
                                                    event:'qualityModal-3.onCancel'
                                                },
                                                {
                                                    event:'qualityModal-3.loadData'
                                                }
                                            ],
                                            errorPubs:[
                                                {
                                                    event: "@@message.error",
                                                    eventPayloadExpression: `
                                                        console.log("eventPayload222",eventPayload)
                                                        if(eventPayload){
                                                            callback(eventPayload)
                                                        }else{
                                                            callback('报检失败!')
                                                        }

                                                    `
                                                },
                                                {
                                                    event:'qualityModal-3.onCancel'
                                                },
                                                {
                                                    event:'qualityModal-3.loadData'
                                                }
                                            ]


                                        }
                                    ]
                                },

                            ]
                        }}>
                        </AppButton>

                    </Col>
                </Row>

                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "pageIdxffre46666exx2", // id，必填*
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
                        "name": "DisRecordletanchukuangxe2",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData":false,//初始化是否加载数据
                        "width": 100,//表格宽度
                        "showSerial": true,//是否显示序号
                        "editType": false,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 4,
                        "isSearch": true,//是否显示模糊查询
                        "columns": [
                            { title: '缺陷编码', width: 100, dataIndex: 'defectGidRef.code', key: '1' },
                            { title: '缺陷名称', width: 100, dataIndex: 'defectGidRef.name', key: '2' },
                        ],

                        subscribes:[
                            {
                                event:'DisRecordletanchukuangxe2.onTableTodoAny',
                                behaviors:[
                                    {
                                        type: "request",
                                        dataSource: {
                                            type: "api",
                                            method: "post",
                                            url: "/ime/imeQcQualityStandard/getStandardInvalidByProId.action",
                                            bodyExpression:`
                                                resolveFetch({fetch:{id:'reportForm',data:'@@formValues'}}).then(function(pd){
                                                    console.log('pd:::::',pd.mdProductInfoGid)
                                                    callback({id:pd.mdProductInfoGid})

                                                })

                                            `
                                        },

                                        successPubs:[
                                            {
                                                event:'DisRecordletanchukuangxe2.setData',
                                                eventPayloadExpression:`
                                                     console.log("eventPayload2",eventPayload)
                                                     callback({eventPayload:eventPayload})
                                                `
                                            }
                                        ]

                                    }
                                ]

                            }
                        ]
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
    resolveFetch({fetch:{id:'reportForm',data:'@@formValues'}}).then(function(res){
    console.log('res:::',res)

    console.log('dataContext::',dataContext)

    if(res.imeQcDefectiveInfoDTOs){
        let st=false;
        _.map(res.imeQcDefectiveInfoDTOs,function(item,index){
            if(item.imeQcInvalidinfoGid.code==dataContext[0].defectGidRef.code){
                st=true;
            }
        })

        if(st){
            pubsub.publish("@@message.error",'缺陷编码重复!')
            return
        }
    }

    var errorMessage = undefined;
    var jumpFor = false;
    if(dataContext!=undefined){
        console.log('dataContext:::',dataContext)
        let arr=[];
            for(var i=0; i < dataContext.length;i++){
                //用于跳出多层循环
                if(jumpFor){
                    break;
                }
                let obj= {
                    imeQcInvalidinfoGidRef:{

                    }
                }

                obj.imeQcInvalidinfoGid= dataContext[i].defectGidRef.gid
                obj.imeQcInvalidinfoGidRef.code= dataContext[i].defectGidRef.code
                obj.imeQcInvalidinfoGidRef.name= dataContext[i].defectGidRef.name
                arr.push(obj)

                // var parentData = res.imeQcDefectiveInfoDTOs;
                //用于判断是否已存在已存在物料编码
                // if(res.imeQcDefectiveInfoDTOs!=undefined){
                //     for(var j = 0 ;j<res.imeQcDefectiveInfoDTOs.length;j++){
                //         if(dataContext[i]["imeQcQualityCheckitemGidRef"]["code"] == parentData[j]["imeQcQualityCheckitemGidRef"]["code"]){
                //             errorMessage = "标准"+dataContext[i].imeQcQualityCheckitemGidRef.code+"已经存在,请重新选择";
                //             jumpFor = true;
                //         }
                //     }
                // }
              }

              console.log('arr:::',arr)

            if(false){
                // pubsub.publish("@@message.error",errorMessage)
            }else{
                 let params;
                if(res.imeQcDefectiveInfoDTOs){
                    params=res.imeQcDefectiveInfoDTOs.concat(arr);
                }else{
                    params = arr
                }

                pubsub.publish("@@form.change", { id: "reportForm",name:"imeQcDefectiveInfoDTOs" ,value: fromJS(params) })
                pubsub.publish("pageIdxffre46666exx2.onCancel")
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
                                                event: "pageIdxffre46666exx2.onCancel",
                                            },
                                        ]
                                    }
                                ]
                            }} />
                        </Col>
                    </Row>
                </ModalContainer>

            </div>
        );
    }
}

ReportModal.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


let ReportModalPage= reduxForm({
    form: "reportForm",
    validate,
    initialValues: Immutable.fromJS({})
})(ReportModal)

function mapStateToProps(props) {
    return {
        onSubmit:()=>{}
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportModalPage);
