import React, { PropTypes } from 'react';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import {Row, Col} from 'antd'
import TextField from 'components/Form/TextField'
import {resolveDataSource, publishEvents, resolveFetch,resolveDataSourceCallback} from 'utils/componentUtil'


export class DicValueModifyModal extends React.PureComponent {
    constructor(props) {
        super(props);
        resolveFetch({
            fetch: {
                id: "dicvalue",
                data: "selectedRows"
            }
        }).then(function (rows) {
            debugger
            console.log("111333")
            console.log(rows)
            pubsub.publish("@@form.init", {id: "DicValueModifyModal", data: rows[0]})
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
                            label: "字典值编号111",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            form: "DicValueModifyModal",
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入编码"
                        }} component={TextField} name="code" />
                    </Col>
                    <Col span={12}>
                        <Field config={{
                            enabled: true,
                            id: "val",
                            label: "字典值名称",  //标签名称
                            labelSpan: 8,   //标签栅格比例（0-24）
                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                            form: "DicValueModifyModal",
                            showRequiredStar: true,  //是否显示必填星号
                            placeholder: "请输入名称"
                        }} component={TextField} name="val" />
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
                            form: "DicValueModifyModal",
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
                                        event: "modifyDicValuePage.onCancel",
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
                                            event: "dicvalue.expression",
                                            meta: {
                                                expression:
                                                    `
                                                    console.log("下表删除33333");
                                                    resolveFetch({fetch:{id:"DicValueModifyModal",data:"@@formValues"}}).then(function (value) {

                                                         console.log(value);
                                                        let formValue = {code:value.code,val:value.val,description:value.description}


                                                        let dataSource= {
                                                          type: "api",
                                                          method: "POST",
                                                          url: "/sm/dictionaryEnumValue/modify?id="+value.gid
                                                        };

                                                        resolveDataSourceCallback(
                                                            {
                                                                dataSource:dataSource,eventPayload:formValue,dataContext:formValue
                                                            },
                                                          function(res){
                                                                //刷新表格
                                                                    let params = {
                                                                      "query": {
                                                                        "query": [
                                                                           {
                                                                                "left":"(",
                                                                                "field":"smDictionaryEnumGid",
                                                                                "type":"eq",
                                                                                "value":value.smDictionaryEnumGid,
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
                                                                      mode:"dataContext",
                                                                      url: "/sm/dictionaryEnumValue/query"
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
                                                          },
                                                          function(){
                                                          }
                                                         )
                                                    });
                                                `
                                            }
                                        },
                                        {
                                            event: "modifyDicValuePage.onCancel",
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

DicValueModifyModal.propTypes = {

};

export default  reduxForm({
    form: "DicValueModifyModal",
})(DicValueModifyModal);

