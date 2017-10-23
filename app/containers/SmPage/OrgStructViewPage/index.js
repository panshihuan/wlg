/*
 *
 * 组织结构视图
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
import AppTable from 'components/AppTable';
import SelectField from 'components/Form/SelectField';


export class OrgStructViewPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>组织结构视图</Breadcrumb.Item>
                </Breadcrumb>

                <Row>
                    <Col span={6}>
                        <Card bordered={true}
                              style={{width: "100%", marginRight: "20px", marginTop: "20px", minHeight: "710px"}}
                              bodyStyle={{padding: "15px"}}>
                            <Row>
                                <Field config={{
                                    id: "funcGid",
                                    label: "业务单元职能",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
                                    placeholder: "请选择",
                                    form: "Form",
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        mode: 'payload',
                                        url: '/sm/dictionaryEnumValue/query.action',
                                        payload: {
                                            "query": {
                                                "query": [{
                                                    "field": "smDictionaryEnumGid",
                                                    "type": "eq",
                                                    "value": "5625H5482846019FE055000000000001"
                                                }], "sorted": "seq"
                                            }
                                        }
                                    },
                                    displayField: "val",
                                    valueField: "gid",
                                    subscribes: [
                                        {
                                            event: "funcGid.onChange",
                                            pubs:
                                                [
                                                    {
                                                        event: "funcGid.expression",
                                                        meta: {
                                                            expression: `
                                                                        //console.log(data.eventPayload,"下拉框输出");
                                                                        if(data&&data.eventPayload){
                                                                            let dataSource = {
                                                                              type: "api",
                                                                              mode:"dataContext",
                                                                              method: "POST",
                                                                              url: "/sm/busiUnit/queryTreeByFunc.action?funcGid=" + data.eventPayload
                                                                            };

                                                                            let onSuccess = function(response){
                                                                                if(response.success){
                                                                                    //pubsub.publish("@@message.success","操作成功");
                                                                                    //console.log(response.data);
                                                                                    pubsub.publish("busiUnitTree.setTreeData",response.data);
                                                                                }else{
                                                                                    pubsub.publish("@@message.error",response.data);
                                                                                }
                                                                            }

                                                                            resolveDataSourceCallback({dataSource:dataSource,eventPayload:{},dataContext:{}},onSuccess);

                                                                            let params = {
                                                                                "pager": {
                                                                                    "page": 1,
                                                                                    "pageSize": 10
                                                                                },
                                                                                "query": {
                                                                                    "query": [
                                                                                        {
                                                                                            "field": "funcGid",
                                                                                            "type": "eq",
                                                                                            "value":data.eventPayload
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            };
                                                                            pubsub.publish("indexTable.loadData",params);

                                                                        }
                                                                        `
                                                        }
                                                    }
                                                ]
                                        }
                                    ]
                                }} component={SelectField} name="funcGid"/>
                            </Row>

                            <row>
                                <Field config={{
                                    id: 'busiUnitTree',
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
                                        url: '/sm/busiUnit/queryTreeByFunc.action.action'
                                    },
                                    subscribes: [
                                        {

                                            event: 'busiUnitTree.onSelect',
                                            pubs: [
                                                {
                                                    event: "busiUnitTree.expression",
                                                    meta: {
                                                        expression: `
                                                                    let id = data.eventPayload.selectedKeys[0];
                                                                    //console.log(id);
                                                                    resolveFetch({fetch:{id:"Form",data:"@@formValues"}}).then(function (value) {
                                                                        let funcGid = value.funcGid;
                                                                        let dataSource = {
                                                                            type: "api",
                                                                            method: "POST",
                                                                            url: "/sm/busiUnit/queryExecUnitTree.action?busiUnitGid=" + id +"&funcGid="+funcGid
                                                                        };
                                                                        //回调函数
                                                                        let callBack = function (response) {
                                                                            if (response.success) {
                                                                                //console.log(response.data);
                                                                                pubsub.publish("busiUnitTree.setTreeData",response.data);
                                                                            } else {
                                                                                pubsub.publish("@@message.error", response.data);
                                                                            }
                                                                        }
                                                                        resolveDataSourceCallback({dataSource: dataSource, eventPayload: {}, dataContext: {}}, callBack);


                                                                    });

                                                                    `
                                                    }
                                                }
                                            ]

                                        }
                                    ]
                                }} name="busiUnitTree" component={TreeField}/>
                            </row>
                        </Card>
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={17}>
                        <Card bordered={true}
                              style={{width: "100%", marginRight: "20px", marginTop: "20px", minHeight: "710px"}}
                              bodyStyle={{padding: "15px"}}>

                            <Row>
                                <AppTable name="indexTable" config={{
                                    "id": "indexTable",
                                    "name": "indexTable",
                                    "type": "radio",//表格单选复选类型
                                    "size": "default",//表格尺寸
                                    "rowKey": "gid",//主键
                                    "onLoadData": false,//初始化是否加载数据
                                    "tableTitle": "指标信息",//表头信息
                                    "width": 600,//表格宽度
                                    "showSerial": true,//是否显示序号
                                    "editType": false,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 10,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": false,//是否显示模糊查询
                                    "columns": [
                                        {title: '组织指标项', width: 100, dataIndex: 'indexName', key: '1'},
                                        {title: '指标代码', width: 100, dataIndex: 'indexCode', key: '2'},
                                        {title: '是否继承上级指标', dataIndex: 'isExtends', key: '3', width: 100,columnsType:{"type":"replace","text":{1:"是",0:"否"}}},
                                        {title: '指标值', width: 100, dataIndex: 'indexUrl', key: '4'},
                                        {title: '指标标识符', width: 100, dataIndex: 'indexKey', key: '5'},
                                        {title: '备注', width: 100, dataIndex: 'indexComment', key: '5'}
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        pager: false,
                                        url: '/sm/orgIndex/query.action'
                                    }, subscribes: [
                                    ]
                                }}/>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

OrgStructViewPage.propTypes = {
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
    form: "Form"
})(OrgStructViewPage)

export default connect(mapStateToProps, mapDispatchToProps)(Form);
