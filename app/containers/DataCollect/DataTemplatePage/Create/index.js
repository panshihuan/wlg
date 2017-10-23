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

const validate = values => {
    const errors = {}
    if (!values.get('busiGroupCode')) {
        errors.busiGroupCode = '必填项'
    }
    return errors
}

export class DataTemplatePageCreate extends React.PureComponent {

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
                    <Breadcrumb.Item>业务建模</Breadcrumb.Item>
                    <Breadcrumb.Item>采集模板</Breadcrumb.Item>
                    <Breadcrumb.Item>新增采集模板</Breadcrumb.Item>
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
                                                    console.log("删除");
                                                    resolveFetch({fetch:{id:"DataTemplatePageCreate",data:"@@formValues"}}).then(function (value) {

                                                                    tabarr = value.tableFiled121223
                                                                    //刷新表格
                                                                   let params = {
                                                                    }

                                                                    let dataSource= {
                                                                      type: "api",
                                                                      method: "POST",
                                                                      url: "/sm/dcDataTemplate/add.action"
                                                                    };

                                                                    resolveDataSourceCallback(
                                                                        {
                                                                            dataSource:dataSource,eventPayload:value,dataContext:value
                                                                        },
                                                                      function(res1){
                                                                        //me.setState({dataSource:res.data})
                                                                        console.log(res1.data)
                                                                              let dataSource1= {
                                                                                  type: "api",
                                                                                  method: "POST",
                                                                                  url: "/sm/dcDataTemplateDetail/add.action"
                                                                                };
                                                                                for(let i = 0;i < tabarr.length;i++){
                                                                                    tabarr[i].dcDataTemplateGid = res1.data
                                                                                    console.log(tabarr[i])
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
                                                                      },
                                                                      function(){
                                                                      }
                                                                    )

                                                        });
                                                `
                                                }
                                            },
                                            {
                                                event: "@@navigator.push",
                                                payload: {
                                                    url: "dataTemplate"
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
                                                    url: "dataTemplate"
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
                                    <Col span={6}>
                                        <Field config={{
                                            enabled: true,
                                            id: "dcTemplateCode",
                                            label: "模板编号",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            form: "DataTemplatePageCreate",
                                            showRequiredStar: true,  //是否显示必填星号
                                            placeholder: "请输入编码"
                                        }} component={TextField} name="dcTemplateCode" />
                                    </Col>
                                    <Col span={6}>
                                        <Field config={{
                                            enabled: true,
                                            id: "dcTemplateName",
                                            label: "模板名称",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            form: "DataTemplatePageCreate",
                                            showRequiredStar: true,  //是否显示必填星号
                                            placeholder: "请输入编码"
                                        }} component={TextField} name="dcTemplateName" />
                                    </Col>
                                    <Col span={6}>
                                        <Field config={{
                                            enabled: true,
                                            id: "templateStructureGid",
                                            label: "模板结构",  //标签名称
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
                                                            { "field": "smDictionaryEnumGid", "type": "eq", "value": "59FA4A90A70C0BF3E055000000000001" }
                                                        ],
                                                        "sorted": "seq"
                                                    }
                                                },
                                            },
                                            displayField: "val",
                                            valueField: "gid",
                                        }} component={SelectField} name="templateStructureGid" />
                                    </Col>
                                    <Col span={6}>
                                        <Field config={{
                                            enabled: true,
                                            id: "collectCount",
                                            label: "采集项数",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            form: "DataTemplatePageCreate",
                                            showRequiredStar: true,  //是否显示必填星号
                                            placeholder: "请输入编码"
                                        }} component={TextField} name="collectCount" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6}>
                                        <Field config={{
                                            enabled: true,
                                            id: "dcAdapaterGid",
                                            label: "适用对象",  //标签名称
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
                                                            { "field": "smDictionaryEnumGid", "type": "eq", "value": "59FB3EF6F6E00C3EE055000000000001" }
                                                        ],
                                                        "sorted": "seq"
                                                    }
                                                },
                                            },
                                            displayField: "val",
                                            valueField: "gid",
                                        }} component={SelectField} name="dcAdapaterGid" />
                                    </Col>
                                    <Col span={6}>
                                        <Field config={{
                                            enabled: true,
                                            id: "descript",
                                            label: "备注",  //标签名称
                                            labelSpan: 8,   //标签栅格比例（0-24）
                                            wrapperSpan: 16,  //输入框栅格比例（0-24）
                                            form: "DataTemplatePageCreate",
                                            showRequiredStar: true,  //是否显示必填星号
                                            placeholder: "请输入编码"
                                        }} component={TextField} name="descript" />
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
                                        "form":"DataTemplatePageCreate",
                                        "rowKey": "id",
                                        "addButton": false, //是否显示默认增行按钮
                                        "showSelect":true, //是否显示选择框
                                        "type":"checkbox", //表格单选（radio）复选（checkbox）类型
                                        "unEditable":false, //初始化是否都不可编辑
                                        "showRowDeleteButton": true,  //是否显示操作列
                                        "columns": [
                                            {
                                                "id": "dcDataItemGid",
                                                "type": "findbackField",
                                                "title": "采集项",
                                                "name": "dcDataItemGid",
                                                "form":"temitemdetailForm",
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'POST',
                                                    url: '/api/findback.json'
                                                },
                                                tableInfo: {
                                                    id:"temitemtable",
                                                    size:"small",
                                                    rowKey:"gid",
                                                    tableTitle:"采集项",
                                                    showSerial:true,  //序号
                                                    columns:[
                                                        { title: '采集项编码', width: 150, dataIndex: 'dcItemCode', key: '1' },
                                                        { title: '采集项名称', width: 150, dataIndex: 'dcItemName', key: '2' },
                                                        { title: '采集项类型', width: 150, dataIndex: 'dcItemTypeGid', key: '3' }
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/sm/dcDataItem/query.action',
                                                        payload: {name: "ewueiwue"}
                                                    }
                                                },
                                                pageId:'temitem',
                                                displayField: "dcItemName",
                                                valueField: {
                                                    "from": "gid",
                                                    "to": "findBack"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "dcItemCode",
                                                        "to": "dcItemCode"
                                                    },
                                                    {
                                                        "from": "dcItemName",
                                                        "to": "dcItemName"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "countUnitGid",
                                                "type": "findbackField",
                                                "title": "单位",
                                                "name": "countUnitGid",
                                                "form":"unitdetailForm",
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'POST',
                                                    url: '/api/findback.json'
                                                },
                                                tableInfo: {
                                                    id:"unittable",
                                                    size:"small",
                                                    rowKey:"gid",
                                                    tableTitle:"人员信息",
                                                    showSerial:true,  //序号
                                                    columns:[
                                                        {title: 'Full Name', width: 100, dataIndex: 'name', key: '1'},
                                                        {title: 'Age', width: 100, dataIndex: 'age', key: '2'},
                                                        {title: 'Column 1', dataIndex: 'address', key: '3', width: 150},
                                                        {title: 'Column 2', dataIndex: 'address', key: '4', width: 150},
                                                        {title: 'Column 3', dataIndex: 'address', key: '5', width: 150},
                                                        {title: 'Column 4', dataIndex: 'address', key: '6', width: 150},
                                                        {title: 'Column 5', dataIndex: 'address', key: '7', width: 150},
                                                        {title: 'Column 6', dataIndex: 'address', key: '8', width: 150},
                                                        {title: 'Column 7', dataIndex: 'address', key: '9', width: 150},
                                                        {title: 'Column 8', dataIndex: 'address', key: '10', width: 150}
                                                    ],
                                                    dataSource: {
                                                        type: 'api',
                                                        method: 'post',
                                                        url: '/api/table.json',
                                                        payload: {name: "ewueiwue"}
                                                    }
                                                },
                                                pageId:'unittable',
                                                displayField: "address",
                                                valueField: {
                                                    "from": "gid",
                                                    "to": "findBack"
                                                },
                                                associatedFields: [
                                                    {
                                                        "from": "name",
                                                        "to": "name"
                                                    },
                                                    {
                                                        "from": "address",
                                                        "to": "address"
                                                    }
                                                ]
                                            },
                                            {
                                                "id": "dcItemTypeGid",
                                                "type": "selectField",
                                                "enabled":true,
                                                "title": "采集类型",
                                                "name": "dcItemTypeGid",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/dictionaryEnumValue/query.action",
                                                    mode: "payload",
                                                    payload: {
                                                        "query": {
                                                            "query": [
                                                                { "field": "smDictionaryEnumGid", "type": "eq", "value": "59D717CD79AE12FDE055000000000001" }
                                                            ],
                                                            "sorted": "seq"
                                                        }
                                                    }
                                                },
                                                subscribes: [
                                                    {
                                                        event: "tableSelectFiled1.onChange",
                                                        pubs: [
                                                            {
                                                                event: "tableSelectFiled2.loadData"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                displayField: "val",
                                                valueField: "gid"
                                            },
                                            {
                                                "id": "collectTypeGid",
                                                "type": "selectField",
                                                "enabled":true,
                                                "title": "采集方式",
                                                "name": "collectTypeGid",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/dictionaryEnumValue/query.action",
                                                    mode: "payload",
                                                    payload: {
                                                        "query": {
                                                            "query": [
                                                                { "field": "smDictionaryEnumGid", "type": "eq", "value": "5A2761032CA53D21E055000000000001" }
                                                            ],
                                                            "sorted": "seq"
                                                        }
                                                    }
                                                },
                                                subscribes: [
                                                    {
                                                        event: "tableSelectFiled1.onChange",
                                                        pubs: [
                                                            {
                                                                event: "tableSelectFiled2.loadData"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                displayField: "val",
                                                valueField: "gid"
                                            },
                                            {
                                                "id": "collectFrequency",
                                                "type": "autoCompleteField",
                                                "title": "采集频率",
                                                "name": "collectFrequency",
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'get',
                                                    url: '/api/ddd.json'
                                                },
                                                displayField: "name",
                                                valueField: "id"
                                            },
                                            {
                                                "id": "storeTypeGid",
                                                "type": "selectField",
                                                "enabled":true,
                                                "title": "储存方式",
                                                "name": "storeTypeGid",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/dictionaryEnumValue/query.action",
                                                    mode: "payload",
                                                    payload: {
                                                        "query": {
                                                            "query": [
                                                                { "field": "smDictionaryEnumGid", "type": "eq", "value": "5A288BF855414A88E055000000000001" }
                                                            ],
                                                            "sorted": "seq"
                                                        }
                                                    }
                                                },
                                                subscribes: [
                                                    {
                                                        event: "tableSelectFiled1.onChange",
                                                        pubs: [
                                                            {
                                                                event: "tableSelectFiled2.loadData"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                displayField: "val",
                                                valueField: "gid"
                                            },
                                            {
                                                "id": "dcParamGid",
                                                "type": "autoCompleteField",
                                                "title": "参数值(定性)",
                                                "name": "dcParamGid",
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'get',
                                                    url: '/api/ddd.json'
                                                },
                                                displayField: "name",
                                                valueField: "id"
                                            },
                                            {
                                                "id": "standerValue",
                                                "type": "autoCompleteField",
                                                "title": "标准值",
                                                "name": "standerValue",
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'get',
                                                    url: '/api/ddd.json'
                                                },
                                                displayField: "name",
                                                valueField: "id"
                                            },
                                            {
                                                "id": "upperValue",
                                                "type": "autoCompleteField",
                                                "title": "上限值",
                                                "name": "upperValue",
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'get',
                                                    url: '/api/ddd.json'
                                                },
                                                displayField: "name",
                                                valueField: "id"
                                            },
                                            {
                                                "id": "upperOffsetValue",
                                                "type": "autoCompleteField",
                                                "title": "上偏差",
                                                "name": "upperOffsetValue",
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'get',
                                                    url: '/api/ddd.json'
                                                },
                                                displayField: "name",
                                                valueField: "id"
                                            },
                                            {
                                                "id": "lowerOffsetValue",
                                                "type": "autoCompleteField",
                                                "title": "下偏差",
                                                "name": "lowerOffsetValue",
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'get',
                                                    url: '/api/ddd.json'
                                                },
                                                displayField: "name",
                                                valueField: "id"
                                            },
                                            {
                                                "id": "averageValue",
                                                "type": "autoCompleteField",
                                                "title": "平均值",
                                                "name": "averageValue",
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'get',
                                                    url: '/api/ddd.json'
                                                },
                                                displayField: "name",
                                                valueField: "id"
                                            },
                                            {
                                                "id": "middleValue",
                                                "type": "autoCompleteField",
                                                "title": "中位数",
                                                "name": "middleValue",
                                                dataSource: {
                                                    type: 'api',
                                                    method: 'get',
                                                    url: '/api/ddd.json'
                                                },
                                                displayField: "name",
                                                valueField: "id"
                                            },
                                            {
                                                "id": "decideFuncId",
                                                "type": "selectField",
                                                "enabled":true,
                                                "title": "判断方法",
                                                "name": "decideFuncId",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/dictionaryEnumValue/query.action",
                                                    mode: "payload",
                                                    payload: {
                                                        "query": {
                                                            "query": [
                                                                { "field": "smDictionaryEnumGid", "type": "eq", "value": "5A288BF855444A88E055000000000001" }
                                                            ],
                                                            "sorted": "seq"
                                                        }
                                                    }
                                                },
                                                subscribes: [
                                                    {
                                                        event: "tableSelectFiled1.onChange",
                                                        pubs: [
                                                            {
                                                                event: "tableSelectFiled2.loadData"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                displayField: "val",
                                                valueField: "gid"
                                            },
                                            {
                                                "id": "decideValueId",
                                                "type": "selectField",
                                                "enabled":true,
                                                "title": "判定值",
                                                "name": "decideValueId",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/dictionaryEnumValue/query.action",
                                                    mode: "payload",
                                                    payload: {
                                                        "query": {
                                                            "query": [
                                                                { "field": "smDictionaryEnumGid", "type": "eq", "value": "5A288BF855464A88E055000000000001" }
                                                            ],
                                                            "sorted": "seq"
                                                        }
                                                    }
                                                },
                                                subscribes: [
                                                    {
                                                        event: "tableSelectFiled1.onChange",
                                                        pubs: [
                                                            {
                                                                event: "tableSelectFiled2.loadData"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                displayField: "val",
                                                valueField: "gid"
                                            },
                                        ],
                                        rowOperationItem: [
                                            {
                                                id: "testDelBtn",
                                                type: "linkButton",
                                                title: "删除",
                                                subscribes: [
                                                    {
                                                        event: "testDelBtn.click",
                                                        behaviors: [
                                                            {
                                                                type: "request",
                                                                dataSource: {
                                                                    type: "api",
                                                                    method: "POST",
                                                                    url: "/api/ddd.json",
                                                                    payloadMapping: [{
                                                                        from: "gid",
                                                                        to: "id"
                                                                    }]
                                                                },
                                                                successPubs: [
                                                                    {
                                                                        event: "1.enabled",
                                                                        payload: false
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }} component={TableField}/>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}



DataTemplatePageCreate.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default reduxForm({
    form: "DataTemplatePageCreate",
    validate,
})(DataTemplatePageCreate)