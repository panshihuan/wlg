/*
 *
 * ImeQcKeyModuleModify
 *
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col,Tabs } from 'antd';
import { Link } from 'react-router';
import AppButton from 'components/AppButton';
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

import TextField from 'components/Form/TextField'
import SelectField from 'components/Form/SelectField'
import TableField from 'components/Form/TableField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import CheckBoxField from 'components/Form/CheckBoxField'
import Immutable from 'immutable'
import pubsub from 'pubsub-js'

import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'

const TabPane = Tabs.TabPane;
const validate = values => {
    const errors = {}
    if (!values.getIn(['mdProductInfoGidRef','materialGidRef','code'])) {
        errors.mdProductInfoGidRef={}
        errors.mdProductInfoGidRef.materialGidRef={}
        errors.mdProductInfoGidRef.materialGidRef.code = '必填项'
    }

    let vv= values.toJS();

    if (!vv.imeQcKeyModuleInfoDTOs || !vv.imeQcKeyModuleInfoDTOs.length) {
        //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        let list = vv.imeQcKeyModuleInfoDTOs
        let a = 0
        vv.imeQcKeyModuleInfoDTOs.forEach((member, memberIndex) => {
            const memberErrors = {}
            for(var i=0;i<list.length;i++){
                if (list[i].barCode == member.barCode && member.barCode && i!=a) {
                    memberErrors.barCode = '条码重复'
                    membersArrayErrors[memberIndex] = memberErrors
                }
            }
            a++
        })
        if (membersArrayErrors.length) {
            errors.imeQcKeyModuleInfoDTOs = membersArrayErrors
        }
    }
    return errors
}


/*const asyncValidate = values => {
    let dataSource = {
        mode: "dataContext",
        type: "api",
        method: "POST",
        url: "/sm/checkUnique/check.action",
    }
    let gid = values.get('gid')
    let className = "com.neusoft.ime.qc.imeQcKeyModule.dto.KeyModuleDTO"
    let fieldNames = "status,delete";
    let fieldValues = values.get('statusName') + ",0";
    return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:gid,  className:className,fieldNames:fieldNames,fieldValues,fieldValues} }).then(function (res) {
        resolve(res)
    })).then(function (res) {
        if(!res.data){
            throw { statusName: "该编码已存在,请重新填写" }
        }
    })
}*/

