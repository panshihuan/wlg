import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import pubsub from 'pubsub-js';
import { Link } from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import AppTable from '../../../components/AppTable/index';
import DropdownButton from '../../../components/DropdownButton/index';
import {fromJS} from 'immutable'
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer';
import TreeField from '../../../components/Form/TreeField/index';
import AutoCompleteField from '../../../components/Form/AutoCompleteField/index';
import TableField from 'components/Form/TableField';
import Immutable from 'immutable';

import TextField from 'components/Form/TextField'
import DateField from 'components/Form/DateField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import TextAreaField from 'components/Form/TextAreaField'
import TreeSelectField from 'components/Form/TreeSelectField';

const validate = values => {
    const errors = {}

    let vv= values.toJS();

    if (!vv.teamInfo || !vv.teamInfo.length) {
        //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.teamInfo.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member || !member.code) {
                memberErrors.code = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
            if (!member || !member.name) {
                memberErrors.name = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
            if (!member ||member.departmentGidRef == undefined|| member.departmentGidRef.name ===undefined) {
                memberErrors.departmentGidRef={}
                memberErrors.departmentGidRef.name = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
        })
        if (membersArrayErrors.length) {
            errors.teamInfo = membersArrayErrors
        }
    }
 /*   if (!vv.teamPerson || !vv.teamPerson.length) {
        //errors.imePlanOrderDetailDTOs = { _error: 'At least one member must be entered' }
    } else {
        const membersArrayErrors = []
        vv.teamPerson.forEach((member, memberIndex) => {
            const memberErrors = {}
            if (!member ||member.personnelGidRef == undefined|| member.personnelGidRef.personnelCode ===undefined) {
                memberErrors.personnelGidRef={}
                memberErrors.personnelGidRef.personnelCode = '必填'
                membersArrayErrors[memberIndex] = memberErrors
            }
        })
        if (membersArrayErrors.length) {
            errors.teamPerson = membersArrayErrors
        }
    }*/
    return errors
}

const TabPane = Tabs.TabPane;
export class TeamInfoPage extends React.PureComponent {
    //构造
    constructor(props) {
        super(props);
        this.state={
            index:[],
            dataSource:[],
            parms:undefined,
            newDataSource:undefined
        };

    }


    componentWillMount() {

    }

    //组件加载完毕，如果是页面就是页面加载完毕
    componentDidMount() {

    }

    //销毁
    componentWillUnmount() {

    }

