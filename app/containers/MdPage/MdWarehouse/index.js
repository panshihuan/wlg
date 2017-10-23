/*
 *
 * MdWarehouse
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import { Link } from 'react-router';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'
import AppTable from '../../../components/AppTable';
import DropdownButton from '../../../components/DropdownButton';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer'
import TreeField from '../../../components/Form/TreeField';
import AutoCompleteField from '../../../components/Form/AutoCompleteField';
import SelectField from 'components/Form/SelectField'
import TextField from 'components/Form/TextField'
import DateField from 'components/Form/DateField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import TextAreaField from 'components/Form/TextAreaField'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'
import TreeSelectField from 'components/Form/TreeSelectField';

const validate = values => {
    const errors = {}
    if (!values.get('warehouseName')) {
        errors.warehouseName = '必填项'
    }
    if (!values.get('warehouseCode')) {
        errors.warehouseCode = '必填项'
    }
    return errors
}
const asyncValidate = values => {
    let dataSource = {
        mode: "dataContext",
        type: "api",
        method: "POST",
        url: "/sm/checkUnique/check.action",
    }
    let className = "com.neusoft.ime.md.mdWarehouse.dto.MdWarehouseDTO"
    let fieldNames = "warehouseCode,delete";
    let fieldValues = values.get('warehouseCode') + ",0";
    return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:"",  className:className,fieldNames:fieldNames,fieldValues,fieldValues} }).then(function (res) {
        resolve(res)
    })).then(function (res) {
        if(!res.data){
            throw { warehouseCode: "该编码已存在,请重新填写" }
        }
    })
}
export class MdWarehouse extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>仓库</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={8} xs={24}>
                            <AppButton config={{
                                id: "wh00000001",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {

                                        event: "wh00000001.click",
                                        pubs: [
                                            {
                                                event: "warehouseCode.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "warehouseName.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "warehouseType.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "parentWarehouseRefwarehouseName.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "smBusiUnitGidwarehouseName.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "isManager.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000001.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000002.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000004.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000005.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000001.expression",//在某个组件上执行表达式
                                                meta: {
                                                    expression: `
                                                        let val = ""
                                               pubsub.publish("@@form.change", { id: "MdWarehouse", name: "warehouseCode"
                                                 , value: val })
                                                  pubsub.publish("@@form.change", { id: "MdWarehouse", name: "warehouseName"
                                                 , value: val })
                                                  pubsub.publish("@@form.change", { id: "MdWarehouse", name: "warehouseType"
                                                 , value: val })
                                                  pubsub.publish("@@form.change", { id: "MdWarehouse", name: "isManager"
                                                 , value: val })
                          `
                                                }
                                            }

                                        ]

                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "wh00000002",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "wh00000002.click",
                                        pubs: [
                                            {
                                                event: "warehouseCode.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "warehouseName.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "warehouseType.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "parentWarehouseRefwarehouseName.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "smBusiUnitGidwarehouseName.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "isManager.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000001.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000002.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000005.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000006.visible",
                                                payload: true
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "wh00000003",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "wh00000003.click",
                                        pubs: [
                                            {
                                                event:"wh00000003.expression",
                                                meta: {
                                                    expression:`
                                                        console.log(me);
                                                        if(me.dataContext!=undefined){
                                                            let id = me.dataContext[0]||"";
                                                            console.log(id)
                                                             let dataSource= {
                                                                  type: "api",
                                                                  mode:"dataContext",
                                                                  method: "POST",
                                                                  paramsInQueryString:true,
                                                                  url: "/ime/mdWarehouse/delete.action?id="+id,
                                                                  }
                                                              let onSuccess = function(response){
                                                                        if(response.success){
                                                                            pubsub.publish("@@message.success","删除成功")
                                                                            pubsub.publish("wareHouseTree001.loadData");
                                                                            pubsub.publish("@@form.init", { id: "MdWarehouse", data: Immutable.fromJS("") })
                                                                        }else{
                                                                            pubsub.publish("@@message.error","删除失败");
                                                                        }
                                                                    }

                                                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:undefined},onSuccess);




                                                   }
                                            `
                                                }
                                            },

                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "wh00000004",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "wh00000004.click",
                                        pubs: [
                                            {
                                                event:"wh00000004.expression",
                                                meta: {
                                                    expression:`

                                                           resolveFetch({fetch:{id:"MdWarehouse",data:"@@formValues"}}).then(function (value) {
                                                                  let id = value.gid;
                                                                  let  formValue = value;
                                                                  let params = {}
                                                                  let dataSource= {
                                                                  type: "api",
                                                                  mode:"dataContext",
                                                                  method: "POST",
                                                                  url: "/ime/mdWarehouse/add.action"
                                                                };
                                                                resolveDataSourceCallback({dataSource:dataSource,eventPayload:formValue,dataContext:formValue},
                                                                  function(res){

                                                                        pubsub.publish('@@message.success',"新增成功")
                                                                         pubsub.publish('wareHouseTree001.loadData');
                                                                         pubsub.publish("@@form.init", { id: "MdWarehouse", data:{}})
                                                                  },
                                                                  function(){

                                                                  }
                                                                )
                                                          })
                                                    `
                                                  }
                                            }
                                            ,{
                                                event: "warehouseCode.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "warehouseName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "warehouseType.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "parentWarehouseRefwarehouseName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "smBusiUnitGidwarehouseName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "isManager.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000001.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000002.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000003.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000004.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000005.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000006.visible",
                                                payload: false
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "wh00000006",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "wh00000006.click",
                                        pubs: [
                                            {
                                                event:"wh00000006.expression",
                                                meta: {
                                                    expression:`

                                                          resolveFetch({fetch:{id:"MdWarehouse",data:"@@formValues"}}).then(function (value) {
                                                                  let id = value.gid
                                                                  let  formValue = value;

                                                                  let dataSource= {
                                                                  type: "api",
                                                                  mode:"dataContext",
                                                                  method: "POST",
                                                                  url: "/ime/mdWarehouse/modify.action?id=" + id,
                                                                };
                                                               let onSuccess = function(response){
                                                                        if(response.success){
                                                                            pubsub.publish("@@message.success","修改成功");
                                                                            pubsub.publish("wareHouseTree001.loadData",);
                                                                            pubsub.publish("@@form.init", { id: "MdWarehouse", data: {} })
                                                                        }else{
                                                                            pubsub.publish("@@message.error","修改失败");
                                                                        }
                                                                    }

                                                                    resolveDataSourceCallback({dataSource:dataSource,eventPayload:formValue,dataContext:formValue},onSuccess);

                                                          })

                                                    `
                                                }
                                            },
                                            {
                                                event: "warehouseCode.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "warehouseName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "warehouseType.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "parentWarehouseRefwarehouseName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "smBusiUnitGidwarehouseName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "isManager.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000001.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000002.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000003.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000004.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000005.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000006.visible",
                                                payload: false
                                            }
                                        ]
                                    }

                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "wh00000005",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "wh00000005.click",
                                        pubs: [
                                            {
                                                event: "warehouseCode.enabled",
                                            payload: false
                                            },
                                            {
                                                event: "warehouseName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "warehouseType.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "parentWarehouseRefwarehouseName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "smBusiUnitGidwarehouseName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "isManager.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000001.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000002.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000003.visible",
                                                payload: true
                                            },
                                            {
                                                event: "wh00000004.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000005.visible",
                                                payload: false
                                            },
                                            {
                                                event: "wh00000006.visible",
                                                payload: false
                                            },
                                            {
                                                event:"@@form.init",
                                                payload: {id: "MdWarehouse", data: {}}
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
                        <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                            <Row>
                                <Field config={{
                                    enabled: true,
                                    id: "busiUnit",
                                    form: "MdWarehouse",
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
                                        "to": "smBusiUnitGid"
                                    },
                                    subscribes: [
                                        {
                                            event: 'busiUnit.onChange',
                                            pubs: [{
                                                event: "busiUnit.expression",
                                                meta: {
                                                    expression: `
                                                    //console.log(dataContext,999999)
                                                    me.dataContext={smgid:data.eventPayload.gid,smbusiUnitName:data.eventPayload.busiUnitName}
                                                    if (me.selectedRows) {
                                                        //console.log("业务单元已选择");
                                                        let busiUnitGid = me.selectedRows.gid;

                                                        let dataSource = {
                                                          type: "api",
                                                          mode:"dataContext",
                                                          method: "POST",
                                                          url: "/ime/mdWarehouse/getWareHouseTree.action?busiGid=" + busiUnitGid
                                                        };

                                                        let onSuccess = function(response){
                                                            if(response.success){
                                                                //pubsub.publish("@@message.success","操作成功");
                                                                //console.log(response.data);
                                                                pubsub.publish("wareHouseTree001.setTreeData",response.data);

                                                            }else{
                                                                console.log("业务单元未选择");
                                                                pubsub.publish("@@message.error",response.data);
                                                            }

                                                        }
                                                        let dataContext2 = {gid:data.eventPayload.gid,busiUnitName:data.eventPayload.busiUnitName}
                                                        console.log("1111111111",dataContext2)
                                                        pubsub.publish("@@form.change",{id:"MdWarehouse",name:"smBusiUnitGidRef.busiUnitName",value:dataContext2.busiUnitName})
                                                        pubsub.publish("@@form.change",{id:"MdWarehouse",name:"smBusiUnitGid",value:dataContext2.gid})
                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},onSuccess);


                                                    }else{
                                                        console.log("业务单元未选择");
                                                    }

                                                    `
                                                }

                                            }]

                                        }
                                    ],
                                    associatedFields: [
                                        /*{
                                            "from": "busiUnitCode",
                                            "to": "abbreviate"
                                        }*/
                                    ]

                                }} component={FindbackField} name="busiUnit"/>
                            </Row>
                            <Field config={{
                                id: 'wareHouseTree001', //组件id
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
                                    url: "/ime/mdWarehouse/getWareHouseTree.action",
                                },
                                subscribes: [
                                    {
                                        event: 'wareHouseTree001.onSelect',
                                        pubs: [
                                            {
                                                event: "wh00000002.enabled",
                                                payload: true
                                            },
                                            {
                                                event:"wareHouseTree001.expression",
                                                meta: {
                                                    expression: `
                                                let condition = data.eventPayload.selectedKeys[0];
                                                pubsub.publish("wh00000002.dataContext",{
                                                    eventPayload:data
                                                });
                                                pubsub.publish("wh00000003.dataContext",{
                                                      eventPayload:me.state.selectedKeys
                                                });
                                                if(data.eventPayload.info.selectedNodes["0"].props.children==undefined){
                                                    pubsub.publish("wh00000003.enabled", true);
                                                }else{
                                                    pubsub.publish("wh00000003.enabled", false);
                                                }
                                                //回填表单
                                                let dataSource= {
                                                  type: "api",
                                                  mode:"dataContext",
                                                  method: "POST",
                                                  url: "/ime/mdWarehouse/findById.action?id="+condition
                                                };
                                                resolveDataSourceCallback({dataSource:dataSource, dataContext: {}},
                                                  function(res){
                                                    if(res.success){
                                                        resolveFetch({fetch:{id:"busiUnit",data:"dataContext"}}).then(function (data) {
                                                                console.log(data);
                                                                console.log(res);
                                                                //let smBusiUnitGidRef = {}
                                                                //smBusiUnitGidRef.busiUnitName = data.smbusiUnitName;
                                                                res.data["smBusiUnitGidRef.busiUnitName"] = data.smbusiUnitName;
                                                                res.data.smBusiUnitGid = data.smgid;
                                                                res.data["smBusiUnitGidRef"] = {}
                                                                res.data["smBusiUnitGidRef"]["busiUnitName"]=res.data["smBusiUnitGidRef.busiUnitName"]
                                                                delete res.data["smBusiUnitGidRef.busiUnitName"]
                                                                console.log(res);
                                                                pubsub.publish("@@form.init", { id: "MdWarehouse", data: res.data })
                                                         })
                                                    }
                                                  },
                                                  function(){
                                                  }
                                                )

                                              `
                                                }
                                            }
                                        ]
                                    },
                                ]
                            }} name="wareHouseTree001"  component={ TreeField } />
                        </Card>
                    </Col>
                    <Col span={1}>
                    </Col>

                    <Col span={ 16 } >
                        <Card bordered={true} style={{ marginTop: "20px" }}>
                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "warehouseCode",
                                        label: "仓库编码",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入编码",
                                    }} component={TextField} name="warehouseCode" />
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "warehouseName",
                                        label: "仓库名称",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        form: "MdWarehouse",
                                        placeholder: "请输入"
                                    }} component={TextField} name="warehouseName" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "smBusiUnitGidwarehouseName",
                                        form:"MdWarehouse",
                                        label: "业务单元",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入编码",

                                        tableInfo: {
                                            id: "smBusiUnitGidwarehouseNameFindBackTable",
                                            size: "small",
                                            rowKey: "gid",
                                            width:"500",
                                            tableTitle: "业务单元",
                                            columns: [
                                                { title: '业务单元名称', dataIndex: 'busiUnitName', key: '2', width: 200 },
                                                { title: '业务单元编码', dataIndex: 'busiUnitCode', key: '1', width: 200 }
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/sm/busiUnit/query.action',
                                               /* bodyExpression:`
                                                 resolveFetch({fetch:{id:'busiUnit',data:'dataContext'}}).then(function(data){
                                                 console.log(data,1234569)
                                            callback({smBusiUnitGidRef:{smbusiUnitName:dataContext.busiUnitName},"smgid":dataContext.smBusiUnitGid})
                                            })

                                          `*/
                                            }
                                        },
                                        pageId: 'smBusiUnitGidwarehouseNameFindBackTablePage',
                                        displayField: "smBusiUnitGidRef.busiUnitName",
                                        valueField: {
                                            "from": "busiUnitName",
                                            "to": "smBusiUnitGidRef.busiUnitName"
                                        },
                                        associatedFields: [
                                            {
                                                "from": "gid",
                                                "to": "smBusiUnitGid"
                                            },
                                        ]
                                    }} component={FindbackField} name="smBusiUnitGidRef.busiUnitName" />
                                    {/*<Field config={{
                                        enabled: false,
                                        id: "smBusiUnitGidwarehouseName",
                                        form:"MdWarehouse",
                                        label: "业务单元",  //标签名称
                                        showRequiredStar: true,  //是否显示必填星号
                                        treeCheckStrictly:true, //是否节点选择完全受控
                                        treeCheckable: false,  //是否显示CheckBox(多选)
                                        showSearch:true,  //是否在下拉中显示搜索框(单选)
                                        dropdownMatchSelectWidth:true,  //下拉菜单和选择器是否同宽

                                        dataSource: {
                                            type: "api",
                                            method: "POST",
                                            url: '/sm/busiUnit/queryTreeByFunc.action'
                                        },
                                        displayField:"text",
                                        valueField:"id"
                                    }} component={TreeSelectField} name="smBusiGroupGidRef.busiUnitName" />*/}
                                </Col>

                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        form:"MdWarehouse",
                                        id: "warehouseType",
                                        label: "基本分类",  //标签名称
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
                                                        {
                                                            "field": "smDictionaryEnumGid", "type": "eq", "value": "56272988A1661D58E055000000000001"
                                                        }
                                                    ],
                                                    "sorted": "seq"
                                                }
                                            }
                                        },
                                        displayField: "val",
                                        valueField: "gid",
                                    }} component={SelectField} name="warehouseType" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "parentWarehouseRefwarehouseName",
                                        form:"MdWarehouse",
                                        label: "上级仓库",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        placeholder: "请输入编码",

                                        tableInfo: {
                                            id: "parentWarehouseRefwarehouseNameFindBackTable",
                                            size: "small",
                                            rowKey: "gid",
                                            width:"500",
                                            tableTitle: "上级仓库",
                                            columns: [
                                                { title: '上级仓库名称', dataIndex: 'warehouseName', key: '2', width: 200 },
                                                { title: '上级仓库编码', dataIndex: 'warehouseCode', key: '1', width: 200 },
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/ime/mdWarehouse/query.action',
                                                bodyExpression:`
                                                let smBusiUnitGid = "";
                                                 resolveFetch({fetch:{id:'MdWarehouse',data:'@@formValues'}}).then(function(data){
                                                 smBusiUnitGid = data.smBusiUnitGid
                                            })
                                            resolveFetch({fetch:{id:'wh00000002',data:'dataContext'}}).then(function(treeNode){
                                                console.log(treeNode);
                                                let getTreeNode = function(treeNode){
                                                    var node = "";
                                                    /!*console.log(treeNode.props.children);*!/
                                                    if(treeNode.props.children!=null && treeNode.props.children.length>0){
                                                        node += treeNode.key+","
                                                        for(var i in treeNode.props.children){
                                                            node += getTreeNode(treeNode.props.children[i])
                                                        }
                                                    }else{
                                                        node += treeNode.key+","
                                                    }
                                                    return node
                                                }
                                                if(treeNode==undefined || treeNode.eventPayload.info.selectedNodes[0]=='0'){
                                                    callback({
                                                        query:{
                                                            query:[
                                                            {
                                                                left:"(",
                                                                field:"smBusiUnitGid",
                                                                type:"eq",
                                                                value:smBusiUnitGid,
                                                                right:")",
                                                                operator:"and"
                                                            }
                                                           ]
                                                        }
                                                    });

                                                }else{
                                                    let nodeGid = getTreeNode(treeNode.eventPayload.info.selectedNodes[0]);
                                                    console.log(nodeGid,123456);
                                                    callback({
                                                        query:{
                                                            query:[
                                                            {
                                                                left:"(",
                                                                field:"gid",
                                                                type:"noin",
                                                                value:nodeGid.substring(0, nodeGid.lastIndexOf(",")),
                                                                right:")",
                                                                operator:"and"
                                                            },
                                                            {
                                                                left:"(",
                                                                field:"smBusiUnitGid",
                                                                type:"eq",
                                                                value:smBusiUnitGid,
                                                                right:")",
                                                                operator:"and"
                                                            }
                                                           ]
                                                        }
                                                    });
                                                }
                                            })

                                          `
                                            }
                                        },
                                        pageId: 'parentWarehouseRefwarehouseNameFindBackTablePage',
                                        displayField: "parentWarehouseRef.warehouseName",
                                        valueField: {
                                            "from": "warehouseName",
                                            "to": "parentWarehouseRef.warehouseName"
                                        },
                                       associatedFields: [
                                            {
                                                "from": "gid",
                                                "to": "parentWarehouse"
                                            },
                                        ]
                                    }} component={FindbackField} name="parentWarehouseRef.warehouseName" />
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "isManager",
                                        form:"MdWarehouse",
                                        label: "是否货位管理",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        checkedChildren: "是",
                                        unCheckedChildren: "否"
                                    }} component={SwitchField} name="isManager" />
                                </Col>
                            </Row>

                        </Card>
                    </Col>

                </Row>
            </div>

        );
    }
}
MdWarehouse.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


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
let MdWarehouseFrom =  reduxForm({
    form: "MdWarehouse",
    validate,
    asyncValidate
})(MdWarehouse)
export default connect(mapStateToProps, mapDispatchToProps)(MdWarehouseFrom)
