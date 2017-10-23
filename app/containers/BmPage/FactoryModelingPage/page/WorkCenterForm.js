/*
 *
 * 工作中心属性编辑表单
 *
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
import Immutable from 'immutable'
import { submit } from 'redux-form/immutable'


import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import { reduxForm, Field, FieldArray } from 'redux-form/immutable'


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

class WorkCenterEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
        // 初始化表格  //如果存在记录id值
    }

    // 获取表格数据
    getData(){
        // 获取本节点的数据
        let data =  mainLayerClass.currentTarget.getAttr('shapeData');
        // 所属工厂的名称
        let factoryName = this.props.factoryName
        data.factoryName = factoryName;

        if(data){
            pubsub.publish("@@form.init", { id: "WorkCenterEdit", data: Immutable.fromJS(mainLayerClass.currentTarget.getAttr('shapeData')) })
            pubsub.publish("workCenterEditFormSmCalendarGid.setDisplayValue",data.calendarName)
        }
    }

    // 保存表单数据
    save(){
       // 表单验证
        window.store.dispatch(submit('WorkCenterEdit'));
        let currentForm=window.store.getState().get("form").get('WorkCenterEdit');

        let error=false;
        if(currentForm!=undefined)
        {
            if(currentForm.get('syncErrors')|| currentForm.get('asyncErrors'))
            {
                error=true
            }
        }
        if(!error){
            let currentData = currentForm.toJS().values;
            let group = mainLayerClass.currentTarget.findAncestor('.anchorGroup');
            mainLayerClass.currentTarget.setAttr('shapeData',currentData);
            // 改变文字
            bindEventCenter.reflashGroup(group);
            // 执行保存
            pubsub.publish('editFormModal.onCancel')
        }




        
    }



    // 更改组件的文描
    changeShapeTitle(obj){

    }

    // 每次挂载的时候加载
    componentWillMount() {
    }

    componentDidMount() {
        this.getData();
        // 保存按钮事件绑定
        pubsub.subscribe(`workCenterEditFormSaveButton.click`, (e, d) => {
            this.save();
        });

    }

    componentWillUnmount() {
        pubsub.unsubscribe(`workCenterEditFormSaveButton.click`)
    }


    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb" separator=">">
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>工厂</Breadcrumb.Item>
                    <Breadcrumb.Item>工作中心</Breadcrumb.Item>
                    <Breadcrumb.Item>编辑属性</Breadcrumb.Item>
                </Breadcrumb>
                <Card style={{ width: "100%", backgroundColor: "#f9f9f9", marginTop: "15px" }} bodyStyle={{ padding: "15px" }}>
                    <Row>
                        <Col span={8}>
                            <Field config={{
                                enabled: true,
                                id: "workCenterEditFormWorkCenterCode",
                                label: "工作中心编码",  //标签名称
                                labelSpan: 9,   //标签栅格比例（0-24）
                                wrapperSpan: 15,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入编码"
                            }} component={TextField} name="code" />
                        </Col>
                        <Col span={8}>
                            <Field config={{
                                enabled: true,
                                id: "workCenterEditFormWorkCenterName",
                                label: "工作中心名称",  //标签名称
                                labelSpan: 9,   //标签栅格比例（0-24）
                                wrapperSpan: 15,  //输入框栅格比例（0-24）
                                showRequiredStar: true,  //是否显示必填星号
                                placeholder: "请输入名称"
                            }} component={TextField} name="name" />
                        </Col>
                        <Col span={8}>
                            <Field config={{
                                enabled: false,
                                id: "workCenterEditFormFactoryName",
                                label: "所属工厂",  //标签名称
                                labelSpan: 9,   //标签栅格比例（0-24）
                                wrapperSpan: 15,  //输入框栅格比例（0-24）
                                //placeholder: "根据产品编码带出"
                            }} component={TextField} name="factoryName" />
                        </Col>

                        <Col span={8}>
                            <Field config={{
                                visible:false,
                                enabled: true,
                                id: "workCenterEditFormFactoryId",
                                label: "所属工厂编号",  //标签名称
                                labelSpan: 9,   //标签栅格比例（0-24）
                                wrapperSpan: 15,  //输入框栅格比例（0-24）
                                //placeholder: "根据产品编码带出"
                            }} component={TextField} name="smBusiUnitGid" />
                        </Col>

                    </Row>
                    <Row>
                        <Col span={8}>
                            <Field config={{
                                enabled: true,
                                id: "workCenterEditFormSmCalendarGid",
                                label: "工作日历",  //标签名称
                                labelSpan: 9,   //标签栅格比例（0-24）
                                wrapperSpan: 15,  //输入框栅格比例（0-24）
                                placeholder: "请选择工作日历",
                                tableInfo: {
                                    id: "workCenterEditFormSmCalendarSelectList",
                                    size: "small",
                                    rowKey: "gid",
                                    width: "500",
                                    tableTitle: "工作日历",
                                    columns: [
                                        {
                                            title: '日历编码',
                                            dataIndex: 'calendarCode',
                                            key: '1',
                                            width: 200
                                        },
                                        {
                                            title: '日历名称',
                                            dataIndex: 'calendarName',
                                            key: '2',
                                            width: 200
                                        }
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        url: '/sm/calendar/query.action'
                                    }
                                },
                                pageId: 'workCenterEditFormCalendarPage',
                                displayField: "calendarName",
                                valueField: {
                                    "from": "gid",
                                    "to": "smCalendarGid"
                                }
                            }} component={FindbackField} name="smCalendarGid" />
                        </Col>
                        <Col span={16}>
                            <Field config={{
                                enabled: true,
                                id: "workCenterEditFormRemarks",
                                label: "备注",  //标签名称
                                labelSpan: 4,   //标签栅格比例（0-24）
                                wrapperSpan: 20,  //输入框栅格比例（0-24）
                                showRequiredStar: false,  //是否显示必填星号
                                placeholder: "请输入备注"
                            }} component={TextField} name="remarks" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <AppButton config={{
                                id: "workCenterEditFormSaveButton",
                                title: "确定",
                                visible: true,
                                enabled: true,
                                type: "primary",
                            }}></AppButton>
                            <AppButton config={{
                                id: "workCenterEditFormCancelButton",
                                title: "取消",
                                visible: true,
                                enabled: true,
                                type: "primary",
                                subscribes: [
                                    {
                                        event: "workCenterEditFormCancelButton.click",
                                        pubs:[{
                                            event: "editFormModal.onCancel",
                                        }]
                                    }
                                ]
                            }}></AppButton>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}

WorkCenterEdit.propTypes = {
    dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        onSubmit:()=>{}
    };
}

let WorkCenterEditForm = reduxForm({
    form: "WorkCenterEdit",
    validate,
})(WorkCenterEdit)

export default connect(null, mapDispatchToProps)(WorkCenterEditForm);
