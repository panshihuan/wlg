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
import GroupManageModal from './GroupManage'
import OrderRepealModal from './GroupManage'

const validate = values => {
    const errors = {}
    if (!values.get('busiGroupCode')) {
        errors.busiGroupCode = '必填项'
    }
    return errors
}

export class BusiGroupPage extends React.PureComponent {

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
                    <Breadcrumb.Item>系统管理5</Breadcrumb.Item>
                    <Breadcrumb.Item>业务组</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={8} xs={24}>
                            <AppButton config={{
                                id: "sm00000001",
                                title: "创建",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "sm00000001.click",
                                        pubs: [
                                            {
                                                event:"busigroup.expression",
                                                meta: {
                                                    expression:`
                                                        console.log("xinjian !!!!!!!")
                                                        pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"busiGroupCode" ,value: "" })
                                                        pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"creationDate" ,value: "" })
                                                        pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"busiGroupName" ,value: "" })
                                                        pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"phone" ,value: "" })
                                                        pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"active" ,value: 1 })
                                                        pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"descr" ,value: "" })
                                                    `
                                                }
                                            },
                                            {
                                                event: "busiGroupCode.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "creationDate.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "busiGroupName.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "phone.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "parentGidRefBusiGroupName.enabled",
                                                payload: true
                                            },
                                           /* {
                                                event: "active.enabled",
                                                payload: true
                                            },*/
                                            {
                                                event: "descr.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "sm00000001.visible",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000002.visible",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000003.visible",
                                                payload: true
                                            },
                                            {
                                                event: "sm00000004.visible",
                                                payload: true
                                            },{
                                                event: "sm00000005.visible",
                                                payload: false
                                            },{
                                                event: "delbtn.visible",
                                                payload: false
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "sm00000002",
                                title: "修改",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "sm00000002.click",
                                        pubs: [
                                            {
                                                event: "busiGroupCode.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "creationDate.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "busiGroupName.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "phone.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "parentGidRefBusiGroupName.enabled",
                                                payload: true
                                            },
                                            /*{
                                                event: "active.enabled",
                                                payload: true
                                            },*/
                                            {
                                                event: "descr.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "sm00000001.visible",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000002.visible",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000005.visible",
                                                payload: true
                                            },
                                            {
                                                event: "sm00000004.visible",
                                                payload: true
                                            },{
                                                event: "delbtn.visible",
                                                payload: false
                                            }

                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "delbtn",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "delbtn.click",
                                        pubs: [
                                            {
                                                event:"busigroup.expression",
                                                meta: {
                                                    expression:`
                                                            console.log("retr34543")
                                                           resolveFetch({fetch:{id:"BusiGroupPage",data:"@@formValues"}}).then(function (value) {
                                                                   if(typeof(value.selectnode.childs)!="undefined"){
                                                                     console.log("aaabbb")
                                                                    pubsub.publish('@@message.success',"有子节点无法删除上级节点")
                                                                    return;
                                                                   }

                                                                   let id = value.hiddenpara;
                                                                let dataSource = {
                                                                        type: "api",
                                                                        method: "POST",
                                                                        url: "/sm/busiGroup/delete.action?id="+id
                                                                      }
                                                                      resolveDataSource({dataSource:dataSource}).then((function(response){
                                                                        if(response.success) {
                                                                          pubsub.publish("@@message.success","删除成功");
                                                                           pubsub.publish('tree.loadData');
                                                                        } else {
                                                                          pubsub.publish("@@message.error","删除失败");
                                                                        }
                                                                        //pubsub.publish("order-unique-rule-show.show")
                                                                      }).bind(this))
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
                                id: "sm00000003",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "sm00000003.click",
                                        pubs: [
                                            {
                                                event:"busigroup.expression",
                                                meta: {
                                                    expression:`
                                                            console.log("1233333asas")
                                                           resolveFetch({fetch:{id:"BusiGroupPage",data:"@@formValues"}}).then(function (value) {
                                                                   console.log("fffffffffffff")
                                                                   console.log(value)
                                                                   let id = value.hiddenpara;

                                                                  let  formValue = value;
                                                                   console.log(formValue)
                                                                  let params = {}
                                                                  let dataSource= {
                                                                  type: "api",
                                                                  mode:"dataContext",
                                                                  method: "POST",
                                                                  url: "/sm/busiGroup/add.action"
                                                                };
                                                                resolveDataSourceCallback({dataSource:dataSource,eventPayload:formValue,dataContext:formValue},
                                                                  function(res){
                                                                        pubsub.publish('tree.loadData');
                                                                        pubsub.publish('@@message.success',"新增成功")
                                                                  },
                                                                  function(){
                                                                  }
                                                                )
                                                          })
                                                    `
                                                }
                                            },
                                            {
                                                event: "busiGroupCode.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "creationDate.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "busiGroupName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "phone.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "parentGidRefBusiGroupName.enabled",
                                                payload: false
                                            },
                                           /* {
                                                event: "active.enabled",
                                                payload: false
                                            },*/
                                            {
                                                event: "descr.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000001.visible",
                                                payload: true
                                            },
                                            {
                                                event: "sm00000002.visible",
                                                payload: true
                                            },
                                            {
                                                event: "sm00000003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000004.visible",
                                                payload: false
                                            }, {
                                                event: "sm00000005.visible",
                                                payload: false
                                            },{
                                                event: "delbtn.visible",
                                                payload: true
                                            }
                                        ]
                                    }

                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "sm00000005",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "sm00000005.click",
                                        pubs: [
                                            {
                                                event:"busigroup.expression",
                                                meta: {
                                                    expression:`
                                                           resolveFetch({fetch:{id:"BusiGroupPage",data:"@@formValues"}}).then(function (value) {

                                                                   if(typeof(value.selectnode.childs)!="undefined"){

                                                                    pubsub.publish('@@message.success',"有子节点无法修改上级节点")
                                                                    return;
                                                                   }

                                                                   let id = value.hiddenpara;

                                                                    console.log(!value.phone)
                                                                   if(!value.phone){
                                                                    value.phone=""
                                                                   }
                                                                     let  formValue = value;
                                                                  let params = {}
                                                                    let dataSource= {
                                                                  type: "api",
                                                                  mode:"dataContext",
                                                                  method: "POST",
                                                                  url: "/sm/busiGroup/modify.action?id=" + id,
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
                                            },
                                            {
                                                event: "busiGroupCode.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "creationDate.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "busiGroupName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "phone.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "parentGidRefBusiGroupName.enabled",
                                                payload: false
                                            },
                                           /* {
                                                event: "active.enabled",
                                                payload: false
                                            },*/
                                            {
                                                event: "descr.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000001.visible",
                                                payload: true
                                            },
                                            {
                                                event: "sm00000002.visible",
                                                payload: true
                                            },
                                            {
                                                event: "sm00000003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000004.visible",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000005.visible",
                                                payload: false
                                            },{
                                                event: "delbtn.visible",
                                                payload: true
                                            }
                                        ]
                                    }

                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "sm00000004",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "sm00000004.click",
                                        pubs: [
                                            {
                                                event: "busiGroupCode.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "creationDate.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "busiGroupName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "phone.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "parentGidRefBusiGroupName.enabled",
                                                payload: false
                                            },
                                            /*{
                                                event: "active.enabled",
                                                payload: false
                                            },*/
                                            {
                                                event: "descr.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000001.visible",
                                                payload: true
                                            },
                                            {
                                                event: "sm00000002.visible",
                                                payload: true
                                            },
                                            {
                                                event: "sm00000003.visible",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000004.visible",
                                                payload: false
                                            },
                                            {
                                                event: "sm00000005.visible",
                                                payload: false
                                            },{
                                                event: "delbtn.visible",
                                                payload: true
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
                    <Col span={ 5 }>
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
                                dataSource: {
                                    type: "api",
                                    method: "POST",
                                    url: '/sm/busiGroup/queryTree.action'
                                }
                            }} name="tree"  component={ TreeField } />
                        </Card>
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={ 18 } >
                        <Card bordered={true} style={{ marginTop: "20px" }}>
                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "busiGroupCode",
                                        label: "业务组编码",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        form: "BusiGroupPage",
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入编码"
                                    }} component={TextField} name="busiGroupCode" />
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "creationDate",
                                        label: "成立时间",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        form: "BusiGroupPage",
                                        placeholder: "请输入"
                                    }} component={DateField} name="creationDate" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "busiGroupName",
                                        label: "业务组名称",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        form: "BusiGroupPage",
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入编码"
                                    }} component={TextField} name="busiGroupName" />
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "phone",
                                        label: "联系方式",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        form: "BusiGroupPage",
                                        placeholder: "请输入"
                                    }} component={TextField} name="phone" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "parentGidRefBusiGroupName",
                                        label: "上级业务组",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        form: "BusiGroupPage",
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入编码",

