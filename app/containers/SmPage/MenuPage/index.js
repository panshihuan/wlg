/*
 *
 * MenuPage
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
import TextField from 'components/Form/TextField';
import FindbackField from 'components/Form/FindbackField';
import SelectField from 'components/Form/SelectField'
import SwitchField from 'components/Form/SwitchField'
import TreeSelectField from 'components/Form/TreeSelectField';

export class MenuPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    menuTreeRefresh(){
        let dataSource = {
            type: "api",
            method: "POST",
            url: '/sm/menu/queryForTree.action',
        }
        resolveDataSource({dataSource:dataSource}).then(function (treeResponse) {
            pubsub.publish('MenuTree.setTreeData',treeResponse.data)
        })
    }
    componentDidMount() {

        pubsub.subscribe("MenuEvent.refresh",()=>{
            this.menuTreeRefresh()
        })

        let menuId
        pubsub.subscribe("MenuEvent.selected",(name,data)=>{
            menuId = data
        })

        pubsub.subscribe("MenuEvent.delete",()=>{
            let dataSource = {
                type: 'api',
                method: 'post',
                url: '/sm/menu/delete.action?id='+menuId,
            }

            resolveDataSource({
                dataSource: dataSource
            }).then(function (response) {
                debugger
                if (response.success) {
                    pubsub.publish("@@message.success", "删除菜单成功!");
                    pubsub.publish("MenuModifyBtn.enabled", false);
                    pubsub.publish("MenuDeleteBtn.enabled", false);
                    //刷新树
                    this.menuTreeRefresh()

                    //清空表单
                    let formData = {};
                    pubsub.publish("@@form.init", {id: "MenuForm", data: formData});
                }else{
                    pubsub.publish("@@message.error", "删除失败!");
                }
            }.bind(this))
        })

    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps) {

    }
    render() {
        return (
            <div>
                <Row>
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                        <Breadcrumb.Item>菜单管理</Breadcrumb.Item>
                    </Breadcrumb>
                </Row>
                <Row>
                    <Card bordered={true}
                          style={{width: "100%", marginRight: "20px", marginTop: "20px", minHeight: "20px" ,"backgroundColor": "rgba(247, 247, 247, 1)"}}
                          bodyStyle={{padding: "15px"}}>

                        <Col span={8} xs={24}>
                            < AppButton config={{
                                id: "MenuCreateBtn",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [{
                                    event: "MenuCreateBtn.click",
                                    pubs: [
                                        {
                                            event: "MenuCreateBtn.expression",
                                            meta: {
                                                expression: `
                                                    let formData = {};
                                                    //清空表单
                                                    pubsub.publish("@@form.init", {id: "MenuForm", data: formData});
                                              `
                                            }

                                        },
                                        {
                                            event: "menuCode.enabled",
                                            payload: true
                                        },
                                        {
                                            event: "menuName.enabled",
                                            payload: true
                                        },
                                        {
                                            event: "menuLevel.enabled",
                                            payload: true
                                        },
                                        {
                                            event: "parentMenuName.enabled",
                                            payload: true
                                        },
                                        {
                                            event: "appUrl.enabled",
                                            payload: true
                                        },
                                        {
                                            event: "isVirtual.enabled",
                                            payload: true
                                        },
                                        {
                                            event: "MenuCreateBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event: "MenuModifyBtn.visible",
                                            payload: false
                                        },
                                        {
                                            event: "saveBtn.visible",
                                            payload: true
                                        },
                                        {
                                            event: "cancelBtn.visible",
                                            payload: true
                                        }
                                    ]
                                }
                                ]

                            }
                            }
                            />
                            <AppButton config={{
                                id: "saveBtn",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "saveBtn.click",
                                        behaviors:[
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/menu/createOrUpdate.action",
                                                    withForm: "MenuForm"
                                                },
                                                successPubs: [  //保存成功后
                                                    {
                                                        event: "MenuCreateBtn.visible",
                                                        payload: true
                                                    },
                                                    {
                                                        event:"MenuModifyBtn.visible",
                                                        payload: true
                                                    },
                                                    {
                                                        event:"MenuDeleteBtn.visible",
                                                        payload: true
                                                    },
                                                    {
                                                        event:"saveBtn.visible",
                                                        payload:false
                                                    },
                                                    {
                                                        event:"cancelBtn.visible",
                                                        payload: false
                                                    },{
                                                        event: "menuCode.enabled",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "menuName.enabled",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "menuLevel.enabled",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "parentMenuName.enabled",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "appUrl.enabled",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "isVirtual.enabled",
                                                        payload: false
                                                    },
                                                    {
                                                        event: "@@message.success",
                                                        payload: "保存成功"
                                                    },
                                                    {
                                                        event: "MenuEvent.refresh",
                                                    }

                                                ]
                                            }
                                        ]
                                    }

                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "MenuModifyBtn",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "MenuModifyBtn.click",
                                        pubs: [
                                            {
                                                event: "menuCode.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "menuName.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "menuLevel.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "parentMenuName.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "appUrl.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "isVirtual.enabled",
                                                payload: true
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
                                                event:"MenuCreateBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event:"MenuModifyBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event:"MenuDeleteBtn.visible",
                                                payload: false
                                            }
                                        ]
                                    }

                                ]

                            }}/>
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
                                                event: "cancelBtn.expression",
                                                meta: {
                                                    expression: `
                                                    let formData = {};
                                                    //清空表单
                                                    pubsub.publish("@@form.init", {id: "MenuForm", data: formData});
                                              `
                                                }

                                            },
                                            {
                                                event: "menuCode.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "menuName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "menuLevel.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "parentMenuName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "appUrl.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "isVirtual.enabled",
                                                payload: false
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
                                                event:"MenuCreateBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event:"MenuModifyBtn.visible",
                                                payload: true

                                            },
                                            {
                                                event:"MenuDeleteBtn.visible",
                                                payload: true
                                            }

                                        ]

                                    }

                                ]
                            }}>
                            </AppButton>
                            < AppButton config={{
                                id: "MenuDeleteBtn",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event:"MenuDeleteBtn.click",
                                        pubs:[
                                            {
                                                event: "MenuDeleteBtn.expression",
                                                meta: {
                                                    expression: `
                                                       pubsub.publish("MenuEvent.delete")
                                                    `
                                                }
                                            }
                                        ]

                                    },
                                ]
                            }}/>
                        </Col>
                    </Card>
                </Row>
                <Row>
                    <Col xs={7}>
                        <Card  bordered={true}
                               style={{width: "100%", marginRight: "20px", marginTop: "20px", minHeight: "600px"}}
                               bodyStyle={{padding: "15px"}}>
                            <Field config={{
                                id: 'MenuTree',
                                search: true,
                                enabled: true,
                                visible: true,
                                checkable: false,
                                showLine: false,
                                draggable: false,
                                // checkStrictly:true,
                                searchBoxWidth: 250,
                                dataSource: {
                                    type: "api",
                                    method: "POST",
                                    url: '/sm/menu/queryForTree.action',
                                },
                                subscribes:[
                                    {
                                        event:"MenuTree.onSelect",
                                        pubs:[
                                            {
                                                event: "MenuTree.expression",
                                                meta: {
                                                    expression: `
                                                          let leftRoot = _.cloneDeep(me.state.dataSource)
                                                          let leftTreeNode = leftRoot[0].childs;
                                                          let checkedNode = _.cloneDeep(me.state.checkedInfo)

                                                          let condition = data.eventPayload.selectedKeys[0];
                                                          pubsub.publish("MenuEvent.selected",condition)

                                                            //回填表单
                                                            let dataSource= {
                                                                type: "api",
                                                                method: "POST",
                                                                url: "/sm/menu/findById.action?id="+condition
                                                            };

                                                             //回调函数
                                                            let callBack = function(response){
                                                                if(response.success){
                                                                    //pubsub.publish("@@message.success","操作成功");
                                                                    let modifyData = response.data;
                                                                    console.log(modifyData);
                                                                    //1是员工级,2是业务组级
                                                                    let menuLevel
                                                                    if(modifyData.menuLevel == 1){
                                                                        menuLevel = "员工级"
                                                                    }else if(modifyData.menuLevel == 2){
                                                                        menuLevel = "业务组级"
                                                                    }
                                                                    console.log("级别:",menuLevel)
                                                                   //

                                                                    pubsub.publish("@@form.init", {id: "MenuForm", data: modifyData});
                                                                    pubsub.publish("menuLevel.setDisplayValue", menuLevel)

                                                                }else{
                                                                    pubsub.publish("@@message.error",response.data);
                                                                }
                                                            }
                                                             resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},callBack);

                            `
                                                }
                                            },{
                                                event: "MenuModifyBtn.enabled",
                                                payload: true
                                            },{
                                                event: "MenuDeleteBtn.enabled",
                                                payload: true
                                            }
                                        ]
                                    }
                                ]
                            }} name="MenuTree"  component={ TreeField } />
                        </Card>
                    </Col>
                    <Col xs={1}/>
                    <Col xs={16}>
                        <Card  bordered={true}
                               style={{width: "100%", marginRight: "20px", marginTop: "20px", minHeight: "600px","backgroundColor": "rgba(247, 247, 247, 1)"}}
                               bodyStyle={{padding: "15px"}}>
                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        form: "MenuForm",
                                        id: "menuCode",
                                        label: "菜单编码",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 10,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入编码"
                                    }} component={TextField} name="menuCode"/>
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        form: "MenuForm",
                                        id: "menuName",
                                        label: "菜单名称",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 10,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入名称"
                                    }} component={TextField} name="menuName"/>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "menuLevel",
                                        form: "MenuForm",
                                        label: "菜单类型",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 10,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请选择菜单类型",
                                        dataSource: {
                                            type: "api",
                                            method: "post",
                                            url: "/sm/user/getUserLevel.action",
                                            mode: "payload",

                                        },
                                        displayField: "val",
                                        valueField: "gid",
                                    }} component={SelectField} name="menuLevel" />
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "parentMenuName",
                                        form: "MenuForm",
                                        label: "上级菜单名称",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 10,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请选择上级菜单",
                                        dropdownMatchSelectWidth: true,  //下拉菜单和选择器是否同宽
                                        displayField: "text",
                                        valueField: "gid",
                                        dataSource: {
                                        type: "api",
                                        method: "post",
                                        url: "/sm/menu/queryForTree.action",

                                    },
                                    }} component={TreeSelectField} name="parentId" />
                                </Col>
                            </Row>
                            <Row>
                               <Col span={24}>
                                    <Field config={{
                                        enabled: false,
                                        form: "MenuForm",
                                        id: "appUrl",
                                        label: "关联的应用",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 10,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入应用的URL"
                                    }} component={TextField} name="appUrl"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Field config={{
                                        enabled: false,
                                        form: "MenuForm",
                                        id: "isVirtual",
                                        label: "是否为虚菜单",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 1,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        checkedChildren: "是",
                                        unCheckedChildren: "否",
                                        isNumber: true
                                    }} component={SwitchField} name="isVirtual"/>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                </Row>
            </div>
        );
    }
}

MenuPage.propTypes = {
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
            debugger
        }
    };
}

let MenuForm = reduxForm({
    form: "MenuForm",
    //validate,
    //initialValues: Immutable.fromJS({ "StaffAdd-radio": "team" })
})(MenuPage)

export default connect(mapStateToProps, mapDispatchToProps)(MenuForm);
