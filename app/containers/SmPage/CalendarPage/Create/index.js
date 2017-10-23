/*
 *
 * Calendar Create
 *日历创建页面
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import { Link } from 'react-router';
import pubsub from 'pubsub-js'
import { fromJS } from "immutable"

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
    if (!values.get('calendarName')) {
        errors.code = '必填项'
    }
    if (!values.get('calendarCode')) {
        errors.code = '必填项'
    }
    return errors
}


class CalendarCreatePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
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
                    <Breadcrumb.Item>日历</Breadcrumb.Item>
                    <Breadcrumb.Item>新增日历</Breadcrumb.Item>
                </Breadcrumb>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col>
                            <AppButton config={{
                                id: "CalendarSaveBtn",
                                title: "保存",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "CalendarSaveBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/calendar/add.action",
                                                    withForm: "CalendarAddForm",
                                                },
                                                successPubs: [  //获取数据完成后要发送的事件
                                                    {
                                                        event: "@@navigator.push",
                                                        payload: {
                                                            url: "/calendar"
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
                                                    }
                                                ]
                                            }
                                        ],
                                        
                                    }
                                ]
                            }}></AppButton>


                            <AppButton config={{
                                id: "CalendarCancelBtn",
                                title: "取消",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "CalendarCancelBtn.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "/calendar"
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
                                form: "CalendarAddForm",
                                enabled: true,
                                id: "calendarCode",
                                label: "日历编码",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入编码"
                            }} component={TextField} name="calendarCode" />
                        </Col>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                form: "CalendarAddForm",
                                id: "calendarName",
                                label: "日历名称",
                                placeholder: "请输入名称",
                                showRequiredStar: true,
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                            }} component={TextField} name="calendarName" />
                        </Col>

                    </Row>
                    <Row>
                        <Col span={6}>
                            <Field config={{
                                enabled: true,
                                id: "smBusiunitGid",
                                form: "CalendarAddForm",
                                label: "业务单元",  //标签名称
                                labelSpan: 8,   //标签栅格比例（0-24）
                                wrapperSpan: 16,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请选择业务单元",
                                tableInfo: {
                                    id: "smBusiunitGidFindBackTableInCalendarCreatPage",
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
                                pageId: 'smBusiunitGidFindBackTablePageInCalendarCreatPage',
                                displayField: "busiUnitName",
                                valueField: {
                                    "from": "gid",
                                    "to": "smBusiunitGid"
                                }
                            }} component={FindbackField} name="smBusiunitGid"/>
                        </Col>
                    </Row>
                </Card>

            </div>
        );
    }
}

CalendarCreatePage.propTypes = {
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



let Form = reduxForm({
    form: "CalendarAddForm",
    validate,
})(CalendarCreatePage)

export default connect(mapStateToProps, mapDispatchToProps)(Form);
