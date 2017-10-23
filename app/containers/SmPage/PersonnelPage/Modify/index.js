/*
 *
 * 业务单元修改页面
 *
 */

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Breadcrumb, Row, Card, Col, Tabs} from 'antd';
import {Link} from 'react-router';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'

import TextField from 'components/Form/TextField'
import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'
import {resolveDataSource, publishEvents, resolveFetch} from 'utils/componentUtil'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'

const validate = values => {
    const errors = {}
    if (!values.get('personnelCode')) {
        errors.personnelCode = '必填项'
    }
    if (!values.get('personnelName')) {
        errors.personnelName = '必填项'
    }
    return errors
}


class PersonnelModifyPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    id = "";
    modifyData = {};

    constructor(props) {
        super(props);
        pubsub.subscribe("planNum2.onChange", (name, payload) => {
            pubsub.publish("@@form.change", {id: "PersonnelForm", name: "actualQty", value: payload})
        })
        debugger
        let modifyId = this.props.location.state[0].gid;
        this.id = modifyId;
        this.modifyData = this.props.location.state[0];

        //表单初始化渲染
        pubsub.publish("@@form.init", {id: "PersonnelForm", data: Immutable.fromJS(this.modifyData)});


    }

    componentDidMount() {
        if (this.modifyData.smPersonnelTypePostGidRef) {
            //console.log(modifyData.smPersonnelTypePostGidRef.personnelTypeName);
            pubsub.publish("smPersonnelTypePostGid.setDisplayValue", this.modifyData.smPersonnelTypePostGidRef.personnelTypeName);
        }
        if (this.modifyData.smDepartmentGidRef) {
            //console.log(modifyData.smDepartmentGidRef.name);
            pubsub.publish("smDepartmentGid.setDisplayValue", this.modifyData.smDepartmentGidRef.name);
        }
    }


    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb" separator=">">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>人员</Breadcrumb.Item>
                    <Breadcrumb.Item>修改</Breadcrumb.Item>
                </Breadcrumb>
                <div className="wrapper">
                    <Card style={{width: "100%", backgroundColor: "#f9f9f9"}} bodyStyle={{padding: "15px"}}>
                        <Row>
                            <Col>
                                <AppButton config={{
                                    id: "saveBtn",
                                    title: "保存",
                                    visible: true,
                                    enabled: true,
                                    type: "primary",
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
                                                            url: "/sm/personnel/modify.action?id=" + this.id,
                                                            withForm: "PersonnelForm"
                                                        },
                                                        successPubs: [  //获取数据完成后要发送的事件
                                                            {
                                                                event: "@@message.success",
                                                                payload: "修改成功"
                                                            },
                                                            {
                                                                event: "@@navigator.push",
                                                                payload: {
                                                                    url: "/personnel"
                                                                }
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
                                }}></AppButton>
                                <AppButton config={{
                                    id: "cancelBtn",
                                    title: "取消",
                                    visible: true,
                                    enabled: true,
                                    type: "primary",
                                    subscribes: [
                                        {
                                            event: "cancelBtn.click",
                                            pubs: [
                                                {
                                                    event: "@@navigator.push",
                                                    payload: {
                                                        url: "/personnel"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }}></AppButton>
                            </Col>
                        </Row>
                    </Card>
                    <Card bordered={true} style={{marginTop: "20px"}}>
                        <Row>
                            <Col span={12}>
                                <Field config={{
                                    enabled: true,
                                    form: "PersonnelForm",
                                    id: "personnelCode",
                                    label: "人员编码",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                                    showRequiredStar: true,  //是否显示必填星号
                                    placeholder: "请输入编码"
                                }} component={TextField} name="personnelCode"/>
                            </Col>
                            <Col span={12}>
                                <Field config={{
                                    enabled: true,
                                    id: "personnelName",
                                    label: "人员名称",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                                    showRequiredStar: true,  //是否显示必填星号
                                    placeholder: "请输入人员名称"
                                }} component={TextField} name="personnelName"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Field config={{
                                    enabled: true,
                                    id: "smPersonnelTypePostGid",
                                    form: "PersonnelForm",
                                    label: "人员分类",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                                    showRequiredStar: false,  //是否显示必填星号
                                    placeholder: "请选择人员分类",
                                    tableInfo: {
                                        id: "smPersonnelTypePostGidFindBackTable",
                                        size: "small",
                                        rowKey: "gid",
                                        width: 500,
                                        tableTitle: "上级业务单元",
                                        columns: [
                                            {
                                                title: '人员分类名称',
                                                dataIndex: 'personnelTypeName',
                                                key: '2',
                                                width: 200
                                            },
                                            {
                                                title: '人员分类代码',
                                                dataIndex: 'personnelTypeCode',
                                                key: '1',
                                                width: 200
                                            }
                                        ],
                                        dataSource: {
                                            type: 'api',
                                            method: 'post',
                                            url: '/sm/personnelType/query.action',
                                        }
                                    },
                                    pageId: 'smPersonnelTypePostGidFindBackTablePage',
                                    displayField: "personnelTypeName",
                                    valueField: {
                                        "from": "gid",
                                        "to": "smPersonnelTypePostGid"
                                    }

                                }} component={FindbackField} name="smPersonnelTypePostGid"/>
                            </Col>

                            <Col span={12}>
                                <Field config={{
                                    enabled: true,
                                    id: "smDepartmentGid",
                                    form: "PersonnelForm",
                                    label: "部门",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                                    showRequiredStar: true,  //是否显示必填星号
                                    placeholder: "请选择部门",
                                    tableInfo: {
                                        id: "smDepartmentGidFindBackTable",
                                        size: "small",
                                        rowKey: "gid",
                                        width: 500,
                                        tableTitle: "部门",
                                        columns: [
                                            {
                                                title: '部门名称',
                                                dataIndex: 'name',
                                                key: '2',
                                                width: 200
                                            },
                                            {
                                                title: '部门编码',
                                                dataIndex: 'code',
                                                key: '1',
                                                width: 200
                                            }
                                        ],
                                        dataSource: {
                                            type: 'api',
                                            method: 'post',
                                            url: '/sm/department/query.action',
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

                </div>
            </div>
        );
    }
}


PersonnelModifyPage.propTypes = {
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
    form: "PersonnelForm",
    validate
})(PersonnelModifyPage)

export default connect(mapStateToProps, mapDispatchToProps)(Form);
