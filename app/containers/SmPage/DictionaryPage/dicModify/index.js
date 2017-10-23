import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField'
import {resolveDataSource, publishEvents, resolveFetch,resolveDataSourceCallback} from 'utils/componentUtil'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import { fromJS } from 'immutable';
import Immutable from 'immutable'
import {Row, Col} from 'antd'
import TextField from 'components/Form/TextField'

export class DicModifyModal extends React.PureComponent {
    constructor(props) {
        super(props);
        resolveFetch({
            fetch: {
                id: "dic",
                data: "selectedRows"
            }
        }).then(function (rows) {
            debugger
            console.log(rows)
            pubsub.publish("@@form.init", {id: "DicModifyModal", data: rows[0]})
        })
    }

    componentWillMount() {
    }
    componentDidMount() {
        // pubsub.publish('orderRepealModal-table-11.laterData',{})
    }
    componentWillUnmount() {
    }
    componentWillReceiveProps(nextProps) {
    }
    render() {
        return (
            <form>
                <Row>
                    <Col span={12}>
                        <Field config={{
                            enabled: true,
                            id: "code",
                            label: "字典",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            form: "DicModifyModal",
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入编码"
                        }} component={TextField} name="code" />
                    </Col>
                    <Col span={12}>
                        <Field config={{
                            enabled: true,
                            id: "name",
                            label: "字典名称",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            form: "DicModifyModal",
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入名称"
                        }} component={TextField} name="name" />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Field config={{
                            enabled: true,
                            id: "description",
                            label: "说明",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            form: "DicModifyModal",
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入说明"
                        }} component={TextField} name="description" />
                    </Col>
                </Row>
                <Row>
                    <Col span={6} offset={20}>
                        {/*取消按钮*/}
                        <AppButton config={{
                            id: "orderRepealModal-btn-3",
                            title: "取消",
                            type:"default",
                            size:"large",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "orderRepealModal-btn-3.click",
                                    pubs:[{
                                        event: "modifyDicPage.onCancel",
                                    }]
                                }
                            ]
                        }} />

                        {/*确定按钮*/}
                        <AppButton config={{
                            id: "orderRepealModal-btn-2",
                            title: "确定",
                            type:"primary",
                            size:"large",
                            visible: true,
                            enabled: true,
                            subscribes: [
                                {
                                    event: "orderRepealModal-btn-2.click",
                                    pubs:[
                                        {
                                            event: "orderRepealModal-btn-2.expression",
                                            meta: {
                                                expression:
                                                    `
                                                    console.log("删除111222");
                                                    resolveFetch({fetch:{id:"DicModifyModal",data:"@@formValues"}}).then(function (value) {
                                                        // console.log(value);
                                                        let formValue = {code:value.code,name:value.name,description:value.description}
                                                       //let params = {}

                                                        let dataSource= {
                                                          type: "api",
                                                          method: "POST",
                                                          url: "/sm/dictionaryEnum/modify.action?id="+value.gid
                                                        };

                                                        resolveDataSourceCallback(
                                                            {
                                                                dataSource:dataSource,eventPayload:formValue,dataContext:formValue
                                                            },
                                                          function(res){
                                                            //me.setState({dataSource:res.data})
                                                          },
                                                          function(){
                                                          }
                                                         )
                                                    });
                                                `
                                            }
                                        },
                                        {
                                            event: "dic.loadData",
                                        },
                                        {
                                        event: "modifyDicPage.onCancel",
                                        }
                                    ]
                                }
                            ]

                        }} />


                    </Col>
                </Row>
            </form>
        );
    }
}

DicModifyModal.propTypes = {

};

export default  reduxForm({
    form: "DicModifyModal",
})(DicModifyModal);

