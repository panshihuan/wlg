/*
 *
 * CheckingToolPage
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col, Tabs} from 'antd';
import pubsub from 'pubsub-js'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import Immutable from 'immutable'
import AppTable from 'components/AppTable';
import AppButton from "components/AppButton"
import TreeField from 'components/Form/TreeField';
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import TableField from 'components/Form/TableField'

const validate = values => {
    const errors = {}
    /*const reg = new RegExp("^[0-9]*$")


    if (!values.get('code')) {
        errors.code = '必填项'
    }
    if (!values.get('planEndTime')) {
        errors.planEndTime = '必填项'
    }
    if (!values.get('planBeginTime')) {
        errors.planBeginTime = '必填项'
    }
    if (!values.get('planQty')) {
        errors.planQty = '必填项'
    }
    if (!reg.test(values.get('planQty'))) {
        errors.planQty = '请输入数字'
    }

    if(values.get('planEndTime')&&values.get('planBeginTime')){
        var endTime = new Date(values.get('planEndTime').replace(/-/,"/"))
        var beginTime = new Date(values.get('planBeginTime').replace(/-/,"/"))
        console.log(!(endTime>beginTime))
        if(!(endTime>beginTime)){
            console.log(1)
            errors.planEndTime = "计划开始时间必须小于计划完成时间"
            errors.planBeginTime = "计划开始时间必须小于计划完成时间"
        }
    }

    if (!values.getIn(['workCenterGidRef','workCenterName'])) {
        errors.workCenterGidRef={}
        errors.workCenterGidRef.workCenterName = '必填项'
    }

    if (!values.getIn(['productGidRef','materialGidRef','code'])) {
        errors.productGidRef={}
        errors.productGidRef.materialGidRef={}
        errors.productGidRef.materialGidRef.code = '必填项'
    }
*/

    let vv= values.toJS();

    if (!vv.CheckingToolTable || !vv.CheckingToolTable.length) {
        //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.CheckingToolTable.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.name) {
                memberErrors.name = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }

        })
        if (membersArrayErrors.length) {
            errors.CheckingToolTable = membersArrayErrors
        }
    }
    return errors
}

export class CheckingToolPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor() {
        super()

        this.init()
        pubsub.subscribe("CheckingToolTable.refresh",()=>{
            this.init()
        })

