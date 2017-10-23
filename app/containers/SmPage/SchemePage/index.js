import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import AppTable from '../../../components/AppTable';
import DropdownButton from '../../../components/DropdownButton';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer'
import TreeField from '../../../components/Form/TreeField';
import AutoCompleteField from '../../../components/Form/AutoCompleteField';

import TextField from 'components/Form/TextField'
import DateField from 'components/Form/DateField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import TextAreaField from 'components/Form/TextAreaField'
import MenuTreeModal from './MenuTree'

const validate = values => {
    const errors = {}
    if (!values.get('busiGroupCode')) {
        errors.busiGroupCode = '必填项'
    }
    return errors
}

export class SchemePage extends React.PureComponent {

    //构造
    constructor(props) {
        super(props);

    }

    //不用
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

    }



    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>方案管理</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={8} xs={24}>
                            <AppButton config={{
                                id: "schemecrebtn",
                                title: "创建方案",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "schemecrebtn.click",
                                        pubs:[
                                            {
                                                event: "schemecrebtn.visible",
                                                payload: false
                                            },{
                                                event: "schememodibtn.visible",
                                                payload: false
                                            },{
                                                event: "schemedelbtn.visible",
                                                payload: false
                                            },{
                                                event: "save1.visible",
                                                payload: true
                                            },{
                                                event: "save2.visible",
                                                payload: false
                                            },{
                                                event: "cancle.visible",
                                                payload: true
                                            },{
                                                event: "schemeCode.enabled",
                                                payload: true
                                            },{
                                                event: "schemeName.enabled",
                                                payload: true
                                            },{
                                                event: "selbtn.visible",
                                                payload: false
                                            },{
                                                event:"schemecrebtn.expression",
                                                meta: {
                                                    expression:`
                                                        pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeCode" ,value: "" })
                                                        pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeName" ,value: "" })
                                                    `
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "schememodibtn",
                                title: "修改方案",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "schememodibtn.click",
                                        pubs:[
                                            {
                                                event: "schemecrebtn.visible",
                                                payload: false
                                            },{
                                                event: "schememodibtn.visible",
                                                payload: false
                                            },{
                                                event: "schemedelbtn.visible",
                                                payload: false
                                            },{
                                                event: "save2.visible",
                                                payload: true
                                            },{
                                                event: "cancle.visible",
                                                payload: true
                                            },{
                                                event: "schemeCode.enabled",
                                                payload: true
                                            },{
                                                event: "schemeName.enabled",
                                                payload: true
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "schemedelbtn",
                                title: "删除方案",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "schemedelbtn.click",
                                        pubs:[
                                            {
                                                event:"schemedelbtn.expression",
                                                meta: {
                                                    expression:`
                                                        resolveFetch({fetch:{id:"SchemePage",data:"@@formValues"}}).then(function (value) {
                                                            condition = value.hiddenParam
                                                            console.log(condition)
                                                            //let formValueArr = []
                                                            let formValue =[condition]
                                                            //formValueArr.push(formValue)

                                                                let dataSource= {
                                                              type: "api",
                                                              mode:"dataContext",
                                                              method: "POST",
                                                              url: "/sm/scheme/deleteByIds?"
                                                            };
                                                            resolveDataSourceCallback({dataSource:dataSource,eventPayload:formValue,dataContext:formValue},
                                                              function(res){
                                                                    pubsub.publish('tree.loadData');
                                                                    pubsub.publish('@@message.success',"删除成功")
                                                                    if(res.success){
                                                                     pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeCode" ,value: "" })
                                                                     pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeName" ,value: "" })
                                                                    }

                                                              },
                                                              function(){
                                                              }
                                                            )
                                                        })
                                                    `
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton  config={{
                                id: "save1",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                form: "SchemePage",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "save1.click",
                                        pubs:[
                                            {
                                                event: "schemecrebtn.visible",
                                                payload: true
                                            },{
                                                event: "schememodibtn.visible",
                                                payload: true
                                            },{
                                                event: "schemedelbtn.visible",
                                                payload: true
                                            },{
                                                event: "save1.visible",
                                                payload: false
                                            },{
                                                event: "cancle.visible",
                                                payload: false
                                            },{
                                                event: "tree.loadData"
                                            },{
                                                event: "schemeCode.enabled",
                                                payload: false
                                            },{
                                                event: "schemeName.enabled",
                                                payload: false
                                            },{
                                                event: "selbtn.visible",
                                                payload: false
                                            },{
                                                event:"save1.expression",
                                                meta: {
                                                    expression:`
                                                        resolveFetch({fetch:{id:"SchemePage",data:"@@formValues"}}).then(function (value) {
                                                                let  formValue = value;
                                                                  let params = {}
                                                                    let dataSource= {
                                                                  type: "api",
                                                                  mode:"dataContext",
                                                                  method: "POST",
                                                                  url: "/sm/scheme/add.action"
                                                                };
                                                                resolveDataSourceCallback({dataSource:dataSource,eventPayload:formValue,dataContext:formValue},
                                                                  function(res){
                                                                        pubsub.publish('tree.loadData');
                                                                        pubsub.publish('@@message.success',"新增成功")
                                                                        pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeCode" ,value: "" })
                                                                        pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeName" ,value: "" })
                                                                  },
                                                                  function(){
                                                                  }
                                                                )
                                                          })


                                                    `
                                                }
                                            },
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton  config={{
                                id: "save2",
                                title: "保存修改",
                                type: "primary",
                                size: "large",
                                form: "SchemePage",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "save2.click",
                                        pubs:[
                                            {
                                                event:"save2.expression",
                                                meta: {
                                                    expression:`
                                                     resolveFetch({fetch:{id:"SchemePage",data:"@@formValues"}}).then(function (value) {
                                                        console.log("修改 !11111111111111!!")
                                                        condition = value.hiddenParam

                                                            let formValue ={gid:condition,schemeCode:value.schemeCode,schemeName:value.schemeName,menuIds:value.menuIds}

                                                              let params = {}
                                                                let dataSource= {
                                                              type: "api",
                                                              mode:"dataContext",
                                                              method: "POST",
                                                              url: "/sm/scheme/modify?id=" + condition
                                                            };
                                                            resolveDataSourceCallback({dataSource:dataSource,eventPayload:formValue,dataContext:formValue},
                                                              function(res){
                                                                    pubsub.publish('tree.loadData');
                                                                    pubsub.publish('@@message.success',"修改成功")


                                                              },
                                                              function(){
                                                              }
                                                            )
                                                        })
                                                    `
                                                }
                                            },{
                                                event: "schemecrebtn.visible",
                                                payload: true
                                            },{
                                                event: "schememodibtn.visible",
                                                payload: true
                                            },{
                                                event: "schemedelbtn.visible",
                                                payload: true
                                            },{
                                                event: "selbtn.visible",
                                                payload: false
                                            },{
                                                event: "save1.visible",
                                                payload: false
                                            },{
                                                event: "save2.visible",
                                                payload: false
                                            },{
                                                event: "cancle.visible",
                                                payload: false
                                            },{
                                                event: "schemeCode.enabled",
                                                payload: false
                                            },{
                                                event: "schemeName.enabled",
                                                payload: false
                                            },{
                                                event: "tree.loadData"
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton  config={{
                                id: "cancle",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                form: "SchemePage",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cancle.click",
                                        pubs:[
                                            {
                                                event: "schemecrebtn.visible",
                                                payload: true
                                            },{
                                                event: "schememodibtn.visible",
                                                payload: true
                                            },{
                                                event: "schemedelbtn.visible",
                                                payload: true
                                            },{
                                                event: "save1.visible",
                                                payload: false
                                            },{
                                                event: "save2.visible",
                                                payload: false
                                            },{
                                                event: "cancle.visible",
                                                payload: false
                                            },{
                                                event: "schemeCode.enabled",
                                                payload: false
                                            },{
                                                event: "schemeName.enabled",
                                                payload: false
                                            },{
                                                event: "selbtn.visible",
                                                payload: false
                                            },{
                                                event:"cancle.expression",
                                                meta: {
                                                    expression:`
                                                    resolveFetch({fetch:{id:"SchemePage",data:"@@formValues"}}).then(function (value) {
                                                       /* console.log(value.hiddenParam)
                                                        console.log(typeof(value.hiddenParam)=="undefined")
                                                        if(typeof(value.hiddenParam)=="undefined"){
                                                            pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeCode" ,value: "" })
                                                            pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeName" ,value: "" })
                                                        }

                                                       })*/
                                                    `
                                                }
                                            },
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton  config={{
                                id: "selbtn",
                                title: "分配菜单",
                                type: "primary",
                                size: "large",
                                form: "SchemePage",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "selbtn.click",
                                        pubs:[{
                                            event: "addMenuPage.openModal",
                                        }]
                                    }
                                ]
                            }}>
                            </AppButton>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 6 }>
                            <Card bordered={true} style={{ width: "100%",  marginRight: "50px", marginTop: "20px", minHeight: "710px" }} bodyStyle={{ padding: "15px" }}>
                                <Field config={{
                                    id: 'tree',
                                    search: false,
                                    enabled: true,
                                    visible: true,
                                    // defaultExpandedKeys: ['0-0-0', '0-0-1'],
                                    // defaultSelectedKeys: ['0-0-0', '0-0-1'],
                                    // defaultCheckedKeys: ['0-0-0', '0-0-1'],
                                    checkable: false,
                                    showLine: true,
                                    draggable: false,
                                    searchBoxWidth: 300,
                                    subscribes: [
                                        {
                                            event:'tree.onSelect',
                                            pubs:[
                                                {
                                                    event: "schememodibtn.enabled",
                                                    payload: true
                                                },
                                                {
                                                    event: "schemedelbtn.enabled",
                                                    payload: true
                                                },{
                                                    event: "selbtn.visible",
                                                    payload: true
                                                },{
                                                    event: "selbtn.enabled",
                                                    payload: true
                                                },{
                                                    event:"tree.expression",
                                                    meta: {
                                                        expression:`
                                                        let condition = data.eventPayload.selectedKeys[0];


                                                        pubsub.publish("@@form.change",  { id: "SchemePage",name:"hiddenParam" ,value: condition })


                                                          let params = {}
                                                            let dataSource= {
                                                          type: "api",
                                                          mode:"dataContext",
                                                          method: "POST",
                                                          url: "/sm/scheme/findById?id=" + condition,
                                                        };
                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},
                                                          function(res){
                                                                if(res.success){
                                                                 pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeCode" ,value: fromJS(res.data.schemeCode) })
                                                                 pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeName" ,value: fromJS(res.data.schemeName) })
                                                                } else {
                                                                 pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeCode" ,value: "" })
                                                                 pubsub.publish("@@form.change",  { id: "SchemePage",name:"schemeName" ,value: "" })
                                                                }

                                                          },
                                                          function(){
                                                          }
                                                        )
                                                        `
                                                    }
                                                },{
                                                    event:"MenuTable.loadData",
                                                    eventPayloadExpression:`
                                                    console.log(eventPayload)
                                                     let condition = eventPayload.selectedKeys[0];
                                                     callback({schemeId:condition})
                                                    `
                                                }
                                            ]
                                        }
                                    ],
                                    dataSource: {
                                        type: "api",
                                        method: "POST",
                                        url: '/sm/scheme/queryForTree.action'
                                    }
                                }} name="tree"  component={ TreeField } />


                            </Card>
                        </Col>
                        <Col span={1}>
                        </Col>
                        <Col span={ 17 } >
                            <Card bordered={true} style={{ marginTop: "20px" }}>
                                <Row>
                                    <Col span={12}>
                                        <Field config={{
                                            enabled: false,
                                            id: "schemeCode",
                                            label: "方案编码",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            form: "SchemePage",
                                            showRequiredStar: true,  //是否显示必填星号
                                            placeholder: "请输入编码"
                                        }} component={TextField} name="schemeCode" />
                                    </Col>
                                    <Col span={12}>
                                        <Field config={{
                                            enabled: false,
                                            id: "schemeName",
                                            label: "方案名称",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            form: "SchemePage",
                                            showRequiredStar: true,  //是否显示必填星号
                                            placeholder: "请输入名称"
                                        }} component={TextField} name="schemeName" />
                                    </Col>
                                </Row>
                                <Row>
                                    {/*<Col span={12}>
                                        <Field config={{
                                            enabled: true,
                                            id: "schemesMenu",
                                            label: "选择菜单",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            form: "SchemePage",
                                            showRequiredStar: true,  //是否显示必填星号
                                            placeholder: "请选择菜单123222"
                                        }} component={TextField} name="schemesMenu" />
                                    </Col>*/}
                                    <Col span={12}>
                                        <Field config={{
                                            enabled: true,
                                            visible : false,
                                            id: "hiddenParam",
                                            label: "方案名称",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            form: "SchemePage",
                                            showRequiredStar: true,  //是否显示必填星号
                                            placeholder: "请输入名称"
                                        }} component={TextField} name="hiddenParam" />
                                    </Col>
                                </Row>
                                <AppTable name="MenuTable" config={{
                                    "id": "MenuTable",
                                    "name": "MenuTable",
                                  //  "type": "checkbox",//表格单选复选类型
                                    "size": "default",//表格尺寸
                                    "rowKey": "gid",//主键
                                    "onLoadData": false,//初始化是否加载数据
                                    "tableTitle": "菜单列表",//表头信息
                                    "width": 900,//表格宽度
                                    "showSerial": true,//是否显示序号
                                    "editType": true,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 10,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": true,//是否显示模糊查询
                                    "columns": [
                                        { title: '菜单编码', width: 100, dataIndex: 'menuCode', key: '1' },
                                        { title: '菜单名称', width: 100, dataIndex: 'menuName', key: '2' },

                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/sm/scheme/queryBySchemeId.action'
                                    }
                                }} />

                            </Card>
                        </Col>
                    </Row>
                </Card>

                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "addMenuPage", // id，必填*
                    pageId: "addMenuPage", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "选择菜单", // title，不传则不显示title
                    closable: true, // 是否显示右上角关闭按钮，默认不显示
                    width: "50%", // 宽度，默认520px
                    okText: "确定", // ok按钮文字，默认 确定
                    cancelText: "取消", // cancel按钮文字，默认 取消
                    style: {top: 120}, // style样式
                    wrapClassName: "wcd-center", // class样式
                    hasFooter: false, // 是否有footer，默认 true
                    maskClosable: true, // 点击蒙层是否允许关闭，默认 true
                }}
                >

                    <MenuTreeModal/>
                </ModalContainer>
            </div>
        );
    }
}



SchemePage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
    form: "SchemePage",
    validate,
})(SchemePage)