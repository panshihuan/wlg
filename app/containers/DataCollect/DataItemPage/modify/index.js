import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Row, Col } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import {reduxForm, Field, FieldArray} from 'redux-form/immutable'
import AppTable from 'components/AppTable';
import DropdownButton from 'components/DropdownButton';
import AppButton from 'components/AppButton';
import ModalContainer from 'components/ModalContainer'
import TreeField from 'components/Form/TreeField';
import AutoCompleteField from 'components/Form/AutoCompleteField';

import TextField from 'components/Form/TextField'
import DateField from 'components/Form/DateField'
import FindbackField from 'components/Form/FindbackField'
import SwitchField from 'components/Form/SwitchField'
import TextAreaField from 'components/Form/TextAreaField'
import SelectField from 'components/Form/SelectField'
import TableField from 'components/Form/TableField'
import { resolveDataSource, publishEvents, resolveFetch } from 'utils/componentUtil'
import Immutable from 'immutable'

const validate = values => {
    const errors = {}
    if (!values.get('busiGroupCode')) {
        errors.busiGroupCode = '必填项'
    }
    return errors
}

export class DataItemPageModify extends React.PureComponent {

    //构造
    constructor(props) {
        super(props);
        let modifyId = this.props.location.state[0].gid;
       // console.log(123)

       let dataSource = {
            mode: "payload",
            type: "api",
            method: "POST",
            url: "/sm/dcDataItem/findById.action?id="+modifyId,
            payload: {
                id: modifyId
            }
        }

        resolveDataSource({dataSource}).then(function (data) {
            // pubsub.publish("@@form.change",  { id: "BusiGroupPage",name:"busiGroupName" ,value: "" })
            var modifyData = data.data;
            pubsub.publish("@@form.init", {id: "DataItemPageModify", data: Immutable.fromJS(modifyData)})
            //点击的ID
            pubsub.publish("@@form.change",  { id: "DataItemPageModify",name:"clickGid" ,value: modifyId })

            let dataSource2 = {
                type: 'api',
                method: 'post',
                mode:"payload",
                url: '/sm/dcDataItemParam/query.action',
                payload:{
                    "query": {
                        "query": [
                            {
                                "field": "dcDataItemGid",
                                "type": "eq",
                                "value": modifyId
                            }
                        ]
                    }
                }

            }

            resolveDataSource({
                dataSource: dataSource2
            }).then(function (data) {
                console.log(123)
                console.log(data)
                var modifyData = data.data
                pubsub.publish("@@form.change",  { id: "DataItemPageModify",name:"tableFiled121223" ,value: Immutable.fromJS(modifyData)})
                //pubsub.publish("@@form.init", {id: "DataItemPageModify", data: Immutable.fromJS(modifyData)})
            }.bind(this))
        });



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
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>采集项</Breadcrumb.Item>
                    <Breadcrumb.Item>修改采集项</Breadcrumb.Item>
                </Breadcrumb>
                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>
                        <Col span={12}>
                            <AppButton config={{
                                id: "save",
                                title: "保存",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "save.click",
                                        pubs: [
                                            {
                                                event: "save.expression",
                                                meta: {
                                                    expression:
                                                        `
                                                    console.log("dfgdfgdf123");
                                                    resolveFetch({fetch:{id:"DataItemPageModify",data:"@@formValues"}}).then(function (value) {

                                                                    console.log("vvvvvvvvvvvvvvvva")
                                                                   // console.log(value)

                                                                    var tabarr = value.tableFiled121223
                                                                    console.log(tabarr)

                                                                    let dataSource= {
                                                                      type: "api",
                                                                      method: "POST",
                                                                      url: "/sm/dcDataItem/modify.action?id="+value.clickGid
                                                                    };

                                                                    resolveDataSourceCallback(
                                                                        {
                                                                            dataSource:dataSource,eventPayload:value,dataContext:value
                                                                        },
                                                                      function(res){
                                                                        //me.setState({dataSource:res.data})
                                                                        console.log(res);
                                                                        console.log(res.data)
                                                                      },
                                                                      function(){
                                                                      }
                                                                    )

                                                                                if(typeof(tabarr) != "undefined"){

                                                                                       for(let i = 0;i < tabarr.length;i++){
                                                                                            let dataSource1= {
                                                                                          type: "api",
                                                                                          method: "POST",
                                                                                          url: "/sm/dcDataItemParam/modify.action?id="+tabarr[i].gid
                                                                                        };

                                                                                            resolveDataSourceCallback(
                                                                                                {
                                                                                                    dataSource:dataSource1,eventPayload:tabarr[i],dataContext:tabarr[i]
                                                                                                },
                                                                                              function(res){
                                                                                                //me.setState({dataSource:res.data})
                                                                                              },
                                                                                              function(){
                                                                                              }
                                                                                            )
                                                                                        }
                                                                                    }

                                                    });
                                                `
                                                }
                                            },
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "dataItem"
                                                }
                                            }

                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                            <AppButton config={{
                                id: "cancle",
                                title: "取消",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "cancle.click",
                                        pubs: [
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "dataItem"
                                                }
                                            }

                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 24 } >
                            <Card bordered={true} style={{ marginTop: "20px" }}>
                                <Row>
                                    <Col span={8}>
                                        <Field config={{
                                            enabled: true,
                                            id: "dcItemCode",
                                            label: "采集项编码",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            form: "DataItemPageModify",
                                            showRequiredStar: true,  //是否显示必填星号
                                            placeholder: "请输入编码"
                                        }} component={TextField} name="dcItemCode" />
                                    </Col>
                                    <Col span={8}>
                                        <Field config={{
                                            enabled: true,
                                            id: "dcItemName",
                                            label: "采集项名称",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            form: "DataItemPageModify",
                                            showRequiredStar: true,  //是否显示必填星号
                                            placeholder: "请输入编码"
                                        }} component={TextField} name="dcItemName" />
                                    </Col>
                                    <Col span={8}>
                                        <Field config={{
                                            enabled: true,
                                            id: "dcItemTypeGid",
                                            form: "DataItemPageModify",
                                            label: "采集项类型",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            showRequiredStar: true,  //是否显示必填星号
                                            placeholder: "请选择",
                                            dataSource: {
                                                type: "api",
                                                method: "post",
                                                url: "/sm/dictionaryEnumValue/query.action",
                                                mode: "payload",
                                                payload: {
                                                    "query": {
                                                        "query": [
                                                            { "field": "smDictionaryEnumGid", "type": "eq", "value": "59D717CD79AE12FDE055000000000001" }
                                                        ],
                                                        "sorted": "seq"
                                                    }
                                                },
                                            },
                                            displayField: "val",
                                            valueField: "gid",
                                        }} component={SelectField} name="dcItemTypeGid" />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <AppButton config={{
                            id: "btn55555",
                            title: "新增",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "btn55555.click",
                                    pubs: [
                                        {
                                            event: "tableFiled23434.addRow",
                                            /*eventPayloadExpression:`
                                                callback({text:45})
                                              `*/
                                        }
                                    ]
                                }
                            ]
                        }}
                        />
                        <FieldArray name="tableFiled121223" config={{
                            "id": "tableFiled23434",
                            "name": "tableFiled121223",
                            "form":"DataItemPageModify",

                            "addButton": false, //是否显示默认增行按钮
                            "showSelect":true, //是否显示选择框
                            "type":"checkbox", //表格单选（radio）复选（checkbox）类型
                            "unEditable":false, //初始化是否都不可编辑
                            "showRowDeleteButton": true,  //是否显示操作列
                            "columns": [
                                {
                                    "id": "dcParamCode",
                                    "type": "textField",
                                    "title": "参数编码",
                                    "name": "dcParamCode",

                                },
                                {
                                    "id": "dcParamValue",
                                    "type": "textField",
                                    "title": "参数值",
                                    "name": "dcParamValue",

                                }
                            ]
                        }} component={TableField}/>
                    </Row>
                </Card>
            </div>
        );
    }
}



DataItemPageModify.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
    form: "DataItemPageModify",
    validate,
})(DataItemPageModify)