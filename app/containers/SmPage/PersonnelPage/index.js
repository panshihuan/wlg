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
import AppTable from 'components/AppTable';
import TreeSelectField from 'components/Form/TreeSelectField';


export class PersonnelPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <div>
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item>部门管理</Breadcrumb.Item>
                </Breadcrumb>

                <Row>
                    <Col span={6}>
                        <Card bordered={true}
                              style={{width: "100%", marginRight: "20px", marginTop: "20px", minHeight: "710px"}}
                              bodyStyle={{padding: "15px"}}>
                            <Row>
                                <Field config={{
                                    enabled: true,
                                    id: "busiUnit",
                                    form: "PersonnelForm",
                                    label: "业务单元",  //标签名称
                                    labelSpan: 8,   //标签栅格比例（0-24）
                                    wrapperSpan: 16,  //输入框栅格比例（0-24）
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
                                                    //console.log(me)
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
                                                                console.log("业务单元未选择");
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
                                    search: true,
                                    enabled: true,
                                    visible: true,
                                    checkable: false,
                                    showLine: false,
                                    draggable: false,
                                    onLoadData: false,
                                    searchBoxWidth: 200,
                                    dataSource: {
                                        type: "api",
                                        method: "POST",
                                        url: '/sm/department/queryTree.action'
                                    }
                                }} name="departmentTree" component={TreeField}/>
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
                                                    event: "@@navigator.push",
                                                    payload: {
                                                        url: "personnel/create"
                                                    }
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
                                            event: 'personnelTable.onSelectedRows',
                                            pubs: [
                                                {
                                                    //eventPayloadExpression: `console.log("ddddd")`,
                                                    event: 'modifyBtn.enabled',
                                                    payload: true
                                                }
                                            ]
                                        },
                                        {
                                            event: 'personnelTable.onSelectedRowsClear',
                                            pubs: [
                                                {
                                                    event: 'modifyBtn.enabled',
                                                    payload: false
                                                }
                                            ]
                                        },
                                        {
                                            event: "modifyBtn.click",
                                            behaviors: [
                                                {
                                                    type: "fetch",
                                                    id: "personnelTable", //要从哪个组件获取数据
                                                    data: "selectedRows",//要从哪个组件的什么属性获取数据
                                                    successPubs: [  //获取数据完成后要发送的事件
                                                        {
                                                            event: "@@navigator.push",
                                                            mode: "payload&&eventPayload",
                                                            payload: {
                                                                url: "personnel/modify"
                                                            }
                                                        }
                                                    ]
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
                                            event: 'personnelTable.onSelectedRows',
                                            pubs: [
                                                {

                                                    event: 'delBtn.enabled',
                                                    payload: true
                                                }
                                            ]
                                        },
                                        {
                                            event: 'personnelTable.onSelectedRowsClear',
                                            pubs: [
                                                {
                                                    event: 'delBtn.enabled',
                                                    payload: false
                                                }
                                            ]
                                        },
                                        {

                                            event: 'delBtn.click',
                                            pubs:
                                                [
                                                    {
                                                        event: "delBtn.expression",
                                                        meta: {
                                                            expression: `
                                                                            //console.log(dataContext,"abc");
                                                                            if(dataContext){
                                                                                let dataSource = {
                                                                                    type: "api",
                                                                                    method: "POST",
                                                                                    url: "/sm/personnel/delete.action?id=" + dataContext
                                                                                };
                                                                                //回调函数
                                                                                let callBack = function (response) {
                                                                                    if (response.success) {
                                                                                        pubsub.publish("@@message.success", "删除成功");
                                                                                        pubsub.publish("personnelTable.loadData");
                                                                                    } else {
                                                                                        pubsub.publish("@@message.error", response.data);
                                                                                    }
                                                                                }
                                                                                resolveDataSourceCallback({dataSource: dataSource, eventPayload: {}, dataContext: {}}, callBack);

                                                                            }
                                                                        `
                                                        }
                                                    }
                                                ]

                                        }

                                    ]
                                }}>
                                </AppButton>
                            </Row>
                            <Row>
                            </Row>
                            <Row>
                                <AppTable name="personnelTable" config={{
                                    "id": "personnelTable",
                                    "name": "personnelTable",
                                    "type": "radio",//表格单选复选类型
                                    "size": "default",//表格尺寸
                                    "rowKey": "gid",//主键
                                    "onLoadData": true,//初始化是否加载数据
                                    "tableTitle": "",//表头信息
                                    "width": 600,//表格宽度
                                    "showSerial": false,//是否显示序号
                                    "editType": false,//是否增加编辑列
                                    "page": 1,//当前页
                                    "pageSize": 10,//一页多少条
                                    "isPager": true,//是否分页
                                    "isSearch": false,//是否显示模糊查询
                                    "columns": [
                                        {title: '序号', width: 30, dataIndex: 'seq', key: '1'},
                                        {title: '人员代码', width: 100, dataIndex: 'personnelCode', key: '2'},
                                        {title: '人员名称', width: 100, dataIndex: 'personnelName', key: '3'},
                                        {
                                            title: '人员分类',
                                            width: 100,
                                            dataIndex: 'smPersonnelTypePostGidRef.personnelTypeName',
                                            key: '4'
                                        },
                                        {title: '所属部门', dataIndex: 'smDepartmentGidRef.name', key: '5', width: 100},
                                        {
                                            title: '业务单元',
                                            dataIndex: 'smBusiUnitGidRef.busiUnitName',
                                            key: '6',
                                            width: 100
                                        }
                                    ],
                                    dataSource: {
                                        type: 'api',
                                        method: 'post',
                                        pager: false,
                                        url: '/sm/personnel/query.action'
                                    }, subscribes: [
                                        {

                                            event: 'departmentTree.onSelect',
                                            pubs: [
                                                {
                                                    event: "personnelTable.expression",
                                                    meta: {
                                                        expression: `
                                                        let id = data.eventPayload.selectedKeys[0];
                                                        if(id!='0'){
                                                            let params = {
                                                                "pager": {
                                                                    "page": 1,
                                                                    "pageSize": 10
                                                                },
                                                                "query": {
                                                                    "query": [
                                                                        {
                                                                            "field": "smDepartmentGid",
                                                                            "type": "eq",
                                                                            "value":id
                                                                        }
                                                                    ]
                                                                },
                                                                "sorted":"seq"
                                                            };
                                                            //console.log(params);
                                                            pubsub.publish("personnelTable.loadData",params);


                                                        }else{
                                                             resolveFetch({fetch: {id: "PersonnelForm", data: "@@formValues"}}).then(function (data) {
                                                                let id='';
                                                                if(data&&data.busiUnit){
                                                                    id=data.busiUnit
                                                                }
                                                                //console.log(id);
                                                                let params = {
                                                                    "pager": {
                                                                        "page": 1,
                                                                        "pageSize": 10
                                                                    },
                                                                    "query": {
                                                                        "query": [
                                                                            {
                                                                                "field": "smBusiUnitGid",
                                                                                "type": "eq",
                                                                                "value":id
                                                                            }
                                                                        ]
                                                                    },
                                                                    "sorted":"seq"
                                                                };
                                                                //console.log(params);
                                                                pubsub.publish("personnelTable.loadData",params);

                                                            })


                                                        }

                                                    `
                                                    }
                                                }
                                            ]

                                        },
                                        {

                                            event: 'personnelTable.onSelectedRows',
                                            pubs:
                                                [
                                                    {
                                                        event: "delBtn.expression",
                                                        meta: {
                                                            expression: `
                                                                            //console.log(data.eventPayload[0].gid);
                                                                            pubsub.publish("delBtn.dataContext",{eventPayload:data.eventPayload[0].gid});
                                                                        `
                                                        }
                                                    }
                                                ]

                                        }
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

PersonnelPage.propTypes = {
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
    form: "PersonnelForm"
})(PersonnelPage)

export default connect(mapStateToProps, mapDispatchToProps)(Form);