export class ImeQcKeyModuleModify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);

        console.log('--------------------')
        let modifyId = this.props.location.state[0].gid
        let modifyData = this.props.location.state[0]

        let dataSource = {
            mode: "payload",
            type: "api",
            method: "POST",
            url: "/ime/imeQcKeyModuleInfo/query.action",
            payload:{
                "query":{
                    "query":[
                        {"field":"imeQcKeyModuleGid","type":"eq","value":modifyId}
                    ],
                    //"sorted":"seq"
                }
            }
        }
        resolveDataSource( {dataSource:dataSource}).then(function (data) {
            if(modifyData.status == undefined){
                modifyData.statusName =''
            }else{
                modifyData.statusName =data.ext.enumHeader.status[modifyData.status]
            }
            console.log(data.data)
            modifyData.imeQcKeyModuleInfoDTOs = data.data
            let list = modifyData.imeQcKeyModuleInfoDTOs
            for(var i=0;i<list.length;i++) {
                if (list[i].bundlingStatus == undefined) {
                    list[i].bundlingStatusName = ''
                } else {
                    list[i].bundlingStatusName = data.ext.enumHeader.bundlingStatus[list[i].bundlingStatus]
                }
            }
            modifyData.imeQcKeyModuleInfoDTOs = list
            console.log(modifyData)
            pubsub.publish("@@form.init", { id: "ImeQcKeyModuleModify", data: Immutable.fromJS(modifyData) })
        })

    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>质量管理</Breadcrumb.Item>
                    <Breadcrumb.Item>关键件</Breadcrumb.Item>
                    <Breadcrumb.Item>关键件详情</Breadcrumb.Item>
                </Breadcrumb>

                <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <AppButton config={{
                            id: "imeQcKeyModuleSave01",
                            title: "保存",
                            visible: true,
                            enabled: true,
                            type: "primary",
                            subscribes: [
                                {
                                    event: "imeQcKeyModuleSave01.click",
                                    pubs: [
                                        {
                                            event: "imeQcKeyModuleSave01.expression",
                                            meta:{
                                                expression:`
                                        resolveFetch({fetch:{id:'ImeQcKeyModuleModify',data:'@@formValues'}}).then(function(data){
                                           if(data){
                                              let main = data
                                              let detailDTOs = data.imeQcKeyModuleInfoDTOs
                                              let parme = {"main":main,"detailDTOs":detailDTOs}
                                              console.log(parme)
                                              let dataSource = {
                                                type: "api",
                                                mode:"payload",
                                                method: "POST",
                                                url: "/ime/imeQcKeyModule/saveAll.action",
                                                payload: parme
                                              }
                                              let onSuccess = function(response){
                                                if(response.success) {
                                                    pubsub.publish("@@message.success","修改成功");
                                                    pubsub.publish("imeQcKeyModuleCancel01.click")

                                                }else {
                                                    pubsub.publish("@@message.error","修改失败,"+response.data);
                                                  }
                                              }
                                              if(submitValidateForm("ImeQcKeyModuleModify")){
                                              }else{
                                                    resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                              }
                                           }else{
                                                 pubsub.publish("@@message.error","页面数据不能为空");
                                           }
                                        })
                                            `
                                            }
                                        }
                                    ]
                                }
                            ]
                        }}></AppButton>

                        <AppButton config={{
                            id: "imeQcKeyModuleCancel01",
                            title: "取消",
                            visible: true,
                            enabled: true,
                            type: "primary",
                            subscribes: [
                                {
                                    event: "imeQcKeyModuleCancel01.click",
                                    pubs: [
                                        {
                                            event: "@@navigator.push",
                                            payload: {
                                                url: "/imeQcKeyModule"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }}></AppButton>
                       {/* <AppButton config={{
                            id: "imeQcKeyModuleBinding01",
                            title: "绑定",
                            visible: true,
                            enabled: true,
                            type: "primary",
                            subscribes: [
                                {
                                    event: "imeQcKeyModuleBinding01.click",

                                    behaviors:[
                                        {
                                            type:"fetch",
                                            id:"imeQcKeyModuleInfoDTOs01",
                                            data:"selectedRows",
                                            successPubs:[
                                                {
                                                    event:"@@form.init",
                                                    eventPayloadExpression:`
                                                console.log(1111111111)
                                                let list = eventPayload
                                                let dataSource = {
                                                    type: "api",
                                                    mode:"payload",
                                                    method: "POST",
                                                    url: "/ime/imeQcKeyModule/saveList.action",
                                                    payload: list
                                                }
                                                let onSuccess = function(response){
                                                if(response.success) {
                                                    pubsub.publish("@@message.success","绑定成功");
                                                    pubsub.publish("imeQcKeyModuleInfoDTOs01.loadData")
                                                }
                                                  else {
                                                    pubsub.publish("@@message.error","绑定失败");
                                                  }
                                              }
                                              resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                              `
                                                }
                                            ]
                                        }
                                    ],
                                }
                            ]
                        }}/>
                        <AppButton config={{
                            id: "imeQcKeyModuleUnbundling01",
                            title: "解绑",
                            visible: true,
                            enabled: true,
                            type: "primary",
                            subscribes: [
                                {
                                    event: "imeQcKeyModuleUnbundling01.click",
                                    behaviors:[
                                        {
                                            type:"fetch",
                                            id:"imeQcKeyModuleInfoDTOs01",
                                            data:"selectedRows",
                                            successPubs:[
                                                {
                                                    event:"@@form.init",
                                                    eventPayloadExpression:`
                                                console.log(1111111111)
                                                let list = eventPayload
                                                let dataSource = {
                                                    type: "api",
                                                    mode:"payload",
                                                    method: "POST",
                                                    url: "/ime/imeQcKeyModule/saveList.action",
                                                    payload: list
                                                }
                                                let onSuccess = function(response){
                                                if(response.success) {
                                                    pubsub.publish("@@message.success","解绑成功");
                                                    pubsub.publish("imeQcKeyModuleInfoDTOs01.loadData")
                                                }
                                                  else {
                                                    pubsub.publish("@@message.error","解绑失败");
                                                  }
                                              }
                                              resolveDataSourceCallback({dataSource:dataSource},onSuccess)
                                              `
                                                }
                                            ]
                                        }
                                    ],
                                }
                            ]
                        }}></AppButton>*/}
                       </Row>
                </Card>

                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "barCode",
                                label: "序列号",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                //showRequiredStar: true,  //是否显示必填星号
                                //placeholder: "请输入序列号"
                            }} component={TextField} name="barCode" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "mdProductInfoGidRef.materialGidRef.code",
                                label: "产品编码",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                //placeholder: "请输入编码"
                            }} component={TextField} name="mdProductInfoGidRef.materialGidRef.code" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "mdProductInfoGidRef.materialGidRef.name",
                                label: "产品名称",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                //showRequiredStar: true,  //是否显示必填星号
                                //placeholder: "请输入名称"
                            }} component={TextField} name="mdProductInfoGidRef.materialGidRef.name" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "mdProductInfoGidRef.materialGidRef.spec",
                                label: "规格",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                //showRequiredStar: true,  //是否显示必填星号
                                //placeholder: "请输入"
                            }} component={TextField} name="mdProductInfoGidRef.materialGidRef.spec" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "mdProductInfoGidRef.materialGidRef.model",
                                label: "型号",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                //showRequiredStar: true,  //是否显示必填星号
                                //placeholder: "请输入"
                            }} component={TextField} name="mdProductInfoGidRef.materialGidRef.model" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "mdProductInfoGidRef.materialGidRef.measurementUnitGidRef.name",
                                label: "计量单位",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                //showRequiredStar: true,  //是否显示必填星号
                                //placeholder: "请输入"
                            }} component={TextField} name="mdProductInfoGidRef.materialGidRef.measurementUnitGidRef.name" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "amount",
                                label: "数量",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                //showRequiredStar: true,  //是否显示必填星号
                                //placeholder: "请输入数量"
                            }} component={TextField} name="amount" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: false,
                                id: "status",
                                label: "单据状态",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                //showRequiredStar: true,  //是否显示必填星号
                                //placeholder: "请输入数量"
                            }} component={TextField} name="statusName" />
                        </Col>
                    </Row>
                </Card>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="子物料" key="1">
                            <Row>
                                <Col span={24}>
                                    <FieldArray name="imeQcKeyModuleInfoDTOs" config={{
                                        "id": "imeQcKeyModuleInfoDTOs01",
                                        "name": "imeQcKeyModuleInfoDTOs",
                                        "rowKey": "id",
                                        "showSelect":true, //是否显示选择框
                                        "addButton" :false,
                                        "type": "checkbox",//表格单选复选类型
                                        "form": "ImeQcKeyModuleModify",
                                        "showRowDeleteButton": false,  //是否显示操作列
                                        "columns": [
                                            {
                                                "id": "wlTabTextFiled01",
                                                "type": "textField",
                                                "title": "物料编号",
                                                "name": "mdMaterielInfoGidRef.code",
                                                "enabled": false
                                            },
                                            {
                                                "id": "wlTabTextFiled02",
                                                "type": "textField",
                                                "title": "物料名称",
                                                "name": "mdMaterielInfoGidRef.name",
                                                "enabled": false
                                            },
                                            {
                                                "id": "wlTabTextFiled03",
                                                "type": "textField",
                                                "title": "规格",
                                                "name": "mdMaterielInfoGidRef.spec",
                                                "enabled": false
                                            },
                                            {
                                                "id": "wlTabTextFiled04",
                                                "type": "textField",
                                                "title": "型号",
                                                "name": "mdMaterielInfoGidRef.model",
                                                "enabled": false
                                            },
                                            {
                                                "id": "wlTabTextFiled05",
                                                "type": "textField",
                                                "title": "单位",
                                                "name": "mdMaterielInfoGidRef.measurementUnitGidRef.name",
                                                "enabled": false
                                            },
                                            {
                                                "id": "wlTabTextFiled06",
                                                "type": "textField",
                                                "title": "条码",
                                                "name": "barCode",
                                                "enabled": true,
                                               /* subscribes: [
                                                    {
                                                        event: "wlTabTextFiled06.onChange",
                                                        pubs: [
                                                            {
                                                                event: "wlTabTextFiled06.expression",//在某个组件上执行表达式
                                                                meta: {
                                                                    expression: `
                                              console.log(614827)
                                              let value = me.props.input.value
                                              let barCodes = []
                                              resolveFetch({fetch:{id:'ImeQcKeyModuleModify',data:'@@formValues'}}).then(function(data){
                                                let list = data.imeQcKeyModuleInfoDTOs
                                                for(var i=0;i<list.length;i++){
                                                     if(("imeQcKeyModuleInfoDTOs["+i+"].barCode")==me.props.input.name){
                                                        continue;
                                                    }
                                                    barCodes.push(list[i].barCode)
                                                }
                                                console.log(barCodes)
                                                for(var i=0;i<barCodes.length;i++){
                                                    if(value == barCodes[i]){
                                                        pubsub.publish("@@message.error","子物料条码重复");
                                                        return;
                                                    }
                                                }
                                              })

                                            `
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]*/
                                            },
                                            {
                                                "id": "wlTabTextFiled07",
                                                "type": "textField",
                                                "title": "绑定状态",
                                                "name": "bundlingStatusName",
                                                "enabled": false
                                            }
                                        ]
                                    }}component={TableField}/>
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        );
    }
}

ImeQcKeyModuleModify.propTypes = {
    dispatch: PropTypes.func.isRequired,
}


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

let ModifyForm =  reduxForm({
    form: "ImeQcKeyModuleModify",
    validate,
     /*asyncValidate,
     asyncBlurFields: ['barCode']*/
})(ImeQcKeyModuleModify)
export default connect(mapStateToProps, mapDispatchToProps)(ModifyForm);