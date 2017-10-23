import React, { PropTypes } from 'react';
import { Breadcrumb, Row, Card, Col, Tabs } from 'antd';
import pubsub from 'pubsub-js'
import { Link } from 'react-router';
import AppTable from 'components/AppTable';
import AppButton from 'components/AppButton'
import InputNumberField from 'components/Form/InputNumberField'
import {reduxForm, Field, FieldArray} from 'redux-form/immutable';
import NavTreeField from 'components/NavTree'
import uuid from 'uuid/v4'
import TreeField from 'components/Form/TreeField'

export class RoleBusiGroupModal extends React.PureComponent {

    constructor(props) {
        super(props);
        debugger
        this.id = this.props.roleGid
        //console.log("roleGid",this.id)


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
                <Card bordered={true}>
                    <AppTable name="UnAssociatedBusiTable" config={{
                        "id": "UnAssociatedBusiTable",
                        "name": "UnAssociatedBusiTable",
                        "type": "checkbox",//表格单选复选类型
                        "size": "default",//表格尺寸
                        "rowKey": "gid",//主键
                        "onLoadData": true,//初始化是否加载数据
                        "tableTitle": "未关联业务单元列表",//表头信息
                        "width": 900,//表格宽度
                        "showSerial": true,//是否显示序号
                        "editType": false,//是否增加编辑列
                        "page": 1,//当前页
                        "pageSize": 10,//一页多少条
                        "isPager": true,//是否分页
                        "isSearch": true,//是否显示模糊查询
                        "columns": [
                            { title: '组织编号', width: 100, dataIndex: 'busiUnitCode', key: '1' },
                            { title: '组织名称', width: 100, dataIndex: 'busiUnitName', key: '2' },

                        ],
                        dataSource: {
                            type: 'api',
                            method: 'post',
                            url: '/sm/busiUnit/query.action',
                            bodyExpression:`
                                resolveFetch({
                                fetch:{
                                id: "RoleBusiUnitTable",
                                data: "state"
                                }
                               }).then(function (data) {
                                   console.log("data",data)
                                   let busiUnitIds='';
                                   for(var i = 0; i<data.dataSource.length;i++){
                                       busiUnitIds+=data.dataSource[i]["smBusiUnitGid"]+',';
                                   }
                                    console.log("busiUnitIds",busiUnitIds)
                                    var condition= {
                                                "query": {
                                                    "query": [
                                                        {
                                                             "field": "gid",
                                                             "type": "NOIN",
                                                             "value": busiUnitIds
                                                        }
                                                    ]
                                                }
                                            }

                                    callback(condition)
                              })
                            `
                        },
                        subscribes: [
                            {
                                event: "UnAssociatedBusiTable.onSelectedRows",
                                pubs: [
                                    {
                                        event: "UnAssociatedBusiTable.expression",
                                        meta:{
                                            expression:`
                                              console.log(me)
                                              let selectedRowsKey = [];
                                               let rows =me.selectedRows||[];
                                              for(var i = 0; i<rows.length;i++){
                                                selectedRowsKey.push(rows[i]["gid"]);
                                              }
                                               //传递给"新增"按钮的信息
                                          pubsub.publish("BusiUnitConfirmBtn.dataContext",{
                                              eventPayload:selectedRowsKey
                                          });
                                        `
                                        }
                                    }
                                ]
                            }
                        ]
                    }} />
                </Card>

                <Card bordered={true} style={{ "marginBottom": "10px", "backgroundColor": "rgba(247, 247, 247, 1)", "height": "52px" }}
                      bodyStyle={{ "paddingTop": "10px", "paddingBottom": "10px", "paddingLeft": "25px", "paddingRight": "25px" }}>
                    <Row>


                        <Col span={14} xs={24} offset={20}>
                            <AppButton config={{
                                id: "BusiUnitConfirmBtn",
                                title: "确认",
                                type: "primary",
                                size: "large",
                                visible: true,
                                enabled: false,
                                subscribes: [
                                    {
                                        event: "UnAssociatedBusiTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "BusiUnitConfirmBtn.enabled",
                                                payload: true
                                            }
                                        ]
                                    },
                                    {
                                        event: "UnAssociatedBusiTable.onSelectedRowsClear",
                                        pubs: [
                                            {
                                                event: "BusiUnitConfirmBtn.enabled",
                                                payload: false
                                            }
                                        ]
                                    },
                                    {
                                        event: "UnAssociatedBusiTable.onSelectedRows",
                                        pubs: [
                                            {
                                                event: "BusiUnitConfirmBtn.dataContext"
                                            }
                                        ]
                                    },
                                    {
                                        event: "BusiUnitConfirmBtn.click",
                                        behaviors: [
                                            {
                                                type: "request",
                                                dataSource: {
                                                    type: "api",
                                                    method: "POST",
                                                    url: "/sm/busiUnitRole/addList.action",
                                                    bodyExpression: `
                                                            let id = "${this.id}"
                                                            console.log("id",id)
                                                            resolveFetch({
                                                                    fetch:{
                                                                    id:"BusiUnitConfirmBtn",
                                                                    data:"dataContext"
                                                                    }
                                                              }).then(function (data) {
                                                                    console.log("date",data)
                                                                    callback([{smRoleGid:id,smBusiUnitGid:data[0]}])
                                                              })

                                                    `//rows[0]["gid"]
                                                },

                                                successPubs: [
                                                    {
                                                        event: "@@message.success",
                                                        payload: "操作成功"
                                                    },
                                                    {
                                                        event: "RoleBusiUnitTable.loadData"
                                                    },
                                                    {
                                                        event: "roleBusiGroupModal.onCancel"
                                                    }
                                                ],
                                                errorPubs: [
                                                    {
                                                        event: "@@message.error",
                                                        payload: "操作失败"
                                                    },
                                                    {
                                                        event: "roleBusiGroupModal.onCancel"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}>
                            </AppButton>

                            <AppButton config={{
                                id: "RoleBusiGroupAdd-Cancel",
                                title: "取消",
                                type:"default",
                                size:"large",
                                visible: true,
                                enabled: true,
                                subscribes: [
                                    {
                                        event: "RoleBusiGroupAdd-Cancel.click",
                                        pubs:[{
                                            event: "roleBusiGroupModal.onCancel",
                                        }]
                                    }
                                ]
                            }} />
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}



RoleBusiGroupModal.propTypes = {

};

export  default  RoleBusiGroupModal;