

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import pubsub from 'pubsub-js';
import { Link } from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import AppTable from '../../../../components/AppTable/index';
import DropdownButton from '../../../../components/DropdownButton/index';
import {fromJS} from 'immutable'
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer';
import TreeField from '../../../../components/Form/TreeField/index';
import AutoCompleteField from '../../../../components/Form/AutoCompleteField/index';
import TableField from 'components/Form/TableField';
import Immutable from 'immutable';

import TextField from 'components/Form/TextField'
import DateField from 'components/Form/DateField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import TextAreaField from 'components/Form/TextAreaField'
import SelectField from 'components/Form/SelectField'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil';


const validate = values => {
    const errors = {}
    if (!values.get('code')) {
        errors.code = '必填项'
    }
    if(!values.get("name")){
        errors.name='必填项'
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
    let className = "com.neusoft.ime.md.mdMaterielType.dto.MdMaterielTypeDTO";
    let fieldNames = "code,delete";
    let fieldValues = values.get('code') + ",0";
    let gid = (values.get('gid')!=undefined && values.get('gid')!='')?values.get('gid'):''
    console.log(values.get('gid'))

    return new Promise(resolve => resolveDataSource({ dataSource, dataContext: { gid:gid,  className:className,fieldNames:fieldNames,fieldValues,fieldValues} }).then(function (res) {

        resolve(res)
    })).then(function (res) {
        if(!res.data){
            throw { code: "已存在" }
        }

    })

}

export class MaterielTypePage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            index:[],
            dataSource:[],
            parms:undefined,
            newDataSource:undefined
        };

    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>物料</Breadcrumb.Item>
                    <Breadcrumb.Item>物料分类</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={8} xs={24}>
                            <AppButton config={{
                                id: "createBtn",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "createBtn.click",
                                        pubs: [
                                            {
                                                //表达式 给上级仓库赋值
                                                event: "createBtn.expression",
                                                meta: {
                                                    expression: `

                                                      let formData = {};
                                                      console.log(dataContext)
                                                      let callBack = function(value){
                                                        if (dataContext && dataContext!="-1") {
                                                            formData.parentGid = dataContext;
                                                        }
                                                        //清空表单
                                                        pubsub.publish("@@form.init", {id: "MaterielTypePage", data: formData});
                                                        pubsub.publish("parentGid.setDisplayValue", '');
                                                    }
                                                    resolveFetch({fetch: {id: "MaterielTypePage", data: "@@formValues"}}).then(callBack);
                                                    //回填表单
                                                    let dataSource = {
                                                        type: "api",
                                                        method: "POST",
                                                        url: "/ime/mdMaterielType/findById.action?id=" + dataContext
                                                    };

                                                    let callBack2 = function(response){
                                                        if(response.success){

                                                            if (response.data.name) {
                                                                pubsub.publish("parentGid.setDisplayValue", response.data.name);

                                                            }
                                                        }

                                                    }
                                                    resolveDataSourceCallback({dataSource: dataSource, eventPayload: {}, dataContext: {}}, callBack2);
                                                    `
                                                }

                                            },
                                            {
                                                event: "code.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "name.enabled",
                                                payload: true
                                            }
                                            ,
                                            {
                                                event: "createBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modifyBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event: "saveBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event: "cancelBtn.visible",
                                                payload: true
                                            },

                                            {
                                                event:"deleteBtn.visible",
                                                payload:false
                                            },
                                            {
                                                event:"parentGid.enabled",
                                                payload:true
                                            },
                                            {
                                                event:"materielTypeTree.enabled",
                                                payload:false
                                            },
                                            {
                                                event:"saveBtn.enabled",
                                                payload:true
                                            }
                                            ,
                                            {
                                                event:"saveBtn.visible",
                                                payload:true
                                            }
                                            ,
                                            {
                                                event:"saveModifyBtn.visible",
                                                payload:false
                                            }


                                        ]
                                    }

                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "modifyBtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "modifyBtn.click",
                                        pubs: [
                                            {
                                                event: "code.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "name.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "createBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event: "modifyBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event: "saveBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancelBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event: "deleteBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event:"parentGid.enabled",
                                                payload:true
                                            },
                                            {
                                                event:"saveBtn.enabled",
                                                payload:false
                                            }
                                            ,
                                            {
                                                event:"saveModifyBtn.visible",
                                                payload:true
                                            }
                                        ]
                                    }

                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "deleteBtn",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "deleteBtn.click",
                                        pubs: [
                                            {
                                                //表达式 给上级仓库赋值
                                                event: "deleteBtn.expression",
                                                meta: {
                                                    expression: `
                                                    //拿到树的节点值
                                                    //console.log(dataContext);
                                                    //console.log(dataContext.info);
                                                    //console.log(dataContext.info.selectedNodes["0"]);

                                                    var child = dataContext.info.selectedNodes["0"].props.children;
                                                    console.log(child);
                                                    var mateielGid = '';
                                                    if(child==undefined || child.length == 0){
                                                        mateielGid = dataContext.selectedKeys[0];
                                                        //回填表单
                                                    let dataSource = {
                                                        type: "api",
                                                        method: "POST",
                                                        url: "/ime/mdMaterielType/delete.action?id=" + mateielGid
                                                    };

                                                    let callBack = function(response){
                                                        if(response.success){
                                                            //加载树
                                                            let dataSource = {
                                                              type: "api",
                                                              mode:"dataContext",
                                                              method: "POST",
                                                              url: "/ime/mdMaterielType/getTreeData.action"
                                                            };

                                                            let onSuccess = function(response){
                                                                if(response.success){
                                                                    pubsub.publish("materielTypeTree.setTreeData",response.data);
                                                                    pubsub.publish("@@form.init", {id: "MaterielTypePage", data: {}});
                                                                    pubsub.publish("parentGid.setDisplayValue", '');
                                                                    pubsub.publish("cancelBtn.visible",false);
                                                                    pubsub.publish("saveBtn.visible",false);
                                                                    pubsub.publish("createBtn.visible",true);
                                                                    pubsub.publish("createBtn.visible",true);
                                                                    pubsub.publish("modifyBtn.visible",true);
                                                                    pubsub.publish("deleteBtn.visible",true);
                                                                    pubsub.publish("createBtn.enabled",false);
                                                                    pubsub.publish("createBtn.enabled",false);
                                                                    pubsub.publish("modifyBtn.enabled",false);
                                                                    pubsub.publish("deleteBtn.enabled",false);
                                                                }
                                                            }

                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},onSuccess);
                                                        }

                                                    }
                                                    resolveDataSourceCallback({dataSource: dataSource, eventPayload: {}, dataContext: {}}, callBack);

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
                                id: "saveBtn",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "saveBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/mdMaterielType/add.action",
                                                    withForm: "MaterielTypePage",
                                                },
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "materielTypeTree.expression",
                                                        meta: {
                                                            expression: `
                                                            console.log("happy");
                                                        let dataSource = {
                                                          type: "api",
                                                          mode:"dataContext",
                                                          method: "POST",
                                                          url: "/ime/mdMaterielType/getTreeData.action"
                                                        };

                                                        let onSuccess = function(response){
                                                            if(response.success){
                                                                pubsub.publish("materielTypeTree.setTreeData",response.data);
                                                                pubsub.publish("@@form.init", {id: "MaterielTypePage", data: {}});
                                                                pubsub.publish("parentGid.setDisplayValue", '');
                                                            }
                                                        }

                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},onSuccess);
                                                         pubsub.publish("cancelBtn.visible",false);
                                                         pubsub.publish("saveBtn.visible",false);
                                                         pubsub.publish("createBtn.visible",true);
                                                         pubsub.publish("modifyBtn.visible",true);
                                                         pubsub.publish("modifyBtn.enabled",false);
                                                         pubsub.publish("deleteBtn.visible",true);
                                                         pubsub.publish("deleteBtn.enabled",false);

                                                    `
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
                                                    },
                                                    {
                                                        event: "@@message.success",
                                                        payload: "新增成功"
                                                    }
                                                ]
                                            },{
                                                event: "code.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "name.enabled",
                                                payload: false
                                            },
                                            {
                                                event:"parentGid.enabled",
                                                payload:false
                                            }

                                        ]
                                    }

                                    ,
                                    {
                                        event:"saveModifyBtn.visible",
                                        payload:false
                                    }


                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "saveModifyBtn",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "saveModifyBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/ime/mdMaterielType/modify.action",
                                                    withForm: "MaterielTypePage",
                                                },
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "materielTypeTree.expression",
                                                        meta: {
                                                            expression: `
                                                            console.log("happy");
                                                        let dataSource = {
                                                          type: "api",
                                                          mode:"dataContext",
                                                          method: "POST",
                                                          url: "/ime/mdMaterielType/getTreeData.action"
                                                        };

                                                        let onSuccess = function(response){
                                                            if(response.success){
                                                                pubsub.publish("materielTypeTree.setTreeData",response.data);
                                                                pubsub.publish("@@form.init", {id: "MaterielTypePage", data: {}});
                                                                pubsub.publish("parentGid.setDisplayValue", '');
                                                            }
                                                        }

                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},onSuccess);
                                                         pubsub.publish("cancelBtn.visible",false);
                                                         pubsub.publish("saveBtn.visible",false);
                                                         pubsub.publish("createBtn.visible",true);
                                                         pubsub.publish("modifyBtn.visible",true);
                                                         pubsub.publish("modifyBtn.enabled",false);
                                                         pubsub.publish("deleteBtn.visible",true);
                                                         pubsub.publish("deleteBtn.enabled",false);
                                                         pubsub.publish("saveModifyBtn.visible",false);

                                                    `
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
                                                    },
                                                    {
                                                        event: "@@message.success",
                                                        payload: "修改成功"
                                                    }
                                                ]
                                            },{
                                                event: "code.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "name.enabled",
                                                payload: false
                                            },
                                            {
                                                event:"parentGid.enabled",
                                                payload:false
                                            },
                                            {
                                                event:"saveBtn.visible",
                                                payload:false
                                            }
                                            ,
                                            {
                                                event:"saveModifyBtn.visible",
                                                payload:false
                                            }
                                        ]
                                    }

                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "cancelBtn",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cancelBtn.click",
                                        pubs: [
                                            {
                                                event: "code.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "name.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "createBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event: "modifyBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event: "saveBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancelBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event: "parentGid.enabled",
                                                payload: false
                                            },
                                            {
                                                event:"deleteBtn.visible",
                                                payload:true
                                            }
                                            ,
                                            {
                                                event:"saveModifyBtn.visible",
                                                payload:false
                                            },
                                            {
                                                event:"deleteBtn.enabled",
                                                payload:false
                                            }
                                            ,
                                            {
                                                event:"modifyBtn.enabled",
                                                payload:false
                                            },
                                            {
                                                event:"deleteBtn.expression",
                                                meta: {
                                                    expression: `
                                                  console.log(dataContext);
                                                let condition = dataContext.selectedKeys["0"];
                                                if(condition!='-1'){
                                                   let child = dataContext.info.selectedNodes["0"].props.children;
                                                   //console.log(child);
                                                   if(child==undefined || child.length == 0){
                                                        pubsub.publish("deleteBtn.visible",true);
                                                        pubsub.publish("deleteBtn.enabled",true);
                                                   }else{
                                                        pubsub.publish("deleteBtn.enabled",false);
                                                   }

                                                    dataContext = condition;
                                                    let  myData = {};
                                                    resolveFetch({fetch:{id:"MaterielTypePage",data:"@@formValues"}}).then(function (value) {
                                                        //console.log(value,"表单数据");
                                                        myData = value;
                                                    });
                                                    pubsub.publish("createBtn.enabled",{eventPayload:true});
                                                    pubsub.publish("modifyBtn.enabled",{eventPayload:true});
                                                    //判断删除按钮的出现情况

                                                    //回填表单
                                                    let dataSource= {
                                                        type: "api",
                                                        method: "POST",
                                                        url: "/ime/mdMaterielType/findById.action?id="+condition
                                                    };

                                                     //回调函数
                                                    let callBack = function(response){
                                                        if(response.success){
                                                            //pubsub.publish("@@message.success","操作成功");
                                                            let modifyData = response.data;
                                                            console.log(modifyData);
                                                            pubsub.publish("@@form.init", {id: "MaterielTypePage", data: modifyData});
                                                            if (modifyData.parentGidRef && modifyData.parentGidRef.name) {
                                                                pubsub.publish("parentGid.setDisplayValue", modifyData.parentGidRef.name)
                                                            }else{
                                                                pubsub.publish("parentGid.setDisplayValue", "")
                                                            }
                                                        }else{
                                                            pubsub.publish("@@message.error",response.data);
                                                        }
                                                    }
                                                     resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},callBack);
                                                }else{
                                                     pubsub.publish("deleteBtn.enabled",false);
                                                     pubsub.publish("createBtn.enabled",true);
                                                     pubsub.publish("modifyBtn.enabled",false);
                                                     pubsub.publish("createBtn.dataContext",{eventPayload:''});

                                                }
                                            `
                                                }

                                                    }

                                                ]

                                            }

                                        ]

                                    }


                            }>
                            </AppButton>

                        </Col>

                    </Row>
                </Card>
                <Row>
                    <Col span={5}>
                        <Field config={{
                            id: 'materielTypeTree', //组件id //busiGroupTree001
                            search: false,
                            enabled: false,
                            visible: true,
                            // defaultExpandedKeys: ['0-0-0', '0-0-1'],
                            // defaultSelectedKeys: ['0-0-0', '0-0-1'],
                            // defaultCheckedKeys: ['0-0-0', '0-0-1'],
                            checkable: false, //复选框
                            showLine: false,
                            draggable: false, //是否可以拖拽
                            searchBoxWidth: 300,
                            subscribes:[
                                {
                                    event:"materielTypeTree.onSelect",
                                    pubs: [
                                        {
                                            event:"materielTypeTree.expression",
                                            meta: {
                                                expression: `
                                                        let condition = data.eventPayload.selectedKeys[0];
                                                        //console.log(data.eventPayload);
                                                        //console.log(condition);
                                                        if(condition!='-1'){
                                                           /*let child = data.eventPayload.info.selectedNodes["0"].props.children;
                                                           //console.log(child);
                                                           if(child==undefined || child.length == 0){
                                                                pubsub.publish("deleteBtn.visible",true);
                                                                pubsub.publish("deleteBtn.enabled",true);

                                                           }else{
                                                                pubsub.publish("deleteBtn.enabled",false);
                                                           }
                                                           */
                                                            pubsub.publish("deleteBtn.dataContext",{eventPayload:data.eventPayload});
                                                            dataContext = condition;
                                                            /*
                                                            let  myData = {};
                                                            resolveFetch({fetch:{id:"MaterielTypePage",data:"@@formValues"}}).then(function (value) {
                                                                //console.log(value,"表单数据");
                                                                myData = value;
                                                            });
                                                            */
                                                           /* pubsub.publish("createBtn.enabled",{eventPayload:true});
                                                            pubsub.publish("modifyBtn.enabled",{eventPayload:true});
                                                            */
                                                            pubsub.publish("createBtn.dataContext",{eventPayload:condition});

                                                            //判断删除按钮的出现情况

                                                           /* //回填表单
                                                            let dataSource= {
                                                                type: "api",
                                                                method: "POST",
                                                                url: "/ime/mdMaterielType/findById.action?id="+condition
                                                            };*/

                                                             //回调函数
                                                           /* let callBack = function(response){
                                                                if(response.success){
                                                                    //pubsub.publish("@@message.success","操作成功");
                                                                    let modifyData = response.data;
                                                                    console.log(modifyData);
                                                                    pubsub.publish("@@form.init", {id: "MaterielTypePage", data: modifyData});
                                                                    if (modifyData.parentGidRef && modifyData.parentGidRef.name) {
                                                                        pubsub.publish("parentGid.setDisplayValue", modifyData.parentGidRef.name)
                                                                    }else{
                                                                        pubsub.publish("parentGid.setDisplayValue", "")
                                                                    }
                                                                }else{
                                                                    pubsub.publish("@@message.error",response.data);
                                                                }
                                                            }
                                                             resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},callBack);
                                                             */
                                                            /* pubsub.publish("materielTypeTree.enabled",{eventPayload:true});*/
                                                        }else{
                                                            /* pubsub.publish("deleteBtn.enabled",false);
                                                             pubsub.publish("createBtn.enabled",true);
                                                             pubsub.publish("modifyBtn.enabled",false);
                                                             */
                                                             pubsub.publish("createBtn.dataContext",{eventPayload:''});

                                                        }
                                                        pubsub.publish("cancelBtn.click");


                                                    `
                                            }

                                        }/*,
                                        {
                                            event:"createBtn.enable",
                                            patload:true
                                        }*/

                                    ]

                                }


                            ],
                            dataSource: {
                                type: "api",
                                method: "POST",
                                url: '/ime/mdMaterielType/getTreeData.action'
                            },

                        }} name="materielTypeTree"  component={ TreeField } />
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={ 18 } >
                        <Card bordered={true} style={{ marginTop: "20px" }}>
                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "code",
                                        label: "分类编码",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        form: "MaterielTypePage",
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入编码"

                                    }} component={TextField} name="code" />
                                    <Field config={{
                                        enabled: false,
                                        visible : false,
                                        id: "gid",
                                        label: "物料分类gid",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        form: "MaterielTypePage",
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入编码"

                                    }} component={TextField} name="gid" />
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "name",
                                        label: "基本分类名称",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        form: "MaterielTypePage",
                                        placeholder: "请输入名称"
                                    }} component={TextField} name="name" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "parentGid",
                                        form: "MaterielTypePage",
                                        label: "上级分类名称",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请选择上级分类名称",
                                        tableInfo: {
                                        id: "parentMaterielType",
                                        size: "small",
                                        rowKey: "gid",
                                        onLoadData: "false",
                                        width: 300,
                                        tableTitle: "物料分类",
                                            columns: [
                                                {title: '物料名称', dataIndex: 'name', key: '2', width: 200},
                                                {title: '物料编码', dataIndex: 'code', key: '1', width: 200}
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/ime/mdMaterielType/query.action',
                                                bodyExpression:`
                                                 resolveFetch({fetch:{id:'deleteBtn',data:'dataContext'}}).then(function(treeNode){
                                                        console.log(treeNode);
                                                        let getTreeNode = function(treeNode){
                                                            var node = "";
                                                            /*console.log(treeNode.props.children);*/
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
                                                        if(treeNode==undefined || treeNode.info.selectedNodes[0]=='0'){
                                                            callback({});

                                                        }else{
                                                            let nodeGid = getTreeNode(treeNode.info.selectedNodes[0]);
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
                                                                    }]
                                                                }
                                                            });
                                                        }
                                                })

                                                `
                                            }
                                        },
                                        pageId: 'parentMaterielTypeFindBackTablePage',
                                        displayField: "name",
                                        valueField: {
                                            "from": "gid",
                                            "to": "parentGid"
                                        }
                                    }} component={FindbackField} name="parentGid"/>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
    );
  }
}

MaterielTypePage.propTypes = {
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



let MaterielTypeForm = reduxForm({
    form: "MaterielTypePage",
    validate,
    asyncValidate,
    asyncBlurFields: ['code']
})(MaterielTypePage)

export default connect(mapStateToProps, mapDispatchToProps)(MaterielTypeForm);
