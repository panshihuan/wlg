/*
 *
 *Role Modify
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import pubsub from 'pubsub-js'
import Immutable from 'immutable'

import TextField from 'components/Form/TextField'
import RadiosField from 'components/Form/RadiosField'
import AutoCompleteField from 'components/Form/AutoCompleteField'
import CheckBoxField from 'components/Form/CheckBoxField'
import DateField from 'components/Form/DateField'
import InputNumberField from 'components/Form/InputNumberField'
import SelectField from 'components/Form/SelectField'
import SwitchField from 'components/Form/SwitchField'
import TableField from 'components/Form/TableField'
import TextAreaField from 'components/Form/TextAreaField'
import UploadField from 'components/Form/UploadField'
import AppButton from "components/AppButton"
import FindbackField from 'components/Form/FindbackField'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'

const validate = values => {
    const errors = {}
    if (!values.get('roleCode')) {
        errors.code = '必填项'
    }
    if (!values.get('roleName')) {
        errors.code = '必填项'
    }
    return errors
}


class Modify extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    id = "";
    constructor(props) {
        super(props);
        debugger
        pubsub.subscribe("planNum2.onChange", (name, payload) => {
            pubsub.publish("@@form.change", { id: "modify", name: "actualQty", value: payload })
        })
        let modifyId = this.props.location.state[0].gid;
        let modifyData = this.props.location.state[0]
        this.id=modifyId;
        pubsub.publish("@@form.init", { id: "modify", data: Immutable.fromJS(modifyData) })
    }

    componentWillMount() {
    }
    componentDidMount() {

    }
    componentWillUnmount() {
    }
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb" separator=">">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>角色管理</Breadcrumb.Item>
                    <Breadcrumb.Item>修改</Breadcrumb.Item>
                </Breadcrumb>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col>
                            <AppButton config={{
                                id: "RoleSaveBtn",
                                title: "保存",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "RoleSaveBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/role/modify.action?id="+this.id,
                                                    withForm: "modify",
                                                },
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        payload: {
                                                            url: "/role"
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
                                                    }
                                                ]
                                            }
                                        ],
                                    }
                                ]
                            }}></AppButton>
                            <AppButton config={{
                                id: "RoleCancelBtn",
                                title: "取消",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "RoleCancelBtn.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "/role"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }}></AppButton>
                        </Col>
                    </Row>
                </Card>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                form: "modify",
                                enabled: true,
                                id: "roleCode",
                                label: "角色编码",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入编码"
                            }} component={TextField} name="roleCode" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                form: "modify",
                                id: "roleName",
                                label: "角色名称",
                                placeholder: "请输入名称",
                                showRequiredStar: true,
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="roleName" />
                        </Col>

                    </Row>
                </Card>

            </div>
        );
    }
}

Modify.propTypes = {
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


let ModifyForm = reduxForm({
    form: "modify",
    validate,
    initialValues: Immutable.fromJS({ "orderType": "正常" })
})(Modify)

export default connect(mapStateToProps, mapDispatchToProps)(ModifyForm);
