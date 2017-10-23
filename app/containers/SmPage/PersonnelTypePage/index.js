/*
 *
 * 人员分类
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col} from 'antd';
import {Link} from 'react-router';
import pubsub from 'pubsub-js'
import AppButton from 'components/AppButton';
import TreeField from 'components/Form/TreeField';
import TextField from 'components/Form/TextField';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import FindbackField from 'components/Form/FindbackField';


export class PersonnelTypePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function



    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>人员分类</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true}
                      style={{"marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px"}}
                      bodyStyle={{
                          "paddingTop": "10px",
                          "paddingBottom": "10px",
                          "paddingLeft": "25px",
                          "paddingRight": "25px"
                      }}>
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
                                        event: 'createBtn.click',
                                        pubs:
                                            [
                                                {
                                                    event: "createBtn.expression",
                                                    meta: {
                                                        expression: `
                                                                     resolveFetch({fetch: {id: "PersonnelTypeForm", data: "@@formValues"}}).then(function (value) {
                                                                        //console.log(value);
                                                                        let fullData = value;
                                                                        let formData = {};
                                                                        if (fullData&&fullData.treeNode) {
                                                                            let treeNode = fullData.treeNode;
                                                                            formData.treeNode = treeNode;
                                                                            formData.smPersonnelTypeGid = treeNode.id;
                                                                        }
                                                                        pubsub.publish("@@form.init", {id: "PersonnelTypeForm", data: formData});
                                                                        if (fullData.treeNode) {
                                                                            pubsub.publish("smPersonnelTypeGid.setDisplayValue", fullData.treeNode.text);
                                                                        }

                                                                    })

                                                                    `
                                                    }
                                                },
                                                {
                                                    event: "personnelTypeCode.enabled",
                                                    payload: true
                                                },
                                                {
                                                    event: "personnelTypeName.enabled",
                                                    payload: true
                                                },
                                                {
                                                    event: "smPersonnelTypeGid.enabled",
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
                                                    event: "delBtn.visible",
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
                                                event: "personnelTypeCode.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "personnelTypeName.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "smPersonnelTypeGid.enabled",
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
                                                event: "delBtn.visible",
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
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "delBtn",
                                title: "删除",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: 'delBtn.click',
                                        pubs:
                                            [
                                                {
                                                    event: "delBtn.expression",
                                                    meta: {
                                                        expression: `
                                                                     resolveFetch({fetch:{id:"PersonnelTypeForm",data:"@@formValues"}}).then(function (value) {
                                                                        //console.log(value);

                                                                        if((value.treeNode)&&(value.treeNode.childs)&&(value.treeNode.childs.length>0)){
                                                                             pubsub.publish("@@message.error", "当前节点有叶子节点不能删除");
                                                                        }else{

                                                                            let dataSource = {
                                                                                type: "api",
                                                                                method: "POST",
                                                                                url: "/sm/personnelType/delete.action?id=" + value.treeNode.id
                                                                            };
                                                                            //回调函数
                                                                            let callBack = function (response) {
                                                                                if (response.success) {
                                                                                    pubsub.publish("@@message.success", "删除成功");
                                                                                    pubsub.publish("personnelTypeTree.loadData");
                                                                                } else {
                                                                                    pubsub.publish("@@message.error", response.data);
                                                                                }
                                                                            }
                                                                            resolveDataSourceCallback({dataSource: dataSource, eventPayload: {}, dataContext: {}}, callBack);

                                                                        }
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
                                id: "saveBtn",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: false,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "saveBtn.click",
                                        behaviors:
                                            [
                                                {
                                                    type: "request",
                                                    dataSource: {
                                                        type: "api",
                                                        method: "POST",
                                                        url: "/sm/personnelType/createOrUpdate.action",
                                                        withForm: "PersonnelTypeForm"
                                                    },
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "@@message.success",
                                                            payload: "保存成功"
                                                        },
                                                        {
                                                            event: "personnelTypeCode.enabled",
                                                            payload: false
                                                        },
                                                        {
                                                            event: "personnelTypeName.enabled",
                                                            payload: false
                                                        },
                                                        {
                                                            event: "smPersonnelTypeGid.enabled",
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
                                                            event: "delBtn.visible",
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
                                                            event: "personnelTypeTree.loadData"
                                                        }
                                                    ],
                                                    errorPubs: [
                                                        {
                                                            event: "@@message.error",
                                                            payload: "保存失败"
                                                        }
                                                    ]
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
                                                event: "personnelTypeCode.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "personnelTypeName.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "smPersonnelTypeGid.enabled",
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
                                                event: "delBtn.visible",
                                                payload: true
                                            },
                                            {
                                                event: "saveBtn.visible",
                                                payload: false
                                            },
                                            {
                                                event: "cancelBtn.visible",
                                                payload: false
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
                    <Col span={7}>
                        <Card bordered={true}
                              style={{width: "100%", marginRight: "20px", marginTop: "20px", minHeight: "710px"}}
                              bodyStyle={{padding: "15px"}}>

                            <row>
                                <Field config={{
                                    id: 'personnelTypeTree',
                                    form: "PersonnelTypeForm",
                                    search: true,
                                    enabled: true,
                                    visible: true,
                                    checkable: false,
                                    showLine: false,
                                    draggable: false,
                                    searchBoxWidth: 200,
                                    dataSource: {
                                        type: "api",
                                        method: "POST",
                                        url: '/sm/personnelType/queryTree.action'
                                    },
                                    subscribes: [
                                        {
                                            event: 'personnelTypeTree.onSelect',
                                            pubs: [
                                                {
                                                    event: "personnelTypeTree.expression",
                                                    meta: {
                                                        expression: `
                                                                    let treeNode = data.eventPayload.info.node.props["data-item"];

                                                                    //console.log(treeNode);
                                                                    let id = treeNode.id;
                                                                    if (id != '0') {
                                                                        pubsub.publish("createBtn.dataContext",id);

                                                                        //回填表单
                                                                        let dataSource = {
                                                                            type: "api",
                                                                            method: "POST",
                                                                            url: "/sm/personnelType/findById.action?id=" + id
                                                                        };
                                                                        //回调函数
                                                                        let callBack = function (response) {
                                                                            if (response.success) {
                                                                                let modifyData = response.data;
                                                                                modifyData.treeNode = treeNode;
                                                                                //console.log(modifyData);
                                                                                pubsub.publish("@@form.init", {id: "PersonnelTypeForm", data: modifyData});
                                                                                if (modifyData.smPersonnelTypeGidRef && modifyData.smPersonnelTypeGidRef.personnelTypeName) {
                                                                                    pubsub.publish("smPersonnelTypeGid.setDisplayValue", modifyData.smPersonnelTypeGidRef.personnelTypeName)
                                                                                }
                                                                            } else {
                                                                                pubsub.publish("@@message.error", response.data);
                                                                            }
                                                                        }
                                                                        resolveDataSourceCallback({dataSource: dataSource, eventPayload: {}, dataContext: {}}, callBack);
                                                                    }
                                                                    `
                                                    }
                                                },
                                                {
                                                    event: "modifyBtn.enabled",
                                                    payload: true
                                                },
                                                {
                                                    event: "delBtn.enabled",
                                                    payload: true
                                                }
                                            ]

                                        }
                                    ]
                                }} name="personnelTypeTree" component={TreeField}/>
                            </row>
                        </Card>
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={16}>
                        <Card bordered={true}
                              style={{width: "100%", marginRight: "20px", marginTop: "20px", minHeight: "710px"}}
                              bodyStyle={{padding: "15px"}}>
                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        form: "PersonnelTypeForm",
                                        id: "personnelTypeCode",
                                        label: "分类编码",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入分类编码"
                                    }} component={TextField} name="personnelTypeCode"/>
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        form: "PersonnelTypeForm",
                                        id: "personnelTypeName",
                                        label: "分类名称",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "分类名称"
                                    }} component={TextField} name="personnelTypeName"/>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "smPersonnelTypeGid",
                                        form: "PersonnelTypeForm",
                                        label: "上级分类",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请选择上级分类",
                                        tableInfo: {
                                            id: "smPersonnelTypeGidFindBackTable",
                                            size: "small",
                                            rowKey: "gid",
                                            width: 300,
                                            tableTitle: "人员分类",
                                            columns: [
                                                {title: '分类名称', dataIndex: 'personnelTypeName', key: '2', width: 200},
                                                {title: '分类编码', dataIndex: 'personnelTypeCode', key: '1', width: 200}
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/sm/personnelType/queryFindBack.action',
                                                bodyExpression: `
                                                    resolveFetch({fetch: {id: "PersonnelTypeForm", data: "@@formValues"}}).then(function (data) {
                                                        let id='';
                                                        if(data&&data.gid){
                                                            id=data.gid
                                                        }
                                                        //console.log(id);
                                                        callback(id);
                                                    })
                                                    `
                                            }
                                        },
                                        pageId: 'smPersonnelTypeGidFindBackTablePage',
                                        displayField: "personnelTypeName",
                                        valueField: {
                                            "from": "gid",
                                            "to": "smPersonnelTypeGid"
                                        }
                                    }} component={FindbackField} name="smPersonnelTypeGid"/>

                                </Col>
                                <Col span={12}>

                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

PersonnelTypePage.propTypes = {
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


let Form = reduxForm({
    form: "PersonnelTypeForm"
})(PersonnelTypePage)

export default connect(mapStateToProps, mapDispatchToProps)(Form);