                                        tableInfo: {
                                            id: "parentGidRefBusiGroupNameFindBackTable",
                                            size: "small",
                                            rowKey: "gid",
                                            width:"500",
                                            tableTitle: "上级业务组",
                                            columns: [
                                                { title: '业务组名称', dataIndex: 'busiGroupName', key: '2', width: 200 },
                                                { title: '业务组编码', dataIndex: 'busiGroupCode', key: '1', width: 200 },
                                                { title: '业务组ID', dataIndex: 'gid', key: '3', width: 230 }
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/sm/busiGroup/query.action',
                                            }
                                        },
                                        pageId: 'parentGidRefBusiGroupNameFindBackTablePage',
                                        displayField: "busiGroupName",
                                        valueField: {
                                            "from": "busiGroupName",
                                            "to": "parentGidRef.busiGroupName"
                                        },
                                        associatedFields: [
                                            {
                                                "from": "gid",
                                                "to": "parentGid"
                                            },
                                        ]




                                    }} component={FindbackField} name="parentGidRef.busiGroupName" />
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "active",
                                        label: "是否启用",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        form: "BusiGroupPage",
                                        checkedChildren: 1,
                                        unCheckedChildren: 0
                                    }} component={SwitchField} name="active" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Field config={{
                                        enabled: false,
                                        id: "descr",
                                        label: "简介",  //标签名称
                                        labelSpan: 4,   //标签栅格比例（0-24）
                                        wrapperSpan: 20,  //输入框栅格比例（0-24）
                                        form: "BusiGroupPage",
                                        showRequiredStar: false,  //是否显示必填星号
                                        placeholder: "请输入编码"
                                    }} component={TextAreaField} name="descr" />
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        visible : false,
                                        id: "hiddenpara",
                                        label: "隐藏参数",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        form: "BusiGroupPage",
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入编码"
                                    }} component={TextField} name="hiddenpara" />
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={1}>
                    </Col>
                    <Col span={18}>
                        {/*<Card bordered={true} style={{marginTop: "20px" ,"backgroundColor": "rgba(247, 247, 247, 1)"}}>*/}
                        <Card bordered={true} style={{ "marginTop":"20px","backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                              bodyStyle={{ "paddingTop": "10px","paddingLeft": "25px", "paddingRight": "25px" }}>
                            <AppButton config={{
                                id: "xz00000001",
                                title: "新增",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "xz00000001.click",
                                        pubs: [
                                            {
                                                event:"busigroup.expression",
                                                meta: {
                                                    expression:`
                                                           resolveFetch({fetch:{id:"BusiGroupPage",data:"@@formValues"}}).then(function (value) {

                                                                if(value == undefined){
                                                                     pubsub.publish('@@message.error',"请选择要新增管理员用户的业务组！")
                                                                } else{
                                                                    pubsub.publish('addGroupManagePage.openModal');
                                                                }
                                                          })
                                                    `
                                                }
                                            },
                                          /*  {
                                                event: "addGroupManagePage.openModal",
                                            }*/
                                        ]
                                    }

                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "sc00000004",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "sc00000004.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    paramsInQueryString: false,//参数拼在url后面
                                                    url: "/sm/busiGroupUser/deleteByIds.action",
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
                                                        event: "busigroup.expression",
                                                        meta: {
                                                            expression: `
                                                                console.log("删除");
                                                                resolveFetch({fetch:{id:"BusiGroupPage",data:"@@formValues"}}).then(function (value) {
                                                                    selectedBusiGroupId = value.hiddenpara;

                                                                    //刷新表格
                                                                    let params = {
                                                                      "query": {
                                                                        "query": [
                                                                           {
                                                                                "left":"(",
                                                                                "field":"smBusiGroupGid",
                                                                                "type":"eq",
                                                                                "value":selectedBusiGroupId,
                                                                                "right":")",
                                                                                "operator":"and"
                                                                           }
                                                                         ],
                                                                         "sorted":"gid asc"
                                                                      }
                                                                    }

                                                                    let dataSource= {
                                                                      type: "api",
                                                                      method: "POST",
                                                                      url: "/sm/busiGroupUser/query"
                                                                    };

                                                                    resolveDataSourceCallback(
                                                                        {
                                                                            dataSource:dataSource,eventPayload:{},dataContext:params
                                                                        },
                                                                      function(res){
                                                                        me.setState({dataSource:res.data})
                                                                      },
                                                                      function(){
                                                                      }
                                                                    )

                                                                });
                                                            `
                                                        }
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
                                    }

                                ]
                            }}>
                            </AppButton>
                        </Card>
                    </Col>


                    <Col span={1}>
                    </Col>
                    <Col span={ 18 }>
                        <Card bordered={true}>
                            <AppTable name="busigroup" config={{
                                "id": "busigroup",
                                "name": "busigroup",
                                "type": "checkbox",//表格单选复选类型
                                "size": "default",//表格尺寸
                                "rowKey": "gid",//主键
                                "onLoadData": true,//初始化是否加载数据
                                "tableTitle": "业务组",//表头信息
                                "width": 800,//表格宽度
                                "showSerial": false,//是否显示序号
                                "editType": false,//是否增加编辑列
                                "page": 1,//当前页
                                "pageSize": 10,//一页多少条
                                "isPager": true,//是否分页
                                "isSearch": true,//是否显示模糊查询
                                "columns": [
                                    { title: '业务组管理员名称', width: 150, dataIndex: 'smUserGidRef.userName', key: '1' },
                                    { title: '所属业务组', width: 150, dataIndex: 'smBusiGroupGidRef.busiGroupName', key: '2' },
                                    { title: '管理生效时间', width: 150, dataIndex: 'startTime', key: '3' },
                                    { title: '管理失效时间', width: 150, dataIndex: 'endTime', key: '4' }
                                ],
                                subscribes: [
                                    {
                                        event:'busigroup.onSelectedRows',
                                        pubs:[
                                            {
                                                event:'sc00000004.dataContext'
                                            }
                                        ]
                                    },
                                    {
                                        event:'tree.onSelect',
                                        pubs:[
                                            {
                                                event: "sm00000002.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "delbtn.enabled",
                                                payload: true
                                            },
                                            {
                                                event:"busigroup.expression",
                                                meta: {
                                                    expression:`
                                                    //console.log(data.eventPayload.selectNode.childs)
                                                        let condition = data.eventPayload.selectedKeys[0];
                                                        pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"hiddenpara" ,value: condition })
                                                        pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"selectnode" ,value: data.eventPayload.selectNode })


                                                        //回填表单
                                                        let dataSource= {
                                                          type: "api",
                                                          mode:"dataContext",
                                                          method: "POST",
                                                          url: "/sm/busiGroup/findById.action?id="+condition
                                                        };
                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:data.eventPayload,dataContext:params},
                                                          function(res){
                                                            pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"descr" ,value: "" })
                                                            pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"phone" ,value: "" })

                                                            pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"busiGroupCode" ,value: fromJS(res.data.busiGroupCode) })
                                                            pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"creationDate" ,value: fromJS(res.data.creationDate) })
                                                            pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"busiGroupName" ,value: fromJS(res.data.busiGroupName) })
                                                            pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"phone" ,value: fromJS(res.data.phone) })
                                                            pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"active" ,value: fromJS(res.data.active) })
                                                            pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"descr" ,value: fromJS(res.data.descr) })

                                                            //  pubsub.publish("@@form.init", {id: "BusiUnitForm", data: Immutable.fromJS(res.data)})
                                                          },
                                                          function(){
                                                          }
                                                        )

                                                        //刷新表格
                                                            let params = {
                                                                    "pager": {
                                                                        "page": 1,
                                                                        "pageSize": 10
                                                                    },
                                                                    "query": {
                                                                        "query": [
                                                                            {
                                                                                "left": "(",
                                                                                "field": "smBusiGroupGid",
                                                                                "type": "eq",
                                                                                "value": condition,
                                                                                "right": ")",
                                                                                "operator": "and"
                                                                            }
                                                                        ]
                                                                    },
                                                                    "sorted": "gid asc"
                                                                }
                                                         let dataSource= {
                                                          type: "api",
                                                          mode:"dataContext",
                                                          method: "POST",
                                                          url: "/sm/busiGroupUser/query"
                                                        };
                                                        resolveDataSourceCallback({dataSource:dataSource,eventPayload:data.eventPayload,dataContext:params},
                                                          function(res){
                                                            /*console.log(me)
                                                            me.setState({dataSource:res.data})*/
                                                            pubsub.publish("busigroup.loadData",params);
                                                          },
                                                          function(){
                                                          }
                                                        )
                                                    `
                                                }
                                            }
                                        ]
                                        /*behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    //paramsInQueryString: true,//参数拼在url后面
                                                    url: "/sm/busiGroup/findById.action",
                                                    mode:"payload",
                                                    payload: [{
                                                        "query":{
                                                            "query":{
                                                                "field":"id",
                                                                "type":"eq",
                                                                "value":"563C1A975464568BE055000000000001"
                                                            }
                                                        }
                                                    }]
                                                },
                                                successPubs: [
                                                    {
                                                        outside: true,
                                                        event: "busigroup.loadData"
                                                    }
                                                ]
                                            }
                                        ]*/
                                    }
                                ],
                                dataSource: {
                                    type: 'api',
                                    method: 'post',
                                    url: '/sm/busiGroupUser/query'
                                }
                            }} />
                        </Card>
                    </Col>

                </Row>
                <ModalContainer config={{
                    visible: false, // 是否可见，必填*
                    enabled: true, // 是否启用，必填*
                    id: "addGroupManagePage", // id，必填*
                    pageId: "addGroupManagePage", // 指定是哪个page调用modal，必填*
                    type: "modal", // 默认modal模式，即modal容器，也可选 info success error warning confirm
                    title: "新增业务组管理员", // title，不传则不显示title
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
                    <GroupManageModal config={{
                        id:'OrderSplitModal-secend-config'
                    }}>
                    </GroupManageModal>
                </ModalContainer>
            </div>
        );
    }
}



BusiGroupPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
    form: "BusiGroupPage",
    validate,
})(BusiGroupPage)