    //不用
    componentWillReceiveProps(nextProps) {
        //console.log("111")
    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>班组</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={8} xs={24}>
                            <AppButton config={{
                                id: "cleanTeamTableBtn",
                                title: "清空班组表",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cleanTeamTableBtn.click",
                                        pubs: [
                                            {
                                                event: 'teamTable.expression',
                                                meta: {
                                                    expression: `
                                 resolveFetch({fetch:{id:"teamTable",data:"dataContext"}}).then(function (value) {
                                      console.log(value)
                                   if(value && value.nodeGid && value.nodeGid!=0){
                                        var query =[{
                                            "field":"departmentGid",
                                            "type":"eq",
                                            "value":value.nodeGid,
                                            "operator":"and"
                                         }];

                                   }else{
                                      var query=[{
                                         "field":"gid",
                                         "type":"eq",
                                         "value":'1234567890123!!@@00',
                                         "operator":"and"

                                      }]
                                   }
                                        var params = {
                                          "query":{
                                            "query":query
                                          }
                                        };
                                        let dataSource= {
                                          type: "api",
                                          mode:"dataContext",
                                          method: "POST",
                                          url: "/ime/mdTeamInfo/query.action"

                                        };
                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},function(res){
                                     resolveFetch({fetch:{id:"TeamInfoPage",data:"@@formValues"}}).then(function (value) {
                                        if(typeof(value)!="undefined"){
                                            var datas = value;
                                        }else{
                                            var datas = {};
                                        }
                                            datas["teamInfo"]=res.data;
                                            pubsub.publish("@@form.init",{id:"TeamInfoPage",data:datas});
                                       })
                                  })
                                  })

                      `
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "cleanPersonTableBtn",
                                title: "清空人员表",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cleanPersonTableBtn.click",
                                        pubs: [
                                            {
                                                event: 'teamPersonTable.expression',
                                                meta: {
                                                    expression: `
                                                    //console.log("清空人员表 按钮事件!!!!");
                                 resolveFetch({fetch:{id:"deleteTeamBtn",data:"dataContext"}}).then(function (value) {
                                    console.log(value)
                                    if(value && value!=''){
                                            var query =[{
                                                "field":"mdTeamInfoGid",
                                                "type":"eq",
                                                "value":value,
                                                "operator":"and"
                                             }];
                                    }else{
                                        var query =[{
                                                "field":"gid",
                                                "type":"eq",
                                                "value":"12345678900000!!!@@##",
                                                "operator":"and"
                                             }];
                                    }
                                            var params = {
                                              "query":{
                                                "query":query
                                              }
                                            };
                                            let dataSource= {
                                              type: "api",
                                              mode:"dataContext",
                                              method: "POST",
                                              url: "/ime/mdTeamPersonMapping/query.action"

                                            };
                                    resolveDataSourceCallback({dataSource:dataSource,dataContext:params},function(res){
                                         resolveFetch({fetch:{id:"TeamInfoPage",data:"@@formValues"}}).then(function (value) {
                                            if(typeof(value)!="undefined"){
                                                var datas = value;
                                            }else{
                                                var datas = {};
                                            }
                                                datas["teamPerson"]=res.data;
                                                pubsub.publish("@@form.init",{id:"TeamInfoPage",data:datas});
                                           })
                                      })

                                  })

                      `
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "cleanButtonBtn",
                                title: "初始化按钮状态",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cleanButtonBtn.click",
                                        pubs: [
                                            {
                                                event: "modifyTeamBtn.enabled",
                                                payload: false
                                            },

                                            {
                                                event: "deleteTeamBtn.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "createTeamBtn.enaled",
                                                payload: true
                                            },
                                            {
                                                event: "modifyTeamBtn.visible",
                                                payload: true
                                            },

                                            {
                                                event: "deleteTeamBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event: "createTeamBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event: "createPersonBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event: "deletePersonBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event:"modifyPersonBtn.visible",
                                                payload:true
                                            }
                                            ,
                                            {
                                                event: "createPersonBtn.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "deletePersonBtn.enabled",
                                                payload: false
                                            },
                                            {
                                                event:"modifyPersonBtn.enabled",
                                                payload:false
                                            },
                                            {
                                                event: "savePersonBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event:"cancelPersonBtn.visible",
                                                payload:false
                                            },
                                            {
                                                event: "saveTeamModifyBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event:"cancelTeamModifyBtn.visible",
                                                payload:false
                                            }

                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                        <AppButton config={{
                            id: "createTeamBtn",
                            title: "创建",
                            type: "primary",
                            size: "large",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "createTeamBtn.click",
                                    pubs: [
                                        {
                                            event: "createTeamBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event: "modifyTeamBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event: "deleteTeamBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event: "saveTeamModifyBtn.visible",
                                            payload: true
                                        },
                                        {
                                            event: "cancelTeamModifyBtn.visible",
                                            payload: true
                                        },
                                        {
                                            event: "teamTable.addRow",
                                            eventPayloadExpression:`
                                                  resolveFetch({fetch:{id:"teamTable",data:"dataContext"}}).then(function (value) {
                                                        if(value && value.nodeGid && value.nodeGid!='0'){
                                                            console.log(value.nodeGid,value.nodeName);
                                                        callback({departmentGidRef:{name:value.nodeName},departmentGid:value.nodeGid})
                                                        }else {
                                                            callback({thisislajishuju:'无用值'});
                                                        }
                                                  })

                                            `
                                        }
                                    ]
                                }
                            ]
                        }}>
                        </AppButton>
                        <AppButton config={{
                            id: "modifyTeamBtn",
                            title: "修改",
                            type: "primary",
                            size: "large",
                            visible: true,
                            enabled: false,
                            subscribes: [
                                {
                                    event: "modifyTeamBtn.click",
                                    pubs: [
                                        {
                                            event: "modifyTeamBtn.visible",
                                            payload: false
                                        },

                                        {
                                            event: "deleteTeamBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event: "createTeamBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event: "saveTeamModifyBtn.visible",
                                            payload: true
                                        },
                                        {
                                            event: "cancelTeamModifyBtn.visible",
                                            payload: true
                                        }/*,
                                        {
                                            event: "createPersonBtn.enabled",
                                            payload: true
                                        },
                                        {
                                            event: "modifyPersonBtn.enabled",
                                            payload: true
                                        },
                                        {
                                            event: "deletePersonBtn.enabled",
                                            payload: true
                                        }*/
                                        ,
                                        {
                                            event:"teamTable.unEditable",
                                            payload:false
                                        }
                                        ,
                                        {
                                            event: "teamTable.activateAll",
                                            payload:true

                                        }
                                    ]
                                },
                                {
                                    event:"teamTable.onSelectedRows",
                                    pubs: [
                                        {
                                            event: "modifyTeamBtn.enabled",
                                            payload:true
                                        }
                                    ]
                                },
                                {
                                    event:"teamTable.onSelectedRowsClear",
                                    pubs: [
                                        {
                                            event: "modifyTeamBtn.enabled",
                                            payload:false
                                        }
                                    ]
                                },
                                {
                                    event: "teamTable.onSelectedRows",
                                    pubs: [
                                        {
                                            event: "modifyTeamBtn.dataContext"
                                        }
                                    ]
                                }
                            ]
                        }}>
                        </AppButton>
                        <AppButton config={{
                            id: "deleteTeamBtn",
                            title: "删除",
                            type: "primary",
                            size: "large",
                            visible: true,
                            enabled: false,
                            subscribes: [

                                {
                                    event:"teamTable.onSelectedRows",
                                    pubs: [
                                        {
                                            event: "deleteTeamBtn.enabled",
                                            payload:true
                                        },
                                        {
                                            event: "deleteTeamBtn.dataContext"
                                        }

                                    ]
                                },
                                {
                                    event:"teamTable.onSelectedRowsClear",
                                    pubs: [
                                        {
                                            event: "deleteTeamBtn.enabled",
                                            payload:false
                                        }

                                    ]
                                },
                                {
                                    event: "deleteTeamBtn.click",
                                    pubs: [
                                        {
                                            event: 'deleteTeamBtn.expression',
                                            meta: {
                                                expression: `
                                                console.log("delete!!!!!");
                                                console.log(dataContext);

                                                  let dataSource= {
                                                    type: 'api',
                                                    method: 'post',
                                                    mode:"payload",
                                                    url: '/ime/mdTeamInfo/delete.action?id='+dataContext
                                                  };

                                                resolveDataSourceCallback({dataSource:dataSource},function(response){
                                                  if(response.success) {
                                                    pubsub.publish("@@message.success","删除成功");
                                                     resolveFetch({fetch:{id:"teamTable",data:"dataContext"}}).then(function (value) {
                                                        console.log(value)
                                                            var query =[{
                                                                "field":"departmentGid",
                                                                "type":"eq",
                                                                "value":value.nodeGid,
                                                                "operator":"and"
                                                             }];
                                                            var params = {
                                                              "query":{
                                                                "query":query
                                                              }
                                                            };
                                                            let dataSource= {
                                                              type: "api",
                                                              mode:"dataContext",
                                                              method: "POST",
                                                              url: "/ime/mdTeamInfo/query.action"

                                                            };
                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},function(res){
                                     resolveFetch({fetch:{id:"TeamInfoPage",data:"@@formValues"}}).then(function (value) {
                                        if(typeof(value)!="undefined"){
                                            var datas = value;
                                        }else{
                                            var datas = {};
                                        }
                                            datas["teamInfo"]=res.data;
                                            pubsub.publish("@@form.init",{id:"TeamInfoPage",data:datas});
                                       })
                                  })

                                                    })
                                                  } else {
                                                    pubsub.publish("@@message.error","删除失败");

                                                  }
                                                },function(e){
                                                  console.log(e)
                                                })

                      `
                                            }
                                        },
                                        {
                                            event: "createTeamBtn.enabled",
                                            payload:false
                                        }
                                        ,
                                        {
                                            event: "modifyTeamBtn.enabled",
                                            payload:false
                                        }
                                        ,
                                        {
                                            event: "deleteTeamBtn.enabled",
                                            payload:false
                                        }
                                        ,
                                        {
                                            event:"createTeamBtn.visible",
                                            payload:true
                                        }
                                        ,
                                        {
                                            event:"modifyTeamBtn.visible",
                                            payload:true
                                        }
                                        ,
                                        {
                                            event:"deleteTeamBtn.visible",
                                            payload:true
                                        }
                                        ,
                                        {
                                            event: "teamTable.activateAll",
                                            payload:false

                                        }

                                    ]
                                }
                            ]
                        }}>
                        </AppButton>
{/*                        <AppButton config={{
                                id: "saveTeamCreateBtn",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                {
                                    event: "saveTeamCreateBtn.click",
                                    pubs:[
                                        {
                                            event: "saveTeamModifyBtn.click"
                                        }
                                    ]
                                }

                            ]
                            }}>
                        </AppButton>
                        <AppButton config={{
                                id: "cancelTeamCreateBtn",
                                title: "返回",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cancelTeamCreateBtn.click",
                                        pubs: [
                                            {
                                                event: "modifyTeamBtn.visible",
                                                payload: true
                                            },

                                            {
                                                event: "deleteTeamBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event: "createTeamBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event: "saveTeamCreateBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancelTeamCreateBtn.visible",
                                                payload: false
                                            }
                                        ]
                                    }
                                ]
                            }}>
                         </AppButton>*/}
                        <AppButton config={{
                                id: "saveTeamModifyBtn",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "saveTeamModifyBtn.click",
                                        pubs: [
                                            {
                                                event: 'saveTeamModifyBtn.expression',
                                                meta: {
                                                    expression: `
                          resolveFetch({fetch:{id:'TeamInfoPage',data:'@@formValues'}}).then(function(data3){

                            let params =data3.teamInfo
                           /* resolveFetch({fetch:{id:"teamTable",data:"dataContext"}}).then(function (value) {
                                           console.log(data3.teamInfo)
                                if(value && value!=''&& value.nodeGid){
                                   let departmentGid = value.nodeGid
                                   console.log( value.nodeGid)
                                    for(var i=0;i<data3.teamInfo.length;i++){
                                        console.log(params.gid);
                                        params[i].departmentGid = departmentGid
                                    }
                                }*/

                                console.log("params",params)
                                let dataSource= {
                                type: 'api',
                                method: 'post',
                                mode:"payload",
                                url: '/ime/mdTeamInfo/saveTeamInfoList.action',
                                payload: params
                              };
                              if(submitValidateForm("TeamInfoPage")){

                              }else{
                                 resolveDataSourceCallback({dataSource:dataSource},function(response){
                                      if(response.success) {
                                        pubsub.publish("@@message.success","保存成功");
                                        pubsub.publish("cleanTeamTableBtn.click");
                                        pubsub.publish("cancelTeamModifyBtn.click");
                                      } else {
                                        pubsub.publish("@@message.error","保存失败");
                                        pubsub.publish("cancelTeamModifyBtn.click");
                                      }

                                    })
                              }
                         /* })*/
                            })
                      `
                                                }
                                            }

                                        ]
                                    }


                                ]
                            }}>
                        </AppButton>
                        <AppButton config={{
                                id: "cancelTeamModifyBtn",
                                title: "返回",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cancelTeamModifyBtn.click",
                                        pubs: [

                                            {
                                                event: "cleanButtonBtn.click"
                                            }
                                            ,{
                                                event:"cleanTeamTableBtn.click"
                                            }
                                            ,
                                            {
                                                event:"cleanPersonTableBtn.click"
                                            }

                                        ]
                                    }
                                ]
                            }}>
                        </AppButton>
                    </Col>
                    </Row>
                </Card>
                <Row>
                    <Col span={ 7 }>
                        <Card bordered={true} style={{ width: "100%", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                            <Row>
                                <Col span={4}/>
                               {/* <Col span={16}>
                                    <Field config={{//业务单元选框
                                        enabled: true,
                                        id: "busiUnitTeamForm",
                                        form:"testForm",
                                        //showRequiredStar: true,  //是否显示必填星号
                                        labelSpan: 24,   //标签栅格比例（0-24）
                                        wrapperSpan: 24,  //输入框栅格比例（0-24）
                                        // formMode:'edit',
                                        dataSource: {
                                            type: 'api',
                                            method: 'POST',
                                            url: '/api/findback.json',
                                            payloadMapping:[{
                                                from:"eventPayload",
                                                to:"id"
                                            }]
                                        },
                                        tableInfo: {
                                            id:"tableId555",
                                            size:"small",
                                            rowKey:"gid",
                                            tableTitle:"人员信息",
                                            showSerial:true,  //序号
                                            columns:[
                                                {title: 'Full Name', width: 100, dataIndex: 'name', key: '1'},
                                                {title: 'Age', width: 100, dataIndex: 'age', key: '2'},
                                                {title: 'Column 1', dataIndex: 'address', key: '3', width: 150},
                                                {title: 'Column 2', dataIndex: 'address', key: '4', width: 150},
                                                {title: 'Column 3', dataIndex: 'address', key: '5', width: 150},
                                                {title: 'Column 4', dataIndex: 'address', key: '6', width: 150},
                                                {title: 'Column 5', dataIndex: 'address', key: '7', width: 150},
                                                {title: 'Column 6', dataIndex: 'address', key: '8', width: 150},
                                                {title: 'Column 7', dataIndex: 'address', key: '9', width: 150},
                                                {title: 'Column 8', dataIndex: 'address', key: '10', width: 150}
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/api/table.json',
                                                payload: {name: "ewueiwue"}
                                            }
                                        },
                                        pageId:'findBack66ooo56565656',
                                        displayField: "address",
                                        valueField: {
                                            "from": "gid",
                                            "to": "findBack"
                                        },
                                        associatedFields: [
                                            {
                                                "from": "name",
                                                "to": "name"
                                            },
                                            {
                                                "from": "age",
                                                "to": "age1"
                                            }
                                        ]
                                    }} name="findback" component={FindbackField}/>
                                </Col>*/}
                                {/*<Col span={16}>
                                    <Field config={{
                                        enabled: true,
                                        id: "busiUnit",
                                        form: "TeamInfoPage",
                                        label: "业务单元",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请选择业务单元",
                                        tableInfo: {
                                            id: "busiUnitFindBackTable",
                                            size: "small",
                                            rowKey: "gid",
                                            width: 300,
                                            tableTitle: "业务单元",
                                            columns: [
                                                {title: '业务单元名称', dataIndex: 'busiUnitName', key: '2', width: 200},
                                                {title: '业务单元编码', dataIndex: 'busiUnitCode', key: '1', width: 200}
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/sm/busiUnit/query.action',
                                            }
                                        },
                                        pageId: 'busiUnitFindBackTablePage',
                                        displayField: "busiUnitName",
                                        valueField: {
                                            "from": "gid",
                                            "to": "busiUnit"
                                        },
                                        subscribes: [
                                            {
                                                event: 'busiUnit.onChange',
                                                pubs: [{
                                                    event: "busiUnit.expression",
                                                    meta: {
                                                        expression: `
                                                    //console.log(me)
                                                    if (me.selectedRows) {
                                                        //console.log("业务单元已选择");
                                                        let busiUnitGid = me.selectedRows.gid;

                                                        let dataSource = {
                                                          type: "api",
                                                          mode:"dataContext",
                                                          method: "POST",
                                                          url: "/sm/department/queryTree.action?busiUnitGid=" + busiUnitGid
                                                        };

                                                        let onSuccess = function(response){
                                                            if(response.success){
                                                                //pubsub.publish("@@message.success","操作成功");
                                                                //console.log(response.data);
                                                                pubsub.publish("departmentAndTeamTree.setTreeData",response.data);
                                                                pubsub.publish("cleanButtonBtn.click");
                                                                pubsub.publish("@@form.init",{id:"TeamInfoPage",data:{}});
                                                            }else{
                                                                console.log("业务单元未选择");
                                                                pubsub.publish("@@message.error",response.data);
                                                            }
                                                        }

                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},onSuccess);


                                                    }else{
                                                        console.log("业务单元未选择");
                                                    }

                                                    `
                                                    }

                                                }]

                                            }
                                        ]

                                    }} component={FindbackField} name="busiUnit"/>
                                </Col>*/}
                                <Col span={16}>
                                    <Field config={{
                                        enabled: true,
                                        id: "busiUnit",
                                        form: "DepartmentForm",
                                        label: "业务单元",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请选择业务单元",
                                        treeCheckStrictly: true, //是否节点选择完全受控
                                        treeCheckable: false,  //是否显示CheckBox(多选)
                                        showSearch: true,  //是否在下拉中显示搜索框(单选)
                                        dropdownMatchSelectWidth: true,  //下拉菜单和选择器是否同宽
                                        displayField: "text",
                                        valueField: "id",
                                        dataSource: {
                                            type: "api",
                                            method: "POST",
                                            url: '/sm/busiUnit/queryExecUnitTree.action'
                                        },

                                        subscribes: [
                                            {
                                                event: 'busiUnit.onChange',
                                                pubs: [{
                                                    event: "busiUnit.expression",
                                                    meta: {
                                                        expression: `
                                                        //console.log(data);
                                                      //console.log(data.eventPayload)
                                                    if (data.eventPayload&&data.eventPayload!='0') {
                                                        //console.log("业务单元已选择");
                                                        let busiUnitGid = data.eventPayload;

                                                        let dataSource = {
                                                          type: "api",
                                                          mode:"dataContext",
                                                          method: "POST",
                                                          url: "/sm/department/queryTree.action?busiUnitGid=" + busiUnitGid
                                                        };

                                                        let onSuccess = function(response){
                                                            if(response.success){
                                                                //pubsub.publish("@@message.success","操作成功");
                                                                //console.log(response.data);
                                                                //pubsub.publish("@@form.init",{id:"TeamInfoPage",data:{}});
                                                                pubsub.publish("departmentAndTeamTree.setTreeData",response.data);
                                                                pubsub.publish("cleanButtonBtn.click");
                                                                pubsub.publish("busiUnit.dataContext",{eventPayload:busiUnitGid});
                                                                pubsub.publish("teamTable.dataContext",{eventPayload:{}});
                                                                 resolveFetch({fetch:{id:"TeamInfoPage",data:"@@formValues"}}).then(function (value) {
                                                                     //console.log("业务单元更改!!");
                                                                     //console.log(value);
                                                                     value.teamInfo = [];
                                                                     value.teamPerson = [];
                                                                     pubsub.publish("@@form.init", {id: "TeamInfoPage", data: value});
                                                                 })


                                                            }else{
                                                                console.log("业务单元未选择");
                                                                pubsub.publish("@@message.error",response.data);
                                                            }
                                                        }

                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},onSuccess);


                                                    }else{
                                                        console.log("业务单元未选择");
                                                    }

                                                    `
                                                    }

                                                }]

                                            }
                                        ]
                                    }} name="busiUnit" component={TreeSelectField}/>
                                </Col>
                                <Col span={4}/>

                            </Row>
                            <Row>
                                <Col>
                                    <Field config={{
                                        id: 'departmentAndTeamTree', //组件id //busiGroupTree001
                                        search: false,
                                        enabled: true,
                                        visible: true,
                                        // defaultExpandedKeys: ['0-0-0', '0-0-1'],
                                        // defaultSelectedKeys: ['0-0-0', '0-0-1'],
                                        // defaultCheckedKeys: ['0-0-0', '0-0-1'],
                                        checkable: false, //复选框
                                        showLine: false,
                                        draggable: false, //是否可以拖拽
                                        searchBoxWidth: 300,
                                        dataSource: {
                                            type: "api",
                                            method: "POST",
                                            url: '/sm/department/queryTree.action?busiUnitGid=12345678900!!00'
                                        }

                                    }} name="departmentAndTeamTree"  component={ TreeField } />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={16} >
                        <Card bordered={true} >
                            <Row>
                              {/*  <Card bordered={true} >
                                    <AppTable name="teamTable" config={{
                                    "id": "teamTable",
                                    "name": "teamTable",
                                    "type": "radio",//表格单选复选类型 复选:checkbox   单选:radio
                                    "size": "default",//表格尺寸
                                    "rowKey": "gid",//主键
                                    "onLoadData": false,//初始化是否加载数据
                                    //"tableTitle": "",//表头信息
                                    "width": 1500,//表格宽度
                                    "showSerial": true,//是否显示序号
                                    "editType": true,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 5,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": true,//是否显示模糊查询
                                    "columns": [
                                        { title: '班组编码', width: 100, dataIndex: 'code', key: '1' },
                                        { title: '班组名称', width: 100, dataIndex: 'name', key: '2' },
                                        { title: '所属部门', width: 150, dataIndex: 'departmentGidRef.name', key: '3' },
                                        { title: '备注', dataIndex: 'description', key: '4', width: 150 }

                                    ],
                                    rowOperationItem: [
                                        {
                                            id: "deleteTeamRow",//deleteTeamRow  23456789009865
                                            type: "linkButton",
                                            title: "删除",
                                            subscribes: [
                                                {
                                                    event: "deleteTeamRow.click",
                                                    behaviors: [
                                                        {
                                                            type: "request",
                                                            dataSource: {
                                                                type: "api",
                                                                method: "POST",
                                                                paramsInQueryString: false,//参数拼在url后面
                                                                url: "/ime/mdTeamInfo/deleteByList.action",
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
                                                                    event: "teamTable.loadData",
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
                                        event:'departmentAndTeamTree.onSelect',

                                        pubs: [
                                            {

                                                event: "teamTable.expression",//在某个组件上执行表达式
                                                meta: {
                                                    expression: `


                                console.log("happy");
                                //console.log(data);
                                let nodeGid = data.eventPayload.selectedKeys["0"];
                                console.log(data.eventPayload);
                                if("0"!=nodeGid){
                                    var query =[{
                                    "field":"departmentGid",
                                    "type":"eq",
                                    "value":nodeGid,
                                    "operator":"and"
                                    }];
                                var params = {
                                  "query":{
                                    "query":query
                                  }
                                };
                                console.log(query,params);
                                let dataSource= {
                                  type: "api",
                                  mode:"dataContext",
                                  method: "POST",
                                  url: "/ime/mdTeamInfo/query.action"
                                };
                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},
                                  function(res){
                                  //console.log(res);
                                    me.setState({dataSource:res.data});
                                  }
                                )
                                } `
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        event:'departmentAndTeamTree.onSelect',
                                        pubs: [
                                            {
                                                event: "createTeamBtn.enabled",
                                                payload:true
                                            }
                                        ]
                                    }
                                ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        pager:true,
                                        url: '/ime/mdTeamInfo/query.action'
                                    }
                                }} />
                                </Card>*/}
                                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                                    <Tabs defaultActiveKey="1">
                                        <TabPane tab="" key="1">
                                            <Row>
                                                <Col span={24}>
                                                    <FieldArray name="teamInfo" config={
                                                        {
                                                        "id": "teamTable",
                                                        "name": "teamTable",
                                                        "form":"TeamInfoPage",
                                                        "rowKey": "gid",
                                                        "addButton":false,
                                                        "showSelect":true,
                                                        "unEditable":false,
                                                        "type":"radio",
                                                        "columns": [
                                                             {
                                                                "id": "teamCode",
                                                                "type": "textField",
                                                                "title": "班组编码",
                                                                "name": "code"
                                                            }, {
                                                                "id": "teamName",
                                                                "type": "textField",
                                                                "title": "班组名称",
                                                                "name": "name"
                                                            },
                                                            /*{
                                                                "id": "departmentGid",
                                                                "type": "textField",
                                                                "title": "所属部门",
                                                                "enabled":false,
                                                                "name": "departmentGidRef.name"
                                                            }*/
                                                            {
                                                                id: "departmentGid",
                                                                type: "findbackField",
                                                                title: "所属部门",
                                                                form: "TeamInfoPage",
                                                                name: "departmentGidRef.name",

                                                                tableInfo: {
                                                                    id: "departmentTable",
                                                                    size: "small",
                                                                    rowKey: "gid",
                                                                    width: "500",
                                                                    tableTitle: "部门",
                                                                    showSerial: true,  //序号
                                                                    columns: [
                                                                        { title: '部门编码', width: 100, dataIndex: 'code', key: '1' },
                                                                        { title: '部门名称', width: 150, dataIndex: 'name', key: '2' },
                                                                        { title: '业务单元', dataIndex: 'smBusiUnitGidRef.busiUnitName', key: '3', width: 150 },
                                                                        { title: '上级部门', dataIndex: 'smDepartmentGidRef.name', key: '4', width: 100 }
                                                                    ],
                                                                    /*dataSource: {
                                                                        type: 'api',
                                                                        method: 'post',
                                                                        url: '/sm/department/query.action'
                                                                    }*/
                                                                    dataSource: {
                                                                        type: 'api',
                                                                        method: 'post',
                                                                        url: '/sm/department/query.action',
                                                                        bodyExpression:`
                                                 resolveFetch({fetch:{id:'busiUnit',data:'dataContext'}}).then(function(busiUnitValue){
                                                        console.log(busiUnitValue);
                                                        if(busiUnitValue && busiUnitValue!=''){
                                                            callback({
                                                                query:{
                                                                    query:[
                                                                    {
                                                                        left:"(",
                                                                        field:"smBusiUnitGid",
                                                                        type:"eq",
                                                                        value:busiUnitValue,
                                                                        right:")",
                                                                        operator:"and"
                                                                    }]
                                                                }
                                                            });
                                                        }else {
                                                            callback({
                                                                /*query:{
                                                                    query:[
                                                                    {
                                                                        left:"(",
                                                                        field:"gid",
                                                                        type:"eq",
                                                                        value:'123456789021!!001',
                                                                        right:")",
                                                                        operator:"and"
                                                                    }]
                                                                }*/
                                                            });
                                                        }

                                                })

                                                `
                                                                    }
                                                                },
                                                                pageId: 'Idontknowthisiswhat',
                                                                //displayField: "personnelCode",
                                                                valueField: {
                                                                    "from": "name",
                                                                    "to": "departmentGidRef.name"
                                                                },
                                                                associatedFields: [
                                                                    {
                                                                        "from": "personnelName",
                                                                        "to": "personnelGidRef.personnelName"
                                                                    }, {
                                                                        "from": "smPersonnelTypePostGidRef.personnelTypeName",
                                                                        "to": "personnelGidRef.smPersonnelTypePostGidRef.personnelTypeName"
                                                                    }, {
                                                                        "from": "smPersonnelTypeLevelGidRef.personnelTypeName",
                                                                        "to": "personnelGidRef.smPersonnelTypeLevelGidRef.personnelTypeName"
                                                                    }, {
                                                                        "from": "smBusiUnitGidRef.busiUnitName",
                                                                        "to": "personnelGidRef.smBusiUnitGidRef.busiUnitName"
                                                                    }, {
                                                                        "from": "smDepartmentGidRef.name",
                                                                        "to": "personnelGidRef.smDepartmentGidRef.name"
                                                                    }, {
                                                                        "from": "gid",
                                                                        "to": "personnelGid"
                                                                    }
                                                                ]
                                                            }
                                                            , {
                                                                "id": "departmentName",
                                                                "type": "textField",
                                                                "title": "备注",
                                                                "name": "description"
                                                            }
                                                        ],
                                                            subscribes:[
                                                                {
                                                                    event:'departmentAndTeamTree.onSelect',

                                                                    pubs: [

                                                                        {

                                                                            event: "teamTable.expression",//在某个组件上执行表达式
                                                                            meta: {
                                                                                expression: `
                                                                                //console.log("happy");
                                                                                //console.log(data);
                                                                                //console.log(data.eventPayload);
                                                                                let nodeGid = data.eventPayload.selectedKeys["0"];

                                                                                //console.log(data.eventPayload);
                                                                                if("0"!=nodeGid){
                                                                                    var query =[{
                                                                                    "field":"departmentGid",
                                                                                    "type":"eq",
                                                                                    "value":nodeGid,
                                                                                    "operator":"and"
                                                                                    }];
                                                                                var params = {
                                                                                  "query":{
                                                                                    "query":query
                                                                                  }
                                                                                };
                                                                                //console.log(query,params);
                                                                                let dataSource= {
                                                                                  type: "api",
                                                                                  mode:"dataContext",
                                                                                  method: "POST",
                                                                                  url: "/ime/mdTeamInfo/query.action"

                                                                                };
                                                                               /* resolveFetch({fetch:{id:"TeamInfoPage",data:"@@formValues"}}).then(function (value) {
                                                                                    console.log("value"+value);
                                                                                    if(typeof(value)!="undefined"){

                                                                                    }
                                                                                 })*/
                                                                                let nodeName = data.eventPayload.info.selectedNodes["0"].props["data-item"].text
                                                                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},function(res){
                                                                                     console.log(res);
                                                                                     resolveFetch({fetch:{id:"TeamInfoPage",data:"@@formValues"}}).then(function (value) {

                                                                                        if(typeof(value)!="undefined"){
                                                                                            var datas = value;
                                                                                        }else{
                                                                                            var datas = {};
                                                                                        }
                                                                                            datas["teamInfo"]=res.data;
                                                                                            datas["teamPerson"]=[];
                                                                                            pubsub.publish("@@form.init",{id:"TeamInfoPage",data:datas});
                                                                                            pubsub.publish("teamTable.dataContext",{eventPayload:{nodeGid:nodeGid,nodeName:nodeName}});//将部门gid放入到teamTable中
                                                                                            pubsub.publish("cleanButtonBtn.click");
                                                                                            pubsub.publish("cleanTeamTableBtn.click");
                                                                                       })
                                                                                  })

                                                                                }else{
                                                                                    pubsub.publish("teamTable.dataContext",{eventPayload:''});//点击根节点则放入''
                                                                                } `
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    event:'departmentAndTeamTree.onSelect',
                                                                    pubs: [
                                                                        {
                                                                            event: "createTeamBtn.enabled",
                                                                            payload:true
                                                                        }

                                                                    ]
                                                                }
                                                            ]

                                                    }
                                                    } component={TableField} />
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    </Tabs>
                                </Card>
                            </Row>
                            <Row style={{marginTop: "15px"}}>
                                <AppButton config={{
                                    id: "createPersonBtn",
                                    title: "增加",
                                    type: "primary",
                                    size: "large",
                                    visible: true,
                                    enabled: false,
                                    subscribes: [
                                        {
                                            event: "createPersonBtn.click",
                                            pubs: [
                                                {
                                                    event: "createTeamBtn.visible",
                                                    payload: false
                                                },
                                                {
                                                    event: "modifyTeamBtn.visible",
                                                    payload: false
                                                },
                                                {
                                                    event: "deleteTeamBtn.visible",
                                                    payload: false
                                                },
                                                {
                                                    event: "saveTeamModifyBtn.visible",
                                                    payload: true
                                                },
                                                {
                                                    event: "cancelTeamModifyBtn.visible",
                                                    payload: true
                                                },
                                                {
                                                    event:"savePersonBtn.visible",
                                                    payload:true
                                                },
                                                {
                                                    event:"cancelPersonBtn.visible",
                                                    payload:true
                                                }
                                                /*, {
                                                    event: "createPersonBtn.visible",
                                                    payload: false
                                                }*/,
                                                {
                                                    event: "modifyPersonBtn.visible",
                                                    payload: false
                                                },
                                                {
                                                    event: "deletePersonBtn.visible",
                                                    payload: false
                                                }
                                                ,
                                                {
                                                    event:"cancelPersonBtn.enabled",
                                                    payload:true
                                                }
                                                ,
                                                {
                                                    event: "teamPersonTable.addRow"
                                                }

                                            ]
                                        }
                                    ]
                                }}>
                                </AppButton>
                               {/* <AppButton config={{
                                    id: "modifyPersonBtn",
                                    title: "修改",
                                    type: "primary",
                                    size: "large",
                                    visible: true,
                                    enabled: false,
                                    subscribes: [
                                        {
                                            event: "modifyPersonBtn.click",
                                            pubs: [
                                                {
                                                    event: "createTeamBtn.visible",
                                                    payload: false
                                                },
                                                {
                                                    event: "modifyTeamBtn.visible",
                                                    payload: false
                                                },
                                                {
                                                    event: "deleteTeamBtn.visible",
                                                    payload: false
                                                },
                                                {
                                                    event: "saveTeamModifyBtn.visible",
                                                    payload: true
                                                },
                                                {
                                                    event: "cancelTeamModifyBtn.visible",
                                                    payload: true
                                                },
                                                {
                                                    event:"savePersonBtn.visible",
                                                    payload:true
                                                },
                                                {
                                                    event:"cancelPersonBtn.visible",
                                                    payload:true
                                                }
                                                , {
                                                    event: "createPersonBtn.visible",
                                                    payload: false
                                                },
                                                {
                                                    event: "modifyPersonBtn.visible",
                                                    payload: false
                                                },
                                                {
                                                    event: "deletePersonBtn.visible",
                                                    payload: false
                                                }


                                            ]
                                        }
                                    ]
                                }}>
                                </AppButton>*/}
                                <AppButton config={{
                                    id: "deletePersonBtn",
                                    title: "删除",
                                    type: "primary",
                                    size: "large",
                                    visible: true,
                                    enabled: false,
                                    subscribes: [

                                        {
                                            event: "deletePersonBtn.click",
                                            behaviors:[
                                                {
                                                    type:"fetch",
                                                    id:"teamPersonTable",
                                                    data:"selectedRows",
                                                    successPubs:[
                                                        {
                                                            event:"@@form.init",
                                                            eventPayloadExpression:`
                                                  console.log("eventPayload",eventPayload)
                                                  //console.log(eventPayload);
                                                  let params = [];
                                                  if(eventPayload && eventPayload.length && eventPayload.length>=0 && eventPayload[0].gid){
                                                        for(var i=0;i<eventPayload.length;i++){
                                                            //console.log(eventPayload[i].gid)
                                                            params.push(eventPayload[i].gid);
                                                        }
                                                  }
                                                        let dataSource= {
                                                              type: "api",
                                                              mode:"dataContext",
                                                              method: "POST",
                                                              url: "/ime/mdTeamPersonMapping/deleteTeamPersonByIds.action",

                                                            }
                                                        let onSuccess = function(res){
                                                                var datas ={};
                                                                pubsub.publish('@@message.success',"删除成功");
                                                                //pubsub.publish('teamPersonTable.activateAll',false);
                                                                //pubsub.publish('cleanPersonTableBtn.click');
                                                                pubsub.publish('cancelPersonBtn.click');

                                                            }
                                                        resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess);
                                                  `
                                                        }
                                                    ]
                                                }
                                            ],
                                        }
                                    ]
                                }}>
                                </AppButton>
                                <AppButton config={{
                                    id: "savePersonBtn",
                                    title: "保存",
                                    type: "primary",
                                    size: "large",
                                    visible: false,
                                    enabled: true,
                                    subscribes: [
                                        {
                                            event: "savePersonBtn.click",
                                            pubs: [
                                                {
                                                    event: "teamPersonTable.dataContext",
                                                },
                                                {
                                                    event: 'saveTeamModifyBtn.expression',
                                                    meta: {
                                                        expression: `
                          resolveFetch({fetch:{id:'TeamInfoPage',data:'@@formValues'}}).then(function(data3){


                            resolveFetch({fetch:{id:'deleteTeamBtn',data:'dataContext'}}).then(function(value){
                                let params = data3.teamPerson
                                console.log(params)
                               for(var i =0 ;i<params.length;i++){
                                    if(params[i].personnelGid && params[i].personnelGid!=''){
                                        params[i].mdTeamInfoGid = value
                                    }

                               }
                               console.log(params)

                                let dataSource= {
                                type: 'api',
                                method: 'post',
                                mode:"payload",
                                url: '/ime/mdTeamPersonMapping/saveTeamPersonList.action',
                                payload: params
                              };
                              /* if(submitValidateForm("TeamInfoPage")){
                              }else{}*/
                                resolveDataSourceCallback({dataSource:dataSource},function(response){
                                  if(response.success) {
                                    pubsub.publish("@@message.success","保存成功");
                                    pubsub.publish("cancelPersonBtn.click");

                                  } else {
                                    pubsub.publish("@@message.error","保存失败");

                                  }
                                })
                            })

                          })
                      `
                                                    }
                                                },
                                            ]
                                        }

                                    ]
                                }}>
                                </AppButton>
                                <AppButton config={{
                                    id: "cancelPersonBtn",
                                    title: "取消",
                                    type: "primary",
                                    size: "large",
                                    visible: false,
                                    enabled: true,
                                    subscribes: [
                                        {
                                            event: "cancelPersonBtn.click",
                                            pubs: [
                                                {
                                                    event:"cleanPersonTableBtn.click"
                                                },
                                                {
                                                    event: "modifyPersonBtn.visible",
                                                    payload: true
                                                },

                                                {
                                                    event: "deletePersonBtn.visible",
                                                    payload: true
                                                },
                                                {
                                                    event: "createPersonBtn.visible",
                                                    payload: true
                                                },
                                                {
                                                    event: "savePersonBtn.visible",
                                                    payload: false
                                                },

                                                {
                                                    event: "cancelPersonBtn.visible",
                                                    payload: false
                                                }
                                                ,
                                                {
                                                    event: "cancelPersonBtn.enabled",
                                                    payload: false
                                                }
                                            ]
                                        }

                                    ]
                                }}>
                                </AppButton>
                            </Row>
                            <Row>
                                {/*<Card bordered={true} >
                                    <AppTable name="teamPersonTable" config={{
                                    "id": "teamPersonTable",
                                    "name": "teamPersonTable",
                                    "type": "checkbox",//表格单选复选类型
                                    "size": "default",//表格尺寸
                                    "rowKey": "gid",//主键
                                    "onLoadData": false,//初始化是否加载数据
                                    "tableTitle": "班组人员",//表头信息
                                    "width": 1500,//表格宽度
                                    "showSerial": true,//是否显示序号
                                    "editType": true,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 5,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": true,//是否显示模糊查询
                                    "columns": [
                                        { title: '人员编号', width: 100, dataIndex: 'personnelGidRef.personnelCode', key: '1' },
                                        { title: '人员姓名', width: 100, dataIndex: 'personnelGidRef.personnelName', key: '2' },
                                        { title: '人员工种', width: 150, dataIndex: 'personnelGidRef.smPersonnelTypePostGidRef.personnelTypeName', key: '3' },
                                        { title: '人员职级', dataIndex: 'personnelGidRef.smPersonnelTypeLevelGidRef.personnelTypeName', key: '4', width: 150 },
                                        { title: '业务单元', dataIndex: 'personnelGidRef.smBusiUnitGidRef.busiUnitName', key: '5', width: 100 },
                                        { title: '部门', dataIndex: 'personnelGidRef.smDepartmentGidRef.code', key: '6', width: 100 }

                                    ],
                                    subscribes:[
                                            {
                                                event:'teamTable.onSelectedRows',

                                                pubs: [
                                                    {

                                                        event: "teamPersonTable.expression",//在某个组件上执行表达式
                                                        meta: {
                                                            expression: `
                                console.log("happy");
                                //console.log(data);
                                console.log(data.eventPayload);
                                let selectGid = data.eventPayload["0"].gid;
                                if(typeof(selectGid)!="undefined"){
                                    var query =[{
                                    "field":"mdTeamInfoGid",
                                    "type":"eq",
                                    "value":selectGid,
                                    "operator":"and"
                                    }];
                                    var params = {
                                        "query":{
                                         "query":query
                                  }
                                    };
                                    console.log(params);
                                let dataSource= {
                                  type: "api",
                                  mode:"dataContext",
                                  method: "POST",
                                  url: "/ime/mdTeamPersonMapping/query.action"
                                };
                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},
                                  function(res){
                                  console.log(res);
                                    me.setState({dataSource:res.data});
                                  }
                                ) }`
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                event:'departmentAndTeamTree.onSelect',
                                                pubs: [
                                                    {
                                                        event: "createTeamBtn.enabled",
                                                        payload:true
                                                    }
                                                ]
                                            }
                                        ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        pager:true,
                                        url: '/ime/mdTeamPersonMapping/query.action'
                                    }
                                }} />
                                </Card>*/}
                                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                                    <Tabs defaultActiveKey="1">
                                        <TabPane tab="" key="1">
                                            <Row>
                                                <Col span={24}>
                                                    <FieldArray name="teamPerson" config={
                                                        {
                                                            "id": "teamPersonTable",
                                                            "name": "teamPersonTable",
                                                            "form":"TeamInfoPage",
                                                            "rowKey": "gid",
                                                            "addButton":false,
                                                            "showSelect":true,
                                                            "unEditable":false,
                                                            "type":"checkbox",//checkbox
                                                            "columns": [
                                                                {
                                                                    id: "personCode",
                                                                    type: "findbackField",
                                                                    title: "人员编号",
                                                                    form: "TeamInfoPage",
                                                                    name: "personnelGidRef.personnelCode",

                                                                    tableInfo: {
                                                                        id: "personModelTable",
                                                                        size: "small",
                                                                        rowKey: "gid",
                                                                        width: "500",
                                                                        tableTitle: "人员",
                                                                        showSerial: true,  //序号
                                                                        columns: [
                                                                            { title: '人员编号', width: 100, dataIndex: 'personnelCode', key: '1' },
                                                                            { title: '人员姓名', width: 150, dataIndex: 'personnelName', key: '2' },
                                                                            { title: '人员工种', dataIndex: 'smPersonnelTypePostGidRef.personnelTypeName', key: '3', width: 150 },
                                                                            { title: '人员职级', dataIndex: 'smPersonnelTypeLevelGidRef.personnelTypeName', key: '4', width: 100 },
                                                                            { title: '业务单元', dataIndex: 'smBusiUnitGidRef.busiUnitName', key: '5', width: 100 },
                                                                            { title: '所属部门', dataIndex: 'smDepartmentGidRef.name', key: '6', width: 100 },

                                                                        ],
                                                                        dataSource: {
                                                                            type: 'api',
                                                                            method: 'post',
                                                                            url: '/sm/personnel/query.action',
                                                                            bodyExpression:`
                                                                                resolveFetch({fetch:{id:"TeamInfoPage",data:"@@formValues"}}).then(function (data) {
                                                                                    console.log(data);
                                                                                    if(data && data.teamPerson && data.teamPerson.length>=0){
                                                                                        let personGids = '';
                                                                                        for(var i =0;i<data.teamPerson.length;i++){
                                                                                            if(data.teamPerson[i].personnelGid){
                                                                                                personGids += data.teamPerson[i].personnelGid+","

                                                                                            }
                                                                                        }
                                                                                        if(personGids!=''){
                                                                                           callback({
                                                                                                query:{
                                                                                                    query:[
                                                                                                    {
                                                                                                        left:"(",
                                                                                                        field:"gid",
                                                                                                        type:"noin",
                                                                                                        value:personGids.substring(0, personGids.lastIndexOf(",")),
                                                                                                        right:")",
                                                                                                        operator:"and"
                                                                                                    }
                                                                                                    ]
                                                                                                 }
                                                                                            });
                                                                                        }else{
                                                                                            callback({});
                                                                                        }

                                                                                    }
                                                                                  })
                                                                            `

                                                                        }
                                                                    },
                                                                    pageId: 'Idontknowthisiswhat',
                                                                    //displayField: "personnelCode",
                                                                    valueField: {
                                                                        "from": "personnelCode",
                                                                        "to": "personnelGidRef.personnelCode"
                                                                    },
                                                                    associatedFields: [
                                                                        {
                                                                            "from": "personnelName",
                                                                            "to": "personnelGidRef.personnelName"
                                                                        }, {
                                                                            "from": "smPersonnelTypePostGidRef.personnelTypeName",
                                                                            "to": "personnelGidRef.smPersonnelTypePostGidRef.personnelTypeName"
                                                                        }, {
                                                                            "from": "smPersonnelTypeLevelGidRef.personnelTypeName",
                                                                            "to": "personnelGidRef.smPersonnelTypeLevelGidRef.personnelTypeName"
                                                                        }, {
                                                                            "from": "smBusiUnitGidRef.busiUnitName",
                                                                            "to": "personnelGidRef.smBusiUnitGidRef.busiUnitName"
                                                                        }, {
                                                                            "from": "smDepartmentGidRef.name",
                                                                            "to": "personnelGidRef.smDepartmentGidRef.name"
                                                                        }, {
                                                                            "from": "gid",
                                                                            "to": "personnelGid"
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    "id": "personName",
                                                                    "type": "textField",
                                                                    "title": "人员姓名",
                                                                    "name": "personnelGidRef.personnelName",
                                                                    "enabled": false
                                                                }, {
                                                                    "id": "personTypeName",
                                                                    "type": "textField",
                                                                    "title": "人员工种",
                                                                    "name": "personnelGidRef.smPersonnelTypePostGidRef.personnelTypeName",
                                                                    "enabled": false
                                                                }, {
                                                                    "id": "personLeverName",
                                                                    "type": "textField",
                                                                    "title": "人员职级",
                                                                    "name": "personnelGidRef.smPersonnelTypeLevelGidRef.personnelTypeName",
                                                                    "enabled": false
                                                                }, {
                                                                    "id": "busiUnitName",
                                                                    "type": "textField",
                                                                    "title": "业务单元",
                                                                    "name": "personnelGidRef.smBusiUnitGidRef.busiUnitName",
                                                                    "enabled": false
                                                                }, {
                                                                    "id": "departmentName",
                                                                    "type": "textField",
                                                                    "title": "部门",
                                                                    "name": "personnelGidRef.smDepartmentGidRef.name",
                                                                    "enabled": false
                                                                }
                                                            ],
                                                            subscribes:[
                                                                {
                                                                    event:'teamTable.onSelectedRows',
                                                                    behaviors:[
                                                                        {
                                                                            type:"fetch",
                                                                            id: "teamTable", //要从哪个组件获取数据
                                                                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                                            successPubs: [  //获取数据完成后要发送的事件
                                                                                {
                                                                                    event:"@@form.init",
                                                                                    eventPayloadExpression:`
                                                                                    console.log("班组table的点击事件");
                                                                                        console.log(eventPayload);
                                                                                        var params={};
                                                                                        if(eventPayload.gid!=undefined){
                                                                                            let selectGid = eventPayload.gid;
                                                                                            //console.log("selectGid");
                                                                                            console.log(selectGid);
                                                                                             pubsub.publish("deleteTeamBtn.dataContext",{eventPayload:selectGid});
                                                                                             pubsub.publish("createPersonBtn.enabled",true);
                                                                                            var query =[{
                                                                                            "field":"mdTeamInfoGid",
                                                                                            "type":"eq",
                                                                                            "value":selectGid,
                                                                                            "operator":"and"
                                                                                            }];
                                                                                             params = {
                                                                                                "query":{
                                                                                                 "query":query
                                                                                                }
                                                                                             }
                                                                                        }else{
                                                                                            pubsub.publish("createPersonBtn.enabled",false);
                                                                                            pubsub.publish("deletePersonBtn.enabled",false);
                                                                                            var query =[{
                                                                                            "field":"gid",
                                                                                            "type":"eq",
                                                                                            "value":"1234567890!!221",
                                                                                            "operator":"and"
                                                                                            }];
                                                                                             params = {
                                                                                                "query":{
                                                                                                 "query":query
                                                                                                }
                                                                                             }
                                                                                        }
                                                                                        let dataSource ={
                                                                                          type: "api",
                                                                                          mode:"dataContext",
                                                                                          method: "POST",
                                                                                          url: "/ime/mdTeamPersonMapping/query.action"
                                                                                        }
                                                                                        let onSuccess = function(res){
                                                                                              if(res.success){
                                                                                               resolveFetch({fetch:{id:"TeamInfoPage",data:"@@formValues"}}).then(function (value) {
                                                                                                if(typeof(value)!="undefined"){
                                                                                                    var datas = value;
                                                                                                }else{
                                                                                                    var datas={}
                                                                                                }
                                                                                              datas["teamPerson"]=res.data;
                                                                                              callback({id:"TeamInfoPage",data:datas});});
                                                                                              }
                                                                                        }
                                                                                        resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess);
                                                                                    `
                                                                                }
                                                                            ]
                                                                        }
                                                                ]
                                                                    /*pubs: [
                                                                        {
                                                                            event: "teamPersonTable.expression",//在某个组件上执行表达式
                                                                            meta: {
                                                                                expression: `


                                console.log("sorrow");
                                //console.log("data:"data);
                                //console.log("dataContext:"dataContext);
                                pubsub.publish('${this.teamTable}.onSelectedRows',value){
                                    console.log(value)
                                }
                                let selectGid = data.eventPayload["0"].gid;
                                if(typeof(selectGid)!="undefined"){
                                    var query =[{
                                    "field":"mdTeamInfoGid",
                                    "type":"eq",
                                    "value":selectGid,
                                    "operator":"and"
                                    }];
                                    var params = {
                                        "query":{
                                         "query":query
                                  }
                                    };
                                let dataSource= {
                                  type: "api",
                                  mode:"dataContext",
                                  method: "POST",
                                  url: "/ime/mdTeamPersonMapping/query.action"
                                };
                                 let onSuccess = function(res){
                                  console.log(res);
                                  resolveFetch({fetch:{id:"TeamInfoPage",data:"@@formValues"}}).then(function (value) {
                                    if(typeof(value)!="undefined"){
                                        var datas = value;
                                    }else{
                                        var datas={}
                                    }
                                        datas["teamPerson"]=res.data;
                                        pubsub.publish("@@form.init",{id:"TeamInfoPage",data:datas});
                                   })


                                 }

                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess);
                                } `
                                                                            }
                                                                        }
                                                                    ]*/
                                                                },
                                                                {
                                                                    event:'teamPersonTable.onSelectedRows',
                                                                    behaviors:[
                                                                        {
                                                                            type:"fetch",
                                                                            id: "teamPersonTable", //要从哪个组件获取数据
                                                                            data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                                            successPubs: [  //获取数据完成后要发送的事件
                                                                                {
                                                                                    event:"@@form.init",
                                                                                    eventPayloadExpression:`
                                                                                        console.log(eventPayload);
                                                                                        //var params={};
                                                                                        if(eventPayload && eventPayload.length && eventPayload.length>0){
                                                                                            //let selectGid = eventPayload.gid;
                                                                                            //console.log("selectGid");
                                                                                            //console.log(selectGid);
                                                                                               resolveFetch({fetch:{id:'deleteTeamBtn',data:'dataContext'}}).then(function(value){
                                                                                                    //console.log("TeamGid");
                                                                                                    //console.log(value);
                                                                                                    //console.log(value.replace(/(^\\s*)/g,""));
                                                                                                    //console.log(value.replace(/(^\\s*)/g,"")!='');
                                                                                                    if(value && value!='' && value.replace(/(^\\s*)/g,"")!=''){
                                                                                                        pubsub.publish("deletePersonBtn.enabled",true);
                                                                                                    }else{
                                                                                                        pubsub.publish("deletePersonBtn.enabled",false);
                                                                                                    }

                                                                                               })
                                                                                             //pubsub.publish("deletePersonBtn.enabled",true);
                                                                                             //pubsub.publish("deletePersonBtn.dataContext",{eventPayload:eventPayload});
                                                                                        }else{
                                                                                            pubsub.publish("deletePersonBtn.enabled",false);
                                                                                        }
                                                                                    `
                                                                                }

                                                                            ]
                                                                        }
                                                                    ]
                                                                    /*pubs: [
                                                                        {
                                                                            event: "teamPersonTable.expression",//在某个组件上执行表达式
                                                                            meta: {
                                                                                expression: `


                                console.log("sorrow");
                                //console.log("data:"data);
                                //console.log("dataContext:"dataContext);
                                pubsub.publish('${this.teamTable}.onSelectedRows',value){
                                    console.log(value)
                                }
                                let selectGid = data.eventPayload["0"].gid;
                                if(typeof(selectGid)!="undefined"){
                                    var query =[{
                                    "field":"mdTeamInfoGid",
                                    "type":"eq",
                                    "value":selectGid,
                                    "operator":"and"
                                    }];
                                    var params = {
                                        "query":{
                                         "query":query
                                  }
                                    };
                                let dataSource= {
                                  type: "api",
                                  mode:"dataContext",
                                  method: "POST",
                                  url: "/ime/mdTeamPersonMapping/query.action"
                                };
                                 let onSuccess = function(res){
                                  console.log(res);
                                  resolveFetch({fetch:{id:"TeamInfoPage",data:"@@formValues"}}).then(function (value) {
                                    if(typeof(value)!="undefined"){
                                        var datas = value;
                                    }else{
                                        var datas={}
                                    }
                                        datas["teamPerson"]=res.data;
                                        pubsub.publish("@@form.init",{id:"TeamInfoPage",data:datas});
                                   })


                                 }

                                resolveDataSourceCallback({dataSource:dataSource,dataContext:params},onSuccess);
                                } `
                                                                            }
                                                                        }
                                                                    ]*/
                                                                }
                                                            ]

                                                        }
                                                    } component={TableField} />
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    </Tabs>
                                </Card>
                            </Row>
                        </Card>
                    </Col>
                </Row>

            </div>
        );
    }
}

/*
export default reduxForm({
    form: "TeamInfoPage",
    validate,
})(TeamInfoPage)
*/

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

let teamInfoPage = reduxForm({
    form: "TeamInfoPage",
    validate/*,
    asyncValidate*/
})(TeamInfoPage)

export default connect(mapStateToProps, mapDispatchToProps)(teamInfoPage);