        pubsub.subscribe("CheckingToolTable.onSelectedRows",(name,data)=>{
            //console.log("rows",data.length)
            if(data.length < 1){
                pubsub.publish("CheckingToolModifyBtn.enabled", false);
                pubsub.publish("CheckingToolSaveBtn.visible", false);
                pubsub.publish("CheckingToolDeleteBtn.enabled", false);
                pubsub.publish("CheckingToolTable.activateAll", false);
            }else{
                pubsub.publish("CheckingToolModifyBtn.enabled", true);
                pubsub.publish("CheckingToolDeleteBtn.enabled", true);
            }
        })


    }

    componentDidMount() {

    }

    init() {
        let formData = {}
        // 列表初始化表单
        let dataSource = {
            type: 'api',
            method: 'post',
            mode: "payload",
            url: '/ime/imeQcCheckingtool/query.action'
        }

        resolveDataSource({
            dataSource: dataSource
        }).then(function (response) {
            if (response.success) {
                formData.CheckingToolTable = response.data
                //console.log("回显的值",formData)
                pubsub.publish("@@form.init", {id: "CheckingToolForm", data: Immutable.fromJS(formData)})
            } else {
                pubsub.publish("@@message.error", "检具表初始化失败!");
            }
        }.bind(this))
    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>质量</Breadcrumb.Item>
                    <Breadcrumb.Item>检具档案</Breadcrumb.Item>
                </Breadcrumb>
                <div className="wrapper">
                    <Row>
                        <Card bordered={true}
                              style={{
                                  width: "100%",
                                  marginRight: "20px",
                                  marginTop: "20px",
                                  minHeight: "20px",
                                  "backgroundColor": "rgba(247, 247, 247, 1)"
                              }}
                              bodyStyle={{padding: "15px"}}>

                            <Col span={8} xs={24}>
                                <AppButton config={{
                                    id: "CheckingToolCreateBtn",
                                    title: "创建",
                                    type: "primary",
                                    size: "large",
                                    visible: true,
                                    enabled: true,
                                    subscribes: [
                                        {
                                            event: "CheckingToolCreateBtn.click",
                                            pubs: [
                                                {
                                                    event: "CheckingToolTable.addRow",
                                                    eventPayloadExpression:`
                                                           let code
                                                       let dataSource = {
                                                            type: 'api',
                                                            method: 'post',
                                                            url: '/sm/codeRule/generateCode.action?ruleCode=QS'
                                                        }

                                                       let onSuccess = function(response){
                                                           if (response.success) {
                                                                 code = response.data;

                                                                 callback({code:code})
                                                            } else {
                                                                pubsub.publish("@@message.error", "初始化获取编码失败!");
                                                            }
                                                        }

                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:null,dataContext:null},onSuccess);


                                                          `
                                                },{
                                                    event: "CheckingToolSaveBtn.visible",
                                                    payload: true
                                                }
                                            ]
                                        }
                                    ]
                                }}/>
                                <AppButton config={{
                                    id: "CheckingToolModifyBtn",
                                    title: "修改",
                                    type: "primary",
                                    size: "large",
                                    visible: true,
                                    enabled: false,
                                    subscribes: [
                                        {
                                            event: "CheckingToolTable.onSelectedRows",
                                            pubs: [
                                                {
                                                    event: "CheckingToolModifyBtn.dataContext"
                                                }
                                            ]
                                        },
                                        {
                                            event: "CheckingToolModifyBtn.click",
                                            behaviors:[
                                                {
                                                    type:"fetch",
                                                    id: "CheckingToolModifyBtn", //要从哪个组件获取数据
                                                    data: "dataContext",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "CheckingToolTable.activateRow"
                                                        },{
                                                            event:"CheckingToolSaveBtn.visible",
                                                            payload: true
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }}/>
                                <AppButton config={{
                                    id: "CheckingToolSaveBtn",
                                    title: "保存",
                                    type: "primary",
                                    size: "large",
                                    visible: false,
                                    enabled: true,
                                    subscribes: [
                                        {
                                            event: "CheckingToolSaveBtn.click",
                                            behaviors:[
                                                {
                                                    type:"fetch",
                                                    id: "CheckingToolTable", //要从哪个组件获取数据
                                                    data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "@@message.success",
                                                            eventPayloadExpression: `

                                                                let array = []

                                                                if(eventPayload.length > 0 ){

                                                                    for(let index = 0; index < eventPayload.length;index++ ){

                                                                        if(typeof (eventPayload[index]) != 'undefined'){
                                                                            array.push(eventPayload[index])
                                                                        }
                                                                    }

                                                                    let dataSource = {
                                                                        type: 'api',
                                                                        method: 'post',
                                                                        mode:"dataContext",
                                                                        url: '/ime/imeQcCheckingtool/save.action'
                                                                    }
                                                                    let onSuccess = function(response){
                                                                        if (response.success) {
                                                                            pubsub.publish("@@message.success", "保存成功!");
                                                                            pubsub.publish("CheckingToolModifyBtn.enabled", false);
                                                                            pubsub.publish("CheckingToolDeleteBtn.enabled", false);
                                                                            pubsub.publish("CheckingToolSaveBtn.visible", false);
                                                                            pubsub.publish("CheckingToolTable.clearSelect");

                                                                           pubsub.publish("CheckingToolTable.refresh")
                                                                            pubsub.publish("CheckingToolTable.activateAll", false);

                                                                        } else {
                                                                            pubsub.publish("@@message.error", response.data);
                                                                        }
                                                                    }
                                                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:array,dataContext:array},onSuccess);

                                                                }else {
                                                                    pubsub.publish("@@message.error", "请选择要操作的行!");
                                                                }

                    `,
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }}/>
                                <AppButton config={{
                                    id: "CheckingToolDeleteBtn",
                                    title: "删除",
                                    type: "primary",
                                    size: "large",
                                    visible: true,
                                    enabled: false,
                                    subscribes: [
                                        {
                                            event: "CheckingToolDeleteBtn.click",
                                            behaviors:[
                                                {
                                                    type:"fetch",
                                                    id: "CheckingToolTable", //要从哪个组件获取数据
                                                    data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "@@message.success",
                                                            eventPayloadExpression: `


                                                let ids = []
                                               for(let index = 0; index < eventPayload.length;index++ ){

                                                    if(typeof (eventPayload[index]) != 'undefined'){
                                                        if(typeof (eventPayload[index].gid) != 'undefined'){
                                                            ids.push(eventPayload[index].gid)
                                                        }
                                                    }
                                                }

                                                let dataSource = {
                                                    type: 'api',
                                                    method: 'post',
                                                    mode:"dataContext",
                                                    url: '/ime/imeQcCheckingtool/deleteByIds.action',

                                                }

                                                let onSuccess = function(response){
                                                     if (response.success) {
                                                        pubsub.publish("@@message.success", "删除成功!");
                                                        pubsub.publish("CheckingToolTable.refresh")
                                                        pubsub.publish("CheckingToolModifyBtn.enabled", false);
                                                        pubsub.publish("CheckingToolSaveBtn.visible", false);
                                                        pubsub.publish("CheckingToolDeleteBtn.enabled", false);
                                                        pubsub.publish("CheckingToolTable.activateAll", false);
                                                    } else {
                                                        pubsub.publish("@@message.error", "删除失败!");
                                                    }
                                                }

                                             resolveDataSourceCallback({dataSource:dataSource,eventPayload:null,dataContext:ids},onSuccess);

                    `,
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }}/>
                            </Col>
                        </Card>
                    </Row>

                    <Row>
                        <Card bordered={true}>
                            <FieldArray name="CheckingToolTable" config={{
                                "id": "CheckingToolTable",
                                "name": "CheckingToolTable",
                                "form": "CheckingToolForm",
                                "rowKey": "gid",
                                "addButton": false, //是否显示默认增行按钮
                                "showSelect": true, //是否显示选择框
                                "type": "checkbox", //表格单选（radio）复选（checkbox）类型
                                "unEditable": true, //初始化是否都不可编辑
                                "showRowDeleteButton": true,  //是否显示操作列
                                "columns": [
                                    {
                                        "id": "code",
                                        "type": "textField",
                                        "title": "检具/量具编码",
                                        "name": "code",
                                        "enabled":false
                                    }, {
                                        "id": "name",
                                        "type": "textField",
                                        "title": "检具/量具名称",
                                        showRequiredStar: true,
                                        "name": "name",
                                    }, {
                                        "id": "type",
                                        "type": "selectField",
                                        "title": "工具类型",
                                        "name": "type",
                                        loadDataOnLoad: true,
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
                                                            "value": "5A22B8055C5A2798E055000000000001"
                                                        }
                                                    ],
                                                    "sorted": "seq"
                                                }
                                            },
                                        },
                                        displayField: "val",
                                        valueField: "gid",
                                    },
                                    /*{
                                        "id": "mdMeasurementUnitGidRef.name",
                                        "type": "findbackField",
                                        "title": "单位",
                                        "form": "CheckingToolForm",
                                        "name": "mdMeasurementUnitGidRef.name",
                                        tableInfo: {
                                            id: "mdMeasurementUnitTableInCheckingTool",
                                            size: "small",
                                            rowKey: "gid",
                                            tableTitle: "计量单位信息",
                                            showSerial: true,  //序号
                                            columns: [
                                                {title: '编码', width: 75, dataIndex: 'code', key: '1'},
                                                {title: '名称', width: 75, dataIndex: 'name', key: '2'},
                                                {title: '英文名称', width: 75, dataIndex: 'englishName', key: '3'},
                                                {title: '是否基本单位', width: 75, dataIndex: 'basicUnit', key: '4'},
                                                {title: '换算系数', width: 75, dataIndex: 'conversionFactor', key: '5'},
                                                {title: '小数位数', width: 75, dataIndex: 'decimalDigit', key: '6'}
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/ime/mdMeasurementUnit/query.action'
                                            }
                                        },
                                        pageId: 'findBackmdMeasurementUnitInCheckingTool',
                                        displayField: "name",
                                        valueField: {
                                            "from": "name",
                                            "to": "mdMeasurementUnitGidRef.name"
                                        },
                                        associatedFields: [
                                            {
                                                "from": "gid",
                                                "to": "mdMeasurementUnitGid"
                                            }
                                        ]
                                    },*/
                                    {
                                        "id": "remark",
                                        "type": "textField",
                                        "title": "备注",
                                        "name": "remark",
                                    }
                                ]
                            }} component={TableField}/>
                        </Card>

                    </Row>
                </div>
            </div>
        );
    }
}

CheckingToolPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

let CHECKINGTOOLFORM =  reduxForm({
    form: "CheckingToolForm",
    validate
})(CheckingToolPage)


export default connect(null, mapDispatchToProps)(CHECKINGTOOLFORM);
