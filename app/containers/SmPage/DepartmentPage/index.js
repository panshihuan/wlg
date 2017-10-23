/*
 *
 * BusiUnitPage
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Card, Row, Col} from 'antd';
import {Link} from 'react-router';
import pubsub from 'pubsub-js'
import AppButton from 'components/AppButton';
import FindbackField from 'components/Form/FindbackField';
import TreeField from 'components/Form/TreeField';
import TextField from 'components/Form/TextField';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import TreeSelectField from 'components/Form/TreeSelectField';


const validate = values => {
    const errors = {}
    if (!values.get('code')) {
        errors.code = '必填项'
    }
    if (!values.get('name')) {
        errors.name = '必填项'
    }
    return errors
}


export class DepartmentPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function


    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>部门管理</Breadcrumb.Item>
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
                                        event: "createBtn.click",
                                        pubs: [
                                            {
                                                //表达式 给业务单元和上级部门赋值
                                                event: "createBtn.expression",
                                                meta: {
                                                    expression: `
                                                    let formData = {};
                                                    let callBack = function(value){
                                                        //console.log(value, "业务单元gid");
                                                        if (value&&value.busiUnit) {
                                                            formData.busiUnit = value.busiUnit;
                                                            formData.smBusiUnitGid = value.busiUnit;
                                                        }else{
                                                             pubsub.publish("smBusiUnitGid.setDisplayValue", '');
                                                        }
                                                        if (dataContext) {
                                                            formData.smDepartmentGid = dataContext;
                                                        }

                                                        //清空表单
                                                        pubsub.publish("@@form.init", {id: "DepartmentForm", data: formData});
                                                        pubsub.publish("smDepartmentGid.setDisplayValue", '');
                                                    }
                                                    resolveFetch({fetch: {id: "DepartmentForm", data: "@@formValues"}}).then(callBack);
                                                    //回填表单
                                                    let dataSource = {
                                                        type: "api",
                                                        method: "POST",
                                                        url: "/sm/department/findById.action?id=" + dataContext
                                                    };

                                                    let callBack2 = function(response){
                                                        if(response.success){
                                                            if (response.data.name) {
                                                                pubsub.publish("smDepartmentGid.setDisplayValue", response.data.name);
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
                                            },
                                            {
                                                event: "smDepartmentGid.enabled",
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
                                                event: "code.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "name.enabled",
                                                payload: true
                                            },
                                            {
                                                event: "smDepartmentGid.enabled",
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
                                                                     resolveFetch({fetch:{id:"DepartmentForm",data:"@@formValues"}}).then(function (value) {
                                                                        //console.log(value);
                                                                        if((value.treeNode)&&(value.treeNode.childs)&&(value.treeNode.childs.length>0)){
                                                                            pubsub.publish("@@message.error", "当前节点有叶子节点不能删除");
                                                                        }else{

                                                                            let dataSource = {
                                                                                type: "api",
                                                                                method: "POST",
                                                                                url: "/sm/department/delete.action?id=" + value.treeNode.id
                                                                            };
                                                                            //回调函数
                                                                            let callBack = function (response) {
                                                                                if (response.success) {
                                                                                    pubsub.publish("@@message.success", "删除成功");
                                                                                    pubsub.publish("departmentTree.loadData");
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
                                                        url: "/sm/department/createOrUpdate.action",
                                                        withForm: "DepartmentForm"
                                                    },
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "@@message.success",
                                                            payload: "修改成功"
                                                        },
                                                        {
                                                            event: "code.enabled",
                                                            payload: false
                                                        },
                                                        {
                                                            event: "name.enabled",
                                                            payload: false
                                                        },
                                                        {
                                                            event: "smBusiUnitGid.enabled",
                                                            payload: false
                                                        },
                                                        {
                                                            event: "smDepartmentGid.enabled",
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
                                                            event: "departmentTree.loadData"
                                                        }
                                                    ],
                                                    errorPubs: [
                                                        {
                                                            event: "@@message.error",
                                                            payload: "修改失败"
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
                                                event: "code.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "name.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "smBusiUnitGid.enabled",
                                                payload: false
                                            },
                                            {
                                                event: "smDepartmentGid.enabled",
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
                            <Row>
                                <Field config={{
                                    enabled: true,
                                    id: "busiUnit",
                                    form: "DepartmentForm",
                                    label: "业务单元",  //标签名称
                                    labelSpan: 6,   //标签栅格比例（0-24）
                                    wrapperSpan: 18,  //输入框栅格比例（0-24）
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
                                                    //console.log("abc",data);
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
                                                                pubsub.publish("departmentTree.setTreeData",response.data);
                                                            }else{
                                                                //console.log("业务单元未选择");
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
                            </Row>

                            <row>
                                <Field config={{
                                    id: 'departmentTree',
                                    search: false,
                                    enabled: true,
                                    visible: true,
                                    checkable: false,
                                    showLine: false,
                                    draggable: false,
                                    searchBoxWidth: 200,
                                    onLoadData: false,
                                    dataSource: {
                                        type: "api",
                                        method: "POST",
                                        url: '/sm/department/queryTree.action'
                                    }, subscribes: [
                                        {
                                            event: 'departmentTree.onSelect',
                                            pubs: [
                                                {
                                                    event: "departmentTree.expression",
                                                    meta: {
                                                        expression: `
                                                        //console.log("部门树节点",data);
                                                        let treeNode = data.eventPayload.info.node.props["data-item"];
                                                        let condition = data.eventPayload.selectedKeys[0];
                                                        if(condition!='0'){
                                                            let  myData = {};
                                                            resolveFetch({fetch:{id:"DepartmentForm",data:"@@formValues"}}).then(function (value) {
                                                                //console.log(value,"表单数据");
                                                                myData = value;
                                                            });
                                                            pubsub.publish("createBtn.dataContext",{eventPayload:condition});
                                                            //回填表单
                                                            let dataSource= {
                                                                type: "api",
                                                                method: "POST",
                                                                url: "/sm/department/findById.action?id="+condition
                                                            };

                                                             //回调函数
                                                            let callBack = function(response){
                                                                if(response.success){
                                                                    //pubsub.publish("@@message.success","操作成功");
                                                                    let modifyData = response.data;

                                                                    if(myData&&myData.busiUnit){
                                                                        modifyData.busiUnit = myData.busiUnit;
                                                                    }
                                                                    modifyData.treeNode = treeNode;
                                                                    pubsub.publish("@@form.init", {id: "DepartmentForm", data: modifyData});
                                                                    if (modifyData.smBusiUnitGidRef && modifyData.smBusiUnitGidRef.busiUnitName) {
                                                                        pubsub.publish("smBusiUnitGid.setDisplayValue", modifyData.smBusiUnitGidRef.busiUnitName)
                                                                    }else{
                                                                        pubsub.publish("smBusiUnitGid.setDisplayValue", '');
                                                                    }

                                                                    if (modifyData.smDepartmentGidRef && modifyData.smDepartmentGidRef.name) {
                                                                        pubsub.publish("smDepartmentGid.setDisplayValue", modifyData.smDepartmentGidRef.name);
                                                                    }else{
                                                                        pubsub.publish("smDepartmentGid.setDisplayValue", '');
                                                                    }

                                                                }else{
                                                                    pubsub.publish("@@message.error",response.data);
                                                                }
                                                            }
                                                             resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},callBack);


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
                                }} name="departmentTree" component={TreeField}/>
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
                                        form: "DepartmentForm",
                                        id: "code",
                                        label: "部门编码",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入编码"
                                    }} component={TextField} name="code"/>
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        form: "DepartmentForm",
                                        id: "name",
                                        label: "部门名称",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请输入名称"
                                    }} component={TextField} name="name"/>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "smBusiUnitGid",
                                        form: "DepartmentForm",
                                        label: "业务单元",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请选择业务单元",
                                        tableInfo: {
                                            id: "smBusiUnitGidFindBackTable",
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
                                        pageId: 'smBusiUnitGidFindBackTablePage',
                                        displayField: "busiUnitName",
                                        valueField: {
                                            "from": "gid",
                                            "to": "smBusiUnitGid"
                                        }
                                    }} component={FindbackField} name="smBusiUnitGid"/>
                                </Col>
                                <Col span={12}>
                                    <Field config={{
                                        enabled: false,
                                        id: "smDepartmentGid",
                                        form: "DepartmentForm",
                                        label: "上级部门",  //标签名称
                                        labelSpan: 8,   //标签栅格比例（0-24）
                                        wrapperSpan: 16,  //输入框栅格比例（0-24）
                                        showRequiredStar: true,  //是否显示必填星号
                                        placeholder: "请选择部门",
                                        tableInfo: {
                                            id: "smDepartmentGidFindBackTable",
                                            size: "small",
                                            rowKey: "gid",
                                            width: 300,
                                            tableTitle: "业务单元",
                                            columns: [
                                                {title: '部门名称', dataIndex: 'name', key: '2', width: 200},
                                                {title: '部门编码', dataIndex: 'code', key: '1', width: 200}
                                            ],
                                            dataSource: {
                                                type: 'api',
                                                method: 'post',
                                                url: '/sm/department/queryFindBack.action',
                                                bodyExpression: `
                                                    resolveFetch({fetch: {id: "DepartmentForm", data: "@@formValues"}}).then(function (data) {
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
                                        pageId: 'smDepartmentGidFindBackTablePage',
                                        displayField: "name",
                                        valueField: {
                                            "from": "gid",
                                            "to": "smDepartmentGid"
                                        }
                                    }} component={FindbackField} name="smDepartmentGid"/>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

DepartmentPage.propTypes = {
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
    form: "DepartmentForm",
    validate
})(DepartmentPage)

export default connect(mapStateToProps, mapDispatchToProps)(Form);
